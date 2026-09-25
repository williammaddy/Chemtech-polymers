import React, { useEffect, useRef } from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  Layers,
  Thermometer,
  Gauge,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface ProductSpec {
  name: string;
  category: string;
  code: string;
  description: string;
  image: string;
  pdfUrl?: string;
  specs: {
    meshCount: string;
    cureTemp: string;
    viscosity: string;
    washFastness: string;
    chemistry: string;
    shelfLife: string;
  };
  features: string[];
  applications: string[];
  curingNotes?: string;
}

interface PdfViewerModalProps {
  product: ProductSpec | null;
  onClose: () => void;
  onInquire?: (productName: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  product,
  onClose,
  onInquire,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) return;

    // Prevent body scrolling when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Handle ESC key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const pdfPath = product.pdfUrl || (product as any).pdf_url || `/assets/pdfs/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-tds.pdf`;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleInquiryClick = () => {
    onClose();
    if (onInquire) {
      onInquire(product.name);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="tds-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tds-modal-title"
    >
      <div className="tds-modal-container" ref={modalRef}>
        {/* Header Bar */}
        <div className="tds-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="tds-file-icon">
              <FileText size={22} color="var(--primary-color)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="tds-badge-code">{product.code}</span>
                <span className="tds-badge-cat">{product.category}</span>
              </div>
              <h3 id="tds-modal-title" className="tds-modal-title">
                {product.name} — Technical Data Sheet (TDS)
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={pdfPath}
              download={`${product.code}-TDS.pdf`}
              className="btn btn-outline btn-sm tds-download-header-btn"
              title="Download PDF Spec Sheet"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="tds-close-btn"
              aria-label="Close TDS Modal"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="tds-modal-body">
          {/* Top Overview & Macro Photo */}
          <div className="tds-top-grid">
            <div className="tds-photo-card">
              <img
                src={product.image}
                alt={`${product.name} print sample`}
                className="tds-photo-img"
              />
              <div className="tds-photo-overlay">
                <span className="tds-qc-pill">
                  <ShieldCheck size={14} color="#00A896" />
                  <span>QC Lab Certified Batch</span>
                </span>
              </div>
            </div>

            <div className="tds-overview-info">
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                Formulation Overview
              </h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.65, marginBottom: '16px' }}>
                {product.description}
              </p>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Key Performance Attributes:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                  {product.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.85rem', color: 'var(--text-body)' }}>
                      <CheckCircle2 size={14} color="var(--primary-color)" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Recommended Substrates & Uses:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {product.applications.map((app, idx) => (
                    <span key={idx} className="tds-tag-pill">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="tds-section-title-wrap">
            <h4 className="tds-section-title">
              <Gauge size={18} color="var(--primary-color)" />
              <span>Technical & Processing Specifications</span>
            </h4>
            <span className="tds-spec-note">Standard conditions @ 25°C / 60% RH</span>
          </div>

          <div className="tds-specs-grid">
            <div className="tds-spec-item">
              <div className="tds-spec-icon-box">
                <Layers size={18} color="var(--accent-orange)" />
              </div>
              <div>
                <div className="tds-spec-label">Recommended Mesh</div>
                <div className="tds-spec-val">{product.specs.meshCount}</div>
              </div>
            </div>

            <div className="tds-spec-item">
              <div className="tds-spec-icon-box">
                <Thermometer size={18} color="var(--accent-red)" />
              </div>
              <div>
                <div className="tds-spec-label">Cure Temperature</div>
                <div className="tds-spec-val">{product.specs.cureTemp}</div>
              </div>
            </div>

            <div className="tds-spec-item">
              <div className="tds-spec-icon-box">
                <Droplets size={18} color="var(--accent-teal)" />
              </div>
              <div>
                <div className="tds-spec-label">Rheology & Viscosity</div>
                <div className="tds-spec-val">{product.specs.viscosity}</div>
              </div>
            </div>

            <div className="tds-spec-item">
              <div className="tds-spec-icon-box">
                <ShieldCheck size={18} color="var(--primary-color)" />
              </div>
              <div>
                <div className="tds-spec-label">Wash Fastness Rating</div>
                <div className="tds-spec-val">{product.specs.washFastness}</div>
              </div>
            </div>

            <div className="tds-spec-item">
              <div className="tds-spec-icon-box">
                <Sparkles size={18} color="var(--accent-gold)" />
              </div>
              <div>
                <div className="tds-spec-label">Base Chemistry</div>
                <div className="tds-spec-val">{product.specs.chemistry}</div>
              </div>
            </div>

            <div className="tds-spec-item">
              <div className="tds-spec-icon-box">
                <CheckCircle2 size={18} color="#2B3A8F" />
              </div>
              <div>
                <div className="tds-spec-label">Shelf Life & Storage</div>
                <div className="tds-spec-val">{product.specs.shelfLife}</div>
              </div>
            </div>
          </div>

          {/* Interactive Document Sheet Preview & Download Container */}
          <div className="tds-document-preview-box">
            <div className="tds-preview-topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="accent-dot orange" />
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Interactive Spec Sheet Preview ({product.code}-TDS.pdf)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tds-link-btn"
                >
                  <ExternalLink size={14} />
                  <span>Open in Full Tab</span>
                </a>
                <a
                  href={pdfPath}
                  download={`${product.code}-TDS.pdf`}
                  className="btn btn-sm btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <Download size={14} />
                  <span>Download Spec Sheet (PDF)</span>
                </a>
              </div>
            </div>

            {/* Embedded Preview Canvas / Emulated TDS Document */}
            <div className="tds-document-sheet">
              <div className="tds-sheet-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                      CHEMTECH POLYMERS TECHNICAL DATA BULLETIN
                    </div>
                    <h5 style={{ fontSize: '1.25rem', margin: '4px 0 2px', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                      {product.name}
                    </h5>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Product Code: <strong>{product.code}</strong> | Revision: 2026.1 | Ref: ASTM / AATCC
                    </div>
                  </div>
                  <div className="tds-sheet-watermark">
                    CONFIDENTIAL TDS
                  </div>
                </div>
              </div>

              <div className="tds-sheet-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div className="tds-sheet-field">
                    <span className="tds-field-name">Polymer System:</span>
                    <span className="tds-field-val">{product.specs.chemistry}</span>
                  </div>
                  <div className="tds-sheet-field">
                    <span className="tds-field-name">Curing Schedule:</span>
                    <span className="tds-field-val">{product.specs.cureTemp}</span>
                  </div>
                  <div className="tds-sheet-field">
                    <span className="tds-field-name">Squeegee Durometer:</span>
                    <span className="tds-field-val">65 / 90 / 65 Triple Durometer</span>
                  </div>
                  <div className="tds-sheet-field">
                    <span className="tds-field-name">Compliance Standard:</span>
                    <span className="tds-field-val">ZDHC Level 3, OEKO-TEX Eco-Passport</span>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '6px', fontSize: '0.825rem', color: 'var(--text-body)', borderLeft: '3px solid var(--primary-color)' }}>
                  <strong>Application Advisory:</strong> {product.curingNotes || 'Pre-heat dryer conveyor and verify ink film core temperature with a calibrated donut temperature probe. Always perform a complete 5-cycle commercial wash test prior to full production runs.'}
                </div>
              </div>

              <div className="tds-sheet-footer">
                <span>© {new Date().getFullYear()} Chemtech Polymers Formulations Pvt. Ltd. All rights reserved.</span>
                <span>Industrial Grade Chemical Specification</span>
              </div>
            </div>
          </div>

          {/* Compliance & Safety Guarantee */}
          <div className="tds-compliance-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={26} color="var(--accent-teal)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Restricted Substance List (RSL) & Environmental Compliance
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
                  100% Phthalate-free, APEO/NPEO-free, heavy-metal compliant with global retail footwear and apparel standards.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="tds-modal-footer">
          <div className="tds-footer-left">
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Need custom viscosity adjustments or on-site press technician support?
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleInquiryClick}
              className="btn btn-primary btn-sm"
            >
              <span>Inquire & Request Sample Batch</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
