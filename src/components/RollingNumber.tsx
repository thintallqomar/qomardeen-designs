import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * Rolling counter (odometer). Each digit spins like a slot-machine reel and lands on the real value
 * the first time it scrolls into view. Only ever used with real numbers.
 */
const REEL = Array.from({ length: 20 }, (_, i) => i % 10); // 0–9 twice, so every digit spins at least once round

const Reel = ({ digit, go, delay, instant }: { digit: number; go: boolean; delay: number; instant: boolean }) => {
  // Show the real digit from the start (never a wrong number), then spin one full turn back to it.
  const target = go ? digit + 10 : digit;
  return (
    <span className="relative inline-block">
      <span className="invisible">0</span>
      <span className="absolute inset-0 overflow-hidden">
        <motion.span
          className="absolute left-0 top-0 flex w-full flex-col items-center"
          initial={false}
          animate={{ y: `-${(instant ? digit + 10 : target) * 5}%` }}
          transition={instant ? { duration: 0 } : { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {REEL.map((d, i) => <span key={i} className="block">{d}</span>)}
        </motion.span>
      </span>
    </span>
  );
};

const RollingNumber = ({ value, pad = 0, className = '' }: { value: number; pad?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = !!useReducedMotion();
  const text = String(value).padStart(pad, '0');

  return (
    <span ref={ref} className={`inline-flex tabular-nums ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {[...text].map((ch, i) =>
          /\d/.test(ch)
            ? <Reel key={`${i}-${text.length}`} digit={Number(ch)} go={inView} delay={i * 0.08} instant={reduce} />
            : <span key={i}>{ch}</span>,
        )}
      </span>
    </span>
  );
};

export default RollingNumber;
