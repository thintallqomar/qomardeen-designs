import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReadingProgress from '@/components/ReadingProgress';
import FloatingBackButton from '@/components/FloatingBackButton';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ImageViewer from '@/components/ImageViewer';
import StickyScrollSection from '@/components/StickyScrollSection';
import ScrollReveal from '@/components/ScrollReveal';
import RollingNumber from '@/components/RollingNumber';
import { CaseStudyHeader, CaseStudyFrames, CaseStudyEnd } from '@/components/caseStudy/CaseStudyParts';

import cover from '@/assets/portfolio/cover.webp';
import hero from '@/assets/portfolio/hero.webp';
import home from '@/assets/portfolio/home.webp';
import hire from '@/assets/portfolio/hire.webp';
import system from '@/assets/portfolio/system.webp';
import footer from '@/assets/portfolio/footer.webp';
import themes from '@/assets/portfolio/themes.webp';
import phones from '@/assets/portfolio/phones.webp';
import phonesVideo from '@/assets/portfolio/phones.mp4';
import admin from '@/assets/portfolio/admin.webp';
import adminOverview from '@/assets/portfolio/admin-overview.webp';

/*
 * Case study of this site. Every number here was measured on the real site:
 * before = the original version, after = the current one, both at 1440px wide.
 *   footer height 863px -> 162px (81% less) · Hire page 5,615px -> 4,360px (22% shorter)
 *   Hire sections 8 -> 6 · 11 languages · checked at 4 screen widths.
 */

const frames = [
  { src: cover, alt: 'This portfolio: the Home page on desktop and the Hire page on a phone', label: 'Cover' },
  { src: home, alt: 'Home page before and after the redesign', label: 'Home: before and after' },
  { src: hire, alt: 'Hire page before and after the redesign', label: 'Hire: before and after' },
  { src: system, alt: 'Projects and About pages sharing the same opening and type scale', label: 'One system across pages' },
  { src: footer, alt: 'Footer before (863px tall) and after (162px tall)', label: 'The footer: 863px to 162px' },
  { src: themes, alt: 'Home page in light mode and dark mode', label: 'Light by day, dark by night' },
  { src: phones, video: phonesVideo, alt: 'Home, Projects and About pages scrolling on a phone, in light mode', label: 'On a phone' },
  { src: admin, alt: 'The admin: the overview, and the articles list with an on/off switch on each (email blurred)', label: 'The studio: my own admin' },
];
const ADMIN_FRAME = frames.length - 1;

const story = [
  {
    subtitle: 'The problem',
    title: 'A portfolio that said a lot and showed little',
    description:
      'The first version called me a designer "at the intersection of UX, AI and systems thinking", which is true but proved nothing. Hire, Contact and the footer repeated each other, and every page had its own layout. A recruiter had to work to find the point.',
    image: home,
    imageAlt: 'Home page before and after the redesign',
  },
  {
    subtitle: 'Positioning',
    title: 'One idea: a designer who builds',
    description:
      'Everything hangs on one line: "I design products. Then I build them." The Home portrait splits into the designer and a code-made version; your pointer slides the seam. About keeps it honest with an 80/20 split. Every page then follows the same rules: one type scale, one left edge, and only what you point at gets a fill.',
    image: hero,
    imageAlt: 'The split-portrait Home hero: designer on one side, builder on the other',
  },
  {
    subtitle: 'Iteration',
    title: 'Every section had to earn its place',
    description:
      'I cut anything a visitor would read twice. The footer kept every link but lost 81% of its height, Contact moved into Hire, and Hire dropped from 8 sections to 6 with one "Book a call".',
    image: footer,
    imageAlt: 'Footer before and after',
    metrics: [
      { label: 'Smaller footer', value: '81%' },
      { label: 'Hire sections', value: '8 → 6' },
    ],
  },
];

const results = [
  { value: 81, suffix: '%', label: 'less footer height, with the same links' },
  { value: 22, suffix: '%', label: 'shorter Hire page, with one clear next step' },
  { value: 11, suffix: '', label: 'languages, including Yoruba, Hausa, Igbo and Pidgin' },
  { value: 1, suffix: '', label: 'editor for every piece of content in the admin' },
];

/* Each decision: what I chose, why, and what it cost. */
const decisions = [
  {
    title: 'A split portrait instead of a photo and a job title',
    why: 'My first hero looked like every other portfolio: photo, name, "Product Designer". I studied portfolios I admired (Adham Dannaway\'s designer/coder split was the strongest) and chose an image that says "designer who builds" before anyone reads a word.',
    cost: 'More motion and more to get right. It needs a tap toggle on phones (there is no mouse), and a still version for people who turn motion off.',
  },
  {
    title: 'An honest 80/20 instead of "full-stack"',
    why: 'Recruiters probe claims. I design far more than I code, so the About page says exactly that, and I removed a "React and TypeScript" line because I am not learning those yet.',
    cost: 'A smaller claim. I would rather undersell than be caught out in an interview.',
  },
  {
    title: 'Contact merged into Hire',
    why: 'Two pages did the same job, so visitors had to guess which one to use. Now every "Contact" link lands on the form at the bottom of Hire, and old /contact links still work.',
    cost: 'A longer Hire page, so I cut two sections that repeated others, and the page still ended up 22% shorter.',
  },
  {
    title: 'One way to open every page',
    why: 'A lowercase word and a dot ("projects.", "about.") plus one type scale means visitors learn the layout once and then just read.',
    cost: 'Less room for each page to have its own personality. The case studies and the Home hero carry that instead.',
  },
  {
    title: 'Only one highlighted thing at a time',
    why: 'Moving between the Projects tabs, I noticed the unselected tabs had their own fills fighting the sliding highlight. Now only the thing you point at gets a fill, in tabs and in menus.',
    cost: 'The current page is shown by colour rather than a filled box, so the colour contrast has to stay strong in both themes.',
  },
  {
    title: 'Everything editable from my own admin, with an on/off switch',
    why: 'I should not need code, or credits, to fix a typo or swap a project. Case studies, articles, my CV and hero photos all live in the admin, and anything can be switched off while I rework it.',
    cost: 'More to build up front: roles, an editor, image uploads, two-step sign-in and security rules so visitors only ever see what is switched on.',
  },
  {
    title: 'Eleven languages, including Yoruba, Hausa, Igbo and Pidgin',
    why: 'I am a Nigerian designer applying locally and abroad. Speaking a visitor\'s language, at home or overseas, is a small signal that I think about who is on the other side of the screen.',
    cost: 'Every copy change is eleven changes. Case study text stays in English for now.',
  },
];

/* Why the site has its own admin ("the studio"). */
const studio = [
  { title: 'Change it in minutes', body: 'A typo, a new CV or a new case study is a form to fill in, not a code change. Content no longer costs me Lovable credits or a developer.' },
  { title: 'Switch off instead of delete', body: 'Anything can be hidden while I rework it, then switched back on exactly as it was. Visitors never see a half-finished page.' },
  { title: 'Locked down', body: 'Only my account can publish, and visitors only ever see what is switched on. Signing in needs a code from an authenticator app as well as the password.' },
];

/* How the work was actually split between me, Lovable and Claude. */
const workflow = [
  { step: 'Built in Lovable', body: 'I started the site in Lovable: the first pages, the Supabase database and the AI assistant. It got me live quickly.' },
  { step: 'Moved to Claude', body: 'When my Lovable credits ran out, I gave Claude my site\'s code from GitHub. I describe what I want in plain words, often with screenshots, and Claude reads the code and makes the change.' },
  { step: 'Checked before I see it', body: 'Claude builds every change and checks it in a real browser at four screen widths, in light and dark mode, measuring things like footer height instead of eyeballing them.' },
  { step: 'I review and ship', body: 'Every update comes back as one package with a plain-English list of what changed. I review it, upload it to GitHub, then publish it from Lovable.' },
];
const iDid = [
  'Set the direction: "designer who builds", and honest about the 80/20',
  'Chose the hero style and the type, spacing and colour rules',
  'Spotted problems in use: clashing tab fills, white edges on my photo, "Book a call" twice, a footer that was too big',
  'Decided what to cut, and reviewed every update before it went live',
];
const claudeDid = [
  'Wrote most of the code changes, from the footer to the on/off switches',
  'Translated new copy into all 11 languages',
  'Audited and fixed security issues, and added two-step sign-in to the admin',
  'Tested every change at 1440, 768, 375 and 320px, in both themes',
];

const next = [
  'Measure it: see which case studies recruiters open and where they leave.',
  'Add testimonials from real collaborators as projects wrap up.',
  'Grow the building side past 20%, one shipped feature at a time.',
];

const PortfolioProject = () => {
  const { t } = useTranslation();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const openViewer = (i: number) => { setViewerIndex(i); setViewerOpen(true); };

  return (
    <>
      <Navigation />
      <PageSEO
        title="This Portfolio — Designed and Built by Qomardeen Tijani"
        description="How I redesigned and built my portfolio: one idea, one design system, and every section earning its place. Before-and-after, measured."
        path="/projects/portfolio"
      />
      <PageTransition>
        <div className="min-h-screen">
          <ReadingProgress />
          <FloatingBackButton />

          <main className="pt-14">
            <CaseStudyHeader
              badge="Designed & built"
              title="This portfolio"
              lead="A product designer's site has two jobs: show the work quickly, and prove I can ship it. So I designed this one, then built it myself."
              facts={[
                { label: t('caseStudy.role'), value: 'Designer & builder (solo)' },
                { label: t('caseStudy.platform'), value: 'Responsive web, 11 languages' },
                { label: 'Built with', value: 'Lovable, then Claude (React, Supabase)' },
                { label: t('caseStudy.timeline'), value: '2025, ongoing' },
              ]}
            />

            <StickyScrollSection items={story} />

            {/* Results, measured on the live site at 1440px wide */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="t-h2 mb-3">Results so far</h2>
                  <p className="text-muted-foreground max-w-2xl mb-10">Measured on the site itself, before and after, at the same screen width.</p>
                </ScrollReveal>
                <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8">
                  {results.map(r => (
                    <div key={r.label} className="border-t border-border py-5">
                      <dt className="sr-only">{r.label}</dt>
                      <dd>
                        <span className="block text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tighter leading-none">
                          <RollingNumber value={r.value} />{r.suffix && <span className="text-primary">{r.suffix}</span>}
                        </span>
                        <span className="mt-3 block text-sm text-muted-foreground" aria-hidden="true">{r.label}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            {/* Key decisions: what, why, and the trade-off */}
            <section className="section-padding">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="t-h2 mb-3">Key decisions</h2>
                  <p className="text-muted-foreground max-w-2xl mb-8">What I chose, why, and what it cost.</p>
                </ScrollReveal>
                <ol>
                  {decisions.map((d, i) => (
                    <li key={d.title} className="grid md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-2 border-t border-border py-6">
                      <span className="font-mono text-sm text-primary tabular-nums pt-1">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="t-h3 mb-2">{d.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{d.why}</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed md:pt-1">
                        <span className="block text-xs font-semibold uppercase tracking-widest text-foreground/70 mb-1.5">Trade-off</span>
                        {d.cost}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* The admin behind the site */}
            <section className="section-padding">
              <div className="container-custom">
                <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-14 lg:items-start">
                  <ScrollReveal>
                    <h2 className="t-h2 mb-3">The studio behind the site</h2>
                    <p className="text-muted-foreground leading-relaxed max-w-xl">
                      A portfolio goes stale when changing it is hard, so the site has its own admin. Case studies, articles, the About page, hero photos, my CV, messages from visitors and Atlas's memory are all edited there, without code.
                    </p>
                    <ul className="mt-6">
                      {studio.map(w => (
                        <li key={w.title} className="border-t border-border py-4">
                          <h3 className="t-h3 mb-1">{w.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{w.body}</p>
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                  <ScrollReveal delay={0.1}>
                    <button
                      type="button"
                      onClick={() => openViewer(ADMIN_FRAME)}
                      className="block w-full overflow-hidden rounded-2xl border border-border bg-card cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label="The admin: open full screen"
                    >
                      <img src={adminOverview} alt="The admin overview: published, draft and scheduled counts, shortcuts to create content, and recent activity (email blurred)" loading="lazy" decoding="async" className="w-full h-auto" />
                    </button>
                    <p className="mt-3 text-sm text-muted-foreground">The overview. Tap to see it next to the on/off switches. My email is blurred.</p>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* How it was built: Lovable first, then Claude */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="t-h2 mb-3">How I built it: Lovable, then Claude</h2>
                  <p className="text-muted-foreground max-w-2xl mb-10">
                    The site started in Lovable. Most of what you see now came from working with Claude: I made the design calls, and Claude did most of the building and checking.
                  </p>
                </ScrollReveal>
                <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
                  {workflow.map((w, i) => (
                    <li key={w.step} className="border-t border-border py-5">
                      <span className="font-mono text-sm text-primary tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="t-h3 mt-2 mb-2">{w.step}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{w.body}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-10 grid md:grid-cols-2 gap-x-8">
                  {[{ title: 'What I did', items: iDid }, { title: 'What Claude did', items: claudeDid }].map(col => (
                    <div key={col.title} className="border-t border-border pt-5 pb-2">
                      <h3 className="t-h3 mb-4">{col.title}</h3>
                      <ul className="space-y-3">
                        {col.items.map(it => (
                          <li key={it} className="flex gap-3 text-[15px] leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <CaseStudyFrames
              title={t('caseStudy.fullTitle')}
              blurb="Every screen, before and after, taken from the real site."
              frames={frames}
              onOpen={openViewer}
            />

            {/* What's next */}
            <section className="pb-16 md:pb-24">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="t-h2 mb-6">What's next</h2>
                  <ol className="max-w-2xl">
                    {next.map((n, i) => (
                      <li key={n} className="flex gap-4 border-t border-border py-4">
                        <span className="font-mono text-sm text-primary tabular-nums pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                        <span>{n}</span>
                      </li>
                    ))}
                  </ol>
                </ScrollReveal>
              </div>
            </section>

            <CaseStudyEnd next={{ title: 'UpTime CMMS', route: '/projects/uptime', blurb: 'Asset management with complex maintenance workflows and dashboards.' }} />
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

export default PortfolioProject;
