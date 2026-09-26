import React, { useState, useRef } from 'react';
import type { WardrobeItem, FashionCategory, Subcategory, OccasionType, FitType, PatternType } from '../../types/fashion';
import { compressWardrobeImage } from '../../utils/imageCompressor';
import { Plus, Check, Upload, X, Shield, Image as ImageIcon } from 'lucide-react';

interface AddItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: WardrobeItem) => void;
  existingItems: WardrobeItem[];
}

const CATEGORY_OPTIONS: { id: Exclude<FashionCategory, 'all'>; label: string }[] = [
  { id: 'tops', label: 'Western Top' },
  { id: 'ethnic', label: 'Indian Ethnic / Fusion' },
  { id: 'bottoms', label: 'Trousers & Pants' },
  { id: 'outerwear', label: 'Jackets & Blazers' },
  { id: 'footwear', label: 'Footwear & Mules' },
  { id: 'accessories', label: 'Accessories & Stoles' },
];

const PRESET_COLORS = [
  { name: 'Ochre / Terracotta', hex: '#C26D38' },
  { name: 'Malabar Deep Indigo', hex: '#1C3144' },
  { name: 'Warm Ecru / Linen', hex: '#E5DFD3' },
  { name: 'Charcoal Black', hex: '#282725' },
  { name: 'Sage Olive', hex: '#3B4B3E' },
  { name: 'Madder Rust', hex: '#8C3A27' },
  { name: 'Mulberry Wine', hex: '#582C35' },
  { name: 'Crisp White', hex: '#FFFFFF' }
];

const PATTERN_OPTIONS: { id: PatternType; label: string }[] = [
  { id: 'solid', label: 'Solid Monotone' },
  { id: 'handblock', label: 'Artisanal Handblock' },
  { id: 'textured', label: 'Textured Weave (Khadi/Slub)' },
  { id: 'striped', label: 'Pinstripes / Stripes' },
  { id: 'checked', label: 'Windowpane / Checks' },
  { id: 'floral', label: 'Floral / Botanical' },
  { id: 'geometric', label: 'Geometric Jaal' },
];

export const AddItemDrawer: React.FC<AddItemDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onAddItem,
  existingItems
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<FashionCategory, 'all'>>('ethnic');
  const [subCategoryLabel, setSubCategoryLabel] = useState('Short Kurta');
  const [primaryColor, setPrimaryColor] = useState('#C26D38');
  const [colorName, setColorName] = useState('Ochre / Terracotta');
  const [fabric, setFabric] = useState('Pure Linen');
  const [fit, setFit] = useState<FitType>('relaxed');
  const [pattern, setPattern] = useState<PatternType>('textured');
  const [brand, setBrand] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionType[]>(['smart_casual', 'festive_indian']);
  const [notes, setNotes] = useState('');
  
  // Image state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSizeKb, setImageSizeKb] = useState<number | undefined>(undefined);
  const [isCompressing, setIsCompressing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleToggleOccasion = (occ: OccasionType) => {
    setSelectedOccasions(prev => 
      prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setIsCompressing(true);

    try {
      const result = await compressWardrobeImage(file);
      setImagePreview(result.base64);
      setImageSizeKb(result.sizeKb);
    } catch (err: any) {
      setImageError(err.message || 'Failed to process image');
      setImagePreview(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageSizeKb(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Duplicate check
    const isDuplicate = existingItems.some(
      i => i.name.toLowerCase().trim() === name.toLowerCase().trim() && 
           i.primaryColor.toLowerCase() === primaryColor.toLowerCase()
    );

    if (isDuplicate) {
      const confirmAdd = window.confirm(
        `You already have a piece named "${name.trim()}" in ${colorName}. Do you still want to add this duplicate?`
      );
      if (!confirmAdd) return;
    }

    const newItem: WardrobeItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      subcategory: 'short_kurta' as Subcategory,
      subCategoryLabel: subCategoryLabel || 'Garment Piece',
      primaryColor,
      colorName,
      fabric: fabric.trim() || 'Natural Weave',
      fit,
      pattern,
      brand: brand.trim() || undefined,
      occasions: selectedOccasions.length > 0 ? selectedOccasions : ['smart_casual'],
      seasons: ['all_year'],
      imageUrl: imagePreview || undefined,
      imageSizeKb,
      isAvailable: true,
      wearCount: 0,
      notes: notes.trim() || undefined,
      createdAt: Date.now()
    };

    onAddItem(newItem);
    // Reset form
    setName('');
    setBrand('');
    setNotes('');
    handleRemoveImage();
    onClose();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="drawer-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '520px', maxHeight: '92vh' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
              100% PRIVATE WARDROBE VAULT
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', marginTop: '2px' }}>
              Catalog a Piece
            </h2>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: 'var(--ink-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Garment Category & Silhouette */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Garment Category *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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

          {/* Piece Name & Silhouette Tag */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="piece-name">Garment Name *</label>
              <input 
                id="piece-name"
                className="form-input"
                type="text"
                placeholder="e.g. Raw Silk Kurta"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="sub-cat-label">Silhouette Type</label>
              <input 
                id="sub-cat-label"
                className="form-input"
                type="text"
                placeholder="e.g. Mandarin Short Kurta"
                value={subCategoryLabel}
                onChange={e => setSubCategoryLabel(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Colors & Weave */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Primary Color Swatch: <strong>{colorName}</strong></label>
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
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  title={col.name}
                  aria-label={col.name}
                >
                  {primaryColor === col.hex && (
                    <Check size={14} color={col.hex === '#FFFFFF' || col.hex === '#E5DFD3' ? '#1C1A18' : '#FFFFFF'} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern & Fabric & Fit */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Pattern</label>
              <select 
                className="form-select"
                value={pattern}
                onChange={e => setPattern(e.target.value as PatternType)}
              >
                {PATTERN_OPTIONS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Fabric / Weave</label>
              <input 
                className="form-input"
                type="text"
                placeholder="e.g. Khadi, Mulberry Silk"
                value={fabric}
                onChange={e => setFabric(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Fit / Cut</label>
              <select 
                className="form-select"
                value={fit}
                onChange={e => setFit(e.target.value as FitType)}
              >
                <option value="relaxed">Relaxed / Easy</option>
                <option value="tailored">Tailored / Sharp</option>
                <option value="regular">Regular</option>
                <option value="oversized">Oversized</option>
                <option value="slim">Slim</option>
              </select>
            </div>
          </div>

          {/* Optional Brand */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" htmlFor="piece-brand">Brand / Artisan Origin (Optional)</label>
            <input 
              id="piece-brand"
              className="form-input"
              type="text"
              placeholder="e.g. Fabindia, Nicobar, Massimo Dutti, Local Weaver"
              value={brand}
              onChange={e => setBrand(e.target.value)}
            />
          </div>

          {/* Section 3: Optional Image Upload with Client Compression */}
          <div className="form-group" style={{ marginBottom: '16px', background: 'var(--bg-warm-light)', padding: '12px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={14} /> Optional Garment Photo
              </label>
              <span style={{ fontSize: '10px', color: 'var(--ink-secondary)' }}>JPG, PNG, WebP (Max 10MB)</span>
            </div>

            {imageError && (
              <p style={{ fontSize: '11px', color: '#B23A2B', marginBottom: '8px' }}>{imageError}</p>
            )}

            {imagePreview ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFFFF', padding: '8px', border: '1px solid var(--border-hairline)' }}>
                <img 
                  src={imagePreview} 
                  alt="Garment Preview" 
                  style={{ width: '60px', height: '75px', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-primary)' }}>Compressed for Fast Mobile Loading</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>Storage weight: ~{imageSizeKb} KB (Zero Cloud Egress)</div>
                </div>
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  style={{ padding: '6px', color: '#B23A2B', background: 'none', border: 'none', cursor: 'pointer' }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="wardrobe-file-upload"
                />
                <label 
                  htmlFor="wardrobe-file-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    border: '1px dashed var(--border-strong)',
                    cursor: 'pointer',
                    background: '#FFFFFF',
                    textAlign: 'center'
                  }}
                >
                  <Upload size={18} color="var(--ink-secondary)" style={{ marginBottom: '4px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>
                    {isCompressing ? 'Compressing on device...' : 'Upload Garment Photo (Optional)'}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                    Photo is resized locally and stays in your private vault
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Section 4: Occasions & Notes */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Suitable Occasions</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { id: 'work_formal' as OccasionType, label: 'Work & Presentation' },
                { id: 'smart_casual' as OccasionType, label: 'Smart Casual' },
                { id: 'festive_indian' as OccasionType, label: 'Festive & Pooja' },
                { id: 'wedding_guest' as OccasionType, label: 'Wedding Guest' },
                { id: 'weekend_brunch' as OccasionType, label: 'Weekend Brunch' },
                { id: 'travel_airport' as OccasionType, label: 'Travel Transit' },
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

          {/* Styling Notes */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Personal Styling Notes (Optional)</label>
            <textarea 
              className="form-textarea"
              rows={2}
              placeholder="e.g. Great with Kolhapuri mules or rolled-up cuffs for cafe evenings"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Privacy Guarantee footnote */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontSize: '11px', color: 'var(--ink-secondary)' }}>
            <Shield size={14} color="var(--ink-primary)" />
            <span>Stored strictly on your device. Never indexed or shared publicly.</span>
          </div>

          <button 
            type="submit" 
            className="btn-editorial-black" 
            style={{ width: '100%', justifyContent: 'center', padding: '14px 20px' }}
            disabled={!name.trim() || isCompressing}
          >
            <Plus size={16} /> Save Piece to Private Closet
          </button>
        </form>
      </div>
    </div>
  );
};
