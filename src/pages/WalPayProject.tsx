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

const caseStudyImages = [
  { src: frame01, alt: 'WalPay Cover - UI/UX Case Study', label: 'Cover' },
  { src: frame02, alt: 'Product Overview - Digital Wallet Platform', label: 'Product Overview' },
  { src: frame03, alt: 'Frustrations and Solutions', label: 'Frustrations & Solutions' },
  { src: frame04, alt: 'Design Process - Double Diamond', label: 'Design Process' },
  { src: frame05, alt: 'User Persona - Sarah Jenkins', label: 'User Persona' },
  { src: frame06, alt: 'Empathy Mapping', label: 'Empathy Mapping' },
  { src: frame07, alt: 'User Flow', label: 'User Flow' },
  { src: frame08, alt: 'Website Design', label: 'Website Design' },
  { src: frame09, alt: 'Style Guide - Typography & Colors', label: 'Style Guide' },
  { src: frame10, alt: 'High Fidelity Mobile Designs - Onboarding', label: 'Onboarding Screens' },
  { src: frame11, alt: 'Send Money & Wallet Transactions', label: 'Send Money & Transactions' },
  { src: frame12, alt: 'Profile Settings & Preferences', label: 'Profile & Settings' },
  { src: frame13, alt: 'KYC Verification Flow', label: 'KYC Flow' },
];

const BEHANCE_URL = "https://www.behance.net/gallery/242927925/WalPay-UI-UX-Case-Study";

const stickyScrollItems = [
  {
    title: 'The Challenge',
    subtitle: 'Discovery',
    description: 'International money transfers were riddled with hidden fees, slow processing, and fragmented experiences — leaving users anxious about where their money was at any given moment.',
    image: frame03,
    imageAlt: 'Frustrations and Solutions',
    metrics: [
      { label: 'Avg. Transfer Fee', value: '7.5%' },
      { label: 'Processing Time', value: '3-5 days' },
    ],
  },
  {
    title: 'Understanding Users',
    subtitle: 'Research',
    description: 'We interviewed expatriates and freelancers who regularly send money across borders. Their core need: trust, speed, and transparency in every transaction.',
    image: frame05,
    imageAlt: 'User Persona - Sarah Jenkins',
  },
  {
    title: 'Design Language',
    subtitle: 'Visual System',
    description: 'A fintech product demands trust. We built a design system around clean geometry, a confidence-inspiring blue palette, and typography that balances authority with approachability.',
    image: frame09,
    imageAlt: 'Style Guide',
  },
  {
    title: 'Mobile-First Experience',
    subtitle: 'Final Designs',
    description: 'Every screen was designed for thumb-friendly interaction on mobile. The send-money flow was reduced from 8 steps to 3, with real-time rate visibility and instant confirmation.',
    image: frame10,
    imageAlt: 'Onboarding Screens',
    metrics: [
      { label: 'Steps Reduced', value: '62%' },
      { label: 'Task Success', value: '97%' },
    ],
  },
];


const WalPayProject = () => {
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
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/30">
            <Progress value={scrollProgress} className="h-1 rounded-none" />
          </div>

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
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">WalPay</h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    A digital wallet and currency exchange platform designed to remove the friction from international finance, enabling instant transfers with institutional-grade rates.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="px-4 py-2 bg-card border border-border rounded-lg">
                      <span className="text-xs text-muted-foreground block">Role</span>
                      <span className="font-medium">Product Designer (UI/UX)</span>
                    </div>
                    <div className="px-4 py-2 bg-card border border-border rounded-lg">
                      <span className="text-xs text-muted-foreground block">Timeline</span>
                      <span className="font-medium">8 Weeks</span>
                    </div>
                    <div className="px-4 py-2 bg-card border border-border rounded-lg">
                      <span className="text-xs text-muted-foreground block">Platform</span>
                      <span className="font-medium">iOS App & Website</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href={BEHANCE_URL}
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

            {/* Case Study Content */}
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

export default WalPayProject;
