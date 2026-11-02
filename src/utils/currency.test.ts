import test from 'node:test';
import assert from 'node:assert/strict';
import { CurrencyService, SUPPORTED_CURRENCIES } from './currency';

test('CurrencyService provides default USD currency', () => {
  const usd = SUPPORTED_CURRENCIES.find((c) => c.code === 'USD');
  assert.ok(usd);
  assert.equal(usd.code, 'USD');
  assert.equal(usd.symbol, '$');
  assert.equal(usd.rate, 1.0);
});

test('CurrencyService converts USD to INR correctly', () => {
  const inr = SUPPORTED_CURRENCIES.find((c) => c.code === 'INR')!;
  assert.ok(inr);
  const converted = CurrencyService.convertFromUSD(100, inr);
  // 100 * 86.5 = 8650
  assert.equal(Math.round(converted), 8650);
});

test('CurrencyService formats currency strings with proper symbols', () => {
  const inr = SUPPORTED_CURRENCIES.find((c) => c.code === 'INR')!;
  const formatted = CurrencyService.formatUSD(10, inr);
  assert.ok(formatted.includes('₹'));
  assert.ok(formatted.includes('865'));
});

test('CurrencyService supports all 12 major requested global currencies', () => {
  assert.equal(SUPPORTED_CURRENCIES.length, 12);
  const codes = SUPPORTED_CURRENCIES.map((c) => c.code);
  assert.ok(codes.includes('USD'));
  assert.ok(codes.includes('INR'));
  assert.ok(codes.includes('EUR'));
  assert.ok(codes.includes('GBP'));
  assert.ok(codes.includes('JPY'));
});
