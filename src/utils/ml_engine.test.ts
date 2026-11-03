import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateGeometry,
  getEnergyEfficiencyRating,
  predictCoolingLoad,
  type BuildingFeatures,
} from './ml_engine.ts';

test('validateGeometry verifies Surface = 2*Roof + Wall', () => {
  // Shape: roof=110.25, wall=294.0 -> surface = 2*110.25 + 294.0 = 514.5
  assert.equal(validateGeometry(514.5, 294.0, 110.25), true);
  // Violating geometry
  assert.equal(validateGeometry(600.0, 294.0, 110.25), false);
});

test('getEnergyEfficiencyRating properly bins cooling loads', () => {
  assert.equal(getEnergyEfficiencyRating(14.2).grade, 'A+');
  assert.equal(getEnergyEfficiencyRating(19.5).grade, 'A');
  assert.equal(getEnergyEfficiencyRating(25.0).grade, 'B');
  assert.equal(getEnergyEfficiencyRating(31.5).grade, 'C');
  assert.equal(getEnergyEfficiencyRating(38.0).grade, 'D');
  assert.equal(getEnergyEfficiencyRating(45.0).grade, 'E');
});

test('predictCoolingLoad produces realistic values within benchmark limits', () => {
  // Single-story compact eco-design (low height 3.5m, low glazing 0.10)
  const ecoBuilding: BuildingFeatures = {
    relativeCompactness: 0.74,
    surfaceArea: 686.0,
    wallArea: 245.0,
    roofArea: 220.50,
    overallHeight: 3.5,
    orientation: 2, // North
    glazingArea: 0.10,
    glazingAreaDistribution: 2,
  };

  // Two-story highly glazed building (tall 7.0m, high solar gain on South 0.40 glazing)
  const highStressBuilding: BuildingFeatures = {
    relativeCompactness: 0.76,
    surfaceArea: 661.5,
    wallArea: 416.5,
    roofArea: 122.50,
    overallHeight: 7.0,
    orientation: 4, // South
    glazingArea: 0.40,
    glazingAreaDistribution: 4,
  };

  const ecoResult = predictCoolingLoad(ecoBuilding, 'gbdt');
  const stressResult = predictCoolingLoad(highStressBuilding, 'gbdt');

  // Eco building should have lower cooling load than glazed high-rise
  assert.ok(ecoResult.coolingLoad < stressResult.coolingLoad);
  assert.ok(ecoResult.coolingLoad >= 10.5 && ecoResult.coolingLoad <= 20.0);
  assert.ok(stressResult.coolingLoad >= 30.0 && stressResult.coolingLoad <= 49.0);
  assert.ok(ecoResult.confidenceInterval[0] <= ecoResult.coolingLoad);
  assert.ok(ecoResult.confidenceInterval[1] >= ecoResult.coolingLoad);
});

test('all three models return consistent directional ranking', () => {
  const sample: BuildingFeatures = {
    relativeCompactness: 0.76,
    surfaceArea: 661.5,
    wallArea: 416.5,
    roofArea: 122.50,
    overallHeight: 7.0,
    orientation: 3,
    glazingArea: 0.25,
    glazingAreaDistribution: 1,
  };

  const gbdt = predictCoolingLoad(sample, 'gbdt');
  const rf = predictCoolingLoad(sample, 'rf');
  const ridge = predictCoolingLoad(sample, 'ridge');

  // All should be in reasonable benchmark range (~28 - 38 kWh/m^2 for 7m height with 0.25 glazing)
  assert.ok(gbdt.coolingLoad > 20.0 && gbdt.coolingLoad < 45.0);
  assert.ok(rf.coolingLoad > 20.0 && rf.coolingLoad < 45.0);
  assert.ok(ridge.coolingLoad > 20.0 && ridge.coolingLoad < 45.0);
});
