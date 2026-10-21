// "اقترح لي" — a full-screen suggestions page opened from the Plan.
//
// Pick a day (today or any later day), a kind of place (restaurants,
// museums…), browse rich cards, shuffle for other ideas, and add one to
// that day of the plan with its name and address filled in.
//
// Data: Tripadvisor via the `places` Edge Function (the API key never
// reaches the app). Tripadvisor allows caching only location ids, so
// results are kept in memory for this session only.

const SUGGEST_KINDS = [
  { key: 'food',     emoji: '🍽️', ar: 'مطاعم',        en: 'Restaurants', ta: 'restaurants', plan: 'food',
    q: ['restaurant', 'local food', 'grill', 'seafood', 'breakfast'] },
  { key: 'cafe',     emoji: '☕',  ar: 'مقاهي وحلا',   en: 'Cafés',       ta: 'restaurants', plan: 'food',
    q: ['cafe', 'coffee', 'dessert', 'bakery'] },
  { key: 'sights',   emoji: '🕌',  ar: 'معالم',        en: 'Landmarks',   ta: 'attractions', plan: 'sight',
    q: ['landmarks', 'historic sites', 'mosque', 'viewpoint'] },
  { key: 'museums',  emoji: '🏛️', ar: 'متاحف',        en: 'Museums',     ta: 'attractions', plan: 'sight',
    q: ['museum', 'art gallery', 'palace'] },
  { key: 'nature',   emoji: '🌳',  ar: 'طبيعة وحدائق', en: 'Nature',      ta: 'attractions', plan: 'sight',
    q: ['park', 'garden', 'beach', 'nature'] },
  { key: 'shopping', emoji: '🛍️', ar: 'تسوق',         en: 'Shopping',    ta: 'attractions', plan: 'misc',
    q: ['shopping mall', 'market', 'bazaar'] },
  { key: 'fun',      emoji: '🎢',  ar: 'ترفيه',        en: 'Fun',         ta: 'attractions', plan: 'misc',
    q: ['amusement park', 'aquarium', 'tours', 'boat tour'] },
];

window._suggestCache = window._suggestCache || new Map();

// Which hotel are we sleeping in on this day? (check-in ≤ day < check-out)
function _hotelForDay(iso) {
  const hotels = (window.DOCS_BY_CAT?.lodging || []);
  const day = (s) => (s ? String(s).slice(0, 10) : null);
  return hotels.find((h) => {
    const a = day(h.details?.check_in_at), b = day(h.details?.check_out_at);
    return a && iso >= a && (!b || iso < b);
  }) || null;
}

async function _placesCall(body) {
  if (!window.sb?.functions) throw new Error('offline');
  const { data, error } = await window.sb.functions.invoke('places', { body });
  if (error) {
    let code = '';
    try { code = (await error.context?.json?.())?.error || ''; } catch (_) {}
    const e = new Error(code || error.message || 'failed'); e.code = code; throw e;
  }
  if (data?.error) { const e = new Error(data.error); e.code = data.error; throw e; }
  return data;
}

function ScreenSuggest({ open, onClose, initialDay }) {
  const ar = !!window.isRTL;
  const trip = window.TRIP;
  const days = React.useMemo(() => {
    if (!trip?.startDate) return [];
    const out = [];
    const s = new Date(trip.startDate + 'T00:00:00');
    const e = new Date((trip.endDate || trip.startDate) + 'T00:00:00');
    for (let d = new Date(s), i = 1; d <= e; d.setDate(d.getDate() + 1), i++) out.push({ iso: window.localISO(d), n: i, date: new Date(d) });
    return out;
  }, [trip?.startDate, trip?.endDate]);
  const todayIso = window.localISO();
  const defaultDay = initialDay || (days.find((d) => d.iso >= todayIso) || days[0])?.iso;

  const [day, setDay] = React.useState(defaultDay);
  const [kind, setKind] = React.useState('food');
  const [variant, setVariant] = React.useState(0);
  const [sort, setSort] = React.useState('rating');
  const [nearText, setNearText] = React.useState('');
  const [editingNear, setEditingNear] = React.useState(false);
  const [state, setState] = React.useState({ loading: false, places: [], error: null });
  const [added, setAdded] = React.useState({});
  const [, force] = React.useReducer((x) => x + 1, 0);
  const listRef = React.useRef(null);

  React.useEffect(() => { if (open) { setDay(initialDay || defaultDay); } }, [open, initialDay]);

  const hotel = day ? _hotelForDay(day) : null;
  const near = nearText.trim() || (hotel ? hotel.title : (trip?.title || ''));
  const nearLabel = nearText.trim() ? nearText.trim() : hotel ? hotel.title : (trip?.title || '');
  const k = SUGGEST_KINDS.find((x) => x.key === kind) || SUGGEST_KINDS[0];
  const query = k.q[variant % k.q.length];

  // Resolve the anchor (hotel / typed place) to coordinates, then search.
  React.useEffect(() => {
    if (!open || !near) return;
    let alive = true;
    const lang = ar ? 'ar' : 'en';
    const cacheKey = `${near}|${k.ta}|${query}|${lang}`;
    const cached = window._suggestCache.get(cacheKey);
    if (cached) { setState({ loading: false, places: cached, error: null }); return; }
    setState((s) => ({ loading: true, places: [], error: null }));
    (async () => {
      try {
        const aKey = `anchor|${near}`;
        let anchor = window._suggestCache.get(aKey);
        if (anchor === undefined) {
          const addr = !nearText.trim() && hotel?.details?.address ? ` ${hotel.details.address}` : '';
          anchor = (await _placesCall({ action: 'anchor', query: near + addr, language: lang })).anchor || null;
          window._suggestCache.set(aKey, anchor);
        }
        const res = await _placesCall({
          action: 'suggest', category: k.ta, query,
          lat: anchor?.lat, lng: anchor?.lng, near, language: lang,
        });
        const places = res.places || [];
        window._suggestCache.set(cacheKey, places);
        if (alive) setState({ loading: false, places, error: null });
      } catch (e) {
        if (alive) setState({ loading: false, places: [], error: e.code || e.message || 'failed' });
      }
    })();
    return () => { alive = false; };
  }, [open, near, kind, variant, ar]);

  React.useEffect(() => { listRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' }); }, [kind, variant, day]);

  if (!open) return null;

  const dayInfo = days.find((d) => d.iso === day);
  const dayItems = (window.ITINERARY || []).filter((it) => it.dayDate === day);
  const inPlan = (p) => added[`${day}|${p.id}`] || dayItems.some((it) => it.title === p.name);
  const places = state.places.slice().sort((a, b) => sort === 'near'
    ? ((a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9))
    : ((b.rating || 0) - (a.rating || 0)) || (b.reviews - a.reviews));

  const addToPlan = async (p) => {
    try {
      await window.addItineraryItem(trip.id, {
        dayDate: day, title: p.name, category: k.plan,
        location: p.address || p.name, sortOrder: dayItems.length + 1,
      });
      await window.loadItinerary(trip.id);
      setAdded((m) => ({ ...m, [`${day}|${p.id}`]: true }));
      window.toast?.(ar ? `أُضيف لليوم ${dayInfo?.n} ✓` : `Added to day ${dayInfo?.n} ✓`, 'success');
      force();
    } catch (e) { window.toast?.(e.message || 'Failed', 'error'); }
  };

  const fmtDay = (d) => {
    const wd = d.date.toLocaleDateString(ar ? 'ar' : 'en', { weekday: 'short' });
    return { top: ar ? `يوم ${d.n}` : `Day ${d.n}`, sub: `${wd} ${d.date.getDate()}` };
  };
  const walk = (km) => km == null ? null : km < 1.6
    ? (ar ? `${Math.max(1, Math.round(km * 13))} د مشي` : `${Math.max(1, Math.round(km * 13))} min walk`)
    : (ar ? `${km} كم` : `${km} km`);

  const host = document.getElementById('app-shell');
  const page = (
    <div style={{ position: 'absolute', inset: 0, zIndex: 120, background: 'var(--cream)',
      display: 'flex', flexDirection: 'column', animation: 'sgUp 340ms cubic-bezier(.32,.72,0,1)' }}>
      <style>{`
        @keyframes sgUp { from { transform: translateY(100%) } to { transform: none } }
        @keyframes sgShimmer { 0% { background-position: -300px 0 } 100% { background-position: 300px 0 } }
        @keyframes sgIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        .sg-skel { background: linear-gradient(90deg, var(--cream-2) 0, var(--sand) 50%, var(--cream-2) 100%); background-size: 600px 100%; animation: sgShimmer 1.2s infinite linear; }
      `}</style>

      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 10px', background: 'var(--statement)', color: 'var(--statement-fg)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onClose} aria-label={ar ? 'إغلاق' : 'Close'} style={{
            width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.12)',
            color: 'inherit', display: 'grid', placeItems: 'center', fontSize: 18 }}>✕</button>
          <div style={{ flex: 1 }}>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1.1 }}>{ar ? 'اقترح لي ✨' : 'Suggest ✨'}</div>
            <button onClick={() => setEditingNear((v) => !v)} style={{
              marginTop: 3, fontSize: 12.5, color: 'var(--statement-sub)', display: 'inline-flex', gap: 4, alignItems: 'center',
              background: 'transparent', padding: 0, textAlign: 'start' }}>
              📍 {ar ? 'قرب' : 'Near'} <b style={{ color: 'var(--statement-fg)', fontWeight: 600 }}>{nearLabel || '—'}</b> <span style={{ opacity: 0.7 }}>✎</span>
            </button>
          </div>
        </div>
        {editingNear && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <input autoFocus defaultValue={nearText} placeholder={ar ? 'اسم منطقة أو مكان… (مثلاً تقسيم)' : 'An area or place…'}
              onKeyDown={(e) => { if (e.key === 'Enter') { setNearText(e.target.value); setEditingNear(false); } }}
              id="sg-near" style={{ flex: 1, minHeight: 40, borderRadius: 12, border: 'none', padding: '0 12px', fontSize: 14,
                background: 'rgba(255,255,255,0.95)', color: '#1d1a16' }} />
            <button onClick={() => { setNearText(document.getElementById('sg-near')?.value || ''); setEditingNear(false); }}
              style={{ padding: '0 14px', borderRadius: 12, background: 'var(--clay)', color: '#fff', fontWeight: 600, fontSize: 13 }}>
              {ar ? 'تم' : 'Go'}</button>
            {nearText && <button onClick={() => { setNearText(''); setEditingNear(false); }}
              style={{ padding: '0 10px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', color: 'inherit', fontSize: 12.5 }}>
              {ar ? 'الفندق' : 'Hotel'}</button>}
          </div>
        )}

        {/* Days */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', margin: '12px -18px 0', padding: '0 18px 4px' }}>
          {days.map((d) => {
            const on = d.iso === day; const f = fmtDay(d); const past = d.iso < todayIso;
            return (
              <button key={d.iso} onClick={() => setDay(d.iso)} style={{
                flexShrink: 0, minWidth: 62, padding: '7px 10px', borderRadius: 14,
                background: on ? 'var(--cream)' : 'rgba(255,255,255,0.08)',
                color: on ? 'var(--ink)' : 'var(--statement-fg)', opacity: past && !on ? 0.5 : 1,
                border: on ? 'none' : '0.5px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{f.top}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>{d.iso === todayIso ? (ar ? 'اليوم' : 'Today') : f.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kinds */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '12px 16px 8px', flexShrink: 0,
        borderBottom: '0.5px solid var(--hairline)' }}>
        {SUGGEST_KINDS.map((x) => {
          const on = x.key === kind;
          return (
            <button key={x.key} onClick={() => { setKind(x.key); setVariant(0); }} style={{
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40, padding: '0 14px',
              borderRadius: 999, fontSize: 13.5, fontWeight: 600,
              background: on ? 'var(--ink)' : 'var(--cream-2)', color: on ? 'var(--cream)' : 'var(--ink)',
              border: on ? 'none' : '0.5px solid var(--hairline)' }}>
              <span style={{ fontSize: 16 }}>{x.emoji}</span>{ar ? x.ar : x.en}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div ref={listRef} className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '10px 16px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 2px 10px' }}>
          <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-mute)' }}>
            {dayInfo && (ar
              ? `لليوم ${dayInfo.n}${dayItems.length ? ` · فيه ${dayItems.length} في الخطة` : ' · ما فيه شي في الخطة'}`
              : `For day ${dayInfo.n}${dayItems.length ? ` · ${dayItems.length} planned` : ' · nothing planned'}`)}
          </div>
          <div style={{ display: 'flex', padding: 2, borderRadius: 10, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)' }}>
            {[['rating', ar ? 'الأعلى تقييماً' : 'Top rated'], ['near', ar ? 'الأقرب' : 'Nearest']].map(([v, l]) => (
              <button key={v} onClick={() => setSort(v)} style={{ minHeight: 30, padding: '0 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: sort === v ? 'var(--ink)' : 'transparent', color: sort === v ? 'var(--cream)' : 'var(--ink-soft)' }}>{l}</button>
            ))}
          </div>
        </div>

        {state.loading && [0, 1, 2].map((i) => (
          <div key={i} style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 14, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)' }}>
            <div className="sg-skel" style={{ height: 170 }} />
            <div style={{ padding: 14 }}>
              <div className="sg-skel" style={{ height: 16, width: '60%', borderRadius: 6 }} />
              <div className="sg-skel" style={{ height: 12, width: '40%', borderRadius: 6, marginTop: 10 }} />
            </div>
          </div>
        ))}

        {state.error && (
          <div style={{ padding: '36px 22px', textAlign: 'center', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <div style={{ fontSize: 34 }}>🧭</div>
            <div className="serif" style={{ fontSize: 18, color: 'var(--ink)', margin: '6px 0' }}>
              {state.error === 'missing_key' || /not found|404|Failed to send/i.test(state.error)
                ? (ar ? 'الاقتراحات لسا ما تفعّلت' : 'Suggestions are not set up yet')
                : (ar ? 'ما قدرنا نجيب الاقتراحات' : "Couldn't load suggestions")}
            </div>
            <div style={{ fontSize: 13 }}>
              {state.error === 'missing_key' || /not found|404|Failed to send/i.test(state.error)
                ? (ar ? 'يحتاج تفعيل خدمة Tripadvisor في Supabase مرة وحدة.' : 'Tripadvisor needs to be connected in Supabase once.')
                : (ar ? 'تأكد من الاتصال وجرب مرة ثانية.' : 'Check your connection and try again.')}
            </div>
          </div>
        )}

        {!state.loading && !state.error && places.length === 0 && near && (
          <div style={{ padding: '36px 22px', textAlign: 'center', color: 'var(--ink-soft)' }}>
            {ar ? 'ما لقينا شي هنا. جرّب «اقتراحات غيرها» أو غيّر المكان من 📍 فوق.' : 'Nothing here — try other ideas or change the area.'}
          </div>
        )}

        {!state.loading && places.map((p, i) => {
          const on = inPlan(p);
          return (
            <div key={p.id} style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 14, background: 'var(--cream-2)',
              border: '0.5px solid var(--hairline)', boxShadow: 'var(--shadow-sm)', animation: `sgIn 360ms ${i * 50}ms both` }}>
              <div style={{ position: 'relative', height: 176, background: 'var(--sand)' }}>
                {p.photo
                  ? <img src={p.photo} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <div style={{ height: '100%', display: 'grid', placeItems: 'center', fontSize: 44 }}>{k.emoji}</div>}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0) 55%)' }} />
                <div style={{ position: 'absolute', insetInline: 14, bottom: 10, color: '#fff' }}>
                  <div dir="auto" style={{ textAlign: 'start', fontSize: 18, fontWeight: 700, lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.95, marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
                    {[p.tags.join(' · '), p.price, walk(p.distanceKm) && '🚶 ' + walk(p.distanceKm)].filter(Boolean).map((t, j) => (
                      <bdi key={j} style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(4px)' }}>{t}</bdi>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '10px 14px 14px' }}>
                {p.ratingImage && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 999,
                    padding: '4px 10px 4px 8px', direction: 'ltr' }}>
                    <img src={p.ratingImage} alt={`${p.rating} of 5`} style={{ height: 14, minWidth: 70 }} />
                    <span style={{ fontSize: 11.5, color: '#333' }}>{(p.reviews || 0).toLocaleString('en-US')}</span>
                  </div>
                )}
                {p.ranking && <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 6 }}>🏆 <bdi>{p.ranking}</bdi></div>}
                {p.description && (
                  <div dir="auto" style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.55, textAlign: 'start',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>
                )}
                {p.address && <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 6 }}>📍 <bdi>{p.address}</bdi></div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => !on && addToPlan(p)} disabled={on} style={{
                    flex: 1, minHeight: 44, borderRadius: 14, fontSize: 14, fontWeight: 700,
                    background: on ? 'oklch(0.50 0.08 155 / 0.14)' : 'var(--ink)', color: on ? 'var(--moss)' : 'var(--cream)' }}>
                    {on ? (ar ? `✓ في خطة اليوم ${dayInfo?.n}` : `✓ In day ${dayInfo?.n}`) : (ar ? `＋ أضف لليوم ${dayInfo?.n}` : `＋ Add to day ${dayInfo?.n}`)}
                  </button>
                  {p.webUrl && (
                    <a href={p.webUrl} target="_blank" rel="noopener" style={{
                      minHeight: 44, padding: '0 14px', borderRadius: 14, display: 'grid', placeItems: 'center',
                      background: 'var(--cream)', border: '0.5px solid var(--hairline)', color: 'var(--ink)', fontSize: 13, fontWeight: 600,
                      textDecoration: 'none' }}>{ar ? 'التفاصيل' : 'Details'}</a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {!state.loading && !state.error && places.length > 0 && (
          <>
            <button onClick={() => setVariant((v) => v + 1)} style={{
              width: '100%', minHeight: 50, borderRadius: 16, marginTop: 4, fontSize: 14.5, fontWeight: 700,
              background: 'var(--cream-2)', border: '1px dashed var(--ink-mute)', color: 'var(--ink)' }}>
              🔄 {ar ? 'اقتراحات غيرها' : 'Other ideas'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 18 }}>
              {ar ? 'التقييمات والصور من' : 'Ratings & photos from'} <b style={{ color: '#00AA6C' }}>Tripadvisor</b>
              {ar ? ` — حسب مسافري Tripadvisor في ${new Date().toLocaleDateString('ar', { month: 'long', year: 'numeric' })}`
                  : ` — according to Tripadvisor travelers as of ${new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}`}
            </div>
          </>
        )}
      </div>
    </div>
  );
  return host ? ReactDOM.createPortal(page, host) : page;
}

Object.assign(window, { ScreenSuggest, SUGGEST_KINDS });
