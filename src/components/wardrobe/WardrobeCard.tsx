import React from 'react';
import type { WardrobeItem } from '../../types/fashion';
import { Sparkles, Shirt } from 'lucide-react';

interface WardrobeCardProps {
  item: WardrobeItem;
  onClick: (item: WardrobeItem) => void;
}

export const WardrobeCard: React.FC<WardrobeCardProps> = ({ item, onClick }) => {
  return (
    <article 
      className="editorial-card"
      style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(item); }}
    >
      <div>
        {/* Top visual representation */}
        <div 
          style={{
            height: '110px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Color Accent Border Top */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: item.primaryColor
            }}
          />

          <div style={{ textAlign: 'center', padding: '8px' }}>
            <div 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: item.primaryColor,
                margin: '0 auto 6px auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Shirt 
                size={20} 
                color={item.primaryColor === '#FFFFFF' || item.primaryColor === '#E5DFD3' ? '#1C1A18' : '#FAF8F5'} 
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', fontWeight: 600 }}>
              {item.colorName}
            </span>
          </div>

          {!item.isAvailable && (
            <span 
              style={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                fontSize: '10px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              In Laundry
            </span>
          )}
        </div>

        {/* Category & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span 
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: 'var(--accent-ochre)'
            }}
          >
            {item.category}
          </span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{item.fabric}</span>
        </div>

        <h3 
          style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            lineHeight: 1.3,
            marginBottom: '6px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--ink-primary)'
          }}
        >
          {item.name}
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'capitalize' }}>
          {item.fit} cut
        </span>

        <span 
          style={{ 
            fontSize: '11px', 
            color: 'var(--accent-moss)', 
            fontWeight: 600,
            display: 'flex', 
            alignItems: 'center', 
            gap: '3px' 
          }}
        >
          <Sparkles size={11} /> Worn {item.wearCount}x
        </span>
      </div>
    </article>
  );
};
