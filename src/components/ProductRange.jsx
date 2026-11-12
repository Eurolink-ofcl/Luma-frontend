import React, { useState, useEffect, useMemo } from 'react';

const defaultProducts = [
  {
    id: 'luma-glow',
    slug: 'luma-glow',
    brandPrefix: 'LUMA ',
    modelSuffix: 'GLOW',
    category: 'FACE MASK',
    price: 'AED 1,200',
    description:
      'Precision therapy for targeted results in just 10 minutes daily. Like a powerful multivitamin for your cells-clinical-grade power that fits anywhere, addressing.',
    image: '/assets/products/psd-card-glow.jpg',
    buttonText: 'BUY NOW',
  },
  {
    id: 'luma-go',
    slug: 'luma-go',
    brandPrefix: 'LUMA ',
    modelSuffix: 'GO',
    category: 'RED LIGHT PANEL',
    price: 'AED 1,890',
    description:
      "Ten minutes. That's all it takes. The luma go brings clinical-grade red and near-infrared light therapy into a handheld device compact enough to travel...",
    image: '/assets/products/psd-card-go.jpg',
    buttonText: 'BUY NOW',
  },
  {
    id: 'luma-nova',
    slug: 'luma-nova',
    brandPrefix: 'LUMA ',
    modelSuffix: 'NOVA',
    category: 'RED LIGHT PANEL',
    price: 'AED 2,100',
    description:
      'Precision therapy for targeted results in just 10 minutes daily. Like a powerful multivitamin for your cells-clinical-grade power that fits anywhere addressing.',
    image: '/assets/products/psd-card-nova.jpg',
    buttonText: 'BUY NOW',
  },
  {
    id: 'luma-surge',
    slug: 'luma-surge',
    brandPrefix: 'LUMA ',
    modelSuffix: 'SURGE',
    category: 'RED LIGHT PANEL',
    price: 'AED 2,890',
    description:
      'Built for the areas that need the most attention — back, shoulders, legs. Surge covers a wider treatment zone for pain relief and faster post-workout recovery.',
    image: '/assets/products/psd-card-surge.jpg',
    buttonText: 'BUY NOW',
  },
  {
    id: 'luma-apex',
    slug: 'luma-apex',
    brandPrefix: 'LUMA ',
    modelSuffix: 'APEX',
    category: 'HALF BODY PANEL',
    price: 'AED 3,800',
    description:
      'Targeted high-irradiance half-body photobiomodulation panel engineered for intensive muscular recovery, cellular optimization, and collagen remodeling.',
    image: '/assets/products/psd-card-apex.jpg',
    buttonText: 'BUY NOW',
  },
  {
    id: 'luma-ultra',
    slug: 'luma-ultra',
    brandPrefix: 'LUMA ',
    modelSuffix: 'ULTRA',
    category: 'FULL BODY PANEL',
    price: 'AED 4,890',
    description:
      'Clinical-grade full body multi-wavelength panel providing expansive coverage for systemic vitality, full-body restorative sleep, and athletic resilience.',
    image: '/assets/products/psd-card-ultra.jpg',
    buttonText: 'BUY NOW',
  },
  {
    id: 'luma-max',
    slug: 'luma-max',
    brandPrefix: 'LUMA ',
    modelSuffix: 'MAX',
    category: 'FULL BODY PANEL',
    price: 'AED 5,890',
    description:
      'The pinnacle of whole-body red and near-infrared therapy. Maximum power density, 8 synchronized wavelengths, and complete head-to-toe clinical restoration.',
    image: '/assets/products/psd-card-max.jpg',
    buttonText: 'BUY NOW',
  },
];

export default function ProductRange({ onAddToCart, onNavigate, data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const eyebrow = data?.eyebrow || 'PRODUCT RANGE';
  const headingPrefix = data?.headingPrefix || 'LUMA RED LIGHT ';
  const headingSuffix = data?.headingSuffix || 'PANELS';
  const subtitle = data?.subtitle || 'Featuring exclusive 1060nm - unavailable from any competitor in Global';
  const viewAllBtnText = data?.viewAllBtnText || 'VIEW ALL';
  const viewAllBtnLink = data?.viewAllBtnLink || '/products';

  // Merge custom CMS cards with default catalog products so the carousel always has full catalog products
  const productList = useMemo(() => {
    const customCards = Array.isArray(data?.cards) ? data.cards : [];
    if (customCards.length >= 4) {
      return customCards;
    }
    const customSlugs = new Set(customCards.map((c) => c.slug || c.id));
    const remaining = defaultProducts.filter((p) => !customSlugs.has(p.slug) && !customSlugs.has(p.id));
    return [...customCards, ...remaining];
  }, [data?.cards]);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const visibleCards = isDesktop ? 3 : isTablet ? 2 : 1;
  const maxIndex = Math.max(0, productList.length - visibleCards);

  // Keep activeIndex within bounds if window resized
  useEffect(() => {
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex);
    }
  }, [maxIndex, activeIndex]);

  const nextSlide = () => {
    setActiveIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  // Touch Swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
  };

  const getTrackTransform = () => {
    if (isDesktop) {
      // In PSD: 800px card width + 150px gap = 950px stride
      return {
        transform: `translateX(calc(-${activeIndex} * (calc(800 * var(--u)) + calc(150 * var(--u)))))`,
      };
    }
    if (isTablet) {
      // 50% card width + 12px gap
      return {
        transform: `translateX(calc(-${activeIndex} * (50% + 12px)))`,
      };
    }
    // Mobile: 100% card width + 24px gap
    return {
      transform: `translateX(calc(-${activeIndex} * (100% + 1.5rem)))`,
    };
  };

  return (
    <section
      id="products"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#131313] py-16 lg:pt-[calc(166*var(--u))] lg:pb-[calc(168*var(--u))] overflow-hidden font-['Manrope'] border-t border-[#E5E5E5]"
    >
      <div className="products-container relative w-full max-w-[1400px] lg:max-w-none mx-auto px-6 lg:px-0">
        {/* Centered Section Header (PSD Group 19: y=8831..9071 on 3840w canvas) */}
        <div className="relative text-center mx-auto lg:pl-[calc(523*var(--u))] lg:pr-[calc(517*var(--u))]">
          {/* 'PRODUCT RANGE': Manrope-Medium (500), 40px at 3840w, tracking 20 (0.02em), #131313 */}
          <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] uppercase tracking-[0.02em] font-medium text-[#131313] leading-none">
            {eyebrow}
          </p>

          {/* 'LUMA RED LIGHT PANELS': Manrope-ExtraLight (200), 80px at 3840w, tracking 20 (0.02em), #ED2024 + #131313, gap 47px */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight tracking-[0.02em] uppercase leading-none mt-3 lg:mt-[calc(47*var(--u))]">
            <span className="text-[#ED2024]">{headingPrefix}</span>
            <span className="text-[#131313]">{headingSuffix}</span>
          </h2>

          {/* Subtitle & Right-Aligned VIEW ALL > on the same baseline (y=9037..9071, gap 71px) */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center mt-4 lg:mt-[calc(71*var(--u))]">
            <p className="text-[#555555] text-xs sm:text-sm lg:text-[calc(30*var(--u))] leading-none font-normal tracking-[0.02em]">
              {subtitle}
            </p>

            {/* VIEW ALL BUTTON (PSD x=3168..3323, y=9037..9063: Manrope-Medium 30px, #555555, red chevron 16x26) */}
            <a
              href={viewAllBtnLink}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('products');
                }
              }}
              className="mt-3 sm:mt-0 sm:absolute sm:right-0 text-xs sm:text-sm lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#555555] hover:text-[#ED2024] inline-flex items-center gap-1 lg:gap-[calc(8*var(--u))] leading-none transition-colors group cursor-pointer"
            >
              <span>{viewAllBtnText}</span>
              <svg
                viewBox="0 0 16 26"
                fill="none"
                className="w-2.5 h-3.5 lg:w-[calc(16*var(--u))] lg:h-[calc(26*var(--u))] text-[#ED2024] group-hover:translate-x-0.5 transition-transform"
              >
                <path
                  d="M2 2L13 13L2 24"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Cards Row Wrapper with Left & Right PSD Flanking Arrows */}
        <div className="relative mt-10 lg:mt-[calc(159*var(--u))] w-full">
          {/* Left Carousel Arrow (PSD 'Vector Smart Object copy': bbox=(330, 9630, 407, 9759), w=77, h=129) */}
          <button
            type="button"
            onClick={prevSlide}
            disabled={activeIndex === 0}
            aria-label="Previous product"
            className={`flex items-center justify-center absolute left-1 sm:left-2 lg:left-[calc(330*var(--u))] top-[40%] lg:top-[calc(400*var(--u))] -translate-y-1/2 w-8 h-12 lg:w-[calc(77*var(--u))] lg:h-[calc(129*var(--u))] text-[#000000] transition-all z-30 ${
              activeIndex === 0
                ? 'opacity-20 cursor-not-allowed pointer-events-none'
                : 'opacity-100 hover:text-[#ED2024] cursor-pointer'
            }`}
          >
            <svg viewBox="0 0 77 129" fill="none" className="w-full h-full">
              <path
                d="M68 6L9 64.5L68 123"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Right Carousel Arrow (PSD 'Vector Smart Object copy 2': bbox=(3339, 9630, 3416, 9759), w=77, h=129) */}
          <button
            type="button"
            onClick={nextSlide}
            disabled={activeIndex >= maxIndex}
            aria-label="Next product"
            className={`flex items-center justify-center absolute right-1 sm:right-2 lg:right-auto lg:left-[calc(3339*var(--u))] top-[40%] lg:top-[calc(400*var(--u))] -translate-y-1/2 w-8 h-12 lg:w-[calc(77*var(--u))] lg:h-[calc(129*var(--u))] text-[#000000] transition-all z-30 ${
              activeIndex >= maxIndex
                ? 'opacity-20 cursor-not-allowed pointer-events-none'
                : 'opacity-100 hover:text-[#ED2024] cursor-pointer'
            }`}
          >
            <svg viewBox="0 0 77 129" fill="none" className="w-full h-full">
              <path
                d="M9 6L68 64.5L9 123"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Carousel Viewport Window */}
          <div className="w-full overflow-hidden lg:pl-[calc(523*var(--u))]">
            <div className="w-full lg:w-[calc(2700*var(--u))] overflow-hidden">
              {/* Sliding Flex Track */}
              <div
                className="flex items-start gap-6 lg:gap-[calc(150*var(--u))] transition-transform duration-500 ease-out will-change-transform"
                style={getTrackTransform()}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {productList.map((product) => {
                  const brand = product.brandPrefix !== undefined ? product.brandPrefix : 'LUMA ';
                  const model = product.modelSuffix !== undefined ? product.modelSuffix : (product.name || '');
                  const category = product.category || product.subtitle || 'RED LIGHT PANEL';
                  const btnText = product.buttonText || 'BUY NOW';

                  return (
                    <div
                      key={product.id || product.slug}
                      className="group flex flex-col justify-between w-full sm:w-[calc(50%-12px)] lg:w-[calc(800*var(--u))] shrink-0 transition-all duration-300 select-none"
                    >
                      <div>
                        {/* Product Showcase Frame matching PSD Rectangle 52 (800x800 square, #F3F3F3, sharp corners) */}
                        <div className="relative w-full aspect-square lg:w-[calc(800*var(--u))] lg:h-[calc(800*var(--u))] bg-[#F3F3F3] rounded-none flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image}
                            alt={`${brand}${model}`}
                            className={`w-full h-full ${product.image?.includes('psd-card') ? 'object-cover' : 'object-contain p-6 lg:p-[calc(60*var(--u))]'} group-hover:scale-105 transition-transform duration-500 block`}
                          />
                        </div>

                        {/* Typography matching PSD Group 19 */}
                        <div className="mt-5 lg:mt-[calc(40*var(--u))]">
                          {/* Product Title: Manrope-ExtraBold (800), 50px at 3840w, tracking 20 (0.02em), #0A0A0B + #ED2024 */}
                          <h3 className="text-xl sm:text-2xl lg:text-[calc(50*var(--u))] font-extrabold tracking-[0.02em] uppercase leading-none">
                            <span className="text-[#0A0A0B]">{brand}</span>
                            <span className="text-[#ED2024]">{model}</span>
                          </h3>

                          {/* Category: Manrope-Medium (500) Italic, 30px at 3840w, tracking 20 (0.02em), #0A0A0B, gap 29px */}
                          <p className="text-xs sm:text-sm lg:text-[calc(30*var(--u))] italic uppercase tracking-[0.02em] text-[#0A0A0B] font-medium leading-none mt-2 lg:mt-[calc(29*var(--u))]">
                            {category}
                          </p>

                          {/* Description: Manrope-Regular (400), 30px at 3840w, leading 48px (1.6), tracking 20 (0.02em), #000000, gap 44px */}
                          <p className="text-[#000000] text-xs sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal leading-[1.6] tracking-[0.02em] mt-3 lg:mt-[calc(44*var(--u))] line-clamp-3">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Button: PSD CTA1: w=280, h=86, #0A0A0B background, Manrope-SemiBold 32px, tracking 50 / 0.05em, #FFFFFF, BUY NOW */}
                      <div className="mt-5 lg:mt-[calc(42*var(--u))]">
                        <button
                          type="button"
                          onClick={() => {
                            const targetSlug = product.slug || product.id;
                            if (onNavigate) {
                              onNavigate(targetSlug);
                            } else if (onAddToCart) {
                              onAddToCart(product);
                            }
                          }}
                          className="w-full sm:w-auto px-7 py-3 lg:px-0 lg:py-0 lg:w-[calc(280*var(--u))] lg:h-[calc(86*var(--u))] inline-flex items-center justify-center rounded-[5px] lg:rounded-[calc(10*var(--u))] bg-[#0A0A0B] hover:bg-[#ED2024] text-[#FFFFFF] font-semibold text-xs sm:text-sm lg:text-[calc(32*var(--u))] uppercase tracking-[0.05em] leading-none transition-colors duration-300 cursor-pointer"
                        >
                          {btnText}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 lg:gap-[calc(10*var(--u))] mt-10 lg:mt-[calc(92*var(--u))] select-none">
          {Array.from({ length: maxIndex + 1 }).map((_, dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => setActiveIndex(dot)}
              aria-label={`Product slide ${dot + 1}`}
              className={`h-2.5 lg:h-[calc(20*var(--u))] rounded-full transition-all cursor-pointer ${
                activeIndex === dot
                  ? 'bg-[#ED2024] w-6 lg:w-[calc(48*var(--u))]'
                  : 'bg-[#CCCCCC] hover:bg-[#999999] w-2.5 lg:w-[calc(20*var(--u))]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
