import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImageRow } from '../types/database';

interface LightboxModalProps {
  images: GalleryImageRow[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    const nextIdx = (currentIndex - 1 + images.length) % images.length;
    onNavigate(nextIdx);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    const nextIdx = (currentIndex + 1) % images.length;
    onNavigate(nextIdx);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 15, 30, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'background 0.2s ease',
        }}
        title="Close (Esc)"
      >
        <X size={22} />
      </button>

      {/* Image Counter */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '28px',
          color: 'rgba(255, 255, 255, 0.75)',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous arrow */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s ease',
        }}
        title="Previous (Arrow Left)"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Next arrow */}
      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s ease',
        }}
        title="Next (Arrow Right)"
      >
        <ChevronRight size={28} />
      </button>

      {/* Center Image & Caption Container */}
      <div
        style={{
          maxWidth: '85vw',
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src={currentImage.image_url}
          alt={currentImage.caption || 'Print Sample'}
          style={{
            maxWidth: '100%',
            maxHeight: '74vh',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          }}
        />

        {currentImage.caption && (
          <div
            style={{
              marginTop: '16px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 500,
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              padding: '8px 20px',
              borderRadius: '20px',
              backdropFilter: 'blur(4px)',
              maxWidth: '650px',
              lineHeight: 1.4,
            }}
          >
            {currentImage.caption}
          </div>
        )}
      </div>
    </div>
  );
};
