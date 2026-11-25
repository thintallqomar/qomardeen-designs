import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

/** Main pages open with two halves sliding in from both sides and parting again; the rest fade in ("evaporate"). */
const SPLIT_PAGES = new Set(['', 'hire', 'about', 'projects']);
const lang = /^\/[a-z]{2,3}(?=\/|$)/;
const pageKey = (path: string) => path.replace(lang, '').replace(/^\/|\/$/g, '');

// The first page a visitor lands on just fades in: no curtain in front of the first impression.
let firstPageShown = false;

const CURTAIN = { duration: 0.8, times: [0, 0.4, 0.55, 1], ease: [0.76, 0, 0.24, 1] as const };

const Curtains = ({ onDone }: { onDone: () => void }) =>
  createPortal(
    <div aria-hidden="true" data-page-curtain="" className="pointer-events-none fixed inset-0 z-[80]">
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-background border-r border-primary/40"
        initial={{ x: '-100%' }}
        animate={{ x: ['-100%', '0%', '0%', '-100%'] }}
        transition={CURTAIN}
        onAnimationComplete={onDone}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-background border-l border-primary/40"
        initial={{ x: '100%' }}
        animate={{ x: ['100%', '0%', '0%', '100%'] }}
        transition={CURTAIN}
      />
    </div>,
    document.body,
  );

const PageTransition = ({ children }: PageTransitionProps) => {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const split = SPLIT_PAGES.has(pageKey(pathname));
  const [curtains, setCurtains] = useState(() => split && firstPageShown && !reduce);

  useEffect(() => {
    firstPageShown = true;
  }, []);

  // opacity only: a transform on this wrapper would break anything fixed inside the page
  const evaporate = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } };
  const underCurtain = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.01, delay: 0.32 } };

  return (
    <>
      {curtains && <Curtains onDone={() => setCurtains(false)} />}
      <motion.div {...(reduce ? {} : curtains ? underCurtain : evaporate)}>{children}</motion.div>
    </>
  );
};

export default PageTransition;
