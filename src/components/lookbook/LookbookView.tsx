import React from 'react';
import type { LookbookEntry } from '../../types/fashion';
import { Bookmark, Calendar, Trash2 } from 'lucide-react';

interface LookbookViewProps {
  entries: LookbookEntry[];
  onDeleteEntry: (id: string) => void;
  onSelectOccasionTab: () => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  entries,
  onDeleteEntry,
  onSelectOccasionTab
}) => {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '24px' }}>Saved Lookbook</h2>
        <p style={{ fontSize: '13px', marginTop: '2px' }}>
          Your verified outfit formulas, ready to re-wear
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: 'var(--accent-ochre)'
            }}
          >
            <Bookmark size={22} />
          </div>
          <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Lookbook is empty</h3>
          <p style={{ fontSize: '13px', maxWidth: '300px', margin: '0 auto 16px auto' }}>
            Whenever you curate an outfit combination you like, hit "Save" to keep it here with styling notes.
          </p>
          <button 
            className="btn btn-primary"
            onClick={onSelectOccasionTab}
          >
            Go to AI Stylist
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {entries.map(entry => {
            const { outfit } = entry;
            return (
              <div key={entry.id} className="editorial-card" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span 
                      className="pill-badge" 
                      style={{ 
                        fontSize: '10px', 
                        textTransform: 'uppercase', 
                        fontWeight: 700, 
                        background: 'var(--accent-ochre-light)',
                        color: 'var(--accent-ochre)',
                        marginBottom: '4px'
                      }}
                    >
                      {entry.occasionLabel}
                    </span>
                    <h3 style={{ fontSize: '16px' }}>{outfit.title}</h3>
                  </div>

                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    aria-label="Remove saved outfit"
                    style={{ padding: '6px', color: 'var(--ink-muted)' }}
                    title="Remove from Lookbook"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                  <Calendar size={12} /> Saved on {entry.savedDate}
                </div>

                {/* Items chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {Object.values(outfit.items)
                    .filter((item): item is NonNullable<typeof item> => Boolean(item))
                    .map(item => (
                      <span 
                        key={item.id}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-xs)',
                          background: 'var(--bg-secondary)',
                          color: 'var(--ink-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span className="color-swatch-dot" style={{ backgroundColor: item.primaryColor, width: '10px', height: '10px' }} />
                        {item.name}
                      </span>
                    ))}
                </div>

                <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', fontStyle: 'italic' }}>
                  "{outfit.stylingRationale}"
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
