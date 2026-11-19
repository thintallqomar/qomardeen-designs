import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import heroPortrait from '@/assets/hero-portrait-hq.png';
import profileImage from '@/assets/new-profile.jpg';
import { useSiteSettingsState } from '@/hooks/useSiteSettings';

/**
 * The Home hero portrait: faded edges, gentle float, hover tilt, fallback if the image fails.
 * Shared so the Hire page shows exactly the same treatment.
 * Pass `variants` when the parent animates its children (as the Home hero does).
 */
const HeroPortrait = ({ variants, className = '', slot = 'home' }: { variants?: Variants; className?: string; slot?: 'home' | 'hire' }) => {
  // The image uploaded in Admin > Site (Hire falls back to the Home image), then the built-in photos.
  const { settings, ready } = useSiteSettingsState();
  const uploaded = slot === 'hire' ? settings.hireHero?.url ?? settings.homeHero?.url : settings.homeHero?.url;
  const sources = [uploaded, heroPortrait, profileImage].filter(Boolean) as string[];
  const [attempt, setAttempt] = useState(0);
  useEffect(() => setAttempt(0), [uploaded]);
  const heroImgFailed = attempt >= sources.length;
  const heroSrc = sources[Math.min(attempt, sources.length - 1)];
  const handleHeroImgError = () => setAttempt(a => a + 1);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={variants}
      initial={variants ? undefined : { opacity: 0, y: 20 }}
      animate={variants ? undefined : { opacity: 1, y: 0 }}
      transition={variants ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[28rem] mx-auto lg:mx-0 lg:ml-auto ${className}`}
    >
      <motion.div
        className="relative aspect-[4/5] overflow-hidden [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_38%,rgba(0,0,0,0.55)_75%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_38%,rgba(0,0,0,0.55)_75%,transparent_100%)]"
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={reduceMotion ? undefined : { duration: 7, ease: 'easeInOut', repeat: Infinity }}
        whileHover={reduceMotion ? undefined : { scale: 1.025, rotateX: 1.25, rotateY: -1.25 }}
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        style={{ transformPerspective: 1000 }}
      >
        {heroImgFailed ? (
          <div className="w-full h-full flex items-center justify-center bg-muted" aria-label="Portrait of Qomardeen Tijani" role="img">
            <span className="text-4xl font-semibold tracking-tight text-muted-foreground">QT</span>
          </div>
        ) : (
          <img
            key={heroSrc}
            src={ready ? heroSrc : undefined}
            alt="Portrait of Qomardeen Tijani"
            loading="eager"
            decoding="async"
            onError={handleHeroImgError}
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </motion.div>
    </motion.div>
  );
};

export default HeroPortrait;
