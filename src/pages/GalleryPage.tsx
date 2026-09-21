import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LightboxModal } from '../components/LightboxModal';
import { getGalleryImages } from '../lib/supabase';
import type { GalleryImageRow } from '../types/database';
import { Sparkles, Maximize2, Loader2, Image as ImageIcon } from 'lucide-react';
import gsap from 'gsap';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchImages() {
      setLoading(true);
      try {
        const data = await getGalleryImages();
        if (isMounted) {
          setImages(data);
        }
      } catch (err) {
        console.error('Error loading gallery images:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP Entrance animation
  useEffect(() => {
    if (!loading && images.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.gallery-item-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }
  }, [loading, images]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="gallery-page" style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: '#FAFAF9' }}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Print Gallery' }]} />

      {/* Hero Header */}
      <section style={{ padding: '32px 0 48px' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ maxWidth: '780px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '30px',
                backgroundColor: 'rgba(43, 58, 143, 0.08)',
                color: '#2B3A8F',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              <Sparkles size={15} />
              <span>Studio & Press Showcase</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: '0 0 16px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Masterpiece Prints Crafted with Chemtech Inks
            </h1>

            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: '#475569',
                margin: 0,
              }}
            >
              Explore high-opacity underbases, zero-hand feel water base finishes, 3D sculptural puff dimensions, and reflective metallic pastes produced on automatic and manual textile presses.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section style={{ paddingBottom: '96px' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div
              style={{
                padding: '80px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                color: '#2B3A8F',
              }}
            >
              <Loader2 size={36} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#64748B', fontSize: '15px' }}>Loading print gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '64px 24px',
                textAlign: 'center',
                border: '1px solid #E2E8F0',
              }}
            >
              <ImageIcon size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', margin: '0 0 8px' }}>
                No Gallery Images Available
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                Check back soon as new press run photographs and swatch showcases are published.
              </p>
            </div>
          ) : (
            <div
              ref={gridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => openLightbox(idx)}
                  className="gallery-item-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    position: 'relative',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(43, 58, 143, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  {/* Photo container */}
                  <div
                    style={{
                      height: '280px',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#F1F5F9',
                    }}
                  >
                    <img
                      src={img.image_url}
                      alt={img.caption || 'Chemtech sample print'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />

                    {/* Hover Zoom Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.35)',
                        opacity: 0,
                        transition: 'opacity 0.25s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="hover-overlay"
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          color: '#2B3A8F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        <Maximize2 size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Caption Info below image */}
                  {img.caption && (
                    <div style={{ padding: '16px 20px' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14.5px',
                          fontWeight: 600,
                          color: '#1E293B',
                          lineHeight: 1.45,
                        }}
                      >
                        {img.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        images={images}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setSelectedIndex(newIdx)}
      />

      <style>{`
        .gallery-item-card:hover .hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};
