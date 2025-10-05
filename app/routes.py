from flask import Blueprint, request, jsonify
from pathlib import Path
import pandas as pd

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/planets', methods=['GET'])
def get_planets():
    return jsonify({
        'planets': [],
        'message': 'No planets loaded yet'
    })

@api.route('/statistics', methods=['GET'])
def get_statistics():
    return jsonify({
        'total_analyzed': 0,
        'confirmed': 0,
        'candidates': 0,
        'false_positives': 0
    })
