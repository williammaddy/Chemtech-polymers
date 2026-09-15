import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { Leaf, Award, Layers, Sparkles, CheckCircle2, ShieldCheck, Factory, Cpu } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="section section-pastel" style={{ paddingTop: '80px', paddingBottom: '0' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <span className="accent-dot teal" />
            <span>About Chemtech Polymers</span>
          </div>
          <h2 className="section-title">Formulating Quality, Driving Textile Innovation</h2>
          <p className="section-subtitle">
            A trusted Indian chemical manufacturer delivering advanced polymer dispersion, vibrant color
            consistency, and sustainable print durability for modern textile screen printers worldwide.
          </p>
        </div>

        {/* Narrative & Real Production Photography Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            alignItems: 'center',
            marginBottom: '64px',
          }}
          className="about-grid"
        >
          {/* Main Story Narrative */}
          <div
            className="card"
            style={{
              padding: '40px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(43, 58, 143, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="accent-dot orange" />
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Manufacturer Profile
              </span>
            </div>

            <h3
              style={{
                color: 'var(--primary-color)',
                marginBottom: '18px',
                fontSize: '1.5rem',
              }}
            >
              Excellence Engineered into Every Formulation
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-body)', marginBottom: '18px' }}>
              <strong>Chemtech Polymers</strong> is a leading manufacturer of high-quality textile screen printing inks.
              With an enduring commitment to innovation and technical precision, we specialize in formulating
              a comprehensive range of inks tailored specifically for the textile screen printing process.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-body)', marginBottom: '24px' }}>
              Our formulations are designed to deliver vibrant color retention, unmatched wash durability, and smooth
              production runnability. By prioritizing sustainability, low-VOC profiles, and non-PVC alternatives,
              Chemtech Polymers stands as a trusted manufacturing partner for garment exporters, industrial print
              shops, and specialty decorators across India and international markets.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="about-checklist">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="accent-dot orange" />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Consistent Batch Viscosity
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="accent-dot teal" />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Zero PVC & Phthalate Options
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="accent-dot purple" />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  High-Opacity Underbases
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="accent-dot gold" />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Dedicated Application Support
                </span>
              </div>
            </div>
          </div>

          {/* Real Photography & Value Pillars Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Real Production Machinery Photography Card */}
            <div
              className="card"
              style={{
                padding: '0',
                overflow: 'hidden',
                position: 'relative',
                height: '200px',
                border: '1px solid rgba(43, 58, 143, 0.12)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                alt="Automated textile machinery and ink manufacturing"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="img-cool-tone"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(18, 25, 59, 0.2) 0%, rgba(18, 25, 59, 0.82) 100%)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)', marginBottom: '4px' }}>
                  <Factory size={16} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Industrial Production
                  </span>
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.05rem' }}>
                  Continuous Quality-Controlled Batching
                </div>
              </div>
            </div>

            {/* Pillar 1: Sustainable Chemistry */}
            <div
              className="card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                borderLeft: '4px solid var(--accent-teal)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-teal-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-teal)',
                  flexShrink: 0,
                }}
              >
                <Leaf size={22} />
              </div>
              <div>
                <h4 style={{ color: 'var(--accent-teal)', marginBottom: '4px', fontSize: '1.05rem' }}>
                  Responsible Ecological Chemistry
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                  Pioneering water-based and non-PVC Acrysol formulations conforming to international safety benchmarks.
                </p>
              </div>
            </div>

            {/* Pillar 2: Wash Fastness */}
            <div
              className="card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                borderLeft: '4px solid var(--primary-color)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-color)',
                  flexShrink: 0,
                }}
              >
                <Layers size={22} />
              </div>
              <div>
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '4px', fontSize: '1.05rem' }}>
                  Vibrant Color & Wash Fastness
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                  Formulated with micronized pigments to withstand rigorous commercial laundering cycles without fading.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Stats Row */}
        <div
          className="card"
          style={{
            padding: '36px 40px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(43, 58, 143, 0.12)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '80px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              textAlign: 'center',
            }}
            className="stats-grid"
          >
            {/* Stat 1: Product Categories */}
            <div style={{ padding: '8px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  color: 'var(--primary-color)',
                  lineHeight: 1.1,
                  marginBottom: '6px',
                }}
              >
                <AnimatedCounter target={3} suffix="+" />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '4px' }}>
                Core Categories
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Water Base, Non-PVC & Plastisol
              </p>
            </div>

            {/* Stat 2: Ink Variants */}
            <div style={{ padding: '8px', borderLeft: '1px solid var(--border-subtle)' }} className="stat-bordered">
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  color: 'var(--accent-orange)',
                  lineHeight: 1.1,
                  marginBottom: '6px',
                }}
              >
                <AnimatedCounter target={10} suffix="+" />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '4px' }}>
                Ink Variants & Gels
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Specialized for every fabric type
              </p>
            </div>

            {/* Stat 3: Years of Trust (clearly marked placeholder editable in code) */}
            <div style={{ padding: '8px', borderLeft: '1px solid var(--border-subtle)' }} className="stat-bordered">
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  color: 'var(--accent-purple)',
                  lineHeight: 1.1,
                  marginBottom: '6px',
                }}
              >
                {/* [PLACEHOLDER: Replace '15' with actual years in business when confirmed] */}
                <AnimatedCounter target={15} suffix="+" />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '4px' }}>
                Years of Trust
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Industry-proven manufacturing
              </p>
            </div>

            {/* Stat 4: Eco-Friendly / PVC-Free Focus (Badge with Icon) */}
            <div
              style={{
                padding: '8px',
                borderLeft: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="stat-bordered"
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-teal-soft)',
                  color: 'var(--accent-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                <Leaf size={30} />
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '4px' }}>
                Eco-Friendly Focus
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-teal)',
                  backgroundColor: 'var(--accent-teal-soft)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                }}
              >
                PVC-Free & Safe
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Section Divider into Products */}
      <div className="wave-divider" style={{ backgroundColor: 'var(--bg-pastel-blue)' }}>
        <svg viewBox="0 0 1440 54" fill="none" preserveAspectRatio="none">
          <path
            d="M0,30 C360,0 720,54 1080,24 C1260,10 1380,38 1440,30 L1440,54 L0,54 Z"
            fill="var(--bg-page)"
          />
        </svg>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px 16px !important;
          }
          .stat-bordered {
            border-left: none !important;
          }
        }
        @media (max-width: 540px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .about-checklist {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
