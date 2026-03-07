const { v4: uuidv4 } = require('uuid');

/**
 * Structured logger.
 * Outputs JSON-formatted logs for easy parsing in prod.
 */
function log(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

const logger = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  debug: (message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message, meta);
    }
  },
};

/**
 * Request-scoped logger with a unique request_id.
 * Attach to req in middleware for consistent tracing.
 */
function createRequestLogger(req) {
  const requestId = uuidv4();
  req.requestId = requestId;

  return {
    info: (message, meta) => log('info', message, { request_id: requestId, ...meta }),
    warn: (message, meta) => log('warn', message, { request_id: requestId, ...meta }),
    error: (message, meta) => log('error', message, { request_id: requestId, ...meta }),
  };
}

module.exports = { logger, createRequestLogger };
