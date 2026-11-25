const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api');

import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';

const defaultAboutProducts = [
  {
    id: 'luma-glow-mask',
    eyebrow: 'LUMA GLOW FACE MASK',
    titleLine1: 'LUMA FACE LED',
    titleLine2: 'LIGHT THERAPY MASK',
    priceText: '1,299 AED',
    price: 1299,
    image: '/assets/about/product-glow-mask.png',
  },
  {
    id: 'luma-nova',
    eyebrow: 'LUMA NOVA',
    titleLine1: 'LED TARGETED',
    titleLine2: 'RED LIGHT THERAPY PANEL',
    priceText: '2,599 AED',
    price: 2599,
    image: '/assets/about/product-luma-nova.png',
  },
  {
    id: 'luma-apex',
    eyebrow: 'LUMA APEX',
    titleLine1: 'HALF-BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    priceText: '6,599 AED',
    price: 6599,
    image: '/assets/about/product-luma-apex.png',
  },
  {
    id: 'luma-max',
    eyebrow: 'LUMA MAX',
    titleLine1: 'FULL-BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    priceText: '8,599 AED',
    price: 8599,
    image: '/assets/about/product-luma-max.png',
  },
  {
    id: 'luma-go',
    eyebrow: 'LUMA GO',
    titleLine1: 'COMPACT PORTABLE',
    titleLine2: 'RED LIGHT DEVICE',
    priceText: '1,890 AED',
    price: 1890,
    image: '/assets/products/luma-go.png',
  },
  {
    id: 'luma-surge',
    eyebrow: 'LUMA SURGE',
    titleLine1: 'DUAL-CHIP POWERED',
    titleLine2: 'RED LIGHT PANEL',
    priceText: '2,890 AED',
    price: 2890,
    image: '/assets/products/luma-surge.png',
  },
  {
    id: 'luma-ultra',
    eyebrow: 'LUMA ULTRA',
    titleLine1: 'WIDE CLINICAL',
    titleLine2: 'LIGHT THERAPY PANEL',
    priceText: '4,890 AED',
    price: 4890,
    image: '/assets/products/list-product-6.jpg',
  },
];

export default function AboutShopSection({ onNavigateHome, data }) {
  const { formatPrice } = useCurrency();
  const [productsList, setProductsList] = useState(defaultAboutProducts);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Attempt to sync full live catalog from API if available
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        const items = data?.data || (Array.isArray(data) ? data : null);
        if (items && items.length > 0) {
          const mapped = items.map((p, idx) => {
            const words = (p.name || '').split(' ');
            return {
              id: p._id || p.id || `api-prod-${idx}`,
              eyebrow: p.name || 'LUMA DEVICE',
              titleLine1: words.slice(0, Math.ceil(words.length / 2)).join(' ') || p.name,
              titleLine2: words.slice(Math.ceil(words.length / 2)).join(' ') || 'RED LIGHT PANEL',
              price: p.price || 1299,
              priceText: `${p.price || 1299} AED`,
              image: p.image || '/assets/about/product-glow-mask.png',
            };
          });
          // Merge API items with default about products for richest display
          setProductsList((prev) => {
            const existingNames = new Set(prev.map((x) => x.eyebrow?.toUpperCase()));
            const newFromApi = mapped.filter((m) => !existingNames.has(m.eyebrow?.toUpperCase()));
            return [...prev, ...newFromApi];
          });
        }
      })
      .catch((err) => {
        console.warn('Using default product showcase list:', err);
      });
  }, []);

  // Detect screen size for responsive card count: 1 card on mobile (< 1024px), 4 cards on desktop (>= 1024px)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleCount = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, productsList.length - visibleCount);

  // Keep currentIndex bounded if switching viewport
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Touch swipe support for smooth mobile interaction
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const visibleProducts = productsList.slice(currentIndex, currentIndex + visibleCount);
  const eyebrow = data?.eyebrow || 'READY WHEN YOU ARE';
  const headingText = data?.headingLine1 && data?.headingLine2
    ? `${data.headingLine1} ${data.headingLine2}`
    : 'FIND YOUR DEVICE';
  const subtext = data?.subtext || 'FREE SHIPPING ACROSS THE UAE · 60-NIGHT TRIAL · 3-YEAR WARRANTY';
  return (
    <section
      id="about-shop"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] py-14 sm:py-16 lg:pt-[calc(177*var(--u))] lg:pb-[calc(176*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* Doctor Advisory Banner (PSD Group 48: x = 520..3323 (2803w), y = 9021..9314 (293h), r = 35px, fill #000000) */}
        <div className="lg:pl-[calc(520*var(--u))] lg:pr-[calc(517*var(--u))]">
          <div className="w-full lg:w-[calc(2803*var(--u))] lg:min-h-[calc(293*var(--u))] rounded-[18px] sm:rounded-[24px] lg:rounded-[calc(35*var(--u))] bg-[#000000] text-[#FFFFFF] p-6 sm:p-8 lg:pl-[calc(141*var(--u))] lg:pr-[calc(143*var(--u))] lg:py-[calc(68*var(--u))] flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 lg:gap-[calc(68*var(--u))]">
            {/* Warning Icon (PSD 'warning': 158 x 158 at 3840w) */}
            <img
              src="/assets/about/warning-icon.png"
              alt="Safety Notice"
              className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] lg:w-[calc(158*var(--u))] lg:h-[calc(158*var(--u))] object-contain shrink-0 select-none"
            />

            <div className="flex-1 flex flex-col items-start">
              {/* Heading: "WHO SHOULD CHECK WITH A DOCTOR FIRST" — 40px at 3840w, Manrope-Bold (700), tracking 20 (0.02em), uppercase, #FFFFFF */}
              <h3 className="text-[15px] sm:text-[18px] lg:text-[calc(40*var(--u))] font-bold uppercase tracking-[0.02em] text-[#FFFFFF] leading-snug lg:leading-none">
                WHO SHOULD CHECK WITH A DOCTOR FIRST
              </h3>

              {/* Body: 30px at 3840w, Manrope-Regular (400), leading 40px (1.333), tracking 20 (0.02em), #FFFFFF */}
              <p className="mt-2.5 sm:mt-3 lg:mt-[calc(38*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#FFFFFF] leading-[1.45] lg:leading-[calc(40*var(--u))]">
                Red light therapy is well tolerated by most people. If you&apos;re pregnant, have a photosensitivity condition, are on medication that increases light sensitivity, or have a history of skin cancer, speak with a doctor before starting a routine &mdash; always use the eye protection included with your device.
              </p>
            </div>
          </div>
        </div>

        {/* Centered Header */}
        <div className="mt-12 sm:mt-16 lg:mt-[calc(176*var(--u))] text-center flex flex-col items-center">
          <p className="text-[15px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#000000] leading-none">
            {eyebrow}
          </p>

          <h2 className="mt-2 sm:mt-3 lg:mt-[calc(37*var(--u))] text-[28px] sm:text-[38px] md:text-[46px] lg:text-[calc(100*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            {headingText}
          </h2>

          <p className="mt-3 sm:mt-4 lg:mt-[calc(37*var(--u))] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[calc(40*var(--u))] font-normal uppercase tracking-[0.02em] text-[#000000] leading-snug lg:leading-none">
            {subtext}
          </p>

          {/* CTA Button: "SHOP NOW" (PSD 'Shop Now': 290 x 86 at 3840w, r = 10px, fill #ED2024, 38px below subtitle) */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateHome) onNavigateHome('#products');
            }}
            className="mt-5 sm:mt-6 lg:mt-[calc(38*var(--u))] w-[140px] h-[42px] sm:w-[160px] sm:h-[46px] lg:w-[calc(290*var(--u))] lg:h-[calc(86*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#ED2024] hover:bg-[#d4191d] text-[#FFFFFF] text-[12px] sm:text-[14px] lg:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-colors cursor-pointer"
          >
            SHOP NOW
          </button>
        </div>

        {/* Mobile Navigation Controls (Placed at top right before the card, exactly as marked by user in Image 2) */}
        <div className="flex lg:hidden items-center justify-between px-2 sm:px-4 mt-6 mb-3 max-w-[340px] sm:max-w-[420px] mx-auto w-full">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span className="text-[#ED2024] font-bold">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span>/</span>
            <span>{String(productsList.length).padStart(2, '0')}</span>
            <span className="text-gray-400 font-normal ml-0.5">Devices</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous product"
              className={`w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                currentIndex === 0
                  ? 'opacity-25 cursor-not-allowed text-gray-300'
                  : 'text-gray-800 hover:border-[#ED2024] hover:text-[#ED2024] active:scale-95'
              }`}
              title="Previous product"
            >
              <img
                src="/assets/about/shop-arrow-left.png"
                alt="Previous"
                className="w-3.5 h-auto object-contain select-none"
              />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              aria-label="Next product"
              className={`w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                currentIndex >= maxIndex
                  ? 'opacity-25 cursor-not-allowed text-gray-300'
                  : 'text-gray-800 hover:border-[#ED2024] hover:text-[#ED2024] active:scale-95'
              }`}
              title="Next product"
            >
              <img
                src="/assets/about/shop-arrow-right.png"
                alt="Next"
                className="w-3.5 h-auto object-contain select-none"
              />
            </button>
          </div>
        </div>

        {/* Product Cards Row on Desktop / 1 by 1 on Mobile + Desktop Side Arrows */}
        <div className="relative mt-2 sm:mt-4 lg:mt-[calc(101*var(--u))]">
          {/* Left Arrow Button (Desktop Only) */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous products"
            className={`hidden lg:flex absolute left-[calc(379*var(--u))] top-[calc(325*var(--u))] -translate-y-1/2 w-[calc(50*var(--u))] h-[calc(92*var(--u))] items-center justify-center transition-all z-10 select-none ${
              currentIndex === 0
                ? 'opacity-20 cursor-not-allowed pointer-events-none'
                : 'opacity-70 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer'
            }`}
            title="Previous product"
          >
            <img
              src="/assets/about/shop-arrow-left.png"
              alt="Previous"
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </button>

          {/* Product Cards Grid: 1 on mobile, 4 on desktop */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none mx-auto lg:pl-[calc(521*var(--u))] lg:pr-[calc(518*var(--u))] grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-[calc(161.67*var(--u))] transition-all duration-300"
          >
            {visibleProducts.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className="w-full lg:w-[calc(579*var(--u))] flex flex-col items-center text-center transition-all duration-300"
              >
                {/* Gray Rounded Product Image Box */}
                <div className="relative w-full aspect-[579/741] lg:w-[calc(579*var(--u))] lg:h-[calc(741*var(--u))] rounded-[24px] sm:rounded-[32px] lg:rounded-[calc(53*var(--u))] bg-[#F3F3F3] flex items-center justify-center overflow-hidden p-6 sm:p-8 lg:p-10 shadow-xs">
                  <img
                    src={product.image}
                    alt={product.eyebrow}
                    className="max-h-[82%] max-w-[85%] w-auto h-auto object-contain select-none transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Product Eyebrow */}
                <p className="mt-4 sm:mt-5 lg:mt-[calc(39*var(--u))] text-[12px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-normal uppercase tracking-[0.055em] text-[#000000] leading-none">
                  {product.eyebrow}
                </p>

                {/* Product Title */}
                <h3 className="mt-2 sm:mt-2.5 lg:mt-[calc(38*var(--u))] text-[15px] sm:text-[17px] lg:text-[calc(40*var(--u))] font-medium uppercase tracking-[0.055em] text-[#000000] leading-[1.25] lg:leading-[calc(50*var(--u))] min-h-[38px] lg:min-h-0">
                  <span className="block">{product.titleLine1}</span>
                  <span className="block">{product.titleLine2}</span>
                </h3>

                {/* Product Price */}
                <p className="mt-2.5 sm:mt-3 lg:mt-[calc(40*var(--u))] text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.05em] text-[#ED2024] leading-none">
                  {formatPrice(product.price || product.priceText)}
                </p>

                {/* Add To Bag Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome('#products');
                  }}
                  className="mt-3 sm:mt-4 lg:mt-[calc(36*var(--u))] w-[130px] h-[36px] sm:w-[140px] sm:h-[38px] lg:w-[calc(261*var(--u))] lg:h-[calc(66*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#010101] hover:bg-[#222222] text-[#FFFFFF] text-[11px] sm:text-[12px] lg:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-colors cursor-pointer"
                >
                  ADD TO BAG
                </button>
              </div>
            ))}
          </div>

          {/* Right Arrow Button (Desktop Only) */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next products"
            className={`hidden lg:flex absolute left-[calc(3415*var(--u))] top-[calc(325*var(--u))] -translate-y-1/2 w-[calc(50*var(--u))] h-[calc(92*var(--u))] items-center justify-center transition-all z-10 select-none ${
              currentIndex >= maxIndex
                ? 'opacity-20 cursor-not-allowed pointer-events-none'
                : 'opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer'
            }`}
            title="Next product"
          >
            <img
              src="/assets/about/shop-arrow-right.png"
              alt="Next"
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
