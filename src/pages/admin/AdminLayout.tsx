import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Package,
  FileText,
  Image as ImageIcon,
  BookOpen,
  PhoneCall,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import chemtechLogo from '../../assets/Logo.png';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Product Management', to: '/admin-secure-login/dashboard', icon: Package },
    { label: 'Product Doc Management', to: '/admin-secure-login/documents', icon: FileText },
    { label: 'Gallery Management', to: '/admin-secure-login/gallery', icon: ImageIcon },
    { label: 'Resource Management', to: '/admin-secure-login/resources', icon: BookOpen },
    { label: 'Contact Management', to: '/admin-secure-login/contact', icon: PhoneCall },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin-secure-login');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#0F172A',
      }}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 40,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'none',
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
        }}
        className="admin-sidebar"
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#2B3A8F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.2px' }}>
                Chemtech Admin
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Control Center</div>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'none',
            }}
            className="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 10px 6px' }}>
            Sections
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin-secure-login/dashboard'}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? '#2B3A8F' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* User info badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#CBD5E1',
            }}
          >
            <UserIcon size={16} color="#94A3B8" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || 'admin@chemtechpolymers.com'}
            </span>
          </div>

          {/* View Live Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              color: '#CBD5E1',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'background-color 0.15s ease',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ExternalLink size={16} />
              <span>View Live Site</span>
            </span>
          </a>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              color: '#F87171',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: '280px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
        className="admin-main-wrapper"
      >
        {/* Top Navbar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1E293B',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'none',
              }}
              className="sidebar-open-btn"
            >
              <Menu size={22} />
            </button>
            <img src={chemtechLogo} alt="Logo" style={{ height: '30px', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              Admin Session Active
            </span>
          </div>
        </header>

        {/* Child Views */}
        <main style={{ flex: 1, padding: '32px 28px', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%) !important;
          }
          .admin-sidebar[style*="translateX(0)"] {
            transform: translateX(0) !important;
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .sidebar-open-btn {
            display: block !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
