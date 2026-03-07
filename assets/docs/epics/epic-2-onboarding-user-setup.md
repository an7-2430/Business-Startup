# Epic 2 — Onboarding & User Setup

## Goal
Collect state/industry/business type and persist it to personalise the roadmap.

## Stories
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
