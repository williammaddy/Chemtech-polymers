import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  getProductBySlug as getStaticProduct,
  getCategoryBySlug as getStaticCategory,
  getRelatedProducts
} from '../data/productsData';
import {
  getProductBySlug,
  getCategoryBySlug,
  getContactInfo
} from '../lib/supabase';
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
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { CONTACT_INFO, sendWhatsAppNotification } from '../config/contactInfo';

export const ProductDetailPage: React.FC = () => {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();

  if (!categorySlug || !productSlug) {
    return <Navigate to="/products" replace />;
  }

  const [product, setProduct] = useState<any>(() => getStaticProduct(productSlug));
  const [category, setCategory] = useState<any>(() => getStaticCategory(categorySlug));
  const [loading, setLoading] = useState<boolean>(!product || !category);
  const [contactEndpoint, setContactEndpoint] = useState<string>(CONTACT_INFO.formspreeEndpoint);

  useEffect(() => {
    let mounted = true;
    if (productSlug && categorySlug) {
      Promise.all([
        getProductBySlug(productSlug),
        getCategoryBySlug(categorySlug),
        getContactInfo(),
      ]).then(([p, c, ci]) => {
        if (!mounted) return;
        if (p) setProduct(p);
        if (c) setCategory(c);
        if (ci && ci.formspree_endpoint) {
          setContactEndpoint(ci.formspree_endpoint);
        }
        setLoading(false);
      }).catch((err) => {
        console.error('Error loading product details:', err);
        if (mounted) setLoading(false);
      });
    }
    return () => {
      mounted = false;
    };
  }, [productSlug, categorySlug]);

  // Sample Batch Request Modal State
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const handleCloseModal = () => {
    setIsSampleModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setErrorMessage(null);
      setFormData({ name: '', company: '', email: '', phone: '', notes: '' });
    }, 300);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
        <Loader2 className="spinner-icon" size={36} color="var(--color-primary)" />
      </div>
    );
  }

  if (!product || !category) {
    return <Navigate to="/products" replace />;
  }

  const productName = product.name;
  const productCode = product.code || (product.slug ? product.slug.toUpperCase() : '');
  const productImage = product.image || product.image_url || '';
  const productPdf = product.pdfUrl || product.pdf_url || `/assets/pdfs/${product.slug}.pdf`;
  const productTagline = product.tagline || '';
  const productDesc = product.longDesc || product.description || product.shortDesc || '';
  const productFeatures: string[] = Array.isArray(product.features)
    ? product.features
    : (product.specs?.features || []);
  const productApplications: string[] = Array.isArray(product.applications)
    ? product.applications
    : (product.specs?.applications || []);
  const categoryName = category.name;
  const categorySlugVal = category.slug;
  const categoryShortName = category.shortName || category.short_name || category.name;

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set('_subject', `New Chemtech Sample Batch Request - ${productName} (${productCode})`);
    data.set('product_requested', `${productName} (${productCode})`);
    data.set('product_interest', `${productName} (${productCode})`);
    data.set('request_type', 'Sample Batch');
    if (formData.notes) {
      data.set('message', formData.notes);
    }

    try {
      const response = await fetch(contactEndpoint || CONTACT_INFO.formspreeEndpoint, {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const randomRef = 'CT-SMPL-' + Math.floor(10000 + Math.random() * 90000);
        setReferenceId(randomRef);
        setIsSubmitted(true);

        // Fire WhatsApp notification (fire and forget)
        sendWhatsAppNotification({
          name: formData.name.trim(),
          company: formData.company.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          product_interest: `${productName} (${productCode})`,
          product_requested: `${productName} (${productCode})`,
          request_type: 'Sample Batch',
          message: formData.notes.trim(),
        });
      } else {
        const result = await response.json().catch(() => null);
        if (result && result.errors && result.errors.length > 0) {
          setErrorMessage(result.errors.map((err: { message: string }) => err.message).join(', '));
        } else {
          setErrorMessage('Something went wrong submitting your sample request. Please try again.');
        }
      }
    } catch (err) {
      setErrorMessage('Network error — please check your connection or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==========================================================================
     PDF SPEC SHEET PATH:
     Opens/downloads the actual technical data sheet PDF directly.
     ========================================================================== */
  const pdfFilePath = productPdf;

  return (
    <div className="product-detail-page" style={{ paddingTop: '100px', backgroundColor: '#FAFAFA' }}>
      <Breadcrumbs
        items={[
          { label: 'Products', to: '/products' },
          { label: categoryName, to: `/products/${categorySlugVal}` },
          { label: productName },
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
                  src={productImage}
                  alt={`${productName} industrial print detail`}
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
                  {productApplications.map((app, idx) => (
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
                  {productCode}
                </span>
                <Link
                  to={`/products/${categorySlugVal}`}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  {categoryName}
                </Link>
              </div>

              <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.5rem)', color: 'var(--text-main)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                {productName}
              </h1>

              {productTagline && (
                <div style={{ fontSize: '1.05rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '20px' }}>
                  {productTagline}
                </div>
              )}

              <p style={{ fontSize: '1.02rem', color: 'var(--text-body)', lineHeight: 1.75, marginBottom: '24px' }}>
                {productDesc}
              </p>

              {/* Key Features Bullet List with Emerald Green Checkmarks */}
              {productFeatures.length > 0 && (
                <div style={{ marginBottom: '36px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Formulation Highlights:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {productFeatures.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.925rem', color: 'var(--text-body)' }}>
                        <CheckCircle2 size={17} color="var(--color-secondary-green)" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
                    download={`${productCode}-TDS.pdf`}
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
                  For industrial print trials: <strong>{productName}</strong> ({productCode})
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
                <form
                  id="sampleBatchRequestForm"
                  action={contactEndpoint || CONTACT_INFO.formspreeEndpoint}
                  method="POST"
                  onSubmit={handleFormSubmit}
                >
                  <input type="hidden" name="_subject" value={`New Chemtech Sample Batch Request - ${productName} (${productCode})`} />
                  <input type="hidden" name="product_requested" value={`${productName} (${productCode})`} />
                  <input type="hidden" name="product_interest" value={`${productName} (${productCode})`} />
                  <input type="hidden" name="request_type" value="Sample Batch" />

                  {/* Error Banner */}
                  {errorMessage && (
                    <div className="form-error-banner" style={{ marginBottom: '16px' }}>
                      <AlertCircle size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

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
                        {productName} ({productCode})
                      </div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-green)', fontWeight: 700 }}>
                      ✓ {categoryShortName}
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
                      disabled={isSubmitting}
                      className="btn btn-secondary-green btn-md btn-shine"
                      style={{ paddingLeft: '24px', paddingRight: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="spinner-icon" size={16} />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Sample Requisition</span>
                        </>
                      )}
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
                    Thank you, <strong>{formData.name}</strong>. Our technical dispatch chemist for <strong>{productName}</strong> will review your trial specifications and contact you at <strong>{formData.email}</strong> within 24 hours with courier tracking details.
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
