import React from 'react';
import { Search, Bookmark, LogIn, UserCheck } from 'lucide-react';
import type { TabType } from './BottomNav';
import type { UserAccount } from '../../types/auth';

interface HeaderProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  wardrobeCount: number;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onNavigate, 
  wardrobeCount,
  currentUser,
  onOpenAuth
}) => {
  const navItems: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'wardrobe', label: 'Closet' },
    { id: 'stylist', label: 'Stylist' },
    { id: 'planner', label: 'Planner' },
    { id: 'shopping', label: 'Shop' },
    { id: 'lookbook', label: 'Lookbook' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <header className="showroom-header">
      {/* Brand */}
      <div 
        className="showroom-brand" 
        onClick={() => onNavigate('home')}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="showroom-brand-dot" />
            <span>YO Style</span>
          </div>
          <div className="showroom-brand-sub">
            Know your style. Wear it better.
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="showroom-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`showroom-nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="showroom-header-actions">
        <button
          className="showroom-icon-btn"
          onClick={() => onNavigate('wardrobe')}
          title={`Search Closet (${wardrobeCount} pieces)`}
        >
          <Search size={16} />
        </button>

        <button
          className="showroom-icon-btn"
          onClick={() => onNavigate('lookbook')}
          title="Saved Outfits"
        >
          <Bookmark size={16} />
        </button>

        <button
          className="showroom-icon-btn"
          onClick={() => {
            if (currentUser) {
              onNavigate('profile');
            } else {
              onOpenAuth();
            }
          }}
          title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign In'}
          style={currentUser ? { background: 'var(--accent-lime)', borderColor: 'var(--accent-lime)' } : {}}
        >
          {currentUser ? <UserCheck size={16} /> : <LogIn size={16} />}
        </button>
      </div>
    </header>
  );
};
