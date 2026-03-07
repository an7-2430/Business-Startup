# Epic 6 — Billing + Plan Gating (Stripe)

## Goal
Prepare billing flows now so production launch is configuration-only.

## Stories
**6.1 Billing page UI**
- **Acceptance Criteria:**
  1. Billing page shows pricing card(s).
  2. Upgrade button starts checkout.
  3. Success/cancel states present.

**6.2 Stripe test checkout (Node)**
- **Acceptance Criteria:**
  1. Node creates Stripe checkout session in test mode.
  2. Frontend redirects to Stripe checkout.
  3. Payment status endpoint exists (`GET /api/v1/payments/status`).

**6.3 Stripe webhook endpoints (final shape)**
- **Acceptance Criteria:**
  1. `/webhooks/stripe` validates signature.
  2. Stores events in `webhook_events`.
  3. Updates user billing status in DB.

---
