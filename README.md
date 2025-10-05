# Exoplanet AI Detector

An advanced web application that uses machine learning to automatically detect and classify exoplanets from NASA mission data (Kepler, K2, TESS). Features include automated data analysis, ML model training, and an interactive 3D galaxy visualization inspired by NASA's Eyes on Exoplanets.

![Exoplanet Detector](https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=400&fit=crop)

## Features

### 🚀 Automated ML Pipeline
- **CSV Upload**: Drag-and-drop interface for uploading exoplanet data
- **Auto-Analysis**: Automatic exploratory data analysis with statistics and visualizations
- **Smart Preprocessing**: Handles missing values, feature scaling, and data normalization
- **Model Training**: Trains Random Forest/Gradient Boosting models on uploaded data
- **Classification**: Identifies planets as CONFIRMED, CANDIDATE, or FALSE_POSITIVE

### 🌌 3D Galaxy Visualization
- **Interactive Exploration**: Powered by Three.js for smooth 3D rendering
- **Click to Focus**: Click any planet system to zoom in and view details
- **Orbital Mechanics**: Real-time visualization of planetary orbits
- **Color-Coded**: Visual distinction between confirmed planets, candidates, and false positives
- **Detailed Info**: View orbital period, radius, temperature, and confidence scores

### 📊 Analytics Dashboard
- **Real-time Statistics**: Track confirmed planets, candidates, and false positives
- **Processing Metrics**: Monitor analysis time and detection rates
- **Data Quality Reports**: View missing values and feature distributions

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** for 3D visualization
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Lucide React** for icons

### Backend
- **Flask** for API server
- **scikit-learn** for ML models
- **pandas** & **numpy** for data processing
- **matplotlib** & **seaborn** for visualizations
- **astropy** & **lightkurve** for astronomy-specific operations

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- pip

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exoplanet_detector
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   ```bash
   cp config/env.example .env
   ```
   Edit `.env` with your configuration.

5. **Create Required Directories**
   ```bash
   mkdir -p data/uploads models
   ```

## Usage

### Development Mode

1. **Start Backend Server**
   ```bash
   python app/run.py
   ```
   Backend will run on `http://localhost:5000`

2. **Start Frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Upload Data**
   - Navigate to the app in your browser
   - Click "Upload" or drag a CSV file
   - Supported format: Kepler/TESS mission data with standard columns

### Production Build

```bash
npm run build
python app/run.py
```

The Flask server will serve the built React app from the `dist` folder.

## Data Format

The application expects CSV files with the following columns (similar to NASA Exoplanet Archive format):

- `koi_period`: Orbital period in days
- `koi_depth`: Transit depth in ppm
- `koi_prad`: Planetary radius in Earth radii
- `koi_teq`: Equilibrium temperature in Kelvin
- `koi_srad`: Stellar radius in solar radii
- `koi_steff`: Stellar effective temperature
- `ra`, `dec`: Right ascension and declination
- `koi_disposition`: Classification (optional, for training)

### Sample Data Sources

- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)
- [Kepler KOI Table](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=koi)
- [TESS TOI Table](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=TOI)

## Project Structure

```
exoplanet_detector/
├── src/                    # Frontend React source
│   ├── components/         # React components
│   ├── services/          # ML service layer
│   ├── types/             # TypeScript definitions
│   └── App.tsx            # Main application
├── app/                    # Flask backend
│   ├── run.py             # Flask server
│   └── routes.py          # API endpoints
├── src/                    # Python backend modules
│   ├── data/              # Data handling
│   ├── models/            # ML models
│   ├── utils/             # Utilities
│   └── evaluation/        # Model evaluation
├── data/                   # Data storage
│   ├── raw/               # Raw NASA data
│   ├── processed/         # Preprocessed data
│   └── uploads/           # User uploads
├── models/                 # Trained models
├── config/                 # Configuration files
└── requirements.txt        # Python dependencies
```

## API Endpoints

### `POST /api/upload`
Upload CSV file for processing
- **Input**: multipart/form-data with file
- **Output**: Analysis summary and file path

### `POST /api/process`
Process uploaded data and train models
- **Input**: `{ filepath: string }`
- **Output**: Predictions, galaxy data, statistics

### `POST /api/eda`
Perform exploratory data analysis
- **Input**: `{ filepath: string }`
- **Output**: Summary statistics and visualizations

### `GET /api/health`
Health check endpoint
- **Output**: Server status and model state

## Machine Learning

### Models Used
- **Random Forest Classifier**: Primary model for classification
- **Gradient Boosting**: Alternative high-accuracy model
- **Feature Engineering**: Automated feature selection and scaling

### Training Process
1. Data validation and cleaning
2. Feature extraction and preprocessing
3. Train-test split (80/20)
4. Model training with cross-validation
5. Hyperparameter tuning
6. Model evaluation and saving

### Classification
- **CONFIRMED**: High-confidence exoplanet (>80%)
- **CANDIDATE**: Potential exoplanet (50-80%)
- **FALSE_POSITIVE**: Likely not a planet (<50%)

## 3D Visualization Controls

- **Click**: Focus on a planet system
- **Drag**: Rotate the view
- **Scroll**: Zoom in/out
- **Reset Button**: Return to overview

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **NASA Exoplanet Archive** for providing open-source exoplanet data
- **NASA Eyes on Exoplanets** for 3D visualization inspiration
- **Kepler, K2, and TESS missions** for groundbreaking exoplanet discoveries
- **scikit-learn** and **Three.js** communities

## Resources

- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)
- [NASA Eyes on Exoplanets](https://eyes.nasa.gov/apps/exo/)
- [Kepler Mission](https://www.nasa.gov/mission_pages/kepler/main/index.html)
- [TESS Mission](https://www.nasa.gov/tess-transiting-exoplanet-survey-satellite)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for exoplanet discovery and exploration**
