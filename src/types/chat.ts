import type { CuratedOutfit, OccasionType, WardrobeItem } from './fashion';

export type ItemSourceType = 'owned' | 'capsule_gap' | 'verified_retailer';

export interface StylistItemDisplay {
  sourceType: ItemSourceType;
  slot: 'top' | 'bottom' | 'layer' | 'footwear' | 'accessory' | 'ethnic';
  ownedItem?: WardrobeItem;
  gapCategory?: {
    categoryName: string;
    suggestedColor: string;
    suggestedFabric?: string;
    reason: string;
  };
  retailerProductNote?: {
    status: 'integration_pending';
    notice: string;
  };
}

export interface SessionPreference {
  id: string;
  type: 'avoid_color' | 'focus_item' | 'archetype' | 'occasion' | 'budget_mode';
  label: string;
  value: string;
  isDismissible: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'stylist';
  text: string;
  timestamp: number;
  outfit?: CuratedOutfit;
  detectedPreferences?: SessionPreference[];
  error?: string;
  isAiGenerated?: boolean;
}

export interface StylistStructuredOutput {
  replyText: string;
  intent: 'TARGET_ITEM' | 'DELTA_SWAP' | 'COLOR_EXCLUSION' | 'ARCHETYPE_SHIFT' | 'BUDGET_SIMPLIFY' | 'GENERAL_ADVICE';
  recommendedOutfit?: {
    title: string;
    occasion: OccasionType;
    ownedItemIds: {
      top?: string;
      bottom?: string;
      ethnicPiece?: string;
      layer?: string;
      footwear?: string;
      accessory?: string;
    };
    stylingRationale: string;
    harmonyTips: string[];
    colorHarmonyScore: number;
    capsuleGap?: {
      categoryName: string;
      suggestedColor: string;
      reasoning: string;
    };
  };
  detectedPreferences?: {
    type: 'avoid_color' | 'focus_item' | 'archetype' | 'occasion' | 'budget_mode';
    label: string;
    value: string;
  }[];
}
