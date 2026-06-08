// App shell — auth gate + scoped navigation.
//   AUTH:    Sign in / Sign up (no nav)
//   APP:     Trips · Insights · Settings (no trip context)
//   TRIP:    Hub · Budget · Vault · Stats · Settings (Crew embedded in Settings)
//   DOC:     Modal-overlay doc detail page

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    () => window.matchMedia('(max-width: 500px)').matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 500px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sunset",
  "density": "comfortable",
  "showStatBadge": true,
  "startScreen": "trips",
  "dark": false,
  "lang": "en"
}/*EDITMODE-END*/;

const PALETTES = {
  sunset: { cream: 'oklch(0.965 0.012 80)',  cream2: 'oklch(0.945 0.016 78)',  clay: 'oklch(0.62 0.13 35)' },
  forest: { cream: 'oklch(0.96 0.012 130)',  cream2: 'oklch(0.94 0.016 130)',  clay: 'oklch(0.50 0.10 155)' },
  ocean:  { cream: 'oklch(0.96 0.012 230)',  cream2: 'oklch(0.94 0.014 220)',  clay: 'oklch(0.50 0.10 230)' },
  ink:    { cream: 'oklch(0.96 0.008 280)',  cream2: 'oklch(0.93 0.012 280)',  clay: 'oklch(0.42 0.10 285)' },
};

function App() {
  const isMobile = useIsMobile();
  const [tw, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Dismiss the cold-boot splash as soon as React has rendered once.
  // The splash itself enforces a minimum 1.4s show time so the animation
  // completes — calling this earlier just queues the fade.
  React.useEffect(() => {
    window.__hideSplash?.();
  }, []);

  // ── Set synchronously so every child render reads the correct values ──
  window.LANG = tw.lang;
  window.isRTL = tw.lang === 'ar';

  // ── Auth session ──
  const [session, setSession] = React.useState(undefined); // undefined = still checking
  const [dataVersion, setDataVersion] = React.useState(0); // bump to force re-render after data loads
  // Expose a global notifier so any helper (deleteExpense, loadDocuments, etc.)
  // can ask the React tree to re-render after mutating the window.X caches.
  // Avoids the "I deleted X but the row is still there until I navigate away" bug.
  React.useEffect(() => {
    window.notifyDataChange = () => setDataVersion((v) => v + 1);
    return () => { window.notifyDataChange = null; };
  }, []);
  const [tripLoading, setTripLoading] = React.useState(false);

  // Track active trip + realtime subscription so we can re-load after auth refresh / refetch on demand
  const rtUnsubRef    = React.useRef(null);
  const activeTripRef = React.useRef(null);
  const initialLoadDoneRef = React.useRef(false);

  const loadTripData = React.useCallback(async (tripId) => {
    if (!tripId) return;
    activeTripRef.current = tripId;
    setTripLoading(true);
    // Settle individually so one failure doesn't blank everything
    const results = await Promise.allSettled([
      window.loadTripDetail(tripId),
      window.loadExpenses(tripId),
      window.loadMembers(tripId),
      window.loadDocuments(tripId),
      window.loadAuditLog(tripId),
      window.loadSettlements(tripId),
      window.loadItinerary(tripId),
    ]);
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        const names = ['loadTripDetail','loadExpenses','loadMembers','loadDocuments','loadAuditLog'];
        console.error(`${names[i]} failed for ${tripId}:`, r.reason);
      }
    });
    setTripLoading(false);
    setDataVersion((v) => v + 1);

    if (rtUnsubRef.current) { rtUnsubRef.current(); rtUnsubRef.current = null; }
    rtUnsubRef.current = window.subscribeToTrip(tripId, () => {
      setDataVersion((v) => v + 1);
    });
  }, []);

  React.useEffect(() => {
    if (!window.sb) {
      console.warn('Supabase SDK not loaded — falling back to auth screen');
      setSession(null);
      return;
    }

    // Manually process recovery links that arrive as #reset&token_hash=...&type=recovery
    // (Supabase only auto-processes the legacy #access_token=... format.)
    (async () => {
      const hash = window.location.hash || '';
      if (hash.includes('token_hash=') && hash.includes('type=recovery')) {
        const params = new URLSearchParams(hash.replace(/^#/, '').replace(/^reset&/, ''));
        const token_hash = params.get('token_hash');
        if (token_hash) {
          window._authRecoveryActive = true;
          try {
            const { error } = await window.sb.auth.verifyOtp({ type: 'recovery', token_hash });
            if (error) throw error;
            window.location.hash = '';
          } catch (err) {
            console.error('Recovery verifyOtp failed', err);
            window.toast?.(err.message || 'Recovery link invalid or expired', 'error');
            window._authRecoveryActive = false;
          }
        }
      }
    })();

    const hydrateForUser = async (userId) => {
      window.currentUserId = userId;
      // Only wipe globals on the FIRST sign-in for this user; otherwise just refresh trips
      if (!initialLoadDoneRef.current) {
        window.clearAllMockData();
        initialLoadDoneRef.current = true;
      }
      try {
        // Load profile-level preferences FIRST so fmtMoney has a sane
        // fallback currency before any trip-list rendering kicks off.
        // Without this, the Trips home + Insights briefly render in USD
        // until the user opens a trip (which sets window.TRIP.homeCurrency).
        await window.loadUserPreferences?.(userId);
        await window.loadTrips(userId);
        // If we were inside a trip, reload its data too (auth refresh recovery)
        if (activeTripRef.current) {
          await loadTripData(activeTripRef.current);
        }
        setDataVersion((v) => v + 1);
      } catch (err) {
        console.error('hydrate failed', err);
      }
    };

    window.sb.auth.getSession()
      .then(({ data: { session: s }, error }) => {
        if (error) console.error('getSession error', error);
        if (s) hydrateForUser(s.user.id);
        setSession(s || null);
      })
      .catch((err) => {
        console.error('getSession threw', err);
        setSession(null);
      });

    // Filter auth events — TOKEN_REFRESHED / USER_UPDATED must NOT wipe data
    const { data: { subscription } } = window.sb.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_IN') {
        // Real sign-in (different user or first session) — full hydrate
        if (s && s.user.id !== window.currentUserId) {
          initialLoadDoneRef.current = false; // force wipe + reload
          activeTripRef.current = null;
        }
        if (s) hydrateForUser(s.user.id);
        setSession(s);
      } else if (event === 'SIGNED_OUT') {
        window.currentUserId = null;
        activeTripRef.current = null;
        initialLoadDoneRef.current = false;
        if (rtUnsubRef.current) { rtUnsubRef.current(); rtUnsubRef.current = null; }
        window.clearAllMockData();
        setSession(null);
        setDataVersion((v) => v + 1);
      } else if (event === 'PASSWORD_RECOVERY') {
        // User clicked the reset link → flip to the dedicated reset form
        window._authRecoveryActive = true;
        setSession((prev) => s || prev);
        setRoute({ scope: 'auth', name: 'reset' });
      } else {
        // TOKEN_REFRESHED, USER_UPDATED, INITIAL_SESSION — keep state intact
        setSession((prev) => s || prev);
      }
    });

    const timer = setTimeout(() => setSession((prev) => prev === undefined ? null : prev), 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
      if (rtUnsubRef.current) { rtUnsubRef.current(); rtUnsubRef.current = null; }
    };
  }, [loadTripData]);

  // route: { scope, name, tripId? }
  // scopes: 'auth' | 'app' | 'trip'
  // Restore the last route from sessionStorage so a reload doesn't lose context
  const [route, setRoute] = React.useState(() => {
    try {
      const saved = sessionStorage.getItem('voyage:route');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return { scope: 'auth', name: 'signin' };
  });

  // Persist route on every change so reloads restore the user where they were
  React.useEffect(() => {
    try { sessionStorage.setItem('voyage:route', JSON.stringify(route)); } catch (_) {}
  }, [route]);

  // Redirect after session resolves:
  //   - recovery session → keep them on reset screen
  //   - signed in + onboarded → trips
  //   - signed in + NOT onboarded → onboarding
  //   - signed out → signin
  React.useEffect(() => {
    if (session && !window._authRecoveryActive) {
      const onboarded = (() => {
        try { return localStorage.getItem('voyage:onboarded') === '1'; } catch (_) { return false; }
      })();
      setRoute((r) => {
        if (r.scope !== 'auth') return r;
        return onboarded ? { scope: 'app', name: 'trips' } : { scope: 'app', name: 'onboarding' };
      });
    } else if (session === null) {
      setRoute({ scope: 'auth', name: 'signin' });
    }
  }, [session]);

  // ── Invite-link redemption ────────────────────────────────────
  // On first boot, capture ?join=TOKEN from the URL and stash it.
  // When a session is active we redeem the stashed token, add the
  // user to trip_members, and route them straight to the trip.
  const [joining, setJoining] = React.useState(false);
  React.useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const token = u.searchParams.get('join');
      if (token) {
        sessionStorage.setItem('voyage:pendingInvite', token);
        u.searchParams.delete('join');
        window.history.replaceState({}, '', u.toString());
      }
    } catch (_) {}
  }, []);
  React.useEffect(() => {
    if (!session) return;
    const token = sessionStorage.getItem('voyage:pendingInvite');
    if (!token) return;
    sessionStorage.removeItem('voyage:pendingInvite');
    setJoining(true);
    (async () => {
      try {
        const res = await window.redeemInvite(token);
        if (res?.tripId) {
          try { localStorage.setItem('voyage:onboarded', '1'); } catch (_) {}
          await window.loadTrips(window.currentUserId);
          setRoute({ scope: 'trip', name: 'hub', tripId: res.tripId });
          loadTripData(res.tripId);
          window.toast?.(t('joinSuccess') || 'Joined trip', 'success');
        }
      } catch (err) {
        window.toast?.(err.message || 'Could not join trip', 'error');
      } finally {
        setJoining(false);
      }
    })();
  }, [session, loadTripData]);

  const [sheet, setSheet] = React.useState(null);
  const [docView, setDocView] = React.useState(null);
  const [editingExpense, setEditingExpense] = React.useState(null);
  const [prefillExpense, setPrefillExpense] = React.useState(null);
  const [showAddDoc, setShowAddDoc] = React.useState(false);
  const [showSettleUp, setShowSettleUp] = React.useState(false);
  const [showSearch,   setShowSearch]   = React.useState(false);
  const [imageOverlay, setImageOverlay] = React.useState(null);
  React.useEffect(() => { window.openImageOverlay = (src) => setImageOverlay(src); }, []);

  // DOM side-effects (palette, theme attribute, dir attribute)
  React.useEffect(() => {
    const p = PALETTES[tw.palette] || PALETTES.sunset;
    const r = document.documentElement.style;
    r.setProperty('--cream', p.cream);
    r.setProperty('--cream-2', p.cream2);
    r.setProperty('--clay', p.clay);
  }, [tw.palette]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tw.dark ? 'dark' : 'light');
  }, [tw.dark]);

  React.useEffect(() => {
    document.documentElement.setAttribute('dir', tw.lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', tw.lang);
  }, [tw.lang]);

  // ── Navigation helpers ──
  const go = (name) => {
    if (name === 'signin' || name === 'signup') setRoute({ scope: 'auth', name });
    else if (name === 'trips' || name === 'insights' || name === 'appSettings') setRoute({ scope: 'app', name });
    else {
      const tid = route.tripId || activeTripRef.current;
      if (!tid) { setRoute({ scope: 'app', name: 'trips' }); return; }
      setRoute({ scope: 'trip', name, tripId: tid });
    }
  };
  const goTrip = (tripId) => {
    setRoute({ scope: 'trip', name: 'hub', tripId });
    loadTripData(tripId);
  };

  // Self-healing: whenever the route is trip-scoped and the right trip isn't loaded, fetch it.
  // No tripLoading guard — loadTripData is idempotent via the realtime channel map.
  React.useEffect(() => {
    if (route.scope !== 'trip' || !route.tripId) return;
    if (!window.TRIP || window.TRIP.id !== route.tripId) {
      loadTripData(route.tripId);
    }
  }, [route.scope, route.tripId, loadTripData]);
  const openSheet = (s, payload) => {
    if (s === 'editExpense' && payload) setEditingExpense(payload);
    if (s === 'addExpense' && payload) setPrefillExpense(payload);
    if (s === 'addDoc') { setShowAddDoc(true); return; }       // full screen
    if (s === 'settleUp') { setShowSettleUp(true); return; }   // full screen
    if (s === 'search')   { setShowSearch(true);   return; }   // full screen
    setSheet(s);
  };
  const openDoc = (doc, category) => setDocView({ doc, category, prevRoute: route });

  // Resolve screen
  let screenNode;
  if (route.scope === 'auth') {
    const authMode = ['signup', 'forgot', 'reset'].includes(route.name) ? route.name : 'signin';
    screenNode = <window.ScreenAuth mode={authMode} go={go} />;
  } else if (route.scope === 'app') {
    if (route.name === 'onboarding') {
      screenNode = <window.ScreenOnboarding
        onComplete={(alsoCreateTrip) => {
          setRoute({ scope: 'app', name: 'trips' });
          if (alsoCreateTrip) setSheet('addTrip');
        }}
      />;
    }
    else if (route.name === 'insights') screenNode = <window.ScreenInsights go={go} goTrip={goTrip} />;
    else if (route.name === 'appSettings') screenNode = <window.ScreenAppSettings go={go} onSignOut={async () => { await window.sbSignOut(); }} dark={tw.dark} lang={tw.lang} onDarkToggle={(v) => setTweak('dark', v)} onLangChange={(v) => setTweak('lang', v)} />;
    else screenNode = <window.ScreenTrips go={go} goTrip={goTrip} />;
  } else {
    const Screen = {
      hub: window.ScreenHub, plan: window.ScreenPlan, budget: window.ScreenBudget, docs: window.ScreenDocs,
      analytics: window.ScreenAnalytics, settings: window.ScreenSettings,
    }[route.name] || window.ScreenHub;
    screenNode = <Screen go={go} goTrip={goTrip} openSheet={openSheet} openDoc={openDoc} loading={tripLoading} />;
  }

  // ── Loading screen while session is being resolved ──
  if (session === undefined) {
    const loadingInner = (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        background: 'var(--cream)',
      }}>
        <div className="serif-italic" style={{ fontSize: 28, color: 'var(--ink)' }}>voyage</div>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          border: '2.5px solid var(--hairline-2)',
          borderTopColor: 'var(--clay)',
          animation: 'appspin 0.8s linear infinite',
        }} />
        <style>{`@keyframes appspin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
    return isMobile
      ? <div style={{ position: 'fixed', inset: 0 }}>{loadingInner}</div>
      : <div className="device-stage"><IOSDevice width={402} height={874}>{loadingInner}</IOSDevice></div>;
  }

  const appShell = (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      {/* Key only changes when entering/exiting a trip (or switching trips) — */}
      {/* not on every tab switch. Prevents losing local screen state. */}
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',           // iOS momentum scroll
        overscrollBehavior: 'contain',              // don't bounce parent
      }}
           className="no-scrollbar"
           key={route.scope + ':' + (route.tripId || route.name)}>
        {screenNode}
      </div>

      {/* Doc detail overlay — slides over */}
      {docView && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 80, overflow: 'auto',
          animation: 'slideUpFull 280ms cubic-bezier(.2,.8,.2,1)',
        }} className="no-scrollbar">
          <window.ScreenDocDetail
            doc={docView.doc}
            category={docView.category}
            back={() => setDocView(null)}
            go={go}
            openSheet={openSheet} />
          <style>{`@keyframes slideUpFull { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        </div>
      )}

      {/* Nav layers — hidden during onboarding (it has its own flow) */}
      {route.scope === 'app' && route.name !== 'onboarding' &&
        <AppNav active={route.name} onChange={go} onAdd={() => openSheet('addTrip')} />}
      {route.scope === 'trip' && (
        <TripNav active={route.name} onChange={go} />
      )}

      <Sheet open={sheet === 'addTrip'} onClose={() => setSheet(null)} title={window.isRTL ? 'رحلة جديدة' : 'New trip'} height={0.88}>
        <AddTripSheet onDone={() => setSheet(null)} onCreated={(tripId) => {
          setSheet(null);
          window.loadTrips(window.currentUserId).then(() => setDataVersion((v) => v + 1));
          goTrip(tripId);
        }} />
      </Sheet>

      <Sheet open={sheet === 'share'} onClose={() => setSheet(null)} title={t('inviteTheCrew')} height={0.62}>
        <ShareSheet />
      </Sheet>
      <Sheet open={sheet === 'addExpense'} onClose={() => { setSheet(null); setPrefillExpense(null); }} title={t('addExpenseTitle')} height={0.78}>
        <AddExpenseSheet prefill={prefillExpense} onDone={() => { setSheet(null); setPrefillExpense(null); }} />
      </Sheet>
      <Sheet open={sheet === 'editExpense'} onClose={() => { setSheet(null); setEditingExpense(null); }}
             title={window.isRTL ? 'تعديل المصروف' : 'Edit expense'} height={0.82}>
        <AddExpenseSheet existing={editingExpense} onDone={() => { setSheet(null); setEditingExpense(null); }} />
      </Sheet>
      {/* Full-screen Add Document page */}
      {showAddDoc && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 85, overflow: 'auto',
          animation: 'slideUpFull 280ms cubic-bezier(.2,.8,.2,1)',
        }} className="no-scrollbar">
          <window.ScreenAddDoc
            back={() => setShowAddDoc(false)}
            onCreated={() => setShowAddDoc(false)} />
        </div>
      )}
      {/* Full-screen Settle Up */}
      {showSettleUp && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 85, overflow: 'auto',
          animation: 'slideUpFull 280ms cubic-bezier(.2,.8,.2,1)',
        }} className="no-scrollbar">
          <window.ScreenSettleUp back={() => setShowSettleUp(false)} />
        </div>
      )}
      {/* Full-screen Trip Search */}
      {showSearch && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 86, overflowY: 'auto', overflowX: 'hidden',
          animation: 'slideUpFull 240ms cubic-bezier(.2,.8,.2,1)',
        }} className="no-scrollbar">
          <window.ScreenTripSearch
            back={() => setShowSearch(false)}
            openSheet={openSheet}
            openDoc={openDoc}
            go={go}
          />
        </div>
      )}
      {joining && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 250,
          background: 'var(--cream)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '3px solid var(--hairline)', borderTopColor: 'var(--clay)',
            animation: 'expspin 0.7s linear infinite',
          }} />
          <div style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{t('joinJoining') || 'Joining trip…'}</div>
        </div>
      )}
      {imageOverlay && (
        <div
          onClick={() => setImageOverlay(null)}
          style={{
            position: 'absolute', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 180ms ease',
          }}
        >
          <img src={imageOverlay} alt="receipt"
            style={{ maxWidth: '94%', maxHeight: '92%', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={(e) => { e.stopPropagation(); setImageOverlay(null); }} style={{
            position: 'absolute', top: 14, insetInlineEnd: 14,
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.18)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none',
          }}>
            <window.IconClose size={16} stroke="currentColor" />
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
        background: 'var(--cream)',
        fontFamily: 'var(--sans)',
        WebkitFontSmoothing: 'antialiased',
        // Inherit theme + dir so all children flip together
      }} data-theme={tw.dark ? 'dark' : 'light'} dir={tw.lang === 'ar' ? 'rtl' : 'ltr'} lang={tw.lang}>
        {appShell}
        <ToastHost />
        <OfflineBanner />
        <ActionSheetHost />
      </div>
    );
  }

  return (
    <div className="device-stage">
      <IOSDevice width={402} height={874}>
        {appShell}
      </IOSDevice>
      <ToastHost />
      <OfflineBanner />
      <ActionSheetHost />

      <TweaksPanel>
        <TweakSection label="Theme">
          <TweakSelect label="Palette" value={tw.palette}
            options={['sunset', 'forest', 'ocean', 'ink']}
            onChange={(v) => setTweak('palette', v)} />
          <TweakToggle label="Dark mode" value={tw.dark}
            onChange={(v) => setTweak('dark', v)} />
        </TweakSection>
        <TweakSection label="Language">
          <TweakRadio label="Lang" value={tw.lang} options={['en', 'ar']}
            onChange={(v) => setTweak('lang', v)} />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakRadio label="Density" value={tw.density} options={['compact', 'comfortable']}
            onChange={(v) => setTweak('density', v)} />
          <TweakToggle label="Floating stat badge" value={tw.showStatBadge}
            onChange={(v) => setTweak('showStatBadge', v)} />
        </TweakSection>
        <TweakSection label="Jump · Auth">
          <div style={navGrid}>
            {[['signin', 'Sign in'], ['signup', 'Sign up']].map(([k, l]) => (
              <button key={k} onClick={() => setRoute({ scope: 'auth', name: k })}
                      style={navBtn(route.scope === 'auth' && route.name === k)}>{l}</button>
            ))}
          </div>
        </TweakSection>
        <TweakSection label="Jump · App">
          <div style={navGrid}>
            {[['trips', 'Trips'], ['insights', 'Insights'], ['appSettings', 'Settings']].map(([k, l]) => (
              <button key={k} onClick={() => setRoute({ scope: 'app', name: k })}
                      style={navBtn(route.scope === 'app' && route.name === k)}>{l}</button>
            ))}
          </div>
        </TweakSection>
        <TweakSection label="Jump · Trip Hub">
          <div style={navGrid}>
            {[['hub','Hub'],['budget','Budget'],['analytics','Stats'],['docs','Vault'],['settings','Settings']].map(([k, l]) => (
              <button key={k} onClick={() => setRoute({ scope: 'trip', name: k, tripId: 'kyoto-26' })}
                      style={navBtn(route.scope === 'trip' && route.name === k)}>{l}</button>
            ))}
          </div>
        </TweakSection>
        <TweakSection label="Doc detail">
          <button onClick={() => {
            const d = window.DOCS_BY_CAT.flights[0];
            const c = window.DOC_CATEGORIES.find((x) => x.key === 'flights');
            setDocView({ doc: d, category: c, prevRoute: route });
          }} style={navBtn(false)}>Preview a flight doc</button>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

const navGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 };
const navBtn = (active) => ({
  padding: '8px', borderRadius: 8,
  background: active ? '#222' : '#f5f5f5', color: active ? '#fff' : '#222',
  fontSize: 12, fontWeight: 500,
});

// Scroll-to-top: tap the currently-active tab to smooth-scroll to top.
function scrollActiveToTop() {
  const scroller = document.querySelector('[class="no-scrollbar"]:not(.ptr-indicator)') || document.querySelector('.no-scrollbar');
  if (!scroller) return;
  scroller.scrollTo?.({ top: 0, behavior: 'smooth' });
}

// ── App-scope bottom nav ──
function AppNav({ active, onChange, onAdd }) {
  const tabs = [
    { k: 'trips',       l: t('myTrips'),     i: IconCompass },
    { k: 'insights',    l: t('insightsNav'), i: IconSparkle },
    { k: 'appSettings', l: t('accountNav'),  i: IconGear },
  ];
  return (
    <div style={navShell}>
      {tabs.map((t) => {
        const isActive = active === t.k;
        return (
          <button key={t.k} onClick={() => isActive ? scrollActiveToTop() : onChange(t.k)} style={navItem(isActive)}>
            <t.i size={22} stroke="currentColor" />
            <span style={navLabel(isActive)}>{t.l}</span>
          </button>
        );
      })}
      <button onClick={onAdd} style={navAdd} aria-label="Add"><IconPlus size={22} stroke="#fff" /></button>
    </div>
  );
}

// ── Trip-scope bottom nav ──
function TripNav({ active, onChange }) {
  const tabs = [
    { k: 'hub',      l: t('hub'),       i: IconHome },
    { k: 'plan',     l: t('planNav'),   i: IconCompass },
    { k: 'budget',   l: t('budgetNav'), i: IconWallet },
    { k: 'docs',     l: t('vaultNav'),  i: IconDoc },
    { k: 'settings', l: t('settings'),  i: IconGear },
  ];
  return (
    <div style={navShell}>
      {tabs.map((t) => {
        const isActive = active === t.k;
        return (
          <button key={t.k} onClick={() => isActive ? scrollActiveToTop() : onChange(t.k)} style={navItem(isActive)}>
            <t.i size={22} stroke="currentColor" />
            <span style={navLabel(isActive)}>{t.l}</span>
          </button>
        );
      })}
    </div>
  );
}

// Classic iOS-style tab bar — flush to the bottom edge, full width, safe-area inset.
// Matches the cream theme; safe-area inset is part of the bar so iOS draws nothing
// underneath it (no white sliver under the home indicator).
const navShell = {
  position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
  padding: '8px 10px calc(8px + env(safe-area-inset-bottom))',
  background: 'var(--cream-2)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  borderTop: '0.5px solid var(--hairline)',
  boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 4,
};
// iOS tab item: icon stacked above label, both visible always
const navItem = (active) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
  padding: '4px 8px', borderRadius: 12,
  background: 'transparent',
  color: active ? 'var(--clay-deep)' : 'var(--ink-mute)',
  transition: 'color 200ms',
  flex: 1, minWidth: 0,
});
const navLabel = (active) => ({
  fontSize: window.isRTL ? 9.5 : 10.5,
  fontWeight: active ? 600 : 500,
  letterSpacing: '-0.005em',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  maxWidth: 64,
});
const navAdd = {
  width: 44, height: 44, borderRadius: 999,
  background: 'var(--clay)', display: 'grid', placeItems: 'center',
  boxShadow: '0 4px 12px oklch(0.62 0.13 35 / 0.6)',
  flexShrink: 0,
  alignSelf: 'center',
};

// ── Sheets ──
function ShareSheet() {
  const [copied, setCopied] = React.useState(false);
  const [inviteRole, setInviteRole] = React.useState('Editor');
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const tripId = window.TRIP?.id;
  const tripTitle = window.TRIP?.title || '';

  // Lazily fetch (or create) the invite for this trip+role on mount/role change
  React.useEffect(() => {
    if (!tripId) return;
    let cancelled = false;
    setLoading(true); setError(null); setToken(null);
    window.getOrCreateInvite(tripId, inviteRole)
      .then((tok) => { if (!cancelled) setToken(tok); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Could not create invite'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tripId, inviteRole]);

  const link = token ? window.inviteLink(token) : '';
  const shareMsg = (window.isRTL
    ? `انضم إلى رحلتنا "${tripTitle}" على Voyage:\n${link}`
    : `Join our trip "${tripTitle}" on Voyage:\n${link}`);

  const handleCopy = async () => {
    if (!link) return;
    try { await navigator.clipboard.writeText(link); }
    catch (_) {
      const el = document.createElement('textarea');
      el.value = link; document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!link) return;
    if (navigator.share) {
      try { await navigator.share({ title: tripTitle, text: shareMsg, url: link }); }
      catch (_) {}
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    if (!link) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, '_blank');
  };

  return (
    <div style={{ padding: '8px 22px 22px' }}>
      <div style={{
        background: 'var(--cream-2)', borderRadius: 22, padding: '22px 18px',
        border: '0.5px solid var(--hairline)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <div style={{ fontSize: 30 }}>✈️</div>
        <div className="serif" style={{ fontSize: 20, lineHeight: 1.1, textAlign: 'center' }}>
          {t('inviteHeadline')} {tripTitle}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', maxWidth: 280 }}>
          {t('inviteSubline')}
        </div>
      </div>

      {/* Role picker */}
      <div style={{ marginTop: 14 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 8, padding: '0 4px',
        }}>{t('inviteWithRole')}</div>
        <div style={{ display: 'flex', gap: 8, flexDirection: 'row' }}>
          {['Admin', 'Editor', 'Viewer'].map((r) => (
            <button key={r} onClick={() => setInviteRole(r)} style={{
              flex: 1, padding: '12px', borderRadius: 16,
              background: inviteRole === r ? 'var(--ink)' : 'var(--cream-2)',
              border: inviteRole === r ? 'none' : '0.5px solid var(--hairline)',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
              transition: 'all 180ms',
            }}>
              <RoleBadge role={r} />
              <div style={{ fontSize: 10.5, color: inviteRole === r ? 'var(--cream)' : 'var(--ink-mute)', textAlign: 'start' }}>
                {r === 'Admin' ? t('fullControl') : r === 'Editor' ? t('addExpenses') : t('readOnly')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Link row */}
      <div style={{
        marginTop: 14, padding: '12px 14px',
        background: 'var(--cream-2)', borderRadius: 16,
        border: '0.5px solid var(--hairline)',
        display: 'flex', alignItems: 'center', gap: 10,
        flexDirection: 'row',
      }}>
        <IconLink size={16} stroke="var(--ink-mute)" />
        <div className="mono" style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-soft)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {loading ? (t('inviteLoading') || '…') : (error ? '—' : link)}
        </div>
        <button onClick={handleCopy} disabled={!link} style={{
          padding: '6px 12px', borderRadius: 999,
          background: copied ? 'var(--moss)' : 'var(--ink)', color: 'var(--cream)',
          fontSize: 11, fontWeight: 500, transition: 'background 200ms', flexShrink: 0,
          opacity: link ? 1 : 0.4,
        }}>{copied ? '✓' : t('copy')}</button>
      </div>

      {error && (
        <div style={{
          marginTop: 10, padding: '10px 14px', borderRadius: 12,
          background: 'oklch(0.62 0.13 35 / 0.10)',
          border: '0.5px solid oklch(0.62 0.13 35 / 0.3)',
          fontSize: 12.5, color: 'var(--clay-deep)',
        }}>{error}</div>
      )}

      {/* Share buttons */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexDirection: 'row' }}>
        <button onClick={handleNativeShare} disabled={!link} style={{
          flex: 1, padding: '14px', borderRadius: 16,
          background: 'var(--clay)', color: '#fff',
          fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          flexDirection: 'row',
          opacity: link ? 1 : 0.5,
          boxShadow: '0 6px 16px oklch(0.62 0.13 35 / 0.35)',
        }}>
          <IconShare size={14} stroke="currentColor" />
          {t('inviteShareBtn')}
        </button>
        <button onClick={handleWhatsApp} disabled={!link} style={{
          flex: 1, padding: '14px', borderRadius: 16,
          background: 'var(--cream-2)', color: 'var(--ink)',
          border: '0.5px solid var(--hairline)',
          fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          flexDirection: 'row',
          opacity: link ? 1 : 0.5,
        }}>
          <span style={{ fontSize: 16 }}>💬</span>
          WhatsApp
        </button>
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-mute)', textAlign: 'center', padding: '0 8px' }}>
        {t('inviteExpiryHint')}
      </div>
    </div>
  );
}

const CAT_META = {
  lodging:  { emoji: '🏨', label_en: 'Lodging',   label_ar: 'الإقامة' },
  food:     { emoji: '🍜', label_en: 'Food',       label_ar: 'الطعام' },
  transit:  { emoji: '🚅', label_en: 'Transit',    label_ar: 'المواصلات' },
  culture:  { emoji: '🎌', label_en: 'Culture',    label_ar: 'الثقافة' },
  misc:     { emoji: '📎', label_en: 'Misc',       label_ar: 'متنوع' },
};
// Expose so any screen-file can pick the same category glyph instead of
// inventing its own (the Hub used a "first letter on color square" before,
// which was unreadable at the small thumbnail size).
window.CAT_META = CAT_META;

function AddExpenseSheet({ onDone, onAdded, existing, prefill }) {
  const trip    = window.TRIP;
  const members = window.MEMBERS || [];
  const cats    = window.CATEGORIES || [];
  const isEdit  = !!existing;

  const home  = trip?.homeCurrency  || 'USD';
  const local = trip?.localCurrency || home;
  const sameHomeLocal = home === local;

  // Pre-fill for edit mode: convert existing amountUSD back to the user's chosen display currency
  // Prefill (e.g. from a Plan activity): seeds title + category, user still types the amount.
  const [title,   setTitle]   = React.useState(existing?.title || prefill?.title || '');
  const [cat,     setCat]     = React.useState(existing?.cat   || prefill?.cat   || 'food');
  const [inputCur, setInputCur] = React.useState(existing ? home : (local !== home ? local : home));
  const [amt,     setAmt]     = React.useState(() => {
    if (!existing) return '';
    const rate = window.fxRate(home);
    return Math.round((existing.usd || 0) * rate * 100) / 100;
  });
  const [paidBy,  setPaidBy]  = React.useState(existing?.who || window.currentUserId || members[0]?.id || '');
  const [note,    setNote]    = React.useState(existing?.note || '');
  const [loading, setLoading] = React.useState(false);
  const [error,   setError]   = React.useState(null);

  // Split state — `splitMode` is one of 'everyone' | 'me' | 'custom'.
  // `customSet` holds the explicit user_ids when mode is 'custom'.
  // Saved to DB as the actual `split_with` array (excludes the payer).
  const isShared = members.length > 1;
  const initialSplit = (() => {
    if (existing) {
      const list = existing.splitWith || [];
      if (list.length === 0) return { mode: 'me', set: [] };
      // If list contains all OTHER members → 'everyone'
      const otherMemberIds = members.map((m) => m.id).filter((id) => id !== (existing.who));
      const isAll = list.length === otherMemberIds.length && otherMemberIds.every((id) => list.includes(id));
      return isAll ? { mode: 'everyone', set: list } : { mode: 'custom', set: list };
    }
    return { mode: isShared ? 'everyone' : 'me', set: [] };
  })();
  const [splitMode, setSplitMode] = React.useState(initialSplit.mode);
  const [customSet, setCustomSet] = React.useState(initialSplit.set);

  // Receipt photo state
  const [receiptFile, setReceiptFile] = React.useState(null);  // pending upload (new pick)
  const [receiptUrl,  setReceiptUrl]  = React.useState(existing?.receiptUrl || null);
  const [receiptPath, setReceiptPath] = React.useState(existing?.receiptPath || null);
  const [previewSrc,  setPreviewSrc]  = React.useState(null);  // object URL for File preview
  const receiptInputRef = React.useRef(null);

  React.useEffect(() => {
    if (!receiptFile) { setPreviewSrc(null); return; }
    const url = URL.createObjectURL(receiptFile);
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [receiptFile]);

  const amtNum   = parseFloat(amt) || 0;

  // Compute the split_with array based on mode
  const computeSplitWith = () => {
    if (splitMode === 'me') return [];
    if (splitMode === 'everyone') return members.map((m) => m.id).filter((id) => id !== paidBy);
    return customSet.filter((id) => id !== paidBy);
  };
  const splitWithIds = computeSplitWith();
  const totalSharers = splitWithIds.length + 1;
  const sharePerPerson = totalSharers > 1 ? (amtNum / totalSharers) : null;
  // Convert input to USD (canonical storage) via the FX table.
  const amtUSD   = window.toUSD(amtNum, inputCur);
  // For display in the "other" currency
  const otherCur = inputCur === home ? local : home;
  const otherVal = amtUSD * window.fxRate(otherCur);
  // For amount_local column (always in the trip's local currency, if different from USD)
  const amtLocalForDB = local !== 'USD' ? amtUSD * window.fxRate(local) : null;

  const handleSave = async () => {
    if (!title.trim() || amtNum <= 0) {
      setError(t('fillRequired') || 'Enter a title and amount');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const createdBy = paidBy || window.currentUserId;
      const payload = {
        title: title.trim(),
        category: cat,
        amountUSD: amtUSD,
        amountLocal: amtLocalForDB,
        localCurrency: local,
        note: note.trim() || null,
        splitWith: splitWithIds,
      };
      let expenseId;
      if (isEdit) {
        await window.updateExpense(existing.id, trip?.id || 'demo', payload);
        expenseId = existing.id;
      } else {
        const inserted = await window.addExpense(trip?.id || 'demo', createdBy, payload);
        expenseId = inserted?.id;
      }
      // Upload receipt if one was picked (after the row exists so we have the id)
      if (receiptFile && expenseId) {
        try {
          await window.uploadReceipt(expenseId, trip?.id, receiptFile);
        } catch (e) {
          window.toast?.(e.message || 'Receipt upload failed', 'error');
        }
      } else if (isEdit && !receiptFile && !receiptUrl && existing?.receiptPath) {
        // User cleared an existing receipt
        try { await window.deleteReceipt(existing.id, existing.receiptPath); } catch (_) {}
      }
      await window.loadExpenses(trip?.id || 'demo');
      onAdded?.();
      onDone();
    } catch (err) {
      setError(err.message);
      window.toast?.(err.message || 'Failed to save expense', 'error');
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: '100%', padding: '13px 14px', borderRadius: 14,
    border: '0.5px solid var(--hairline)',
    background: 'var(--cream)', color: 'var(--ink)',
    fontSize: 14, fontFamily: 'var(--sans)', outline: 'none',
    textAlign: 'start',
  };

  return (
    <div style={{ padding: '4px 22px 28px' }}>

      {/* Amount hero */}
      <div style={{
        background: 'var(--statement)', borderRadius: 22, padding: '18px 20px',
        color: 'var(--statement-fg)', marginBottom: 14,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(60% 50% at 90% 0%, oklch(0.42 0.10 35 / 0.5) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        {/* Currency toggle — Home ↔ Local (only when they differ) */}
        <div style={{
          position: 'relative', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 10,
          flexDirection: 'row',
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.72 }}>
            {inputCur} {window.isRTL ? 'المبلغ' : 'AMOUNT'}
          </div>
          {!sameHomeLocal && (
            <button onClick={() => setInputCur(inputCur === home ? local : home)} style={{
              padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
              background: 'rgba(255,255,255,0.12)', color: 'var(--statement-fg)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <IconSwap size={11} stroke="currentColor" /> {otherCur}
            </button>
          )}
        </div>
        {/* Amount input styled as display */}
        <input
          type="number" inputMode="decimal"
          value={amt} onChange={(e) => setAmt(e.target.value)}
          placeholder="0"
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'var(--serif)', fontSize: 52, lineHeight: 1,
            color: 'var(--statement-fg)', width: '100%',
            textAlign: 'start',
          }}
        />
        <div style={{ fontSize: 12, opacity: 0.72, marginTop: 4 }}>
          {!sameHomeLocal && amtNum > 0
            ? `≈ ${(window.CUR_SYM[otherCur] || (otherCur + ' '))}${otherVal.toLocaleString('en', { maximumFractionDigits: window.CUR_WHOLE.has(otherCur) ? 0 : 2 })}`
            : ''}
        </div>
      </div>

      {/* Title / Vendor */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase' }}>
          {window.isRTL ? 'الاسم / المكان' : 'Vendor / Description'}
        </div>
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={window.isRTL ? 'مطعم، فندق، وسيلة نقل...' : 'Restaurant, hotel, transport...'}
          style={fieldStyle}
        />
      </div>

      {/* Category */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase' }}>
          {window.isRTL ? 'الفئة' : 'Category'}
        </div>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', flexDirection: 'row' }} className="no-scrollbar">
          {cats.map((c) => {
            const meta = CAT_META[c.key] || {};
            const active = cat === c.key;
            return (
              <button key={c.key} onClick={() => setCat(c.key)} style={{
                flexShrink: 0, padding: '9px 13px', borderRadius: 14,
                background: active ? c.color : 'var(--cream-2)',
                color: active ? '#fff' : 'var(--ink-soft)',
                border: active ? 'none' : '0.5px solid var(--hairline)',
                fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6,
                flexDirection: 'row',
                transition: 'all 160ms',
              }}>
                <span style={{ fontSize: 16 }}>{meta.emoji}</span>
                <span>{window.isRTL ? (meta.label_ar || c.label) : c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Paid by */}
      {members.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase' }}>
            {window.isRTL ? 'دفع بواسطة' : 'Paid by'}
          </div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 7, overflowX: 'auto', flexDirection: 'row', paddingBottom: 2 }}>
            {members.map((m) => {
              const active = paidBy === m.id;
              return (
                <button key={m.id} onClick={() => setPaidBy(m.id)} style={{
                  flexShrink: 0, minWidth: 70, padding: '10px 8px', borderRadius: 14,
                  background: active ? 'var(--statement)' : 'var(--cream-2)',
                  border: active ? 'none' : '0.5px solid var(--hairline)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  transition: 'all 160ms',
                }}>
                  <Avatar m={m} size={28} />
                  <span style={{ fontSize: 10.5, fontWeight: 500, color: active ? 'var(--statement-fg)' : 'var(--ink-soft)', maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Split with — only visible on shared trips (≥2 members) */}
      {isShared && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase' }}>
            {t('splitWithLabel')}
          </div>
          {/* 3-mode segmented picker */}
          <div style={{
            display: 'inline-flex', padding: 3, background: 'var(--cream-2)', borderRadius: 12,
            border: '0.5px solid var(--hairline)', width: '100%',
          }}>
            {[
              { k: 'everyone', l: t('splitEveryone') },
              { k: 'me',       l: t('splitJustMe') },
              { k: 'custom',   l: t('splitCustom') },
            ].map((s) => (
              <button key={s.k} onClick={() => setSplitMode(s.k)} style={{
                flex: 1, padding: '8px', borderRadius: 9, fontSize: 12, fontWeight: 500,
                background: splitMode === s.k ? 'var(--ink)' : 'transparent',
                color: splitMode === s.k ? 'var(--cream)' : 'var(--ink-soft)',
                transition: 'all 180ms',
              }}>{s.l}</button>
            ))}
          </div>
          {/* Custom: chip picker for members (excluding the payer) */}
          {splitMode === 'custom' && (
            <div className="no-scrollbar" style={{
              display: 'flex', gap: 6, overflowX: 'auto', flexDirection: 'row',
              marginTop: 8, paddingBottom: 2,
            }}>
              {members.filter((m) => m.id !== paidBy).map((m) => {
                const on = customSet.includes(m.id);
                return (
                  <button key={m.id} onClick={() => {
                    setCustomSet((prev) => on ? prev.filter((x) => x !== m.id) : [...prev, m.id]);
                  }} style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 10px 6px 6px', borderRadius: 999,
                    background: on ? 'var(--statement)' : 'var(--cream-2)',
                    color: on ? 'var(--statement-fg)' : 'var(--ink-soft)',
                    border: on ? 'none' : '0.5px solid var(--hairline)',
                    transition: 'all 160ms',
                  }}>
                    <Avatar m={m} size={22} />
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{m.name.split(' ')[0]}</span>
                    {on && <IconCheck size={11} stroke="currentColor" />}
                  </button>
                );
              })}
            </div>
          )}
          {/* Live share-per-person preview */}
          {totalSharers > 1 && amtNum > 0 && (
            <div style={{
              marginTop: 8, padding: '8px 12px', borderRadius: 10,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              flexDirection: 'row', fontSize: 11.5,
            }}>
              <span style={{ color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
                {t('splitWithCount').replace('{n}', totalSharers)}
              </span>
              <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
                {t('splitYourShare')}: {window.fmtMoney(window.toUSD(sharePerPerson, inputCur), { in: inputCur })}
              </span>
            </div>
          )}
          {splitMode === 'me' && (
            <div style={{
              marginTop: 8, fontSize: 11.5, color: 'var(--ink-mute)',
              fontStyle: 'italic', paddingInlineStart: 4,
            }}>
              ⓘ {t('splitCovered')}
            </div>
          )}
        </div>
      )}

      {/* Note (optional) */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase' }}>
          {window.isRTL ? 'ملاحظة (اختياري)' : 'Note (optional)'}
        </div>
        <input
          type="text" value={note} onChange={(e) => setNote(e.target.value)}
          placeholder={window.isRTL ? 'تفاصيل إضافية...' : 'Extra details...'}
          style={fieldStyle}
        />
      </div>

      {/* Receipt photo */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase' }}>
          {t('receiptLabel')}
        </div>
        <input
          ref={receiptInputRef} type="file" accept="image/*" capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files && e.target.files[0];
            if (f) setReceiptFile(f);
            e.target.value = '';
          }}
        />
        {(previewSrc || receiptUrl) ? (
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center',
            padding: 10, borderRadius: 14,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
            flexDirection: 'row',
          }}>
            <img
              src={previewSrc || receiptUrl}
              alt="receipt"
              onClick={() => window.openImageOverlay?.(previewSrc || receiptUrl)}
              style={{
                width: 58, height: 58, objectFit: 'cover',
                borderRadius: 10, border: '0.5px solid var(--hairline)',
                cursor: 'zoom-in', flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>
                {receiptFile ? receiptFile.name : (window.isRTL ? 'الإيصال الحالي' : 'Current receipt')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>
                {t('receiptHint')}
              </div>
            </div>
            <button onClick={() => receiptInputRef.current?.click()} style={{
              padding: '7px 11px', borderRadius: 10, fontSize: 11.5, fontWeight: 500,
              background: 'var(--cream)', border: '0.5px solid var(--hairline)',
              color: 'var(--ink-soft)',
            }}>{t('receiptReplace')}</button>
            <button onClick={() => { setReceiptFile(null); setReceiptUrl(null); setReceiptPath(null); }} style={{
              padding: '7px 9px', borderRadius: 10,
              background: 'transparent', color: 'var(--clay-deep)',
              border: '0.5px solid var(--hairline)',
            }}>
              <IconTrash size={13} stroke="currentColor" />
            </button>
          </div>
        ) : (
          <button onClick={() => receiptInputRef.current?.click()} style={{
            width: '100%', padding: '14px', borderRadius: 14,
            background: 'var(--cream-2)', border: '1px dashed var(--hairline-2)',
            color: 'var(--ink-soft)', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            flexDirection: 'row',
          }}>
            <IconCamera size={16} stroke="currentColor" />
            <span>{t('receiptAdd')}</span>
          </button>
        )}
      </div>

      {error && (
        <div style={{
          marginBottom: 10, padding: '10px 14px', borderRadius: 12,
          background: 'oklch(0.62 0.13 35 / 0.10)',
          border: '0.5px solid oklch(0.62 0.13 35 / 0.3)',
          fontSize: 12.5, color: 'var(--clay-deep)',
        }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: 10, flexDirection: 'row' }}>
        {isEdit && (
          <button onClick={async () => {
            if (!confirm(window.isRTL ? 'حذف هذا المصروف؟' : 'Delete this expense?')) return;
            setLoading(true);
            try {
              await window.deleteExpense(existing.id, trip?.id);
              await window.loadExpenses(trip?.id);
              onAdded?.();
              onDone();
            } catch (err) { setError(err.message); setLoading(false); }
          }} disabled={loading} style={{
            padding: '16px 18px', borderRadius: 18,
            background: 'var(--cream-2)', color: 'var(--clay-deep)',
            border: '0.5px solid var(--hairline-2)',
            fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <IconTrash size={14} stroke="currentColor" /> {window.isRTL ? 'حذف' : 'Delete'}
          </button>
        )}
        <button onClick={handleSave} disabled={loading} style={{
          flex: 1, padding: '16px', borderRadius: 18,
          background: loading ? 'var(--ink-soft)' : 'var(--clay)', color: '#fff',
          fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
          boxShadow: loading ? 'none' : '0 8px 20px oklch(0.62 0.13 35 / 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          flexDirection: 'row',
        }}>
          {loading ? (
            <span style={{
              width: 16, height: 16, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
              display: 'inline-block', animation: 'expspin 0.7s linear infinite',
            }} />
          ) : (isEdit
              ? (window.isRTL ? 'حفظ التعديلات' : 'Save changes')
              : (window.isRTL ? `إضافة — ${trip?.title || ''}` : `Add to ${trip?.title || 'trip'}`))}
        </button>
      </div>
      <style>{`@keyframes expspin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function AddDocSheet({ onDone }) {
  const [cat,     setCat]     = React.useState('flights');
  const [title,   setTitle]   = React.useState('');
  const [link,    setLink]    = React.useState('');
  const [drag,    setDrag]    = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error,   setError]   = React.useState(null);
  const fileRef = React.useRef(null);

  const tints = { flights: 'indigo', lodging: 'clay', visas: 'moss', transport: 'honey' };
  const tintFills = { indigo:'var(--indigo)', moss:'var(--moss)', clay:'var(--clay)', honey:'var(--honey)' };

  const handleSave = async () => {
    if (!title.trim()) { setError(window.isRTL ? 'أدخل عنواناً' : 'Enter a title'); return; }
    setLoading(true); setError(null);
    try {
      const tripId = window.TRIP?.id;
      const userId = window.currentUserId;
      if (!tripId || !userId) throw new Error('No active trip or session');
      await window.addDocument(tripId, userId, {
        title: title.trim(),
        category: cat,
        kind: 'pdf',
        tint: tints[cat] || 'clay',
        linkUrl: link.trim() || null,
        linkLabel: link.trim() ? 'Link' : null,
      });
      await window.loadDocuments(tripId);
      onDone();
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div style={{ padding: '8px 22px 22px' }}>
      {/* Title */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase' }}>
          {window.isRTL ? 'العنوان' : 'Title'}
        </div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={window.isRTL ? 'اسم المستند...' : 'Document name...'}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '0.5px solid var(--hairline)', background: 'var(--cream)', color: 'var(--ink)', fontSize: 14, outline: 'none', textAlign: 'start' }} />
      </div>

      {/* Drop zone / file trigger */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); }}
        style={{
          padding: '18px', borderRadius: 18, textAlign: 'center',
          background: drag ? 'oklch(0.62 0.13 35 / 0.10)' : 'var(--cream-2)',
          border: drag ? '1.5px dashed var(--clay)' : '1.5px dashed var(--sand-deep)',
          cursor: 'pointer', transition: 'all 200ms',
        }}>
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files[0] && !title) setTitle(e.target.files[0].name.replace(/\.[^.]+$/, '')); }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--ink)', color: 'var(--cream)', display: 'grid', placeItems: 'center' }}>
            <IconUpload size={18} />
          </div>
          <div style={{ textAlign: 'start' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
              {drag ? t('dropHere') : t('uploadHint')}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>{t('pdfJpgPng')}</div>
          </div>
        </div>
      </div>

      {/* Optional link */}
      <div style={{ margin: '12px 0' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase' }}>
          {window.isRTL ? 'رابط (اختياري)' : 'Link (optional)'}
        </div>
        <input type="url" value={link} onChange={(e) => setLink(e.target.value)}
          placeholder="https://maps.google.com/..."
          style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '0.5px solid var(--hairline)', background: 'var(--cream)', color: 'var(--ink)', fontSize: 13, fontFamily: 'var(--mono)', outline: 'none', textAlign: 'start' }} />
      </div>

      {/* Category */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, flexDirection: 'row' }} className="no-scrollbar">
        {(window.DOC_CATEGORIES || []).map((c) => (
          <button key={c.key} onClick={() => setCat(c.key)} style={{
            padding: '9px 13px', borderRadius: 14, flexShrink: 0,
            background: cat === c.key ? (tintFills[c.tint] || 'var(--ink)') : 'var(--cream-2)',
            color: cat === c.key ? '#fff' : 'var(--ink-soft)',
            border: '0.5px solid var(--hairline)', fontSize: 12.5, fontWeight: 500,
          }}>{c.label}</button>
        ))}
      </div>

      {error && <div style={{ marginBottom: 10, padding: '8px 12px', borderRadius: 10, background: 'oklch(0.62 0.13 35 / 0.10)', fontSize: 12.5, color: 'var(--clay-deep)' }}>{error}</div>}

      <button onClick={handleSave} disabled={loading} style={{
        width: '100%', padding: '15px', borderRadius: 16,
        background: loading ? 'var(--ink-soft)' : 'var(--ink)', color: 'var(--cream)',
        fontSize: 13.5, fontWeight: 600,
      }}>
        {loading ? '...' : `${window.isRTL ? 'إضافة إلى' : 'Add to'} ${(window.DOC_CATEGORIES || []).find((c) => c.key === cat)?.label || cat}`}
      </button>
    </div>
  );
}

// ── Add Trip Sheet ────────────────────────────────────────────
function AddTripSheet({ onDone, onCreated }) {
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const [title,     setTitle]     = React.useState('');
  const [subtitle,  setSubtitle]  = React.useState('');
  const [startDate, setStart]     = React.useState(today);
  const [endDate,   setEnd]       = React.useState(nextWeek);
  const [budget,    setBudget]    = React.useState('');
  const [currency,  setCurrency]  = React.useState('USD');
  const [loading,   setLoading]   = React.useState(false);
  const [error,     setError]     = React.useState(null);

  const CURRENCIES = ['USD','EUR','GBP','JPY','AED','SAR','EGP','MAD','TRY','INR'];
  const STATUS = startDate > today ? 'upcoming' : endDate < today ? 'past' : 'active';

  const fieldStyle = {
    width: '100%', padding: '13px 14px', borderRadius: 14,
    border: '0.5px solid var(--hairline)',
    background: 'var(--cream)', color: 'var(--ink)',
    fontSize: 14, outline: 'none',
    textAlign: 'start',
  };
  const labelStyle = {
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
    color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 6, display: 'block',
  };

  const handleSave = async () => {
    if (!title.trim()) { setError(window.isRTL ? 'أدخل اسم الرحلة' : 'Enter a trip name'); return; }
    if (!startDate || !endDate) { setError(window.isRTL ? 'أدخل التواريخ' : 'Enter dates'); return; }
    if (endDate < startDate) { setError(window.isRTL ? 'تاريخ النهاية قبل البداية' : 'End date must be after start'); return; }
    setLoading(true); setError(null);
    try {
      const trip = await window.createTrip({
        title:         title.trim(),
        subtitle:      subtitle.trim() || null,
        startDate,
        endDate,
        localCurrency: currency !== 'USD' ? currency : 'USD',
        budgetUSD:     budget ? parseFloat(budget) : null,
        status: STATUS,
      });
      onCreated(trip.id);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div style={{ padding: '4px 22px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Title */}
      <div>
        <label style={labelStyle}>{window.isRTL ? 'اسم الرحلة *' : 'Trip name *'}</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={window.isRTL ? 'مثال: طوكيو · الربيع' : 'e.g. Tokyo · Spring'}
          style={fieldStyle} />
      </div>

      {/* Subtitle */}
      <div>
        <label style={labelStyle}>{window.isRTL ? 'وصف مختصر' : 'Subtitle'}</label>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
          placeholder={window.isRTL ? 'مثال: رحلة شهر العسل' : 'e.g. Honeymoon trip'}
          style={fieldStyle} />
      </div>

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>{window.isRTL ? 'تاريخ البداية *' : 'Start date *'}</label>
          <input type="date" value={startDate} onChange={(e) => setStart(e.target.value)}
            style={{ ...fieldStyle, fontSize: 13 }} />
        </div>
        <div>
          <label style={labelStyle}>{window.isRTL ? 'تاريخ النهاية *' : 'End date *'}</label>
          <input type="date" value={endDate} onChange={(e) => setEnd(e.target.value)}
            style={{ ...fieldStyle, fontSize: 13 }} />
        </div>
      </div>

      {/* Budget */}
      <div>
        <label style={labelStyle}>{window.isRTL ? 'الميزانية بالدولار (اختياري)' : 'Budget in USD (optional)'}</label>
        <input type="number" inputMode="decimal" value={budget} onChange={(e) => setBudget(e.target.value)}
          placeholder="0.00" style={fieldStyle} />
      </div>

      {/* Local currency */}
      <div>
        <label style={labelStyle}>{window.isRTL ? 'العملة المحلية' : 'Local currency'}</label>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', flexDirection: 'row' }}>
          {CURRENCIES.map((c) => (
            <button key={c} onClick={() => setCurrency(c)} style={{
              padding: '8px 12px', borderRadius: 10, fontSize: 12.5, fontWeight: 500,
              background: currency === c ? 'var(--ink)' : 'var(--cream-2)',
              color: currency === c ? 'var(--cream)' : 'var(--ink-soft)',
              border: '0.5px solid var(--hairline)', transition: 'all 150ms',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Status preview */}
      <div style={{
        padding: '10px 14px', borderRadius: 12,
        background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
        fontSize: 12.5, color: 'var(--ink-mute)', display: 'flex', alignItems: 'center', gap: 8,
        flexDirection: 'row',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, flexShrink: 0,
          background: STATUS === 'active' ? 'var(--moss)' : STATUS === 'upcoming' ? 'var(--honey)' : 'var(--ink-mute)'
        }} />
        <span>
          {STATUS === 'active' ? (window.isRTL ? 'الرحلة نشطة الآن' : 'Trip is active now')
            : STATUS === 'upcoming' ? (window.isRTL ? 'رحلة قادمة' : 'Upcoming trip')
            : (window.isRTL ? 'رحلة سابقة' : 'Past trip')}
        </span>
      </div>

      {error && (
        <div style={{
          padding: '10px 14px', borderRadius: 12,
          background: 'oklch(0.62 0.13 35 / 0.10)',
          border: '0.5px solid oklch(0.62 0.13 35 / 0.3)',
          fontSize: 12.5, color: 'var(--clay-deep)',
        }}>{error}</div>
      )}

      <button onClick={handleSave} disabled={loading} style={{
        width: '100%', padding: '16px', borderRadius: 18,
        background: loading ? 'var(--ink-soft)' : 'var(--clay)', color: '#fff',
        fontSize: 14, fontWeight: 600,
        boxShadow: loading ? 'none' : '0 8px 20px oklch(0.62 0.13 35 / 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        {loading ? (
          <span style={{
            width: 16, height: 16, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
            display: 'inline-block', animation: 'expspin 0.7s linear infinite',
          }} />
        ) : (window.isRTL ? '✈ إنشاء الرحلة' : '✈ Create trip')}
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
