import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageSEO from '@/components/PageSEO';
import { CaseStudyHeader, CaseStudyFrames, CaseStudyEnd } from '@/components/caseStudy/CaseStudyParts';
import ReadingProgress from '@/components/ReadingProgress';
import FloatingBackButton from '@/components/FloatingBackButton';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ImageViewer from '@/components/ImageViewer';
import StickyScrollSection from '@/components/StickyScrollSection';


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
  },
];


const WalPayProject = () => {
  const { t } = useTranslation();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };


  return (
    <>
      <Navigation />
      <PageSEO title="WalPay — Fintech UI/UX Case Study by Qomardeen Tijani" description="How I designed WalPay, a digital wallet and currency exchange app for cross-border transfers." path="/projects/walpay" />
      <PageTransition>
        <div className="min-h-screen">
          <ReadingProgress />

          <FloatingBackButton />

          <main className="pt-14">
            <CaseStudyHeader
              badge="UI/UX Case Study"
              title="WalPay"
              lead="A digital wallet and currency exchange platform designed to take the friction out of international transfers."
              facts={[{ label: t('caseStudy.role'), value: 'Product Designer (UI/UX)' }, { label: t('caseStudy.timeline'), value: '8 weeks' }, { label: t('caseStudy.platform'), value: 'iOS app & website' }]}
              liveUrl={BEHANCE_URL}
            />

            {/* Sticky Scroll Storytelling */}
            <StickyScrollSection items={stickyScrollItems} />

            <CaseStudyFrames
              title={t('caseStudy.fullTitle')}
              blurb={t('caseStudy.fullBlurb')}
              frames={caseStudyImages}
              onOpen={openViewer}
            />

            <CaseStudyEnd next={{ title: 'This portfolio', route: '/projects/portfolio', blurb: 'How I designed and built the site you are on.' }} />
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
