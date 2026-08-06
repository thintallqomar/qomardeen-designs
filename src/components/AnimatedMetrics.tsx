import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

interface Proof {
  label: string;
  value: string;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const AnimatedMetrics = () => {
  const { t } = useTranslation();
  const items = t('metrics.items', { returnObjects: true }) as Proof[];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <ScrollReveal>
          <div className="card-elegant p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
              {items.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="text-center md:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease }}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2">
                    {item.label}
                  </div>
                  <div className="text-lg md:text-xl font-semibold leading-snug text-foreground">
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AnimatedMetrics;
