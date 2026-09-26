import { 
  searchVerifiedCatalog, 
  generateHybridOutfits, 
  isPriceStale 
} from '../shoppingEngine';
import { VERIFIED_PILOT_CATALOG } from '../../data/verifiedCatalog';
import type { WardrobeItem } from '../../types/fashion';

const mockWardrobe: WardrobeItem[] = [
  {
    id: 'top-ecru-kurta',
    name: 'Handloom Ecru Kurta',
    category: 'ethnic',
    subcategory: 'short_kurta',
    subCategoryLabel: 'Short Kurta',
    primaryColor: '#F5F5F0',
    colorName: 'Warm Ecru',
    fabric: 'Khadi Cotton',
    fit: 'relaxed',
    occasions: ['smart_casual', 'festive_indian'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 6,
    createdAt: 1000
  },
  {
    id: 'top-navy-polo',
    name: 'Navy Knit Polo',
    category: 'tops',
    subcategory: 'knit_polo',
    subCategoryLabel: 'Knit Polo',
    primaryColor: '#1E293B',
    colorName: 'Navy',
    fabric: 'Merino Wool Blend',
    fit: 'regular',
    occasions: ['smart_casual'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 11,
    createdAt: 1001
  },
  {
    id: 'shoe-loafers',
    name: 'Tan Leather Loafers',
    category: 'footwear',
    subcategory: 'leather_loafers',
    subCategoryLabel: 'Leather Loafers',
    primaryColor: '#78350F',
    colorName: 'Tan',
    fabric: 'Leather',
    fit: 'regular',
    occasions: ['smart_casual'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 15,
    createdAt: 1002
  }
];

function runPhase7Tests() {
  console.log('=== RUNNING PHASE 7 VERIFIED SHOPPING & DISCOVERY TESTS ===');

  // Test 1: Pilot Catalog Integrity Audit
  console.log('\n--- TEST 1: Permitted Catalog Integrity ---');
  if (VERIFIED_PILOT_CATALOG.length === 0) throw new Error('Catalog is empty!');
  for (const item of VERIFIED_PILOT_CATALOG) {
    if (!item.name || !item.brand || !item.retailerUrl) {
      throw new Error(`Incomplete item record: ${item.id}`);
    }
    if (typeof item.priceInr !== 'number' || item.priceInr <= 0) {
      throw new Error(`Invalid price for item: ${item.id}`);
    }
    if (!Array.isArray(item.sizesAvailable) || item.sizesAvailable.length === 0) {
      throw new Error(`Item ${item.id} has no sizes available`);
    }
    if (!item.lastVerifiedDate || isNaN(Date.parse(item.lastVerifiedDate))) {
      throw new Error(`Item ${item.id} has invalid lastVerifiedDate`);
    }
    if (!item.retailerUrl.startsWith('https://')) {
      throw new Error(`Item ${item.id} must use secure https URL`);
    }
  }
  console.log(`PASS: Audited ${VERIFIED_PILOT_CATALOG.length} permitted catalog items. All prices, sizes, and URLs valid.`);

  // Test 2: Search & Filter Logic
  console.log('\n--- TEST 2: Catalog Search & Filter ---');
  const linenResults = searchVerifiedCatalog({ query: 'linen' });
  if (linenResults.length === 0) throw new Error('Failed to search items with "linen" query');
  const budgetFiltered = searchVerifiedCatalog({ maxPriceInr: 2500 });
  const hasOverBudget = budgetFiltered.some(i => i.priceInr > 2500);
  if (hasOverBudget) throw new Error('Catalog search returned items exceeding maxPriceInr');
  console.log(`PASS: Search and budget filters verified. Found ${budgetFiltered.length} items <= ₹2,500.`);

  // Test 3: Hybrid Outfit Strict Total Budget Calculation
  console.log('\n--- TEST 3: Hybrid Outfit Total Budget Integrity ---');
  const hybridLooks = generateHybridOutfits({
    wardrobe: mockWardrobe,
    occasion: 'smart_casual',
    maxTotalBudgetInr: 3000
  });

  if (hybridLooks.length === 0) {
    throw new Error('Hybrid outfit generator returned 0 outfits under ₹3,000');
  }

  for (const look of hybridLooks) {
    // Strict rule: Total outfit cost = purchasable item price (owned items = ₹0)
    if (look.totalBudgetInr !== look.purchasableItem.item.priceInr) {
      throw new Error(`Total budget mismatch! Expected ${look.purchasableItem.item.priceInr}, got ${look.totalBudgetInr}`);
    }
    if (look.totalBudgetInr > 3000) {
      throw new Error(`Hybrid look exceeded budget limit: ${look.totalBudgetInr}`);
    }
  }
  console.log(`PASS: Generated ${hybridLooks.length} hybrid looks. Owned clothes counted at ₹0, budget ceiling enforced.`);

  // Test 4: Wardrobe Synergy Metric ("What does it add?")
  console.log('\n--- TEST 4: Wardrobe Synergy Explanation ---');
  const firstLook = hybridLooks[0];
  if (!firstLook.whatItAddsToWardrobe.includes('closet') && !firstLook.whatItAddsToWardrobe.includes('pairs')) {
    throw new Error('Failed to quantify what item adds to wardrobe');
  }
  console.log(`PASS: Synergy explanation verified: "${firstLook.whatItAddsToWardrobe}"`);

  // Test 5: Stale Price Detector
  console.log('\n--- TEST 5: Stale Price Detector ---');
  const todayStr = new Date().toISOString().split('T')[0];
  const isFresh = isPriceStale(todayStr);
  if (isFresh) throw new Error('Today date should not be marked as stale');

  const oldDateStr = '2025-01-01';
  const isOld = isPriceStale(oldDateStr);
  if (!isOld) throw new Error('Date from 2025 must be flagged as stale (>30 days)');
  console.log('PASS: Stale price detector correctly identifies stale (>30 days) and fresh verification dates.');

  console.log('\nALL 5 PHASE 7 SHOPPING & DISCOVERY TESTS PASSED CLEANLY!\n');
}

runPhase7Tests();
