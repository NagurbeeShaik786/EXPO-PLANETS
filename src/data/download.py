import requests
import pandas as pd
from pathlib import Path

class ExoplanetDataDownloader:
    def __init__(self, data_dir='data/raw'):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)

        self.datasets = {
            'kepler': 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+koi&format=csv',
            'tess': 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+toi&format=csv'
        }

    def download_kepler_data(self):
        try:
            print("Downloading Kepler KOI data...")
            response = requests.get(self.datasets['kepler'], timeout=60)
            response.raise_for_status()

            filepath = self.data_dir / 'kepler_koi.csv'
            with open(filepath, 'wb') as f:
                f.write(response.content)

            print(f"Kepler data saved to {filepath}")
            return filepath
        except Exception as e:
            print(f"Error downloading Kepler data: {e}")
            return None

    def download_tess_data(self):
        try:
            print("Downloading TESS TOI data...")
            response = requests.get(self.datasets['tess'], timeout=60)
            response.raise_for_status()

            filepath = self.data_dir / 'tess_candidates.csv'
            with open(filepath, 'wb') as f:
                f.write(response.content)

            print(f"TESS data saved to {filepath}")
            return filepath
        except Exception as e:
            print(f"Error downloading TESS data: {e}")
            return None

    def download_all(self):
        self.download_kepler_data()
        self.download_tess_data()

if __name__ == '__main__':
    downloader = ExoplanetDataDownloader()
    downloader.download_all()
