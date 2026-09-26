import React, { useState, useRef } from 'react';
import type { WardrobeItem, OccasionType } from '../../types/fashion';
import type { VerifiedRetailerItem, HybridOutfit, InspirationMatchResult } from '../../types/shopping';
import { 
  searchVerifiedCatalog, 
  generateHybridOutfits, 
  matchInspirationImage 
} from '../../utils/shoppingEngine';
import { RetailerHandoffModal } from './RetailerHandoffModal';
import { 
  Sparkles, 
  Search, 
  Camera, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw,
  Upload
} from 'lucide-react';

interface ShoppingDiscoveryViewProps {
  wardrobe: WardrobeItem[];
  excludedColorHexes: string[];
}

export const ShoppingDiscoveryView: React.FC<ShoppingDiscoveryViewProps> = ({
  wardrobe,
  excludedColorHexes
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'hybrid' | 'catalog' | 'inspiration'>('hybrid');

  // Hybrid Looks State
  const [hybridOccasion, setHybridOccasion] = useState<OccasionType>('smart_casual');
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number | undefined>(undefined);
  const [handoffItem, setHandoffItem] = useState<VerifiedRetailerItem | null>(null);

  // Catalog Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [catalogBudgetMax, setCatalogBudgetMax] = useState<number | undefined>(undefined);

  // Inspiration "Find This Look" State
  const [inspirationImage, setInspirationImage] = useState<string | null>(null);
  const [isAnalyzingInspiration, setIsAnalyzingInspiration] = useState(false);
  const [inspirationResult, setInspirationResult] = useState<InspirationMatchResult | null>(null);
  const inspirationInputRef = useRef<HTMLInputElement>(null);

  // Generate hybrid looks
  const hybridOutfits: HybridOutfit[] = generateHybridOutfits({
    wardrobe,
    occasion: hybridOccasion,
    maxTotalBudgetInr: maxBudgetFilter,
    excludedColorHexes
  });

  // Filtered catalog items
  const catalogItems: VerifiedRetailerItem[] = searchVerifiedCatalog({
    query: searchQuery,
    category: selectedCategory,
    maxPriceInr: catalogBudgetMax,
    inStockOnly: true
  });

  const handleInspirationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setInspirationImage(dataUrl);
      setIsAnalyzingInspiration(true);
      try {
        const result = await matchInspirationImage(dataUrl);
        setInspirationResult(result);
      } catch {
        // ignore
      } finally {
        setIsAnalyzingInspiration(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
          PERMITTED VERIFIED DISCOVERY
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Conscious Shopping
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
          Only buy what completes your closet. Real partner stores, verified ₹ prices, zero synthetic listings.
        </p>
      </div>

      {/* Sub-Tabs */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '6px', 
          marginBottom: '20px',
          background: 'var(--bg-warm-light)',
          padding: '4px',
          border: '1px solid var(--border-hairline)'
        }}
      >
        <button
          onClick={() => setActiveSubTab('hybrid')}
          style={{
            padding: '10px 8px',
            border: activeSubTab === 'hybrid' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeSubTab === 'hybrid' ? '#FFFFFF' : 'transparent',
            fontWeight: activeSubTab === 'hybrid' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)'
          }}
        >
          <Sparkles size={13} />
          <span>Hybrid Looks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('catalog')}
          style={{
            padding: '10px 8px',
            border: activeSubTab === 'catalog' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeSubTab === 'catalog' ? '#FFFFFF' : 'transparent',
            fontWeight: activeSubTab === 'catalog' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)'
          }}
        >
          <Search size={13} />
          <span>Verified Catalog</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inspiration')}
          style={{
            padding: '10px 8px',
            border: activeSubTab === 'inspiration' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeSubTab === 'inspiration' ? '#FFFFFF' : 'transparent',
            fontWeight: activeSubTab === 'inspiration' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)'
          }}
        >
          <Camera size={13} />
          <span>Find This Look</span>
        </button>
      </div>

      {/* SUB-TAB 1: HYBRID LOOKS */}
      {activeSubTab === 'hybrid' && (
        <div>
          {/* Controls Bar */}
          <div className="editorial-card" style={{ padding: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label">Occasion</label>
                <select
                  value={hybridOccasion}
                  onChange={e => setHybridOccasion(e.target.value as OccasionType)}
                  className="form-select"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  <option value="smart_casual">Smart Casual</option>
                  <option value="work_formal">Work Formal</option>
                  <option value="festive_indian">Festive / Heritage</option>
                  <option value="weekend_brunch">Weekend Casual</option>
                </select>
              </div>

              <div>
                <label className="form-label">Max Total Outfit Budget (₹)</label>
                <select
                  value={maxBudgetFilter ?? ''}
                  onChange={e => setMaxBudgetFilter(e.target.value ? Number(e.target.value) : undefined)}
                  className="form-select"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  <option value="">No Budget Limit</option>
                  <option value={2000}>Under ₹2,000</option>
                  <option value={3000}>Under ₹3,000</option>
                  <option value={4000}>Under ₹4,000</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: 'var(--ink-secondary)' }}>
              <ShieldCheck size={13} color="var(--ink-primary)" />
              <span>Owned items in your closet count as ₹0. Budget only applies to the single missing staple.</span>
            </div>
          </div>

          {/* Hybrid Looks Cards */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Curated Hybrid Looks ({hybridOutfits.length})
              </h3>
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
                Max 1 Purchasable Item
              </span>
            </div>

            {hybridOutfits.length === 0 ? (
              <div className="editorial-card" style={{ textAlign: 'center', padding: '30px', color: 'var(--ink-secondary)', fontSize: '13px' }}>
                No hybrid looks available under ₹{maxBudgetFilter?.toLocaleString('en-IN') || 'this budget'}. Try relaxing budget limits.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {hybridOutfits.map(outfit => (
                  <div key={outfit.id} className="editorial-card" style={{ padding: '18px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, background: '#E0F2FE', color: '#0369A1', padding: '1px 6px', borderRadius: '2px', textTransform: 'uppercase' }}>
                            HYBRID ENSEMBLE
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--ink-secondary)', textTransform: 'uppercase' }}>
                            {outfit.occasion.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '17px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                          {outfit.title}
                        </h4>
                      </div>

                      {/* Strict Budget Badge */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--ink-primary)' }}>
                          ₹{outfit.totalBudgetInr.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                          Total New Spend
                        </div>
                      </div>
                    </div>

                    {/* Editorial Rationale */}
                    <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', fontStyle: 'italic', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                      "{outfit.whyThisItem}"
                    </p>

                    {/* Breakdown of slots: Owned vs Purchasable */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                      {/* Owned Items */}
                      {Object.entries(outfit.ownedItems)
                        .filter(([, v]) => !!v)
                        .map(([slot, item]) => (
                          <div 
                            key={slot}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 10px',
                              background: '#F9FAF9',
                              border: '1px solid #E5E7EB'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '9px', fontWeight: 800, background: '#E8F5E9', color: '#2E7D32', padding: '1px 5px', borderRadius: '2px' }}>
                                OWNED (₹0)
                              </span>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item?.primaryColor }} />
                              <span style={{ fontSize: '12px', fontWeight: 700 }}>{item?.name}</span>
                            </div>
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{slot}</span>
                          </div>
                        ))}

                      {/* Purchasable Item */}
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          background: '#EFF6FF',
                          border: '1px solid #BFDBFE'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, background: '#1D4ED8', color: '#FFFFFF', padding: '2px 6px', borderRadius: '2px' }}>
                            PURCHASABLE PIECE
                          </span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E3A8A' }}>
                              {outfit.purchasableItem.item.name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
                              {outfit.purchasableItem.item.brand} • ₹{outfit.purchasableItem.item.priceInr.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn-editorial-black"
                          onClick={() => setHandoffItem(outfit.purchasableItem.item)}
                          style={{ padding: '6px 10px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>View on {outfit.purchasableItem.item.brand}</span>
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>

                    {/* What does it add to wardrobe banner */}
                    <div style={{ background: '#FFFFFF', border: '1px solid var(--border-hairline)', padding: '10px', fontSize: '11px' }}>
                      <strong style={{ textTransform: 'uppercase', color: 'var(--ink-primary)' }}>What this adds to your wardrobe: </strong>
                      <span style={{ color: 'var(--ink-secondary)' }}>{outfit.whatItAddsToWardrobe}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VERIFIED CATALOG SEARCH */}
      {activeSubTab === 'catalog' && (
        <div>
          {/* Search Toolbar */}
          <div className="editorial-card" style={{ padding: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Search catalog (e.g. linen, FabIndia, chinos, Uniqlo)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label">Category Filter</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="form-select"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  <option value="all">All Categories</option>
                  <option value="tops">Western Tops</option>
                  <option value="bottoms">Trousers & Chinos</option>
                  <option value="ethnic">Ethnic / Kurta / Nehru Jacket</option>
                  <option value="footwear">Footwear / Juttis</option>
                </select>
              </div>

              <div>
                <label className="form-label">Budget Filter</label>
                <select
                  value={catalogBudgetMax ?? ''}
                  onChange={e => setCatalogBudgetMax(e.target.value ? Number(e.target.value) : undefined)}
                  className="form-select"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  <option value="">Any Price</option>
                  <option value={2000}>Under ₹2,000</option>
                  <option value={3000}>Under ₹3,000</option>
                  <option value={4000}>Under ₹4,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog Items Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {catalogItems.map(item => (
              <div key={item.id} className="editorial-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{ width: '100%', height: '160px', objectFit: 'cover', marginBottom: '8px' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
                      {item.brand}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 900 }}>
                      ₹{item.priceInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                    Sizes: {item.sizesAvailable.join(', ')} • {item.fabric}
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--ink-secondary)', fontStyle: 'italic', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                    {item.capsuleSynergyNotes}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-editorial-black"
                  onClick={() => setHandoffItem(item)}
                  style={{ width: '100%', padding: '8px', fontSize: '11px', justifyContent: 'center' }}
                >
                  <span>View on {item.brand}</span>
                  <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: "FIND THIS LOOK" INSPIRATION */}
      {activeSubTab === 'inspiration' && (
        <div>
          {/* Upload Area */}
          <div className="editorial-card" style={{ padding: '16px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              Upload Outfit Inspiration Photo
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', margin: '0 0 12px 0' }}>
              Upload any street-style photo, magazine clipping, or moodboard image. We sample the palette and find similar staples in permitted catalogs.
            </p>

            <input 
              ref={inspirationInputRef}
              type="file" 
              accept="image/*"
              onChange={handleInspirationUpload}
              style={{ display: 'none' }}
              id="inspiration-upload-input"
            />

            {inspirationImage ? (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'var(--bg-warm-light)', padding: '10px', border: '1px solid var(--border-hairline)' }}>
                <img src={inspirationImage} alt="Inspiration preview" style={{ width: '64px', height: '80px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Inspiration Image Loaded in Browser Memory</div>
                  <div style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>Zero Cloud Retention • Processed 100% locally</div>
                </div>
                <button
                  type="button"
                  onClick={() => inspirationInputRef.current?.click()}
                  className="btn-editorial-outline"
                  style={{ padding: '6px 10px', fontSize: '11px' }}
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label
                htmlFor="inspiration-upload-input"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px',
                  border: '1px dashed var(--border-strong)',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Upload size={20} color="var(--ink-secondary)" style={{ marginBottom: '6px' }} />
                <span style={{ fontSize: '12px', fontWeight: 800 }}>Select Inspiration Image (JPG/PNG)</span>
                <span style={{ fontSize: '10px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                  Analyzes color dynamics and silhouettes locally without storing photos
                </span>
              </label>
            )}
          </div>

          {/* Loading spinner */}
          {isAnalyzingInspiration && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <RefreshCw size={18} className="spin-animation" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Matching inspiration tones with verified catalog...</div>
            </div>
          )}

          {/* Match Results */}
          {inspirationResult && (
            <div>
              <div className="editorial-card" style={{ padding: '14px', marginBottom: '14px', background: '#F8FAFC' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)', marginBottom: '4px' }}>
                  Detected Style Aesthetic
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                  {inspirationResult.detectedArchetype}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {inspirationResult.detectedColors.map((col, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '10px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border-hairline)',
                        padding: '2px 8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.hex }} />
                      {col.name}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '10px', color: 'var(--ink-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--border-hairline)', paddingTop: '6px' }}>
                  {inspirationResult.approximateDisclaimer}
                </div>
              </div>

              {/* Matched catalog pieces */}
              <h4 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                Permitted Catalog Matches Sharing This Aesthetic ({inspirationResult.matchedItems.length})
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {inspirationResult.matchedItems.map(item => (
                  <div key={item.id} className="editorial-card" style={{ padding: '12px' }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', marginBottom: '8px' }} />
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
                      {item.brand} • ₹{item.priceInr.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, margin: '2px 0 8px 0' }}>
                      {item.name}
                    </div>
                    <button
                      type="button"
                      className="btn-editorial-black"
                      onClick={() => setHandoffItem(item)}
                      style={{ width: '100%', padding: '6px', fontSize: '10px', justifyContent: 'center' }}
                    >
                      <span>View on {item.brand}</span>
                      <ExternalLink size={10} style={{ marginLeft: '4px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Retailer Exit Gateway Modal */}
      <RetailerHandoffModal
        item={handoffItem}
        onClose={() => setHandoffItem(null)}
      />
    </div>
  );
};
