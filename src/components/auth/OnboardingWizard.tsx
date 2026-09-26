import React, { useState } from 'react';
import type { ExtendedFashionProfile } from '../../types/auth';
import type { FitType } from '../../types/fashion';
import { ArrowRight, Check, X, Shield, Info } from 'lucide-react';

interface OnboardingWizardProps {
  isOpen: boolean;
  profile: ExtendedFashionProfile;
  onComplete: (updated: ExtendedFashionProfile) => void;
  onSkipAll: () => void;
}

const STYLE_OPTIONS = [
  'Minimalist Tailored',
  'Indian Heritage',
  'Indo-Western Fusion',
  'Streetwear & Relaxed',
  'Casual Chic',
  'Handloom & Organic',
  'Monochrome Sharp'
];

const DISLIKE_OPTIONS = [
  'Heavy Sequins / Bling',
  'Skinny Tight Jeans',
  'Synthetic Fabrics',
  'Distressed Ripped Denim',
  'Oversized Hoodies'
];

const COLOR_PRESETS = [
  { name: 'Ochre / Terracotta', hex: '#C26D38' },
  { name: 'Malabar Indigo', hex: '#1C3144' },
  { name: 'Warm Ecru', hex: '#E5DFD3' },
  { name: 'Charcoal Black', hex: '#282725' },
  { name: 'Forest Sage', hex: '#3B4B3E' },
  { name: 'Madder Rust', hex: '#8C3A27' },
  { name: 'Ivory White', hex: '#FFFFFF' }
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  profile,
  onComplete,
  onSkipAll
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [nickname, setNickname] = useState(profile.nickname || profile.name);
  const [aesthetics, setAesthetics] = useState<string[]>(profile.styleAesthetics || ['Minimalist Tailored']);
  const [dislikes, setDislikes] = useState<string[]>(profile.dislikedAesthetics || []);
  const [colorFavorites, setColorFavorites] = useState<{ name: string; hex: string }[]>(profile.colorFavorites);
  const colorExclusions = profile.colorExclusions;
  const [preferredFits, setPreferredFits] = useState<FitType[]>(profile.preferredFits || ['relaxed']);
  const [itemBudget, setItemBudget] = useState(profile.budgets.maxPerItemInr || 3500);
  const [outfitBudget, setOutfitBudget] = useState(profile.budgets.maxPerOutfitInr || 8000);
  const [city, setCity] = useState(profile.optionalAppearance?.approximateCity || 'Bengaluru');
  const [topSize, setTopSize] = useState(profile.optionalAppearance?.topSize || 'M / 40');
  const [undertone, setUndertone] = useState(profile.optionalAppearance?.undertoneVibe || 'unspecified');

  if (!isOpen) return null;

  const toggleArrayItem = <T extends string>(arr: T[], item: T): T[] => {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  };

  const handleFinish = () => {
    const updated: ExtendedFashionProfile = {
      ...profile,
      nickname,
      styleAesthetics: aesthetics,
      dislikedAesthetics: dislikes,
      colorFavorites,
      colorExclusions,
      preferredFits,
      budgets: {
        maxPerItemInr: itemBudget,
        maxPerOutfitInr: outfitBudget,
        budgetTier: itemBudget > 5000 ? 'investment' : (itemBudget < 2500 ? 'essential' : 'balanced')
      },
      optionalAppearance: {
        approximateCity: city,
        topSize,
        undertoneVibe: undertone
      },
      isOnboardingCompleted: true,
      updatedAt: Date.now()
    };

    onComplete(updated);
  };

  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true">
      <div 
        className="drawer-sheet" 
        style={{ maxWidth: '500px', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress Bar & Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
            STEP {step} OF 3 • FASHION PROFILE
          </span>
          <button 
            type="button"
            onClick={onSkipAll} 
            style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            Skip for now →
          </button>
        </div>

        {/* Step indicator pills */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '18px' }}>
          {[1, 2, 3].map(s => (
            <div 
              key={s}
              style={{
                flex: 1,
                height: '3px',
                backgroundColor: s <= step ? 'var(--ink-primary)' : 'var(--border-hairline)'
              }}
            />
          ))}
        </div>

        {/* STEP 1: IDENTITY & STYLE VIBE */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>
              Style Identity & Vibes
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '16px' }}>
              Help our algorithms curate combinations tailored to your aesthetic language.
            </p>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="onboarding-nickname">
                Preferred Name or Nickname
              </label>
              <input 
                id="onboarding-nickname"
                type="text"
                className="form-input"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="What should we call you?"
              />
            </div>

            {/* Aesthetics */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Preferred Style Aesthetics</label>
                <span style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>Multi-select</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {STYLE_OPTIONS.map(style => {
                  const isSelected = aesthetics.includes(style);
                  return (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setAesthetics(prev => toggleArrayItem(prev, style))}
                      className={`pill-badge ${isSelected ? 'active' : ''}`}
                    >
                      {isSelected && <Check size={12} />}
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dislikes */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Aesthetics or Details You Dislike</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {DISLIKE_OPTIONS.map(dis => {
                  const isSelected = dislikes.includes(dis);
                  return (
                    <button
                      type="button"
                      key={dis}
                      onClick={() => setDislikes(prev => toggleArrayItem(prev, dis))}
                      className={`pill-badge ${isSelected ? 'active' : ''}`}
                      style={{ border: isSelected ? '1px solid #FF5C5C' : undefined }}
                    >
                      {isSelected ? <X size={12} color="#FF5C5C" /> : null}
                      {dis}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn-editorial-black"
                onClick={() => setStep(2)}
              >
                Next: Color & Fits <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COLOR PALETTES & FITS */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>
              Colors & Silhouettes
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '16px' }}>
              Set tones you love, colors you reject, and your comfortable cuts.
            </p>

            {/* Favorite colors */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Tones You Love Wearing</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {COLOR_PRESETS.map(col => {
                  const isFav = colorFavorites.some(f => f.hex === col.hex);
                  return (
                    <button
                      type="button"
                      key={col.hex}
                      onClick={() => {
                        setColorFavorites(prev => 
                          isFav ? prev.filter(f => f.hex !== col.hex) : [...prev, col]
                        );
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        border: isFav ? '2px solid var(--ink-primary)' : '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      <span className="color-swatch-dot" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                      {isFav && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fits */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Preferred Clothing Fits</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(['relaxed', 'tailored', 'oversized', 'regular', 'slim'] as FitType[]).map(fit => {
                  const isSelected = preferredFits.includes(fit);
                  return (
                    <button
                      type="button"
                      key={fit}
                      onClick={() => setPreferredFits(prev => toggleArrayItem(prev, fit))}
                      className={`pill-badge ${isSelected ? 'active' : ''}`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {fit} Cut
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn-editorial-outline"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                type="button" 
                className="btn-editorial-black"
                onClick={() => setStep(3)}
              >
                Next: Budgets & Context <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BUDGETS & OPTIONAL CONTEXT */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>
              Budgets & Optional Context
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '16px' }}>
              Used strictly to calculate trade-offs and climate suitability.
            </p>

            {/* Budgets in INR */}
            <div style={{ background: 'var(--bg-warm-light)', padding: '12px', marginBottom: '14px', borderRadius: 'var(--radius-xs)' }}>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0 }}>Max Per-Item Budget</label>
                  <strong style={{ fontSize: '13px' }}>₹{itemBudget.toLocaleString('en-IN')}</strong>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="15000" 
                  step="500" 
                  value={itemBudget} 
                  onChange={e => setItemBudget(Number(e.target.value))} 
                  style={{ width: '100%', accentColor: '#000000', marginTop: '6px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0 }}>Max Full-Outfit Budget</label>
                  <strong style={{ fontSize: '13px' }}>₹{outfitBudget.toLocaleString('en-IN')}</strong>
                </div>
                <input 
                  type="range" 
                  min="2500" 
                  max="30000" 
                  step="1000" 
                  value={outfitBudget} 
                  onChange={e => setOutfitBudget(Number(e.target.value))} 
                  style={{ width: '100%', accentColor: '#000000', marginTop: '6px' }}
                />
              </div>
            </div>

            {/* Optional Location */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Approximate City / Climate (Optional)</label>
                <span title="Used only to avoid heavy layers in humid weather" style={{ cursor: 'help' }}>
                  <Info size={12} color="var(--ink-muted)" />
                </span>
              </div>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Bengaluru, Mumbai, Delhi-NCR"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            {/* Optional Sizing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Typical Top Size (Optional)</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. M / 40"
                  value={topSize}
                  onChange={e => setTopSize(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Undertone Preference (Optional)</label>
                <select 
                  className="form-select"
                  value={undertone}
                  onChange={e => setUndertone(e.target.value as any)}
                >
                  <option value="unspecified">Unspecified / Flexible</option>
                  <option value="warm">Warm Earth Tones</option>
                  <option value="cool">Cool Jewel Tones</option>
                  <option value="neutral">Neutral Balanced</option>
                  <option value="olive">Olive Tones</option>
                </select>
              </div>
            </div>

            {/* Disclaimer & Privacy Guarantee */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', marginBottom: '18px' }}>
              <Shield size={16} color="var(--ink-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', lineHeight: 1.4 }}>
                <strong>Zero Biometric Mandate:</strong> We never require photos, weight, or body measurements. Appearance inputs are editable self-expression tools, not biological rules.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn-editorial-outline"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button 
                type="button" 
                className="btn-editorial-black"
                onClick={handleFinish}
              >
                Complete & Enter Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
