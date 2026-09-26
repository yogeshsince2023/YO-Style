import React from 'react';
import type { WardrobeItem } from '../../types/fashion';
import { Drawer } from '../common/Drawer';
import { Trash2, RotateCw, Calendar } from 'lucide-react';

interface ItemDetailDrawerProps {
  item: WardrobeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleAvailability: (itemId: string) => void;
  onIncrementWear: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const ItemDetailDrawer: React.FC<ItemDetailDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onToggleAvailability,
  onIncrementWear,
  onDeleteItem
}) => {
  if (!item) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={item.name}
      subtitle={`${item.fabric} • ${item.fit} fit`}
    >
      <div style={{ marginTop: '8px' }}>
        {/* Visual Color Band */}
        <div 
          style={{
            height: '60px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: item.primaryColor,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            color: item.primaryColor === '#FFFFFF' || item.primaryColor === '#E5DFD3' ? '#1C1A18' : '#FAF8F5'
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{item.colorName}</span>
          <span style={{ fontSize: '12px', opacity: 0.85 }}>{item.primaryColor}</span>
        </div>

        {/* Specs Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Times Worn</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink-primary)' }}>{item.wearCount} times</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Current Status</span>
            <div style={{ fontSize: '14px', fontWeight: 600, color: item.isAvailable ? 'var(--accent-moss)' : 'var(--accent-ochre)' }}>
              {item.isAvailable ? 'Ready in Closet' : 'In Laundry'}
            </div>
          </div>
        </div>

        {/* Occasions */}
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">Suitable Occasions</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {item.occasions.map(occ => (
              <span key={occ} className="pill-badge" style={{ textTransform: 'capitalize' }}>
                {occ.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div style={{ marginBottom: '20px', background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Stylist Notes
            </span>
            <p style={{ fontSize: '13px', color: 'var(--ink-primary)', fontStyle: 'italic' }}>"{item.notes}"</p>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => onIncrementWear(item.id)}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Calendar size={15} /> Log "Wore Today" (+1 wear count)
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => onToggleAvailability(item.id)}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <RotateCw size={15} /> Toggle Laundry Status ({item.isAvailable ? 'Send to Wash' : 'Back to Closet'})
          </button>

          <button 
            className="btn btn-ghost"
            onClick={() => {
              if (window.confirm(`Remove "${item.name}" from your wardrobe?`)) {
                onDeleteItem(item.id);
                onClose();
              }
            }}
            style={{ width: '100%', justifyContent: 'center', color: '#B23A2B', marginTop: '6px' }}
          >
            <Trash2 size={15} /> Remove Piece from Wardrobe
          </button>
        </div>
      </div>
    </Drawer>
  );
};
