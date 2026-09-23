import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  ShieldCheck,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { productsData } from '../data/productsData';
import { CONTACT_INFO, sendWhatsAppNotification } from '../config/contactInfo';
import { getContactInfo, getProducts } from '../lib/supabase';

export const ContactPage: React.FC = () => {
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product_interest: '',
    message: '',
  });

  const [requestTypes, setRequestTypes] = useState<string[]>(['Technical Data Sheet']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Read URL query parameter: ?product=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prodParam = params.get('product');
    if (prodParam) {
      setFormData((prev) => ({
        ...prev,
        product_interest: prodParam,
        message: prev.message || `Hello, I would like to request technical specifications, viscosity adjustments, and sample trial batches for ${prodParam}.`,
      }));
    }
  }, [location.search]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleRequestTypeToggle = (type: string) => {
    setRequestTypes((prev) => {
      const updated = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      if (updated.length > 0 && errors.request_type) {
        setErrors((prevErrors) => {
          const u = { ...prevErrors };
          delete u.request_type;
          return u;
        });
      }
      return updated;
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (requestTypes.length === 0) {
      newErrors.request_type = 'Please select at least one request type.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const isValid = validate();
    if (!isValid) {
      setErrorMessage('Please fill in your name, a valid email, and select at least one request type.');
      return;
    }

    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const data = new FormData(form);

      // Explicitly append all selected request types
      data.delete('request_type');
      requestTypes.forEach((type) => {
        data.append('request_type', type);
      });

      const response = await fetch(CONTACT_INFO.formspreeEndpoint, {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setIsSuccess(true);
        setErrorMessage(null);

        // Background WhatsApp notification (fire and forget)
        sendWhatsAppNotification({
          name: formData.name.trim(),
          company: formData.company.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          product_interest: formData.product_interest,
          request_type: requestTypes.join(', '),
          message: formData.message.trim(),
        });
      } else {
        const result = await response.json().catch(() => null);
        if (result && result.errors && result.errors.length > 0) {
          setErrorMessage(result.errors.map((err: { message: string }) => err.message).join(', '));
        } else {
          setErrorMessage('Something went wrong — please try again or email us directly.');
        }
      }
    } catch (err) {
      setErrorMessage('Something went wrong — please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      product_interest: '',
      message: '',
    });
    setRequestTypes(['Technical Data Sheet']);
    setErrors({});
    setErrorMessage(null);
  };

  const [contactInfo, setContactInfo] = useState<any>(CONTACT_INFO);
  const [productList, setProductList] = useState<any[]>(productsData);

  useEffect(() => {
    getContactInfo().then((info) => {
      if (info) setContactInfo(info);
    });
    getProducts().then((prods) => {
      if (prods && prods.length > 0) setProductList(prods);
    });
  }, []);

  return (
    <div className="contact-page" style={{ paddingTop: '100px' }}>
      <Breadcrumbs items={[{ label: 'Contact & Inquiries' }]} />

      {/* Page Header Banner */}
      <section className="page-header-banner" style={{ padding: '48px 0 54px', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <span className="accent-dot teal" />
            <span>Direct B2B Chemical Formulation Support</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            Connect with Our Application Specialists
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-body)', maxWidth: '820px', lineHeight: 1.7 }}>
            Whether you require production trial sample batches, custom pantone matching, or conveyor dryer thermal audits,
            our technical chemists are prepared to support your manufacturing floor.
          </p>
        </div>
      </section>

      {/* Main Form & Contact Info Section */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', paddingTop: '64px', paddingBottom: '96px' }}>
        <div className="container">
          <div className="contact-grid">
            {/* Left Column: Interactive Form */}
            <div
              className="card contact-form-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Success Confirmation State */}
              <div id="formSuccessState" className={isSuccess ? "form-success-card" : "hidden"}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(5, 150, 105, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: 'var(--color-secondary-green)',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
                  Inquiry Received Successfully
                </h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto 24px' }}>
                  Thanks! Your request has been received — our team will reach out shortly.
                </p>

                {/* Submitted Request Summary */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '18px 22px',
                    textAlign: 'left',
                    maxWidth: '460px',
                    margin: '0 auto 28px',
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.name}</strong>
                  </div>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.email}</strong>
                  </div>
                  {formData.company && (
                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Company:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{formData.company}</strong>
                    </div>
                  )}
                  {formData.product_interest && (
                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Product:</span>
                      <strong style={{ color: 'var(--primary-color)' }}>{formData.product_interest}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Request Type:</span>
                    <strong style={{ color: 'var(--color-secondary-green)' }}>
                      {requestTypes.join(', ')}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline btn-sm"
                >
                  <span>Submit Another Request</span>
                </button>
              </div>

              {/* Formspree Interactive Form */}
              {!isSuccess && (
                <form
                  id="sampleRequestForm"
                  action={CONTACT_INFO.formspreeEndpoint}
                  method="POST"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <input type="hidden" name="_subject" value="New Chemtech Inquiry - Spec Sheet / Sample Request" />

                  {/* Top-Level Error Banner */}
                  <div id="formErrorState" className={errorMessage ? "form-error-banner" : "hidden"}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>{errorMessage || "⚠️ Something went wrong — please try again or email us directly."}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="accent-dot orange" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--primary-color)' }}>
                      Commercial Request Form
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
                    Request Technical Spec Sheets & Sample Batches
                  </h3>

                  <div className="contact-form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Kumar"
                        className={`contact-form-input ${errors.name ? 'input-error' : ''}`}
                      />
                      {errors.name && (
                        <div className="field-error-msg">
                          <AlertCircle size={14} />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Business Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rajesh@garmentfactory.com"
                        className={`contact-form-input ${errors.email ? 'input-error' : ''}`}
                      />
                      {errors.email && (
                        <div className="field-error-msg">
                          <AlertCircle size={14} />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className="contact-form-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. TexPrint Mills India"
                        className="contact-form-input"
                      />
                    </div>
                  </div>

                  {/* Product Interest Dropdown */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Product / Category of Interest
                    </label>
                    <select
                      name="product_interest"
                      value={formData.product_interest}
                      onChange={handleChange}
                      className="contact-form-input"
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      <option value="General Technical Inquiry">General Technical Inquiry</option>
                      <optgroup label="Water Base Inks">
                        <option value="Prime H White">Prime H White (CT-WB-01)</option>
                        <option value="CC Clear Base">CC Clear Base (CT-WB-02)</option>
                      </optgroup>
                      <optgroup label="Non-PVC Inks">
                        <option value="Non-PVC Oil Base Inks (Acrysol)">Non-PVC Oil Base Inks (Acrysol)</option>
                      </optgroup>
                      <optgroup label="Plastisol Inks">
                        <option value="Phthalate-Free Plastisol Inks">Phthalate-Free Plastisol Inks</option>
                      </optgroup>
                      <optgroup label="Specialty Gels">
                        <option value="Foil Gel">Foil Gel</option>
                        <option value="Glitter Gel">Glitter Gel</option>
                        <option value="HD Gel">HD Gel (High Definition)</option>
                        <option value="Foam Gel">Foam Gel (3D Puff)</option>
                        <option value="Metallic Inks">Metallic Inks</option>
                      </optgroup>
                      <optgroup label="Heat Transfer">
                        <option value="Litho Backup White">Litho Backup White</option>
                        <option value="Transfer Adhesive Gel">Transfer Adhesive Gel</option>
                      </optgroup>
                      <optgroup label="Craft Ink Series">
                        <option value="Craft Ink Fabric Textile Base">Craft Ink Fabric Textile Base</option>
                        <option value="Craft Ink Opaque White">Craft Ink Opaque White</option>
                        <option value="Craft Ink Shimmer Base">Craft Ink Shimmer Base</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Request Type Checkboxes */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                      Request Type *
                    </label>
                    <div className="request-type-group">
                      <label className={`request-type-option ${requestTypes.includes('Technical Data Sheet') ? 'checked' : ''} ${errors.request_type ? 'option-error' : ''}`}>
                        <input
                          type="checkbox"
                          name="request_type"
                          value="Technical Data Sheet"
                          checked={requestTypes.includes('Technical Data Sheet')}
                          onChange={() => handleRequestTypeToggle('Technical Data Sheet')}
                        />
                        <span>Technical Data Sheet</span>
                      </label>
                      <label className={`request-type-option ${requestTypes.includes('Sample Batch') ? 'checked' : ''} ${errors.request_type ? 'option-error' : ''}`}>
                        <input
                          type="checkbox"
                          name="request_type"
                          value="Sample Batch"
                          checked={requestTypes.includes('Sample Batch')}
                          onChange={() => handleRequestTypeToggle('Sample Batch')}
                        />
                        <span>Sample Batch</span>
                      </label>
                    </div>
                    {errors.request_type && (
                      <div className="field-error-msg">
                        <AlertCircle size={14} />
                        <span>{errors.request_type}</span>
                      </div>
                    )}
                  </div>

                  {/* Message Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Message / Notes
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Specify garment substrate (cotton, poly, blend), mesh count, conveyor dryer specs, test requirements, or sample delivery address..."
                      className="contact-form-input"
                      style={{ lineHeight: 1.55 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-md btn-shine"
                    style={{ width: '100%', justifyContent: 'center', minHeight: '48px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="spinner-icon" size={18} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Contact Cards & Operating Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Card 1: Direct Technical Inquiries */}
              <div
                className="contact-info-card"
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '18px', fontFamily: 'var(--font-heading)' }}>
                  Direct Technical & Sales Support
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Phone size={18} color="var(--primary-color)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Contact 1 (Phone / WhatsApp):
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <a href="tel:+919363519955" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {contactInfo.phone_support || contactInfo.phoneSupport || '+91 93635 19955'}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Phone size={18} color="var(--primary-color)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Contact 2 (Phone):
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <a href="tel:+918220804830" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {contactInfo.phone_sales || contactInfo.phoneSales || '+91 82208 04830'}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Mail size={18} color="var(--primary-color)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Business Email:
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <a href={`mailto:${contactInfo.email || contactInfo.emailPrimary || 'business.chemtech@gmail.com'}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {contactInfo.email || contactInfo.emailPrimary || 'business.chemtech@gmail.com'}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Clock size={18} color="var(--primary-color)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Working Hours:
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>
                        {contactInfo.hours}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Regulatory Assurance */}
              
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
