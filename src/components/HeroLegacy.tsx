import { useState } from 'react';
import { ArrowRight, Sparkles, Eye, Download, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate, useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import CVViewer from '@/components/CVViewer';
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

const HeroLegacy = () => {
  const navigate = useLocalizedNavigate();
  const localizedPath = useLocalizedPath();
  const { t } = useTranslation();
  const [cvOpen, setCvOpen] = useState(false);
  const skills = t('hero.skills', { returnObjects: true }) as string[];
  
  return (
    <section id="home" className="min-h-screen flex items-center hero-gradient relative pt-24 md:pt-28 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="floating-element absolute bottom-40 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-1/3 right-10 w-24 h-24 border border-primary/20 rounded-lg rotate-45 blur-sm"></div>
        <div className="floating-element absolute bottom-1/3 left-16 w-12 h-12 bg-gradient-primary rounded-full opacity-20"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div className="space-y-6 flex flex-col justify-center h-full max-h-[500px]" variants={stagger} initial="initial" animate="animate">
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center px-5 py-2.5 hero-badge rounded-full text-sm font-semibold text-primary-dark animate-pulse w-fit">
                <div className="w-2.5 h-2.5 bg-success rounded-full mr-2.5 animate-ping"></div>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('hero.available')}
              </div>
            </motion.div>
            
            <motion.div className="space-y-4" variants={fadeUp}>
              <div className="space-y-1">
                <h1 className="hero-name">{t('hero.title')}</h1>
                <h2 className="text-xl md:text-2xl font-semibold text-primary">{t('hero.subtitle')}</h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">{t('hero.description')}</p>
            </motion.div>

            <motion.div className="flex flex-col sm:flex-row gap-3 pt-2 w-fit" variants={fadeUp}>
              <motion.button onClick={() => navigate('/projects')} className="modern-btn inline-flex items-center justify-center gap-2.5 group px-8" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {t('hero.cta_explore')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              {/* Split pill: Hire me | CV — two actions inside one pill button */}
              <motion.div
                className="inline-flex items-stretch rounded-full border border-border text-foreground overflow-hidden h-12 self-start sm:self-auto focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease }}
              >
                <a
                  href={localizedPath('/hire')}
                  className="inline-flex items-center justify-center gap-2 px-6 text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {t('hero.cta_hire')}
                </a>
                <span aria-hidden="true" className="w-px bg-border my-2.5" />
                <button
                  type="button"
                  onClick={() => setCvOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {t('hero.cta_cv_short')}
                </button>
              </motion.div>
            </motion.div>

            <motion.div className="flex flex-wrap gap-2 pt-2" variants={fadeUp}>
              {skills.map((skill, index) => (
                <motion.span key={index} className="px-3 py-1.5 bg-secondary border border-border rounded-full text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-default" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + index * 0.06, duration: 0.35, ease }}>
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="relative lg:order-2" variants={fadeScale} initial="initial" animate="animate">
            <div className="relative group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 scale-110 group-hover:opacity-30 transition-opacity duration-500"></div>
                <motion.div className="glass-card p-8 relative" whileHover={{ y: -4 }} transition={{ duration: 0.4, ease }}>
                  <img src={profileImage} alt={`${t('hero.title')} - ${t('hero.subtitle')}`} className="w-full max-h-[420px] object-cover object-center rounded-2xl group-hover:scale-[1.02] transition-transform duration-700" />
                  <div className="absolute left-8 right-8 bottom-8 top-[45%] rounded-2xl bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              </div>
              <div className="absolute -top-6 -right-6 glass-card p-4 animate-bounce"><div className="text-2xl">🎨</div></div>
              <div className="absolute -bottom-6 -left-6 glass-card p-4 floating-element"><div className="text-2xl">💡</div></div>
              <div className="absolute top-1/4 -left-8 glass-card p-3 floating-element"><div className="text-xl">✨</div></div>
              <div className="absolute bottom-1/4 -right-8 glass-card p-3 floating-element"><div className="text-xl">🚀</div></div>
            </div>
            <motion.div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5, ease }}>
              <div className="glass-card px-6 py-3 text-center">
                <div className="text-sm font-semibold text-primary">{t('hero.badge')}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroLegacy;
