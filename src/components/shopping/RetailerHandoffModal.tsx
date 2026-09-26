import React from 'react';
import type { VerifiedRetailerItem } from '../../types/shopping';
import { ExternalLink, X, ShieldCheck, Clock } from 'lucide-react';
import { isPriceStale } from '../../utils/shoppingEngine';

interface RetailerHandoffModalProps {
  item: VerifiedRetailerItem | null;
  onClose: () => void;
}

export const RetailerHandoffModal: React.FC<RetailerHandoffModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const stale = isPriceStale(item.lastVerifiedDate);

  const handleProceed = () => {
    window.open(item.retailerUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div 
      className="drawer-backdrop" 
      onClick={onClose}
      role="dialog" 
      aria-modal="true"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1100 }}
    >
      <div 
        className="editorial-card" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '460px', width: '100%', padding: '24px', background: '#FFFFFF' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', background: '#E8F5E9', color: '#2E7D32', padding: '1px 6px', borderRadius: '2px' }}>
                VERIFIED PARTNER STORE
              </span>
              <span style={{ fontSize: '10px', color: 'var(--ink-secondary)' }}>
                {item.retailerName}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
              Leaving YO Style
            </h3>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--ink-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Item Summary Card */}
        <div style={{ display: 'flex', gap: '14px', background: 'var(--bg-warm-light)', padding: '12px', border: '1px solid var(--border-hairline)', marginBottom: '16px' }}>
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            style={{ width: '64px', height: '80px', objectFit: 'cover' }} 
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
              {item.brand}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '4px' }}>
              {item.name}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--ink-primary)' }}>
              ₹{item.priceInr.toLocaleString('en-IN')}
            </div>

            {/* Sizes & Verification */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '10px', color: 'var(--ink-secondary)' }}>
              <span>Sizes: {item.sizesAvailable.join(', ')}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={10} />
                Verified: {item.lastVerifiedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stale Price Notice if applicable */}
        {stale && (
          <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', padding: '8px 10px', fontSize: '11px', color: '#F57F17', marginBottom: '14px' }}>
            Notice: Price was last verified over 30 days ago. Current retailer pricing or stock may differ.
          </div>
        )}

        {/* Transparency & Checkout Clarification */}
        <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            Checkout and payment will take place directly on <strong>{item.retailerName}</strong>. YO Style does not process payments or manage orders.
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: 'var(--ink-muted)' }}>
            <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Affiliate Disclosure:</strong> If you purchase through this link, YO Style may earn a small referral commission at no additional cost to you.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn-editorial-outline"
            onClick={onClose}
            style={{ padding: '10px 16px', fontSize: '12px' }}
          >
            Stay on YO Style
          </button>
          <button
            type="button"
            className="btn-editorial-black"
            onClick={handleProceed}
            style={{ padding: '10px 18px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Proceed to {item.brand}</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
