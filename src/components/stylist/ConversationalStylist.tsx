import React, { useState, useEffect, useRef } from 'react';
import type { WardrobeItem, FashionProfile, CuratedOutfit } from '../../types/fashion';
import type { ChatMessage, SessionPreference } from '../../types/chat';
import { 
  executeStylistChat, 
  loadUserChat, 
  saveUserChat, 
  clearUserChat, 
  exportUserChat 
} from '../../utils/conversationalEngine';
import { OutfitCard } from './OutfitCard';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Download, 
  Key, 
  ShieldCheck, 
  X, 
  Bot, 
  User
} from 'lucide-react';

interface ConversationalStylistProps {
  wardrobe: WardrobeItem[];
  profile: FashionProfile;
  userId: string;
  savedOutfitIds: string[];
  onSaveOutfit: (outfit: CuratedOutfit) => void;
}

const QUICK_PROMPTS = [
  'Style my green cargos for college',
  "I don't like white",
  'Keep the same outfit but change the shoes',
  'Make it more traditional',
  'Give me a cheaper option'
];

export const ConversationalStylist: React.FC<ConversationalStylistProps> = ({
  wardrobe,
  profile,
  userId,
  savedOutfitIds,
  onSaveOutfit
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const loaded = loadUserChat(userId);
    if (loaded.length > 0) return loaded;
    return [{
      id: 'welcome-msg',
      sender: 'stylist',
      text: `Hello ${profile.name || 'there'}. I am your YO Style personal stylist, grounded strictly in the clothes you own. What would you like to style today?`,
      timestamp: Date.now()
    }];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePreferences, setActivePreferences] = useState<SessionPreference[]>([]);
  const [activeEnsemble, setActiveEnsemble] = useState<CuratedOutfit | undefined>(() => {
    const lastWithOutfit = [...messages].reverse().find(m => m.outfit);
    return lastWithOutfit?.outfit;
  });

  // Optional Gemini API Key state
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('yo_style_gemini_key') || '');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Persist messages scoped to current user
  useEffect(() => {
    if (messages.length > 0) {
      saveUserChat(userId, messages);
    }
  }, [messages, userId]);

  const handleSend = React.useCallback(async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isProcessing) return;

    setInputQuery('');
    const ts = Date.now();
    const newUserMsg: ChatMessage = {
      id: `user-${ts}`,
      sender: 'user',
      text: query,
      timestamp: ts
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsProcessing(true);

    try {
      const response = await executeStylistChat({
        userPrompt: query,
        wardrobe,
        profile,
        activeOutfit: activeEnsemble,
        activePreferences,
        geminiApiKey: apiKey
      });

      setMessages(prev => [...prev, response]);

      if (response.outfit) {
        setActiveEnsemble(response.outfit);
      }

      if (response.detectedPreferences && response.detectedPreferences.length > 0) {
        setActivePreferences(prev => {
          const next = [...prev];
          for (const newPref of response.detectedPreferences!) {
            if (!next.some(p => p.type === newPref.type && p.value === newPref.value)) {
              next.push(newPref);
            }
          }
          return next;
        });
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'stylist',
          text: 'Encountered a temporary error connecting to styling engine. Please try again.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  }, [inputQuery, isProcessing, wardrobe, profile, activeEnsemble, activePreferences, apiKey]);

  const handleRemovePreference = (prefId: string) => {
    setActivePreferences(prev => prev.filter(p => p.id !== prefId));
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear your private conversation history? This cannot be undone.')) {
      clearUserChat(userId);
      setMessages([
        {
          id: 'welcome-fresh',
          sender: 'stylist',
          text: `Chat cleared. Ready for your next styling session!`,
          timestamp: Date.now()
        }
      ]);
      setActivePreferences([]);
      setActiveEnsemble(undefined);
    }
  };

  const handleExportHistory = () => {
    exportUserChat(messages, profile.name || 'User');
  };

  const handleSaveApiKey = (keyVal: string) => {
    setApiKey(keyVal);
    if (keyVal.trim()) {
      localStorage.setItem('yo_style_gemini_key', keyVal.trim());
    } else {
      localStorage.removeItem('yo_style_gemini_key');
    }
    setShowSettingsModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '680px' }}>
      {/* Stylist Top Control Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-hairline)',
          background: 'var(--bg-warm-light)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{ 
              width: '28px', 
              height: '28px', 
              background: 'var(--ink-primary)', 
              color: '#FFFFFF', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '2px' 
            }}
          >
            <Sparkles size={14} />
          </div>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Conversational Stylist
            </h3>
            <span style={{ fontSize: '10px', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={11} color="var(--ink-primary)" />
              {apiKey ? 'Gemini 1.5 Flash (Free Tier)' : '100% Offline Local Engine'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Configure AI Provider & Privacy"
            style={{
              padding: '6px 8px',
              border: '1px solid var(--border-hairline)',
              background: '#FFFFFF',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Key size={12} />
            <span>AI Key</span>
          </button>

          <button
            onClick={handleExportHistory}
            title="Export Consultation Transcript"
            style={{
              padding: '6px 8px',
              border: '1px solid var(--border-hairline)',
              background: '#FFFFFF',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Download size={12} />
            <span>Export</span>
          </button>

          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            style={{
              padding: '6px 8px',
              border: '1px solid var(--border-hairline)',
              background: '#FFFFFF',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#B23A2B',
              gap: '4px'
            }}
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Dynamic Session Memory / Preferences Bar */}
      {activePreferences.length > 0 && (
        <div 
          style={{ 
            padding: '8px 16px', 
            background: '#FDFBF7', 
            borderBottom: '1px solid var(--border-hairline)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-secondary)' }}>
            Session Memory:
          </span>
          {activePreferences.map(pref => (
            <span
              key={pref.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                background: 'var(--ink-primary)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '2px'
              }}
            >
              {pref.label}
              <button
                onClick={() => handleRemovePreference(pref.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
                title="Dismiss temporary rule"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tripartite Distinction Notice Banner */}
      <div 
        style={{ 
          padding: '6px 16px', 
          background: 'var(--bg-warm-light)', 
          fontSize: '11px', 
          color: 'var(--ink-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border-hairline)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2E7D32' }}></span>
          <strong>Owned Clothes</strong>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E65100' }}></span>
          <strong>Capsule Gap</strong> (Generic suggestion)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#757575' }}></span>
          <strong>Verified Retailer</strong> (Pending integration)
        </span>
      </div>

      {/* Chat Messages Stream */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}
      >
        {messages.map(msg => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {/* Sender Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', fontSize: '10px', color: 'var(--ink-secondary)' }}>
              {msg.sender === 'user' ? (
                <>
                  <span>{profile.name || 'You'}</span>
                  <User size={10} />
                </>
              ) : (
                <>
                  <Bot size={10} />
                  <span>YO Style Stylist</span>
                  {msg.isAiGenerated && (
                    <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '1px 4px', borderRadius: '2px', fontWeight: 800 }}>
                      AI
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              style={{
                maxWidth: '90%',
                padding: '12px 14px',
                background: msg.sender === 'user' ? 'var(--ink-primary)' : '#FFFFFF',
                color: msg.sender === 'user' ? '#FFFFFF' : 'var(--ink-primary)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-hairline)',
                fontSize: '13px',
                lineHeight: '1.5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              {msg.text}
            </div>

            {/* Embedded Curated Outfit Card if returned */}
            {msg.outfit && (
              <div style={{ width: '100%', maxWidth: '480px', marginTop: '10px' }}>
                <OutfitCard
                  outfit={msg.outfit}
                  wardrobe={wardrobe}
                  onSaveOutfit={onSaveOutfit}
                  isSaved={savedOutfitIds.includes(msg.outfit.id)}
                  onSwapPiece={(_outfitId, slot, newItem) => {
                    const updated = {
                      ...msg.outfit!,
                      items: {
                        ...msg.outfit!.items,
                        [slot]: newItem
                      }
                    };
                    setActiveEnsemble(updated);
                  }}
                  onRemoveSlot={(_outfitId, slot) => {
                    const nextItems = { ...msg.outfit!.items };
                    delete nextItems[slot];
                    setActiveEnsemble({ ...msg.outfit!, items: nextItems });
                  }}
                  onDislikeOutfit={() => {}}
                />
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#FFFFFF', border: '1px solid var(--border-hairline)', width: 'fit-content' }}>
            <Sparkles size={14} className="spin-animation" />
            <span style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Stylist is reasoning over your wardrobe...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Pills Bar */}
      <div 
        style={{ 
          padding: '8px 16px', 
          background: 'var(--bg-warm-light)', 
          borderTop: '1px solid var(--border-hairline)',
          overflowX: 'auto',
          display: 'flex',
          gap: '8px',
          whiteSpace: 'nowrap'
        }}
      >
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isProcessing}
            style={{
              padding: '6px 12px',
              background: '#FFFFFF',
              border: '1px solid var(--border-hairline)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Query Input Box */}
      <div 
        style={{ 
          padding: '12px 16px', 
          borderTop: '1px solid var(--border-hairline)',
          background: '#FFFFFF',
          display: 'flex',
          gap: '8px'
        }}
      >
        <input
          id="stylist-chat-input"
          type="text"
          placeholder="Ask anything (e.g. 'Style my green cargos', 'Make it traditional', 'Change shoes')..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={isProcessing}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid var(--border-hairline)',
            fontSize: '13px',
            fontFamily: 'inherit',
            outline: 'none'
          }}
        />
        <button
          id="btn-send-chat"
          className="btn-editorial-black"
          onClick={() => handleSend()}
          disabled={isProcessing || !inputQuery.trim()}
          style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Send size={14} />
          <span>Ask</span>
        </button>
      </div>

      {/* Settings & Privacy Modal */}
      {showSettingsModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div className="editorial-card" style={{ maxWidth: '440px', width: '100%', padding: '24px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                AI Engine & Privacy Settings
              </h3>
              <button onClick={() => setShowSettingsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '14px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Strict Privacy Guarantee:</strong> Your wardrobe photos are <strong>never</strong> transmitted to any AI provider. Only sanitized text metadata (category, color, fabric, fit) is processed.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Free Quota:</strong> Google Gemini 1.5 Flash provides 15 Requests Per Minute (RPM) and 1,500 Requests Per Day at ₹0 cost.
              </p>
            </div>

            <label className="form-label">Gemini API Key (Optional)</label>
            <input
              type="password"
              placeholder="Paste AI Studio API Key (leave empty for local offline engine)"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border-hairline)',
                fontSize: '12px',
                marginBottom: '14px',
                fontFamily: 'monospace'
              }}
            />

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                className="btn-editorial-outline"
                onClick={() => setShowSettingsModal(false)}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                Cancel
              </button>
              <button
                className="btn-editorial-black"
                onClick={() => handleSaveApiKey(apiKey)}
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Save Preference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
