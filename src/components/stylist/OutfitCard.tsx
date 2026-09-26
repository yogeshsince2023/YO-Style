import React, { useState } from 'react';
import type { WardrobeItem, CuratedOutfit } from '../../types/fashion';
import { Bookmark, RefreshCw, ArrowRight } from 'lucide-react';

interface OutfitCardProps {
  outfit: CuratedOutfit;
  wardrobe: WardrobeItem[];
  onSaveOutfit: (outfit: CuratedOutfit) => void;
  isSaved: boolean;
  onSwapPiece: (outfitId: string, slot: keyof CuratedOutfit['items'], newItem: WardrobeItem) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  wardrobe,
  onSaveOutfit,
  isSaved,
  onSwapPiece
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

  return (
    <div className="editorial-card" style={{ marginBottom: '18px', padding: '16px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span 
              className="pill-badge" 
              style={{ 
                background: 'var(--accent-ochre-light)', 
                color: 'var(--accent-ochre)', 
                fontWeight: 700,
                fontSize: '11px' 
              }}
            >
              Harmony: {outfit.colorHarmonyScore}%
            </span>
            <span style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'capitalize' }}>
              {outfit.occasion.replace('_', ' ')}
            </span>
          </div>
          <h3 style={{ fontSize: '18px', color: 'var(--ink-primary)' }}>{outfit.title}</h3>
        </div>

        <button
          onClick={() => onSaveOutfit(outfit)}
          className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 12px', minHeight: '34px', fontSize: '12px' }}
        >
          <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Rationale Quote */}
      <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.4 }}>
        "{outfit.stylingRationale}"
      </p>

      {/* Items Breakdown list with Swap affordance */}
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
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span 
                  className="color-swatch-dot" 
                  style={{ backgroundColor: item.primaryColor, width: '16px', height: '16px' }} 
                  title={item.colorName}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-ochre)', fontWeight: 700 }}>
                      {slot.label}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>• {item.fabric}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-primary)' }}>
                    {item.name}
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <button 
                onClick={() => setSwappingSlot(slot.key)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--ink-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--bg-surface)'
                }}
              >
                <RefreshCw size={11} /> Swap
              </button>
            </div>
          );
        })}
      </div>

      {/* Wardrobe Gap Education Card (Explicitly labeled DEMO) */}
      {outfit.wardrobeGap && (
        <div 
          style={{
            border: '1px dashed var(--accent-ochre)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            background: 'var(--accent-ochre-light)',
            marginBottom: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-ochre)', letterSpacing: '0.04em' }}>
              WARDROBE GAP ADVICE
            </span>
            <span 
              style={{
                fontSize: '9px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '1px 5px',
                borderRadius: '3px',
                background: '#FFFFFF',
                color: 'var(--ink-secondary)'
              }}
            >
              Demo Preview
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--ink-primary)', marginBottom: '4px' }}>
            <strong>Potential Key Piece:</strong> {outfit.wardrobeGap.itemType} ({outfit.wardrobeGap.suggestedColor})
          </p>
          <p style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
            {outfit.wardrobeGap.reasoning} <em>(Unlocks ~{outfit.wardrobeGap.potentialOutfitsUnlocked} other outfits with your existing wardrobe).</em>
          </p>
        </div>
      )}

      {/* In-Place Swap Modal Drawer */}
      {swappingSlot && (
        <div className="drawer-backdrop" onClick={() => setSwappingSlot(null)}>
          <div className="drawer-sheet" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>Swap {swappingSlot} Piece</h3>
            <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '14px' }}>
              Choose another owned item from your private closet:
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
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="color-swatch-dot" style={{ backgroundColor: altItem.primaryColor }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-primary)' }}>{altItem.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{altItem.fabric} • {altItem.colorName}</div>
                      </div>
                    </div>
                    <ArrowRight size={14} color="var(--ink-muted)" />
                  </button>
                ))}
            </div>

            <button 
              className="btn btn-secondary" 
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
