import React, { useState } from 'react';
import type { WardrobeItem, CuratedOutfit, LookbookEntry } from './types/fashion';
import type { UserAccount, ExtendedFashionProfile, UserDataContainer } from './types/auth';
import { AuthDataManager, createDefaultProfile, DEMO_USERS } from './utils/authManager';
import { generateCuratedOutfits } from './utils/styleEngine';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import type { TabType } from './components/common/BottomNav';
import { HomeFeed } from './components/home/HomeFeed';
import { WardrobeView } from './components/wardrobe/WardrobeView';
import { StylistView } from './components/stylist/StylistView';
import { LookbookView } from './components/lookbook/LookbookView';
import { ProfileView } from './components/profile/ProfileView';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // 1. Session State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    // Check session or default to first demo user (Aarav) so visitor immediately sees a rich profile,
    // or can browse as guest / switch seamlessly.
    const active = AuthDataManager.getActiveSession();
    if (active) return active;
    
    // Seed initial session as Aarav if none
    const defaultUser = DEMO_USERS[0].account;
    AuthDataManager.setActiveSession(defaultUser);
    return defaultUser;
  });

  // 2. Per-User Isolated Data
  const [userData, setUserData] = useState<UserDataContainer>(() => {
    const userId = currentUser ? currentUser.id : 'guest_temp';
    return AuthDataManager.getUserData(userId);
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);



  // Persist isolated user data on mutation
  const persistContainer = (updated: UserDataContainer) => {
    setUserData(updated);
    AuthDataManager.saveUserData(updated.userId, updated);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Auth Handlers
  const handleAuthSuccess = (user: UserAccount, isNewRegistration?: boolean) => {
    setCurrentUser(user);
    const loadedData = AuthDataManager.getUserData(user.id);
    setUserData(loadedData);
    showToast(`Signed in as ${user.name}`);

    if (isNewRegistration || !loadedData.profile.isOnboardingCompleted) {
      setIsOnboardingOpen(true);
    }
  };

  const handleSignOut = () => {
    AuthDataManager.setActiveSession(null);
    setCurrentUser(null);
    const guestData = AuthDataManager.getUserData('guest_temp');
    setUserData(guestData);
    showToast('Signed out. Switched to Guest Mode.');
  };

  // Wardrobe Mutations
  const handleAddItem = (item: WardrobeItem) => {
    const updated: UserDataContainer = {
      ...userData,
      wardrobe: [item, ...userData.wardrobe]
    };
    persistContainer(updated);
    showToast(`Added "${item.name}" to private closet`);
  };

  const handleDeleteItem = (id: string) => {
    const updated: UserDataContainer = {
      ...userData,
      wardrobe: userData.wardrobe.filter(i => i.id !== id)
    };
    persistContainer(updated);
    showToast('Piece removed from wardrobe');
  };

  const handleToggleAvailability = (id: string) => {
    const updatedWardrobe = userData.wardrobe.map(item => {
      if (item.id !== id) return item;
      const nextStatus = !item.isAvailable;
      showToast(nextStatus ? 'Item marked ready in closet' : 'Item marked in laundry');
      return { ...item, isAvailable: nextStatus };
    });
    persistContainer({ ...userData, wardrobe: updatedWardrobe });
  };

  const handleIncrementWear = (id: string) => {
    const updatedWardrobe = userData.wardrobe.map(item => {
      if (item.id !== id) return item;
      const count = item.wearCount + 1;
      showToast(`Logged wear: now worn ${count} times!`);
      return { 
        ...item, 
        wearCount: count,
        lastWornDate: new Date().toISOString().split('T')[0]
      };
    });
    persistContainer({ ...userData, wardrobe: updatedWardrobe });
  };

  // Outfit & Lookbook Actions
  const handleSaveOutfit = (outfit: CuratedOutfit) => {
    if (userData.lookbook.some(entry => entry.outfit.id === outfit.id)) {
      const updatedLookbook = userData.lookbook.filter(entry => entry.outfit.id !== outfit.id);
      persistContainer({ ...userData, lookbook: updatedLookbook });
      showToast('Removed from saved lookbook');
      return;
    }

    const newEntry: LookbookEntry = {
      id: `look-${Date.now()}`,
      outfit,
      savedDate: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      occasionLabel: outfit.occasion.replace('_', ' ')
    };

    persistContainer({ ...userData, lookbook: [newEntry, ...userData.lookbook] });
    showToast('Saved to personal lookbook!');
  };

  const handleDeleteLookbookEntry = (id: string) => {
    const updatedLookbook = userData.lookbook.filter(entry => entry.id !== id);
    persistContainer({ ...userData, lookbook: updatedLookbook });
    showToast('Removed look from lookbook');
  };

  // Profile Updates
  const handleUpdateProfile = (updatedProfile: ExtendedFashionProfile) => {
    persistContainer({ ...userData, profile: updatedProfile });
    showToast('Profile updated');
  };

  const handleClearAppearanceInfo = () => {
    const updatedProfile: ExtendedFashionProfile = {
      ...userData.profile,
      optionalAppearance: {
        approximateCity: '',
        topSize: '',
        bottomSize: '',
        shoeSizeUk: '',
        undertoneVibe: 'unspecified'
      }
    };
    persistContainer({ ...userData, profile: updatedProfile });
    showToast('Optional appearance information cleared.');
  };

  // Data Sovereignty & Export
  const handleExportJson = () => {
    const backupData = {
      app: 'YO Style Atelier',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      account: currentUser ? { email: currentUser.email, name: currentUser.name } : 'Guest',
      profile: userData.profile,
      wardrobe: userData.wardrobe,
      lookbook: userData.lookbook
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yo-style-data-${userData.userId}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Personal data package JSON exported');
  };

  const handleResetToDemo = () => {
    if (currentUser) {
      const demo = DEMO_USERS.find(d => d.account.id === currentUser.id);
      if (demo) {
        persistContainer({
          userId: currentUser.id,
          profile: demo.profile,
          wardrobe: demo.wardrobe,
          lookbook: []
        });
        showToast(`Reset ${currentUser.name}'s closet to initial seed data`);
        return;
      }
    }
    const freshDefault: UserDataContainer = {
      userId: userData.userId,
      profile: createDefaultProfile(userData.userId, currentUser ? currentUser.name : 'Guest'),
      wardrobe: [],
      lookbook: []
    };
    persistContainer(freshDefault);
    showToast('Closet reset to clean defaults');
  };

  const handleWipeData = () => {
    if (currentUser) {
      AuthDataManager.deleteAccountAndData(currentUser.id);
      setCurrentUser(null);
      const guestData = AuthDataManager.getUserData('guest_temp');
      setUserData(guestData);
      showToast('Account and all isolated data permanently deleted.');
    } else {
      localStorage.removeItem(`yo_style_data_guest_temp`);
      setUserData(AuthDataManager.getUserData('guest_temp'));
      showToast('Guest closet data cleared.');
    }
  };

  // Featured Outfit computation
  const excludedHexes = userData.profile.colorExclusions.map(c => c.hex);
  const featuredEnsembles = generateCuratedOutfits({
    wardrobe: userData.wardrobe,
    occasion: 'festive_indian',
    weatherMood: 'breezy_evening',
    excludedColorHexes: excludedHexes
  });
  const featuredOutfit = featuredEnsembles.length > 0 ? featuredEnsembles[0] : null;
  const isFeaturedSaved = featuredOutfit ? userData.lookbook.some(e => e.outfit.id === featuredOutfit.id) : false;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* High-Fashion Masthead Header with User Session */}
      <Header 
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        wardrobeCount={userData.wardrobe.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Container */}
      <main style={{ flex: 1, paddingBottom: '70px' }}>
        {activeTab === 'home' && (
          <HomeFeed
            profile={userData.profile as any}
            wardrobe={userData.wardrobe}
            featuredOutfit={featuredOutfit}
            savedLookCount={userData.lookbook.length}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSaveOutfit={handleSaveOutfit}
            isFeaturedSaved={isFeaturedSaved}
          />
        )}

        {activeTab === 'wardrobe' && (
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
            <WardrobeView
              wardrobe={userData.wardrobe}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onToggleAvailability={handleToggleAvailability}
              onIncrementWear={handleIncrementWear}
              onUpdateItem={(updatedItem) => {
                const updatedWardrobe = userData.wardrobe.map(i => i.id === updatedItem.id ? updatedItem : i);
                persistContainer({ ...userData, wardrobe: updatedWardrobe });
                showToast(`Updated "${updatedItem.name}"`);
              }}
            />
          </div>
        )}

        {activeTab === 'stylist' && (
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
            <StylistView
              wardrobe={userData.wardrobe}
              profile={userData.profile as any}
              userId={userData.userId}
              excludedColorHexes={excludedHexes}
              savedOutfitIds={userData.lookbook.map(e => e.outfit.id)}
              onSaveOutfit={handleSaveOutfit}
            />
          </div>
        )}

        {activeTab === 'lookbook' && (
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
            <LookbookView
              entries={userData.lookbook}
              onDeleteEntry={handleDeleteLookbookEntry}
              onSelectOccasionTab={() => setActiveTab('stylist')}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px' }}>
            <ProfileView
              profile={userData.profile}
              wardrobe={userData.wardrobe}
              onUpdateProfile={handleUpdateProfile}
              onResetToDemo={handleResetToDemo}
              onWipeData={handleWipeData}
              onExportJson={handleExportJson}
              onClearAppearanceInfo={handleClearAppearanceInfo}
              currentUserEmail={currentUser?.email}
              onSignOut={handleSignOut}
            />
          </div>
        )}
      </main>

      {/* Mobile Fixed Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth Modal (Login / Register / Multi-User Switcher) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* 3-Step Skippable Onboarding Wizard */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        profile={userData.profile}
        onComplete={(updated) => {
          handleUpdateProfile(updated);
          setIsOnboardingOpen(false);
          showToast('Style DNA Onboarding Completed!');
        }}
        onSkipAll={() => {
          setIsOnboardingOpen(false);
          showToast('Onboarding skipped. You can configure your profile anytime in Style DNA.');
        }}
      />

      {/* Global Minimalist Toast */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '76px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-dark)',
            color: 'var(--ink-inverse)',
            padding: '8px 18px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 999,
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <CheckCircle2 size={14} color="#FFFFFF" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
