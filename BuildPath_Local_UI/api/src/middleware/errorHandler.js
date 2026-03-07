const { logger } = require('../utils/logger');

/**
 * Global error handler — must be the last middleware registered.
 * Catches any error passed via next(err).
 */
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error('Unhandled error', {
    request_id: req.requestId,
    status,
    message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  res.status(status).json({
    success: false,
    data: null,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
    },
  });
}

module.exports = errorHandler;
