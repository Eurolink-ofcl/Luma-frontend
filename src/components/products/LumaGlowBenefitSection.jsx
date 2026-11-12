import React from 'react';

const BENEFIT_CARDS = [
  {
    id: 1,
    eyebrow: '4 WAVELENGTHS',
    imageWebp: '/assets/glow/benefit-1-wavelengths.webp',
    imageJpg: '/assets/glow/benefit-1-wavelengths.jpg',
    titleLine1: 'BLUE, RED & NEAR-INFRARED,',
    titleLine2: 'FOR YOUR SKIN',
    description:
      'LUMA GLOW combines four wavelengths (460nm, 665nm, 850nm and 1064nm) across 236 chips, including 20 deep near-infrared chips. Delivers 46 mW/cm² of irradiance.',
  },
  {
    id: 2,
    eyebrow: 'WIRELESS',
    imageWebp: '/assets/glow/benefit-2-wireless.webp',
    imageJpg: '/assets/glow/benefit-2-wireless.jpg',
    titleLine1: 'LIGHT TO WEAR,',
    titleLine2: 'EASY TO CHARGE',
    description:
      'At just 340 g and 5.8 mm thin, the mask sits comfortably on the face. The 1440 mAh battery gives about 35 minutes per charge & recharges by USB-C in 3 hours.',
  },
  {
    id: 3,
    eyebrow: '2 MODES',
    imageWebp: '/assets/glow/benefit-3-modes.webp',
    imageJpg: '/assets/glow/benefit-3-modes.jpg',
    titleLine1: 'YOUR SESSION,',
    titleLine2: 'YOUR SETTINGS',
    description:
      'Choose M1 Glow Boost (Red + Near-Infrared) or M2 Clear Skin (Blue + Near-Infrared). Pick low, medium or high brightness and a timer that suits your routine. Backed by a 1-year warranty.',
  },
];

export default function LumaGlowBenefitSection() {
  return (
    <section
      id="luma-glow-benefits"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#FFFFFF] text-[#000000] font-['Manrope'] select-none pt-12 sm:pt-16 lg:pt-20 2xl:pt-[calc(136*var(--u))] pb-16 sm:pb-20 lg:pb-24 2xl:pb-[calc(145*var(--u))]"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-[calc(522*var(--u))]">
        {/* 3-Column Responsive Grid matching PSD 3 BENEFIT SECTION (x=522..3319, w=744 each, gap=282) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-6 lg:gap-8 xl:gap-12 2xl:gap-[calc(282*var(--u))] items-start">
          {BENEFIT_CARDS.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center text-center w-full"
            >
              {/* Eyebrow: Manrope-SemiBold, 30px at 3840w, tracking 20 (0.02em), #0A0A0B, 22px above image */}
              <p className="text-[12px] sm:text-[13px] md:text-[13.5px] xl:text-[14px] 2xl:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#0A0A0B] leading-none mb-3 sm:mb-4 lg:mb-5 2xl:mb-[calc(22*var(--u))]">
                {card.eyebrow}
              </p>

              {/* Sliced Image Frame: 744x395 at 3840w, radius 50px (Rectangle 71) */}
              <div className="w-full max-w-[420px] md:max-w-none aspect-[744/395] rounded-[18px] sm:rounded-[24px] lg:rounded-[28px] 2xl:rounded-[calc(50*var(--u))] overflow-hidden bg-[#F5F5F5] shadow-sm">
                <picture>
                  <source srcSet={card.imageWebp} type="image/webp" />
                  <img
                    src={card.imageJpg}
                    alt={`${card.titleLine1} ${card.titleLine2}`}
                    className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-500 hover:scale-105"
                    draggable={false}
                  />
                </picture>
              </div>

              {/* Card Title: Exactly 2 lines matching PSD, unbroken whitespace-nowrap (Manrope-ExtraBold 800, 50px at 3840w) */}
              <h3 className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 2xl:mt-[calc(42*var(--u))] text-[16px] sm:text-[18px] md:text-[15.5px] lg:text-[18.5px] xl:text-[21.5px] 2xl:text-[calc(50*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#0A0A0B] leading-[1.18]">
                <span className="block whitespace-nowrap">{card.titleLine1}</span>
                <span className="block whitespace-nowrap">{card.titleLine2}</span>
              </h3>

              {/* Card Description: Manrope-Regular (400), 30px at 3840w, leading 48px (1.6), tracking 20 (0.02em), #7A7A7A, 38px below title */}
              <p className="mt-3 sm:mt-4 md:mt-4.5 lg:mt-5 2xl:mt-[calc(38*var(--u))] text-[13px] sm:text-[14px] md:text-[12px] lg:text-[13px] xl:text-[14.5px] 2xl:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#7A7A7A] leading-[1.6] max-w-[420px] md:max-w-none">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
