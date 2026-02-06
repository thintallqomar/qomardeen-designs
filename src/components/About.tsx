import { GraduationCap, Briefcase, MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';

const About = () => {
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me & My Journey</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mb-12">
              <div className="card-elegant">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      I am a product designer who builds clear, structured, and high-impact digital products across SaaS platforms, internal tools, and consumer-facing experiences. I combine product thinking, UX reasoning, and strong visual execution to design interfaces that help users complete tasks efficiently and with confidence.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      I approach design as a problem-solving discipline, not decoration. Before moving into high-fidelity design, I focus on understanding user goals, workflows, constraints, and edge cases. This allows me to create solutions that are intuitive, logically organized, and scalable as products grow.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      My experience spans CMMS platforms, dashboards, fintech products, and website design, with a strong focus on landing pages and their supporting website flows. I design conversion-focused entry points and ensure visual and structural consistency across related pages, from first impression to deeper product interactions.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Before transitioning fully into product design, I worked in fashion design, where I learned to balance aesthetics, structure, constraints, and user expectations. That foundation sharpened my systems thinking and attention to detail, which now directly informs my digital work.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      I am seeking a junior–mid level product design role where I can contribute immediately, collaborate closely, and continue growing as a designer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <StaggeredReveal className="grid md:grid-cols-2 gap-8" staggerDelay={0.15}>
            {/* Education */}
            <div className="card-elegant">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <h4 className="font-medium">Product Design</h4>
                  <p className="text-sm text-muted-foreground mb-1">AltSchool Africa</p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <h4 className="font-medium">B.Sc. Human Anatomy</h4>
                  <p className="text-sm text-muted-foreground mb-1">Ladoke Akintola University of Technology</p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="card-elegant">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Experience</h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <h4 className="font-medium">Product Designer</h4>
                  <p className="text-sm text-muted-foreground mb-1">Designed and shipped live digital products</p>
                  <p className="text-xs text-muted-foreground">Worked on dashboards, SaaS tools, landing pages, and fintech products</p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Project Manager Intern</h4>
                    <span className="text-sm text-muted-foreground">2024–Present</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Oladel Global Resources Limited</p>
                  <p className="text-xs text-muted-foreground">Coordinated timelines, planning, and execution</p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <h4 className="font-medium">Independent Fashion Designer</h4>
                  <p className="text-xs text-muted-foreground">Led creative direction and execution</p>
                </div>
              </div>
            </div>
          </StaggeredReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
