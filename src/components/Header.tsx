import React from 'react';
import { Cpu, Download, Sparkles, Building2, BarChart3, LineChart, Code2, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownloadProject: () => void;
  isDownloading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onDownloadProject,
  isDownloading,
}) => {
  const tabs = [
    { id: 'twin', label: '3D Digital Twin & Predictor', icon: Building2 },
    { id: 'benchmarks', label: 'Model Benchmarks', icon: BarChart3 },
    { id: 'importance', label: 'Feature Importance & EDA', icon: LineChart },
    { id: 'code', label: 'Python Code & Streamlit', icon: Code2 },
    { id: 'batch', label: 'Batch CSV Scorer', icon: Layers },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight">CoolingLoad-ML Studio</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  UCI Benchmark R² 0.985
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End Architectural Machine Learning Pipeline &amp; Thermal Digital Twin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadProject}
              disabled={isDownloading}
              className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition-all shadow-md shadow-emerald-900/30 disabled:opacity-50"
              title="Download modular Python project with requirements, src/, data/, app.py, and models"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Packaging ZIP...' : 'Download Python Project (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-1 border-t border-slate-800/80 pt-2 pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
