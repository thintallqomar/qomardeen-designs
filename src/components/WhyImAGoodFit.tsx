import { CheckCircle, Lightbulb, Users, TrendingUp } from 'lucide-react';

const WhyImAGoodFit = () => {
  return (
    <section id="why-me" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why I'm a Good Fit</h2>
          </div>

          <div className="card-elegant">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  I would be a strong fit for this role because I combine structured thinking with a practical, hands-on approach to design. I am comfortable working on complex interfaces such as dashboards and operational tools, while also understanding the importance of clarity and visual hierarchy on user-facing pages.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-lg flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  As a junior–mid level designer, I am proactive about learning, open to feedback, and intentional about improving my process. I value collaboration, communicate design decisions clearly, and design with scalability in mind—making me well-suited to contribute meaningfully while continuing to grow within a product-focused team.
                </p>
              </div>
            </div>
          </div>

          {/* Key Strengths */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 card-elegant">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Structured Thinking</h4>
              <p className="text-sm text-muted-foreground">
                Comfortable with complex interfaces and data-heavy dashboards
              </p>
            </div>

            <div className="text-center p-6 card-elegant">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Collaborative</h4>
              <p className="text-sm text-muted-foreground">
                Clear communication and openness to feedback
              </p>
            </div>

            <div className="text-center p-6 card-elegant">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Growth-Oriented</h4>
              <p className="text-sm text-muted-foreground">
                Proactive about learning and improving my process
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyImAGoodFit;
