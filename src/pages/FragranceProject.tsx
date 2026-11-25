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

import cover from '@/assets/fragrance/cover.webp';
import flow from '@/assets/fragrance/flow.webp';
import product from '@/assets/fragrance/product.webp';
import checkout from '@/assets/fragrance/checkout.webp';
import system from '@/assets/fragrance/system.webp';

/*
 * A short case study: a four-screen mobile shopping flow for a fragrance store, made in Figma.
 * Everything written here describes what the screens actually do. No research or results are
 * claimed, because this was a design exercise, not a shipped product.
 */
const PROTOTYPE_URL = 'https://www.figma.com/proto/ajsn9pYWQaKwRDl1MOQRO9?node-id=52-753&starting-point-node-id=52%3A753';

const frames = [
  { src: cover, alt: 'Fragrance store app: the product, home and checkout screens', label: 'Cover' },
  { src: flow, alt: 'The four screens in order: browse, choose, check out, paid', label: 'Four screens to a paid order' },
  { src: product, alt: 'Product page with the fragrance and bottle size chips and their selected states', label: 'Pick a scent and a size' },
  { src: checkout, alt: 'Checkout with quantity steppers, address, payment, shipping and the full total, then the payment success screen', label: 'Everything on one page' },
  { src: system, alt: 'Colours, type and the tab bar states', label: 'A small system' },
];

const story = [
  {
    subtitle: 'The brief',
    title: 'From browsing to paid in four screens',
    description:
      'A small shopping flow for a fragrance store: find a scent, choose it, pay. I gave each screen one job, so nobody has to wonder what to do next.',
    image: flow,
    imageAlt: frames[1].alt,
  },
  {
    subtitle: 'Choosing',
    title: 'The bottle first, the choices second',
    description:
      'The product photo fills the top half. Price and rating sit beside the name, scent and size are plain chips with one selected look (a gold outline), and Add To Cart stays at the bottom within thumb reach.',
    image: product,
    imageAlt: frames[2].alt,
  },
  {
    subtitle: 'Paying',
    title: 'No surprises at checkout',
    description:
      'Items, quantities, address, payment and shipping all sit on one page, and tax and shipping are listed before the total. After paying, the order summary and a Track Order button answer "what now?".',
    image: checkout,
    imageAlt: frames[3].alt,
  },
];

const FragranceProject = () => {
  const { t } = useTranslation();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const openViewer = (i: number) => { setViewerIndex(i); setViewerOpen(true); };

  return (
    <>
      <Navigation />
      <PageSEO
        title="Fragrance Store App — Mobile Shopping Flow by Qomardeen Tijani"
        description="A four-screen mobile shopping flow for a fragrance store, designed in Figma: browse, choose, check out, paid."
        path="/projects/fragrance"
      />
      <PageTransition>
        <div className="min-h-screen">
          <ReadingProgress />
          <FloatingBackButton />

          <main className="pt-14">
            <CaseStudyHeader
              badge="Mobile app"
              title="Fragrance Store"
              lead="A four-screen shopping flow, from browsing scents to a paid order."
              facts={[
                { label: t('caseStudy.role'), value: 'Product Designer (UI)' },
                { label: t('caseStudy.scope'), value: 'Shopping flow, 4 screens' },
                { label: t('caseStudy.platform'), value: 'Mobile app (iOS)' },
                { label: 'Tools', value: 'Figma' },
              ]}
              liveUrl={PROTOTYPE_URL}
              liveLabel="Try the prototype"
            />

            <StickyScrollSection items={story} />

            <CaseStudyFrames
              title={t('caseStudy.framesTitle')}
              blurb="Every screen, straight from the Figma file. Tap one to see it full screen."
              frames={frames}
              onOpen={openViewer}
            />

            <CaseStudyEnd next={{ title: 'WalPay', route: '/projects/walpay', blurb: 'A larger mobile project: a digital wallet with trust-building flows.' }} />
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

export default FragranceProject;
