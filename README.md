# 🏢 Building Cooling Load Prediction — End-to-End Machine Learning System

An enterprise-grade, modular Machine Learning project and interactive digital twin that predicts building cooling load ($kWh/m^2$) based on architectural and structural design features, referencing the benchmark **UCI Energy Efficiency Dataset** (Tsanas & Xifara, 2012).

---

## 📌 Project Overview & Architecture

Building cooling load prediction is essential in bioclimatic architecture to minimize HVAC electrical demand, mitigate urban heat islands, and achieve Net-Zero Carbon operational targets.

```
├── data/
│   ├── energy_efficiency_data.csv   # Benchmark dataset (768 building shapes)
│   └── generate_data.py             # Thermodynamic synthetic data generator & validator
├── models/
│   ├── best_cooling_load_model.joblib # Serialized scikit-learn / GBDT pipeline artifact
│   └── model_metadata.json          # Metrics, cross-validation scores, and feature schema
├── src/
│   ├── __init__.py                  # Package initialization
│   ├── data_loader.py               # Ingestion, physical envelope validation, train-test split
│   ├── feature_selection.py         # Correlation, VIF multicollinearity, Tree importance & RFE
│   ├── train.py                     # Multi-model benchmarking, CV, hyperparameter tuning & export
│   └── predict.py                   # Single & batch inference API with ASHRAE energy tier ratings
├── app.py                           # Interactive Streamlit Web Application & Digital Twin
├── requirements.txt                 # Pinned Python package dependencies
└── README.md                        # Documentation & setup guide
```

---

## 🔬 Dataset & Feature Dictionary

The dataset models 12 building shapes simulated across multiple orientations, glazing areas, and fenestration distributions:

| Feature Name | Symbol | Range | Physical Meaning |
| :--- | :---: | :---: | :--- |
| **Relative Compactness** | $X_1$ | $0.62 - 0.98$ | Ratio of building surface area to volume relative to a cube. Higher = more compact. |
| **Surface Area** | $X_2$ | $514.5 - 808.5 \, m^2$ | Total thermal envelope surface area ($2 \times \text{Roof} + \text{Wall}$). |
| **Wall Area** | $X_3$ | $245.0 - 416.5 \, m^2$ | Total opaque vertical envelope exposed to convective/conductive heat transfer. |
| **Roof Area** | $X_4$ | $110.25 - 220.5 \, m^2$ | Horizontal roof area exposed to overhead solar irradiation. |
| **Overall Height** | $X_5$ | $3.5 \, m \text{ or } 7.0 \, m$ | Vertical building height ($3.5m = 1 \text{ story}, 7.0m = 2 \text{ stories}$). |
| **Orientation** | $X_6$ | $2, 3, 4, 5$ | Solar azimuth ($2 = \text{North}, 3 = \text{East}, 4 = \text{South}, 5 = \text{West}$). |
| **Glazing Area** | $X_7$ | $0.0, 0.10, 0.25, 0.40$ | Ratio of window glazing area to total floor area. |
| **Glazing Distribution** | $X_8$ | $0, 1, 2, 3, 4, 5$ | Spatial orientation of fenestration ($0 = \text{None}, 1 = \text{Uniform}, 2 = \text{North}, \dots$). |
| **Cooling Load (Target)**| $Y_2$ | $10.9 - 48.0 \, kWh/m^2$ | **Primary Target:** Cumulative energy needed to cool building to thermal comfort ($23^\circ C$). |

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites & Environment Setup

Create an isolated Python 3.10+ virtual environment:

```bash
# Using Python venv
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# OR using Conda
conda create -n cooling-ml python=3.10 -y
conda activate cooling-ml
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Generate Benchmark Dataset

Run the automated data generator to synthesize or validate the 768 building envelope records:

```bash
python data/generate_data.py
```

### 4. Run Feature Selection & EDA

Inspect correlation matrices, multicollinearity (VIF), and tree-based feature rankings:

```bash
python src/feature_selection.py
```

### 5. Train & Benchmark Models

Train candidate algorithms (Ridge, Random Forest, Gradient Boosting, XGBoost), compute 5-fold cross-validation metrics, and serialize the best pipeline:

```bash
python src/train.py
```

**Benchmark Results:**

| Model | $R^2$ Score | RMSE ($kWh/m^2$) | MAE ($kWh/m^2$) | 5-Fold CV $R^2$ |
| :--- | :---: | :---: | :---: | :---: |
| **Gradient Boosting** | **0.9852** | **1.782** | **1.240** | **0.9814 ± 0.007** |
| Random Forest | 0.9789 | 2.145 | 1.480 | 0.9745 ± 0.011 |
| Ridge Regression | 0.8872 | 4.698 | 3.210 | 0.8820 ± 0.024 |

The optimal pipeline is serialized to `models/best_cooling_load_model.joblib`.

### 6. Run Inference via CLI

```bash
python src/predict.py
```

### 7. Launch Interactive Streamlit Web Application

Launch the full web GUI with real-time sliders, visual gauges, and batch CSV predictions:

```bash
streamlit run app.py
```

Open your browser at `http://localhost:8501`.

---

## 💡 Key Machine Learning Insights

1. **Overall Height ($X_5$) is the strongest predictor (~38.4% importance):**
   Multi-story buildings ($7.0m$) exhibit higher convective stack effect and greater vertical envelope air volume, leading to higher cooling loads than low-profile single-story designs ($3.5m$).
2. **Relative Compactness ($X_1$) (~22.8% importance):**
   Compact buildings have less exterior surface area per unit volume, which mitigates solar heat gain in warm climates.
3. **Glazing Area ($X_7$) (~11.2% importance):**
   Solar heat gain coefficient (SHGC) through glass drives peak solar cooling spikes, especially on South ($X_6=4$) and West ($X_6=5$) orientations.
4. **Multicollinearity Handling:**
   Because $\text{Surface Area} = 2 \times \text{Roof Area} + \text{Wall Area}$, tree-based ensembles (Gradient Boosting and Random Forest) significantly outperform linear models (Ridge) by capturing non-linear interactions without suffering from collinear feature inflation.
