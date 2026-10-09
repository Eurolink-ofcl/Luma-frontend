import React from 'react';

const benefits = [
  {
    id: 'cellular',
    title: 'Cellular Regeneration',
    duration: '15 Min',
    description: 'Red & near-infrared light to support cellular energy & natural renewal from within.',
    image: '/assets/benefits/cellular.jpg',
  },
  {
    id: 'wellness',
    title: 'General Wellness',
    duration: '15 Min',
    description: 'A calming full-body session to help you unwind, restore balance, and feel recharged.',
    image: '/assets/benefits/wellness.jpg',
  },
  {
    id: 'clearskin',
    title: 'Clear Skin',
    duration: '10 Min',
    description: 'Targeted light to support a clearer, smoother, more even-looking complexion.',
    image: '/assets/benefits/clearskin.jpg',
  },
  {
    id: 'fatloss',
    title: 'Fat Loss',
    duration: '15 Min',
    description: 'Designed to complement your training & nutrition as you work toward your body goals.',
    image: '/assets/benefits/fatloss.jpg',
  },
  {
    id: 'recovery',
    title: 'Muscle Recovery',
    duration: '15 Min',
    description: 'Eases post-workout soreness & supports faster recovery.',
    image: '/assets/benefits/recovery.jpg',
  },
  {
    id: 'scalp',
    title: 'Scalp Health',
    duration: '10 Min',
    description: 'Gentle light to nurture the scalp and support healthier-looking, fuller hair.',
    image: '/assets/benefits/scalp.jpg',
  },
  {
    id: 'scar',
    title: 'Scar Healing',
    duration: '15 Min',
    description: 'Supports skin repair for smoother more even-looking scars.',
    image: '/assets/benefits/scar.jpg',
  },
  {
    id: 'brain',
    title: 'Brain Health',
    duration: '15 Min',
    description: 'Supports mental clarity, focus, & everyday cognitive wellness.',
    image: '/assets/benefits/brain.jpg',
  },
];

export default function BenefitsOverview() {
  return (
    <section
      id="benefits"
      className="relative w-full bg-white text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope']"
    >
      <div className="benefits-container max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-6 lg:px-12 2xl:px-16 4xl:px-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl mx-auto mb-16 md:mb-20 2xl:mb-24">
          <p className="text-xs sm:text-sm 2xl:text-[15.2px] 4xl:text-[22.8px] uppercase tracking-[0.2em] font-medium mb-3">
            <span className="text-[#131313]">WHY </span>
            <span className="text-[#EC2024]">LUMA</span>
          </p>
          <h2 className="text-[#131313] font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-[40px] 2xl:text-[30.4px] 4xl:text-[45.5px] tracking-tight uppercase leading-tight mt-2">
            BENEFITS OVERVIEW
          </h2>
          <p className="text-[#444444] text-sm sm:text-base 2xl:text-[20px] 4xl:text-[30px] leading-relaxed mt-4 font-normal">
            Evidence-based protocols calibrated for specific wellness outcomes.
          </p>
        </div>

        {/* Benefits Grid (Row 1 & 2: 3 cols, Row 3: 2 centered cols) - Unboxed cards matching PSD Group 18 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 2xl:gap-14 4xl:gap-16">
          {benefits.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="group flex flex-col transition-all duration-300 select-none"
            >
              {/* Image Container matching PSD Rectangle 51 (800x500 aspect ratio) */}
              <div className="w-full aspect-[8/5] overflow-hidden rounded-[18px] 2xl:rounded-[24px] 4xl:rounded-[30px] bg-[#EAEAEA] relative shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Meta Content directly on section background (Unboxed per PSD Group 18) */}
              <div className="pt-5 2xl:pt-6 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2 2xl:mb-3">
                  <h3 className="text-lg sm:text-xl 2xl:text-[21.6px] 4xl:text-[32.4px] font-semibold text-[#131313] leading-snug">
                    {item.title}
                  </h3>
                  {/* Duration Circular Badge matching PSD Ellipse 5 (Red outline, stacked text) */}
                  <div className="w-11 h-11 2xl:w-13 2xl:h-13 4xl:w-15 4xl:h-15 rounded-full border-2 border-[#EC2024] bg-white flex flex-col items-center justify-center shrink-0 shadow-xs select-none">
                    <span className="text-sm 2xl:text-[16px] 4xl:text-[24px] font-medium text-[#131313] leading-none">
                      {item.duration.replace(/[^0-9]/g, '')}
                    </span>
                    <span className="text-[10px] 2xl:text-[11px] 4xl:text-xs font-medium text-[#555555] leading-none mt-0.5">
                      Min
                    </span>
                  </div>
                </div>
                <p className="text-[#555555] text-xs sm:text-[14px] 2xl:text-[20px] 4xl:text-[30px] font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 3 (Bottom 2 Centered Cards) - Unboxed matching PSD Group 18 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 2xl:gap-14 4xl:gap-16 max-w-[920px] 2xl:max-w-[1180px] 4xl:max-w-[1450px] mx-auto mt-10 lg:mt-12 2xl:mt-16">
          {benefits.slice(6, 8).map((item) => (
            <div
              key={item.id}
              className="group flex flex-col transition-all duration-300 select-none"
            >
              {/* Image Container matching PSD Rectangle 51 */}
              <div className="w-full aspect-[8/5] overflow-hidden rounded-[18px] 2xl:rounded-[24px] 4xl:rounded-[30px] bg-[#EAEAEA] relative shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Meta Content directly on section background */}
              <div className="pt-5 2xl:pt-6 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2 2xl:mb-3">
                  <h3 className="text-lg sm:text-xl 2xl:text-[21.6px] 4xl:text-[32.4px] font-semibold text-[#131313] leading-snug">
                    {item.title}
                  </h3>
                  {/* Duration Circular Badge matching PSD Ellipse 5 */}
                  <div className="w-11 h-11 2xl:w-13 2xl:h-13 4xl:w-15 4xl:h-15 rounded-full border-2 border-[#EC2024] bg-white flex flex-col items-center justify-center shrink-0 shadow-xs select-none">
                    <span className="text-sm 2xl:text-[16px] 4xl:text-[24px] font-medium text-[#131313] leading-none">
                      {item.duration.replace(/[^0-9]/g, '')}
                    </span>
                    <span className="text-[10px] 2xl:text-[11px] 4xl:text-xs font-medium text-[#555555] leading-none mt-0.5">
                      Min
                    </span>
                  </div>
                </div>
                <p className="text-[#555555] text-xs sm:text-[14px] 2xl:text-[20px] 4xl:text-[30px] font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
