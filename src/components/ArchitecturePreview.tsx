import { Database, Workflow, Server, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';

const ease = [0.25, 0.1, 0.25, 1] as const;

const ArchitecturePreview = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();

  const entries = [
    { icon: <Database className="w-6 h-6 text-primary" />, title: t('architecture.database.title'), desc: t('architecture.database.desc') },
    { icon: <Workflow className="w-6 h-6 text-primary" />, title: t('architecture.flows.title'), desc: t('architecture.flows.desc') },
    { icon: <Server className="w-6 h-6 text-primary" />, title: t('architecture.scaling.title'), desc: t('architecture.scaling.desc') },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('architecture.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('architecture.subtitle')}</p>
          </div>
        </ScrollReveal>

        <StaggeredReveal className="grid md:grid-cols-3 gap-6 mb-10" staggerDelay={0.12} equalHeight>
          {entries.map((item, index) => (
            <motion.div key={index} className="card-elegant h-full flex flex-col items-start" whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }} transition={{ duration: 0.3, ease }}>
              <div className="p-3 bg-primary/20 rounded-lg mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </StaggeredReveal>

        <div className="text-center">
          <motion.button onClick={() => navigate('/architecture')} className="outline-btn inline-flex items-center gap-2 group" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
            {t('architecture.explore')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ArchitecturePreview;
