import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateValuation, WASTE_RATES_DATA, formatCurrency } from './calculator';

test('calculateValuation computes accurate price range for plastic PET', () => {
  const result = calculateValuation('Plastic', 'pet_bottles', 100);
  
  // 100 kg * 0.35 = 35.00 min, 100 * 0.55 = 55.00 max
  assert.equal(result.estimatedMinPrice, 35.0);
  assert.equal(result.estimatedMaxPrice, 55.0);
  assert.equal(result.estimatedAvgPrice, 45.0);
  assert.equal(result.quantityKg, 100);
  // co2Factor is 1.6 -> 160 kg CO2 saved
  assert.equal(result.co2SavedKg, 160);
  // waterFactor is 24 -> 2400 liters
  assert.equal(result.waterSavedLiters, 2400);
});

test('calculateValuation handles zero or negative quantities safely', () => {
  const zeroResult = calculateValuation('Metal', 'aluminum_cans', 0);
  assert.equal(zeroResult.estimatedMinPrice, 0);
  assert.equal(zeroResult.estimatedMaxPrice, 0);
  assert.equal(zeroResult.co2SavedKg, 0);

  const negResult = calculateValuation('Metal', 'aluminum_cans', -50);
  assert.equal(negResult.estimatedMinPrice, 0);
  assert.equal(negResult.quantityKg, 0);
});

test('calculateValuation computes high-value e-waste circuit boards', () => {
  const result = calculateValuation('E-waste', 'circuit_boards_pcb', 10);
  // 10 * 8.50 = 85.00 min, 10 * 16.00 = 160.00 max
  assert.equal(result.estimatedMinPrice, 85.0);
  assert.equal(result.estimatedMaxPrice, 160.0);
  assert.equal(result.estimatedAvgPrice, 122.5);
  assert.ok(result.energySavedKwh > 0);
});

test('calculateValuation falls back to first subtype when unknown id provided', () => {
  const result = calculateValuation('Paper', 'invalid_subtype_id', 50);
  const firstOption = WASTE_RATES_DATA.Paper[0];
  assert.equal(result.subType, firstOption.name);
  assert.equal(result.estimatedMinPrice, Number((50 * firstOption.minRate).toFixed(2)));
});

test('formatCurrency formats numbers with two decimal places', () => {
  assert.equal(formatCurrency(45), '$45.00');
  assert.equal(formatCurrency(1234.5), '$1,234.50');
});
