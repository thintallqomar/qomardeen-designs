/**
 * Everything Atlas knows about Qomardeen and this site that isn't stored in the admin.
 * Articles, case studies written in the admin, and "Notes for Atlas" (Admin › Site) are
 * added on top of this at answer time, so Atlas stays current without code changes.
 *
 * Only facts that appear on the site or that Qomardeen stated. If something isn't here,
 * Atlas says it doesn't know.
 */
export const KNOWLEDGE = `
# Who Qomardeen is
- Full name: Qomardeen Tijani. Product designer based in Nigeria (WAT, UTC+1). Works remotely with local and international teams.
- Positioning: "I design products. Then I build them." A product designer who builds: he designs fintech and SaaS products from research to polished UI, and turns his own designs into working front-ends (this website is one).
- Honest split: about 80% design, 20% code. He is still early on the building side and says so. He builds with HTML, CSS and Tailwind basics and ships his own designs with the help of AI (Claude). He is NOT learning React or TypeScript yet; never claim he writes React/TypeScript himself.
- Path into design: studied human anatomy at university, worked as an independent fashion designer, then moved into product design. Fashion design taught him to balance aesthetics with structure, constraints and user expectations.
- How he works: design is a problem-solving discipline. Before high fidelity he works to understand user goals, workflows, constraints and edge cases. He cares about clear information hierarchy, design systems, and handoffs engineers can build from.

# Availability and roles
- Available immediately.
- Open to Product Design and UI/UX Design roles, full-time or freelance, remote with local or international teams.
- Ways to work together: (1) Full-time role inside a product team; (2) Freelance project: dashboards, web apps and mobile flows, end to end or in focused sprints; (3) Design system & handoff: component libraries, design tokens, developer-ready specs.
- How he works on a project: Discover (problem, users, business context, constraints) → Design (wireframes, high-fidelity UI, interactive prototypes) → Hand off (Figma files with auto-layout and variants, design tokens, responsive layouts, developer-ready specs; he can prototype the front-end himself) → Deliver (QA, iteration, launch support, documentation).
- Contact: the form, email, phone and LinkedIn are at the bottom of the Hire page (/hire#contact). Booking link: cal.com/the_Qomardeen. Email: qomardeentijani@gmail.com. LinkedIn: linkedin.com/in/qomardeentijani. X: @the_Qomardeen. His CV can be downloaded on the Hire and About pages.

# Experience
- Product Designer — WalPay (fintech mobile application, product design): designed onboarding, wallet management and payment screens, using research, wireframing and prototyping to simplify complex financial workflows and reduce friction in transactions.
- Product Designer — UpTime HQ, Lagos, Nigeria (Aug 2025 – Jan 2026): led end-to-end UX/UI design of a CMMS platform (research, wireframes, high-fidelity prototypes in Figma), plus landing pages and core product architecture across authentication, payments and support. Worked with project managers and engineers in an Agile team.
- Project Manager — Oladel Global Resources Limited (2024 – present; promoted from Project Manager Intern, 2023–2024): end-to-end project planning, timelines and delivery across cross-functional teams; introduced structured workflows and reporting; client communication, resourcing and risk management.
- Independent Fashion Designer: creative direction, production and client delivery.

# Education
- School of Product — Product Design, AltSchool Africa, Lagos (Jul 2025 – Jun 2026).
- B.Sc. Human Anatomy, Ladoke Akintola University of Technology (LAUTECH), 2008 – 2014.
- Studying Computer Science at University of the People (started September 2026).

# Certifications
- Foundations of Project Management — Google (Coursera), Jan 2024
- Foundations of User Experience (UX) Design — Google (Coursera), Jan 2023
- Visual Elements of User Interface Design — California Institute of the Arts (Coursera), Jan 2022
- Web Design: Strategy and Information Architecture — CalArts (Coursera), Jan 2022
- UX Design Fundamentals — CalArts (Coursera), Jan 2022
- Jobberman Soft Skills Course — Jobberman, Jan 2022

# Skills
- Design: UI and UX design in Figma, user research and usability testing, design systems and components, dashboards and data-heavy flows, prototyping, information architecture, interaction design, accessibility.
- Building: front-end basics (HTML, CSS, Tailwind), shipping his own designs with Claude.
- Also: project management (planning, delivery, stakeholder communication).

# Random facts (from his About page)
- He studied human anatomy before he studied design.
- On his PS5: Ghost of Tsushima, Red Dead Redemption, Spider-Man 2.
- Beans and plantain is his comfort food. And yes, swallow. Always swallow.

# Case study: UpTime CMMS (/projects/uptime)
- What: a maintenance and equipment tracking web app (SaaS) that reduces downtime through scheduled tasks, offline functionality and smart reporting. Role: Product Designer (UI/UX). Scope: end-to-end design. Also on Behance.
- Problem: maintenance teams relied on spreadsheets and paper logs to track equipment, leading to missed schedules, unplanned downtime and costly reactive repairs.
- Research: interviews with facility managers and technicians, an empathy map, and a primary persona: a maintenance lead juggling 200+ assets across multiple sites.
- Design system: a professional, approachable identity with a clean palette, structured typography and iconography that signals reliability and precision.
- The dashboard: real-time asset health, upcoming maintenance schedules and actionable alerts, turning data overload into prioritised insights. Other screens: equipment registry, task management, settings and integrations, project timeline.
- Do not quote outcome percentages for UpTime; none were measured.

# Case study: WalPay (/projects/walpay)
- What: a digital wallet and currency exchange platform (iOS app and website) designed to take the friction out of international transfers. Role: Product Designer (UI/UX). Timeline: 8 weeks. Also on Behance.
- Challenge: international money transfers had hidden fees, slow processing and fragmented experiences, leaving users anxious about where their money was.
- Research: conversations with expatriates and freelancers who send money across borders; their core needs were trust, speed and transparency. Persona: Sarah Jenkins.
- Design language: clean geometry, a confidence-inspiring blue palette, typography balancing authority with approachability.
- Mobile-first: thumb-friendly screens; the send-money flow was simplified (from 8 steps to 3) with real-time rate visibility and instant confirmation. Screens include onboarding, send money and wallet transactions, profile and settings, and a KYC verification flow.
- Do not quote outcome percentages for WalPay; none were measured.

# Case study: This portfolio (/projects/portfolio)
- What: the site the visitor is on, designed by Qomardeen and built first in Lovable, then improved with Claude. Role: designer & builder (solo). Started in 2025 and still ongoing. Responsive, 11 languages. It has its own admin ("the studio") where Qomardeen edits case studies, articles, the About page, hero photos and his CV without code, can switch anything off instead of deleting it, and signs in with a password plus a code from an authenticator app (two-step sign-in).
- Problem: the first version said a lot and showed little ("designer at the intersection of UX, AI and systems thinking"); Hire, Contact and the footer repeated each other; every page had its own layout.
- Measured results (same 1440px screen width, before vs after): footer 863px → 162px (81% less height); Hire page 5,615px → 4,360px (22% shorter); Hire sections 8 → 6 with a single "Book a call"; 11 languages; every change checked at 4 screen widths (1440, 768, 375, 320) in light and dark mode.
- Key decisions and trade-offs:
  1. Split portrait instead of photo + job title, inspired by Adham Dannaway's designer/coder split. Cost: more motion, needs a tap toggle on phones and a still version for reduced motion.
  2. Honest 80/20 instead of "full-stack". Cost: a smaller claim, chosen over being caught out in an interview.
  3. Contact merged into Hire, so there's one place to reach him; old /contact links still work. Cost: a longer Hire page, offset by cutting repeated sections.
  4. One way to open every page (a lowercase word and a dot, like "projects."), one type scale from the About page, one left edge. Cost: less per-page personality.
  5. Only one highlighted thing at a time in tabs and menus (he noticed competing fills while using the Projects tabs).
  6. Everything editable from his own admin, with an on/off switch so content can be hidden while he reworks it. Cost: more to build up front (roles, editor, security rules).
  7. Eleven languages: English, French, Spanish, German, Portuguese, Russian, Arabic, Yoruba, Hausa, Igbo and Nigerian Pidgin.
- Motion: page titles and headings scramble into place once, numbers roll like an odometer, split curtain page transitions; all switch off for people who prefer reduced motion.

# How the site was made, from inception to now
1. Built in Lovable: React, Tailwind and a Supabase backend (database, storage, functions). First pages: Home, Projects, Hire, About, Contact, writing, and Atlas (this assistant).
2. Moved to Claude when his Lovable credits ran out. He gives Claude the site's code from GitHub and describes changes in plain words, often with screenshots. Claude writes the code, tests it in a real browser at four screen widths in both themes, and returns one update package with a plain-English change list. Qomardeen reviews it, puts it on GitHub, then publishes it from Lovable.
3. Admin and content: one rich-text editor across the admin; projects built in chat imported into the admin; full case studies vs other projects; CV and hero image uploads; on/off switches for every item.
4. Quality and trust: security fixes in the backend functions (AI chat, voice, contact email); translations into 11 languages; light mode 6am–6pm and dark mode at night, with a manual override; mobile fixes.
5. Identity: the "designer who builds" split-portrait hero, a rewritten About page (80/20 split, random facts), honest claims only (unbacked metrics removed from older case studies).
6. Consistency pass: one page opening and type scale everywhere, an 81% smaller footer, Contact folded into Hire, a streamlined Hire page, unified case study layout, the portfolio case study, text scramble and rolling numbers.
7. Atlas rebuilt with a modern interface, deeper knowledge of Qomardeen and the site, chat history saved on the visitor's own device, and an optional memory of what visitors share about themselves.
- Division of labour: Qomardeen sets the direction, chooses the visual rules, spots problems in use and decides what ships. Claude writes most of the code, translates copy, audits security and tests every change.

# Site map (for navigation)
- / Home · /projects All projects (tabs: Full case studies, Other projects, All projects) · /projects/uptime · /projects/walpay · /projects/portfolio
- /hire Hire (availability, ways to work, proof, process, FAQ) · /hire#contact contact form and direct contact · /about About · /explore Explore hub · /explore/articles Articles · /explore/thinking Thinking · /explore/architecture Architecture
`;
