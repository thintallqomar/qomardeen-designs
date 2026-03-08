import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ImageViewer from '@/components/ImageViewer';
import CaseStudyHero from '@/components/case-study/CaseStudyHero';
import CaseStudyNav from '@/components/case-study/CaseStudyNav';
import StickyScrollSection from '@/components/case-study/StickyScrollSection';
import FullWidthFrame from '@/components/case-study/FullWidthFrame';
import InteractiveDemo from '@/components/case-study/InteractiveDemo';
import ScrollReveal from '@/components/ScrollReveal';
import { ExternalLink, Play } from 'lucide-react';

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

const allImages = [
  { src: frame01, alt: 'UpTime Cover' },
  { src: frame02, alt: 'Product Overview' },
  { src: frame03, alt: 'Design Approach' },
  { src: frame04, alt: 'Project Timeline' },
  { src: frame05, alt: 'User Persona' },
  { src: frame06, alt: 'Empathy Map' },
  { src: frame07, alt: 'Brand Identity' },
  { src: frame08, alt: 'Dashboard Design' },
  { src: frame09, alt: 'Equipment Registry & Task Management' },
  { src: frame10, alt: 'Settings & Integration' },
];

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'research', label: 'Research' },
  { id: 'identity', label: 'Brand Identity' },
  { id: 'design', label: 'Design System' },
  { id: 'features', label: 'Key Features' },
  { id: 'integration', label: 'Integration' },
];

const demoSteps = [
  {
    image: frame08,
    title: 'Dashboard Overview',
    description: 'The main dashboard provides a high-level view of all equipment health, upcoming tasks, and critical alerts — prioritized by urgency.',
    annotation: { x: 30, y: 25, label: 'Real-time status indicators' },
  },
  {
    image: frame09,
    title: 'Equipment Registry',
    description: 'A comprehensive asset registry with filtering, search, and bulk actions. Each equipment card surfaces maintenance history and next scheduled task.',
    annotation: { x: 65, y: 40, label: 'Quick-action menu' },
  },
  {
    image: frame10,
    title: 'Settings & Integration',
    description: 'Seamless integration with existing ERP systems, calendar sync, and team notification preferences — all configurable from a single panel.',
    annotation: { x: 50, y: 55, label: 'API configuration' },
  },
];

const UptimeProject = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);

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
              Back
            </Button>
          </div>

          {/* Section Nav */}
          <CaseStudyNav items={navItems} />

          <main className="pt-14">
            {/* Hero with Parallax Cover */}
            <CaseStudyHero
              title="UpTime CMMS"
              subtitle="UI/UX Case Study"
              description="A powerful maintenance and equipment tracking tool that reduces downtime through scheduled tasks, offline functionality, and smart reporting."
              coverImage={frame01}
              coverAlt="UpTime Cover"
              behanceUrl="https://www.behance.net/gallery/239892845/UpTime"
              meta={[
                { label: 'Role', value: 'Product Designer (UI/UX)' },
                { label: 'Scope', value: 'End-to-End Design' },
                { label: 'Platform', value: 'Web App (SaaS)' },
              ]}
              onCoverClick={() => openViewer(0)}
            />

            {/* Interactive Demo CTA */}
            <ScrollReveal>
              <div className="py-12 text-center">
                <button
                  onClick={() => setDemoOpen(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold block">Interactive Demo</span>
                    <span className="text-xs text-muted-foreground">Walk through the key screens</span>
                  </div>
                </button>
              </div>
            </ScrollReveal>

            {/* Section: Overview */}
            <div id="overview">
              <StickyScrollSection
                index={0}
                title="Reducing Equipment Downtime"
                subtitle="Problem Space"
                description="Maintenance teams in industrial environments struggled with fragmented tools, paper-based tracking, and reactive workflows. UpTime was designed to shift teams from firefighting to proactive asset management."
                bulletPoints={[
                  'Average 23% downtime due to unplanned equipment failures',
                  'No centralized system for tracking maintenance schedules',
                  'Teams relied on spreadsheets and verbal handoffs',
                ]}
                image={frame02}
                imageAlt="Product Overview"
                onImageClick={() => openViewer(1)}
              />
            </div>

            {/* Full-width: Design Approach */}
            <FullWidthFrame
              image={frame03}
              imageAlt="Design Approach"
              caption="Core design principles and feature architecture"
              onImageClick={() => openViewer(2)}
            />

            {/* Section: Research */}
            <div id="research">
              <StickyScrollSection
                index={1}
                title="Understanding the Users"
                subtitle="Research & Discovery"
                description="Through contextual interviews with maintenance managers and field technicians, we mapped pain points across the entire equipment lifecycle — from procurement to decommission."
                bulletPoints={[
                  'Conducted 12 user interviews across 3 industries',
                  'Created journey maps for 4 key workflows',
                  'Identified 8 critical friction points in existing tools',
                ]}
                image={frame05}
                imageAlt="User Persona"
                reversed
                onImageClick={() => openViewer(4)}
              />

              <FullWidthFrame
                image={frame04}
                imageAlt="Project Timeline"
                caption="Design sprint timeline — from research to high-fidelity prototypes"
                onImageClick={() => openViewer(3)}
              />

              <StickyScrollSection
                index={2}
                title="Mapping Emotional Drivers"
                subtitle="Empathy Mapping"
                description="We synthesized research into empathy maps that revealed the emotional journey of maintenance teams — from the anxiety of unexpected breakdowns to the satisfaction of a well-maintained fleet."
                image={frame06}
                imageAlt="Empathy Map"
                onImageClick={() => openViewer(5)}
              />
            </div>

            {/* Section: Brand Identity */}
            <div id="identity">
              <StickyScrollSection
                index={3}
                title="Industrial Precision, Modern Craft"
                subtitle="Brand Identity"
                description="The visual identity was designed to feel authoritative and trustworthy — reflecting the precision required in industrial maintenance while remaining approachable for technicians in the field."
                bulletPoints={[
                  'Color palette inspired by safety signage and dashboard instruments',
                  'Typography optimized for readability on tablets in bright/dim environments',
                  'Iconography designed for glanceable comprehension',
                ]}
                image={frame07}
                imageAlt="Brand Identity"
                reversed
                onImageClick={() => openViewer(6)}
              />
            </div>

            {/* Section: Design */}
            <div id="design">
              <FullWidthFrame
                image={frame08}
                imageAlt="Dashboard Design"
                caption="The main dashboard — designed for clarity over complexity"
                onImageClick={() => openViewer(7)}
              />
            </div>

            {/* Section: Features */}
            <div id="features">
              <StickyScrollSection
                index={4}
                title="Equipment Registry & Task Management"
                subtitle="Core Features"
                description="The equipment registry serves as the single source of truth for all assets. Each record links to maintenance history, upcoming tasks, and real-time health indicators — reducing the cognitive load of managing large equipment fleets."
                bulletPoints={[
                  'Drag-and-drop task scheduling with dependency tracking',
                  'Offline-first architecture for field use',
                  'Automated alerts based on usage thresholds and calendar schedules',
                ]}
                image={frame09}
                imageAlt="Equipment Registry & Task Management"
                onImageClick={() => openViewer(8)}
              />
            </div>

            {/* Section: Integration */}
            <div id="integration">
              <StickyScrollSection
                index={5}
                title="Seamless Ecosystem Integration"
                subtitle="Settings & APIs"
                description="UpTime was designed to slot into existing workflows — with integrations for ERP systems, calendar tools, and notification platforms. The settings architecture prioritizes discoverability without overwhelming new users."
                image={frame10}
                imageAlt="Settings & Integration"
                reversed
                onImageClick={() => openViewer(9)}
              />
            </div>

            {/* Bottom CTA */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <div className="max-w-2xl mx-auto text-center">
                  <ScrollReveal>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      Want to see more?
                    </h2>
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
                  </ScrollReveal>
                </div>
              </div>
            </section>
          </main>

          <Footer />

          <ImageViewer
            images={allImages}
            currentIndex={viewerIndex}
            isOpen={viewerOpen}
            onClose={() => setViewerOpen(false)}
            onNavigate={setViewerIndex}
          />

          <InteractiveDemo
            steps={demoSteps}
            title="UpTime CMMS — Interactive Walkthrough"
            isOpen={demoOpen}
            onClose={() => setDemoOpen(false)}
          />
        </div>
      </PageTransition>
    </>
  );
};

export default UptimeProject;
