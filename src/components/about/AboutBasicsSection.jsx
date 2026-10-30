import React from 'react';

export default function AboutBasicsSection() {
  return (
    <section
      id="about-basics"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pb-14 sm:pb-16 lg:pb-[calc(166*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* Centered Header (PSD y = 2263..2421) */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: "THE BASICS" — 50px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #ED2024 */}
          <p className="text-[16px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            THE BASICS
          </p>

          {/* Main Heading: "WHAT IS RED LIGHT THERAPY?" — 100px at 3840w, Manrope-ExtraLight (200), tracking 20 (0.02em), uppercase, #000000 */}
          <h2 className="mt-2.5 sm:mt-3.5 lg:mt-[calc(44*var(--u))] text-[26px] sm:text-[36px] md:text-[44px] lg:text-[calc(100*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#000000] leading-none">
            WHAT IS RED LIGHT THERAPY?
          </h2>
        </div>

        {/* Wide Video Banner (PSD Rectangle 48: x = 522..3322 (2800px), y = 2501..3256 (755px), r = 50px, 80px below heading) */}
        <div className="mt-7 sm:mt-9 lg:mt-[calc(80*var(--u))] lg:pl-[calc(522*var(--u))] lg:pr-[calc(518*var(--u))]">
          <div className="group relative w-full lg:w-[calc(2800*var(--u))] aspect-[2800/755] min-h-[200px] sm:min-h-[260px] lg:min-h-0 lg:h-[calc(755*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] overflow-hidden bg-[#010101] cursor-pointer select-none">
            <img
              src="/assets/about/dubai-rlt-banner.jpg"
              alt="Red light therapy overlooking Dubai"
              className="w-full h-full object-cover object-center block"
              draggable={false}
            />

            {/* Center Play Button Arrowhead (PSD x = 1873..1971 (98px), y = 2825..2933 (108px), opacity = 158/255 = 0.62) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src="/assets/about/play-arrow.png"
                alt="Play Video"
                className="w-[34px] h-[38px] sm:w-[44px] sm:h-[48px] lg:w-[calc(98*var(--u))] lg:h-[calc(108*var(--u))] object-contain opacity-[0.62] group-hover:opacity-90 group-hover:scale-105 transition-all duration-200"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: Left Copy + 3 Red Stat Cards (PSD y = 3336..3644, 80px below banner) */}
        <div className="mt-8 sm:mt-10 lg:mt-[calc(80*var(--u))] lg:pl-[calc(522*var(--u))] lg:pr-[calc(518*var(--u))] flex flex-col lg:flex-row items-start justify-between gap-8 sm:gap-10 lg:gap-0">
          {/* Left Column: Explanation Copy (PSD x = 522..1986, y = 3364..3642, 30px Manrope-Regular, leading 50px, tracking 20 (0.02em), #555555) */}
          <div className="w-full lg:w-[calc(1510*var(--u))] lg:pt-[calc(18*var(--u))] text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#555555] leading-[1.65] lg:leading-[calc(50*var(--u))]">
            <p className="m-0">
              Red light therapy (RLT) uses specific wavelengths of red and near-infrared light to pass gently through
              skin and reach the cells beneath it. Unlike UV light, it carries no burning risk &mdash; it simply delivers energy
              your cells already know how to use.
            </p>
            <p className="m-0">
              Hospitals and physiotherapy clinics have used the same wavelengths for over two decades. LUMA
              brings that clinical-grade output into a device built for daily use at home, with no appointments and
              no downtime.
            </p>
          </div>

          {/* Right Column: 3 Red Stat Cards (PSD x = 2142..3322, 308 x 308 each, gap = 128px, r = 20px, gradient #ED2024 -> #9D0508) */}
          <div className="w-full lg:w-auto grid grid-cols-3 gap-3 sm:gap-5 lg:flex lg:flex-row lg:items-center lg:gap-[calc(128*var(--u))] shrink-0 select-none">
            {/* Card 1: 2 WAVE LENGTH USED (PSD Group 37: x = 2142..2450, y = 3336..3644) */}
            <div className="w-full aspect-square lg:w-[calc(308*var(--u))] lg:h-[calc(308*var(--u))] rounded-[12px] sm:rounded-[16px] lg:rounded-[calc(20*var(--u))] bg-[linear-gradient(180deg,#ED2024_0%,#9D0508_100%)] flex flex-col items-center justify-center lg:justify-start lg:pt-[calc(62*var(--u))] text-center text-[#FFFFFF] px-2 lg:px-0">
              <span className="text-[32px] sm:text-[42px] lg:text-[calc(100*var(--u))] font-extrabold tracking-[0.02em] leading-none">
                2
              </span>
              <span className="mt-1.5 sm:mt-2 lg:mt-[calc(22*var(--u))] text-[10px] sm:text-[12px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] leading-[1.33] lg:leading-[calc(40*var(--u))]">
                WAVE LENGTH
                <br />
                USED
              </span>
            </div>

            {/* Card 2: 20+ YRS CLINICAL RESEARCH (PSD Group 37 copy 2: x = 2578..2886, y = 3336..3644) */}
            <div className="w-full aspect-square lg:w-[calc(308*var(--u))] lg:h-[calc(308*var(--u))] rounded-[12px] sm:rounded-[16px] lg:rounded-[calc(20*var(--u))] bg-[linear-gradient(180deg,#ED2024_0%,#9D0508_100%)] flex flex-col items-center justify-center lg:justify-start lg:pt-[calc(42*var(--u))] text-center text-[#FFFFFF] px-2 lg:px-0">
              <div className="flex flex-col items-center leading-none">
                <span className="relative inline-flex items-start text-[32px] sm:text-[42px] lg:text-[calc(100*var(--u))] font-extrabold tracking-normal leading-[0.88]">
                  20
                  <sup className="text-[18px] sm:text-[24px] lg:text-[calc(58*var(--u))] font-extrabold leading-none -mt-[2px] lg:-mt-[calc(4*var(--u))] ml-[1px]">
                    +
                  </sup>
                </span>
                <span className="mt-0.5 lg:mt-[calc(4*var(--u))] text-[18px] sm:text-[24px] lg:text-[calc(60*var(--u))] font-extrabold uppercase tracking-normal leading-[0.9]">
                  YRS
                </span>
              </div>
              <span className="mt-1.5 sm:mt-2 lg:mt-[calc(16*var(--u))] text-[10px] sm:text-[12px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] leading-[1.33] lg:leading-[calc(40*var(--u))]">
                CLINICAL
                <br />
                RESEARCH
              </span>
            </div>

            {/* Card 3: 0 UV EXPOSURE (PSD Group 37 copy: x = 3014..3322, y = 3336..3644) */}
            <div className="w-full aspect-square lg:w-[calc(308*var(--u))] lg:h-[calc(308*var(--u))] rounded-[12px] sm:rounded-[16px] lg:rounded-[calc(20*var(--u))] bg-[linear-gradient(180deg,#ED2024_0%,#9D0508_100%)] flex flex-col items-center justify-center lg:justify-start lg:pt-[calc(62*var(--u))] text-center text-[#FFFFFF] px-2 lg:px-0">
              <span className="text-[32px] sm:text-[42px] lg:text-[calc(100*var(--u))] font-extrabold tracking-[0.02em] leading-none">
                0
              </span>
              <span className="mt-1.5 sm:mt-2 lg:mt-[calc(22*var(--u))] text-[10px] sm:text-[12px] lg:text-[calc(30*var(--u))] font-normal uppercase tracking-[0.02em] leading-[1.33] lg:leading-[calc(40*var(--u))]">
                UV
                <br />
                EXPOSURE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

