# BuildPath MVP — Task Tracker

## Epic 1 — Foundation & Authentication ✅
- [x] 1.1 Project scaffold + environment setup
- [x] 1.2 Auth0 login/signup integration
- [x] 1.3 RBAC roles (user/admin) enforced
- [x] 1.4 Protected dashboard shell
- [x] 1.5 Config + secrets + webhook foundation

## Epic 2 — Onboarding & User Setup ✅
- [x] 2.3 DB schema + migration SQL (9 tables, RLS, triggers, indexes)
- [x] 2.3 Seed data: NSW + Cabinet Manufacturing (7 stages, 18 steps, 6 prerequisites)
- [x] 2.4 Profile API — GET /me (with upsert), PATCH /me
- [x] 2.1 Onboarding wizard UI (3-step: State → Industry → Business Type)
- [x] 2.2 Dashboard checks onboarding_complete, redirects to /onboarding if not
- [x] ⏳ **Database Action Completed**: Ran migration + seed SQL in Supabase via MCP

## Epic 3 — Roadmap Engine ✅
- [x] 3.1 Steps data model + seed MVP roadmap
- [x] 3.2 Fetch roadmap API (dependency engine + status rules)
- [x] 3.3 Dependency engine (lock/unlock rules)
- [x] 3.4 Progress tracking (completion endpoints & UI progress bars)
- [x] 3.5 Versioned API + stable response schema

## Epic 4 — Step Detail + Documents ✅
- [x] 4.1 Step detail view (UI modal built in dashboard)
- [x] 4.2 Step notes (create/edit notes per step)
- [x] 4.3 Document upload API (private to user)
- [x] 4.4 Storage adapter + signed URLs (upload/download via Supabase Storage)

## Epic 5 — Admin CMS ✅
- [x] 5.1 Admin auth gate + admin shell (`/admin`)
- [x] 5.2 CRUD industries/stages/steps (`/api/v1/admin/*`)
- [x] 5.3 Manage prerequisites + prevent circular dependencies
- [x] 5.4 Audit log recording & viewing

## Epic 6 — Billing + Plan Gating (Stripe)
- [ ] 6.1 Billing page UI
- [ ] 6.2 Stripe test checkout
- [ ] 6.3 Stripe webhook endpoints

## Epic 7 — NFR + Polish
- [ ] 7.1 Audit log view (UI built, needs data)
- [ ] 7.2 "Last updated" stamps (implemented in DB triggers)
- [ ] 7.3 Perf + error handling baseline
- [ ] 7.4 Integration logging + webhook event history (UI built)

## Epic 8 — 7-Stage Guided Setup Workflow (New Architecture)
- [x] 8.1 Database Schema Update
  - [x] Create `user_business_profiles` table to store detailed form data for stages 2-7.
  - [x] Add JSONB columns for flexible data collection.
- [x] 8.2 API Routes
  - [x] `GET /api/v1/setup` - Fetch user's saved data and completion status for all 7 stages.
  - [x] `PATCH /api/v1/setup/:stage` - Endpoint to save draft or complete specific stages with validation.
- [x] 8.3 Frontend Forms & UI (Using Google Stitch Designs)
  - [x] Redesign the main dashboard to guide users into the active stage setup forms.
  - [x] Implement Stage 1: Business Identity (Update existing Onboarding).
  - [x] Implement Stage 2: Registration & Legal Basics form.
  - [x] Implement Stage 3: Location, Premises & Approvals form.
  - [x] Implement Stage 4: Compliance, Insurance & Safety form.
  - [x] Implement Stage 5: Equipment, Operations & Workflow form.
  - [x] Implement Stage 6: Digital Tools, Finance & Payments form.
  - [x] Implement Stage 7: Launch Readiness & Tracking form.
  - [ ] Integrate file uploads via Supabase Storage for document requirements.
- [x] 8.4 Admin Review Structure
  - [x] Update `/admin` backend to fetch `user_business_profiles`.
  - [x] Create Admin UI view to review user-submitted setup data and documents stage-by-stage.

## Epic 9 — High-Fidelity UI Refinement (Stitch Alignment) ✅
- [x] 9.1 Align Theme Config ([tailwind.config.js](file:///j:/Projects/Umar_bhai_project/BuildPath_Local_UI/frontend/tailwind.config.js) colors & fonts)
- [x] 9.2 Global Styles Refinement ([globals.css](file:///j:/Projects/Umar_bhai_project/BuildPath_Local_UI/frontend/app/globals.css) glassmorphism & gradients)
- [x] 9.3 Font Integration (Space Grotesk & Material Symbols Outlined)
- [x] 9.4 Exact Dashboard Reconstruction (Stitch Questline HTML parity)
- [x] 9.5 Icon & Symbol Resolution (Fixed missing/broken icons)
- [x] 9.6 Onboarding & Setup UI Parity (Consistent brand application)
- [x] 9.7 Fix Bright Yellow UI Typo (Applied theme dark blue to .glass-card)
- [ ] 9.8 Advanced Animations & Micro-interactions

## Epic 10: Premium UI Overhaul (Stitch Alignment)
- [ ] 10.1 Implement "Unlock Pro" Billing UI ([app/dashboard/billing/page.js](file:///j:/Projects/Umar_bhai_project/BuildPath_Local_UI/frontend/app/dashboard/billing/page.js))
- [ ] 10.2 Create Upgrade Success Page (`app/dashboard/billing/success/page.js`)
- [ ] 10.3 Refine Step Detail UI (`app/dashboard/setup/[stage]/page.js`)
- [ ] 10.4 Redesign Admin Industries Dashboard ([app/admin/page.js](file:///j:/Projects/Umar_bhai_project/BuildPath_Local_UI/frontend/app/admin/page.js))
- [ ] 10.5 Add global utility styles for new designs ([globals.css](file:///j:/Projects/Umar_bhai_project/BuildPath_Local_UI/frontend/app/globals.css))
