import { Lightbulb, Target, Layout, Layers, RefreshCw } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';

const philosophyItems = [
  {
    icon: <Lightbulb className="w-6 h-6 text-primary" />,
    text: "My design philosophy is grounded in clarity, intention, and usability. I believe good design should feel obvious—not because it is simple, but because it is well structured and thoughtfully considered.",
  },
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    text: "I prioritize solving the right problem before focusing on aesthetics. Visual polish is important, but only after layout, hierarchy, and usability are resolved. Every design decision should have a clear purpose, whether it is guiding attention, reducing friction, or improving comprehension.",
  },
  {
    icon: <Layout className="w-6 h-6 text-primary" />,
    text: "I design with the understanding that users rarely read interfaces in detail—they scan. This informs how I structure dashboards, organize content, and define interaction patterns. Clear hierarchy, predictable layouts, and familiar UI patterns help users act confidently with minimal cognitive load.",
  },
  {
    icon: <Layers className="w-6 h-6 text-primary" />,
    text: "I also think beyond individual screens and focus on systems. Consistent components, spacing rules, and typography scales improve both user experience and team efficiency. I treat constraints—technical, business, or time-related—as inputs that lead to better design decisions.",
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-primary" />,
    text: "Above all, I view design as a continuous learning process, refined through feedback, iteration, and real-world application.",
  },
];

const DesignPhilosophy = () => {
  return (
    <section id="philosophy" className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Design Philosophy</h2>
            </div>
          </ScrollReveal>

          <StaggeredReveal className="space-y-8" staggerDelay={0.1}>
            {philosophyItems.map((item, index) => (
              <div key={index} className="card-elegant">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    {item.icon}
                  </div>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
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
