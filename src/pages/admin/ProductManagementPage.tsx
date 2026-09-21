import React, { useState, useEffect } from 'react';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadFile,
  isSupabaseConfigured,
} from '../../lib/supabase';
import type { ProductRow, CategoryRow } from '../../types/database';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  X,
  Upload,
  CheckCircle2,
  Package,
} from 'lucide-react';

export const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    name: '',
    category_slug: '',
    code: '',
    tagline: '',
    short_desc: '',
    description: '',
    badge: '',
    accent_color: '#2B3A8F',
    image_url: '',
    meshCount: '',
    cureTemp: '',
    viscosity: '',
    washFastness: '',
    chemistry: '',
    shelfLife: '',
    durometer: '',
    curing_notes: '',
    features: [''],
    applications: [''],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setStatusMessage({ type: 'error', text: 'Failed to load products.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lock body scroll and pause Lenis smooth scrolling when modal is open
  useEffect(() => {
    if (isModalOpen || deleteConfirmId) {
      document.body.style.overflow = 'hidden';
      (window as any).lenis?.stop();
    } else {
      document.body.style.overflow = '';
      (window as any).lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      (window as any).lenis?.start();
    };
  }, [isModalOpen, deleteConfirmId]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `prod-${Date.now()}`,
      slug: '',
      name: '',
      category_slug: categories[0]?.slug || 'water-base-inks',
      code: '',
      tagline: '',
      short_desc: '',
      description: '',
      badge: '',
      accent_color: '#2B3A8F',
      image_url: '',
      meshCount: '',
      cureTemp: '',
      viscosity: '',
      washFastness: '',
      chemistry: '',
      shelfLife: '',
      durometer: '',
      curing_notes: '',
      features: [''],
      applications: [''],
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductRow) => {
    setEditingProduct(p);
    setFormData({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category_slug: p.category_slug,
      code: p.code || '',
      tagline: p.tagline || '',
      short_desc: p.short_desc || '',
      description: p.description || '',
      badge: p.badge || '',
      accent_color: p.accent_color || '#2B3A8F',
      image_url: p.image_url || '',
      meshCount: p.specs?.meshCount || '',
      cureTemp: p.specs?.cureTemp || '',
      viscosity: p.specs?.viscosity || '',
      washFastness: p.specs?.washFastness || '',
      chemistry: p.specs?.chemistry || '',
      shelfLife: p.specs?.shelfLife || '',
      durometer: p.specs?.durometer || '',
      curing_notes: p.curing_notes || '',
      features: p.features && p.features.length > 0 ? p.features : [''],
      applications: p.applications && p.applications.length > 0 ? p.applications : [''],
    });
    setImageFile(null);
    setImagePreview(p.image_url || '');
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      let finalImageUrl = formData.image_url;

      // Upload image to storage if selected
      if (imageFile && isSupabaseConfigured) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${formData.slug || formData.id}-${Date.now()}.${fileExt}`;
        finalImageUrl = await uploadFile('product-images', filePath, imageFile);
      }

      const cleanFeatures = formData.features.filter((f) => f.trim() !== '');
      const cleanApps = formData.applications.filter((a) => a.trim() !== '');

      const payload: Partial<ProductRow> = {
        id: formData.id,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: formData.name,
        category_slug: formData.category_slug,
        code: formData.code,
        tagline: formData.tagline,
        short_desc: formData.short_desc,
        description: formData.description,
        badge: formData.badge,
        accent_color: formData.accent_color,
        image_url: finalImageUrl,
        curing_notes: formData.curing_notes,
        features: cleanFeatures,
        applications: cleanApps,
        specs: {
          meshCount: formData.meshCount,
          cureTemp: formData.cureTemp,
          viscosity: formData.viscosity,
          washFastness: formData.washFastness,
          chemistry: formData.chemistry,
          shelfLife: formData.shelfLife,
          durometer: formData.durometer,
        },
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setStatusMessage({ type: 'success', text: `Product "${payload.name}" updated successfully!` });
      } else {
        await createProduct(payload as any);
        setStatusMessage({ type: 'success', text: `Product "${payload.name}" created successfully!` });
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save product.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setStatusMessage({ type: 'success', text: 'Product deleted successfully.' });
      setDeleteConfirmId(null);
      await loadData();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete product.' });
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.category_slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#0F172A', letterSpacing: '-0.4px' }}>
            Product Management
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
            Add, update, or remove technical product formulations and specifications.
          </p>
        </div>

        <button
          onClick={openAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#2B3A8F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(43, 58, 143, 0.25)',
          }}
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Status feedback */}
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

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by product name or code..."
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
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ minWidth: '200px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '13.5px',
              backgroundColor: '#FFFFFF',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
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
            <div>Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
            <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: '15px' }}>No products found</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Try clearing search or click "Add Product".</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Product</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Code</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Key Chemistry</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Mesh Count</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.slug === p.category_slug);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              backgroundColor: '#F1F5F9',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              border: '1px solid #E2E8F0',
                            }}
                          >
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <ImageIcon size={20} color="#94A3B8" />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0F172A' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>{p.tagline || p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#334155', fontWeight: 500 }}>
                        {p.code || '—'}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#EFF6FF',
                            color: '#1D4ED8',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          {cat ? cat.name : p.category_slug}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#475569', fontSize: '13px' }}>
                        {p.specs?.chemistry || 'Standard'}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#475569', fontSize: '13px' }}>
                        {p.specs?.meshCount || '—'}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Product"
                            style={{
                              backgroundColor: '#F1F5F9',
                              border: 'none',
                              color: '#334155',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            title="Delete Product"
                            style={{
                              backgroundColor: '#FEE2E2',
                              border: 'none',
                              color: '#DC2626',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Confirm Delete
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748B' }}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          data-lenis-prevent
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '20px',
            backdropFilter: 'blur(4px)',
            overscrollBehavior: 'contain',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            data-lenis-prevent
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '760px',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              overscrollBehavior: 'contain',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              data-lenis-prevent
              onSubmit={handleSave}
              style={{
                flex: 1,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                overscrollBehavior: 'contain',
              }}
            >
              {/* Product Image Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Product Thumbnail Image
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px dashed #CBD5E1',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={28} color="#94A3B8" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="product-image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="product-image-upload"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: '1px solid #CBD5E1',
                      }}
                    >
                      <Upload size={15} />
                      <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                    </label>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                      PNG, JPG, or WebP (square aspect ratio recommended)
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Fields Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Prime H White"
                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. prime-h-white"
                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category_slug}
                    onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Product Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. CT-WB-01"
                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. High-Opacity Underbase & Highlight White"
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Short Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  placeholder="One sentence description used in product listings..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full technical overview for the product detail page..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Technical Specifications Sub-section */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                  Technical Specifications (TDS)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Mesh Count
                    </label>
                    <input
                      type="text"
                      value={formData.meshCount}
                      onChange={(e) => setFormData({ ...formData, meshCount: e.target.value })}
                      placeholder="e.g. 43T to 77T"
                      style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Cure Temperature
                    </label>
                    <input
                      type="text"
                      value={formData.cureTemp}
                      onChange={(e) => setFormData({ ...formData, cureTemp: e.target.value })}
                      placeholder="e.g. 150°C – 160°C"
                      style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Viscosity
                    </label>
                    <input
                      type="text"
                      value={formData.viscosity}
                      onChange={(e) => setFormData({ ...formData, viscosity: e.target.value })}
                      placeholder="e.g. 180,000 cPs"
                      style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Wash Fastness
                    </label>
                    <input
                      type="text"
                      value={formData.washFastness}
                      onChange={(e) => setFormData({ ...formData, washFastness: e.target.value })}
                      placeholder="e.g. 4.5 / 5.0"
                      style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Polymer Chemistry
                    </label>
                    <input
                      type="text"
                      value={formData.chemistry}
                      onChange={(e) => setFormData({ ...formData, chemistry: e.target.value })}
                      placeholder="e.g. Water-Dispersible Acrylic"
                      style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Shelf Life
                    </label>
                    <input
                      type="text"
                      value={formData.shelfLife}
                      onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                      placeholder="e.g. 12 Months"
                      style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Features Array Editor */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    Key Features
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                    style={{ background: 'none', border: 'none', color: '#2B3A8F', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + Add Feature
                  </button>
                </div>
                {formData.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                      placeholder={`Feature ${idx + 1}...`}
                      style={{ flex: 1, height: '34px', padding: '0 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.features.filter((_, i) => i !== idx);
                          setFormData({ ...formData, features: updated });
                        }}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0 6px' }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Applications Array Editor */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    Recommended Applications
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, applications: [...formData.applications, ''] })}
                    style={{ background: 'none', border: 'none', color: '#2B3A8F', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + Add Application
                  </button>
                </div>
                {formData.applications.map((app, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <input
                      type="text"
                      value={app}
                      onChange={(e) => {
                        const updated = [...formData.applications];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, applications: updated });
                      }}
                      placeholder={`Application ${idx + 1}...`}
                      style={{ flex: 1, height: '34px', padding: '0 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    />
                    {formData.applications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.applications.filter((_, i) => i !== idx);
                          setFormData({ ...formData, applications: updated });
                        }}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0 6px' }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid #E2E8F0',
                  marginTop: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2B3A8F',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
