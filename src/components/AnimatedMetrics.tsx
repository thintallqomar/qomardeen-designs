import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

interface Metric {
  value: number;
  suffix: string;
  label: string;
}

const metrics: Metric[] = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 2, suffix: 'M+', label: 'Users Impacted' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
];

const ease = [0.25, 0.1, 0.25, 1] as const;

function useCountUp(target: number, inView: boolean, duration = 1.8) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return count;
}

const MetricCard = ({ metric, index }: { metric: Metric; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCountUp(metric.value, inView);

  return (
    <motion.div
      ref={ref}
      className="text-center p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
    >
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count}
        <span>{metric.suffix}</span>
      </div>
      <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
    </motion.div>
  );
};

const AnimatedMetrics = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <ScrollReveal>
          <div className="card-elegant p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric, i) => (
                <MetricCard key={i} metric={metric} index={i} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AnimatedMetrics;
