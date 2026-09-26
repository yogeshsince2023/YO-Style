import type { FashionCategory, Subcategory, FitType, OccasionType, WardrobeItem } from './fashion';

export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface VerifiedRetailerItem {
  id: string;
  name: string;
  brand: string;
  retailerName: string;
  retailerUrl: string;
  priceInr: number;
  currency: 'INR';
  sizesAvailable: ClothingSize[];
  inStock: boolean;
  lastVerifiedDate: string; // YYYY-MM-DD
  category: Exclude<FashionCategory, 'all'>;
  subcategory: Subcategory;
  colorName: string;
  colorHex: string;
  fabric: string;
  fit: FitType;
  imageUrl: string;
  affiliateDisclosure?: string;
  capsuleSynergyNotes: string;
}

export interface HybridOutfit {
  id: string;
  title: string;
  occasion: OccasionType;
  ownedItems: {
    top?: WardrobeItem;
    bottom?: WardrobeItem;
    ethnicPiece?: WardrobeItem;
    layer?: WardrobeItem;
    footwear?: WardrobeItem;
    accessory?: WardrobeItem;
  };
  purchasableItem: {
    slot: 'top' | 'bottom' | 'layer' | 'footwear' | 'ethnic';
    item: VerifiedRetailerItem;
  };
  totalBudgetInr: number; // Owned = ₹0 + Purchasable = ₹X
  whyThisItem: string;
  whatItAddsToWardrobe: string;
  colorHarmonyScore: number;
}

export interface InspirationMatchResult {
  detectedArchetype: string;
  detectedColors: { name: string; hex: string }[];
  matchedItems: VerifiedRetailerItem[];
  approximateDisclaimer: string;
}
