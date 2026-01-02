import { GraduationCap, Briefcase, MapPin } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Story</h2>
          </div>

          {/* Personal Story */}
          <div className="mb-12">
            <div className="card-elegant">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    I am a product designer focused on creating clear, structured, and usable digital products across SaaS platforms, internal tools, and consumer-facing interfaces. My approach combines product thinking, UX reasoning, and visual execution to design experiences that help users complete tasks efficiently and with confidence.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    I treat design as a problem-solving discipline rather than a purely visual one. Before moving into high-fidelity design, I spend time understanding user goals, workflows, and product constraints. This allows me to create interfaces that are intuitive, logically organized, and scalable over time.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    My recent projects include CMMS platforms, dashboards, landing pages, and fintech-related products, giving me experience across both data-heavy systems and conversion-focused surfaces. Across these projects, I focus on information hierarchy, layout structure, and interaction clarity—especially in environments where users need to scan information quickly and make accurate decisions.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    I am particularly interested in design systems, reusable components, dashboard design, and mobile-first UI. I value iteration, feedback, and collaboration, and I am seeking a junior–mid level product design role where I can contribute to real products, grow within a team, and continue refining my craft.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Experience Grid */}
          <div className="grid md:grid-cols-2 gap-8">
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
                  <p className="text-xs text-muted-foreground">
                    Worked on dashboards, SaaS tools, landing pages, and fintech products
                  </p>
                </div>
                
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Project Manager Intern</h4>
                    <span className="text-sm text-muted-foreground">2024–Present</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Oladel Global Resources Limited</p>
                  <p className="text-xs text-muted-foreground">
                    Coordinated timelines, planning, and execution
                  </p>
                </div>
                
                <div className="border-l-2 border-muted pl-4">
                  <h4 className="font-medium">Independent Fashion Designer</h4>
                  <p className="text-xs text-muted-foreground">
                    Led creative direction and execution
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
