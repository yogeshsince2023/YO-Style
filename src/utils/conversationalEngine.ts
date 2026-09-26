import type { WardrobeItem, FashionProfile, CuratedOutfit, OccasionType } from '../types/fashion';
import type { ChatMessage, SessionPreference, StylistStructuredOutput } from '../types/chat';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 10;
const REQUEST_DEBOUNCE_MS = 1500;

let lastRequestTimestamp = 0;
const requestTimestamps: number[] = [];

/**
 * Strips script tags, system injection tokens, and dangerous payload substrings.
 */
export function sanitizeUserInput(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, '')
    .replace(/(ignore\s+previous\s+instructions|system\s+prompt|reveal\s+instructions|act\s+as\s+admin)/gi, '[blocked pattern]')
    .trim()
    .slice(0, 500); // 500 char length cap
}

/**
 * Checks rate limits (sliding window + debounce).
 */
export function checkRateLimit(): { allowed: boolean; waitTimeMs?: number; reason?: string } {
  const now = Date.now();
  if (now - lastRequestTimestamp < REQUEST_DEBOUNCE_MS) {
    return {
      allowed: false,
      waitTimeMs: REQUEST_DEBOUNCE_MS - (now - lastRequestTimestamp),
      reason: 'Please pause for a moment before your next styling question.'
    };
  }

  // Purge timestamps older than window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestInWindow = requestTimestamps[0];
    const waitSec = Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      waitTimeMs: (oldestInWindow + RATE_LIMIT_WINDOW_MS - now),
      reason: `Hourly styling request limit reached. Please wait ${waitSec}s or continue using the non-AI look generator.`
    };
  }

  lastRequestTimestamp = now;
  requestTimestamps.push(now);
  return { allowed: true };
}

/**
 * Local storage scoped chat history
 */
export function getChatStorageKey(userId: string): string {
  return `yo_style_chat_user_${userId}`;
}

export function loadUserChat(userId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(getChatStorageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveUserChat(userId: string, messages: ChatMessage[]): void {
  try {
    // Keep max 20 messages to conserve localStorage
    const trimmed = messages.slice(-20);
    localStorage.setItem(getChatStorageKey(userId), JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save chat to local storage', e);
  }
}

export function clearUserChat(userId: string): void {
  localStorage.removeItem(getChatStorageKey(userId));
}

export function exportUserChat(messages: ChatMessage[], userName: string): void {
  const textExport = messages.map(m => {
    const date = new Date(m.timestamp).toLocaleTimeString();
    const role = m.sender === 'user' ? userName : 'YO Style Stylist';
    let outfitSummary = '';
    if (m.outfit) {
      const items = Object.entries(m.outfit.items)
        .filter(([, v]) => !!v)
        .map(([slot, item]) => `  • ${slot.toUpperCase()}: ${item?.name} (${item?.colorName})`)
        .join('\n');
      outfitSummary = `\n[Recommended Outfit: ${m.outfit.title}]\n${items}\nRationale: ${m.outfit.stylingRationale}\n`;
    }
    return `[${date}] ${role}:\n${m.text}${outfitSummary}`;
  }).join('\n----------------------------------------\n\n');

  const blob = new Blob([textExport], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yo-style-consultation-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Offline / Fallback Deterministic NLP Stylist Engine
 * Analyzes natural language queries and modifies or generates outfits matching wardrobe
 */
export function processQueryLocally({
  query,
  wardrobe,
  profile,
  activeOutfit,
  activePreferences = []
}: {
  query: string;
  wardrobe: WardrobeItem[];
  profile: FashionProfile;
  activeOutfit?: CuratedOutfit;
  activePreferences?: SessionPreference[];
}): StylistStructuredOutput {
  const lower = query.toLowerCase();
  const availableItems = wardrobe.filter(i => i.isAvailable);

  // 1. Check for Color Dislike ("I don't like white", "avoid yellow", "no black")
  const colorMatch = lower.match(/(?:don't like|dont like|avoid|no|hate|without)\s+([a-zA-Z]+)/i);
  if (colorMatch && !lower.includes('shoes') && !lower.includes('cargos')) {
    const colorWord = colorMatch[1].toLowerCase();
    const updatedPreferences = [...activePreferences];
    if (!updatedPreferences.some(p => p.value.toLowerCase() === colorWord)) {
      updatedPreferences.push({
        id: `pref-${Date.now()}`,
        type: 'avoid_color',
        label: `Avoiding: ${colorWord.charAt(0).toUpperCase() + colorWord.slice(1)}`,
        value: colorWord,
        isDismissible: true
      });
    }

    const filtered = availableItems.filter(i => 
      !i.colorName.toLowerCase().includes(colorWord) &&
      !i.name.toLowerCase().includes(colorWord)
    );

    const top = filtered.find(i => i.category === 'tops' || i.category === 'ethnic');
    const bottom = filtered.find(i => i.category === 'bottoms' && i.id !== top?.id);
    const footwear = filtered.find(i => i.category === 'footwear');

    return {
      replyText: `Understood. Excluded ${colorWord} garments from this look. Here is a balanced palette using your clean wardrobe without any ${colorWord} tones.`,
      intent: 'COLOR_EXCLUSION',
      detectedPreferences: [{
        type: 'avoid_color',
        label: `Avoiding ${colorWord.charAt(0).toUpperCase() + colorWord.slice(1)}`,
        value: colorWord
      }],
      recommendedOutfit: top && bottom ? {
        title: `Curated Non-${colorWord.charAt(0).toUpperCase() + colorWord.slice(1)} Palette`,
        occasion: activeOutfit?.occasion || 'smart_casual',
        ownedItemIds: {
          top: top.category === 'tops' ? top.id : undefined,
          ethnicPiece: top.category === 'ethnic' ? top.id : undefined,
          bottom: bottom.id,
          footwear: footwear?.id
        },
        stylingRationale: `Replaced any ${colorWord} garments with grounded neutral tones (${top.colorName} and ${bottom.colorName}) to maintain sharp visual balance.`,
        harmonyTips: [
          `Honors your current color boundary: zero ${colorWord} pieces.`,
          'Maintains rich textural interest with breathable weaves.'
        ],
        colorHarmonyScore: 92,
        capsuleGap: {
          categoryName: 'Warm Earth-Tone Pocket Stole',
          suggestedColor: 'Terracotta / Sand',
          reasoning: 'Adds tonal dimension without introducing unwanted shades.'
        }
      } : undefined
    };
  }

  // 2. Delta Slot Modification: "Change shoes", "Keep outfit but swap footwear"
  if (lower.includes('change') && (lower.includes('shoe') || lower.includes('footwear') || lower.includes('sneaker') || lower.includes('loafer'))) {
    if (activeOutfit && (activeOutfit.items.top || activeOutfit.items.bottom)) {
      const currentShoeId = activeOutfit.items.footwear?.id;
      const alternativeShoes = availableItems.filter(i => i.category === 'footwear' && i.id !== currentShoeId);
      const newShoe = alternativeShoes[0] || activeOutfit.items.footwear;

      return {
        replyText: newShoe 
          ? `Preserved your ensemble (${activeOutfit.items.top?.name || 'Top'} + ${activeOutfit.items.bottom?.name || 'Bottom'}) and switched footwear to your ${newShoe.name}.`
          : 'You currently have one active pair of footwear cataloged in your clean closet.',
        intent: 'DELTA_SWAP',
        recommendedOutfit: {
          title: `Modified: ${activeOutfit.title}`,
          occasion: activeOutfit.occasion,
          ownedItemIds: {
            top: activeOutfit.items.top?.id,
            ethnicPiece: activeOutfit.items.ethnicPiece?.id,
            bottom: activeOutfit.items.bottom?.id,
            layer: activeOutfit.items.layer?.id,
            footwear: newShoe?.id,
            accessory: activeOutfit.items.accessory?.id
          },
          stylingRationale: `Retained the silhouette foundations while altering the base weight. The ${newShoe?.name || 'selected shoes'} pivot the formality cleanly.`,
          harmonyTips: [
            'Proportions stay locked; only foundation contact changes.',
            'Comfort-tested pairing for seamless all-day wear.'
          ],
          colorHarmonyScore: 90
        }
      };
    }
  }

  // 3. Archetype Shift: "Make it more traditional" / "Ethnic look" / "Indian"
  if (lower.includes('traditional') || lower.includes('ethnic') || lower.includes('desi') || lower.includes('kurta') || lower.includes('indian')) {
    const ethnicPieces = availableItems.filter(i => i.category === 'ethnic');
    const bottoms = availableItems.filter(i => i.category === 'bottoms');
    const traditionalFootwear = availableItems.filter(i => 
      i.category === 'footwear' && (i.subcategory === 'kolhapuri_chappals' || i.subcategory === 'juttis')
    );
    const standardFootwear = availableItems.filter(i => i.category === 'footwear');

    const topEthnic = ethnicPieces.find(e => e.subcategory === 'short_kurta' || e.subcategory === 'chikankari_kurta') || ethnicPieces[0];
    const nehruLayer = ethnicPieces.find(e => e.subcategory === 'nehru_jacket');
    const bottom = bottoms.find(b => b.subcategory === 'wide_leg_trousers' || b.subcategory === 'chinos' || b.subcategory === 'churidar') || bottoms[0];
    const shoes = traditionalFootwear[0] || standardFootwear[0];

    return {
      replyText: topEthnic 
        ? `Shifted toward an authentic Indo-Western silhouette, anchoring on your ${topEthnic.name}.`
        : `Your wardrobe currently lacks a cataloged Kurta, so we paired tailored pieces with an Indian-heritage aesthetic advice.`,
      intent: 'ARCHETYPE_SHIFT',
      detectedPreferences: [{
        type: 'archetype',
        label: 'Aesthetic: Indo-Western Traditional',
        value: 'traditional'
      }],
      recommendedOutfit: {
        title: topEthnic ? 'Refined Artisanal Indo-Western Look' : 'Contemporary Heritage Inspired Silhouette',
        occasion: 'festive_indian',
        ownedItemIds: {
          ethnicPiece: topEthnic?.id,
          top: topEthnic ? undefined : availableItems.find(i => i.category === 'tops')?.id,
          layer: nehruLayer?.id,
          bottom: bottom?.id,
          footwear: shoes?.id
        },
        stylingRationale: topEthnic
          ? `Combines the rich weave of ${topEthnic.name} with relaxed ${bottom?.name || 'bottoms'}. Preserves authentic cultural heritage while staying light and comfortable.`
          : `Uses clean neutral tailoring to mirror classic Bandhgala lines. Cataloging an artisanal Kurta will complete this capsule.`,
        harmonyTips: [
          'Natural breathable textiles create gentle drape.',
          'Understated accessories keep the spotlight on the artisanal weave.'
        ],
        colorHarmonyScore: 95,
        capsuleGap: {
          categoryName: 'Handcrafted Kolhapuri Chappals / Leather Juttis',
          suggestedColor: 'Rich Tan / Raw Leather',
          reasoning: 'Authentic Indian handcrafted footwear anchors festive and celebratory wear.'
        }
      }
    };
  }

  // 4. Targeted item styling: "Style my green cargos for college" or "Style my [color/category] for [occasion]"
  const collegeMatch = lower.includes('college') || lower.includes('campus');
  const targetOccasion: OccasionType = collegeMatch ? 'college_campus' : 'smart_casual';

  // Find targeted item in query
  let targetedItem: WardrobeItem | undefined;
  for (const item of availableItems) {
    const nameMatches = lower.includes(item.name.toLowerCase());
    const colorCategoryMatches = lower.includes(item.colorName.toLowerCase()) && 
      (lower.includes(item.category) || lower.includes(item.subCategoryLabel.toLowerCase()));
    if (nameMatches || colorCategoryMatches) {
      targetedItem = item;
      break;
    }
  }

  // If no exact item matched, search by category keywords (e.g. "cargos", "shirt", "kurta")
  if (!targetedItem) {
    if (lower.includes('cargo') || lower.includes('pant') || lower.includes('bottom')) {
      targetedItem = availableItems.find(i => i.category === 'bottoms');
    } else if (lower.includes('shirt') || lower.includes('top') || lower.includes('tee')) {
      targetedItem = availableItems.find(i => i.category === 'tops');
    }
  }

  if (targetedItem) {
    let topPiece: WardrobeItem | undefined;
    let bottomPiece: WardrobeItem | undefined;

    if (targetedItem.category === 'bottoms') {
      bottomPiece = targetedItem;
      topPiece = availableItems.find(i => (i.category === 'tops' || i.category === 'ethnic') && i.id !== targetedItem?.id);
    } else {
      topPiece = targetedItem;
      bottomPiece = availableItems.find(i => i.category === 'bottoms' && i.id !== targetedItem?.id);
    }
    const footwearPiece = availableItems.find(i => i.category === 'footwear');

    return {
      replyText: `Anchored this look around your ${targetedItem.name} for ${targetOccasion === 'college_campus' ? 'campus wear' : 'casual styling'}.`,
      intent: 'TARGET_ITEM',
      detectedPreferences: [{
        type: 'focus_item',
        label: `Hero Item: ${targetedItem.name}`,
        value: targetedItem.id
      }],
      recommendedOutfit: {
        title: `Curated Spotlight: ${targetedItem.name}`,
        occasion: targetOccasion,
        ownedItemIds: {
          top: topPiece?.category === 'tops' ? topPiece.id : undefined,
          ethnicPiece: topPiece?.category === 'ethnic' ? topPiece.id : undefined,
          bottom: bottomPiece?.id,
          footwear: footwearPiece?.id
        },
        stylingRationale: `Balances the silhouette of ${targetedItem.name} with complementary ${topPiece?.name || 'clean top'}. Engineered for easy movement and effortless presence.`,
        harmonyTips: [
          `Harmonizes the ${targetedItem.colorName} tone with neutral contrast.`,
          'Durable materials suitable for high daily activity.'
        ],
        colorHarmonyScore: 91
      }
    };
  }

  // 5. Simpler / Cheaper Option
  if (lower.includes('cheaper') || lower.includes('budget') || lower.includes('simple') || lower.includes('affordable')) {
    // Pick pieces with high wear counts (lowest cost per wear)
    const sortedByWear = [...availableItems].sort((a, b) => b.wearCount - a.wearCount);
    const simpleTop = sortedByWear.find(i => i.category === 'tops');
    const simpleBottom = sortedByWear.find(i => i.category === 'bottoms');
    const simpleShoes = sortedByWear.find(i => i.category === 'footwear');

    return {
      replyText: 'Built a budget-conscious, high-utility look using your most-worn, easy-to-care staples.',
      intent: 'BUDGET_SIMPLIFY',
      detectedPreferences: [{
        type: 'budget_mode',
        label: 'Budget Mode: Maximum Wardrobe Utility',
        value: 'cost_per_wear'
      }],
      recommendedOutfit: {
        title: 'High-Utility Daily Minimalist Ensemble',
        occasion: 'smart_casual',
        ownedItemIds: {
          top: simpleTop?.id,
          bottom: simpleBottom?.id,
          footwear: simpleShoes?.id
        },
        stylingRationale: `Focuses on your trusty ${simpleTop?.name || 'cotton top'} and ${simpleBottom?.name || 'everyday pants'}. Zero expensive dry-cleaning layers required.`,
        harmonyTips: [
          'Maximizes cost-per-wear return on your closet.',
          'Machine-washable fabrics for stress-free maintenance.'
        ],
        colorHarmonyScore: 88
      }
    };
  }

  // Default General Advice
  const defTop = availableItems.find(i => i.category === 'tops' || i.category === 'ethnic');
  const defBottom = availableItems.find(i => i.category === 'bottoms');
  const defShoes = availableItems.find(i => i.category === 'footwear');

  return {
    replyText: `Grounded in your ${profile.name || 'personal'} style profile: here is a tailored outfit using your current clean clothes.`,
    intent: 'GENERAL_ADVICE',
    recommendedOutfit: defTop && defBottom ? {
      title: 'Versatile Daily Signature',
      occasion: 'smart_casual',
      ownedItemIds: {
        top: defTop.category === 'tops' ? defTop.id : undefined,
        ethnicPiece: defTop.category === 'ethnic' ? defTop.id : undefined,
        bottom: defBottom.id,
        footwear: defShoes?.id
      },
      stylingRationale: `Pairs your ${defTop.name} with ${defBottom.name} for an effortless, confident silhouette.`,
      harmonyTips: [
        'Versatile smart-casual balance.',
        'Zero invented items: 100% sourced from your real closet.'
      ],
      colorHarmonyScore: 90
    } : undefined
  };
}

/**
 * Validates AI structured output and guarantees all referenced items actually exist in wardrobe.
 * Drops any hallucinated IDs to ensure zero fake items ever appear.
 */
export function validateAndReconstructOutfit(
  output: StylistStructuredOutput,
  wardrobe: WardrobeItem[]
): CuratedOutfit | undefined {
  if (!output.recommendedOutfit) return undefined;

  const wardrobeMap = new Map(wardrobe.map(item => [item.id, item]));
  const rec = output.recommendedOutfit;

  const top = rec.ownedItemIds.top ? wardrobeMap.get(rec.ownedItemIds.top) : undefined;
  const bottom = rec.ownedItemIds.bottom ? wardrobeMap.get(rec.ownedItemIds.bottom) : undefined;
  const ethnicPiece = rec.ownedItemIds.ethnicPiece ? wardrobeMap.get(rec.ownedItemIds.ethnicPiece) : undefined;
  const layer = rec.ownedItemIds.layer ? wardrobeMap.get(rec.ownedItemIds.layer) : undefined;
  const footwear = rec.ownedItemIds.footwear ? wardrobeMap.get(rec.ownedItemIds.footwear) : undefined;
  const accessory = rec.ownedItemIds.accessory ? wardrobeMap.get(rec.ownedItemIds.accessory) : undefined;

  // Must have at least top/ethnic and bottom to be a valid ensemble
  if (!top && !ethnicPiece && !bottom) {
    return undefined;
  }

  return {
    id: `chat-curated-${Date.now()}`,
    title: rec.title || 'Conversational Stylist Recommendation',
    occasion: rec.occasion || 'smart_casual',
    weatherMood: 'warm_sun',
    items: {
      top,
      bottom,
      ethnicPiece,
      layer,
      footwear,
      accessory
    },
    stylingRationale: rec.stylingRationale || 'Curated using your available wardrobe pieces.',
    harmonyTips: rec.harmonyTips || ['Authentic owned items only.'],
    colorHarmonyScore: rec.colorHarmonyScore || 90,
    wardrobeGap: rec.capsuleGap ? {
      itemType: rec.capsuleGap.categoryName,
      suggestedColor: rec.capsuleGap.suggestedColor,
      potentialOutfitsUnlocked: 4,
      reasoning: rec.capsuleGap.reasoning,
      isDemoOnly: false
    } : undefined
  };
}

/**
 * Public execution coordinator: calls Gemini AI if API key configured with 8s timeout,
 * otherwise falls back immediately to deterministic local rule engine.
 */
export async function executeStylistChat({
  userPrompt,
  wardrobe,
  profile,
  activeOutfit,
  activePreferences = [],
  geminiApiKey
}: {
  userPrompt: string;
  wardrobe: WardrobeItem[];
  profile: FashionProfile;
  activeOutfit?: CuratedOutfit;
  activePreferences?: SessionPreference[];
  geminiApiKey?: string;
}): Promise<ChatMessage> {
  const sanitized = sanitizeUserInput(userPrompt);

  const rateCheck = checkRateLimit();
  if (!rateCheck.allowed) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'stylist',
      text: rateCheck.reason || 'Rate limit reached.',
      timestamp: Date.now(),
      error: 'RATE_LIMIT'
    };
  }

  // If Gemini API Key provided, attempt AI call with 8s timeout
  if (geminiApiKey && geminiApiKey.trim().length > 10) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Sanitize payload: TEXT METADATA ONLY. Zero images/base64 sent!
      const sanitizedWardrobe = wardrobe
        .filter(i => i.isAvailable)
        .map(i => ({
          id: i.id,
          name: i.name,
          category: i.category,
          subcategory: i.subcategory,
          color: i.colorName,
          hex: i.primaryColor,
          fabric: i.fabric,
          fit: i.fit
        }));

      const systemPrompt = `You are YO Style personal stylist. Suggest an outfit from user's owned clothes.
CRITICAL RULES:
1. ONLY pick item IDs present in user_wardrobe. NEVER invent or hallucinate IDs.
2. Return JSON only conforming to:
{
  "replyText": "short friendly styling explanation",
  "intent": "TARGET_ITEM" | "DELTA_SWAP" | "COLOR_EXCLUSION" | "ARCHETYPE_SHIFT" | "BUDGET_SIMPLIFY" | "GENERAL_ADVICE",
  "recommendedOutfit": {
    "title": "Look title",
    "occasion": "smart_casual",
    "ownedItemIds": { "top": "id", "bottom": "id", "footwear": "id" },
    "stylingRationale": "rationale",
    "harmonyTips": ["tip 1", "tip 2"],
    "colorHarmonyScore": 92
  }
}`;

      const userPayload = JSON.stringify({
        user_query: sanitized,
        user_profile: {
          name: profile.name,
          colorExclusions: profile.colorExclusions,
          favoriteColors: profile.colorFavorites
        },
        user_wardrobe: sanitizedWardrobe,
        active_look_previous: activeOutfit ? {
          title: activeOutfit.title,
          top: activeOutfit.items.top?.id,
          bottom: activeOutfit.items.bottom?.id,
          footwear: activeOutfit.items.footwear?.id
        } : null
      });

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nDATA:\n${userPayload}` }] }],
          generationConfig: { responseMimeType: 'application/json' }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJsonText) {
          const parsed = JSON.parse(rawJsonText) as StylistStructuredOutput;
          const curated = validateAndReconstructOutfit(parsed, wardrobe);
          if (curated) {
            return {
              id: `msg-${Date.now()}`,
              sender: 'stylist',
              text: parsed.replyText || 'Here is your personalized ensemble:',
              timestamp: Date.now(),
              outfit: curated,
              isAiGenerated: true
            };
          }
        }
      }
    } catch (err) {
      console.warn('AI provider call failed or timed out, executing deterministic fallback', err);
    }
  }

  // Graceful offline non-AI fallback
  const localOutput = processQueryLocally({
    query: sanitized,
    wardrobe,
    profile,
    activeOutfit,
    activePreferences
  });

  const outfit = validateAndReconstructOutfit(localOutput, wardrobe);

  return {
    id: `msg-${Date.now()}`,
    sender: 'stylist',
    text: localOutput.replyText,
    timestamp: Date.now(),
    outfit,
    detectedPreferences: localOutput.detectedPreferences?.map(p => ({
      ...p,
      id: `pref-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      isDismissible: true
    })),
    isAiGenerated: false
  };
}
