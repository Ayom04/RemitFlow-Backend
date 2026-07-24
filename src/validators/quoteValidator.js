'use strict';

const money = require('../utils/money');

/**
 * Validate query parameters for GET /api/quote.
 * @param {import('express').Request} req
 * @returns {string[]} list of error messages.
 */
function validateQuoteQuery(req) {
  const errors = [];
  const { amount, from, to } = req.query;

  if (amount === undefined) {
    errors.push('amount is required');
  } else if (!money.isPositiveAmount(amount)) {
    errors.push('amount must be a positive number');
  } else if (!money.isSafeAmount(amount)) {
    errors.push('amount is outside the supported numeric range');
  } else if (!money.hasValidPrecision(amount)) {
    errors.push(`amount must have at most ${money.DECIMALS} decimal places`);
  }

  if (!from) {
    errors.push('from currency is required');
  }
  if (!to) {
    errors.push('to currency is required');
  }
  if (from && to && from === to) {
    errors.push('from and to currencies must differ');
  }

  return errors;
}

module.exports = {
  validateQuoteQuery,
};
