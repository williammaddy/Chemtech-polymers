import React, { useState, useEffect } from 'react';
import {
  getProducts,
  updateProduct,
  uploadFile,
  isSupabaseConfigured,
} from '../../lib/supabase';
import type { ProductRow } from '../../types/database';
import {
  FileText,
  Upload,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  FileCheck,
  FileX,
} from 'lucide-react';

export const ProductDocManagementPage: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products for doc management:', err);
      setStatusMessage({ type: 'error', text: 'Failed to load product documents.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handlePdfUpload = async (product: ProductRow, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target;
    if (!inputElement.files || !inputElement.files[0]) return;

    const file = inputElement.files[0];
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setStatusMessage({ type: 'error', text: 'Only PDF files (.pdf) are permitted.' });
      return;
    }

    setUploadingId(product.id);
    setStatusMessage(null);

    try {
      const filePath = `${product.slug}-${Date.now()}.pdf`;
      const pdfUrl = await uploadFile('product-pdfs', filePath, file);

      await updateProduct(product.id, { pdf_url: pdfUrl });
      setStatusMessage({ type: 'success', text: `Technical Data Sheet for "${product.name}" uploaded successfully!` });
      await loadProducts();
    } catch (err: any) {
      console.error('Error uploading PDF:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload PDF.' });
    } finally {
      setUploadingId(null);
      if (inputElement) {
        inputElement.value = '';
      }
    }
  };

  const handleRemovePdf = async (product: ProductRow) => {
    if (!window.confirm(`Are you sure you want to detach the PDF for "${product.name}"?`)) return;

    try {
      await updateProduct(product.id, { pdf_url: null });
      setStatusMessage({ type: 'success', text: `PDF removed from "${product.name}".` });
      await loadProducts();
    } catch (err: any) {
      console.error('Error removing PDF:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to remove PDF.' });
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: products.length,
    withPdf: products.filter((p) => Boolean(p.pdf_url)).length,
    missingPdf: products.filter((p) => !p.pdf_url).length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#0F172A', letterSpacing: '-0.4px' }}>
          Product Technical Document Management
        </h1>
        <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
          Upload and manage official Technical Data Sheets (TDS) and safety specification PDFs for each product.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B3A8F' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>{stats.total}</div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Total Products</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <FileCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669' }}>{stats.withPdf}</div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>PDFs Attached</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
            <FileX size={22} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#DC2626' }}>{stats.missingPdf}</div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Missing PDFs</div>
          </div>
        </div>
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

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '360px' }}>
        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Filter products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            height: '40px',
            padding: '0 12px 0 38px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontSize: '13.5px',
            outline: 'none',
            backgroundColor: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <div>Loading product documents...</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Product Name</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Product Code</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>TDS Status</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const hasPdf = Boolean(p.pdf_url);
                  const isUploadingThis = uploadingId === p.id;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: '#0F172A' }}>
                        {p.name}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#334155' }}>
                        {p.code || '—'}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#64748B' }}>
                        {p.category_slug}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {hasPdf ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              backgroundColor: '#ECFDF5',
                              color: '#047857',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle2 size={13} />
                            PDF Available
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              backgroundColor: '#FEF2F2',
                              color: '#B91C1C',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            <AlertCircle size={13} />
                            Missing PDF
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {/* Upload/Replace Button */}
                          <label
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#F1F5F9',
                              color: '#1E293B',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: isUploadingThis ? 'not-allowed' : 'pointer',
                              border: '1px solid #CBD5E1',
                            }}
                          >
                            {isUploadingThis ? (
                              <Loader2 size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                              <Upload size={14} />
                            )}
                            <span>{hasPdf ? 'Replace PDF' : 'Upload PDF'}</span>
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              disabled={isUploadingThis}
                              onChange={(e) => handlePdfUpload(p, e)}
                              style={{ display: 'none' }}
                            />
                          </label>

                          {/* Preview Link */}
                          {hasPdf && (
                            <a
                              href={p.pdf_url!}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Preview PDF"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#EFF6FF',
                                color: '#2B3A8F',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                              }}
                            >
                              <ExternalLink size={14} />
                              <span>Preview</span>
                            </a>
                          )}

                          {/* Detach PDF */}
                          {hasPdf && (
                            <button
                              onClick={() => handleRemovePdf(p)}
                              title="Remove PDF"
                              style={{
                                backgroundColor: '#FEE2E2',
                                border: 'none',
                                color: '#DC2626',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
