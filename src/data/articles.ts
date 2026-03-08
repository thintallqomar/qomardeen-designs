export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  tag: string;
  date: string;
  category: 'blog' | 'thinking';
}

export const blogPosts: BlogPost[] = [
  {
    slug: "systems-thinking-product-design",
    title: "Why Systems Thinking Matters in Product Design",
    excerpt: "How thinking beyond screens creates more scalable and consistent user experiences.",
    readTime: "5 min",
    tag: "Systems",
    date: "2025-03-01",
    category: "blog",
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
// Instead of building custom pages per role:
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
    slug: "designing-trust-fintech",
    title: "Designing Trust in Fintech Interfaces",
    excerpt: "Key patterns that help users feel confident when moving money digitally.",
    readTime: "4 min",
    tag: "Fintech",
    date: "2025-02-15",
    category: "blog",
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
    slug: "ai-assisted-design-workflows",
    title: "AI-Assisted Design Workflows",
    excerpt: "How I use AI tools to accelerate research, ideation, and iteration.",
    readTime: "6 min",
    tag: "AI",
    date: "2025-02-01",
    category: "blog",
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
    slug: "dashboard-design-clarity",
    title: "Dashboard Design: Clarity Over Complexity",
    excerpt: "Principles for building data-heavy interfaces that users actually understand.",
    readTime: "5 min",
    tag: "Dashboard",
    date: "2025-01-20",
    category: "blog",
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
    slug: "fashion-to-product-design",
    title: "From Fashion to Product Design",
    excerpt: "How my background in fashion design shaped my approach to digital products.",
    readTime: "4 min",
    tag: "Career",
    date: "2025-01-10",
    category: "blog",
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
    tag: "UX Breakdown",
    date: "2025-02-20",
    category: "thinking",
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

\`\`\`typescript
// Save onboarding state after each step
const saveProgress = async (step: number, data: Partial<OnboardingData>) => {
  await storage.set('onboarding_progress', {
    step,
    data,
    timestamp: Date.now(),
    expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};
\`\`\`

## The Metrics That Matter

- **Completion rate**: % of users who finish onboarding
- **Time to first transaction**: Hours/days from signup to first real use
- **Drop-off points**: Which steps lose the most users
- **Return rate**: % of dropped users who come back to finish

## Key Takeaway

The best onboarding doesn't feel like onboarding. It feels like the product is gradually opening up to you, one trust exchange at a time.
    `
  },
  {
    slug: "notion-design-system-teardown",
    title: "Product Teardown: Notion's Design System",
    excerpt: "How Notion balances flexibility and consistency across a complex product.",
    readTime: "8 min",
    tag: "Product Teardown",
    date: "2025-02-10",
    category: "thinking",
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

## The Typography System

Notion uses a remarkably restrained type system:

- **One font family** (default system font or user choice)
- **Three sizes** (small, medium, large — controlled by page settings)
- **Semantic styles** (H1, H2, H3, body, caption)

This constraint is intentional. In a tool where *content* varies infinitely, the *container* must be calm.

## Color as Metadata, Not Decoration

Notion uses color sparingly and always with meaning:

- **Background colors** for callouts and highlights (9 options)
- **Text colors** for emphasis (9 options)
- **Database colors** for status and categorization

Notice: no gradients, no shadows, no decorative color. Every color communicates information.

## The Sidebar: Navigation as Product

Notion's sidebar is arguably its most important design element:

\`\`\`
Workspace
├── Favorites (user-pinned pages)
├── Private (personal pages)
├── Shared (team pages)
└── Templates (starting points)
\`\`\`

The hierarchy mirrors how people think about their work: *What do I need right now? → What's mine? → What's shared?*

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
    tag: "AI Insight",
    date: "2025-01-25",
    category: "thinking",
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

\`\`\`
Traditional:    User → Settings → Configure → Save → Use
AI-Powered:     User → Use (settings auto-configured) → Adjust if needed
\`\`\`

This inverts the interaction model from *"set up then use"* to *"use then refine."*

## 2. Adaptive Interfaces

AI enables interfaces that reshape themselves based on the user:

### Frequency-Based Layout
\`\`\`typescript
// Surface most-used features for each user
const getPersonalizedLayout = (userId: string) => {
  const featureUsage = analytics.getFeatureFrequency(userId);
  const topFeatures = featureUsage.slice(0, 5);
  
  return {
    quickActions: topFeatures,
    secondaryActions: featureUsage.slice(5),
  };
};
\`\`\`

### Context-Aware Navigation
- **Morning**: Show daily overview and task list
- **End of day**: Show summary and tomorrow's agenda
- **Weekend**: Show personal items, hide work features

## 3. Generative Content

AI can create personalized content within products:

- **Dynamic onboarding** — Tutorials that adapt based on the user's role and experience level
- **Contextual help** — Documentation that answers the specific question the user likely has right now
- **Smart summaries** — Condensing long threads, reports, or histories into actionable highlights

## The Design Challenge

AI features introduce new design problems:

### Transparency
Users need to know when AI is making decisions. The spectrum:

\`\`\`
Invisible → Subtle indicator → Explicit label → Full explanation
\`\`\`

Each level is appropriate for different stakes. Auto-suggested text? Invisible is fine. Financial recommendation? Full explanation required.

### Correction
Every AI decision should be easily overridable. The best pattern:

> AI suggests → User confirms or adjusts → AI learns

### Failure States
AI will be wrong. Design for it:
- **Graceful degradation** — Fall back to manual input
- **Undo** — Let users reverse AI decisions
- **Feedback** — Let users tell the AI it was wrong

## The Future

The products that win won't be the ones with the most AI features. They'll be the ones where AI is so well-integrated that users forget it's there. That's the design challenge of this decade.
    `
  },
  {
    slug: "systems-thinking-for-designers",
    title: "Systems Thinking for Designers",
    excerpt: "Why understanding the whole system leads to better component-level decisions.",
    readTime: "5 min",
    tag: "Systems",
    date: "2025-01-15",
    category: "thinking",
    content: `
## Components Don't Exist in Isolation

Every button, card, and modal you design exists within a system. The quality of your component-level decisions depends on how well you understand that system.

## The Three Levels of Design

### Level 1: Component Design
*"How should this button look?"*

Most designers operate here. They focus on visual polish, spacing, and interaction states. This is necessary but insufficient.

### Level 2: Pattern Design
*"How should buttons behave across the product?"*

This is where design systems live. You define rules: primary buttons are for main actions, secondary for alternatives, ghost for tertiary. Better, but still incomplete.

### Level 3: System Design
*"Why do we need buttons at all? What are the possible actions in our product, and how do users discover and execute them?"*

This is systems thinking. You zoom out far enough to see the *shape* of the entire product.

## A Practical Framework

When approaching any design problem, work through these layers:

\`\`\`
1. CONTEXT:  What system does this live in?
2. FLOW:     What happens before and after this?
3. STATE:    What are all the possible states?
4. EDGE:     What could go wrong?
5. SCALE:    What happens at 10x volume?
\`\`\`

### Example: Designing a Notification Badge

**Component thinker**: "Red circle with a number."

**Systems thinker**:
- What types of notifications exist? (Urgent, informational, promotional)
- How do they aggregate? (Per-item count vs. category count)
- When do they clear? (On view, on action, on time?)
- What happens at 99+? At 999+?
- Do they sync across devices?
- How do they relate to email/push notifications?

The badge itself might look identical either way. But the systems thinker's badge *works* in production. The component thinker's badge breaks the first time a user has 150 unread notifications.

## Building Systems Intuition

### 1. Draw Maps, Not Screens
Before opening Figma, draw the *system*: entities, relationships, flows. A rough diagram beats a polished mockup at this stage.

### 2. Ask "And Then What?"
For every design decision, ask what happens next. Follow the chain until you hit an edge case.

### 3. Study Infrastructure
Read engineering docs. Understand the data model. Know the API structure. The best designers I know can read a database schema and spot UX problems.

### 4. Think in States
Every element has at least 5 states: empty, loading, partial, complete, error. Most designers only design 2 (empty and complete). Systems thinkers design all 5.

## The Competitive Advantage

Companies hire systems thinkers not because they make prettier screens, but because they make *fewer screens*. When you understand the system, you find elegant solutions that handle 10 cases with 1 design instead of 10 separate designs.

That's efficiency. That's scalability. That's systems thinking.
    `
  },
];

export const allPosts = [...blogPosts, ...thinkingPosts];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find(post => post.slug === slug);
}

export function getPostsByCategory(category: 'blog' | 'thinking'): BlogPost[] {
  return allPosts.filter(post => post.category === category);
}
