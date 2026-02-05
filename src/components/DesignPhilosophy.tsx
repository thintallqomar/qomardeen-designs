import { Lightbulb, Target, Layout, Layers, RefreshCw } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';

const philosophyItems = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    content: "My design philosophy is grounded in clarity, intention, and usability. I believe good design should feel obvious—not because it is simple, but because it is well structured and thoughtfully considered."
  },
  {
    icon: <Target className="w-6 h-6" />,
    content: "I prioritize solving the right problem before focusing on aesthetics. Visual polish is important, but only after layout, hierarchy, and usability are resolved. Every design decision should have a clear purpose, whether it is guiding attention, reducing friction, or improving comprehension."
  },
  {
    icon: <Layout className="w-6 h-6" />,
    content: "I design with the understanding that users rarely read interfaces in detail—they scan. This informs how I structure dashboards, organize content, and define interaction patterns. Clear hierarchy, predictable layouts, and familiar UI patterns help users act confidently with minimal cognitive load."
  },
  {
    icon: <Layers className="w-6 h-6" />,
    content: "I also think beyond individual screens and focus on systems. Consistent components, spacing rules, and typography scales improve both user experience and team efficiency. I treat constraints—technical, business, or time-related—as inputs that lead to better design decisions."
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    content: "Above all, I view design as a continuous learning process, refined through feedback, iteration, and real-world application."
  }
];

const DesignPhilosophy = () => {
  return (
    <section id="philosophy" className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              <Lightbulb className="w-4 h-4" />
              Philosophy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Design Philosophy</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              My approach to creating digital products that feel obvious and well-considered
            </p>
          </ScrollReveal>

          <StaggeredReveal staggerDelay={0.12} className="space-y-6">
            {philosophyItems.map((item, index) => (
              <div key={index} className="card-elegant group hover:border-primary/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
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
