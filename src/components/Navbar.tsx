import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  Droplets,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Palette,
  FileText,
  Phone
} from 'lucide-react';
import chemtechLogo from '../assets/Logo.png';
import { productCategories } from '../data/productsData';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Droplets,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Palette,
};

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [mobileProductsExpanded, setMobileProductsExpanded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
    setMobileProductsExpanded(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Scroll detection for navbar background styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside and ESC listeners for mega-menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProductsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Products', to: '/products', hasDropdown: true },
    { label: 'Resources', to: '/resources' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={`site-header ${!isTransparent ? 'is-scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '76px',
        zIndex: 1000,
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        backgroundColor: isTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.42)',
        backdropFilter: isTransparent ? 'none' : 'blur(18px)',
        WebkitBackdropFilter: isTransparent ? 'none' : 'blur(18px)',
        borderBottom: isTransparent ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.50)',
        boxShadow: isTransparent ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Brand Logo with responsive scaling */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}>
          <img
            src={chemtechLogo}
            alt="Chemtech Polymers"
            className="navbar-brand-logo"
            style={{
              filter: isTransparent
                ? 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45))'
                : 'none',
              transition: 'filter 0.3s ease',
            }}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.to);

            if (item.hasDropdown) {
              return (
                <div key={item.to} ref={dropdownRef} style={{ position: 'relative' }} className="nav-dropdown-wrapper">
                  <button
                    type="button"
                    onClick={handleProductsClick}
                    aria-expanded={isProductsDropdownOpen}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.925rem',
                      fontWeight: isActive || isProductsDropdownOpen ? 700 : 600,
                      color: isTransparent
                        ? (isActive || isProductsDropdownOpen ? '#60A5FA' : '#FFFFFF')
                        : (isActive || isProductsDropdownOpen ? 'var(--primary-color)' : 'var(--text-main)'),
                      textShadow: isTransparent ? '0 1px 4px rgba(0, 0, 0, 0.5)' : 'none',
                      position: 'relative',
                      padding: '6px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'color var(--transition-fast)',
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={15}
                      style={{
                        transition: 'transform 0.25s ease',
                        transform: isProductsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: isTransparent
                          ? (isActive || isProductsDropdownOpen ? '#60A5FA' : '#FFFFFF')
                          : (isActive || isProductsDropdownOpen ? 'var(--primary-color)' : 'var(--text-main)'),
                      }}
                    />
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '16px',
                          height: '2.5px',
                          backgroundColor: isTransparent ? '#60A5FA' : 'var(--primary-color)',
                          borderRadius: '2px',
                        }}
                      />
                    )}
                  </button>

                  {/* Mega-Menu Dropdown Panel */}
                  {isProductsDropdownOpen && (
                    <div className="mega-menu-panel">
                      <div className="mega-menu-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="accent-dot orange" />
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              color: 'var(--primary-color)',
                            }}
                          >
                            Explore Product Categories
                          </span>
                        </div>
                        <Link
                          to="/products"
                          onClick={() => setIsProductsDropdownOpen(false)}
                          className="mega-menu-view-all"
                        >
                          <span>Full Catalogue Overview</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>

                      <div className="mega-menu-grid">
                        {productCategories.map((cat) => {
                          const IconComponent = iconMap[cat.iconName] || Droplets;
                          return (
                            <Link
                              key={cat.slug}
                              to={`/products/${cat.slug}`}
                              onClick={() => setIsProductsDropdownOpen(false)}
                              className="mega-menu-item"
                            >
                              <div className="mega-menu-item-icon" style={{ backgroundColor: `${cat.accentColor}15` }}>
                                <IconComponent size={20} color={cat.accentColor} />
                              </div>
                              <div className="mega-menu-item-content">
                                <div className="mega-menu-item-title">{cat.name}</div>
                                <div className="mega-menu-item-desc">{cat.description}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="mega-menu-footer">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <FileText size={13} color="var(--primary-color)" />
                          <span>Every product features a dedicated page with embedded Technical Data Sheet (TDS).</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isTransparent
                    ? (isActive ? '#60A5FA' : '#FFFFFF')
                    : (isActive ? 'var(--primary-color)' : 'var(--text-main)'),
                  textShadow: isTransparent ? '0 1px 4px rgba(0, 0, 0, 0.5)' : 'none',
                  position: 'relative',
                  padding: '6px 0',
                  transition: 'color var(--transition-fast)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = isTransparent ? '#93C5FD' : 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = isTransparent ? '#FFFFFF' : 'var(--text-main)';
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '2.5px',
                      backgroundColor: isTransparent ? '#60A5FA' : 'var(--primary-color)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="nav-cta-wrapper">
          <Link
            to="/contact"
            className="btn btn-primary btn-sm desktop-only-btn"
            style={{ padding: '9px 20px', borderRadius: 'var(--radius-md)', textDecoration: 'none' }}
          >
            <span>Get in Touch</span>
            <ArrowUpRight size={16} />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className="mobile-toggle-btn"
            style={{ color: isTransparent ? '#FFFFFF' : 'var(--primary-color)' }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.to);

            if (item.hasDropdown) {
              return (
                <div key={item.to} style={{ display: 'flex', flexDirection: 'column' }}>
                  <button
                    type="button"
                    onClick={() => setMobileProductsExpanded(!mobileProductsExpanded)}
                    aria-expanded={mobileProductsExpanded}
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                    style={{
                      border: 'none',
                      background: isActive ? 'var(--primary-light)' : 'transparent',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transition: 'transform 0.25s ease',
                        transform: mobileProductsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>

                  {/* Mobile Accordion */}
                  {mobileProductsExpanded && (
                    <div className="mobile-accordion-content">
                      <Link
                        to="/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mobile-category-all"
                      >
                        <span>View All Products in Catalogue →</span>
                      </Link>

                      {productCategories.map((cat) => {
                        const IconComponent = iconMap[cat.iconName] || Droplets;
                        return (
                          <Link
                            key={cat.slug}
                            to={`/products/${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="mobile-category-item"
                          >
                            <div className="mobile-category-icon" style={{ backgroundColor: `${cat.accentColor}15` }}>
                              <IconComponent size={16} color={cat.accentColor} />
                            </div>
                            <div>
                              <div className="mobile-category-title">{cat.name}</div>
                              <div className="mobile-category-desc">{cat.shortName} Formulations</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <span>{item.label}</span>
                {isActive && <span className="accent-dot blue" />}
              </Link>
            );
          })}

          <div style={{ paddingTop: '16px', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%', minHeight: '48px', justifyContent: 'center', textDecoration: 'none' }}
            >
              <Phone size={16} />
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
