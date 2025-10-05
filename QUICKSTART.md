# Quick Start Guide

Get up and running with Exoplanet AI Detector in 5 minutes!

## Prerequisites
- Node.js 18+ and npm installed
- Python 3.8+ installed
- Git installed

## Installation Steps

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
pip install -r requirements.txt
```

### 2. Create Directories
```bash
mkdir -p data/uploads models
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
python app/run.py
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
App runs on `http://localhost:5173`

## Using the Application

### Step 1: Upload Data
1. Open `http://localhost:5173` in your browser
2. Go to the "Upload" tab
3. Drag and drop a CSV file or click "Choose File"
4. Use the sample data at `data/raw/sample_exoplanet_data.csv` for testing

### Step 2: View Results
- After upload, the app automatically:
  - Analyzes your data
  - Preprocesses features
  - Trains ML models
  - Generates predictions
- View statistics in the "Results" tab

### Step 3: Explore 3D Galaxy
- Switch to the "3D Galaxy" tab
- Use mouse to:
  - **Drag**: Rotate view
  - **Scroll**: Zoom in/out
  - **Click planets**: Focus on specific system
- Click "Reset View" to return to overview

## Sample Data Format

Your CSV should include these columns:
```csv
kepoi_name,koi_period,koi_depth,koi_prad,koi_teq,koi_srad,ra,dec,koi_disposition
```

- `koi_period`: Orbital period (days)
- `koi_depth`: Transit depth (ppm)
- `koi_prad`: Planet radius (Earth radii)
- `koi_teq`: Temperature (Kelvin)
- `koi_srad`: Star radius (Solar radii)
- `ra`, `dec`: Coordinates
- `koi_disposition`: Label (CONFIRMED/CANDIDATE/FALSE POSITIVE) - optional

## Getting Real Data

Download from NASA Exoplanet Archive:
- **Kepler**: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=koi
- **TESS**: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=TOI

Click "Download Table" and select CSV format.

## Troubleshooting

### Backend won't start
- Make sure Python dependencies are installed: `pip install -r requirements.txt`
- Check if port 5000 is available
- Verify Python version: `python --version` (should be 3.8+)

### Frontend won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Check if port 5173 is available
- Verify Node version: `node --version` (should be 18+)

### CSV upload fails
- Check file format (must be .csv)
- Verify file size (max 100MB)
- Ensure required columns are present

### 3D visualization not showing
- Check browser console for errors
- Try refreshing the page
- Ensure WebGL is supported in your browser

## Production Deployment

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
python app/run.py
```

The Flask server will serve the built app from the `dist` folder on port 5000.

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/) for datasets
- Explore [NASA Eyes on Exoplanets](https://eyes.nasa.gov/apps/exo/) for inspiration

## Need Help?

Open an issue on GitHub with:
- Your error message
- Steps to reproduce
- System information (OS, Python/Node versions)

Happy planet hunting! 🚀🌌
