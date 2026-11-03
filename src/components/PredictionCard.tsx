import React from 'react';
import { Zap, ShieldCheck, Flame, Wind, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import type { PredictionResult, BuildingFeatures } from '../utils/ml_engine';

interface PredictionCardProps {
  prediction: PredictionResult;
  features: BuildingFeatures;
  modelName: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  features,
  modelName,
}) => {
  const { coolingLoad, heatingLoad, grade, gradeLabel, gradeColor, percentageVsMedian, confidenceInterval, primaryDriver } =
    prediction;

  const isMoreEfficient = percentageVsMedian < 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Zap className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Cooling Load Prediction
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Engine: {modelName}
            </span>
          </div>
        </div>

        {/* Rating Badge */}
        <div
          className="px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 shadow-sm"
          style={{
            backgroundColor: `${gradeColor}18`,
            borderColor: `${gradeColor}50`,
            color: gradeColor,
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: gradeColor }} />
          <span>Grade {grade}</span>
        </div>
      </div>

      {/* Main Metric Value & Confidence Band */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800 flex items-baseline justify-between">
        <div>
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
            Predicted Thermal Cooling Load
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {coolingLoad.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-slate-400 font-mono">kWh/m²</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            95% Confidence Band: <span className="text-slate-300">[{confidenceInterval[0]} - {confidenceInterval[1]}] kWh/m²</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            vs. Benchmark Median
          </span>
          <div
            className={`inline-flex items-center space-x-1 text-sm font-bold mt-1 ${
              isMoreEfficient ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isMoreEfficient ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span>{Math.abs(percentageVsMedian).toFixed(1)}% {isMoreEfficient ? 'Lower' : 'Higher'}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            (Median: 24.5 kWh/m²)
          </span>
        </div>
      </div>

      {/* Energy Efficiency Gauge Slider */}
      <div>
        <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1.5">
          <span>Performance Spectrum</span>
          <span style={{ color: gradeColor }}>{gradeLabel}</span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5 border border-slate-700/60 relative">
          <div className="h-full bg-emerald-500 rounded-l-full w-[25%]" title="Grade A+ (<16)" />
          <div className="h-full bg-teal-500 w-[15%]" title="Grade A (16-22)" />
          <div className="h-full bg-blue-500 w-[15%]" title="Grade B (22-28)" />
          <div className="h-full bg-amber-500 w-[15%]" title="Grade C (28-35)" />
          <div className="h-full bg-rose-500 w-[15%]" title="Grade D (35-42)" />
          <div className="h-full bg-red-800 rounded-r-full w-[15%]" title="Grade E (>42)" />

          {/* Current Needle Marker */}
          {(() => {
            const min = 10;
            const max = 48;
            const pct = Math.max(2, Math.min(98, ((coolingLoad - min) / (max - min)) * 100));
            return (
              <div
                className="absolute top-0 bottom-0 w-2 -ml-1 bg-white rounded-full shadow-lg border border-slate-900 transition-all duration-300"
                style={{ left: `${pct}%` }}
              />
            );
          })()}
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
          <span>10 kWh/m² (Ultra-Low)</span>
          <span>24.5 (Median)</span>
          <span>48 kWh/m² (Extreme)</span>
        </div>
      </div>

      {/* Heating vs Cooling Dual Comparison */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-sky-400 mb-1">
            <Wind className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-300">Cooling Load (Y2)</span>
          </div>
          <div className="font-mono text-base font-bold text-white">{coolingLoad.toFixed(1)} kWh/m²</div>
          <span className="text-[10px] text-slate-400">Primary Project Target</span>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-amber-400 mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-300">Heating Load (Y1)</span>
          </div>
          <div className="font-mono text-base font-bold text-white">{heatingLoad.toFixed(1)} kWh/m²</div>
          <span className="text-[10px] text-slate-400">Winter Heat Retention</span>
        </div>
      </div>

      {/* Contextual Engineering Recommendation */}
      <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3 text-xs flex items-start space-x-2.5">
        <Lightbulb className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-sky-300 block">Engineering Observation:</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {features.overallHeight === 7.0 && features.glazingArea >= 0.25 ? (
              <>Two-story stack effect coupled with {(features.glazingArea * 100).toFixed(0)}% fenestration produces high cooling thermal stress. Recommend exterior automated louvers and cross-ventilation shafts.</>
            ) : features.overallHeight === 3.5 ? (
              <>Single-story configuration keeps cooling load under 18 kWh/m² due to minimized vertical convective volume and lower stack pressure.</>
            ) : (
              <>Primary cooling driver is <strong className="text-sky-300">{primaryDriver}</strong>. Modifying glazing ratio or compactness will have the highest marginal return.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
