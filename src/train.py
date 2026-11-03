"""
Model Training, Cross-Validation, Hyperparameter Tuning & Serialization Pipeline
Compares Ridge Regression, Random Forest, and Gradient Boosting Regressors.
Evaluates using RMSE, MAE, and R^2, then exports the best pipeline.
"""

import os
import json
import logging
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import KFold, cross_val_score

from src.data_loader import (
    load_dataset,
    prepare_train_test_data,
    FEATURE_COLUMNS,
    TARGET_COLUMNS
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def evaluate_predictions(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Computes RMSE, MAE, and R^2 metrics."""
    mse = mean_squared_error(y_true, y_pred)
    rmse = float(np.sqrt(mse))
    mae = float(mean_absolute_error(y_true, y_pred))
    r2 = float(r2_score(y_true, y_pred))

    return {
        "rmse": round(rmse, 3),
        "mae": round(mae, 3),
        "r2_score": round(r2, 4)
    }


def train_and_compare_models(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series,
    random_state: int = 42
) -> Tuple[Dict[str, Pipeline], pd.DataFrame]:
    """
    Trains multiple candidate regressors inside pipelines (with StandardScaler),
    runs 5-fold cross-validation, and computes test performance metrics.
    """
    models_config = {
        "Ridge Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("regressor", Ridge(alpha=1.0, random_state=random_state))
        ]),
        "Random Forest": Pipeline([
            ("scaler", StandardScaler()),
            ("regressor", RandomForestRegressor(
                n_estimators=150,
                max_depth=10,
                min_samples_split=3,
                random_state=random_state,
                n_jobs=-1
            ))
        ]),
        "Gradient Boosting": Pipeline([
            ("scaler", StandardScaler()),
            ("regressor", GradientBoostingRegressor(
                n_estimators=200,
                learning_rate=0.08,
                max_depth=4,
                subsample=0.85,
                random_state=random_state
            ))
        ])
    }

    # Attempt to include XGBoost if installed
    try:
        from xgboost import XGBRegressor
        models_config["XGBoost Regressor"] = Pipeline([
            ("scaler", StandardScaler()),
            ("regressor", XGBRegressor(
                n_estimators=150,
                learning_rate=0.08,
                max_depth=4,
                random_state=random_state
            ))
        ])
    except ImportError:
        logger.info("XGBoost not installed; proceeding with scikit-learn ensemble suite.")

    results = []
    trained_pipelines = {}
    kf = KFold(n_splits=5, shuffle=True, random_state=random_state)

    for name, pipeline in models_config.items():
        logger.info(f"Training and validating: {name}...")

        # 5-Fold Cross Validation R^2
        cv_scores = cross_val_score(pipeline, X_train, y_train, cv=kf, scoring="r2")
        cv_r2_mean = float(np.mean(cv_scores))
        cv_r2_std = float(np.std(cv_scores))

        # Train on full training set
        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline

        # Evaluate on unseen holdout test set
        y_pred = pipeline.predict(X_test)
        metrics = evaluate_predictions(y_test, y_pred)

        results.append({
            "Model": name,
            "R2 Score": metrics["r2_score"],
            "RMSE (kWh/m^2)": metrics["rmse"],
            "MAE (kWh/m^2)": metrics["mae"],
            "CV R2 Mean": round(cv_r2_mean, 4),
            "CV R2 Std": round(cv_r2_std, 4)
        })

    results_df = pd.DataFrame(results).sort_values(by="RMSE (kWh/m^2)", ascending=True).reset_index(drop=True)
    return trained_pipelines, results_df


def save_best_model_artifacts(
    best_name: str,
    pipeline: Pipeline,
    results_df: pd.DataFrame,
    output_dir: str = "models"
) -> str:
    """
    Saves the best-performing pipeline and performance metadata to disk.
    """
    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, "best_cooling_load_model.joblib")
    meta_path = os.path.join(output_dir, "model_metadata.json")

    # Serialize trained pipeline with joblib
    joblib.dump(pipeline, model_path)
    logger.info(f"Saved best model pipeline ({best_name}) to {model_path}")

    # Save summary metadata
    best_stats = results_df[results_df["Model"] == best_name].iloc[0].to_dict()
    metadata = {
        "best_model_name": best_name,
        "features": FEATURE_COLUMNS,
        "metrics": best_stats,
        "all_model_benchmarks": results_df.to_dict(orient="records"),
        "target": "cooling_load (kWh/m^2)"
    }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    logger.info(f"Saved model metadata to {meta_path}")
    return model_path


def run_pipeline(data_path: str = "data/energy_efficiency_data.csv") -> Tuple[str, pd.DataFrame]:
    """Full execution runner for training and serialization."""
    df = load_dataset(data_path)
    X_train, X_test, y_train, y_test, _ = prepare_train_test_data(df, target_column="cooling_load")

    trained_pipelines, results_df = train_and_compare_models(X_train, y_train, X_test, y_test)

    print("\n" + "="*70)
    print(" MODEL PERFORMANCE BENCHMARK (Building Cooling Load Prediction)")
    print("="*70)
    print(results_df.to_string(index=False))
    print("="*70 + "\n")

    best_model_name = results_df.iloc[0]["Model"]
    best_pipeline = trained_pipelines[best_model_name]

    model_path = save_best_model_artifacts(best_model_name, best_pipeline, results_df)
    return model_path, results_df


if __name__ == "__main__":
    run_pipeline()
