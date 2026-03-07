# Epic 1 — Foundation & Authentication

## Goal
Enable secure access to the application with role-based restrictions and establish launch-ready integration scaffolding.

## Stories
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
