import { useState } from 'react';
import RichText from '@/components/RichText';
import ScrollReveal from '@/components/ScrollReveal';
import ImageViewer from '@/components/ImageViewer';
import CaseVideo from '@/components/caseStudy/CaseVideo';

interface StoryItem {
  title: string;
  subtitle?: string;
  description: string;
  descriptionJson?: unknown;
  image: string;
  imageAlt: string;
  /** Optional short clip shown instead of the image (the image becomes its poster). */
  video?: string;
  accent?: string;
  metrics?: { label: string; value: string }[];
}

interface StoryProps {
  items: StoryItem[];
  className?: string;
}

/** A case study story stays short: the problem, what changed, the result. Extra steps are not shown. */
export const MAX_STORY_STEPS = 3;

/**
 * The story part of every case study (UpTime, WalPay, the portfolio and admin-made ones).
 *
 * Plain rows that scroll at the visitor's own pace: words on the left, picture on the
 * right, every step visible while skimming. This replaced a pinned "sticky scroll"
 * version that held the page still and hid each step until you scrolled far enough,
 * which felt slow and made recruiters skip it. Tap a picture to open it full screen.
 * (The file keeps its old name so existing imports keep working.)
 */
const CaseStudyStory = ({ items, className = '' }: StoryProps) => {
  const steps = items.slice(0, MAX_STORY_STEPS);
  const [open, setOpen] = useState<number | null>(null);
  if (steps.length === 0) return null;

  return (
    <section className={`section-padding ${className}`}>
      <div className="container-custom">
        <ol className="space-y-14 md:space-y-20">
          {steps.map((item, i) => (
            <li key={i}>
              <ScrollReveal>
                <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-14 lg:items-center border-t border-border pt-8 md:pt-10">
                  <div className="max-w-xl">
                    <p className="mb-3 flex items-baseline gap-3 text-sm">
                      <span className="font-mono text-primary tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      {item.subtitle && <span className="font-medium text-muted-foreground">{item.subtitle}</span>}
                    </p>
                    <h2 className="t-h2 mb-3 md:mb-4">{item.title}</h2>
                    <RichText
                      json={item.descriptionJson}
                      fallback={item.description}
                      className="text-[15px] md:text-base text-muted-foreground leading-relaxed"
                    />
                    {item.metrics && item.metrics.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                        {item.metrics.map((m, k) => (
                          <div key={k}>
                            <p className="text-2xl md:text-3xl font-bold tracking-tight text-primary">{m.value}</p>
                            <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

{item.video ? (
                    <CaseVideo src={item.video} poster={item.image} label={item.imageAlt} />
                  ) : (
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="block w-full overflow-hidden rounded-2xl border border-border bg-card cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`${item.imageAlt}: open full screen`}
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  </button>
                  )}
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>

      <ImageViewer
        images={steps.map(s => ({ src: s.image, alt: s.imageAlt }))}
        currentIndex={open ?? 0}
        isOpen={open !== null}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </section>
  );
};

export default CaseStudyStory;
