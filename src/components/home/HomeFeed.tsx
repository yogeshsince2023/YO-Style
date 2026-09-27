import React from 'react';
import type { WardrobeItem, FashionProfile, CuratedOutfit } from '../../types/fashion';
import { ArrowRight, Sparkles, Shield, Palette, Bookmark, TrendingUp } from 'lucide-react';
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
  const topPieces = wardrobe.filter(i => i.isAvailable).sort((a, b) => b.wearCount - a.wearCount).slice(0, 4);

  return (
    <div>
      {/* ═══ Infinite Showroom Grid ═══ */}
      <div className="showroom-grid">

        {/* 1. HERO TILE — Large editorial photo spanning 2 cols + 2 rows */}
        <div
          className="showroom-tile tile-hero animate-in"
          onClick={() => onNavigate('stylist')}
        >
          <div className="tile-image-wrap" style={{ minHeight: '480px' }}>
            <img src="/showroom/hero.jpg" alt="YO Style Editorial" />
          </div>
          <div className="tile-overlay">
            <span className="tile-tag">Autumn / Winter 2026</span>
            <h1 className="tile-title tile-title-lg">
              Know Your<br />Style.
            </h1>
            <p className="tile-desc">
              AI-powered personal styling from clothes you already own. Zero waste, pure elegance.
            </p>
            <button className="tile-cta" style={{ color: '#fff' }}>
              Style Me Now
              <span className="tile-cta-arrow"><ArrowRight size={14} /></span>
            </button>
          </div>
        </div>

        {/* 2. STATS TILE — Chartreuse accent: Wardrobe count */}
        <div
          className="showroom-tile tile-standard tile-accent animate-in animate-in-delay-1"
          onClick={() => onNavigate('wardrobe')}
        >
          <span className="tile-tag">Your Closet</span>
          <div>
            <div className="tile-stat">{wardrobe.length}</div>
            <div className="tile-stat-label">Pieces in Wardrobe</div>
          </div>
          <button className="tile-cta" style={{ color: 'var(--ink-primary)' }}>
            Open Closet
            <span className="tile-cta-arrow"><ArrowRight size={14} /></span>
          </button>
        </div>

        {/* 3. SAVED LOOKS TILE — Dark */}
        <div
          className="showroom-tile tile-standard tile-dark animate-in animate-in-delay-2"
          onClick={() => onNavigate('lookbook')}
        >
          <span className="tile-tag">Saved</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, color: 'var(--accent-lime)', lineHeight: 1 }}>
              {savedLookCount}
            </div>
            <div className="tile-stat-label" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Outfit Formulas
            </div>
          </div>
          <button className="tile-cta" style={{ color: '#fff' }}>
            View Lookbook
            <span className="tile-cta-arrow"><ArrowRight size={14} /></span>
          </button>
        </div>

        {/* 4. FLATLAY TILE — Feature (2 cols) */}
        <div
          className="showroom-tile tile-feature animate-in animate-in-delay-3"
          onClick={() => onNavigate('stylist')}
        >
          <div className="tile-image-wrap" style={{ minHeight: '280px' }}>
            <img src="/showroom/flatlay.jpg" alt="Curated Outfit Flat Lay" />
          </div>
          <div className="tile-overlay">
            <span className="tile-tag">AI Curation</span>
            <h2 className="tile-title">Fresh Outfit Ideas</h2>
            <p className="tile-desc">
              Algorithmically curated combinations from your wardrobe, matched by color harmony and occasion.
            </p>
            <button className="tile-cta" style={{ color: '#fff' }}>
              Curate Looks
              <span className="tile-cta-arrow"><ArrowRight size={14} /></span>
            </button>
          </div>
        </div>

        {/* 5. ETHNIC TILE — Standard tall */}
        <div
          className="showroom-tile tile-tall animate-in animate-in-delay-4"
          onClick={() => onNavigate('stylist')}
        >
          <div className="tile-image-wrap" style={{ minHeight: '400px' }}>
            <img src="/showroom/ethnic.jpg" alt="Indo-Western Fusion" />
          </div>
          <div className="tile-overlay">
            <span className="tile-tag">Heritage</span>
            <h2 className="tile-title">Indian & Fusion</h2>
            <p className="tile-desc">
              Wedding protocols, festive looks & Indo-Western styling.
            </p>
            <button className="tile-cta" style={{ color: '#fff' }}>
              Explore Events
              <span className="tile-cta-arrow"><ArrowRight size={14} /></span>
            </button>
          </div>
        </div>

        {/* 6. FEATURED OUTFIT TILE — Accent if available */}
        {featuredOutfit ? (
          <div
            className="showroom-tile tile-standard animate-in animate-in-delay-5"
            style={{
              background: 'var(--bg-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'var(--space-lg)',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div>
              <span className="tile-tag" style={{ color: 'var(--ink-muted)' }}>Today's Pick</span>
              <h3 className="tile-title" style={{ color: 'var(--ink-primary)', fontSize: '16px', marginTop: '6px' }}>
                {featuredOutfit.title}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '6px', lineHeight: 1.4, fontStyle: 'italic' }}>
                "{featuredOutfit.stylingRationale.slice(0, 100)}…"
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                className="btn-showroom btn-showroom-lime"
                style={{ fontSize: '10px', padding: '8px 16px' }}
                onClick={(e) => { e.stopPropagation(); onSaveOutfit(featuredOutfit); }}
              >
                <Bookmark size={12} fill={isFeaturedSaved ? 'currentColor' : 'none'} />
                {isFeaturedSaved ? 'Saved' : 'Save'}
              </button>
              <button
                className="btn-showroom btn-showroom-ghost"
                style={{ fontSize: '10px', padding: '8px 16px' }}
                onClick={() => onNavigate('stylist')}
              >
                View More
              </button>
            </div>
          </div>
        ) : (
          <div
            className="showroom-tile tile-standard tile-accent animate-in animate-in-delay-5"
            onClick={() => onNavigate('wardrobe')}
          >
            <span className="tile-tag">Get Started</span>
            <div>
              <div className="tile-title" style={{ color: 'var(--ink-primary)', fontSize: '16px' }}>
                Add your first piece
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', marginTop: '6px' }}>
                Upload clothes to unlock AI styling recommendations.
              </p>
            </div>
            <button className="tile-cta" style={{ color: 'var(--ink-primary)' }}>
              Add Piece
              <span className="tile-cta-arrow"><ArrowRight size={14} /></span>
            </button>
          </div>
        )}

        {/* 7. PLANNER TILE — Dark */}
        <div
          className="showroom-tile tile-standard tile-dark animate-in animate-in-delay-6"
          onClick={() => onNavigate('planner')}
        >
          <span className="tile-tag">Intelligence</span>
          <div>
            <TrendingUp size={28} color="#C8FF00" style={{ marginBottom: '8px' }} />
            <div className="tile-title" style={{ fontSize: '16px' }}>
              Wardrobe Planner
            </div>
            <div className="tile-desc" style={{ fontSize: '11px', marginTop: '4px' }}>
              Travel packing, weather analysis, purchase evaluator & daily calendar.
            </div>
          </div>
          <button className="tile-cta" style={{ color: '#fff' }}>
            Plan Outfits
            <span className="tile-cta-arrow"><ArrowRight size={14} /></span>
          </button>
        </div>

        {/* 8. SHOP TILE — Accent wide */}
        <div
          className="showroom-tile tile-feature animate-in animate-in-delay-7"
          onClick={() => onNavigate('shopping')}
          style={{
            background: 'var(--accent-lime)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
          }}
        >
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.5)' }}>
              Verified Shopping
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink-primary)', marginTop: '4px' }}>
              Find What's Missing
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', marginTop: '4px', maxWidth: '320px' }}>
              Browse permission-verified retailers. Mix owned + new pieces with honest budget calculations.
            </p>
          </div>
          <button className="tile-cta" style={{ color: 'var(--ink-primary)', fontSize: '14px' }}>
            <span className="tile-cta-arrow" style={{ width: '42px', height: '42px' }}>
              <ArrowRight size={18} />
            </span>
          </button>
        </div>
      </div>

      {/* ═══ Trust Pillars ═══ */}
      <div className="showroom-pillars">
        <div className="showroom-pillar">
          <div className="showroom-pillar-icon"><Sparkles size={18} /></div>
          <div>
            <div className="showroom-pillar-title">Owned-First Styling</div>
            <div className="showroom-pillar-desc">Outfits from clothes you already possess</div>
          </div>
        </div>
        <div className="showroom-pillar">
          <div className="showroom-pillar-icon"><Shield size={18} /></div>
          <div>
            <div className="showroom-pillar-title">100% Private</div>
            <div className="showroom-pillar-desc">Local browser sandbox, zero tracking</div>
          </div>
        </div>
        <div className="showroom-pillar">
          <div className="showroom-pillar-icon"><Palette size={18} /></div>
          <div>
            <div className="showroom-pillar-title">Color Harmony</div>
            <div className="showroom-pillar-desc">Algorithmic Western & Indian pairing</div>
          </div>
        </div>
        <div className="showroom-pillar">
          <div className="showroom-pillar-icon"><Bookmark size={18} /></div>
          <div>
            <div className="showroom-pillar-title">Saved Lookbook</div>
            <div className="showroom-pillar-desc">{savedLookCount} verified outfit formulas</div>
          </div>
        </div>
      </div>

      {/* ═══ Best Of Closet — Product Grid ═══ */}
      {topPieces.length > 0 && (
        <>
          <div className="showroom-section-header">
            <h2 className="showroom-section-title">Best of Your Closet</h2>
            <button className="showroom-section-link" onClick={() => onNavigate('wardrobe')}>
              View All ({wardrobe.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="showroom-product-grid">
            {topPieces.map((item, i) => (
              <article
                key={item.id}
                className={`showroom-product-card animate-in animate-in-delay-${i + 1}`}
                onClick={() => onNavigate('wardrobe')}
              >
                <div className="showroom-card-img">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: item.primaryColor,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        border: '3px solid #FFFFFF'
                      }}
                    />
                  )}
                  <span className="showroom-card-badge">{item.category}</span>
                </div>
                <div className="showroom-card-body">
                  <div className="showroom-card-cat">{item.fabric} · {item.fit} cut</div>
                  <div className="showroom-card-name">{item.name}</div>
                  <div className="showroom-card-meta">{item.colorName} · Worn {item.wearCount}×</div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Personalized greeting footer */}
      <div style={{
        textAlign: 'center',
        padding: '48px 24px 64px',
        color: 'var(--ink-muted)'
      }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontStyle: 'italic', color: 'var(--ink-secondary)' }}>
          Curated for {profile.name}
        </p>
        <p style={{ fontSize: '11px', marginTop: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          → YO Style · Infinite Showroom
        </p>
      </div>
    </div>
  );
};
