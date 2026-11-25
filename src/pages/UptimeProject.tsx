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
  },
];


const UptimeProject = () => {
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
      <PageSEO title="UpTime CMMS — UI/UX Case Study by Qomardeen Tijani" description="How I designed UpTime, a maintenance and equipment tracking web app for asset-heavy teams." path="/projects/uptime" />
      <PageTransition>
        <div className="min-h-screen">
          <ReadingProgress />

          <FloatingBackButton />

          <main className="pt-14">
            <CaseStudyHeader
              badge="UI/UX Case Study"
              title="UpTime CMMS"
              lead="A maintenance and equipment tracking tool that reduces downtime through scheduled tasks, offline functionality and smart reporting."
              facts={[{ label: t('caseStudy.role'), value: 'Product Designer (UI/UX)' }, { label: t('caseStudy.scope'), value: 'End-to-end design' }, { label: t('caseStudy.platform'), value: 'Web app (SaaS)' }]}
              liveUrl={"https://www.behance.net/gallery/239892845/UpTime"}
            />

            {/* Sticky Scroll Storytelling */}
            <StickyScrollSection items={stickyScrollItems} />

            <CaseStudyFrames
              title={t('caseStudy.fullTitle')}
              blurb={t('caseStudy.fullBlurb')}
              frames={caseStudyImages}
              onOpen={openViewer}
            />

            <CaseStudyEnd next={{ title: 'WalPay', route: '/projects/walpay', blurb: 'Digital wallet and currency exchange, with trust-building mobile flows.' }} />
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
