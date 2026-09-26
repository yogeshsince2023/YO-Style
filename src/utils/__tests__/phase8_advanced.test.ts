import {
  calculateSizeGuidance,
  curateFestiveLook,
  computeWardrobeAnalytics
} from '../advancedStyling';
import type { WardrobeItem } from '../../types/fashion';

const mockWardrobe: WardrobeItem[] = [
  {
    id: 'w1',
    name: 'Haldi Mustard Kurta',
    category: 'ethnic',
    subcategory: 'short_kurta',
    subCategoryLabel: 'Short Kurta',
    primaryColor: '#EAB308',
    colorName: 'Mustard Yellow',
    fabric: 'Pure Cotton',
    fit: 'relaxed',
    occasions: ['festive_indian', 'wedding_guest'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 3,
    createdAt: 1000
  },
  {
    id: 'w2',
    name: 'Ivory Silk Blend Trousers',
    category: 'bottoms',
    subcategory: 'chinos',
    subCategoryLabel: 'Churidar / Trouser',
    primaryColor: '#F5F5F0',
    colorName: 'Cream Ivory',
    fabric: 'Silk Blend',
    fit: 'regular',
    occasions: ['festive_indian', 'wedding_guest'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 2,
    createdAt: 1001
  },
  {
    id: 'w3',
    name: 'Zari Embroidered Nehru Jacket',
    category: 'ethnic',
    subcategory: 'nehru_jacket',
    subCategoryLabel: 'Nehru Jacket',
    primaryColor: '#B45309',
    colorName: 'Antique Gold',
    fabric: 'Raw Silk',
    fit: 'regular',
    occasions: ['wedding_guest', 'festive_indian'],
    seasons: ['winter', 'all_year'],
    isAvailable: true,
    wearCount: 1,
    createdAt: 1002
  },
  {
    id: 'w4',
    name: 'Handcrafted Mojaris',
    category: 'footwear',
    subcategory: 'juttis',
    subCategoryLabel: 'Mojari',
    primaryColor: '#78350F',
    colorName: 'Tan Leather',
    fabric: 'Leather',
    fit: 'regular',
    occasions: ['festive_indian', 'wedding_guest'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 8,
    createdAt: 1003
  },
  {
    id: 'w5',
    name: 'Unworn Formal Blazer',
    category: 'outerwear',
    subcategory: 'unstructured_blazer',
    subCategoryLabel: 'Dinner Jacket',
    primaryColor: '#000000',
    colorName: 'Black',
    fabric: 'Wool Blend',
    fit: 'tailored',
    occasions: ['work_formal'],
    seasons: ['winter'],
    isAvailable: true,
    wearCount: 0,
    createdAt: 1004
  }
];

function runPhase8Tests() {
  console.log('=== RUNNING PHASE 8 ADVANCED STYLING & HARDENING TESTS ===\n');

  // --- TEST 1: Brand Size Guidance & Disclaimers ---
  console.log('--- TEST 1: Brand Size Guidance & Statutory Disclaimer Compliance ---');
  const guidanceResults = calculateSizeGuidance({
    chestInches: 39,
    waistInches: 32,
    fitPreference: 'standard'
  });

  const zara = guidanceResults.find(g => g.brandName === 'Zara');
  if (!zara || zara.recommendedSize !== 'M') {
    throw new Error(`Expected Zara M for 39" chest, got ${zara?.recommendedSize}`);
  }
  if (!zara.disclaimer.includes('Never guaranteed')) {
    throw new Error('Missing statutory disclaimer on Zara size guidance');
  }
  console.log(`PASS: Zara size calculated as ${zara.recommendedSize} with non-guarantee liability disclaimer.`);

  const fabIndia = guidanceResults.find(g => g.brandName === 'FabIndia');
  if (!fabIndia || fabIndia.recommendedSize !== 'M') {
    throw new Error(`Expected FabIndia M for 39" chest, got ${fabIndia?.recommendedSize}`);
  }
  if (!fabIndia.fitNote.includes('+2" chest ease')) {
    throw new Error('Missing Indian tailoring ease note in FabIndia guidance');
  }
  console.log(`PASS: FabIndia guidance includes authentic Indian ease note: "${fabIndia.fitNote}"`);

  // Verify all 4 prominent brand charts are represented
  const brandsCovered = guidanceResults.map(g => g.brandName);
  if (!brandsCovered.includes('FabIndia') || !brandsCovered.includes('Uniqlo') ||
      !brandsCovered.includes('Zara') || !brandsCovered.includes('Marks & Spencer')) {
    throw new Error(`Missing expected brand in [${brandsCovered.join(', ')}]`);
  }
  console.log(`PASS: All 4 prominent brand charts verified: ${brandsCovered.join(', ')}.`);

  // --- TEST 2: Indian Ceremonial Styling Engine ---
  console.log('\n--- TEST 2: Indian Ceremonial Protocols (Haldi, Mehendi, Wedding, Reception) ---');
  const haldiLook = curateFestiveLook('haldi_pooja', mockWardrobe);
  if (!haldiLook) throw new Error('Failed to generate Haldi look');
  if (!haldiLook.items.ethnicPiece || haldiLook.items.ethnicPiece.id !== 'w1') {
    throw new Error('Failed to select mustard yellow cotton kurta for Haldi ceremony');
  }
  if (!haldiLook.harmonyTips.some(t => t.toLowerCase().includes('turmeric'))) {
    throw new Error('Missing turmeric etiquette note in Haldi harmony tips');
  }
  console.log(`PASS: Curated Haldi look: "${haldiLook.items.ethnicPiece.name}" with etiquette tips.`);

  const weddingLook = curateFestiveLook('wedding_ceremony', mockWardrobe);
  if (!weddingLook) throw new Error('Failed to generate Wedding look');
  if (!weddingLook.items.layer || weddingLook.items.layer.id !== 'w3') {
    throw new Error('Failed to match Zari Nehru Jacket layer for Wedding ceremony');
  }
  console.log(`PASS: Curated Wedding look: Layered "${weddingLook.items.layer.name}" with "${weddingLook.items.ethnicPiece?.name}".`);

  // --- TEST 3: Wardrobe Analytics & Cost-per-Wear ---
  console.log('\n--- TEST 3: Closet Valuation & Cost-per-Wear (CPW) Analytics ---');
  const analytics = computeWardrobeAnalytics(mockWardrobe);
  if (analytics.totalItemsCount !== 5) {
    throw new Error(`Expected 5 items, got ${analytics.totalItemsCount}`);
  }
  if (analytics.totalEstimatedValueInr <= 0) {
    throw new Error('Valuation must be positive');
  }
  if (analytics.topLovedItems[0].id !== 'w4') {
    throw new Error(`Expected Handcrafted Mojaris as most loved (wearCount 8), got ${analytics.topLovedItems[0]?.name}`);
  }
  if (!analytics.dormantItems.some(i => i.id === 'w5')) {
    throw new Error('Failed to identify unworn formal blazer in dormant items list');
  }
  console.log(`PASS: Closet valuation ₹${analytics.totalEstimatedValueInr.toLocaleString('en-IN')}, CPW ₹${analytics.averageCostPerWearInr}/wear, top loved "${analytics.topLovedItems[0].name}", dormant alert for "${analytics.dormantItems.find(i => i.id === 'w5')?.name}".`);

  // --- TEST 4: Empty Wardrobe Edge Handling ---
  console.log('\n--- TEST 4: Zero Items Edge Case Handling ---');
  const emptyAnalytics = computeWardrobeAnalytics([]);
  if (emptyAnalytics.totalItemsCount !== 0 || emptyAnalytics.totalEstimatedValueInr !== 0 || emptyAnalytics.averageCostPerWearInr !== 0) {
    throw new Error('Failed empty wardrobe graceful fallback');
  }
  const emptyLook = curateFestiveLook('haldi_pooja', []);
  if (emptyLook !== undefined) {
    throw new Error('Expected undefined when curating festive look with empty wardrobe');
  }
  console.log('PASS: Empty wardrobe graceful zero-state and safe fallback verified.');

  console.log('\nALL 4 PHASE 8 ADVANCED STYLING & HARDENING TESTS PASSED CLEANLY!\n');
}

runPhase8Tests();
