import React from 'react';

export default function ReviewHero({ onShareStory, onFindPanel }) {
  return (
    <section
      id="review-hero"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full aspect-[3840/930] h-[calc(930*var(--u))] min-h-[240px] sm:min-h-[270px] md:min-h-0 bg-[#0a0002] overflow-hidden font-['Manrope'] select-none flex flex-col justify-start"
    >
      <style>{`
        #review-hero-bg {
          object-position: 85% center;
        }
        @media (min-width: 1024px) {
          #review-hero-bg {
            object-position: 50% 0%;
          }
        }
      `}</style>

      {/* Sliced Clean Background Photo from PSD: Exact canvas y=260..1190 */}
      {/* On mobile: focused at 85% center so the woman's complete body and raised foot are fully visible */}
      {/* On desktop: exact 3840x930 PSD alignment (50% 0%) */}
      <img
        id="review-hero-bg"
        src="/assets/reviews/review-hero-bg-v2.jpg?v=20261106_4"
        alt="LUMA Real Users Red Light Therapy Session"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />

      {/* Atmospheric Contrast Gradient on mobile (hidden on desktop where natural 3840x930 layout provides ample space) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent sm:from-black/85 sm:via-black/35 sm:to-transparent lg:hidden pointer-events-none" />

      {/* Hero Content Container aligned with PSD grid margin x=520px (13.54vw), pt=196px below navbar (canvas y=456 - 260) */}
      <div className="relative z-10 w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0 lg:pl-[calc(520*var(--u))] pt-5 sm:pt-7 lg:pt-[calc(196*var(--u))] pb-6 sm:pb-8 lg:pb-0 flex flex-col items-start justify-center">
        {/* Main Title: "RATED 4.8/5 BY \n THOUSANDS OF REAL USERS" (PSD: Manrope-Bold, 150px at 3840w, leading 140px, color #FFFFFF, Line 2 spans to x=2567 overlapping knee) */}
        <h1 className="text-[max(20px,calc(150*var(--u)))] font-bold uppercase tracking-normal leading-[max(22px,calc(140*var(--u)))] text-[#FFFFFF] max-w-none select-none">
          <span className="block">RATED 4.8/5 BY</span>
          <span className="block whitespace-nowrap">THOUSANDS OF REAL USERS</span>
        </h1>

        {/* Subtitle: "REAL ROUTINES, REAL STORIES" (PSD: Manrope-Regular italic, 33px at 3840w, tracking 200 / 0.2em, #FFFFFF, 59px below title) */}
        <p className="mt-[max(8px,calc(59*var(--u)))] text-[max(9px,calc(33*var(--u)))] font-normal italic uppercase tracking-[0.2em] text-[#FFFFFF]/90 leading-none">
          REAL ROUTINES, REAL STORIES
        </p>

        {/* Action Buttons Row (PSD: canvas y=856..946, 58px below subtitle, gap 26px) */}
        <div className="mt-[max(12px,calc(58*var(--u)))] flex flex-wrap items-center gap-[calc(26*var(--u))]">
          {/* Button 1: SHARE YOUR STORY (Rectangle 12: 374x90px, 2px white stroke, rounded-10 in PSD, Manrope-SemiBold 30px #FFFFFF) */}
          <a
            href="#share-story"
            onClick={(e) => {
              if (onShareStory) {
                e.preventDefault();
                onShareStory();
              }
            }}
            className="w-[max(130px,calc(374*var(--u)))] h-[max(34px,calc(90*var(--u)))] rounded-[calc(10*var(--u))] border border-white/80 sm:border-2 sm:border-[#FFFFFF] bg-white/[0.04] hover:bg-white hover:text-[#000000] text-[#FFFFFF] text-[max(9.5px,calc(30*var(--u)))] font-semibold uppercase tracking-[0.1em] inline-flex items-center justify-center text-center leading-none transition-all duration-300 cursor-pointer shrink-0"
          >
            SHARE YOUR STORY
          </a>

          {/* Button 2: FIND YOUR PANEL (Rectangle 12: 411x90px, 2px white stroke, rounded-10 in PSD, Manrope-SemiBold 30px #FFFFFF) */}
          <a
            href="#products"
            onClick={(e) => {
              if (onFindPanel) {
                e.preventDefault();
                onFindPanel();
              }
            }}
            className="w-[max(130px,calc(411*var(--u)))] h-[max(34px,calc(90*var(--u)))] rounded-[calc(10*var(--u))] border border-white/80 sm:border-2 sm:border-[#FFFFFF] bg-white/[0.04] hover:bg-white hover:text-[#000000] text-[#FFFFFF] text-[max(9.5px,calc(30*var(--u)))] font-semibold uppercase tracking-[0.1em] inline-flex items-center justify-center text-center leading-none transition-all duration-300 cursor-pointer shrink-0"
          >
            FIND YOUR PANEL
          </a>
        </div>
      </div>
    </section>
  );
}
