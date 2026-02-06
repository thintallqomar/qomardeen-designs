import { useNavigate } from 'react-router-dom';
import { ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import uptimeCover from '@/assets/uptime-cover.png';
import walpayCover from '@/assets/walpay/frame-01.png';

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: "UpTime Asset Management — CMMS Web App",
      context: "CMMS platform for asset tracking & maintenance workflows",
      role: "Product Designer (UI/UX)",
      keyDecisions: "Structured dashboards, clear information hierarchy, scalable SaaS patterns",
      thumbnail: uptimeCover,
      liveUrl: "https://www.behance.net/gallery/239892845/UpTime",
      technologies: ["UI/UX", "SaaS", "Dashboard", "CMMS"],
      category: "UI/UX Case Study",
      status: "completed",
      featured: true,
      isLive: true,
      hasPage: true,
      route: '/projects/uptime'
    },
    {
      id: 2,
      title: "WalPay — Digital Wallet & Currency Exchange",
      context: "Fintech platform for seamless international transfers",
      role: "Product Designer (UI/UX)",
      keyDecisions: "Mobile-first flows, trust signals, conversion-focused landing pages",
      thumbnail: walpayCover,
      liveUrl: "https://www.behance.net/gallery/242927925/WalPay-UI-UX-Case-Study",
      technologies: ["UX Design", "UI Design", "Fintech", "iOS App"],
      category: "UI/UX Case Study",
      status: "completed",
      featured: true,
      isLive: true,
      hasPage: true,
      route: '/projects/walpay'
    },
    {
      id: 3,
      title: "E-Commerce Dashboard Redesign",
      context: "Analytics dashboard for online retail platform",
      role: "UI/UX Designer",
      keyDecisions: "Data visualization clarity, actionable insights hierarchy",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: ["Dashboard", "E-Commerce", "Analytics"],
      category: "UI/UX Case Study",
      status: "completed",
      featured: true,
      isLive: false,
      hasPage: false,
      route: ''
    },
    {
      id: 4,
      title: "Project Placeholder 04",
      context: "Case study coming soon",
      role: "",
      keyDecisions: "",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: [],
      category: "Coming Soon",
      status: "coming-soon",
      featured: false,
      hasPage: false,
      route: ''
    },
    {
      id: 5,
      title: "Project Placeholder 05",
      context: "Case study coming soon",
      role: "",
      keyDecisions: "",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: [],
      category: "Coming Soon",
      status: "coming-soon",
      featured: false,
      hasPage: false,
      route: ''
    },
    {
      id: 6,
      title: "Project Placeholder 06",
      context: "Case study coming soon",
      role: "",
      keyDecisions: "",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: [],
      category: "Coming Soon",
      status: "coming-soon",
      featured: false,
      hasPage: false,
      route: ''
    },
    {
      id: 7,
      title: "Project Placeholder 07",
      context: "Case study coming soon",
      role: "",
      keyDecisions: "",
      thumbnail: "/placeholder.svg",
      liveUrl: "#",
      technologies: [],
      category: "Coming Soon",
      status: "coming-soon",
      featured: false,
      hasPage: false,
      route: ''
    }
  ];

  const featuredProjects = projects.filter(project => project.featured && project.status === 'completed');
  const placeholderProjects = projects.filter(project => project.status === 'coming-soon');

  const handleCardClick = (project: typeof projects[0]) => {
    if (project.hasPage && project.route) {
      navigate(project.route);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-20">
          <section className="section-padding">
            <div className="container-custom">
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">Selected Case Studies</h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Real-world projects showcasing product design across dashboards, SaaS platforms, and user-focused interfaces.
                  </p>
                </div>

                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-2xl font-semibold mb-8 text-center">Featured Work</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {featuredProjects.map((project) => (
                        <Card 
                          key={project.id} 
                          className={`group hover:shadow-elegant transition-all duration-300 overflow-hidden ${
                            project.hasPage ? 'cursor-pointer' : ''
                          }`}
                          onClick={() => handleCardClick(project)}
                        >
                          <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                            <img 
                              src={project.thumbnail} 
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {project.isLive && (
                              <div className="absolute top-2 left-2">
                                <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                                  Live
                                </span>
                              </div>
                            )}
                            {project.hasPage && (
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">View Case Study</span>
                              </div>
                            )}
                          </div>
                          <CardHeader className="py-4 px-5">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <CardTitle className="text-lg leading-snug">{project.title}</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{project.context}</p>
                            <div className="space-y-1.5 text-xs text-muted-foreground/80">
                              {project.role && <p><span className="font-medium text-foreground/70">Role:</span> {project.role}</p>}
                              {project.keyDecisions && <p><span className="font-medium text-foreground/70">Key Decisions:</span> {project.keyDecisions}</p>}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 px-5 pb-4">
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.slice(0, 3).map((tech, index) => (
                                <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            
                            {project.hasPage && (
                              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                                <span className="text-xs text-primary font-medium">
                                  Click to view case study
                                </span>
                                <a 
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Behance
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder Projects */}
                {placeholderProjects.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-2xl font-semibold mb-8 text-center">More Projects</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {placeholderProjects.map((project) => (
                        <Card key={project.id} className="group transition-all duration-300 overflow-hidden opacity-70">
                          <div className="aspect-video bg-muted/50 relative overflow-hidden flex items-center justify-center">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base text-muted-foreground">{project.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {project.context}
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
                      onClick={() => navigate('/contact')}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      Get In Touch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Projects;
