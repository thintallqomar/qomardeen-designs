import { Linkedin, Mail, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import ScrollReveal from './ScrollReveal';

const ease = [0.25, 0.1, 0.25, 1] as const;

const HireCTA = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="card-elegant p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                  <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                  <Sparkles className="w-4 h-4 mr-1" />
                  {t('hireCta.available')}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('hireCta.title')}</h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{t('hireCta.subtitle')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                  <motion.button onClick={() => navigate('/hire')} className="modern-btn inline-flex items-center justify-center gap-2 group" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
                    {t('hireCta.cta')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://linkedin.com/in/qomardeentijani" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                  <a href="mailto:qomardeentijani@gmail.com" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                  <a href="/hire" onClick={(e) => { e.preventDefault(); navigate('/hire'); }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Calendar className="w-4 h-4" /> {t('hireCta.schedule')}
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HireCTA;
