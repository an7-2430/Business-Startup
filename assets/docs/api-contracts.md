# API Contracts — BuildPath (MVP)

**Version:** v1  
**Base path:** `/api/v1`  

## Response Envelope
```json
{ "success": true, "data": {}, "error": null }
```

---

## 1. Authentication / Profile

### GET /me
Returns current authenticated user profile.

### PATCH /me
Updates onboarding-related profile fields.

**Body**
```json
{
  "state": "NSW",
  "industryId": "uuid",
  "businessType": "sole-trader"
}
```

---

## 2. Roadmap

### GET /roadmap
Returns stages and steps for the current user profile.

### GET /steps/:id
Returns detail for a single step.

### POST /steps/:id/complete
Marks a step as completed for the current user.

### POST /steps/:id/note
Creates or updates the user note for a step.

---

## 3. Documents

### POST /steps/:id/documents/upload-url
Returns signed upload URL and metadata target.

### GET /steps/:id/documents/:docId/download-url
Returns signed download URL.

### DELETE /steps/:id/documents/:docId
Deletes an uploaded document.

---

## 4. Admin

### Industries
- `GET /admin/industries`
- `POST /admin/industries`
- `PATCH /admin/industries/:id`
- `DELETE /admin/industries/:id`

### Stages
- `GET /admin/stages`
- `POST /admin/stages`
- `PATCH /admin/stages/:id`
- `DELETE /admin/stages/:id`

### Steps
- `GET /admin/steps`
- `POST /admin/steps`
- `PATCH /admin/steps/:id`
- `DELETE /admin/steps/:id`

### Prerequisites
- `POST /admin/steps/:id/prerequisites`

### Audit & Webhook Events
- `GET /admin/audit-log`
- `GET /admin/webhook-events`

---

## 5. Payments

### POST /payments/checkout
Creates Stripe checkout session.

### GET /payments/status
Returns current user billing status.

---

## 6. Webhooks

### POST /webhooks/stripe
Receives Stripe events.

### POST /webhooks/provider-placeholder
Reserved for future integrations.

---

## 7. Error Shape

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Industry is required"
  }
}
```
