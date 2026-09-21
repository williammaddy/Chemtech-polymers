import React, { useState, useEffect } from 'react';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  updateGalleryOrder,
  deleteGalleryImage,
  uploadFile,
  isSupabaseConfigured,
} from '../../lib/supabase';
import type { GalleryImageRow } from '../../types/database';
import {
  Plus,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Edit3,
  Save,
} from 'lucide-react';

export const GalleryManagementPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch (err) {
      console.error('Error loading gallery images:', err);
      setStatusMessage({ type: 'error', text: 'Failed to load gallery images.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setUploading(true);
    setStatusMessage(null);

    try {
      let currentMaxOrder = images.reduce((max, img) => Math.max(max, img.sort_order || 0), 0);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let imageUrl = URL.createObjectURL(file);

        if (isSupabaseConfigured) {
          const fileExt = file.name.split('.').pop();
          const filePath = `gallery-${Date.now()}-${i}.${fileExt}`;
          imageUrl = await uploadFile('gallery-images', filePath, file);
        }

        currentMaxOrder += 1;
        await createGalleryImage({
          image_url: imageUrl,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          sort_order: currentMaxOrder,
        });
      }

      setStatusMessage({ type: 'success', text: `${files.length} images added to the gallery!` });
      await loadGallery();
    } catch (err: any) {
      console.error('Error uploading gallery images:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload images.' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveCaption = async (id: string) => {
    try {
      await updateGalleryImage(id, { caption: editCaption });
      setEditingId(null);
      setStatusMessage({ type: 'success', text: 'Caption updated.' });
      await loadGallery();
    } catch (err: any) {
      console.error('Error updating caption:', err);
      setStatusMessage({ type: 'error', text: 'Failed to update caption.' });
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteGalleryImage(id);
      setDeleteConfirmId(null);
      setStatusMessage({ type: 'success', text: 'Image removed from gallery.' });
      await loadGallery();
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setStatusMessage({ type: 'error', text: 'Failed to delete image.' });
    }
  };

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const reordered = [...images];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update local state immediately for snappy UI
    const updated = reordered.map((img, idx) => ({ ...img, sort_order: idx + 1 }));
    setImages(updated);

    try {
      await updateGalleryOrder(updated.map((img) => ({ id: img.id, sort_order: img.sort_order })));
    } catch (err) {
      console.error('Error updating gallery order:', err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#0F172A', letterSpacing: '-0.4px' }}>
            Gallery Management
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
            Curate the public photography showcase, upload new studio sample prints, reorder images, and manage captions.
          </p>
        </div>

        <div>
          <input
            type="file"
            id="multi-gallery-upload"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={handleMultiFileUpload}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="multi-gallery-upload"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#2B3A8F',
              color: '#FFFFFF',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: uploading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(43, 58, 143, 0.25)',
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Uploading Images...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Upload Images</span>
              </>
            )}
          </label>
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

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#64748B', border: '1px solid #E2E8F0' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <div>Loading gallery pictures...</div>
        </div>
      ) : images.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#64748B', border: '1px solid #E2E8F0' }}>
          <ImageIcon size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>No Gallery Images Yet</div>
          <p style={{ fontSize: '13.5px', marginTop: '6px' }}>Click "Upload Images" to showcase printed garments and inks on the public site.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {images.map((img, idx) => {
            const isEditingThis = editingId === img.id;

            return (
              <div
                key={img.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image Container */}
                <div style={{ height: '200px', backgroundColor: '#F1F5F9', position: 'relative' }}>
                  <img
                    src={img.image_url}
                    alt={img.caption || 'Gallery Image'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Order Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    #{idx + 1}
                  </div>
                </div>

                {/* Caption & Controls */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {isEditingThis ? (
                    <div style={{ marginBottom: '12px' }}>
                      <textarea
                        rows={2}
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Image caption..."
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #2B3A8F',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button
                          onClick={() => handleSaveCaption(img.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#2B3A8F',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Save size={13} />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            border: '1px solid #CBD5E1',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingId(img.id);
                        setEditCaption(img.caption || '');
                      }}
                      title="Click to edit caption"
                      style={{
                        fontSize: '13px',
                        color: img.caption ? '#1E293B' : '#94A3B8',
                        fontStyle: img.caption ? 'normal' : 'italic',
                        marginBottom: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                      }}
                    >
                      <span style={{ flex: 1 }}>{img.caption || 'Click to add caption...'}</span>
                      <Edit3 size={13} color="#94A3B8" style={{ flexShrink: 0, marginTop: '3px' }} />
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => moveImage(idx, 'up')}
                        disabled={idx === 0}
                        title="Move left / up"
                        style={{
                          backgroundColor: '#F1F5F9',
                          border: 'none',
                          color: idx === 0 ? '#CBD5E1' : '#334155',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        title="Move right / down"
                        style={{
                          backgroundColor: '#F1F5F9',
                          border: 'none',
                          color: idx === images.length - 1 ? '#CBD5E1' : '#334155',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          cursor: idx === images.length - 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => setDeleteConfirmId(img.id)}
                      title="Delete Image"
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Delete Gallery Photo?
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748B' }}>
              This image will be permanently removed from the public website gallery.
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
                onClick={() => handleDeleteImage(deleteConfirmId)}
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
    </div>
  );
};
