import React from 'react';

export default function CommunitySection() {
  return (
    <section
      id="community"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] -mt-px pt-10 pb-10 sm:pt-14 sm:pb-14 lg:pt-px lg:pb-px -mb-px overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-4 sm:px-6 lg:px-0 flex justify-center">
        {/* Banner Card (PSD Group 31 -> Rectangle 60: x = 520..3324 (2804px), y = 16585..17520 (935px), r = 60px, fill = #000000) */}
        <div className="community-banner relative w-full lg:w-[calc(2804*var(--u))] min-h-[380px] sm:min-h-[440px] lg:min-h-0 lg:h-[calc(935*var(--u))] rounded-[24px] sm:rounded-[32px] lg:rounded-[calc(60*var(--u))] overflow-hidden bg-[#000000] flex flex-col items-center justify-center lg:justify-start text-center">
          {/* Background Image (PSD Layer 14: bbox=(517, 16445, 3331, 17651), opacity = 102/255 = 40% over #000000) */}
          <img
            src="/assets/community-bg.jpg"
            alt="LUMA Wellness Community"
            className="absolute inset-0 lg:inset-auto lg:left-[calc(-3*var(--u))] lg:top-[calc(-140*var(--u))] w-full h-full lg:w-[calc(2814*var(--u))] lg:h-[calc(1206*var(--u))] object-cover object-center opacity-40 pointer-events-none select-none"
            draggable={false}
          />

          {/* Content Container */}
          <div className="relative z-10 w-full px-6 py-10 sm:py-12 lg:p-0 lg:pt-[calc(124*var(--u))] flex flex-col items-center">
            {/* Title: "JOIN\nTHE LUMA\nCOMMUNITY"
                PSD: 150px at 3840w, leading 140px (0.9333), tracking 20 (0.02em), uppercase, #FFFFFF
                "JOIN\nTHE " & "COMMUNITY" -> Manrope-ExtraLight (200)
                "LUMA" -> Manrope-ExtraBold (800), #FFFFFF */}
            <h2 className="text-[36px] sm:text-[52px] md:text-[64px] lg:text-[calc(150*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#FFFFFF] leading-[0.95] lg:leading-[calc(140*var(--u))] select-none">
              JOIN
              <br />
              THE <span className="font-extrabold text-[#FFFFFF]">LUMA</span>
              <br />
              COMMUNITY
            </h2>

            {/* Subtitle: "LEARN FROM DOCTORS, JOIN FREE CLASSES AND ASK\nANYTHING ABOUT RED LIGHT THERAPY."
                PSD: 30px at 3840w, Manrope-Medium (500), leading 48px (1.6), tracking 20 (0.02em), uppercase, #FFFFFF */}
            <p className="mt-4 sm:mt-5 lg:mt-[calc(46*var(--u))] text-[11px] sm:text-[13px] md:text-[14px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF] leading-[1.6] lg:leading-[calc(48*var(--u))]">
              LEARN FROM DOCTORS, JOIN FREE CLASSES AND ASK
              <br />
              ANYTHING ABOUT RED LIGHT THERAPY.
            </p>

            {/* Action Buttons (PSD Group 31 -> CTAs: y = 17298..17385, gap = 11px) */}
            <div className="mt-6 sm:mt-8 lg:mt-[calc(52*var(--u))] flex flex-row items-center justify-center gap-2.5 sm:gap-3 lg:gap-[calc(11*var(--u))]">
              {/* CTA 1: "JOIN US" — 290 x 86 at 3840w, r = 10px, fill #ED2024, 32px Manrope-SemiBold (600), tracking 50 (0.05em), uppercase, #FFFFFF */}
              <a
                href="#join"
                className="inline-flex items-center justify-center w-[125px] sm:w-[145px] lg:w-[calc(290*var(--u))] h-[40px] sm:h-[44px] lg:h-[calc(86*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#ED2024] hover:bg-[#d6191d] text-[#FFFFFF] text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 cursor-pointer"
              >
                JOIN US
              </a>

              {/* CTA 2: "ASK A QUESTION" — 420 x 86 at 3840w, r = 10px, fill #000000, 2px stroke #555555, 32px Manrope-SemiBold (600), tracking 50 (0.05em), uppercase, #FFFFFF */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center w-[175px] sm:w-[205px] lg:w-[calc(420*var(--u))] h-[40px] sm:h-[44px] lg:h-[calc(86*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#000000] hover:bg-[#141414] border border-[#555555] lg:border-[calc(2*var(--u))] hover:border-[#888888] text-[#FFFFFF] text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 cursor-pointer"
              >
                ASK A QUESTION
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
