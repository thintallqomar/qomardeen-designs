import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ImageViewer from '@/components/ImageViewer';
import StickyScrollSection from '@/components/StickyScrollSection';

import ScrollReveal from '@/components/ScrollReveal';

// Import all case study frames
import frame01 from '@/assets/uptime/frame-01.png';
import frame02 from '@/assets/uptime/frame-02.png';
import frame03 from '@/assets/uptime/frame-03.png';
import frame04 from '@/assets/uptime/frame-04.png';
import frame05 from '@/assets/uptime/frame-05.png';
import frame06 from '@/assets/uptime/frame-06.png';
import frame07 from '@/assets/uptime/frame-07.png';
import frame08 from '@/assets/uptime/frame-08.png';
import frame09 from '@/assets/uptime/frame-09.png';
import frame10 from '@/assets/uptime/frame-10.png';

const caseStudyImages = [
  { src: frame01, alt: 'UpTime Cover - UI/UX Case Study', label: 'Cover' },
  { src: frame02, alt: 'Product Overview - Frustrations and Solutions', label: 'Product Overview' },
  { src: frame03, alt: 'Design Approach - Core Features', label: 'Design Approach' },
  { src: frame04, alt: 'Project Timeline', label: 'Project Timeline' },
  { src: frame05, alt: 'User Persona', label: 'User Persona' },
  { src: frame06, alt: 'Empathy Map', label: 'Empathy Map' },
  { src: frame07, alt: 'Brand Identity', label: 'Brand Identity' },
  { src: frame08, alt: 'Dashboard Design', label: 'Dashboard' },
  { src: frame09, alt: 'Equipment Registry & Task Management', label: 'Key Features' },
  { src: frame10, alt: 'Settings & Integration', label: 'Settings & Integration' },
];

const stickyScrollItems = [
  {
    title: 'The Problem',
    subtitle: 'Discovery',
    description: 'Maintenance teams relied on spreadsheets and paper logs to track equipment, leading to missed schedules, unplanned downtime, and costly reactive repairs.',
    image: frame02,
    imageAlt: 'Product Overview - Frustrations and Solutions',
    metrics: [
      { label: 'Avg. Downtime', value: '23%' },
      { label: 'Missed Tasks', value: '40%' },
    ],
  },
  {
    title: 'Research & Empathy',
    subtitle: 'Understanding Users',
    description: 'Through interviews with facility managers and technicians, we mapped pain points into an empathy map and defined a primary persona — a maintenance lead juggling 200+ assets across multiple sites.',
    image: frame05,
    imageAlt: 'User Persona',
  },
  {
    title: 'Design System & Identity',
    subtitle: 'Visual Foundation',
    description: 'We crafted a professional yet approachable brand identity with a clean color palette, structured typography, and iconography that communicates reliability and precision.',
    image: frame07,
    imageAlt: 'Brand Identity',
  },
  {
    title: 'The Dashboard',
    subtitle: 'Core Experience',
    description: 'The central hub provides real-time asset health, upcoming maintenance schedules, and actionable alerts — transforming data overload into clear, prioritized insights.',
    image: frame08,
    imageAlt: 'Dashboard Design',
    metrics: [
      { label: 'Task Completion', value: '94%' },
      { label: 'Response Time', value: '-60%' },
    ],
  },
];


const UptimeProject = () => {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          {/* Reading Progress Bar */}
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/30">
            <Progress value={scrollProgress} className="h-1 rounded-none" />
          </div>

          {/* Back to Projects */}
          <div className="fixed top-20 left-4 z-40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/projects')}
              className="bg-background/80 backdrop-blur-sm border-border shadow-md hover:bg-background"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>

          <main className="pt-14">
            {/* Project Hero */}
            <section className="section-padding bg-gradient-subtle">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                    UI/UX Case Study
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">UpTime CMMS</h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    A powerful maintenance and equipment tracking tool that reduces downtime through scheduled tasks, offline functionality, and smart reporting.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="px-4 py-2 bg-card border border-border rounded-lg">
                      <span className="text-xs text-muted-foreground block">Role</span>
                      <span className="font-medium">Product Designer (UI/UX)</span>
                    </div>
                    <div className="px-4 py-2 bg-card border border-border rounded-lg">
                      <span className="text-xs text-muted-foreground block">Scope</span>
                      <span className="font-medium">End-to-End Design</span>
                    </div>
                    <div className="px-4 py-2 bg-card border border-border rounded-lg">
                      <span className="text-xs text-muted-foreground block">Platform</span>
                      <span className="font-medium">Web App (SaaS)</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href="https://www.behance.net/gallery/239892845/UpTime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center justify-center gap-2 h-11 px-8"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Behance
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Sticky Scroll Storytelling */}
            <StickyScrollSection items={stickyScrollItems} />

            {/* Divider */}
            <ScrollReveal>
              <div className="container-custom py-16">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Full Case Study</h2>
                  <p className="text-muted-foreground">Scroll through every frame of the design process</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Case Study Content — Full frames */}
            <section id="case-study-content" className="py-12 md:py-20">
              <div className="container-custom">
                <div className="max-w-[1512px] mx-auto space-y-8 md:space-y-12">
                  {caseStudyImages.map((image, index) => (
                    <div key={index} className="relative">
                      {image.label && (
                        <div className="mb-4 flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">{image.label}</span>
                        </div>
                      )}
                      <button
                        onClick={() => openViewer(index)}
                        className="relative rounded-xl overflow-hidden border border-border bg-card shadow-sm w-full text-left cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label={`View ${image.alt} in fullscreen`}
                      >
                        {!loadedImages.has(index) && <Skeleton className="w-full aspect-[16/9]" />}
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          decoding="async"
                          onLoad={() => handleImageLoad(index)}
                          style={{ imageRendering: 'auto' }}
                          className={`w-full h-auto max-w-none transition-opacity duration-300 ${
                            loadedImages.has(index) ? 'opacity-100' : 'opacity-0 absolute inset-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to see more?</h2>
                  <p className="text-muted-foreground mb-8">
                    View the full case study on Behance or get in touch to discuss your project.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://www.behance.net/gallery/239892845/UpTime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center justify-center gap-2 h-11 px-6"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Behance
                    </a>
                    <Button variant="outline" onClick={() => navigate('/contact')} className="h-11 px-6">
                      Get in Touch
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />

          <ImageViewer
            images={caseStudyImages}
            currentIndex={viewerIndex}
            isOpen={viewerOpen}
            onClose={() => setViewerOpen(false)}
            onNavigate={setViewerIndex}
          />
        </div>
      </PageTransition>
    </>
  );
};

export default UptimeProject;
