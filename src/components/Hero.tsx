import { ArrowRight, Sparkles, Eye, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import profileImage from '@/assets/new-profile.jpg';

const ease = [0.25, 0.1, 0.25, 1] as const;

const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeInOut' as const } },
};

const Hero = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const skills = t('hero.skills', { returnObjects: true }) as string[];

  return (
    <section id="home" className="min-h-screen flex flex-col justify-end hero-gradient relative pt-24 md:pt-28 pb-8 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-40 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
      </div>

      {/* Large background name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <motion.span
          className="hero-bg-name whitespace-nowrap uppercase font-black leading-none"
          style={{ fontSize: 'clamp(5rem, 12vw, 14rem)' }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {t('hero.title')}
        </motion.span>
      </div>

      {/* Centered profile image — overlaps bg name */}
      <div className="relative z-10 flex justify-center mb-6 lg:mb-0 lg:absolute lg:inset-0 lg:flex lg:items-end lg:justify-center">
        <motion.div
          className="relative w-[240px] md:w-[300px] lg:w-[340px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-15 scale-110" />
          <img
            src={profileImage}
            alt={`${t('hero.title')} - ${t('hero.subtitle')}`}
            className="relative w-full h-auto object-cover object-top rounded-2xl"
            style={{ filter: 'contrast(1.05) brightness(0.95)' }}
          />
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-background via-background/70 to-transparent rounded-b-2xl" />
        </motion.div>
      </div>

      {/* Bottom content layer */}
      <div className="container-custom relative z-20">
        {/* Desktop: side-by-side layout. Mobile: stacked */}
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          {/* Left: badge + description */}
          <motion.div
            className="lg:col-span-5 space-y-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center px-4 py-2 hero-badge rounded-full text-sm font-semibold text-primary-dark animate-pulse w-fit">
                <div className="w-2 h-2 bg-success rounded-full mr-2 animate-ping" />
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {t('hero.available')}
              </div>
            </motion.div>

            <motion.div className="space-y-2" variants={fadeUp}>
              {/* Show name on mobile since bg name is less visible */}
              <h1 className="lg:hidden hero-name text-3xl md:text-4xl font-bold">{t('hero.title')}</h1>
              <h2 className="text-lg md:text-xl font-semibold text-primary">{t('hero.subtitle')}</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
                {t('hero.description')}
              </p>
            </motion.div>

            {/* Buttons — mobile only (desktop buttons on right side) */}
            <motion.div className="flex flex-col sm:flex-row gap-3 pt-1 w-fit lg:hidden" variants={fadeUp}>
              <motion.button onClick={() => navigate('/projects/uptime')} className="modern-btn inline-flex items-center justify-center gap-2.5 group px-8" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {t('hero.cta_explore')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button onClick={() => navigate('/hire')} className="outline-btn inline-flex items-center justify-center gap-2.5 group px-8" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
                <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {t('hero.cta_hire')}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Center spacer for profile image on desktop */}
          <div className="hidden lg:block lg:col-span-2" />

          {/* Right: CTA buttons (desktop only) */}
          <motion.div
            className="hidden lg:flex lg:col-span-5 flex-col items-end gap-3 pb-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease }}
          >
            <motion.button onClick={() => navigate('/projects/uptime')} className="modern-btn inline-flex items-center justify-center gap-2.5 group px-8" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {t('hero.cta_explore')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button onClick={() => navigate('/hire')} className="outline-btn inline-flex items-center justify-center gap-2.5 group px-8" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
              <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {t('hero.cta_hire')}
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom skill tags — horizontal scroll on mobile */}
        <motion.div
          className="mt-8 overflow-x-auto pb-2 scrollbar-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex gap-3 w-max lg:w-auto lg:flex-wrap">
            {skills.map((skill, index) => (
              <motion.span
                key={index}
                className="px-4 py-2 bg-secondary border border-border rounded-full text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-default whitespace-nowrap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.07, duration: 0.35, ease }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
