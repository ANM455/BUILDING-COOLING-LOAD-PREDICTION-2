import React, { useState } from 'react';
import { Compass, Sun, Eye, Info, Sparkles } from 'lucide-react';
import type { BuildingFeatures, PredictionResult } from '../utils/ml_engine';

interface DigitalTwinViewerProps {
  features: BuildingFeatures;
  prediction: PredictionResult;
}

export const DigitalTwinViewer: React.FC<DigitalTwinViewerProps> = ({
  features,
  prediction,
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const {
    relativeCompactness,
    surfaceArea,
    wallArea,
    roofArea,
    overallHeight,
    orientation,
    glazingArea,
    glazingAreaDistribution,
  } = features;

  // Orientation label and angle
  const orientData: Record<number, { name: string; angle: number; desc: string }> = {
    2: { name: 'North', angle: 0, desc: 'Low direct solar radiation' },
    3: { name: 'East', angle: 90, desc: 'Morning solar gain' },
    4: { name: 'South', angle: 180, desc: 'Peak midday solar irradiation (Highest Cooling Impact)' },
    5: { name: 'West', angle: 270, desc: 'Afternoon high thermal heat load' },
  };

  const currentOrient = orientData[orientation] || orientData[3];

  // Visual geometric scaling
  // Height: 3.5m is ~70px, 7.0m is ~130px
  const isTwoStory = overallHeight >= 5.0;
  const buildingHeight = isTwoStory ? 135 : 75;

  // Aspect ratio based on relative compactness (0.62 is long/spread out, 0.98 is compact cube)
  // Higher compactness -> closer to 1:1 footprint
  const widthRatio = 1.0 + (0.98 - relativeCompactness) * 1.5;
  const buildingWidth = Math.round(140 * Math.min(1.4, Math.max(0.85, widthRatio)));
  const buildingDepth = Math.round(110 / Math.min(1.3, Math.max(0.8, widthRatio)));

  // Glazing visual count
  const windowCount = glazingArea === 0 ? 0 : glazingArea === 0.1 ? 2 : glazingArea === 0.25 ? 4 : 6;

  // Thermal heat color palette based on grade
  const thermalColor = prediction.gradeColor;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Bar Info */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-slate-200">Architectural Digital Twin</h2>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
            Scale 1:50
          </span>
        </div>

        {/* Orientation compass indicator */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/70 text-xs">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-300 font-medium">Facing {currentOrient.name}</span>
          <span className="text-slate-500 font-mono">({currentOrient.angle}°)</span>
        </div>
      </div>

      {/* 3D Isometric SVG Architectural Canvas */}
      <div className="relative w-full h-[320px] flex items-center justify-center my-2 select-none">
        <svg
          viewBox="0 0 500 360"
          className="w-full h-full max-h-[340px] drop-shadow-2xl transition-all duration-500"
        >
          <defs>
            {/* Ground shadow radial */}
            <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Thermal facade gradient */}
            <linearGradient id="facadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Thermal envelope heat glow */}
            <linearGradient id="thermalGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={thermalColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={thermalColor} stopOpacity="0.05" />
            </linearGradient>

            {/* Glass window reflection gradient */}
            <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.65" />
            </linearGradient>
          </defs>

          {/* Ground Grid Base */}
          <ellipse cx="250" cy="275" rx="190" ry="55" fill="url(#groundShadow)" />

          {/* Compass Rose on Ground */}
          <g transform="translate(100, 275)" opacity="0.45">
            <ellipse cx="0" cy="0" rx="36" ry="16" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
            <text x="0" y="-18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">N</text>
            <text x="42" y="3" textAnchor="middle" fill="#94a3b8" fontSize="9">E</text>
            <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9">S</text>
            <text x="-42" y="3" textAnchor="middle" fill="#94a3b8" fontSize="9">W</text>
            {/* Active Orientation Vector */}
            <line
              x1="0"
              y1="0"
              x2={Math.sin((currentOrient.angle * Math.PI) / 180) * 32}
              y2={-Math.cos((currentOrient.angle * Math.PI) / 180) * 14}
              stroke="#38bdf8"
              strokeWidth="2"
            />
          </g>

          {/* Solar Azimuth Sun Graphic */}
          <g transform={`translate(${orientation === 4 ? 380 : orientation === 5 ? 400 : 340}, ${orientation === 4 ? 70 : 90})`}>
            <circle cx="0" cy="0" r="16" fill="#f59e0b" filter="drop-shadow(0 0 10px #f59e0b)" />
            <circle cx="0" cy="0" r="13" fill="#fbbf24" />
            <path d="M0 -22 L0 -26 M0 22 L0 26 M-22 0 L-26 0 M22 0 L26 0" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            {/* Solar rays toward building */}
            <line x1="-15" y1="15" x2="-80" y2="70" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
            <text x="0" y="36" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">
              Solar Gain ({currentOrient.name})
            </text>
          </g>

          {/* Isometric Building Rendering */}
          {/* Center Coordinates */}
          {(() => {
            const centerX = 250;
            const baseY = 250;
            const isoX = buildingWidth * 0.85;
            const isoY = buildingDepth * 0.45;
            const topY = baseY - buildingHeight;

            // Points for Front Left Wall:
            // (centerX, baseY) to (centerX - isoX, baseY - isoY) up to (centerX - isoX, topY - isoY) to (centerX, topY)
            const pBaseCenter = `${centerX},${baseY}`;
            const pBaseLeft = `${centerX - isoX},${baseY - isoY}`;
            const pTopLeft = `${centerX - isoX},${topY - isoY}`;
            const pTopCenter = `${centerX},${topY}`;

            // Points for Front Right Wall:
            // (centerX, baseY) to (centerX + isoX, baseY - isoY) up to (centerX + isoX, topY - isoY) to (centerX, topY)
            const pBaseRight = `${centerX + isoX},${baseY - isoY}`;
            const pTopRight = `${centerX + isoX},${topY - isoY}`;

            // Points for Roof:
            // pTopCenter, pTopLeft, pTopBack, pTopRight
            const pTopBack = `${centerX},${topY - 2 * isoY}`;

            return (
              <g className="transition-all duration-300">
                {/* Left Facade (South / West side) */}
                <polygon
                  points={`${pBaseCenter} ${pBaseLeft} ${pTopLeft} ${pTopCenter}`}
                  fill={hoveredPart === 'wall' ? '#475569' : '#1e293b'}
                  stroke={thermalColor}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredPart('wall')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                {/* Thermal glow overlay on left facade */}
                <polygon
                  points={`${pBaseCenter} ${pBaseLeft} ${pTopLeft} ${pTopCenter}`}
                  fill="url(#thermalGlow)"
                  pointerEvents="none"
                />

                {/* Right Facade (East / North side) */}
                <polygon
                  points={`${pBaseCenter} ${pBaseRight} ${pTopRight} ${pTopCenter}`}
                  fill={hoveredPart === 'wall' ? '#334155' : '#0f172a'}
                  stroke="#334155"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredPart('wall')}
                  onMouseLeave={() => setHoveredPart(null)}
                />

                {/* Intermediate Floor Slab if 2-story */}
                {isTwoStory && (
                  <>
                    <line
                      x1={centerX}
                      y1={baseY - buildingHeight / 2}
                      x2={centerX - isoX}
                      y2={baseY - isoY - buildingHeight / 2}
                      stroke="#64748b"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                    <line
                      x1={centerX}
                      y1={baseY - buildingHeight / 2}
                      x2={centerX + isoX}
                      y2={baseY - isoY - buildingHeight / 2}
                      stroke="#475569"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                    {/* Story tags */}
                    <text x={centerX - isoX - 16} y={baseY - isoY - buildingHeight * 0.75} fill="#94a3b8" fontSize="9" fontWeight="bold">L2</text>
                    <text x={centerX - isoX - 16} y={baseY - isoY - buildingHeight * 0.25} fill="#94a3b8" fontSize="9" fontWeight="bold">L1</text>
                  </>
                )}

                {/* Windows / Glazing Panes on Left Facade */}
                {Array.from({ length: windowCount }).map((_, idx) => {
                  const t = (idx + 1) / (windowCount + 1);
                  const storyOffset = isTwoStory && idx % 2 === 1 ? buildingHeight * 0.45 : 0;
                  const winX = centerX - isoX * t;
                  const winY = baseY - isoY * t - 20 - storyOffset;
                  const wW = 16;
                  const wH = 22;

                  return (
                    <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPart('glazing')} onMouseLeave={() => setHoveredPart(null)}>
                      <polygon
                        points={`${winX},${winY} ${winX - wW},${winY - (wW * isoY) / isoX} ${winX - wW},${winY - (wW * isoY) / isoX - wH} ${winX},${winY - wH}`}
                        fill="url(#glassReflect)"
                        stroke="#7dd3fc"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}

                {/* Roof Polygon */}
                <polygon
                  points={`${pTopCenter} ${pTopLeft} ${pTopBack} ${pTopRight}`}
                  fill={hoveredPart === 'roof' ? '#38bdf825' : '#334155'}
                  stroke={hoveredPart === 'roof' ? '#38bdf8' : '#475569'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredPart('roof')}
                  onMouseLeave={() => setHoveredPart(null)}
                />

                {/* Roof Solar Panels or Skylights indication */}
                <ellipse cx={centerX} cy={topY - isoY} rx={isoX * 0.4} ry={isoY * 0.4} fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,3" />

                {/* Dimension callout indicators */}
                <text
                  x={centerX - isoX / 2 - 20}
                  y={baseY + 16}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Wall {wallArea.toFixed(0)}m²
                </text>
                <text
                  x={centerX}
                  y={topY - 2 * isoY - 10}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Roof {roofArea.toFixed(1)}m²
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Hover inspector tooltip */}
        {hoveredPart && (
          <div className="absolute bottom-3 left-4 bg-slate-800/95 border border-slate-700 px-3 py-1.5 rounded-lg shadow-xl text-xs backdrop-blur-md">
            <span className="font-semibold text-sky-400 capitalize">{hoveredPart} Envelope Zone:</span>
            <span className="text-slate-300 ml-1.5 font-mono">
              {hoveredPart === 'roof'
                ? `${roofArea.toFixed(1)} m² (Overhead solar gain)`
                : hoveredPart === 'glazing'
                ? `${(glazingArea * 100).toFixed(0)}% window-to-wall ratio`
                : `${wallArea.toFixed(1)} m² vertical envelope`}
            </span>
          </div>
        )}
      </div>

      {/* Envelope Stats Ribbon */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-center">
        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Compactness</span>
          <span className="text-sm font-bold text-slate-200 font-mono">{relativeCompactness.toFixed(2)}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Height</span>
          <span className="text-sm font-bold text-slate-200 font-mono">{overallHeight.toFixed(1)}m ({isTwoStory ? '2-Fl' : '1-Fl'})</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Glazing</span>
          <span className="text-sm font-bold text-sky-400 font-mono">{(glazingArea * 100).toFixed(0)}%</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Surface (X2)</span>
          <span className="text-sm font-bold text-slate-200 font-mono">{surfaceArea.toFixed(1)}m²</span>
        </div>
      </div>
    </div>
  );
};
