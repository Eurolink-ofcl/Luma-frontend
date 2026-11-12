import React, { useState, useEffect } from 'react';
import ProductDetailHeroSection from '../components/products/ProductDetailHeroSection';
import ProductDetailBenefitSection from '../components/products/ProductDetailBenefitSection';
import ProductDetailSpecsSection from '../components/products/ProductDetailSpecsSection';
import LumaSeriesCompareSection from '../components/products/LumaSeriesCompareSection';
import LumaGlowDeviceFinderSection from '../components/products/LumaGlowDeviceFinderSection';
import { NOVA_FINDER_PRODUCTS } from '../components/products/deviceFinderData';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ProductDetailPage({
  slug = 'luma-nova',
  onOpenCart,
  onOpenCheckout,
  onNavigateHome,
  onNavigateProduct,
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Scroll to top when slug changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch(`${API_BASE_URL}/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Product '${slug}' not found`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data && data.success && data.data) {
          setProduct(data.data);
        } else {
          throw new Error(data?.message || 'Failed to load product');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Notice: Loading fallback product data:', err.message);
        setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Fallback product if offline or loading fails
  const displayProduct =
    product || {
      slug: slug || 'luma-nova',
      name: slug.toUpperCase().replace(/-/g, ' '),
      eyebrow: slug.toUpperCase().replace(/-/g, ' '),
      titleLine1: 'RED LIGHT THERAPY',
      titleLine2: 'CLINICAL PANEL',
      subtitle: 'A clinical-grade red and near-infrared light therapy panel engineered for everyday wellness and deep recovery.',
      price: 2100,
      originalPrice: 3100,
      currency: 'AED',
      image: '/assets/nova/nova-hero-main.webp',
      images: [
        '/assets/nova/nova-hero-main.webp',
        '/assets/about/product-luma-nova.png',
        '/assets/nova/benefit-2.webp',
        '/assets/nova/benefit-3.webp',
      ],
    };

  return (
    <div
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#FFFFFF] text-[#000000] overflow-x-clip font-['Manrope']"
    >
      {/* Spacer to cleanly offset fixed navbar (transparent to blend with page) */}
      <div className="w-full h-[96px] sm:h-[100px] lg:h-[calc(260*var(--u))]" />

      {/* 1st Main Section: HERO SECTION (PSD canvas y=436..2106) */}
      <ProductDetailHeroSection
        product={displayProduct}
        onOpenCart={onOpenCart}
        onBuyNow={onOpenCheckout}
      />

      {/* 2nd Main Section: 3 BENEFIT CARDS (PSD canvas y=2242..3078) */}
      <ProductDetailBenefitSection product={displayProduct} />

      {/* 3rd Main Section: SPECIFICATIONS TABLE (PSD canvas y=3195..5196) */}
      <ProductDetailSpecsSection product={displayProduct} />

      {/* 4th Main Section: LUMA SERIES SPECIFICATIONS TABLE (PSD canvas y=5372..6715) */}
      <LumaSeriesCompareSection currentProductId={displayProduct.slug || slug} />

      {/* 5th Main Section: FIND YOUR DEVICE SECTION (PSD canvas y=6883..8417) */}
      <LumaGlowDeviceFinderSection
        currentProductId={displayProduct.slug || slug}
        onNavigateHome={onNavigateHome}
        onNavigateProduct={onNavigateProduct}
        onOpenCart={onOpenCart}
      />
    </div>
  );
}

