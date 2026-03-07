# 11. Epics and Stories (MVP Backlog)

## Epic 1: Foundation & Auth
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

## Epic 2: Onboarding & User Setup
**Goal:** Capture onboarding selections to personalise roadmap.

- **2.1 Onboarding wizard UI**  
- **2.2 Persist onboarding selections**  
- **2.3 Config bootstrap (MVP NSW Cabinet)**  
- **2.4 User profile API contract (`/me`)**

## Epic 3: Roadmap Engine
**Goal:** Dependency-aware roadmap + progress tracking.

- **3.1 Steps model + seed MVP roadmap**  
- **3.2 Fetch roadmap API**  
- **3.3 Dependency engine**  
- **3.4 Progress tracking endpoints**  
- **3.5 Versioned API + stable response schema**

## Epic 4: Step Detail + Documents
**Goal:** Actionable step details, notes, and secure documents.

- **4.1 Step detail view**  
- **4.2 Step notes**  
- **4.3 Document upload (private)**  
- **4.4 Storage adapter + signed URLs**

## Epic 5: Admin CMS
**Goal:** Maintain roadmap content without redeploying.

- **5.1 Admin auth gate + shell**  
- **5.2 CRUD industries/stages/steps**  
- **5.3 Manage prerequisites + prevent cycles**  
- **5.4 Audit log + publish model**

## Epic 6: Billing + Plan Gating (Stripe)
**Goal:** Test checkout now, launch-ready later without rework.

- **6.1 Billing page UI**  
- **6.2 Stripe test checkout (Node)**  
- **6.3 Stripe webhook endpoint (signature validation + event storage + status update)**

## Epic 7: NFR + Polish
**Goal:** Baseline performance, audit visibility, content recency.

- **7.1 Audit log view**  
- **7.2 “Last updated” stamps**  
- **7.3 Perf + error handling baseline**  
- **7.4 Integration logging + webhook event history**

---
