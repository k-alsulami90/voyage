// Shared UI primitives — Avatars, badges, hero illustration, sheet, swipe row.

const Avatar = ({ m, size = 28, ring = false, off = 0, marginRight = 0 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: `linear-gradient(140deg, oklch(0.78 0.09 ${m.hue}) 0%, oklch(0.55 0.12 ${m.hue}) 100%)`,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontFamily: 'var(--sans)', fontWeight: 600,
    fontSize: size * 0.38, letterSpacing: '-0.02em',
    boxShadow: ring ? '0 0 0 2.5px var(--cream), 0 4px 10px rgba(0,0,0,0.18)' : '0 2px 4px rgba(0,0,0,0.15)',
    marginInlineStart: off,
    marginInlineEnd: marginRight,
    flexShrink: 0,
  }}>{m.initials}</div>
);

const AvatarStack = ({ members, size = 26 }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'row' }}>
    {members.map((m, i) => (
      <Avatar
        key={m.id}
        m={m}
        size={size}
        ring={true}
        off={window.isRTL ? 0 : (i === 0 ? 0 : -size * 0.35)}
        marginRight={window.isRTL && i > 0 ? -(size * 0.35) : 0}
      />
    ))}
  </div>
);

const RoleBadge = ({ role }) => {
  const map = {
    Admin:  { bg: 'oklch(0.62 0.13 35 / 0.14)',  fg: 'var(--clay-deep)', dot: 'var(--clay)' },
    Editor: { bg: 'oklch(0.50 0.08 155 / 0.14)', fg: 'oklch(0.34 0.07 155)', dot: 'var(--moss)' },
    Viewer: { bg: 'oklch(0.42 0.10 260 / 0.12)', fg: 'oklch(0.30 0.08 260)', dot: 'var(--indigo)' },
  };
  const s = map[role] || map.Viewer;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      flexDirection: 'row',
      padding: '4px 9px 4px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11, fontWeight: 600, letterSpacing: '-0.005em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.dot }} />
      {role}
    </span>
  );
};

const Chip = ({ children, active = false, onClick, tone = 'default' }) => {
  const styles = {
    default: { bg: active ? 'var(--ink)' : 'rgba(255,255,255,0.6)', fg: active ? 'var(--cream)' : 'var(--ink-soft)' },
    glass:   { bg: active ? 'var(--ink)' : 'rgba(255,255,255,0.55)', fg: active ? 'var(--cream)' : 'var(--ink)' },
  }[tone];
  return (
    <button onClick={onClick} style={{
      padding: '7px 13px', borderRadius: 999,
      background: styles.bg, color: styles.fg,
      fontSize: 12.5, fontWeight: 500,
      border: '0.5px solid ' + (active ? 'transparent' : 'var(--hairline)'),
      backdropFilter: 'blur(8px)',
      transition: 'all 180ms',
      whiteSpace: 'nowrap',
    }}>{children}</button>
  );
};

// Section header. Was uppercase mono tracked — the saturated 2026 AI tell.
// Now: sans, semibold, sentence-case, normal tracking. Hierarchy via weight
// and size against the ink-mute body text, not via "ALL CAPS WIDE TRACKED."
const SectionLabel = ({ children, action, onAction }) => {
  // Display sentence-case if the consumer passed an uppercase string
  // (most existing callers passed t('SECTION_NAME') which returned upper)
  const text = typeof children === 'string'
    ? children.charAt(0).toUpperCase() + children.slice(1).toLowerCase()
    : children;
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      flexDirection: 'row',
      padding: '0 22px', marginBottom: 10,
    }}>
      <div style={{
        fontSize: 13, fontWeight: 600,
        color: 'var(--ink)', letterSpacing: '-0.01em',
      }}>{text}</div>
      {action && (
        <button onClick={onAction} style={{
          fontSize: 12.5, color: 'var(--clay-deep)', fontWeight: 500,
          background: 'none', border: 0,
        }}>{action}</button>
      )}
    </div>
  );
};

// Kyoto hero — gradient sky, layered mountains, branch + blossoms.
// All geometric primitives: gradients, polygons, circles, lines.
const KyotoHero = ({ tilt = -2 }) => (
  <div style={{
    position: 'relative', width: '100%', height: '100%',
    borderRadius: 'inherit', overflow: 'hidden',
    background: 'linear-gradient(170deg, oklch(0.78 0.06 30) 0%, oklch(0.66 0.08 25) 45%, oklch(0.42 0.07 285) 100%)',
  }}>
    {/* Sun */}
    <div style={{
      position: 'absolute', top: 26, right: 32, width: 76, height: 76, borderRadius: '50%',
      background: 'radial-gradient(circle, oklch(0.94 0.08 75) 0%, oklch(0.82 0.12 50) 60%, transparent 100%)',
      filter: 'blur(0.5px)',
    }} />
    {/* Far mountain */}
    <svg viewBox="0 0 400 260" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <polygon points="0,200 90,110 160,150 230,90 320,160 400,130 400,260 0,260"
               fill="oklch(0.36 0.06 285 / 0.55)" />
      <polygon points="0,230 60,180 140,210 220,160 300,200 400,180 400,260 0,260"
               fill="oklch(0.26 0.05 280 / 0.78)" />
    </svg>
    {/* Branch — diagonal stroke + blossoms */}
    <svg viewBox="0 0 400 260" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <path d="M-10 80 C 80 50, 160 70, 230 40 S 380 30, 420 10"
            stroke="oklch(0.25 0.03 30)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 60 70 Q 90 30, 130 50" stroke="oklch(0.25 0.03 30)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M 250 35 Q 280 8, 320 25" stroke="oklch(0.25 0.03 30)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
    {/* Blossom dots */}
    {[
      [40, 72, 9], [70, 60, 11], [98, 45, 8], [120, 60, 10], [165, 55, 9],
      [200, 38, 7], [228, 42, 11], [262, 26, 9], [300, 18, 10], [340, 28, 8],
      [55, 90, 6], [180, 70, 7], [380, 38, 9], [240, 60, 6],
    ].map(([x, y, r], i) => (
      <div key={i} style={{
        position: 'absolute', left: x, top: y, width: r * 2, height: r * 2,
        borderRadius: '50%', background: 'radial-gradient(circle, oklch(0.96 0.05 25) 0%, oklch(0.84 0.10 20) 70%, oklch(0.74 0.13 18) 100%)',
        boxShadow: '0 1px 2px rgba(60,30,30,0.2)',
      }} />
    ))}
    {/* Vignette + grain */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(120% 70% at 50% 100%, transparent 50%, rgba(20,10,20,0.45) 100%)',
    }} />
    <div style={{
      position: 'absolute', inset: 0, opacity: 0.06, mixBlendMode: 'overlay',
      backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence baseFrequency=%221.2%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
    }} />
  </div>
);

// Tinted card placeholder (for doc previews etc)
const TintCard = ({ tint = 'clay', children }) => {
  const grads = {
    clay:   ['oklch(0.85 0.07 40)',  'oklch(0.62 0.13 35)'],
    moss:   ['oklch(0.82 0.05 155)', 'oklch(0.50 0.08 155)'],
    indigo: ['oklch(0.78 0.06 260)', 'oklch(0.42 0.10 260)'],
    honey:  ['oklch(0.88 0.08 80)',  'oklch(0.68 0.13 70)'],
  };
  const [a, b] = grads[tint] || grads.clay;
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `linear-gradient(155deg, ${a} 0%, ${b} 100%)`,
      borderRadius: 'inherit', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(80% 60% at 20% 10%, rgba(255,255,255,0.45) 0%, transparent 60%)' }} />
      {children}
    </div>
  );
};

// Full-screen modal sheet
const Sheet = ({ open, onClose, children, title, height = 0.7 }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,15,10,0.4)',
        backdropFilter: 'blur(6px)', animation: 'fadeIn 200ms',
      }} />
      <div style={{
        position: 'relative', height: `${height * 100}%`,
        background: 'var(--cream)', borderRadius: '24px 24px 0 0',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.35)',
        animation: 'slideUp 320ms cubic-bezier(.32,.72,0,1)',  // iOS spring curve
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {/* iOS-style drag handle */}
        <div style={{ padding: '8px 0 4px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 5, borderRadius: 999,
            background: 'var(--ink-mute)', opacity: 0.4,
          }} />
        </div>
        {title && (
          <div style={{
            padding: '8px 22px 4px',
            fontFamily: 'var(--serif)', fontSize: 22, letterSpacing: '-0.01em',
            color: 'var(--ink)', textAlign: 'center', flexShrink: 0,
          }}>{title}</div>
        )}
        <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
};

// Swipeable row (drag horizontally to reveal actions)
function SwipeRow({ children, actions, onAction }) {
  // If there are no actions, render the child as-is so we don't add an
  // empty swipe affordance (and so the row keeps its native border-radius).
  if (!actions || actions.length === 0) return children;

  // In RTL the action chip sits on the LEFT (see .swipe-actions rule),
  // so the user swipes right-to-left from the leading edge — translation
  // must go positive instead of negative. We mirror the math by direction.
  const rtl = !!window.isRTL;
  const dir = rtl ? 1 : -1;             // sign of "revealed" translation
  const max = 150 * dir;                // clamp end
  const openAt = 130 * dir;             // resting open position
  const threshold = 60;                 // distance needed to commit

  const [dx, setDx] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const startX = React.useRef(0);
  const startedAt = React.useRef(0);

  const onStart = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = x - dx;
    startedAt.current = Date.now();
  };
  const onMove = (e) => {
    if (!startX.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const raw = x - startX.current;
    // Clamp to [0, max] in the swipe direction; ignore the opposite direction.
    const next = rtl ? Math.max(0, Math.min(max, raw))
                     : Math.min(0, Math.max(max, raw));
    setDx(next);
  };
  const onEnd = () => {
    if (Math.abs(dx) > threshold) { setDx(openAt); setOpen(true); }
    else { setDx(0); setOpen(false); }
    startX.current = 0;
  };

  return (
    <div className="swipe-row">
      <div className="swipe-actions">
        {actions.map((a, i) => (
          <button key={i} onClick={() => { onAction?.(a.key); setDx(0); setOpen(false); }} style={{
            width: 58, height: 58, borderRadius: 16, background: a.bg, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
          }}>{a.icon}</button>
        ))}
      </div>
      <div
        onMouseDown={onStart} onMouseMove={(e) => startX.current && onMove(e)} onMouseUp={onEnd} onMouseLeave={onEnd}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        style={{
          transform: `translateX(${dx}px)`,
          transition: startX.current ? 'none' : 'transform 280ms cubic-bezier(.2,.8,.2,1)',
          willChange: 'transform',
        }}
      >{children}</div>
    </div>
  );
}

// Skeleton block — pulsing placeholder for loading states
function Skeleton({ w = '100%', h = 14, r = 8, style }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, var(--sand) 0%, var(--sand-deep) 50%, var(--sand) 100%)',
      backgroundSize: '200% 100%',
      animation: 'sk-shimmer 1.4s ease-in-out infinite',
      ...style,
    }} />
  );
}
const _skStyle = document.createElement('style');
_skStyle.textContent = '@keyframes sk-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }';
document.head.appendChild(_skStyle);

// Reusable trip-screen skeleton — hero card + 3 list rows
function TripSkeleton() {
  return (
    <div style={{ padding: '60px 14px 100px' }}>
      <Skeleton h={170} r={26} style={{ marginBottom: 14 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
        {[0, 1, 2].map((i) => <Skeleton key={i} h={70} r={16} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} h={56} r={18} />)}
      </div>
    </div>
  );
}

// ── Global toast system ──────────────────────────────────────
// Usage:  window.toast('Saved!', 'success')   |   window.toast(err.message, 'error')
// A single host component (<ToastHost/>) lives in App. It subscribes to a tiny pubsub.
window._toastSubs = window._toastSubs || new Set();
window._toastSeq  = 0;
window.toast = function(msg, type = 'info', durationMs = 3200) {
  if (!msg) return;
  const id = ++window._toastSeq;
  const item = { id, msg: String(msg), type, at: Date.now(), durationMs };
  window._toastSubs.forEach((fn) => fn(item));
  return id;
};

function ToastHost() {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    const handler = (item) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== item.id));
      }, item.durationMs);
    };
    window._toastSubs.add(handler);
    return () => { window._toastSubs.delete(handler); };
  }, []);
  if (items.length === 0) return null;
  return (
    <div style={{
      position: 'fixed', zIndex: 9999,
      top: 'calc(env(safe-area-inset-top) + 14px)',
      left: 14, right: 14,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {items.map((t) => {
        const colors = {
          success: { bg: 'var(--moss)', fg: '#fff', icon: '✓' },
          error:   { bg: 'var(--clay-deep)', fg: '#fff', icon: '⚠' },
          info:    { bg: 'var(--statement)', fg: 'var(--statement-fg)', icon: 'i' },
        }[t.type] || { bg: 'var(--statement)', fg: 'var(--statement-fg)', icon: 'i' };
        return (
          <div key={t.id} style={{
            padding: '11px 14px', borderRadius: 14,
            background: colors.bg, color: colors.fg,
            display: 'flex', alignItems: 'center', gap: 10,
            flexDirection: 'row',
            boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
            pointerEvents: 'auto', fontSize: 13, fontWeight: 500,
            animation: 'toast-in 220ms cubic-bezier(.2,.8,.2,1)',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 999, flexShrink: 0,
              background: 'rgba(255,255,255,0.18)',
              display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700,
            }}>{colors.icon}</div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>{t.msg}</div>
          </div>
        );
      })}
      <style>{`@keyframes toast-in { from { transform: translateY(-12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
    </div>
  );
}
window.ToastHost = ToastHost;

// ── LargeTitleHeader (iOS HIG pattern) ──────────────────────
// On mount, displays a huge 34pt bold title in the content area.
// As the user scrolls, the sticky compact bar at the top crossfades
// in a small inline title, exactly like iOS Settings.app / Mail.app.
// Pattern: an invisible sentinel sits BELOW the large title; an
// IntersectionObserver flips `scrolled` when the sentinel leaves
// the viewport (i.e. the large title has scrolled off-screen).
function LargeTitleHeader({ title, subtitle, action, onBack }) {
  const [scrolled, setScrolled] = React.useState(false);
  const sentinelRef = React.useRef(null);

  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-44px 0px 0px 0px' }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Sticky compact bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        paddingTop: 'max(54px, calc(env(safe-area-inset-top) + 10px))',
        paddingBottom: 8,
        paddingInlineStart: onBack ? 12 : 22,
        paddingInlineEnd: 22,
        background: scrolled ? 'rgba(245, 238, 216, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '0.5px solid var(--hairline)' : '0.5px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        transition: 'background 200ms, border-color 200ms, backdrop-filter 200ms',
      }}>
        {onBack ? (
          <button onClick={onBack} aria-label="Back" style={{
            width: 36, height: 36, borderRadius: 999,
            background: scrolled ? 'rgba(0,0,0,0)' : 'var(--cream-2)',
            border: scrolled ? '0.5px solid transparent' : '0.5px solid var(--hairline)',
            display: 'grid', placeItems: 'center', flexShrink: 0,
            transition: 'background 200ms, border-color 200ms',
          }}>
            <span className="icon-flip"><IconBack size={17} stroke="var(--ink)" /></span>
          </button>
        ) : <span style={{ width: 36, height: 36, flexShrink: 0 }} />}
        <div style={{
          flex: 1, minWidth: 0, textAlign: 'center',
          fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600,
          color: 'var(--ink)',
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 200ms, transform 200ms',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</div>
        <div style={{ width: 36, minWidth: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {action || null}
        </div>
      </div>

      {/* Large title that scrolls with content */}
      <div style={{ padding: '4px 22px 8px' }}>
        <div style={{
          fontFamily: 'var(--sans)', fontWeight: 700,
          fontSize: 34, lineHeight: 1.1,
          color: 'var(--ink)', letterSpacing: '-0.02em',
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontSize: 13, color: 'var(--ink-mute)', marginTop: 4, lineHeight: 1.4,
          }}>{subtitle}</div>
        )}
      </div>

      {/* Sentinel — when this leaves the viewport, the compact bar crossfades in */}
      <div ref={sentinelRef} style={{ height: 1, marginTop: 2 }} aria-hidden="true" />
    </>
  );
}

// ── ActionSheet (iOS HIG pattern) ───────────────────────────
// Bottom-sliding sheet of options with a separated Cancel button.
// Imperative API: window.actionSheet({ title, message, actions })
window.__actionSheetSubs = window.__actionSheetSubs || new Set();
window.__actionSheetSeq  = window.__actionSheetSeq  || 0;
window.actionSheet = function(config) {
  window.__actionSheetSeq += 1;
  const item = Object.assign({ id: window.__actionSheetSeq }, config);
  window.__actionSheetSubs.forEach((fn) => fn(item));
};

function ActionSheetHost() {
  const [item, setItem] = React.useState(null);
  React.useEffect(() => {
    const handler = (it) => setItem(it);
    window.__actionSheetSubs.add(handler);
    return () => { window.__actionSheetSubs.delete(handler); };
  }, []);
  if (!item) return null;
  const close = () => setItem(null);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      pointerEvents: 'auto',
    }}>
      <div onClick={close} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.32)',
        animation: 'as-fade 220ms ease-out forwards',
      }} />
      <div style={{
        position: 'relative', padding: '10px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
        animation: 'as-up 320ms cubic-bezier(.32,.72,0,1) both',
      }}>
        {/* Options group */}
        <div style={{
          background: 'var(--cream-2)', borderRadius: 14, overflow: 'hidden',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        }}>
          {(item.title || item.message) && (
            <div style={{
              padding: '14px 16px',
              borderBottom: '0.5px solid var(--hairline-2)',
              textAlign: 'center',
            }}>
              {item.title && <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.title}</div>}
              {item.message && <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4, lineHeight: 1.4 }}>{item.message}</div>}
            </div>
          )}
          {(item.actions || []).map((a, i) => (
            <button key={i} onClick={() => { close(); a.onPress?.(); }} style={{
              width: '100%',
              padding: '15px 16px',
              borderTop: i > 0 ? '0.5px solid var(--hairline-2)' : 'none',
              background: 'transparent',
              color: a.destructive ? 'var(--clay-deep)' : 'var(--ink)',
              fontSize: 17,
              fontWeight: a.destructive ? 600 : 400,
              textAlign: 'center',
              fontFamily: 'var(--sans)',
            }}>{a.label}</button>
          ))}
        </div>
        {/* Cancel button — separate group */}
        <button onClick={close} style={{
          width: '100%',
          marginTop: 8,
          padding: '15px 16px',
          borderRadius: 14,
          background: 'var(--cream-2)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          color: 'var(--ink)',
          fontSize: 17, fontWeight: 600,
          fontFamily: 'var(--sans)',
        }}>{item.cancelLabel || (window.isRTL ? 'إلغاء' : 'Cancel')}</button>
      </div>
      <style>{`
        @keyframes as-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes as-up   { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
}
window.ActionSheetHost = ActionSheetHost;
window.LargeTitleHeader = LargeTitleHeader;

// ── ErrorBoundary ────────────────────────────────────────────
// Catches any React crash anywhere in the tree and shows a friendly
// "Something went wrong" screen with hard-recovery options. Without
// this, a single thrown error blanks the page and the user is stuck.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }
  async hardReset() {
    try {
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      try { sessionStorage.clear(); } catch (_) {}
    } catch (_) {}
    location.reload();
  }
  render() {
    if (!this.state.error) return this.props.children;
    const rtl = window.isRTL;
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#f3eed8', color: '#221c16',
        display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24,
        fontFamily: '-apple-system, system-ui, sans-serif', direction: rtl ? 'rtl' : 'ltr',
      }}>
        <div style={{ maxWidth: 320 }}>
          <div style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 36, marginBottom: 24 }}>voyage</div>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
            background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
            display: 'grid', placeItems: 'center', fontSize: 28,
          }}>⚠</div>
          <div style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 24, marginBottom: 6 }}>
            {rtl ? 'حدث خطأ ما' : 'Something went wrong'}
          </div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.5 }}>
            {rtl ? 'حاول تحديث الصفحة. إذا استمرت المشكلة، اضغط على إعادة التعيين.' : 'Try reloading. If the problem persists, tap Reset.'}
          </div>
          {this.state.error?.message && (
            <details style={{ fontSize: 11, color: '#888', marginBottom: 16, textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer' }}>{rtl ? 'التفاصيل التقنية' : 'Technical details'}</summary>
              <pre style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 8 }}>
                {String(this.state.error?.message)}
              </pre>
            </details>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => location.reload()} style={{
              padding: '12px 20px', borderRadius: 14, border: 0,
              background: '#221c16', color: '#f3eed8', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>{rtl ? 'تحديث' : 'Reload'}</button>
            <button onClick={() => this.hardReset()} style={{
              padding: '12px 20px', borderRadius: 14, border: '1px solid rgba(0,0,0,0.15)',
              background: '#fff', color: '#221c16', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>{rtl ? 'إعادة تعيين' : 'Reset app'}</button>
          </div>
        </div>
      </div>
    );
  }
}
window.ErrorBoundary = ErrorBoundary;

// ── Pull-to-refresh ─────────────────────────────────────────
// Wrap any scroll container with <PullToRefresh onRefresh={async () => {...}}>.
// Triggers when user drags past 70px from the top.
function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const startY = React.useRef(null);
  const scrollerRef = React.useRef(null);

  const THRESHOLD = 70;

  const onTouchStart = (e) => {
    if (!scrollerRef.current || scrollerRef.current.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (startY.current == null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) return;
    // Damped pull — feels native
    const damped = Math.min(120, Math.pow(dy, 0.85));
    setPull(damped);
  };
  const onTouchEnd = async () => {
    if (startY.current == null) return;
    const triggered = pull >= THRESHOLD;
    startY.current = null;
    if (triggered) {
      setRefreshing(true);
      setPull(THRESHOLD);
      try { await onRefresh?.(); } catch (e) { window.toast?.(e.message || 'Refresh failed', 'error'); }
      finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div className={`ptr-indicator ${pull >= THRESHOLD ? 'armed' : ''}`} style={{
        height: pull, opacity: pull > 0 ? 1 : 0,
      }}>
        {refreshing
          ? <div className="ptr-spin" />
          : <span style={{ fontSize: 12, fontWeight: 500 }}>
              {pull >= THRESHOLD
                ? (window.isRTL ? 'حرّر للتحديث' : 'Release to refresh')
                : (window.isRTL ? 'اسحب للتحديث' : 'Pull to refresh')}
            </span>}
      </div>
      <div
        ref={scrollerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          height: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch',
          transform: `translateY(${pull}px)`,
          transition: startY.current === null ? 'transform 220ms cubic-bezier(.32,.72,0,1)' : 'none',
        }}
        className="no-scrollbar"
      >
        {children}
      </div>
    </div>
  );
}

// ── Offline banner ──────────────────────────────────────────
function OfflineBanner() {
  const [online, setOnline] = React.useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  React.useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  if (online) return null;
  return (
    <div className="offline-banner">
      {window.isRTL ? '⚠ غير متصل · بياناتك محفوظة محلياً' : '⚠ Offline · changes will sync when you reconnect'}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// ImageCropper — full-screen modal that lets the user pan + zoom
// an image inside a square frame and emit a cropped JPEG Blob.
//
// Usage:
//   <ImageCropper file={pickedFile} onCancel={...} onDone={(blob) => ...} />
//
// Output: 800x800 JPEG (quality 0.9). Roughly 80–250 KB per photo —
// plenty of detail for our list/grid thumbnails and ~10x smaller than
// the original phone photo.
// ──────────────────────────────────────────────────────────────
function ImageCropper({ file, onCancel, onDone, frameSize = 280, outputSize = 800 }) {
  const [src, setSrc]     = React.useState(null);
  const [img, setImg]     = React.useState(null);     // HTMLImageElement (for naturalSize)
  const [scale, setScale] = React.useState(1);
  const [off, setOff]     = React.useState({ x: 0, y: 0 });
  const [busy, setBusy]   = React.useState(false);

  // Load file → Object URL → HTMLImageElement (so we know natural size).
  React.useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    const el = new Image();
    el.onload = () => {
      setImg(el);
      // Start zoom such that the image's SHORTER side equals the frame.
      const fit = frameSize / Math.min(el.naturalWidth, el.naturalHeight);
      setScale(fit);
      setOff({ x: 0, y: 0 });
    };
    el.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file, frameSize]);

  // ── Drag handlers ────────────────────────────────────────
  const dragRef = React.useRef(null);
  const onStart = (e) => {
    const p = e.touches ? e.touches[0] : e;
    dragRef.current = { x: p.clientX, y: p.clientY, ox: off.x, oy: off.y };
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const p = e.touches ? e.touches[0] : e;
    setOff(clampOffset({
      x: dragRef.current.ox + (p.clientX - dragRef.current.x),
      y: dragRef.current.oy + (p.clientY - dragRef.current.y),
    }, img, scale, frameSize));
  };
  const onEnd = () => { dragRef.current = null; };

  // Re-clamp when scale changes (so the image can't be smaller than the frame)
  React.useEffect(() => {
    if (!img) return;
    setOff((o) => clampOffset(o, img, scale, frameSize));
  }, [scale, img, frameSize]);

  // Min / max zoom: from "shorter side fills frame" up to 4× that.
  const minScale = img ? (frameSize / Math.min(img.naturalWidth, img.naturalHeight)) : 1;
  const maxScale = minScale * 4;

  const handleConfirm = async () => {
    if (!img) return;
    setBusy(true);
    try {
      const blob = await renderCrop(img, scale, off, frameSize, outputSize);
      // Wrap into a File so existing uploadDocCover signature works
      const out = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
      onDone(out);
    } finally { setBusy(false); }
  };

  if (!src) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeIn 180ms ease',
    }}>
      {/* Top bar */}
      <div style={{
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexDirection: 'row',
      }}>
        <button onClick={onCancel} style={{
          padding: '8px 14px', borderRadius: 999, color: '#fff',
          background: 'rgba(255,255,255,0.12)', fontSize: 13, fontWeight: 500,
          border: '0.5px solid rgba(255,255,255,0.18)',
        }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
        <div style={{ color: '#fff', fontSize: 13.5, fontWeight: 500 }}>
          {window.isRTL ? 'اضبط صورة الغلاف' : 'Adjust cover'}
        </div>
        <button onClick={handleConfirm} disabled={busy} style={{
          padding: '8px 14px', borderRadius: 999, color: '#fff',
          background: 'var(--clay)', fontSize: 13, fontWeight: 600,
          border: 'none',
          boxShadow: '0 4px 12px oklch(0.62 0.13 35 / 0.4)',
        }}>{busy ? '…' : (window.isRTL ? 'تم' : 'Done')}</button>
      </div>

      {/* Crop frame */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div
          onMouseDown={onStart} onMouseMove={(e) => dragRef.current && onMove(e)}
          onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
          style={{
            position: 'relative', width: frameSize, height: frameSize,
            cursor: 'move', touchAction: 'none',
            userSelect: 'none', WebkitUserSelect: 'none',
            overflow: 'hidden', borderRadius: 6,
            background: '#000',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 0 0 9999px rgba(0,0,0,0.5)',
          }}
        >
          {img && (
            <img
              src={src} draggable={false} alt=""
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: img.naturalWidth * scale,
                height: img.naturalHeight * scale,
                transform: `translate(calc(-50% + ${off.x}px), calc(-50% + ${off.y}px))`,
                pointerEvents: 'none',
                maxWidth: 'none',
              }}
            />
          )}
          {/* Grid overlay (rule of thirds) */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(to right, transparent 33%, rgba(255,255,255,0.18) 33%, rgba(255,255,255,0.18) 33.5%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,0.18) 66.5%, rgba(255,255,255,0.18) 67%, transparent 67%),
              linear-gradient(to bottom, transparent 33%, rgba(255,255,255,0.18) 33%, rgba(255,255,255,0.18) 33.5%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,0.18) 66.5%, rgba(255,255,255,0.18) 67%, transparent 67%)
            `,
          }} />
        </div>
      </div>

      {/* Zoom slider */}
      <div style={{
        padding: '0 30px',
        marginBottom: 'calc(env(safe-area-inset-bottom) + 22px)',
        display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>−</span>
        <input type="range"
          min={minScale} max={maxScale} step={(maxScale - minScale) / 100}
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--clay)' }} />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>+</span>
      </div>
    </div>
  );
}

function clampOffset(off, img, scale, frame) {
  if (!img) return off;
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  const maxX = Math.max(0, (w - frame) / 2);
  const maxY = Math.max(0, (h - frame) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, off.x)),
    y: Math.min(maxY, Math.max(-maxY, off.y)),
  };
}

// Render the visible square back out at outputSize × outputSize.
async function renderCrop(img, scale, off, frame, outputSize) {
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // The displayed image is centered then offset. Compute the source rect
  // that corresponds to the frame.
  const dispW = img.naturalWidth * scale;
  const dispH = img.naturalHeight * scale;
  // Top-left of the visible image (in screen px), with frame at 0,0:
  const imgLeft = (frame - dispW) / 2 + off.x;
  const imgTop  = (frame - dispH) / 2 + off.y;
  // The portion of the source image inside the frame:
  const sx = (-imgLeft) / scale;
  const sy = (-imgTop)  / scale;
  const sSize = frame / scale;

  ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);
  return new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.9)
  );
}

Object.assign(window, { Avatar, AvatarStack, RoleBadge, Chip, SectionLabel, KyotoHero, TintCard, Sheet, SwipeRow, Skeleton, TripSkeleton, ToastHost, ErrorBoundary, PullToRefresh, OfflineBanner, LargeTitleHeader, ActionSheetHost, ImageCropper });
