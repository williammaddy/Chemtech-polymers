import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Building,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ContactProps {
  selectedProduct?: string;
}

export const Contact: React.FC<ContactProps> = ({ selectedProduct = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productInterest: selectedProduct || 'General Inquiry',
    message: '',
  });

  // Sync selectedProduct if changed externally
  React.useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        productInterest: selectedProduct,
        message: prev.message || `Hello, I would like to request technical specifications and bulk sampling for ${selectedProduct}.`,
      }));
    }
  }, [selectedProduct]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate front-end API submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  /* ==========================================================================
     CONTACT DETAILS PLACEHOLDERS
     [EDIT HERE]: Update these values with the actual company information!
     ========================================================================== */
  const contactInfo = {
    // [PLACEHOLDER]: Replace with actual company phone number(s)
    phone: '[+91 Phone Number]',
    // [PLACEHOLDER]: Replace with actual primary sales/inquiry email
    email: '[contact@chemtechindia.com / Email Address]',
    // [PLACEHOLDER]: Replace with actual factory / office physical address
    address: '[Factory / Office Address, Industrial Area, Gujarat / Maharashtra / India]',
    // Operating hours
    hours: 'Monday – Saturday: 9:00 AM – 6:30 PM IST',
  };

  return (
    <section id="contact" className="section section-pastel" style={{ paddingTop: '80px', paddingBottom: '90px' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <span className="accent-dot teal" />
            <span>Direct B2B Support</span>
          </div>
          <h2 className="section-title">Connect with Our Technical Formulation Team</h2>
          <p className="section-subtitle">
            Whether you require commercial sample batches, custom viscosity formulation, or bulk B2B supply,
            our chemical specialists are ready to assist.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '40px',
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left Column: Interactive Contact Form */}
          <div
            className="card"
            style={{
              padding: '40px',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(43, 58, 143, 0.1)',
            }}
          >
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-teal-soft)',
                    color: 'var(--accent-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                  }}
                >
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Inquiry Received!</h3>
                <p style={{ color: 'var(--text-body)', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                  Thank you for contacting Chemtech Polymers. Our technical ink specialists will review your requirements
                  and contact you promptly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      company: '',
                      productInterest: 'General Inquiry',
                      message: '',
                    });
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <span>Submit Another Inquiry</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '4px' }}>
                    Request Samples & Technical Quotation
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Fill in your printing requirements and garment specifications below.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input-focus"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: '#F8FAFC',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input-focus"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: '#F8FAFC',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input-focus"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: '#F8FAFC',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Company / Print House
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="e.g. Precision Garments"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input-focus"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: '#F8FAFC',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Primary Ink Formulation Interest
                  </label>
                  <select
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    className="form-input-focus"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: '#F8FAFC',
                      outline: 'none',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="General Inquiry">General B2B Product Inquiry</option>
                    <option value="Prime H White">Prime H White (High Opaque Water Base)</option>
                    <option value="CC Clear Base">CC Clear Base (Water Base)</option>
                    <option value="Non-PVC Oil Base Inks (Acrysol)">Non-PVC Oil Base Inks (Acrysol)</option>
                    <option value="Phthalate-Free Plastisol Inks">Phthalate-Free Plastisol Inks</option>
                    <option value="Foil Gel">Foil Gel (Specialty)</option>
                    <option value="Glitter Gel">Glitter Gel (Specialty)</option>
                    <option value="HD Gel">HD Gel (High Definition)</option>
                    <option value="Foam Gel">Foam Gel (Puff Finish)</option>
                    <option value="Metallic Inks">Metallic Inks</option>
                    <option value="Litho Backup White">Litho Backup White (Heat Transfer)</option>
                    <option value="Transfer Adhesive Gel">Transfer Adhesive Gel</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Your Specifications / Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your fabric type, mesh count, volume, or specific technical questions..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input-focus"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: '#F8FAFC',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg btn-shine"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isSubmitting ? (
                    <span>Sending Inquiry...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Inquiry to Chemtech Polymers</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details Placeholders & Styled Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Contact Details Card */}
            <div
              className="card"
              style={{
                padding: '32px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(43, 58, 143, 0.1)',
              }}
            >
              <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '20px' }}>
                Chemtech Polymers Headquarters
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--accent-orange-soft)',
                      color: 'var(--accent-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Phone / WhatsApp
                    </div>
                    {/* [PLACEHOLDER NOTE: Editable in contactInfo.phone] */}
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {contactInfo.phone}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--accent-teal-soft)',
                      color: 'var(--accent-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Technical & Sales Email
                    </div>
                    {/* [PLACEHOLDER NOTE: Editable in contactInfo.email] */}
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {contactInfo.email}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Manufacturing Plant & Office
                    </div>
                    {/* [PLACEHOLDER NOTE: Editable in contactInfo.address] */}
                    <div style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                      {contactInfo.address}
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--accent-gold-soft)',
                      color: 'var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Operating Hours
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>{contactInfo.hours}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map Card */}
            <div
              className="card"
              style={{
                padding: '0',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '190px',
                  background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ position: 'absolute', top: 0, left: 0, opacity: 0.25 }}
                >
                  <defs>
                    <pattern id="mapGrid2" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2B3A8F" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid2)" />
                </svg>

                {/* Pulsing Pin Marker */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-color)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(43, 58, 143, 0.45)',
                    }}
                  >
                    <MapPin size={24} />
                  </div>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: 'var(--primary-color)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginTop: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    Chemtech Polymers Plant
                  </div>
                </div>
              </div>

              <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Interactive Google Map Embed Ready
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                  [Coordinates Configured]
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
