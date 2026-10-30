import React, { useState, useEffect } from 'react';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import AboutSection from './components/AboutSection';
import ClinicalTech from './components/ClinicalTech';
import BenefitsOverview from './components/BenefitsOverview';
import ProductRange from './components/ProductRange';
import AssessmentQuiz from './components/AssessmentQuiz';
import BeforeAfter from './components/BeforeAfter';
import FaqSection from './components/FaqSection';
import CommunitySection from './components/CommunitySection';
import ExpertTestimonials from './components/ExpertTestimonials';
import TrustGuarantees from './components/TrustGuarantees';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileDrawer from './components/MobileDrawer';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';

function getPageFromPath(pathname) {
  if (!pathname) return 'home';
  const lower = pathname.toLowerCase();
  if (lower.startsWith('/about')) {
    return 'about';
  }
  if (lower.startsWith('/products') || lower.startsWith('/our-products')) {
    return 'products';
  }
  return 'home';
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() =>
    getPageFromPath(window.location.pathname)
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page, hash = '') => {
    const targetPath =
      page === 'about' ? '/about' : page === 'products' ? '/products' : '/';
    if (window.location.pathname !== targetPath || window.location.hash !== hash) {
      window.history.pushState({}, '', `${targetPath}${hash}`);
    }
    setCurrentPage(page);

    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-['Manrope'] selection:bg-[#EC2024] selection:text-white antialiased">
      {/* Shared TopBanner & Navbar */}
      <div id="hero-wrapper" className="relative w-full">
        <TopBanner />
        <Navbar
          onOpenCart={() => setIsCartOpen(true)}
          onOpenMobile={() => setIsMobileOpen(true)}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        {currentPage === 'home' && <Hero />}
      </div>

      {currentPage === 'about' ? (
        <AboutPage onNavigateHome={(hash = '') => handleNavigate('home', hash)} />
      ) : currentPage === 'products' ? (
        <ProductsPage
          onNavigateHome={(hash = '') => handleNavigate('home', hash)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      ) : (
        <>
          {/* Running Trust & Certification Strip (Layer 6) */}
          <TrustStrip />

          {/* About LUMA Section (Layer 7) */}
          <AboutSection />

          {/* Clinical Technology & Wavelength Penetration (Layer 8) */}
          <ClinicalTech />

          {/* Evidence-Based Benefits Overview (Layer 9) */}
          <BenefitsOverview />

          {/* Product Range Showcase (Layer 10) */}
          <ProductRange onAddToCart={() => setIsCartOpen(true)} />

          {/* 1-Minute Assessment Quiz (Layer 12) */}
          <AssessmentQuiz />

          {/* Contiguous White Sections Wrapper (prevents subpixel dark seam on scaled viewports) */}
          <div className="w-full bg-[#FFFFFF]">
            {/* Before & After Real Sessions (Layer 13) */}
            <BeforeAfter />

            {/* FAQs (Layer 15) */}
            <FaqSection />

            {/* Join the LUMA Community (Layer 16) */}
            <CommunitySection />

            {/* What Experts Say (Layer 17) */}
            <ExpertTestimonials />
          </div>

          {/* Trust & Guarantee Strip (Layer 18) */}
          <TrustGuarantees />
        </>
      )}

      {/* Shared Footer & Connect */}
      <Footer onOpenCart={() => setIsCartOpen(true)} />

      {/* Shopping Bag Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
