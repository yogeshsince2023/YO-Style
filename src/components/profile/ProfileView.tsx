import React, { useState } from 'react';
import type { ExtendedFashionProfile } from '../../types/auth';
import { User, Shield, Download, Trash2, Check, RefreshCw, Sliders, Tag, Palette } from 'lucide-react';

interface ProfileViewProps {
  profile: ExtendedFashionProfile;
  onUpdateProfile: (updated: ExtendedFashionProfile) => void;
  onResetToDemo: () => void;
  onWipeData: () => void;
  onExportJson: () => void;
  onClearAppearanceInfo: () => void;
  currentUserEmail?: string;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onResetToDemo,
  onWipeData,
  onExportJson,
  onClearAppearanceInfo,
  currentUserEmail,
  onSignOut
}) => {
  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname || '');
  const [tagline, setTagline] = useState(profile.tagline);
  const [itemBudget, setItemBudget] = useState(profile.budgets.maxPerItemInr || 3500);
  const [outfitBudget, setOutfitBudget] = useState(profile.budgets.maxPerOutfitInr || 8000);
  const [city, setCity] = useState(profile.optionalAppearance?.approximateCity || '');
  const [topSize, setTopSize] = useState(profile.optionalAppearance?.topSize || '');
  const [bottomSize, setBottomSize] = useState(profile.optionalAppearance?.bottomSize || '');
  const [shoeSize, setShoeSize] = useState(profile.optionalAppearance?.shoeSizeUk || '');
  const [undertone, setUndertone] = useState(profile.optionalAppearance?.undertoneVibe || 'unspecified');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      nickname,
      tagline,
      budgets: {
        ...profile.budgets,
        maxPerItemInr: itemBudget,
        maxPerOutfitInr: outfitBudget
      },
      optionalAppearance: {
        ...profile.optionalAppearance,
        approximateCity: city,
        topSize,
        bottomSize,
        shoeSizeUk: shoeSize,
        undertoneVibe: undertone
      },
      updatedAt: Date.now()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
            DATA SOVEREIGNTY & STYLING DNA
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '2px' }}>
            Fashion Profile
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
            Private profile governing your personal outfit curation algorithm.
          </p>
        </div>

        {currentUserEmail && (
          <button 
            type="button" 
            className="btn-editorial-outline"
            onClick={onSignOut}
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            Sign Out ({currentUserEmail})
          </button>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* Core Identity Card */}
        <div className="editorial-card" style={{ marginBottom: '18px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} /> Identity & Personal Voice
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input 
                id="profile-name"
                type="text" 
                className="form-input" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-nickname">Preferred Nickname</label>
              <input 
                id="profile-nickname"
                type="text" 
                className="form-input" 
                value={nickname} 
                onChange={e => setNickname(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="profile-tagline">Style Tagline / Aesthetic Statement</label>
            <input 
              id="profile-tagline"
              type="text" 
              className="form-input" 
              value={tagline} 
              onChange={e => setTagline(e.target.value)} 
            />
          </div>
        </div>

        {/* Budgets in ₹ */}
        <div className="editorial-card" style={{ marginBottom: '18px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} /> Financial Boundaries (INR ₹)
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '14px' }}>
            Protects you from high-priced recommendations. Applied when suggesting wardrobe-gap additions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Max Per-Piece</label>
                <strong style={{ fontSize: '13px' }}>₹{itemBudget.toLocaleString('en-IN')}</strong>
              </div>
              <input 
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={itemBudget}
                onChange={e => setItemBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000000' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Max Per-Outfit</label>
                <strong style={{ fontSize: '13px' }}>₹{outfitBudget.toLocaleString('en-IN')}</strong>
              </div>
              <input 
                type="range"
                min="2500"
                max="40000"
                step="1000"
                value={outfitBudget}
                onChange={e => setOutfitBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000000' }}
              />
            </div>
          </div>
        </div>

        {/* Optional Appearance & Sizing */}
        <div className="editorial-card" style={{ marginBottom: '18px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Tag size={16} /> Optional Sizing & Context
            </h3>
            <button
              type="button"
              onClick={onClearAppearanceInfo}
              style={{ fontSize: '11px', color: '#B23A2B', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear Optional Info
            </button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '14px' }}>
            Strictly self-reported. We never measure bodies, require selfies, or claim biological fit certainty.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
            <div className="form-group">
              <label className="form-label">Top Size</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. M / 40"
                value={topSize}
                onChange={e => setTopSize(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bottom Size</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 32"
                value={bottomSize}
                onChange={e => setBottomSize(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Shoe Size (UK)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 9"
                value={shoeSize}
                onChange={e => setShoeSize(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Approximate City (Climate)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Bengaluru, Mumbai, Delhi"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Undertone Vibe (Self-Identified)</label>
              <select 
                className="form-select"
                value={undertone}
                onChange={e => setUndertone(e.target.value as any)}
              >
                <option value="unspecified">Unspecified / Flexible</option>
                <option value="warm">Warm Earth Tones</option>
                <option value="cool">Cool Jewel Tones</option>
                <option value="neutral">Neutral Balanced</option>
                <option value="olive">Olive Rich</option>
              </select>
            </div>
          </div>
        </div>

        {/* Color Comfort & Exclusions Overview */}
        <div className="editorial-card" style={{ marginBottom: '20px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={16} /> Color Spectrum & Exclusions
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label className="form-label">Preferred Palettes (Curated into Outfits)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {profile.colorFavorites.map(c => (
                <span key={c.name} className="pill-badge" style={{ gap: '6px' }}>
                  <span className="color-swatch-dot" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Hard Exclusions (Never Curated)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {profile.colorExclusions.map(c => (
                <span key={c.name} className="pill-badge" style={{ gap: '6px', border: '1px solid #FF5C5C' }}>
                  <span className="color-swatch-dot" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button 
          id="btn-save-profile"
          type="submit" 
          className="btn-editorial-black"
          style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', marginBottom: '24px' }}
        >
          {savedSuccess ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> Preferences Updated & Isolated
            </span>
          ) : (
            'Save Profile Preferences'
          )}
        </button>
      </form>

      {/* Privacy & Sovereignty Controls */}
      <div className="editorial-card" style={{ padding: '20px', background: 'var(--bg-warm-light)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Shield size={16} /> Privacy & Local Data Sovereignty
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '14px', lineHeight: 1.45 }}>
          Your data is isolated strictly to this account sandbox. We never harvest photos, expose measurements to public feeds, or share styling history with advertisers.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            type="button" 
            className="btn-editorial-white"
            onClick={onExportJson}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Download size={14} /> Export My Data (JSON)
          </button>

          <button 
            type="button" 
            className="btn-editorial-white"
            onClick={() => {
              if (window.confirm('Reset this account back to demo state?')) {
                onResetToDemo();
              }
            }}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <RefreshCw size={14} /> Reset Closet to Seed Defaults
          </button>

          <button 
            type="button" 
            onClick={() => {
              if (window.confirm('WARNING: Are you sure you want to permanently delete your account and all wardrobe items? This cannot be undone.')) {
                onWipeData();
              }
            }}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '11px', 
              fontWeight: 800, 
              letterSpacing: '0.12em', 
              textTransform: 'uppercase', 
              color: '#B23A2B', 
              background: 'none', 
              border: '1px solid #FF5C5C', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={14} /> Delete Account & Wipe Isolated Data
          </button>
        </div>
      </div>
    </div>
  );
};
