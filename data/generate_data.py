"""
Data Generation & Benchmark Dataset Downloader
Generates 768 building simulation samples conforming to the UCI Energy Efficiency
benchmark (Tsanas & Xifara) and saves to data/energy_efficiency_data.csv.
"""

import os
import sys

# Ensure parent directory is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.data_loader import generate_synthetic_energy_data, validate_architectural_geometry

def main():
    data_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, "energy_efficiency_data.csv")

    print(f"Generating 768 benchmark building energy samples...")
    df = generate_synthetic_energy_data(n_samples=768, random_state=42)
    validate_architectural_geometry(df)

    df.to_csv(csv_path, index=False)
    print(f"Successfully saved benchmark dataset to: {csv_path}")
    print(f"Features: {list(df.columns)}")
    print(f"Shape: {df.shape}")

if __name__ == "__main__":
    main()
