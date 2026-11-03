import fs from 'fs';
import path from 'path';

const baseShapes = [
  { rc: 0.98, surface: 514.5, wall: 294.0, roof: 110.25, height: 7.0 },
  { rc: 0.90, surface: 563.5, wall: 318.5, roof: 122.50, height: 7.0 },
  { rc: 0.86, surface: 588.0, wall: 318.5, roof: 134.75, height: 7.0 },
  { rc: 0.82, surface: 612.5, wall: 318.5, roof: 147.00, height: 7.0 },
  { rc: 0.79, surface: 637.0, wall: 343.0, roof: 147.00, height: 7.0 },
  { rc: 0.76, surface: 661.5, wall: 416.5, roof: 122.50, height: 7.0 },
  { rc: 0.74, surface: 686.0, wall: 245.0, roof: 220.50, height: 3.5 },
  { rc: 0.71, surface: 710.5, wall: 269.5, roof: 220.50, height: 3.5 },
  { rc: 0.69, surface: 735.0, wall: 294.0, roof: 220.50, height: 3.5 },
  { rc: 0.66, surface: 759.5, wall: 318.5, roof: 220.50, height: 3.5 },
  { rc: 0.64, surface: 784.0, wall: 343.0, roof: 220.50, height: 3.5 },
  { rc: 0.62, surface: 808.5, wall: 367.5, roof: 220.50, height: 3.5 },
];

const orientations = [2, 3, 4, 5];
const glazingConfigs = [
  { area: 0.00, dist: 0 },
  { area: 0.10, dist: 1 }, { area: 0.10, dist: 2 }, { area: 0.10, dist: 3 }, { area: 0.10, dist: 4 }, { area: 0.10, dist: 5 },
  { area: 0.25, dist: 1 }, { area: 0.25, dist: 2 }, { area: 0.25, dist: 3 }, { area: 0.25, dist: 4 }, { area: 0.25, dist: 5 },
  { area: 0.40, dist: 1 }, { area: 0.40, dist: 2 }, { area: 0.40, dist: 3 }, { area: 0.40, dist: 4 }, { area: 0.40, dist: 5 },
];

const lines = [
  'relative_compactness,surface_area,wall_area,roof_area,overall_height,orientation,glazing_area,glazing_area_distribution,heating_load,cooling_load'
];

let seed = 42;
function pseudoRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function gaussianNoise(mean = 0, std = 1) {
  const u1 = Math.max(1e-6, pseudoRandom());
  const u2 = pseudoRandom();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * std;
}

const orientSolarFactor: Record<number, number> = { 2: 0.95, 3: 1.05, 4: 1.18, 5: 1.12 };

for (const shape of baseShapes) {
  for (const orient of orientations) {
    for (const g of glazingConfigs) {
      const orientMult = orientSolarFactor[orient] ?? 1.0;
      const noiseC = gaussianNoise(0, 0.85);
      const noiseH = gaussianNoise(0, 0.80);

      // Calibrated formula for Cooling Load (Y2)
      let coolingLoad = -45.2 +
        (58.5 * shape.rc) -
        (0.038 * shape.surface) +
        (0.052 * shape.wall) -
        (0.065 * shape.roof) +
        (4.85 * shape.height) +
        (0.18 * orient) +
        (14.2 * g.area * orientMult) +
        (0.35 * g.dist) +
        (0.008 * (shape.rc ** 2) * shape.surface) +
        noiseC;

      coolingLoad = Math.max(10.5, Math.min(48.5, coolingLoad));

      // Heating Load (Y1)
      let heatingLoad = -55.8 +
        (64.2 * shape.rc) -
        (0.045 * shape.surface) +
        (0.048 * shape.wall) -
        (0.070 * shape.roof) +
        (5.40 * shape.height) +
        (0.08 * orient) +
        (16.8 * g.area) +
        (0.22 * g.dist) +
        noiseH;

      heatingLoad = Math.max(6.0, Math.min(44.0, heatingLoad));

      lines.push([
        shape.rc.toFixed(2),
        shape.surface.toFixed(1),
        shape.wall.toFixed(1),
        shape.roof.toFixed(2),
        shape.height.toFixed(1),
        orient,
        g.area.toFixed(2),
        g.dist,
        heatingLoad.toFixed(2),
        coolingLoad.toFixed(2)
      ].join(','));
    }
  }
}

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/energy_efficiency_data.csv', lines.join('\n'), 'utf-8');
console.log(`Generated data/energy_efficiency_data.csv with ${lines.length - 1} samples.`);
