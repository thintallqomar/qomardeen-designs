/**
 * Text scramble ("decrypt") reveal.
 * When a heading scrolls into view, every letter flickers through random characters
 * and settles left to right, so the line looks like it is being typed all at once.
 *
 * - Runs once per heading.
 * - Off for "reduce motion" users and for scripts whose letters join (Arabic, Hebrew, Indic).
 * - Screen readers get the real text through aria-label while it plays.
 * - Only touches the text, never the layout: the heading's height is locked while it plays.
 */

const SELECTOR = 'h1.t-display, h2.t-h2, [data-scramble]';
const JOINED_SCRIPTS = /[\u0590-\u08FF\u0900-\u0DFF\uFB1D-\uFEFF]/;

const segment = (text: string): string[] => {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string }> } }).Segmenter;
  if (Seg) return Array.from(new Seg(undefined, { granularity: 'grapheme' }).segment(text), s => s.segment);
  return Array.from(text);
};

const isLetter = (g: string) => /[\p{L}\p{N}]/u.test(g);


const LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DIGITS = '0123456789'.split('');
let canvas: HTMLCanvasElement | null = null;

/**
 * Returns pick(g): a random stand-in for g whose rendered width is within ~10% of g's,
 * chosen from the same kind of character (lowercase, uppercase, digit, or the heading's own letters).
 */
const widthMatchedPicker = (el: HTMLElement, full: string) => {
  const cs = getComputedStyle(el);
  canvas = canvas ?? document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const own = [...new Set(segment(full).filter(isLetter))];
  if (!ctx) return (g: string) => g;
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const width = new Map<string, number>();
  const w = (c: string) => { let v = width.get(c); if (v === undefined) { v = ctx.measureText(c).width; width.set(c, v); } return v; };
  const cache = new Map<string, string[]>();
  return (g: string) => {
    let options = cache.get(g);
    if (!options) {
      const base = /[a-z]/.test(g) ? LOWER : /[A-Z]/.test(g) ? UPPER : /[0-9]/.test(g) ? DIGITS : own;
      const target = w(g);
      const close = base.filter(c => c !== g && Math.abs(w(c) - target) <= Math.max(1, target * 0.1));
      // Fall back to the nearest few if nothing is close enough.
      options = close.length >= 2 ? close : [...base].sort((a, b) => Math.abs(w(a) - target) - Math.abs(w(b) - target)).slice(0, 3);
      cache.set(g, options);
    }
    return options.length ? options[(Math.random() * options.length) | 0] : g;
  };
};

const scramble = (el: HTMLElement) => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  const originals = nodes.map(n => n.nodeValue ?? '');
  const full = originals.join('');
  if (!full.trim() || JOINED_SCRIPTS.test(full)) return;

  const parts = originals.map(segment);
  const total = parts.reduce((n, p) => n + p.length, 0);
  // Swap each letter only for letters of almost the same width (in this heading's own font),
  // so the word doesn't shake sideways while it scrambles.
  const pickFor = widthMatchedPicker(el, full);

  // Each character settles at its own moment, roughly left to right.
  const duration = Math.min(1100, 450 + total * 22);
  let k = 0;
  const settleAt = parts.map(p => p.map(() => {
    const t = (k++ / Math.max(1, total)) * duration * 0.7 + Math.random() * duration * 0.3;
    return t;
  }));

  const hadLabel = el.hasAttribute('aria-label');
  if (!hadLabel) el.setAttribute('aria-label', full.trim());
  const prevMinHeight = el.style.minHeight;
  el.style.minHeight = `${el.getBoundingClientRect().height}px`;

  const written = [...originals];
  let start = 0;
  let last = 0;
  let aborted = false;

  const finish = () => {
    if (!aborted) nodes.forEach((n, i) => { if (n.nodeValue !== originals[i]) n.nodeValue = originals[i]; });
    el.style.minHeight = prevMinHeight;
    if (!hadLabel) el.removeAttribute('aria-label');
  };

  const frame = (now: number) => {
    if (!start) start = now;
    const t = now - start;
    // React (e.g. a language switch) changed the text: stop and leave its text alone.
    if (nodes.some((n, i) => n.nodeValue !== written[i])) { aborted = true; finish(); return; }
    if (t >= duration) { finish(); return; }
    if (now - last > 40) {
      last = now;
      nodes.forEach((n, i) => {
        const next = parts[i].map((g, j) => (t >= settleAt[i][j] || !isLetter(g) ? g : pickFor(g))).join('');
        written[i] = next;
        n.nodeValue = next;
      });
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

/** Watches the page for headings and scrambles each one the first time it is seen. */
export const startScrambleHeadings = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {};
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const done = new WeakSet<Element>();

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      if (reduce.matches || document.documentElement.dir === 'rtl') return;
      // Wait for the page-change curtain to clear (otherwise it plays unseen behind it),
      // then a short beat so it lines up with the section's fade-in.
      const el = e.target as HTMLElement;
      let waited = 0;
      const start = () => {
        if (document.querySelector('[data-page-curtain]') && waited < 2000) { waited += 50; setTimeout(start, 50); return; }
        setTimeout(() => scramble(el), 120);
      };
      start();
    });
  }, { threshold: 0.6 });

  const scan = (root: ParentNode) => {
    root.querySelectorAll?.(SELECTOR).forEach(el => {
      if (done.has(el)) return;
      done.add(el);
      io.observe(el);
    });
  };

  scan(document);
  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      const el = n as Element;
      if (el.matches?.(SELECTOR) && !done.has(el)) { done.add(el); io.observe(el); }
      scan(el);
    }));
  });
  mo.observe(document.body, { childList: true, subtree: true });

  return () => { mo.disconnect(); io.disconnect(); };
};
