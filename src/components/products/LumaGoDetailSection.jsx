import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const HERO_IMAGES = [
  {
    id: 'hero-1',
    src: '/assets/go/go-hero-main.webp',
    fallback: '/assets/go/go-hero-main.jpg',
    alt: 'LUMA GO Targeted Red Light Device - Lifestyle View',
  },
  {
    id: 'hero-2',
    src: '/assets/products/luma-go.png',
    fallback: '/assets/products/luma-go.png',
    alt: 'LUMA GO Device Front Angle View',
  },
  {
    id: 'hero-3',
    src: '/assets/go/benefit-2.webp',
    fallback: '/assets/go/benefit-2.jpg',
    alt: 'LUMA GO Cordless Travel Ritual',
  },
  {
    id: 'hero-4',
    src: '/assets/go/benefit-3.webp',
    fallback: '/assets/go/benefit-3.jpg',
    alt: 'LUMA GO Skin Wellness Session',
  },
];

export default function LumaGoDetailSection({ product, onOpenCart, onBuyNow }) {
  const { formatPrice } = useCurrency();
  const { addToCart, buyNow } = useCart();
  const { customerUser, openAuthModal } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('spec');

  const toggleAccordion = (id) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  // Eyebrow & Titles
  const eyebrow = product?.eyebrow || 'LUMA GO';
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
      titleL1 = 'LUMA TARGETED RED';
      titleL2 = 'LIGHT THERAPY PANEL';
    }
  }

  const subtitle =
    product?.subtitle ||
    product?.description ||
    'Built for the areas that need the most attention — back, shoulders, legs. Surge covers a wider treatment zone for pain relief and faster post-workout recovery.';

  const currentPriceFormatted = product?.price ? formatPrice(product.price) : formatPrice(1890);
  const oldPriceFormatted = product?.originalPrice ? formatPrice(product.originalPrice) : formatPrice(2890);

  // 1. Spec Highlights for Accordion 1
  const defaultSpecHighlights = [
    { label: 'Leds', value: '12' },
    { label: 'Coverage', value: 'Targeted Treatment' },
    { label: 'Dimensions', value: '140 x 70 x 29 mm' },
    { label: 'Lifespan', value: '50,000hrs' },
    { label: 'Battery Size', value: '7.4V 2500mAh' },
    { label: 'Battery Performance', value: '2 hours' },
    { label: 'Charging time', value: '1.5h (type-c)' },
    { label: 'Wavelength', value: '660nm' },
  ];
  const specHighlights =
    Array.isArray(product?.specHighlights) && product.specHighlights.length > 0
      ? product.specHighlights
      : defaultSpecHighlights;

  const half = Math.ceil(specHighlights.length / 2);
  const specCol1 = specHighlights.slice(0, half);
  const specCol2 = specHighlights.slice(half);

  // 2. Health Benefits for Accordion 2
  const defaultHealthBenefits = [
    'Targeted cellular energy (ATP) stimulation for deep tissue recovery.',
    'Helps relieve localized muscular fatigue, joint tension, and soreness.',
    'Stimulates dermal collagen synthesis for improved skin firmness and glow.',
    'Portable, pocket-sized design enables convenient daily healing sessions anywhere.',
  ];
  const healthBenefits =
    Array.isArray(product?.healthBenefits) && product.healthBenefits.length > 0
      ? product.healthBenefits
      : defaultHealthBenefits;

  // 3. Wavelengths for Accordion 3
  const wavelengthsTitle = product?.the8WavelengthsTitle || 'THE 8 WAVELENGTHS';
  const wavelengthsDesc =
    product?.wavelengthsDesc ||
    'LUMA GO concentrates high-intensity 660nm red light with a focused 30° optical beam angle, maximizing photon absorption in the skin and superficial tissue layers for peak biological rejuvenation.';

  // 4. How to Use for Accordion 4
  const defaultHowToUse = [
    'Hold or position the device 1-6 inches from target area.',
    'Run a 10-15 minute session per targeted muscle group or skin zone.',
    'Use 1-2 times daily for optimal restorative results.',
  ];
  const howToUse =
    Array.isArray(product?.howToUse) && product.howToUse.length > 0
      ? product.howToUse
      : defaultHowToUse;

  // 5. In the Box for Accordion 5
  const defaultInTheBox = [
    '1× LUMA GO Targeted Red Light Panel',
    '1× Protective Hard Carrying Pouch',
    '1× USB Type-C Fast Charging Cable',
    '1× Protective Travel Eye Goggles',
    '1× Comprehensive User Manual & Quick Start Guide',
  ];
  const inTheBox =
    Array.isArray(product?.inTheBox) && product.inTheBox.length > 0
      ? product.inTheBox
      : defaultInTheBox;

  return (
    <section
      id="luma-go-detail"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#FFFFFF] text-[#000000] font-['Manrope'] select-none pt-6 sm:pt-10 md:pt-12 lg:pt-14 2xl:pt-[calc(60*var(--u))] pb-14 sm:pb-16 md:pb-20 lg:pb-24 2xl:pb-[calc(136*var(--u))]"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-[calc(520*var(--u))]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-14 xl:gap-16 2xl:gap-[calc(300*var(--u))] items-start">
          
          {/* ==================== LEFT COLUMN: PRODUCT IMAGE GALLERY ==================== */}
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-none 2xl:w-[calc(918*var(--u))] aspect-[918/1144] rounded-[24px] sm:rounded-[32px] 2xl:rounded-[calc(50*var(--u))] overflow-hidden bg-[#F5F5F5] shadow-lg border border-black/5">
              <picture>
                <source srcSet={HERO_IMAGES[activeImageIndex].src} type="image/webp" />
                <img
                  src={HERO_IMAGES[activeImageIndex].fallback}
                  alt={HERO_IMAGES[activeImageIndex].alt}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  draggable={false}
                />
              </picture>
            </div>

            {/* Thumbnail Indicators (PSD Ellipse 6 / copy / copy 2 / copy 3: 20x20 at 3840w, gap 10px) */}
            <div className="mt-4 sm:mt-5 2xl:mt-[calc(40*var(--u))] flex items-center justify-center gap-2.5 sm:gap-3 2xl:gap-[calc(10*var(--u))]">
              {HERO_IMAGES.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`Show view ${idx + 1}`}
                  className={`transition-all duration-200 cursor-pointer rounded-full ${
                    activeImageIndex === idx
                      ? 'w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] 2xl:w-[calc(20*var(--u))] 2xl:h-[calc(20*var(--u))] bg-[#ED2024] scale-110'
                      : 'w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] 2xl:w-[calc(20*var(--u))] 2xl:h-[calc(20*var(--u))] bg-[#D1D1D1] hover:bg-[#A0A0A0]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: DETAILS & ACCORDION ==================== */}
          <div className="flex flex-col items-start w-full min-w-0">
            {/* Category Eyebrow: LUMA GO */}
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
            <div className="mt-5 sm:mt-6 2xl:mt-[calc(60*var(--u))] flex items-baseline gap-3 sm:gap-4 2xl:gap-[calc(34*var(--u))]">
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
            <div className="mt-4 sm:mt-5 2xl:mt-[calc(55*var(--u))] flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2.5 sm:gap-3 2xl:gap-[calc(10*var(--u))] w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const item = {
                      id: product?._id || product?.id || 'luma-go',
                      slug: 'luma-go',
                      name: product?.name || 'LUMA GO TARGETED RED LIGHT DEVICE',
                      price: Number(product?.price) || 490,
                      image: product?.image || '/assets/products/luma-go.png',
                      variant: 'Portable Targeted Panel',
                    };
                    const added = addToCart(item, 1);
                    if (added && onOpenCart) onOpenCart();
                  }}
                  className="flex-1 sm:flex-none w-auto sm:w-[155px] xl:w-[170px] 2xl:w-[calc(327*var(--u))] h-[42px] sm:h-[48px] xl:h-[50px] 2xl:h-[calc(86*var(--u))] rounded-[6px] 2xl:rounded-[calc(10*var(--u))] bg-[#333333] hover:bg-[#222222] active:scale-[0.98] text-[#FFFFFF] text-[12px] sm:text-[13px] xl:text-[14px] 2xl:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-all cursor-pointer leading-none shadow-sm"
                >
                  ADD TO CART
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const item = {
                      id: product?._id || product?.id || 'luma-go',
                      slug: 'luma-go',
                      name: product?.name || 'LUMA GO TARGETED RED LIGHT DEVICE',
                      price: Number(product?.price) || 490,
                      image: product?.image || '/assets/products/luma-go.png',
                      variant: 'Portable Targeted Panel',
                    };
                    buyNow(item, onBuyNow || onOpenCart, 1);
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
            {/* Free Delivery, 90 Day Trial, 3 Year Warranty */}
            <div className="mt-5 sm:mt-6 lg:mt-7 2xl:mt-[calc(52*var(--u))] flex items-center justify-between w-full sm:w-[322px] xl:w-[352px] 2xl:w-[calc(664*var(--u))] px-1 sm:px-2 xl:px-3 2xl:px-[calc(42*var(--u))]">
              {/* Free Delivery */}
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

              {/* 90 Day Trial */}
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

              {/* 3 Year Warranty */}
              <div className="flex flex-col items-center text-center">
                <div className="h-[20px] sm:h-[22px] xl:h-[24px] 2xl:h-[calc(36*var(--u))] flex items-center justify-center">
                  <img
                    src="/assets/glow/icon-warranty.png"
                    alt=""
                    className="h-full w-auto object-contain block"
                  />
                </div>
                <span className="mt-2 sm:mt-2.5 2xl:mt-[calc(28*var(--u))] text-[10px] sm:text-[10.5px] xl:text-[11.5px] 2xl:text-[calc(17*var(--u))] font-bold text-[#8B8B8B] uppercase tracking-[0.02em] whitespace-nowrap leading-none">
                  3 YEAR WARRANTY
                </span>
              </div>
            </div>

            {/* ==================== 5 ACCORDION ITEMS ==================== */}
            <div className="w-full mt-7 sm:mt-8 lg:mt-9 2xl:mt-[calc(105*var(--u))] flex flex-col">
              
              {/* ITEM 1: PRODUCT SPECIFICATION */}
              <div className="w-full py-3.5 sm:py-4 2xl:py-[calc(38*var(--u))]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('spec')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-spec.png"
                      alt=""
                      className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] 2xl:w-[calc(35*var(--u))] 2xl:h-[calc(35*var(--u))] object-contain shrink-0"
                    />
                    <span className="text-[14px] sm:text-[15px] xl:text-[16px] 2xl:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#000000]">
                      PRODUCT SPECIFICATION
                    </span>
                  </div>
                  <span className="text-[20px] sm:text-[22px] 2xl:text-[calc(30*var(--u))] text-[#000000] font-light leading-none">
                    {openAccordion === 'spec' ? '—' : '+'}
                  </span>
                </button>

                {openAccordion === 'spec' && (
                  <div className="mt-4 sm:mt-5 2xl:mt-[calc(40*var(--u))] pl-[24px] sm:pl-[36px] 2xl:pl-[calc(88*var(--u))] animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row items-start w-full gap-2 sm:gap-6 lg:gap-8">
                      {/* Column 1 */}
                      <div className="w-full sm:flex-1 flex flex-col gap-2 2xl:gap-[calc(20*var(--u))]">
                        {specCol1.map((item, idx) => (
                          <div key={idx} className="flex items-baseline justify-between text-[11.5px] sm:text-[12px] xl:text-[12.5px] 2xl:text-[calc(24*var(--u))] font-normal tracking-[0.02em]">
                            <span className="text-[#8D8D8D] whitespace-nowrap">{item.label}</span>
                            <span className="text-[#000000] font-medium text-right whitespace-nowrap">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Column 2 */}
                      <div className="w-full sm:flex-1 flex flex-col gap-2 2xl:gap-[calc(20*var(--u))] pt-2 sm:pt-0 sm:pl-6 sm:border-l border-black/10">
                        {specCol2.map((item, idx) => (
                          <div key={idx} className="flex items-baseline justify-between text-[11.5px] sm:text-[12px] xl:text-[12.5px] 2xl:text-[calc(24*var(--u))] font-normal tracking-[0.02em]">
                            <span className="text-[#8D8D8D] whitespace-nowrap">{item.label}</span>
                            <span className="text-[#000000] font-medium text-right whitespace-nowrap">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ITEM 2: HEALTH BENEFITS */}
              <div className="w-full py-3.5 sm:py-4 2xl:py-[calc(38*var(--u))]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('benefits')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-heart.png"
                      alt=""
                      className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] 2xl:w-[calc(42*var(--u))] 2xl:h-[calc(30*var(--u))] object-contain shrink-0"
                    />
                    <span className="text-[14px] sm:text-[15px] xl:text-[16px] 2xl:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#000000]">
                      HEALTH BENEFITS
                    </span>
                  </div>
                  <span className="text-[20px] sm:text-[22px] 2xl:text-[calc(30*var(--u))] text-[#000000] font-light leading-none">
                    {openAccordion === 'benefits' ? '—' : '+'}
                  </span>
                </button>

                {openAccordion === 'benefits' && (
                  <div className="mt-4 sm:mt-5 2xl:mt-[calc(40*var(--u))] pl-[30px] sm:pl-[36px] 2xl:pl-[calc(88*var(--u))] animate-in fade-in duration-200">
                    <ul className="list-disc list-inside space-y-1.5 text-[11px] sm:text-[12px] xl:text-[12.5px] 2xl:text-[calc(24*var(--u))] text-[#555555]">
                      {healthBenefits.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* ITEM 3: THE 8 WAVELENGTHS */}
              <div className="w-full py-3.5 sm:py-4 2xl:py-[calc(38*var(--u))]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('wavelengths')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-waves.png"
                      alt=""
                      className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] 2xl:w-[calc(37*var(--u))] 2xl:h-[calc(32*var(--u))] object-contain shrink-0"
                    />
                    <span className="text-[14px] sm:text-[15px] xl:text-[16px] 2xl:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#000000]">
                      {wavelengthsTitle}
                    </span>
                  </div>
                  <span className="text-[20px] sm:text-[22px] 2xl:text-[calc(30*var(--u))] text-[#000000] font-light leading-none">
                    {openAccordion === 'wavelengths' ? '—' : '+'}
                  </span>
                </button>

                {openAccordion === 'wavelengths' && (
                  <div className="mt-4 sm:mt-5 2xl:mt-[calc(40*var(--u))] pl-[30px] sm:pl-[36px] 2xl:pl-[calc(88*var(--u))] animate-in fade-in duration-200">
                    <p className="text-[11px] sm:text-[12px] xl:text-[12.5px] 2xl:text-[calc(24*var(--u))] text-[#555555] leading-relaxed">
                      {wavelengthsDesc}
                    </p>
                  </div>
                )}
              </div>

              {/* ITEM 4: HOW TO USE */}
              <div className="w-full py-3.5 sm:py-4 2xl:py-[calc(38*var(--u))]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('usage')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-info.png"
                      alt=""
                      className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] 2xl:w-[calc(32*var(--u))] 2xl:h-[calc(31*var(--u))] object-contain shrink-0"
                    />
                    <span className="text-[14px] sm:text-[15px] xl:text-[16px] 2xl:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#000000]">
                      HOW TO USE
                    </span>
                  </div>
                  <span className="text-[20px] sm:text-[22px] 2xl:text-[calc(30*var(--u))] text-[#000000] font-light leading-none">
                    {openAccordion === 'usage' ? '—' : '+'}
                  </span>
                </button>

                {openAccordion === 'usage' && (
                  <div className="mt-4 sm:mt-5 2xl:mt-[calc(40*var(--u))] pl-[30px] sm:pl-[36px] 2xl:pl-[calc(88*var(--u))] animate-in fade-in duration-200">
                    <ol className="list-decimal list-inside space-y-1.5 text-[11px] sm:text-[12px] xl:text-[12.5px] 2xl:text-[calc(24*var(--u))] text-[#555555]">
                      {howToUse.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* ITEM 5: WHAT'S IN THE BOX */}
              <div className="w-full py-3.5 sm:py-4 2xl:py-[calc(38*var(--u))]">
                <button
                  type="button"
                  onClick={() => toggleAccordion('box')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-[calc(53*var(--u))]">
                    <img
                      src="/assets/glow/icon-box.png"
                      alt=""
                      className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] 2xl:w-[calc(37*var(--u))] 2xl:h-[calc(36*var(--u))] object-contain shrink-0"
                    />
                    <span className="text-[14px] sm:text-[15px] xl:text-[16px] 2xl:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#000000]">
                      WHAT’S IN THE BOX
                    </span>
                  </div>
                  <span className="text-[20px] sm:text-[22px] 2xl:text-[calc(30*var(--u))] text-[#000000] font-light leading-none">
                    {openAccordion === 'box' ? '—' : '+'}
                  </span>
                </button>

                {openAccordion === 'box' && (
                  <div className="mt-4 sm:mt-5 2xl:mt-[calc(40*var(--u))] pl-[30px] sm:pl-[36px] 2xl:pl-[calc(88*var(--u))] animate-in fade-in duration-200">
                    <ul className="list-disc list-inside space-y-1.5 text-[11px] sm:text-[12px] xl:text-[12.5px] 2xl:text-[calc(24*var(--u))] text-[#555555]">
                      {inTheBox.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
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

