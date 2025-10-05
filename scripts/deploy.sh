#!/bin/bash

echo "Building Exoplanet Detector for production..."

echo "Building frontend..."
npm run build

echo "Copying static assets..."
cp -r dist/* app/static/ 2>/dev/null || true

echo "Setting environment to production..."
export FLASK_ENV=production

echo "Build complete!"
echo ""
echo "To start the production server:"
echo "  python app/run.py"
