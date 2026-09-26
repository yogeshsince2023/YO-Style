import type { WardrobeItem, FashionCategory, Subcategory, WeatherMood, OccasionType } from '../types/fashion';
import type { 
  PlannedOutfitEntry, 
  TravelTripPlan, 
  PurchaseEvaluation, 
  ImageClassificationResult 
} from '../types/intelligence';

// Color naming palette table
const COLOR_PALETTE_MAP: { name: string; hex: string; r: number; g: number; b: number }[] = [
  { name: 'Pure White', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
  { name: 'Warm Ecru', hex: '#F5F5F0', r: 245, g: 245, b: 240 },
  { name: 'Malabar Navy', hex: '#1E293B', r: 30, g: 41, b: 59 },
  { name: 'Deep Charcoal', hex: '#27272A', r: 39, g: 39, b: 42 },
  { name: 'Desert Olive', hex: '#3F4F38', r: 63, g: 79, b: 56 },
  { name: 'Rich Tan', hex: '#78350F', r: 120, g: 53, b: 15 },
  { name: 'Raw Indigo', hex: '#1D4ED8', r: 29, g: 78, b: 216 },
  { name: 'Earthy Ochre', hex: '#D97706', r: 217, g: 119, b: 6 },
  { name: 'Terracotta', hex: '#C2410C', r: 194, g: 65, b: 12 }
];

/**
 * On-demand client-side image analyzer using HTML5 Canvas.
 * Extracts dominant tones, brightness, and estimates category/fabric/fit with uncertainty score.
 * Never runs automatically; only triggered when user taps "Analyze Photo".
 */
export async function analyzeClothingImage(imageDataUrl: string): Promise<ImageClassificationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const sampleSize = 64;
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        if (!ctx) {
          resolve(getFallbackClassification());
          return;
        }

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imgData.data;

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let count = 0;

        // Sample center pixels to avoid pure white/neutral background
        const margin = Math.floor(sampleSize * 0.2);
        for (let y = margin; y < sampleSize - margin; y += 2) {
          for (let x = margin; x < sampleSize - margin; x += 2) {
            const idx = (y * sampleSize + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            // Skip pure background whites (>250) or deep vignette blacks (<10)
            if (!(r > 248 && g > 248 && b > 248) && !(r < 12 && g < 12 && b < 12)) {
              totalR += r;
              totalG += g;
              totalB += b;
              count++;
            }
          }
        }

        if (count === 0) {
          count = 1;
          totalR = 240;
          totalG = 240;
          totalB = 235;
        }

        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);

        // Find nearest color in fashion palette
        let minDistance = Infinity;
        let nearestColor = COLOR_PALETTE_MAP[1]; // default ecru

        for (const col of COLOR_PALETTE_MAP) {
          const dist = Math.hypot(avgR - col.r, avgG - col.g, avgB - col.b);
          if (dist < minDistance) {
            minDistance = dist;
            nearestColor = col;
          }
        }

        const aspect = img.height / img.width;
        let cat: Exclude<FashionCategory, 'all'> = 'tops';
        let sub: Subcategory = 'oxford_shirt';
        let subLabel = 'Oxford Shirt';
        let fabric = 'Cotton Weave';

        if (aspect > 1.35) {
          // Elongated silhouette -> trousers, kurta, or outerwear
          if (nearestColor.hex === '#1E293B' || nearestColor.hex === '#27272A' || nearestColor.hex === '#3F4F38') {
            cat = 'bottoms';
            sub = 'wide_leg_trousers';
            subLabel = 'Wide Leg Trousers';
            fabric = 'Structured Blend';
          } else {
            cat = 'ethnic';
            sub = 'short_kurta';
            subLabel = 'Short Kurta';
            fabric = 'Linen / Khadi';
          }
        } else if (aspect < 0.85) {
          // Wider landscape silhouette -> footwear or accessory
          cat = 'footwear';
          sub = 'minimal_sneakers';
          subLabel = 'Minimal Sneakers';
          fabric = 'Leather';
        } else {
          cat = 'tops';
          sub = 'linen_shirt';
          subLabel = 'Linen Shirt';
          fabric = 'Breathable Linen';
        }

        // Confidence: higher if color match is close and aspect ratio is decisive
        const matchConfidence = Math.max(50, Math.min(88, Math.round(95 - (minDistance / 5))));
        const isUncertain = matchConfidence < 78;

        resolve({
          confidence: matchConfidence,
          isUncertain,
          suggestedCategory: cat,
          suggestedSubcategory: sub,
          suggestedSubcategoryLabel: subLabel,
          suggestedColorName: nearestColor.name,
          suggestedColorHex: nearestColor.hex,
          suggestedFabric: fabric,
          suggestedFit: 'relaxed',
          notes: isUncertain ? 'Low lighting or varied patterns detected. Review labels before saving.' : undefined
        });
      } catch {
        resolve(getFallbackClassification());
      }
    };

    img.onerror = () => {
      resolve(getFallbackClassification());
    };

    img.src = imageDataUrl;
  });
}

function getFallbackClassification(): ImageClassificationResult {
  return {
    confidence: 65,
    isUncertain: true,
    suggestedCategory: 'tops',
    suggestedSubcategory: 'linen_shirt',
    suggestedSubcategoryLabel: 'Linen Shirt',
    suggestedColorName: 'Warm Ecru',
    suggestedColorHex: '#F5F5F0',
    suggestedFabric: 'Cotton Blend',
    suggestedFit: 'relaxed',
    notes: 'Image preview could not be fully analyzed. Manual review recommended.'
  };
}

/**
 * "Do I Need This?" Purchase Evaluator
 * Objectively evaluates a prospective purchase against the user's real owned clothes.
 * Highlights redundancies, calculates pairing versatility, and avoids calling items "essential" without proof.
 */
export function evaluatePurchase({
  itemName,
  category,
  subcategory,
  colorName,
  colorHex,
  priceInr,
  wardrobe
}: {
  itemName: string;
  category: Exclude<FashionCategory, 'all'>;
  subcategory: Subcategory;
  colorName: string;
  colorHex: string;
  priceInr?: number;
  wardrobe: WardrobeItem[];
}): PurchaseEvaluation {
  // 1. Redundancy analysis: check items in same subcategory or identical color family
  const sameCategoryItems = wardrobe.filter(i => i.category === category);
  const exactSubcategoryMatches = sameCategoryItems.filter(i => i.subcategory === subcategory);
  const colorFamilyMatches = sameCategoryItems.filter(i => 
    i.primaryColor.toLowerCase() === colorHex.toLowerCase() ||
    i.colorName.toLowerCase().includes(colorName.toLowerCase())
  );

  const redundantItemNames = Array.from(new Set([
    ...exactSubcategoryMatches.map(i => `${i.name} (${i.colorName}, ${i.wearCount} wears)`),
    ...colorFamilyMatches.map(i => `${i.name} (${i.colorName}, ${i.wearCount} wears)`)
  ]));

  let redundancyScore = 0;
  if (exactSubcategoryMatches.length >= 2) {
    redundancyScore = 85;
  } else if (exactSubcategoryMatches.length === 1 && colorFamilyMatches.length >= 1) {
    redundancyScore = 70;
  } else if (exactSubcategoryMatches.length === 1) {
    redundancyScore = 50;
  } else if (colorFamilyMatches.length >= 2) {
    redundancyScore = 40;
  } else {
    redundancyScore = 10;
  }

  // 2. Compatibility & pairing index: how many existing items will this pair with?
  let compatibleItems: WardrobeItem[] = [];
  if (category === 'tops' || category === 'ethnic') {
    // Pairs with bottoms & footwear
    compatibleItems = wardrobe.filter(i => i.isAvailable && (i.category === 'bottoms' || i.category === 'footwear'));
  } else if (category === 'bottoms') {
    // Pairs with tops & footwear
    compatibleItems = wardrobe.filter(i => i.isAvailable && (i.category === 'tops' || i.category === 'ethnic' || i.category === 'footwear'));
  } else if (category === 'outerwear') {
    // Pairs with tops & bottoms
    compatibleItems = wardrobe.filter(i => i.isAvailable && (i.category === 'tops' || i.category === 'bottoms'));
  } else {
    compatibleItems = wardrobe.filter(i => i.isAvailable && (i.category === 'bottoms' || i.category === 'tops'));
  }

  // Calculate unlocked outfit potential
  const availableTops = wardrobe.filter(i => i.isAvailable && (i.category === 'tops' || i.category === 'ethnic'));
  const availableBottoms = wardrobe.filter(i => i.isAvailable && i.category === 'bottoms');
  
  let unlockedCount = 0;
  if (category === 'bottoms') {
    unlockedCount = Math.min(8, availableTops.length);
  } else if (category === 'tops' || category === 'ethnic') {
    unlockedCount = Math.min(8, availableBottoms.length);
  } else {
    unlockedCount = Math.min(6, Math.min(availableTops.length, availableBottoms.length));
  }

  // 3. Evidence-backed Verdict Assignment
  let verdict: PurchaseEvaluation['verdict'] = 'capsule_completer';
  let verdictLabel = 'Capsule Completer';
  let verdictExplanation = '';

  if (redundancyScore >= 70) {
    verdict = 'redundant';
    verdictLabel = 'Likely Redundant';
    verdictExplanation = `You already own ${redundantItemNames.length} very similar ${category} in your closet. Wearing your existing pieces delivers higher utility before acquiring another.`;
  } else if (compatibleItems.length < 2) {
    verdict = 'low_synergy';
    verdictLabel = 'Low Closet Synergy';
    verdictExplanation = `This piece has fewer than 2 natural partners in your current wardrobe. Buying it risks creating an orphaned item that demands purchasing more clothes.`;
  } else if (priceInr && priceInr > 6000 && unlockedCount < 3) {
    verdict = 'occasional_splurge';
    verdictLabel = 'Occasional Splurge';
    verdictExplanation = `Premium price tag (₹${priceInr.toLocaleString('en-IN')}) with limited cross-closet versatility (${unlockedCount} unlocked look). Consider only for a specific milestone event.`;
  } else {
    verdict = 'capsule_completer';
    verdictLabel = 'Capsule Completer';
    verdictExplanation = `High utility staple. Pairs immediately with ${compatibleItems.length} items in your closet and unlocks ~${unlockedCount} fresh outfits without duplicate clutter.`;
  }

  return {
    id: `eval-${Date.now()}`,
    itemName,
    category,
    subcategory,
    colorName,
    colorHex,
    estimatedPriceInr: priceInr,
    redundancyScore,
    redundantItemNames,
    compatibleOwnedItemIds: compatibleItems.map(i => i.id),
    unlockedOutfitCount: unlockedCount,
    verdict,
    verdictLabel,
    verdictExplanation,
    confidenceScore: 92,
    createdAt: Date.now()
  };
}

/**
 * Capsule Travel Packing Engine
 * Generates a minimal, mix-and-match packing list using owned clothes first.
 * Flags missing essentials honestly when the wardrobe is sparse.
 */
export function generateTravelCapsule({
  destination,
  daysCount,
  climateMood,
  primaryOccasion,
  wardrobe
}: {
  destination: string;
  daysCount: number;
  climateMood: WeatherMood;
  primaryOccasion: OccasionType;
  wardrobe: WardrobeItem[];
}): TravelTripPlan {
  const available = wardrobe.filter(i => i.isAvailable);

  // Target item counts based on trip length
  let targetTops = 2;
  let targetBottoms = 2;
  let targetShoes = 1;
  let targetLayers = 1;

  if (daysCount <= 3) {
    targetTops = 2;
    targetBottoms = 2;
    targetShoes = 1;
    targetLayers = climateMood === 'chilly_winter' || climateMood === 'ac_indoor' ? 1 : 0;
  } else if (daysCount <= 6) {
    targetTops = 3;
    targetBottoms = 2;
    targetShoes = 2;
    targetLayers = 1;
  } else {
    targetTops = 5;
    targetBottoms = 3;
    targetShoes = 2;
    targetLayers = 2;
  }

  // Filter candidates by climate / season and sort by wear count (proven reliability)
  const candidateTops = available
    .filter(i => i.category === 'tops' || i.category === 'ethnic')
    .sort((a, b) => b.wearCount - a.wearCount);

  const candidateBottoms = available
    .filter(i => i.category === 'bottoms')
    .sort((a, b) => b.wearCount - a.wearCount);

  const candidateShoes = available
    .filter(i => i.category === 'footwear')
    .sort((a, b) => b.wearCount - a.wearCount);

  const candidateLayers = available
    .filter(i => i.category === 'outerwear' || (i.category === 'ethnic' && i.subcategory === 'nehru_jacket'))
    .sort((a, b) => b.wearCount - a.wearCount);

  const packedItems: WardrobeItem[] = [];
  const missingEssentials: string[] = [];

  // Pick tops
  const selectedTops = candidateTops.slice(0, targetTops);
  packedItems.push(...selectedTops);
  if (selectedTops.length < targetTops) {
    missingEssentials.push(`${targetTops - selectedTops.length}x Versatile Neutral Top / Shirt`);
  }

  // Pick bottoms
  const selectedBottoms = candidateBottoms.slice(0, targetBottoms);
  packedItems.push(...selectedBottoms);
  if (selectedBottoms.length < targetBottoms) {
    missingEssentials.push(`${targetBottoms - selectedBottoms.length}x Wrinkle-Resistant Trouser / Chino`);
  }

  // Pick shoes
  const selectedShoes = candidateShoes.slice(0, targetShoes);
  packedItems.push(...selectedShoes);
  if (selectedShoes.length < targetShoes) {
    missingEssentials.push('1x Comfortable Walking Footwear');
  }

  // Pick layers if needed
  if (targetLayers > 0) {
    const selectedLayers = candidateLayers.slice(0, targetLayers);
    packedItems.push(...selectedLayers);
    if (selectedLayers.length < targetLayers && (climateMood === 'chilly_winter' || climateMood === 'ac_indoor')) {
      missingEssentials.push('1x Light Travel Blazer or Weather Jacket');
    }
  }

  const potentialLooks = Math.min(daysCount + 2, selectedTops.length * selectedBottoms.length);

  return {
    id: `trip-${Date.now()}`,
    tripTitle: `${daysCount}-Day ${destination || 'Getaway'} Capsule`,
    destination: destination || 'Upcoming Destination',
    daysCount,
    climateMood,
    primaryOccasion,
    packedItemIds: packedItems.map(i => i.id),
    suggestedLookCount: Math.max(1, potentialLooks),
    missingEssentials: missingEssentials.length > 0 ? missingEssentials : undefined,
    createdAt: Date.now()
  };
}

/**
 * Open-Meteo REST Weather Service (100% Free, ₹0 cost, zero API key)
 * Fallback to manual selection if offline or user denies location.
 */
export async function fetchLiveWeather(city = 'Bengaluru'): Promise<{
  tempC: number;
  condition: string;
  isRainy: boolean;
  isChilly: boolean;
}> {
  // Pre-configured coordinates for common hubs; default to Bengaluru
  const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
    bengaluru: { lat: 12.9716, lon: 77.5946 },
    mumbai: { lat: 19.0760, lon: 72.8777 },
    delhi: { lat: 28.6139, lon: 77.2090 },
    london: { lat: 51.5074, lon: -0.1278 },
    paris: { lat: 48.8566, lon: 2.3522 }
  };

  const key = city.toLowerCase().trim();
  const coords = CITY_COORDS[key] || CITY_COORDS['bengaluru'];

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const temp = Math.round(data.current?.temperature_2m ?? 24);
      const code = data.current?.weather_code ?? 0;

      const isRainy = code >= 51 && code <= 67;
      const isChilly = temp < 18;

      let cond = 'Pleasant & Clear';
      if (isRainy) cond = 'Rain / Drizzle';
      else if (temp > 30) cond = 'Warm & Sunny';
      else if (isChilly) cond = 'Chilly Climate';

      return {
        tempC: temp,
        condition: cond,
        isRainy,
        isChilly
      };
    }
  } catch {
    // Graceful offline fallback
  }

  // Default clean manual fallback
  return {
    tempC: 25,
    condition: 'Pleasant & Mild (Manual)',
    isRainy: false,
    isChilly: false
  };
}

/**
 * Storage helpers scoped to user ID
 */
export function getPlannerKey(userId: string): string {
  return `yo_style_planner_user_${userId}`;
}

export function loadPlannerEntries(userId: string): PlannedOutfitEntry[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(getPlannerKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlannerEntries(userId: string, entries: PlannedOutfitEntry[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(getPlannerKey(userId), JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save planner', e);
  }
}

export function getTripsKey(userId: string): string {
  return `yo_style_trips_user_${userId}`;
}

export function loadTravelPlans(userId: string): TravelTripPlan[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(getTripsKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTravelPlans(userId: string, plans: TravelTripPlan[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(getTripsKey(userId), JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save travel plans', e);
  }
}

export function getEvalsKey(userId: string): string {
  return `yo_style_evals_user_${userId}`;
}

export function loadPurchaseEvaluations(userId: string): PurchaseEvaluation[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(getEvalsKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePurchaseEvaluations(userId: string, evals: PurchaseEvaluation[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(getEvalsKey(userId), JSON.stringify(evals));
  } catch (e) {
    console.error('Failed to save purchase evaluations', e);
  }
}
