import React, { useState, useMemo } from 'react';
import type { WardrobeItem, FashionCategory } from '../../types/fashion';
import { WardrobeCard } from './WardrobeCard';
import { AddItemDrawer } from './AddItemDrawer';
import { ItemDetailDrawer } from './ItemDetailDrawer';
import { Plus, Search, Sparkles } from 'lucide-react';

interface WardrobeViewProps {
  wardrobe: WardrobeItem[];
  onAddItem: (item: WardrobeItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onIncrementWear: (id: string) => void;
  onUpdateItem: (updated: WardrobeItem) => void;
}

const CATEGORY_TABS: { id: FashionCategory; label: string }[] = [
  { id: 'all', label: 'All Pieces' },
  { id: 'ethnic', label: 'Indian Heritage' },
  { id: 'tops', label: 'Western Tops' },
  { id: 'bottoms', label: 'Trousers' },
  { id: 'outerwear', label: 'Jackets & Layers' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
];

const ITEMS_PER_PAGE = 8;

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  wardrobe,
  onAddItem,
  onDeleteItem,
  onToggleAvailability,
  onIncrementWear,
  onUpdateItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FashionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'worn_desc' | 'worn_asc'>('recent');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  // Filter & Search Logic
  const filteredAndSortedItems = useMemo(() => {
    let result = wardrobe.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesFit = selectedFit === 'all' || item.fit === selectedFit;
      const matchesPattern = selectedPattern === 'all' || (item.pattern || 'solid') === selectedPattern;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.colorName.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q));

      return matchesCategory && matchesFit && matchesPattern && matchesSearch;
    });

    // Sorting
    if (sortBy === 'worn_desc') {
      result.sort((a, b) => b.wearCount - a.wearCount);
    } else if (sortBy === 'worn_asc') {
      result.sort((a, b) => a.wearCount - b.wearCount);
    } else {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [wardrobe, selectedCategory, selectedFit, selectedPattern, searchQuery, sortBy]);

  // Paginated Slice
  const paginatedItems = filteredAndSortedItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedItems.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div>
      {/* Title & Add Piece Action */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
            PRIVATE DIGITAL INVENTORY
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '2px' }}>
            Your Wardrobe
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
            {wardrobe.length} cataloged pieces • Zero cloud image leaks
          </p>
        </div>

        <button 
          id="btn-add-piece"
          className="btn-editorial-black"
          onClick={() => setIsAddOpen(true)}
          style={{ padding: '10px 18px', fontSize: '11px' }}
        >
          <Plus size={15} /> Add Piece
        </button>
      </div>

      {/* Multi-Dimensional Filter & Search Bar */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-hairline)', padding: '14px', marginBottom: '16px' }}>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search 
            size={16} 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} 
          />
          <input 
            id="wardrobe-search"
            type="text"
            className="form-input"
            placeholder="Search by fabric, brand, color, or name..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
            style={{ paddingLeft: '36px', height: '42px', fontSize: '13px' }}
          />
        </div>

        {/* Filter Dropdowns Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div>
            <label className="form-label" style={{ fontSize: '9px', marginBottom: '3px' }}>Silhouette Fit</label>
            <select 
              className="form-select"
              value={selectedFit}
              onChange={e => { setSelectedFit(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
              style={{ padding: '8px', fontSize: '11px', textTransform: 'uppercase' }}
            >
              <option value="all">All Fits</option>
              <option value="relaxed">Relaxed</option>
              <option value="tailored">Tailored</option>
              <option value="oversized">Oversized</option>
              <option value="regular">Regular</option>
              <option value="slim">Slim</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '9px', marginBottom: '3px' }}>Pattern / Weave</label>
            <select 
              className="form-select"
              value={selectedPattern}
              onChange={e => { setSelectedPattern(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
              style={{ padding: '8px', fontSize: '11px', textTransform: 'uppercase' }}
            >
              <option value="all">All Patterns</option>
              <option value="solid">Solid</option>
              <option value="handblock">Handblock</option>
              <option value="textured">Textured</option>
              <option value="striped">Striped</option>
              <option value="checked">Checked</option>
              <option value="floral">Floral</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '9px', marginBottom: '3px' }}>Sort By</label>
            <select 
              className="form-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{ padding: '8px', fontSize: '11px', textTransform: 'uppercase' }}
            >
              <option value="recent">Recently Added</option>
              <option value="worn_desc">Most Worn</option>
              <option value="worn_asc">Least Worn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '6px', 
          overflowX: 'auto', 
          paddingBottom: '8px', 
          marginBottom: '20px',
          scrollbarWidth: 'none'
        }}
      >
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.id}
            id={`filter-${tab.id}`}
            onClick={() => { setSelectedCategory(tab.id); setVisibleCount(ITEMS_PER_PAGE); }}
            className={`pill-badge ${selectedCategory === tab.id ? 'active' : ''}`}
            style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card Grid or Empty State */}
      {filteredAndSortedItems.length === 0 ? (
        <div 
          className="editorial-card" 
          style={{ textAlign: 'center', padding: '48px 20px', marginTop: '12px' }}
        >
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: 'var(--bg-secondary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}
          >
            <Sparkles size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
            No Matching Pieces
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', maxWidth: '320px', margin: '0 auto 18px auto' }}>
            {searchQuery 
              ? `No items match "${searchQuery}". Try clearing filters or search terms.` 
              : 'Add your everyday staples, kurtas, jackets, and accessories to unlock outfit curation.'}
          </p>
          <button 
            className="btn-editorial-black"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={15} /> Catalog a Piece
          </button>
        </div>
      ) : (
        <>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}
          >
            {paginatedItems.map(item => (
              <WardrobeCard
                key={item.id}
                item={item}
                onClick={(clicked) => setSelectedItem(clicked)}
              />
            ))}
          </div>

          {/* Incremental Pagination Button */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '28px', marginBottom: '14px' }}>
              <button 
                type="button" 
                className="btn-editorial-outline"
                onClick={handleLoadMore}
                style={{ minWidth: '220px' }}
              >
                Load More ({filteredAndSortedItems.length - visibleCount} Remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Drawer */}
      <AddItemDrawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddItem={onAddItem}
        existingItems={wardrobe}
      />

      {/* Item Detail / Wear log / Edit Drawer */}
      <ItemDetailDrawer
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleAvailability={onToggleAvailability}
        onIncrementWear={onIncrementWear}
        onDeleteItem={onDeleteItem}
        onUpdateItem={onUpdateItem}
      />
    </div>
  );
};
