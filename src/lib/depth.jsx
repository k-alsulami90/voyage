// ── Voyage depth: 3D surfaces ──────────────────────────────────────────
//   Globe          — a dotted 3D Earth with your trips pinned and arced
//                    from home; spins in, drags with momentum, idles.
//   WalletCarousel — the trip's payment cards as physical 3D cards in a
//                    cover-flow: swipe/fling between them, they snap.
//   useTilt        — press a card and it tilts toward your finger with a
//                    moving glare, then springs flat when you let go.
// Pure canvas / CSS 3D (no WebGL, no external libraries), paused when
// off-screen, and still under prefers-reduced-motion.

// Land mask: 180×90 cells of 2° (Natural Earth 50m via world-atlas),
// 1 bit per cell, row 0 = 90°N, col 0 = 180°W.
const _LAND_B64 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAPgP8DAAAAAAAAAAAAAAAAAAAAAACM+/3//wcAAAAgBQACAAAAAAAAAAAAhPfw//8PAPAAAAAAwAMAAAAAAAAAwADEw////wEABAAAAADgAAAAAAAAAABQQT8A/v8PAAAAAAwA/D8AOAEAAAAAcBHvD8D/XwAAAAAgAP7/PwMAABCAAQD4w/4H8P8FAAAAAIJ7//9//xuAAP9ff2479QD/HwAA+A+EN/7//////3/g/////x88+B8AAOD/1//7////////jP////+/+AEfgAcAn9f//////////w/w/////wEs4AEAAHz+////////////gL////8HeAAcAADA5///////////9ADgAf7/f4AnAAAAEHb8////////H0AAAAhA//8f8AcAAIAB4////////38ABwAAAOj//5//AQAAHAT+////////B3AAAAAA/v//+z8AAGDj//////////8CAQAAAMD/////AwAA8P//////////LwAAAAAA4P///2MAAAD+//////////8AAAAAAAD///8/CAAA4P//ff//////JwAAAAAA8P///wYAAAD+/unz/////z8AAAAAAAD///8HAAAA/pgPPP//////MQAAAAAA8P//HwAAAMBD9v7n/////wcAAAAAAAD///8AAAAAPkD6P/7///8hEAAAAAAA4P//DwAAAIDBov/n////f8YAAAAAAAD8//8AAAAA+AdE//////8jDwAAAAAAgP//AwAAAMD/APD/////PxgAAAAAAADw/x8AAAAA/n/v//////8HAAAAAAAAAPwDAgAAAOD///v7////fwAAAAAAAACgHyAAAACA//9/f/7///8DAAAAAAAAAPQBAAAAAPj//+cP+P//HwAAAAAAAAAAHjAAAADA/////g////8EAAAAAAAAAOBhCAAAAPz//99/4B//AAAAAAAAAAAAPAMMAADA////+Qf44BcAAAAAAAAAAAA/AAAAAPz//78fgAf6QAAAAAAAAAAAAA8AAADg////ewA4gA8EAAAAAAAAAADAAAAAAPz//38BgAP4QQAAAAAAAAAAAAgOAADA////zwAwgAwQAAAAAAAAAAAA9Q8AAPj///8HAAFIAAAAAAAAAAAAAID/AQAA////fwBAAAAQAAAAAAAAAAAA+P8AAGDg//8DAAA0GAAAAAAAAAAAAID/HwAAAPj/HwAAgMIBAAAAAAAAAAAA/P8BAACA//8AAAA4XwAAAAAAAAAAAMD/fwAAAPz/BwAAAOOBAQAAAAAAAAAA/P8/AACA/z8AAABgLtQBAAAAAAAAAOD//w8AAPD/AwAAAAQAeAAAAAAAAAAA/P//AQAA/z8AAACAB4APAQAAAAAAAID//w8AAPD/AwAAAAARsEAAAAAAAAAA+P9/AAAA/j8AAAAAAAAAAAAAAAAAAAD//wcAAPD/QwAAAACAIwAAAAAAAAAA8P8/AAAA/z8EAAAAAD4GIAAAAAAAAAD8/wMAAPD/cQAAAAD4fwAAAAAAAAAAgP8/AAAA/w8HAAAAgP8HAAAAAAAAAAD4/wMAAOD/MAAAAAD//wEBAAAAAAAAgP8PAAAA/g8DAAAA+P8fAAAAAAAAAAD4PwAAAOB/MAAAAID//wMAAAAAAAAAgP8DAAAA/AMAAAAA+P9/AAAAAAAAAAD8HwAAAMA/AAAAAID//wcAAAAAAAAAwP8AAAAA+AEAAAAA8P9/AAAAAAAAAAD8DwAAAIAPAAAAAAAP/gMAAAAAAAAAwB8AAAAAAAAAAAAAEMAfAAAAAAAAAAD+AwAAAAAAAAAAAAAA8AEgAAAAAAAA4AcAAAAAAAAAAAAAAAAAAAYAAAAAAABeAAAAAAAAAAAAAAAAwAAwAAAAAAAAwAMAAAAAAAAAAAAAAAAIgAEAAAAAAAAeAAAAAAAAAAAAAAAAAAAMAAAAAAAA4AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAABAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAA8AOD/j/sDAAAAAAAAAAA0AAAAAABA/P/h/////w8AAAAAAAAA0AcAAED4////z///////PwAAAAAADgPxAACA/////3////////8HAADA/wP//wMAAP7/////////////BwAA+P////8AAMD//////////////38AAOH/////wQAO/v//////////////BwAA/P////8PAPT//////////////z8AGPH//////+f/////////////////P/A/////////////////////////////////////////////////////////////////////////////////////////';
// Country centroids (world-countries): "CC lat,lng;" — degrees, rounded.
const _CC_RAW = 'AW13,-70;AF33,65;AO-12,19;AI18,-63;AX60,20;AL41,20;AD43,2;AE24,54;AR-34,-64;AM40,45;AS-14,-170;AQ-90,0;TF-49,69;AG17,-62;AU-27,133;AT47,13;AZ41,48;BI-3,30;BE51,4;BJ10,2;BF13,-2;BD24,90;BG43,25;BH26,51;BS24,-76;BA44,18;BL19,-63;SH-16,-6;BY53,28;BZ17,-89;BM32,-65;BO-17,-65;BQ12,-68;BR-10,-55;BB13,-60;BN5,115;BT28,91;BV-54,3;BW-22,24;CF7,21;CA60,-95;CC-12,97;CH47,8;CL-30,-71;CN35,105;CI8,-5;CM6,12;CD0,25;CG-1,15;CK-21,-160;CO4,-72;KM-12,44;CV16,-24;CR10,-84;CU22,-80;CW12,-69;CX-10,106;KY20,-80;CY35,33;CZ50,16;DE51,9;DJ12,43;DM15,-61;DK56,10;DO19,-71;DZ28,3;EC-2,-77;EG27,30;ER15,39;EH25,-13;ES40,-4;EE59,26;ET8,38;FI64,26;FJ-18,175;FK-52,-59;FR46,2;FO62,-7;FM7,158;GA-1,12;GB54,-2;GE42,44;GG49,-3;GH8,-2;GI36,-5;GN11,-10;GP16,-62;GM13,-17;GW12,-15;GQ2,10;GR39,22;GD12,-62;GL72,-40;GT16,-90;GF4,-53;GU13,145;GY5,-59;HK22,114;HM-53,73;HN15,-86;HR45,16;HT19,-72;HU47,20;ID-5,120;IM54,-4;IN20,77;IO-6,72;IE53,-8;IR32,53;IQ33,44;IS65,-18;IL31,35;IT43,13;JM18,-77;JE49,-2;JO31,36;JP36,138;KZ48,68;KE1,38;KG41,75;KH13,105;KI1,173;KN17,-63;KR37,128;XK43,21;KW30,46;LA18,105;LB34,36;LR7,-9;LY25,17;LC14,-61;LI47,10;LK7,81;LS-29,29;LT56,24;LU50,6;LV57,25;MO22,114;MF18,-64;MA32,-5;MC44,7;MD47,29;MG-20,47;MV3,73;MX23,-102;MH9,168;MK42,22;ML17,-4;MT36,15;MM22,98;ME43,19;MN46,105;MP15,146;MZ-18,35;MR20,-12;MS17,-62;MQ15,-61;MU-20,58;MW-13,34;MY3,113;YT-13,45;NA-22,17;NC-21,166;NE16,8;NF-29,168;NG10,8;NI13,-85;NU-19,-170;NL53,6;NO62,10;NP28,84;NR-1,167;NZ-41,174;OM21,57;PK30,70;PA9,-80;PN-25,-130;PE-10,-76;PH13,122;PW8,135;PG-6,147;PL52,20;PR18,-66;KP40,127;PT40,-8;PY-23,-58;PS32,35;PF-15,-140;QA26,51;RE-21,56;RO46,25;RU60,100;RW-2,30;SA25,45;SD15,30;SN14,-14;SG1,104;GS-54,-37;SJ78,20;SB-8,159;SL9,-11;SV14,-89;SM44,12;SO10,49;PM47,-56;RS44,21;SS7,30;ST1,7;SR4,-56;SK49,20;SI46,15;SE62,15;SZ-26,32;SX18,-63;SC-5,56;SY35,38;TC22,-72;TD15,19;TG8,1;TH15,100;TJ39,71;TK-9,-172;TM40,60;TL-9,126;TO-20,-175;TT11,-61;TN34,9;TR39,35;TV-8,178;TW24,121;TZ-6,35;UG1,32;UA49,32;UM19,167;UY-33,-56;US38,-97;UZ41,64;VA42,12;VC13,-61;VE8,-66;VG18,-65;VI18,-65;VN16,108;VU-16,167;WF-13,-176;WS-14,-172;YE15,48;ZA-29,24;ZM-15,30;ZW-20,30';
let _land = null, _cc = null;
function _landBits() {
  if (_land) return _land;
  const bin = atob(_LAND_B64); _land = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) _land[i] = bin.charCodeAt(i);
  return _land;
}
function _isLand(latDeg, lngDeg) {
  const r = Math.min(89, Math.max(0, Math.floor((90 - latDeg) / 2)));
  const c = Math.min(179, Math.max(0, Math.floor((lngDeg + 180) / 2)));
  const i = r * 180 + c;
  return (_landBits()[i >> 3] >> (i & 7)) & 1;
}
function countryLatLng(code) {
  if (!_cc) { _cc = {}; _CC_RAW.split(';').forEach((s) => { const k = s.slice(0, 2), p = s.slice(2).split(','); _cc[k] = [+p[0], +p[1]]; }); }
  return _cc[String(code || '').toUpperCase()] || null;
}
window.countryLatLng = countryLatLng;
const HOME_BY_CURRENCY = { SAR: 'SA', AED: 'AE', KWD: 'KW', QAR: 'QA', BHD: 'BH', OMR: 'OM', EGP: 'EG', JOD: 'JO', USD: 'US', GBP: 'GB', TRY: 'TR', EUR: 'FR' };

// Fibonacci sphere → land dots (computed once).
let _dots = null;
function _globeDots() {
  if (_dots) return _dots;
  const N = 5600, ga = Math.PI * (3 - Math.sqrt(5)), out = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), th = i * ga;
    const X = Math.cos(th) * r, Z = Math.sin(th) * r;
    const lat = Math.asin(y) * 180 / Math.PI, lng = Math.atan2(X, Z) * 180 / Math.PI;
    if (_isLand(lat, lng)) out.push(X, y, Z);
  }
  return (_dots = new Float32Array(out));
}
const _vec = (lat, lng) => {
  const p = lat * Math.PI / 180, l = lng * Math.PI / 180;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
};

function Globe({ width = 340, height = 240, radius = 150, cx, cy, pins = [], homeCode, onReady }) {
  const ref = React.useRef(null);
  const pinsKey = pins.map((p) => p.code + p.kind).join('|');
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const reduce = window.vReduce?.();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(width * dpr); cv.height = Math.round(height * dpr);
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    const CX = cx != null ? cx : width / 2, CY = cy != null ? cy : height / 2, R = radius;
    const dots = _globeDots();
    const home = countryLatLng(homeCode) || [24, 45];
    const homeV = _vec(home[0], home[1]);
    const P = pins.map((p) => { const ll = countryLatLng(p.code); return ll && { ...p, v: _vec(ll[0], ll[1]) }; }).filter(Boolean);
    // great-circle arcs, lifted off the surface in proportion to length
    const arcs = P.filter((p) => p.code !== homeCode).map((p) => {
      const a = homeV, b = p.v;
      const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const om = Math.acos(dot), so = Math.sin(om) || 1, pts = [];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40, k1 = Math.sin((1 - t) * om) / so, k2 = Math.sin(t * om) / so;
        const lift = 1 + Math.sin(Math.PI * t) * Math.min(0.32, 0.08 + om * 0.22);
        pts.push([(k1 * a[0] + k2 * b[0]) * lift, (k1 * a[1] + k2 * b[1]) * lift, (k1 * a[2] + k2 * b[2]) * lift]);
      }
      return { pts, kind: p.kind };
    });

    // view state: yaw (lam) around the pole, fixed pitch looking a bit north
    const target = home[1] * Math.PI / 180 - 0.18;
    const S = { lam: reduce ? target : target - 2.4, phi: 0.42, vel: 0, drag: null, auto: !reduce, arcT: reduce ? 1 : 0, t0: performance.now() };
    let entrance = null;
    if (!reduce && window.vSpringTo) {
      entrance = window.vSpringTo({ from: S.lam, to: target, damping: 1, response: 1.15, onUpdate: (x) => { S.lam = x; }, onDone: () => { entrance = null; } });
    }

    // round dot sprites, one per depth bucket (drawImage is far cheaper than arc)
    const sprites = [0, 1, 2, 3].map((k) => {
      const size = 1.5 + k * 0.5, px = Math.ceil(size * dpr) + 2, c = document.createElement('canvas');
      c.width = c.height = px; const g2 = c.getContext('2d');
      g2.fillStyle = `rgba(255,244,230,${0.24 + k * 0.2})`; g2.beginPath(); g2.arc(px / 2, px / 2, (size * dpr) / 2, 0, Math.PI * 2); g2.fill();
      return { cv: c, size: px / dpr };
    });
    const project = (X, Y, Z) => {
      const cl = Math.cos(S.lam), sl = Math.sin(S.lam), cp = Math.cos(S.phi), sp = Math.sin(S.phi);
      const x1 = X * cl - Z * sl, z1 = X * sl + Z * cl;
      return [x1, Y * cp - z1 * sp, Y * sp + z1 * cp];
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, width, height);
      // atmosphere
      const g = ctx.createRadialGradient(CX, CY, R * 0.92, CX, CY, R * 1.25);
      g.addColorStop(0, 'rgba(255,170,120,0.22)'); g.addColorStop(1, 'rgba(255,170,120,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(CX, CY, R * 1.25, 0, Math.PI * 2); ctx.fill();
      // body: lit from the top-left, rim on the right
      const b = ctx.createRadialGradient(CX - R * 0.4, CY - R * 0.45, R * 0.1, CX, CY, R);
      b.addColorStop(0, 'rgba(255,240,225,0.16)'); b.addColorStop(0.7, 'rgba(255,240,225,0.05)'); b.addColorStop(1, 'rgba(255,240,225,0.10)');
      ctx.fillStyle = b; ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fill();

      // land dots in four depth buckets (one fill per bucket)
      const cl = Math.cos(S.lam), sl = Math.sin(S.lam), cp = Math.cos(S.phi), sp = Math.sin(S.phi);
      const buckets = [[], [], [], []];
      for (let i = 0; i < dots.length; i += 3) {
        const X = dots[i], Y = dots[i + 1], Z = dots[i + 2];
        const x1 = X * cl - Z * sl, z1 = X * sl + Z * cl;
        const z = Y * sp + z1 * cp; if (z <= 0.02) continue;
        const y = Y * cp - z1 * sp;
        buckets[Math.min(3, (z * 4) | 0)].push(CX + x1 * R, CY - y * R, z);
      }
      for (let k = 0; k < 4; k++) {
        const arr = buckets[k]; if (!arr.length) continue;
        const sp = sprites[k], s = sp.size;
        for (let j = 0; j < arr.length; j += 3) ctx.drawImage(sp.cv, arr[j] - s / 2, arr[j + 1] - s / 2, s, s);
      }

      // arcs (drawn in over time, hidden where the globe is in front)
      const ap = Math.max(0, Math.min(1, S.arcT));
      arcs.forEach((a) => {
        const n = Math.max(2, Math.round(a.pts.length * ap));
        ctx.beginPath(); let pen = false;
        for (let i = 0; i < n; i++) {
          const q = project(a.pts[i][0], a.pts[i][1], a.pts[i][2]);
          const hidden = q[2] < 0 && (q[0] * q[0] + q[1] * q[1]) < 1;
          if (hidden) { pen = false; continue; }
          const X = CX + q[0] * R, Y = CY - q[1] * R;
          if (!pen) { ctx.moveTo(X, Y); pen = true; } else ctx.lineTo(X, Y);
        }
        ctx.strokeStyle = a.kind === 'upcoming' ? 'rgba(255,150,100,0.9)' : a.kind === 'live' ? 'rgba(140,220,170,0.95)' : 'rgba(255,236,215,0.55)';
        ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.stroke();
      });

      // pins
      const pulse = ((now - S.t0) % 1800) / 1800;
      const drawPin = (v, color, live, size) => {
        const q = project(v[0], v[1], v[2]); if (q[2] <= 0.05) return;
        const X = CX + q[0] * R, Y = CY - q[1] * R, a = Math.min(1, q[2] * 1.6);
        const glow = ctx.createRadialGradient(X, Y, 0, X, Y, size * 4);
        glow.addColorStop(0, color.replace('A', String(0.55 * a))); glow.addColorStop(1, color.replace('A', '0'));
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(X, Y, size * 4, 0, Math.PI * 2); ctx.fill();
        if (live && !reduce) {
          ctx.strokeStyle = color.replace('A', String((1 - pulse) * 0.8 * a)); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(X, Y, size + pulse * 12, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = color.replace('A', String(a)); ctx.beginPath(); ctx.arc(X, Y, size, 0, Math.PI * 2); ctx.fill();
      };
      drawPin(homeV, 'rgba(255,255,255,A)', false, 2.6);
      P.forEach((p) => drawPin(p.v, p.kind === 'upcoming' ? 'rgba(255,140,90,A)' : p.kind === 'live' ? 'rgba(120,215,160,A)' : 'rgba(255,214,170,A)', p.kind === 'live' || p.kind === 'upcoming', 3.4));
    };

    // loop: only while on screen and the app is visible
    let raf = 0, visible = true, last = performance.now();
    const loop = (now) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!S.drag && !entrance) {
        if (Math.abs(S.vel) > 0.02) { S.lam += S.vel * dt; S.vel *= Math.pow(0.12, dt); }   // momentum decays
        else if (S.auto) S.lam += 0.07 * dt;                                                // idle drift
      }
      if (S.arcT < 1 && now - S.t0 > 650) S.arcT += dt / 1.1;
      draw(now);
      if (visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); }, { threshold: 0.01 });
    io.observe(cv);
    const onVis = () => kick();
    document.addEventListener('visibilitychange', onVis);
    draw(performance.now()); kick();
    onReady && onReady();

    // drag to spin (horizontal); vertical gestures still scroll the page
    const down = (e) => {
      if (entrance) { entrance(); entrance = null; }
      S.drag = { x: e.clientX, lam: S.lam, hist: [{ x: e.clientX, t: performance.now() }] };
      S.vel = 0; S.auto = false; cv.setPointerCapture?.(e.pointerId); kick();
    };
    const move = (e) => {
      if (!S.drag) return;
      S.lam = S.drag.lam - (e.clientX - S.drag.x) / R;
      const now = performance.now(), h = S.drag.hist;
      h.push({ x: e.clientX, t: now }); while (h.length > 2 && now - h[0].t > 100) h.shift();
      if (reduce) draw(now);
    };
    const up = () => {
      if (!S.drag) return;
      const h = S.drag.hist, a = h[0], b2 = h[h.length - 1];
      S.vel = a && b2 && b2.t > a.t ? -((b2.x - a.x) / (b2.t - a.t)) * 1000 / R : 0;   // rad/s
      S.drag = null; setTimeout(() => { S.auto = !reduce; }, 2500); kick();
    };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    return () => {
      if (raf) cancelAnimationFrame(raf); if (entrance) entrance();
      io.disconnect(); document.removeEventListener('visibilitychange', onVis);
      cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move);
      cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up);
    };
  }, [width, height, radius, cx, cy, pinsKey, homeCode]);
  return <canvas ref={ref} aria-hidden="true" style={{ width, height, display: 'block', touchAction: 'pan-y', cursor: 'grab' }} />;
}
window.Globe = Globe;

// Pins for every country in your trips: live > upcoming > past.
window.tripPins = (trips) => {
  const rank = { live: 3, upcoming: 2, past: 1 }, by = {};
  const today = window.localISO ? window.localISO() : new Date().toISOString().slice(0, 10);
  (trips || []).forEach((t) => {
    const kind = t.startDate && t.endDate
      ? (today < t.startDate ? 'upcoming' : today > t.endDate ? 'past' : 'live')
      : 'upcoming';
    (t.countries || []).forEach((c) => {
      const k = String(c).toUpperCase();
      if (!by[k] || rank[kind] > rank[by[k]]) by[k] = kind;
    });
  });
  return Object.keys(by).map((code) => ({ code, kind: by[code] }));
};
window.homeCountryCode = () => HOME_BY_CURRENCY[window.USER_DEFAULT_CURRENCY || 'SAR'] || 'SA';

// ── Tilt: a card leans toward your finger, with a glare ────────────────
function bindTilt(el, { max = 9, scale = 0.985, glare = true } = {}) {
  if (!el || window.vReduce?.()) return () => {};
  let shine = null, cancel = null;
  const st = { rx: 0, ry: 0, gx: 50, gy: 50, on: false };
  if (glare) {
    shine = document.createElement('div');
    shine.setAttribute('aria-hidden', 'true');
    shine.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity 220ms ease;z-index:5;mix-blend-mode:soft-light;';
    el.appendChild(shine);
  }
  const paint = () => {
    el.style.transform = `perspective(900px) rotateX(${st.rx}deg) rotateY(${st.ry}deg) scale(${st.on ? scale : 1})`;
    if (shine) shine.style.background = `radial-gradient(circle at ${st.gx}% ${st.gy}%, rgba(255,255,255,0.8), rgba(255,255,255,0) 58%)`;
  };
  const aim = (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    st.ry = (px - 0.5) * 2 * max; st.rx = -(py - 0.5) * 2 * max; st.gx = px * 100; st.gy = py * 100;
  };
  const down = (e) => { if (cancel) cancel(); st.on = true; aim(e); el.style.transition = 'transform 140ms ease-out'; paint(); if (shine) shine.style.opacity = '1'; };
  const move = (e) => { if (!st.on) return; el.style.transition = 'none'; aim(e); paint(); };
  const up = () => {
    if (!st.on) return; st.on = false; el.style.transition = 'none'; if (shine) shine.style.opacity = '0';
    const rx0 = st.rx, ry0 = st.ry;
    cancel = window.vSpringTo({ from: 1, to: 0, damping: 0.6, response: 0.45,
      onUpdate: (k) => { st.rx = rx0 * k; st.ry = ry0 * k; paint(); },
      onDone: () => { cancel = null; el.style.transform = ''; } });
  };
  el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', up);
  return () => {
    if (cancel) cancel(); if (shine) shine.remove();
    el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('pointerleave', up);
  };
}
// Callback ref: binds whenever the element (re)mounts, e.g. after a skeleton.
function useTiltRef(opts) {
  const off = React.useRef(null);
  return React.useCallback((el) => {
    if (off.current) { off.current(); off.current = null; }
    if (el) off.current = bindTilt(el, opts);
  }, []);
}
function Tilt({ children, style, className, max, radius = 24 }) {
  const ref = useTiltRef({ max });
  return <div ref={ref} className={className} style={{ position: 'relative', borderRadius: radius, willChange: 'transform', ...style }}>{children}</div>;
}
Object.assign(window, { bindTilt, useTiltRef, Tilt });

// ── WalletCarousel: the group's cards in 3D cover-flow ─────────────────
function WalletCarousel({ cards, members, fmt }) {
  const ar = !!window.isRTL, s = ar ? -1 : 1, n = cards.length;
  const wrapRef = React.useRef(null), cardEls = React.useRef([]), dotEls = React.useRef([]);
  const st = React.useRef({ p: 0, cancel: null, drag: null }).current;
  const SP = 0.62;               // spacing as a fraction of card width
  const apply = (p) => {
    st.p = p;
    const w = wrapRef.current ? wrapRef.current.offsetWidth * 0.78 : 280;
    cardEls.current.forEach((el, i) => {
      if (!el) return;
      const d = i - p, ad = Math.abs(d);
      el.style.transform = `translate3d(${s * d * w * SP}px,0,${-Math.min(ad, 2.5) * 140}px) rotateY(${-s * Math.max(-1.4, Math.min(1.4, d)) * 34}deg)`;
      el.style.zIndex = String(100 - Math.round(ad * 10));
      el.style.opacity = String(Math.max(0, 1 - Math.max(0, ad - 1.2) * 0.9));
      el.style.filter = `brightness(${1 - Math.min(ad, 1.5) * 0.22})`;
    });
    dotEls.current.forEach((el, i) => { if (el) { const a = Math.max(0, 1 - Math.abs(i - p)); el.style.width = `${6 + a * 12}px`; el.style.opacity = String(0.35 + a * 0.65); } });
  };
  const go = (to, v = 0, damping = 0.82) => {
    if (st.cancel) st.cancel();
    st.cancel = window.vSpringTo({ from: st.p, to, velocity: v, damping, response: 0.38, onUpdate: apply, onDone: () => { st.cancel = null; } });
  };
  React.useLayoutEffect(() => {
    apply(window.vReduce?.() ? 0 : -1.1);
    if (!window.vReduce?.()) setTimeout(() => go(0, 0, 0.78), 160);   // cards fly in
  }, [n]);
  React.useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const unit = () => el.offsetWidth * 0.78 * SP;
    const down = (e) => {
      if (st.cancel) { st.cancel(); st.cancel = null; }
      st.drag = { x: e.clientX, y: e.clientY, p0: st.p, hist: [{ x: e.clientX, t: performance.now() }], moved: false };
    };
    const move = (e) => {
      const g = st.drag; if (!g) return;
      const dx = e.clientX - g.x;
      if (!g.moved && Math.abs(dx) < 8) return;
      if (!g.moved) { g.moved = true; el.setPointerCapture?.(e.pointerId); }
      let p = g.p0 - (dx * s) / unit();
      if (p < 0) p = -window.vRubber(-p, 1); if (p > n - 1) p = n - 1 + window.vRubber(p - (n - 1), 1);
      const now = performance.now(); g.hist.push({ x: e.clientX, t: now }); while (g.hist.length > 2 && now - g.hist[0].t > 100) g.hist.shift();
      apply(p);
    };
    const up = (e) => {
      const g = st.drag; st.drag = null; if (!g) return;
      if (!g.moved) {                       // a tap: bring that card forward
        const hit = cardEls.current.findIndex((c) => c && c.contains(e.target));
        if (hit >= 0 && hit !== Math.round(st.p)) { go(hit); window.haptic?.(); }
        return;
      }
      const a = g.hist[0], b = g.hist[g.hist.length - 1];
      const vx = a && b && b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
      const v = -(vx * s) / unit();                                       // cards per second
      const landing = st.p + window.vProject(v, 0.99);
      const to = Math.max(0, Math.min(n - 1, Math.round(landing)));
      if (to !== Math.round(g.p0)) window.haptic?.();
      go(to, v);
    };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      if (st.cancel) st.cancel();
    };
  }, [n]);

  return (
    <div style={{ marginTop: 14 }}>
      <div ref={wrapRef} style={{ position: 'relative', height: 178, perspective: '1000px', touchAction: 'pan-y', userSelect: 'none', WebkitUserSelect: 'none' }}>
        {cards.map((c, i) => {
          const m = members.find((x) => x.id === c.id) || { id: c.id, name: '?', hue: 200 };
          const hue = m.hue != null ? m.hue : 200;
          const pct = c.amountUSD > 0 ? Math.max(0, Math.min(1, c.spent / c.amountUSD)) : 0;
          const name = (m.name || '').split(' ')[0];
          return (
            <div key={c.id} ref={(el) => { cardEls.current[i] = el; }} style={{
              position: 'absolute', top: 4, left: '11%', width: '78%', height: 168, borderRadius: 20,
              padding: '16px 18px', color: '#fff', overflow: 'hidden', willChange: 'transform',
              background: `linear-gradient(135deg, hsl(${hue} 46% 38%) 0%, hsl(${(hue + 38) % 360} 52% 22%) 100%)`,
              boxShadow: '0 18px 36px -12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backfaceVisibility: 'hidden',
            }}>
              {/* sheen + pattern */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 38%), radial-gradient(120% 90% at 100% 100%, rgba(255,255,255,0.10), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', insetInlineEnd: -80, top: -110, border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 34, height: 25, borderRadius: 6, background: 'linear-gradient(135deg,#f3dca0,#b8954a)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.18)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.92 }}>{ar ? `بطاقة ${name}` : `${name}'s card`}</span>
                </div>
                <span className="serif-italic" style={{ fontSize: 15, opacity: 0.8 }}>voyage</span>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 11.5, opacity: 0.75 }}>{ar ? 'المتبقي' : 'Left'}</div>
                <div className="mono" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', direction: 'ltr', textAlign: ar ? 'right' : 'left' }}>
                  <window.CountUp value={c.left} format={fmt} />
                </div>
                <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.22)', marginTop: 8, overflow: 'hidden' }}>
                  <div className="v-grow" style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 99, background: c.left < 0 ? '#ffb4a2' : '#fff' }} />
                </div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 5 }}>
                  {ar ? `صُرف ${fmt(c.spent)} من ${fmt(c.amountUSD)}` : `${fmt(c.spent)} of ${fmt(c.amountUSD)} spent`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {n > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8 }}>
          {cards.map((c, i) => <span key={c.id} ref={(el) => { dotEls.current[i] = el; }} style={{ height: 6, width: 6, borderRadius: 99, background: 'var(--ink)', opacity: 0.35 }} />)}
        </div>
      )}
    </div>
  );
}
window.WalletCarousel = WalletCarousel;

// ── Scroll depth: items turn in 3D as they move through a scroller ─────
// axis 'y' → a gentle drum (rows tip as they leave the middle);
// axis 'x' → a concave row (side items angle toward the centre).
function bindDepthScroll(scroller, items, { axis = 'y', rot = 9, scale = 0.04, persp = 1100 } = {}) {
  if (!scroller || window.vReduce?.()) return () => {};
  let raf = 0;
  const paint = () => {
    raf = 0;
    const r = scroller.getBoundingClientRect();
    const mid = axis === 'y' ? r.top + r.height / 2 : r.left + r.width / 2;
    const span = axis === 'y' ? r.height : r.width;
    items().forEach((el) => {
      const b = el.getBoundingClientRect();
      const c = axis === 'y' ? b.top + b.height / 2 : b.left + b.width / 2;
      const t = Math.max(-1, Math.min(1, (c - mid) / span));
      el.style.transform = axis === 'y'
        ? `perspective(${persp}px) rotateX(${(-t * rot).toFixed(2)}deg) scale(${(1 - Math.abs(t) * scale).toFixed(4)})`
        : `perspective(${persp}px) rotateY(${(-t * rot).toFixed(2)}deg) scale(${(1 - Math.abs(t) * scale).toFixed(4)})`;
    });
  };
  const on = () => { if (!raf) raf = requestAnimationFrame(paint); };
  scroller.addEventListener('scroll', on, { passive: true });
  window.addEventListener('resize', on);
  paint(); setTimeout(paint, 400);
  return () => { scroller.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
}
// Horizontal row: pass as a callback ref; its children get the depth.
function useDepthRowRef(opts) {
  const off = React.useRef(null);
  return React.useCallback((el) => {
    if (off.current) { off.current(); off.current = null; }
    if (el) off.current = bindDepthScroll(el, () => Array.from(el.children), { axis: 'x', rot: 22, scale: 0.08, ...opts });
  }, []);
}
Object.assign(window, { bindDepthScroll, useDepthRowRef });

// ── PassportCard: your traveller profile as a passport that flips ──────
// Front: the data page (photo, name, totals, machine-readable lines).
// Back: a stamp for every country you've travelled to.
const _INKS = ['#9b2335', '#1f3a7a', '#2e6b4a', '#6a3d8f', '#a05a14'];
function PassportCard({ me, email, stats }) {
  const ar = !!window.isRTL;
  const [flipped, setFlipped] = React.useState(false);
  const tilt = useTiltRef({ max: 5 });
  const flip = window.vSpring ? window.vSpring(0.78, 0.62) : { duration: 600, easing: 'ease' };
  const stamps = [];
  (window.TRIPS || []).slice().sort((a, b) => String(a.startDate).localeCompare(String(b.startDate))).forEach((tr) => {
    (tr.countries || []).forEach((c) => { if (stamps.length < 9) stamps.push({ code: String(c).toUpperCase(), title: tr.title || '', date: tr.startDate }); });
  });
  const latin = String((email || '').split('@')[0] || 'TRAVELER').toUpperCase().replace(/[^A-Z]/g, '') || 'TRAVELER';
  const mrz1 = ('P<VOY' + latin + '<<' + 'VOYAGE').padEnd(36, '<').slice(0, 36);
  const mrz2 = (`${String(stats.totalTrips).padStart(2, '0')}T${String(stats.totalDays).padStart(3, '0')}D${String(stats.countries).padStart(2, '0')}C<SAU<<` + (window.localISO?.() || '').replace(/-/g, '')).padEnd(36, '<').slice(0, 36);
  const paper = 'linear-gradient(135deg, #f6efdc 0%, #ebdfc4 100%)';
  const guilloche = 'repeating-linear-gradient(45deg, rgba(120,90,40,0.06) 0 1px, transparent 1px 8px), repeating-linear-gradient(-45deg, rgba(40,70,120,0.05) 0 1px, transparent 1px 8px)';
  const face = { position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', color: '#2b2418', boxShadow: '0 22px 40px -18px rgba(40,25,10,0.55), inset 0 0 0 1px rgba(90,70,40,0.18)' };
  const label = { fontSize: 9.5, letterSpacing: '0.04em', color: 'rgba(60,45,25,0.6)' };
  const value = { fontSize: 14, fontWeight: 600, color: '#231c12' };
  return (
    <div style={{ padding: '0 14px 6px' }}>
      <div ref={tilt} role="button" aria-label={ar ? 'جواز السفر — اضغط للقلب' : 'Passport — tap to flip'}
        onClick={() => { setFlipped((f) => !f); window.haptic?.(); }}
        style={{ position: 'relative', borderRadius: 22, perspective: '1100px', cursor: 'pointer', willChange: 'transform' }}>
        <div style={{ position: 'relative', height: 226, transformStyle: 'preserve-3d',
          transition: `transform ${flip.duration}ms ${flip.easing}`, transform: `rotateY(${flipped ? (ar ? -180 : 180) : 0}deg)` }}>
          {/* FRONT — data page */}
          <div style={{ ...face, background: `${guilloche}, ${paper}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 0' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#1f3a7a' }}>{ar ? 'جواز سفر · PASSPORT' : 'PASSPORT'}</span>
              <span className="serif-italic" style={{ fontSize: 16, color: '#1f3a7a' }}>voyage</span>
            </div>
            <div style={{ display: 'flex', gap: 14, padding: '10px 16px 0' }}>
              <div style={{ position: 'relative', width: 72, height: 90, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
                background: `linear-gradient(150deg, oklch(0.78 0.09 ${me.hue || 35}) 0%, oklch(0.48 0.13 ${me.hue || 35}) 100%)`,
                display: 'grid', placeItems: 'center', color: '#fff', fontSize: 28, fontWeight: 700, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.35)' }}>
                {me.initials}
                {/* holographic security sheen */}
                <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 210deg, rgba(255,0,150,0.18), rgba(0,200,255,0.18), rgba(120,255,120,0.15), rgba(255,220,0,0.16), rgba(255,0,150,0.18))', mixBlendMode: 'overlay' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 6 }}>
                <div><div style={label}>{ar ? 'الاسم / Name' : 'Name'}</div><div style={{ ...value, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.name}</div></div>
                <div><div style={label}>{ar ? 'البريد / Email' : 'Email'}</div><div style={{ ...value, fontSize: 12, fontWeight: 500, direction: 'ltr', textAlign: ar ? 'right' : 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email || '—'}</div></div>
                <div style={{ display: 'flex', gap: 14 }}>
                  {[[stats.totalTrips, ar ? 'رحلات' : 'Trips'], [stats.totalDays, ar ? 'أيام' : 'Days'], [stats.countries, ar ? 'دول' : 'Countries']].map(([n, l]) => (
                    <div key={l}><div style={label}>{l}</div><div className="mono" style={{ ...value, fontSize: 17 }}><window.CountUp value={n} format={(v) => String(Math.round(v))} /></div></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mono" dir="ltr" style={{ direction: 'ltr', unicodeBidi: 'bidi-override', textAlign: 'left', position: 'absolute', insetInline: 0, bottom: 0, padding: '7px 16px 10px', fontSize: 10.5, letterSpacing: '0.16em', lineHeight: 1.45, color: '#3a3121', background: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(90,70,40,0.15)', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {mrz1}<br />{mrz2}
            </div>
          </div>
          {/* BACK — stamps page */}
          <div style={{ ...face, transform: `rotateY(${ar ? -180 : 180}deg)`, background: `${guilloche}, linear-gradient(135deg, #f8f2e2 0%, #efe4cb 100%)` }}>
            <div style={{ padding: '12px 16px 0', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(60,45,25,0.6)' }}>{ar ? 'أختام الرحلات · VISAS' : 'STAMPS · VISAS'}</div>
            {stamps.length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 13, color: 'rgba(60,45,25,0.6)', padding: 24, textAlign: 'center' }}>
                {ar ? 'ما فيه أختام بعد — أول رحلة بتنختم هنا' : 'No stamps yet — your first trip lands here'}
              </div>
            )}
            {stamps.map((s, i) => {
              const col = i % 3, row = Math.floor(i / 3), ink = _INKS[i % _INKS.length];
              const rot = ((i * 37) % 31) - 15, round = i % 2 === 0;
              const d = s.date ? new Date(s.date + 'T00:00:00') : null;
              const when = d ? d.toLocaleDateString('en', { month: 'short', year: 'numeric' }).toUpperCase() : '';
              return (
                <div key={i} className={flipped ? 'v-stamp' : undefined} style={{
                  position: 'absolute', top: 34 + (3 - Math.ceil(stamps.length / 3)) * 31 + row * 62 + ((i * 13) % 9), left: `${6 + col * 31 + ((i * 7) % 5)}%`,
                  width: 82, height: 54, transform: `rotate(${rot}deg)`, '--r': `${rot}deg`, color: ink, opacity: 0.86, mixBlendMode: 'multiply',
                  border: `2px solid ${ink}`, borderRadius: round ? 999 : 8, boxShadow: `inset 0 0 0 3px #f5ecd8, inset 0 0 0 4.5px ${ink}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.05,
                  animationDelay: `${200 + i * 110}ms`, direction: 'ltr',
                }}>
                  <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '0.06em' }}>{s.code}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, maxWidth: 70, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title.toUpperCase()}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: '0.08em' }}>{when}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 8 }}>
        {flipped ? (ar ? 'اضغط لترجع لصفحة البيانات' : 'Tap to flip back') : (ar ? 'اضغط على الجواز لتشوف أختام رحلاتك' : 'Tap the passport to see your stamps')}
      </div>
    </div>
  );
}
window.PassportCard = PassportCard;

// ── PassStack: your next bookings as wallet passes ─────────────────────
const _PASS_BG = {
  flights: 'linear-gradient(135deg, #2b4a8f 0%, #172447 100%)',
  lodging: 'linear-gradient(135deg, #c0603f 0%, #6d2a1d 100%)',
  transport: 'linear-gradient(135deg, #b48a2e 0%, #5d4315 100%)',
  visas: 'linear-gradient(135deg, #2f7656 0%, #163a2a 100%)',
};
function _passWhen(d) {
  const x = d.details || {};
  return d.category === 'flights' ? x.dep_at : d.category === 'lodging' ? x.check_in_at
    : d.category === 'transport' ? x.pickup_at : d.category === 'visas' ? x.expires_on : null;
}
function PassStack({ docs, onOpen }) {
  const ar = !!window.isRTL;
  const today = window.localISO ? window.localISO() : new Date().toISOString().slice(0, 10);
  const dated = docs.filter((d) => _passWhen(d)).map((d) => ({ d, w: String(_passWhen(d)) }));
  let pick = dated.filter((x) => x.w.slice(0, 10) >= today).sort((a, b) => a.w.localeCompare(b.w));
  const upcoming = pick.length > 0;
  if (!upcoming) pick = dated.sort((a, b) => b.w.localeCompare(a.w));
  pick = pick.slice(0, 4);
  const [open, setOpen] = React.useState(false);
  if (!pick.length) return null;
  const n = pick.length, H = 138, GAP = 12, PEEK = 13;
  const sp = window.vSpring ? window.vSpring(0.8, 0.5) : { duration: 500, easing: 'ease' };
  const tr = `transform ${sp.duration}ms ${sp.easing}, height ${sp.duration}ms ${sp.easing}, filter ${sp.duration}ms ease`;
  const daysTo = (w) => Math.round((new Date(w.slice(0, 10) + 'T00:00:00') - new Date(today + 'T00:00:00')) / 86400000);
  const rel = (w) => { const k = daysTo(w); return k === 0 ? (ar ? 'اليوم' : 'Today') : k === 1 ? (ar ? 'بكرة' : 'Tomorrow') : k > 0 ? (ar ? `بعد ${k} أيام` : `In ${k} days`) : (ar ? 'مضى' : 'Past'); };
  const time = (w) => (w.length > 11 ? w.slice(11, 16) : '');
  return (
    <div style={{ padding: '0 14px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 8px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{upcoming ? (ar ? 'حجوزاتك الجاية' : 'Up next') : (ar ? 'آخر الحجوزات' : 'Recent')}</div>
        {n > 1 && <button onClick={() => { setOpen((o) => !o); window.haptic?.(); }} style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 500, minHeight: 32, padding: '0 6px' }}>
          {open ? (ar ? 'تجميع' : 'Stack') : (ar ? `عرض الكل (${n})` : `Show all (${n})`)}</button>}
      </div>
      <div onClick={() => { if (!open && n > 1) { setOpen(true); window.haptic?.(); } }} style={{
        position: 'relative', height: open ? n * H + (n - 1) * GAP : H + (n - 1) * PEEK, transition: tr, perspective: '1200px',
      }}>
        {pick.map(({ d, w }, i) => {
          const x = d.details || {};
          const y = open ? i * (H + GAP) : (n - 1 - i) * PEEK;
          const sc = open ? 1 : 1 - i * 0.05;
          return (
            <div key={d.id} onClick={(e) => { if (open || n === 1) { e.stopPropagation(); onOpen(d); } }} style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: H, borderRadius: 18, color: '#fff', overflow: 'hidden',
              background: _PASS_BG[d.category] || _PASS_BG.flights, zIndex: n - i, transformOrigin: '50% 0',
              transform: `translate3d(0, ${y}px, ${open ? 0 : -i * 30}px) scale(${sc}) rotateX(${open ? 0 : i * 4}deg)`,
              filter: `brightness(${open ? 1 : 1 - i * 0.12})`, transition: tr,
              boxShadow: '0 16px 30px -14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)', cursor: 'pointer',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 40%)', pointerEvents: 'none' }} />
              {/* perforation + notches between body and stub */}
              <div style={{ position: 'absolute', top: 10, bottom: 10, insetInlineEnd: '27%', borderInlineStart: '2px dashed rgba(255,255,255,0.28)' }} />
              <div style={{ position: 'absolute', top: -9, insetInlineEnd: 'calc(27% - 9px)', width: 18, height: 18, borderRadius: 99, background: 'var(--cream)' }} />
              <div style={{ position: 'absolute', bottom: -9, insetInlineEnd: 'calc(27% - 9px)', width: 18, height: 18, borderRadius: 99, background: 'var(--cream)' }} />
              {/* body */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, insetInlineEnd: '27%', padding: '13px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11.5, opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.category === 'flights' ? `✈︎ ${x.airline || (ar ? 'بطاقة صعود' : 'Boarding pass')}` : d.category === 'lodging' ? (ar ? '🏨 إقامة' : '🏨 Stay') : d.category === 'transport' ? `🚗 ${x.vendor || (ar ? 'تنقل' : 'Transport')}` : (ar ? '🛂 تأشيرة' : '🛂 Visa')}
                  {d.ownerUserId ? ' · 🔒' : ''}
                </div>
                {d.category === 'flights' && x.dep_airport && x.arr_airport ? (
                  <div dir="ltr" style={{ direction: 'ltr', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: ar ? 'flex-end' : 'flex-start' }}>
                    <div><div className="mono" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{String(x.dep_airport).toUpperCase().slice(0, 3)}</div><div style={{ fontSize: 11, opacity: 0.75, marginTop: 3 }}>{time(String(x.dep_at || ''))}</div></div>
                    <div style={{ flex: '0 0 auto', opacity: 0.85, fontSize: 16 }}>——✈——</div>
                    <div><div className="mono" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{String(x.arr_airport).toUpperCase().slice(0, 3)}</div><div style={{ fontSize: 11, opacity: 0.75, marginTop: 3 }}>{time(String(x.arr_at || ''))}</div></div>
                  </div>
                ) : (
                  <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
                )}
                <div style={{ fontSize: 12, opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.category === 'lodging' && x.check_in_at ? `${window.fmtDate(x.check_in_at)} → ${x.check_out_at ? window.fmtDate(x.check_out_at) : ''}`
                    : d.category === 'transport' && x.pickup_at ? `${window.fmtDate(x.pickup_at)}${x.dropoff_at ? ' → ' + window.fmtDate(x.dropoff_at) : ''}`
                    : d.category === 'visas' ? `${x.visa_type || ''}${x.expires_on ? (ar ? ' · ينتهي ' : ' · expires ') + window.fmtDate(x.expires_on) : ''}`
                    : d.title}
                </div>
              </div>
              {/* stub */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, insetInlineEnd: 0, width: '27%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{new Date(w.slice(0, 10) + 'T00:00:00').getDate()}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{new Date(w.slice(0, 10) + 'T00:00:00').toLocaleDateString(ar ? 'ar' : 'en', { month: 'short' })}</div>
                <div style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.18)', marginTop: 4 }}>{rel(w)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
window.PassStack = PassStack;

// ── Bars3D: daily spend as 3D columns that rise, with the plan line ─────
function Bars3D({ days, max, today, fmt, planPerDay }) {
  const ar = !!window.isRTL;
  const [sel, setSel] = React.useState(null);
  const W = 320, H = 118, base = 96, top = 14;
  const n = Math.max(1, days.length), slot = W / n, bw = Math.min(26, slot * 0.58), dx = Math.min(9, bw * 0.42), dy = dx * 0.62;
  const peak = Math.max(max, planPerDay || 0, 1);
  const hOf = (v) => Math.max(3, (v / peak) * (base - top - dy));
  const order = ar ? days.slice().reverse() : days;
  const planY = planPerDay ? base - hOf(planPerDay) : null;
  const s = sel != null ? days.find((d) => d.k === sel) : null;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ height: 18, fontSize: 12, color: 'var(--ink-soft)', textAlign: 'center' }}>
        {s ? <>{ar ? `اليوم ${s.n}: ` : `Day ${s.n}: `}<b className="mono">{fmt(s.v)}</b></> : (ar ? 'اضغط على يوم لتشوف صرفه' : 'Tap a day')}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible', direction: 'ltr' }}>
        <defs>
          <linearGradient id="v3d-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--ink-soft)" /><stop offset="1" stopColor="var(--ink)" /></linearGradient>
          <linearGradient id="v3d-hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e08a5f" /><stop offset="1" stopColor="var(--clay-deep)" /></linearGradient>
        </defs>
        <line x1="0" y1={base} x2={W} y2={base} stroke="var(--hairline-2)" strokeWidth="1" />
        {order.map((d, i) => {
          const x = i * slot + (slot - bw - dx) / 2, h = hOf(d.v), y = base - h;
          const hot = d.k === today || (planPerDay && d.v > planPerDay);
          const front = hot ? 'url(#v3d-hot)' : 'url(#v3d-front)';
          const on = sel === d.k;
          return (
            <g key={d.k} style={{ opacity: d.v ? 1 : 0.35, cursor: 'pointer' }}
              onClick={() => { setSel(on ? null : d.k); window.haptic?.(); }}>
              <rect x={i * slot} y={0} width={slot} height={H} fill="transparent" />
              <g className="v-bar" style={{ animationDelay: `${120 + i * 55}ms` }}>
              {/* side */}
              <polygon points={`${x + bw},${y} ${x + bw + dx},${y - dy} ${x + bw + dx},${base - dy} ${x + bw},${base}`} fill={hot ? 'var(--clay-deep)' : 'var(--ink)'} opacity="0.75" />
              {/* front */}
              <rect x={x} y={y} width={bw} height={h} fill={front} rx="1.5" />
              {/* top */}
              <polygon points={`${x},${y} ${x + dx},${y - dy} ${x + bw + dx},${y - dy} ${x + bw},${y}`} fill={hot ? '#f2b08e' : 'var(--ink-mute)'} />
              {on && <rect x={x - 2} y={y - dy - 3} width={bw + dx + 4} height={h + dy + 5} rx="4" fill="none" stroke="var(--clay)" strokeWidth="1.5" />}
              </g>
              <text x={x + bw / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--ink-mute)">{d.n}</text>
            </g>
          );
        })}
        {planY != null && <>
          <line x1="0" y1={planY} x2={W} y2={planY} stroke="var(--moss)" strokeWidth="1.2" strokeDasharray="4 4" />
          <text x={ar ? W - 2 : 2} y={planY - 5} textAnchor="start" fontSize="9.5" fill="var(--moss)" style={{ direction: ar ? 'rtl' : 'ltr', unicodeBidi: 'plaintext' }}>{ar ? 'الخطة اليومية' : 'Daily plan'}</text>
        </>}
      </svg>
    </div>
  );
}
window.Bars3D = Bars3D;
