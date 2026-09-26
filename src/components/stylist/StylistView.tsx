import React, { useState } from 'react';
import type { WardrobeItem, OccasionType, WeatherMood, CuratedOutfit } from '../../types/fashion';
import { generateCuratedOutfits } from '../../utils/styleEngine';
import { OutfitCard } from './OutfitCard';
import { Sparkles } from 'lucide-react';

interface StylistViewProps {
  wardrobe: WardrobeItem[];
  excludedColorHexes: string[];
  savedOutfitIds: string[];
  onSaveOutfit: (outfit: CuratedOutfit) => void;
}

const OCCASIONS: { id: OccasionType; label: string; icon: string }[] = [
  { id: 'smart_casual', label: 'Smart Casual', icon: '☕' },
  { id: 'work_formal', label: 'Work & Presentation', icon: '💼' },
  { id: 'festive_indian', label: 'Festive / Pooja', icon: '🪔' },
  { id: 'wedding_guest', label: 'Wedding Sangeet', icon: '✨' },
  { id: 'date_night', label: 'Evening Date', icon: '🍷' },
  { id: 'travel_airport', label: 'Travel Transit', icon: '✈️' },
];

const WEATHER_MOODS: { id: WeatherMood; label: string }[] = [
  { id: 'warm_sun', label: 'Sunny / Warm (Cotton & Linen)' },
  { id: 'breezy_evening', label: 'Pleasant Evening' },
  { id: 'ac_indoor', label: 'AC Indoor / Office Chill' },
  { id: 'chilly_winter', label: 'Cold / Layering Required' },
];

export const StylistView: React.FC<StylistViewProps> = ({
  wardrobe,
  excludedColorHexes,
  savedOutfitIds,
  onSaveOutfit
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('festive_indian');
  const [selectedWeather, setSelectedWeather] = useState<WeatherMood>('breezy_evening');
  const [curatedOutfits, setCuratedOutfits] = useState<CuratedOutfit[]>(() => 
    generateCuratedOutfits({
      wardrobe,
      occasion: 'festive_indian',
      weatherMood: 'breezy_evening',
      excludedColorHexes
    })
  );

  const handleGenerate = () => {
    const results = generateCuratedOutfits({
      wardrobe,
      occasion: selectedOccasion,
      weatherMood: selectedWeather,
      excludedColorHexes
    });
    setCuratedOutfits(results);
  };

  const handleSwapPiece = (outfitId: string, slot: keyof CuratedOutfit['items'], newItem: WardrobeItem) => {
    setCuratedOutfits(prev => prev.map(outfit => {
      if (outfit.id !== outfitId) return outfit;
      return {
        ...outfit,
        items: {
          ...outfit.items,
          [slot]: newItem
        }
      };
    }));
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '24px' }}>AI Stylist Intelligence</h2>
        <p style={{ fontSize: '13px', marginTop: '2px' }}>
          Curated combinations from clothes you currently own
        </p>
      </div>

      {/* Step 1: Occasion Selector */}
      <div className="editorial-card" style={{ marginBottom: '14px', padding: '14px' }}>
        <label className="form-label" style={{ marginBottom: '8px' }}>1. What is the Occasion?</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {OCCASIONS.map(occ => {
            const isSelected = selectedOccasion === occ.id;
            return (
              <button
                key={occ.id}
                id={`occasion-${occ.id}`}
                onClick={() => setSelectedOccasion(occ.id)}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '2px solid var(--ink-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '18px' }}>{occ.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 500, color: 'var(--ink-primary)' }}>
                  {occ.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step 2: Weather & Setting */}
        <div style={{ marginTop: '12px' }}>
          <label className="form-label">2. Climate / Setting</label>
          <select 
            id="weather-select"
            className="form-select"
            value={selectedWeather}
            onChange={e => setSelectedWeather(e.target.value as WeatherMood)}
            style={{ fontSize: '13px' }}
          >
            {WEATHER_MOODS.map(w => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          id="btn-curate-outfit"
          className="btn btn-primary"
          onClick={handleGenerate}
          style={{ width: '100%', marginTop: '14px' }}
        >
          <Sparkles size={16} color="var(--accent-ochre)" /> Curate Owned Combinations
        </button>
      </div>

      {/* Outfit Results Section */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '16px' }}>Curated Ensembles ({curatedOutfits.length})</h3>
          <span style={{ fontSize: '11px', color: 'var(--accent-moss)', fontWeight: 600 }}>
            ✓ Zero Unsolicited Ads
          </span>
        </div>

        {curatedOutfits.length === 0 ? (
          <div className="editorial-card" style={{ textAlign: 'center', padding: '30px 16px' }}>
            <p style={{ fontSize: '13px', marginBottom: '12px' }}>
              We couldn't construct a complete look for this occasion with the current closet items.
            </p>
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              Try adjusting the occasion filter or add more versatile items to your closet.
            </p>
          </div>
        ) : (
          curatedOutfits.map(outfit => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              wardrobe={wardrobe}
              onSaveOutfit={onSaveOutfit}
              isSaved={savedOutfitIds.includes(outfit.id)}
              onSwapPiece={handleSwapPiece}
            />
          ))
        )}
      </div>
    </div>
  );
};
