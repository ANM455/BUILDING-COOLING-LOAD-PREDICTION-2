import React, { useState } from 'react';
import { Layers, Download, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { predictCoolingLoad, type BuildingFeatures } from '../utils/ml_engine';

export const BatchPredictor: React.FC = () => {
  const initialBatch: BuildingFeatures[] = [
    { relativeCompactness: 0.98, surfaceArea: 514.5, wallArea: 294.0, roofArea: 110.25, overallHeight: 7.0, orientation: 2, glazingArea: 0.10, glazingAreaDistribution: 1 },
    { relativeCompactness: 0.90, surfaceArea: 563.5, wallArea: 318.5, roofArea: 122.50, overallHeight: 7.0, orientation: 3, glazingArea: 0.25, glazingAreaDistribution: 2 },
    { relativeCompactness: 0.86, surfaceArea: 588.0, wallArea: 318.5, roofArea: 134.75, overallHeight: 7.0, orientation: 4, glazingArea: 0.40, glazingAreaDistribution: 4 },
    { relativeCompactness: 0.82, surfaceArea: 612.5, wallArea: 318.5, roofArea: 147.00, overallHeight: 7.0, orientation: 5, glazingArea: 0.25, glazingAreaDistribution: 1 },
    { relativeCompactness: 0.79, surfaceArea: 637.0, wallArea: 343.0, roofArea: 147.00, overallHeight: 7.0, orientation: 2, glazingArea: 0.00, glazingAreaDistribution: 0 },
    { relativeCompactness: 0.76, surfaceArea: 661.5, wallArea: 416.5, roofArea: 122.50, overallHeight: 7.0, orientation: 4, glazingArea: 0.40, glazingAreaDistribution: 4 },
    { relativeCompactness: 0.74, surfaceArea: 686.0, wallArea: 245.0, roofArea: 220.50, overallHeight: 3.5, orientation: 2, glazingArea: 0.10, glazingAreaDistribution: 2 },
    { relativeCompactness: 0.71, surfaceArea: 710.5, wallArea: 269.5, roofArea: 220.50, overallHeight: 3.5, orientation: 3, glazingArea: 0.25, glazingAreaDistribution: 3 },
    { relativeCompactness: 0.66, surfaceArea: 759.5, wallArea: 318.5, roofArea: 220.50, overallHeight: 3.5, orientation: 4, glazingArea: 0.25, glazingAreaDistribution: 4 },
    { relativeCompactness: 0.62, surfaceArea: 808.5, wallArea: 367.5, roofArea: 220.50, overallHeight: 3.5, orientation: 5, glazingArea: 0.40, glazingAreaDistribution: 5 },
  ];

  const [batch, setBatch] = useState<BuildingFeatures[]>(initialBatch);

  const scoredBatch = batch.map((item, idx) => {
    const result = predictCoolingLoad(item, 'gbdt');
    return {
      id: idx + 1,
      ...item,
      predictedCooling: result.coolingLoad,
      grade: result.grade,
      gradeColor: result.gradeColor,
      label: result.gradeLabel,
    };
  });

  const downloadCSV = () => {
    const headers = [
      'id',
      'relative_compactness',
      'surface_area',
      'wall_area',
      'roof_area',
      'overall_height',
      'orientation',
      'glazing_area',
      'glazing_area_distribution',
      'predicted_cooling_load_kwh_m2',
      'energy_grade',
    ];

    const rows = scoredBatch.map((b) =>
      [
        b.id,
        b.relativeCompactness.toFixed(2),
        b.surfaceArea.toFixed(1),
        b.wallArea.toFixed(1),
        b.roofArea.toFixed(2),
        b.overallHeight.toFixed(1),
        b.orientation,
        b.glazingArea.toFixed(2),
        b.glazingAreaDistribution,
        b.predictedCooling.toFixed(2),
        b.grade,
      ].join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'scored_building_cooling_predictions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateRandomBatch = () => {
    const orientations = [2, 3, 4, 5];
    const glazings = [0.0, 0.1, 0.25, 0.4];
    const newItems: BuildingFeatures[] = Array.from({ length: 10 }).map(() => {
      const isTall = Math.random() > 0.5;
      const height = isTall ? 7.0 : 3.5;
      const roof = isTall ? (Math.random() > 0.5 ? 122.5 : 147.0) : 220.5;
      const wall = isTall ? 343.0 : 269.5;
      const surface = 2 * roof + wall;
      const rc = isTall ? 0.76 + Math.random() * 0.2 : 0.62 + Math.random() * 0.12;
      const ori = orientations[Math.floor(Math.random() * orientations.length)];
      const glaze = glazings[Math.floor(Math.random() * glazings.length)];
      const dist = glaze > 0 ? Math.floor(Math.random() * 5) + 1 : 0;

      return {
        relativeCompactness: Math.round(rc * 100) / 100,
        surfaceArea: surface,
        wallArea: wall,
        roofArea: roof,
        overallHeight: height,
        orientation: ori,
        glazingArea: glaze,
        glazingAreaDistribution: dist,
      };
    });

    setBatch(newItems);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 mb-1">
              <Layers className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Batch Pipeline</span>
            </div>
            <h2 className="text-xl font-bold text-white">Batch Prediction &amp; Scoring Engine</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Score multiple building configurations in parallel using the trained Gradient Boosting
              pipeline. Evaluates thermal cooling demand and automatically assigns ASHRAE energy performance grades.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={generateRandomBatch}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reshuffle Batch</span>
            </button>
            <button
              onClick={downloadCSV}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Scored CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-slate-800/80 text-[11px] text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Compactness</th>
                <th className="py-3 px-3">Surface (m²)</th>
                <th className="py-3 px-3">Wall (m²)</th>
                <th className="py-3 px-3">Roof (m²)</th>
                <th className="py-3 px-3">Height (m)</th>
                <th className="py-3 px-3">Orientation</th>
                <th className="py-3 px-3">Glazing</th>
                <th className="py-3 px-3 text-right text-sky-400 font-bold">Predicted Cooling</th>
                <th className="py-3 px-4 text-center">Energy Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {scoredBatch.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-400">{item.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-200">{item.relativeCompactness.toFixed(2)}</td>
                  <td className="py-3 px-3">{item.surfaceArea.toFixed(1)}</td>
                  <td className="py-3 px-3">{item.wallArea.toFixed(1)}</td>
                  <td className="py-3 px-3">{item.roofArea.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={item.overallHeight === 7.0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {item.overallHeight.toFixed(1)}m
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {{ 2: 'North', 3: 'East', 4: 'South', 5: 'West' }[item.orientation]}
                  </td>
                  <td className="py-3 px-3">{(item.glazingArea * 100).toFixed(0)}%</td>
                  <td className="py-3 px-3 text-right font-bold text-white text-sm">
                    {item.predictedCooling.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">kWh/m²</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block"
                      style={{
                        backgroundColor: `${item.gradeColor}18`,
                        borderColor: `${item.gradeColor}40`,
                        color: item.gradeColor,
                      }}
                    >
                      Grade {item.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
