import type { CuratedOutfit, FashionCategory, Subcategory, FitType, WeatherMood, OccasionType } from './fashion';

export interface PlannedOutfitEntry {
  id: string;
  date: string; // YYYY-MM-DD
  outfit: CuratedOutfit;
  isWorn: boolean;
  weatherForecast?: {
    tempC: number;
    condition: string;
    isRainy?: boolean;
    isChilly?: boolean;
  };
  notes?: string;
  createdAt: number;
}

export interface TravelTripPlan {
  id: string;
  tripTitle: string;
  destination: string;
  daysCount: number;
  climateMood: WeatherMood;
  primaryOccasion: OccasionType;
  packedItemIds: string[];
  suggestedLookCount: number;
  missingEssentials?: string[];
  createdAt: number;
}

export interface PurchaseEvaluation {
  id: string;
  itemName: string;
  category: Exclude<FashionCategory, 'all'>;
  subcategory: Subcategory;
  colorName: string;
  colorHex: string;
  estimatedPriceInr?: number;
  redundancyScore: number; // 0-100 (high = you already own similar)
  redundantItemNames: string[];
  compatibleOwnedItemIds: string[];
  unlockedOutfitCount: number;
  verdict: 'redundant' | 'capsule_completer' | 'low_synergy' | 'occasional_splurge';
  verdictLabel: string;
  verdictExplanation: string;
  confidenceScore: number;
  createdAt: number;
}

export interface ImageClassificationResult {
  confidence: number; // 0-100
  isUncertain: boolean;
  suggestedCategory: Exclude<FashionCategory, 'all'>;
  suggestedSubcategory: Subcategory;
  suggestedSubcategoryLabel: string;
  suggestedColorName: string;
  suggestedColorHex: string;
  suggestedFabric: string;
  suggestedFit: FitType;
  notes?: string;
}
