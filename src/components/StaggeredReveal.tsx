import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode, Children } from 'react';

interface StaggeredRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
}

const StaggeredReveal = ({
  children,
  className = '',
  staggerDelay = 0.1,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  once = true,
}: StaggeredRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-30px' });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
};

export default StaggeredReveal;
