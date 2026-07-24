'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

const { validateCreateTransfer } = require('../src/validators/transferValidator');

function makeReq(body) {
  return { body };
}

const validBody = {
  senderName: 'Alice',
  recipientName: 'Bob',
  amount: 100,
  from: 'USD',
  to: 'EUR',
};

test('validateCreateTransfer accepts a well-formed transfer', () => {
  const errors = validateCreateTransfer(makeReq(validBody));
  assert.deepEqual(errors, []);
});

test('validateCreateTransfer rejects amounts with more than two decimal places', () => {
  const errors = validateCreateTransfer(
    makeReq({ ...validBody, amount: 99.999 })
  );
  assert.ok(errors.some((e) => e.includes('decimal places')));
});

test('validateCreateTransfer rejects amounts outside the safe numeric range', () => {
  const errors = validateCreateTransfer(
    makeReq({ ...validBody, amount: 1e21 })
  );
  assert.ok(errors.some((e) => e.includes('numeric range')));
});

test('validateCreateTransfer checks precision before the max-amount business rule', () => {
  // Amount both has bad precision AND exceeds maxTransferAmount (50000 by
  // default); the precision error should surface first since the checks
  // are ordered as an else-if chain.
  const errors = validateCreateTransfer(
    makeReq({ ...validBody, amount: 60000.123 })
  );
  assert.equal(errors.length, 1);
  assert.ok(errors[0].includes('decimal places'));
});

test('validateCreateTransfer still enforces maxTransferAmount for well-formed amounts', () => {
  const errors = validateCreateTransfer(
    makeReq({ ...validBody, amount: 999999999 })
  );
  assert.ok(errors.some((e) => e.includes('must not exceed')));
});
