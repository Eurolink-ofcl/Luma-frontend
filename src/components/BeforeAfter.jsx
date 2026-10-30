import React, { useState } from 'react';

const categories = [
  { id: 'ACNE', widthClass: 'lg:w-[calc(306*var(--u))]' },
  { id: 'WRINKLE', widthClass: 'lg:w-[calc(320*var(--u))]' },
  { id: 'PIGMENTATION', widthClass: 'lg:w-[calc(412*var(--u))]' },
];

export default function BeforeAfter() {
  const [activeTab, setActiveTab] = useState('ACNE');
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100

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
      id="reviews"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] py-16 lg:pt-[calc(167*var(--u))] lg:pb-[calc(167*var(--u))] border-b border-[#E5E5E5] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1400px] lg:max-w-none mx-auto px-6 lg:px-0">
        {/* Section Header (PSD Group 27: y=12976..13209 on 3840w canvas) */}
        <div className="text-center mx-auto">
          {/* 'REAL SESSIONS': Manrope-Medium (500), 40px at 3840w, tracking 20 (0.02em), #000000 */}
          <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] uppercase tracking-[0.02em] font-medium text-[#000000] leading-none">
            REAL SESSIONS
          </p>

          {/* 'BEFORE & AFTER': Manrope-ExtraLight (200), 80px at 3840w, tracking 20 (0.02em), #000000, gap 47px */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight tracking-[0.02em] uppercase leading-none text-[#000000] mt-3 lg:mt-[calc(47*var(--u))]">
            BEFORE &amp; AFTER
          </h2>

          {/* Subtitle: Manrope-Regular (400), 30px at 3840w, tracking 20 (0.02em), #000000, gap 71px */}
          <p className="text-[#000000] text-xs sm:text-sm lg:text-[calc(30*var(--u))] leading-relaxed lg:leading-none font-normal tracking-[0.02em] mt-4 lg:mt-[calc(71*var(--u))]">
            Discover How the Lumnae Mask Transformed Skincare Routines and Solved Diverse Skin Concerns
          </p>
        </div>

        {/* Category Pills (PSD Navigation: Rectangle 57 x=1393..2447, w=1054, y=13288..13408, h=120, gap 79px) */}
        <div className="flex items-center justify-center mt-7 lg:mt-[calc(79*var(--u))] select-none">
          <div className="inline-flex items-center justify-between bg-[#FFFFFF] p-1 lg:p-[calc(5*var(--u))] lg:w-[calc(1054*var(--u))] lg:h-[calc(120*var(--u))] rounded-full border lg:border-[calc(2*var(--u))] border-[#000000]">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-5 sm:px-7 lg:px-0 py-2 sm:py-2.5 lg:py-0 lg:h-[calc(110*var(--u))] ${cat.widthClass} rounded-full inline-flex items-center justify-center text-xs sm:text-sm lg:text-[calc(40*var(--u))] font-extrabold tracking-[0.02em] uppercase leading-none transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#ED2024] text-[#FFFFFF]'
                      : 'bg-transparent text-[#0A0A0B] hover:text-[#ED2024]'
                  }`}
                >
                  {cat.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Before & After Comparison Frame (PSD Rectangle 36: x=1378..2396, w=1018, y=13498..14560, h=1062, r=70px, gap 90px) */}
        <div className="max-w-[460px] lg:max-w-none lg:w-[calc(1018*var(--u))] lg:h-[calc(1062*var(--u))] mx-auto mt-8 lg:mt-[calc(90*var(--u))] lg:ml-[calc(1378*var(--u))] relative rounded-[28px] lg:rounded-[calc(70*var(--u))] overflow-hidden select-none">
          <div
            className="relative w-full aspect-[1018/1062] lg:w-full lg:h-full cursor-ew-resize overflow-hidden"
            onMouseMove={handleSliderMove}
            onTouchMove={handleTouchMove}
          >
            {/* Base Layer: AFTER Image */}
            <img
              src="/assets/before_after/face-after.jpg"
              alt="After Lumnae Mask treatment"
              className="w-full h-full object-cover block pointer-events-none"
              draggable={false}
            />

            {/* Clipped Overlay Layer: BEFORE Image */}
            <img
              src="/assets/before_after/face-before.jpg"
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
