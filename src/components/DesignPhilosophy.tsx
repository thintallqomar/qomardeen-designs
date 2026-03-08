import { Lightbulb, Target, Layout, Layers, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';

const icons = [
  <Lightbulb className="w-6 h-6 text-primary" />,
  <Target className="w-6 h-6 text-primary" />,
  <Layout className="w-6 h-6 text-primary" />,
  <Layers className="w-6 h-6 text-primary" />,
  <RefreshCw className="w-6 h-6 text-primary" />,
];

const DesignPhilosophy = () => {
  const { t } = useTranslation();
  const items = t('philosophy.items', { returnObjects: true }) as string[];

  return (
    <section id="philosophy" className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('philosophy.title')}</h2>
            </div>
          </ScrollReveal>

          <StaggeredReveal className="space-y-8" staggerDelay={0.1}>
            {items.map((text, index) => (
              <div key={index} className="card-elegant">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">{icons[index]}</div>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </div>
    </section>
  );
};

export default DesignPhilosophy;
