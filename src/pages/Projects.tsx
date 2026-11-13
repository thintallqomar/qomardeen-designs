import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import PageSEO from '@/components/PageSEO';
import { fetchPublished, projectKind, type CaseStudyBody } from '@/lib/cms';
import uptimeCover from '@/assets/uptime-cover.png';
import walpayCover from '@/assets/walpay/frame-01.png';

const ease = [0.25, 0.1, 0.25, 1] as const;

const Projects = () => {
  const { t } = useTranslation();
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
      kind: 'full' as const,
      slug: 'uptime',
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
      kind: 'full' as const,
      slug: 'walpay',
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
      thumbnail: item.cover_image || body?.gallery?.[0]?.src || body?.sections?.[0]?.image || uptimeCover,
      liveUrl: body?.behanceUrl || item.resource_url || '',
      technologies: (item.tags && item.tags.length ? item.tags : ['UI/UX', 'Case Study']),
      category: body?.badge || 'UI/UX Case Study',
      status: "completed" as const,
      featured: true,
      isLive: !!(body?.behanceUrl || item.resource_url),
      hasPage: true,
      kind: projectKind(body),
      slug: item.slug,
      route: `/projects/${item.slug}`,
    };
  });

  const cmsSlugs = new Set(cmsProjects.map(p => p.slug));
  const projects = [...staticProjects.filter(p => !cmsSlugs.has(p.slug)), ...cmsProjects];

  const featuredProjects = projects.filter(project => project.kind === 'full' && project.featured && project.status === 'completed');
  const otherProjects = projects.filter(project => project.kind === 'other' && project.status === 'completed');
  const placeholderProjects = projects.filter(project => project.status === 'coming-soon');

  // ── Tabs: Full case studies · Other projects · All projects (shareable via ?view=) ──
  type View = 'full' | 'other' | 'all';
  const [searchParams, setSearchParams] = useSearchParams();
  const rawView = searchParams.get('view');
  const view: View = rawView === 'other' || rawView === 'all' ? rawView : 'full';
  const setView = (v: View) => setSearchParams(v === 'full' ? {} : { view: v }, { replace: true });
  const tabs: { id: View; label: string; count: number }[] = [
    { id: 'full', label: t('projects.fullTitle'), count: featuredProjects.length },
    { id: 'other', label: t('projects.otherTitle'), count: otherProjects.length },
    { id: 'all', label: t('projects.tabAll'), count: featuredProjects.length + otherProjects.length },
  ];
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const move = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!move && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + move + tabs.length) % tabs.length;
    setView(tabs[next].id);
    document.getElementById(`projects-tab-${tabs[next].id}`)?.focus();
  };
  const showFull = view === 'full' || view === 'all';
  const showOther = view === 'other' || view === 'all';
  const showHeadings = view === 'all';

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
                  <h1 className="sr-only">{t('nav.projects')}</h1>

                  {/* Tab switcher */}
                  <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-10 bg-background/80 backdrop-blur-md">
                    <div
                      role="tablist"
                      aria-label={t('nav.projects')}
                      className="mx-auto flex w-full max-w-xl items-center gap-1 rounded-full border border-border bg-secondary/60 p-1"
                    >
                      {tabs.map((tab, i) => {
                        const active = view === tab.id;
                        return (
                          <button
                            key={tab.id}
                            id={`projects-tab-${tab.id}`}
                            role="tab"
                            type="button"
                            aria-selected={active}
                            aria-controls="projects-panel"
                            tabIndex={active ? 0 : -1}
                            onClick={() => setView(tab.id)}
                            onKeyDown={(e) => onTabKey(e, i)}
                            className={`relative flex-1 min-w-0 rounded-full px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                              active ? 'text-background' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="projects-tab-pill"
                                className="absolute inset-0 rounded-full bg-foreground"
                                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                              />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-1.5">
                              <span className="truncate">{tab.label}</span>
                              <span className={`hidden sm:inline text-[10px] tabular-nums ${active ? 'opacity-70' : 'opacity-60'}`}>{tab.count}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div id="projects-panel" role="tabpanel" aria-labelledby={`projects-tab-${view}`}>
                  {((view === 'full' && featuredProjects.length === 0) || (view === 'other' && otherProjects.length === 0)) && (
                    <p className="text-center text-muted-foreground py-16">{t('projects.empty')}</p>
                  )}

                  {showFull && featuredProjects.length > 0 && (
                    <div className="mb-16">
                      {showHeadings && <ScrollReveal>
                        <h2 id="case-studies" className="text-2xl md:text-3xl font-bold mb-3 text-center scroll-mt-24">{t('projects.fullTitle')}</h2>
                        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-8">{t('projects.fullBlurb')}</p>
                      </ScrollReveal>}
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
                                      <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">{t('projects.live')}</span>
                                    </div>
                                  )}
                                  {project.hasPage && (
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <span className="text-white font-medium text-sm">{t('projects.viewCaseStudy')}</span>
                                    </div>
                                  )}
                                </div>
                                <CardHeader className="py-4 px-5 flex-1">
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <CardTitle className="text-lg leading-snug">{project.title}</CardTitle>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{project.context}</p>
                                  <div className="space-y-1.5 text-xs text-muted-foreground/80">
                                    {project.role && <p><span className="font-medium text-foreground/70">{t('projects.role')}</span> {project.role}</p>}
                                    {project.keyDecisions && <p><span className="font-medium text-foreground/70">{t('projects.keyDecisions')}</span> {project.keyDecisions}</p>}
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
                                      <span className="text-xs text-primary font-medium">{t('projects.clickToView')}</span>
                                      {project.liveUrl && <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {t('projects.liveLink')}
                                        <ExternalLink size={12} />
                                      </a>}
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

                  {showOther && otherProjects.length > 0 && (
                    <div className="mb-16">
                      {showHeadings && <ScrollReveal>
                        <h2 id="other-projects" className="text-2xl md:text-3xl font-bold mb-3 text-center scroll-mt-24">{t('projects.otherTitle')}</h2>
                        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-8">{t('projects.otherBlurb')}</p>
                      </ScrollReveal>}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {otherProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: (index % 3) * 0.08, duration: 0.45, ease }}
                          >
                            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease }} className="h-full">
                              <div
                                role="link"
                                tabIndex={0}
                                onClick={() => handleCardClick(project)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(project); } }}
                                className="group block w-full h-full text-left cursor-pointer rounded-2xl border border-border bg-card overflow-hidden hover:shadow-elegant transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                              >
                                <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                                  <img src={project.thumbnail} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <span className="absolute top-2.5 left-2.5 text-[10px] bg-background/90 text-foreground px-2 py-0.5 rounded-full font-medium backdrop-blur">{project.category}</span>
                                </div>
                                <div className="p-4">
                                  <h3 className="font-semibold leading-snug mb-1">{project.title}</h3>
                                  {project.context && <p className="text-sm text-muted-foreground line-clamp-2">{project.context}</p>}
                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-xs text-primary font-medium">{t('projects.viewProject')}</span>
                                    {project.liveUrl && (
                                      <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {t('projects.liveLink')} <ExternalLink size={12} />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {view === 'all' && placeholderProjects.length > 0 && (
                    <div className="mb-16">
                      <ScrollReveal>
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">More Projects</h2>
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

                  </div>
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
