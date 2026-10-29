// ── Files: tickets, boarding passes, visas, bookings, receipts ──────
//
// window.openFile({ path, ver, url, blob, title }) shows a file full-screen
// inside the app. The bytes come from the phone when it has them (offline.jsx
// keeps every trip file there), else from the link — and are then kept for
// next time. So a boarding pass opens at the gate with no signal.
//
// PDFs are drawn with pdf.js (vendored, loaded the first time a PDF is
// opened, and kept offline by the service worker); images show as they are.
// Pinch or double-tap to zoom, drag down to close, and share hands the file
// to iOS (save to Files, print, AirDrop…).

const PDFJS_BASE = '/vendor/pdfjs-4.10.38/';

// ── pdf.js, loaded once (an ES module: imported from an inline module
// script so the app's own build never touches it) ──
let _pdfjsP = null;
function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (_pdfjsP) return _pdfjsP;
  _pdfjsP = new Promise((resolve, reject) => {
    const cb = '__voyagePdfjs' + Date.now();
    const timer = setTimeout(() => done(null, new Error('pdf.js timeout')), 20000);
    function done(lib, err) {
      clearTimeout(timer);
      try { delete window[cb]; } catch (_) { window[cb] = undefined; }
      if (lib && lib.getDocument) {
        lib.GlobalWorkerOptions.workerSrc = PDFJS_BASE + 'pdf.worker.min.mjs';
        window.pdfjsLib = lib;
        resolve(lib);
      } else { _pdfjsP = null; reject(err || new Error('pdf.js')); }
    }
    window[cb] = done;
    const s = document.createElement('script');
    s.type = 'module';
    s.textContent = `import(${JSON.stringify(PDFJS_BASE + 'pdf.min.mjs')}).then((m) => window[${JSON.stringify(cb)}] && window[${JSON.stringify(cb)}](m), (e) => window[${JSON.stringify(cb)}] && window[${JSON.stringify(cb)}](null, e));`;
    document.head.appendChild(s);
  });
  return _pdfjsP;
}
window.preloadPdfJs = () => loadPdfJs().catch(() => {});

const _isPdf = (type, path) => /pdf/i.test(type || '') || /\.pdf($|\?)/i.test(path || '');

// Draw each page to an image (kept as a blob url) — light on memory, sharp
// enough to zoom 2× (QR codes and small print stay crisp).
async function renderPdfPages(blob, cssWidth, onPage, cancelled) {
  const lib = await loadPdfJs();
  const data = new Uint8Array(await blob.arrayBuffer());
  const task = lib.getDocument({ data, isEvalSupported: false, useSystemFonts: true, verbosity: 0 });
  const doc = await task.promise;
  try {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    for (let i = 1; i <= doc.numPages; i++) {
      if (cancelled()) break;
      const page = await doc.getPage(i);
      const v1 = page.getViewport({ scale: 1 });
      let scale = (cssWidth * dpr * 2) / v1.width;
      const maxPx = 9.5e6;
      if (v1.width * v1.height * scale * scale > maxPx) scale = Math.sqrt(maxPx / (v1.width * v1.height));
      const vp = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(vp.width));
      canvas.height = Math.max(1, Math.floor(vp.height));
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      const out = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.93));
      canvas.width = canvas.height = 0;   // hand the memory back now (iOS caps canvas memory)
      page.cleanup();
      if (!out) throw new Error('render');
      onPage({ src: URL.createObjectURL(out), w: v1.width, h: v1.height });
    }
  } finally {
    try { doc.destroy(); } catch (_) {}
  }
}

const _safeName = (title, type, path) => {
  const ext = _isPdf(type, path) ? 'pdf'
    : (/png/i.test(type) ? 'png' : /webp/i.test(type) ? 'webp' : /gif/i.test(type) ? 'gif' : 'jpg');
  const base = String(title || 'file').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) || 'file';
  return `${base}.${ext}`;
};

function FileViewer({ spec, onClose }) {
  const ar = window.isRTL;
  const [phase, setPhase] = React.useState('loading');   // loading | ready | error
  const [pages, setPages] = React.useState([]);          // [{ src, w, h }]
  const [zoom, setZoom] = React.useState(1);
  const [leaving, setLeaving] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  const blobRef = React.useRef(null);
  const urlsRef = React.useRef([]);
  const rootRef = React.useRef(null);
  const scRef = React.useRef(null);
  const innerRef = React.useRef(null);
  const pagesRef = React.useRef(null);
  const zoomRef = React.useRef(1); zoomRef.current = zoom;
  const afterZoomRef = React.useRef(null);

  // ── load ──
  React.useEffect(() => {
    let cancelled = false;
    setPhase('loading'); setPages([]);
    (async () => {
      try {
        const blob = await window.fileBlob(spec);
        if (cancelled) return;
        blobRef.current = blob;
        const type = blob.type || spec.type || '';
        const width = Math.min((scRef.current && scRef.current.clientWidth) || window.innerWidth, 1000) - 24;
        if (_isPdf(type, spec.path || spec.name)) {
          let first = true;
          await renderPdfPages(blob, width, (p) => {
            if (cancelled) { URL.revokeObjectURL(p.src); return; }
            urlsRef.current.push(p.src);
            setPages((prev) => [...prev, p]);
            if (first) { first = false; setPhase('ready'); }
          }, () => cancelled);
          if (!cancelled && first) throw new Error('empty');
        } else {
          const src = URL.createObjectURL(blob);
          urlsRef.current.push(src);
          const img = new Image();
          img.src = src;
          try { await img.decode(); } catch (_) {}
          if (cancelled) return;
          setPages([{ src, w: img.naturalWidth || 1, h: img.naturalHeight || 1 }]);
          setPhase('ready');
        }
      } catch (e) {
        if (!cancelled) setPhase('error');
      }
    })();
    return () => { cancelled = true; };
  }, [attempt]);
  React.useEffect(() => () => { urlsRef.current.forEach((u) => { try { URL.revokeObjectURL(u); } catch (_) {} }); }, []);

  // iOS: our own pinch only — never zoom the whole app.
  React.useEffect(() => {
    const stop = (e) => e.preventDefault();
    document.addEventListener('gesturestart', stop);
    document.addEventListener('gesturechange', stop);
    return () => { document.removeEventListener('gesturestart', stop); document.removeEventListener('gesturechange', stop); };
  }, []);

  const close = React.useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onClose, 220);
  }, [leaving, onClose]);

  // After a zoom is committed: put the point under the fingers back under them.
  React.useLayoutEffect(() => {
    const f = afterZoomRef.current; if (!f) return;
    afterZoomRef.current = null;
    const sc = scRef.current, box = pagesRef.current && pagesRef.current.getBoundingClientRect();
    if (!sc || !box) return;
    sc.scrollLeft += (box.left + f.u * box.width) - f.x;
    sc.scrollTop  += (box.top + f.v * box.height) - f.y;
  }, [zoom]);

  // ── gestures: pinch, double-tap, drag down to close ──
  React.useEffect(() => {
    const sc = scRef.current, inner = innerRef.current, root = rootRef.current;
    if (!sc || !inner || !root) return;
    let pinch = null, drag = null, lastTap = null;
    const mid = (t) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });
    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY) || 1;
    const focal = (x, y) => {
      const b = pagesRef.current.getBoundingClientRect();
      return { u: (x - b.left) / (b.width || 1), v: (y - b.top) / (b.height || 1) };
    };
    const commit = (z, f) => {
      inner.style.transition = ''; inner.style.transform = ''; inner.style.transformOrigin = '';
      const next = Math.max(1, Math.min(5, z));
      if (Math.abs(next - zoomRef.current) < 0.01) return;
      afterZoomRef.current = f;
      setZoom(next);
    };
    const originAt = (x, y) => {
      const r = sc.getBoundingClientRect();
      inner.style.transformOrigin = `${sc.scrollLeft + x - r.left}px ${sc.scrollTop + y - r.top}px`;
    };

    const ts = (e) => {
      if (e.touches.length === 2) {
        drag = null;
        const m = mid(e.touches);
        pinch = { d0: dist(e.touches), m0: m, m: m, k: 1, z0: zoomRef.current, f: focal(m.x, m.y) };
        originAt(m.x, m.y);
        e.preventDefault();
        return;
      }
      if (e.touches.length === 1 && !pinch) {
        const t = e.touches[0];
        drag = (zoomRef.current <= 1.01 && sc.scrollTop <= 0)
          ? { y0: t.clientY, x0: t.clientX, dy: 0, active: false, t0: performance.now() } : null;
      }
    };
    const tm = (e) => {
      if (pinch && e.touches.length >= 2) {
        e.preventDefault();
        const m = mid(e.touches);
        pinch.m = m;
        pinch.k = Math.max(1 / pinch.z0, Math.min(5 / pinch.z0, dist(e.touches) / pinch.d0));
        inner.style.transform = `translate3d(${m.x - pinch.m0.x}px, ${m.y - pinch.m0.y}px, 0) scale(${pinch.k})`;
        return;
      }
      if (drag && e.touches.length === 1) {
        const t = e.touches[0], dy = t.clientY - drag.y0, dx = t.clientX - drag.x0;
        if (!drag.active) {
          if (dy > 8 && Math.abs(dy) > Math.abs(dx)) drag.active = true;
          else if (Math.abs(dx) > 8 || dy < -8) { drag = null; return; }
          else return;
        }
        e.preventDefault();
        drag.dy = Math.max(0, dy);
        root.style.transition = 'none';
        root.style.transform = `translate3d(0, ${drag.dy}px, 0)`;
        root.style.setProperty('--fv-bg', String(Math.max(0.35, 1 - drag.dy / 500)));
      }
    };
    const te = (e) => {
      if (pinch && e.touches.length < 2) {
        const p = pinch; pinch = null;
        commit(p.z0 * p.k, { ...p.f, x: p.m.x, y: p.m.y });
        return;
      }
      if (drag) {
        const d = drag; drag = null;
        if (d.active) {
          const v = d.dy / Math.max(1, performance.now() - d.t0);
          root.style.transition = 'transform 240ms cubic-bezier(.2,.8,.2,1)';
          if (d.dy > 130 || v > 0.6) { root.style.transform = `translate3d(0, ${window.innerHeight}px, 0)`; setTimeout(onClose, 230); }
          else { root.style.transform = ''; root.style.setProperty('--fv-bg', '1'); }
          return;
        }
      }
      // double-tap: 1× ↔ 2.5× at the tapped point
      if (e.changedTouches.length === 1 && e.touches.length === 0) {
        const t = e.changedTouches[0], now = performance.now();
        if (lastTap && now - lastTap.t < 300 && Math.hypot(t.clientX - lastTap.x, t.clientY - lastTap.y) < 30) {
          lastTap = null;
          const z0 = zoomRef.current, z1 = z0 > 1.05 ? 1 : 2.5;
          const f = focal(t.clientX, t.clientY);
          originAt(t.clientX, t.clientY);
          inner.style.transition = 'transform 220ms cubic-bezier(.2,.8,.2,1)';
          inner.style.transform = `scale(${z1 / z0})`;
          setTimeout(() => commit(z1, { ...f, x: t.clientX, y: t.clientY }), 220);
        } else lastTap = { t: now, x: t.clientX, y: t.clientY };
      }
    };
    sc.addEventListener('touchstart', ts, { passive: false });
    sc.addEventListener('touchmove', tm, { passive: false });
    sc.addEventListener('touchend', te);
    sc.addEventListener('touchcancel', te);
    return () => {
      sc.removeEventListener('touchstart', ts); sc.removeEventListener('touchmove', tm);
      sc.removeEventListener('touchend', te); sc.removeEventListener('touchcancel', te);
    };
  }, [onClose]);

  const canShare = typeof navigator !== 'undefined' && !!navigator.canShare;
  const share = async () => {
    const blob = blobRef.current; if (!blob) return;
    try {
      const file = new File([blob], _safeName(spec.title, blob.type, spec.path), { type: blob.type || 'application/octet-stream' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: spec.title || undefined });
    } catch (_) { /* share sheet dismissed */ }
  };

  const single = pages.length === 1;
  const btn = {
    width: 40, height: 40, borderRadius: 999, flexShrink: 0, border: 'none',
    background: 'rgba(255,255,255,0.14)', color: '#fff',
    display: 'grid', placeItems: 'center',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
  };
  const TOP = 'calc(env(safe-area-inset-top) + 74px)';

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label={spec.title || (ar ? 'ملف' : 'File')} style={{
      position: 'absolute', inset: 0, zIndex: 240, overflow: 'hidden',
      '--fv-bg': '1',
      background: 'rgba(10, 11, 15, var(--fv-bg))',
      animation: leaving ? 'fvOut 220ms ease forwards' : 'fvIn 260ms cubic-bezier(.2,.8,.2,1)',
    }}>
      <style>{`
        @keyframes fvIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes fvOut { to { opacity: 0; transform: scale(0.98); } }
        @keyframes fvSpin { to { transform: rotate(360deg); } }
        @keyframes fvPage { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* The file */}
      <div ref={scRef} className="no-scrollbar" dir="ltr" style={{
        position: 'absolute', inset: 0, overflow: 'auto', WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain', touchAction: 'pan-x pan-y',
      }}>
        <div ref={innerRef} style={{
          width: `${zoom * 100}%`, minHeight: '100%', boxSizing: 'border-box',
          paddingTop: TOP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 28px)',
          paddingLeft: 12 * zoom, paddingRight: 12 * zoom,
          display: 'flex', flexDirection: 'column', justifyContent: single && zoom === 1 ? 'center' : 'flex-start',
          willChange: 'transform',
        }}>
          <div ref={pagesRef}>
            {pages.map((p, i) => (
              <img key={i} src={p.src} alt="" draggable={false} style={{
                display: 'block', width: '100%', height: 'auto', aspectRatio: `${p.w} / ${p.h}`,
                marginBottom: i < pages.length - 1 ? 12 * zoom : 0,
                borderRadius: single ? 10 : 4, background: '#fff',
                boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
                userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none',
                animation: zoom === 1 ? 'fvPage 320ms cubic-bezier(.2,.8,.2,1) backwards' : 'none',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Loading / couldn't open */}
      {phase === 'loading' && pages.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <span style={{ width: 30, height: 30, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.18)', borderTopColor: '#fff', animation: 'fvSpin 0.8s linear infinite' }} />
        </div>
      )}
      {phase === 'error' && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 32 }}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.08)' }}>
              {window.IconDoc ? <window.IconDoc size={26} stroke="rgba(255,255,255,0.85)" /> : null}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{ar ? 'ما قدرنا نفتح الملف' : "Couldn't open the file"}</div>
            <button onClick={() => setAttempt((n) => n + 1)} style={{
              marginTop: 18, minHeight: 40, padding: '0 18px', borderRadius: 999, border: 'none',
              background: 'rgba(255,255,255,0.14)', color: '#fff', fontSize: 13.5, fontWeight: 600,
            }}>{ar ? 'حاول مرة ثانية' : 'Try again'}</button>
          </div>
        </div>
      )}

      {/* Top bar — frosted, so it reads over a zoomed white page too */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
        padding: 'calc(env(safe-area-inset-top) + 10px) 14px 10px',
        background: 'rgba(12, 13, 17, 0.72)',
        backdropFilter: 'saturate(1.6) blur(20px)', WebkitBackdropFilter: 'saturate(1.6) blur(20px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={close} aria-label={ar ? 'إغلاق' : 'Close'} style={btn}>
          {window.IconClose ? <window.IconClose size={16} stroke="#fff" /> : '×'}
        </button>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'center', color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {spec.title || ''}
        </div>
        {canShare ? (
          <button onClick={share} disabled={phase !== 'ready'} aria-label={ar ? 'مشاركة' : 'Share'} style={{ ...btn, opacity: phase === 'ready' ? 1 : 0.4 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 15V3" /><path d="M7.5 7.5 12 3l4.5 4.5" /><path d="M8 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2" />
            </svg>
          </button>
        ) : <span style={{ width: 40, flexShrink: 0 }} />}
      </div>
    </div>
  );
}

function FileViewerHost() {
  const [spec, setSpec] = React.useState(null);
  React.useEffect(() => {
    window.openFile = (s) => { if (s && (s.path || s.url || s.blob)) setSpec({ ...s, _k: Date.now() }); };
    return () => { window.openFile = null; };
  }, []);
  const onClose = React.useCallback(() => setSpec(null), []);
  return spec ? <FileViewer key={spec._k} spec={spec} onClose={onClose} /> : null;
}

// A document's file, ready for openFile. which: 'primary' | 'secondary'.
window.docFileSpec = (doc, which) => {
  if (!doc) return null;
  if (which === 'secondary') {
    return doc.secondaryFilePath ? { path: doc.secondaryFilePath, ver: doc.secVer, url: doc.secondaryLink || null } : null;
  }
  return doc.filePath ? { path: doc.filePath, ver: doc.fileVer, url: doc.link || null } : null;
};
window.openDocFile = (doc, which, title) => {
  const s = window.docFileSpec(doc, which);
  if (s) window.openFile?.({ ...s, title: title || doc.title });
};

window.FileViewerHost = FileViewerHost;
