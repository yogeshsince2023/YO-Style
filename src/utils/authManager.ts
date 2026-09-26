import type { UserAccount, ExtendedFashionProfile, UserDataContainer } from '../types/auth';
import type { WardrobeItem } from '../types/fashion';
import { INITIAL_WARDROBE } from '../data/demoData';

const USERS_REGISTRY_KEY = 'yo_style_users_registry_v2';
const CURRENT_SESSION_KEY = 'yo_style_auth_session_v2';
const USER_DATA_PREFIX = 'yo_style_data_user_';

/**
 * Standard Web Crypto SHA-256 for secure local browser hashing
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`yo_style_salt_${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates initial default profile for a newly registered user
 */
export function createDefaultProfile(userId: string, name: string): ExtendedFashionProfile {
  return {
    userId,
    name,
    nickname: name.split(' ')[0],
    tagline: 'Personal Style in Progress',
    styleAesthetics: ['Clean Silhouettes', 'Minimalist Tailored'],
    dislikedAesthetics: [],
    colorFavorites: [
      { name: 'Ochre / Terracotta', hex: '#C26D38' },
      { name: 'Malabar Deep Indigo', hex: '#1C3144' },
      { name: 'Warm Ecru', hex: '#E5DFD3' }
    ],
    colorExclusions: [
      { name: 'Fluorescent Neon', hex: '#DFFF00' }
    ],
    preferredFits: ['relaxed', 'tailored'],
    commonOccasions: ['smart_casual', 'work_formal', 'weekend_brunch'],
    budgets: {
      maxPerItemInr: 3000,
      maxPerOutfitInr: 7500,
      budgetTier: 'balanced'
    },
    optionalAppearance: {
      approximateCity: 'Bengaluru',
      undertoneVibe: 'unspecified'
    },
    isOnboardingCompleted: false,
    privacySettings: {
      dataExportConsent: true,
      localOnlyMode: true
    },
    updatedAt: Date.now()
  };
}

export const DEMO_USERS: { account: UserAccount; profile: ExtendedFashionProfile; wardrobe: WardrobeItem[] }[] = [
  {
    account: {
      id: 'demo-user-aarav',
      email: 'aarav@yostyle.in',
      passwordHash: 'demo_hash_aarav',
      name: 'Aarav Sharma',
      createdAt: Date.now() - 1000000,
      lastLoginAt: Date.now()
    },
    profile: {
      userId: 'demo-user-aarav',
      name: 'Aarav Sharma',
      nickname: 'Aarav',
      tagline: 'Modern Minimalist & Occasional Ethnic Fusion',
      styleAesthetics: ['Clean Silhouettes', 'Breathable Linens', 'Indian Textures'],
      dislikedAesthetics: ['Overly distressed denim', 'Glitter / Heavy sequins'],
      colorFavorites: [
        { name: 'Ochre Sand', hex: '#C26D38' },
        { name: 'Malabar Indigo', hex: '#1C3144' },
        { name: 'Warm Ecru', hex: '#E5DFD3' }
      ],
      colorExclusions: [
        { name: 'Electric Neon Yellow', hex: '#DFFF00' }
      ],
      preferredFits: ['relaxed', 'tailored'],
      commonOccasions: ['smart_casual', 'work_formal', 'festive_indian', 'weekend_brunch'],
      budgets: {
        maxPerItemInr: 4500,
        maxPerOutfitInr: 9000,
        budgetTier: 'balanced'
      },
      optionalAppearance: {
        approximateCity: 'Bengaluru (Mild/Pleasant)',
        topSize: 'M / 40',
        bottomSize: '32',
        shoeSizeUk: '9',
        undertoneVibe: 'warm',
        heightCm: 178
      },
      isOnboardingCompleted: true,
      privacySettings: {
        dataExportConsent: true,
        localOnlyMode: true
      },
      updatedAt: Date.now()
    },
    wardrobe: INITIAL_WARDROBE
  },
  {
    account: {
      id: 'demo-user-priya',
      email: 'priya@yostyle.in',
      passwordHash: 'demo_hash_priya',
      name: 'Priya Iyer',
      createdAt: Date.now() - 800000,
      lastLoginAt: Date.now()
    },
    profile: {
      userId: 'demo-user-priya',
      name: 'Priya Iyer',
      nickname: 'Priya',
      tagline: 'Contemporary Indo-Western & Handloom Enthusiast',
      styleAesthetics: ['Handloom Sarees', 'Structured Linen Blazers', 'Artisanal Jewelry'],
      dislikedAesthetics: ['Synthetic Polyester', 'Fast Fashion Clones'],
      colorFavorites: [
        { name: 'Madder Rust', hex: '#8C3A27' },
        { name: 'Forest Sage', hex: '#2C4A3E' },
        { name: 'Raw Ivory', hex: '#FAF8F5' }
      ],
      colorExclusions: [
        { name: 'Hot Pink', hex: '#FF1493' }
      ],
      preferredFits: ['regular', 'relaxed'],
      commonOccasions: ['festive_indian', 'wedding_guest', 'work_formal'],
      budgets: {
        maxPerItemInr: 6000,
        maxPerOutfitInr: 12000,
        budgetTier: 'investment'
      },
      optionalAppearance: {
        approximateCity: 'Mumbai (Warm/Humid)',
        topSize: 'S / 38',
        bottomSize: '28',
        shoeSizeUk: '6',
        undertoneVibe: 'olive',
        heightCm: 165
      },
      isOnboardingCompleted: true,
      privacySettings: {
        dataExportConsent: true,
        localOnlyMode: true
      },
      updatedAt: Date.now()
    },
    wardrobe: [
      {
        id: 'priya-item-1',
        name: 'Chanderi Silk Handblock Saree',
        category: 'ethnic',
        subcategory: 'saree',
        subCategoryLabel: 'Chanderi Saree',
        primaryColor: '#8C3A27',
        colorName: 'Madder Rust & Gold Zari',
        fabric: 'Chanderi Silk-Cotton',
        fit: 'regular',
        occasions: ['festive_indian', 'wedding_guest'],
        seasons: ['all_year'],
        isAvailable: true,
        wearCount: 3,
        notes: 'Handcrafted in Madhya Pradesh with natural dyes.',
        createdAt: Date.now()
      },
      {
        id: 'priya-item-2',
        name: 'Oatmeal Double-Breasted Linen Blazer',
        category: 'outerwear',
        subcategory: 'unstructured_blazer',
        subCategoryLabel: 'Linen Blazer',
        primaryColor: '#E5DFD3',
        colorName: 'Oatmeal Natural',
        fabric: 'Pure French Linen',
        fit: 'tailored',
        occasions: ['work_formal', 'smart_casual'],
        seasons: ['all_year'],
        isAvailable: true,
        wearCount: 8,
        notes: 'Drapes effortlessly over trousers or kurtas.',
        createdAt: Date.now()
      }
    ]
  }
];

export class AuthDataManager {
  // 1. Get active session or null
  static getActiveSession(): UserAccount | null {
    try {
      const raw = localStorage.getItem(CURRENT_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // 2. Set active session
  static setActiveSession(user: UserAccount | null): void {
    if (!user) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    } else {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
    }
  }

  // 3. User registry retrieval
  static getUsersRegistry(): UserAccount[] {
    try {
      const raw = localStorage.getItem(USERS_REGISTRY_KEY);
      if (!raw) {
        // Seed demo accounts
        const demoAccounts = DEMO_USERS.map(d => d.account);
        localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(demoAccounts));
        // Seed demo user data containers
        DEMO_USERS.forEach(d => {
          this.saveUserData(d.account.id, {
            userId: d.account.id,
            profile: d.profile,
            wardrobe: d.wardrobe,
            lookbook: []
          });
        });
        return demoAccounts;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // 4. Save user into registry
  static saveUserToRegistry(user: UserAccount): void {
    const users = this.getUsersRegistry();
    const existingIdx = users.findIndex(u => u.id === user.id);
    if (existingIdx >= 0) {
      users[existingIdx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  }

  // 5. Per-User Isolated Data Container (Strict Sandbox)
  static getUserData(userId: string): UserDataContainer {
    try {
      const key = `${USER_DATA_PREFIX}${userId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn(`Error loading user data for ${userId}:`, e);
    }

    // Default container if fresh
    const defaultContainer: UserDataContainer = {
      userId,
      profile: createDefaultProfile(userId, 'Fashion Enthusiast'),
      wardrobe: [],
      lookbook: []
    };
    this.saveUserData(userId, defaultContainer);
    return defaultContainer;
  }

  // 6. Save isolated user data
  static saveUserData(userId: string, data: UserDataContainer): void {
    try {
      const key = `${USER_DATA_PREFIX}${userId}`;
      // Verify isolation check
      if (data.userId !== userId) {
        throw new Error(`Data isolation violation: container userId ${data.userId} does not match key ${userId}`);
      }
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save isolated user data:', e);
    }
  }

  // 7. Delete entire account and data (GDPR / Privacy Sovereignty)
  static deleteAccountAndData(userId: string): void {
    // 1. Remove from registry
    const users = this.getUsersRegistry().filter(u => u.id !== userId);
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
    
    // 2. Remove isolated data container
    localStorage.removeItem(`${USER_DATA_PREFIX}${userId}`);

    // 3. Clear session if active
    const active = this.getActiveSession();
    if (active && active.id === userId) {
      this.setActiveSession(null);
    }
  }
}
