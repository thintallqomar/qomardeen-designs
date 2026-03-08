import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StickyScrollItem {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  imageAlt: string;
  accent?: string;
  metrics?: { label: string; value: string }[];
}

interface StickyScrollSectionProps {
  items: StickyScrollItem[];
  className?: string;
}

const StickyScrollSection = ({ items, className = '' }: StickyScrollSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: `${items.length * 45}vh` }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="container-custom w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div className="relative h-[50vh] lg:h-[60vh] flex items-center">
              {items.map((item, index) => (
                <StickyTextBlock
                  key={index}
                  item={item}
                  index={index}
                  total={items.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>

            {/* Right: Image */}
            <div className="relative h-[40vh] lg:h-[70vh] flex items-center justify-center">
              {items.map((item, index) => (
                <StickyImageBlock
                  key={index}
                  item={item}
                  index={index}
                  total={items.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {items.map((_, index) => (
            <ProgressDot
              key={index}
              index={index}
              total={items.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ── */

function StickyTextBlock({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: StickyScrollItem;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [start, end - segmentSize * 0.1, end]
      : isLast
        ? [start, start + segmentSize * 0.1, 1]
        : [start, start + segmentSize * 0.1, end - segmentSize * 0.1, end],
    isFirst
      ? [1, 1, 0]
      : isLast
        ? [0, 1, 1]
        : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    isFirst
      ? [start, end - segmentSize * 0.1, end]
      : isLast
        ? [start, start + segmentSize * 0.1, 1]
        : [start, start + segmentSize * 0.1, end - segmentSize * 0.1, end],
    isFirst
      ? [0, 0, -30]
      : isLast
        ? [30, 0, 0]
        : [30, 0, 0, -30]
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y }}
    >
      {item.subtitle && (
        <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          {item.subtitle}
        </span>
      )}
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
        {item.title}
      </h3>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
        {item.description}
      </p>

      {item.metrics && (
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

function StickyImageBlock({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: StickyScrollItem;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize;
  const isLast = index === total - 1;

  const opacity = useTransform(scrollYProgress,
    isLast
      ? [start, start + segmentSize * 0.12, 1]
      : [start, start + segmentSize * 0.12, end - segmentSize * 0.12, end],
    isLast
      ? [0, 1, 1]
      : [0, 1, 1, 0]
  );

  const scale = useTransform(scrollYProgress,
    isLast
      ? [start, start + segmentSize * 0.12, 1]
      : [start, start + segmentSize * 0.12, end - segmentSize * 0.12, end],
    isLast
      ? [0.95, 1, 1]
      : [0.95, 1, 1, 0.95]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, scale }}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

function ProgressDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize;

  const isActive = useTransform(scrollYProgress, (v) =>
    v >= start && v < end ? 1 : 0.3
  );

  const scaleVal = useTransform(scrollYProgress, (v) =>
    v >= start && v < end ? 1.5 : 1
  );

  return (
    <motion.div
      className="w-2 h-2 rounded-full bg-primary"
      style={{ opacity: isActive, scale: scaleVal }}
      transition={{ duration: 0.2 }}
    />
  );
}

export default StickyScrollSection;
