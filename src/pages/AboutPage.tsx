import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AnimatedCounter } from '../components/AnimatedCounter';
import aboutImage1 from '../assets/About1.jpeg'
import aboutImage2 from '../assets/About2.png'
import {
  ShieldCheck,
  Award,
  Layers,
  Leaf,
  Factory,
  Cpu,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  Recycle,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page" style={{ paddingTop: '100px' }}>
      <Breadcrumbs items={[{ label: 'About Chemtech' }]} />

      {/* Page Header Banner */}
      <section className="page-header-banner" style={{ padding: '48px 0 64px', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div className="badge-pill" style={{ marginBottom: '16px' }}>
            <span className="accent-dot teal" />
            <span>Company Profile & Manufacturing Heritage</span>
          </div>
          <h1 className="page-title" style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            Formulating Quality, Driving Textile Screen Printing Innovation
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-body)', maxWidth: '780px', lineHeight: 1.7 }}>
            A trusted Indian chemical manufacturer delivering advanced polymer dispersion, vivid color consistency,
            and eco-certified print durability for commercial garment decorators worldwide.
          </p>
        </div>
      </section>

      {/* Main Narrative & Industrial Facilities */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div
            style={{ marginBottom: '72px' }}
            className="about-grid"
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span className="accent-dot orange" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Our Manufacturing Core
                </span>
              </div>
              <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', marginBottom: '22px', fontFamily: 'var(--font-heading)' }}>
                Excellence Engineered into Every Chemical Formulation
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-body)', marginBottom: '20px' }}>
                <strong>Chemtech Polymers</strong> is a leading manufacturer of high-grade textile screen printing inks.
                With an enduring commitment to innovation, pigment science, and chemical engineering, we specialize in
                formulating a comprehensive spectrum of water-based dispersions, non-PVC acrysol polymers, phthalate-free
                plastisols, and tactile specialty gels.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-body)', marginBottom: '28px' }}>
                Our formulations are engineered to deliver intense color saturation, exceptional commercial wash-fastness,
                and smooth high-speed press runnability. By prioritizing ecological sustainability, zero-VOC profiles, and
                stringent compliance with international Restricted Substance Lists (RSL), Chemtech Polymers serves as a primary
                manufacturing partner for tier-1 garment exporters, industrial print operations, and boutique fashion decorators.
              </p>

              <div style={{ marginBottom: '32px' }} className="about-checklist">
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
                    Dedicated Technical Support
                  </span>
                </div>
              </div>
            </div>

            {/* Industrial Imagery Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                <img
                  src={aboutImage1}
                  alt="Industrial textile screen printing manufacturing facility"
                  style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Production Standard
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>
                    Automated High-Shear Dispersion & Milling
                  </h4>
                </div>
              </div>

              <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                <img
                  src={aboutImage2}
                  alt="Quality control laboratory testing textile printing inks"
                  style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Quality Assurance
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>
                    In-House Spectrophotometric & Wash Fastness QC
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Statistics Row */}
          <div
            className="stats-strip"
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 28px',
              marginBottom: '72px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <AnimatedCounter target={6} suffix="" />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Formulation Categories
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnimatedCounter target={40} suffix="+" />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Technical Inks & Additives
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnimatedCounter target={25} suffix="+" />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Years Industry Trust
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnimatedCounter target={100} suffix="%" />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Phthalate & PVC-Free Options
              </div>
            </div>
          </div>

          {/* Mission, Vision & Core Values */}
          <div style={{ marginBottom: '72px' }} className="about-values-grid">
            <div className="card" style={{ padding: '32px 28px', borderTop: '4px solid var(--primary-color)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <FlaskConical size={22} color="var(--primary-color)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '12px' }}>Precision Formulation</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.65 }}>
                Every batch undergoes rigorous viscosity checking, grind-gauge particle analysis, and spectrophotometer color matching
                to guarantee zero shade drift between manufacturing lots.
              </p>
            </div>

            <div className="card" style={{ padding: '32px 28px', borderTop: '4px solid var(--accent-teal)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(0, 168, 150, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Leaf size={22} color="var(--accent-teal)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '12px' }}>Sustainable Chemistry</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.65 }}>
                We actively pioneer non-PVC Acrysol polymers and ultra-low VOC aqueous bases, eliminating heavy metals, APEOs,
                and endocrine disruptors from textile wash water.
              </p>
            </div>

            <div className="card" style={{ padding: '32px 28px', borderTop: '4px solid var(--accent-orange)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(243, 112, 33, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Award size={22} color="var(--accent-orange)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '12px' }}>Factory Runnability</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.65 }}>
                Engineered from the printer's perspective: rapid platen flash speed, open-screen stability that prevents mesh clogging,
                and silky-soft hand-feel that delights end consumers.
              </p>
            </div>
          </div>

          {/* CTA Footer Row */}
          <div className="about-cta-card">
            <div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: '0 0 6px', fontFamily: 'var(--font-heading)' }}>
                Interested in Custom Batch Formulations?
              </h3>
              <p style={{ margin: 0, color: 'var(--text-body)', fontSize: '0.95rem' }}>
                Speak directly with an application chemist to tailor viscosity, flash times, or substrate adhesion.
              </p>
            </div>
            <div className="about-cta-buttons">
              <Link to="/products" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                <span>Browse Catalogue</span>
              </Link>
              <Link to="/contact" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <span>Contact Our Lab</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
