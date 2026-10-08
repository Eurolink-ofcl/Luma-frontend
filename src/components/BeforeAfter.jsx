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
      className="relative w-full bg-[#FAFAFA] text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope'] border-t border-gray-100"
    >
      <div className="max-w-[1200px] 2xl:max-w-[1600px] 3xl:max-w-[1850px] 4xl:max-w-[2150px] mx-auto px-6 lg:px-8 2xl:px-12 4xl:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl mx-auto mb-12 2xl:mb-16">
          <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-[0.24em] font-semibold mb-3">
            <span className="text-[#131313]">Real </span>
            <span className="text-[#EC2024]">Sessions</span>
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] 2xl:text-[54px] 4xl:text-[64px] font-bold tracking-tight uppercase leading-tight text-[#131313]">
            BEFORE &amp; AFTER
          </h2>
          <div className="w-16 2xl:w-20 4xl:w-24 h-1 2xl:h-1.5 bg-[#EC2024] mx-auto mt-4 mb-4" />
          <p className="text-[#555555] text-sm sm:text-base 2xl:text-lg 4xl:text-xl leading-relaxed font-normal">
            Discover How the LUMA Mask Transformed Skincare Routines and Rejuvenated Complexions.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-3 2xl:gap-4 mb-10 2xl:mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`px-6 2xl:px-8 4xl:px-10 py-2.5 2xl:py-3.5 4xl:py-4 rounded-full text-xs sm:text-sm 2xl:text-base 4xl:text-lg font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === cat
                  ? 'bg-[#131313] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
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

            {/* Before / After Floating Badges */}
            <span className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs uppercase tracking-widest border border-white/20 z-10">
              BEFORE
            </span>
            <span className="absolute bottom-6 right-6 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs uppercase tracking-widest border border-white/20 z-10">
              AFTER (4 WEEKS)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
