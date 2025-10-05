import { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import GalaxyVisualization from './components/GalaxyVisualization';
import { ExoplanetData, AnalysisResult } from './types/exoplanet';
import { MLService } from './services/mlService';
import { Sparkles, Database, Globe } from 'lucide-react';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'results' | 'galaxy'>('upload');

  const handleDataLoaded = async (data: ExoplanetData[]) => {
    setIsAnalyzing(true);
    setActiveTab('results');

    try {
      const mlService = MLService.getInstance();
      const preprocessedData = await mlService.preprocessData(data);
      const results = await mlService.analyzeData(preprocessedData);
      setAnalysisResults(results);

      if (results.predictions.length > 0) {
        setTimeout(() => setActiveTab('galaxy'), 1000);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Exoplanet AI Detector</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'upload'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Database className="w-4 h-4 mr-2" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab('results')}
                disabled={!analysisResults}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'results'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Results
              </button>
              <button
                onClick={() => setActiveTab('galaxy')}
                disabled={!analysisResults}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'galaxy'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <Globe className="w-4 h-4 mr-2" />
                3D Galaxy
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Discover Exoplanets with AI
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Upload your CSV data from Kepler, TESS, or K2 missions. Our advanced ML models
                will automatically analyze, preprocess, and identify potential exoplanets.
              </p>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h4 className="text-lg font-semibold text-white">Upload Data</h4>
                  <p className="text-blue-200 text-sm">
                    Drop your CSV file containing exoplanet transit data with parameters like orbital
                    period, transit depth, and stellar characteristics.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h4 className="text-lg font-semibold text-white">Auto-Analysis</h4>
                  <p className="text-blue-200 text-sm">
                    Our ML pipeline automatically preprocesses the data, handles missing values,
                    normalizes features, and trains classification models.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <h4 className="text-lg font-semibold text-white">3D Visualization</h4>
                  <p className="text-blue-200 text-sm">
                    Explore detected exoplanets in an interactive 3D galaxy. See orbital mechanics,
                    planetary characteristics, and confidence scores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            {isAnalyzing ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto mb-6"></div>
                <h3 className="text-2xl font-semibold text-white mb-2">Analyzing Data...</h3>
                <p className="text-blue-200">
                  Preprocessing features, training models, and identifying exoplanets
                </p>
              </div>
            ) : analysisResults ? (
              <AnalysisResults results={analysisResults} />
            ) : (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
                <p className="text-blue-200 text-lg">Upload data to see analysis results</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'galaxy' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">3D Galaxy Explorer</h2>
              <p className="text-blue-200">
                Zoom, rotate, and explore the detected exoplanetary systems
              </p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 border border-white/10" style={{ height: '600px' }}>
              {analysisResults ? (
                <GalaxyVisualization planets={analysisResults.predictions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-blue-200 text-lg">No planets detected yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-blue-200 text-sm">
            Powered by NASA Exoplanet Archive Data | Machine Learning & Three.js Visualization
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
