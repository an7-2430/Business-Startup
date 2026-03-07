# Front-End Specification — BuildPath (MVP)

**Document status:** Draft v1.0  
**Source of truth:** Google Stitch design + PRD + architecture  
**Target platform:** Responsive web app  
**Theme:** Dark neon modern, glassmorphism, subtle glow accents, tasteful micro-animations

---

## 1. Purpose

This document defines the UI/UX behaviour for BuildPath so frontend implementation stays consistent with the approved Stitch design and product requirements.

---

## 2. UX Goals

- Make the setup journey feel guided, structured, and slightly gamified.
- Reduce overwhelm through progressive disclosure.
- Keep admin workflows efficient and straightforward.
- Ensure strong visual hierarchy and fast recognition of step status.
- Maintain responsive usability across desktop, tablet, and mobile.

---

## 3. Design Principles

1. **Clarity first** — every page should clearly show what the user can do next.
2. **Progress is motivating** — roadmap status and completion must be visible.
3. **Consistent neon system** — glows and motion should feel premium, not noisy.
4. **Useful motion only** — animation should reinforce state change, not distract.
5. **Accessible dark mode** — maintain readable contrast and focus states.

---

## 4. Core Screens

### 4.1 Landing Page
**Goal:** Convert visitors into signed-in users who start the roadmap.

**Sections:**
- Hero with headline and CTA
- Feature cards: Compliance, Operations, Tools
- Trust/benefits strip
- Footer

### 4.2 Login / Signup
**Goal:** Authenticate users through Auth0.

**Elements:**
- Brand title/logo
- Primary login/signup button
- Error message area
- Optional legal/footer links

### 4.3 Onboarding Wizard
**Goal:** Capture State → Industry → Business Type.

**Elements:**
- Step progress indicator
- Select input(s)
- Back / Next buttons
- Completion CTA

### 4.4 Dashboard / Roadmap
**Goal:** Show overall setup journey and current progress.

**Layout:**
- Left sidebar: stages, filters, quick nav
- Main content: roadmap map
- Top strip: progress %, badge/streak placeholders, user menu

**Roadmap node states:**
- Locked
- Unlocked
- Completed
- Hover
- Selected

### 4.5 Step Detail
**Goal:** Help the user understand and complete one step.

**Elements:**
- Step title
- Why it matters
- Checklist
- Resources/links
- Notes
- Upload document
- Mark Complete button

### 4.6 Admin Panel
**Goal:** Maintain industries, stages, steps, prerequisites.

**Elements:**
- Entity tables
- Search/filter
- Create/Edit drawer or modal
- Delete confirmation
- Audit log table
- Webhook event table

### 4.7 Billing
**Goal:** Present pricing and send user to Stripe checkout.

**Elements:**
- Plan card
- Upgrade CTA
- Success/cancel message
- Current billing status placeholder

---

## 5. Component Inventory

### 5.1 Core Components
- Neon primary button
- Secondary outline button
- Danger button
- Card
- Modal
- Drawer
- Sidebar nav
- Table
- Form field
- Select dropdown
- Status badge
- Progress bar
- Toast notification
- Empty state panel
- Loading skeleton

### 5.2 Roadmap Components
- Roadmap node
- Roadmap edge
- Stage summary card
- Progress widget
- Completion animation feedback

---

## 6. Interaction Rules

### 6.1 Step Status
- **Locked:** dim, non-interactive, tooltip explains prerequisite
- **Unlocked:** bright border/glow, clickable
- **Completed:** green accent + completed badge/check icon

### 6.2 Completion Feedback
On step completion:
- update progress instantly
- node transitions to completed
- subtle glow burst / confirmation toast
- unlock dependent steps if valid

### 6.3 Admin Editing
- edits should happen in-place via drawer/modal where possible
- destructive actions must confirm
- success should show toast + last updated refresh

---

## 7. Motion Guidelines

### 7.1 Allowed Motion
- hover glow on interactive elements
- progress shimmer
- node pulse on unlock
- smooth page/section transition
- modal/drawer fade-slide
- toast slide in

### 7.2 Motion Constraints
- avoid long looping animations
- avoid heavy particle effects
- all motion should remain performant
- respect reduced motion preference where possible

---

## 8. Responsiveness

### Desktop
- full sidebar visible
- map centred with top stats bar

### Tablet
- collapsible sidebar
- tighter card spacing
- roadmap map scrollable

### Mobile
- stacked layout
- compact top stats
- bottom nav or hamburger for section navigation
- roadmap in scroll/zoom container
- large touch targets

---

## 9. Loading / Empty / Error States

### Loading
- skeletons for dashboard, admin tables, step detail

### Empty
- no roadmap yet
- no documents uploaded
- no admin content records yet

### Error
- inline form validation
- page-level retry option where relevant
- toast notification for async errors

---

## 10. Accessibility Notes

- strong contrast on dark backgrounds
- visible focus outlines
- meaningful button labels
- icon + text where possible
- avoid relying on color alone for status
- maintain readable font size and spacing

---

## 11. Frontend Handoff Notes

- Build using Next.js App Router + Tailwind
- Prefer reusable components over page-specific styling
- Keep roadmap rendering isolated in its own component module
- Match Stitch visuals, but prioritise maintainable code and accessibility
