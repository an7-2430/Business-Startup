const { Router } = require('express');
const { success } = require('../../utils/response');
const { logger } = require('../../utils/logger');

const router = Router();

/**
 * GET /integrations/health
 * Returns health status of all registered third-party integrations.
 * Providers are queried with structured logs: request_id, provider, status.
 */
router.get('/health', async (req, res) => {
  const results = {};

  // ── Auth0 ──────────────────────────────────────────────────────────────
  try {
    const auth0Domain = process.env.AUTH0_DOMAIN;
    if (auth0Domain) {
      // Lightweight OIDC discovery check
      const response = await fetch(`https://${auth0Domain}/.well-known/openid-configuration`);
      results.auth0 = response.ok ? 'ok' : 'degraded';
    } else {
      results.auth0 = 'unconfigured';
    }
  } catch {
    results.auth0 = 'unreachable';
  }

  logger.info('Integration health check', {
    request_id: req.requestId,
    provider: 'auth0',
    status: results.auth0,
  });

  // ── Supabase ────────────────────────────────────────────────────────────
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    if (supabaseUrl) {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || '' },
      });
      results.supabase = response.ok || response.status === 401 ? 'ok' : 'degraded';
    } else {
      results.supabase = 'unconfigured';
    }
  } catch {
    results.supabase = 'unreachable';
  }

  logger.info('Integration health check', {
    request_id: req.requestId,
    provider: 'supabase',
    status: results.supabase,
  });

  // ── Stripe ──────────────────────────────────────────────────────────────
  results.stripe = process.env.STRIPE_SECRET_KEY ? 'configured' : 'unconfigured';

  logger.info('Integration health check', {
    request_id: req.requestId,
    provider: 'stripe',
    status: results.stripe,
  });

  return success(res, {
    status: 'ok',
    integrations: results,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
