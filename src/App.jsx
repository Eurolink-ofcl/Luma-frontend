import React, { useState } from 'react';
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

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-['Manrope'] selection:bg-[#EC2024] selection:text-white antialiased">
      {/* Hero Section with TopBanner and Navbar (Layer 1, 2, 3) */}
      <div id="hero-wrapper" className="relative w-full">
        <TopBanner />
        <Navbar
          onOpenCart={() => setIsCartOpen(true)}
          onOpenMobile={() => setIsMobileOpen(true)}
        />
        <Hero />
      </div>

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

      {/* Before & After Real Sessions (Layer 13) */}
      <BeforeAfter />

      {/* FAQs (Layer 15) */}
      <FaqSection />

      {/* Join the LUMA Community (Layer 16) */}
      <CommunitySection />

      {/* What Experts Say (Layer 17) */}
      <ExpertTestimonials />

      {/* Trust & Guarantee Strip (Layer 18) */}
      <TrustGuarantees />

      {/* Footer & Connect (Layers 19, 24, 25, 26, 27) */}
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
      />
    </div>
  );
}
