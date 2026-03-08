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

const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeInOut' as const } },
};

const Hero = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const skills = t('hero.skills', { returnObjects: true }) as string[];
  
  return (
    <section id="home" className="min-h-screen flex items-center hero-gradient relative pt-24 md:pt-28 pb-20 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="floating-element absolute bottom-40 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
      </div>

      {/* Large background name text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1
          className="hero-bg-name text-[12vw] md:text-[10vw] lg:text-[9vw] font-black tracking-tighter leading-none whitespace-nowrap uppercase"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {t('hero.title')}
        </motion.h1>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-end min-h-[70vh]">
          {/* Left: Description + CTA */}
          <motion.div 
            className="lg:col-span-4 space-y-6 flex flex-col justify-end pb-8 lg:pb-16 order-2 lg:order-1"
            variants={stagger} 
            initial="initial" 
            animate="animate"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center px-4 py-2 hero-badge rounded-full text-sm font-semibold text-primary-dark animate-pulse w-fit">
                <div className="w-2 h-2 bg-success rounded-full mr-2 animate-ping"></div>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {t('hero.available')}
              </div>
            </motion.div>

            <motion.div className="space-y-3" variants={fadeUp}>
              {/* Mobile-only name display */}
              <h1 className="lg:hidden hero-name text-3xl md:text-4xl font-bold">{t('hero.title')}</h1>
              <h2 className="text-lg md:text-xl font-semibold text-primary">{t('hero.subtitle')}</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-sm leading-relaxed">
                {t('hero.description')}
              </p>
            </motion.div>

            <motion.div className="flex flex-col sm:flex-row gap-3 w-fit" variants={fadeUp}>
              <motion.button 
                onClick={() => navigate('/projects/uptime')} 
                className="modern-btn inline-flex items-center justify-center gap-2 group px-6 py-3 text-sm" 
                whileHover={{ scale: 1.03, y: -2 }} 
                whileTap={{ scale: 0.98 }} 
                transition={{ duration: 0.2, ease }}
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {t('hero.cta_explore')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                onClick={() => navigate('/hire')} 
                className="outline-btn inline-flex items-center justify-center gap-2 group px-6 py-3 text-sm" 
                whileHover={{ scale: 1.03, y: -2 }} 
                whileTap={{ scale: 0.98 }} 
                transition={{ duration: 0.2, ease }}
              >
                <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {t('hero.cta_hire')}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Center: Profile image overlapping the background name */}
          <motion.div 
            className="lg:col-span-4 flex justify-center order-1 lg:order-2"
            variants={fadeScale} 
            initial="initial" 
            animate="animate"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-15 scale-110"></div>
              <motion.div
                className="relative w-[280px] md:w-[320px] lg:w-[360px]"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease }}
              >
                <img 
                  src={profileImage} 
                  alt={`${t('hero.title')} - ${t('hero.subtitle')}`} 
                  className="w-full h-auto object-cover object-top rounded-2xl hero-profile-image"
                />
                {/* Gradient fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background via-background/60 to-transparent rounded-b-2xl"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Empty space on desktop for balance, CTA button position */}
          <motion.div 
            className="lg:col-span-4 hidden lg:flex flex-col items-end justify-end pb-16 order-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease }}
          >
            <motion.button 
              onClick={() => navigate('/hire')} 
              className="modern-btn inline-flex items-center justify-center gap-2.5 group px-8 py-4 text-base"
              whileHover={{ scale: 1.03, y: -2 }} 
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease }}
            >
              Book a Free Call
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom: Skill tags marquee */}
        <motion.div 
          className="mt-8 lg:mt-4 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
            {skills.map((skill, index) => (
              <motion.span 
                key={index} 
                className="hero-skill-tag px-5 py-2.5 rounded-full text-sm font-medium cursor-default"
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.8 + index * 0.08, duration: 0.35, ease }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
