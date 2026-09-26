export type FashionCategory = 
  | 'all'
  | 'tops' 
  | 'bottoms' 
  | 'ethnic' 
  | 'outerwear' 
  | 'footwear' 
  | 'accessories';

export type Subcategory = 
  // Western Tops
  | 't_shirt' | 'linen_shirt' | 'oxford_shirt' | 'knit_polo' | 'crop_top'
  // Indian & Indo-Western Ethnic
  | 'short_kurta' | 'chikankari_kurta' | 'bandhgala_jacket' | 'nehru_jacket' | 'saree' | 'anarkali' | 'lehenga'
  // Bottoms
  | 'wide_leg_trousers' | 'chinos' | 'selvedge_denim' | 'linen_pants' | 'dhoti_pants' | 'churidar'
  // Outerwear / Layering
  | 'unstructured_blazer' | 'trench_coat' | 'bomber_jacket' | 'shacket' | 'dupatta_stole'
  // Footwear
  | 'leather_loafers' | 'minimal_sneakers' | 'chelsea_boots' | 'kolhapuri_chappals' | 'juttis' | 'strappy_heels'
  // Accessories
  | 'analog_watch' | 'silver_jhumkas' | 'woven_belt' | 'tote_bag' | 'statement_scarf';

export type OccasionType = 
  | 'work_formal' 
  | 'smart_casual' 
  | 'college_campus' 
  | 'festive_indian' 
  | 'wedding_guest' 
  | 'date_night' 
  | 'weekend_brunch' 
  | 'travel_airport';

export type WeatherMood = 'warm_sun' | 'breezy_evening' | 'chilly_winter' | 'monsoon_rain' | 'ac_indoor';

export type FitType = 'slim' | 'tailored' | 'regular' | 'relaxed' | 'oversized';

export interface WardrobeItem {
  id: string;
  name: string;
  category: Exclude<FashionCategory, 'all'>;
  subcategory: Subcategory;
  subCategoryLabel: string;
  primaryColor: string; // e.g. '#264653'
  colorName: string; // e.g. 'Malabar Indigo'
  secondaryColor?: string;
  fabric: string; // Cotton, Mulberry Silk, Irish Linen, Khadi, Denim, Wool
  fit: FitType;
  occasions: OccasionType[];
  seasons: ('summer' | 'monsoon' | 'winter' | 'all_year')[];
  imageUrl?: string;
  isAvailable: boolean; // false if in laundry or archived
  wearCount: number;
  lastWornDate?: string;
  notes?: string;
  createdAt: number;
}

export interface FashionProfile {
  name: string;
  tagline: string;
  lifestyleOccasions: OccasionType[];
  preferredFits: FitType[];
  colorFavorites: { name: string; hex: string }[];
  colorExclusions: { name: string; hex: string }[];
  styleAesthetics: string[];
  physicalPreferences?: {
    heightCm?: number;
    topSize?: string;
    bottomSize?: string;
    shoeSizeUk?: string;
    undertoneVibe?: 'warm' | 'cool' | 'neutral' | 'olive';
  };
  budgetConscious: boolean;
  currency: 'INR' | 'USD';
  privacyPreferences: {
    storePhotosLocally: boolean;
    allowTelemetry: boolean;
  };
}

export interface CuratedOutfit {
  id: string;
  title: string;
  occasion: OccasionType;
  weatherMood: WeatherMood;
  items: {
    top?: WardrobeItem;
    bottom?: WardrobeItem;
    ethnicPiece?: WardrobeItem;
    layer?: WardrobeItem;
    footwear?: WardrobeItem;
    accessory?: WardrobeItem;
  };
  stylingRationale: string;
  harmonyTips: string[];
  colorHarmonyScore: number; // 0-100
  wardrobeGap?: {
    itemType: string;
    suggestedColor: string;
    potentialOutfitsUnlocked: number;
    reasoning: string;
    isDemoOnly: true;
  };
  savedAt?: number;
  userRating?: 'loved' | 'neutral' | 'disliked';
}

export interface LookbookEntry {
  id: string;
  outfit: CuratedOutfit;
  savedDate: string;
  wornDate?: string;
  occasionLabel: string;
  personalNotes?: string;
}
