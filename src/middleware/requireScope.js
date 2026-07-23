'use strict';

const config = require('../config');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to require a specific set of scopes from the provided API token.
 * Validates the Bearer token in the Authorization header.
 * 
 * @param {string[]} requiredScopes - Array of scopes required to access the endpoint.
 * @returns {import('express').RequestHandler}
 */
function requireScope(requiredScopes) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Missing or invalid Authorization header'));
    }

    const token = authHeader.split(' ')[1];
    const tokenScopes = config.apiTokens[token];

    if (!tokenScopes) {
      return next(ApiError.unauthorized('Invalid API token'));
    }

    // Check if the token has all required scopes
    const hasAllScopes = requiredScopes.every(scope => tokenScopes.includes(scope));
    
    if (!hasAllScopes) {
      return next(ApiError.forbidden('Insufficient token scopes'));
    }

    // Attach token and scopes to request for downstream usage if needed
    req.token = token;
    req.tokenScopes = tokenScopes;

    next();
  };
}

module.exports = requireScope;
