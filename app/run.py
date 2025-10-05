from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import sys
from pathlib import Path
import pandas as pd

sys.path.append(str(Path(__file__).parent.parent))

from src.data.upload_handler import UploadHandler
from src.data.preprocess import ExoplanetPreprocessor
from src.models.train import ExoplanetClassifier
from src.models.predict import ExoplanetPredictor
from src.utils.eda_utils import EDAUtils
from src.utils.three_d_utils import Galaxy3DGenerator

app = Flask(__name__, static_folder='../dist', static_url_path='')
CORS(app)

app.config['UPLOAD_FOLDER'] = 'data/uploads'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

upload_handler = UploadHandler()
preprocessor = ExoplanetPreprocessor()
classifier = ExoplanetClassifier()
galaxy_generator = Galaxy3DGenerator()

try:
    classifier.load_model('models/trained_model.pkl')
    print("Pre-trained model loaded successfully")
except:
    print("No pre-trained model found. Will train on first upload.")

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Only CSV files are allowed'}), 400

    try:
        filepath = upload_handler.save_upload(file)

        is_valid, message = upload_handler.validate_csv(filepath)
        if not is_valid:
            return jsonify({'error': f'Invalid CSV: {message}'}), 400

        analysis = upload_handler.analyze_upload(filepath)

        return jsonify({
            'success': True,
            'filepath': str(filepath),
            'analysis': analysis,
            'message': 'File uploaded successfully'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process_data():
    data = request.json
    filepath = data.get('filepath')

    if not filepath or not Path(filepath).exists():
        return jsonify({'error': 'Invalid file path'}), 400

    try:
        df = pd.read_csv(filepath)

        X, y = preprocessor.preprocess(df, fit=True)

        if y is not None and len(y.dropna()) > 10:
            y_clean = y.dropna()
            X_clean = X.loc[y_clean.index]

            train_results = classifier.train(X_clean, y_clean)
            classifier.save_model()
        else:
            print("Not enough labeled data for training. Using existing model for prediction.")
            train_results = {'message': 'Using pre-trained model'}

        predictor = ExoplanetPredictor(classifier, preprocessor)

        df_predict = pd.read_csv(filepath)
        predictions = predictor.predict_batch(df_predict)

        filtered_predictions = predictor.filter_predictions(predictions, min_confidence=0.3)

        galaxy_data = galaxy_generator.generate_galaxy_data(filtered_predictions)

        statistics = preprocessor.get_statistics(df)

        return jsonify({
            'success': True,
            'predictions': filtered_predictions,
            'galaxy_data': galaxy_data,
            'statistics': statistics,
            'training_results': train_results,
            'total_predictions': len(predictions),
            'filtered_predictions': len(filtered_predictions)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/eda', methods=['POST'])
def perform_eda():
    data = request.json
    filepath = data.get('filepath')

    if not filepath or not Path(filepath).exists():
        return jsonify({'error': 'Invalid file path'}), 400

    try:
        df = pd.read_csv(filepath)
        report = EDAUtils.generate_full_report(df)

        return jsonify({
            'success': True,
            'report': report
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': classifier.model is not None
    })

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
