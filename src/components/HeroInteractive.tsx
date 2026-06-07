import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Briefcase } from 'lucide-react';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import profileImage from '@/assets/new-profile.jpg';
import IconTooltip from '@/components/IconTooltip';

const easeCurve = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const lineVariant = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay: 0.15 + i * 0.1, ease: easeCurve },
  }),
};

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: easeCurve } },
});

// Subtle floating animation props for the profile image
const floatAnimation = {
  y: [0, -10, 0],
  rotate: [0, 0.5, -0.5, 0] as number[],
};

const floatTransition = {
  duration: 6,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

const HeroInteractive = () => {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [imgError, setImgError] = useState(false);

  const skills = t('hero.skills', { returnObjects: true }) as string[];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isMobile) return;
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCursorPos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    [isMobile]
  );

  const handleCardMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      setCardTilt({ x: cy * -4, y: cx * 4 });
    },
    [isMobile]
  );

  const resetCardTilt = useCallback(() => setCardTilt({ x: 0, y: 0 }), []);

  const scrollToNext = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const next = hero.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const cursorGradient = useMemo(
    () =>
      isMobile
        ? 'none'
        : `radial-gradient(600px circle at ${cursorPos.x * 100}% ${cursorPos.y * 100}%, hsl(var(--primary) / 0.06), transparent 60%)`,
    [cursorPos, isMobile]
  );

  // Parallax: map scroll progress within the hero to different speeds
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yGreeting = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yName = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const ySubtitle = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yBottom = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Parallax for decorative orbs — different speeds for layered depth
  const yOrb1 = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const yOrb2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yOrb3 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-end pb-16 md:pb-24 pt-28 md:pt-32 overflow-hidden bg-background"
    >
      {/* ── Decorative parallax orbs ────────────────────────────── */}
      {/* Primary orb — top-right, slow */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ y: yOrb1, top: '-8%', right: '-6%', willChange: 'transform' }}
      >
        <div
          className="w-[420px] h-[420px] md:w-[640px] md:h-[640px] rounded-full opacity-[0.22] dark:opacity-[0.15]"
          style={{
            background: 'radial-gradient(circle at 40% 40%, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0) 70%)',
            filter: 'blur(72px)',
          }}
        />
      </motion.div>

      {/* Secondary orb — bottom-left, medium speed */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ y: yOrb2, bottom: '5%', left: '-10%', willChange: 'transform' }}
      >
        <div
          className="w-[320px] h-[320px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.14] dark:opacity-[0.09]"
          style={{
            background: 'radial-gradient(circle at 60% 60%, hsl(var(--accent) / 0.85), hsl(var(--accent) / 0) 70%)',
            filter: 'blur(64px)',
          }}
        />
      </motion.div>

      {/* Tertiary accent orb — center-right, fastest */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ y: yOrb3, top: '30%', right: '18%', willChange: 'transform' }}
      >
        <div
          className="w-[180px] h-[180px] md:w-[260px] md:h-[260px] rounded-full opacity-[0.18] dark:opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary-light, var(--primary)) / 0.75), hsl(var(--primary) / 0) 70%)',
            filter: 'blur(48px)',
          }}
        />
      </motion.div>

      {/* Cursor-reactive gradient overlay — desktop only */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none will-change-[background]"
          style={{ background: cursorGradient }}
        />
      )}

      <motion.div className="relative z-10 w-full" style={{ opacity: opacityFade }}>
        {/* "Hello, I'm" */}
        <motion.div className="w-fit px-6 md:px-10" style={{ y: yGreeting }}>
          <motion.div custom={0} variants={lineVariant} initial="hidden" animate="visible" className="overflow-hidden">
            <span
              className="font-display font-bold leading-[1.05] tracking-[-0.03em] text-foreground block"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)' }}
            >
              {t('hero.available')}
            </span>
          </motion.div>
        </motion.div>

        {/* Name — full bleed, extra bold, massive */}
        <motion.div custom={1} variants={lineVariant} initial="hidden" animate="visible" className="overflow-hidden w-full px-6 md:px-10" style={{ y: yName }}>
          <h1
            className="font-display font-black leading-[0.95] tracking-[-0.04em] text-primary w-full"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 9rem)' }}
          >
            {t('hero.title')}
            <span className="sr-only"> — Product Designer (UX, AI & Systems Thinking)</span>
          </h1>
        </motion.div>

        {/* "Product Designer" */}
        <motion.div className="w-fit px-6 md:px-10 mt-4" style={{ y: ySubtitle }}>
          <motion.div custom={2} variants={lineVariant} initial="hidden" animate="visible" className="overflow-hidden">
            <span
              className="font-display font-bold leading-[1.05] tracking-[-0.03em] text-foreground block"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)' }}
            >
              {t('hero.subtitle')}
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom: profile card left + description right */}
        <motion.div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-12 md:mt-16" style={{ y: yBottom }}>
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 items-start">

            {/* Profile card — with tilt + floating animation */}
            <motion.div
              ref={cardRef}
              variants={fadeIn(0.6)}
              initial="hidden"
              animate="visible"
              onMouseMove={handleCardMove}
              onMouseLeave={resetCardTilt}
              className="relative w-fit mx-auto md:ml-[180px] mt-4 md:mt-10 overflow-visible"
              style={{
                transform: `perspective(600px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                transition: 'transform 0.25s ease-out',
              }}
            >
              {/* Floating wrapper — animates the image independently of tilt */}
              <motion.div
                animate={floatAnimation}
                transition={floatTransition}
                className="relative w-[200px] h-[240px] md:w-[280px] md:h-[330px] rounded-2xl overflow-hidden shadow-elegant will-change-transform"
              >
                {!imgError ? (
                  <img
                    src={profileImage}
                    alt="Portrait of Qomardeen Tijani"
                    loading="eager"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">QT</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </motion.div>

              {/* Blur backdrop for circular text contrast */}
              <div className="absolute -left-6 -top-6 w-28 h-28 md:w-40 md:h-40 bg-background/50 rounded-full blur-2xl pointer-events-none" />

              {/* Circular text badge */}
              <div className="absolute -left-10 -top-10 md:-left-[5.25rem] md:-top-[5.25rem] w-28 h-28 md:w-48 md:h-48 rounded-full flex items-center justify-center z-10">
                <svg
                  className="w-full h-full animate-[spin_12s_linear_infinite]"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <defs>
                    <path id="circlePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                  </defs>
                  <text
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '3px',
                      textTransform: 'uppercase',
                      fill: 'hsl(var(--foreground))',
                    }}
                  >
                    <textPath href="#circlePath" startOffset="0%">{"LET US WORK TOGETHER • LET US WORK TOGETHER •"}</textPath>
                  </text>
                </svg>
                <span className="absolute text-primary text-sm md:text-lg">↗</span>
              </div>
            </motion.div>

            {/* Description + CTAs — right side */}
            <motion.div
              variants={fadeIn(0.45)}
              initial="hidden"
              animate="visible"
              className="flex flex-col justify-start items-start space-y-8 w-full lg:w-fit lg:ml-auto"
            >
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={() => navigate('/projects')}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t('hero.cta_explore')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/hire')}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Briefcase className="w-4 h-4" />
                  {t('hero.cta_hire')}
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {Array.isArray(skills) && skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.06, duration: 0.3 }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <IconTooltip label="Scroll to next section">
        <motion.button
          onClick={scrollToNext}
          aria-label="Scroll to next section"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.4 },
            y: { delay: 1.2, duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.button>
      </IconTooltip>
    </section>
  );
};

export default HeroInteractive;
