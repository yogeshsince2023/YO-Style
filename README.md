# YO Style — AI-Powered Personal Fashion Intelligence Platform
**Atelier Edition** • *Mobile-First Digital Wardrobe, Stylist, and Fashion Intelligence*

---

## Overview

YO Style is built around a private, owned-clothes-first philosophy. Instead of acting as an aggressive retail storefront pushing fast fashion, it acts as an intelligent personal stylist and organizer to help answer:
1. **What should I wear today?**
2. **What matches my personal aesthetic, fit, and palette?**
3. **Can I create a fresh outfit from clothes I already own?**
4. **Is a proposed purchase actually useful for unlocking new looks with my wardrobe?**

Supports Western, Indian ethnic (Kurtas, Nehru jackets, Sarees, Dupattas), and Indo-Western fusion wear seamlessly.

---

## Phase 1 Deliverables Summary

- **Design System**: "Atelier Monochrome & Ochre" fashion-editorial direction. High-contrast serif headlines (`Playfair Display`), warm humanist sans (`Plus Jakarta Sans`), warm paper/ecru canvas (`#F9F7F2`), terracotta ochre accents (`#C26D38`), and deep Malabar indigo tones.
- **Mobile-First UX**: Strict touch target compliance (>= 44px), zero-overflow 360px budget Android support, responsive desktop editorial container.
- **Private Digital Closet**: Full CRUD for owned garments across categories (Tops, Bottoms, Indian Ethnic, Layering, Footwear, Accessories), fabric tracking, fit silhouettes, and wear counters.
- **Deterministic AI Styling Engine**: Explainable color-harmony scoring, weather sensitivity, occasion context (College, Work, Festive, Wedding Sangeet, Dates), and interactive in-place piece swapping.
- **Saved Lookbook**: Keep outfit combinations with wear logs and personal notes.
- **Data Sovereignty & Privacy**: 100% client-side local browser persistence (LocalStorage / IndexedDB). One-click JSON backup export and instant total data wipe. Zero cloud tracking or photo egress.
- **Illustrative Wardrobe Gap**: Clearly labeled demonstration cards showing how adding a missing staple unlocks multiple combinations with existing wardrobe items.

---

## Local Setup & Development (₹0 Stack)

### Requirements
- Node.js 18+ (tested on Node 20+)
- npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser (or mobile device on local Wi-Fi)
http://localhost:5173
```

### Build & Verification Commands
```bash
# Type check & production build (Vite + TypeScript)
npm run build

# Run fast linter (Oxlint)
npm run lint

# Preview production bundle locally
npm run preview
```

---

## Zero-Cost & Privacy Guarantees

| Concern | Guarantee |
| :--- | :--- |
| **Costs** | ₹0 initial and operational budget. Uses pure client-side web technologies and open-source packages. |
| **User Photos & Privacy**| No photos or wardrobe profiles leave your browser. Stored purely on-device in client storage. |
| **Commerce Transparency**| Zero fake affiliate partnerships, zero scraped copyrighted images, and zero hallucinated pricing. |
