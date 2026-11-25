import { Lightbulb, Target, Layout, Layers, RefreshCw } from 'lucide-react';
import { useAboutContent } from '@/hooks/useAboutContent';
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
  const c = useAboutContent();
  const principles = c.principles;

  if (principles.length === 0) return null;

  return (
    <section id="philosophy" className="section-padding">
      <div className="container-custom">
        <div>
          <ScrollReveal>
            <div className="mb-10 max-w-2xl">
              <h2 className="t-h2 mb-3">{c.philosophyTitle}</h2>
              {c.philosophySubtitle && <p className="text-muted-foreground">{c.philosophySubtitle}</p>}
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid md:grid-cols-2 gap-6"
            staggerDelay={0.1}
            equalHeight
          >
            {principles.map((p, index) => (
              <div
                key={index}
                className="card-elegant h-full flex flex-col"
              >
                <Icon3D size="md">{iconData[index % iconData.length].icon}</Icon3D>
                <h3 className="t-h3 mt-5 mb-2">{p.title}</h3>
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
