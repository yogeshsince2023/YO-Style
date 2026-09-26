import React, { useState, useEffect } from 'react';
import type { WardrobeItem, FashionCategory, Subcategory, WeatherMood, OccasionType, CuratedOutfit } from '../../types/fashion';
import type { PlannedOutfitEntry, TravelTripPlan, PurchaseEvaluation } from '../../types/intelligence';
import { 
  evaluatePurchase, 
  generateTravelCapsule, 
  fetchLiveWeather,
  loadPlannerEntries,
  savePlannerEntries,
  loadTravelPlans,
  saveTravelPlans,
  loadPurchaseEvaluations,
  savePurchaseEvaluations
} from '../../utils/wardrobeIntelligence';
import { 
  Calendar as CalendarIcon, 
  Briefcase, 
  HelpCircle, 
  CloudSun, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Sparkles,
  MapPin
} from 'lucide-react';

interface WardrobeIntelligenceViewProps {
  wardrobe: WardrobeItem[];
  userId: string;
  savedOutfits: CuratedOutfit[];
  onIncrementWear: (itemId: string) => void;
  onNavigateToStylist: () => void;
}

export const WardrobeIntelligenceView: React.FC<WardrobeIntelligenceViewProps> = ({
  wardrobe,
  userId,
  savedOutfits,
  onIncrementWear,
  onNavigateToStylist
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'planner' | 'travel' | 'purchase'>('planner');

  // Daily Planner State
  const [plannedEntries, setPlannedEntries] = useState<PlannedOutfitEntry[]>(() => loadPlannerEntries(userId));
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [weatherData, setWeatherData] = useState<{ tempC: number; condition: string; isRainy: boolean; isChilly: boolean }>({
    tempC: 25,
    condition: 'Pleasant & Clear',
    isRainy: false,
    isChilly: false
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedOutfitToSchedule, setSelectedOutfitToSchedule] = useState<string>('');

  // Travel Capsule State
  const [travelPlans, setTravelPlans] = useState<TravelTripPlan[]>(() => loadTravelPlans(userId));
  const [tripDest, setTripDest] = useState('');
  const [tripDays, setTripDays] = useState(3);
  const [tripClimate, setTripClimate] = useState<WeatherMood>('warm_sun');
  const [tripOccasion, setTripOccasion] = useState<OccasionType>('smart_casual');

  // Purchase Advisor State
  const [evaluations, setEvaluations] = useState<PurchaseEvaluation[]>(() => loadPurchaseEvaluations(userId));
  const [prospectiveName, setProspectiveName] = useState('');
  const [prospectiveCat, setProspectiveCat] = useState<Exclude<FashionCategory, 'all'>>('tops');
  const [prospectiveSub, setProspectiveSub] = useState<Subcategory>('linen_shirt');
  const [prospectiveColor, setProspectiveColor] = useState('Navy');
  const [prospectiveHex, setProspectiveHex] = useState('#1E293B');
  const [prospectivePrice, setProspectivePrice] = useState<string>('');
  const [latestEval, setLatestEval] = useState<PurchaseEvaluation | null>(null);

  const handleCatChange = (cat: Exclude<FashionCategory, 'all'>) => {
    setProspectiveCat(cat);
    if (cat === 'tops') setProspectiveSub('linen_shirt');
    else if (cat === 'bottoms') setProspectiveSub('wide_leg_trousers');
    else if (cat === 'ethnic') setProspectiveSub('short_kurta');
    else if (cat === 'outerwear') setProspectiveSub('unstructured_blazer');
    else if (cat === 'footwear') setProspectiveSub('leather_loafers');
  };

  // Sync state to scoped storage
  useEffect(() => {
    savePlannerEntries(userId, plannedEntries);
  }, [plannedEntries, userId]);

  useEffect(() => {
    saveTravelPlans(userId, travelPlans);
  }, [travelPlans, userId]);

  useEffect(() => {
    savePurchaseEvaluations(userId, evaluations);
  }, [evaluations, userId]);

  // Load weather
  useEffect(() => {
    let mounted = true;
    fetchLiveWeather(selectedCity).then(res => {
      if (mounted) {
        setWeatherData(res);
        setIsLoadingWeather(false);
      }
    });
    return () => { mounted = false; };
  }, [selectedCity]);

  // Handler: Schedule outfit
  const handleScheduleOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutfitToSchedule) return;

    const outfit = savedOutfits.find(o => o.id === selectedOutfitToSchedule);
    if (!outfit) return;

    const newEntry: PlannedOutfitEntry = {
      id: `plan-${Date.now()}`,
      date: scheduleDate,
      outfit,
      isWorn: false,
      weatherForecast: weatherData,
      createdAt: Date.now()
    };

    setPlannedEntries(prev => [newEntry, ...prev.filter(p => p.date !== scheduleDate)]);
    setSelectedOutfitToSchedule('');
  };

  const handleMarkWorn = (entryId: string) => {
    setPlannedEntries(prev => prev.map(entry => {
      if (entry.id !== entryId) return entry;
      // Increment wear count on all outfit items
      Object.values(entry.outfit.items).forEach(item => {
        if (item) onIncrementWear(item.id);
      });
      return { ...entry, isWorn: true };
    }));
  };

  const handleDeletePlan = (entryId: string) => {
    setPlannedEntries(prev => prev.filter(p => p.id !== entryId));
  };

  // Handler: Travel Capsule Generator
  const handleCreateTravelCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = generateTravelCapsule({
      destination: tripDest.trim() || 'Upcoming Trip',
      daysCount: Number(tripDays) || 3,
      climateMood: tripClimate,
      primaryOccasion: tripOccasion,
      wardrobe
    });

    setTravelPlans(prev => [plan, ...prev]);
    setTripDest('');
  };

  const handleDeleteTrip = (tripId: string) => {
    setTravelPlans(prev => prev.filter(t => t.id !== tripId));
  };

  // Handler: Purchase Evaluator
  const handleEvaluatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectiveName.trim()) return;

    const priceNum = prospectivePrice ? Number(prospectivePrice) : undefined;
    const result = evaluatePurchase({
      itemName: prospectiveName.trim(),
      category: prospectiveCat,
      subcategory: prospectiveSub,
      colorName: prospectiveColor,
      colorHex: prospectiveHex,
      priceInr: priceNum,
      wardrobe
    });

    setLatestEval(result);
    setEvaluations(prev => [result, ...prev]);
    setProspectiveName('');
    setProspectivePrice('');
  };

  const handleDeleteEval = (evalId: string) => {
    setEvaluations(prev => prev.filter(ev => ev.id !== evalId));
    if (latestEval?.id === evalId) setLatestEval(null);
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
          WARDROBE INTELLIGENCE & UTILITY
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Daily Planning & Advisory
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
          Maximize your closet utility. Plan your week, pack light, and evaluate new acquisitions objectively.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
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
          onClick={() => setActiveSubTab('planner')}
          style={{
            padding: '10px 8px',
            border: activeSubTab === 'planner' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeSubTab === 'planner' ? '#FFFFFF' : 'transparent',
            fontWeight: activeSubTab === 'planner' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)'
          }}
        >
          <CalendarIcon size={13} />
          <span>Daily Planner</span>
        </button>

        <button
          onClick={() => setActiveSubTab('travel')}
          style={{
            padding: '10px 8px',
            border: activeSubTab === 'travel' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeSubTab === 'travel' ? '#FFFFFF' : 'transparent',
            fontWeight: activeSubTab === 'travel' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)'
          }}
        >
          <Briefcase size={13} />
          <span>Travel Capsule</span>
        </button>

        <button
          onClick={() => setActiveSubTab('purchase')}
          style={{
            padding: '10px 8px',
            border: activeSubTab === 'purchase' ? '1px solid var(--ink-primary)' : '1px solid transparent',
            background: activeSubTab === 'purchase' ? '#FFFFFF' : 'transparent',
            fontWeight: activeSubTab === 'purchase' ? 800 : 600,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--ink-primary)'
          }}
        >
          <HelpCircle size={13} />
          <span>Do I Need This?</span>
        </button>
      </div>

      {/* SUB-TAB 1: DAILY PLANNER */}
      {activeSubTab === 'planner' && (
        <div>
          {/* Honest Open-Meteo Weather Banner */}
          <div className="editorial-card" style={{ padding: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CloudSun size={18} color="var(--ink-primary)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>
                    {isLoadingWeather ? 'Fetching forecast...' : `${weatherData.tempC}°C • ${weatherData.condition}`}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--ink-secondary)' }}>
                    Open-Meteo Public API (100% Free, ₹0 Cost, Zero Tracking)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={12} color="var(--ink-secondary)" />
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid var(--border-hairline)',
                    background: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="London">London</option>
                  <option value="Paris">Paris</option>
                </select>
              </div>
            </div>

            {/* Styling Weather Insight */}
            <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ink-secondary)', borderTop: '1px dashed var(--border-hairline)', paddingTop: '6px' }}>
              {weatherData.isRainy && '🌧️ Rain expected: Suede footwear excluded; consider waterproof outerwear.'}
              {weatherData.isChilly && '❄️ Cold weather: Outerwear layer or Nehru jacket recommended.'}
              {!weatherData.isRainy && !weatherData.isChilly && '☀️ Mild weather: Natural cotton and breathable linen weaves are ideal.'}
            </div>
          </div>

          {/* Schedule Outfit Form */}
          <div className="editorial-card" style={{ padding: '16px', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Schedule an Outfit for Your Rotation
            </h3>

            {savedOutfits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-warm-light)' }}>
                <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', margin: '0 0 8px 0' }}>
                  You don't have any saved outfits in your Lookbook yet.
                </p>
                <button
                  type="button"
                  onClick={onNavigateToStylist}
                  className="btn-editorial-black"
                  style={{ padding: '8px 14px', fontSize: '11px' }}
                >
                  <Sparkles size={12} style={{ marginRight: '6px' }} />
                  Curate Looks in AI Stylist
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleOutfit} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '8px', alignItems: 'flex-end' }}>
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="form-input"
                    style={{ padding: '8px', fontSize: '12px' }}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Choose Outfit</label>
                  <select
                    value={selectedOutfitToSchedule}
                    onChange={e => setSelectedOutfitToSchedule(e.target.value)}
                    className="form-select"
                    style={{ padding: '8px', fontSize: '12px' }}
                    required
                  >
                    <option value="">Select saved ensemble...</option>
                    {savedOutfits.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.title} ({o.occasion.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-editorial-black"
                  style={{ padding: '9px 16px', fontSize: '12px', whiteSpace: 'nowrap' }}
                >
                  Schedule
                </button>
              </form>
            )}
          </div>

          {/* Planned Schedule Horizon List */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Upcoming Schedule ({plannedEntries.length})
            </h3>

            {plannedEntries.length === 0 ? (
              <div className="editorial-card" style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                No planned outfits scheduled. Pick an ensemble above to plan ahead.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plannedEntries.map(entry => {
                  const isToday = entry.date === new Date().toISOString().split('T')[0];
                  return (
                    <div 
                      key={entry.id} 
                      className="editorial-card" 
                      style={{ 
                        padding: '14px',
                        borderLeft: isToday ? '4px solid var(--ink-primary)' : '1px solid var(--border-hairline)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                              {entry.date} {isToday && '(TODAY)'}
                            </span>
                            {entry.isWorn && (
                              <span style={{ fontSize: '9px', fontWeight: 800, background: '#E8F5E9', color: '#2E7D32', padding: '1px 5px' }}>
                                ✓ WORN (+1 WEAR LOGGED)
                              </span>
                            )}
                          </div>
                          <h4 style={{ fontSize: '15px', fontWeight: 900, margin: '2px 0 0 0' }}>
                            {entry.outfit.title}
                          </h4>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {!entry.isWorn && (
                            <button
                              onClick={() => handleMarkWorn(entry.id)}
                              className="btn-editorial-outline"
                              style={{ padding: '6px 10px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Mark as worn to increment wear count on all items"
                            >
                              <CheckCircle size={12} color="#2E7D32" />
                              <span>Mark Worn</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePlan(entry.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', padding: '4px' }}
                            title="Remove from schedule"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Outfit pieces preview pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {Object.entries(entry.outfit.items)
                          .filter(([, item]) => !!item)
                          .map(([slot, item]) => (
                            <span 
                              key={slot} 
                              style={{ 
                                fontSize: '11px', 
                                background: 'var(--bg-warm-light)', 
                                padding: '3px 8px', 
                                border: '1px solid var(--border-hairline)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item?.primaryColor }} />
                              <strong>{item?.name}</strong> ({slot})
                            </span>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CAPSULE TRAVEL PACKER */}
      {activeSubTab === 'travel' && (
        <div>
          {/* Packing Generator Form */}
          <div className="editorial-card" style={{ padding: '16px', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Generate Minimalist Travel Capsule
            </h3>

            <form onSubmit={handleCreateTravelCapsule} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Destination / Trip Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Goa Weekend, London Conference"
                    value={tripDest}
                    onChange={e => setTripDest(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Duration (Days)</label>
                  <select
                    value={tripDays}
                    onChange={e => setTripDays(Number(e.target.value))}
                    className="form-select"
                  >
                    <option value={2}>2 Days (Weekend Trip)</option>
                    <option value={3}>3 Days (Long Weekend)</option>
                    <option value={5}>5 Days (Work Week)</option>
                    <option value={7}>7 Days (Vacation)</option>
                    <option value={10}>10+ Days (Extended)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Expected Climate</label>
                  <select
                    value={tripClimate}
                    onChange={e => setTripClimate(e.target.value as WeatherMood)}
                    className="form-select"
                  >
                    <option value="warm_sun">Warm & Sunny (Light Linens)</option>
                    <option value="breezy_evening">Pleasant & Mild</option>
                    <option value="chilly_winter">Cold / Chilly (Layers)</option>
                    <option value="ac_indoor">AC Indoor / Conference</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Primary Occasion</label>
                  <select
                    value={tripOccasion}
                    onChange={e => setTripOccasion(e.target.value as OccasionType)}
                    className="form-select"
                  >
                    <option value="smart_casual">Smart Casual Exploration</option>
                    <option value="work_formal">Business Presentation</option>
                    <option value="festive_indian">Festive / Family Event</option>
                    <option value="weekend_brunch">Relaxed Holiday</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-editorial-black"
                style={{ padding: '12px', justifyContent: 'center', marginTop: '4px' }}
              >
                <Briefcase size={14} style={{ marginRight: '6px' }} />
                Pack Capsule from Owned Clothes
              </button>
            </form>
          </div>

          {/* Generated Capsules List */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Your Travel Capsules ({travelPlans.length})
            </h3>

            {travelPlans.length === 0 ? (
              <div className="editorial-card" style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                No travel capsules created yet. Enter trip details above to generate a lean packing matrix.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {travelPlans.map(plan => {
                  const packedWardrobeItems = wardrobe.filter(i => plan.packedItemIds.includes(i.id));
                  return (
                    <div key={plan.id} className="editorial-card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
                            {plan.daysCount} DAYS • {plan.climateMood.replace('_', ' ')} • ~{plan.suggestedLookCount} UNIQUE LOOKS
                          </div>
                          <h4 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', margin: '2px 0 0 0' }}>
                            {plan.tripTitle}
                          </h4>
                        </div>

                        <button
                          onClick={() => handleDeleteTrip(plan.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer' }}
                          title="Delete trip capsule"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Missing Essentials Warning if wardrobe is sparse */}
                      {plan.missingEssentials && plan.missingEssentials.length > 0 && (
                        <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', padding: '10px', marginBottom: '10px', fontSize: '11px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#F57F17', marginBottom: '2px' }}>
                            <AlertTriangle size={13} />
                            <span>SPARSE WARDROBE GAP</span>
                          </div>
                          <div style={{ color: 'var(--ink-primary)' }}>
                            Your clean closet has limited pieces for a {plan.daysCount}-day trip. Recommended additions:
                            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                              {plan.missingEssentials.map((m, idx) => <li key={idx}>{m}</li>)}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Packed Items List */}
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                          Packed Pieces ({packedWardrobeItems.length}):
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {packedWardrobeItems.map(item => (
                            <span 
                              key={item.id}
                              style={{
                                fontSize: '11px',
                                background: 'var(--bg-warm-light)',
                                border: '1px solid var(--border-hairline)',
                                padding: '4px 8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.primaryColor }} />
                              <strong>{item.name}</strong> ({item.category})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: "DO I NEED THIS?" PURCHASE ADVISOR */}
      {activeSubTab === 'purchase' && (
        <div>
          {/* Purchase Evaluator Form */}
          <div className="editorial-card" style={{ padding: '16px', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Evaluate Prospective Purchase
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', margin: '0 0 14px 0' }}>
              Checks for redundancies in your closet, counts compatible pairs, and projects honest utility.
            </p>

            <form onSubmit={handleEvaluatePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Navy Linen Blazer, Olive Chinos"
                    value={prospectiveName}
                    onChange={e => setProspectiveName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={prospectiveCat}
                    onChange={e => handleCatChange(e.target.value as Exclude<FashionCategory, 'all'>)}
                    className="form-select"
                  >
                    <option value="tops">Western Tops</option>
                    <option value="bottoms">Trousers / Bottoms</option>
                    <option value="ethnic">Ethnic / Kurta</option>
                    <option value="outerwear">Outerwear / Blazer</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Primary Color Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Navy, Charcoal, Olive"
                    value={prospectiveColor}
                    onChange={e => setProspectiveColor(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Color Swatch</label>
                  <input
                    type="color"
                    value={prospectiveHex}
                    onChange={e => setProspectiveHex(e.target.value)}
                    style={{ width: '100%', height: '36px', border: '1px solid var(--border-hairline)', cursor: 'pointer', padding: '2px' }}
                  />
                </div>

                <div>
                  <label className="form-label">Price (₹ Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2999"
                    value={prospectivePrice}
                    onChange={e => setProspectivePrice(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-editorial-black"
                style={{ padding: '12px', justifyContent: 'center', marginTop: '6px' }}
              >
                <HelpCircle size={14} style={{ marginRight: '6px' }} />
                Evaluate Against My Closet
              </button>
            </form>
          </div>

          {/* Latest Result Banner */}
          {latestEval && (
            <div 
              className="editorial-card" 
              style={{ 
                padding: '16px', 
                marginBottom: '18px',
                borderLeft: `4px solid ${
                  latestEval.verdict === 'redundant' ? '#B23A2B' :
                  latestEval.verdict === 'capsule_completer' ? '#2E7D32' : '#F57F17'
                }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      fontWeight: 800, 
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      background: latestEval.verdict === 'redundant' ? '#FFEBEE' :
                                  latestEval.verdict === 'capsule_completer' ? '#E8F5E9' : '#FFF8E1',
                      color: latestEval.verdict === 'redundant' ? '#B23A2B' :
                             latestEval.verdict === 'capsule_completer' ? '#2E7D32' : '#F57F17'
                    }}
                  >
                    {latestEval.verdictLabel}
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0 0 0' }}>
                    {latestEval.itemName}
                  </h4>
                </div>

                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-secondary)' }}>
                  +{latestEval.unlockedOutfitCount} Outfits Unlocked
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--ink-primary)', lineHeight: 1.5, margin: '8px 0' }}>
                {latestEval.verdictExplanation}
              </p>

              {latestEval.redundantItemNames.length > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '8px' }}>
                  <strong>Existing Similar Pieces Owned:</strong> {latestEval.redundantItemNames.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* History of Evaluations */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Past Evaluations ({evaluations.length})
            </h3>

            {evaluations.length === 0 ? (
              <div className="editorial-card" style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                No past evaluations saved.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {evaluations.map(ev => (
                  <div 
                    key={ev.id} 
                    className="editorial-card" 
                    style={{ 
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
                          {ev.verdictLabel}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>• +{ev.unlockedOutfitCount} looks</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>
                        {ev.itemName} ({ev.colorName})
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEval(ev.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', padding: '4px' }}
                      title="Delete evaluation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
