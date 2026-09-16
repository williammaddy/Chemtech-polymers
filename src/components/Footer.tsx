import React from 'react';
import { Link } from 'react-router-dom';
import { ChemtechLogo } from './ChemtechLogo';
import {
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { productCategories } from '../data/productsData';
import { articlesData } from '../data/articlesData';
import { CONTACT_INFO } from '../config/contactInfo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-neutral-dark)',
        color: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '36px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Top Accent Border with 5 Logo Dot Colors */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #E8A33D 0%, #D9483A 25%, #6B4FA0 50%, #1E8FA6 75%, #D9A441 100%)',
        }}
      />

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.8fr 1.1fr 1.1fr 1fr',
            gap: '40px',
            marginBottom: '60px',
          }}
          className="footer-grid-5"
        >
          {/* Col 1: Brand & Profile */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <ChemtechLogo size="lg" variant="footer" lightText={true} />
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.72)',
                fontSize: '0.925rem',
                lineHeight: 1.7,
                marginBottom: '24px',
                maxWidth: '320px',
              }}
            >
              Leading Indian manufacturer of high-quality textile screen printing inks. Formulating vibrant pigments,
              unmatched wash durability, and eco-certified chemistry for industrial decorators worldwide.
            </p>

            {/* Trust Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                <span className="accent-dot teal" />
                <span>100% Phthalate & PVC-Free Alternatives</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                <span className="accent-dot orange" />
                <span>ZDHC MRSL Level 3 Aligned Formulations</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.05rem',
                marginBottom: '20px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'About Chemtech', to: '/about' },
                { label: 'Product Catalogue', to: '/products' },
                { label: 'Technical Resources', to: '/resources' },
                { label: 'Contact & Inquiries', to: '/contact' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    style={{
                      color: 'rgba(255, 255, 255, 0.72)',
                      fontSize: '0.925rem',
                      display: 'inline-block',
                      transition: 'color 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Product Categories */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.05rem',
                marginBottom: '20px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Product Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {productCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/products/${cat.slug}`}
                    style={{
                      color: 'rgba(255, 255, 255, 0.72)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'color 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)')}
                  >
                    <span className="accent-dot blue" style={{ width: '5px', height: '5px' }} />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Technical Resources */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.05rem',
                marginBottom: '20px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Application Guides
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {articlesData.slice(0, 5).map((article) => (
                <li key={article.slug}>
                  <Link
                    to={`/resources/${article.slug}`}
                    style={{
                      color: 'rgba(255, 255, 255, 0.72)',
                      fontSize: '0.85rem',
                      display: 'block',
                      lineHeight: 1.4,
                      transition: 'color 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)')}
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Factory Inquiries */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.05rem',
                marginBottom: '20px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Direct Inquiries
            </h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '14px' }}>
              Technical trial formulations and bulk manufacturing supply:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              <div><strong>Support:</strong> {CONTACT_INFO.phoneSupport}</div>
              <div><strong>Sales:</strong> {CONTACT_INFO.phoneSales}</div>
              <div><strong>Email:</strong> {CONTACT_INFO.emailPrimary}</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.78rem' }}>
                {CONTACT_INFO.hours}
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={scrollToTop}
                className="btn btn-outline btn-sm"
                style={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.8rem',
                }}
              >
                <ArrowUp size={15} />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.55)',
          }}
          className="footer-bottom"
        >
          <div>
            © {new Date().getFullYear()} Chemtech Polymers. All Rights Reserved. Engineered in India.
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/products" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none', padding: '6px 0', minHeight: '36px', display: 'inline-flex', alignItems: 'center' }}>
              Technical Spec Sheets (TDS)
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
            <Link to="/resources" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none', padding: '6px 0', minHeight: '36px', display: 'inline-flex', alignItems: 'center' }}>
              Application Knowledge Base
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
            <Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.65)', textDecoration: 'none', padding: '6px 0', minHeight: '36px', display: 'inline-flex', alignItems: 'center' }}>
              Sample Requests
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1120px) {
          .footer-grid-5 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .footer-grid-5 {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
            gap: 16px !important;
          }
          .footer-grid-5 a {
            padding: 6px 0 !important;
            min-height: 40px !important;
            display: inline-flex !important;
            align-items: center !important;
          }
        }
      `}</style>
    </footer>
  );
};
