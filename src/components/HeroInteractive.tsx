import { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowDown, ArrowRight, Briefcase, Download } from 'lucide-react';
import { useLocalizedNavigate, useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { useTranslation } from 'react-i18next';
import IconTooltip from '@/components/IconTooltip';
import CVViewer from '@/components/CVViewer';
import heroPortrait from '@/assets/hero-portrait-hq.png';
import profileImage from '@/assets/new-profile.jpg';

const easeCurve = [0.22, 1, 0.36, 1] as [number, number, number, number];

const HeroInteractive = () => {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();
  const localizedPath = useLocalizedPath();
  const [cvOpen, setCvOpen] = useState(false);
  const [heroSrc, setHeroSrc] = useState<string>(heroPortrait);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const handleHeroImgError = useCallback(() => {
    setHeroSrc((current) => {
      if (current !== heroPortrait) {
        setHeroImgFailed(true);
        return current;
      }
      return profileImage;
    });
  }, []);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const skills = t('hero.skills', { returnObjects: true }) as string[];

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeCurve } },
  };

  const scrollToNext = useCallback(() => {
    const next = heroRef.current?.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [reduceMotion]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Single soft glow */}
      <div
        aria-hidden="true"
        className="absolute -top-1/4 -right-1/4 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none opacity-[0.18] dark:opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.8), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-32"
      >
        <div className="grid lg:grid-cols-[1.7fr_0.85fr] gap-12 lg:gap-14 items-center">

          {/* Left: Text content */}
          <div>
            {/* Eyebrow */}
            <motion.p
              variants={item}
              className="text-sm md:text-base font-medium uppercase tracking-[0.2em] text-primary mb-6"
            >
              {t('hero.available')}
            </motion.p>

            {/* Name — distinctive display font, optical spacing */}
            <motion.h1
              variants={item}
              className="font-display leading-[1.0] text-foreground mb-6 whitespace-nowrap"
              style={{
                fontSize: 'clamp(2rem, 9vw, 5.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
              }}
            >
              {t('hero.title')}
              <span className="sr-only"> — Product Designer (UX, AI & Systems Thinking)</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={item}
              className="font-display font-semibold text-primary leading-tight tracking-[-0.02em] mb-8"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10"
            >
              {t('hero.description')}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t('hero.cta_explore')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {/* Split pill: Hire me | CV — two actions inside one pill button */}
              <div
                className="inline-flex items-stretch rounded-full border border-border text-foreground overflow-hidden h-12 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
              >
                <a
                  href={localizedPath('/hire')}
                  className="inline-flex items-center justify-center gap-2 px-6 text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  {t('hero.cta_hire')}
                </a>
                <span aria-hidden="true" className="w-px bg-border my-2.5" />
                <button
                  type="button"
                  onClick={() => setCvOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t('hero.cta_cv_short')}
                </button>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={item} className="flex flex-wrap gap-2">
              {Array.isArray(skills) && skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Photo — restrained portrait, supports the name */}
          <motion.div
            variants={item}
            className="relative w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[28rem] mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="relative aspect-[4/5] overflow-hidden [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_60%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_60%,transparent_100%)]">
              {heroImgFailed ? (
                <div
                  className="w-full h-full flex items-center justify-center bg-muted"
                  aria-label="Portrait of Qomardeen Tijani"
                  role="img"
                >
                  <span className="text-4xl font-semibold tracking-tight text-muted-foreground">QT</span>
                </div>
              ) : (
                <img
                  src={heroSrc}
                  alt="Portrait of Qomardeen Tijani"
                  loading="eager"
                  decoding="async"
                  onError={handleHeroImgError}
                  className="w-full h-full object-cover object-center"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <IconTooltip label="Scroll to next section">
        <motion.button
          onClick={scrollToNext}
          aria-label="Scroll to next section"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          initial={{ opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 6, 0] }}
          transition={{
            opacity: { delay: 0.8, duration: 0.4 },
            y: { delay: 1, duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.button>
      </IconTooltip>

      <CVViewer open={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  );
};

export default HeroInteractive;
