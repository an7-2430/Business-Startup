const { Router } = require('express');
const { success } = require('../../utils/response');
const { logger } = require('../../utils/logger');

const router = Router();

/**
 * POST /webhooks/stripe
 * Receives Stripe webhook events.
 * Story 6.3 will add signature validation and event storage.
 */
router.post('/stripe', (req, res) => {
  // TODO Story 6.3: validate Stripe-Signature header, store event, update billing status
  const event = req.body;

  logger.info('Stripe webhook received', {
    type: event?.type || 'unknown',
    // signature validation happens in Story 6.3
  });

  return success(res, { received: true });
});

/**
 * POST /webhooks/provider-placeholder
 * Reserved for future third-party integration webhooks.
 */
router.post('/provider-placeholder', (req, res) => {
  logger.info('Provider webhook received (placeholder)');
  return success(res, { received: true });
});

/**
 * GET /webhooks/health
 * Health check for webhook endpoint availability.
 */
router.get('/health', (req, res) => {
  return success(res, {
    status: 'ok',
    endpoint: 'webhooks',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
