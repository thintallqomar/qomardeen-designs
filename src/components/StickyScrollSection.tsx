import { useRef } from 'react';
import RichText from '@/components/RichText';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';

interface StickyScrollItem {
  title: string;
  subtitle?: string;
  description: string;
  descriptionJson?: unknown;
  image: string;
  imageAlt: string;
  accent?: string;
  metrics?: { label: string; value: string }[];
}

interface StickyScrollSectionProps {
  items: StickyScrollItem[];
  className?: string;
}

/** Scroll distance (in viewport heights) used for each story step. Longer = calmer. */
const VH_PER_STEP = 90;
/** Half-width of the cross-fade around each boundary, as a share of one step. */
const FADE = 0.2;

const smooth = (t: number) => t * t * (3 - 2 * t); // ease-in-out

/**
 * Cross-fade windows: the outgoing item fades out while the incoming one fades in over the
 * same stretch of scroll, so the screen is never empty between two steps.
 */
function windows(index: number, total: number) {
  const seg = 1 / total;
  const w = seg * FADE;
  const prev = index * seg;        // boundary with the previous item
  const next = (index + 1) * seg;  // boundary with the next item
  const first = index === 0;
  const last = index === total - 1;
  if (first && last) return { input: [0, 1], vals: (_a: number, b: number) => [b, b] };
  if (first) return { input: [0, next - w, next + w], vals: (a: number, b: number, c: number) => [b, b, c] };
  if (last) return { input: [prev - w, prev + w, 1], vals: (a: number, b: number) => [a, b, b] };
  return { input: [prev - w, prev + w, next - w, next + w], vals: (a: number, b: number, c: number) => [a, b, b, c] };
}

const StickyScrollSection = ({ items, className = '' }: StickyScrollSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  // A little spring takes the stutter out of mouse-wheel and trackpad scrolling.
  const eased = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.0005 });
  const progress = reduce ? scrollYProgress : eased;

  const scrollHeight = `${100 + (items.length - 1) * VH_PER_STEP}vh`;

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: scrollHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="container-custom w-full">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-14 items-center">
            {/* Text */}
            <div className="relative h-[40vh] lg:h-[60vh] flex items-center">
              {items.map((item, index) => (
                <StickyTextBlock key={index} item={item} index={index} total={items.length} progress={progress} reduce={!!reduce} />
              ))}
            </div>

            {/* Image */}
            <div className="relative h-[40vh] lg:h-[70vh]">
              {items.map((item, index) => (
                <StickyImageBlock key={index} item={item} index={index} total={items.length} progress={progress} reduce={!!reduce} />
              ))}
            </div>
          </div>
        </div>

        {/* Progress dots */}
        {items.length > 1 && (
          <div className="absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {items.map((_, index) => (
              <ProgressDot key={index} index={index} total={items.length} progress={progress} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Sub-components ── */

interface BlockProps {
  item: StickyScrollItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}

function useStep(index: number, total: number, progress: MotionValue<number>, shift: number, scaleFrom: number) {
  const w = windows(index, total);
  const opts = { ease: smooth };
  const opacity = useTransform(progress, w.input, w.vals(0, 1, 0), opts);
  const y = useTransform(progress, w.input, w.vals(shift, 0, -shift), opts);
  const scale = useTransform(progress, w.input, w.vals(scaleFrom, 1, scaleFrom), opts);
  return { opacity, y, scale };
}

function StickyTextBlock({ item, index, total, progress, reduce }: BlockProps) {
  const { opacity, y } = useStep(index, total, progress, 28, 1);
  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={reduce ? { opacity } : { opacity, y }}>
      {item.subtitle && (
        <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{item.subtitle}</span>
      )}
      <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">{item.title}</h3>
      <RichText
        json={item.descriptionJson}
        fallback={item.description}
        className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg"
      />
      {item.metrics && item.metrics.length > 0 && (
        <div className="flex gap-6 mt-8">
          {item.metrics.map((m, i) => (
            <div key={i}>
              <span className="text-2xl md:text-3xl font-bold text-primary">{m.value}</span>
              <span className="block text-xs text-muted-foreground mt-1">{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function StickyImageBlock({ item, index, total, progress, reduce }: BlockProps) {
  const { opacity, y, scale } = useStep(index, total, progress, 18, 0.97);
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={reduce ? { opacity } : { opacity, y, scale }}
    >
      {/* The whole frame is always shown: it is scaled to fit, never cropped. */}
      <img
        src={item.image}
        alt={item.imageAlt}
        loading="lazy"
        className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl border border-border bg-card shadow-lg"
      />
    </motion.div>
  );
}

function ProgressDot({ index, total, progress }: { index: number; total: number; progress: MotionValue<number> }) {
  const seg = 1 / total;
  const active = useTransform(progress, v => (v >= index * seg - 0.001 && v < (index + 1) * seg ? 1 : 0.3));
  const scale = useTransform(progress, v => (v >= index * seg - 0.001 && v < (index + 1) * seg ? 1.5 : 1));
  return <motion.div className="w-2 h-2 rounded-full bg-primary" style={{ opacity: active, scale }} transition={{ duration: 0.2 }} />;
}

export default StickyScrollSection;
