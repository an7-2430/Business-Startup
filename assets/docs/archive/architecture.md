# Architecture — BuildPath Business Setup Platform (MVP)

**Document status:** Draft v1.0  
**Project type:** Full-stack web application (UI-heavy)  
**Architecture style:** Monolithic (MVP)  
**Primary stack:** Next.js (App Router) + Tailwind, Node.js REST API, Supabase (Postgres), Auth0, Stripe (Test Mode)  
**Alternatives supported:** MongoDB Atlas (DB), Supabase Auth (Auth)  

---

## 1. High-Level Architecture

### 1.1 Core Flow
**Frontend (Next.js)** → **Backend (Node.js REST)** → **Database (Supabase Postgres)**  
Frontend calls only the backend. Backend owns secrets and third-party integrations.

### 1.2 Component Diagram (Logical)

- **Web Client (Next.js)**
  - Landing (SEO)
  - Auth screens (Auth0)
  - Onboarding wizard
  - Dashboard (Roadmap Map)
  - Step Detail
  - Admin Panel
  - Billing

- **API Server (Node.js)**
  - Auth validation + RBAC
  - Roadmap engine
  - Step progress
  - Documents (signed URL generation)
  - Admin CRUD + audit
  - Payments + webhooks
  - Integrations layer (provider adapters)

- **Data Layer**
  - Supabase Postgres (primary)
  - Supabase Storage (documents)
  - Optional: MongoDB Atlas (alternative persistence)

- **Third-Party Services**
  - Auth0 (Okta)
  - Stripe
  - Future: Email/SMS/Banking APIs (placeholders)

---

## 2. Key Architectural Decisions

### 2.1 Monolith for MVP
Chosen to reduce complexity and speed delivery. All modules live in a single backend service and a single frontend app.

### 2.2 Integration Readiness
All third-party credentials are environment-based and all webhooks exist in MVP with production-valid shapes to avoid re-integration at launch.

### 2.3 Versioned API
All business endpoints are under `/api/v1` with a stable response envelope:
```json
{ "success": true, "data": { }, "error": null }
```

---

## 3. Frontend Architecture (Next.js App Router)

### 3.1 Project Structure (Suggested)
```
/app
  / (landing pages)
  /login
  /onboarding
  /dashboard
  /steps/[id]
  /admin
  /billing
/components
  /ui (buttons, cards, modals, toasts)
  /roadmap (React Flow nodes/edges)
  /forms
/lib
  apiClient.ts (fetch wrapper)
  auth.ts (session helpers)
  constants.ts
/styles
```

### 3.2 UI State Model
- **Step status:** locked | unlocked | completed
- **Progress:** completed_count / total_count → percentage
- **UX patterns:** loading skeletons, toasts, error boundaries

### 3.3 Roadmap Map Rendering
- Use React Flow (or equivalent) for node-based roadmap.
- Nodes render status via color + icon.
- Clicking node opens Step Detail.
- Map supports zoom/pan; mobile uses scroll container + simplified controls.

---

## 4. Backend Architecture (Node.js REST)

### 4.1 Service Structure (Suggested)
```
/src
  /config (env, constants)
  /middleware (auth, rbac, error handler)
  /modules
    /profile
    /onboarding
    /roadmap
    /steps
    /documents
    /admin
    /payments
    /webhooks
    /integrations
  /utils (logger, validation, http client)
  server.ts
```

### 4.2 Core Middleware
- **Auth middleware:** verifies Auth0 JWT / session token
- **RBAC middleware:** checks roles (admin)
- **Validation:** schema validation for request bodies
- **Error handler:** standardized errors + logging

### 4.3 Integrations Layer (Adapter Pattern)
All third-party calls go through a provider adapter to keep switching costs low:
- `integrations/auth0/*`
- `integrations/stripe/*`
- `integrations/storage/*`

---

## 5. API Surface (MVP)

### 5.1 Profile
- `GET /api/v1/me`
- `PATCH /api/v1/me`

### 5.2 Roadmap & Steps
- `GET /api/v1/roadmap`
- `GET /api/v1/steps/:id`
- `POST /api/v1/steps/:id/complete`
- `POST /api/v1/steps/:id/note`

### 5.3 Documents (Signed URL pattern)
- `POST /api/v1/steps/:id/documents/upload-url`
- `GET /api/v1/steps/:id/documents/:docId/download-url`
- `DELETE /api/v1/steps/:id/documents/:docId`

### 5.4 Admin
- `GET/POST/PATCH/DELETE /api/v1/admin/industries`
- `GET/POST/PATCH/DELETE /api/v1/admin/stages`
- `GET/POST/PATCH/DELETE /api/v1/admin/steps`
- `POST /api/v1/admin/steps/:id/prerequisites`
- `GET /api/v1/admin/audit-log`
- `GET /api/v1/admin/webhook-events`

### 5.5 Payments
- `POST /api/v1/payments/checkout`
- `GET /api/v1/payments/status`

### 5.6 Webhooks
- `POST /webhooks/stripe`
- `POST /webhooks/provider-placeholder`
- `GET /webhooks/health`
- `GET /integrations/health`

---

## 6. Data Model (Supabase Postgres)

### 6.1 Tables (Minimum)
**users**
- id (uuid, pk)
- auth_provider_id (text) — Auth0 user id
- email (text)
- role (text: user/admin)
- state (text)
- industry_id (uuid, fk)
- business_type (text)
- created_at, updated_at

**industries**
- id (uuid, pk)
- name (text)
- active (bool)
- created_at, updated_at

**stages**
- id (uuid, pk)
- industry_id (uuid, fk)
- title (text)
- order_index (int)
- created_at, updated_at

**steps**
- id (uuid, pk)
- stage_id (uuid, fk)
- title (text)
- description (text)
- order_index (int)
- checklist_json (jsonb) — checklist items
- resources_json (jsonb) — links/resources
- last_updated_at (timestamp)
- created_at, updated_at

**step_prerequisites**
- step_id (uuid, fk -> steps.id)
- prerequisite_step_id (uuid, fk -> steps.id)
- primary key (step_id, prerequisite_step_id)

**user_steps**
- user_id (uuid, fk -> users.id)
- step_id (uuid, fk -> steps.id)
- status (text: locked/unlocked/completed)
- completed_at (timestamp, nullable)
- note (text, nullable)
- created_at, updated_at
- primary key (user_id, step_id)

**documents**
- id (uuid, pk)
- user_id (uuid, fk)
- step_id (uuid, fk)
- storage_path (text)
- filename (text)
- mime_type (text)
- created_at

**audit_log**
- id (uuid, pk)
- admin_user_id (uuid, fk)
- entity_type (text)
- entity_id (uuid)
- action (text: create/update/delete)
- diff_json (jsonb)
- created_at

**webhook_events**
- id (uuid, pk)
- provider (text) — stripe, placeholder
- event_type (text)
- payload_json (jsonb)
- processed (bool)
- processed_at (timestamp)
- created_at

### 6.2 Row Level Security (RLS) Guidance
- Users can read/write only their own `user_steps` and `documents`.
- Admin role can manage industries/stages/steps and view audit/webhook events.

---

## 7. Roadmap Logic (Server-Side)

### 7.1 Step Status Computation
For a given user + roadmap:
- Default all steps to **locked**
- For steps with **no prerequisites** → set to **unlocked**
- For steps whose prerequisites are **all completed** → set to **unlocked**
- Completed steps remain **completed**

Status must be computed server-side to ensure consistency across devices.

### 7.2 Progress Computation
- `progress_percent = completed_steps / total_steps * 100`
- Provide counts for UI: completed, total, remaining

---

## 8. Authentication & Authorization

### 8.1 Auth0
- Frontend uses Auth0 login.
- Backend validates JWT on each request.
- Roles:
  - `user`: standard access
  - `admin`: admin endpoints + CMS

### 8.2 RBAC Enforcement
- Middleware checks role for `/api/v1/admin/*` routes.
- Admin UI routes in Next.js also require role checks to prevent navigation leaks.

---

## 9. Payments & Webhooks (Stripe)

### 9.1 Stripe Checkout (Test Mode in MVP)
- Backend creates checkout session.
- Frontend redirects to Stripe-hosted checkout.
- After success, Stripe triggers webhook.

### 9.2 Webhook Validation
- `/webhooks/stripe` validates signature using `STRIPE_WEBHOOK_SECRET`.
- Store raw event payload into `webhook_events` for audit + replay capability.
- Update user billing status in `users` table (or separate `subscriptions` table if expanded).

---

## 10. Documents & Storage

### 10.1 Storage Choice
- MVP: Supabase Storage
- Pattern: signed URLs for upload/download

### 10.2 Security
- Private bucket
- Signed URLs generated by backend only
- Metadata stored in `documents` table

---

## 11. Observability, Logging, Error Handling

### 11.1 Logging
- Structured logs: request_id, user_id (if available), route, status, latency
- Integration logs include provider and external status codes

### 11.2 Error Handling
- Standard error responses with consistent shape:
```json
{ "success": false, "data": null, "error": { "code": "X", "message": "..." } }
```

---

## 12. Deployment Architecture

### 12.1 Environments
- Development
- Staging
- Production

### 12.2 Hosting (Recommended)
- **Frontend:** Vercel (or Cloud Run)
- **Backend:** Google Cloud Run (container)
- **Database:** Supabase hosted Postgres
- **Storage:** Supabase Storage

### 12.3 CI/CD (Suggested)
- GitHub Actions:
  - lint/test
  - build
  - deploy to staging on merge
  - deploy to production on tag/release

---

## 13. Configuration (.env.example)

### 13.1 Frontend
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_AUTH0_DOMAIN`
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`

### 13.2 Backend
- `PORT`
- `APP_BASE_URL`
- `API_BASE_URL`
- `WEBHOOK_PUBLIC_URL`
- `AUTH0_DOMAIN`
- `AUTH0_AUDIENCE`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`

---

## 14. Future Scalability (Post-MVP)

### 14.1 When to Add a Queue or Kafka
Introduce background processing only when needed:
- high volume events (emails, analytics)
- heavy jobs (imports, file processing)
- multiple services

Preferred stepping stone before Kafka:
- lightweight queue (Redis/BullMQ)
- cron jobs for maintenance tasks

---

## 15. Open Questions (for next iteration)
- Final roadmap content for Cabinet Manufacturing NSW (steps list and prerequisites)
- Plan tiers and gating rules (what is free vs premium)
- Document types required per step (PDF, images, IDs, forms)
- Admin publishing workflow (immediate publish vs draft/publish states)
