'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

const money = require('../src/utils/money');

test('round limits to two decimal places', () => {
  assert.equal(money.round(1.005), 1.01);
  assert.equal(money.round(2.344), 2.34);
  assert.equal(money.round(10), 10);
});

test('isPositiveAmount accepts positive numbers only', () => {
  assert.equal(money.isPositiveAmount(5), true);
  assert.equal(money.isPositiveAmount('5'), true);
  assert.equal(money.isPositiveAmount(0), false);
  assert.equal(money.isPositiveAmount(-1), false);
  assert.equal(money.isPositiveAmount('abc'), false);
});

test('isSafeAmount accepts finite numbers within the safe magnitude', () => {
  assert.equal(money.isSafeAmount(5), true);
  assert.equal(money.isSafeAmount('1250.50'), true);
  assert.equal(money.isSafeAmount(0), true);
  assert.equal(money.isSafeAmount(-100), true);
});

test('isSafeAmount rejects non-finite and out-of-range values', () => {
  assert.equal(money.isSafeAmount(Infinity), false);
  assert.equal(money.isSafeAmount(-Infinity), false);
  assert.equal(money.isSafeAmount(NaN), false);
  assert.equal(money.isSafeAmount('abc'), false);
  assert.equal(money.isSafeAmount(Number.MAX_SAFE_INTEGER), false);
  assert.equal(money.isSafeAmount(1e21), false);
});

test('hasValidPrecision accepts amounts with up to two decimal places', () => {
  assert.equal(money.hasValidPrecision(10), true);
  assert.equal(money.hasValidPrecision(10.1), true);
  assert.equal(money.hasValidPrecision(10.12), true);
  assert.equal(money.hasValidPrecision('10.12'), true);
  assert.equal(money.hasValidPrecision('0.01'), true);
});

test('hasValidPrecision rejects amounts with sub-cent precision', () => {
  assert.equal(money.hasValidPrecision(10.129), false);
  assert.equal(money.hasValidPrecision('10.123'), false);
  assert.equal(money.hasValidPrecision('0.001'), false);
});

test('hasValidPrecision rejects non-numeric and exponential-notation input', () => {
  assert.equal(money.hasValidPrecision('abc'), false);
  assert.equal(money.hasValidPrecision('1e5'), false);
  assert.equal(money.hasValidPrecision(NaN), false);
  assert.equal(money.hasValidPrecision(undefined), false);
  assert.equal(money.hasValidPrecision(null), false);
});

test('hasValidPrecision honors a custom decimals argument', () => {
  assert.equal(money.hasValidPrecision(10.123, 3), true);
  assert.equal(money.hasValidPrecision(10.1234, 3), false);
  assert.equal(money.hasValidPrecision(10, 0), true);
  assert.equal(money.hasValidPrecision(10.5, 0), false);
});

test('clamp constrains values to the given range', () => {
  assert.equal(money.clamp(5, 0, 10), 5);
  assert.equal(money.clamp(-3, 0, 10), 0);
  assert.equal(money.clamp(42, 0, 10), 10);
  assert.equal(money.clamp('nope', 1, 10), 1);
});

test('percentage computes a rounded percent of an amount', () => {
  assert.equal(money.percentage(100, 1.5), 1.5);
  assert.equal(money.percentage(200, 10), 20);
  assert.equal(money.percentage(33.33, 3), 1);
});

test('format renders amount with currency code', () => {
  assert.equal(money.format(10, 'USD'), '10.00 USD');
  assert.equal(money.format(2.5, 'EUR'), '2.50 EUR');
});
