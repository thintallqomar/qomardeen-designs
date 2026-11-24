import { useEffect, useState, type RefObject } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import designerImg from '@/assets/split-designer.webp';
import builderImg from '@/assets/split-builder.webp';
import HeroPortrait from '@/components/HeroPortrait';
import { useSiteSettingsState } from '@/hooks/useSiteSettings';

/**
 * "Designer | Builder" split position (0-100, % from the left where the code half starts).
 * On mouse devices it follows the pointer across `area`; on touch devices it is set by the Designer/Builder switch.
 */
export function useSplit(area: RefObject<HTMLElement>) {
  const reduce = useReducedMotion();
  const raw = useMotionValue(50);
  const pos = useSpring(raw, { stiffness: 120, damping: 22, mass: 0.6 });
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    const el = area.current;
    if (!el || !fine || reduce) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // the whole width of the area maps onto 15%..85% of the portrait, so small movements still feel alive
      const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      raw.set(85 - t * 70);
    };
    const leave = () => raw.set(50);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [area, fine, reduce, raw]);

  return { pos: reduce ? raw : pos, set: (v: number) => raw.set(v), raw, fine };
}

const SplitToggle = ({ raw }: { raw: MotionValue<number> }) => {
  const { t } = useTranslation();
  const [side, setSide] = useState<'designer' | 'both' | 'builder'>('both');
  const pick = (s: 'designer' | 'builder') => {
    const next = side === s ? 'both' : s;
    setSide(next);
    raw.set(next === 'designer' ? 100 : next === 'builder' ? 0 : 50);
  };
  return (
    <div role="group" aria-label={t('hero.splitLabel')} className="mt-4 inline-flex rounded-full border border-border bg-secondary/60 p-1">
      {(['designer', 'builder'] as const).map(s => (
        <button
          key={s}
          type="button"
          aria-pressed={side === s}
          onClick={() => pick(s)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            side === s ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
          } ${s === 'builder' ? 'font-mono' : ''}`}
        >
          {s === 'designer' ? t('hero.designerTitle') : t('hero.builderTitle')}
        </button>
      ))}
    </div>
  );
};

/**
 * Your face split in two: the real photo on the left, a code-editor version on the right.
 * If you uploaded a hero image in Admin > Site, that photo is shown instead (no split).
 */
const SplitPortrait = ({
  split, slot = 'home', className = '',
}: { split: ReturnType<typeof useSplit>; slot?: 'home' | 'hire'; className?: string }) => {
  const { t } = useTranslation();
  const { settings } = useSiteSettingsState();
  const uploaded = slot === 'hire' ? settings.hireHero ?? settings.homeHero : settings.homeHero;
  const [failed, setFailed] = useState(false);
  const clip = useTransform(split.pos, v => `inset(0 0 0 ${v}%)`);
  const left = useTransform(split.pos, v => `${v}%`);

  if (uploaded?.url || failed) return <HeroPortrait slot={slot} className={className} />;

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      <div className="relative w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem] aspect-square select-none">
        <img
          src={designerImg}
          alt={t('hero.portraitAlt')}
          className="absolute inset-0 w-full h-full object-contain object-bottom"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
        <motion.img
          src={builderImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain object-bottom"
          style={{ clipPath: clip, WebkitClipPath: clip }}
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
        {/* the seam */}
        <motion.div aria-hidden="true" className="absolute top-[6%] bottom-0 w-px bg-primary/70" style={{ left }}>
          <span className="absolute top-[18%] -translate-x-1/2 grid h-7 w-7 place-items-center rounded-full border border-primary/60 bg-background/80 backdrop-blur text-[10px] font-mono text-primary">
            {'</>'}
          </span>
        </motion.div>
        {/* soft floor so the shoulders sit on the page instead of ending in a hard line */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-background to-transparent" />
      </div>
      {!split.fine && <SplitToggle raw={split.raw} />}
    </div>
  );
};

export default SplitPortrait;
