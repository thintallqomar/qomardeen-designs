import type { ArticleTranslations } from '../useLocalizedArticle';

const t = (title: string, excerpt: string, content: string) => ({ title, excerpt, content });

const translations: ArticleTranslations = {
  "building-scalable-design-systems": t("How to build design system wey fit grow", "How design systems dey help teams scale products well well while keeping usability and visual consistency.", `
## Why design systems matter for scale

Design system na more than component library. Na shared language between design and engineering wey dey help teams build consistent experiences fast fast.

### 1. Design Tokens
### 2. Component Architecture
### 3. Variant Strategy

Teams wey I don work with dey typically see **40-60% reduction** for design-to-development time after the first year.
  `),
  "designing-ai-native-products": t("How to design AI-native products", "Principles for designing products where AI na the main power, no be add-on.", `
## AI-Native vs. AI-Enhanced

### 1. Design for wahala (uncertainty)
### 2. Progressive autonomy
### 3. Transparent reasoning
### 4. Graceful degradation

The hardest part of AI product design no be the technology — na managing user expectations.
  `),
  "ai-assisted-design-workflows": t("Design workflows wey AI dey help", "How AI fit speed up research, thinking, and iteration for modern product design.", `
## AI no go replace designers — but e go replace the slow ones

## Phase 1: Research acceleration
## Phase 2: Ideation boost
## Phase 3: Design system maintenance
  `),
  "dashboard-design-clarity-over-complexity": t("Dashboard design: clarity pass complexity", "Principles for designing dashboards with plenty data wey help users understand complex information quick.", `
## The dashboard paradox

Dashboards suppose simplify complexity. Instead, most of them *add* complexity by showing everything at once.

## The intent-based framework

1. **"Everything dey okay?"**
2. **"Wetin happen?"**
3. **"Wetin I suppose do?"**
  `),
  "designing-trust-fintech-interfaces": t("How to design trust for fintech interfaces", "Key UX patterns wey build trust when users dey move money through digital platforms.", `
## Trust na the product

For fintech, the interface *na* the trust signal.

### 1-5. The five trust signals
  `),
  "systems-thinking-product-design": t("Why systems thinking matter for product design", "How thinking beyond individual screens dey enable scalable and consistent product experiences.", `
## The problem with screen-level thinking

> "Wetin be the underlying rules wey govern how every screen suppose behave?"
  `),
  "from-fashion-to-product-design": t("From fashion to product design", "How my background for fashion design shape the way I build digital products.", `
## An unlikely origin story

I no start for tech. My first design language na fabric, no be Figma. That one no be weakness. Na superpower.
  `),
  "mobile-banking-onboarding-ux": t("UX breakdown: Mobile banking onboarding", "How the best fintech apps dey reduce friction for first-time user flows.", `
## The first 60 seconds

## Pattern 1-4
The best onboarding no dey feel like onboarding.
  `),
  "notion-design-system-teardown": t("Product teardown: Notion design system", "How Notion dey balance flexibility and consistency for one complex product.", `
## The flexibility paradox

## The Block primitive

## Lessons for designers
  `),
  "ai-beyond-chatbots": t("AI for product design: beyond chatbots", "How AI dey reshape design workflows, research, and user experience.", `
## The chatbot trap
## 1. Smart defaults
## 2. Adaptive interfaces
## 3. Generative content
  `),
  "systems-thinking-for-designers": t("Systems thinking for designers", "Why understanding the whole system dey lead to better component-level decisions.", `
## Components no dey exist alone

## The three levels of design
### Level 1: Component design
### Level 2: Pattern design
### Level 3: System design
  `),
};

export default translations;
