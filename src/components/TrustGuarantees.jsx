import React from 'react';

const guarantees = [
  {
    icon: '/assets/guarantees/truck.png',
    iconW: 141,
    iconH: 77,
    colW: 522,
    title: 'FREE SHIPPING',
    description: (
      <>
        Premium delivery at no extra cost,
        <br />
        with fast 1-4 day shipping worldwide.
      </>
    ),
  },
  {
    icon: '/assets/guarantees/trial.png',
    iconW: 86,
    iconH: 80,
    colW: 567,
    title: '90 DAY TRIAL',
    description: (
      <>
        Experience real results or get
        <br />
        <span className="font-bold text-[#555555]">100% of your money back</span>, guaranteed.
      </>
    ),
  },
  {
    icon: '/assets/guarantees/warranty.png',
    iconW: 75,
    iconH: 81,
    colW: 421,
    title: '3 YEAR WARRANTY',
    description: (
      <>
        Three full years of protection,
        <br />
        unbeaten by any competitor.
      </>
    ),
  },
  {
    icon: '/assets/guarantees/rating.png',
    iconW: 79,
    iconH: 80,
    colW: 514,
    title: 'RATED 4.8/5',
    description: (
      <>
        Join thousands of satisfied users
        <br />
        with our &lsquo;Excellent&rsquo; Trustpilot rating.
      </>
    ),
  },
];

export default function TrustGuarantees() {
  return (
    <section
      id="guarantees"
      style={{
        '--u': 'calc(100vw / 3840)',
        '--m': 'calc(var(--u) * 2.2)',
      }}
      className="relative w-full bg-[#0A0A0B] text-[#FFFFFF] py-14 sm:py-16 lg:pt-[calc(119*var(--u))] lg:pb-[calc(155*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:pl-[calc(518*var(--u))] lg:pr-[calc(513*var(--u))]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-start lg:justify-between gap-10 sm:gap-12 lg:gap-0 text-center">
          {guarantees.map((item, idx) => (
            <div
              key={idx}
              style={{
                '--col-w': `${item.colW}`,
                '--icon-w': `${item.iconW}`,
                '--icon-h': `${item.iconH}`,
              }}
              className="flex flex-col items-center lg:w-[calc(var(--col-w)*var(--u))] shrink-0"
            >
              {/* PSD Red Icon container: aligned to 81px height at 3840w (y = 19384..19465) */}
              <div className="h-[42px] sm:h-[48px] lg:h-[calc(81*var(--u))] flex items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-auto h-full lg:w-[calc(var(--icon-w)*var(--u))] lg:h-[calc(var(--icon-h)*var(--u))] object-contain block select-none"
                  draggable={false}
                />
              </div>

              {/* Title: 40px at 3840w, Manrope-Bold (700), tracking 20 (0.02em), uppercase, #FFFFFF (y = 19501..19532, 36px below icon box) */}
              <h3 className="mt-4 sm:mt-5 lg:mt-[calc(36*var(--u))] text-[16px] sm:text-[18px] lg:text-[calc(40*var(--u))] font-bold uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
                {item.title}
              </h3>

              {/* Description: 30px at 3840w, Manrope-Regular (400), leading 48px (1.6), tracking 20 (0.02em), #555555 (y = 19569..19647) */}
              <p className="mt-2.5 sm:mt-3 lg:mt-[calc(30*var(--u))] text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#555555] leading-[1.6] lg:leading-[calc(48*var(--u))]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
