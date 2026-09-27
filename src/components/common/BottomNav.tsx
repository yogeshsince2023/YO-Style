import React from 'react';
import { Home, Shirt, Sparkles, CalendarDays, User } from 'lucide-react';

export type TabType = 'home' | 'wardrobe' | 'stylist' | 'planner' | 'shopping' | 'lookbook' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'wardrobe' as TabType, label: 'Closet', icon: Shirt },
    { id: 'stylist' as TabType, label: 'Style', icon: Sparkles },
    { id: 'planner' as TabType, label: 'Plan', icon: CalendarDays },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main Navigation">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onChangeTab(tab.id)}
            className={`nav-tab ${isActive ? 'active' : ''}`}
            aria-selected={isActive}
            role="tab"
          >
            <Icon size={20} />
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
