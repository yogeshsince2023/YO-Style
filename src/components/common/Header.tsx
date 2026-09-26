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
  return (
    <>
      {/* Top Gazette Micro Notice Bar */}
      <div className="top-notice-bar">
        <span>
          {currentUser 
            ? `PRIVATE VAULT ACTIVE: ${currentUser.name.toUpperCase()} • STRICT PER-USER DATA ISOLATION` 
            : `GUEST PREVIEW MODE • PRIVATE LOCAL STORAGE • ZERO ADS`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span>{wardrobeCount} PIECES IN CLOSET</span>
          {!currentUser && (
            <button 
              onClick={onOpenAuth}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              SIGN IN / REGISTER →
            </button>
          )}
        </div>
      </div>

      {/* Main Luxury Masthead Header */}
      <header className="gazu-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <div 
              className="brand-masthead" 
              onClick={() => onNavigate('home')}
              style={{ cursor: 'pointer', lineHeight: 1 }}
            >
              YO STYLE
            </div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)', marginTop: '3px' }}>
              Know your style. Wear it better.
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="nav-links-row">
            <button 
              className={`nav-link-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              EDITORIAL
            </button>
            <button 
              className={`nav-link-item ${activeTab === 'wardrobe' ? 'active' : ''}`}
              onClick={() => onNavigate('wardrobe')}
            >
              CLOSET
            </button>
            <button 
              className={`nav-link-item ${activeTab === 'stylist' ? 'active' : ''}`}
              onClick={() => onNavigate('stylist')}
            >
              AI STYLIST
            </button>
            <button 
              className={`nav-link-item ${activeTab === 'planner' ? 'active' : ''}`}
              onClick={() => onNavigate('planner')}
            >
              PLANNER
            </button>
            <button 
              className={`nav-link-item ${activeTab === 'shopping' ? 'active' : ''}`}
              onClick={() => onNavigate('shopping')}
            >
              SHOP
            </button>
            <button 
              className={`nav-link-item ${activeTab === 'lookbook' ? 'active' : ''}`}
              onClick={() => onNavigate('lookbook')}
            >
              LOOKBOOK
            </button>
            <button 
              className={`nav-link-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => onNavigate('profile')}
            >
              STYLE DNA
            </button>
          </nav>
        </div>

        {/* Right Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => onNavigate('wardrobe')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}
            title="Search Closet"
          >
            <Search size={16} />
            <span className="hidden-mobile">SEARCH</span>
          </button>
          
          <button 
            onClick={() => {
              if (currentUser) {
                onNavigate('profile');
              } else {
                onOpenAuth();
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}
            title={currentUser ? `Signed in as ${currentUser.name}` : "Sign In / Register"}
          >
            {currentUser ? <UserCheck size={16} /> : <LogIn size={16} />}
            <span className="hidden-mobile">
              {currentUser ? currentUser.name.split(' ')[0].toUpperCase() : 'SIGN IN'}
            </span>
          </button>

          <button 
            onClick={() => onNavigate('lookbook')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}
            title="Saved Outfits"
          >
            <Bookmark size={16} />
          </button>
        </div>
      </header>
    </>
  );
};
