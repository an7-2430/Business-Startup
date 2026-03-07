# 9. Payments & Webhooks (Stripe)

## 9.1 Stripe Checkout (Test Mode in MVP)
- Backend creates checkout session.
- Frontend redirects to Stripe-hosted checkout.
- After success, Stripe triggers webhook.

## 9.2 Webhook Validation
- `/webhooks/stripe` validates signature using `STRIPE_WEBHOOK_SECRET`.
- Store raw event payload into `webhook_events` for audit + replay capability.
- Update user billing status in `users` table (or separate `subscriptions` table if expanded).

---
