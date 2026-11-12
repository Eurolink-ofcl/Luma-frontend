import React, { useState, useEffect } from 'react';
import LumaGlowDetailSection from '../components/products/LumaGlowDetailSection';
import LumaGlowBenefitSection from '../components/products/LumaGlowBenefitSection';
import LumaGlowSpecsSection from '../components/products/LumaGlowSpecsSection';
import LumaGlowDeviceFinderSection from '../components/products/LumaGlowDeviceFinderSection';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function LumaGlowPage({ onOpenCart, onOpenCheckout, onNavigateHome, onNavigateProduct }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/products/luma-glow`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && data?.data) {
          setProduct(data.data);
        }
      })
      .catch((err) => {
        console.warn('Notice: Loading offline fallback for LUMA GLOW:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#FFFFFF] text-[#000000] overflow-x-clip font-['Manrope']"
    >
      {/* Spacer to cleanly offset fixed navbar (transparent / white to remove dark bar) */}
      <div className="w-full h-[96px] sm:h-[100px] lg:h-[calc(260*var(--u))]" />

      {/* 1st Main Section: GLOW SECTION (PSD canvas y=436..2106) */}
      <LumaGlowDetailSection product={product} onOpenCart={onOpenCart} onBuyNow={onOpenCheckout} />

      {/* 2nd Main Section: 3 BENEFIT SECTION (PSD canvas y=2242..3050) */}
      <LumaGlowBenefitSection />

      {/* 3rd Main Section: GLOW SPEC SECTION / TABLE (PSD canvas y=3195..5196) */}
      <LumaGlowSpecsSection />

      {/* 4th Main Section: FIND YOUR DEVICE SECTION (PSD canvas y=5450..6984) */}
      <LumaGlowDeviceFinderSection
        onNavigateHome={onNavigateHome}
        onNavigateProduct={onNavigateProduct}
        onOpenCart={onOpenCart}
      />
    </div>
  );
}
