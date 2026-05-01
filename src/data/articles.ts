import profileImg from '@/assets/new-profile.jpg';
import imgDesignSystems from '@/assets/blog/design-systems.jpg';
import imgAiNative from '@/assets/blog/ai-native-products.jpg';
import imgAiWorkflows from '@/assets/blog/ai-workflows.jpg';
import imgDashboard from '@/assets/blog/dashboard-design.jpg';
import imgFintech from '@/assets/blog/fintech-trust.jpg';
import imgSystems from '@/assets/blog/systems-thinking.jpg';
import imgFashion from '@/assets/blog/fashion-to-design.jpg';
import imgMobileBanking from '@/assets/blog/mobile-banking-ux.jpg';
import imgNotionTeardown from '@/assets/blog/notion-teardown.jpg';
import imgAiBeyondChatbots from '@/assets/blog/ai-beyond-chatbots.jpg';
import imgSystemsDesigners from '@/assets/blog/systems-thinking-designers.jpg';
import imgDesignerWhoShips from '@/assets/blog/designer-who-ships.jpg';

export type BlogCategory =
  | 'Product Design'
  | 'UX Design'
  | 'Design Process'
  | 'Design Systems'
  | 'AI & Product Design'
  | 'Career & Design';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  category: BlogCategory;
  tags: string[];
  publishDate: string;
  lastUpdated?: string;
  heroImage?: string;
  /** Descriptive alt text for the hero image (SEO + accessibility). */
  heroImageAlt?: string;
  /** Absolute or imported image used for Open Graph / Twitter social previews. Falls back to heroImage. */
  socialImage?: string;
  author: {
    name: string;
    avatar: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  section: 'blog' | 'thinking';
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Product Design',
  'UX Design',
  'Design Process',
  'Design Systems',
  'AI & Product Design',
  'Career & Design',
];

const author = {
  name: 'Qomardeen Tijani',
  avatar: profileImg,
};

export const blogPosts: BlogPost[] = [
  {
    slug: "the-designer-who-ships",
    title: "The Designer Who Ships",
    excerpt: "AI is rewriting the job description. Here's what nobody is saying out loud about design, judgment, and the new workflow.",
    readTime: "9 min",
    category: "AI & Product Design",
    tags: ["ai", "design career", "workflow", "product design"],
    publishDate: "2026-05-01",
    author,
    section: "blog",
    heroImage: imgDesignerWhoShips,
    heroImageAlt: "Designer at a glowing workstation shipping product UI from design to live code, symbolizing AI-accelerated product design",
    socialImage: imgDesignerWhoShips,
    seo: {
      metaTitle: "The Designer Who Ships | Qomardeen Tijani",
      metaDescription: "AI is rewriting the design job description. How designers stay valuable by closing the loop, learning the fundamentals, and shipping with judgment.",
    },
    content: `
AI is rewriting the job description. Here's what nobody is saying out loud.

Let me ask you something honest: when was the last time you felt completely certain about where your design career was headed?

If the answer isn't "recently," you're not alone — and you're probably paying attention.

Something is shifting in product teams right now, and it's moving faster than most design communities are willing to talk about. AI agents aren't coming. They're already embedded in codebases, already generating UI components, already writing the pull requests that used to require a full sprint. The question isn't whether this changes design work. It's whether you're going to be the person who shapes that change or the one it happens to.

## The old handoff is dead

For years, the designer's job ended at the handoff. You crafted the screens, annotated the components, handed it off to engineering, and then waited — and chased — and revised — and waited again. The gap between "designed" and "shipped" was where good ideas went to get complicated.

That gap is collapsing.

With AI-assisted development tools — Cursor, Copilot, v0, Lovable, and their inevitable successors — a developer (or honestly, a motivated non-developer) can take a design spec and have something running in the browser within hours. Sometimes within minutes. The pipeline has compressed so aggressively that the old roles built around that pipeline are being renegotiated in real time.

This isn't a threat dressed up as opportunity. It genuinely is both.

## What "design" actually means now

Here's the uncomfortable truth the industry is circling around without quite landing on: design was always partly an engineering problem. The best designers have always understood constraints — not just visual ones, but systemic ones. What can the component actually do? How does this state behave when the data is empty? What happens on a 360px screen with a flaky connection?

AI doesn't change that truth. It accelerates it. It means the distance between a design decision and its real-world consequence is shrinking to almost nothing — and that's actually a gift, if you know how to use it.

The designer who survives this era — no, who thrives in it — is the one who closes the loop themselves. Who can prototype in code, not just in Figma. Who understands how an LLM-generated component will behave before it hits a browser. Who treats AI tools not as shortcuts but as collaborators with strong opinions that need directing.

Think of it like this: AI is an extremely fast intern who will build exactly what you describe, has no taste of its own, and will confidently ship something broken if you don't review it. The designer's job isn't gone. It's become editorial.

## The classroom problem nobody wants to name

I'm a student at AltSchool, and something I've been watching play out in real time deserves to be said plainly.

In class discussions, a pattern keeps emerging: some of my classmates would rather talk about automation, AI agents, and the latest tools than sit with the actual design fundamentals — the thinking, the principles, the why behind every decision. It sounds exciting on the surface. Agents! Workflows! The future! But when it came to actually breaking down a supposedly simple design task — understanding user flow, establishing hierarchy, building a layout with intention — a lot of us hit a wall. Not because the task was hard, but because we'd been paying more attention to the noise than to the thinking that underpins the work.

And here's what that exposed: you can't prompt your way out of not knowing what good design looks like. AI doesn't know what your user is feeling at 11pm when they're trying to make a payment and something goes wrong. It doesn't know when a pattern feels right versus when it's technically correct but emotionally off. That judgment is yours — and you only develop it by doing the reps, studying the fundamentals, and learning to see before you learn to ship fast.

The irony is that AltSchool is actually one of the places trying to address this directly. Alongside design, we've been introduced to the basics of development — HTML, CSS, and JavaScript. Not to turn us into developers, but to give us a meaningful vocabulary for the engineering side of what we build. Think of it this way: HTML is the skeleton of a webpage, CSS is the look — the skin, the style, the colour — and JavaScript is the brain, the part that makes things respond and behave. Once you understand those three layers, you stop designing in a vacuum. You start understanding what your decisions actually cost, what they produce, and what the developer on the other side of the handoff is dealing with. That awareness alone makes you a better designer.

## Entry-level design jobs: the honest picture

This is the part that deserves some real talk, especially if you're early in your career or mentoring someone who is.

The traditional entry-level design role — the one where you refine existing UI, handle small feature work, and gradually develop your systems thinking — is under real pressure. Not because AI is replacing designers, but because junior work often meant doing the executable parts of design: making the screens match the spec, building out component variations, producing assets. A lot of that work can now be scaffolded by AI in a fraction of the time.

What this doesn't change is judgment. Pattern recognition. Knowing why a layout works, not just that it does. Understanding the user's mental model well enough to catch what the AI missed. That still requires a human who has done the reps.

So the advice I'd give to anyone early in their design journey right now: don't skip the fundamentals in a rush to learn the tools. Learn the fundamentals through the tools. Use AI to build faster so you can learn more in less time — not to bypass the learning itself.

And if you're in a learning environment like AltSchool where you're exposed to both design and development thinking? Lean into that fully. That combination is genuinely rare, and the industry is only going to value it more.

## The workflow shift nobody is teaching

Most design education is still built around the double diamond. Discover, define, develop, deliver. It's a good model. It was built for a world with longer timelines.

The new workflow looks more like a loop: think → prototype → test → ship → observe → repeat. And "prototype" no longer means a click-through in Figma — it can mean a functioning component in a real codebase, deployed to a URL, shareable in 20 minutes.

This changes what you need to know. Not everything. Not all at once. But you need to be comfortable enough with the engineering side of the product to participate in that loop meaningfully. You don't need to be a full-stack developer. You need to be able to:

- Read a component and understand what it does
- Prompt an AI tool well enough to get something usable on the first pass
- Review AI-generated code with a critical eye, the same way you'd review a design from a junior
- Understand the basics of how your design decisions translate to what gets built

That's a learnable skill set. It's not a second degree.

## How to adapt without drowning

The trap most people fall into is trying to learn everything at once. One week it's v0, next week it's Claude artifacts, then it's MCP servers and AI agents and model context windows — and suddenly you're spending more time keeping up with the discourse than actually shipping anything.

Here's a more sustainable frame: pick one workflow, get good at it, ship something real with it.

You're reading this post on a website I built with AI. I want to be transparent about that — not because it's a flex, but because it's proof of a point. I didn't build this site by pretending AI doesn't exist or by handing off a vague idea and hoping for the best. I built it by bringing real design knowledge to the process — understanding layout, hierarchy, component behaviour, user flow — and using AI to execute at a speed I couldn't have managed alone. The AI handled the velocity. I handled the judgment. That's the actual collaboration.

That only works if you have the design knowledge to bring. If you skip the fundamentals and jump straight to "build it with AI," what you get is a site that looks fine until someone actually uses it.

The goal isn't to master every AI tool. The goal is to develop an instinct for when AI accelerates your work and when it creates technical debt you'll pay for later. That instinct is what makes a designer genuinely valuable in a team that's moving fast.

## A way forward (in plain English)

If I had to distill all of this into something you could actually use tomorrow, it would be this:

**Stop thinking of yourself as a designer who might learn some code. Start thinking of yourself as someone who ships products, and design is your superpower.**

The era of the specialist who stays in their lane is giving way to the era of the generalist who knows which lane to be in. You don't have to know everything. You have to know enough to move, and know who to collaborate with for the rest.

AI doesn't replace that. AI is actually what makes it possible — because now a designer with judgment and taste and a real understanding of users can execute at a speed that used to require a full team.

Learn the bones of a webpage. Understand the difference between the skeleton, the skin, and the brain. Sit with the design fundamentals long enough that they become instinct. Then, and only then, let AI carry the speed.

The designer who ships is the most valuable person in the room right now. The question is just whether you're willing to build the foundation that earns that seat.

Where are you at with this? Are you in a learning environment, a job, or somewhere in between — and does this reflect what you're seeing? Drop a comment. I'd genuinely love to know.
`,
  },
  {
    slug: "building-scalable-design-systems",
    title: "Building Scalable Design Systems",
    excerpt: "How design systems help teams scale products efficiently while maintaining usability and visual consistency.",
    readTime: "7 min",
    category: "Design Systems",
    tags: ["design systems", "product architecture", "ui consistency"],
    publishDate: "2026-03-06",
    author,
    section: "blog",
    heroImage: imgDesignSystems,
    seo: {
      metaTitle: "Building Scalable Design Systems | Qomardeen Tijani",
      metaDescription: "How design systems help teams scale products efficiently while maintaining usability and visual consistency.",
    },
    content: `
## Why Design Systems Matter at Scale

A design system is more than a component library. It's a shared language between design and engineering that enables teams to build consistent experiences at velocity.

Without one, every new feature becomes an opportunity for fragmentation. With one, every new feature *compounds* existing quality.

## The Anatomy of a Scalable System

### 1. Design Tokens

Tokens are the atoms of your system — colors, spacing, typography, shadows, motion:

\`\`\`css
:root {
  --color-primary: hsl(185, 84%, 55%);
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --radius-lg: 1rem;
  --font-heading: 'Inter', sans-serif;
}
\`\`\`

Tokens ensure that a "primary color" change propagates everywhere instantly.

### 2. Component Architecture

Components should follow a clear hierarchy:

\`\`\`
Primitives (Button, Input, Badge)
  → Patterns (SearchBar, FormField, Card)
    → Features (UserProfile, PaymentForm, Dashboard)
      → Pages (Home, Settings, Checkout)
\`\`\`

Each layer only composes from the layer below. This prevents circular dependencies and makes changes predictable.

### 3. Variant Strategy

Every component needs a clear variant model:

\`\`\`typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

// This gives you 4 × 3 = 12 combinations from ONE component
\`\`\`

> Rule of thumb: If you're creating a new component that's 80% similar to an existing one, add a variant instead.

## Governance Models

### Centralized
One design systems team owns everything. Works for large orgs (50+ designers).

### Federated
Product teams contribute components, systems team reviews and maintains. Best for mid-size orgs.

### Community-Driven
Anyone can propose changes via a contribution process. Works for open-source and distributed teams.

## Cross-Team Collaboration

The hardest part of design systems isn't technical — it's organizational:

1. **Regular office hours** — Weekly sessions where teams can ask questions
2. **Migration guides** — When components update, provide step-by-step migration paths
3. **Adoption metrics** — Track which teams use the system and which don't
4. **Feedback loops** — Make it easy to report issues and request features

## Measuring Success

| Metric | What it measures |
|--------|-----------------|
| Component coverage | % of UI using system components |
| Design-to-dev time | Time from mockup to production |
| Consistency score | Visual consistency audit results |
| Adoption rate | Teams actively using the system |

## The Compound Effect

Design systems have exponential returns. The first 6 months feel slow — you're building infrastructure. After that, every new feature ships faster because the foundations are solid. The teams I've worked with typically see a **40-60% reduction** in design-to-development time after the first year.

The key is patience and commitment. A design system is a product, not a project.
    `
  },
  {
    slug: "designing-ai-native-products",
    title: "Designing AI-Native Products",
    excerpt: "Principles for designing products where artificial intelligence is a core capability rather than an add-on feature.",
    readTime: "6 min",
    category: "AI & Product Design",
    tags: ["ai product design", "ai interfaces", "future ux"],
    publishDate: "2026-02-18",
    author,
    section: "blog",
    heroImage: imgAiNative,
    seo: {
      metaTitle: "Designing AI-Native Products | Qomardeen Tijani",
      metaDescription: "Principles for designing products where artificial intelligence is a core capability rather than an add-on feature.",
    },
    content: `
## AI-Native vs. AI-Enhanced

There's a critical distinction most teams miss:

- **AI-Enhanced**: Traditional product with AI features bolted on (e.g., "smart suggestions" in a form)
- **AI-Native**: Product designed from the ground up around AI capabilities (e.g., conversational interfaces, adaptive workflows)

The design principles for each are fundamentally different.

## Core Principles

### 1. Design for Uncertainty

Traditional UIs are deterministic — click a button, get a predictable result. AI interfaces are probabilistic — the same input might produce different outputs.

This requires new interaction patterns:

\`\`\`
Traditional:   Input → Processing → Output
AI-Native:     Input → Processing → Output + Confidence + Alternatives
\`\`\`

Always show:
- **Confidence indicators** — How sure is the AI?
- **Alternative suggestions** — What else could it be?
- **Easy correction** — How to fix wrong results?

### 2. Progressive Autonomy

Don't give the AI full control immediately. Let users build trust gradually:

| Trust Level | AI Role | User Role |
|-------------|---------|-----------|
| New user | Suggest | Decide + execute |
| Regular user | Recommend | Approve |
| Power user | Act | Monitor + override |

### 3. Transparent Reasoning

Users need to understand *why* the AI made a decision:

\`\`\`
❌ "We recommend Product A"
✅ "We recommend Product A because it matches your budget 
   ($50-100) and has 4.8★ ratings in your preferred category"
\`\`\`

### 4. Graceful Degradation

When AI fails (and it will), the product should still work:

\`\`\`typescript
const getRecommendation = async (userId: string) => {
  try {
    const aiResult = await ai.recommend(userId);
    if (aiResult.confidence > 0.7) return aiResult;
    // Fall back to rule-based recommendations
    return fallbackRecommender.recommend(userId);
  } catch {
    // Fall back to popularity-based defaults
    return getPopularItems();
  }
};
\`\`\`

## Interaction Models

### Conversational
Best for: Open-ended tasks, exploration, complex queries.
Example: Chatbots, voice assistants, AI search.

### Ambient
Best for: Background optimization, passive monitoring.
Example: Smart notifications, auto-categorization, predictive loading.

### Collaborative
Best for: Creative work, document editing, code generation.
Example: AI co-pilots, writing assistants, design tools.

## Ethical Considerations

1. **Bias awareness** — Test AI outputs across demographics
2. **Data transparency** — Tell users what data the AI uses
3. **Opt-out options** — Always let users disable AI features
4. **Human escalation** — Provide paths to human support

## The Design Challenge

The hardest part of AI product design isn't the technology — it's managing user expectations. AI that works 90% of the time creates frustration in the 10% it fails, especially if users expected 100%.

Design for the failure case first. If the worst-case experience is acceptable, the product will succeed.
    `
  },
  {
    slug: "ai-assisted-design-workflows",
    title: "AI-Assisted Design Workflows",
    excerpt: "How artificial intelligence can accelerate research, ideation, and iteration in modern product design.",
    readTime: "6 min",
    category: "Design Process",
    tags: ["ai design", "design tools", "workflow"],
    publishDate: "2026-02-03",
    author,
    section: "blog",
    heroImage: imgAiWorkflows,
    seo: {
      metaTitle: "AI-Assisted Design Workflows | Qomardeen Tijani",
      metaDescription: "How artificial intelligence can accelerate research, ideation, and iteration in modern product design.",
    },
    content: `
## AI Won't Replace Designers — But It Will Replace Slow Ones

The design industry is split between AI skeptics and AI evangelists. I'm neither. I'm a pragmatist who uses AI wherever it genuinely accelerates my work.

Here's my actual workflow.

## Phase 1: Research Acceleration

### Competitive Analysis
Instead of spending 3 days auditing competitor products, I use AI to:

1. **Summarize app store reviews** — Extract the top 5 complaints and praises
2. **Analyze feature matrices** — Compare 10+ competitors across key dimensions
3. **Identify patterns** — Surface common UX patterns in a category

\`\`\`
Prompt: "Analyze the top 10 fintech apps in Nigeria. 
For each, list: key features, primary user complaints 
from app store reviews, and unique UX patterns."
\`\`\`

This gives me a research foundation in hours instead of days.

### User Interview Synthesis
After conducting interviews, I feed transcripts into AI to:
- Extract recurring themes
- Identify contradictions between what users say and do
- Generate affinity diagram clusters

## Phase 2: Ideation Boost

AI is excellent at generating *quantity* — which is exactly what brainstorming needs.

### Crazy Eights, Powered Up
Instead of sketching 8 ideas in 8 minutes solo, I:
1. Generate 20+ concept descriptions with AI
2. Sketch the most promising 8
3. Combine and iterate on the top 3

### Copy and Microcopy
First drafts of UI text are perfect for AI:

\`\`\`
Prompt: "Write 5 versions of an empty state message 
for a payment history screen. Tone: friendly, 
professional. Include a clear call-to-action."
\`\`\`

## Phase 3: Design System Maintenance

This is where AI saves the most time:

- **Generating component documentation** from Figma specs
- **Writing accessibility annotations** for handoff
- **Creating test scenarios** for edge cases

## What AI Can't Do

AI fails at:
- **Understanding context** — It doesn't know your users' specific pain points
- **Making taste decisions** — It can't tell you if something *feels* right
- **Political navigation** — It can't manage stakeholder dynamics

The designers who thrive will be those who use AI for the mechanical work and invest their freed-up time in the deeply human parts of design.
    `
  },
  {
    slug: "dashboard-design-clarity-over-complexity",
    title: "Dashboard Design: Clarity Over Complexity",
    excerpt: "Principles for designing data-heavy dashboards that help users understand complex information quickly.",
    readTime: "5 min",
    category: "Product Design",
    tags: ["dashboard ux", "data visualization", "analytics design"],
    publishDate: "2026-01-20",
    author,
    section: "blog",
    heroImage: imgDashboard,
    seo: {
      metaTitle: "Dashboard Design: Clarity Over Complexity | Qomardeen Tijani",
      metaDescription: "Principles for designing data-heavy dashboards that help users understand complex information quickly.",
    },
    content: `
## The Dashboard Paradox

Dashboards are supposed to simplify complexity. Instead, most dashboards *add* complexity by showing everything at once.

The fix isn't removing data — it's organizing it by intent.

## The Intent-Based Framework

Every dashboard element should answer one of three questions:

1. **"Is everything okay?"** → Status indicators, alerts
2. **"What happened?"** → Trends, comparisons, history
3. **"What should I do?"** → Action items, recommendations

### Layer 1: Glanceable Health

The top of every dashboard should be answerable in 2 seconds:

\`\`\`
✅ All systems operational | 📦 142 deliveries today | ⚠️ 3 items need attention
\`\`\`

No charts, no tables — just status.

### Layer 2: Contextual Depth

Below the health bar, show data that explains *why* things are the way they are:

- **Trend lines** with clear annotations ("Peak at 2pm — lunch rush")
- **Comparison cards** ("12% above last Tuesday")
- **Filtered tables** that show only anomalies by default

### Layer 3: Action Surface

The bottom layer surfaces what the user should *do*:

- Approve pending items
- Resolve flagged issues
- Review recommendations

## Real-World Application

In the Uptime platform, drivers needed a dashboard that worked while they were *moving*. This meant:

- **Large touch targets** (minimum 48px)
- **High contrast** text on map overlays
- **Voice-readability** — every status could be spoken aloud
- **Progressive loading** — show the route first, details on demand

## The 5-Second Test

Before shipping any dashboard, I run the 5-second test:

> Show the dashboard to someone for 5 seconds. Then ask: "What is this telling you?"

If they can't answer, the hierarchy is wrong. Redesign until the most important information is the most visible.
    `
  },
  {
    slug: "designing-trust-fintech-interfaces",
    title: "Designing Trust in Fintech Interfaces",
    excerpt: "Key UX patterns that build trust when users move money through digital platforms.",
    readTime: "4 min",
    category: "UX Design",
    tags: ["fintech", "ux design", "trust design", "product safety"],
    publishDate: "2026-01-06",
    author,
    section: "blog",
    heroImage: imgFintech,
    seo: {
      metaTitle: "Designing Trust in Fintech Interfaces | Qomardeen Tijani",
      metaDescription: "Key UX patterns that build trust when users move money through digital platforms.",
    },
    content: `
## Trust Is the Product

In fintech, the interface *is* the trust signal. Users can't see the servers, the encryption, or the compliance certifications. All they have is what's on screen.

After designing WalPay — a digital payments platform — I've identified the patterns that consistently build user confidence.

## The Five Trust Signals

### 1. Progressive Disclosure of Security

Don't dump all your security features on the user at once. Reveal them contextually:

- **Before a transaction**: Show the encryption badge
- **During confirmation**: Display the exact amount and recipient
- **After completion**: Provide a timestamped receipt with transaction ID

### 2. Predictable Feedback Loops

Every action should have a clear, immediate response:

\`\`\`
Tap "Send" → Button shows spinner → 
Success screen with confetti → 
Receipt appears in history
\`\`\`

The worst thing in fintech is ambiguity. *"Did my payment go through?"* should never be a question.

### 3. Transparent Error States

When something fails, be specific:

| ❌ Bad | ✅ Good |
|--------|---------|
| "Transaction failed" | "Your bank declined this transaction. Try a different card or contact your bank." |
| "Error occurred" | "We couldn't verify your identity. Please retake your photo in good lighting." |

### 4. Familiar Visual Language

Use conventions users already trust:
- **Green** for successful transactions
- **Lock icons** near sensitive inputs
- **Bank-style formatting** for account numbers (•••• 4532)

### 5. Undo and Recovery

Allow users to feel safe by providing escape hatches:
- Cancel pending transfers
- Edit scheduled payments
- Dispute transactions with clear timelines

## The WalPay Approach

In WalPay, every screen was designed with a "trust audit" — a checklist asking:

1. Does the user know where their money is right now?
2. Can they predict what happens next?
3. If something goes wrong, do they know how to recover?

This framework turned abstract security into tangible user confidence.
    `
  },
  {
    slug: "systems-thinking-product-design",
    title: "Why Systems Thinking Matters in Product Design",
    excerpt: "How thinking beyond individual screens enables scalable and consistent product experiences.",
    readTime: "5 min",
    category: "Product Design",
    tags: ["systems thinking", "product design", "design systems"],
    publishDate: "2025-12-18",
    author,
    section: "blog",
    heroImage: imgSystems,
    seo: {
      metaTitle: "Why Systems Thinking Matters in Product Design | Qomardeen Tijani",
      metaDescription: "How thinking beyond individual screens enables scalable and consistent product experiences.",
    },
    content: `
## The Problem with Screen-Level Thinking

Most designers start with screens. A login page here, a dashboard there, a settings panel somewhere else. This approach works for small products, but it breaks down the moment your product scales.

When you design screen-by-screen, you end up with:
- **Inconsistent patterns** — buttons that behave differently across pages
- **Redundant components** — three versions of the same modal
- **Fragile handoffs** — engineers rebuilding what already exists

## What Systems Thinking Looks Like

Systems thinking means zooming out before zooming in. Instead of asking *"What should this screen look like?"*, you ask:

> "What are the underlying rules that govern how every screen should behave?"

This shift changes everything. You start designing **principles**, not pages. You define:

1. **Interaction patterns** — How does selection work everywhere?
2. **Data flow** — Where does information come from, and how does it update?
3. **State management** — What happens when something loads, fails, or is empty?

## A Real Example: Uptime

When I designed the Uptime logistics platform, I started with the system model:

\`\`\`
User Role → Permission Set → Available Actions → UI Surface
\`\`\`

This meant every new feature could be expressed as a combination of existing primitives. A warehouse manager and a driver see different data, but the *patterns* are identical.

### The Component Architecture

\`\`\`typescript
const DashboardView = ({ role, permissions }) => {
  const widgets = getWidgetsForRole(role);
  const actions = filterByPermissions(permissions);
  
  return (
    <DashboardLayout>
      {widgets.map(widget => (
        <Widget key={widget.id} actions={actions} />
      ))}
    </DashboardLayout>
  );
};
\`\`\`

## The Payoff

Systems thinking doesn't just make design more consistent — it makes the entire product team faster:

- **Designers** reuse patterns instead of reinventing them
- **Engineers** build once and compose
- **Product managers** can predict the impact of changes

The initial investment is higher, but the compound returns are enormous. Every new feature becomes cheaper to design, build, and maintain.

## Start Small

You don't need to redesign everything. Start with one question: *"Is there a pattern here that I'm repeating?"* If yes, extract it, name it, and document it. That's systems thinking in action.
    `
  },
  {
    slug: "from-fashion-to-product-design",
    title: "From Fashion to Product Design",
    excerpt: "How my background in fashion design shaped my approach to building digital products and user experiences.",
    readTime: "4 min",
    category: "Career & Design",
    tags: ["career", "design thinking", "creative journey"],
    publishDate: "2025-12-02",
    author,
    section: "blog",
    heroImage: imgFashion,
    seo: {
      metaTitle: "From Fashion to Product Design | Qomardeen Tijani",
      metaDescription: "How my background in fashion design shaped my approach to building digital products and user experiences.",
    },
    content: `
## An Unlikely Origin Story

I didn't start in tech. My first design language was fabric, not Figma. I studied fashion design before transitioning into digital product design — and that background gives me an advantage most designers don't have.

## What Fashion Taught Me

### 1. Material Thinking

In fashion, you design *with* the material, not against it. Silk drapes differently than denim. You can't force a fabric to do something it wasn't made for.

Digital design works the same way:
- **CSS has grain** — some layouts are natural, others fight the medium
- **Platforms have conventions** — iOS and Android have different material properties
- **Data has weight** — a table of 10 items feels different than 10,000

### 2. The Importance of Fit

A beautiful garment that doesn't fit is useless. The same applies to interfaces:

> "The best design in the world fails if it doesn't fit the user's mental model."

I obsess over fit: Does this flow match how users actually think? Does this layout match how they scan? Does this interaction match their muscle memory?

### 3. Collection Thinking

Fashion designers don't design individual pieces — they design *collections*. Every piece must work alone AND together. This is exactly what a design system is:

- Individual components that are beautiful standalone
- A cohesive system when composed together
- Seasonal updates that evolve without breaking the whole

### 4. Presentation Is Part of the Product

In fashion, the runway show *is* part of the design. How you present matters as much as what you present.

In product design, this translates to:
- **Onboarding** is your runway show
- **Empty states** are your window displays
- **Loading states** are your packaging

## The Crossover Skills

The skills that transferred directly:
- **Color theory** — I think in palettes, not individual colors
- **Proportion and balance** — Spacing is as important as content
- **Trend awareness** — Knowing what's current without being trendy
- **User empathy** — In fashion, you design for bodies; in digital, you design for minds

## Why It Matters

The tech industry rewards conformity. Everyone uses the same tools, follows the same tutorials, and produces the same designs. Coming from fashion gives me a different lens — one that values craft, materiality, and the emotional impact of design.

That's not a weakness. It's a superpower.
    `
  },
];

export const thinkingPosts: BlogPost[] = [
  {
    slug: "mobile-banking-onboarding-ux",
    title: "UX Breakdown: Mobile Banking Onboarding",
    excerpt: "Analyzing how top fintech apps reduce friction in first-time user flows.",
    readTime: "7 min",
    category: "UX Design",
    tags: ["fintech", "onboarding", "ux breakdown"],
    publishDate: "2026-02-24",
    author,
    section: "thinking",
    heroImage: imgMobileBanking,
    seo: {
      metaTitle: "UX Breakdown: Mobile Banking Onboarding | Qomardeen Tijani",
      metaDescription: "Analyzing how top fintech apps reduce friction in first-time user flows.",
    },
    content: `
## The First 60 Seconds

Mobile banking onboarding has a brutal constraint: users must provide sensitive personal information *before* they've experienced any value. This creates a trust deficit that the best apps solve through careful UX design.

I analyzed the onboarding flows of 8 top fintech apps across Africa and Europe. Here's what separates the best from the rest.

## Pattern 1: Value Preview Before Registration

The strongest apps show you what you'll get *before* asking for anything:

\`\`\`
Kuda:     3 screens of benefits → Sign up
OPay:     Feature tour with animations → Sign up
Revolut:  Interactive demo → Sign up
\`\`\`

**Why it works**: Reciprocity. Show value first, then ask for investment.

## Pattern 2: Progressive KYC

Instead of a 12-field form, break identity verification into digestible steps:

1. **Level 0**: Email + password → Can explore the app
2. **Level 1**: Phone number → Can receive money
3. **Level 2**: BVN/ID verification → Can send money
4. **Level 3**: Address proof → Full limits unlocked

Each level gives more access, creating a reward loop.

## Pattern 3: Contextual Security Explanation

Don't just ask for a selfie — explain why:

| Step | What they ask | What they explain |
|------|--------------|-------------------|
| BVN | "Enter your BVN" | "This verifies your identity with the Central Bank" |
| Selfie | "Take a photo" | "We match this to your ID to prevent fraud" |
| PIN | "Create a PIN" | "This secures every transaction you make" |

## Pattern 4: Progress Persistence

If a user drops off mid-onboarding, save their progress. The worst experience is starting over.

## Key Takeaway

The best onboarding doesn't feel like onboarding. It feels like the product is gradually opening up to you, one trust exchange at a time.
    `
  },
  {
    slug: "notion-design-system-teardown",
    title: "Product Teardown: Notion's Design System",
    excerpt: "How Notion balances flexibility and consistency across a complex product.",
    readTime: "8 min",
    category: "Design Systems",
    tags: ["design systems", "product teardown", "notion"],
    publishDate: "2026-02-10",
    author,
    section: "thinking",
    heroImage: imgNotionTeardown,
    seo: {
      metaTitle: "Product Teardown: Notion's Design System | Qomardeen Tijani",
      metaDescription: "How Notion balances flexibility and consistency across a complex product.",
    },
    content: `
## The Flexibility Paradox

Notion is one of the most flexible productivity tools ever built. Users can create databases, wikis, project boards, and documents — all within the same interface. Yet it never feels chaotic.

How does Notion's design system achieve this?

## The Block Primitive

Everything in Notion is a **block**. Text, images, databases, embeds — all blocks. This single abstraction is the foundation of their entire design system.

\`\`\`
Block
├── Text Block (paragraph, heading, list, toggle)
├── Media Block (image, video, file, bookmark)
├── Database Block (table, board, timeline, calendar, gallery)
├── Embed Block (code, math, tweet, figma)
└── Layout Block (column, divider, callout)
\`\`\`

### Why This Works

1. **Consistent interaction model** — Every block can be dragged, duplicated, deleted, and commented on
2. **Composability** — Any block can contain other blocks
3. **Extensibility** — New block types don't require new interaction patterns

## Lessons for Designers

1. **Find your primitive** — What's the smallest unit of your product? Design that perfectly.
2. **Constrain the container** — The more flexible the content, the more rigid the frame should be.
3. **Color is data** — Use color to communicate, not decorate.
4. **Navigation = mental model** — Your sidebar should mirror how users think, not how your database is structured.

## What Notion Gets Wrong

- **Performance** — Complex pages can feel sluggish
- **Mobile experience** — The flexibility that works on desktop becomes overwhelming on mobile
- **Learning curve** — New users often don't know where to start

Even the best design systems have trade-offs. The key is making *intentional* trade-offs, not accidental ones.
    `
  },
  {
    slug: "ai-beyond-chatbots",
    title: "AI in Product Design: Beyond Chatbots",
    excerpt: "How AI is reshaping design workflows, research, and user experience.",
    readTime: "6 min",
    category: "AI & Product Design",
    tags: ["ai", "product design", "future ux"],
    publishDate: "2026-01-28",
    author,
    section: "thinking",
    heroImage: imgAiBeyondChatbots,
    seo: {
      metaTitle: "AI in Product Design: Beyond Chatbots | Qomardeen Tijani",
      metaDescription: "How AI is reshaping design workflows, research, and user experience.",
    },
    content: `
## The Chatbot Trap

When most people think "AI in product design," they think chatbots. But chatbots are just one — arguably the least interesting — application of AI in design.

The real revolution is happening in three areas.

## 1. Intelligent Defaults

The most powerful AI feature is one users never notice: **smart defaults**.

Instead of asking users to configure everything, AI can:
- **Pre-fill forms** based on context (location, time, past behavior)
- **Suggest settings** based on similar users
- **Predict next actions** and surface them proactively

## 2. Adaptive Interfaces

AI enables interfaces that reshape themselves based on the user:
- **Morning**: Show daily overview and task list
- **End of day**: Show summary and tomorrow's agenda
- **Weekend**: Show personal items, hide work features

## 3. Generative Content

AI can create personalized content within products:
- **Dynamic onboarding** — Tutorials that adapt based on the user's role
- **Contextual help** — Documentation that answers the specific question the user likely has
- **Smart summaries** — Condensing long threads into actionable highlights

## The Design Challenge

The products that win won't be the ones with the most AI features. They'll be the ones where AI is so well-integrated that users forget it's there. That's the design challenge of this decade.
    `
  },
  {
    slug: "systems-thinking-for-designers",
    title: "Systems Thinking for Designers",
    excerpt: "Why understanding the whole system leads to better component-level decisions.",
    readTime: "5 min",
    category: "Product Design",
    tags: ["systems thinking", "design methodology"],
    publishDate: "2026-01-12",
    author,
    section: "thinking",
    heroImage: imgSystemsDesigners,
    seo: {
      metaTitle: "Systems Thinking for Designers | Qomardeen Tijani",
      metaDescription: "Why understanding the whole system leads to better component-level decisions.",
    },
    content: `
## Components Don't Exist in Isolation

Every button, card, and modal you design exists within a system. The quality of your component-level decisions depends on how well you understand that system.

## The Three Levels of Design

### Level 1: Component Design
*"How should this button look?"*
Most designers operate here.

### Level 2: Pattern Design
*"How should buttons behave across the product?"*
This is where design systems live.

### Level 3: System Design
*"Why do we need buttons at all? What are the possible actions in our product, and how do users discover and execute them?"*
This is systems thinking.

## A Practical Framework

When approaching any design problem, work through these layers:

\`\`\`
1. CONTEXT:  What system does this live in?
2. FLOW:     What happens before and after this?
3. STATE:    What are all the possible states?
4. EDGE:     What could go wrong?
5. SCALE:    What happens at 10x volume?
\`\`\`

## Building Systems Intuition

1. **Draw Maps, Not Screens** — Before opening Figma, draw the system
2. **Ask "And Then What?"** — Follow the chain until you hit an edge case
3. **Study Infrastructure** — Read engineering docs, understand the data model
4. **Think in States** — Every element has at least 5 states: empty, loading, partial, complete, error

## The Competitive Advantage

Companies hire systems thinkers not because they make prettier screens, but because they make *fewer screens*. When you understand the system, you find elegant solutions that handle 10 cases with 1 design instead of 10 separate designs.
    `
  },
];

export const allPosts = [...blogPosts, ...thinkingPosts];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find(post => post.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return allPosts.filter(post => post.category === category);
}

export function getBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getRelatedPosts(slug: string, category: BlogCategory, limit = 3, tags: string[] = []): BlogPost[] {
  const tagSet = new Set(tags.map(t => t.toLowerCase()));
  const candidates = allPosts.filter(post => post.slug !== slug);

  // Score: same category = 3, plus 1 per shared tag
  const scored = candidates.map(post => {
    let score = 0;
    if (post.category === category) score += 3;
    for (const t of post.tags) {
      if (tagSet.has(t.toLowerCase())) score += 1;
    }
    return { post, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || +new Date(b.post.publishDate) - +new Date(a.post.publishDate))
    .slice(0, limit)
    .map(s => s.post);
}

export function getAdjacentPosts(slug: string, section: 'blog' | 'thinking'): { prev?: BlogPost; next?: BlogPost } {
  const posts = section === 'blog' ? blogPosts : thinkingPosts;
  const idx = posts.findIndex(p => p.slug === slug);
  return {
    prev: idx > 0 ? posts[idx - 1] : undefined,
    next: idx < posts.length - 1 ? posts[idx + 1] : undefined,
  };
}
