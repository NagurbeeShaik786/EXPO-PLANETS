import { ExoplanetData, PlanetPrediction, AnalysisResult } from '../types/exoplanet';

export class MLService {
  private static instance: MLService;

  private constructor() {}

  static getInstance(): MLService {
    if (!MLService.instance) {
      MLService.instance = new MLService();
    }
    return MLService.instance;
  }

  async analyzeData(data: ExoplanetData[]): Promise<AnalysisResult> {
    const startTime = Date.now();

    const summary = this.generateSummary(data);
    const predictions = await this.predictExoplanets(data);

    return {
      summary,
      predictions,
      processingTime: Date.now() - startTime
    };
  }

  private generateSummary(data: ExoplanetData[]) {
    const missingValues: { [key: string]: number } = {};
    const statistics: { [key: string]: any } = {};

    if (data.length === 0) {
      return { totalRows: 0, missingValues, statistics };
    }

    const keys = Object.keys(data[0]);

    keys.forEach(key => {
      const values = data.map(d => d[key]).filter(v => v !== null && v !== undefined && v !== '');
      const numericValues = values.filter(v => typeof v === 'number') as number[];

      missingValues[key] = data.length - values.length;

      if (numericValues.length > 0) {
        statistics[key] = {
          mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          median: this.calculateMedian(numericValues)
        };
      }
    });

    return { totalRows: data.length, missingValues, statistics };
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private async predictExoplanets(data: ExoplanetData[]): Promise<PlanetPrediction[]> {
    const predictions: PlanetPrediction[] = [];

    for (let i = 0; i < Math.min(data.length, 100); i++) {
      const row = data[i];

      const score = this.calculateExoplanetScore(row);

      if (score > 0.3) {
        const classification = score > 0.8 ? 'CONFIRMED' : score > 0.5 ? 'CANDIDATE' : 'FALSE_POSITIVE';

        predictions.push({
          name: row.id || `KOI-${1000 + i}`,
          classification,
          confidence: score,
          orbitalPeriod: row.koi_period || Math.random() * 365,
          planetRadius: row.koi_prad || Math.random() * 10,
          starRadius: row.koi_srad || 1.0,
          temperature: row.koi_teq || 200 + Math.random() * 1000,
          position: {
            ra: row.ra || Math.random() * 360,
            dec: row.dec || (Math.random() - 0.5) * 180,
            distance: 50 + Math.random() * 1000
          }
        });
      }
    }

    return predictions;
  }

  private calculateExoplanetScore(data: ExoplanetData): number {
    let score = 0.5;

    if (data.koi_period && data.koi_period > 0.5 && data.koi_period < 500) {
      score += 0.15;
    }

    if (data.koi_depth && data.koi_depth > 0) {
      score += 0.1;
    }

    if (data.koi_prad && data.koi_prad > 0.5 && data.koi_prad < 20) {
      score += 0.15;
    }

    if (data.koi_disposition === 'CONFIRMED' || data.koi_disposition === 'CANDIDATE') {
      score += 0.2;
    } else if (data.koi_disposition === 'FALSE POSITIVE') {
      score -= 0.3;
    }

    if (data.koi_impact !== undefined && data.koi_impact < 1) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score + (Math.random() - 0.5) * 0.1));
  }

  async preprocessData(data: ExoplanetData[]): Promise<ExoplanetData[]> {
    return data.map(row => {
      const processed = { ...row };

      Object.keys(processed).forEach(key => {
        if (processed[key] === null || processed[key] === undefined || processed[key] === '') {
          if (typeof data[0][key] === 'number') {
            const values = data.map(d => d[key]).filter(v => typeof v === 'number') as number[];
            if (values.length > 0) {
              processed[key] = values.reduce((a, b) => (a as number) + (b as number), 0) / values.length;
            }
          }
        }
      });

      return processed;
    });
  }
}
