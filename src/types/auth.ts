import type { OccasionType, FitType } from './fashion';

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string; // SHA-256 Web Crypto
  name: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface BudgetPreferences {
  maxPerItemInr: number; // e.g. 3500
  maxPerOutfitInr: number; // e.g. 8000
  budgetTier: 'essential' | 'balanced' | 'investment';
}

export interface OptionalAppearanceInfo {
  topSize?: string; // e.g. 'M / 40'
  bottomSize?: string; // e.g. '32'
  shoeSizeUk?: string; // e.g. '9'
  approximateCity?: string; // e.g. 'Bengaluru'
  undertoneVibe?: 'warm' | 'cool' | 'neutral' | 'olive' | 'unspecified';
  heightCm?: number;
  personalStyleNotes?: string;
}

export interface ExtendedFashionProfile {
  userId: string;
  name: string;
  nickname?: string;
  tagline: string;
  styleAesthetics: string[];
  dislikedAesthetics: string[];
  colorFavorites: { name: string; hex: string }[];
  colorExclusions: { name: string; hex: string }[];
  preferredFits: FitType[];
  commonOccasions: OccasionType[];
  budgets: BudgetPreferences;
  optionalAppearance?: OptionalAppearanceInfo;
  isOnboardingCompleted: boolean;
  privacySettings: {
    dataExportConsent: boolean;
    localOnlyMode: boolean;
  };
  updatedAt: number;
}

export interface UserDataContainer {
  userId: string;
  profile: ExtendedFashionProfile;
  wardrobe: import('./fashion').WardrobeItem[];
  lookbook: import('./fashion').LookbookEntry[];
}
