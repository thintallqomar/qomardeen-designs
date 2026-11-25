import { useEffect, useRef, useState } from 'react';

/**
 * Quiet scenery behind the footer, in the mood of the games Qomardeen plays after hours
 * (a neon coast at sunset, a frontier at dusk, a moonlit field, a city at night).
 * All four are original drawings: no game art, logos or characters.
 *
 * - Crossfades to the next scene every few seconds, only while the footer is on screen and the tab is visible.
 * - Reduced motion: shows one still scene, no crossfade and no drifting.
 * - Faded and masked at the top, so it melts into whatever page sits above.
 * - Purely decorative: hidden from screen readers and never catches clicks.
 */

const W = 1440;
const H = 320;

/* Small seeded random, so the drawings look the same on every visit (no layout jumps). */
const rand = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const NeonCoast = () => {
  const r = rand(7);
  const towers = Array.from({ length: 26 }, (_, i) => ({ x: 560 + i * 26 + r() * 8, w: 14 + r() * 14, h: 30 + r() * 90 }));
  // A palm: a gently curved trunk and six drooping fronds.
  const palm = (x: number, s: number, flip = 1) => (
    <g transform={`translate(${x} ${H}) scale(${s * flip} ${s})`}>
      <path d="M0 0 C 4 -70 14 -130 32 -180" stroke="#1a0b2e" strokeWidth="9" fill="none" strokeLinecap="round" />
      <g stroke="#1a0b2e" strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M32 -180 Q -10 -200 -58 -150" />
        <path d="M32 -180 Q 0 -222 -34 -214" />
        <path d="M32 -180 Q 48 -228 82 -214" />
        <path d="M32 -180 Q 86 -204 112 -150" />
        <path d="M32 -180 Q 70 -170 86 -122" />
        <path d="M32 -180 Q 0 -168 -14 -120" />
      </g>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      <defs>
        <linearGradient id="fs-nc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b0f4c" />
          <stop offset=".55" stopColor="#c2366e" />
          <stop offset="1" stopColor="#ff9a5a" />
        </linearGradient>
        <linearGradient id="fs-nc-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#ff4f8b" />
        </linearGradient>
        <linearGradient id="fs-nc-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a1f5e" />
          <stop offset="1" stopColor="#2b0f4c" />
        </linearGradient>
        <clipPath id="fs-nc-sunclip">
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x="0" y={120 + i * 14} width={W} height={14 - Math.min(i, 6) * 1.6} />
          ))}
          <rect x="0" y="0" width={W} height="120" />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill="url(#fs-nc-sky)" />
      <circle cx="980" cy="214" r="118" fill="url(#fs-nc-sun)" clipPath="url(#fs-nc-sunclip)" />
      <g fill="#3a1252">
        {towers.map((t, i) => <rect key={i} x={t.x} y={252 - t.h} width={t.w} height={t.h + 4} />)}
      </g>
      <rect y="252" width={W} height={H - 252} fill="url(#fs-nc-sea)" />
      <g stroke="#ff9ac2" strokeOpacity=".55" strokeLinecap="round">
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={980 - 100 + i * 8} x2={980 + 100 - i * 8} y1={262 + i * 8} y2={262 + i * 8} strokeWidth={3 - i * 0.3} />
        ))}
      </g>
      {palm(140, 1.05)}
      {palm(250, 0.78, -1)}
      {palm(1330, 0.95, -1)}
    </svg>
  );
};

const FrontierDusk = () => {
  const poles = [180, 330, 480, 630, 780];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      <defs>
        <linearGradient id="fs-fd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2a3f" />
          <stop offset=".6" stopColor="#c46a3a" />
          <stop offset="1" stopColor="#f2b467" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#fs-fd-sky)" />
      <circle cx="1120" cy="236" r="46" fill="#ffd79a" opacity=".85" />
      <path d={`M0 214 L120 190 L210 196 L250 150 L330 150 L360 196 L520 206 L640 168 L700 170 L760 204 L980 214 L1060 178 L1200 178 L1240 212 L${W} 200 L${W} ${H} L0 ${H} Z`} fill="#8a4a32" />
      <path d={`M0 250 Q 300 226 560 246 T 1100 240 T ${W} 236 L${W} ${H} L0 ${H} Z`} fill="#5b2f25" />
      <path d={`M0 284 Q 360 266 720 280 T ${W} 276 L${W} ${H} L0 ${H} Z`} fill="#2e1a1a" />
      <g stroke="#2e1a1a" strokeWidth="3" fill="none">
        {poles.map(x => (
          <g key={x}>
            <line x1={x} y1={286} x2={x} y2={214} />
            <line x1={x - 14} y1={222} x2={x + 14} y2={222} />
          </g>
        ))}
        {poles.slice(0, -1).map((x, i) => (
          <path key={i} d={`M${x} 222 Q ${x + 75} 236 ${poles[i + 1]} 222`} strokeWidth="1.2" />
        ))}
      </g>
      <g transform="translate(1290 0)" stroke="#2e1a1a" fill="none" strokeWidth="3">
        <path d="M-16 284 L0 182 L16 284 M-11 250 L11 250 M-7 220 L7 220" />
        <g transform="translate(0 182)">
          <g className="fs-spin">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <line key={a} x1="0" y1="0" x2="0" y2="-30" transform={`rotate(${a})`} strokeWidth="4" />
            ))}
          </g>
        </g>
      </g>
      <g fill="none" stroke="#3b2a3f" strokeWidth="2" strokeLinecap="round">
        <path d="M860 92 q 8 -7 16 0 q 8 -7 16 0" />
        <path d="M910 72 q 6 -5 12 0 q 6 -5 12 0" />
        <path d="M820 118 q 5 -4 10 0 q 5 -4 10 0" />
      </g>
    </svg>
  );
};

const MoonlitField = () => {
  const r = rand(19);
  const blades = Array.from({ length: 150 }, (_, i) => ({ x: (i / 150) * W + r() * 10, h: 34 + r() * 46, lean: -10 + r() * 20 }));
  const leaves = Array.from({ length: 14 }, () => ({ x: r() * W, y: 40 + r() * 180, d: 6 + r() * 7, s: 3 + r() * 3 }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      <defs>
        <linearGradient id="fs-mf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1a2e" />
          <stop offset="1" stopColor="#3d4f6b" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#fs-mf-sky)" />
      <circle cx="300" cy="178" r="54" fill="#f3ead2" opacity=".9" />
      <path d={`M0 228 L160 170 L260 200 L420 140 L560 196 L700 160 L860 210 L1000 150 L1160 200 L1300 168 L${W} 196 L${W} ${H} L0 ${H} Z`} fill="#2a3a55" opacity=".9" />
      <path d={`M0 256 Q 260 226 520 246 T 1040 236 T ${W} 240 L${W} ${H} L0 ${H} Z`} fill="#1c2840" />
      <g transform="translate(1080 214)" fill="#8f2d2d">
        <rect x="-38" y="-46" width="76" height="6" rx="2" />
        <rect x="-32" y="-36" width="64" height="4" />
        <rect x="-26" y="-40" width="5" height="44" />
        <rect x="21" y="-40" width="5" height="44" />
      </g>
      <g stroke="#c9b98a" strokeOpacity=".7" strokeWidth="1.6" fill="none" strokeLinecap="round" className="fs-sway">
        {blades.map((b, i) => (
          <path key={i} d={`M${b.x} ${H} Q ${b.x + b.lean / 2} ${H - b.h / 2} ${b.x + b.lean} ${H - b.h}`} />
        ))}
      </g>
      <g fill="#d1584a">
        {leaves.map((l, i) => (
          <ellipse
            key={i}
            cx={l.x}
            cy={l.y}
            rx={l.s}
            ry={l.s / 2.2}
            className="fs-leaf"
            style={{ animationDuration: `${l.d}s`, animationDelay: `${-l.d * (i / leaves.length)}s` }}
          />
        ))}
      </g>
    </svg>
  );
};

const CityNight = () => {
  const r = rand(31);
  const blocks = Array.from({ length: 40 }, (_, i) => ({ x: i * 37 + r() * 6, w: 26 + r() * 20, h: 50 + r() * 150 }));
  const stars = Array.from({ length: 24 }, () => ({ x: r() * W, y: 120 + r() * 70, o: 0.3 + r() * 0.5 }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      <defs>
        <linearGradient id="fs-cn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1030" />
          <stop offset="1" stopColor="#3b4f9a" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#fs-cn-sky)" />
      <g fill="#fff">
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r="1.1" opacity={s.o} />)}
      </g>
      <g fill="#080c22">
        {blocks.map((b, i) => <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} />)}
      </g>
      <g fill="#ffcf6e">
        {blocks.flatMap((b, i) =>
          Array.from({ length: Math.floor(b.h / 22) }, (_, j) =>
            (i * 7 + j * 3) % 7 === 0 ? <rect key={`${i}-${j}`} x={b.x + 6} y={H - b.h + 10 + j * 22} width="4" height="6" opacity=".8" /> : null,
          ),
        )}
      </g>
      <g stroke="#080c22" fill="none" strokeWidth="3">
        <line x1="980" y1="300" x2="1440" y2="300" strokeWidth="6" />
        <path d="M1080 300 L1080 170 M1340 300 L1340 170" strokeWidth="8" />
        <path d="M980 300 Q 1030 210 1080 172 Q 1210 290 1340 172 Q 1390 230 1440 260" strokeWidth="2" />
        {Array.from({ length: 12 }, (_, i) => {
          const x = 1095 + i * 20;
          const t = (x - 1080) / 260;
          const y = 172 + 4 * 118 * t * (1 - t);
          return <line key={i} x1={x} y1={y} x2={x} y2="300" strokeWidth="1" />;
        })}
      </g>
    </svg>
  );
};

const SCENES = [NeonCoast, FrontierDusk, MoonlitField, CityNight];
const HOLD_MS = 9000;

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

const FooterScenes = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [still] = useState(prefersReducedMotion);

  // Only animate while the footer is on screen and the tab is visible.
  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;
    let onScreen = false;
    const update = () => setRunning(onScreen && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; update(); });
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [still]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setIndex(i => (i + 1) % SCENES.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div ref={ref} aria-hidden="true" className={`footer-scenes ${running ? '' : 'is-paused'}`}>
      {SCENES.map((Scene, i) => (
        <div key={i} className="footer-scene" data-active={i === index}>
          <Scene />
        </div>
      ))}
    </div>
  );
};

export default FooterScenes;
