import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    image: '/assets/glow/glow-hero-main.webp',
    fallback: '/assets/glow/glow-hero-main.jpg',
    alt: 'Serene LUMA Mask Wellness Portrait',
  },
  {
    id: 2,
    image: '/assets/reviews/cards/card-2-luma-mask.webp',
    fallback: '/assets/reviews/cards/card-2-luma-mask.png',
    alt: 'LUMA GLOW Mask Close-up Session',
  },
  {
    id: 3,
    image: '/assets/reviews/cards/card-5-mask-session.webp',
    fallback: '/assets/reviews/cards/card-5-mask-session.png',
    alt: 'LUMA GLOW Mask Evening Relaxation',
  },
  {
    id: 4,
    image: '/assets/about/product-glow-mask.png',
    fallback: '/assets/about/product-glow-mask.png',
    alt: 'LUMA GLOW Ergonomic Flexible Mask',
  },
];

const COLOR_OPTIONS = [
  {
    id: 'silver',
    name: 'Silver Mist',
    fillColor: '#EDEDED',
    ringColor: '#EDEDED',
    slideIndex: 3,
  },
  {
    id: 'black',
    name: 'Obsidian Black',
    fillColor: '#242323',
    ringColor: '#ED2024',
    slideIndex: 0,
  },
];

export default function LumaGlowDetailSection({ product, onOpenCart, onBuyNow }) {
  const { formatPrice } = useCurrency();
  const { addToCart, buyNow } = useCart();
  const { customerUser, openAuthModal } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedColor, setSelectedColor] = useState('black');
  const [openAccordions, setOpenAccordions] = useState({
    spec: true,
    benefits: false,
    wavelengths: false,
    howToUse: false,
    inTheBox: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.id);
    if (color.slideIndex !== undefined) {
      setActiveSlide(color.slideIndex);
    }
  };

  const currentSlide = CAROUSEL_SLIDES[activeSlide] || CAROUSEL_SLIDES[0];

  // Eyebrow & Titles
  const eyebrow = product?.eyebrow || 'LUMA GLOW';
  let titleL1 = product?.titleLine1;
  let titleL2 = product?.titleLine2;
  if (!titleL1 && !titleL2) {
    if (product?.name) {
      if (product.name.includes('\n')) {
        const parts = product.name.split('\n');
        titleL1 = parts[0];
        titleL2 = parts.slice(1).join(' ');
      } else {
        titleL1 = product.name;
        titleL2 = '';
      }
    } else {
      titleL1 = 'LUMA GLOW';
      titleL2 = 'RED LIGHT THERAPY MASK';
    }
  }

  const subtitle =
    product?.subtitle ||
    product?.description ||
    'Wear it, relax, and let the light support your skin during your daily routine.';

  const currentPriceFormatted = product?.price ? formatPrice(product.price) : formatPrice(1200);
  const oldPriceFormatted = product?.originalPrice ? formatPrice(product.originalPrice) : formatPrice(2200);

  // Accordion Data with Fallbacks
  const hasCustomSpecs = Array.isArray(product?.specHighlights) && product.specHighlights.length > 0;
  const specHighlights = hasCustomSpecs ? product.specHighlights : null;
  const halfSpecs = specHighlights ? Math.ceil(specHighlights.length / 2) : 0;
  const specCol1 = specHighlights ? specHighlights.slice(0, halfSpecs) : [];
  const specCol2 = specHighlights ? specHighlights.slice(halfSpecs) : [];

  const healthBenefits =
    Array.isArray(product?.healthBenefits) && product.healthBenefits.length > 0
      ? product.healthBenefits
      : null;

  const wavelengthsTitle = product?.the8WavelengthsTitle || 'THE 4 WAVELENGTHS';
  const wavelengthsDesc = product?.wavelengthsDesc || null;

  const howToUse =
    Array.isArray(product?.howToUse) && product.howToUse.length > 0
      ? product.howToUse
      : null;

  const inTheBox =
    Array.isArray(product?.inTheBox) && product.inTheBox.length > 0
      ? product.inTheBox
      : null;

  return (
    <section
      id="luma-glow-details"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#FFFFFF] text-[#000000] font-['Manrope'] select-none pt-4 sm:pt-6 md:pt-8 lg:pt-[calc(165*var(--u))] pb-16 sm:pb-24 lg:pb-[calc(180*var(--u))]"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:pl-[calc(595*var(--u))] 2xl:pr-[calc(424*var(--u))]">
        {/* Main Grid: Left (Product Image Showcase) & Right (Product Details & Accordion) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,440px)_1fr] xl:grid-cols-[minmax(380px,500px)_1fr] 2xl:grid-cols-[calc(918*var(--u))_1fr] gap-8 sm:gap-10 lg:gap-12 xl:gap-16 2xl:gap-[calc(400*var(--u))] 3xl:gap-[calc(698*var(--u))] items-start">
          
          {/* ==================== LEFT COLUMN: IMAGE CAROUSEL & SWATCHES ==================== */}
          <div className="flex flex-col items-center w-full max-w-[460px] 2xl:max-w-none 2xl:w-[calc(918*var(--u))] mx-auto lg:mx-0">
            {/* Main Rounded Showcase Frame matching PSD Rectangle 70 copy (918x1144, r=50px) */}
            <div className="relative w-full aspect-[918/1144] rounded-[20px] sm:rounded-[30px] 2xl:rounded-[calc(50*var(--u))] overflow-hidden bg-[#F7F7F7] shadow-sm">
              <picture>
                <source srcSet={currentSlide.image} type="image/webp" />
                <img
                  src={currentSlide.fallback}
                  alt={currentSlide.alt}
                  className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
                  draggable={false}
                />
              </picture>
            </div>

            {/* Carousel Pagination Dots matching PSD (y=1775, 4 dots of 20x20px, gap 10px) */}
            <div className="flex items-center justify-center gap-2.5 2xl:gap-[calc(10*var(--u))] mt-5 sm:mt-7 2xl:mt-[calc(106*var(--u))]">
              {CAROUSEL_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`w-2.5 h-2.5 2xl:w-[calc(20*var(--u))] 2xl:h-[calc(20*var(--u))] rounded-full transition-all cursor-pointer ${
                    activeSlide === idx
                      ? 'bg-[#ED2024]'
                      : 'bg-[#D9D9D9] hover:bg-[#B3B3B3]'
                  }`}
                />
              ))}
            </div>

            {/* Color Swatch Selector Circles matching PSD GREY COLOUR BUTTON & BLCK COLOUR */}
            <div className="flex items-center justify-center gap-5 sm:gap-7 2xl:gap-[calc(67*var(--u))] mt-5 sm:mt-6 2xl:mt-[calc(83*var(--u))]">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    aria-label={`Select color ${color.name}`}
                    className={`relative w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] 2xl:w-[calc(82*var(--u))] 2xl:h-[calc(82*var(--u))] rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                      isSelected
                        ? 'ring-2 2xl:ring-[calc(4*var(--u))] ring-[#ED2024]'
                        : 'ring-1 2xl:ring-[calc(2*var(--u))] ring-[#EDEDED] hover:ring-gray-300'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: color.fillColor }}
                      className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] 2xl:w-[calc(73*var(--u))] 2xl:h-[calc(73*var(--u))] rounded-full block border border-black/10 shadow-inner"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: DETAILS & ACCORDION ==================== */}
          <div className="flex flex-col items-start w-full min-w-0">
            {/* Category Eyebrow: LUMA GLOW */}
            <span className="text-[13px] sm:text-[15px] xl:text-[16px] 2xl:text-[calc(45*var(--u))] font-medium uppercase tracking-[0.02em] text-[#ED2024] leading-none">
              {eyebrow}
            </span>

            {/* Product Title */}
            <h1 className="mt-2.5 sm:mt-3 2xl:mt-[calc(47*var(--u))] text-[24px] sm:text-[30px] md:text-[36px] xl:text-[40px] 2xl:text-[calc(75*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#000000] leading-[1.15]">
              {titleL1}
              {titleL2 && (
                <>
                  <br />
                  {titleL2}
                </>
              )}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="mt-2.5 sm:mt-3 2xl:mt-[calc(46*var(--u))] text-[13px] sm:text-[15px] xl:text-[16px] 2xl:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#000000] leading-snug">
              {subtitle}
            </p>

            {/* Price Row */}
            <div className="mt-5 sm:mt-6 2xl:mt-[calc(124*var(--u))] flex items-baseline gap-3 sm:gap-4 2xl:gap-[calc(34*var(--u))]">
              <span className="text-[18px] sm:text-[22px] xl:text-[24px] 2xl:text-[calc(43*var(--u))] font-medium tracking-[0.02em] text-[#000000] leading-none uppercase">
                {currentPriceFormatted}
              </span>
              {oldPriceFormatted && (
                <span className="text-[12px] sm:text-[14px] xl:text-[16px] 2xl:text-[calc(29*var(--u))] font-medium uppercase tracking-[0.02em] text-[#797979] line-through leading-none">
                  {oldPriceFormatted}
                </span>
              )}
            </div>

            {/* Action Buttons Row: ADD TO CART (#333333) & BUY NOW (#ED2024) */}
            {/* PSD: 327x86 each, r=10px, font 32px Manrope-SemiBold #FFFFFF, gap 10px */}
            <div className="mt-4 sm:mt-5 2xl:mt-[calc(55*var(--u))] flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2.5 sm:gap-3 2xl:gap-[calc(10*var(--u))] w-full sm:w-auto">
                {/* ADD TO CART Button */}
                <button
                  type="button"
                  onClick={() => {
                    const activeColor = COLOR_OPTIONS.find((c) => c.id === selectedColor) || COLOR_OPTIONS[1];
                    const item = {
                      id: product?._id || product?.id || 'luma-glow',
                      slug: 'luma-glow',
                      name: product?.name || 'LUMA FACE LED LIGHT THERAPY MASK',
                      price: Number(product?.price) || 326,
                      image: product?.image || '/assets/glow/glow-1.jpg',
                      variant: activeColor?.name || 'Obsidian Black',
                    };
                    const added = addToCart(item, 1, activeColor?.name);
                    if (added && onOpenCart) onOpenCart();
                  }}
                  className="flex-1 sm:flex-none w-auto sm:w-[155px] xl:w-[170px] 2xl:w-[calc(327*var(--u))] h-[42px] sm:h-[48px] xl:h-[50px] 2xl:h-[calc(86*var(--u))] rounded-[6px] 2xl:rounded-[calc(10*var(--u))] bg-[#333333] hover:bg-[#222222] active:scale-[0.98] text-[#FFFFFF] text-[12px] sm:text-[13px] xl:text-[14px] 2xl:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-all cursor-pointer leading-none shadow-sm"
                >
                  ADD TO CART
                </button>

                {/* BUY NOW Button */}
                <button
                  type="button"
                  onClick={() => {
                    const activeColor = COLOR_OPTIONS.find((c) => c.id === selectedColor) || COLOR_OPTIONS[1];
                    const item = {
                      id: product?._id || product?.id || 'luma-glow',
                      slug: 'luma-glow',
                      name: product?.name || 'LUMA FACE LED LIGHT THERAPY MASK',
                      price: Number(product?.price) || 326,
                      image: product?.image || '/assets/glow/glow-1.jpg',
                      variant: activeColor?.name || 'Obsidian Black',
                    };
                    buyNow(item, onBuyNow || onOpenCart, 1, activeColor?.name);
                  }}
                  className="flex-1 sm:flex-none w-auto sm:w-[155px] xl:w-[170px] 2xl:w-[calc(327*var(--u))] h-[42px] sm:h-[48px] xl:h-[50px] 2xl:h-[calc(86*var(--u))] rounded-[6px] 2xl:rounded-[calc(10*var(--u))] bg-[#ED2024] hover:bg-[#d4191d] active:scale-[0.98] text-[#FFFFFF] text-[12px] sm:text-[13px] xl:text-[14px] 2xl:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-all cursor-pointer leading-none shadow-md"
                >
                  BUY NOW
                </button>
              </div>

              {/* Guest Authentication Notice */}
              {!customerUser && (
                <p className="text-[11px] sm:text-[11.5px] 2xl:text-[calc(22*var(--u))] text-gray-500 flex items-center gap-1.5 mt-1">
                  <span className="text-[#ED2024] font-bold">🔒</span>
                  <span>
                    Sign in required to buy or add to bag.{' '}
                    <button
                      type="button"
                      onClick={() => openAuthModal('Please sign in or create an account to purchase products or add them to your cart.')}
                      className="text-[#ED2024] font-semibold underline hover:no-underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                </p>
              )}
            </div>

            {/* 3 Mini Trust Guarantee Badges Row */}
            {/* PSD: delivery-truck, 90 Day Trial, 1 Year Warranty (y=1140..1219, x=2279..2859, center-aligned under buttons) */}
            <div className="mt-5 sm:mt-6 lg:mt-7 2xl:mt-[calc(52*var(--u))] flex items-center justify-between w-full sm:w-[322px] xl:w-[352px] 2xl:w-[calc(664*var(--u))] px-1 sm:px-2 xl:px-3 2xl:px-[calc(42*var(--u))]">
              {/* Free Delivery: x=2279..2402, Icon 64x35 at center x=2340 */}
              <div className="flex flex-col items-center text-center">
                <div className="h-[20px] sm:h-[22px] xl:h-[24px] 2xl:h-[calc(35*var(--u))] flex items-center justify-center">
                  <img
                    src="/assets/glow/icon-delivery.png"
                    alt=""
                    className="h-full w-auto object-contain block"
                  />
                </div>
                <span className="mt-2 sm:mt-2.5 2xl:mt-[calc(28*var(--u))] text-[10px] sm:text-[10.5px] xl:text-[11.5px] 2xl:text-[calc(17*var(--u))] font-bold text-[#7D7D7D] uppercase tracking-normal whitespace-nowrap leading-none">
                  FREE DELIVERY
                </span>
              </div>

              {/* 90 Day Trial: x=2509..2618, Icon 38x36 at center x=2561 */}
              <div className="flex flex-col items-center text-center">
                <div className="h-[20px] sm:h-[22px] xl:h-[24px] 2xl:h-[calc(36*var(--u))] flex items-center justify-center">
                  <img
                    src="/assets/glow/icon-trial.png"
                    alt=""
                    className="h-full w-auto object-contain block"
                  />
                </div>
                <span className="mt-2 sm:mt-2.5 2xl:mt-[calc(28*var(--u))] text-[10px] sm:text-[10.5px] xl:text-[11.5px] 2xl:text-[calc(17*var(--u))] font-bold text-[#7D7D7D] uppercase tracking-normal whitespace-nowrap leading-none">
                  90 DAY TRIAL
                </span>
              </div>

              {/* 1 Year Warranty: x=2700..2859, Icon 33x36 at center x=2770 */}
              <div className="flex flex-col items-center text-center">
                <div className="h-[20px] sm:h-[22px] xl:h-[24px] 2xl:h-[calc(36*var(--u))] flex items-center justify-center">
                  <img
                    src="/assets/glow/icon-warranty.png"
                    alt=""
                    className="h-full w-auto object-contain block"
                  />
                </div>
                <span className="mt-2 sm:mt-2.5 2xl:mt-[calc(28*var(--u))] text-[10px] sm:text-[10.5px] xl:text-[11.5px] 2xl:text-[calc(17*var(--u))] font-bold text-[#8B8B8B] uppercase tracking-[0.02em] whitespace-nowrap leading-none">
                  1 YEAR WARRANTY
                </span>
              </div>
            </div>

            {/* ==================== ACCORDION LIST (MATCHING PSD EXACTLY) ==================== */}
            <div className="w-full mt-7 sm:mt-10 2xl:mt-[calc(106*var(--u))] flex flex-col gap-6 sm:gap-7 2xl:gap-[calc(50*var(--u))]">
              
              {/* 1. PRODUCT SPECIFICATION */}
              <div className="w-full">
                {/* Header: Icon at x=2211, Title at x=2301, Toggle at x=3114 */}
                <button
                  type="button"
                  onClick={() => toggleAccordion('spec')}
                  className="w-full max-w-[850px] 2xl:max-w-[calc(903*var(--u))] flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-spec.png"
                      alt=""
                      className="w-4 sm:w-5 2xl:w-[calc(35*var(--u))] h-auto object-contain"
                    />
                    <span className="text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[calc(34*var(--u))] font-light uppercase tracking-[0.02em] text-[#000000]">
                      PRODUCT SPECIFICATION
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl 2xl:text-[calc(38*var(--u))] font-light text-[#8D8D8D] leading-none px-1">
                    {openAccordions.spec ? '—' : '+'}
                  </span>
                </button>

                {openAccordions.spec && (
                  <div className="mt-4 sm:mt-5 2xl:mt-[calc(40*var(--u))] pr-2 overflow-x-auto">
                    {hasCustomSpecs ? (
                      <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8 md:gap-10 xl:gap-14 2xl:gap-[calc(138*var(--u))] text-[12px] sm:text-[13px] md:text-[13.5px] xl:text-[14px] 2xl:text-[calc(30*var(--u))] leading-relaxed">
                        <div className="flex flex-col gap-y-3 sm:gap-y-3.5 2xl:gap-y-[calc(30*var(--u))] shrink-0">
                          {specCol1.map((item, idx) => (
                            <div key={idx} className="flex items-baseline">
                              <span className="w-[105px] sm:w-[120px] lg:w-[130px] 2xl:w-[calc(170*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                                {item.label}
                              </span>
                              <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-y-3 sm:gap-y-3.5 2xl:gap-y-[calc(30*var(--u))] shrink-0">
                          {specCol2.map((item, idx) => (
                            <div key={idx} className="flex items-baseline">
                              <span className="w-[145px] sm:w-[175px] lg:w-[195px] xl:w-[220px] 2xl:w-[calc(279*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                                {item.label}
                              </span>
                              <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8 md:gap-10 xl:gap-14 2xl:gap-[calc(138*var(--u))] text-[12px] sm:text-[13px] md:text-[13.5px] xl:text-[14px] 2xl:text-[calc(30*var(--u))] leading-relaxed">
                        {/* Left Sub-Column: x=2211..2548 */}
                        <div className="flex flex-col gap-y-3 sm:gap-y-3.5 2xl:gap-y-[calc(30*var(--u))] shrink-0">
                          {/* Row 1: LEDs / Chips */}
                          <div className="flex items-baseline">
                            <span className="w-[105px] sm:w-[120px] lg:w-[130px] 2xl:w-[calc(170*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                              LEDs / Chips
                            </span>
                            <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                              236
                            </span>
                          </div>

                          {/* Row 2: Coverage */}
                          <div className="flex items-baseline">
                            <span className="w-[105px] sm:w-[120px] lg:w-[130px] 2xl:w-[calc(170*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                              Coverage
                            </span>
                            <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                              Face
                            </span>
                          </div>

                          {/* Row 3: Charging */}
                          <div className="flex items-baseline">
                            <span className="w-[105px] sm:w-[120px] lg:w-[130px] 2xl:w-[calc(170*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                              Charging
                            </span>
                            <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                              USB-C, 3 hours
                            </span>
                          </div>

                          {/* Row 4: Warranty */}
                          <div className="flex items-baseline">
                            <span className="w-[105px] sm:w-[120px] lg:w-[130px] 2xl:w-[calc(170*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                              Warranty
                            </span>
                            <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                              1 Year
                            </span>
                          </div>
                        </div>

                        {/* Right Sub-Column: x=2686..3416 */}
                        <div className="flex flex-col gap-y-3 sm:gap-y-3.5 2xl:gap-y-[calc(30*var(--u))] shrink-0">
                          {/* Row 1: Wavelength */}
                          <div className="flex items-baseline">
                            <span className="w-[145px] sm:w-[175px] lg:w-[195px] xl:w-[220px] 2xl:w-[calc(279*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                              Wavelength
                            </span>
                            <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                              460nm : 665nm : 850nm : 1064nm
                            </span>
                          </div>

                          {/* Row 2: Timer */}
                          <div className="flex items-baseline">
                            <span className="w-[145px] sm:w-[175px] lg:w-[195px] xl:w-[220px] 2xl:w-[calc(279*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                              Timer
                            </span>
                            <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                              T1: 5–15 min · T2: 5–10 min · T3: 10–15 min
                            </span>
                          </div>

                          {/* Row 3: Battery */}
                          <div className="flex items-baseline">
                            <span className="w-[145px] sm:w-[175px] lg:w-[195px] xl:w-[220px] 2xl:w-[calc(279*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0">
                              Battery
                            </span>
                            <span className="text-[#0A0A0B] font-light tracking-[0.02em] whitespace-nowrap">
                              1440 mAh · 35 min per charge
                            </span>
                          </div>

                          {/* Row 4: Modes */}
                          <div className="flex items-start">
                            <span className="w-[145px] sm:w-[175px] lg:w-[195px] xl:w-[220px] 2xl:w-[calc(279*var(--u))] text-[#8D8D8D] font-light tracking-[0.02em] whitespace-nowrap shrink-0 pt-0.5">
                              Modes
                            </span>
                            <span className="text-[#0A0A0B] font-light tracking-[0.02em] leading-snug whitespace-nowrap">
                              <span>M1 Glow Boost (Red + Near-Infrared)</span>
                              <br />
                              <span>M2 Clear Skin (Blue + Near-Infrared)</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. HEALTH BENEFITS */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleAccordion('benefits')}
                  className="w-full max-w-[850px] 2xl:max-w-[calc(903*var(--u))] flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-heart.png"
                      alt=""
                      className="w-4 sm:w-5 2xl:w-[calc(35*var(--u))] h-auto object-contain"
                    />
                    <span className="text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[calc(34*var(--u))] font-light uppercase tracking-[0.02em] text-[#0A0A0B]">
                      HEALTH BENEFITS
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl 2xl:text-[calc(38*var(--u))] font-light text-[#8D8D8D] leading-none px-1">
                    {openAccordions.benefits ? '—' : '+'}
                  </span>
                </button>

                {openAccordions.benefits && (
                  <div className="mt-3 sm:mt-4 2xl:mt-[calc(30*var(--u))] pl-7 sm:pl-9 2xl:pl-[calc(53*var(--u))] text-[12px] sm:text-[13px] 2xl:text-[calc(30*var(--u))] text-[#555555] font-light leading-relaxed max-w-[850px]">
                    {healthBenefits ? (
                      <ul className="list-disc pl-4 space-y-1 sm:space-y-2">
                        {healthBenefits.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1 sm:space-y-2">
                        <li>Boosts natural collagen synthesis to visibly reduce fine lines and wrinkles.</li>
                        <li>Improves cellular energy (ATP) for firmer, more elastic skin texture.</li>
                        <li>Calms skin redness, inflammation, and accelerates post-workout recovery.</li>
                        <li>Clarifies blemishes and controls breakout-causing bacteria using 460nm blue light.</li>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* 3. THE 4 WAVELENGTHS */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleAccordion('wavelengths')}
                  className="w-full max-w-[850px] 2xl:max-w-[calc(903*var(--u))] flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-waves.png"
                      alt=""
                      className="w-4 sm:w-5 2xl:w-[calc(35*var(--u))] h-auto object-contain"
                    />
                    <span className="text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[calc(34*var(--u))] font-light uppercase tracking-[0.02em] text-[#0A0A0B]">
                      {wavelengthsTitle}
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl 2xl:text-[calc(38*var(--u))] font-light text-[#8D8D8D] leading-none px-1">
                    {openAccordions.wavelengths ? '—' : '+'}
                  </span>
                </button>

                {openAccordions.wavelengths && (
                  <div className="mt-3 sm:mt-4 2xl:mt-[calc(30*var(--u))] pl-7 sm:pl-9 2xl:pl-[calc(53*var(--u))] text-[12px] sm:text-[13px] 2xl:text-[calc(30*var(--u))] text-[#555555] font-light leading-relaxed max-w-[850px]">
                    {wavelengthsDesc ? (
                      <p className="leading-relaxed">{wavelengthsDesc}</p>
                    ) : (
                      <div className="space-y-2">
                        <p><strong className="text-black font-medium">460 nm (Blue):</strong> Clarifies surface bacteria and promotes clean, clear pores.</p>
                        <p><strong className="text-black font-medium">665 nm (Deep Red):</strong> Stimulates fibroblast activity and rejuvenates outer dermal layers.</p>
                        <p><strong className="text-black font-medium">850 nm (Near-Infrared):</strong> Reaches deeper tissues to optimize cellular repair and microcirculation.</p>
                        <p><strong className="text-black font-medium">1064 nm (Deep NIR):</strong> Medical-grade deep penetration for maximum collagen regeneration.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. HOW TO USE */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleAccordion('howToUse')}
                  className="w-full max-w-[850px] 2xl:max-w-[calc(903*var(--u))] flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-info.png"
                      alt=""
                      className="w-4 sm:w-5 2xl:w-[calc(35*var(--u))] h-auto object-contain"
                    />
                    <span className="text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[calc(34*var(--u))] font-light uppercase tracking-[0.02em] text-[#0A0A0B]">
                      HOW TO USE
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl 2xl:text-[calc(38*var(--u))] font-light text-[#8D8D8D] leading-none px-1">
                    {openAccordions.howToUse ? '—' : '+'}
                  </span>
                </button>

                {openAccordions.howToUse && (
                  <div className="mt-3 sm:mt-4 2xl:mt-[calc(30*var(--u))] pl-7 sm:pl-9 2xl:pl-[calc(53*var(--u))] text-[12px] sm:text-[13px] 2xl:text-[calc(30*var(--u))] text-[#555555] font-light leading-relaxed max-w-[850px]">
                    {howToUse ? (
                      <ol className="list-decimal pl-4 space-y-1 sm:space-y-2">
                        {howToUse.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <ol className="list-decimal pl-4 space-y-1 sm:space-y-2">
                        <li>Cleanse and dry your face thoroughly before beginning your ritual.</li>
                        <li>Position the soft silicone mask over your face and secure the rear strap.</li>
                        <li>Press the power button on the controller to choose your desired mode and timer.</li>
                        <li>Sit back or continue light daily tasks for 10–15 minutes until it automatically shuts off.</li>
                      </ol>
                    )}
                  </div>
                )}
              </div>

              {/* 5. WHAT'S IN THE BOX */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleAccordion('inTheBox')}
                  className="w-full max-w-[850px] 2xl:max-w-[calc(903*var(--u))] flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-box.png"
                      alt=""
                      className="w-4 sm:w-5 2xl:w-[calc(35*var(--u))] h-auto object-contain"
                    />
                    <span className="text-[14px] sm:text-[16px] xl:text-[17px] 2xl:text-[calc(34*var(--u))] font-light uppercase tracking-[0.02em] text-[#0A0A0B]">
                      WHAT’S IN THE BOX
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl 2xl:text-[calc(38*var(--u))] font-light text-[#8D8D8D] leading-none px-1">
                    {openAccordions.inTheBox ? '—' : '+'}
                  </span>
                </button>

                {openAccordions.inTheBox && (
                  <div className="mt-3 sm:mt-4 2xl:mt-[calc(30*var(--u))] pl-7 sm:pl-9 2xl:pl-[calc(53*var(--u))] text-[12px] sm:text-[13px] 2xl:text-[calc(30*var(--u))] text-[#555555] font-light leading-relaxed max-w-[850px]">
                    {inTheBox ? (
                      <ul className="list-disc pl-4 space-y-1 sm:space-y-2">
                        {inTheBox.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1 sm:space-y-2">
                        <li>LUMA GLOW Targeted Red Light Face Mask</li>
                        <li>Ergonomic Dual-Strap Head Mount</li>
                        <li>Integrated Soft Protective Eye Shields</li>
                        <li>Rechargeable Smart Remote Controller (1440 mAh)</li>
                        <li>USB-C Fast Charging Cable</li>
                        <li>LUMA Luxury Travel &amp; Storage Dust Pouch</li>
                        <li>Comprehensive User Manual &amp; 1-Year International Warranty Card</li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
