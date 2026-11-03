"""
Exploratory Data Analysis (EDA) & Feature Selection Pipeline
Analyzes correlation structure, multicollinearity (VIF), and ranks feature importance
via Tree Ensembles (Random Forest / GBDT) and Recursive Feature Elimination (RFE).
"""

import logging
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_selection import RFE
from sklearn.linear_model import Ridge

logger = logging.getLogger(__name__)


def compute_correlation_matrix(df: pd.DataFrame, target: str = "cooling_load") -> pd.DataFrame:
    """
    Computes Pearson correlation matrix and sorts features by absolute correlation to target.
    """
    corr = df.corr()
    target_corr = corr[[target]].sort_values(by=target, ascending=False)
    logger.info(f"Top correlations with {target}:\n{target_corr.to_string()}")
    return corr


def compute_multicollinearity_vif(df: pd.DataFrame, feature_cols: List[str]) -> pd.DataFrame:
    """
    Calculates Variance Inflation Factor (VIF) for design features.
    In building energy benchmarks, Surface Area, Roof Area, and Relative Compactness
    have high collinearity due to geometric laws (Surface = 2*Roof + Wall).
    """
    from sklearn.linear_model import LinearRegression

    vif_data = []
    X = df[feature_cols].copy()

    for col in feature_cols:
        other_cols = [c for c in feature_cols if c != col]
        X_others = X[other_cols]
        y_col = X[col]

        r_sq = LinearRegression().fit(X_others, y_col).score(X_others, y_col)
        vif = 1.0 / (1.0 - r_sq) if r_sq < 0.9999 else 999.0
        vif_data.append({"feature": col, "vif": round(vif, 2), "r_squared": round(r_sq, 4)})

    vif_df = pd.DataFrame(vif_data).sort_values(by="vif", ascending=False)
    return vif_df


def extract_tree_feature_importance(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    random_state: int = 42
) -> pd.DataFrame:
    """
    Fits a Random Forest Regressor and extracts Gini impurity-based feature importances.
    """
    rf = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=random_state)
    rf.fit(X_train, y_train)

    importances = rf.feature_importances_
    features = X_train.columns

    importance_df = pd.DataFrame({
        "feature": features,
        "importance": importances,
        "importance_percentage": np.round(importances * 100, 2)
    }).sort_values(by="importance", ascending=False).reset_index(drop=True)

    logger.info("Random Forest Feature Importances computed.")
    return importance_df


def run_recursive_feature_elimination(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    n_features_to_select: int = 5
) -> Tuple[List[str], pd.DataFrame]:
    """
    Performs Recursive Feature Elimination (RFE) to identify the optimal subset
    of architectural drivers.
    """
    estimator = Ridge(alpha=1.0)
    selector = RFE(estimator=estimator, n_features_to_select=n_features_to_select, step=1)
    selector.fit(X_train, y_train)

    rfe_ranking = pd.DataFrame({
        "feature": X_train.columns,
        "ranking": selector.ranking_,
        "selected": selector.support_
    }).sort_values(by="ranking").reset_index(drop=True)

    selected_features = list(X_train.columns[selector.support_])
    logger.info(f"RFE selected {len(selected_features)} features: {selected_features}")
    return selected_features, rfe_ranking


def run_full_feature_selection_report(
    X_train: pd.DataFrame,
    y_train: pd.Series
) -> Dict[str, Any]:
    """
    Runs full analysis suite: Tree importance, Correlation, and RFE.
    """
    combined_df = X_train.copy()
    combined_df["cooling_load"] = y_train

    corr_matrix = compute_correlation_matrix(combined_df, target="cooling_load")
    importance_df = extract_tree_feature_importance(X_train, y_train)
    selected_rfe, rfe_df = run_recursive_feature_elimination(X_train, y_train)

    return {
        "correlation_with_target": corr_matrix["cooling_load"].to_dict(),
        "tree_importance": importance_df.to_dict(orient="records"),
        "rfe_selected_features": selected_rfe,
        "rfe_ranking": rfe_df.to_dict(orient="records")
    }


if __name__ == "__main__":
    from src.data_loader import generate_synthetic_energy_data, prepare_train_test_data

    df = generate_synthetic_energy_data()
    X_train, X_test, y_train, y_test, _ = prepare_train_test_data(df)

    report = run_full_feature_selection_report(X_train, y_train)
    print("\n--- Tree-Based Feature Importances ---")
    for item in report["tree_importance"]:
        print(f"  {item['feature']:<26}: {item['importance_percentage']}%")

    print("\n--- RFE Selected Top Features ---")
    print(", ".join(report["rfe_selected_features"]))
