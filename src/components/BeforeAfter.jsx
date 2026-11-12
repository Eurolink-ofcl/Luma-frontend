import React, { useState, useMemo } from 'react';

const DEFAULT_CATEGORIES = [
  {
    id: 'ACNE',
    label: 'ACNE',
    widthClass: 'lg:w-[calc(306*var(--u))]',
    beforeImage: '/assets/before_after/face-before.jpg',
    afterImage: '/assets/before_after/face-after.jpg',
    subtitle: 'Targeted blue & red light purifying active blemishes and calming inflammation.',
  },
  {
    id: 'WRINKLE',
    label: 'WRINKLE',
    widthClass: 'lg:w-[calc(320*var(--u))]',
    beforeImage: '/assets/before_after/face-before.jpg',
    afterImage: '/assets/before_after/face-after.jpg',
    subtitle: 'Deep collagen and elastin stimulation visibly smoothing fine lines and firming skin.',
  },
  {
    id: 'PIGMENTATION',
    label: 'PIGMENTATION',
    widthClass: 'lg:w-[calc(412*var(--u))]',
    beforeImage: '/assets/before_after/face-before.jpg',
    afterImage: '/assets/before_after/face-after.jpg',
    subtitle: 'Even tone renewal fading dark sun spots, redness, and discoloration.',
  },
];

export default function BeforeAfter({ variant = 'home', data }) {
  const isReview = variant === 'review';

  // Normalize categories list from data?.categories or fallback to default 3
  const activeCategories = useMemo(() => {
    if (Array.isArray(data?.categories) && data.categories.length > 0) {
      return data.categories.map((c, idx) => {
        if (typeof c === 'string') {
          const matchDefault = DEFAULT_CATEGORIES.find((d) => d.id === c);
          return {
            id: c,
            label: c,
            widthClass: matchDefault?.widthClass || 'px-6 lg:px-[calc(30*var(--u))]',
            beforeImage: matchDefault?.beforeImage || data?.beforeImage || '/assets/before_after/face-before.jpg',
            afterImage: matchDefault?.afterImage || data?.afterImage || '/assets/before_after/face-after.jpg',
            subtitle: matchDefault?.subtitle || '',
          };
        }
        const matchDefault = DEFAULT_CATEGORIES.find((d) => d.id === c.id);
        return {
          id: c.id || c.label || `cat-${idx}`,
          label: c.label || c.id || `Category ${idx + 1}`,
          widthClass: matchDefault?.widthClass || (c.id === 'ACNE' ? 'lg:w-[calc(306*var(--u))]' : c.id === 'WRINKLE' ? 'lg:w-[calc(320*var(--u))]' : c.id === 'PIGMENTATION' ? 'lg:w-[calc(412*var(--u))]' : 'px-6 lg:px-[calc(30*var(--u))]'),
          beforeImage: c.beforeImage || data?.beforeImage || matchDefault?.beforeImage || '/assets/before_after/face-before.jpg',
          afterImage: c.afterImage || data?.afterImage || matchDefault?.afterImage || '/assets/before_after/face-after.jpg',
          subtitle: c.subtitle || '',
        };
      });
    }
    return DEFAULT_CATEGORIES;
  }, [data]);

  const [activeTab, setActiveTab] = useState('ACNE');
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100

  // Selected treatment category
  const currentCategory =
    activeCategories.find((c) => c.id === activeTab) ||
    activeCategories[0] ||
    {};

  const eyebrow = data?.eyebrow || 'REAL SESSIONS';
  const heading = data?.heading || (isReview ? 'REAL SESSIONS' : 'BEFORE & AFTER');
  const subtitle =
    currentCategory.subtitle ||
    data?.subtitle ||
    'Discover How the Lumnae Mask Transformed Skincare Routines and Solved Diverse Skin Concerns';
  const beforeImage = currentCategory.beforeImage || data?.beforeImage || '/assets/before_after/face-before.jpg';
  const afterImage = currentCategory.afterImage || data?.afterImage || '/assets/before_after/face-after.jpg';

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <section
      id={isReview ? 'real-sessions' : 'reviews'}
      style={{ '--u': 'calc(100vw / 3840)' }}
      className={`relative w-full bg-[#FFFFFF] text-[#000000] overflow-hidden font-['Manrope'] ${
        isReview
          ? 'pt-10 sm:pt-14 md:pt-18 lg:pt-[calc(100*var(--u))] pb-12 sm:pb-16 md:pb-20 lg:pb-[calc(172*var(--u))]'
          : 'py-16 lg:pt-[calc(167*var(--u))] lg:pb-[calc(167*var(--u))] border-b border-[#E5E5E5]'
      }`}
    >
      <div className="w-full max-w-[1400px] lg:max-w-none mx-auto px-6 lg:px-0">
        {/* Section Header */}
        {isReview ? (
          /* Review Page Header (PSD 'REAL SESSIONS': y=4593..4907, Title 80px + Red Pill Bar 150x20px + Subtitle 30px) */
          <div className="text-center mx-auto flex flex-col items-center justify-center">
            {/* Title: REAL SESSIONS (PSD: Manrope-ExtraLight 80px at 3840w, tracking 20 / 0.02em, color #131313) */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] leading-none text-[#131313]">
              {heading}
            </h2>

            {/* Red Pill Accent Bar (Rectangle 15 copy 2: 150x20px, rounded-full, fill #ED2124, 47px below title) */}
            <div
              className="mt-3 sm:mt-4 lg:mt-[calc(47*var(--u))] w-[60px] sm:w-[85px] lg:w-[calc(150*var(--u))] h-[8px] sm:h-[12px] lg:h-[calc(20*var(--u))] rounded-full bg-[#ED2124]"
              aria-hidden="true"
            />

            {/* Subtitle: Manrope-Regular (400), 30px at 3840w, tracking 20 / 0.02em, #000000, 163px below red bar */}
            <p className="text-[#000000] text-xs sm:text-sm lg:text-[calc(30*var(--u))] leading-relaxed lg:leading-none font-normal tracking-[0.02em] mt-5 sm:mt-7 lg:mt-[calc(163*var(--u))] max-w-[90%] sm:max-w-none">
              {subtitle}
            </p>
          </div>
        ) : (
          /* Home Page Header (PSD Group 27: y=12976..13209) */
          <div className="text-center mx-auto">
            {/* 'REAL SESSIONS': Manrope-Medium (500), 40px at 3840w, tracking 20 (0.02em), #000000 */}
            <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] uppercase tracking-[0.02em] font-medium text-[#000000] leading-none">
              {eyebrow}
            </p>

            {/* 'BEFORE & AFTER': Manrope-ExtraLight (200), 80px at 3840w, tracking 20 (0.02em), #000000, gap 47px */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight tracking-[0.02em] uppercase leading-none text-[#000000] mt-3 lg:mt-[calc(47*var(--u))]">
              {heading}
            </h2>

            {/* Subtitle: Manrope-Regular (400), 30px at 3840w, tracking 20 (0.02em), #000000, gap 71px */}
            <p className="text-[#000000] text-xs sm:text-sm lg:text-[calc(30*var(--u))] leading-relaxed lg:leading-none font-normal tracking-[0.02em] mt-4 lg:mt-[calc(71*var(--u))]">
              {subtitle}
            </p>
          </div>
        )}

        {/* Category Pills (PSD Navigation: Rectangle 57 x=1393..2447, w=1054, y=13288..13408, h=120, gap 79px) */}
        <div className="flex items-center justify-center mt-7 lg:mt-[calc(79*var(--u))] select-none">
          <div className="inline-flex items-center justify-between bg-[#FFFFFF] p-1 lg:p-[calc(5*var(--u))] lg:w-[calc(1054*var(--u))] lg:h-[calc(120*var(--u))] rounded-full border lg:border-[calc(2*var(--u))] border-[#000000]">
            {activeCategories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(cat.id);
                    setSliderPos(50);
                  }}
                  className={`px-5 sm:px-7 lg:px-0 py-2 sm:py-2.5 lg:py-0 lg:h-[calc(110*var(--u))] ${cat.widthClass} rounded-full inline-flex items-center justify-center text-xs sm:text-sm lg:text-[calc(40*var(--u))] font-extrabold tracking-[0.02em] uppercase leading-none transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#ED2024] text-[#FFFFFF]'
                      : 'bg-transparent text-[#0A0A0B] hover:text-[#ED2024]'
                  }`}
                >
                  {cat.label || cat.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Before & After Comparison Frame (PSD Rectangle 36: w=1018, h=1062, r=70px) */}
        <div
          className={`max-w-[460px] lg:max-w-none lg:w-[calc(1018*var(--u))] lg:h-[calc(1062*var(--u))] relative rounded-[28px] lg:rounded-[calc(70*var(--u))] overflow-hidden select-none ${
            isReview
              ? 'mx-auto mt-8 lg:mt-[calc(82*var(--u))]'
              : 'mx-auto mt-8 lg:mt-[calc(90*var(--u))] lg:ml-[calc(1378*var(--u))]'
          }`}
        >
          <div
            className="relative w-full aspect-[1018/1062] lg:w-full lg:h-full cursor-ew-resize overflow-hidden"
            onMouseMove={handleSliderMove}
            onTouchMove={handleTouchMove}
          >
            {/* Base Layer: AFTER Image */}
            <img
              src={afterImage}
              alt="After Lumnae Mask treatment"
              className="w-full h-full object-cover block pointer-events-none"
              draggable={false}
            />

            {/* Clipped Overlay Layer: BEFORE Image */}
            <img
              src={beforeImage}
              alt="Before Lumnae Mask treatment"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              className="absolute inset-0 w-full h-full object-cover block pointer-events-none"
              draggable={false}
            />

            {/*BEFORE / AFTER Top Labels matching PSD Manrope-Bold 55.12px at 3840w, #FFFFFF */}
            <span className="absolute top-5 left-5 lg:top-[calc(87*var(--u))] lg:left-[calc(63*var(--u))] text-[#FFFFFF] font-['Manrope'] font-bold text-base sm:text-lg lg:text-[calc(55.12*var(--u))] uppercase tracking-[0.02em] leading-none pointer-events-none z-10">
              BEFORE
            </span>
            <span className="absolute top-5 right-10 lg:top-[calc(89*var(--u))] lg:right-auto lg:left-[calc(576*var(--u))] text-[#FFFFFF] font-['Manrope'] font-bold text-base sm:text-lg lg:text-[calc(55.12*var(--u))] uppercase tracking-[0.02em] leading-none pointer-events-none z-10">
              AFTER
            </span>

            {/* Central Red Swap Handle matching PSD Ellipse 2 (67.5x67.5px, #D61611) + exchange_154640 (34x34px) */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 lg:w-[calc(67.5*var(--u))] lg:h-[calc(67.5*var(--u))] rounded-full bg-[#D61611] flex items-center justify-center">
                <img
                  src="/assets/before_after/exchange-icon.png"
                  alt=""
                  className="w-4 h-4 lg:w-[calc(34*var(--u))] lg:h-[calc(34*var(--u))] object-contain block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
