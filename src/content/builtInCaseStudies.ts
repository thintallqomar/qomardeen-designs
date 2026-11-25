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
  lead: "A product designer's site has two jobs: show the work quickly, and prove I can ship it. So I designed this one, then built it myself.",
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
          'The first version called me a designer "at the intersection of UX, AI and systems thinking", which is true but proved nothing. Hire, Contact and the footer repeated each other, and every page had its own layout. A recruiter had to work to find the point.',
        image: pHome,
        imageAlt: 'Home page before and after the redesign',
      },
      {
        subtitle: 'Positioning',
        title: 'One idea: a designer who builds',
        description:
          'Everything hangs on one line: "I design products. Then I build them." The Home portrait splits into the designer and a code-made version; your pointer slides the seam. About keeps it honest with an 80/20 split. Every page then follows the same rules: one type scale, one left edge, and only what you point at gets a fill.',
        image: pHero,
        imageAlt: 'The split-portrait Home hero: designer on one side, builder on the other',
      },
      {
        subtitle: 'Iteration',
        title: 'Every section had to earn its place',
        description:
          'I cut anything a visitor would read twice. The footer kept every link but lost 77% of its height (and gained faded scenes from the games I play), Contact moved into Hire, and Hire dropped from 8 sections to 6 with one "Book a call".',
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
        intro: 'Measured on the site itself, before and after, at the same screen width.',
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
            body: 'My first hero looked like every other portfolio: photo, name, "Product Designer". I studied portfolios I admired (Adham Dannaway\'s designer/coder split was the strongest) and chose an image that says "designer who builds" before anyone reads a word.',
            aside: 'More motion and more to get right. It needs a tap toggle on phones (there is no mouse), and a still version for people who turn motion off.',
          },
          {
            title: 'An honest 80/20 instead of "full-stack"',
            body: 'Recruiters probe claims. I design far more than I code, so the About page says exactly that, and I removed a "React and TypeScript" line because I am not learning those yet.',
            aside: 'A smaller claim. I would rather undersell than be caught out in an interview.',
          },
          {
            title: 'Contact merged into Hire',
            body: 'Two pages did the same job, so visitors had to guess which one to use. Now every "Contact" link lands on the form at the bottom of Hire, and old /contact links still work.',
            aside: 'A longer Hire page, so I cut two sections that repeated others, and the page still ended up 22% shorter.',
          },
          {
            title: 'One way to open every page',
            body: 'A lowercase word and a dot ("projects.", "about.") plus one type scale means visitors learn the layout once and then just read.',
            aside: 'Less room for each page to have its own personality. The case studies and the Home hero carry that instead.',
          },
          {
            title: 'Only one highlighted thing at a time',
            body: 'Moving between the Projects tabs, I noticed the unselected tabs had their own fills fighting the sliding highlight. Now only the thing you point at gets a fill, in tabs and in menus.',
            aside: 'The current page is shown by colour rather than a filled box, so the colour contrast has to stay strong in both themes.',
          },
          {
            title: 'Everything editable from my own admin, with an on/off switch',
            body: 'I should not need code, or credits, to fix a typo or swap a project. Case studies, articles, my CV and hero photos all live in the admin, and anything can be switched off while I rework it.',
            aside: 'More to build up front: roles, an editor, image uploads, two-step sign-in and security rules so visitors only ever see what is switched on.',
          },
          {
            title: 'Eleven languages, including Yoruba, Hausa, Igbo and Pidgin',
            body: 'I am a Nigerian designer applying locally and abroad. Speaking a visitor\'s language, at home or overseas, is a small signal that I think about who is on the other side of the screen.',
            aside: 'Every copy change is eleven changes. Case study text stays in English for now.',
          },
        ],
      },
      {
        type: 'feature',
        title: 'The studio behind the site',
        intro: 'A portfolio goes stale when changing it is hard, so the site has its own admin. Case studies, articles, the About page, hero photos, my CV, messages from visitors and Atlas\'s memory are all edited there, without code.',
        items: [
          { title: 'Change it in minutes', body: 'A typo, a new CV or a new case study is a form to fill in, not a code change. Content no longer costs me Lovable credits or a developer.' },
          { title: 'Switch off instead of delete', body: 'Anything can be hidden while I rework it, then switched back on exactly as it was. Visitors never see a half-finished page.' },
          { title: 'Locked down', body: 'Only my account can publish, and visitors only ever see what is switched on. Signing in needs a code from an authenticator app as well as the password.' },
        ],
        image: pAdminOverview,
        imageAlt: 'The admin overview: published, draft and scheduled counts, shortcuts to create content, and recent activity (email blurred)',
        zoomImage: pAdmin,
        caption: 'The overview. Tap to see it next to the on/off switches. My email is blurred.',
      },
      {
        type: 'steps', tone: 'muted',
        title: 'How I built it: Lovable, then Claude',
        intro: 'The site started in Lovable. Most of what you see now came from working with Claude: I made the design calls, and Claude did most of the building and checking.',
        items: [
          { title: 'Built in Lovable', body: 'I started the site in Lovable: the first pages, the Supabase database and the AI assistant. It got me live quickly.' },
          { title: 'Moved to Claude', body: 'When my Lovable credits ran out, I gave Claude my site\'s code from GitHub. I describe what I want in plain words, often with screenshots, and Claude reads the code and makes the change.' },
          { title: 'Checked before I see it', body: 'Claude builds every change and checks it in a real browser at four screen widths, in light and dark mode, measuring things like footer height instead of eyeballing them.' },
          { title: 'I review and ship', body: 'Every update comes back as one package with a plain-English list of what changed. I review it, upload it to GitHub, then publish it from Lovable.' },
        ],
        columns: [
          {
            title: 'What I did',
            items: [
              'Set the direction: "designer who builds", and honest about the 80/20',
              'Chose the hero style and the type, spacing and colour rules',
              'Spotted problems in use: clashing tab fills, white edges on my photo, "Book a call" twice, a footer that was too big',
              'Decided what to cut, and reviewed every update before it went live',
            ],
          },
          {
            title: 'What Claude did',
            items: [
              'Wrote most of the code changes, from the footer to the on/off switches',
              'Translated new copy into all 11 languages',
              'Audited and fixed security issues, and added two-step sign-in to the admin',
              'Tested every change at 1440, 768, 375 and 320px, in both themes',
            ],
          },
        ],
      },
      {
        type: 'bullets', placement: 'afterFrames',
        title: "What's next",
        items: [
          'Measure it: see which case studies recruiters open and where they leave.',
          'Add testimonials from real collaborators as projects wrap up.',
          'Grow the building side past 20%, one shipped feature at a time.',
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
        description: 'Leafie is a small shopping flow for a fragrance store: find a scent, choose it, pay. I gave each screen one job, so nobody has to wonder what to do next.',
        image: fFlow, video: fFlowVideo, imageAlt: leafieFrames[1].alt,
      },
      {
        subtitle: 'Choosing',
        title: 'The bottle first, the choices second',
        description: 'The product photo fills the top half. Price and rating sit beside the name, scent and size are plain chips with one selected look (a gold outline), and Add To Cart stays at the bottom within thumb reach.',
        image: fProduct, video: fProductVideo, imageAlt: leafieFrames[2].alt,
      },
      {
        subtitle: 'Paying',
        title: 'No surprises at checkout',
        description: 'Items, quantities, address, payment and shipping all sit on one page, and tax and shipping are listed before the total. After paying, the order summary and a Track Order button answer "what now?".',
        image: fCheckout, video: fCheckoutVideo, imageAlt: leafieFrames[3].alt,
      },
    ],
    prototype: {
      title: 'The prototype, tap by tap',
      description: 'Every link in the Figma prototype, in order: the sideways banner, brand and product rows, the brand filters, the tab bar, the cart, a product, scent and size, quantities, payment, and back home. Back arrows stay fixed while the page scrolls and return to the screen you came from. Buttons that aren\'t linked yet are tapped too, so you can see where the prototype stops.',
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
        description: 'An AltSchool assignment: a small wellness app. Unwind asks how you feel, suggests a session, walks you through it and tells you when you are done. Four screens, each with one main job.',
        image: wFlow, video: wFlowVideo, imageAlt: unwindFrames[1].alt,
      },
      {
        subtitle: 'Checking in',
        title: 'A mood in one tap',
        description: 'Five faces, from Sad to Ecstatic, with one selected look: a blue ring and a bolder label. The note is optional, and Log Mood answers with a short card that leads to a workout.',
        image: wCheckin, video: wCheckinVideo, imageAlt: unwindFrames[2].alt,
      },
      {
        subtitle: 'The session',
        title: 'Steps that open in order',
        description: 'Only the current step is open, with a tip under it. Done steps turn green, later ones stay locked, and a bar shows how far along you are. The last screen sums up the session and the achievement it unlocked.',
        image: wSteps, video: wStepsVideo, imageAlt: unwindFrames[3].alt,
      },
    ],
    prototype: {
      title: 'The prototype, tap by tap',
      description: 'Every link in the Figma prototype, in order: the five moods, the note field, Log Mood and its card, the tab bar, Start Exercise, each Next Step, Finish and back home. Only linked parts are tapped. The motion is how I\'d want the real app to feel: the chosen mood springs up and draws its ring, buttons press in, the progress bar fills, and the illustrations breathe instead of sitting still.',
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
