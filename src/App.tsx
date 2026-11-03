import React, { useState } from 'react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { DigitalTwinViewer } from './components/DigitalTwinViewer';
import { SlidersPanel } from './components/SlidersPanel';
import { PredictionCard } from './components/PredictionCard';
import { ModelBenchmarks } from './components/ModelBenchmarks';
import { FeatureImportanceView } from './components/FeatureImportanceView';
import { CodebaseViewer } from './components/CodebaseViewer';
import { BatchPredictor } from './components/BatchPredictor';
import {
  predictCoolingLoad,
  type BuildingFeatures,
  type ModelType,
} from './utils/ml_engine';

const DEFAULT_FEATURES: BuildingFeatures = {
  relativeCompactness: 0.76,
  surfaceArea: 661.5,
  wallArea: 416.5,
  roofArea: 122.50,
  overallHeight: 7.0,
  orientation: 3, // East
  glazingArea: 0.25,
  glazingAreaDistribution: 1, // Uniform
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('twin');
  const [features, setFeatures] = useState<BuildingFeatures>(DEFAULT_FEATURES);
  const [selectedModel, setSelectedModel] = useState<ModelType>('gbdt');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Real-time ML Prediction
  const prediction = predictCoolingLoad(features, selectedModel);

  const modelLabels: Record<ModelType, string> = {
    gbdt: 'Gradient Boosting Regressor (Champion)',
    rf: 'Random Forest Regressor (Ensemble)',
    ridge: 'Ridge Regression (L2 Regularized)',
  };

  const handleDownloadProject = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      // Project configuration & docs
      const reqTxt = `# Core Machine Learning & Data Processing
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
xgboost>=2.0.0
joblib>=1.3.0

# Interactive Web Application
streamlit>=1.30.0
plotly>=5.18.0
matplotlib>=3.8.0
seaborn>=0.13.0

# Utilities
openpyxl>=3.1.2
requests>=2.31.0
python-dotenv>=1.0.0`;

      zip.file('requirements.txt', reqTxt);

      // Fetch or package all project files
      const filePaths = [
        'app.py',
        'README.md',
        'src/__init__.py',
        'src/data_loader.py',
        'src/feature_selection.py',
        'src/train.py',
        'src/predict.py',
        'data/generate_data.py',
        'data/energy_efficiency_data.csv',
        'models/model_metadata.json',
      ];

      for (const fp of filePaths) {
        try {
          const res = await fetch(`/${fp}`);
          if (res.ok) {
            const text = await res.text();
            zip.file(fp, text);
          }
        } catch {
          // fallback placeholder
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'building_cooling_load_ml_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Failed to bundle project zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadProject={handleDownloadProject}
        isDownloading={isDownloading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'twin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 Cols: Design Sliders Panel */}
            <div className="lg:col-span-5 space-y-6">
              <SlidersPanel
                features={features}
                onChange={setFeatures}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                onReset={() => setFeatures(DEFAULT_FEATURES)}
              />
            </div>

            {/* Right 7 Cols: Digital Twin & Prediction Metrics */}
            <div className="lg:col-span-7 space-y-6">
              <DigitalTwinViewer
                features={features}
                prediction={prediction}
              />
              <PredictionCard
                prediction={prediction}
                features={features}
                modelName={modelLabels[selectedModel]}
              />
            </div>
          </div>
        )}

        {activeTab === 'benchmarks' && <ModelBenchmarks />}

        {activeTab === 'importance' && <FeatureImportanceView />}

        {activeTab === 'code' && (
          <CodebaseViewer
            onDownloadProject={handleDownloadProject}
            isDownloading={isDownloading}
          />
        )}

        {activeTab === 'batch' && <BatchPredictor />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Benchmark Dataset: <strong>UCI Energy Efficiency</strong> (A. Tsanas &amp; A. Xifara, Oxford / Ecotect)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Ensemble: Gradient Boosting • Random Forest • Ridge • Streamlit UI
          </span>
        </div>
      </footer>
    </div>
  );
}
