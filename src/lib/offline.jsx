// ── Offline support: IndexedDB read-model cache + write outbox ──
//
// Two jobs:
//   1. Persist the loaded read-model (trips list + each trip's expenses /
//      members / docs / itinerary / settlements) to IndexedDB, so a cold
//      boot paints instantly from cache and the app stays viewable with
//      no signal (Supabase itself is network-only).
//   2. A write outbox: when an expense can't reach the server (offline),
//      it's queued in IndexedDB and replayed automatically on reconnect.
//
// Everything is wrapped so a blocked / unavailable IndexedDB (private
// mode, old browser) degrades to a no-op rather than breaking the app.

(function () {
  const DB_NAME = 'voyage-cache';
  const STORE = 'kv';
  let dbp = null;

  function db() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      let req;
      try { req = indexedDB.open(DB_NAME, 1); }
      catch (e) { reject(e); return; }
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }

  // Low-level KV (values are structured-cloned, no JSON needed).
  window.cacheGet = async (key) => {
    try {
      const d = await db();
      return await new Promise((res, rej) => {
        const tx = d.transaction(STORE, 'readonly');
        const r = tx.objectStore(STORE).get(key);
        r.onsuccess = () => res(r.result == null ? null : r.result);
        r.onerror = () => rej(r.error);
      });
    } catch (_) { return null; }
  };
  window.cachePut = async (key, value) => {
    try {
      const d = await db();
      await new Promise((res, rej) => {
        const tx = d.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(value, key);
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    } catch (_) { /* no-op */ }
  };
  window.cacheClearAll = async () => {
    try {
      const d = await db();
      await new Promise((res) => {
        const tx = d.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).clear();
        tx.oncomplete = () => res();
        tx.onerror = () => res();
      });
    } catch (_) {}
  };

  // ── Read-model snapshots ──────────────────────────────────
  window.cachePersistTrips = () => window.cachePut('trips', window.TRIPS || []);

  window.cachePersistTrip = (tripId) => {
    if (!tripId) return;
    window.cachePut('trip:' + tripId, {
      detail:      (window.TRIP && window.TRIP.id === tripId) ? window.TRIP : null,
      expenses:    window.EXPENSES || [],
      members:     window.MEMBERS || [],
      docs:        window.DOCS_BY_CAT || {},
      itinerary:   window.ITINERARY || [],
      settlements: window.SETTLEMENTS || [],
    });
  };

  // Seed the trips list from cache when we don't have it yet (cold boot /
  // offline). Returns true if it filled something.
  window.cacheHydrateTrips = async () => {
    if (window.TRIPS && window.TRIPS.length) return false;
    const t = await window.cacheGet('trips');
    if (Array.isArray(t) && t.length) { window.TRIPS = t; return true; }
    return false;
  };

  // Fill a trip's per-screen caches from IndexedDB, but ONLY the slices
  // that are currently empty — never clobber fresh in-memory data. Lets a
  // trip be viewed instantly / offline with its last-known contents while
  // the network refresh (if any) overwrites in the background.
  window.cacheHydrateTrip = async (tripId) => {
    if (!tripId) return false;
    const c = await window.cacheGet('trip:' + tripId);
    if (!c) return false;
    if (c.detail && (!window.TRIP || window.TRIP.id !== tripId)) window.TRIP = c.detail;
    if (!(window.EXPENSES || []).length && (c.expenses || []).length) window.EXPENSES = c.expenses;
    if (!(window.MEMBERS || []).length && (c.members || []).length) window.MEMBERS = c.members;
    const docsEmpty = !window.DOCS_BY_CAT || Object.values(window.DOCS_BY_CAT).every((a) => !a || !a.length);
    if (docsEmpty && c.docs) { window.DOCS_BY_CAT = c.docs; window.DOCS_TRIP_ID = tripId; }
    if (!(window.ITINERARY || []).length && (c.itinerary || []).length) window.ITINERARY = c.itinerary;
    if (!(window.SETTLEMENTS || []).length && (c.settlements || []).length) window.SETTLEMENTS = c.settlements;
    window.recomputeExpenseDerived?.(tripId);
    return true;
  };

  // ── Write outbox (expenses) ───────────────────────────────
  window.outboxEnqueue = async (item) => {
    const list = (await window.cacheGet('outbox')) || [];
    list.push({ ...item, queuedAt: Date.now() });
    await window.cachePut('outbox', list);
  };
  window.outboxCount = async () => ((await window.cacheGet('outbox')) || []).length;

  // Replay queued writes. Safe to call repeatedly; only runs when online
  // and signed in. Failed items stay queued for the next attempt.
  let replaying = false;
  window.replayOutbox = async () => {
    if (replaying) return;
    if (!navigator.onLine || !window.sb || !window.currentUserId) return;
    const list = (await window.cacheGet('outbox')) || [];
    if (!list.length) return;
    replaying = true;
    const remaining = [];
    const touchedTrips = new Set();
    for (const item of list) {
      try {
        if (item.type === 'expense' && typeof window.addExpense === 'function') {
          await window.addExpense(item.tripId, item.createdBy, item.payload);
          touchedTrips.add(item.tripId);
        } else {
          // Unknown item type — drop it rather than wedging the queue.
        }
      } catch (e) {
        remaining.push(item);   // keep for next reconnect
      }
    }
    await window.cachePut('outbox', remaining);
    replaying = false;
    const synced = list.length - remaining.length;
    if (synced > 0) {
      // Refresh the open trip so its real rows replace the pending ones.
      if (window.TRIP && touchedTrips.has(window.TRIP.id)) {
        try { await window.loadExpenses(window.TRIP.id); } catch (_) {}
      }
      window.notifyDataChange?.();
      window.toast?.(
        remaining.length === 0
          ? (window.isRTL ? 'تمت مزامنة تغييراتك دون اتصال' : 'Synced your offline changes')
          : (window.isRTL ? 'تمت مزامنة بعض التغييرات' : 'Synced some changes'),
        'success'
      );
    }
  };

  // Auto-replay when connectivity returns.
  window.addEventListener('online', () => { window.replayOutbox?.(); });
})();
