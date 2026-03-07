const { forbidden } = require('../utils/response');

/**
 * RBAC middleware factory.
 * Usage: requireRole('admin')
 *
 * Reads role from req.user (populated by requireAuth middleware).
 * Role claim namespace: https://buildpath.app/roles
 */
function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) {
      return forbidden(res, 'No authenticated user');
    }

    const roles = req.user['https://buildpath.app/roles'] || [];

    if (!roles.includes(role)) {
      return forbidden(res, `Role '${role}' required`);
    }

    next();
  };
}

module.exports = requireRole;
