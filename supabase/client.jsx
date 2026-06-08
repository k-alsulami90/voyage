// Supabase client — loaded once, available as window.sb everywhere

const _SUPABASE_URL  = 'https://ydbpkimqibfviqxaicld.supabase.co';
const _SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkYnBraW1xaWJmdmlxeGFpY2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODUzMjYsImV4cCI6MjA5NDI2MTMyNn0.3dgxXZz-xyB7DLVmXUQUrbjhXS_uRs69Ue-9VRuo0ko';

window.sb = window.supabase.createClient(_SUPABASE_URL, _SUPABASE_ANON);

// ── Auth helpers ─────────────────────────────────────────────

window.sbSignIn = async (email, password) => {
  const { data, error } = await window.sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

window.sbSignUp = async (email, password, name) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const hue = Math.floor(Math.random() * 360);

  const { data, error } = await window.sb.auth.signUp({
    email,
    password,
    options: { data: { name, initials, avatar_hue: hue } },
  });
  if (error) throw error;

  // Create profile row (RLS allows insert for own id)
  if (data.user) {
    await window.sb.from('profiles').upsert({
      id: data.user.id,
      name,
      initials,
      avatar_hue: hue,
      default_currency: 'USD',
    });
  }
  return data;
};

window.sbSignOut = () => window.sb.auth.signOut();

// Send a password-reset email. User clicks the link and lands back on the app
// with a recovery session; PASSWORD_RECOVERY event fires onAuthStateChange.
window.sbResetPassword = async (email) => {
  const redirectTo = `${window.location.origin}${window.location.pathname}#reset`;
  const { error } = await window.sb.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
};

// Set a new password (only works while in a recovery session)
window.sbUpdatePassword = async (newPassword) => {
  const { error } = await window.sb.auth.updateUser({ password: newPassword });
  if (error) throw error;
};

// Re-send the email-confirmation email
window.sbResendConfirmation = async (email) => {
  const { error } = await window.sb.auth.resend({ type: 'signup', email });
  if (error) throw error;
};

// ── Load the user's profile-level preferences (right now: their
// default_currency). Runs once at app boot after auth. fmtMoney /
// fxRate fall back to this when no trip is open, so global views
// (Trips home, Insights, App Settings) display in the user's chosen
// currency instead of USD. Without this, money showed as USD until
// the user opened any trip -- which set window.TRIP.homeCurrency --
// and then "stuck" to the last opened trip's currency on subsequent
// global views. ────────────────────────────────────────────
window.loadUserPreferences = async (userId) => {
  if (!userId) return;
  try {
    const { data, error } = await window.sb
      .from('profiles')
      .select('default_currency')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    const cur = (data?.default_currency || 'USD').trim().toUpperCase();
    window.USER_DEFAULT_CURRENCY = cur;
  } catch (err) {
    console.warn('loadUserPreferences failed', err);
    // Defensive: at least set USD so the global default is well-defined
    window.USER_DEFAULT_CURRENCY = 'USD';
  }
};

// ── Clear ALL mock data — call immediately on sign-in ────────
window.clearAllMockData = () => {
  window.TRIPS         = [];
  window.TRIP          = null;
  window.MEMBERS       = [];
  window.EXPENSES      = [];
  window.DOCS          = [];
  window.AUDIT         = [];
  window.LIFETIME_STATS = null;
  window.USER_DEFAULT_CURRENCY = null;
  window.DOCS_BY_CAT   = { flights: [], lodging: [], visas: [], transport: [] };
  window.DOC_CATEGORIES = window.DOC_CATEGORIES?.map((c) => ({ ...c, count: 0 })) || [];
  window.CATEGORIES    = window.CATEGORIES?.map((c) => ({ ...c, amt: 0, pct: 0 })) || [];
  window.TRIP_ANALYTICS = {
    dailyAvgUSD: 0, dailyPlanUSD: 0,
    topDay: { date: '--', usd: 0 },
    contribs: [], spendByDay: [],
  };
  window.GLOBAL = {
    countries: 0, continents: 0, days: 0, lifetimeUSD: 0,
    longestTrip: { name: '--', days: 0 },
    topCategory: { name: '--', usd: 0, pct: 0 },
    byContinent: [], yearly: [],
  };
};

// ── Data loaders — populate window globals used by screens ───

window.loadTrips = async (userId) => {

  // RLS already filters to trips the user owns or is a member of
  const { data, error } = await window.sb
    .from('trips')
    .select('*, trip_members(user_id, role)')
    .order('start_date', { ascending: false });

  if (error) { console.error('loadTrips', error); return; }

  window.TRIPS = (data || []).map((r) => ({
    id:           r.id,
    title:        r.title,
    sub:          r.subtitle || '',
    dates:        window.fmtDateRange(r.start_date, r.end_date),
    startDate:    r.start_date,
    endDate:      r.end_date,
    country:      r.country_code || '',
    countries:    Array.isArray(r.countries) && r.countries.length > 0
                    ? r.countries.filter(Boolean)
                    : (r.country_code ? [r.country_code] : []),
    shared:       (r.trip_members || []).length > 1,
    members:      (r.trip_members || []).length,
    cover:        r.cover_style || 'kyoto',
    coverImageUrl: r.cover_image_url || null,
    coverUrl:     r.cover_url || null,
    coverPath:    r.cover_path || null,
    budgetPct:    0,
    budgetPlannedUSD: parseFloat(r.budget_planned_usd) || 0,
    homeCurrency: r.home_currency || 'USD',
    fx:           parseFloat(r.fx_rate) || 1,
    status:       r.status,
  }));

  // Also set the single-trip detail for the active trip
  const active = data?.find((r) => r.status === 'active') || data?.[0];
  if (active) {
    window.TRIP = {
      id:             active.id,
      title:          active.title,
      subtitle:       active.subtitle || '',
      dates:          window.fmtDateRange(active.start_date, active.end_date),
      startDate:      active.start_date,
      endDate:        active.end_date,
      country:        active.country_code || '',
      countries:      Array.isArray(active.countries) && active.countries.length > 0
                        ? active.countries.filter(Boolean)
                        : (active.country_code ? [active.country_code] : []),
      daysIn:         1,
      daysTotal:      Math.ceil(
        (new Date(active.end_date) - new Date(active.start_date)) / 86400000
      ),
      homeCurrency:   active.home_currency,
      localCurrency:  active.local_currency || 'USD',
      fx:             parseFloat(active.fx_rate) || 1,
      budget:         { plannedUSD: parseFloat(active.budget_planned_usd) || 0, spentUSD: 0 },
      cover:          active.cover_style || 'kyoto',
      coverUrl:       active.cover_url || null,
      coverPath:      active.cover_path || null,
      weather:        { temp: '--', cond: '' },
      next:           { label: '', when: '' },
    };
  }
};

// ── Settlements (Phase 2) ────────────────────────────────────
// Load settlements for a trip into window.SETTLEMENTS.
// Falls back gracefully if the table doesn't exist yet (pre-migration).
window.loadSettlements = async (tripId) => {
  if (!tripId || !window.sb) return [];
  const { data, error } = await window.sb.from('settlements')
    .select('*').eq('trip_id', tripId).order('created_at', { ascending: false });
  if (error) {
    if (/settlements/i.test(error.message || '')) {
      window.SETTLEMENTS = [];
      return [];
    }
    console.error('loadSettlements', error);
    window.SETTLEMENTS = [];
    return [];
  }
  window.SETTLEMENTS = data || [];
  return window.SETTLEMENTS;
};

// Record a real-world money transfer between two trip members.
window.recordSettlement = async (tripId, fromUser, toUser, amountUSD, note = null) => {
  if (!window.sb) throw new Error('Not signed in');
  if (fromUser === toUser) throw new Error('Cannot pay yourself');
  const { data, error } = await window.sb.from('settlements').insert({
    trip_id: tripId,
    from_user: fromUser,
    to_user: toUser,
    amount_usd: Math.round(amountUSD * 100) / 100,
    note,
    created_by: window.currentUserId,
  }).select().single();
  if (error) throw error;
  // Refresh local cache + invalidate lifetime stats
  await window.loadSettlements(tripId);
  window.LIFETIME_STATS = null;
  // Audit log
  try {
    await window.sb.from('audit_log').insert({
      trip_id: tripId,
      user_id: window.currentUserId,
      action: 'edited',
      target: `Settlement: ${(amountUSD || 0).toFixed(0)}`,
    });
  } catch (_) {}
  return data;
};

// Undo a settlement (only the creator or a trip Admin should call this;
// RLS enforces both anyway). Refreshes local state.
window.deleteSettlement = async (settlementId, tripId) => {
  if (!window.sb) throw new Error('Not signed in');
  const { error } = await window.sb.from('settlements').delete().eq('id', settlementId);
  if (error) throw error;
  await window.loadSettlements(tripId);
  window.LIFETIME_STATS = null;
};

// ── Itinerary (Phase 5) ──────────────────────────────────────
// Day-by-day activity plan per trip. Activities have a date,
// optional start_time, title, category, and optional location.
window.ITINERARY = [];
window.loadItinerary = async (tripId) => {
  if (!tripId || !window.sb) { window.ITINERARY = []; return []; }
  const { data, error } = await window.sb.from('itinerary_items')
    .select('*').eq('trip_id', tripId)
    .order('day_date', { ascending: true })
    .order('start_time', { ascending: true, nullsFirst: false })
    .order('sort_order', { ascending: true });
  if (error) {
    if (/itinerary_items/i.test(error.message || '')) {
      window.ITINERARY = []; return [];
    }
    console.error('loadItinerary', error);
    window.ITINERARY = []; return [];
  }
  window.ITINERARY = (data || []).map((r) => ({
    id: r.id,
    tripId: r.trip_id,
    dayDate: r.day_date,
    startTime: r.start_time,
    title: r.title,
    category: r.category || 'misc',
    location: r.location,
    sortOrder: r.sort_order,
    createdBy: r.created_by,
  }));
  return window.ITINERARY;
};

window.addItineraryItem = async (tripId, fields) => {
  if (!window.sb) throw new Error('Not signed in');
  const { data, error } = await window.sb.from('itinerary_items').insert({
    trip_id: tripId,
    day_date: fields.dayDate,
    start_time: fields.startTime || null,
    title: (fields.title || '').trim(),
    category: fields.category || 'misc',
    location: (fields.location || '').trim() || null,
    sort_order: fields.sortOrder || 0,
    created_by: window.currentUserId,
  }).select().single();
  if (error) throw error;
  return data;
};

window.updateItineraryItem = async (itemId, tripId, fields) => {
  if (!window.sb) throw new Error('Not signed in');
  const { error } = await window.sb.from('itinerary_items').update({
    day_date: fields.dayDate,
    start_time: fields.startTime || null,
    title: (fields.title || '').trim(),
    category: fields.category || 'misc',
    location: (fields.location || '').trim() || null,
    updated_at: new Date().toISOString(),
  }).eq('id', itemId);
  if (error) throw error;
};

window.deleteItineraryItem = async (itemId, tripId) => {
  if (!window.sb) throw new Error('Not signed in');
  const { error } = await window.sb.from('itinerary_items').delete().eq('id', itemId);
  if (error) throw error;
};

// ── Balance computation (shared trips) ───────────────────────
// For a given user, given a list of expenses, returns the per-trip
// totals: paid (what the user covered for the group), owes (their
// share of expenses paid by others), and net (paid - owes).
// Each expense:
//   - payer = e.who
//   - splitWith = array of user_ids the cost is shared with (excludes payer)
//   - The payer is implicitly part of the share. So total people sharing
//     = len(splitWith) + 1. Each member's share = e.usd / (len + 1).
//   - If splitWith is empty, the expense is personal — payer covered it,
//     not shared, nobody else owes anything.
window.computeUserBalance = function(userId, expenses, settlements) {
  let paid = 0;
  let owes = 0;
  const byOther = {};  // userId → net (positive: they owe you; negative: you owe them)
  (expenses || []).forEach((e) => {
    const splitters = (e.splitWith || []).filter(Boolean);
    const isShared = splitters.length > 0;
    const totalSharers = isShared ? (splitters.length + 1) : 1;
    const shareAmount = (e.usd || 0) / totalSharers;
    if (e.who === userId) {
      paid += (e.usd || 0);
      if (isShared) {
        splitters.forEach((uid) => {
          byOther[uid] = (byOther[uid] || 0) + shareAmount;
        });
      }
    } else if (isShared && splitters.includes(userId)) {
      owes += shareAmount;
      byOther[e.who] = (byOther[e.who] || 0) - shareAmount;
    }
  });
  // Apply settlements — each one reduces the from->to debt by amount.
  // If userId is `from_user`: they paid `to_user` cash → their byOther[to] should INCREASE
  //   (they no longer owe as much; they essentially 'paid in advance')
  // If userId is `to_user`: they were paid by `from_user` → their byOther[from] should DECREASE
  //   (they're no longer owed as much).
  (settlements || []).forEach((s) => {
    const amt = parseFloat(s.amount_usd) || 0;
    if (s.from_user === userId) {
      byOther[s.to_user] = (byOther[s.to_user] || 0) + amt;
      paid += amt;  // counts toward your "paid" total too
    } else if (s.to_user === userId) {
      byOther[s.from_user] = (byOther[s.from_user] || 0) - amt;
      owes += amt;
    }
  });
  return { paid, owes, net: paid - owes, byOther };
};

// ── Settle-up algorithm ──────────────────────────────────────
// Given a per-member net balances map (positive = owed, negative = owes),
// produce the minimum number of transactions to zero out everyone.
// Greedy O(n log n) approach: max-creditor pays the max-debtor each round.
window.computeSettlements = function(balances) {
  // balances: { userId: net (USD-base) }
  const creditors = []; // { id, amount }  positive
  const debtors   = []; // { id, amount }  positive abs
  Object.entries(balances || {}).forEach(([id, net]) => {
    if (net > 0.5) creditors.push({ id, amount: net });
    else if (net < -0.5) debtors.push({ id, amount: -net });
  });
  // Sort descending so we match biggest first (fewer transactions)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);
  const transfers = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i], c = creditors[j];
    const amt = Math.min(d.amount, c.amount);
    if (amt >= 0.5) {
      transfers.push({ from: d.id, to: c.id, amount: Math.round(amt * 100) / 100 });
    }
    d.amount -= amt;
    c.amount -= amt;
    if (d.amount < 0.5) i++;
    if (c.amount < 0.5) j++;
  }
  return transfers;
};

// Compute everyone's balance in one shot (used by Settle Up screen)
window.computeAllBalances = function(memberIds, expenses, settlements) {
  const balances = {};
  (memberIds || []).forEach((uid) => {
    balances[uid] = window.computeUserBalance(uid, expenses, settlements).net;
  });
  return balances;
};

// Track which trips have had their full per-trip data loaded at least once.
// Screens read this to decide skeleton vs real content (prevents the
// "flash of zeros before real numbers arrive" UX bug).
window._tripDataLoadedAt = window._tripDataLoadedAt || {};
window.isTripDataReady = (tripId) =>
  !!(window._tripDataLoadedAt && tripId && window._tripDataLoadedAt[tripId]);

// ── Stale-while-revalidate cache: write last-known summary to localStorage
// so cold-boot opens of a known trip can render numbers instantly. ──
window._cacheTripSummary = (tripId) => {
  try {
    if (!tripId || !window.TRIP || window.TRIP.id !== tripId) return;
    const expenses = window.EXPENSES || [];
    const summary = {
      tripId,
      title:    window.TRIP.title,
      subtitle: window.TRIP.subtitle,
      cover:    window.TRIP.cover,
      coverImageUrl: window.TRIP.coverImageUrl,
      dates:    window.TRIP.dates,
      countries: window.TRIP.countries || [],
      homeCurrency: window.TRIP.homeCurrency,
      localCurrency: window.TRIP.localCurrency,
      fx:       window.TRIP.fx,
      plannedUSD: window.TRIP.budget?.plannedUSD || 0,
      spentUSD:   expenses.reduce((s, e) => s + (e.usd || 0), 0),
      expenseCount: expenses.length,
      memberCount:  (window.MEMBERS || []).length,
      cachedAt: Date.now(),
    };
    localStorage.setItem(`voyage:trip:${tripId}:summary`, JSON.stringify(summary));
  } catch (_) {}
};
window._readTripSummary = (tripId) => {
  try {
    const raw = localStorage.getItem(`voyage:trip:${tripId}:summary`);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
};

window.loadExpenses = async (tripId) => {
  const { data, error } = await window.sb
    .from('expenses')
    .select('*, profiles ( name, initials, avatar_hue )')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });

  if (error) { console.error('loadExpenses', error); return; }

  window.EXPENSES = (data || []).map((r) => ({
    id:        r.id,
    who:       r.created_by,
    cat:       r.category,
    title:     r.title,
    jpy:       r.local_currency === 'JPY' ? parseFloat(r.amount_local) : 0,
    usd:       parseFloat(r.amount_usd),
    when:      window.fmtDate(r.created_at),
    createdAt: r.created_at,
    note:      r.note || '',
    splitWith: Array.isArray(r.split_with) ? r.split_with.filter(Boolean) : [],
    receiptPath: r.receipt_path || null,
    receiptUrl:  r.receipt_url || null,
  }));

  // Recalculate category totals
  const totals = {};
  window.EXPENSES.forEach((e) => {
    totals[e.cat] = (totals[e.cat] || 0) + e.usd;
  });
  const total = Object.values(totals).reduce((s, v) => s + v, 0) || 1;
  window.CATEGORIES = window.CATEGORIES.map((c) => ({
    ...c,
    amt: totals[c.key] || 0,
    pct: Math.round(((totals[c.key] || 0) / total) * 100),
  }));

  // Update TRIP budget spent
  if (window.TRIP && window.TRIP.id === tripId) {
    window.TRIP.budget.spentUSD = total;
  }

  // Mark this trip's data as freshly loaded; cache summary for cold-boot
  window._tripDataLoadedAt[tripId] = Date.now();
  window._cacheTripSummary(tripId);
};

window.loadMembers = async (tripId) => {
  const { data, error } = await window.sb
    .from('trip_members')
    .select('*, profiles ( name, initials, avatar_hue )')
    .eq('trip_id', tripId);

  if (error) { console.error('loadMembers', error); return; }

  window.MEMBERS = (data || []).map((r) => ({
    id:       r.user_id,
    name:     r.profiles?.name || 'Unknown',
    role:     r.role,
    hue:      r.profiles?.avatar_hue || 35,
    initials: r.profiles?.initials || '?',
  }));
};

window.loadDocuments = async (tripId) => {
  const { data, error } = await window.sb
    .from('documents')
    .select('*, document_photos ( storage_path )')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });

  if (error) { console.error('loadDocuments', error); return; }

  const byCat = { flights: [], lodging: [], visas: [], transport: [] };
  (data || []).forEach((r) => {
    // Links come ONLY from Supabase Storage — external link_url is ignored.
    // User must upload the file via the Upload button to get a working link.
    let resolvedLink = null;
    let resolvedLabel = null;
    if (r.file_path) {
      const { data: { publicUrl } } = window.sb.storage
        .from('documents').getPublicUrl(r.file_path);
      resolvedLink  = publicUrl;
      resolvedLabel = window.isRTL ? 'فتح PDF' : 'Open PDF';
    }
    // Secondary file (e.g. boarding pass for flights) — resolve URL if present.
    let secondaryLink = null;
    if (r.secondary_file_path) {
      const { data: { publicUrl: pu } } = window.sb.storage
        .from('documents').getPublicUrl(r.secondary_file_path);
      secondaryLink = pu;
    }
    const doc = {
      id:        r.id,
      category:  r.category,
      kind:      r.kind,
      title:     r.title,
      sub:       r.subtitle || '',
      size:      r.file_size_bytes
        ? `${(r.file_size_bytes / 1024 / 1024).toFixed(1)} MB`
        : (r.file_path ? '...' : '--'),
      tint:      r.tint,
      filePath:  r.file_path || null,
      coverUrl:  r.cover_url || null,
      coverPath: r.cover_path || null,
      link:      resolvedLink,
      linkLabel: resolvedLabel,
      photos:    (r.document_photos || []).map((p) => p.storage_path),
      // Phase 8 — structured per-category data
      details:           r.details || {},
      costUSD:           r.cost_usd != null ? parseFloat(r.cost_usd) : null,
      costLocal:         r.cost_local != null ? parseFloat(r.cost_local) : null,
      costCurrency:      r.cost_currency || null,
      linkedExpenseId:   r.linked_expense_id || null,
      secondaryFilePath: r.secondary_file_path || null,
      secondaryFileSize: r.secondary_file_size || null,
      secondaryLink,
    };
    if (byCat[r.category]) byCat[r.category].push(doc);
  });
  window.DOCS_BY_CAT = byCat;

  window.DOC_CATEGORIES = window.DOC_CATEGORIES.map((c) => ({
    ...c,
    count: (byCat[c.key] || []).length,
  }));
};

// Upload a PDF/image to Supabase Storage and link it to a document record
// Upload a receipt photo for an expense. Reuses the 'documents' bucket
// with path `{tripId}/receipts/{expenseId}.{ext}` so existing storage RLS
// (member-of-trip check via storage.foldername(name)[1]) keeps working.
// Returns the public URL of the uploaded file.
window.uploadReceipt = async (expenseId, tripId, file) => {
  if (!file || !expenseId || !tripId) throw new Error('Missing receipt args');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${tripId}/receipts/${expenseId}.${ext}`;
  const { error: upErr } = await window.sb.storage
    .from('documents').upload(path, file, {
      upsert: true, contentType: file.type || 'image/jpeg',
    });
  if (upErr) throw upErr;
  const { data: { publicUrl } } = window.sb.storage
    .from('documents').getPublicUrl(path);
  const { error: dbErr } = await window.sb.from('expenses').update({
    receipt_path: path, receipt_url: publicUrl,
  }).eq('id', expenseId);
  if (dbErr) {
    // Graceful fallback if receipt columns not yet migrated
    if (!/receipt/i.test(dbErr.message || '')) throw dbErr;
  }
  return publicUrl;
};

// Remove an expense's receipt (storage + DB pointer).
window.deleteReceipt = async (expenseId, receiptPath) => {
  if (receiptPath) {
    try { await window.sb.storage.from('documents').remove([receiptPath]); } catch (_) {}
  }
  const { error } = await window.sb.from('expenses').update({
    receipt_path: null, receipt_url: null,
  }).eq('id', expenseId);
  if (error && !/receipt/i.test(error.message || '')) throw error;
};

// ─────────────────────────────────────────────────────────────
// Trip invites — shareable join links (one row per trip+role).
// ─────────────────────────────────────────────────────────────
function _makeInviteToken() {
  // 10 chars, base32-ish (no 0/O/1/I) — short, URL-safe, hard to typo.
  const alpha = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let out = '';
  const buf = new Uint8Array(10);
  crypto.getRandomValues(buf);
  for (let i = 0; i < 10; i++) out += alpha[buf[i] % alpha.length];
  return out;
}

// Lazily create (or reuse) an invite for a (trip, role). Returns the token.
window.getOrCreateInvite = async (tripId, role = 'Editor') => {
  // Check existing, non-revoked invite for this role
  const { data: existing, error: selErr } = await window.sb
    .from('trip_invites')
    .select('token, revoked_at, expires_at')
    .eq('trip_id', tripId).eq('role', role).maybeSingle();
  if (selErr) throw selErr;
  if (existing && !existing.revoked_at &&
      (!existing.expires_at || new Date(existing.expires_at) > new Date())) {
    return existing.token;
  }

  // Otherwise create one (delete a stale row first so the unique key is free)
  if (existing) {
    await window.sb.from('trip_invites').delete().eq('token', existing.token);
  }
  const token = _makeInviteToken();
  const expires = new Date(); expires.setDate(expires.getDate() + 30);
  const { error: insErr } = await window.sb.from('trip_invites').insert({
    token, trip_id: tripId, role,
    created_by: window.currentUserId,
    expires_at: expires.toISOString(),
  });
  if (insErr) throw insErr;
  return token;
};

// List all invites (active + revoked) for a trip, newest first.
window.loadTripInvites = async (tripId) => {
  if (!tripId || !window.sb) return [];
  const { data, error } = await window.sb.from('trip_invites')
    .select('*').eq('trip_id', tripId)
    .order('created_at', { ascending: false });
  if (error) {
    if (/trip_invites/i.test(error.message || '')) return [];
    console.error('loadTripInvites', error);
    return [];
  }
  return data || [];
};

window.revokeInvite = async (token) => {
  const { error } = await window.sb.from('trip_invites')
    .update({ revoked_at: new Date().toISOString() }).eq('token', token);
  if (error) throw error;
};

// Redeem an invite via the SECURITY DEFINER RPC. Returns { tripId, role }.
window.redeemInvite = async (token) => {
  if (!token) throw new Error('No invite token');
  const { data, error } = await window.sb.rpc('redeem_trip_invite', { p_token: token });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  // The function returns either { out_trip_id, out_role } (after the
  // ambiguous-column hotfix in migration 012) or the legacy
  // { trip_id, role } shape — accept both so older Supabase projects
  // that haven't run the hotfix yet keep working.
  return {
    tripId: row.out_trip_id || row.trip_id,
    role:   row.out_role    || row.role,
  };
};

// Build a shareable link for a token using the current origin.
window.inviteLink = (token) => `${window.location.origin}/?join=${token}`;

// Upload a trip cover photo. Reuses 'documents' bucket at {tripId}/cover.{ext}
// so the existing storage RLS (member-of-trip via foldername) keeps working.
window.uploadTripCover = async (tripId, file) => {
  if (!tripId || !file) throw new Error('Missing cover args');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${tripId}/cover.${ext}`;
  const { error: upErr } = await window.sb.storage
    .from('documents').upload(path, file, {
      upsert: true, contentType: file.type || 'image/jpeg',
    });
  if (upErr) throw upErr;
  const { data: { publicUrl } } = window.sb.storage
    .from('documents').getPublicUrl(path);
  // Cache-bust so the new image shows immediately after replace
  const url = `${publicUrl}?v=${Date.now()}`;
  const { error: dbErr } = await window.sb.from('trips').update({
    cover_path: path, cover_url: url,
  }).eq('id', tripId);
  if (dbErr) {
    if (!/cover/i.test(dbErr.message || '')) throw dbErr;
  }
  return url;
};

window.deleteTripCover = async (tripId, coverPath) => {
  if (coverPath) {
    try { await window.sb.storage.from('documents').remove([coverPath]); } catch (_) {}
  }
  const { error } = await window.sb.from('trips').update({
    cover_path: null, cover_url: null,
  }).eq('id', tripId);
  if (error && !/cover/i.test(error.message || '')) throw error;
};

// Upload a per-document cover photo (airline logo, hotel facade, etc.)
// Reuses 'documents' bucket at {tripId}/doc-covers/{docId}.{ext} so the
// existing storage RLS keeps working without new policies.
window.uploadDocCover = async (docId, tripId, file) => {
  if (!docId || !tripId || !file) throw new Error('Missing cover args');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${tripId}/doc-covers/${docId}.${ext}`;
  const { error: upErr } = await window.sb.storage
    .from('documents').upload(path, file, {
      upsert: true, contentType: file.type || 'image/jpeg',
    });
  if (upErr) throw upErr;
  const { data: { publicUrl } } = window.sb.storage
    .from('documents').getPublicUrl(path);
  const url = `${publicUrl}?v=${Date.now()}`;
  const { error: dbErr } = await window.sb.from('documents').update({
    cover_path: path, cover_url: url,
  }).eq('id', docId);
  if (dbErr) {
    if (!/cover/i.test(dbErr.message || '')) throw dbErr;
  }
  return url;
};

window.deleteDocCover = async (docId, coverPath) => {
  if (coverPath) {
    try { await window.sb.storage.from('documents').remove([coverPath]); } catch (_) {}
  }
  const { error } = await window.sb.from('documents').update({
    cover_path: null, cover_url: null,
  }).eq('id', docId);
  if (error && !/cover/i.test(error.message || '')) throw error;
};

// Detach the uploaded file from a document — deletes the storage object
// and clears the file pointer columns. The document record itself stays
// so the user can re-upload (or just keep it as a link-only doc).
window.removeDocumentFile = async (docId, filePath) => {
  if (!window.sb) throw new Error('Not signed in');
  if (filePath) {
    try { await window.sb.storage.from('documents').remove([filePath]); } catch (_) {}
  }
  // Read current row so we only clear link_url if it was the file's own URL
  // (so an external link the user typed in survives the file removal).
  const { data: row } = await window.sb.from('documents')
    .select('link_label').eq('id', docId).maybeSingle();
  const fileOwnsLink = row && /^Open (PDF|file)/i.test(row.link_label || '');
  const patch = { file_path: null, file_size_bytes: null };
  if (fileOwnsLink) { patch.link_url = null; patch.link_label = null; }
  const { error } = await window.sb.from('documents').update(patch).eq('id', docId);
  if (error) throw error;
};

window.uploadDocumentFile = async (docId, tripId, file) => {
  const ext  = file.name.split('.').pop().toLowerCase();
  const path = `${tripId}/${docId}.${ext}`;
  const { error: upErr } = await window.sb.storage
    .from('documents').upload(path, file, { upsert: true, contentType: file.type });
  if (upErr) throw upErr;

  const { data: { publicUrl } } = window.sb.storage
    .from('documents').getPublicUrl(path);

  const { error: dbErr } = await window.sb.from('documents').update({
    file_path:       path,
    file_size_bytes: file.size,
    link_url:        publicUrl,
    link_label:      'Open PDF',
  }).eq('id', docId);
  if (dbErr) throw dbErr;

  return publicUrl;
};

// Aggregate every expense the user can see (RLS scopes to their trips automatically)
// and compute the full lifetime-stats payload used by the Insights screen.
window.loadLifetimeStats = async () => {
  // Use '*' so missing columns (e.g. split_with before migration runs) don't error
  const { data, error } = await window.sb
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('loadLifetimeStats', error); return; }

  // Fetch settlements across all trips (RLS scopes them automatically).
  // Falls back to [] if the table doesn't exist yet (pre-migration 005).
  let allSettlements = [];
  try {
    const { data: sData, error: sErr } = await window.sb.from('settlements').select('*');
    if (!sErr) allSettlements = sData || [];
  } catch (_) {}

  const trips = window.TRIPS || [];
  const expenses = data || [];

  // ── Totals
  const totalSpentUSD = expenses.reduce((s, e) => s + (parseFloat(e.amount_usd) || 0), 0);
  const totalTrips    = trips.length;

  // ── Travel days (sum of unique trip durations)
  let totalDays = 0;
  trips.forEach((t) => {
    if (!t.startDate || !t.endDate) return;
    const ms = new Date(t.endDate) - new Date(t.startDate);
    totalDays += Math.max(1, Math.round(ms / 86400000) + 1);
  });

  // ── Distinct countries — union of every trip's countries[] array
  const countriesSet = new Set();
  trips.forEach((t) => {
    (t.countries || []).forEach((c) => c && countriesSet.add(c));
    if (t.country) countriesSet.add(t.country);
  });
  const countries = [...countriesSet];

  // ── By year
  const byYearMap = {};
  expenses.forEach((e) => {
    const y = new Date(e.created_at).getFullYear();
    byYearMap[y] = byYearMap[y] || { year: y, spent: 0, count: 0 };
    byYearMap[y].spent += parseFloat(e.amount_usd) || 0;
    byYearMap[y].count += 1;
  });
  // Track distinct countries per year so the yearly chart can show "ctry".
  const yearCountrySets = {};
  trips.forEach((t) => {
    if (!t.startDate) return;
    const y = new Date(t.startDate).getFullYear();
    byYearMap[y] = byYearMap[y] || { year: y, spent: 0, count: 0, trips: 0, days: 0 };
    byYearMap[y].trips = (byYearMap[y].trips || 0) + 1;
    const dur = t.endDate ? Math.round((new Date(t.endDate) - new Date(t.startDate)) / 86400000) + 1 : 1;
    byYearMap[y].days = (byYearMap[y].days || 0) + Math.max(1, dur);
    // Tally distinct countries (uses the trip's countries[] or fallback to country_code)
    yearCountrySets[y] = yearCountrySets[y] || new Set();
    const list = Array.isArray(t.countries) && t.countries.length > 0
      ? t.countries.filter(Boolean)
      : (t.country_code ? [t.country_code] : []);
    list.forEach((c) => yearCountrySets[y].add(c));
  });
  Object.keys(byYearMap).forEach((y) => {
    byYearMap[y].countries = yearCountrySets[y] ? yearCountrySets[y].size : 0;
  });
  const byYear = Object.values(byYearMap).sort((a, b) => a.year - b.year);

  // ── By month (last 12 months, including months with 0 spend) ──
  const now = new Date();
  const byMonth = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    byMonth.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      year: d.getFullYear(), month: d.getMonth(),
      spent: 0, count: 0,
    });
  }
  const monthIndex = Object.fromEntries(byMonth.map((m, i) => [m.key, i]));
  expenses.forEach((e) => {
    const dt = new Date(e.created_at);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    const idx = monthIndex[key];
    if (idx == null) return;
    byMonth[idx].spent += parseFloat(e.amount_usd) || 0;
    byMonth[idx].count += 1;
  });

  // ── By weekday (Sun..Sat across all expenses) — avg spend per active day ──
  const wkSpend = [0, 0, 0, 0, 0, 0, 0];
  const wkDays  = [new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set()];
  expenses.forEach((e) => {
    const dt = new Date(e.created_at);
    const wd = dt.getDay();
    wkSpend[wd] += parseFloat(e.amount_usd) || 0;
    wkDays[wd].add(dt.toISOString().slice(0, 10));
  });
  const byWeekday = wkSpend.map((spent, i) => ({
    day: i, spent, avg: wkDays[i].size > 0 ? spent / wkDays[i].size : 0,
  }));

  // ── By category (lifetime)
  const byCatMap = {};
  expenses.forEach((e) => {
    const c = e.category || 'misc';
    byCatMap[c] = (byCatMap[c] || 0) + (parseFloat(e.amount_usd) || 0);
  });
  const byCategory = Object.entries(byCatMap)
    .map(([key, value]) => ({ key, value, pct: totalSpentUSD > 0 ? (value / totalSpentUSD) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);

  // ── Per-trip spending
  const tripSpendMap = {};
  expenses.forEach((e) => {
    tripSpendMap[e.trip_id] = (tripSpendMap[e.trip_id] || 0) + (parseFloat(e.amount_usd) || 0);
  });
  // Per-trip personal balance for the current user
  const userId = window.currentUserId;
  const balanceByTrip = {};
  if (userId) {
    expenses.forEach((e) => {
      const splitters = Array.isArray(e.split_with) ? e.split_with.filter(Boolean) : [];
      const isShared = splitters.length > 0;
      const totalSharers = isShared ? splitters.length + 1 : 1;
      const share = (parseFloat(e.amount_usd) || 0) / totalSharers;
      balanceByTrip[e.trip_id] = balanceByTrip[e.trip_id] || 0;
      if (e.created_by === userId) {
        balanceByTrip[e.trip_id] += (parseFloat(e.amount_usd) || 0);
        if (isShared) balanceByTrip[e.trip_id] -= share;  // your share back
      } else if (isShared && splitters.includes(userId)) {
        balanceByTrip[e.trip_id] -= share;
      }
    });
    // Apply settlements (post-payment balance reduction)
    allSettlements.forEach((s) => {
      const amt = parseFloat(s.amount_usd) || 0;
      balanceByTrip[s.trip_id] = balanceByTrip[s.trip_id] || 0;
      if (s.from_user === userId)      balanceByTrip[s.trip_id] += amt;
      else if (s.to_user === userId)   balanceByTrip[s.trip_id] -= amt;
    });
  }

  const tripSpend = trips.map((t) => {
    const dur = (t.startDate && t.endDate)
      ? Math.max(1, Math.round((new Date(t.endDate) - new Date(t.startDate)) / 86400000) + 1)
      : 1;
    const spent = tripSpendMap[t.id] || 0;
    return {
      id: t.id, title: t.title, country: t.country, cover: t.cover, coverImageUrl: t.coverImageUrl,
      spent, dur, dailyAvg: spent / dur,
      budgetPlanned: t.budgetPlannedUSD || 0,
      startDate: t.startDate, endDate: t.endDate,
      personalBalance: balanceByTrip[t.id] || 0,
    };
  }).sort((a, b) => b.spent - a.spent);

  // ── Top transaction across history
  const topTx = expenses.reduce((m, e) => {
    const v = parseFloat(e.amount_usd) || 0;
    return v > (m?.value || 0) ? { value: v, when: e.created_at, trip_id: e.trip_id, category: e.category } : m;
  }, null);

  // ── Per-member contribution (across shared trips)
  const byMemberMap = {};
  expenses.forEach((e) => {
    if (!e.created_by) return;
    byMemberMap[e.created_by] = (byMemberMap[e.created_by] || 0) + (parseFloat(e.amount_usd) || 0);
  });
  const byMember = Object.entries(byMemberMap)
    .map(([userId, value]) => ({ userId, value, pct: totalSpentUSD > 0 ? (value / totalSpentUSD) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);

  // ── Status counts
  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
  const statusCounts = { current: 0, upcoming: 0, past: 0 };
  trips.forEach((t) => {
    if (!t.startDate || !t.endDate) { statusCounts.past++; return; }
    const s = new Date(t.startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(t.endDate); e.setHours(0, 0, 0, 0);
    if (todayMidnight < s) statusCounts.upcoming++;
    else if (todayMidnight > e) statusCounts.past++;
    else statusCounts.current++;
  });

  // ── Derived KPIs
  const longestTrip   = tripSpend.reduce((m, t) => t.dur > (m?.dur || 0) ? t : m, null);
  const mostExpensive = tripSpend[0] || null;  // already sorted by spent desc
  const avgTripCost   = tripSpend.length > 0 ? totalSpentUSD / tripSpend.length : 0;
  const avgDailyAcrossLifetime = totalDays > 0 ? totalSpentUSD / totalDays : 0;

  // ── Currency mix (which local currencies you've used)
  const currencyMix = [...new Set(expenses.map((e) => e.local_currency).filter(Boolean))];

  window.LIFETIME_STATS = {
    totalSpentUSD, totalTrips, totalDays, countries: countries.length, countriesList: countries,
    byYear, byMonth, byWeekday, byCategory, tripSpend, byMember, statusCounts,
    longestTrip, mostExpensive, avgTripCost, avgDailyAcrossLifetime,
    topTx, currencyMix, balanceByTrip,
    expenseCount: expenses.length,
    loadedAt: Date.now(),
  };
  return window.LIFETIME_STATS;
};

window.loadAuditLog = async (tripId) => {
  const { data, error } = await window.sb
    .from('audit_log')
    .select('*, profiles ( name, initials, avatar_hue )')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) { console.error('loadAuditLog', error); return; }

  window.AUDIT = (data || []).map((r) => ({
    id:     r.id,
    who:    r.user_id,
    action: r.action,
    target: r.target,
    when:   new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
};

// ── Write helpers ────────────────────────────────────────────

window.addExpense = async (tripId, userId, fields) => {
  const basePayload = {
    trip_id:        tripId,
    created_by:     userId,
    title:          fields.title,
    category:       fields.category,
    amount_usd:     fields.amountUSD,
    amount_local:   fields.amountLocal,
    local_currency: fields.localCurrency,
    note:           fields.note || null,
  };
  // Try with split_with first; if the column doesn't exist (migration not run),
  // gracefully fall back to a payload without it.
  let { data, error } = await window.sb.from('expenses')
    .insert({ ...basePayload, split_with: fields.splitWith || [] })
    .select().single();
  if (error && /split_with/i.test(error.message || '')) {
    ({ data, error } = await window.sb.from('expenses').insert(basePayload).select().single());
  }
  if (error) throw error;

  window.LIFETIME_STATS = null;  // invalidate so Insights re-aggregates next visit
  await window.sb.from('audit_log').insert({
    trip_id: tripId,
    user_id: userId,
    action:  'added',
    target:  fields.title,
  });
  return data;
};

// Update an existing document's editable fields.
window.updateDocument = async (docId, fields) => {
  if (!window.sb) throw new Error('Not signed in');
  const payload = {};
  if (fields.title !== undefined)    payload.title    = (fields.title || '').trim();
  if (fields.subtitle !== undefined) payload.subtitle = (fields.subtitle || '').trim() || null;
  if (fields.category !== undefined) payload.category = fields.category;
  if (fields.linkUrl !== undefined)  payload.link_url = (fields.linkUrl || '').trim() || null;
  if (fields.linkLabel !== undefined) payload.link_label = (fields.linkLabel || '').trim() || null;
  if (fields.details !== undefined)  payload.details  = fields.details || {};
  if (fields.costUSD !== undefined)  payload.cost_usd = fields.costUSD == null ? null : Number(fields.costUSD);
  if (fields.costLocal !== undefined) payload.cost_local = fields.costLocal == null ? null : Number(fields.costLocal);
  if (fields.costCurrency !== undefined) payload.cost_currency = fields.costCurrency || null;
  if (Object.keys(payload).length === 0) return;
  const { error } = await window.sb.from('documents').update(payload).eq('id', docId);
  if (error) throw error;
};

// Toggle "Add to expenses" — creates an expense linked to this document.
// Uses the doc's own cost columns and an automatic title like "Flight: …".
window.linkDocExpense = async (docId, tripId) => {
  if (!window.sb || !tripId) throw new Error('Missing context');
  const { data: doc, error: docErr } = await window.sb.from('documents')
    .select('*').eq('id', docId).single();
  if (docErr) throw docErr;
  if (doc.linked_expense_id) return doc.linked_expense_id;  // already linked
  if (doc.cost_usd == null || doc.cost_usd <= 0) throw new Error('Set a cost first');

  const CAT_MAP = { flights: 'transit', lodging: 'lodging', transport: 'transit', visas: 'misc' };
  const expenseCat = CAT_MAP[doc.category] || 'misc';
  const titlePrefix = doc.category === 'flights' ? '✈ ' : doc.category === 'lodging' ? '🏨 ' : doc.category === 'transport' ? '🚆 ' : '';

  const { data: exp, error: expErr } = await window.sb.from('expenses').insert({
    trip_id: tripId,
    created_by: window.currentUserId,
    title: (titlePrefix + (doc.title || 'Document')).slice(0, 100),
    category: expenseCat,
    amount_usd: Number(doc.cost_usd),
    amount_local: doc.cost_local != null ? Number(doc.cost_local) : null,
    local_currency: doc.cost_currency || null,
    note: doc.subtitle || null,
  }).select().single();
  if (expErr) throw expErr;

  const { error: linkErr } = await window.sb.from('documents')
    .update({ linked_expense_id: exp.id }).eq('id', docId);
  if (linkErr) throw linkErr;

  window.LIFETIME_STATS = null;
  await window.loadExpenses(tripId);
  await window.loadDocuments(tripId);
  return exp.id;
};

window.unlinkDocExpense = async (docId, tripId) => {
  if (!window.sb) throw new Error('Not signed in');
  const { data: doc } = await window.sb.from('documents')
    .select('linked_expense_id').eq('id', docId).single();
  if (!doc?.linked_expense_id) return;
  // ON DELETE SET NULL on linked_expense_id, so deleting the expense
  // also clears the pointer.
  await window.sb.from('expenses').delete().eq('id', doc.linked_expense_id);
  window.LIFETIME_STATS = null;
  await window.loadExpenses(tripId);
  await window.loadDocuments(tripId);
};

// Upload a SECONDARY file (e.g. boarding pass for flights, second photo
// for visas). Stored at {tripId}/{docId}-2.{ext} so the regular file stays
// at {tripId}/{docId}.{ext}.
window.uploadDocumentSecondaryFile = async (docId, tripId, file) => {
  if (!docId || !tripId || !file) throw new Error('Missing args');
  const ext = (file.name.split('.').pop() || 'pdf').toLowerCase();
  const path = `${tripId}/${docId}-2.${ext}`;
  const { error: upErr } = await window.sb.storage.from('documents')
    .upload(path, file, { upsert: true, contentType: file.type || 'application/pdf' });
  if (upErr) throw upErr;
  const { error: dbErr } = await window.sb.from('documents').update({
    secondary_file_path: path,
    secondary_file_size: file.size,
  }).eq('id', docId);
  if (dbErr && !/secondary/i.test(dbErr.message || '')) throw dbErr;
};

window.removeDocumentSecondaryFile = async (docId, secondaryPath) => {
  if (!window.sb) throw new Error('Not signed in');
  if (secondaryPath) {
    try { await window.sb.storage.from('documents').remove([secondaryPath]); } catch (_) {}
  }
  const { error } = await window.sb.from('documents').update({
    secondary_file_path: null, secondary_file_size: null,
  }).eq('id', docId);
  if (error && !/secondary/i.test(error.message || '')) throw error;
};

window.addDocument = async (tripId, userId, fields) => {
  const { data, error } = await window.sb.from('documents').insert({
    trip_id:     tripId,
    uploaded_by: userId,
    title:       fields.title,
    subtitle:    fields.subtitle || null,
    category:    fields.category,
    kind:        fields.kind || 'pdf',
    tint:        fields.tint || 'clay',
    link_url:    fields.linkUrl || null,
    link_label:  fields.linkLabel || null,
    details:     fields.details || {},
    cost_usd:    fields.costUSD != null ? Number(fields.costUSD) : null,
    cost_local:  fields.costLocal != null ? Number(fields.costLocal) : null,
    cost_currency: fields.costCurrency || null,
  }).select().single();
  if (error) throw error;

  await window.sb.from('audit_log').insert({
    trip_id: tripId,
    user_id: userId,
    action:  'uploaded',
    target:  fields.title,
  });
  return data;
};

// Load a single trip's full detail into window.TRIP
window.loadTripDetail = async (tripId) => {
  const { data, error } = await window.sb
    .from('trips').select('*').eq('id', tripId).single();
  if (error) { console.error('loadTripDetail', error); return; }
  const start = new Date(data.start_date);
  const end   = new Date(data.end_date);
  const today = new Date();
  const daysIn    = Math.max(1, Math.floor((today - start) / 86400000) + 1);
  const daysTotal = Math.max(1, Math.ceil((end - start) / 86400000));
  window.TRIP = {
    id:            data.id,
    title:         data.title,
    subtitle:      data.subtitle || '',
    dates:         window.fmtDateRange(data.start_date, data.end_date),
    startDate:     data.start_date,
    endDate:       data.end_date,
    country:       data.country_code || '',
    countries:     Array.isArray(data.countries) && data.countries.length > 0
                     ? data.countries.filter(Boolean)
                     : (data.country_code ? [data.country_code] : []),
    daysIn:        Math.min(daysIn, daysTotal),
    daysTotal,
    homeCurrency:  data.home_currency || 'USD',
    localCurrency: data.local_currency || 'USD',
    fx:            parseFloat(data.fx_rate) || 1,
    budget:        { plannedUSD: parseFloat(data.budget_planned_usd) || 0, spentUSD: 0 },
    cover:         data.cover_style || 'kyoto',
    coverImageUrl: data.cover_image_url || null,
    status:        data.status,
    weather:       { temp: '--', cond: '' },
    next:          { label: '', when: '' },
  };
};

// Upload a cover image and update the trip record
window.uploadTripCover = async (tripId, file) => {
  const ext  = file.name.split('.').pop();
  const path = `${window.currentUserId}/${tripId}.${ext}`;
  const { error: upErr } = await window.sb.storage
    .from('covers').upload(path, file, { upsert: true });
  if (upErr) throw upErr;

  const { data: { publicUrl } } = window.sb.storage
    .from('covers').getPublicUrl(path);

  const { error: dbErr } = await window.sb
    .from('trips').update({ cover_image_url: publicUrl }).eq('id', tripId);
  if (dbErr) throw dbErr;

  if (window.TRIP?.id === tripId) window.TRIP.coverImageUrl = publicUrl;
  return publicUrl;
};

window.createTrip = async (fields) => {
  const userId = window.currentUserId;
  if (!userId) throw new Error('Not signed in');

  // Generate a URL-safe id from title + year
  const slug = fields.title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 20) + '-' + new Date().getFullYear().toString().slice(2);
  const uniqueId = slug + '-' + Math.random().toString(36).slice(2, 6);

  const { data: trip, error: tripErr } = await window.sb.from('trips').insert({
    id:                 uniqueId,
    owner_id:           userId,
    title:              fields.title,
    subtitle:           fields.subtitle || null,
    start_date:         fields.startDate,
    end_date:           fields.endDate,
    country_code:       fields.countryCode || null,
    home_currency:      'USD',
    local_currency:     fields.localCurrency || 'USD',
    fx_rate:            fields.fxRate || 1,
    budget_planned_usd: fields.budgetUSD || null,
    cover_style:        fields.coverStyle || 'kyoto',
    status:             fields.status || 'upcoming',
  }).select().single();

  if (tripErr) throw tripErr;

  // Add owner as Admin member
  await window.sb.from('trip_members').insert({
    trip_id: trip.id,
    user_id: userId,
    role:    'Admin',
  });

  return trip;
};

window.removeMember = async (tripId, userId) => {
  const { error } = await window.sb.from('trip_members')
    .delete()
    .eq('trip_id', tripId)
    .eq('user_id', userId);
  if (error) throw error;
};

window.updateMemberRole = async (tripId, userId, role) => {
  const { error } = await window.sb.from('trip_members')
    .update({ role })
    .eq('trip_id', tripId)
    .eq('user_id', userId);
  if (error) throw error;
};

window.updateExpense = async (expenseId, tripId, fields) => {
  const baseUpdate = {
    title:          fields.title,
    category:       fields.category,
    amount_usd:     fields.amountUSD,
    amount_local:   fields.amountLocal,
    local_currency: fields.localCurrency,
    note:           fields.note || null,
  };
  let { error } = await window.sb.from('expenses')
    .update({ ...baseUpdate, split_with: fields.splitWith || [] })
    .eq('id', expenseId);
  if (error && /split_with/i.test(error.message || '')) {
    ({ error } = await window.sb.from('expenses').update(baseUpdate).eq('id', expenseId));
  }
  if (error) throw error;
  window.LIFETIME_STATS = null;
  await window.sb.from('audit_log').insert({
    trip_id: tripId,
    user_id: window.currentUserId,
    action:  'edited',
    target:  fields.title,
  });
};

window.deleteExpense = async (expenseId, tripId) => {
  const { error } = await window.sb.from('expenses').delete().eq('id', expenseId);
  if (error) throw error;
  window.LIFETIME_STATS = null;
  await window.sb.from('audit_log').insert({
    trip_id: tripId,
    user_id: window.currentUserId,
    action:  'removed',
    target:  `Expense ${expenseId}`,
  }).then(() => {});
};

window.updateExpenseLink = async (docId, linkUrl, linkLabel) => {
  const { error } = await window.sb.from('documents')
    .update({ link_url: linkUrl, link_label: linkLabel })
    .eq('id', docId);
  if (error) throw error;
};

window.deleteDocument = async (docId, tripId, title) => {
  const { error } = await window.sb.from('documents').delete().eq('id', docId);
  if (error) throw error;
  await window.sb.from('audit_log').insert({
    trip_id: tripId,
    user_id: window.currentUserId,
    action:  'removed',
    target:  title || `Document ${docId}`,
  }).then(() => {});
};

// ── Real-time subscriptions ───────────────────────────────────
// Returns an unsubscribe function — call it on component unmount.
// Idempotent: if a channel for this trip already exists, remove it first to avoid duplicate callbacks.
window._activeRtChannels = window._activeRtChannels || new Map();
window.subscribeToTrip = (tripId, onChange) => {
  // Tear down any existing channel for this trip first
  const existing = window._activeRtChannels.get(tripId);
  if (existing) { try { window.sb.removeChannel(existing); } catch (_) {} window._activeRtChannels.delete(tripId); }

  const channel = window.sb
    .channel(`trip:${tripId}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'expenses',
      filter: `trip_id=eq.${tripId}`,
    }, async () => {
      await window.loadExpenses(tripId);
      onChange?.();
    })
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'documents',
      filter: `trip_id=eq.${tripId}`,
    }, async () => {
      await window.loadDocuments(tripId);
      onChange?.();
    })
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'trip_members',
      filter: `trip_id=eq.${tripId}`,
    }, async () => {
      await window.loadMembers(tripId);
      onChange?.();
    })
    .subscribe();

  window._activeRtChannels.set(tripId, channel);
  return () => {
    try { window.sb.removeChannel(channel); } catch (_) {}
    window._activeRtChannels.delete(tripId);
  };
};

// ─────────────────────────────────────────────────────────────
// Live-refresh: wrap every loader so the React tree re-renders
// after the window.X cache updates. Fixes the "I deleted X but
// the row stays until I navigate away" bug. Applied centrally
// so individual screens don't have to remember to bump state.
// ─────────────────────────────────────────────────────────────
['loadTrips', 'loadTripDetail', 'loadMembers', 'loadExpenses',
 'loadDocuments', 'loadAuditLog', 'loadSettlements', 'loadItinerary',
 'loadLifetimeStats', 'loadTripInvites'].forEach((name) => {
  const orig = window[name];
  if (typeof orig !== 'function') return;
  window[name] = async (...args) => {
    const out = await orig(...args);
    try { window.notifyDataChange?.(); } catch (_) {}
    return out;
  };
});

