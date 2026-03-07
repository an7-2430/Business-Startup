# PRD — BuildPath Business Setup Platform (MVP)

**Document status:** Draft v1.0 (PM-approved epics/stories, integration-ready)  
**Architecture:** Monolith for MVP  
**Source inputs:** Project brief, Tech stack + integration notes, Step-by-step implementation snippets  

---

## 1. Overview

### 1.1 Product Vision
BuildPath is a gamified, step-by-step platform that guides entrepreneurs through business setup: compliance, operations, equipment/software choices, and readiness. Users progress via an interactive roadmap with locked/unlocked steps and clear actions.

### 1.2 MVP Focus
MVP launches with one industry and geography:
- **Industry:** Cabinet Manufacturing  
- **State:** NSW (Australia)

### 1.3 Strategic Goal
Reduce friction, confusion, and time wasted when starting a business by providing a structured, interactive journey that is easy to follow and easy to maintain (admin-managed content).

---

## 2. Problem Statement
Starting a business requires navigating fragmented information (regulators, permits, insurance, safety, equipment). New founders struggle to understand what to do first, what depends on what, and what “done” looks like. BuildPath solves this by providing a single guided roadmap with progress tracking and actionable steps.

---

## 3. Target Users

### Primary Persona
Trade-based entrepreneur starting a workshop/manufacturing business (e.g., cabinet maker).

### Secondary Persona
Admin/content manager maintaining roadmap content (steps, prerequisites, updates).

---

## 4. Goals and Non-Goals

### 4.1 Goals
- Provide a roadmap that is **interactive**, **dependency-aware**, and **progress-tracked**.
- Keep content **DB-driven** so it can be updated without redeploying.
- Ensure the MVP is **launch-ready** for integrations (Auth, Payments, Webhooks) to avoid rework.

### 4.2 Non-Goals (MVP)
- AI advisor/recommendations engine (post-MVP)
- Multi-state expansion beyond NSW (post-MVP)
- Microservices / Kafka event streaming (post-MVP unless scaling requires it)

---

## 5. Scope

### 5.1 In Scope (MVP)
- Auth0 authentication
- Onboarding wizard: state + industry + business type
- Roadmap dashboard with node map (locked/unlocked/completed)
- Step detail page with checklist + notes + document upload
- Admin CMS for roadmap content
- Stripe test mode checkout + webhook placeholder endpoints
- Audit log for admin edits + “last updated” stamps

### 5.2 Out of Scope (MVP)
- Advanced benchmarking, analytics dashboards, AI-generated insights
- Full compliance/legal verification service

---

## 6. User Journeys

### 6.1 First-Time User Journey
1. Visit landing page → CTA “Start Roadmap”
2. Login / signup
3. Onboarding: choose state, industry, business type
4. Dashboard loads roadmap
5. Open steps → complete tasks → progress increases
6. Upload documents and add notes as needed

### 6.2 Admin Journey
1. Admin logs in
2. Admin creates/edits industries/stages/steps
3. Admin sets prerequisites and ordering
4. Changes reflect immediately in roadmap
5. Audit log captures changes

---

## 7. Functional Requirements (FR)
FR1. User can sign up/login via Auth0 and maintain session.  
FR2. User selects industry + state (MVP: Cabinet Manufacturing, NSW).  
FR3. System generates roadmap (stages + steps) for selection.  
FR4. Step dependency logic supports locked/unlocked/completed.  
FR5. User can mark steps complete; progress % updates.  
FR6. Step detail includes instructions, links, required docs, checklist.  
FR7. User uploads/downloads documents per step (private).  
FR8. Show basic equipment/software recommendations per stage (MVP list).  
FR9. Admin CRUD industries/stages/steps/prerequisites (DB-driven).  
FR10. Admin edits update content without redeploy.  
FR11. Billing placeholder + Stripe test checkout (MVP).  
FR12. Onboarding walkthrough.

**Integration-ready requirement (global):** third-party calls must be implemented through backend routes with placeholders, webhooks, and environment-based credentials so launch does not require re-integration.

---

## 8. Non-Functional Requirements (NFR)
NFR1. Performance: dashboard initial load < 2s typical broadband.  
NFR2. Security: JWT/session validation + RBAC for admin endpoints.  
NFR3. Privacy: user documents private by default; signed URL access.  
NFR4. Reliability: timeouts/retry for external calls; structured error handling.  
NFR5. Availability: 99.5% uptime target for MVP hosting.  
NFR6. Deployability: monolith packaged for container deployment (Cloud Run ready).  
NFR7. Maintainability: clear module boundaries (auth/roadmap/admin/billing).  
NFR8. Auditability: admin edits logged (who/what/when).  
NFR9. Content integrity: “last updated” stamp visible for compliance content.  
NFR10. Cost: sandbox/demo services by default (Stripe test mode).

---

## 9. Technical Constraints and Stack

### 9.1 Selected Stack (MVP)
- **Frontend:** Next.js (App Router) + React components + Tailwind CSS
- **Backend:** Node.js REST API (Express)
- **Auth:** Auth0 (Okta)
- **Payments:** Stripe (Test Mode for MVP)
- **Database:** Supabase (Postgres) preferred; MongoDB alternative
- **Architecture:** Monolith MVP

### 9.2 Implementation References
Step-by-step project setup for React/Vite, Next.js, Tailwind, Node, Auth0, Stripe, Supabase/MongoDB is documented in the implementation guide.

---

## 10. Integrations, API Placeholders, and Webhooks

### 10.1 Integration Principles
- Frontend never calls third-party APIs directly.
- Backend owns integration secrets and implements provider adapters.
- All keys in environment variables with `.env.example`.
- Webhook endpoints exist in MVP with final production shape (signature validation where applicable).

### 10.2 Required Environment Variables (minimum)
- Auth0: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_AUDIENCE`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`
- DB: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or `MONGO_URI`)
- App: `APP_BASE_URL`, `API_BASE_URL`, `WEBHOOK_PUBLIC_URL`

### 10.3 Versioned API Contract (MVP)
All endpoints under `/api/v1` and return `{ success, data, error }`.

**Auth/Profile**
- `GET /api/v1/me`
- `PATCH /api/v1/me`

**Roadmap**
- `GET /api/v1/roadmap`
- `GET /api/v1/steps/:id`
- `POST /api/v1/steps/:id/complete`
- `POST /api/v1/steps/:id/note`

**Documents**
- `POST /api/v1/steps/:id/documents/upload-url`
- `GET /api/v1/steps/:id/documents/:docId/download-url`
- `DELETE /api/v1/steps/:id/documents/:docId`

**Admin**
- `GET/POST/PATCH/DELETE /api/v1/admin/industries`
- `GET/POST/PATCH/DELETE /api/v1/admin/stages`
- `GET/POST/PATCH/DELETE /api/v1/admin/steps`
- `POST /api/v1/admin/steps/:id/prerequisites`
- `GET /api/v1/admin/audit-log`
- `GET /api/v1/admin/webhook-events`

**Payments**
- `POST /api/v1/payments/checkout`
- `GET /api/v1/payments/status`

**Webhooks**
- `POST /webhooks/stripe` (signature validation + event storage)
- `POST /webhooks/provider-placeholder` (future partners)

---

## 11. Epics and Stories (MVP Backlog)

### Epic 1: Foundation & Auth
**Goal:** Secure access with role-based control and dev-ready scaffolding.

- **1.1 Project scaffold + environment setup**  
  AC: Next.js runs locally; Node API runs; `.env.example` created.

- **1.2 Auth0 login/signup integration**  
  AC: login/logout; session persistence; redirect for unauthorised.

- **1.3 RBAC roles (user/admin) enforced**  
  AC: admin routes protected; API validates JWT; deny UI state.

- **1.4 Protected dashboard shell (from Stitch UI)**  
  AC: dashboard requires auth; sidebar + top progress placeholder; loading/error states.

- **1.5 Config + secrets + webhook foundation**  
  AC: webhook placeholder endpoints + integration health endpoints; structured logs.

### Epic 2: Onboarding & User Setup
**Goal:** Capture onboarding selections to personalise roadmap.

- **2.1 Onboarding wizard UI**  
- **2.2 Persist onboarding selections**  
- **2.3 Config bootstrap (MVP NSW Cabinet)**  
- **2.4 User profile API contract (`/me`)**

### Epic 3: Roadmap Engine
**Goal:** Dependency-aware roadmap + progress tracking.

- **3.1 Steps model + seed MVP roadmap**  
- **3.2 Fetch roadmap API**  
- **3.3 Dependency engine**  
- **3.4 Progress tracking endpoints**  
- **3.5 Versioned API + stable response schema**

### Epic 4: Step Detail + Documents
**Goal:** Actionable step details, notes, and secure documents.

- **4.1 Step detail view**  
- **4.2 Step notes**  
- **4.3 Document upload (private)**  
- **4.4 Storage adapter + signed URLs**

### Epic 5: Admin CMS
**Goal:** Maintain roadmap content without redeploying.

- **5.1 Admin auth gate + shell**  
- **5.2 CRUD industries/stages/steps**  
- **5.3 Manage prerequisites + prevent cycles**  
- **5.4 Audit log + publish model**

### Epic 6: Billing + Plan Gating (Stripe)
**Goal:** Test checkout now, launch-ready later without rework.

- **6.1 Billing page UI**  
- **6.2 Stripe test checkout (Node)**  
- **6.3 Stripe webhook endpoint (signature validation + event storage + status update)**

### Epic 7: NFR + Polish
**Goal:** Baseline performance, audit visibility, content recency.

- **7.1 Audit log view**  
- **7.2 “Last updated” stamps**  
- **7.3 Perf + error handling baseline**  
- **7.4 Integration logging + webhook event history**

---

## 12. Success Metrics (MVP)
- Users can complete onboarding and see roadmap.
- Step completion increases progress % correctly.
- Admin can manage steps and prerequisites.
- Stripe test checkout works end-to-end (including webhook receipt).
- First cohort validation: 5–10 users complete at least 30% of roadmap.

---

## 13. Risks and Mitigations
- **Scope creep:** lock MVP epics; push AI and multi-state to Phase 2.  
- **Compliance data accuracy:** include “last updated” and admin workflow.  
- **Integration surprises on launch:** implement placeholders and final-shape webhooks now.  
- **DB tier pausing/inactivity (Supabase free):** use periodic heartbeat/cron or plan upgrade when needed.

---

## 14. Next Steps (BMAD Handoff)
1) Freeze UX outputs into `docs/front-end-spec.md` (screens, components, states, motion rules).  
2) Create `docs/architecture.md` using this PRD.  
3) Run PM checklist then Architect checklist (YOLO recommended).  
4) Shard PRD/Architecture into smaller docs for agent execution.  
5) Execute stories one-by-one (SM → Dev → QA).  
