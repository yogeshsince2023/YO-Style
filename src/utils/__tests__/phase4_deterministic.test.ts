import { generateCuratedOutfits } from '../styleEngine';
import type { WardrobeItem } from '../../types/fashion';

const mockWardrobe: WardrobeItem[] = [
  {
    id: 'top-1',
    name: 'Oversized Linen Shirt',
    category: 'tops',
    subcategory: 'linen_shirt',
    subCategoryLabel: 'Linen Shirt',
    primaryColor: '#F5F5F0',
    colorName: 'Ecru',
    pattern: 'solid',
    brand: 'Uniqlo',
    fabric: 'Linen',
    fit: 'relaxed',
    occasions: ['weekend_brunch', 'date_night'],
    seasons: ['summer', 'all_year'],
    isAvailable: true,
    wearCount: 4,
    createdAt: 1000
  },
  {
    id: 'top-2',
    name: 'Bright Yellow Poplin Shirt',
    category: 'tops',
    subcategory: 'oxford_shirt',
    subCategoryLabel: 'Oxford Shirt',
    primaryColor: '#EAB308',
    colorName: 'Yellow',
    pattern: 'solid',
    brand: 'Zara',
    fabric: 'Cotton',
    fit: 'regular',
    occasions: ['weekend_brunch'],
    seasons: ['summer'],
    isAvailable: true,
    wearCount: 1,
    createdAt: 1001
  },
  {
    id: 'top-3-laundry',
    name: 'Silk Blend Kurta (In Wash)',
    category: 'ethnic',
    subcategory: 'short_kurta',
    subCategoryLabel: 'Short Kurta',
    primaryColor: '#1E293B',
    colorName: 'Midnight Navy',
    pattern: 'solid',
    brand: 'FabIndia',
    fabric: 'Silk Blend',
    fit: 'regular',
    occasions: ['weekend_brunch', 'festive_indian'],
    seasons: ['all_year'],
    isAvailable: false, // In Laundry!
    wearCount: 2,
    createdAt: 1002
  },
  {
    id: 'bottom-1',
    name: 'Pleated Trousers',
    category: 'bottoms',
    subcategory: 'wide_leg_trousers',
    subCategoryLabel: 'Wide Leg Trousers',
    primaryColor: '#18181B',
    colorName: 'Charcoal',
    pattern: 'solid',
    brand: 'COS',
    fabric: 'Wool Blend',
    fit: 'relaxed',
    occasions: ['weekend_brunch', 'date_night'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 7,
    createdAt: 1003
  },
  {
    id: 'bottom-2',
    name: 'Olive Straight Chinos',
    category: 'bottoms',
    subcategory: 'chinos',
    subCategoryLabel: 'Chinos',
    primaryColor: '#3F4F38',
    colorName: 'Olive',
    pattern: 'solid',
    brand: 'Marks & Spencer',
    fabric: 'Cotton',
    fit: 'regular',
    occasions: ['weekend_brunch'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 3,
    createdAt: 1004
  },
  {
    id: 'shoe-1',
    name: 'Minimalist Leather Derby',
    category: 'footwear',
    subcategory: 'leather_loafers',
    subCategoryLabel: 'Leather Loafers',
    primaryColor: '#18181B',
    colorName: 'Black',
    pattern: 'solid',
    brand: 'Clarks',
    fabric: 'Leather',
    fit: 'regular',
    occasions: ['weekend_brunch', 'date_night'],
    seasons: ['all_year'],
    isAvailable: true,
    wearCount: 12,
    createdAt: 1005
  }
];

function runTests() {
  console.log('--- TEST 1: Excluded Color Filter ---');
  const res1 = generateCuratedOutfits({
    wardrobe: mockWardrobe,
    occasion: 'weekend_brunch',
    weatherMood: 'warm_sun',
    excludedColorHexes: ['#EAB308'] // Exclude yellow
  });
  const hasYellow = res1.some(o => 
    Object.values(o.items).some(i => i && i.primaryColor.toLowerCase() === '#eab308')
  );
  if (hasYellow) throw new Error('FAIL: Excluded color appeared in outfit!');
  console.log('PASS: Yellow correctly excluded deterministically.');

  console.log('--- TEST 2: Laundry / Inactive Filter ---');
  const hasInWash = res1.some(o => 
    Object.values(o.items).some(i => i && i.id === 'top-3-laundry')
  );
  if (hasInWash) throw new Error('FAIL: Laundry item appeared in outfit!');
  console.log('PASS: Laundry item excluded deterministically.');

  console.log('--- TEST 3: At least 2 Distinct Outfits Generated ---');
  if (res1.length < 2) throw new Error(`FAIL: Expected >= 2 outfits, got ${res1.length}`);
  if (res1[0].id === res1[1].id) throw new Error('FAIL: Outfits are duplicates!');
  console.log(`PASS: Generated ${res1.length} distinct outfits.`);

  console.log('--- TEST 4: Honest Incomplete Wardrobe Gap ---');
  const topsOnly = mockWardrobe.filter(i => i.category === 'tops');
  const resIncomplete = generateCuratedOutfits({
    wardrobe: topsOnly,
    occasion: 'weekend_brunch',
    weatherMood: 'warm_sun'
  });
  if (!resIncomplete[0].isIncomplete) throw new Error('FAIL: Wardrobe missing bottoms should be incomplete!');
  if (!resIncomplete[0].missingSlots?.some(m => m.slot === 'bottom')) throw new Error('FAIL: Missing bottom slot not reported!');
  console.log('PASS: Incomplete wardrobe flagged honestly without inventing fake items.');

  console.log('--- TEST 5: Dislike Memory Filter ---');
  const outfitToDislike = res1[0].id;
  const resDisliked = generateCuratedOutfits({
    wardrobe: mockWardrobe,
    occasion: 'weekend_brunch',
    weatherMood: 'warm_sun',
    dislikedOutfitIds: [outfitToDislike]
  });
  if (resDisliked.some(o => o.id === outfitToDislike)) throw new Error('FAIL: Disliked outfit was suggested again!');
  console.log('PASS: Disliked outfit filtered out.');

  console.log('\nALL 5 DETERMINISTIC CHECKS PASSED PERFECTLY!');
}

runTests();
