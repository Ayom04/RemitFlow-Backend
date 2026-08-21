'use strict';

/**
 * Mock foreign exchange rates expressed relative to USD.
 * In a real system these would come from a price oracle or
 * a Stellar path-payment quote. Here they are static for demos.
 */
const RATES_TO_USD = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  INR: 0.012,
  NGN: 0.00065,
  JPY: 0.0067,
  PHP: 0.017,
  MXN: 0.058,
  KES: 0.0078,
};

/** List of currency codes RemitFlow currently supports. */
const SUPPORTED_CURRENCIES = Object.keys(RATES_TO_USD);

module.exports = {
  RATES_TO_USD,
  SUPPORTED_CURRENCIES,
};
