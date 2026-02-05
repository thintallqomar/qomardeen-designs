import { CheckCircle, Lightbulb, Users, TrendingUp, MessageSquare, Layers } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';

const qualities = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Structured Thinking",
    description: "Comfortable with complex interfaces and data-heavy dashboards"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaborative",
    description: "Clear communication and openness to feedback"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Growth-Oriented",
    description: "Proactive about learning and improving my process"
  }
];

const WhyImAGoodFit = () => {
  return (
    <section id="why-me" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              <CheckCircle className="w-4 h-4" />
              Why Me
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why I'm a Good Fit</h2>
          </ScrollReveal>

          {/* Main Statement */}
          <ScrollReveal delay={0.1}>
            <div className="card-elegant border-l-4 border-l-primary">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    I would be a strong fit for this role because I combine structured thinking with a practical, hands-on approach to design. I am comfortable working on complex interfaces such as dashboards and operational tools, while also understanding the importance of clarity and visual hierarchy on user-facing pages.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    As a junior–mid level designer, I am proactive about learning, open to feedback, and intentional about improving my process. I value collaboration, communicate design decisions clearly, and design with scalability in mind—making me well-suited to contribute meaningfully while continuing to grow within a product-focused team.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Key Strengths */}
          <StaggeredReveal staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 mt-12">
            {qualities.map((quality, index) => (
              <div 
                key={index} 
                className="text-center p-6 card-elegant group hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 text-primary">
                  {quality.icon}
                </div>
                <h4 className="font-medium mb-2">{quality.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {quality.description}
                </p>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </div>
    </section>
  );
};

export default WhyImAGoodFit;
