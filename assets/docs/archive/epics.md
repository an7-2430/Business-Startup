# Epics & Stories — BuildPath (MVP)

**Document status:** Draft v1.0  
**Scope:** MVP (Cabinet Manufacturing, NSW)  
**Architecture:** Monolithic MVP  
**Stack:** Next.js (App Router) + Tailwind, Node.js REST API, Auth0, Stripe (Test Mode), Supabase Postgres (MongoDB optional)

---

## Epic 1 — Foundation & Authentication

### Goal
Enable secure access to the application with role-based restrictions and establish launch-ready integration scaffolding.

### Stories
**1.1 Project scaffold + environment setup**
- **Description:** Create the Next.js frontend and Node.js backend skeleton with consistent env config.
- **Acceptance Criteria:**
  1. Next.js app runs locally and shows landing page.
  2. Node API runs locally and exposes `/health`.
  3. `.env.example` exists for both frontend and backend.

**1.2 Auth0 login/signup integration**
- **Description:** Integrate Auth0 authentication into the frontend and establish session handling.
- **Acceptance Criteria:**
  1. User can login/logout via Auth0.
  2. Session persists across refresh.
  3. Unauthorized users are redirected to login.

**1.3 RBAC roles (user/admin) enforced**
- **Description:** Implement role-based access control for admin routes and privileged endpoints.
- **Acceptance Criteria:**
  1. Admin routes blocked for non-admin users.
  2. API endpoints validate JWT/session.
  3. UI shows “Access denied” state for restricted access.

**1.4 Protected dashboard shell (UI from Stitch)**
- **Description:** Create the dashboard shell aligned with Stitch UI (sidebar + top stats placeholders).
- **Acceptance Criteria:**
  1. Dashboard route requires authentication.
  2. Sidebar + top progress placeholders render.
  3. Loading and error states exist.

**1.5 Config + secrets + webhook foundation**
- **Description:** Add integration scaffolding so launch does not require re-integration.
- **Acceptance Criteria:**
  1. `.env.example` includes placeholders for Auth0, Stripe, DB, Storage, API base URLs.
  2. Node has `/integrations/health` and `/webhooks/health` endpoints.
  3. Requests to integrations include structured logs (request id, provider, status).

---

## Epic 2 — Onboarding & User Setup

### Goal
Collect state/industry/business type and persist it to personalise the roadmap.

### Stories
**2.1 Onboarding wizard UI (Stitch-based)**
- **Acceptance Criteria:**
  1. Wizard has 3 steps: State → Industry → Business Type.
  2. Next/Back navigation works and progress indicator updates.
  3. Validation blocks progression if selection missing.

**2.2 Persist onboarding selections**
- **Acceptance Criteria:**
  1. Selections saved to DB for the logged-in user.
  2. Refresh restores onboarding state or sends to dashboard if complete.
  3. User can edit selections later via Settings.

**2.3 Config bootstrap (MVP NSW Cabinet)**
- **Acceptance Criteria:**
  1. At least one state (NSW) and one industry (Cabinet Manufacturing) available.
  2. Options are DB-driven (no hardcoding in UI).
  3. Invalid combinations are blocked.

**2.4 User profile API contract**
- **Acceptance Criteria:**
  1. `GET /api/v1/me` returns onboarding selections and role.
  2. `PATCH /api/v1/me` updates selections.
  3. Auth required; error schema consistent.

---

## Epic 3 — Roadmap Engine (Steps + Dependencies + Progress)

### Goal
Deliver an interactive roadmap with locked/unlocked rules and accurate progress tracking.

### Stories
**3.1 Steps data model + seed MVP roadmap**
- **Acceptance Criteria:**
  1. DB schema supports stages, steps, prerequisites.
  2. Seed roadmap exists for Cabinet Manufacturing NSW.
  3. Steps include order_index and stage grouping.

**3.2 Fetch roadmap API**
- **Acceptance Criteria:**
  1. `GET /api/v1/roadmap` returns stages + steps for user selection.
  2. Response includes status for each step.
  3. Empty roadmap handled gracefully.

**3.3 Dependency engine (lock/unlock rules)**
- **Acceptance Criteria:**
  1. Step locked until prerequisites completed.
  2. Dependent steps unlock immediately after prereq completion.
  3. Status computed server-side and consistent across clients.

**3.4 Progress tracking**
- **Acceptance Criteria:**
  1. `POST /api/v1/steps/:id/complete` marks completion.
  2. Progress % updates correctly (completed/total).
  3. Dashboard shows progress bar + counts.

**3.5 Versioned API + stable response schema**
- **Acceptance Criteria:**
  1. All endpoints use `/api/v1`.
  2. Responses follow `{ success, data, error }`.
  3. Backward-compatible additions supported.

---

## Epic 4 — Step Detail + Documents

### Goal
Let users view step details, manage notes, and upload required documents securely.

### Stories
**4.1 Step detail view**
- **Acceptance Criteria:**
  1. Step detail page loads by step id.
  2. Shows checklist, resources links, and prerequisites summary.
  3. Shows status and completion CTA.

**4.2 Step notes**
- **Acceptance Criteria:**
  1. Users can create/edit notes per step.
  2. Notes persist and reload correctly.
  3. Notes are private to the user.

**4.3 Document upload (private)**
- **Acceptance Criteria:**
  1. User uploads a document for a step.
  2. Document is private (access controlled).
  3. User can download/delete their document.

**4.4 Storage adapter + signed URLs**
- **Acceptance Criteria:**
  1. Storage adapter abstraction exists.
  2. Upload uses signed URL flow.
  3. Download uses signed URL flow.

---

## Epic 5 — Admin CMS (Industries/Steps/Prereqs)

### Goal
Enable admin to manage roadmap content without redeploy and keep content fresh.

### Stories
**5.1 Admin auth gate + basic admin shell**
- **Acceptance Criteria:**
  1. `/admin` only accessible by admin role.
  2. Non-admin blocked with access denied.
  3. UI follows Stitch theme.

**5.2 CRUD industries/stages/steps**
- **Acceptance Criteria:**
  1. Admin can create/edit/delete industries.
  2. Admin can create/edit/delete stages and steps.
  3. Admin can reorder steps and assign stages.

**5.3 Manage prerequisites + prevent cycles**
- **Acceptance Criteria:**
  1. Admin can assign prerequisites.
  2. System blocks circular dependencies.
  3. Roadmap reflects changes immediately.

**5.4 Audit log + publish model**
- **Acceptance Criteria:**
  1. Admin edits recorded with who/what/when.
  2. “Last updated” stamp updates after edits.
  3. Audit log view exists (basic table).

---

## Epic 6 — Billing + Plan Gating (Stripe)

### Goal
Prepare billing flows now so production launch is configuration-only.

### Stories
**6.1 Billing page UI**
- **Acceptance Criteria:**
  1. Billing page shows pricing card(s).
  2. Upgrade button starts checkout.
  3. Success/cancel states present.

**6.2 Stripe test checkout (Node)**
- **Acceptance Criteria:**
  1. Node creates Stripe checkout session in test mode.
  2. Frontend redirects to Stripe checkout.
  3. Payment status endpoint exists (`GET /api/v1/payments/status`).

**6.3 Stripe webhook endpoints (final shape)**
- **Acceptance Criteria:**
  1. `/webhooks/stripe` validates signature.
  2. Stores events in `webhook_events`.
  3. Updates user billing status in DB.

---

## Epic 7 — NFR + Polish (Performance, Logging, Content Recency)

### Goal
Deliver baseline quality: performance, observability, and content trust.

### Stories
**7.1 Audit log view**
- **Acceptance Criteria:**
  1. Admin can view audit log entries.
  2. Filters by date/entity supported (basic).
  3. Shows who/what/when.

**7.2 “Last updated” stamps**
- **Acceptance Criteria:**
  1. Each step shows last updated date.
  2. Roadmap shows overall last updated date.
  3. Updates automatically when admin edits occur.

**7.3 Perf + error handling baseline**
- **Acceptance Criteria:**
  1. Loading skeletons on dashboard/step pages.
  2. Toast notifications for errors.
  3. API timeouts set for external calls.

**7.4 Integration logging + webhook event history**
- **Acceptance Criteria:**
  1. Integration calls logged with provider + request id.
  2. Webhook event history visible in admin panel.
  3. Failed webhook events clearly flagged.

---

## Global API Surface (MVP)

### Profile
- `GET /api/v1/me`
- `PATCH /api/v1/me`

### Roadmap & Steps
- `GET /api/v1/roadmap`
- `GET /api/v1/steps/:id`
- `POST /api/v1/steps/:id/complete`
- `POST /api/v1/steps/:id/note`

### Documents
- `POST /api/v1/steps/:id/documents/upload-url`
- `GET /api/v1/steps/:id/documents/:docId/download-url`
- `DELETE /api/v1/steps/:id/documents/:docId`

### Admin
- `GET/POST/PATCH/DELETE /api/v1/admin/industries`
- `GET/POST/PATCH/DELETE /api/v1/admin/stages`
- `GET/POST/PATCH/DELETE /api/v1/admin/steps`
- `POST /api/v1/admin/steps/:id/prerequisites`
- `GET /api/v1/admin/audit-log`
- `GET /api/v1/admin/webhook-events`

### Payments
- `POST /api/v1/payments/checkout`
- `GET /api/v1/payments/status`

### Webhooks
- `POST /webhooks/stripe`
- `POST /webhooks/provider-placeholder`
- `GET /webhooks/health`
- `GET /integrations/health`
