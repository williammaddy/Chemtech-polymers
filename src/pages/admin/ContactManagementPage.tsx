import React, { useState, useEffect } from 'react';
import { getContactInfo, updateContactInfo } from '../../lib/supabase';
import type { ContactInfoRow } from '../../types/database';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  ExternalLink,
} from 'lucide-react';

export const ContactManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<ContactInfoRow>({
    id: '',
    phone: '',
    phone_support: '',
    phone_sales: '',
    email: '',
    email_sales: '',
    address: '',
    whatsapp_number: '',
    map_embed_url: '',
    hours: '',
    formspree_endpoint: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getContactInfo();
      setFormData(data);
    } catch (err) {
      console.error('Error fetching contact details:', err);
      setStatusMessage({ type: 'error', text: 'Failed to load contact information.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      await updateContactInfo(formData);
      setStatusMessage({ type: 'success', text: 'Contact details updated successfully across the entire website!' });
    } catch (err: any) {
      console.error('Error updating contact information:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save contact information.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#64748B', border: '1px solid #E2E8F0' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <div>Loading business contact details...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#0F172A', letterSpacing: '-0.4px' }}>
          Contact & Location Management
        </h1>
        <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
          Update corporate contact numbers, email addresses, factory location, WhatsApp integration, and operating hours.
        </p>
      </div>

      {/* Status Feedback */}
      {statusMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            backgroundColor: statusMessage.type === 'success' ? '#ECFDF5' : '#FEF2F2',
            color: statusMessage.type === 'success' ? '#065F46' : '#991B1B',
            border: `1px solid ${statusMessage.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
            fontSize: '13.5px',
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Form Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Phone Numbers */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} color="#2B3A8F" />
              <span>Contact Phone Numbers</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Contact 1 (Phone / WhatsApp)
                </label>
                <input
                  type="text"
                  value={formData.phone_support || ''}
                  onChange={(e) => setFormData({ ...formData, phone_support: e.target.value })}
                  placeholder="+91 93635 19955"
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Contact 2 (Phone)
                </label>
                <input
                  type="text"
                  value={formData.phone_sales || ''}
                  onChange={(e) => setFormData({ ...formData, phone_sales: e.target.value })}
                  placeholder="+91 82208 04830"
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />

          {/* Email Addresses */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} color="#2B3A8F" />
              <span>Business Email</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Official Business Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value, email_sales: e.target.value })}
                  placeholder="business.chemtech@gmail.com"
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />

          {/* WhatsApp & Hours */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="#25D366" />
              <span>WhatsApp & Operating Hours</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  WhatsApp Notification Number (International format)
                </label>
                <input
                  type="text"
                  value={formData.whatsapp_number || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="918248212154"
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Operating Working Hours
                </label>
                <input
                  type="text"
                  value={formData.hours || ''}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="Monday – Saturday: 9:00 AM – 6:30 PM IST"
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2B3A8F',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(43, 58, 143, 0.25)',
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Saving Contact Details...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Contact Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
