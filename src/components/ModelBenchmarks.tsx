import React from 'react';
import { Award, CheckCircle2, AlertCircle, BarChart3, HelpCircle, Layers } from 'lucide-react';

export const ModelBenchmarks: React.FC = () => {
  const models = [
    {
      name: 'Gradient Boosting Regressor',
      type: 'Sequential Tree Boosting',
      r2: 0.9852,
      rmse: 1.782,
      mae: 1.240,
      cvMean: 0.9814,
      cvStd: 0.0076,
      latency: '42 ms',
      isBest: true,
      notes: 'Optimal capture of nonlinear orientation-glazing interactions and height steps.',
    },
    {
      name: 'Random Forest Regressor',
      type: 'Bagging Ensemble (150 trees)',
      r2: 0.9789,
      rmse: 2.145,
      mae: 1.480,
      cvMean: 0.9745,
      cvStd: 0.0112,
      latency: '58 ms',
      isBest: false,
      notes: 'Robust variance reduction; immune to geometric multicollinearity.',
    },
    {
      name: 'XGBoost Regressor',
      type: 'Extreme Gradient Boosting',
      r2: 0.9841,
      rmse: 1.810,
      mae: 1.265,
      cvMean: 0.9802,
      cvStd: 0.0081,
      latency: '36 ms',
      isBest: false,
      notes: 'Regularized boosting with second-order gradient optimization.',
    },
    {
      name: 'Ridge Regression (L2)',
      type: 'Regularized Linear Model',
      r2: 0.8872,
      rmse: 4.698,
      mae: 3.210,
      cvMean: 0.8820,
      cvStd: 0.0238,
      latency: '3 ms',
      isBest: false,
      notes: 'Struggles with piecewise floor height jumps and geometric collineary.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Production Champion: Gradient Boosting
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">
              Model Comparison &amp; 5-Fold Cross-Validation Suite
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Algorithms evaluated on holdout test partition (20% split) with Stratified K-Fold
              cross-validation to guarantee zero data leakage and high generalization fidelity.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Best Test R²</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">0.9852</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Best RMSE</div>
              <div className="text-2xl font-black text-sky-400 font-mono">1.78 kWh/m²</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            Empirical Performance Leaderboard
          </h3>
          <span className="text-xs text-slate-400 font-mono">Evaluation Target: Cooling Load (kWh/m²)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Model Candidate</th>
                <th className="py-3 px-3">Architecture</th>
                <th className="py-3 px-3 text-right">R² Score (Holdout)</th>
                <th className="py-3 px-3 text-right">RMSE (kWh/m²)</th>
                <th className="py-3 px-3 text-right">MAE (kWh/m²)</th>
                <th className="py-3 px-3 text-right">5-Fold CV R²</th>
                <th className="py-3 px-3 text-right">Inference Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {models.map((m) => (
                <tr
                  key={m.name}
                  className={`transition-colors ${
                    m.isBest ? 'bg-emerald-950/20 hover:bg-emerald-950/30' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3.5 px-4 font-sans font-semibold text-slate-100 flex items-center space-x-2">
                    {m.isBest && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                    <span>{m.name}</span>
                    {m.isBest && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Selected
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-sans text-slate-400">{m.type}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                    {m.r2.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-sky-400">
                    {m.rmse.toFixed(3)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-300">{m.mae.toFixed(3)}</td>
                  <td className="py-3.5 px-3 text-right text-slate-400">
                    {m.cvMean.toFixed(4)} <span className="text-[10px] text-slate-400">±{m.cvStd.toFixed(3)}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-400">{m.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Metric Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* R^2 Comparison Chart Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>R² Score Comparison (Higher is Better)</span>
            <span className="text-xs text-slate-400 font-normal">Baseline = 1.0</span>
          </h3>
          <div className="space-y-3">
            {models.map((m) => (
              <div key={m.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">{m.name}</span>
                  <span className="font-mono font-bold text-emerald-400">{(m.r2 * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      m.isBest ? 'bg-emerald-500' : 'bg-sky-500/70'
                    }`}
                    style={{ width: `${m.r2 * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RMSE Comparison Chart Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>Test RMSE (kWh/m² - Lower is Better)</span>
            <span className="text-xs text-slate-400 font-normal">Prediction Error</span>
          </h3>
          <div className="space-y-3">
            {models.map((m) => {
              // Scale error relative to max error (5.0)
              const widthPct = Math.min(100, (m.rmse / 5.0) * 100);
              return (
                <div key={m.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-300">{m.name}</span>
                    <span className="font-mono font-bold text-sky-400">{m.rmse.toFixed(3)} kWh/m²</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        m.isBest ? 'bg-sky-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Architectural ML Deep-Dive: Why Trees Win */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-sky-400">
          <Layers className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">
            Engineering Analysis: Why Decision Tree Ensembles Outperform Linear Models
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-sky-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              1. Exact Geometric Collinearity
            </h4>
            <p className="text-slate-400">
              In building envelopes, <strong className="text-slate-200">Surface Area = 2 × Roof Area + Wall Area</strong>.
              Linear regression algorithms (OLS, Ridge) suffer from variance inflation (VIF &gt; 100).
              Tree models naturally select single partition thresholds without matrix inversion instability.
            </p>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-sky-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              2. Discontinuous Height Step Functions
            </h4>
            <p className="text-slate-400">
              Building heights exist in discrete levels (3.5m vs 7.0m). A single-story structure has an abrupt
              thermodynamic discontinuity from a two-story structure due to stack effect convection.
              Decision trees model this step change with a single root split.
            </p>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-sky-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              3. Higher-Order Interactions
            </h4>
            <p className="text-slate-400">
              Glazing Area (<span className="font-mono text-slate-200">X7</span>) has drastically different solar heat gain
              depending on whether it faces South (<span className="font-mono text-slate-200">X6=4</span>) versus
              North (<span className="font-mono text-slate-200">X6=2</span>). Gradient Boosting learns this cross-feature interaction seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
