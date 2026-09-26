import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="drawer-sheet" 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '2px' }}>{subtitle}</p>}
          </div>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              color: 'var(--ink-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
