import { ExternalLink, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "UpTime Asset Management — CMMS Web App",
      description: "A CMMS web application designed to streamline asset tracking, maintenance workflows, and operational decision-making through structured dashboards and clear information hierarchy.",
      thumbnail: "/placeholder.svg",
      liveUrl: "https://www.behance.net/gallery/239892845/UpTime",
      technologies: ["UI/UX", "SaaS", "Dashboard", "CMMS"],
      category: "UI/UX Case Study",
      status: "completed",
      featured: true,
      isLive: true,
      role: "Product Designer (UI/UX)",
      focus: "Dashboards, SaaS workflows, system clarity"
    },
    {
      id: 2,
      title: "Fintech Website & Mobile App Design",
      description: "Web and mobile design focused on conversion, trust, and usability for a fintech platform.",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: ["Web Design", "Mobile Design", "Fintech", "Conversion"],
      category: "UI/UX Case Study",
      status: "completed",
      featured: true,
      isLive: false
    },
    {
      id: 3,
      title: "Project Placeholder 03",
      description: "Case study coming soon",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: [],
      category: "Coming Soon",
      status: "coming-soon",
      featured: false
    },
    {
      id: 4,
      title: "Project Placeholder 04",
      description: "Case study coming soon",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: [],
      category: "Coming Soon",
      status: "coming-soon",
      featured: false
    },
    {
      id: 5,
      title: "Project Placeholder 05",
      description: "Case study coming soon",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: [],
      category: "Coming Soon",
      status: "coming-soon",
      featured: false
    },
    {
      id: 6,
      title: "Project Placeholder 06",
      description: "Case study coming soon",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: [],
      category: "Coming Soon",
      status: "coming-soon",
      featured: false
    }
  ];

  const featuredProjects = projects.filter(project => project.featured && project.status === 'completed');
  const placeholderProjects = projects.filter(project => project.status === 'coming-soon');
  
  return (
    <section id="portfolio" className="section-padding">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected Case Studies</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-world projects showcasing product design across dashboards, SaaS platforms, and user-focused interfaces.
            </p>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">Featured Work</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredProjects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {project.isLive && (
                        <div className="absolute top-3 left-3">
                          <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
                            Live Product
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          View Case Study
                        </a>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                      <CardDescription className="leading-relaxed">
                        {project.description}
                      </CardDescription>
                      {project.role && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground"><strong>Role:</strong> {project.role}</p>
                          <p className="text-xs text-muted-foreground"><strong>Focus:</strong> {project.focus}</p>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder Projects */}
          {placeholderProjects.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">More Projects</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {placeholderProjects.map((project) => (
                  <Card key={project.id} className="group transition-all duration-300 overflow-hidden opacity-70">
                    <div className="aspect-video bg-muted/50 relative overflow-hidden flex items-center justify-center">
                      <Clock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-muted-foreground">{project.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Interested in Working Together?</h3>
              <p className="text-muted-foreground mb-8">
                I'm always open to discussing new projects and opportunities.
              </p>
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary inline-flex items-center gap-2"
              >
                Get In Touch
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
