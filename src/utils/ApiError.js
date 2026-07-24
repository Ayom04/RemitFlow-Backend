'use strict';

/**
 * Error type carrying an HTTP status code.
 * Thrown by controllers/services and rendered by the error handler.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code to send.
   * @param {string} message - human readable message.
   * @param {object} [details] - optional extra context.
   */
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  /** Convenience factory for 400 Bad Request. */
  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  /** Convenience factory for 404 Not Found. */
  static notFound(message, details) {
    return new ApiError(404, message, details);
  }

  /** Convenience factory for 409 Conflict. */
  static conflict(message, details) {
    return new ApiError(409, message, details);
  }

  /** Convenience factory for 422 Unprocessable Entity. */
  static unprocessable(message, details) {
    return new ApiError(422, message, details);
  }

  /** Convenience factory for 401 Unauthorized. */
  static unauthorized(message, details) {
    return new ApiError(401, message, details);
  }

  /** Convenience factory for 403 Forbidden. */
  static forbidden(message, details) {
    return new ApiError(403, message, details);
  }

  /** Convenience factory for 429 Too Many Requests. */
  static tooManyRequests(message, details) {
    return new ApiError(429, message, details);
  }

  /** Convenience factory for 503 Service Unavailable. */
  static serviceUnavailable(message, details) {
    return new ApiError(503, message, details);
  }
}

module.exports = ApiError;
