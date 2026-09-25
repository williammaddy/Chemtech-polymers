import React, { useState, useEffect } from 'react';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  uploadFile,
  isSupabaseConfigured,
} from '../../lib/supabase';
import type { ResourceRow } from '../../types/database';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  Loader2,
  AlertCircle,
  X,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

export const ResourceManagementPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    subtitle: '',
    category: 'Application & Curing',
    teaser: '',
    body: '',
    image_url: '',
    author: 'Chemtech Application Engineering Lab',
    publish_date: 'September 2026',
    read_time: '5 min read',
    badge_color: '#1FA97A',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResources();
      setResources(data);
    } catch (err) {
      console.error('Error loading resources:', err);
      setStatusMessage({ type: 'error', text: 'Failed to load resources.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
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
    setEditingResource(null);
    setFormData({
      slug: '',
      title: '',
      subtitle: '',
      category: 'Application & Curing',
      teaser: '',
      body: '',
      image_url: '',
      author: 'Chemtech Application Engineering Lab',
      publish_date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      read_time: '5 min read',
      badge_color: '#1FA97A',
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (r: ResourceRow) => {
    setEditingResource(r);
    setFormData({
      slug: r.slug,
      title: r.title,
      subtitle: r.subtitle || '',
      category: r.category || 'Application & Curing',
      teaser: r.teaser || '',
      body: r.body || '',
      image_url: r.image_url || '',
      author: r.author || 'Chemtech Application Engineering Lab',
      publish_date: r.publish_date || '',
      read_time: r.read_time || '5 min read',
      badge_color: r.badge_color || '#1FA97A',
    });
    setImageFile(null);
    setImagePreview(r.image_url || '');
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

      if (imageFile && isSupabaseConfigured) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `resource-${formData.slug || Date.now()}.${fileExt}`;
        finalImageUrl = await uploadFile('resource-images', filePath, imageFile);
      }

      const generatedSlug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const payload = {
        slug: generatedSlug,
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        teaser: formData.teaser,
        body: formData.body,
        image_url: finalImageUrl,
        author: formData.author,
        publish_date: formData.publish_date,
        read_time: formData.read_time,
        badge_color: formData.badge_color,
      };

      if (editingResource) {
        await updateResource(editingResource.id || editingResource.slug, payload);
        setStatusMessage({ type: 'success', text: `Resource "${payload.title}" updated!` });
      } else {
        await createResource(payload);
        setStatusMessage({ type: 'success', text: `Resource "${payload.title}" created!` });
      }

      setIsModalOpen(false);
      await loadResources();
    } catch (err: any) {
      console.error('Error saving resource:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save resource.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResource(id);
      setDeleteConfirmId(null);
      setStatusMessage({ type: 'success', text: 'Resource deleted.' });
      await loadResources();
    } catch (err: any) {
      console.error('Error deleting resource:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete resource.' });
    }
  };

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.teaser && r.teaser.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#0F172A', letterSpacing: '-0.4px' }}>
            Resource & Technical Guides Management
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
            Publish ink application guidelines, troubleshooting articles, and curing parameters for screen printers.
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
          <span>Add Resource</span>
        </button>
      </div>

      {/* Status Alert */}
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
          placeholder="Search articles & guides..."
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
            <div>Loading resources...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
            <BookOpen size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: '15px' }}>No resources found</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Article Title</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Author</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
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
                          }}
                        >
                          {r.image_url ? (
                            <img src={r.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={20} color="#94A3B8" />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{r.title}</div>
                          <div style={{ fontSize: '12px', color: '#64748B', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.teaser}
                          </div>
                        </div>
                      </div>
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
                        {r.category || 'Guide'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#475569', fontSize: '13px' }}>
                      {r.author}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '12.5px' }}>
                      {r.publish_date}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(r)}
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
                          onClick={() => setDeleteConfirmId(r.id)}
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
                ))}
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
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Confirm Delete Resource
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748B' }}>
              Are you sure you want to delete this technical resource?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Resource Modal */}
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
              maxWidth: '720px',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              overscrollBehavior: 'contain',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                {editingResource ? 'Edit Resource' : 'Add New Technical Guide'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

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
                gap: '18px',
                overscrollBehavior: 'contain',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. How to Use Water Base Inks — Application & Curing Guide"
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Slug (URL key)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. water-base-curing-guide"
                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Curing & Drying"
                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Subtitle / Teaser Headline
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Conveyor dryer parameters, evaporation dynamics..."
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Teaser Summary (short preview)
                </label>
                <textarea
                  rows={2}
                  value={formData.teaser}
                  onChange={(e) => setFormData({ ...formData, teaser: e.target.value })}
                  placeholder="Brief 2-3 sentence overview..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Article Body / Content
                </label>
                <textarea
                  rows={6}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Full technical guide content and recommendations..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Cover Image */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Cover Image
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <input
                    type="file"
                    id="resource-image-input"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="resource-image-input"
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
                    <Upload size={14} />
                    <span>Choose Cover Image</span>
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2B3A8F', color: '#FFFFFF', fontSize: '13.5px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {saving && <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
                  <span>{editingResource ? 'Save Changes' : 'Publish Resource'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
