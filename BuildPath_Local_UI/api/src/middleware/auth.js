const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { error: errorResponse } = require('../utils/response');
const { logger } = require('../utils/logger');
const config = require('../config/env');

// ── JWKS client — fetches Auth0 signing keys ────────────────────────────────
let client = null;

function getJwksClient() {
  if (!client && config.AUTH0.DOMAIN) {
    client = jwksClient({
      jwksUri: `https://${config.AUTH0.DOMAIN}/.well-known/jwks.json`,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000, // 10 minutes
    });
  }
  return client;
}

/**
 * Get the signing key from JWKS by kid.
 */
function getSigningKey(header, callback) {
  const jwks = getJwksClient();
  if (!jwks) {
    return callback(new Error('Auth0 domain not configured'));
  }
  jwks.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Auth middleware — validates JWT from Authorization header.
 *
 * In development mode with AUTH0_DOMAIN unconfigured, accepts a dev-token bypass
 * so frontend/backend development can proceed without an Auth0 tenant.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // ── Dev bypass mode ─────────────────────────────────────────────────────
  if (config.NODE_ENV === 'development' && !config.AUTH0.DOMAIN) {
    // No Auth0 configured — use mock user for local dev
    if (!authHeader) {
      logger.debug('Dev mode: no auth header — assigning default dev user');
    }
    req.user = {
      sub: 'auth0|dev-user-001',
      email: 'dev@buildpath.app',
      'https://buildpath.app/roles': ['user'],
    };
    return next();
  }

  // ── Dev token shortcut ──────────────────────────────────────────────────
  if (config.NODE_ENV === 'development' && authHeader === 'Bearer dev-token') {
    req.user = {
      sub: 'auth0|dev-user-001',
      email: 'dev@buildpath.app',
      'https://buildpath.app/roles': ['user'],
    };
    return next();
  }

  if (config.NODE_ENV === 'development' && authHeader === 'Bearer dev-admin-token') {
    req.user = {
      sub: 'auth0|dev-admin-001',
      email: 'admin@buildpath.app',
      'https://buildpath.app/roles': ['admin'],
    };
    return next();
  }

  // ── Real JWT validation ─────────────────────────────────────────────────
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Missing or invalid Authorization header', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    getSigningKey,
    {
      audience: config.AUTH0.AUDIENCE,
      issuer: `https://${config.AUTH0.DOMAIN}/`,
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        logger.warn('JWT verification failed', {
          request_id: req.requestId,
          error: err.message,
        });
        return errorResponse(res, 'Invalid or expired token', 'UNAUTHORIZED', 401);
      }

      req.user = decoded;
      next();
    }
  );
}

module.exports = requireAuth;
