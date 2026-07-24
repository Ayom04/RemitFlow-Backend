'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

const { validateQuoteQuery } = require('../src/validators/quoteValidator');

function makeReq(query) {
  return { query };
}

test('validateQuoteQuery accepts a well-formed amount', () => {
  const errors = validateQuoteQuery(
    makeReq({ amount: '100.50', from: 'USD', to: 'EUR' })
  );
  assert.deepEqual(errors, []);
});

test('validateQuoteQuery rejects amounts with more than two decimal places', () => {
  const errors = validateQuoteQuery(
    makeReq({ amount: '100.129', from: 'USD', to: 'EUR' })
  );
  assert.ok(errors.some((e) => e.includes('decimal places')));
});

test('validateQuoteQuery rejects amounts outside the safe numeric range', () => {
  const errors = validateQuoteQuery(
    makeReq({ amount: '1e21', from: 'USD', to: 'EUR' })
  );
  assert.ok(errors.some((e) => e.includes('numeric range') || e.includes('decimal places')));
});

test('validateQuoteQuery rejects a non-finite amount before checking precision', () => {
  const errors = validateQuoteQuery(
    makeReq({ amount: 'Infinity', from: 'USD', to: 'EUR' })
  );
  assert.ok(errors.includes('amount must be a positive number'));
});

test('validateQuoteQuery still rejects missing and non-positive amounts', () => {
  assert.ok(
    validateQuoteQuery(makeReq({ from: 'USD', to: 'EUR' })).includes(
      'amount is required'
    )
  );
  assert.ok(
    validateQuoteQuery(makeReq({ amount: '-5', from: 'USD', to: 'EUR' })).includes(
      'amount must be a positive number'
    )
  );
});
