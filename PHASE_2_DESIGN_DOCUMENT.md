# Phase 2 Design Document: Private Accounts, Authentication & Editable Fashion Profiles
**Project**: YO Style — *Know your style. Wear it better.*  
**Author**: Lead Product Architect, Security Reviewer & Full-Stack Engineer  
**Status**: Pending Approval (Do not code until explicitly approved)

---

## 1. Scope & Objective

Phase 2 builds secure account creation/login, strict per-user data isolation, and a comprehensive yet lightweight, skippable **Fashion Profile Onboarding & Editing** system for **YO Style**.

### Core Tenets of Phase 2
1. **Visitor Freedom**: Visitors can browse the editorial feed, explore sample wardrobe pieces, and preview stylist concepts **without** being forced to create an account.
2. **Short, Skippable Onboarding**: A 3-step, mobile-optimized onboarding wizard where every non-essential step has a clean "Skip for now" affordance.
3. **Data Minimization & Respect**:
   - Zero required gender, weight, selfie, or body photos.
   - Zero automated computer-vision face or body measurement inferences.
   - Clear editorial disclaimer: *All appearance preferences are subjective self-expression tools, not biological rules determining what you can or cannot wear.*
4. **Transparent Purpose**: Every sensitive field features an explicit inline "Why we ask this" explanation.
5. **Per-User Isolation**: User sessions, wardrobes, lookbooks, and profiles are keyed to a unique secure user identifier (`userId`) with strict boundary checks preventing cross-account leakage.

---

## 2. User Journeys & Screen Flows

### 2.1 Visitor Experience (Zero Login Wall)
1. Visitor lands on the high-fashion editorial homepage.
2. Can click "Explore Closet" or "Style Me Now" in **Guest Mode**.
3. A non-intrusive top banner invites the user: *"Browsing as Guest. Create a private account to save your closet across sessions."*
4. All guest interactions run in isolated ephemeral storage.

### 2.2 Account Creation & Login (Mobile-First)
1. User taps "Sign In" or "Create Profile" from the masthead or bottom nav.
2. High-fashion modal drawer appears:
   - **Tab A: Create Account** (Email + Secure Password, or Quick Demo Account Switcher).
   - **Tab B: Login**.
   - Input validations: RFC 5322 email validation, minimum 8-character password with strength meter.
3. Account Switcher (for testing & multi-user device testing): allows switching between *Priya (Demo User 1)*, *Aarav (Demo User 2)*, and a *Fresh Clean Account* to verify complete data isolation on the spot.

### 2.3 Short 3-Step Skippable Onboarding
- **Step 1: Identity & Style Vibe** (30 seconds)
  - Preferred Name or Nickname (*Required for personalized curation*).
  - Primary Style Aesthetics (Multi-select chips: *Minimalist Tailored, Indian Heritage, Streetwear, Indo-Western Fusion, Casual Chic*).
  - *Affordance*: Next or "Skip to closet".
- **Step 2: Color Palette & Fits** (30 seconds)
  - Color Loves (Select 2–4 swatches from rich Indian & Western palettes).
  - Colors to Avoid / Dislikes (Add colors you never want curated).
  - Preferred Silhouettes & Fits (*Relaxed, Tailored, Oversized, Slim*).
  - *Affordance*: Next or "Skip to budget".
- **Step 3: Wardrobe Budgets & Optional Context** (30 seconds)
  - Typical Per-Item Budget in ₹ (Sliders: Footwear, Tops, Ethnic, Outerwear).
  - Typical Per-Outfit Budget in ₹.
  - *Strictly Optional & Editable Appearance/Sizing Fields*:
    - Top Size, Bottom Size, Footwear (UK).
    - Approximate City / Climate (e.g. *Bengaluru - Mild/Breezy, Mumbai - Humid, Delhi - Seasonal*).
    - Optional self-selected undertone vibe (*Warm, Cool, Neutral, Olive*).
  - Explanatory footnote: *"These are your personal styling preferences. You can edit, hide, or clear them anytime."*

### 2.4 Profile Management & Data Erasure
1. **Style DNA Dashboard**: User views their active profile cards (Aesthetic tags, Favorite Colors, Disliked Colors, Fit rules, Budgets).
2. **Inline Edit Drawer**: Every attribute can be modified in real time.
3. **Data Sovereignty Actions**:
   - `Export My Data (JSON)`: Instant download of all profile attributes, wardrobe pieces, and lookbooks.
   - `Clear Appearance Information`: Wipes height, sizes, and undertones in one tap.
   - `Delete My Account & All Data`: Wipes credentials, isolated wardrobe records, and lookbook entries completely.

---

## 3. Architecture & Data Isolation Model

```
                    ┌──────────────────────────────────────────────┐
                    │               Auth Context                   │
                    │   currentUser: { id, email, name, role }     │
                    └──────────────────────┬───────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
          ┌───────────────────────────┐         ┌───────────────────────────┐
          │  User A Isolated Sandbox  │         │  User B Isolated Sandbox  │
          │  yo_style_profile_userA   │         │  yo_style_profile_userB   │
          │  yo_style_wardrobe_userA  │         │  yo_style_wardrobe_userB  │
          │  yo_style_lookbook_userA  │         │  yo_style_lookbook_userB  │
          └───────────────────────────┘         └───────────────────────────┘
```

### 3.1 Session & Storage Keys
- `yo_style_auth_session`: Stores current active session token and user ID.
- `yo_style_users_db`: Registry of registered users (passwords salted/hashed via Web Crypto API SHA-256 for local browser storage).
- `yo_style_data_${userId}`: Scoped storage container holding:
  - `profile`: FashionProfile object.
  - `wardrobe`: WardrobeItem[] array.
  - `lookbook`: LookbookEntry[] array.
  - `auditLog`: Client timestamp of account actions.

### 3.2 Security Validation Rules
- **No Cross-User Access**: Application store throws an error if an operation is attempted with an ID mismatch.
- **No Console Credential Egress**: Passwords are never stored in plain text or logged to browser console.
- **Guest Isolation**: Guest session data uses an ephemeral `guest_temp` ID that is explicitly cleared upon login or window close unless user clicks "Migrate my guest closet into new account".

---

## 4. Plain-Language Privacy-Data Inventory

| Field | Sensitivity | Why We Ask This | Required? | Who Sees It | Deletion Control |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Email & Password** | High | To authenticate and safeguard your private wardrobe | Required for account | Only your device session | Full Account Delete |
| **Preferred Name** | Low | To address you in daily styling curations | Optional (defaults to Guest) | You only | Editable anytime |
| **Style Dislikes & Excluded Colors** | Low | To filter out items/tones you dislike from outfit suggestions | Optional | You only | Editable anytime |
| **Budgets (₹ per item / outfit)** | Medium | To evaluate whether proposed pieces make financial sense | Optional | You only | Editable anytime |
| **Approximate Location / City** | Medium | To factor in local humidity, summer heat, or winter layering | Optional | You only | Instant One-Tap Clear |
| **Sizes (Top, Bottom, Shoes)** | Medium | For future size guidance without requiring photos | Optional | You only | Instant One-Tap Clear |
| **Undertone Vibe** | Low | User-defined color preference (Warm/Cool/Neutral) | Optional | You only | Instant One-Tap Clear |
| **Body Photos / Measurements** | Extreme | NOT COLLECTED | **NEVER** | N/A | N/A |

---

## 5. Free-Tier Limitations & ₹0 Cost Verification
- **Auth Layer**: Client-side cryptographic authentication using native Web Crypto API (`SubtleCrypto` SHA-256 PBKDF2). ₹0 cost, zero 3rd-party SaaS lock-in, zero privacy egress.
- Ready to swap with Supabase Auth or Firebase Auth (free tier 50,000 MAU) in future cloud deployment with identical interface contracts.

---

## 6. Acceptance & Testing Criteria

1. **Visitor Browsing**: Visitor can browse homepage, closet, and styling engine with zero blocking popups.
2. **Registration & Auth**:
   - Validation rejects invalid email and weak passwords (<8 chars).
   - Sign up automatically launches short 3-step onboarding.
3. **Skippable Onboarding**:
   - Each step can be saved or skipped.
   - Completing onboarding takes <60 seconds.
4. **Data Isolation & Account Switching**:
   - Logging in as User A shows User A's wardrobe and profile.
   - Logging out and logging in as User B shows User B's wardrobe with 0% overlap.
   - Direct localStorage tampering of another user's key triggers session invalidation.
5. **Privacy Controls**:
   - "Clear Optional Appearance Info" button resets sizes and city without deleting closet items.
   - "Download JSON" exports full transparent personal data package.
   - "Delete Account" clears all records associated with that user ID.

---

### Request for Approval
Please approve this Phase 2 design document so I can proceed with implementation.
