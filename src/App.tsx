import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ContactPage } from './pages/ContactPage';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  useEffect(() => {
    // 1. Initialize Lenis Smooth Inertia Scrolling
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    (window as any).lenis = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      (window as any).lenis = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:categorySlug" element={<CategoryPage />} />
            <Route path="/products/:categorySlug/:productSlug" element={<ProductDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:articleSlug" element={<ArticleDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
