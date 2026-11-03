import React, { useState } from 'react';
import { LineChart, BarChart2, Compass, Layers, HelpCircle, ArrowUpRight } from 'lucide-react';

export const FeatureImportanceView: React.FC = () => {
  const [activeDriver, setActiveDriver] = useState<string>('overall_height');

  const importanceData = [
    {
      id: 'overall_height',
      feature: 'Overall Height (X5)',
      symbol: 'X5',
      importance: 38.4,
      category: 'Geometry',
      correlation: 0.895,
      unit: 'meters (3.5 or 7.0)',
      explanation:
        'Single largest driver. Two-story buildings exhibit intense stack-effect convection and higher internal volume, increasing cooling requirement by +14 to +18 kWh/m².',
    },
    {
      id: 'relative_compactness',
      feature: 'Relative Compactness (X1)',
      symbol: 'X1',
      importance: 22.8,
      category: 'Geometry',
      correlation: 0.632,
      unit: 'ratio (0.62 - 0.98)',
      explanation:
        'Measures surface area to volume relative to a reference cube. Higher compactness retains conditioned air and reduces perimeter heat infiltration during summer.',
    },
    {
      id: 'surface_area',
      feature: 'Surface Area (X2)',
      symbol: 'X2',
      importance: 14.6,
      category: 'Envelope',
      correlation: -0.672,
      unit: 'm² (514.5 - 808.5)',
      explanation:
        'Total envelope skin. Inversely correlated with compactness; larger envelope areas experience higher ambient solar heat transfer.',
    },
    {
      id: 'glazing_area',
      feature: 'Glazing Area Ratio (X7)',
      symbol: 'X7',
      importance: 11.2,
      category: 'Fenestration',
      correlation: 0.207,
      unit: 'ratio (0.00 - 0.40)',
      explanation:
        'Direct solar radiation transmission through glass panes. The primary architecturally controllable lever for limiting peak cooling spikes.',
    },
    {
      id: 'roof_area',
      feature: 'Roof Area (X4)',
      symbol: 'X4',
      importance: 6.5,
      category: 'Envelope',
      correlation: -0.862,
      unit: 'm² (110.25 - 220.5)',
      explanation:
        'High roof area in this benchmark directly corresponds to 1-story low-rise buildings (3.5m), explaining its strong negative correlation with cooling load.',
    },
    {
      id: 'wall_area',
      feature: 'Wall Area (X3)',
      symbol: 'X3',
      importance: 4.1,
      category: 'Envelope',
      correlation: 0.427,
      unit: 'm² (245.0 - 416.5)',
      explanation:
        'Vertical opaque surface exposed to lateral wind and convective heat exchange.',
    },
    {
      id: 'orientation',
      feature: 'Orientation (X6)',
      symbol: 'X6',
      importance: 1.4,
      category: 'Solar',
      correlation: 0.015,
      unit: 'azimuth (2:N, 3:E, 4:S, 5:W)',
      explanation:
        'Orientation has low marginal correlation alone, but acts as a major multiplier when interacting with high glazing ratios (South and West facades).',
    },
    {
      id: 'glazing_area_distribution',
      feature: 'Glazing Distribution (X8)',
      symbol: 'X8',
      importance: 1.0,
      category: 'Fenestration',
      correlation: 0.050,
      unit: 'category (0 - 5)',
      explanation:
        'Directional bias of window placement. Concentrating windows on North vs South sides shifts solar heat gain timing.',
    },
  ];

  const selectedItem = importanceData.find((d) => d.id === activeDriver) || importanceData[0];

  // Correlation Matrix data for all 8 features + Cooling Load
  const corrMatrix = [
    { name: 'RC (X1)', x1: 1.0, x2: -0.99, x3: -0.20, x4: -0.87, x5: 0.83, x6: 0.0, x7: 0.0, x8: 0.0, y: 0.63 },
    { name: 'Surface (X2)', x1: -0.99, x2: 1.0, x3: 0.20, x4: 0.88, x5: -0.86, x6: 0.0, x7: 0.0, x8: 0.0, y: -0.67 },
    { name: 'Wall (X3)', x1: -0.20, x2: 0.20, x3: 1.0, x4: -0.29, x5: 0.28, x6: 0.0, x7: 0.0, x8: 0.0, y: 0.43 },
    { name: 'Roof (X4)', x1: -0.87, x2: 0.88, x3: -0.29, x4: 1.0, x5: -0.97, x6: 0.0, x7: 0.0, x8: 0.0, y: -0.86 },
    { name: 'Height (X5)', x1: 0.83, x2: -0.86, x3: 0.28, x4: -0.97, x5: 1.0, x6: 0.0, x7: 0.0, x8: 0.0, y: 0.89 },
    { name: 'Orient (X6)', x1: 0.0, x2: 0.0, x3: 0.0, x4: 0.0, x5: 0.0, x6: 1.0, x7: 0.0, x8: 0.0, y: 0.02 },
    { name: 'Glaze (X7)', x1: 0.0, x2: 0.0, x3: 0.0, x4: 0.0, x5: 0.0, x6: 0.0, x7: 1.0, x8: 0.21, y: 0.21 },
    { name: 'GlazeDist (X8)', x1: 0.0, x2: 0.0, x3: 0.0, x4: 0.0, x5: 0.0, x6: 0.0, x7: 0.21, x8: 1.0, y: 0.05 },
  ];

  const getHeatmapColor = (val: number) => {
    if (val === 1.0) return 'bg-emerald-600 text-white font-bold';
    if (val > 0.6) return 'bg-emerald-500/80 text-white';
    if (val > 0.2) return 'bg-emerald-500/30 text-emerald-300';
    if (val > -0.2) return 'bg-slate-800 text-slate-400';
    if (val > -0.6) return 'bg-rose-500/30 text-rose-300';
    return 'bg-rose-600/80 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-sky-400 mb-1">
          <LineChart className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Explainable AI &amp; EDA</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Architectural Drivers &amp; Feature Importance Ranking
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Derived from Gradient Boosting impurity splits and cross-validated Recursive Feature
          Elimination (RFE). Identifies which architectural choices provide the greatest thermal leverage.
        </p>
      </div>

      {/* Feature Importance Interactive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Horizontal Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>Relative Feature Importance (%)</span>
            <span className="text-xs text-slate-400 font-normal">Click any feature to inspect</span>
          </h3>

          <div className="space-y-2.5">
            {importanceData.map((d) => {
              const isSelected = activeDriver === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveDriver(d.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-400/80 shadow-md shadow-sky-500/10'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-200">{d.feature}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {d.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        corr: <span className={d.correlation > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {d.correlation > 0 ? '+' : ''}{d.correlation.toFixed(2)}
                        </span>
                      </span>
                      <span className="font-mono font-bold text-sky-400">{d.importance.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Importance Bar */}
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-400 to-emerald-400'
                          : 'bg-sky-500/60'
                      }`}
                      style={{ width: `${(d.importance / 40) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Dive on Selected Driver */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-3">
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {selectedItem.symbol}
              </span>
              <h4 className="text-sm font-bold text-slate-100">{selectedItem.feature}</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">Category</span>
                <span className="text-slate-200 font-medium">{selectedItem.category}</span>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">Dataset Range / Unit</span>
                <span className="text-slate-200 font-mono">{selectedItem.unit}</span>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">Correlation with Cooling Load</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {selectedItem.correlation > 0 ? '+' : ''}{selectedItem.correlation.toFixed(3)}
                </span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className="text-sky-300 font-semibold block mb-1">Thermodynamic Mechanism:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedItem.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            💡 <strong>RFE Ranking:</strong> Selected in top subset for all candidate regression models.
          </div>
        </div>
      </div>

      {/* Pearson Correlation Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Pearson Correlation Matrix (All Design Features vs. Cooling Load)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Note the severe collinearity between Surface Area (X2), Roof Area (X4), and Height (X5).
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/80 inline-block" /> -1.0 Negative
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-slate-800 inline-block" /> 0.0 Neutral
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/80 inline-block" /> +1.0 Positive
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="text-slate-400 text-[11px] border-b border-slate-800">
                <th className="py-2 text-left px-3">Feature</th>
                <th className="py-2 px-2">X1</th>
                <th className="py-2 px-2">X2</th>
                <th className="py-2 px-2">X3</th>
                <th className="py-2 px-2">X4</th>
                <th className="py-2 px-2">X5</th>
                <th className="py-2 px-2">X6</th>
                <th className="py-2 px-2">X7</th>
                <th className="py-2 px-2">X8</th>
                <th className="py-2 px-3 font-bold text-sky-400">Target (Y2)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {corrMatrix.map((row) => (
                <tr key={row.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-left font-sans font-semibold text-slate-300">{row.name}</td>
                  <td className={`py-1.5 px-2 rounded ${getHeatmapColor(row.x1)}`}>{row.x1.toFixed(2)}</td>
                  <td className={`py-1.5 px-2 rounded ${getHeatmapColor(row.x2)}`}>{row.x2.toFixed(2)}</td>
                  <td className={`py-1.5 px-2 rounded ${getHeatmapColor(row.x3)}`}>{row.x3.toFixed(2)}</td>
                  <td className={`py-1.5 px-2 rounded ${getHeatmapColor(row.x4)}`}>{row.x4.toFixed(2)}</td>
                  <td className={`py-1.5 px-2 rounded ${getHeatmapColor(row.x5)}`}>{row.x5.toFixed(2)}</td>
                  <td className={`py-1.5 px-2 rounded ${getHeatmapColor(row.x6)}`}>{row.x6.toFixed(2)}</td>
                  <td className={`py-1.5 px-2 rounded ${getHeatmapColor(row.x7)}`}>{row.x7.toFixed(2)}</td>
                  <td className={`py-1.5 px-2 rounded ${getHeatmapColor(row.x8)}`}>{row.x8.toFixed(2)}</td>
                  <td className={`py-1.5 px-3 rounded font-bold border-l border-slate-800 ${getHeatmapColor(row.y)}`}>
                    {row.y > 0 ? '+' : ''}{row.y.toFixed(2)}
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
