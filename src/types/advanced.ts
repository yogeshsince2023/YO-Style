import type { WardrobeItem, FitType } from './fashion';

export type IndianFestiveEvent = 
  | 'haldi_pooja'
  | 'mehendi_sangeet'
  | 'wedding_ceremony'
  | 'reception_cocktail';

export interface SizeGuidanceResult {
  brandName: string;
  category: string;
  recommendedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  fitNote: string;
  chestInches?: number;
  waistInches?: number;
  disclaimer: string;
}

export interface FestiveEventProtocol {
  eventId: IndianFestiveEvent;
  eventLabel: string;
  recommendedSilhouettes: string[];
  idealColors: string[];
  fabricsToPrioritize: string[];
  fabricsToAvoid: string[];
  accessoriesRecommended: string[];
  etiquetteTips: string[];
}

export interface WardrobeAnalyticsSummary {
  totalItemsCount: number;
  totalEstimatedValueInr: number;
  averageWearCount: number;
  averageCostPerWearInr: number;
  topLovedItems: WardrobeItem[];
  dormantItems: WardrobeItem[];
  colorDistribution: { colorName: string; hex: string; count: number; percentage: number }[];
}

export interface AvatarVisualConfig {
  heightCm: number;
  buildType: FitType;
  skinToneVibe: 'warm' | 'cool' | 'neutral' | 'olive';
}
