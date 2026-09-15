import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  getProductBySlug,
  getCategoryBySlug,
  getRelatedProducts
} from '../data/productsData';
import {
  Download,
  Package,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  ArrowRight,
  FileText,
  Sparkles,
  Check
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();

  if (!categorySlug || !productSlug) {
    return <Navigate to="/products" replace />;
  }

  const product = getProductBySlug(productSlug);
  const category = getCategoryBySlug(categorySlug);

  if (!product || !category) {
    return <Navigate to="/products" replace />;
  }

  const relatedProducts = getRelatedProducts(product.slug, 3);

  // Sample Batch Request Modal State
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSampleModalOpen) {
        setIsSampleModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSampleModalOpen]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = 'CT-SMPL-' + Math.floor(10000 + Math.random() * 90000);
    setReferenceId(randomRef);
    setIsSubmitted(true);
  };

  const handleCloseModal = () => {
    setIsSampleModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', company: '', email: '', phone: '', notes: '' });
    }, 300);
  };

  /* ==========================================================================
     PDF SPEC SHEET PATH:
     Opens/downloads the actual technical data sheet PDF directly.
     ========================================================================== */
  const pdfFilePath = product.pdfUrl || `/assets/pdfs/${product.slug}.pdf`;

  return (
    <div className="product-detail-page" style={{ paddingTop: '100px', backgroundColor: '#FAFAFA' }}>
      <Breadcrumbs
        items={[
          { label: 'Products', to: '/products' },
          { label: category.name, to: `/products/${category.slug}` },
          { label: product.name },
        ]}
      />

      {/* Product Hero & Overview Section */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', paddingTop: '44px', paddingBottom: '72px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="product-detail-grid">
            {/* Left Column: Macro Product Photo & Quality Seal */}
            <div>
              <div
                className="product-hero-photo-frame"
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: '#0F172A',
                  aspectRatio: '4 / 3',
                  marginBottom: '20px',
                }}
              >
                <img
                  src={product.image}
                  alt={`${product.name} industrial print detail`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={16} color="var(--color-secondary-green)" />
                  <span>QC Certified & Eco-Compliant Formulation</span>
                </div>
              </div>

              {/* Substrate tags */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Recommended Substrates & Machinery:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.applications.map((app, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.8rem',
                        background: '#F3F4F6',
                        color: 'var(--text-body)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Title, Formulation Details & Two Clear Action Buttons */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {product.code}
                </span>
                <Link
                  to={`/products/${category.slug}`}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  {category.name}
                </Link>
              </div>

              <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.5rem)', color: 'var(--text-main)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                {product.name}
              </h1>

              <div style={{ fontSize: '1.05rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '20px' }}>
                {product.tagline}
              </div>

              <p style={{ fontSize: '1.02rem', color: 'var(--text-body)', lineHeight: 1.75, marginBottom: '24px' }}>
                {product.longDesc}
              </p>

              {/* Key Features Bullet List with Emerald Green Checkmarks */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Formulation Highlights:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.925rem', color: 'var(--text-body)' }}>
                      <CheckCircle2 size={17} color="var(--color-secondary-green)" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* THE TWO CLEAR ACTION BUTTONS (NO TABLES, NO PRICING) */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div className="product-detail-actions">
                  {/* Button 1: Download PDF */}
                  <a
                    href={pdfFilePath}
                    download={`${product.code}-TDS.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg btn-shine"
                    style={{ flex: '1 1 200px', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    <Download size={18} />
                    <span>Download PDF</span>
                  </a>

                  {/* Button 2: Request Sample Batch */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSampleModalOpen(true);
                      setIsSubmitted(false);
                    }}
                    className="btn btn-secondary-green btn-lg"
                    style={{ flex: '1 1 200px', justifyContent: 'center' }}
                  >
                    <Package size={18} />
                    <span>Request Sample Batch</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, textAlign: 'center' }}>
                  Download complete Technical Data Sheet (TDS) PDF specifications or request an evaluation batch for industrial trial runs.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          RELATED PRODUCTS SECTION
          ========================================================================== */}
     

      {/* ==========================================================================
          SAMPLE BATCH REQUEST MODAL DIALOG
          ========================================================================== */}
      {isSampleModalOpen && (
        <div className="sample-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="sample-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sample-modal-title"
          >
            {/* Modal Header */}
            <div className="sample-modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge-green">
                    <Package size={13} />
                    <span>Evaluation Sample Requisition</span>
                  </span>
                </div>
                <h3 id="sample-modal-title" style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: '6px 0 2px', fontFamily: 'var(--font-heading)' }}>
                  Request Sample Batch
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                  For industrial print trials: <strong>{product.name}</strong> ({product.code})
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="sample-modal-close"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="sample-modal-body">
              {!isSubmitted ? (
                <form onSubmit={handleFormSubmit}>
                  {/* Selected Product Banner */}
                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Selected Formulation
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {product.name} ({product.code})
                      </div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-green)', fontWeight: 700 }}>
                      ✓ {category.shortName}
                    </span>
                  </div>

                  <div className="sample-form-row">
                    <div className="sample-form-group">
                      <label className="sample-form-label">
                        Your Full Name <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="e.g. Rajesh Sharma"
                        className="sample-form-input"
                      />
                    </div>

                    <div className="sample-form-group">
                      <label className="sample-form-label">
                        Company / Mill Name <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleFormChange}
                        placeholder="e.g. Apex Screen Printworks"
                        className="sample-form-input"
                      />
                    </div>
                  </div>

                  <div className="sample-form-row">
                    <div className="sample-form-group">
                      <label className="sample-form-label">
                        Work Email <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="rajesh@apexprints.com"
                        className="sample-form-input"
                      />
                    </div>

                    <div className="sample-form-group">
                      <label className="sample-form-label">
                        Phone / WhatsApp <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="+91 98765 43210"
                        className="sample-form-input"
                      />
                    </div>
                  </div>

                  <div className="sample-form-group">
                    <label className="sample-form-label">
                      Quantity & Trial Requirements (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleFormChange}
                      placeholder="e.g. 1kg sample batch for automatic oval press trial on 100% cotton garments (mesh: 77T)."
                      className="sample-form-textarea"
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn btn-outline btn-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-secondary-green btn-md btn-shine"
                      style={{ paddingLeft: '24px', paddingRight: '24px' }}
                    >
                      <Send size={16} />
                      <span>Submit Sample Requisition</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Confirmation State */
                <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-secondary-green-light)',
                      color: 'var(--color-secondary-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 18px',
                    }}
                  >
                    <Check size={36} strokeWidth={2.5} />
                  </div>

                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                    Sample Requisition Received!
                  </h3>

                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#F1F5F9',
                      padding: '4px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: '16px',
                    }}
                  >
                    Reference ID: {referenceId}
                  </div>

                  <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: 1.65, maxWidth: '440px', margin: '0 auto 24px' }}>
                    Thank you, <strong>{formData.name}</strong>. Our technical dispatch chemist for <strong>{product.name}</strong> will review your trial specifications and contact you at <strong>{formData.email}</strong> within 24 hours with courier tracking details.
                  </p>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-primary btn-md"
                  >
                    Close & Continue Browsing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .related-products-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;
