import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { ProductManagementPage } from './pages/admin/ProductManagementPage';
import { ProductDocManagementPage } from './pages/admin/ProductDocManagementPage';
import { GalleryManagementPage } from './pages/admin/GalleryManagementPage';
import { ResourceManagementPage } from './pages/admin/ResourceManagementPage';
import { ContactManagementPage } from './pages/admin/ContactManagementPage';

gsap.registerPlugin(ScrollTrigger);

// Public Layout containing site Navbar & Footer
const PublicLayout: React.FC = () => (
  <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

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
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Pages Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:categorySlug" element={<CategoryPage />} />
            <Route path="/products/:categorySlug/:productSlug" element={<ProductDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:articleSlug" element={<ArticleDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Login Routes (Supports /admin, /admin-secure-login, etc.) */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-secure-login" element={<AdminLoginPage />} />

          {/* Protected Admin Control Center under /admin-secure-login */}
          <Route
            path="/admin-secure-login"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ProductManagementPage />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="documents" element={<ProductDocManagementPage />} />
            <Route path="product-docs" element={<ProductDocManagementPage />} />
            <Route path="gallery" element={<GalleryManagementPage />} />
            <Route path="resources" element={<ResourceManagementPage />} />
            <Route path="contact" element={<ContactManagementPage />} />
            <Route path="*" element={<Navigate to="/admin-secure-login/dashboard" replace />} />
          </Route>

          {/* Protected Admin Control Center aliases under /admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ProductManagementPage />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="documents" element={<ProductDocManagementPage />} />
            <Route path="product-docs" element={<ProductDocManagementPage />} />
            <Route path="gallery" element={<GalleryManagementPage />} />
            <Route path="resources" element={<ResourceManagementPage />} />
            <Route path="contact" element={<ContactManagementPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Global Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
