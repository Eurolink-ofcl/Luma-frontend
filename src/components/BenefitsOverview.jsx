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
      className="relative w-full bg-[#FBFBFB] text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope']"
    >
      <div className="benefits-container max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-6 lg:px-12 2xl:px-16 4xl:px-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl mx-auto mb-16 md:mb-20 2xl:mb-24">
          <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-[0.24em] font-medium mb-3">
            <span className="text-[#131313]">WHY </span>
            <span className="text-[#EC2024]">LUMA</span>
          </p>
          <h2 className="text-[#131313] font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-[44px] 2xl:text-[54px] 4xl:text-[64px] tracking-tight uppercase leading-tight mt-2">
            BENEFITS OVERVIEW
          </h2>
          <div className="w-16 2xl:w-20 4xl:w-24 h-1 2xl:h-1.5 bg-[#EC2024] mx-auto mt-4 mb-4" />
          <p className="text-[#555555] text-sm sm:text-base 2xl:text-lg 4xl:text-xl leading-relaxed mt-3">
            Evidence-based protocols calibrated for specific wellness outcomes.
          </p>
        </div>

        {/* Benefits Grid (Row 1 & 2: 3 cols, Row 3: 2 centered cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 2xl:gap-14 4xl:gap-16">
          {benefits.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-[16px] 2xl:rounded-[22px] 4xl:rounded-[28px] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-1.5"
            >
              {/* Image Container with Aspect Ratio */}
              <div className="w-full h-56 sm:h-64 2xl:h-80 4xl:h-96 overflow-hidden bg-gray-100 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 2xl:p-9 4xl:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3 2xl:mb-4">
                    <h3 className="text-lg sm:text-xl 2xl:text-2xl 4xl:text-3xl font-semibold text-[#131313] leading-snug group-hover:text-[#EC2024] transition-colors">
                      {item.title}
                    </h3>
                    {/* Duration Badge */}
                    <span className="inline-flex items-center px-2.5 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full text-xs 2xl:text-sm font-mono font-medium bg-red-50 text-[#EC2024] shrink-0 border border-red-100">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-[#666666] text-xs sm:text-[13.5px] 2xl:text-[15px] 4xl:text-[17px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 3 (Bottom 2 Centered Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 2xl:gap-14 4xl:gap-16 max-w-[920px] 2xl:max-w-[1180px] 4xl:max-w-[1450px] mx-auto mt-8 lg:mt-10 2xl:mt-14">
          {benefits.slice(6, 8).map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-[16px] 2xl:rounded-[22px] 4xl:rounded-[28px] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-1.5"
            >
              <div className="w-full h-56 sm:h-64 2xl:h-80 4xl:h-96 overflow-hidden bg-gray-100 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-7 2xl:p-9 4xl:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3 2xl:mb-4">
                    <h3 className="text-lg sm:text-xl 2xl:text-2xl 4xl:text-3xl font-semibold text-[#131313] leading-snug group-hover:text-[#EC2024] transition-colors">
                      {item.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full text-xs 2xl:text-sm font-mono font-medium bg-red-50 text-[#EC2024] shrink-0 border border-red-100">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-[#666666] text-xs sm:text-[13.5px] 2xl:text-[15px] 4xl:text-[17px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
