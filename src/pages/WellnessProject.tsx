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

import cover from '@/assets/wellness/cover.webp';
import flow from '@/assets/wellness/flow.webp';
import checkin from '@/assets/wellness/checkin.webp';
import steps from '@/assets/wellness/steps.webp';
import system from '@/assets/wellness/system.webp';
import prototypePoster from '@/assets/wellness/prototype.webp';
import flowVideo from '@/assets/wellness/flow.mp4';
import checkinVideo from '@/assets/wellness/checkin.mp4';
import stepsVideo from '@/assets/wellness/steps.mp4';
import prototypeVideo from '@/assets/wellness/prototype.mp4';
import CaseVideo from '@/components/caseStudy/CaseVideo';
import ScrollReveal from '@/components/ScrollReveal';
import { ExternalLink } from 'lucide-react';

/*
 * A short case study: Unwind, a four-screen mood and mindfulness app, made in Figma for an
 * AltSchool Africa product design assignment (third semester, month 2, week 1).
 * ("Unwind" is a working name; the page address stays /projects/wellness.)
 * Everything written here describes what the screens actually do. No research or results are
 * claimed, because this was a design exercise, not a shipped product.
 */
const PROTOTYPE_URL = 'https://www.figma.com/proto/xFT0ynq0VdlT2DLoQJFJIh?node-id=36-509&starting-point-node-id=36%3A509';

const frames = [
  { src: cover, alt: 'Unwind, a mood and mindfulness app: the home, workout and session complete screens', label: 'Cover' },
  { src: flow, video: flowVideo, alt: 'The four screens in order: check in, pick a session, follow the steps, done', label: 'From check-in to done' },
  { src: checkin, video: checkinVideo, alt: 'Home screen picking a mood, adding a note and logging it, next to the mood and note field states', label: 'How are you feeling?' },
  { src: steps, video: stepsVideo, alt: 'Exercise steps ticking off one by one, next to the session complete screen', label: 'One step at a time' },
  { src: system, alt: 'Colours, Quicksand type, the tab bar states and the mood picker', label: 'A calm little system' },
];

const story = [
  {
    subtitle: 'The brief',
    title: 'From a check-in to a finished session',
    description:
      'An AltSchool assignment: a small wellness app. Unwind asks how you feel, suggests a session, walks you through it and tells you when you are done. Four screens, each with one main job.',
    image: flow,
    video: flowVideo,
    imageAlt: frames[1].alt,
  },
  {
    subtitle: 'Checking in',
    title: 'A mood in one tap',
    description:
      'Five faces, from Sad to Ecstatic, with one selected look: a blue ring and a bolder label. The note is optional, and Log Mood answers with a short card that leads to a workout.',
    image: checkin,
    video: checkinVideo,
    imageAlt: frames[2].alt,
  },
  {
    subtitle: 'The session',
    title: 'Steps that open in order',
    description:
      'Only the current step is open, with a tip under it. Done steps turn green, later ones stay locked, and a bar shows how far along you are. The last screen sums up the session and the achievement it unlocked.',
    image: steps,
    video: stepsVideo,
    imageAlt: frames[3].alt,
  },
];

const WellnessProject = () => {
  const { t } = useTranslation();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const openViewer = (i: number) => { setViewerIndex(i); setViewerOpen(true); };

  return (
    <>
      <Navigation />
      <PageSEO
        title="Unwind — Mood & Mindfulness App by Qomardeen Tijani"
        description="Unwind: a four-screen mood and mindfulness app designed in Figma. Check in, pick a session, follow the steps, done."
        path="/projects/wellness"
      />
      <PageTransition>
        <div className="min-h-screen">
          <ReadingProgress />
          <FloatingBackButton />

          <main className="pt-14">
            <CaseStudyHeader
              badge="Mobile app"
              title="Unwind"
              lead="A mood and mindfulness app: check in, get a session that fits, and follow it step by step."
              facts={[
                { label: t('caseStudy.role'), value: 'Product Designer (UI)' },
                { label: t('caseStudy.scope'), value: 'Check-in to session, 4 screens' },
                { label: t('caseStudy.platform'), value: 'Mobile app (iOS)' },
                { label: 'Tools', value: 'Figma' },
                { label: 'Made for', value: 'AltSchool Africa assignment' },
              ]}
              liveUrl={PROTOTYPE_URL}
              liveLabel="Try the prototype"
            />

            <StickyScrollSection items={story} />

            {/* The clickable prototype, walked through tap by tap */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <div className="mb-8 max-w-2xl">
                    <h2 className="t-h2 mb-3">The prototype, tap by tap</h2>
                    <p className="text-muted-foreground">
                      Every link in the Figma prototype, in order: the five moods, the note field, Log Mood and its card, the tab bar, Start Exercise, each Next Step, Finish and back home. The tab bar and the back arrow stay fixed while the page scrolls. Buttons that aren't linked yet are tapped too, so you can see where the prototype stops.
                    </p>
                  </div>
                </ScrollReveal>
                <CaseVideo src={prototypeVideo} poster={prototypePoster} label="Prototype walkthrough: every tap and where it leads" />
                <a href={PROTOTYPE_URL} target="_blank" rel="noopener noreferrer" className="btn-outline mt-6 inline-flex">
                  <ExternalLink className="w-4 h-4" /> Try it yourself in Figma
                </a>
              </div>
            </section>

            <CaseStudyFrames
              title={t('caseStudy.framesTitle')}
              blurb="Every screen, straight from the Figma file. Tap one to see it full screen."
              frames={frames}
              onOpen={openViewer}
            />

            <CaseStudyEnd next={{ title: 'Leafie', route: '/projects/fragrance', blurb: 'Another short mobile flow: a fragrance shopping app, from browsing to a paid order.' }} />
          </main>

          <Footer />

          <ImageViewer
            images={frames}
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

export default WellnessProject;
