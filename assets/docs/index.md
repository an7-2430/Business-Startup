# BuildPath MVP — Documentation Index

> Quick-scan index for agent and human navigation. All paths are relative to `assets/docs/`.
> Generated: 2026-03-07

---

## 📄 Root Files

- **[project-breif.md](./project-breif.md)** — Original project brief, vision, personas, MVP scope, phased strategy
- **[front-end-spec.md](./front-end-spec.md)** — UI/UX screens, components, motion rules, responsiveness guidelines
- **[api-contracts.md](./api-contracts.md)** — Versioned REST API contract, all endpoints, request/response shapes
- **[data-model.md](./data-model.md)** — Postgres schema tables, relationships, enums, computed logic notes
- **[project_stack_doc.md](./project_stack_doc.md)** — Stack setup guide with commands, snippets, and integration patterns
- **[setup_code.md](./setup_code.md)** — Architecture rationale, stack comparisons, integration principles, code examples
- **[pm-checklist-results.md](./pm-checklist-results.md)** — PM checklist placeholder, pending execution results
- **[architect-checklist-results.md](./architect-checklist-results.md)** — Architect checklist placeholder, pending execution results

---

## 📁 PRD/ — Product Requirements Document (Sharded)

> Full PRD sharded by section. Load only what the task requires.

- **[index.md](./PRD/index.md)** — PRD table of contents and full section map
- **[1-overview.md](./PRD/1-overview.md)** — Product vision, MVP focus, strategic goal
- **[2-problem-statement.md](./PRD/2-problem-statement.md)** — Core problem BuildPath solves for founders
- **[3-target-users.md](./PRD/3-target-users.md)** — Primary (trade entrepreneur) and secondary (admin) personas
- **[4-goals-and-non-goals.md](./PRD/4-goals-and-non-goals.md)** — MVP goals and explicit out-of-scope items
- **[5-scope.md](./PRD/5-scope.md)** — In-scope features and out-of-scope exclusions for MVP
- **[6-user-journeys.md](./PRD/6-user-journeys.md)** — First-time user and admin journey flows
- **[7-functional-requirements-fr.md](./PRD/7-functional-requirements-fr.md)** — All FR1–FR12 functional requirements
- **[8-non-functional-requirements-nfr.md](./PRD/8-non-functional-requirements-nfr.md)** — NFR1–NFR10: performance, security, reliability, cost
- **[9-technical-constraints-and-stack.md](./PRD/9-technical-constraints-and-stack.md)** — Chosen MVP stack and implementation references
- **[10-integrations-api-placeholders-and-webhooks.md](./PRD/10-integrations-api-placeholders-and-webhooks.md)** — Integration principles, env vars, versioned API contract
- **[11-epics-and-stories-mvp-backlog.md](./PRD/11-epics-and-stories-mvp-backlog.md)** — Summary of all 7 epics and their stories
- **[12-success-metrics-mvp.md](./PRD/12-success-metrics-mvp.md)** — MVP success criteria and first cohort validation targets
- **[13-risks-and-mitigations.md](./PRD/13-risks-and-mitigations.md)** — Scope creep, compliance accuracy, integration, DB risks
- **[14-next-steps-bmad-handoff.md](./PRD/14-next-steps-bmad-handoff.md)** — BMAD handoff sequence: spec → architecture → shard → execute

---

## 📁 epics/ — Epics & Stories (Sharded)

> Each epic is a standalone file for targeted agent context loading.

- **[index.md](./epics/index.md)** — Epics table of contents and story summary map
- **[epic-1-foundation-authentication.md](./epics/epic-1-foundation-authentication.md)** — Stories 1.1–1.5: scaffold, Auth0, RBAC, dashboard shell, webhook foundation
- **[epic-2-onboarding-user-setup.md](./epics/epic-2-onboarding-user-setup.md)** — Stories 2.1–2.4: wizard UI, persist selections, config bootstrap, profile API
- **[epic-3-roadmap-engine-steps-dependencies-progress.md](./epics/epic-3-roadmap-engine-steps-dependencies-progress.md)** — Stories 3.1–3.5: data model, roadmap API, dependency engine, progress tracking
- **[epic-4-step-detail-documents.md](./epics/epic-4-step-detail-documents.md)** — Stories 4.1–4.4: step detail view, notes, document upload, signed URLs
- **[epic-5-admin-cms-industriesstepsprereqs.md](./epics/epic-5-admin-cms-industriesstepsprereqs.md)** — Stories 5.1–5.4: admin auth, CRUD, prerequisite management, audit log
- **[epic-6-billing-plan-gating-stripe.md](./epics/epic-6-billing-plan-gating-stripe.md)** — Stories 6.1–6.3: billing UI, Stripe checkout, webhook validation
- **[epic-7-nfr-polish-performance-logging-content-recency.md](./epics/epic-7-nfr-polish-performance-logging-content-recency.md)** — Stories 7.1–7.4: audit view, last-updated stamps, perf baseline, integration logging
- **[global-api-surface-mvp.md](./epics/global-api-surface-mvp.md)** — Full MVP API surface: profile, roadmap, documents, admin, payments, webhooks

---

## 📁 architecture/ — Architecture Document (Sharded)

> Monolithic MVP architecture sharded by concern. Load only the relevant section per task.

- **[index.md](./architecture/index.md)** — Architecture table of contents and section map
- **[1-high-level-architecture.md](./architecture/1-high-level-architecture.md)** — Core flow: Next.js → Node.js → Supabase, component diagram
- **[2-key-architectural-decisions.md](./architecture/2-key-architectural-decisions.md)** — Monolith rationale, integration readiness, versioned API decision
- **[3-frontend-architecture-nextjs-app-router.md](./architecture/3-frontend-architecture-nextjs-app-router.md)** — App Router structure, UI state model, React Flow roadmap rendering
- **[4-backend-architecture-nodejs-rest.md](./architecture/4-backend-architecture-nodejs-rest.md)** — Service structure, middleware stack, adapter pattern for integrations
- **[5-api-surface-mvp.md](./architecture/5-api-surface-mvp.md)** — All API routes: profile, roadmap, documents, admin, payments, webhooks
- **[6-data-model-supabase-postgres.md](./architecture/6-data-model-supabase-postgres.md)** — Full Postgres schema: tables, columns, PKs/FKs, RLS guidance
- **[7-roadmap-logic-server-side.md](./architecture/7-roadmap-logic-server-side.md)** — Step lock/unlock algorithm and progress % computation
- **[8-authentication-authorization.md](./architecture/8-authentication-authorization.md)** — Auth0 JWT flow, RBAC enforcement for user and admin roles
- **[9-payments-webhooks-stripe.md](./architecture/9-payments-webhooks-stripe.md)** — Stripe checkout flow and webhook signature validation pattern
- **[10-documents-storage.md](./architecture/10-documents-storage.md)** — Supabase Storage, private bucket, signed URL upload/download pattern
- **[11-observability-logging-error-handling.md](./architecture/11-observability-logging-error-handling.md)** — Structured logging fields, standard error response shape
- **[12-deployment-architecture.md](./architecture/12-deployment-architecture.md)** — Environments, Vercel/Cloud Run hosting, GitHub Actions CI/CD
- **[13-configuration-envexample.md](./architecture/13-configuration-envexample.md)** — All required frontend and backend environment variables
- **[14-future-scalability-post-mvp.md](./architecture/14-future-scalability-post-mvp.md)** — When to introduce queues, Redis/BullMQ, Kafka post-MVP
- **[15-open-questions-for-next-iteration.md](./architecture/15-open-questions-for-next-iteration.md)** — Unresolved: roadmap content, plan tiers, doc types, publish workflow

---

## 📁 archive/ — Archived Originals

> Pre-shard originals kept for reference. **Do not use for active agent context.**

- **[PRD.md](./archive/PRD.md)** — Original monolithic PRD (superseded by PRD/ shards)
- **[epics.md](./archive/epics.md)** — Original monolithic epics doc (superseded by epics/ shards)
- **[architecture.md](./archive/architecture.md)** — Original monolithic architecture doc (superseded by architecture/ shards)

---

## 🗂️ Context Loading Guide for Agents

| Task | Load These Files |
|---|---|
| Understand the product | `project-breif.md` + `PRD/1-overview.md` + `PRD/3-target-users.md` |
| Implement any Epic 1 story | `epic-1-foundation-authentication.md` + `architecture/4-backend-architecture-nodejs-rest.md` + `architecture/8-authentication-authorization.md` |
| Implement any Epic 3 story | `epic-3-roadmap-engine-steps-dependencies-progress.md` + `architecture/6-data-model-supabase-postgres.md` + `architecture/7-roadmap-logic-server-side.md` |
| Implement any Epic 4 story | `epic-4-step-detail-documents.md` + `architecture/10-documents-storage.md` + `api-contracts.md` |
| Work on frontend UI | `front-end-spec.md` + `architecture/3-frontend-architecture-nextjs-app-router.md` |
| Work on Admin CMS | `epic-5-admin-cms-industriesstepsprereqs.md` + `architecture/4-backend-architecture-nodejs-rest.md` + `api-contracts.md` |
| Work on Billing/Stripe | `epic-6-billing-plan-gating-stripe.md` + `architecture/9-payments-webhooks-stripe.md` |
| Check API shape | `api-contracts.md` + `epics/global-api-surface-mvp.md` |
| Check DB schema | `data-model.md` + `architecture/6-data-model-supabase-postgres.md` |
| Deployment / config | `architecture/12-deployment-architecture.md` + `architecture/13-configuration-envexample.md` |
