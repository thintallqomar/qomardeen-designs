/*
 * The three case studies that started as coded pages: this portfolio, Leafie and Unwind.
 * Their content lives here once, in the same shape the admin uses, so:
 *  - the built-in pages render through the same CaseStudyView as admin-made case studies, and
 *  - "Import" in the admin can copy them (text, images and videos) without losing anything.
 * Everything written here describes the real work. No invented research, users or results.
 */
import type { CaseStudyBody } from '@/lib/cms';

import pCover from '@/assets/portfolio/cover.webp';
import pCard from '@/assets/portfolio/card.webp';
import pHero from '@/assets/portfolio/hero.webp';
import pHome from '@/assets/portfolio/home.webp';
import pHire from '@/assets/portfolio/hire.webp';
import pSystem from '@/assets/portfolio/system.webp';
import pFooter from '@/assets/portfolio/footer.webp';
import pFooterVideo from '@/assets/portfolio/footer.mp4';
import pThemes from '@/assets/portfolio/themes.webp';
import pPhones from '@/assets/portfolio/phones.webp';
import pPhonesVideo from '@/assets/portfolio/phones.mp4';
import pAdmin from '@/assets/portfolio/admin.webp';
import pAdminOverview from '@/assets/portfolio/admin-overview.webp';

import fCover from '@/assets/fragrance/cover.webp';
import fCard from '@/assets/fragrance/card.webp';
import fFlow from '@/assets/fragrance/flow.webp';
import fProduct from '@/assets/fragrance/product.webp';
import fCheckout from '@/assets/fragrance/checkout.webp';
import fSystem from '@/assets/fragrance/system.webp';
import fProtoPoster from '@/assets/fragrance/prototype.webp';
import fFlowVideo from '@/assets/fragrance/flow.mp4';
import fProductVideo from '@/assets/fragrance/product.mp4';
import fCheckoutVideo from '@/assets/fragrance/checkout.mp4';
import fProtoVideo from '@/assets/fragrance/prototype.mp4';

import wCover from '@/assets/wellness/cover.webp';
import wCard from '@/assets/wellness/card.webp';
import wFlow from '@/assets/wellness/flow.webp';
import wCheckin from '@/assets/wellness/checkin.webp';
import wSteps from '@/assets/wellness/steps.webp';
import wSystem from '@/assets/wellness/system.webp';
import wProtoPoster from '@/assets/wellness/prototype.webp';
import wFlowVideo from '@/assets/wellness/flow.mp4';
import wCheckinVideo from '@/assets/wellness/checkin.mp4';
import wStepsVideo from '@/assets/wellness/steps.mp4';
import wProtoVideo from '@/assets/wellness/prototype.mp4';

export interface BuiltInCaseStudy {
  slug: string;
  title: string;          // page heading
  lead: string;           // line under the heading (saved as the subtitle)
  excerpt: string;        // one line on the Projects card
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  card: string;           // Projects card image (saved as the cover image)
  cardAlt: string;
  body: CaseStudyBody;
}

/* ───────────────────────── This portfolio ───────────────────────── */
// Measured on the real site at 1440px wide: footer 863px -> 199px (77% less; it now carries the
// game scenery) · Hire page 5,615px -> 4,360px (22% shorter) · Hire sections 8 -> 6 · 11 languages.
const portfolioFrames = [
  { src: pCover, alt: 'This portfolio: the Home page on desktop and the Hire page on a phone', label: 'Cover' },
  { src: pHome, alt: 'Home page before and after the redesign', label: 'Home: before and after' },
  { src: pHire, alt: 'Hire page before and after the redesign', label: 'Hire: before and after' },
  { src: pSystem, alt: 'Projects and About pages sharing the same opening and type scale', label: 'One system across pages' },
  { src: pFooter, video: pFooterVideo, alt: 'Footer before (863px tall) and after (199px tall), with the game scenery changing behind it in dark and light mode', label: 'The footer: 863px to 199px' },
  { src: pThemes, alt: 'Home page in light mode and dark mode', label: 'Light by day, dark by night' },
  { src: pPhones, video: pPhonesVideo, alt: 'Home, Projects and About pages scrolling on a phone, in light mode', label: 'On a phone' },
  { src: pAdmin, alt: 'The admin: the overview, and the articles list with an on/off switch on each (email blurred)', label: 'The studio: my own admin' },
];

export const PORTFOLIO_CASE_STUDY: BuiltInCaseStudy = {
  slug: 'portfolio',
  title: 'This portfolio',
  lead: "A designer's site has two jobs: show the work fast and prove I can ship. So I designed this one, then built it.",
  excerpt: "The site you're on: one idea, one design system, every section earning its place",
  tags: ['Product Design', 'Design System', 'React', 'Supabase'],
  seoTitle: 'This Portfolio — Designed and Built by Qomardeen Tijani',
  seoDescription: 'How I redesigned and built my portfolio: one idea, one design system, and every section earning its place. Before-and-after, measured.',
  card: pCard,
  cardAlt: 'This portfolio: the Home page on desktop and the Hire page on a phone',
  body: {
    kind: 'full',
    badge: 'Designed & built',
    cardTitle: 'This Portfolio — Designed & Built',
    cardNote: 'Designer-who-builds positioning, one type scale across pages, measured cuts (77% smaller footer)',
    role: 'Designer & builder (solo)',
    platform: 'Responsive web, 11 languages',
    timeline: '2025, ongoing',
    facts: [
      { labelKey: 'role', label: 'Role', value: 'Designer & builder (solo)' },
      { labelKey: 'platform', label: 'Platform', value: 'Responsive web, 11 languages' },
      { label: 'Built with', value: 'Lovable, then Claude (React, Supabase)' },
      { labelKey: 'timeline', label: 'Timeline', value: '2025, ongoing' },
    ],
    sections: [
      {
        subtitle: 'The problem',
        title: 'A portfolio that said a lot and showed little',
        description:
          'The first version called me a designer "at the intersection of UX, AI and systems thinking". True, but it proved nothing. Pages repeated each other, and each had its own layout.',
        image: pHome,
        imageAlt: 'Home page before and after the redesign',
      },
      {
        subtitle: 'Positioning',
        title: 'One idea: a designer who builds',
        description:
          'Everything hangs on one line: "I design products. Then I build them." The Home portrait splits into designer and builder, and your pointer slides the seam. One type scale and one left edge run through every page.',
        image: pHero,
        imageAlt: 'The split-portrait Home hero: designer on one side, builder on the other',
      },
      {
        subtitle: 'Iteration',
        title: 'Every section had to earn its place',
        description:
          'I cut anything a visitor would read twice. The footer lost 77% of its height but kept every link, Contact moved into Hire, and Hire went from 8 sections to 6.',
        image: pFooter,
        video: pFooterVideo,
        imageAlt: 'Footer before and after, with the game scenery changing behind it',
        metrics: [
          { label: 'Smaller footer', value: '77%' },
          { label: 'Hire sections', value: '8 → 6' },
        ],
      },
    ],
    gallery: portfolioFrames,
    framesBlurb: 'Every screen, before and after, taken from the real site.',
    blocks: [
      {
        type: 'stats', tone: 'muted',
        title: 'Results so far',
        intro: 'Measured on the live site, before and after.',
        items: [
          { value: 77, suffix: '%', label: 'less footer height, with the same links' },
          { value: 22, suffix: '%', label: 'shorter Hire page, with one clear next step' },
          { value: 11, suffix: '', label: 'languages, including Yoruba, Hausa, Igbo and Pidgin' },
          { value: 1, suffix: '', label: 'editor for every piece of content in the admin' },
        ],
      },
      {
        type: 'list', numbered: true, asideLabel: 'Trade-off',
        title: 'Key decisions',
        intro: 'What I chose, why, and what it cost.',
        items: [
          {
            title: 'A split portrait instead of a photo and a job title',
            body: 'Photo, name and "Product Designer" looked like every other portfolio. A split image says "designer who builds" before anyone reads a word.',
            aside: 'More motion to get right: a tap toggle on phones and a still version for reduced motion.',
          },
          {
            title: 'An honest 80/20 instead of "full-stack"',
            body: 'I design far more than I code, so About says exactly that. I removed a "React and TypeScript" line I could not back up.',
            aside: 'A smaller claim, but one that survives an interview.',
          },
          {
            title: 'Contact merged into Hire',
            body: 'Two pages did one job. Every Contact link now lands on the form at the bottom of Hire, and old links still work.',
            aside: 'A longer page, so I cut two repeated sections. It still ended up 22% shorter.',
          },
          {
            title: 'My own admin, with an on/off switch on everything',
            body: 'Case studies, articles, my CV and photos live in my admin, so a typo costs no code or credits. Anything can be switched off while I rework it.',
            aside: 'More to build up front: roles, an editor, uploads, two-step sign-in and security rules.',
          },
          {
            title: 'Eleven languages, including Yoruba, Hausa, Igbo and Pidgin',
            body: "Speaking a visitor's language is a small signal that I think about who is on the other side of the screen.",
            aside: 'Every copy change is eleven changes.',
          },
        ],
      },
      {
        type: 'feature',
        title: 'The studio behind the site',
        intro: 'A portfolio goes stale when changing it is hard, so the site has its own admin.',
        items: [
          { title: 'Change it in minutes', body: 'A typo, a new CV or a case study is a form to fill in, not a code change.' },
          { title: "Switch off, don't delete", body: 'Hide anything while I rework it. Visitors never see a half-finished page.' },
          { title: 'Locked down', body: 'Only my account can publish, and signing in needs an authenticator code.' },
        ],
        image: pAdminOverview,
        imageAlt: 'The admin overview: published, draft and scheduled counts, shortcuts to create content, and recent activity (email blurred)',
        zoomImage: pAdmin,
        caption: 'The overview, email blurred. Tap to see the on/off switches.',
      },
      {
        type: 'steps', tone: 'muted',
        title: 'How I built it: Lovable, then Claude',
        intro: 'Started in Lovable, grown with Claude: I make the design calls, Claude does most of the building and checking.',
        items: [
          { title: 'Built in Lovable', body: 'The first pages, the database and the AI assistant. It got me live fast.' },
          { title: 'Moved to Claude', body: 'When my credits ran out, I gave Claude my code on GitHub and describe changes in plain words and screenshots.' },
          { title: 'Checked before I see it', body: 'Every change is built and checked in a real browser at four widths, light and dark.' },
          { title: 'I review and ship', body: 'I review each update, push it to GitHub, then publish from Lovable.' },
        ],
        columns: [
          {
            title: 'What I did',
            items: [
              'Set the direction and the honest 80/20',
              'Chose the hero and the type, spacing and colour rules',
              'Spotted problems in use and decided what to cut',
            ],
          },
          {
            title: 'What Claude did',
            items: [
              'Wrote most of the code, from the footer to the on/off switches',
              'Translated copy into 11 languages and fixed security issues',
              'Tested every change at 1440, 768, 375 and 320px',
            ],
          },
        ],
      },
      {
        type: 'bullets', placement: 'afterFrames',
        title: "What's next",
        items: [
          'Measure which case studies recruiters open, and where they leave.',
          'Add testimonials from real collaborators.',
          'Grow the building side past 20%.',
        ],
      },
    ],
    next: { title: 'UpTime CMMS', route: '/projects/uptime', blurb: 'Asset management with complex maintenance workflows and dashboards.' },
  },
};

/* ───────────────────────── Leafie ───────────────────────── */
// "Leafie" is a working name; the page address stays /projects/fragrance.
const LEAFIE_PROTOTYPE = 'https://www.figma.com/proto/ajsn9pYWQaKwRDl1MOQRO9?node-id=52-753&starting-point-node-id=52%3A753';
const leafieFrames = [
  { src: fCover, alt: 'Leafie, a fragrance shopping app: the product, home and checkout screens', label: 'Cover' },
  { src: fFlow, video: fFlowVideo, alt: 'The four screens in order, each scrolling: browse, choose, check out, paid', label: 'Four screens to a paid order' },
  { src: fProduct, video: fProductVideo, alt: 'Product page scrolling while a scent and a size are chosen, next to the chip states', label: 'Pick a scent and a size' },
  { src: fCheckout, video: fCheckoutVideo, alt: 'Checkout scrolling down to the full total, next to the payment success screen', label: 'Everything on one page' },
  { src: fSystem, alt: 'Colours, type and the tab bar states', label: 'A small system' },
];

export const LEAFIE_CASE_STUDY: BuiltInCaseStudy = {
  slug: 'fragrance',
  title: 'Leafie',
  lead: 'A fragrance shopping app: four screens from browsing scents to a paid order.',
  excerpt: 'Four screens from browsing scents to a paid order',
  tags: ['Mobile', 'E-commerce', 'Figma'],
  seoTitle: 'Leafie — Fragrance Shopping App by Qomardeen Tijani',
  seoDescription: 'Leafie: a four-screen mobile shopping flow for a fragrance store, designed in Figma. Browse, choose, check out, paid.',
  card: fCard,
  cardAlt: 'Leafie, a fragrance shopping app',
  body: {
    kind: 'other',
    badge: 'Mobile app',
    cardTitle: 'Leafie — Fragrance Shopping App',
    cardNote: 'One job per screen, one selected look, every cost shown before paying',
    role: 'Product Designer (UI)',
    scope: 'Shopping flow, 4 screens',
    platform: 'Mobile app (iOS)',
    facts: [
      { labelKey: 'role', label: 'Role', value: 'Product Designer (UI)' },
      { labelKey: 'scope', label: 'Scope', value: 'Shopping flow, 4 screens' },
      { labelKey: 'platform', label: 'Platform', value: 'Mobile app (iOS)' },
      { label: 'Tools', value: 'Figma' },
    ],
    behanceUrl: LEAFIE_PROTOTYPE,
    liveLabel: 'Try the prototype',
    sections: [
      {
        subtitle: 'The brief',
        title: 'From browsing to paid in four screens',
        description: 'A small shopping flow for a fragrance store: find a scent, choose it, pay. Each screen has one job, so nobody wonders what to do next.',
        image: fFlow, video: fFlowVideo, imageAlt: leafieFrames[1].alt,
      },
      {
        subtitle: 'Choosing',
        title: 'The bottle first, the choices second',
        description: 'The photo fills the top half. Scent and size are plain chips with one selected look, and Add To Cart sits within thumb reach.',
        image: fProduct, video: fProductVideo, imageAlt: leafieFrames[2].alt,
      },
      {
        subtitle: 'Paying',
        title: 'No surprises at checkout',
        description: 'Items, address, payment and shipping sit on one page, with tax and shipping shown before the total. After paying, Track Order answers "what now?".',
        image: fCheckout, video: fCheckoutVideo, imageAlt: leafieFrames[3].alt,
      },
    ],
    prototype: {
      title: 'The prototype, tap by tap',
      description: 'Every link in the Figma prototype, in order. Back arrows stay fixed while pages scroll. Buttons that aren\'t linked yet are tapped too, so you can see where the prototype stops.',
      url: LEAFIE_PROTOTYPE,
      buttonLabel: 'Try it yourself in Figma',
      video: fProtoVideo,
      poster: fProtoPoster,
    },
    gallery: leafieFrames,
    framesBlurb: 'Every screen, straight from the Figma file. Tap one to see it full screen.',
    next: { title: 'WalPay', route: '/projects/walpay', blurb: 'A larger mobile project: a digital wallet with trust-building flows.' },
  },
};

/* ───────────────────────── Unwind ───────────────────────── */
// Made in Figma for an AltSchool Africa product design assignment (third semester, month 2, week 1).
// "Unwind" is a working name; the page address stays /projects/wellness.
const UNWIND_PROTOTYPE = 'https://www.figma.com/proto/xFT0ynq0VdlT2DLoQJFJIh?node-id=36-509&starting-point-node-id=36%3A509';
const unwindFrames = [
  { src: wCover, alt: 'Unwind, a mood and mindfulness app: the Home screen inside breathing rings, the five moods around it, with the progress and achievement cards floating free', label: 'Cover' },
  { src: wFlow, video: wFlowVideo, alt: 'The four screens in order: check in, pick a session, follow the steps, done', label: 'From check-in to done' },
  { src: wCheckin, video: wCheckinVideo, alt: 'Home screen picking a mood, adding a note and logging it, next to the mood and note field states', label: 'How are you feeling?' },
  { src: wSteps, video: wStepsVideo, alt: 'Exercise steps ticking off one by one, next to the session complete screen', label: 'One step at a time' },
  { src: wSystem, alt: 'Colours, Quicksand type, the tab bar states and the mood picker', label: 'A calm little system' },
];

export const UNWIND_CASE_STUDY: BuiltInCaseStudy = {
  slug: 'wellness',
  title: 'Unwind',
  lead: 'A mood and mindfulness app: check in, get a session that fits, and follow it step by step.',
  excerpt: 'Four screens from a mood check-in to a finished session',
  tags: ['Mobile', 'Wellness', 'Figma'],
  seoTitle: 'Unwind — Mood & Mindfulness App by Qomardeen Tijani',
  seoDescription: 'Unwind: a four-screen mood and mindfulness app designed in Figma. Check in, pick a session, follow the steps, done.',
  card: wCard,
  cardAlt: 'Unwind, a mood and mindfulness app',
  body: {
    kind: 'other',
    badge: 'Mobile app',
    cardTitle: 'Unwind — Mood & Mindfulness App',
    cardNote: 'A mood in one tap, steps that open in order, a clear ending',
    role: 'Product Designer (UI)',
    scope: 'Check-in to session, 4 screens',
    platform: 'Mobile app (iOS)',
    facts: [
      { labelKey: 'role', label: 'Role', value: 'Product Designer (UI)' },
      { labelKey: 'scope', label: 'Scope', value: 'Check-in to session, 4 screens' },
      { labelKey: 'platform', label: 'Platform', value: 'Mobile app (iOS)' },
      { label: 'Tools', value: 'Figma' },
      { label: 'Made for', value: 'AltSchool Africa assignment' },
    ],
    behanceUrl: UNWIND_PROTOTYPE,
    liveLabel: 'Try the prototype',
    sections: [
      {
        subtitle: 'The brief',
        title: 'From a check-in to a finished session',
        description: 'An AltSchool assignment: a small wellness app that asks how you feel, suggests a session and walks you through it. Four screens, one job each.',
        image: wFlow, video: wFlowVideo, imageAlt: unwindFrames[1].alt,
      },
      {
        subtitle: 'Checking in',
        title: 'A mood in one tap',
        description: 'Five moods with one selected look: a blue ring and a bolder label. The note is optional, and Log Mood leads straight to a workout.',
        image: wCheckin, video: wCheckinVideo, imageAlt: unwindFrames[2].alt,
      },
      {
        subtitle: 'The session',
        title: 'Steps that open in order',
        description: 'Only the current step is open, with a tip under it. Done steps turn green, later ones stay locked, and a bar shows progress.',
        image: wSteps, video: wStepsVideo, imageAlt: unwindFrames[3].alt,
      },
    ],
    prototype: {
      title: 'The prototype, tap by tap',
      description: 'Every link in the Figma prototype, in order, and only linked parts are tapped. The motion is my proposal for the real app: springy moods, buttons that press in, a filling progress bar and breathing illustrations.',
      url: UNWIND_PROTOTYPE,
      buttonLabel: 'Try it yourself in Figma',
      video: wProtoVideo,
      poster: wProtoPoster,
    },
    gallery: unwindFrames,
    framesBlurb: 'Every screen, straight from the Figma file. Tap one to see it full screen.',
    next: { title: 'Leafie', route: '/projects/fragrance', blurb: 'Another short mobile flow: a fragrance shopping app, from browsing to a paid order.' },
  },
};

export const BUILT_IN_CASE_STUDIES = [PORTFOLIO_CASE_STUDY, LEAFIE_CASE_STUDY, UNWIND_CASE_STUDY];
