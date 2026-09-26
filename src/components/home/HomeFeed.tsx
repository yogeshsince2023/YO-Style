import React from 'react';
import type { WardrobeItem, FashionProfile, CuratedOutfit } from '../../types/fashion';
import { Sparkles, Shield, RefreshCw, Bookmark } from 'lucide-react';
import type { TabType } from '../common/BottomNav';

interface HomeFeedProps {
  profile: FashionProfile;
  wardrobe: WardrobeItem[];
  featuredOutfit: CuratedOutfit | null;
  savedLookCount: number;
  onNavigate: (tab: TabType) => void;
  onSaveOutfit: (outfit: CuratedOutfit) => void;
  isFeaturedSaved: boolean;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  profile,
  wardrobe,
  featuredOutfit,
  savedLookCount,
  onNavigate,
  onSaveOutfit,
  isFeaturedSaved
}) => {
  return (
    <div>
      {/* 1. Seamless GAZU Luxury Editorial Hero */}
      <section className="hero-editorial-stage">
        {/* Unified, seamless high-fashion photograph with integrated typography & studio lighting */}
        <img 
          src="/editorial/hero_seamless.jpg" 
          alt="YO Style Haute Editorial" 
          className="hero-seamless-bg"
        />

        {/* Top Editorial Tagline */}
        <div className="hero-editorial-tag">
          KNOW YOUR STYLE.<br />
          WEAR IT BETTER.
        </div>

        {/* Right New Collection Label */}
        <div className="hero-collection-tag">
          FOR {profile.name.toUpperCase()}<br />
          AUTUMN CAPSULE<br />
          2026
        </div>

        {/* Bottom CTA Actions */}
        <div className="hero-cta-group">
          <button 
            className="btn-editorial-black"
            onClick={() => onNavigate('stylist')}
          >
            STYLE ME NOW
          </button>
          <button 
            className="btn-editorial-outline"
            onClick={() => onNavigate('wardrobe')}
          >
            EXPLORE CLOSET
          </button>
        </div>
      </section>

      {/* 2. Black High-Contrast Category Strip (Western, Ethnic, Fusion) */}
      <section className="black-category-strip">
        <div className="category-strip-card" onClick={() => onNavigate('wardrobe')}>
          <img src="/editorial/hero.jpg" alt="Western Tailored" className="category-strip-avatar" />
          <div className="category-strip-meta">
            <span className="category-strip-title">WESTERN TAILORED</span>
            <span className="category-strip-desc">Linens, blazers & selvedge essentials.</span>
            <span className="category-strip-action">EXPLORE PIECES →</span>
          </div>
        </div>

        <div className="category-strip-card" onClick={() => onNavigate('wardrobe')}>
          <img src="/editorial/fusion.jpg" alt="Indian Heritage" className="category-strip-avatar" />
          <div className="category-strip-meta">
            <span className="category-strip-title">INDIAN HERITAGE</span>
            <span className="category-strip-desc">Raw silk kurtas, bandhgalas & stoles.</span>
            <span className="category-strip-action">EXPLORE ETHNIC →</span>
          </div>
        </div>

        <div className="category-strip-card" onClick={() => onNavigate('stylist')}>
          <img src="/editorial/banner.jpg" alt="Fusion Intelligence" className="category-strip-avatar" />
          <div className="category-strip-meta">
            <span className="category-strip-title">INDO-WESTERN FUSION</span>
            <span className="category-strip-desc">Modern harmony from clothes you own.</span>
            <span className="category-strip-action">CURATE LOOKS →</span>
          </div>
        </div>
      </section>

      {/* 3. Featured Curated Outfit Highlight if Available */}
      {featuredOutfit && (
        <section style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-hairline)', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
              TODAY'S SIGNATURE COMBINATION
            </span>
            <button
              onClick={() => onSaveOutfit(featuredOutfit)}
              style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Bookmark size={13} fill={isFeaturedSaved ? 'currentColor' : 'none'} />
              {isFeaturedSaved ? 'SAVED TO LOOKBOOK' : 'SAVE COMBINATION'}
            </button>
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '4px' }}>
            {featuredOutfit.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontStyle: 'italic', maxWidth: '600px', lineHeight: 1.4 }}>
            "{featuredOutfit.stylingRationale}"
          </p>
        </section>
      )}

      {/* 4. Editorial Story Banner ("NEW SEASON / NEW VIBES") */}
      <section className="editorial-story-banner">
        <div className="editorial-story-content">
          <span className="editorial-story-tag">NEW SEASON EDITORIAL</span>
          <h2 className="editorial-story-title">
            NEW<br />VIBES
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', maxWidth: '340px', marginBottom: '20px', lineHeight: 1.5 }}>
            Discover fresh combinations curated strictly from clothes already in your closet. Zero wardrobe paralysis.
          </p>
          <button 
            className="btn-editorial-black"
            onClick={() => onNavigate('stylist')}
          >
            CURATE YOUR OUTFIT
          </button>
        </div>

        <div className="editorial-story-image-wrap">
          <img 
            src="/editorial/banner.jpg" 
            alt="New Vibes Editorial" 
            className="editorial-story-img"
          />
        </div>
      </section>

      {/* 5. Four High-Fashion Trust / Philosophy Pillars */}
      <section className="feature-pillars-row">
        <div className="pillar-item">
          <Sparkles size={20} />
          <div>
            <div className="pillar-title">OWNED-CLOTHES FIRST</div>
            <div className="pillar-desc">Style from what you already possess</div>
          </div>
        </div>

        <div className="pillar-item">
          <Shield size={20} />
          <div>
            <div className="pillar-title">100% PRIVATE DATA</div>
            <div className="pillar-desc">Local browser sandbox, zero tracking</div>
          </div>
        </div>

        <div className="pillar-item">
          <RefreshCw size={20} />
          <div>
            <div className="pillar-title">COLOR HARMONY</div>
            <div className="pillar-desc">Algorithmic Western & Indian pairing</div>
          </div>
        </div>

        <div className="pillar-item">
          <Bookmark size={20} />
          <div>
            <div className="pillar-title">SAVED LOOKBOOK</div>
            <div className="pillar-desc">{savedLookCount} verified outfit formulas</div>
          </div>
        </div>
      </section>

      {/* 6. "BEST OF YO STYLE" Wardrobe Showcase */}
      <section className="editorial-showcase-section">
        <div className="showcase-header">
          <h2 className="showcase-title">BEST OF YOUR CLOSET</h2>
          <button 
            className="showcase-action-link"
            onClick={() => onNavigate('wardrobe')}
          >
            VIEW ALL ({wardrobe.length})
          </button>
        </div>

        <div className="showcase-product-grid">
          {wardrobe.slice(0, 4).map(item => (
            <article 
              key={item.id} 
              className="showcase-product-card"
              onClick={() => onNavigate('wardrobe')}
            >
              <div className="showcase-card-img-wrap">
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: item.primaryColor,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    border: '2px solid #FFFFFF'
                  }}
                />
                <span 
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    backgroundColor: '#000000',
                    color: '#FFFFFF'
                  }}
                >
                  {item.category}
                </span>
              </div>

              <div className="showcase-card-details">
                <div className="showcase-card-cat">{item.fabric} • {item.fit} cut</div>
                <div className="showcase-card-name">{item.name}</div>
                <div className="showcase-card-meta">{item.colorName} • Worn {item.wearCount}x</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
