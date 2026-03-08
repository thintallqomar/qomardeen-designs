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

import frame01 from '@/assets/walpay/frame-01.png';
import frame02 from '@/assets/walpay/frame-02.png';
import frame03 from '@/assets/walpay/frame-03.png';
import frame04 from '@/assets/walpay/frame-04.png';
import frame05 from '@/assets/walpay/frame-05.png';
import frame06 from '@/assets/walpay/frame-06.png';
import frame07 from '@/assets/walpay/frame-07.png';
import frame08 from '@/assets/walpay/frame-08.png';
import frame09 from '@/assets/walpay/frame-09.png';
import frame10 from '@/assets/walpay/frame-10.png';
import frame11 from '@/assets/walpay/frame-11.png';
import frame12 from '@/assets/walpay/frame-12.png';
import frame13 from '@/assets/walpay/frame-13.png';

const BEHANCE_URL = "https://www.behance.net/gallery/242927925/WalPay-UI-UX-Case-Study";

const allImages = [
  { src: frame01, alt: 'WalPay Cover' },
  { src: frame02, alt: 'Product Overview' },
  { src: frame03, alt: 'Frustrations & Solutions' },
  { src: frame04, alt: 'Design Process' },
  { src: frame05, alt: 'User Persona' },
  { src: frame06, alt: 'Empathy Mapping' },
  { src: frame07, alt: 'User Flow' },
  { src: frame08, alt: 'Website Design' },
  { src: frame09, alt: 'Style Guide' },
  { src: frame10, alt: 'Onboarding Screens' },
  { src: frame11, alt: 'Send Money & Transactions' },
  { src: frame12, alt: 'Profile & Settings' },
  { src: frame13, alt: 'KYC Flow' },
];

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'research', label: 'Research' },
  { id: 'flows', label: 'User Flows' },
  { id: 'identity', label: 'Brand & Style' },
  { id: 'screens', label: 'Key Screens' },
  { id: 'compliance', label: 'Compliance' },
];

const demoSteps = [
  {
    image: frame10,
    title: 'Onboarding Experience',
    description: 'A guided onboarding flow that builds trust through progressive disclosure — asking only what's needed at each step, with clear value communication.',
    annotation: { x: 50, y: 30, label: 'Progressive onboarding' },
  },
  {
    image: frame11,
    title: 'Send Money Flow',
    description: 'The core transfer experience optimized for speed and confidence. Real-time rate display, fee transparency, and confirmation steps designed to reduce abandonment.',
    annotation: { x: 40, y: 45, label: 'Live exchange rates' },
  },
  {
    image: frame12,
    title: 'Profile & Settings',
    description: 'Account management designed for security-conscious users. Verification status, notification preferences, and linked accounts are clearly organized.',
    annotation: { x: 55, y: 35, label: 'Security controls' },
  },
  {
    image: frame13,
    title: 'KYC Verification',
    description: 'A frictionless identity verification flow that guides users through document capture, selfie verification, and address confirmation with clear progress indicators.',
    annotation: { x: 45, y: 50, label: 'Document capture' },
  },
];

const WalPayProject = () => {
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
              title="WalPay"
              subtitle="UI/UX Case Study"
              description="A digital wallet and currency exchange platform designed to remove the friction from international finance, enabling instant transfers with institutional-grade rates."
              coverImage={frame01}
              coverAlt="WalPay Cover"
              behanceUrl={BEHANCE_URL}
              meta={[
                { label: 'Role', value: 'Product Designer (UI/UX)' },
                { label: 'Timeline', value: '8 Weeks' },
                { label: 'Platform', value: 'iOS App & Website' },
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
                title="Simplifying International Finance"
                subtitle="Problem Space"
                description="Users sending money internationally faced hidden fees, confusing exchange rates, and fragmented experiences across multiple apps. WalPay was designed to consolidate these workflows into a single, trust-building experience."
                bulletPoints={[
                  'Average user checks 3+ platforms before making a transfer',
                  'Hidden fees erode trust and cause cart abandonment',
                  'Complex KYC processes deter first-time users',
                ]}
                image={frame02}
                imageAlt="Product Overview"
                onImageClick={() => openViewer(1)}
              />

              <FullWidthFrame
                image={frame03}
                imageAlt="Frustrations & Solutions"
                caption="Mapping user frustrations to design solutions"
                onImageClick={() => openViewer(2)}
              />
            </div>

            {/* Section: Research */}
            <div id="research">
              <StickyScrollSection
                index={1}
                title="Double Diamond Process"
                subtitle="Design Process"
                description="We followed a Double Diamond approach — diverging broadly to understand the problem space, then converging on the highest-impact opportunities through rapid prototyping and user testing."
                bulletPoints={[
                  'Discover: Competitive analysis of 8 fintech apps',
                  'Define: Synthesized insights into 5 opportunity areas',
                  'Develop: Rapid prototyping with 3 concept directions',
                  'Deliver: Iterative refinement through 4 usability test rounds',
                ]}
                image={frame04}
                imageAlt="Design Process"
                reversed
                onImageClick={() => openViewer(3)}
              />

              <StickyScrollSection
                index={2}
                title="Understanding Financial Anxiety"
                subtitle="User Personas"
                description="Our primary persona, Sarah, represented the digitally-savvy professional who sends money home regularly but lacks confidence in digital platforms due to past experiences with hidden charges and failed transfers."
                image={frame05}
                imageAlt="User Persona"
                onImageClick={() => openViewer(4)}
              />

              <FullWidthFrame
                image={frame06}
                imageAlt="Empathy Mapping"
                caption="Empathy map — synthesizing user research into emotional drivers"
                onImageClick={() => openViewer(5)}
              />
            </div>

            {/* Section: User Flows */}
            <div id="flows">
              <StickyScrollSection
                index={3}
                title="Mapping the Transfer Journey"
                subtitle="User Flows"
                description="Every screen in the transfer flow was designed to minimize cognitive load and build confidence. We reduced the send-money flow from 7 steps to 4, while adding transparency at each stage."
                bulletPoints={[
                  'Real-time rate lock with countdown timer',
                  'Fee breakdown visible before confirmation',
                  'Estimated delivery time shown on confirmation screen',
                ]}
                image={frame07}
                imageAlt="User Flow"
                reversed
                onImageClick={() => openViewer(6)}
              />
            </div>

            {/* Section: Brand & Style */}
            <div id="identity">
              <StickyScrollSection
                index={4}
                title="Trust Through Visual Language"
                subtitle="Brand Identity"
                description="The visual system was designed to communicate trust, speed, and transparency — the three pillars that fintech users value most. The website serves as both marketing surface and product preview."
                image={frame08}
                imageAlt="Website Design"
                onImageClick={() => openViewer(7)}
              />

              <FullWidthFrame
                image={frame09}
                imageAlt="Style Guide"
                caption="Typography, color system, and component library"
                onImageClick={() => openViewer(8)}
              />
            </div>

            {/* Section: Key Screens */}
            <div id="screens">
              <StickyScrollSection
                index={5}
                title="Onboarding That Builds Confidence"
                subtitle="Mobile Experience"
                description="The onboarding flow uses progressive disclosure to collect only essential information upfront, deferring KYC to when the user first attempts a transfer — reducing drop-off by positioning verification as a value-add rather than a barrier."
                image={frame10}
                imageAlt="Onboarding Screens"
                reversed
                onImageClick={() => openViewer(9)}
              />

              <FullWidthFrame
                image={frame11}
                imageAlt="Send Money & Transactions"
                caption="Core transaction screens — designed for speed, clarity, and confidence"
                onImageClick={() => openViewer(10)}
              />

              <StickyScrollSection
                index={6}
                title="Profiles Built for Security"
                subtitle="Account Management"
                description="The profile section surfaces verification status, connected accounts, and security settings in a scannable layout. Users can see exactly what data the platform holds and control notification preferences granularly."
                image={frame12}
                imageAlt="Profile & Settings"
                onImageClick={() => openViewer(11)}
              />
            </div>

            {/* Section: Compliance */}
            <div id="compliance">
              <StickyScrollSection
                index={7}
                title="Frictionless Identity Verification"
                subtitle="KYC Flow"
                description="The KYC flow was designed as a guided experience rather than a form dump. Document capture uses device camera with real-time framing guides, and progress indicators keep users informed throughout the verification process."
                bulletPoints={[
                  'Camera-based document capture with edge detection',
                  'Selfie verification with liveness detection prompts',
                  'Clear progress indicators across 3 verification stages',
                  'Estimated processing time shown after submission',
                ]}
                image={frame13}
                imageAlt="KYC Flow"
                reversed
                onImageClick={() => openViewer(12)}
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
                        href={BEHANCE_URL}
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
            title="WalPay — Interactive Walkthrough"
            isOpen={demoOpen}
            onClose={() => setDemoOpen(false)}
          />
        </div>
      </PageTransition>
    </>
  );
};

export default WalPayProject;
