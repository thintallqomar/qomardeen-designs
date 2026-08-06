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

interface Principle {
  title: string;
  body: string;
}

const DesignPhilosophy = () => {
  const { t } = useTranslation();
  const raw = t('philosophy.principles', { returnObjects: true });
  const principles: Principle[] = Array.isArray(raw) ? (raw as Principle[]) : [];

  if (principles.length === 0) return null;

  return (
    <section id="philosophy" className="section-padding">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('philosophy.title')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('philosophy.subtitle', { defaultValue: '' })}
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid md:grid-cols-2 gap-6"
            staggerDelay={0.1}
            equalHeight
            itemClassName={(index) =>
              index === principles.length - 1 && principles.length % 2 === 1
                ? 'md:col-span-2 md:max-w-[calc(50%-0.75rem)] md:mx-auto w-full'
                : ''
            }
          >
            {principles.map((p, index) => (
              <div
                key={p.title}
                className="card-elegant h-full flex flex-col"
              >
                <Icon3D variant={iconData[index]?.variant || 'primary'} size="md">
                  {iconData[index]?.icon}
                </Icon3D>
                <h3 className="mt-5 mb-2 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </div>
    </section>
  );
};

export default DesignPhilosophy;
