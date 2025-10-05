import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import yaml
from pathlib import Path

class ExoplanetClassifier:
    def __init__(self, config_path='config/config.yaml'):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)

        self.model = None
        self.model_type = 'random_forest'

    def create_model(self, model_type='random_forest'):
        self.model_type = model_type

        if model_type == 'random_forest':
            self.model = RandomForestClassifier(
                n_estimators=self.config['model']['n_estimators'],
                random_state=self.config['model']['random_state'],
                class_weight='balanced',
                n_jobs=-1
            )
        elif model_type == 'gradient_boosting':
            self.model = GradientBoostingClassifier(
                n_estimators=self.config['model']['n_estimators'],
                random_state=self.config['model']['random_state']
            )

        return self.model

    def train(self, X, y):
        if self.model is None:
            self.create_model()

        print(f"Training {self.model_type} model...")
        print(f"Training samples: {len(X)}")
        print(f"Class distribution: {pd.Series(y).value_counts().to_dict()}")

        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=self.config['model']['test_size'],
            random_state=self.config['model']['random_state'],
            stratify=y
        )

        self.model.fit(X_train, y_train)

        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)

        print(f"Training accuracy: {train_score:.4f}")
        print(f"Test accuracy: {test_score:.4f}")

        y_pred = self.model.predict(X_test)
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=['FALSE_POS', 'CANDIDATE', 'CONFIRMED']))

        return {
            'train_score': train_score,
            'test_score': test_score,
            'model_type': self.model_type
        }

    def predict(self, X):
        if self.model is None:
            raise ValueError("Model not trained yet")

        predictions = self.model.predict(X)
        probabilities = self.model.predict_proba(X)

        return predictions, probabilities

    def save_model(self, filepath='models/trained_model.pkl'):
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, filepath)
        print(f"Model saved to {filepath}")

    def load_model(self, filepath='models/trained_model.pkl'):
        self.model = joblib.load(filepath)
        print(f"Model loaded from {filepath}")

    def get_feature_importance(self, feature_names):
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
            return dict(zip(feature_names, importances))
        return {}
