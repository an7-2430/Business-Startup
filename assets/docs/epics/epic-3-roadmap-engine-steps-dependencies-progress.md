# Epic 3 — Roadmap Engine (Steps + Dependencies + Progress)

## Goal
Deliver an interactive roadmap with locked/unlocked rules and accurate progress tracking.

## Stories
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
