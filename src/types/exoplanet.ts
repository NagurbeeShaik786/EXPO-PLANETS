export interface ExoplanetData {
  id?: string;
  koi_period?: number;
  koi_time0bk?: number;
  koi_impact?: number;
  koi_duration?: number;
  koi_depth?: number;
  koi_prad?: number;
  koi_teq?: number;
  koi_insol?: number;
  koi_steff?: number;
  koi_slogg?: number;
  koi_srad?: number;
  ra?: number;
  dec?: number;
  koi_disposition?: string;
  [key: string]: string | number | undefined;
}

export interface PlanetPrediction {
  name: string;
  classification: 'CONFIRMED' | 'CANDIDATE' | 'FALSE_POSITIVE';
  confidence: number;
  orbitalPeriod: number;
  planetRadius: number;
  starRadius: number;
  temperature: number;
  position: {
    ra: number;
    dec: number;
    distance: number;
  };
}

export interface AnalysisResult {
  summary: {
    totalRows: number;
    missingValues: { [key: string]: number };
    statistics: { [key: string]: any };
  };
  predictions: PlanetPrediction[];
  processingTime: number;
}
