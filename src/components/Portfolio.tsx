import { ExternalLink, Github, Clock, ArrowRight } from 'lucide-react';

const Portfolio = () => {
  const upcomingProjects = [
    {
      title: "Project Placeholder 1",
      description: "Exciting project in development - details coming soon",
      status: "Coming Soon",
      expectedDate: "Q4 2025"
    },
    {
      title: "Project Placeholder 2", 
      description: "Another amazing project in the pipeline - stay tuned",
      status: "Coming Soon",
      expectedDate: "Q4 2025"
    },
    {
      title: "Project Placeholder 3",
      description: "Third innovative project being planned - more details to follow",
      status: "Coming Soon", 
      expectedDate: "Q4 2025"
    }
  ];

  const skills = [
    "User Research", "Wireframing", "Prototyping", "Visual Design", 
    "Design Systems", "Usability Testing", "Journey Mapping", "Fashion Design"
  ];

  return (
    <section id="portfolio" className="section-padding">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Portfolio</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Currently building my product design portfolio. Check back soon for case studies, 
              course projects, and real-world applications of design thinking.
            </p>
          </div>

          {/* Current Status */}
          <div className="bg-gradient-subtle rounded-2xl p-8 mb-12 text-center border border-border">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">Portfolio in Development</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                I'm currently immersed in the AltSchool Africa Product Design program, working on comprehensive 
                case studies and real-world projects. My portfolio will showcase the intersection of my fashion 
                design background with modern UX/UI principles.
              </p>
              
              <div className="inline-flex items-center gap-2 text-primary font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                Expected launch: Q4 2025
              </div>
            </div>
          </div>

          {/* Upcoming Projects */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 text-center">What I'm Working On</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingProjects.map((project, index) => (
                <div key={index} className="card-elegant">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold">{project.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'In Progress' 
                        ? 'bg-primary/20 text-primary' 
                        : project.status === 'Planning'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} />
                    Expected: {project.expectedDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Preview */}
          <div className="bg-muted/30 rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-4">Skills I'm Developing</h3>
              <p className="text-muted-foreground">
                Core competencies I'm building through coursework and practical application
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Fashion Background Showcase */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card-elegant">
              <h3 className="text-xl font-semibold mb-4">Fashion Design Background</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                While I transition into product design, my fashion background continues to inform my approach. 
                The attention to detail, understanding of user needs (fit and comfort), and aesthetic sensibility 
                from fashion directly translate to creating better digital experiences.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Pattern drafting precision</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>User-centered approach (fit & comfort)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Aesthetic sensibility & visual hierarchy</span>
                </div>
              </div>
            </div>

            <div className="card-elegant">
              <h3 className="text-xl font-semibold mb-4">Current Learning Path</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Through AltSchool Africa and self-directed learning, I'm building a comprehensive skill set 
                in product design, combining theoretical knowledge with hands-on project experience.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Design thinking methodology</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>User research & testing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Digital design tools mastery</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Interested in My Journey?</h3>
              <p className="text-muted-foreground mb-8">
                Follow my transition from fashion to product design. I'll be sharing my learning process, 
                insights, and projects as they develop.
              </p>
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary inline-flex items-center gap-2"
              >
                Stay Connected
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;