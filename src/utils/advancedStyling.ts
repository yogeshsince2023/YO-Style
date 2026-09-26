import type { WardrobeItem, CuratedOutfit } from '../types/fashion';
import type { 
  IndianFestiveEvent, 
  FestiveEventProtocol, 
  SizeGuidanceResult, 
  WardrobeAnalyticsSummary 
} from '../types/advanced';

export const FESTIVE_PROTOCOLS: Record<IndianFestiveEvent, FestiveEventProtocol> = {
  haldi_pooja: {
    eventId: 'haldi_pooja',
    eventLabel: 'Haldi Ceremony & Morning Pooja',
    recommendedSilhouettes: ['Short Kurta', 'Breathable Cotton Kurta', 'Chinos / Linen Pants'],
    idealColors: ['Earthy Ochre', 'Warm Ecru', 'Mustard', 'Turmeric Yellow'],
    fabricsToPrioritize: ['Pure Khadi Cotton', 'Mulberry Cotton Blend'],
    fabricsToAvoid: ['Dry-Clean Silk', 'Heavy Velvet (Stains permanently with haldi)'],
    accessoriesRecommended: ['Kolhapuri Chappals', 'Minimalist Brass Analog Watch'],
    etiquetteTips: [
      'Turmeric stains will occur; wear breathable cottons you are comfortable washing.',
      'Slip-on footwear allows effortless transitions during temple or pooja rituals.'
    ]
  },
  mehendi_sangeet: {
    eventId: 'mehendi_sangeet',
    eventLabel: 'Mehendi & Sangeet Night',
    recommendedSilhouettes: ['Indo-Western Short Kurta', 'Nehru Jacket Layer', 'Relaxed Pleated Trousers'],
    idealColors: ['Malabar Navy', 'Forest Emerald', 'Terracotta', 'Deep Royal Blue'],
    fabricsToPrioritize: ['Textured Linen Weave', 'Lightweight Raw Silk'],
    fabricsToAvoid: ['Stiff Heavy Suiting (Restricts dance movement)'],
    accessoriesRecommended: ['Pocket Square', 'Leather Juttis / Loafers'],
    etiquetteTips: [
      'Prioritize shoulder and arm mobility for dancing.',
      'Rich jewel tones photograph exceptionally well under evening ambient stage lighting.'
    ]
  },
  wedding_ceremony: {
    eventId: 'wedding_ceremony',
    eventLabel: 'Wedding Ceremony (Pheras / Baraat)',
    recommendedSilhouettes: ['Artisanal Raw Silk Kurta', 'Tailored Nehru Jacket', 'Churidar / Tailored Trousers'],
    idealColors: ['Warm Ecru', 'Regal Indigo', 'Deep Maroon', 'Champagne Ivory'],
    fabricsToPrioritize: ['Chanderi Silk', 'Tussar Weave', 'Raw Silk'],
    fabricsToAvoid: ['Synthetic Polyester (Traps daytime heat)'],
    accessoriesRecommended: ['Handcrafted Leather Juttis', 'Silk Dupatta / Stole'],
    etiquetteTips: [
      'Opt for dignified heritage neutrals or regal tones.',
      'Ensure comfortable footwear suitable for walking during the Baraat.'
    ]
  },
  reception_cocktail: {
    eventId: 'reception_cocktail',
    eventLabel: 'Reception & Black-Tie Cocktail',
    recommendedSilhouettes: ['Bandhgala Jacket', 'Structured Blazer with Indian Accent', 'Deep Charcoal Trousers'],
    idealColors: ['Deep Charcoal', 'Midnight Navy', 'Black', 'Wine / Burgundy'],
    fabricsToPrioritize: ['Fine Merino Wool', 'Italian Cotton Weave', 'Matte Silk Blend'],
    fabricsToAvoid: ['Distressed Denim', 'Casual Polo Shirts'],
    accessoriesRecommended: ['Polished Leather Derbies / Loafers', 'Silk Pocket Square', 'Cufflinks'],
    etiquetteTips: [
      'Structured tailoring commands respect at evening banquets.',
      'Keep jewelry understated: an architectural lapel accent or analog watch.'
    ]
  }
};

/**
 * Calculates personalized brand size guidance across prominent retailers.
 * Includes mandatory non-guarantee liability disclaimer.
 */
export function calculateSizeGuidance({
  chestInches = 40,
  waistInches = 32,
  fitPreference = 'relaxed'
}: {
  chestInches?: number;
  waistInches?: number;
  fitPreference?: string;
}): SizeGuidanceResult[] {
  const DISCLAIMER = 'Sizing estimates are guidance based on published brand size charts and user input. Actual fabric drape, shrinkage, and fit vary. Never guaranteed.';

  // FabIndia (Traditional Indian Ease: cut generous +2")
  let fabIndiaSize: SizeGuidanceResult['recommendedSize'] = 'M';
  if (chestInches <= 37) fabIndiaSize = 'S';
  else if (chestInches <= 41) fabIndiaSize = 'M';
  else if (chestInches <= 45) fabIndiaSize = 'L';
  else fabIndiaSize = 'XL';

  // Uniqlo (Standard Global Fit)
  let uniqloSize: SizeGuidanceResult['recommendedSize'] = 'M';
  if (chestInches <= 36) uniqloSize = 'S';
  else if (chestInches <= 40) uniqloSize = 'M';
  else if (chestInches <= 44) uniqloSize = 'L';
  else uniqloSize = 'XL';

  // Zara (Slim European Cut: runs 1 size snug)
  let zaraSize: SizeGuidanceResult['recommendedSize'] = 'L';
  if (chestInches <= 36) zaraSize = 'S';
  else if (chestInches <= 39) zaraSize = 'M';
  else if (chestInches <= 42) zaraSize = 'L';
  else zaraSize = 'XL';

  // Marks & Spencer (Regular British Tailoring)
  let msSize: SizeGuidanceResult['recommendedSize'] = 'M';
  if (chestInches <= 38) msSize = 'S';
  else if (chestInches <= 42) msSize = 'M';
  else if (chestInches <= 46) msSize = 'L';
  else msSize = 'XL';

  return [
    {
      brandName: 'FabIndia',
      category: 'Indian Ethnic Kurtas',
      recommendedSize: fabIndiaSize,
      fitNote: `Traditional relaxed fit. Tailored with +2" chest ease for natural movement in hot climates.`,
      chestInches,
      waistInches,
      disclaimer: DISCLAIMER
    },
    {
      brandName: 'Uniqlo',
      category: 'French Linen & Oxford Shirts',
      recommendedSize: uniqloSize,
      fitNote: `Clean boxy drape. ${fitPreference === 'relaxed' ? 'Consider staying true to size for comfortable drape.' : 'True to size standard cut.'}`,
      chestInches,
      waistInches,
      disclaimer: DISCLAIMER
    },
    {
      brandName: 'Zara',
      category: 'Tailored Knit Polos & Blazers',
      recommendedSize: zaraSize,
      fitNote: `Snug European silhouette. Cut narrower across armholes and shoulders.`,
      chestInches,
      waistInches,
      disclaimer: DISCLAIMER
    },
    {
      brandName: 'Marks & Spencer',
      category: 'Pleated Chinos & Formal Trousers',
      recommendedSize: msSize,
      fitNote: `Structured waist (W${waistInches}) with straight drape through the thigh.`,
      chestInches,
      waistInches,
      disclaimer: DISCLAIMER
    }
  ];
}

/**
 * Dedicated Indian Festive Event Curations
 * Assembles ensemble matching ceremony protocols.
 */
export function curateFestiveLook(
  eventId: IndianFestiveEvent,
  wardrobe: WardrobeItem[]
): CuratedOutfit | undefined {
  const protocol = FESTIVE_PROTOCOLS[eventId];
  const available = wardrobe.filter(i => i.isAvailable);

  const ethnicKurtas = available.filter(i => i.category === 'ethnic' && i.subcategory !== 'nehru_jacket');
  const nehruJackets = available.filter(i => i.category === 'ethnic' && i.subcategory === 'nehru_jacket');
  const festiveTops = available.filter(i => i.category === 'tops' && (i.subcategory === 'linen_shirt' || i.subcategory === 'oxford_shirt'));
  const festiveBottoms = available.filter(i => i.category === 'bottoms');
  const festiveShoes = available.filter(i => i.category === 'footwear');

  let topPiece: WardrobeItem | undefined;
  let layerPiece: WardrobeItem | undefined;
  const bottomPiece = festiveBottoms[0];
  const shoePiece = festiveShoes[0];

  if (eventId === 'haldi_pooja') {
    // Haldi: cotton kuras or ecru shirts, avoid expensive silks
    topPiece = ethnicKurtas.find(k => k.primaryColor === '#F5F5F0' || k.colorName.toLowerCase().includes('yellow')) || ethnicKurtas[0] || festiveTops[0];
  } else if (eventId === 'mehendi_sangeet') {
    // Sangeet: jewel tone kurta or shirt with nehru jacket
    topPiece = ethnicKurtas[0] || festiveTops[0];
    layerPiece = nehruJackets[0];
  } else if (eventId === 'wedding_ceremony') {
    // Wedding: silk kurta or layered nehru
    topPiece = ethnicKurtas[0] || festiveTops[0];
    layerPiece = nehruJackets[0];
  } else {
    // Reception: structured shirt + nehru or tailored blazer
    topPiece = festiveTops[0] || ethnicKurtas[0];
    layerPiece = nehruJackets[0] || available.find(i => i.category === 'outerwear');
  }

  if (!topPiece && !bottomPiece) return undefined;

  return {
    id: `festive-${eventId}-${Date.now()}`,
    title: `${protocol.eventLabel}: Curated Ensemble`,
    occasion: 'festive_indian',
    weatherMood: 'warm_sun',
    items: {
      top: topPiece?.category === 'tops' ? topPiece : undefined,
      ethnicPiece: topPiece?.category === 'ethnic' ? topPiece : undefined,
      layer: layerPiece,
      bottom: bottomPiece,
      footwear: shoePiece
    },
    stylingRationale: `Optimized for ${protocol.eventLabel}. Features ${protocol.recommendedSilhouettes.slice(0, 2).join(' & ')} in breathable weaves. ${protocol.etiquetteTips[0]}`,
    harmonyTips: protocol.etiquetteTips,
    colorHarmonyScore: 95,
    wardrobeGap: {
      itemType: protocol.accessoriesRecommended[0],
      suggestedColor: 'Warm Raw Leather / Brass',
      potentialOutfitsUnlocked: 5,
      reasoning: 'Authentic Indian accessories elevate festive garments without recurring clothing purchases.',
      isDemoOnly: false
    }
  };
}

/**
 * Deep Wardrobe Analytics & Cost-per-Wear Calculation
 */
export function computeWardrobeAnalytics(wardrobe: WardrobeItem[]): WardrobeAnalyticsSummary {
  const totalItemsCount = wardrobe.length;

  // Average item value estimated at ₹2,500 if not recorded
  const totalEstimatedValueInr = wardrobe.reduce((acc, item) => {
    // Estimate based on category
    let val = 1800;
    if (item.category === 'outerwear' || item.subcategory === 'nehru_jacket') val = 4500;
    else if (item.category === 'ethnic') val = 2500;
    else if (item.category === 'footwear') val = 3000;
    else if (item.category === 'bottoms') val = 2200;
    return acc + val;
  }, 0);

  const totalWears = wardrobe.reduce((acc, item) => acc + item.wearCount, 0);
  const averageWearCount = totalItemsCount > 0 ? Math.round((totalWears / totalItemsCount) * 10) / 10 : 0;
  const averageCostPerWearInr = totalWears > 0 ? Math.round(totalEstimatedValueInr / totalWears) : totalEstimatedValueInr;

  // Top loved: sorted by wear count
  const sortedByWear = [...wardrobe].sort((a, b) => b.wearCount - a.wearCount);
  const topLovedItems = sortedByWear.slice(0, 3).filter(i => i.wearCount > 0);

  // Dormant items: 0 or 1 wear
  const dormantItems = wardrobe.filter(i => i.wearCount <= 1);

  // Color breakdown
  const colorMap = new Map<string, { colorName: string; hex: string; count: number }>();
  for (const item of wardrobe) {
    const existing = colorMap.get(item.colorName) || { colorName: item.colorName, hex: item.primaryColor, count: 0 };
    existing.count++;
    colorMap.set(item.colorName, existing);
  }

  const colorDistribution = Array.from(colorMap.values()).map(c => ({
    ...c,
    percentage: totalItemsCount > 0 ? Math.round((c.count / totalItemsCount) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  return {
    totalItemsCount,
    totalEstimatedValueInr,
    averageWearCount,
    averageCostPerWearInr,
    topLovedItems,
    dormantItems,
    colorDistribution
  };
}
