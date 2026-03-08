import { Lightbulb, Target, Layout, Layers, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import Icon3D from './Icon3D';

const iconData = [
  { icon: <Lightbulb />, variant: 'amber' as const },
  { icon: <Target />, variant: 'rose' as const },
  { icon: <Layout />, variant: 'blue' as const },
  { icon: <Layers />, variant: 'violet' as const },
  { icon: <RefreshCw />, variant: 'teal' as const },
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
                  <Icon3D variant={iconData[index]?.variant || 'primary'} size="md">
                    {iconData[index]?.icon}
                  </Icon3D>
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
