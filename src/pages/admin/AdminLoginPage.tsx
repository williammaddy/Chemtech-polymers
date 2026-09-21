import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import chemtechLogo from '../../assets/Logo.png';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isAuthenticated, lockoutRemaining, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const rawFrom = (location.state as any)?.from?.pathname;
  const from = (!rawFrom || rawFrom === '/admin-secure-login' || rawFrom === '/admin' || rawFrom === '/admin/login' || rawFrom === '/admin-login')
    ? '/admin-secure-login/dashboard'
    : rawFrom;

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0 || isSubmitting) return;

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await login(email.trim(), password);

    setIsSubmitting(false);
    if (error) {
      setErrorMessage(error);
    } else {
      navigate(from, { replace: true });
    }
  };

  const isLockedOut = lockoutRemaining > 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(43, 58, 143, 0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(31, 169, 122, 0.15) 0px, transparent 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '40px 36px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <img src={chemtechLogo} alt="Chemtech Polymers" style={{ height: '42px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1E293B' }}>
            <ShieldCheck size={20} color="#2B3A8F" />
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
              Admin Portal
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
            Internal Management System • Authorized Personnel Only
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px',
              color: '#991B1B',
              fontSize: '13px',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Lockout Warning Banner */}
        {isLockedOut && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '20px',
              color: '#92400E',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <Lock size={16} />
            <span>Too many attempts. Cooldown: {lockoutRemaining}s</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
            >
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="#94A3B8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                id="admin-email"
                type="email"
                required
                disabled={isLockedOut || isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@chemtechpolymers.com"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px 0 42px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="#94A3B8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                id="admin-password"
                type="password"
                required
                disabled={isLockedOut || isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px 0 42px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLockedOut || isSubmitting}
            style={{
              height: '48px',
              backgroundColor: isLockedOut ? '#94A3B8' : '#2B3A8F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: isLockedOut || isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              boxShadow: isLockedOut ? 'none' : '0 4px 14px rgba(43, 58, 143, 0.35)',
              transition: 'background-color 0.2s ease',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Authenticating...</span>
              </>
            ) : isLockedOut ? (
              <span>Locked ({lockoutRemaining}s)</span>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Back to Live Site Link */}
        <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '6px',
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
