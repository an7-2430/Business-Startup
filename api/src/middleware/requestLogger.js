const { createRequestLogger } = require('../utils/logger');

/**
 * Request logger middleware.
 * Attaches a request-scoped logger and request_id to every request.
 * Logs method, path, status, and latency on response finish.
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  req.log = createRequestLogger(req);

  req.log.info('Request received', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  res.on('finish', () => {
    const latencyMs = Date.now() - start;
    req.log.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      latency_ms: latencyMs,
    });
  });

  next();
}

module.exports = requestLogger;
