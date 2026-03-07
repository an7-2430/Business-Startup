const { Router } = require('express');
const { success } = require('../../utils/response');
const requireAuth = require('../../middleware/auth');

const router = Router();

/**
 * POST /api/v1/payments/checkout
 * Creates a Stripe checkout session (test mode).
 * Story 6.2 will wire up real Stripe SDK.
 */
router.post('/checkout', requireAuth, (req, res) => {
  // TODO Story 6.2: create Stripe checkout session
  return success(res, {
    url: 'https://checkout.stripe.com/pay/placeholder',
    session_id: 'cs_test_placeholder',
  });
});

/**
 * GET /api/v1/payments/status
 * Returns current user billing status.
 */
router.get('/status', requireAuth, (req, res) => {
  return success(res, {
    plan: 'free',
    status: 'inactive',
    // Populated in Story 6.3 after webhook processing
  });
});

module.exports = router;
