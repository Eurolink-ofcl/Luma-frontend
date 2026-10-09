import React, { useState } from 'react';

const categories = ['ACNE', 'WRINKLE', 'PIGMENTATION'];

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
      className="relative w-full bg-white text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope']"
    >
      <div className="max-w-[1200px] 2xl:max-w-[1600px] 3xl:max-w-[1850px] 4xl:max-w-[2150px] mx-auto px-6 lg:px-8 2xl:px-12 4xl:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl mx-auto mb-12 2xl:mb-16">
          <p className="text-xs sm:text-sm 2xl:text-[15.2px] 4xl:text-[22.8px] uppercase tracking-[0.2em] font-medium mb-3">
            <span className="text-[#131313]">Real </span>
            <span className="text-[#EC2024]">Sessions</span>
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] 2xl:text-[30.4px] 4xl:text-[45.5px] font-extralight tracking-tight uppercase leading-tight text-[#131313]">
            BEFORE &amp; AFTER
          </h2>
          <p className="text-[#555555] text-sm sm:text-base 2xl:text-[20px] 4xl:text-[30px] leading-relaxed font-normal mt-3">
            Discover How the LUMA Mask Transformed Skincare Routines and Rejuvenated Complexions.
          </p>
        </div>

        {/* Category Pills (PSD Rectangle 57 Segmented Pill Container with Rectangle 57 copy 2 red pill) */}
        <div className="flex items-center justify-center mb-10 2xl:mb-14 select-none">
          <div className="inline-flex items-center bg-[#F0F0F0] p-1.5 2xl:p-2 rounded-full border border-gray-200 shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`px-6 sm:px-8 2xl:px-10 4xl:px-12 py-2 sm:py-2.5 2xl:py-3.5 4xl:py-4 rounded-full text-xs sm:text-sm 2xl:text-[15.2px] 4xl:text-[22.8px] font-extrabold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === cat
                    ? 'bg-[#EC2024] text-white shadow-md'
                    : 'text-[#555555] hover:text-[#131313] bg-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Before & After Comparison Frame */}
        <div className="max-w-[920px] 2xl:max-w-[1200px] 4xl:max-w-[1450px] mx-auto relative rounded-[20px] 2xl:rounded-[28px] 4xl:rounded-[36px] overflow-hidden shadow-2xl border border-gray-200 select-none bg-black">
          <div
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] cursor-ew-resize overflow-hidden"
            onMouseMove={handleSliderMove}
            onTouchMove={handleTouchMove}
          >
            {/* Image (Full Display) */}
            <img
              src="/assets/before_after/before-after-face.jpg"
              alt="Before and After Clinical Skin Therapy"
              className="w-full h-full object-cover block"
            />

            {/* Split Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-[3px] bg-white pointer-events-none shadow-[0_0_12px_rgba(0,0,0,0.8)] z-20"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Central Swap Handle matching exchange_154640.png */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-xl flex items-center justify-center font-bold text-xs border-2 border-black/10">
                <span className="text-[14px] leading-none">&harr;</span>
              </div>
            </div>

            {/* Before / After Floating Badges matching PSD Manrope-Bold */}
            <span className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white font-['Manrope'] font-bold text-xs sm:text-sm 2xl:text-[29.6px] 4xl:text-[59.3px] uppercase tracking-wide border border-white/20 z-10 leading-none">
              BEFORE
            </span>
            <span className="absolute bottom-6 right-6 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white font-['Manrope'] font-bold text-xs sm:text-sm 2xl:text-[29.6px] 4xl:text-[59.3px] uppercase tracking-wide border border-white/20 z-10 leading-none">
              AFTER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
