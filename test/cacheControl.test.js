'use strict';

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const createApp = require('../src/app');

describe('Cache-Control Integration Tests', () => {
  let app;
  let server;
  let baseUrl;

  before(() => {
    app = createApp();
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test('GET /api/health should have default non-cacheable headers', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'no-store, no-cache, must-revalidate, proxy-revalidate');
    assert.equal(res.headers.get('pragma'), 'no-cache');
    assert.equal(res.headers.get('expires'), '0');
  });

  test('GET /api/rates should have public cache-control with ratesMaxAge', async () => {
    const res = await fetch(`${baseUrl}/api/rates`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'public, max-age=10');
    assert.equal(res.headers.has('pragma'), false);
    
    const expires = res.headers.get('expires');
    assert.ok(expires);
    const expiresMs = Date.parse(expires);
    assert.ok(!isNaN(expiresMs));
    // Verify it is roughly 10 seconds in the future
    const diffSeconds = (expiresMs - Date.now()) / 1000;
    assert.ok(diffSeconds > 5 && diffSeconds <= 11);
  });

  test('GET /api/rates/:pair should have public cache-control with ratesMaxAge', async () => {
    const res = await fetch(`${baseUrl}/api/rates/USD-EUR`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'public, max-age=10');
    assert.equal(res.headers.has('pragma'), false);
    
    const expires = res.headers.get('expires');
    assert.ok(expires);
    const expiresMs = Date.parse(expires);
    assert.ok(!isNaN(expiresMs));
    const diffSeconds = (expiresMs - Date.now()) / 1000;
    assert.ok(diffSeconds > 5 && diffSeconds <= 11);
  });

  test('GET /api/version should have public cache-control with max-age=3600', async () => {
    const res = await fetch(`${baseUrl}/api/version`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'public, max-age=3600');
    assert.equal(res.headers.has('pragma'), false);

    const expires = res.headers.get('expires');
    assert.ok(expires);
    const expiresMs = Date.parse(expires);
    assert.ok(!isNaN(expiresMs));
    const diffSeconds = (expiresMs - Date.now()) / 1000;
    // Verify it is roughly 3600 seconds in the future
    assert.ok(diffSeconds > 3590 && diffSeconds <= 3601);
  });

  test('POST /api/transfers should have default non-cacheable headers even on error/validation failure', async () => {
    const res = await fetch(`${baseUrl}/api/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    // Auth middleware runs before validation, so an unauthenticated request returns 401.
    // The key invariant tested here is that no-store headers are applied regardless of which
    // error type is returned (auth, validation, etc.).
    assert.equal(res.status, 401);
    assert.equal(res.headers.get('cache-control'), 'no-store, no-cache, must-revalidate, proxy-revalidate');
    assert.equal(res.headers.get('pragma'), 'no-cache');
    assert.equal(res.headers.get('expires'), '0');
  });
});
