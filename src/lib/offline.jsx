// ── Offline: the app keeps working with no signal ──────────────────
//
// All of it is silent — nothing on screen ever says "offline", "sync" or
// "pending". With no signal the app simply behaves as it does online:
//
//   1. Snapshots. Every trip you open is kept on the phone (IndexedDB):
//      expenses (your personal ones too), members, documents, plan,
//      settlements, activity. A cold start with no signal paints all of it
//      from the last visit; the network refresh (when there is one) then
//      replaces it.
//   2. Outbox. Every expense you add / change / delete is applied on the
//      phone at once and queued. The queue goes up on its own whenever
//      there's a connection (at start, on reconnect, on returning to the
//      app). A new expense gets its real id on the phone, so later edits
//      and deletes never need the server first, and a retried upload can
//      never create a duplicate.
//   3. Files. A trip's documents (tickets, boarding passes, visas,
//      bookings), their covers and the receipts are downloaded to the
//      phone in the background while online and opened from there. They
//      live in Cache Storage under /__files/…, which the service worker
//      serves (so <img> / backgrounds work with no signal too).
//   4. Helpers: ids, network-error detection.
//
// Everything degrades to a no-op if IndexedDB / Cache Storage aren't
// available (private mode, old browser).

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
    dbp.catch(() => { dbp = null; });
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
    OUT = []; outReady = Promise.resolve();
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

  // ── Helpers ───────────────────────────────────────────────
  window.newId = () => {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (_) {}
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  };
  const msgOf = (e) => String((e && (e.message || e.error_description || e.msg || e.error)) || e || '');
  // A request that never reached the server (no signal, weak signal, a
  // timeout) — as opposed to the server saying no.
  window.isNetErr = (e) => {
    if (!e) return false;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
    const st = Number(e.status ?? e.statusCode);
    if (st === 0 || st === 408 || st === 425 || st === 429 || st === 502 || st === 503 || st === 504) return true;
    return /failed to fetch|load failed|networkerror|network request failed|network connection|internet connection|timed? ?out|aborted|offline|fetch failed/i.test(msgOf(e));
  };
  window.isAuthErr = (e) => {
    if (!e) return false;
    const st = Number(e.status ?? e.statusCode);
    return st === 401 || st === 403 || e.code === '42501' || e.code === 'PGRST301' || e.code === 'PGRST302'
      || /jwt|row-level security|permission denied/i.test(msgOf(e));
  };
  const isDup = (e) => !!e && (e.code === '23505' || /duplicate key/i.test(msgOf(e)));

  // A file's version on the server, from what its row knows about the last
  // upload (size + the link written at that upload). Changes whenever the
  // file is replaced, so the phone's copy is refreshed.
  window.fileVer = (size, stamp) => {
    const s = `${size == null ? '' : size}|${stamp || ''}`;
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(36);
  };

  // ── Read-model snapshots ──────────────────────────────────
  window.cachePersistTrips = () => window.cachePut('trips', window.TRIPS || []);
  window.cachePersistPrefs = () => window.cachePut('prefs', {
    currency: window.USER_DEFAULT_CURRENCY || null,
    account: window.ACCOUNT || null,
  });
  window.cacheHydratePrefs = async () => {
    const p = await window.cacheGet('prefs');
    if (!p) return;
    if (p.currency && !window.USER_DEFAULT_CURRENCY) window.USER_DEFAULT_CURRENCY = p.currency;
    if (p.account && !window.ACCOUNT) window.ACCOUNT = p.account;
  };
  window.cachePersistLifetime = () => { if (window.LIFETIME_STATS_LKG) window.cachePut('lifetime', window.LIFETIME_STATS_LKG); };
  window.cacheHydrateLifetime = async () => {
    if (window.LIFETIME_STATS_LKG) return;
    const s = await window.cacheGet('lifetime');
    if (s && !window.LIFETIME_STATS_LKG) window.LIFETIME_STATS_LKG = s;
  };

  // Only the trip that's actually in memory is written — a late load for a
  // trip you've already left must never be stored under the wrong id.
  // Documents are kept from the previous snapshot until this visit has
  // loaded its own.
  window.cachePersistTrip = async (tripId) => {
    if (!tripId || !window.TRIP || window.TRIP.id !== tripId) return;
    const snap = {
      v: 2, savedAt: Date.now(),
      detail: window.TRIP,
      expenses: window.EXPENSES || [],
      personal: window.MY_PERSONAL_EXPENSES || [],
      members: window.MEMBERS || [],
      itinerary: window.ITINERARY || [],
      settlements: window.SETTLEMENTS || [],
      audit: window.AUDIT || [],
    };
    if (window.DOCS_TRIP_ID === tripId) snap.docs = window.DOCS_BY_CAT || {};
    else {
      const prev = await window.cacheGet('trip:' + tripId);
      if (prev && prev.docs) snap.docs = prev.docs;
    }
    if (!window.TRIP || window.TRIP.id !== tripId) return;
    await window.cachePut('trip:' + tripId, snap);
  };

  // Seed the trips list from cache when we don't have it yet (cold boot /
  // offline). Returns true if it filled something.
  window.cacheHydrateTrips = async () => {
    if (window.TRIPS && window.TRIPS.length) return false;
    const t = await window.cacheGet('trips');
    if (Array.isArray(t) && t.length && !(window.TRIPS && window.TRIPS.length)) {
      window.TRIPS = t; window._markTripsReady?.(); return true;
    }
    return false;
  };

  // Fill a trip's screens from the phone, but ONLY the parts that are
  // still empty — never over fresh in-memory data. Lets a trip open
  // instantly, and fully, with no signal; the network refresh (if any)
  // replaces it right after.
  window.cacheHydrateTrip = async (tripId) => {
    if (!tripId) return false;
    await window.offlineReady();
    const c = await window.cacheGet('trip:' + tripId);
    if (!c) return false;
    // Already moved on to another trip — don't fill its screens with this one.
    if (window._activeTripId && window._activeTripId !== tripId) return false;
    const T = window.TRIP;
    if (c.detail && (!T || T.id !== tripId || T._seed)) {
      const d = { ...c.detail, budget: { ...(c.detail.budget || {}) } };
      delete d._seed;
      if (window.tripDays && d.startDate && d.endDate) Object.assign(d, window.tripDays(d.startDate, d.endDate));
      if (window.USER_DEFAULT_CURRENCY) d.homeCurrency = window.USER_DEFAULT_CURRENCY;
      window.TRIP = d;
    }
    const empty = (a) => !a || !a.length;
    // Leftovers of the first offline queue (temp ids) are replaced by the outbox.
    const live = (list) => (list || []).filter((e) => e && !String(e.id).startsWith('temp-'));
    if (empty(window.EXPENSES) && Array.isArray(c.expenses)) window.EXPENSES = live(c.expenses);
    if (empty(window.MY_PERSONAL_EXPENSES) && Array.isArray(c.personal)) window.MY_PERSONAL_EXPENSES = live(c.personal);
    if (empty(window.MEMBERS) && !empty(c.members)) window.MEMBERS = c.members;
    if (window.DOCS_TRIP_ID !== tripId && c.docs) {
      window.DOCS_BY_CAT = c.docs;
      window.DOCS_TRIP_ID = tripId;
      window.DOC_CATEGORIES = (window.DOC_CATEGORIES || []).map((k) => ({ ...k, count: (c.docs[k.key] || []).length }));
    }
    if (empty(window.ITINERARY) && !empty(c.itinerary)) window.ITINERARY = c.itinerary;
    if (empty(window.SETTLEMENTS) && !empty(c.settlements)) window.SETTLEMENTS = c.settlements;
    if (empty(window.AUDIT) && !empty(c.audit)) window.AUDIT = c.audit;
    // A receipt shown from memory last time (a picked photo) is gone now;
    // the outbox brings it back if it hasn't gone up yet.
    [...(window.EXPENSES || []), ...(window.MY_PERSONAL_EXPENSES || [])].forEach((e) => {
      if (e.receiptUrl && String(e.receiptUrl).startsWith('blob:')) { e.receiptUrl = null; e._pendingReceipt = false; }
    });
    window.applyPendingOps(tripId);
    window.localizeFiles();
    window.recomputeExpenseDerived?.(tripId);
    if (Array.isArray(c.expenses) && window._tripDataLoadedAt && !window._tripDataLoadedAt[tripId]) {
      window._tripDataLoadedAt[tripId] = c.savedAt || 1;
    }
    return true;
  };

  // ── Outbox: expenses are saved on the phone first ─────────
  // Ops, oldest first:
  //   add        { expId, tripId, createdBy, payload, row }
  //   edit       { expId, tripId, payload, row }
  //   del        { expId, tripId }
  //   receipt    { expId, tripId, file: { buf, type, name } }
  //   receiptDel { expId, tripId, path }
  //   link       { expId, tripId, docId | planId }
  let OUT = [];
  let outReady = null;
  const saveOut = () => window.cachePut('outbox2', OUT);
  const stripUndef = (o) => { const r = {}; Object.keys(o || {}).forEach((k) => { if (o[k] !== undefined) r[k] = o[k]; }); return r; };

  // The display row for an expense, exactly as loadExpenses maps it.
  window.expenseRowFrom = (id, who, p, base) => {
    const at = p.createdAt || (base && base.createdAt) || new Date().toISOString();
    const local = p.amountLocal != null ? parseFloat(p.amountLocal) : (base ? base.local : null);
    const localCur = p.localCurrency || (base && base.localCur) || null;
    return {
      ...(base || {}),
      id, who,
      cat: p.category || (base && base.cat) || 'misc',
      title: p.title != null ? p.title : (base ? base.title : ''),
      jpy: localCur === 'JPY' ? (local || 0) : 0,
      usd: p.amountUSD != null ? Number(p.amountUSD) || 0 : (base ? base.usd : 0),
      when: window.fmtDate ? window.fmtDate(at) : at,
      createdAt: at,
      note: p.note != null ? (p.note || '') : (base ? base.note : ''),
      splitWith: p.splitWith || (base && base.splitWith) || [],
      receiptPath: base ? base.receiptPath || null : null,
      receiptUrl: base ? base.receiptUrl || null : null,
      receiptVer: base ? base.receiptVer || null : null,
      isPersonal: p.isPersonal != null ? !!p.isPersonal : !!(base && base.isPersonal),
      cash: p.paidWith !== undefined ? p.paidWith === 'cash' : !!(base && base.cash),
      local, localCur,
    };
  };

  window.outboxLoad = () => outReady || (outReady = (async () => {
    const list = await window.cacheGet('outbox2');
    OUT = Array.isArray(list) ? list : [];
    // The first version queued only new expenses, with no id — move them over.
    const legacy = await window.cacheGet('outbox');
    if (Array.isArray(legacy) && legacy.length) {
      legacy.forEach((it) => {
        if (!it || it.type !== 'expense' || !it.payload) return;
        const expId = window.newId();
        const payload = { ...it.payload };
        payload.createdAt = payload.createdAt || new Date(it.queuedAt || Date.now()).toISOString();
        OUT.push({ opId: window.newId(), kind: 'add', at: it.queuedAt || Date.now(), userId: null,
          expId, tripId: it.tripId, createdBy: it.createdBy, payload,
          row: window.expenseRowFrom(expId, it.createdBy, payload) });
      });
      await window.cachePut('outbox', []);
      await saveOut();
    }
  })());

  window.outboxHas = (tripId) => OUT.some((o) => !tripId || o.tripId === tripId);

  // Queue one change, folding it into what's already waiting for the same
  // expense (an edit of an expense that hasn't gone up yet just changes
  // what will go up; deleting it simply drops it).
  // (The op being sent right now is left alone: it may already be on the
  // server, so later changes go after it instead of into it.)
  let inflightId = null;
  window.outboxPush = async (op) => {
    await window.outboxLoad();
    op = { opId: window.newId(), at: Date.now(), userId: window.currentUserId || null, ...op };
    const same = (o) => o.expId === op.expId && o.opId !== inflightId;
    const pendingAdd = OUT.find((o) => same(o) && o.kind === 'add');
    if (op.kind === 'edit') {
      const { paidBy, ...rest } = op.payload || {};
      if (pendingAdd) {
        if (paidBy) pendingAdd.createdBy = paidBy;
        pendingAdd.payload = { ...pendingAdd.payload, ...stripUndef(rest) };
        pendingAdd.row = op.row;
        await saveOut(); window.flushOutbox(); return;
      }
      const prev = OUT.find((o) => same(o) && o.kind === 'edit');
      if (prev) {
        prev.payload = { ...prev.payload, ...stripUndef(op.payload) };
        prev.row = op.row;
        await saveOut(); window.flushOutbox(); return;
      }
    } else if (op.kind === 'del') {
      if (pendingAdd) {
        OUT = OUT.filter((o) => !same(o));
        await saveOut(); return;
      }
      OUT = OUT.filter((o) => !same(o));
    } else if (op.kind === 'receipt') {
      OUT = OUT.filter((o) => !(same(o) && (o.kind === 'receipt' || o.kind === 'receiptDel')));
    } else if (op.kind === 'receiptDel') {
      OUT = OUT.filter((o) => !(same(o) && o.kind === 'receipt'));
      if (pendingAdd || !op.path || String(op.path).startsWith('pending/')) { await saveOut(); return; }
    }
    OUT.push(op);
    await saveOut();
    window.flushOutbox();
  };

  // ── Showing queued changes on top of the server's rows ────
  const pendingUrls = new Map();     // opId → object url of a receipt photo not uploaded yet
  const extOf = (f) => {
    const n = (f && f.name) || '';
    const m = /\.([a-z0-9]{2,5})$/i.exec(n);
    if (m) return m[1].toLowerCase();
    return /pdf/i.test((f && f.type) || '') ? 'pdf' : 'jpg';
  };
  const urlFor = (op) => {
    if (!pendingUrls.has(op.opId)) {
      try { pendingUrls.set(op.opId, URL.createObjectURL(new Blob([op.file.buf], { type: op.file.type || 'image/jpeg' }))); }
      catch (_) { pendingUrls.set(op.opId, null); }
    }
    return pendingUrls.get(op.opId);
  };
  window.pendingReceiptBlob = (expId) => {
    for (let i = OUT.length - 1; i >= 0; i--) {
      const o = OUT[i];
      if (o.expId === expId && o.kind === 'receipt' && o.file) return new Blob([o.file.buf], { type: o.file.type || 'application/octet-stream' });
    }
    return null;
  };

  window.overlayExpenseRows = (tripId, rows) => {
    const ops = OUT.filter((o) => o.tripId === tripId && o.kind !== 'link');
    const list = (rows || []).filter((r) => r && !String(r.id).startsWith('temp-'));
    if (!ops.length) return list;
    for (const op of ops) {
      const i = list.findIndex((r) => r.id === op.expId);
      if (op.kind === 'add') {
        // Our own row (from memory / the phone) shows the latest version of it.
        if (op.row) {
          if (i < 0) list.push({ ...op.row });
          else {
            const cur = list[i];
            list[i] = { ...op.row, id: cur.id, receiptPath: cur.receiptPath, receiptUrl: cur.receiptUrl, receiptVer: cur.receiptVer,
              receiptServerPath: cur.receiptServerPath, _pendingReceipt: cur._pendingReceipt };
          }
        }
      } else if (op.kind === 'edit') {
        if (i >= 0 && op.row) {
          const cur = list[i];
          list[i] = { ...cur, ...op.row, id: cur.id,
            receiptPath: cur.receiptPath, receiptUrl: cur.receiptUrl, receiptVer: cur.receiptVer,
            receiptServerPath: cur.receiptServerPath, _pendingReceipt: cur._pendingReceipt };
        }
      } else if (op.kind === 'del') {
        if (i >= 0) list.splice(i, 1);
      } else if (op.kind === 'receipt') {
        if (i >= 0 && op.file) {
          const cur = list[i];
          list[i] = { ...cur,
            receiptServerPath: cur.receiptServerPath !== undefined ? cur.receiptServerPath : (cur._pendingReceipt ? null : cur.receiptPath || null),
            receiptPath: `pending/${op.expId}.${extOf(op.file)}`, receiptUrl: urlFor(op), receiptVer: null, _pendingReceipt: true };
        }
      } else if (op.kind === 'receiptDel') {
        if (i >= 0) list[i] = { ...list[i], receiptPath: null, receiptUrl: null, receiptVer: null, _pendingReceipt: false };
      }
    }
    const t = (r) => { const v = Date.parse(r.createdAt); return isNaN(v) ? 0 : v; };
    list.sort((a, b) => t(b) - t(a));
    return list;
  };

  window.overlayPendingLinks = (tripId) => {
    const ops = OUT.filter((o) => o.tripId === tripId && (o.kind === 'link' || o.kind === 'del'));
    if (!ops.length) return;
    const docs = window.DOCS_TRIP_ID === tripId ? Object.values(window.DOCS_BY_CAT || {}).flat() : [];
    const plan = (window.ITINERARY || []).filter((p) => !p.tripId || p.tripId === tripId);
    for (const op of ops) {
      if (op.kind === 'link') {
        if (op.docId) docs.forEach((d) => { if (d.id === op.docId) d.linkedExpenseId = op.expId; });
        if (op.planId) plan.forEach((p) => { if (p.id === op.planId) p.linkedExpenseId = op.expId; });
      } else {
        docs.forEach((d) => { if (d.linkedExpenseId === op.expId) d.linkedExpenseId = null; });
        plan.forEach((p) => { if (p.linkedExpenseId === op.expId) p.linkedExpenseId = null; });
      }
    }
  };

  // Re-apply everything still waiting for this trip onto the in-memory rows.
  window.applyPendingOps = (tripId) => {
    if (!tripId || !OUT.some((o) => o.tripId === tripId)) return false;
    const all = window.overlayExpenseRows(tripId, [...(window.EXPENSES || []), ...(window.MY_PERSONAL_EXPENSES || [])]);
    window.EXPENSES = all.filter((e) => !e.isPersonal);
    window.MY_PERSONAL_EXPENSES = all.filter((e) => e.isPersonal);
    window.overlayPendingLinks(tripId);
    return true;
  };

  // ── Sending the queue ─────────────────────────────────────
  let flushing = false, retryTimer = null, delay = 4000;
  const later = () => {
    clearTimeout(retryTimer);
    retryTimer = setTimeout(() => window.flushOutbox(), delay);
    delay = Math.min(delay * 2, 60000);
  };

  async function runOp(op) {
    if (op.kind === 'add') {
      try { await window.addExpense(op.tripId, op.createdBy || op.userId || window.currentUserId, { ...op.payload, id: op.expId }); }
      catch (e) { if (!isDup(e)) throw e; }   // went up last time, the answer just never arrived
    } else if (op.kind === 'edit') {
      await window.updateExpense(op.expId, op.tripId, op.payload);
    } else if (op.kind === 'del') {
      await window.deleteExpense(op.expId, op.tripId, { quiet: true });
    } else if (op.kind === 'receipt') {
      const f = op.file || {};
      const file = new File([f.buf], f.name || `receipt.${extOf(f)}`, { type: f.type || 'image/jpeg' });
      await window.uploadReceipt(op.expId, op.tripId, file);
    } else if (op.kind === 'receiptDel') {
      await window.deleteReceipt(op.expId, op.path);
    } else if (op.kind === 'link') {
      if (op.docId) {
        const { error } = await window.sb.from('documents').update({ linked_expense_id: op.expId }).eq('id', op.docId);
        if (error) throw error;
      }
      if (op.planId) {
        const { error } = await window.sb.from('itinerary_items').update({ linked_expense_id: op.expId }).eq('id', op.planId);
        if (error && !/linked_expense_id/i.test(error.message || '')) throw error;
      }
    }
  }

  window.flushOutbox = async () => {
    await window.outboxLoad();
    if (flushing || !OUT.length) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;   // 'online' brings us back
    if (!window.sb || !window.currentUserId) return;
    flushing = true;
    const touched = new Map();
    const failed = [];
    let stalled = false;
    try {
      // A real session first — never write with the anonymous key.
      const { data } = await window.sb.auth.getSession();
      if (!data || !data.session) stalled = true;
      while (!stalled && OUT.length) {
        const op = OUT[0];
        const done = async () => { OUT = OUT.filter((o) => o.opId !== op.opId); await saveOut(); };
        if (op.userId && op.userId !== window.currentUserId) { await done(); continue; }
        inflightId = op.opId;
        try { await runOp(op); }
        catch (e) {
          if (window.isNetErr(e) || (window.isAuthErr(e) && (op.tries = (op.tries || 0) + 1) < 5)) {
            inflightId = null; stalled = true; await saveOut(); break;
          }
          failed.push(e);
        }
        inflightId = null;
        const t = touched.get(op.tripId) || { links: false };
        if (op.kind === 'link' || op.kind === 'del') t.links = true;
        touched.set(op.tripId, t);
        await done();
      }
    } catch (_) { stalled = true; }
    finally { flushing = false; inflightId = null; }
    if (stalled) later(); else delay = 4000;

    // The open trip shows the server's rows again — same ids, so nothing jumps.
    const id = window.TRIP && window.TRIP.id;
    const open = id && touched.get(id);
    if (open) {
      try {
        await window.loadExpenses(id);
        if (open.links) { await window.loadDocuments(id); await window.loadItinerary(id); }
        await window.cachePersistTrip(id);
      } catch (_) {}
      window.notifyDataChange?.();
    }
    if (failed.length) {
      const e = failed[0];
      window.toast?.(msgOf(e) || (window.isRTL ? 'تعذّر حفظ مصروف' : "Couldn't save an expense"), 'error');
    }
    if (!stalled && OUT.length) window.flushOutbox();   // more came in meanwhile
  };

  window.addEventListener('online', () => { delay = 4000; window.flushOutbox(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) window.flushOutbox(); });

  // ── Files kept on the phone ───────────────────────────────
  const FILES = 'voyage-files-v1';
  const hasCaches = typeof caches !== 'undefined';
  const fileIdx = new Map();          // storage path → version on the phone
  let fileIdxReady = null;
  const enc = (path) => String(path).split('/').map(encodeURIComponent).join('/');
  const keyOf = (path, ver) => `/__files/${enc(path)}?v=${encodeURIComponent(ver == null ? '0' : String(ver))}`;
  const swOn = () => !!(navigator.serviceWorker && navigator.serviceWorker.controller);

  window.fileIndexLoad = () => fileIdxReady || (fileIdxReady = (async () => {
    if (!hasCaches) return;
    try {
      const c = await caches.open(FILES);
      for (const req of await c.keys()) {
        const u = new URL(req.url);
        if (!u.pathname.startsWith('/__files/')) continue;
        const path = u.pathname.slice('/__files/'.length).split('/').map(decodeURIComponent).join('/');
        fileIdx.set(path, u.searchParams.get('v') || '0');
      }
    } catch (_) {}
  })());

  window.offlineReady = () => Promise.all([window.outboxLoad(), window.fileIndexLoad()]);

  window.hasLocalFile = (path, ver) => !!path && fileIdx.get(path) === String(ver == null ? '0' : ver);
  // A same-origin url the service worker answers from the phone, or null.
  window.localFileUrl = (path, ver) => (window.hasLocalFile(path, ver) && swOn()) ? keyOf(path, ver) : null;

  const guessType = (path) => {
    const e = (/\.([a-z0-9]+)$/i.exec(path || '') || [])[1];
    return ({ pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', heic: 'image/heic' })[(e || '').toLowerCase()] || 'application/octet-stream';
  };
  const MAX_BYTES = 40 * 1024 * 1024;
  const inflight = new Map();
  function fetchToCache(path, ver, url) {
    const k = `${path}@${ver}`;
    if (inflight.has(k)) return inflight.get(k);
    const p = (async () => {
      const res = await fetch(url, { credentials: 'omit', cache: 'no-store' });
      if (!res.ok) { const e = new Error('HTTP ' + res.status); e.status = res.status; throw e; }
      const len = Number(res.headers.get('content-length') || 0);
      if (len > MAX_BYTES) throw new Error('too large');
      const blob = await res.blob();
      const type = (res.headers.get('content-type') || '').split(';')[0] || blob.type || guessType(path);
      if (hasCaches) {
        try {
          const c = await caches.open(FILES);
          await c.put(keyOf(path, ver), new Response(blob, { headers: { 'content-type': type } }));
          const old = fileIdx.get(path);
          if (old != null && old !== String(ver)) { try { await c.delete(keyOf(path, old)); } catch (_) {} }
          fileIdx.set(path, String(ver));
        } catch (_) { /* quota — still show it */ }
      }
      return blob.type ? blob : new Blob([blob], { type });
    })().finally(() => inflight.delete(k));
    inflight.set(k, p);
    return p;
  }

  // Ask once for storage the browser won't clear under pressure.
  let askedPersist = false;
  const askPersist = () => {
    if (askedPersist) return; askedPersist = true;
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist().catch(() => {}); } catch (_) {}
  };

  // The file's bytes: from the phone when it's there, else downloaded (and
  // kept). A link that has expired is signed again once.
  window.fileBlob = async ({ path, ver, url, blob }) => {
    if (blob) return blob;
    ver = ver == null ? '0' : String(ver);
    if (path && String(path).startsWith('pending/')) {
      const b = window.pendingReceiptBlob(String(path).slice(8).replace(/\.[^.]+$/, ''));
      if (b) return b;
    }
    if (hasCaches && path) {
      try {
        const c = await caches.open(FILES);
        const hit = await c.match(keyOf(path, ver));
        if (hit) return await hit.blob();
        if (navigator.onLine === false) {
          // No signal: an older copy of the same file beats nothing.
          const old = fileIdx.get(path);
          if (old != null) { const o = await c.match(keyOf(path, old)); if (o) return await o.blob(); }
        }
      } catch (_) {}
    }
    const tryUrl = async (u) => (path ? fetchToCache(path, ver, u) : (async () => {
      const r = await fetch(u); if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; } return r.blob();
    })());
    if (url && !String(url).startsWith('/__files/')) {
      try { return await tryUrl(url); }
      catch (e) { if (!path || window.isNetErr(e)) throw e; }
    }
    if (path && window._signDocPaths && navigator.onLine !== false) {
      const fresh = (await window._signDocPaths([path])).get(path);
      if (fresh) return await tryUrl(fresh);
    }
    throw new Error('unavailable');
  };

  // Download a trip's files in the background (only what's missing or changed).
  const queue = [];
  let pumping = 0;
  const PARALLEL = 2;
  window.prefetchFiles = (list) => {
    if (!hasCaches || navigator.onLine === false) return;
    (list || []).forEach((f) => {
      if (!f || !f.path || !f.url) return;
      const ver = f.ver == null ? '0' : String(f.ver);
      if (fileIdx.get(f.path) === ver) return;
      if (queue.some((q) => q.path === f.path && q.ver === ver)) return;
      queue.push({ path: f.path, ver, url: f.url });
    });
    if (!queue.length) return;
    askPersist();
    setTimeout(pump, 900);
  };
  let gotSince = 0, settleTimer = null;
  async function pump() {
    while (pumping < PARALLEL && queue.length && navigator.onLine !== false) {
      const f = queue.shift();
      pumping++;
      fetchToCache(f.path, f.ver, f.url)
        .then(() => { gotSince++; }, () => {})
        .finally(() => {
          pumping--;
          if (queue.length) pump();
          else if (!pumping && gotSince) {
            clearTimeout(settleTimer);
            settleTimer = setTimeout(() => { gotSince = 0; window.localizeFiles(); window.notifyDataChange?.(); }, 120);
          }
        });
    }
  }

  // Point covers and receipts at the phone's copy wherever there is one.
  window.localizeFiles = () => {
    if (!swOn()) return;
    Object.values(window.DOCS_BY_CAT || {}).forEach((list) => (list || []).forEach((d) => {
      if (d && d.coverPath) { const u = window.localFileUrl(d.coverPath, d.coverVer); if (u) d.coverUrl = u; }
    }));
    [...(window.EXPENSES || []), ...(window.MY_PERSONAL_EXPENSES || [])].forEach((e) => {
      if (e && e.receiptPath && !e._pendingReceipt) { const u = window.localFileUrl(e.receiptPath, e.receiptVer); if (u) e.receiptUrl = u; }
    });
  };

  // After a full load of a trip: drop the phone's copies of that trip's
  // files that no document or receipt points to any more (deleted ones).
  window.pruneTripFiles = async (tripId) => {
    if (!hasCaches || !tripId || window.DOCS_TRIP_ID !== tripId) return;
    const keep = new Set();
    Object.values(window.DOCS_BY_CAT || {}).forEach((list) => (list || []).forEach((d) => {
      if (!d) return; [d.filePath, d.secondaryFilePath, d.coverPath].forEach((p) => p && keep.add(p));
    }));
    [...(window.EXPENSES || []), ...(window.MY_PERSONAL_EXPENSES || [])].forEach((e) => { if (e && e.receiptPath) keep.add(e.receiptPath); });
    if (window.outboxHas(tripId)) return;   // something still on its way up — tidy next time
    const prefix = tripId + '/';
    const gone = [...fileIdx.entries()].filter(([p]) => p.startsWith(prefix) && !keep.has(p));
    if (!gone.length) return;
    try {
      const c = await caches.open(FILES);
      for (const [p, v] of gone) { await c.delete(keyOf(p, v)); fileIdx.delete(p); }
    } catch (_) {}
  };

  window.filesClearAll = async () => {
    fileIdx.clear(); queue.length = 0;
    try { if (hasCaches) await caches.delete(FILES); } catch (_) {}
  };
})();
