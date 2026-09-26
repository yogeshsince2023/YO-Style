import React, { useState } from 'react';
import type { WardrobeItem, FashionCategory, Subcategory, OccasionType, FitType } from '../../types/fashion';
import { Plus, Check } from 'lucide-react';

interface AddItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: WardrobeItem) => void;
}

const CATEGORY_OPTIONS: { id: Exclude<FashionCategory, 'all'>; label: string }[] = [
  { id: 'tops', label: 'Western Top' },
  { id: 'ethnic', label: 'Indian Ethnic / Fusion' },
  { id: 'bottoms', label: 'Trousers & Pants' },
  { id: 'outerwear', label: 'Jackets & Blazers' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories & Stoles' },
];

const PRESET_COLORS = [
  { name: 'Ochre / Terracotta', hex: '#C26D38' },
  { name: 'Malabar Deep Indigo', hex: '#1C3144' },
  { name: 'Ecru / Sandstone', hex: '#E5DFD3' },
  { name: 'Charcoal Black', hex: '#282725' },
  { name: 'Sage Olive', hex: '#3B4B3E' },
  { name: 'Madder Rust', hex: '#8C3A27' },
  { name: 'Mulberry Wine', hex: '#582C35' },
  { name: 'Crisp White', hex: '#FFFFFF' }
];

export const AddItemDrawer: React.FC<AddItemDrawerProps> = ({ isOpen, onClose, onAddItem }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<FashionCategory, 'all'>>('ethnic');
  const [subCategoryLabel] = useState('Custom Piece');
  const [primaryColor, setPrimaryColor] = useState('#C26D38');
  const [colorName, setColorName] = useState('Ochre / Terracotta');
  const [fabric, setFabric] = useState('Pure Linen');
  const [fit, setFit] = useState<FitType>('relaxed');
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionType[]>(['smart_casual', 'festive_indian']);
  const [notes, setNotes] = useState('');

  const handleToggleOccasion = (occ: OccasionType) => {
    setSelectedOccasions(prev => 
      prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: WardrobeItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      subcategory: 'short_kurta' as Subcategory,
      subCategoryLabel,
      primaryColor,
      colorName,
      fabric,
      fit,
      occasions: selectedOccasions.length > 0 ? selectedOccasions : ['smart_casual'],
      seasons: ['all_year'],
      isAvailable: true,
      wearCount: 0,
      notes: notes.trim(),
      createdAt: Date.now()
    };

    onAddItem(newItem);
    // Reset form
    setName('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Catalog a Piece</h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>Add Western, Indian, or Fusion garments you own</p>
          </div>
          <button onClick={onClose} style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>Cancel</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category Picker */}
          <div className="form-group">
            <label className="form-label">Garment Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`pill-badge ${category === cat.id ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Piece Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="piece-name">Garment Name or Description *</label>
            <input 
              id="piece-name"
              className="form-input"
              type="text"
              placeholder="e.g. Chanderi Silk Kurta or Japanese Selvedge Denim"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* Color Palette Selector */}
          <div className="form-group">
            <label className="form-label">Primary Color Swatch: <strong style={{ color: 'var(--ink-primary)' }}>{colorName}</strong></label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {PRESET_COLORS.map(col => (
                <button
                  type="button"
                  key={col.hex}
                  onClick={() => { setPrimaryColor(col.hex); setColorName(col.name); }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: col.hex,
                    border: primaryColor === col.hex ? '2px solid var(--ink-primary)' : '1px solid rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  title={col.name}
                  aria-label={col.name}
                >
                  {primaryColor === col.hex && <Check size={14} color={col.hex === '#FFFFFF' || col.hex === '#E5DFD3' ? '#1C1A18' : '#FFFFFF'} />}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric & Silhouette */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Fabric / Weave</label>
              <input 
                className="form-input"
                type="text"
                placeholder="e.g. Khadi Cotton, Linen"
                value={fabric}
                onChange={e => setFabric(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fit / Cut</label>
              <select 
                className="form-select"
                value={fit}
                onChange={e => setFit(e.target.value as FitType)}
              >
                <option value="relaxed">Relaxed / Flowing</option>
                <option value="tailored">Tailored / Sharp</option>
                <option value="regular">Regular</option>
                <option value="oversized">Oversized</option>
                <option value="slim">Slim</option>
              </select>
            </div>
          </div>

          {/* Occasions Multi-Select */}
          <div className="form-group">
            <label className="form-label">Ideal For Occasions</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { id: 'work_formal' as OccasionType, label: 'Work & Corporate' },
                { id: 'smart_casual' as OccasionType, label: 'Smart Casual' },
                { id: 'festive_indian' as OccasionType, label: 'Festive & Pooja' },
                { id: 'wedding_guest' as OccasionType, label: 'Wedding Guest' },
                { id: 'weekend_brunch' as OccasionType, label: 'Weekend Brunch' },
                { id: 'travel_airport' as OccasionType, label: 'Travel Comfort' },
              ].map(occ => {
                const isSelected = selectedOccasions.includes(occ.id);
                return (
                  <button
                    type="button"
                    key={occ.id}
                    onClick={() => handleToggleOccasion(occ.id)}
                    className={`pill-badge ${isSelected ? 'active' : ''}`}
                  >
                    {occ.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div className="form-group">
            <label className="form-label">Styling Notes (Optional)</label>
            <textarea 
              className="form-textarea"
              rows={2}
              placeholder="e.g. Best with cognac sandals or rolled-up cuffs"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              className="btn btn-accent" 
              style={{ flex: 1 }}
              disabled={!name.trim()}
            >
              <Plus size={16} /> Save to Private Wardrobe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
