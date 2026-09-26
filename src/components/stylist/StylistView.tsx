import React, { useState } from 'react';
import type { WardrobeItem, OccasionType, WeatherMood, CuratedOutfit, FashionProfile } from '../../types/fashion';
import type { IndianFestiveEvent } from '../../types/advanced';
import { generateCuratedOutfits } from '../../utils/styleEngine';
import { FESTIVE_PROTOCOLS, curateFestiveLook } from '../../utils/advancedStyling';
import { OutfitCard } from './OutfitCard';
import { ConversationalStylist } from './ConversationalStylist';
import { PersonalAvatarTryOnModal } from '../advanced/PersonalAvatarTryOnModal';
import { Sparkles, RefreshCw, AlertTriangle, ShieldCheck, MessageSquare, Compass, Flame } from 'lucide-react';

interface StylistViewProps {
  wardrobe: WardrobeItem[];
  profile: FashionProfile;
  userId: string;
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
  { id: 'warm_sun', label: 'Warm / Sunny (Linens & Cotton)' },
  { id: 'breezy_evening', label: 'Pleasant Evening' },
  { id: 'ac_indoor', label: 'AC Indoor / Office Chill' },
  { id: 'chilly_winter', label: 'Cold / Structured Layers' },
];

export const StylistView: React.FC<StylistViewProps> = ({
  wardrobe,
  profile,
  userId,
  excludedColorHexes,
  savedOutfitIds,
  onSaveOutfit
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'curate' | 'festive'>('chat');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('festive_indian');
  const [selectedWeather, setSelectedWeather] = useState<WeatherMood>('breezy_evening');
  const [selectedFestiveEvent, setSelectedFestiveEvent] = useState<IndianFestiveEvent>('mehendi_sangeet');
  const [tryOnOutfit, setTryOnOutfit] = useState<CuratedOutfit | null>(null);
  const [dislikedIds, setDislikedIds] = useState<string[]>([]);
  const [isCurating, setIsCurating] = useState(false);

  // Generate initial recommendations
  const [curatedOutfits, setCuratedOutfits] = useState<CuratedOutfit[]>(() => 
    generateCuratedOutfits({
      wardrobe,
      occasion: 'festive_indian',
      weatherMood: 'breezy_evening',
      excludedColorHexes,
      dislikedOutfitIds: []
    })
  );

  // Debounced, double-tap protected curation
  const handleGenerate = () => {
    if (isCurating) return; // Prevent double tap
    setIsCurating(true);

    setTimeout(() => {
      const results = generateCuratedOutfits({
        wardrobe,
        occasion: selectedOccasion,
        weatherMood: selectedWeather,
        excludedColorHexes,
        dislikedOutfitIds: dislikedIds
      });
      setCuratedOutfits(results);
      setIsCurating(false);
    }, 280);
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

  const handleRemoveSlot = (outfitId: string, slot: keyof CuratedOutfit['items']) => {
    setCuratedOutfits(prev => prev.map(outfit => {
      if (outfit.id !== outfitId) return outfit;
      const nextItems = { ...outfit.items };
      delete nextItems[slot];
      return {
        ...outfit,
        items: nextItems
      };
    }));
  };

  const handleDislikeOutfit = (outfitId: string) => {
    setDislikedIds(prev => [...prev, outfitId]);
    setCuratedOutfits(prev => prev.map(o => o.id === outfitId ? { ...o, isDisliked: true } : o));
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
          OWNED-CLOTHES INTELLIGENCE
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Personal Stylist
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
          Grounded exclusively in your clean closet. Zero hallucinated garments.
        </p>
      </div>

      {/* Mode Tab Switcher */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '6px', 
          marginBottom: '20px',
          background: 'var(--bg-warm-light)',
          padding: '4px',
          border: '1px solid var(--border-hairline)'
        }}
      >
        <button
          id="tab-stylist-chat"
          onClick={() => setActiveMode('chat')}
          style={{
            padding: '10px 8px',
            border: activeMode === 'chat' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeMode === 'chat' ? '#FFFFFF' : 'transparent',
            fontWeight: activeMode === 'chat' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          <MessageSquare size={13} />
          <span>AI Chat</span>
        </button>

        <button
          id="tab-stylist-curate"
          onClick={() => setActiveMode('curate')}
          style={{
            padding: '10px 8px',
            border: activeMode === 'curate' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeMode === 'curate' ? '#FFFFFF' : 'transparent',
            fontWeight: activeMode === 'curate' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          <Compass size={13} />
          <span>Occasion Curate</span>
        </button>

        <button
          id="tab-stylist-festive"
          onClick={() => setActiveMode('festive')}
          style={{
            padding: '10px 8px',
            border: activeMode === 'festive' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeMode === 'festive' ? '#FFFFFF' : 'transparent',
            fontWeight: activeMode === 'festive' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          <Flame size={13} />
          <span>Indian Events</span>
        </button>
      </div>

      {/* View Mode 1: Conversational AI Stylist */}
      {activeMode === 'chat' && (
        <div className="editorial-card" style={{ padding: 0, overflow: 'hidden' }}>
          <ConversationalStylist
            wardrobe={wardrobe}
            profile={profile}
            userId={userId}
            savedOutfitIds={savedOutfitIds}
            onSaveOutfit={onSaveOutfit}
          />
        </div>
      )}

      {/* View Mode 2: Occasion Curate Grid */}
      {activeMode === 'curate' && (
        <div>
          {/* Step 1 & 2: Context Selector */}
          <div className="editorial-card" style={{ marginBottom: '18px', padding: '20px' }}>
            <label className="form-label" style={{ marginBottom: '10px' }}>1. Select Your Occasion</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {OCCASIONS.map(occ => {
                const isSelected = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    id={`occasion-${occ.id}`}
                    onClick={() => setSelectedOccasion(occ.id)}
                    style={{
                      padding: '12px 10px',
                      border: isSelected ? '2px solid var(--ink-primary)' : '1px solid var(--border-hairline)',
                      background: isSelected ? '#FFFFFF' : 'var(--bg-warm-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{occ.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: isSelected ? 800 : 600, color: 'var(--ink-primary)' }}>
                      {occ.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Climate Setting */}
            <div style={{ marginTop: '16px' }}>
              <label className="form-label">2. Climate & Setting</label>
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

            {/* Generate / Curate Button with double-tap lock */}
            <button
              id="btn-curate-outfit"
              className="btn-editorial-black"
              onClick={handleGenerate}
              disabled={isCurating}
              style={{ width: '100%', marginTop: '18px', justifyContent: 'center', padding: '14px 20px' }}
            >
              {isCurating ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={14} className="spin-animation" /> Curating Silhouettes...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={15} /> Curate Outfit Options from Closet
                </span>
              )}
            </button>

            {/* Exclusions Notice */}
            {excludedColorHexes.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: 'var(--ink-secondary)' }}>
                <ShieldCheck size={13} color="var(--ink-primary)" />
                <span>Strictly excluding {excludedColorHexes.length} colors per your Style DNA profile.</span>
              </div>
            )}
          </div>

          {/* Outfit Results Section */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Curated Ensembles ({curatedOutfits.filter(o => !o.isDisliked).length})
              </h3>
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-secondary)' }}>
                Owned-Clothes Verified
              </span>
            </div>

            {curatedOutfits.length === 0 ? (
              <div className="editorial-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <AlertTriangle size={24} style={{ margin: '0 auto 8px auto', color: '#B23A2B' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                  No Outfits Available
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', maxWidth: '340px', margin: '0 auto 16px auto' }}>
                  Your available clean closet items for this occasion are either in the laundry or conflict with your excluded colors.
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
                  onRemoveSlot={handleRemoveSlot}
                  onDislikeOutfit={handleDislikeOutfit}
                  onTryOn={setTryOnOutfit}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* View Mode 3: Indian Weddings & Festivals */}
      {activeMode === 'festive' && (() => {
        const festiveOutfit = curateFestiveLook(selectedFestiveEvent, wardrobe);
        const protocol = FESTIVE_PROTOCOLS[selectedFestiveEvent];

        return (
          <div>
            {/* Event Protocol Selector */}
            <div className="editorial-card" style={{ padding: '16px', marginBottom: '16px' }}>
              <label className="form-label" style={{ marginBottom: '10px' }}>Select Ceremony / Celebration</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {(Object.keys(FESTIVE_PROTOCOLS) as IndianFestiveEvent[]).map(evKey => {
                  const isSel = selectedFestiveEvent === evKey;
                  const proto = FESTIVE_PROTOCOLS[evKey];
                  return (
                    <button
                      key={evKey}
                      type="button"
                      onClick={() => setSelectedFestiveEvent(evKey)}
                      style={{
                        padding: '10px',
                        border: isSel ? '2px solid var(--ink-primary)' : '1px solid var(--border-hairline)',
                        background: isSel ? '#FFFFFF' : 'var(--bg-warm-light)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: isSel ? 800 : 600 }}>{proto.eventLabel}</div>
                      <div style={{ fontSize: '10px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                        {proto.idealColors.slice(0, 2).join(', ')}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Protocol Styling Guidance */}
              <div style={{ marginTop: '14px', background: '#FDFBF7', border: '1px solid var(--border-hairline)', padding: '12px', fontSize: '12px' }}>
                <div style={{ fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', fontSize: '11px' }}>
                  Ceremony Etiquette & Fabric Advice:
                </div>
                <ul style={{ margin: '0 0 0 16px', padding: 0, color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                  {protocol.etiquetteTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Curated Festive Look */}
            {festiveOutfit ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Curated Ensemble from Your Closet
                  </h3>
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
                    Ceremony Appropriate
                  </span>
                </div>

                <OutfitCard
                  outfit={festiveOutfit}
                  wardrobe={wardrobe}
                  onSaveOutfit={onSaveOutfit}
                  isSaved={savedOutfitIds.includes(festiveOutfit.id)}
                  onSwapPiece={handleSwapPiece}
                  onRemoveSlot={handleRemoveSlot}
                  onDislikeOutfit={handleDislikeOutfit}
                  onTryOn={setTryOnOutfit}
                />
              </div>
            ) : (
              <div className="editorial-card" style={{ textAlign: 'center', padding: '30px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                Your wardrobe currently lacks festive tops or kurtas. Consider cataloging an artisanal kurta to complete this ceremony capsule.
              </div>
            )}
          </div>
        );
      })()}

      {/* Experimental 2D Visual Try-On Modal */}
      <PersonalAvatarTryOnModal
        outfit={tryOnOutfit}
        onClose={() => setTryOnOutfit(null)}
        defaultFit={profile.preferredFits?.[0] || 'relaxed'}
      />
    </div>
  );
};
