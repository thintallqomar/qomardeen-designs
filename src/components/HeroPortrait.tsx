import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import heroPortrait from '@/assets/hero-portrait.webp';
import profileImage from '@/assets/new-profile.jpg';
import { useSiteSettingsState } from '@/hooks/useSiteSettings';

type Look = 'arch' | 'fade';
interface Candidate { src: string; look: Look }

const FADE_MASK =
  '[mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_38%,rgba(0,0,0,0.55)_75%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_38%,rgba(0,0,0,0.55)_75%,transparent_100%)]';

/**
 * The hero portrait, shared by Home and Hire.
 *  - "arch": a cut-out (transparent background) inside a brand-tinted arch. Used by the new hero.
 *  - "fade": a photo with its own backdrop, faded softly into the page (the classic look).
 * Order: the image uploaded in Admin > Site, the built-in cut-out (new hero only), the built-in photo, the older
 * photo, then initials. If an image fails to load, the next one is tried automatically.
 */
const HeroPortrait = ({
  variants, className = '', slot = 'home', children,
}: { variants?: Variants; className?: string; slot?: 'home' | 'hire'; children?: ReactNode }) => {
  const { settings, ready } = useSiteSettingsState();
  const uploaded = slot === 'hire' ? settings.hireHero ?? settings.homeHero : settings.homeHero;

  const candidates: Candidate[] = [];
  // The arch was dropped: every photo now fades softly into the page.
  if (uploaded?.url) candidates.push({ src: uploaded.url, look: 'fade' });
  candidates.push({ src: heroPortrait, look: 'fade' }, { src: profileImage, look: 'fade' });

  const [attempt, setAttempt] = useState(0);
  const key = candidates.map(c => c.src).join('|');
  useEffect(() => setAttempt(0), [key]);
  const failedAll = attempt >= candidates.length;
  const current = candidates[Math.min(attempt, candidates.length - 1)];
  const reduceMotion = useReducedMotion();
  const arch = !failedAll && current.look === 'arch';

  const img = failedAll ? (
    <div className="w-full h-full flex items-center justify-center bg-muted" aria-label="Portrait of Qomardeen Tijani" role="img">
      <span className="text-4xl font-semibold tracking-tight text-muted-foreground">QT</span>
    </div>
  ) : (
    <img
      key={current.src}
      src={ready ? current.src : undefined}
      alt="Portrait of Qomardeen Tijani"
      loading="eager"
      decoding="async"
      {...{ fetchpriority: 'high' }}
      onError={() => setAttempt(a => a + 1)}
      className={`${arch ? 'absolute inset-0 w-full h-full object-contain object-bottom' : 'w-full h-full object-cover object-center'} transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  );

  return (
    <motion.div
      variants={variants}
      initial={variants ? undefined : { opacity: 0, y: 20 }}
      animate={variants ? undefined : { opacity: 1, y: 0 }}
      transition={variants ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[28rem] mx-auto lg:mx-0 lg:ml-auto ${className}`}
    >
      <motion.div
        className={`relative aspect-[4/5] ${!failedAll && !arch ? `overflow-hidden ${FADE_MASK}` : ''}`}
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={reduceMotion ? undefined : { duration: 7, ease: 'easeInOut', repeat: Infinity }}
        whileHover={reduceMotion ? undefined : { scale: 1.025, rotateX: 1.25, rotateY: -1.25 }}
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        style={{ transformPerspective: 1000 }}
      >
        {arch ? (
          <div
            className="absolute inset-x-[5%] top-[10%] bottom-0 overflow-hidden rounded-t-[999px] rounded-b-3xl border border-primary/25"
            style={{ background: 'linear-gradient(180deg, hsl(var(--primary) / 0.32) 0%, hsl(var(--primary) / 0.10) 70%, hsl(var(--primary) / 0.18) 100%)' }}
          >
            {img}
          </div>
        ) : (
          img
        )}
        {!failedAll && !arch && <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />}
      </motion.div>
      {children}
    </motion.div>
  );
};

export default HeroPortrait;
