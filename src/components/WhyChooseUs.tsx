import React from 'react';
import { Leaf, ShieldCheck, Microscope, Users, Sparkles, CheckCircle2, FlaskConical, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const differentiators = [
    {
      id: 1,
      icon: <Leaf size={26} />,
      accentColor: 'var(--color-secondary-green)',
      accentBg: 'var(--color-secondary-green-soft)',
      dotClass: 'teal',
      title: 'Eco-Friendly & PVC-Free Options',
      description:
        'Conforming to global safety and ecological benchmarks with zero PVC Acrysol and phthalate-free systems that safeguard both factory workers and the environment.',
      highlight: 'Compliant Chemistry',
    },
    {
      id: 2,
      icon: <Sparkles size={26} />,
      accentColor: 'var(--color-accent-orange)',
      accentBg: 'var(--color-accent-orange-soft)',
      dotClass: 'orange',
      title: 'Vibrant & Durable Color Fastness',
      description:
        'High-density micronized pigment dispersion engineered for outstanding opacity, sharp edge resolution, and long-lasting commercial wash durability.',
      highlight: 'Maximum Brilliance',
    },
    {
      id: 3,
      icon: <Microscope size={26} />,
      accentColor: 'var(--color-accent-teal)',
      accentBg: 'var(--color-accent-teal-soft)',
      dotClass: 'teal',
      title: 'Innovation-Driven R&D Testing',
      description:
        'Continuous formulation testing for stable viscosity, smooth mesh transfer, fast flash cure times, and flawless stretch recovery on all textile blends.',
      highlight: 'Rigorous Batch QC',
    },
    {
      id: 4,
      icon: <Users size={26} />,
      accentColor: 'var(--color-accent-purple)',
      accentBg: 'var(--color-accent-purple-soft)',
      dotClass: 'purple',
      title: 'Trusted B2B Industry Partner',
      description:
        'Trusted by commercial garment printers, exporters, and fabricators across India, backed by prompt on-site technical support and dependable bulk supply logistics.',
      highlight: 'Reliable Supply Chain',
    },
  ];

  return (
    <section
      id="why-us"
      className="section canvas-zone-section"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill canvas-pill">
            <span className="accent-dot purple" />
            <span>Why Chemtech Polymers</span>
          </div>
          <h2 className="section-title canvas-heading">The Preferred Choice for Professional Textile Printers</h2>
          <p className="section-subtitle canvas-text">
            Engineered to overcome common production bottlenecks: pinholing, screen clogging, color fading,
            and regulatory compliance.
          </p>
        </div>

        {/* Supporting Lab QC Feature Banner (Real B2B Chemical Photography) */}
        <div
          className="lab-qc-banner"
          style={{
            padding: '0',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '48px',
            backgroundColor: 'rgba(20, 26, 40, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              alignItems: 'center',
            }}
            className="lab-banner-grid"
          >
            <div style={{ padding: '40px 44px', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-teal)', marginBottom: '12px' }}>
                <FlaskConical size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Analytical Chemistry & Testing
                </span>
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.65rem', marginBottom: '14px', lineHeight: 1.3 }}>
                Every Batch Scientifically Validated for Production Reliability
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.975rem', lineHeight: 1.7, marginBottom: '22px' }}>
                Before any ink leaves our manufacturing floor, it undergoes automated viscosity rheology testing,
                pigment grind analysis, and 50+ commercial wash-test cycles to ensure seamless automatic press performance.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary-green)" />
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                    Certified Pure Pigments
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-accent-orange)" />
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                    Zero Heavy Metals
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-accent-mustard)" />
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                    Strict Batch Repeatability
                  </span>
                </div>
              </div>
            </div>

            <div style={{ height: '100%', minHeight: '260px', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80"
                alt="Chemical laboratory formulation and quality control"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="img-cool-tone"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(30, 34, 48, 0.95) 0%, rgba(30, 34, 48, 0.3) 60%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* 4 Differentiator Cards Grid */}
        <div className="grid-4">
          {differentiators.map((item) => (
            <div
              key={item.id}
              className="card canvas-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '30px 24px',
                borderTop: `4px solid ${item.accentColor}`,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: item.accentBg,
                      color: item.accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.3s ease',
                    }}
                    className="diff-icon"
                  >
                    {item.icon}
                  </div>
                  <span className={`accent-dot ${item.dotClass}`} />
                </div>

                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: item.accentColor,
                    letterSpacing: '0.04em',
                    display: 'inline-block',
                    marginBottom: '6px',
                  }}
                >
                  {item.highlight}
                </span>

                <h4
                  style={{
                    fontSize: '1.18rem',
                    color: 'var(--text-main)',
                    marginBottom: '10px',
                    lineHeight: 1.35,
                  }}
                >
                  {item.title}
                </h4>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-body)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                }}
              >
                <CheckCircle2 size={15} color={item.accentColor} />
                <span>Production Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lab-banner-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .lab-banner-grid > div:first-child {
            padding: 28px 18px !important;
          }
        }
      `}</style>
    </section>
  );
};
