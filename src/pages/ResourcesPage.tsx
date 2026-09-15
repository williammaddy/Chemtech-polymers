import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { articlesData } from '../data/articlesData';
import {
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Articles (7)' },
    { id: 'Curing & Drying', label: 'Curing & Drying' },
    { id: 'Troubleshooting', label: 'Troubleshooting' },
    { id: 'Performance Fabrics', label: 'Performance Fabrics' },
    { id: 'Specialty Effects', label: 'Specialty Effects' },
    { id: 'Heat Transfer', label: 'Heat Transfer' },
    { id: 'Compliance & Safety', label: 'Compliance & Safety' },
    { id: 'Craft Ink', label: 'Craft Ink' },
  ];

  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(q) ||
          article.summary.toLowerCase().includes(q) ||
          article.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="resources-page" style={{ paddingTop: '100px' }}>
      <Breadcrumbs items={[{ label: 'Technical Resources & Guides' }]} />

      {/* Header Banner */}
      <section className="page-header-banner" style={{ padding: '48px 0 54px', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <span className="accent-dot blue" />
            <span>Industrial Technical Knowledge Base</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            Textile Screen Printing Application Guides
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-body)', maxWidth: '820px', lineHeight: 1.7 }}>
            Authoritative technical literature, temperature profiles, curing dynamics, and troubleshooting protocols
            researched by Chemtech Polymers application chemists for industrial factories and master decorators.
          </p>
        </div>
      </section>

      {/* Filter / Search Bar */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)', padding: '20px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '8px' }}>
                <Filter size={15} />
                <span>Filter by Topic:</span>
              </span>

              {categories.map((c) => {
                const isSelected = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 500,
                      padding: '7px 18px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1.5px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--primary-color)' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--text-body)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div style={{ flex: '1 1 240px' }} className="resources-search-wrap">
              <input
                type="text"
                placeholder="Search technical guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  minHeight: '42px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section" style={{ backgroundColor: '#F8FAFC', paddingTop: '64px', paddingBottom: '96px' }}>
        <div className="container">
          <div className="resources-articles-grid">
            {filteredArticles.map((article) => (
              <div
                key={article.slug}
                className="guide-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-normal)',
                }}
              >
                {/* Article Card Photo */}
                <Link
                  to={`/resources/${article.slug}`}
                  style={{ position: 'relative', height: '200px', display: 'block', overflow: 'hidden' }}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(6px)',
                      color: article.badgeColor,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {article.category}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Clock size={12} />
                    <span>{article.readTime}</span>
                  </div>
                </Link>

                {/* Article Card Body */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {article.publishDate} • {article.author}
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.35, fontFamily: 'var(--font-heading)' }}>
                      <Link to={`/resources/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {article.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.45 }}>
                      {article.subtitle}
                    </p>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                      {article.summary}
                    </p>

                    {/* Key Takeaways Preview */}
                    <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-color)', marginBottom: '6px' }}>
                        Key Takeaways:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {article.takeaways.slice(0, 2).map((takeaway, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78rem', color: 'var(--text-body)' }}>
                            <CheckCircle2 size={13} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                    <Link
                      to={`/resources/${article.slug}`}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', justifyContent: 'space-between', textDecoration: 'none' }}
                    >
                      <span>Read Technical Guide</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Diagnostics Support Callout Strip */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(43, 58, 143, 0.18)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BookOpen size={24} color="var(--primary-color)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
                  Need Custom Factory Formulations or On-Site Line Audits?
                </h4>
                <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-body)' }}>
                  Our application engineers provide on-site technical diagnostics, conveyor dryer thermal profiling, and RSL compliance support.
                </p>
              </div>
            </div>
            <Link to="/contact" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              <span>Consult an Application Chemist</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1020px) {
          .resources-articles-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 680px) {
          .resources-articles-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
