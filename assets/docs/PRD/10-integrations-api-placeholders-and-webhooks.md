# 10. Integrations, API Placeholders, and Webhooks

## 10.1 Integration Principles
- Frontend never calls third-party APIs directly.
- Backend owns integration secrets and implements provider adapters.
- All keys in environment variables with `.env.example`.
- Webhook endpoints exist in MVP with final production shape (signature validation where applicable).

## 10.2 Required Environment Variables (minimum)
- Auth0: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_AUDIENCE`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`
- DB: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or `MONGO_URI`)
- App: `APP_BASE_URL`, `API_BASE_URL`, `WEBHOOK_PUBLIC_URL`

## 10.3 Versioned API Contract (MVP)
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
