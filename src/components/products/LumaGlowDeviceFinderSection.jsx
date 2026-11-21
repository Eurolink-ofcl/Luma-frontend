import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ALL_CATALOG_FINDER_PRODUCTS, getFinderProductsFor } from './deviceFinderData';
import { useCurrency } from '../../context/CurrencyContext';

export default function LumaGlowDeviceFinderSection({
  products: initialProducts,
  currentProductId = '',
  onNavigateHome,
  onNavigateProduct,
  onOpenCart,
}) {
  const { formatPrice } = useCurrency();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [arrowTop, setArrowTop] = useState(null);
  const firstCardFrameRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lastWheelTime = useRef(0);

  // Derive products list: all products except the current one being viewed
  const displayProducts = useMemo(() => {
    if (currentProductId) {
      return getFinderProductsFor(currentProductId);
    }
    if (initialProducts && initialProducts.length > 4) {
      return initialProducts;
    }
    if (initialProducts && initialProducts.length > 0) {
      const existingIds = new Set(initialProducts.map((p) => p.id));
      const additional = ALL_CATALOG_FINDER_PRODUCTS.filter(
        (p) => !existingIds.has(p.id) && p.id !== currentProductId
      );
      return [...initialProducts, ...additional];
    }
    return ALL_CATALOG_FINDER_PRODUCTS;
  }, [initialProducts, currentProductId]);

  // Responsive visible count tracking (exact integer of cards so no partial cards ever appear)
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 960) {
        setVisibleCount(2);
      } else if (width < 1280) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, displayProducts.length - visibleCount);
  const safeIndex = Math.min(currentIndex, maxIndex);

  // Reset index if product list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentProductId]);

  // Dynamically measure the Card Image Frame height so arrows are ALWAYS 100% vertically centered on the image frame
  useEffect(() => {
    const updateArrowPos = () => {
      if (firstCardFrameRef.current) {
        const height = firstCardFrameRef.current.offsetHeight;
        if (height > 0) {
          setArrowTop(height / 2);
        }
      }
    };

    updateArrowPos();
    window.addEventListener('resize', updateArrowPos);
    return () => window.removeEventListener('resize', updateArrowPos);
  }, [displayProducts, visibleCount]);

  const handleNext = () => {
    if (safeIndex < maxIndex) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Touch Swipe Handlers for mobile & tablet
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Only swipe if horizontal movement is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Optional trackpad/mouse horizontal wheel listener
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > 25 || (e.shiftKey && Math.abs(e.deltaY) > 25)) {
      const now = Date.now();
      if (now - lastWheelTime.current > 350) {
        lastWheelTime.current = now;
        if (e.deltaX > 25 || e.deltaY > 25) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  const isAtStart = safeIndex === 0;
  const isAtEnd = safeIndex === maxIndex;

  return (
    <section
      id="find-your-device"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pt-16 sm:pt-20 md:pt-24 lg:pt-[calc(180*var(--u))] pb-20 sm:pb-24 md:pb-28 lg:pb-[calc(220*var(--u))] overflow-hidden font-['Manrope'] select-none"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-10 2xl:px-[calc(377*var(--u))]">
        
        {/* ==================== SECTION HEADER ==================== */}
        <div className="text-center flex flex-col items-center">
          <p className="text-[13px] sm:text-[15px] md:text-[17px] lg:text-[20px] 2xl:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#000000] leading-none">
            READY WHEN YOU ARE
          </p>

          <h2 className="mt-2.5 sm:mt-3 lg:mt-4 2xl:mt-[calc(37*var(--u))] text-[28px] sm:text-[38px] md:text-[46px] lg:text-[54px] 2xl:text-[calc(100*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            FIND YOUR DEVICE
          </h2>

          <p className="mt-2.5 sm:mt-3 lg:mt-4 2xl:mt-[calc(37*var(--u))] text-[11.5px] sm:text-[13px] md:text-[15px] lg:text-[17px] 2xl:text-[calc(40*var(--u))] font-normal uppercase tracking-[0.02em] text-[#000000] leading-snug">
            FREE SHIPPING ACROSS THE UAE &middot; 60-NIGHT TRIAL &middot; 3-YEAR WARRANTY
          </p>

          <button
            type="button"
            onClick={() => {
              if (onNavigateHome) {
                onNavigateHome('#products');
              } else {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="mt-5 sm:mt-6 lg:mt-7 2xl:mt-[calc(39*var(--u))] w-[130px] h-[40px] sm:w-[150px] sm:h-[44px] lg:w-[170px] lg:h-[48px] 2xl:w-[calc(290*var(--u))] 2xl:h-[calc(86*var(--u))] rounded-[6px] lg:rounded-[8px] 2xl:rounded-[calc(10*var(--u))] bg-[#ED2024] hover:bg-[#d4191d] text-[#FFFFFF] text-[12px] sm:text-[13px] lg:text-[14px] 2xl:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-colors cursor-pointer shadow-md hover:shadow-lg"
          >
            SHOP NOW
          </button>
        </div>

        {/* ==================== CLEAN CAROUSEL: [ < ARROW ] [ 4-CARD VIEWPORT ] [ > ARROW ] ==================== */}
        <div className="relative mt-8 sm:mt-12 lg:mt-16 2xl:mt-[calc(100*var(--u))] w-full">
          
          {/* Previous Arrow Button (Left, vertically centered on Card Image Frame) */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={isAtStart}
            aria-label="Previous products"
            style={{
              top: arrowTop ? `${arrowTop}px` : undefined,
            }}
            className={`absolute left-0 -translate-y-1/2 w-[28px] sm:w-[36px] md:w-[44px] 2xl:w-[calc(50*var(--u))] h-[50px] sm:h-[64px] md:h-[76px] 2xl:h-[calc(92*var(--u))] flex items-center justify-center transition-all duration-200 z-20 ${
              arrowTop === null ? 'top-[35%] 2xl:top-[calc(371*var(--u))]' : ''
            } ${
              isAtStart
                ? 'opacity-20 cursor-not-allowed pointer-events-none'
                : 'opacity-85 hover:opacity-100 hover:scale-110 drop-shadow cursor-pointer'
            }`}
          >
            <img
              src="/assets/about/shop-arrow-left.png"
              alt="Previous"
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </button>

          {/* Masked Viewport Window: padding gives room for arrows so cards never overlap them */}
          <div
            className="w-full overflow-hidden px-8 sm:px-11 md:px-12 lg:px-14 2xl:px-[calc(142*var(--u))]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {/* Sliding Track with smooth CSS transform */}
            <div
              className="flex flex-row transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${safeIndex * (100 / visibleCount)}%)`,
              }}
            >
              {displayProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    width: `${100 / visibleCount}%`,
                  }}
                  className="shrink-0 px-1.5 sm:px-2.5 md:px-3 lg:px-3.5 2xl:px-[calc(26*var(--u))] flex flex-col items-center text-center"
                >
                  {/* Card Image Frame (Rectangle 23: 579x741 at 3840w, radius 53px, fill #F3F3F3) */}
                  <div
                    ref={index === 0 ? firstCardFrameRef : null}
                    onClick={() => {
                      if (onNavigateProduct) onNavigateProduct(product.id || product.slug);
                    }}
                    className={`relative w-full aspect-[579/741] rounded-[18px] sm:rounded-[24px] lg:rounded-[30px] 2xl:rounded-[calc(53*var(--u))] bg-[#F3F3F3] flex items-center justify-center overflow-hidden p-5 sm:p-6 lg:p-7 2xl:p-[calc(36*var(--u))] group shadow-xs ${
                      onNavigateProduct ? 'cursor-pointer' : ''
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.eyebrow}
                      className={`w-auto object-contain select-none transition-transform duration-300 group-hover:scale-[1.04] ${
                        product.id === 'luma-glow'
                          ? 'max-w-[84%] max-h-[62%]'
                          : product.id === 'luma-nova'
                          ? 'max-h-[66%] max-w-[68%]'
                          : product.id === 'luma-go'
                          ? 'max-h-[72%] max-w-[70%]'
                          : product.id === 'luma-surge'
                          ? 'max-h-[80%] max-w-[72%]'
                          : 'max-h-[85%] max-w-[75%]'
                      }`}
                      draggable={false}
                    />
                  </div>

                  {/* Eyebrow */}
                  <p className="mt-3.5 sm:mt-4 2xl:mt-[calc(39*var(--u))] text-[11px] sm:text-[12px] md:text-[13px] 2xl:text-[calc(30*var(--u))] font-normal uppercase tracking-[0.05em] text-[#000000] leading-none">
                    {product.eyebrow}
                  </p>

                  {/* Title (2 clean lines) */}
                  <h3
                    onClick={() => {
                      if (onNavigateProduct) onNavigateProduct(product.id || product.slug);
                    }}
                    className={`mt-2 sm:mt-2.5 2xl:mt-[calc(38*var(--u))] text-[13px] sm:text-[14px] md:text-[15px] xl:text-[16px] 2xl:text-[calc(40*var(--u))] font-medium uppercase tracking-[0.05em] text-[#000000] leading-[1.25] 2xl:leading-[calc(50*var(--u))] ${
                      onNavigateProduct ? 'cursor-pointer hover:text-[#ED2024] transition-colors' : ''
                    }`}
                  >
                    <span className="block whitespace-nowrap">{product.titleLine1}</span>
                    <span className="block whitespace-nowrap">{product.titleLine2}</span>
                  </h3>

                  {/* Price */}
                  <p className="mt-2 sm:mt-2.5 2xl:mt-[calc(40*var(--u))] text-[12px] sm:text-[13px] md:text-[14px] 2xl:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.05em] text-[#ED2024] leading-none">
                    {formatPrice(product.price || product.priceText)}
                  </p>

                  {/* Add To Bag Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCart) {
                        onOpenCart();
                      } else if (onNavigateProduct) {
                        onNavigateProduct(product.id || product.slug);
                      }
                    }}
                    className="mt-3 sm:mt-3.5 2xl:mt-[calc(36*var(--u))] w-[110px] sm:w-[120px] md:w-[130px] h-[34px] sm:h-[36px] md:h-[38px] 2xl:w-[calc(261*var(--u))] 2xl:h-[calc(66*var(--u))] rounded-[6px] 2xl:rounded-[calc(10*var(--u))] bg-[#010101] hover:bg-[#222222] text-[#FFFFFF] text-[10px] sm:text-[11px] md:text-[12px] 2xl:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ADD TO BAG
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow Button (Right, vertically centered on Card Image Frame) */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isAtEnd}
            aria-label="Next products"
            style={{
              top: arrowTop ? `${arrowTop}px` : undefined,
            }}
            className={`absolute right-0 -translate-y-1/2 w-[28px] sm:w-[36px] md:w-[44px] 2xl:w-[calc(50*var(--u))] h-[50px] sm:h-[64px] md:h-[76px] 2xl:h-[calc(92*var(--u))] flex items-center justify-center transition-all duration-200 z-20 ${
              arrowTop === null ? 'top-[35%] 2xl:top-[calc(371*var(--u))]' : ''
            } ${
              isAtEnd
                ? 'opacity-20 cursor-not-allowed pointer-events-none'
                : 'opacity-85 hover:opacity-100 hover:scale-110 drop-shadow cursor-pointer'
            }`}
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
