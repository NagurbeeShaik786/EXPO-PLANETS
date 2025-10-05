import { AnalysisResult } from '../types/exoplanet';
import { TrendingUp, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AnalysisResultsProps {
  results: AnalysisResult;
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  const confirmedCount = results.predictions.filter(p => p.classification === 'CONFIRMED').length;
  const candidateCount = results.predictions.filter(p => p.classification === 'CANDIDATE').length;
  const falsePositiveCount = results.predictions.filter(p => p.classification === 'FALSE_POSITIVE').length;

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Analyzed</p>
              <p className="text-3xl font-bold text-gray-900">{results.summary.totalRows}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 mb-1">Confirmed Planets</p>
              <p className="text-3xl font-bold">{confirmedCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-100 mb-1">Candidates</p>
              <p className="text-3xl font-bold">{candidateCount}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-100 mb-1">False Positives</p>
              <p className="text-3xl font-bold">{falsePositiveCount}</p>
            </div>
            <XCircle className="w-12 h-12 text-gray-100" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Processing Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Processing Time</p>
            <p className="text-lg font-semibold text-gray-900">{results.processingTime}ms</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Detection Rate</p>
            <p className="text-lg font-semibold text-gray-900">
              {((results.predictions.length / results.summary.totalRows) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Detected Exoplanets</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Classification</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Confidence</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Orbital Period (days)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Radius (R⊕)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Temp (K)</th>
              </tr>
            </thead>
            <tbody>
              {results.predictions.slice(0, 20).map((planet, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{planet.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      planet.classification === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      planet.classification === 'CANDIDATE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {planet.classification}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{(planet.confidence * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{planet.orbitalPeriod.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{planet.planetRadius.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{planet.temperature.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.predictions.length > 20 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Showing 20 of {results.predictions.length} detected exoplanets
          </p>
        )}
      </div>
    </div>
  );
}
