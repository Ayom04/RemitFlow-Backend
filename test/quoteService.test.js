'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

const quoteService = require('../src/services/quoteService');
const ApiError = require('../src/utils/ApiError');

test('getQuote returns a rounded breakdown for a well-formed amount', () => {
  const quote = quoteService.getQuote(100, 'usd', 'eur');
  assert.equal(quote.from, 'USD');
  assert.equal(quote.to, 'EUR');
  assert.equal(quote.sendAmount, 100);
  assert.ok(quote.fee > 0);
  assert.ok(quote.receiveAmount > 0);
});

test('getQuote throws ApiError.badRequest for amounts with sub-cent precision', () => {
  assert.throws(
    () => quoteService.getQuote(100.129, 'USD', 'EUR'),
    (err) =>
      err instanceof ApiError &&
      err.statusCode === 400 &&
      err.message.includes('decimal places')
  );
});

test('getQuote throws ApiError.badRequest for amounts outside the safe numeric range', () => {
  assert.throws(
    () => quoteService.getQuote(1e21, 'USD', 'EUR'),
    (err) =>
      err instanceof ApiError &&
      err.statusCode === 400 &&
      err.message.includes('numeric range')
  );
});

test('getQuote vacuousness check: precision guard is actually enforced', () => {
  // Confirms the precision error is not thrown unconditionally: a
  // well-formed amount right next to the rejected one must succeed.
  assert.doesNotThrow(() => quoteService.getQuote(100.12, 'USD', 'EUR'));
});
