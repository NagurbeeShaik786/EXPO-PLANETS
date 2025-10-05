import pandas as pd
import numpy as np
from pathlib import Path
import json
from datetime import datetime

class UploadHandler:
    def __init__(self, upload_folder='data/uploads'):
        self.upload_folder = Path(upload_folder)
        self.upload_folder.mkdir(parents=True, exist_ok=True)

    def save_upload(self, file):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"upload_{timestamp}_{file.filename}"
        filepath = self.upload_folder / filename

        file.save(str(filepath))
        return filepath

    def validate_csv(self, filepath):
        try:
            df = pd.read_csv(filepath, nrows=5)

            required_columns = ['koi_period', 'koi_depth']

            return True, "Valid CSV file"
        except Exception as e:
            return False, str(e)

    def analyze_upload(self, filepath):
        df = pd.read_csv(filepath)

        analysis = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'columns': list(df.columns),
            'missing_values': df.isnull().sum().to_dict(),
            'data_types': df.dtypes.astype(str).to_dict(),
            'numeric_summary': {}
        }

        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            analysis['numeric_summary'][col] = {
                'mean': float(df[col].mean()) if not df[col].isnull().all() else None,
                'median': float(df[col].median()) if not df[col].isnull().all() else None,
                'std': float(df[col].std()) if not df[col].isnull().all() else None,
                'min': float(df[col].min()) if not df[col].isnull().all() else None,
                'max': float(df[col].max()) if not df[col].isnull().all() else None
            }

        return analysis

    def prepare_for_training(self, filepath):
        df = pd.read_csv(filepath)

        return df
