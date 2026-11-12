import React, { useState, useEffect } from 'react';
import LumaGoDetailSection from '../components/products/LumaGoDetailSection';
import LumaGoBenefitSection from '../components/products/LumaGoBenefitSection';
import LumaGoSpecsSection from '../components/products/LumaGoSpecsSection';
import LumaSeriesCompareSection from '../components/products/LumaSeriesCompareSection';
import LumaGlowDeviceFinderSection from '../components/products/LumaGlowDeviceFinderSection';
import { GO_FINDER_PRODUCTS } from '../components/products/deviceFinderData';

const API_BASE_URL = 'http://localhost:5000/api';

export default function LumaGoPage({ onOpenCart, onOpenCheckout, onNavigateHome, onNavigateProduct }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/products/luma-go`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && data?.data) {
          setProduct(data.data);
        }
      })
      .catch((err) => {
        console.warn('Notice: Loading offline fallback for LUMA GO:', err.message);
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
      {/* Spacer to cleanly offset fixed navbar (transparent to blend with page) */}
      <div className="w-full h-[96px] sm:h-[100px] lg:h-[calc(260*var(--u))]" />

      {/* 1st Main Section: GO SECTION (PSD canvas y=436..2106) */}
      <LumaGoDetailSection product={product} onOpenCart={onOpenCart} onBuyNow={onOpenCheckout} />

      {/* 2nd Main Section: GO BENEFITS (PSD canvas y=2242..3034) */}
      <LumaGoBenefitSection />

      {/* 3rd Main Section: GO SPEC SECTION / TABLE (PSD canvas y=3195..4620) */}
      <LumaGoSpecsSection />

      {/* 4th Main Section: LUMA SERIES SPECIFICATIONS TABLE (PSD canvas y=4818..6160) */}
      <LumaSeriesCompareSection />

      {/* 5th Main Section: FIND YOUR DEVICE SECTION (PSD canvas y=6458..7992) */}
      <LumaGlowDeviceFinderSection
        products={GO_FINDER_PRODUCTS}
        onNavigateHome={onNavigateHome}
        onNavigateProduct={onNavigateProduct}
        onOpenCart={onOpenCart}
      />
    </div>
  );
}
