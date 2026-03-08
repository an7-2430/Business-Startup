/**
 * Standard API response helpers.
 * Ensures every response follows { success, data, error } envelope.
 */

function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
}

function created(res, data) {
  return success(res, data, 201);
}

function error(res, message, code = 'INTERNAL_ERROR', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code,
      message,
    },
  });
}

function notFound(res, resource = 'Resource') {
  return error(res, `${resource} not found`, 'NOT_FOUND', 404);
}

function unauthorized(res, message = 'Unauthorized') {
  return error(res, message, 'UNAUTHORIZED', 401);
}

function forbidden(res, message = 'Forbidden') {
  return error(res, message, 'FORBIDDEN', 403);
}

function badRequest(res, message) {
  return error(res, message, 'BAD_REQUEST', 400);
}

module.exports = { success, created, error, notFound, unauthorized, forbidden, badRequest };
