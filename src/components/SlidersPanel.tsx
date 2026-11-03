import React from 'react';
import { Sliders, Sparkles, CheckCircle2, RotateCcw, Cpu } from 'lucide-react';
import type { BuildingFeatures, ModelType } from '../utils/ml_engine';

interface SlidersPanelProps {
  features: BuildingFeatures;
  onChange: (updated: BuildingFeatures) => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  onReset: () => void;
}

export const SlidersPanel: React.FC<SlidersPanelProps> = ({
  features,
  onChange,
  selectedModel,
  onModelChange,
  onReset,
}) => {
  const presets = [
    {
      name: 'Passive Solar Eco-Home',
      desc: '1-story, high compactness, minimal glazing',
      config: {
        relativeCompactness: 0.74,
        roofArea: 220.5,
        wallArea: 245.0,
        surfaceArea: 686.0,
        overallHeight: 3.5,
        orientation: 2,
        glazingArea: 0.10,
        glazingAreaDistribution: 2,
      },
    },
    {
      name: 'Suburban 2-Story Villa',
      desc: 'Typical modern two-level residence',
      config: {
        relativeCompactness: 0.79,
        roofArea: 147.0,
        wallArea: 343.0,
        surfaceArea: 637.0,
        overallHeight: 7.0,
        orientation: 3,
        glazingArea: 0.25,
        glazingAreaDistribution: 1,
      },
    },
    {
      name: 'Glazed South Office',
      desc: '2-story, large glazing exposed to high solar irradiance',
      config: {
        relativeCompactness: 0.76,
        roofArea: 122.5,
        wallArea: 416.5,
        surfaceArea: 661.5,
        overallHeight: 7.0,
        orientation: 4,
        glazingArea: 0.40,
        glazingAreaDistribution: 4,
      },
    },
    {
      name: 'Compact Monolith',
      desc: 'Maximum compactness 0.98, optimal volume retention',
      config: {
        relativeCompactness: 0.98,
        roofArea: 110.25,
        wallArea: 294.0,
        surfaceArea: 514.5,
        overallHeight: 7.0,
        orientation: 2,
        glazingArea: 0.10,
        glazingAreaDistribution: 1,
      },
    },
  ];

  const updateField = (field: keyof BuildingFeatures, val: number) => {
    const updated = { ...features, [field]: val };

    // Maintain physical geometric consistency: Surface Area = 2*Roof + Wall
    if (field === 'roofArea' || field === 'wallArea') {
      updated.surfaceArea = 2 * updated.roofArea + updated.wallArea;
    }

    onChange(updated);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Design Features &amp; Sliders
          </h2>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset to default baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Model Selection Switcher */}
      <div>
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          Active ML Model Pipeline
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'gbdt', label: 'Gradient Boosting', sub: 'Best: R² 0.985' },
            { id: 'rf', label: 'Random Forest', sub: 'R² 0.979' },
            { id: 'ridge', label: 'Ridge Regression', sub: 'R² 0.887' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => onModelChange(m.id as ModelType)}
              className={`p-2 rounded-xl text-left border transition-all ${
                selectedModel === m.id
                  ? 'bg-sky-500/15 border-sky-500 text-sky-300 shadow-sm shadow-sky-500/20'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-bold leading-tight">{m.label}</div>
              <div className="text-[10px] opacity-75 font-mono">{m.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Archetype Quick Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Architectural Archetypes
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onChange(preset.config as BuildingFeatures)}
              className="text-left p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                {preset.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders List */}
      <div className="space-y-4 pt-1">
        {/* Relative Compactness (X1) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-200">Relative Compactness (X1)</span>
            <span className="font-mono text-sky-400 font-bold">{features.relativeCompactness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.62"
            max="0.98"
            step="0.01"
            value={features.relativeCompactness}
            onChange={(e) => updateField('relativeCompactness', parseFloat(e.target.value))}
            className="w-full accent-sky-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>0.62 (Elongated)</span>
            <span>0.98 (Compact Cube)</span>
          </div>
        </div>

        {/* Overall Height (X5) */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-200">Overall Height (X5)</span>
            <span className="font-mono text-sky-400 font-bold">{features.overallHeight.toFixed(1)} m</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: 3.5, label: '3.5 m (1-Story)', desc: 'Low thermal stack effect' },
              { val: 7.0, label: '7.0 m (2-Story)', desc: 'High stack & convective volume' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => updateField('overallHeight', opt.val)}
                className={`py-2 px-3 rounded-xl text-left border text-xs transition-all ${
                  features.overallHeight === opt.val
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                    : 'bg-slate-800/40 border-slate-700/70 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>{opt.label}</div>
                <div className="text-[10px] font-normal text-slate-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Wall Area (X3) and Roof Area (X4) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Wall Area (X3)</span>
              <span className="font-mono text-sky-400 text-xs font-semibold">{features.wallArea.toFixed(1)} m²</span>
            </div>
            <input
              type="range"
              min="245.0"
              max="416.5"
              step="12.25"
              value={features.wallArea}
              onChange={(e) => updateField('wallArea', parseFloat(e.target.value))}
              className="w-full accent-sky-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Roof Area (X4)</span>
              <span className="font-mono text-sky-400 text-xs font-semibold">{features.roofArea.toFixed(1)} m²</span>
            </div>
            <input
              type="range"
              min="110.25"
              max="220.50"
              step="12.25"
              value={features.roofArea}
              onChange={(e) => updateField('roofArea', parseFloat(e.target.value))}
              className="w-full accent-sky-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Automatic Envelope Surface Area info badge */}
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">Total Envelope Surface Area (X2):</span>
          <span className="font-mono text-emerald-400 font-bold">
            {features.surfaceArea.toFixed(1)} m² <span className="text-[10px] text-slate-400 font-normal">(2×Roof + Wall)</span>
          </span>
        </div>

        {/* Orientation (X6) */}
        <div>
          <label className="text-xs font-semibold text-slate-200 block mb-1.5">
            Building Orientation (X6)
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: 2, label: 'North', sub: 'Low Gain' },
              { val: 3, label: 'East', sub: 'Morning' },
              { val: 4, label: 'South', sub: 'Peak Sun' },
              { val: 5, label: 'West', sub: 'Afternoon' },
            ].map((o) => (
              <button
                key={o.val}
                onClick={() => updateField('orientation', o.val)}
                className={`py-1.5 px-2 rounded-lg text-center border text-xs transition-all ${
                  features.orientation === o.val
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-sm'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>{o.label}</div>
                <div className="text-[9px] text-slate-400">{o.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Glazing Area Ratio (X7) */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-200">Glazing Window Area (X7)</span>
            <span className="font-mono text-sky-400 font-bold">{(features.glazingArea * 100).toFixed(0)}% of floor</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0.0, 0.10, 0.25, 0.40].map((g) => (
              <button
                key={g}
                onClick={() => updateField('glazingArea', g)}
                className={`py-1.5 rounded-lg text-center border text-xs transition-all ${
                  features.glazingArea === g
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {(g * 100).toFixed(0)}%
              </button>
            ))}
          </div>
        </div>

        {/* Glazing Distribution (X8) */}
        <div>
          <label className="text-xs font-semibold text-slate-200 block mb-1">
            Glazing Distribution (X8)
          </label>
          <select
            value={features.glazingAreaDistribution}
            onChange={(e) => updateField('glazingAreaDistribution', parseInt(e.target.value, 10))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value={0}>0: No Glazing / Blank Envelope</option>
            <option value={1}>1: Uniformly Distributed All Facades</option>
            <option value={2}>2: Concentrated on North Facade</option>
            <option value={3}>3: Concentrated on East Facade</option>
            <option value={4}>4: Concentrated on South Facade (High Solar)</option>
            <option value={5}>5: Concentrated on West Facade (Late Thermal)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
