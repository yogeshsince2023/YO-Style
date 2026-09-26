import React, { useState } from 'react';
import type { WardrobeItem, FitType, PatternType } from '../../types/fashion';
import { Drawer } from '../common/Drawer';
import { Trash2, RotateCw, Calendar, Edit3, Check } from 'lucide-react';
import { compressWardrobeImage } from '../../utils/imageCompressor';

interface ItemDetailDrawerProps {
  item: WardrobeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleAvailability: (itemId: string) => void;
  onIncrementWear: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateItem: (updated: WardrobeItem) => void;
}

export const ItemDetailDrawer: React.FC<ItemDetailDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onToggleAvailability,
  onIncrementWear,
  onDeleteItem,
  onUpdateItem
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editFabric, setEditFabric] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editFit, setEditFit] = useState<FitType>('relaxed');
  const [editPattern, setEditPattern] = useState<PatternType>('solid');
  const [editNotes, setEditNotes] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  if (!item) return null;

  const startEdit = () => {
    setEditName(item.name);
    setEditFabric(item.fabric);
    setEditBrand(item.brand || '');
    setEditFit(item.fit);
    setEditPattern(item.pattern || 'solid');
    setEditNotes(item.notes || '');
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    onUpdateItem({
      ...item,
      name: editName.trim(),
      fabric: editFabric.trim() || item.fabric,
      brand: editBrand.trim() || undefined,
      fit: editFit,
      pattern: editPattern,
      notes: editNotes.trim() || undefined
    });

    setIsEditing(false);
  };

  const handleImageReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const result = await compressWardrobeImage(file);
      onUpdateItem({
        ...item,
        imageUrl: result.base64,
        imageSizeKb: result.sizeKb
      });
    } catch (err: any) {
      alert(err.message || 'Image replacement failed');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemovePhoto = () => {
    onUpdateItem({
      ...item,
      imageUrl: undefined,
      imageSizeKb: undefined
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => { setIsEditing(false); onClose(); }}
      title={item.name}
      subtitle={`${item.fabric} • ${item.fit} cut ${item.brand ? `• ${item.brand}` : ''}`}
    >
      <div style={{ marginTop: '8px' }}>
        {/* Visual Presentation (Photo or Color Band) */}
        {item.imageUrl ? (
          <div style={{ position: 'relative', width: '100%', maxHeight: '280px', overflow: 'hidden', background: '#F5F5F5', marginBottom: '16px' }}>
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              style={{ width: '100%', height: '260px', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '6px' }}>
              <label 
                style={{
                  background: 'rgba(0,0,0,0.85)',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                {isCompressing ? 'Replacing...' : 'Replace Photo'}
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleImageReplace} 
                  style={{ display: 'none' }} 
                />
              </label>

              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  background: 'rgba(178,58,43,0.9)',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Remove Photo
              </button>
            </div>
          </div>
        ) : (
          <div 
            style={{
              height: '80px',
              backgroundColor: item.primaryColor,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              color: item.primaryColor === '#FFFFFF' || item.primaryColor === '#E5DFD3' ? '#1C1A18' : '#FAF8F5'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase' }}>{item.colorName}</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>{item.category.toUpperCase()} • {item.subCategoryLabel}</div>
            </div>

            <label 
              style={{
                background: 'rgba(0,0,0,0.7)',
                color: '#FFFFFF',
                padding: '5px 10px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              + Attach Photo
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={handleImageReplace} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
        )}

        {/* Quick Wear & Status Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--ink-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Times Worn</span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink-primary)' }}>{item.wearCount}x</div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--ink-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Status</span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: item.isAvailable ? '#1E6B38' : '#B23A2B', marginTop: '2px' }}>
              {item.isAvailable ? 'In Closet' : 'In Laundry'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--ink-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pattern</span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-primary)', textTransform: 'capitalize', marginTop: '2px' }}>
              {item.pattern || 'Solid'}
            </div>
          </div>
        </div>

        {/* Edit Mode vs Display Mode */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} style={{ background: 'var(--bg-warm-light)', padding: '14px', marginBottom: '16px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Edit Piece Details</span>
              <button type="button" onClick={() => setIsEditing(false)} style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>Cancel</button>
            </div>

            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label">Garment Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Fabric</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editFabric} 
                  onChange={e => setEditFabric(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Brand</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editBrand} 
                  onChange={e => setEditBrand(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Styling Notes</label>
              <textarea 
                className="form-textarea" 
                rows={2} 
                value={editNotes} 
                onChange={e => setEditNotes(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn-editorial-black" style={{ width: '100%', justifyContent: 'center' }}>
              <Check size={14} /> Update Piece
            </button>
          </form>
        ) : (
          <div>
            {item.notes && (
              <div style={{ marginBottom: '16px', background: 'var(--bg-warm-light)', padding: '12px', borderLeft: '2px solid var(--ink-primary)' }}>
                <span style={{ fontSize: '10px', color: 'var(--ink-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px', fontWeight: 700 }}>
                  Stylist Notes
                </span>
                <p style={{ fontSize: '13px', color: 'var(--ink-primary)', fontStyle: 'italic' }}>
                  "{item.notes}"
                </p>
              </div>
            )}

            <button 
              type="button" 
              onClick={startEdit}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1px solid var(--border-hairline)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '14px',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={13} /> Edit Piece Details & Labels
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            type="button"
            className="btn-editorial-outline"
            onClick={() => onIncrementWear(item.id)}
            style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}
          >
            <Calendar size={14} /> Log "Wore Today" (+1 wear count)
          </button>

          <button 
            type="button"
            className="btn-editorial-outline"
            onClick={() => onToggleAvailability(item.id)}
            style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}
          >
            <RotateCw size={14} /> Status: {item.isAvailable ? 'Send to Laundry' : 'Mark Clean in Closet'}
          </button>

          <button 
            type="button"
            onClick={() => {
              if (window.confirm(`Permanently remove "${item.name}" and any attached photo from your private closet?`)) {
                onDeleteItem(item.id);
                onClose();
              }
            }}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '11px', 
              fontWeight: 800, 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              color: '#B23A2B', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '6px'
            }}
          >
            <Trash2 size={14} /> Remove Piece & Image from Closet
          </button>
        </div>
      </div>
    </Drawer>
  );
};
