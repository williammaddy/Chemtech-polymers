import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import heroVideo from '../assets/Herovideo.mp4';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headlineWords = [
    { text: 'Innovative', highlight: false },
    { text: 'Textile', highlight: false },
    { text: 'Screen', highlight: false },
    { text: 'Printing', highlight: false },
    { text: 'Inks,', highlight: false },
    { text: 'Engineered', highlight: true },
    { text: 'for', highlight: true },
    { text: 'Excellence', highlight: true },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge-item', {
        opacity: 0,
        y: -16,
        duration: 0.6,
        delay: 0.1,
      })
        .from(
          '.hero-word',
          {
            opacity: 0,
            y: 24,
            stagger: 0.06,
            duration: 0.7,
          },
          '-=0.3'
        )
        .from(
          '.hero-subheadline',
          {
            opacity: 0,
            y: 18,
            duration: 0.7,
          },
          '-=0.4'
        )
        .from(
          '.hero-cta-group',
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          '.hero-trust-row',
          {
            opacity: 0,
            y: 14,
            duration: 0.6,
          },
          '-=0.3'
        )
        .from(
          '.hero-video-container',
          {
            opacity: 0,
            scale: 0.94,
            y: 20,
            duration: 0.8,
          },
          '-=0.5'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef}>
      {/* Ambient Morphing Liquid Ink Blobs (Subtle brand tone accents) */}
      <div
        className="ink-morph-blob"
        style={{
          width: '540px',
          height: '540px',
          top: '-8%',
          right: '-5%',
          background: 'radial-gradient(circle, rgba(43, 58, 143, 0.14) 0%, rgba(0, 168, 150, 0.07) 55%, transparent 75%)',
          zIndex: 1,
        }}
      />
      <div
        className="ink-morph-blob"
        style={{
          width: '460px',
          height: '460px',
          bottom: '10%',
          left: '-8%',
          background: 'radial-gradient(circle, rgba(243, 112, 33, 0.09) 0%, rgba(146, 39, 143, 0.06) 50%, transparent 75%)',
          animationDuration: '28s',
          animationDirection: 'reverse',
          zIndex: 1,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '72px' }}>
        <div className="hero-grid">
          {/* Left Column: Hero Typography & Actions */}
          <div className="hero-content">
            {/* Top Badge Pill with 5 Brand Accent Dots */}
            <div
              className="badge-pill hero-badge-item"
              style={{
                marginBottom: '22px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 14px rgba(43, 58, 143, 0.06)',
              }}
            >
              <div className="dots-row">
                <span className="accent-dot orange" />
                <span className="accent-dot red" />
                <span className="accent-dot purple" />
                <span className="accent-dot teal" />
                <span className="accent-dot gold" />
              </div>
              <span>Premier Textile Screen Printing Chemistry</span>
            </div>

            {/* Staggered Word Reveal Headline */}
            <h1
              style={{
                marginBottom: '22px',
                color: 'var(--text-main)',
                letterSpacing: '-0.03em',
                lineHeight: 1.18,
              }}
            >
              {headlineWords.map((item, index) => (
                <span
                  key={index}
                  className="hero-word"
                  style={{
                    color: item.highlight ? 'var(--primary-color)' : 'var(--text-main)',
                    display: 'inline-block',
                    marginRight: '0.28em',
                  }}
                >
                  {item.text}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              className="hero-subheadline"
              style={{
                fontSize: '1.2rem',
                color: 'var(--text-body)',
                lineHeight: 1.72,
                marginBottom: '38px',
                maxWidth: '680px',
                fontWeight: 450,
              }}
            >
              Chemtech Polymers is an established manufacturer of high-grade textile screen printing formulations.
              Delivering intense pigmentation, commercial wash durability, and sustainable chemistry engineered
              for high-speed automatic presses.
            </p>

            {/* Dual CTA Buttons with Shine-Sweep Micro-Interaction */}
            <div
              className="hero-cta-group"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '46px',
              }}
            >
              <button
                type="button"
                onClick={() => handleScrollTo('products')}
                className="btn btn-primary btn-lg btn-shine"
              >
                <span>Explore Products</span>
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo('contact')}
                className="btn btn-outline btn-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <span>Contact Sales & Trials</span>
              </button>
            </div>

            {/* Quality & Safety Trust Row */}
            <div
              className="hero-trust-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '24px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(43, 58, 143, 0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--accent-teal)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-body)' }}>
                  100% PVC & Phthalate Free
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--accent-orange)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-body)' }}>
                  High-Opacity Underbases
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--primary-color)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-body)' }}>
                  Silky Soft Hand-Feel
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contained Video Frame with Soft Shadow & Glow Ring */}
          <div className="hero-video-container">
            <div className="hero-video-glow-ring" />
            <div className="hero-video-frame">
              <video
                src={heroVideo || "assets/HeroVideo.mp4"}
                autoPlay
                loop
                muted
                playsInline
                className="hero-video"
              >
                <source src={heroVideo} type="video/mp4" />
                <source src="assets/HeroVideo.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Section Divider into About */}
      <div className="wave-divider" style={{ position: 'relative', zIndex: 2 }}>
        <svg viewBox="0 0 1440 54" fill="none" preserveAspectRatio="none">
          <path
            d="M0,24 C320,54 640,0 960,28 C1200,48 1360,18 1440,24 L1440,54 L0,54 Z"
            fill="var(--bg-pastel-blue)"
          />
        </svg>
      </div>
    </section>
  );
};
