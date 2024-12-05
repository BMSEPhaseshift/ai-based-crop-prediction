export interface CropRecommendation {
  recommendedCrop: string;
  sustainabilityScore: number;
  practices: string[];
  expectedYieldIncrease: number;
  waterEfficiency: number;
}

export interface ClimateData {
  region: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  soilType: string;
  soilQualityIndex: number;
}