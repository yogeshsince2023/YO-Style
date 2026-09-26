import React, { useState } from 'react';
import type { UserAccount } from '../../types/auth';
import { AuthDataManager, hashPassword, DEMO_USERS } from '../../utils/authManager';
import { Lock, Mail, User, ShieldCheck, X, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount, isNewRegistration?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validation
    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Security requirement: Password must be at least 8 characters long.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your preferred name or nickname.');
      return;
    }

    setIsSubmitting(true);

    try {
      const users = AuthDataManager.getUsersRegistry();
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (mode === 'register') {
        if (existingUser) {
          setError('An account with this email address already exists. Please log in.');
          setIsSubmitting(false);
          return;
        }

        const passwordHash = await hashPassword(password);
        const newUser: UserAccount = {
          id: `user-${Date.now()}`,
          email: email.trim().toLowerCase(),
          passwordHash,
          name: name.trim(),
          createdAt: Date.now(),
          lastLoginAt: Date.now()
        };

        AuthDataManager.saveUserToRegistry(newUser);
        AuthDataManager.setActiveSession(newUser);
        setIsSubmitting(false);
        onSuccess(newUser, true);
        onClose();
      } else {
        if (!existingUser) {
          setError('No account found with this email. Please check your spelling or register.');
          setIsSubmitting(false);
          return;
        }

        const passwordHash = await hashPassword(password);
        // For demo pre-seeded accounts or standard hashed matches
        const isValid = existingUser.passwordHash === passwordHash || 
                        existingUser.passwordHash.startsWith('demo_hash_');

        if (!isValid) {
          setError('Incorrect password. Please verify your credentials.');
          setIsSubmitting(false);
          return;
        }

        existingUser.lastLoginAt = Date.now();
        AuthDataManager.saveUserToRegistry(existingUser);
        AuthDataManager.setActiveSession(existingUser);
        setIsSubmitting(false);
        onSuccess(existingUser, false);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError('Authentication failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDemoSwitch = (demoKey: 'aarav' | 'priya') => {
    const demo = DEMO_USERS.find(d => d.account.id.includes(demoKey));
    if (demo) {
      AuthDataManager.setActiveSession(demo.account);
      onSuccess(demo.account, false);
      onClose();
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="drawer-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '440px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
              PRIVATE FASHION VAULT
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', marginTop: '2px' }}>
              {mode === 'login' ? 'Sign In to YO Style' : 'Create Private Account'}
            </h2>
          </div>
          <button onClick={onClose} style={{ padding: '4px', color: 'var(--ink-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-hairline)', marginBottom: '18px' }}>
          <button 
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: mode === 'login' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              borderBottom: mode === 'login' ? '2px solid var(--ink-primary)' : 'none'
            }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: mode === 'register' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              borderBottom: mode === 'register' ? '2px solid var(--ink-primary)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div style={{ padding: '10px 12px', background: '#FFECEB', border: '1px solid #FF5C5C', color: '#B23A2B', fontSize: '12px', marginBottom: '14px', borderRadius: 'var(--radius-xs)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuthSubmit}>
          {mode === 'register' && (
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" htmlFor="auth-name">Your Preferred Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                <input 
                  id="auth-name"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Priya or Aarav"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" htmlFor="auth-email">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
              <input 
                id="auth-email"
                type="email" 
                className="form-input" 
                placeholder="you@domain.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="auth-password">Password *</label>
              <span style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>Min 8 chars</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
              <input 
                id="auth-password"
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-editorial-black"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isSubmitting ? 'Authenticating...' : (mode === 'login' ? 'Sign In Securely' : 'Create Private Profile')}
          </button>
        </form>

        {/* Demo Account Switcher (For testing isolation immediately) */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-secondary)', display: 'block', marginBottom: '8px' }}>
            Test Instant Multi-User Data Isolation:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoSwitch('aarav')}
              style={{
                padding: '8px 10px',
                border: '1px solid var(--border-hairline)',
                background: 'var(--bg-warm-light)',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={14} />
              <span>Aarav (Western & Fusion)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSwitch('priya')}
              style={{
                padding: '8px 10px',
                border: '1px solid var(--border-hairline)',
                background: 'var(--bg-warm-light)',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={14} />
              <span>Priya (Handloom & Ethnic)</span>
            </button>
          </div>
        </div>

        {/* Privacy Assurance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: 'var(--ink-secondary)', fontSize: '11px' }}>
          <ShieldCheck size={16} color="var(--ink-primary)" />
          <span>Passwords are salted & hashed using Web Crypto SHA-256. Zero tracker leak.</span>
        </div>
      </div>
    </div>
  );
};
