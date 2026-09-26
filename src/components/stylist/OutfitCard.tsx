import React, { useState } from 'react';
import type { WardrobeItem, CuratedOutfit } from '../../types/fashion';
import { Bookmark, RefreshCw, ArrowRight, ThumbsDown, AlertCircle, X, EyeOff, User } from 'lucide-react';

interface OutfitCardProps {
  outfit: CuratedOutfit;
  wardrobe: WardrobeItem[];
  onSaveOutfit: (outfit: CuratedOutfit) => void;
  isSaved: boolean;
  onSwapPiece: (outfitId: string, slot: keyof CuratedOutfit['items'], newItem: WardrobeItem) => void;
  onRemoveSlot: (outfitId: string, slot: keyof CuratedOutfit['items']) => void;
  onDislikeOutfit: (outfitId: string) => void;
  onTryOn?: (outfit: CuratedOutfit) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  wardrobe,
  onSaveOutfit,
  isSaved,
  onSwapPiece,
  onRemoveSlot,
  onDislikeOutfit,
  onTryOn
}) => {
  const [swappingSlot, setSwappingSlot] = useState<keyof CuratedOutfit['items'] | null>(null);

  type SlotKey = keyof CuratedOutfit['items'];

  const candidateSlots: { key: SlotKey; label: string; item?: WardrobeItem }[] = [
    { key: 'top', label: 'Top', item: outfit.items.top || outfit.items.ethnicPiece },
    { key: 'bottom', label: 'Bottom', item: outfit.items.bottom },
    { key: 'layer', label: 'Layer / Vest', item: outfit.items.layer },
    { key: 'footwear', label: 'Shoes', item: outfit.items.footwear },
    { key: 'accessory', label: 'Accents', item: outfit.items.accessory }
  ];

  const outfitSlots = candidateSlots.filter(s => s.item !== undefined);

  // If user disliked this outfit
  if (outfit.isDisliked) {
    return (
      <div className="editorial-card" style={{ padding: '14px', marginBottom: '16px', background: '#F8F8F8', opacity: 0.7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
          <EyeOff size={15} />
          <span>You disliked this combination. It will not be suggested again.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="editorial-card" style={{ marginBottom: '20px', padding: '18px', border: outfit.isIncomplete ? '1px dashed #B23A2B' : '1px solid var(--border-hairline)' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span 
              className="pill-badge" 
              style={{ 
                background: outfit.isIncomplete ? '#FFECEB' : 'var(--bg-dark)', 
                color: outfit.isIncomplete ? '#B23A2B' : '#FFFFFF', 
                fontWeight: 800,
                fontSize: '10px' 
              }}
            >
              {outfit.isIncomplete ? 'WARDROBE GAP DETECTED' : `HARMONY ${outfit.colorHarmonyScore}%`}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              {outfit.occasion.replace('_', ' ')}
            </span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--ink-primary)' }}>
            {outfit.title}
          </h3>
        </div>

        {/* Action Buttons: Save & Dislike */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onDislikeOutfit(outfit.id)}
            title="Dislike this pairing (won't be recommended again)"
            style={{
              padding: '6px 8px',
              fontSize: '11px',
              border: '1px solid var(--border-hairline)',
              background: 'transparent',
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ThumbsDown size={13} />
          </button>

          {onTryOn && !outfit.isIncomplete && (
            <button
              onClick={() => onTryOn(outfit)}
              className="btn-editorial-outline"
              style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Preview on 2D visual avatar"
            >
              <User size={12} />
              <span>TRY ON</span>
            </button>
          )}

          {!outfit.isIncomplete && (
            <button
              onClick={() => onSaveOutfit(outfit)}
              className={isSaved ? 'btn-editorial-black' : 'btn-editorial-outline'}
              style={{ padding: '6px 12px', fontSize: '11px' }}
            >
              <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'SAVED' : 'SAVE LOOK'}
            </button>
          )}
        </div>
      </div>

      {/* Editorial Rationale */}
      <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.45 }}>
        "{outfit.stylingRationale}"
      </p>

      {/* Honest Missing Slots Notice if Incomplete */}
      {outfit.isIncomplete && outfit.missingSlots && (
        <div style={{ background: '#FFF7F5', border: '1px solid #FFD0C7', padding: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B23A2B', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>
            <AlertCircle size={14} /> Missing Required Component
          </div>
          {outfit.missingSlots.map(m => (
            <div key={m.slot} style={{ fontSize: '12px', color: 'var(--ink-primary)', marginTop: '4px' }}>
              <strong>Needed:</strong> {m.requiredCategory} ({m.suggestedColor}). <em>{m.reason}</em>
            </div>
          ))}
        </div>
      )}

      {/* Items Breakdown list with Swap and Remove affordances */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {outfitSlots.map(slot => {
          const item = slot.item!;
          return (
            <div 
              key={slot.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'var(--bg-warm-light)',
                border: '1px solid var(--border-hairline)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} style={{ width: '28px', height: '36px', objectFit: 'cover' }} />
                ) : (
                  <span 
                    className="color-swatch-dot" 
                    style={{ backgroundColor: item.primaryColor, width: '16px', height: '16px' }} 
                    title={item.colorName}
                  />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      style={{ 
                        fontSize: '9px', 
                        textTransform: 'uppercase', 
                        fontWeight: 800, 
                        background: '#E8F5E9', 
                        color: '#2E7D32',
                        padding: '1px 5px',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2E7D32' }}></span>
                      Owned
                    </span>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: 'var(--ink-secondary)' }}>
                      {slot.label}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>• {item.fabric} {item.brand ? `(${item.brand})` : ''}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)' }}>
                    {item.name}
                  </div>
                </div>
              </div>

              {/* Swap and Remove Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button 
                  onClick={() => setSwappingSlot(slot.key)}
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 8px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-hairline)',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={11} /> Swap
                </button>

                {(slot.key === 'layer' || slot.key === 'accessory') && (
                  <button 
                    onClick={() => onRemoveSlot(outfit.id, slot.key)}
                    style={{
                      padding: '5px 6px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--ink-muted)',
                      cursor: 'pointer'
                    }}
                    title="Remove optional layer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Wardrobe Gap Insight / Honest Advice */}
      {outfit.wardrobeGap && (
        <div 
          style={{
            border: '1px solid var(--border-strong)',
            padding: '12px 14px',
            background: '#FFFFFF',
            marginBottom: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span 
                style={{ 
                  fontSize: '9px', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  background: '#FFF3E0', 
                  color: '#E65100', 
                  padding: '1px 6px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#E65100' }}></span>
                Capsule Gap (Not Owned)
              </span>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', background: 'var(--bg-dark)', color: '#FFFFFF', padding: '1px 5px' }}>
              +{outfit.wardrobeGap.potentialOutfitsUnlocked} Looks Unlocked
            </span>
          </div>

          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-primary)', margin: '2px 0 4px 0' }}>
            Suggested Category: {outfit.wardrobeGap.itemType} ({outfit.wardrobeGap.suggestedColor})
          </p>
          <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', lineHeight: 1.4, margin: '0 0 8px 0' }}>
            {outfit.wardrobeGap.reasoning}
          </p>

          {/* Third Tier Distinction: Verified Retailer Status */}
          <div 
            style={{ 
              fontSize: '10px', 
              color: 'var(--ink-muted)', 
              borderTop: '1px dashed var(--border-hairline)', 
              paddingTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Verified Retailer Product: <em>Pending live store integration (Beta)</em></span>
            <span style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 700 }}>Zero Sponsored Links</span>
          </div>
        </div>
      )}

      {/* In-Place Swap Modal Drawer */}
      {swappingSlot && (
        <div className="drawer-backdrop" onClick={() => setSwappingSlot(null)}>
          <div className="drawer-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
                  OWNED CLOSET SWAP
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase' }}>
                  Swap {swappingSlot} Piece
                </h3>
              </div>
              <button onClick={() => setSwappingSlot(null)} style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '14px' }}>
              Select another compatible item from your private wardrobe:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '50vh', overflowY: 'auto' }}>
              {wardrobe
                .filter(w => {
                  if (swappingSlot === 'top' || swappingSlot === 'ethnicPiece') return w.category === 'tops' || w.category === 'ethnic';
                  if (swappingSlot === 'bottom') return w.category === 'bottoms';
                  if (swappingSlot === 'layer') return w.category === 'outerwear' || (w.category === 'ethnic' && w.subcategory === 'nehru_jacket');
                  if (swappingSlot === 'footwear') return w.category === 'footwear';
                  return w.category === 'accessories';
                })
                .map(altItem => (
                  <button
                    key={altItem.id}
                    onClick={() => {
                      onSwapPiece(outfit.id, swappingSlot, altItem);
                      setSwappingSlot(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-hairline)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {altItem.imageUrl ? (
                        <img src={altItem.imageUrl} alt={altItem.name} style={{ width: '28px', height: '36px', objectFit: 'cover' }} />
                      ) : (
                        <span className="color-swatch-dot" style={{ backgroundColor: altItem.primaryColor }} />
                      )}
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)' }}>{altItem.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{altItem.fabric} • {altItem.colorName}</div>
                      </div>
                    </div>
                    <ArrowRight size={14} color="var(--ink-muted)" />
                  </button>
                ))}
            </div>

            <button 
              className="btn-editorial-outline" 
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => setSwappingSlot(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
