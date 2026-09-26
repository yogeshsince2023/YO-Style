# Phase 1 Design Document: Product Definition, Mobile UX, & Technical Foundation
**Project**: AI-Powered Personal Fashion Intelligence Platform (Working Name: **YO Style**)  
**Status**: Pending Architecture & UX Review  
**Author**: Lead Product Architect & Full-Stack Engineer  

---

## 1. Initial Target User & Problem Statement

### 1.1 The Target User
- **Persona**: *Aarav & Priya*, 21–28 years old (tier-1 & tier-2 urban India: Bengaluru, Mumbai, Delhi-NCR, Pune, Hyderabad).
- **Profile**: Working young professional or college student balancing a hybrid lifestyle (office days, casual Fridays, festive celebrations, weekend cafe catchups, weddings, family dinners).
- **Wardrobe Context**: Owns a mixed wardrobe of Western staples (tees, denim, blazers, trousers), Indian traditional pieces (kurtas, ethnic jackets, dupattas, sarees), and fusion items. 
- **Core Frustration**: 
  - *"Wardrobe paralysis"*: "A closet full of clothes, but nothing to wear."
  - People default to buying new fast-fashion pieces for each event because they cannot visualize combinations from items already tucked away in drawers.
  - Existing fashion apps are purely storefronts trying to sell clothes, while generic AI tools give disconnected, non-actionable text answers with zero inventory awareness.

### 1.2 The Specific Problem Solved in First Release
Phase 1 solves the **"Daily Dressing Paralysis & Wardrobe Discovery"** bottleneck:
Enables the user to catalog their existing wardrobe easily, set their personal style and fit preferences, and request tailored Western, Indian, or Indo-Western outfit combinations from clothes they **already own**, with transparent styling logic, item swapping, and saved outfit lookbooks—without pushing unsolicited purchases.

---

## 2. Complete Vision vs. First Usable Product (Phase 1)

| Dimension | Complete Long-Term Vision | First Usable Product (Phase 1) |
| :--- | :--- | :--- |
| **Wardrobe Ingestion** | Computer-vision automated item tagging, auto-background removal, receipt sync | Quick structured manual entry with smart presets (category, subcategory, color palette, fabric, fit, tags) and optional clean photo upload. |
| **Styling Engine** | Multi-modal conversational agent, real-time weather & calendar integration, dynamic event stylist | Deterministic styling algorithm & rule-validated outfit builder matching occasion, weather mood, style preference, and color coordination across owned items. |
| **Fashion Scope** | Western, Indian Ethnic, Indo-Western Fusion, Accessories, Footwear | Western, Indian Ethnic, Indo-Western Fusion, Footwear & Key Accessories fully supported in taxonomy. |
| **Shopping & Commerce**| Multi-retailer unified cart, wardrobe-gap purchase advice with cost-per-wear trade-off analysis | Strictly owned-items first. Optional purchase recommendation slot exists as an architectural placeholder with clearly labeled demo/gap data; zero affiliate spam. |
| **Appearance & Fit** | Non-invasive optical size recommendation, personal color season analysis | 100% voluntary, strictly editable self-reported preferences (preferred fits, undertone vibe, heights/sizes). Zero biometric claims. |
| **Client Target** | Web + iOS & Android Native Apps (React Native / Flutter) | Responsive Mobile-First PWA-ready Web App, touch-optimized for 360px–430px screens, responsive on desktop. |

---

## 3. Primary Mobile User Journeys

### 3.1 First Visit & Onboarding
1. User lands on a clean, editorial splash screen highlighting the core premise: *"Your wardrobe, reimagined. Zero wardrobe paralysis."*
2. Option to explore immediate interactive demo wardrobe or start private session.
3. Explicit privacy promise banner: *"Your wardrobe is private. Zero ads. No forced photos."*

### 3.2 Create & Edit Fashion Profile
1. Multi-step quick setup (under 90 seconds):
   - **Occasions & Lifestyle**: College, Corporate, Creative Work, Weekend, Festivals, Weddings, Night Out.
   - **Style Vibes**: Minimalist, Classic, Streetwear, Ethnic Heritage, Indo-Western Fusion, Casual Chic.
   - **Fit & Comfort Preferences**: Relaxed, Slim, Oversized, Tailored, Modest.
   - **Color Comfort Zone**: Preferred neutrals, vibrant accents, colors to avoid (exclusion list).
   - **Optional Physical/Vibe Attributes**: Height, preferred clothing sizes (S/M/L/custom), optional self-selected undertone preference (Warm, Cool, Neutral). *Strictly marked optional & editable.*
2. Confirmation state with immediate visual style DNA chip summary.

### 3.3 Add a Wardrobe Item
1. Floating quick-action or header "+ Add Piece".
2. Minimalist input drawer / modal:
   - Category picker: Tops, Bottoms, One-Piece / Dresses, Indian Ethnic (Kurtas, Sarees, Lehengas, Nehru Jackets), Layering / Jackets, Footwear, Accessories.
   - Subcategory & Silhouette (e.g., Mandarin Collar Short Kurta, Wide-Leg Chinos).
   - Primary & Accent Colors (swatch picker with named Indian & international tones: Indigo, Ochre, Sage, Charcoal, Ivory, Terracotta).
   - Fabric/Seasonality (Cotton, Linen, Silk, Wool, Blend; Summer, Festive, All-Season).
   - Optional photo upload (local browser preview, kept in indexed storage).
3. Saved item renders immediately in digital wardrobe grid with category filter tags.

### 3.4 Request an Outfit
1. Bottom navigation bar tap: **"Style Me"**.
2. Select context in 3 quick taps:
   - **Occasion**: e.g., "Indo-Western Wedding Sangeet" or "Client Presentation".
   - **Weather / Vibe**: e.g., "Warm Afternoon" or "Air-Conditioned Evening".
   - **Mood**: e.g., "Understated Sharp" or "Bold & Festive".
3. Tap **"Curate Outfit"**.
4. Screen displays 2-3 curated outfit proposals assembled strictly from user's owned inventory with an editorial rationale ("Why this works together").

### 3.5 Review, Swap & Customize Outfit
1. In the outfit card, each component (e.g., Top, Bottom, Footwear, Layer) has a **"Swap"** affordance.
2. Tapping "Swap" opens alternative compatible owned items from the wardrobe.
3. User can hit "Reject Color" or "Exclude Piece" to adjust future combinations.

### 3.6 Save Outfit & Log to Lookbook
1. Tap **"Save to Lookbook"** or **"Wear Today"**.
2. Add optional note (e.g., "Wore for Diwali party 2026").
3. Outfit is preserved in the "Lookbook / Saved Outfits" tab with date and occasion metadata.

---

## 4. Complete Sitemap & Screen Inventory (Phase 1)

```
YO Style (App Root)
├── / (Home / Editorial Feed)
│   ├── Quick "Outfit of the Day" prompt
│   ├── Wardrobe summary (count by category)
│   └── Recent lookbook saves
├── /wardrobe (Digital Wardrobe)
│   ├── Filter pills (All, Tops, Bottoms, Ethnic, Outerwear, Footwear, Accessories)
│   ├── Item card grid (with color swatches & seasonal badges)
│   ├── Item Detail Drawer (inspect, edit, delete, mark laundry/inactive)
│   └── /wardrobe/add (Add Piece Drawer / Form)
├── /stylist (Style Me / Outfit Generator)
│   ├── Context selector (Occasion, Weather/Time, Style Intent)
│   ├── Curated Outfit Result Cards
│   │   ├── Layer breakdown (Top + Bottom + Layer + Shoes + Accessory)
│   │   ├── Editorial "Why this works" explanation
│   │   ├── Interactive "Swap Piece" drawer
│   │   └── Optional "Wardrobe Gap" educational card (clearly marked demo)
│   └── Action bar: Save to Lookbook / Try Another Vibe
├── /lookbook (Saved Outfits & History)
│   ├── Saved outfits list with occasion filters
│   └── Outfit detail view (items, worn dates, notes)
└── /profile (Fashion Profile & Settings)
    ├── Style DNA chips (editable)
    ├── Sizing & Fit preferences
    ├── Color palette inclusions & exclusions
    ├── Privacy & Local Data Management (Export JSON, Reset Demo, Wipe Data)
    └── About & Transparency statement
```

---

## 5. Visual Directions (Anti-Generic SaaS / Fashion-Editorial)

We reject standard AI templates: no saturated purple-blue mesh gradients, no giant glowing neon borders, no bubbly glassmorphic tech-demo cards.

### Direction A: "Atelier Monochrome & Ochre" (Editorial High-Fashion Magazine)
- **Concept**: Evokes contemporary editorial publications like *Kinfolk* or *The Gentlewoman*, crossed with modern Indian design houses (Raw Mango, Nicobar).
- **Typography**: 
  - Headlines: High-contrast modern serif (`Playfair Display` or `DM Serif Display`).
  - Body/UI: Warm humanist geometric sans (`Plus Jakarta Sans` or `Outfit`).
- **Color System**:
  - Background: Muted warm paper (`#F9F7F2` in light mode, `#161513` in rich noir mode).
  - Surface: Warm ecru / tinted linen (`#F1EEE7` / `#211F1C`).
  - Ink: Deep espresso charcoal (`#1C1A18` / `#F0ECE4`).
  - Accent: Raw Ochre / Terracotta (`#C26D38` / `#D4844D`) and Deep Malabar Indigo (`#264653`).
- **Spacing & Layout**: Generous whitespace, razor-thin borders (`1px solid rgba(28,26,24,0.08)`), asymmetric typography scales, elegant compact pill badges.
- **Photography & Visuals**: Clean cutout product framing with warm natural shadows, matte framing, authentic textures.
- **Mobile Experience (360px)**: Extremely legible serif headlines scaled down to 24px, thumb-friendly 48px tap targets, zero horizontal overflow, bottom sticky action navigation.

### Direction B: "Modern Archival Studio" (Minimalist Brutalist Gallery)
- **Concept**: Inspired by architectural archives, minimalist Scandinavian & Japanese apparel curation (Issey Miyake, Studio Nicholson).
- **Typography**:
  - Pure mono/grotesque balance: `Space Grotesk` or `Syne` for titles, `Inter` or `Geist` for micro-labels and UI metadata.
- **Color System**:
  - Stark slate & pure contrasts: Canvas ivory (`#F5F5F7`), Crisp Obsidian (`#0F0F10`), Cool Stone (`#737373`), Accent Cobalt or Acid Lime (`#1040E0` or `#C6F135` used sparingly as a single indicator dot).
- **Spacing & Layout**: Sharp grid lines, visible thin box dividers, tabular information layout, zero blur/shadows (pure flat geometric hierarchy).
- **Mobile Experience (360px)**: High information density, ultra-crisp tabular metadata cards, clean borders.

### Direction C: "Indian Heritage Modernist" (Subtle Luxury & Earth Tones)
- **Concept**: Contemporary Indian luxury fashion celebrating natural fabrics, Khadi textures, brass accents, and botanical earth tones.
- **Typography**:
  - Display: `Cinzel` or `Cormorant Garamond` paired with sleek `Cabinet Grotesk` / `Outfit`.
- **Color System**:
  - Sandstone cream (`#F8F5EE`), Forest Sage (`#2D4A3E`), Antique Brass (`#B89047`), Washed Indigo (`#2E3D4D`), Deep Charcoal (`#1B1C1A`).
- **Spacing & Layout**: Soft rounded corners (`8px–12px`), rich muted badges, warm textured cards.
- **Mobile Experience (360px)**: Gentle on the eyes, luxurious tactile feel, high contrast for outdoor sunlight readability.

> **Architect Recommendation**: **Direction A ("Atelier Monochrome & Ochre")**. It strikes the ideal balance between high-end editorial fashion credibility, timeless warmth, accessibility, and high contrast on low-brightness budget mobile displays, completely shedding the "generic AI tool" look.

---

## 6. ₹0 Development & Deployment Stack (Verified Tiers & Terms)

| Layer | Technology | Free Tier Limits & Terms (Verified) | Privacy & Cost Caveats |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Vite + React + TypeScript** | Open-source MIT. Runs locally and builds static bundle. | ₹0 forever. No telemetry or hidden lock-in. |
| **Styling** | **Vanilla CSS Modules / Scoped Modern CSS** with design token variables | Pure native CSS3 custom properties & container queries. | Zero runtime cost, zero bundle weight, instantaneous rendering on low-end phones. |
| **State & Local Storage** | **Zustand + IndexedDB (idb-keyval) / LocalStorage** | Browser-native client-side persistence. | 100% private to user's device. ₹0 server cost. No personal data transmitted across the wire in Phase 1. |
| **Icons & Assets** | **Lucide-React** (tree-shaken) + SVG icons | Open source permissive MIT. | Zero image API costs, lightweight SVG rendering. |
| **Hosting & Deployment** | **Vercel / Cloudflare Pages / GitHub Pages** | Cloudflare Pages: Unlimited bandwidth, 500 builds/mo. Vercel Hobby: 100GB bandwidth/mo, personal use. | No payment method required on Cloudflare Pages or GitHub Pages. Zero surprise charges. |
| **Future AI Layer (Phase 2 preview)** | Free-tier Google Gemini 1.5 Flash (free tier 15 RPM / 1M TPM) | Requires API key; in Phase 1, we use zero external APIs. | Completely isolated. Zero risk of unexpected billing. |

---

## 7. Data Models & Component Boundaries (App-Ready Architecture)

The system is architected as clean Domain Models and Interfaces in TypeScript so that switching the persistence layer to SQLite/Room/CoreData or a backend database for native mobile requires zero business logic changes.

### 7.1 Core Entities (`types/fashion.ts`)

```typescript
export type FashionCategory = 
  | 'top' 
  | 'bottom' 
  | 'one_piece' 
  | 'ethnic' 
  | 'outerwear' 
  | 'footwear' 
  | 'accessory';

export type Subcategory = 
  | 't_shirt' | 'button_down' | 'short_kurta' | 'long_kurta' 
  | 'chinos' | 'jeans' | 'trousers' | 'dhoti_pants' | 'pyjama'
  | 'nehru_jacket' | 'blazer' | 'denim_jacket' | 'bomber'
  | 'sneakers' | 'loafers' | 'oxfords' | 'kolhapuri' | 'juttis' | 'sandals'
  | 'watch' | 'belt' | 'dupatta' | 'stole';

export type OccasionType = 
  | 'college' | 'work_formal' | 'work_casual' | 'date_night' 
  | 'party' | 'festive_indian' | 'wedding' | 'travel' | 'casual';

export type WeatherVibe = 'hot_sunny' | 'humid' | 'mild' | 'chilly' | 'ac_indoor';

export interface WardrobeItem {
  id: string;
  name: string;
  category: FashionCategory;
  subcategory: Subcategory;
  primaryColor: string; // Hex or token
  secondaryColor?: string;
  fabric: string; // Cotton, Silk, Linen, Denim, etc.
  fit: 'slim' | 'regular' | 'relaxed' | 'oversized' | 'tailored';
  occasions: OccasionType[];
  seasons: ('summer' | 'monsoon' | 'winter' | 'all_season')[];
  imageUrl?: string; // Optional local object URL / base64
  isAvailable: boolean; // false if in wash or archived
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FashionProfile {
  name: string;
  lifestyleOccasions: OccasionType[];
  aestheticVibes: string[];
  preferredFits: ('slim' | 'regular' | 'relaxed' | 'oversized')[];
  colorComfort: {
    favorites: string[];
    excluded: string[]; // Avoided colors
  };
  physicalAttributes?: {
    heightCm?: number;
    topSize?: string;
    bottomSize?: string;
    shoeSizeUk?: string;
    undertoneVibe?: 'warm' | 'cool' | 'neutral' | 'unspecified';
  };
  budgetConscious: boolean;
  currency: 'INR' | 'USD';
}

export interface CuratedOutfit {
  id: string;
  title: string;
  occasion: OccasionType;
  items: {
    top?: WardrobeItem;
    bottom?: WardrobeItem;
    ethnicTop?: WardrobeItem;
    ethnicBottom?: WardrobeItem;
    layer?: WardrobeItem;
    footwear?: WardrobeItem;
    accessory?: WardrobeItem;
  };
  stylingRationale: string;
  colorHarmonyScore: number;
  optionalGapAdvice?: {
    itemType: string;
    suggestionNote: string;
    demoOnly: true;
  };
  isSaved: boolean;
  createdAt: number;
}
```

### 7.2 Component Hierarchy
- `src/components/common/`
  - `Header.tsx` (Mobile brand bar with quick status)
  - `BottomNav.tsx` (Fixed thumb navigation: Wardrobe, Style, Lookbook, Profile)
  - `Button.tsx`, `Badge.tsx`, `ModalDrawer.tsx`, `EmptyState.tsx`, `Skeleton.tsx`
- `src/components/wardrobe/`
  - `WardrobeGrid.tsx`, `WardrobeCard.tsx`, `AddItemDrawer.tsx`, `WardrobeFilters.tsx`
- `src/components/stylist/`
  - `OutfitGenerator.tsx`, `OutfitCard.tsx`, `ItemSwapDrawer.tsx`, `OccasionSelector.tsx`
- `src/components/profile/`
  - `ProfileEditor.tsx`, `StyleDNASummary.tsx`, `DataPrivacyManager.tsx`

---

## 8. Performance, Security, Accessibility & Testing Requirements

- **Performance**:
  - Target Mobile Lighthouse Score: >95.
  - Zero heavy 3rd-party tracking scripts.
  - Initial JS bundle < 150KB gzipped.
  - Instant page transitions with zero cumulative layout shift (CLS < 0.05).
- **Security & Privacy**:
  - All profile and wardrobe data stays in local browser client storage (IndexedDB / LocalStorage).
  - No network egress of personal wardrobe photos.
  - Content Security Policy (CSP) headers ready.
  - One-tap "Export Data" and "Wipe All Data" compliance controls.
- **Accessibility**:
  - High WCAG AA contrast ratio (minimum 4.5:1 for body text, 3:1 for large display text).
  - Strict minimum 44px x 44px tap targets for mobile usability.
  - Semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<button>`).
  - Full keyboard accessibility and visible focus rings.
- **Screen Verification**:
  - Small Phone: 360px x 640px (common budget Android, e.g., Moto G, Samsung A series).
  - Standard/Large Phone: 390px x 844px / 412px x 915px (iPhone 14/15, Pixel, Galaxy S).
  - Desktop / Tablet: 1024px+ responsive layout.

---

## 9. Phase 1 Boundaries: Real vs. Mocked vs. Deferred

| Feature Area | What is REAL in Phase 1 | What is MOCKED in Phase 1 | What DOES NOT EXIST in Phase 1 |
| :--- | :--- | :--- | :--- |
| **Wardrobe Management** | REAL CRUD operations, real categorization (Western + Indian + Indo-Western), custom tags, local image preview, local persistence. | None. | Cloud multi-device database sync. |
| **Styling & Outfit Curation** | REAL client-side algorithmic styling engine matching actual owned items by color theory, occasion tags, and weather. | "AI Stylist" conversational chat is simulated via curated editorial rationales. | Live external LLM calls requiring paid keys or server infrastructure. |
| **Shopping & Commerce** | Clear educational "Wardrobe Gap" concept card showing how an accessory or layer would unlock 4+ more outfits. | Sample curated gap recommendations (explicitly labeled: *"DEMO: Illustrative Wardrobe Gap"*). | Live scraping, live affiliate links, dynamic pricing or inventory tracking. |
| **User Profile & Privacy** | REAL editable preferences, real color exclusion list, real data export (JSON) and total wipe. | None. | External biometric or optical body scanning. |

---

## 10. Caveman-Discover Observation
Per `/caveman-discover` guidelines, since this repository is currently empty and Phase 1 uses zero server-side LLM calls, there are currently **0 LLM workflows** in the repository. As soon as server-side LLM endpoints (e.g. `curate-outfit`, `diagnose-wardrobe-gap`) are introduced in future phases, they will be registered and tagged accordingly with `x-cave-workflow` headers.
