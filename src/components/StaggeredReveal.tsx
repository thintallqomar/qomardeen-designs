import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode, Children } from 'react';

interface StaggeredRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
  equalHeight?: boolean;
}

const directionMap = {
  up: { y: 1, x: 0 },
  down: { y: -1, x: 0 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

const StaggeredReveal = ({
  children,
  className = '',
  staggerDelay = 0.1,
  baseDelay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 24,
  once = true,
  equalHeight = false,
}: StaggeredRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-40px' });

  const { x, y } = directionMap[direction];
  const items = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          className={equalHeight ? "h-full" : undefined}
          initial={{
            opacity: 0,
            x: x * distance,
            y: y * distance,
          }}
          animate={isInView ? {
            opacity: 1,
            x: 0,
            y: 0,
          } : {
            opacity: 0,
            x: x * distance,
            y: y * distance,
          }}
          transition={{
            duration,
            delay: baseDelay + index * staggerDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export default StaggeredReveal;
