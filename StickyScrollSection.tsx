import { useEffect, useRef, useState } from 'react';
import RichText from '@/components/RichText';
import { useScroll, useMotionValueEvent } from 'framer-motion';

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

/** How far you scroll (in screen heights) before moving to the next story step. */
const VH_PER_STEP = 70;

/**
 * Story section that stays pinned while you scroll.
 *
 * Scrolling only decides WHICH step is showing. The fade between steps is a short CSS
 * transition that runs on the graphics card, so it stays smooth even on slow phones
 * (the previous version recalculated every element on every scroll tick, which is what
 * made it stutter).
 */
const StickyScrollSection = ({ items, className = '' }: StickyScrollSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const pick = (v: number) => {
    const i = Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length)));
    setActive(prev => (prev === i ? prev : i));
  };
  useMotionValueEvent(scrollYProgress, 'change', pick);
  useEffect(() => { pick(scrollYProgress.get()); /* eslint-disable-next-line */ }, [items.length]);

  const scrollHeight = `${100 + (items.length - 1) * VH_PER_STEP}vh`;
  const fade = 'transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none';
  const state = (i: number, from: string, to: string) =>
    i === active ? 'opacity-100 translate-y-0 scale-100' : i < active ? `opacity-0 ${to}` : `opacity-0 ${from}`;

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: scrollHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="container-custom w-full">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-14 items-center">
            {/* Text */}
            <div className="relative h-[40vh] lg:h-[60vh] flex items-center">
              {items.map((item, i) => (
                <div
                  key={i}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 flex flex-col justify-center will-change-[opacity,transform] ${fade} ${
                    i === active ? '' : 'pointer-events-none'
                  } ${state(i, 'translate-y-6', '-translate-y-6')}`}
                >
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
                      {item.metrics.map((m, k) => (
                        <div key={k}>
                          <span className="text-2xl md:text-3xl font-bold text-primary">{m.value}</span>
                          <span className="block text-xs text-muted-foreground mt-1">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Image: always shown whole (scaled to fit), never cropped. All images load up front so none pops in late. */}
            <div className="relative h-[40vh] lg:h-[70vh]">
              {items.map((item, i) => (
                <div
                  key={i}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 flex items-center justify-center will-change-[opacity,transform] ${fade} ${
                    i === active ? '' : 'pointer-events-none'
                  } ${state(i, 'translate-y-4 scale-[0.98]', '-translate-y-4 scale-[0.98]')}`}
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    decoding="async"
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl border border-border bg-card shadow-lg transform-gpu"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress dots */}
        {items.length > 1 && (
          <div className="absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {items.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full bg-primary transition-all duration-300 ${i === active ? 'opacity-100 scale-150' : 'opacity-30'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyScrollSection;
