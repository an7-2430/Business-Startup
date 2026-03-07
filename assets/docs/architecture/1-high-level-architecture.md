# 1. High-Level Architecture

## 1.1 Core Flow
**Frontend (Next.js)** → **Backend (Node.js REST)** → **Database (Supabase Postgres)**  
Frontend calls only the backend. Backend owns secrets and third-party integrations.

## 1.2 Component Diagram (Logical)

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
