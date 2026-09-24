import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getCategoryBySlug as getStaticCategory, getProductsByCategory as getStaticProducts, productCategories } from '../data/productsData';
import { getCategoryBySlug, getProducts } from '../lib/supabase';
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  CheckCircle2,
  MoveUpRight,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();

  if (!categorySlug) {
    return <Navigate to="/products" replace />;
  }

  const [category, setCategory] = useState<any>(() => getStaticCategory(categorySlug));
  const [products, setProducts] = useState<any[]>(() => getStaticProducts(categorySlug));

  useEffect(() => {
    let mounted = true;
    if (categorySlug) {
      getCategoryBySlug(categorySlug).then((cat) => {
        if (mounted && cat) setCategory(cat);
      });
      getProducts().then((all) => {
        if (mounted && all) {
          const normTarget = categorySlug.toLowerCase();
          const matching = all.filter((p: any) => {
            const pCat = (p.category_slug || p.categorySlug || '').toLowerCase();
            return (
              pCat === normTarget ||
              (normTarget === 'non-pvc-acrysol' && pCat === 'non-pvc-inks') ||
              (normTarget === 'specialty-inks' && (pCat === 'speciality-inks' || pCat === 'specialty')) ||
              (normTarget === 'heat-transfer' && (pCat === 'heat-transfer-solutions' || pCat === 'heat-transfer')) ||
              (normTarget === 'craft-ink' && (pCat === 'craft-inks' || pCat === 'craft-ink'))
            );
          });
          if (matching.length > 0) setProducts(matching);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [categorySlug]);

  if (!category) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="category-page" style={{ paddingTop: '100px' }}>
      <Breadcrumbs
        items={[
          { label: 'Products', to: '/products' },
          { label: category.name },
        ]}
      />

      {/* Full-Width Category Mini-Banner with Ken Burns Animation */}
      <section className="category-hero-banner" style={{ position: 'relative', overflow: 'hidden', minHeight: '320px', display: 'flex', alignItems: 'center' }}>
        <div
          className="category-mini-banner-bg"
          style={{
            backgroundImage: `url("${category.bannerImage || category.banner_image_url}")`,
            filter: 'brightness(0.55)',
          }}
        />
        <div className="category-mini-banner-overlay" />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '60px 20px', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="accent-dot orange" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
              {category.categoryNumber || category.category_number}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.9rem, 5.5vw, 2.8rem)', color: '#FFFFFF', marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>
            {category.name}
          </h1>

          <p style={{ margin: 0, fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '720px', lineHeight: 1.65 }}>
            {category.description}
          </p>
        </div>
      </section>

      {/* Product Cards Grid Section */}
      <section className="section" style={{ backgroundColor: '#FAFAFA', paddingTop: '72px', paddingBottom: '96px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '0 0 6px', fontFamily: 'var(--font-heading)' }}>
                {category.shortName} Formulations ({products.length})
              </h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Download official Technical Data Sheets (TDS) or inspect formulation specifications for industrial screen print trials.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Other Categories:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    navigate(`/products/${e.target.value}`);
                  }
                }}
                defaultValue={category.slug}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {productCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Large Image-Led Product Cards (65% Photo Height) */}
          <div
            style={products.length === 1 ? { gridTemplateColumns: 'minmax(0, 420px)' } : undefined}
            className="category-products-grid"
          >
            {products.map((product) => (
              <div
                key={product.slug}
                className="product-card-visual"
                style={{
                  borderTop: `4px solid ${product.accentColor || product.accent_color || 'var(--color-primary)'}`,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-normal)',
                }}
              >
                {/* Large Product Macro Photo Frame (60-70% card height) */}
                <Link
                  to={`/products/${category.slug}/${product.slug}`}
                  className="product-img-frame hero-height"
                  style={{ position: 'relative', height: '300px', overflow: 'hidden', display: 'block' }}
                >
                  <img
                    src={product.image || product.image_url}
                    alt={`${product.name} ink print sample`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  <div className="card-wash-overlay" style={{ background: `linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, transparent 60%)` }} />

                  {/* Feature Badge */}
                  {product.badge && (
                    <div
                      className="product-img-badge"
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '16px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      <span>{product.badge}</span>
                    </div>
                  )}

                  {/* "View Full Details (PDF)" Badge */}
                  <div className="product-pdf-badge">
                    <FileText size={13} />
                    <span>View Full Details (PDF)</span>
                  </div>
                </Link>

                {/* Product Card Body */}
                <div className="product-card-body" style={{ padding: '24px 22px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: product.accentColor || product.accent_color || '#2B3A8F',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {product.tagline}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {product.code}</span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                      <Link
                        to={`/products/${category.slug}/${product.slug}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {product.name}
                      </Link>
                    </h3>

                    <p style={{ color: 'var(--text-body)', fontSize: '0.925rem', lineHeight: 1.65, marginBottom: '20px' }}>
                      {product.shortDesc || product.short_desc || product.description}
                    </p>

                    {/* Key Attribute Pills */}
                    {product.features && product.features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                        {product.features.slice(0, 3).map((feat: string, idx: number) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.75rem',
                              background: '#F3F4F6',
                              color: 'var(--text-body)',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontWeight: 600,
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Download PDF and View Details */}
                  <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                    <a
                      href={product.pdfUrl || product.pdf_url || `/assets/pdfs/${product.slug}.pdf`}
                      download={`${product.code}-TDS.pdf`}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </a>
                    <Link
                      to={`/products/${category.slug}/${product.slug}`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                    >
                      <span>View Details</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Inquiries Banner */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
                Require Custom Pantone Shades or Viscosity Adjustments?
              </h3>
              <p style={{ margin: 0, color: 'var(--text-body)', fontSize: '0.925rem' }}>
                Chemtech Polymers formulates custom color matchings for automatic printing presses upon inquiry.
              </p>
            </div>
            <Link
              to={`/contact?product=${encodeURIComponent(category.name)}`}
              className="btn btn-primary btn-sm"
              style={{ textDecoration: 'none' }}
            >
              <span>Request Custom Formulation</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .category-products-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
