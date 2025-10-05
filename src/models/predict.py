import numpy as np
import pandas as pd
from pathlib import Path

class ExoplanetPredictor:
    def __init__(self, model, preprocessor):
        self.model = model
        self.preprocessor = preprocessor

    def predict_batch(self, df):
        X, _ = self.preprocessor.preprocess(df, fit=False)

        predictions, probabilities = self.model.predict(X)

        results = []
        class_names = ['FALSE_POSITIVE', 'CANDIDATE', 'CONFIRMED']

        for idx, (pred, probs) in enumerate(zip(predictions, probabilities)):
            result = {
                'index': idx,
                'classification': class_names[pred],
                'confidence': float(probs[pred]),
                'probabilities': {
                    'false_positive': float(probs[0]),
                    'candidate': float(probs[1]),
                    'confirmed': float(probs[2])
                }
            }

            for col in df.columns:
                if col in ['koi_period', 'koi_prad', 'koi_teq', 'koi_srad', 'ra', 'dec']:
                    result[col] = float(df.iloc[idx][col]) if pd.notna(df.iloc[idx][col]) else None

            if 'kepoi_name' in df.columns:
                result['name'] = str(df.iloc[idx]['kepoi_name'])
            elif 'kepid' in df.columns:
                result['name'] = f"KOI-{df.iloc[idx]['kepid']}"
            else:
                result['name'] = f"Object-{idx + 1}"

            results.append(result)

        return results

    def predict_single(self, features):
        df = pd.DataFrame([features])
        return self.predict_batch(df)[0]

    def filter_predictions(self, predictions, min_confidence=0.5, classification=None):
        filtered = [
            p for p in predictions
            if p['confidence'] >= min_confidence
        ]

        if classification:
            filtered = [p for p in filtered if p['classification'] == classification]

        return filtered
