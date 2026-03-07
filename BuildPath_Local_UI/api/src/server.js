const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const { logger } = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { success } = require('./utils/response');

// ── Route modules ─────────────────────────────────────────────────────────────
const profileRoutes = require('./modules/profile/routes');
const roadmapRoutes = require('./modules/roadmap/routes');
const adminRoutes = require('./modules/admin/routes');
const paymentRoutes = require('./modules/payments/routes');
const webhookRoutes = require('./modules/webhooks/routes');
const integrationRoutes = require('./modules/integrations/routes');
const onboardingRoutes = require('./modules/onboarding/routes');
const documentRoutes = require('./modules/documents/routes');
const setupRoutes = require('./modules/setup/routes');

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Raw body for Stripe webhooks (must come before json parser for webhook routes)
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

// JSON body parser for all other routes
app.use(express.json());

// Request logger
app.use(requestLogger);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  return success(res, {
    status: 'ok',
    service: 'buildpath-api',
    version: '1.0.0',
    env: config.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API v1 routes ─────────────────────────────────────────────────────────────
app.use('/api/v1/me', profileRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/roadmap', roadmapRoutes);
app.use('/api/v1', roadmapRoutes);          // steps routes under /api/v1/steps/:id
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/setup', setupRoutes);

// ── Webhook routes (outside /api/v1 — per spec) ───────────────────────────────
app.use('/webhooks', webhookRoutes);

// ── Integration health routes ─────────────────────────────────────────────────
app.use('/integrations', integrationRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
});

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(config.PORT, () => {
  logger.info('BuildPath API started', {
    port: config.PORT,
    env: config.NODE_ENV,
    health: `http://localhost:${config.PORT}/health`,
    integrations_health: `http://localhost:${config.PORT}/integrations/health`,
    webhooks_health: `http://localhost:${config.PORT}/webhooks/health`,
  });
});

module.exports = app;
