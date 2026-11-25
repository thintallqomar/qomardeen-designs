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
import prototypePoster from '@/assets/fragrance/prototype.webp';
import flowVideo from '@/assets/fragrance/flow.mp4';
import productVideo from '@/assets/fragrance/product.mp4';
import checkoutVideo from '@/assets/fragrance/checkout.mp4';
import prototypeVideo from '@/assets/fragrance/prototype.mp4';
import CaseVideo from '@/components/caseStudy/CaseVideo';
import ScrollReveal from '@/components/ScrollReveal';
import { ExternalLink } from 'lucide-react';

/*
 * A short case study: a four-screen mobile shopping flow for a fragrance store, made in Figma.
 * Everything written here describes what the screens actually do. No research or results are
 * claimed, because this was a design exercise, not a shipped product.
 */
const PROTOTYPE_URL = 'https://www.figma.com/proto/ajsn9pYWQaKwRDl1MOQRO9?node-id=52-753&starting-point-node-id=52%3A753';

const frames = [
  { src: cover, alt: 'Fragrance store app: the product, home and checkout screens', label: 'Cover' },
  { src: flow, video: flowVideo, alt: 'The four screens in order, each scrolling: browse, choose, check out, paid', label: 'Four screens to a paid order' },
  { src: product, video: productVideo, alt: 'Product page scrolling while a scent and a size are chosen, next to the chip states', label: 'Pick a scent and a size' },
  { src: checkout, video: checkoutVideo, alt: 'Checkout scrolling down to the full total, next to the payment success screen', label: 'Everything on one page' },
  { src: system, alt: 'Colours, type and the tab bar states', label: 'A small system' },
];

const story = [
  {
    subtitle: 'The brief',
    title: 'From browsing to paid in four screens',
    description:
      'A small shopping flow for a fragrance store: find a scent, choose it, pay. I gave each screen one job, so nobody has to wonder what to do next.',
    image: flow,
    video: flowVideo,
    imageAlt: frames[1].alt,
  },
  {
    subtitle: 'Choosing',
    title: 'The bottle first, the choices second',
    description:
      'The product photo fills the top half. Price and rating sit beside the name, scent and size are plain chips with one selected look (a gold outline), and Add To Cart stays at the bottom within thumb reach.',
    image: product,
    video: productVideo,
    imageAlt: frames[2].alt,
  },
  {
    subtitle: 'Paying',
    title: 'No surprises at checkout',
    description:
      'Items, quantities, address, payment and shipping all sit on one page, and tax and shipping are listed before the total. After paying, the order summary and a Track Order button answer "what now?".',
    image: checkout,
    video: checkoutVideo,
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

            {/* The clickable prototype, walked through tap by tap */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <div className="mb-8 max-w-2xl">
                    <h2 className="t-h2 mb-3">The prototype, tap by tap</h2>
                    <p className="text-muted-foreground">
                      Every link in the Figma prototype, in order: the brand filters, the tab bar, the cart, a product, scent and size, quantities, payment, and back home. Back arrows return to the screen you came from.
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
