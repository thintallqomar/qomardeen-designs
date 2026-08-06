import { useNavigate } from 'react-router-dom';
import { ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import PageSEO from '@/components/PageSEO';
import { fetchPublished, type CaseStudyBody } from '@/lib/cms';
import uptimeCover from '@/assets/uptime-cover.png';
import walpayCover from '@/assets/walpay/frame-01.png';

const ease = [0.25, 0.1, 0.25, 1] as const;

const Projects = () => {
  const navigate = useNavigate();

  // Hardcoded flagship case studies (bundled assets, dedicated pages).
  const staticProjects = [
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
  ];

  // CMS-authored case studies (published), mapped to the same card shape.
  const { data: cmsItems = [] } = useQuery({
    queryKey: ['projects', 'case-studies'],
    queryFn: () => fetchPublished('case_study'),
  });

  const cmsProjects = cmsItems.map((item, i) => {
    const body = (item.body_json as CaseStudyBody | null) ?? null;
    return {
      id: `cms-${item.id}`,
      title: item.title,
      context: item.subtitle || item.excerpt || '',
      role: body?.role || '',
      keyDecisions: body?.scope || '',
      thumbnail: item.cover_image || uptimeCover,
      liveUrl: body?.behanceUrl || item.resource_url || '',
      technologies: (item.tags && item.tags.length ? item.tags : ['UI/UX', 'Case Study']),
      category: body?.badge || 'UI/UX Case Study',
      status: "completed" as const,
      featured: true,
      isLive: !!(body?.behanceUrl || item.resource_url),
      hasPage: true,
      route: `/projects/${item.slug}`,
    };
  });

  const projects = [...staticProjects, ...cmsProjects];

  const featuredProjects = projects.filter(project => project.featured && project.status === 'completed');
  const placeholderProjects = projects.filter(project => project.status === 'coming-soon');

  const handleCardClick = (project: typeof projects[0]) => {
    if (project.hasPage && project.route) {
      navigate(project.route);
    }
  };

  return (
    <>
      <Navigation />
      <PageSEO
        title="Projects — Qomardeen Tijani | Product Design Case Studies"
        description="Selected product design case studies across fintech, CMMS dashboards, and SaaS — from research and flows to shipped UI."
        path="/projects"
      />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-6xl mx-auto">
                  <ScrollReveal>
                    <div className="text-center mb-16">
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">Selected Case Studies</h1>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Real-world projects showcasing product design across dashboards, SaaS platforms, and user-focused interfaces.
                      </p>
                    </div>
                  </ScrollReveal>

                  {featuredProjects.length > 0 && (
                    <div className="mb-16">
                      <ScrollReveal>
                        <h2 className="text-2xl font-semibold mb-8 text-center">Featured Work</h2>
                      </ScrollReveal>
                      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {featuredProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: index * 0.12, duration: 0.5, ease }}
                          >
                            <motion.div
                              whileHover={{ y: -6 }}
                              transition={{ duration: 0.3, ease }}
                              className="h-full"
                            >
                              <Card
                                className={`group hover:shadow-elegant transition-all duration-300 overflow-hidden h-full flex flex-col ${project.hasPage ? 'cursor-pointer' : ''}`}
                                onClick={() => handleCardClick(project)}
                              >
                                <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                                  <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  {project.isLive && (
                                    <div className="absolute top-2 left-2">
                                      <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Live</span>
                                    </div>
                                  )}
                                  {project.hasPage && (
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <span className="text-white font-medium text-sm">View Case Study</span>
                                    </div>
                                  )}
                                </div>
                                <CardHeader className="py-4 px-5 flex-1">
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <CardTitle className="text-lg leading-snug">{project.title}</CardTitle>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{project.context}</p>
                                  <div className="space-y-1.5 text-xs text-muted-foreground/80">
                                    {project.role && <p><span className="font-medium text-foreground/70">Role:</span> {project.role}</p>}
                                    {project.keyDecisions && <p><span className="font-medium text-foreground/70">Key Decisions:</span> {project.keyDecisions}</p>}
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0 px-5 pb-4 mt-auto">
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies.slice(0, 3).map((tech, i) => (
                                      <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">{tech}</span>
                                    ))}
                                  </div>
                                  {project.hasPage && (
                                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                                      <span className="text-xs text-primary font-medium">Click to view case study</span>
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
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {placeholderProjects.length > 0 && (
                    <div className="mb-16">
                      <ScrollReveal>
                        <h2 className="text-2xl font-semibold mb-8 text-center">More Projects</h2>
                      </ScrollReveal>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {placeholderProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            className="h-full"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.4, ease }}
                          >
                            <Card className="group transition-all duration-300 overflow-hidden opacity-70 h-full flex flex-col">
                              <div className="aspect-video bg-muted/50 relative overflow-hidden flex items-center justify-center">
                                <Clock className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base text-muted-foreground">{project.title}</CardTitle>
                                <CardDescription className="text-sm">{project.context}</CardDescription>
                              </CardHeader>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <ScrollReveal>
                    <div className="text-center">
                      <div className="max-w-2xl mx-auto">
                        <h3 className="text-2xl font-semibold mb-4">Interested in Working Together?</h3>
                        <p className="text-muted-foreground mb-8">I'm always open to discussing new projects and opportunities.</p>
                        <motion.button
                          onClick={() => navigate('/contact')}
                          className="btn-primary inline-flex items-center gap-2"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease }}
                        >
                          Get In Touch
                        </motion.button>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default Projects;
