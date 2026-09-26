import React, { useState } from 'react';
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
}

const CATEGORY_TABS: { id: FashionCategory; label: string }[] = [
  { id: 'all', label: 'All Pieces' },
  { id: 'ethnic', label: 'Indian / Fusion' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Layers' },
  { id: 'footwear', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
];

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  wardrobe,
  onAddItem,
  onDeleteItem,
  onToggleAvailability,
  onIncrementWear
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FashionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  const filteredItems = wardrobe.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.colorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Title & Add Action */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px' }}>Digital Wardrobe</h2>
          <p style={{ fontSize: '13px', marginTop: '2px' }}>
            Cataloged & private to this device ({wardrobe.length} total pieces)
          </p>
        </div>

        <button 
          id="btn-add-piece"
          className="btn btn-accent"
          onClick={() => setIsAddOpen(true)}
          style={{ padding: '8px 14px', fontSize: '13px' }}
        >
          <Plus size={16} /> Add Piece
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <Search 
          size={16} 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} 
        />
        <input 
          id="wardrobe-search"
          type="text"
          className="form-input"
          placeholder="Search by fabric (linen, silk), color, or name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '36px', height: '42px', fontSize: '13px' }}
        />
      </div>

      {/* Filter Tabs Horizontal Scroll */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '6px', 
          overflowX: 'auto', 
          paddingBottom: '8px', 
          marginBottom: '16px',
          scrollbarWidth: 'none'
        }}
      >
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.id}
            id={`filter-${tab.id}`}
            onClick={() => setSelectedCategory(tab.id)}
            className={`pill-badge ${selectedCategory === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wardrobe Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div 
          className="editorial-card" 
          style={{ textAlign: 'center', padding: '40px 20px', marginTop: '20px' }}
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
              margin: '0 auto 12px auto',
              color: 'var(--accent-ochre)'
            }}
          >
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>No pieces found</h3>
          <p style={{ fontSize: '13px', maxWidth: '280px', margin: '0 auto 16px auto' }}>
            {searchQuery 
              ? `No items match "${searchQuery}". Try searching for fabrics like linen or cotton.` 
              : 'Add Western staples or Indian ethnic pieces to begin unlocking styled combinations.'}
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={16} /> Catalog Your First Piece
          </button>
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px'
          }}
        >
          {filteredItems.map(item => (
            <WardrobeCard
              key={item.id}
              item={item}
              onClick={(clicked) => setSelectedItem(clicked)}
            />
          ))}
        </div>
      )}

      {/* Add Drawer */}
      <AddItemDrawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddItem={onAddItem}
      />

      {/* Item Detail / Wear log Drawer */}
      <ItemDetailDrawer
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleAvailability={onToggleAvailability}
        onIncrementWear={onIncrementWear}
        onDeleteItem={onDeleteItem}
      />
    </div>
  );
};
