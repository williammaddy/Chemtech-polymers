import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getArticleBySlug, getRelatedArticles } from '../data/articlesData';
import {
  Clock,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();

  if (!articleSlug) {
    return <Navigate to="/resources" replace />;
  }

  const article = getArticleBySlug(articleSlug);

  if (!article) {
    return <Navigate to="/resources" replace />;
  }

  const relatedArticles = getRelatedArticles(article.slug, 3);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="article-detail-page" style={{ paddingTop: '100px' }}>
      <Breadcrumbs
        items={[
          { label: 'Resources', to: '/resources' },
          { label: article.title },
        ]}
      />

      {/* Article Header */}
      <article className="section" style={{ backgroundColor: '#FFFFFF', paddingTop: '40px', paddingBottom: '72px' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          {/* Metadata Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  backgroundColor: `${article.badgeColor}18`,
                  color: article.badgeColor,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {article.category}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {article.readTime}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {article.publishDate}</span>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-outline btn-sm print-hide-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
            >
              <Printer size={15} />
              <span>Print Bulletin</span>
            </button>
          </div>

          {/* Article Title & Subtitle */}
          <h1 style={{ fontSize: 'clamp(1.85rem, 5vw, 2.5rem)', color: 'var(--text-main)', marginBottom: '14px', lineHeight: 1.25, fontFamily: 'var(--font-heading)' }}>
            {article.title}
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
            {article.subtitle}
          </p>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            Technical Bulletin published by <strong>{article.author}</strong> | Reference Standard: <strong>{article.standardRef}</strong>
          </div>

          {/* Featured Header Photo */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              maxHeight: '400px',
              marginBottom: '36px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <img
              src={article.image}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Abstract / Scope Callout */}
          <div
            style={{
              backgroundColor: '#FAFBFD',
              borderLeft: '4px solid var(--primary-color)',
              padding: '20px 24px',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              marginBottom: '36px',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary-color)', marginBottom: '8px' }}>
              Technical Abstract & Industrial Scope
            </div>
            <p style={{ margin: 0, fontSize: '1.02rem', color: 'var(--text-body)', lineHeight: 1.75 }}>
              {article.overview}
            </p>
          </div>

          {/* Key Guidelines Checklist Box */}
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 'var(--radius-md)',
              padding: '24px 28px',
              marginBottom: '40px',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', color: '#166534', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
              <FileCheck2 size={20} color="var(--accent-teal)" />
              <span>Key Processing Guidelines & Takeaways</span>
            </h3>
            <div className="article-checklist-grid">
              {article.takeaways.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#166534', lineHeight: 1.5 }}>
                  <CheckCircle2 size={16} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Sections */}
          <div className="article-body-content" style={{ maxWidth: '75ch' }}>
            {article.sections.map((section, sIdx) => (
              <div key={sIdx} style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '14px', fontFamily: 'var(--font-heading)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  {section.heading}
                </h2>

                <p style={{ fontSize: '1.02rem', color: 'var(--text-body)', lineHeight: 1.8, marginBottom: '20px', whiteSpace: 'pre-line' }}>
                  {section.content}
                </p>

                {/* Sub Checklist */}
                {section.checklist && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0', paddingLeft: '8px' }}>
                    {section.checklist.map((cItem, cIdx) => (
                      <div key={cIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)', marginTop: '9px', flexShrink: 0 }} />
                        <span>{cItem}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technical Table */}
                {section.table && (
                  <div className="guide-table-wrapper" style={{ overflowX: 'auto', margin: '24px 0', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <table className="guide-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr>
                          {section.table.headers.map((h, hIdx) => (
                            <th key={hIdx} style={{ background: '#F1F5F9', color: 'var(--text-main)', padding: '12px 16px', fontWeight: 700, borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ padding: '12px 16px', color: 'var(--text-body)', borderBottom: '1px solid #E2E8F0' }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Critical Advisory Box */}
                {section.advisory && (
                  <div
                    style={{
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: 'var(--radius-sm)',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      fontSize: '0.925rem',
                      color: '#92400E',
                      marginTop: '20px',
                      lineHeight: 1.6,
                    }}
                  >
                    <AlertTriangle size={22} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>{section.advisory}</div>
                  </div>
                )}
              </div>
            ))}

            {/* Application Chemist Pro Tip */}
            <div
              style={{
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D5FF',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                margin: '36px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                  Application Chemist Pro-Tip
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.975rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
                {article.proTip}
              </p>
            </div>

            {/* Reference Standard Stamp */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <ShieldCheck size={18} color="var(--primary-color)" />
              <span>Grounded in International Industry Standard: <strong>{article.standardRef}</strong></span>
            </div>
          </div>
        </div>
      </article>

      {/* Related Technical Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="section" style={{ backgroundColor: '#F8FAFC', paddingTop: '64px', paddingBottom: '80px', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container" style={{ maxWidth: '860px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Related Technical Bulletins
              </h3>
              <Link to="/resources" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)', textDecoration: 'none' }}>
                <span>All Guides →</span>
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="article-related-grid">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/resources/${rel.slug}`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  className="related-article-card"
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: rel.badgeColor, textTransform: 'uppercase' }}>
                      {rel.category}
                    </span>
                    <h4 style={{ fontSize: '1.02rem', color: 'var(--text-main)', margin: '6px 0 8px', lineHeight: 1.4 }}>
                      {rel.title}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                    <span>Read Article</span>
                    <ChevronRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 680px) {
          .article-checklist-grid {
            grid-template-columns: 1fr !important;
          }
          .article-related-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
