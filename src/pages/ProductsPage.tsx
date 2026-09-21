import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { productCategories, productsData } from '../data/productsData';
import { getCategories, getProducts } from '../lib/supabase';
import {
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Droplets,
  ShieldCheck,
  Zap,
  Palette,
  FileText
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>(productCategories);
  const [products, setProducts] = useState<any[]>(productsData);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'water' | 'oil' | 'specialty' | 'craft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    getCategories().then((cats) => {
      if (mounted && cats && cats.length > 0) setCategories(cats);
    });
    getProducts().then((prods) => {
      if (mounted && prods && prods.length > 0) setProducts(prods);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Filter by type
      if (selectedFilter === 'water' && cat.slug !== 'water-base-inks') return false;
      if (selectedFilter === 'oil' && cat.slug !== 'non-pvc-acrysol' && cat.slug !== 'plastisol-inks') return false;
      if (selectedFilter === 'specialty' && cat.slug !== 'specialty-inks' && cat.slug !== 'heat-transfer') return false;
      if (selectedFilter === 'craft' && cat.slug !== 'craft-ink') return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchCat = cat.name.toLowerCase().includes(query) || (cat.description && cat.description.toLowerCase().includes(query));
        const matchProd = products.some(
          (p) =>
            (p.categorySlug === cat.slug || p.category_slug === cat.slug) &&
            (p.name.toLowerCase().includes(query) || (p.code && p.code.toLowerCase().includes(query)))
        );
        return matchCat || matchProd;
      }

      return true;
    });
  }, [categories, products, selectedFilter, searchQuery]);

  return (
    <div className="products-catalogue-page" style={{ paddingTop: '100px' }}>
      <Breadcrumbs items={[{ label: 'Products Catalogue' }]} />

      {/* Hero Category Banner */}
      <section className="page-header-banner" style={{ padding: '48px 0 54px', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <span className="accent-dot orange" />
            <span>Industrial Formulation Catalogue</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            High-Performance Textile Screen Printing Inks
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-body)', maxWidth: '820px', lineHeight: 1.7 }}>
            Browse our comprehensive formulation range: Water Base, Non-PVC Acrysol, Phthalate-Free Plastisols,
            Specialty Tactile Gels, Heat Transfer Adhesives, and Craft Inks. Every product includes an official
            downloadable Technical Data Sheet (TDS).
          </p>
        </div>
      </section>

      {/* Filter and Browse Bar */}
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
            {/* Category Filter Buttons (No price filter) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '8px' }}>
                <Filter size={15} />
                <span>Filter by Chemistry:</span>
              </span>

              {[
                { id: 'all', label: 'All Categories (6)' },
                { id: 'water', label: 'Water Base Inks' },
                { id: 'oil', label: 'Oil Base / Plastisol' },
                { id: 'specialty', label: 'Specialty & Transfer' },
                { id: 'craft', label: 'Craft Ink Series' },
              ].map((f) => {
                const isSelected = selectedFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilter(f.id as any)}
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
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div style={{ flex: '1 1 240px' }} className="products-search-wrap">
              <input
                type="text"
                placeholder="Search products or codes (e.g. Prime H, CT-WB-01)..."
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

      {/* Category Cards Catalogue Grid */}
      <section className="section" style={{ backgroundColor: '#FAFAFA', paddingTop: '64px', paddingBottom: '96px' }}>
        <div className="container">
          <div className="catalogue-category-grid">
            {filteredCategories.map((cat) => (
              <div
                key={cat.slug}
                className="category-catalogue-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all var(--transition-normal)',
                }}
              >
                {/* Image-Led Hero Top Frame (60% card visual emphasis) */}
                <Link
                  to={`/products/${cat.slug}`}
                  className="catalogue-img-frame"
                  style={{ position: 'relative', height: '280px', overflow: 'hidden', display: 'block' }}
                >
                  <img
                    src={cat.bannerImage || cat.banner_image_url}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="catalogue-img-zoom"
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.75) 100%)',
                    }}
                  />
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(6px)',
                        color: 'var(--primary-color)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {cat.categoryNumber || cat.category_number}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                    <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
                      {cat.name}
                    </h2>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
                      {cat.headline}
                    </div>
                  </div>
                </Link>

                {/* Card Body */}
                <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '20px' }}>
                      {cat.description}
                    </p>

                    {/* Products Preview Chips */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Formulations in this series ({products.filter((p) => (p.categorySlug === cat.slug || p.category_slug === cat.slug)).length}):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {products
                          .filter((p) => p.categorySlug === cat.slug || p.category_slug === cat.slug)
                          .map((prod) => (
                            <Link
                              key={prod.slug}
                              to={`/products/${cat.slug}/${prod.slug}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#F3F4F6',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--border-subtle)',
                                padding: '5px 12px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all var(--transition-fast)',
                              }}
                            >
                              <span>{prod.name}</span>
                              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({prod.code})</span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <FileText size={14} color="var(--primary-color)" />
                      <span>Full TDS Sheets Available</span>
                    </div>
                    <Link
                      to={`/products/${cat.slug}`}
                      className="btn btn-primary btn-sm"
                      style={{ textDecoration: 'none' }}
                    >
                      <span>Explore Category</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 20px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                No formulation categories matched your filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter('all');
                  setSearchQuery('');
                }}
                className="btn btn-primary btn-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .category-catalogue-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .category-catalogue-card:hover .catalogue-img-zoom {
          transform: scale(1.06);
        }
        @media (max-width: 860px) {
          .catalogue-category-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
