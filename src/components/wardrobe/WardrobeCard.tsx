import React from 'react';
import type { WardrobeItem } from '../../types/fashion';
import { Shirt } from 'lucide-react';

interface WardrobeCardProps {
  item: WardrobeItem;
  onClick: (item: WardrobeItem) => void;
}

export const WardrobeCard: React.FC<WardrobeCardProps> = ({ item, onClick }) => {
  return (
    <article 
      className="showcase-product-card"
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(item); }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        border: '1px solid var(--border-hairline)',
        backgroundColor: '#FFFFFF',
        position: 'relative'
      }}
    >
      <div>
        {/* Top Photographic Area or Minimalist Color Block */}
        <div 
          className="showcase-card-img-wrap"
          style={{
            aspectRatio: '3 / 4',
            backgroundColor: '#F2F2F2',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy" 
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: item.primaryColor,
                  margin: '0 auto 8px auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}
              >
                <Shirt 
                  size={24} 
                  color={item.primaryColor === '#FFFFFF' || item.primaryColor === '#E5DFD3' ? '#1C1A18' : '#FAF8F5'} 
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.colorName}
              </span>
            </div>
          )}

          {/* Top Left Category Pill */}
          <span 
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '2px 6px',
              backgroundColor: '#000000',
              color: '#FFFFFF'
            }}
          >
            {item.category}
          </span>

          {/* Laundry Indicator */}
          {!item.isAvailable && (
            <span 
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(178,58,43,0.92)',
                color: '#fff',
                padding: '2px 6px'
              }}
            >
              In Laundry
            </span>
          )}
        </div>

        {/* Card Details */}
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
            {item.fabric} • {item.fit} cut
          </div>

          <h3 
            style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              color: 'var(--ink-primary)', 
              marginTop: '3px',
              lineHeight: 1.35
            }}
          >
            {item.name}
          </h3>

          {item.brand && (
            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '2px' }}>
              {item.brand}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info: Pattern & Wear Counter */}
      <div 
        style={{ 
          padding: '8px 12px', 
          borderTop: '1px solid var(--border-hairline)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '11px',
          color: 'var(--ink-muted)'
        }}
      >
        <span style={{ textTransform: 'capitalize' }}>
          {item.pattern || 'Solid'}
        </span>
        <span style={{ fontWeight: 700, color: 'var(--ink-primary)' }}>
          Worn {item.wearCount}x
        </span>
      </div>
    </article>
  );
};
