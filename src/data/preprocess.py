import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.impute import SimpleImputer
import yaml

class ExoplanetPreprocessor:
    def __init__(self, config_path='config/config.yaml'):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)

        self.scaler = None
        self.imputer = None
        self.feature_names = None

    def load_data(self, filepath):
        df = pd.read_csv(filepath)
        print(f"Loaded {len(df)} rows from {filepath}")
        return df

    def select_features(self, df):
        numeric_features = [
            'koi_period', 'koi_time0bk', 'koi_impact', 'koi_duration',
            'koi_depth', 'koi_prad', 'koi_teq', 'koi_insol',
            'koi_steff', 'koi_slogg', 'koi_srad', 'ra', 'dec'
        ]

        available_features = [f for f in numeric_features if f in df.columns]

        if 'koi_disposition' in df.columns:
            target = df['koi_disposition']
        else:
            target = None

        X = df[available_features]
        self.feature_names = available_features

        return X, target

    def handle_missing_values(self, X):
        strategy = self.config['preprocessing']['missing_value_strategy']

        if self.imputer is None:
            self.imputer = SimpleImputer(strategy=strategy)
            X_imputed = self.imputer.fit_transform(X)
        else:
            X_imputed = self.imputer.transform(X)

        return pd.DataFrame(X_imputed, columns=X.columns, index=X.index)

    def scale_features(self, X):
        method = self.config['preprocessing']['scaling_method']

        if self.scaler is None:
            if method == 'standard':
                self.scaler = StandardScaler()
            elif method == 'minmax':
                self.scaler = MinMaxScaler()

            X_scaled = self.scaler.fit_transform(X)
        else:
            X_scaled = self.scaler.transform(X)

        return pd.DataFrame(X_scaled, columns=X.columns, index=X.index)

    def encode_target(self, y):
        if y is None:
            return None

        mapping = {
            'CONFIRMED': 2,
            'CANDIDATE': 1,
            'FALSE POSITIVE': 0
        }

        return y.map(mapping)

    def preprocess(self, df, fit=True):
        X, y = self.select_features(df)

        print(f"Selected {len(self.feature_names)} features")
        print(f"Missing values: {X.isnull().sum().sum()}")

        X = self.handle_missing_values(X)
        X = self.scale_features(X)

        if y is not None:
            y = self.encode_target(y)

        return X, y

    def get_statistics(self, df):
        X, _ = self.select_features(df)

        stats = {
            'shape': df.shape,
            'missing_values': X.isnull().sum().to_dict(),
            'summary': X.describe().to_dict()
        }

        return stats
