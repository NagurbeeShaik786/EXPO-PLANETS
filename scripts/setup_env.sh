#!/bin/bash

echo "Setting up Exoplanet Detector environment..."

echo "Creating virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Creating required directories..."
mkdir -p data/raw data/processed data/uploads data/external
mkdir -p models
mkdir -p logs

echo "Installing Node.js dependencies..."
npm install

echo "Setup complete!"
echo ""
echo "To activate the environment, run:"
echo "  source venv/bin/activate"
echo ""
echo "To start the backend server:"
echo "  python app/run.py"
echo ""
echo "To start the frontend dev server:"
echo "  npm run dev"
