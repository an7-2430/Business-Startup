# 5. API Surface (MVP)

## 5.1 Profile
- `GET /api/v1/me`
- `PATCH /api/v1/me`

## 5.2 Roadmap & Steps
- `GET /api/v1/roadmap`
- `GET /api/v1/steps/:id`
- `POST /api/v1/steps/:id/complete`
- `POST /api/v1/steps/:id/note`

## 5.3 Documents (Signed URL pattern)
- `POST /api/v1/steps/:id/documents/upload-url`
- `GET /api/v1/steps/:id/documents/:docId/download-url`
- `DELETE /api/v1/steps/:id/documents/:docId`

## 5.4 Admin
- `GET/POST/PATCH/DELETE /api/v1/admin/industries`
- `GET/POST/PATCH/DELETE /api/v1/admin/stages`
- `GET/POST/PATCH/DELETE /api/v1/admin/steps`
- `POST /api/v1/admin/steps/:id/prerequisites`
- `GET /api/v1/admin/audit-log`
- `GET /api/v1/admin/webhook-events`

## 5.5 Payments
- `POST /api/v1/payments/checkout`
- `GET /api/v1/payments/status`

## 5.6 Webhooks
- `POST /webhooks/stripe`
- `POST /webhooks/provider-placeholder`
- `GET /webhooks/health`
- `GET /integrations/health`

---
