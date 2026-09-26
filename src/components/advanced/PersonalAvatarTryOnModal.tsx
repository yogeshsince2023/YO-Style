import React, { useState } from 'react';
import type { CuratedOutfit, FitType } from '../../types/fashion';
import { X, ShieldAlert, Sliders } from 'lucide-react';

interface PersonalAvatarTryOnModalProps {
  outfit: CuratedOutfit | null;
  onClose: () => void;
  defaultHeightCm?: number;
  defaultFit?: FitType;
}

export const PersonalAvatarTryOnModal: React.FC<PersonalAvatarTryOnModalProps> = ({
  outfit,
  onClose,
  defaultHeightCm = 175,
  defaultFit = 'relaxed'
}) => {
  const [heightCm, setHeightCm] = useState(defaultHeightCm);
  const [buildType, setBuildType] = useState<FitType>(defaultFit);

  if (!outfit) return null;

  const topColor = outfit.items.top?.primaryColor || outfit.items.ethnicPiece?.primaryColor || '#E5DFD3';
  const bottomColor = outfit.items.bottom?.primaryColor || '#27272A';
  const layerColor = outfit.items.layer?.primaryColor;
  const shoeColor = outfit.items.footwear?.primaryColor || '#18181B';

  const mannequinWidth = buildType === 'slim' ? 56 : buildType === 'relaxed' ? 76 : 66;

  return (
    <div 
      className="drawer-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1100 }}
    >
      <div 
        className="editorial-card" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '480px', width: '100%', padding: '24px', background: '#FFFFFF' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', background: '#FEF3C7', color: '#D97706', padding: '1px 6px', borderRadius: '2px' }}>
                EXPERIMENTAL FEATURE
              </span>
              <span style={{ fontSize: '10px', color: 'var(--ink-secondary)' }}>
                2D Silhouette Preview
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
              Visual Try-On Approximation
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--ink-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Mandatory Non-Guarantee Disclaimer Alert */}
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 12px', fontSize: '11px', color: '#92400E', marginBottom: '14px', lineHeight: 1.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800, marginBottom: '2px' }}>
            <ShieldAlert size={13} />
            <span>Visual Approximation Only — Not a Fit Verification</span>
          </div>
          Illustrates color palette harmony and relative silhouette proportions. Does not measure body tension, stretch, or tailored garment drape.
        </div>

        {/* 2D Vector Canvas Preview Container */}
        <div 
          style={{ 
            background: 'var(--bg-warm-light)', 
            border: '1px solid var(--border-hairline)', 
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px',
            marginBottom: '16px'
          }}
        >
          {/* Stylized Vector Mannequin */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Head */}
            <div style={{ width: '28px', height: '34px', borderRadius: '50%', background: '#D1D5DB', marginBottom: '4px' }} />

            {/* Neck */}
            <div style={{ width: '12px', height: '8px', background: '#D1D5DB', marginBottom: '2px' }} />

            {/* Upper Body (Top / Layer) */}
            <div 
              style={{ 
                width: `${mannequinWidth}px`, 
                height: '80px', 
                backgroundColor: topColor, 
                borderRadius: '4px 4px 0 0',
                border: layerColor ? `3px solid ${layerColor}` : '1px solid rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
              title={outfit.items.top?.name || outfit.items.ethnicPiece?.name}
            >
              {layerColor && (
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#FFFFFF', background: 'rgba(0,0,0,0.6)', padding: '1px 4px', borderRadius: '2px' }}>
                  LAYER
                </span>
              )}
            </div>

            {/* Lower Body (Bottom / Trousers) */}
            <div 
              style={{ 
                width: `${mannequinWidth - 8}px`, 
                height: '100px', 
                backgroundColor: bottomColor,
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: '0 0 2px 2px',
                display: 'flex',
                justifyContent: 'center',
                gap: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
              }}
              title={outfit.items.bottom?.name}
            >
              {/* Trouser Crease line */}
              <div style={{ width: '1px', height: '100%', background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Shoes */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
              <div style={{ width: '22px', height: '12px', borderRadius: '3px 6px 1px 1px', backgroundColor: shoeColor, border: '1px solid rgba(0,0,0,0.2)' }} />
              <div style={{ width: '22px', height: '12px', borderRadius: '6px 3px 1px 1px', backgroundColor: shoeColor, border: '1px solid rgba(0,0,0,0.2)' }} />
            </div>
          </div>

          <div style={{ marginTop: '14px', fontSize: '11px', fontWeight: 700, color: 'var(--ink-secondary)', textAlign: 'center' }}>
            {outfit.title} ({outfit.colorHarmonyScore}% Harmony)
          </div>
        </div>

        {/* Adjust Silhouette Controls */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-hairline)', padding: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Sliders size={13} />
            <span>Mannequin Adjustments</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="form-label">Height: {heightCm} cm</label>
              <input
                type="range"
                min={150}
                max={200}
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label className="form-label">Build Profile</label>
              <select
                value={buildType}
                onChange={e => setBuildType(e.target.value as FitType)}
                className="form-select"
                style={{ padding: '6px 8px', fontSize: '11px' }}
              >
                <option value="slim">Slim Frame</option>
                <option value="regular">Regular Fit</option>
                <option value="relaxed">Relaxed / Broader</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-editorial-black"
          onClick={onClose}
          style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '12px' }}
        >
          Close Preview
        </button>
      </div>
    </div>
  );
};
