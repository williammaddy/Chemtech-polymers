import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        color: '#2B3A8F',
        gap: '16px',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '15px', color: '#64748B', fontWeight: 500 }}>
          Verifying Chemtech Admin Session...
        </p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-secure-login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
