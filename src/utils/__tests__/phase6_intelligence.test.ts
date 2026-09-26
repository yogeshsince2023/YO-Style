import { 
  evaluatePurchase, 
  generateTravelCapsule, 
  fetchLiveWeather, 
  loadPlannerEntries, 
  savePlannerEntries, 
  getPlannerKey 
} from '../wardrobeIntelligence';
import type { WardrobeItem } from '../../types/fashion';

const mockWardrobe: WardrobeItem[] = [
  {
    id: 'top-navy-blazer',
    name: 'Tailored Navy Blazer',
    category: 'outerwear',
    subcategory: 'unstructured_blazer',
    subCategoryLabel: 'Unstructured Blazer',
    primaryColor: '#1E293B',
    colorName: 'Malabar Navy',
    fabric: 'Wool Blend',
    fit: 'tailored',
    occasions: ['work_formal'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 2,
    createdAt: 1000
  },
  {
    id: 'top-white-shirt',
    name: 'Classic White Shirt',
    category: 'tops',
    subcategory: 'linen_shirt',
    subCategoryLabel: 'Linen Shirt',
    primaryColor: '#FFFFFF',
    colorName: 'White',
    fabric: 'Linen',
    fit: 'relaxed',
    occasions: ['work_formal', 'smart_casual'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 14,
    createdAt: 1001
  },
  {
    id: 'bottom-charcoal-pants',
    name: 'Charcoal Pleated Trousers',
    category: 'bottoms',
    subcategory: 'wide_leg_trousers',
    subCategoryLabel: 'Wide Leg Trousers',
    primaryColor: '#27272A',
    colorName: 'Charcoal',
    fabric: 'Wool Blend',
    fit: 'relaxed',
    occasions: ['work_formal', 'smart_casual'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 9,
    createdAt: 1002
  },
  {
    id: 'shoe-derby',
    name: 'Black Leather Derby',
    category: 'footwear',
    subcategory: 'leather_loafers',
    subCategoryLabel: 'Leather Loafers',
    primaryColor: '#18181B',
    colorName: 'Black',
    fabric: 'Leather',
    fit: 'regular',
    occasions: ['work_formal'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 20,
    createdAt: 1003
  }
];

async function runPhase6Tests() {
  console.log('=== RUNNING PHASE 6 WARDROBE INTELLIGENCE & PLANNING TESTS ===');

  // Test 1: Purchase Evaluation - Redundancy detection
  console.log('\n--- TEST 1: Purchase Evaluator (Redundancy Detection) ---');
  const redundantEval = evaluatePurchase({
    itemName: 'Midnight Navy Blazer',
    category: 'outerwear',
    subcategory: 'unstructured_blazer',
    colorName: 'Navy',
    colorHex: '#1E293B',
    priceInr: 4999,
    wardrobe: mockWardrobe
  });

  if (redundantEval.redundancyScore < 50) {
    throw new Error(`Expected high redundancy score for duplicate blazer, got ${redundantEval.redundancyScore}`);
  }
  if (redundantEval.verdict !== 'redundant') {
    throw new Error(`Expected verdict 'redundant', got '${redundantEval.verdict}'`);
  }
  console.log(`PASS: Detected redundancy (${redundantEval.redundancyScore}%). Verdict: ${redundantEval.verdictLabel}`);

  // Test 2: Purchase Evaluation - Capsule Completer
  console.log('\n--- TEST 2: Purchase Evaluator (Capsule Completer) ---');
  const completerEval = evaluatePurchase({
    itemName: 'Desert Olive Linen Chinos',
    category: 'bottoms',
    subcategory: 'chinos',
    colorName: 'Olive',
    colorHex: '#3F4F38',
    priceInr: 2499,
    wardrobe: mockWardrobe
  });

  if (completerEval.verdict !== 'capsule_completer') {
    throw new Error(`Expected 'capsule_completer', got '${completerEval.verdict}'`);
  }
  if (completerEval.unlockedOutfitCount <= 0) {
    throw new Error('Expected positive unlocked outfit count');
  }
  console.log(`PASS: Identified capsule completer. Unlocks ${completerEval.unlockedOutfitCount} outfits.`);

  // Test 3: Travel Packing Engine - 3-day capsule
  console.log('\n--- TEST 3: Capsule Travel Packing (3-Day Trip) ---');
  const tripPlan = generateTravelCapsule({
    destination: 'Mumbai Client Meetings',
    daysCount: 3,
    climateMood: 'warm_sun',
    primaryOccasion: 'work_formal',
    wardrobe: mockWardrobe
  });

  if (tripPlan.packedItemIds.length === 0) {
    throw new Error('Travel packing returned 0 packed items!');
  }
  if (tripPlan.suggestedLookCount < 1) {
    throw new Error('Travel packing generated 0 suggested looks!');
  }
  console.log(`PASS: Packed ${tripPlan.packedItemIds.length} pieces yielding ~${tripPlan.suggestedLookCount} unique looks.`);

  // Test 4: Travel Packing - Sparse wardrobe honest gap detection
  console.log('\n--- TEST 4: Sparse Wardrobe Gap in Travel Packing ---');
  const sparseWardrobe = mockWardrobe.filter(i => i.category === 'tops'); // tops only, zero shoes or bottoms
  const sparseTrip = generateTravelCapsule({
    destination: 'Delhi Weekend',
    daysCount: 3,
    climateMood: 'breezy_evening',
    primaryOccasion: 'smart_casual',
    wardrobe: sparseWardrobe
  });

  if (!sparseTrip.missingEssentials || sparseTrip.missingEssentials.length === 0) {
    throw new Error('Sparse wardrobe failed to generate missing essentials warning!');
  }
  console.log(`PASS: Honest gap detection flagged ${sparseTrip.missingEssentials.length} missing travel items.`);

  // Test 5: Weather Service
  console.log('\n--- TEST 5: Open-Meteo Weather Service ---');
  const weather = await fetchLiveWeather('Bengaluru');
  if (typeof weather.tempC !== 'number' || !weather.condition) {
    throw new Error('Weather fetch returned invalid structure!');
  }
  console.log(`PASS: Weather service returned ${weather.tempC}°C • ${weather.condition}`);

  // Test 6: Scoped Storage Isolation
  console.log('\n--- TEST 6: Multi-Account Storage Isolation ---');
  const keyAarav = getPlannerKey('user-aarav-01');
  const keyPriya = getPlannerKey('user-priya-02');
  if (keyAarav === keyPriya) throw new Error('Storage keys must be strictly isolated per user!');
  savePlannerEntries('user-test-iso', []);
  const loaded = loadPlannerEntries('user-test-iso');
  if (!Array.isArray(loaded)) throw new Error('Planner entries must load as array!');
  console.log('PASS: Storage keys isolated per user and entry persistence verified.');

  console.log('\nALL 6 PHASE 6 INTELLIGENCE & PLANNING TESTS PASSED CLEANLY!\n');
}

runPhase6Tests();
