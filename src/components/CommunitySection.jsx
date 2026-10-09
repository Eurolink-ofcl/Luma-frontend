import React from 'react';

export default function CommunitySection() {
  return (
    <section
      id="community"
      className="relative w-full bg-[#FFFFFF] py-16 lg:py-24 2xl:py-32 4xl:py-40 overflow-hidden font-['Manrope']"
    >
      <div className="max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 4xl:px-20">
        {/* Banner Card with authentic PSD background */}
        <div className="community-banner relative w-full rounded-[28px] sm:rounded-[36px] 2xl:rounded-[44px] 4xl:rounded-[52px] overflow-hidden bg-black shadow-2xl border border-black/10 min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] 2xl:min-h-[660px] 4xl:min-h-[760px] flex items-center justify-center text-center">
          {/* Background Image */}
          <img
            src="/assets/community-bg.jpg"
            alt="LUMA Wellness Community"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none brightness-95"
          />

          {/* Dark Vignette Overlay for Crisp Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/70 pointer-events-none" />

          {/* Content Container */}
          <div className="relative z-10 max-w-4xl 2xl:max-w-5xl 4xl:max-w-6xl mx-auto px-6 py-12 2xl:py-16 flex flex-col items-center">
            {/* Title */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] 2xl:text-[80px] 4xl:text-[96px] font-extrabold tracking-tight text-white uppercase leading-[1.08] mb-5 2xl:mb-7 select-none">
              JOIN<br />
              THE <span className="font-extrabold text-[#EC2024] tracking-normal">LUMA</span><br />
              COMMUNITY
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base 2xl:text-[20px] 4xl:text-[30px] text-white/85 tracking-[0.05em] uppercase max-w-2xl 2xl:max-w-3xl mx-auto mb-9 2xl:mb-12 font-medium leading-relaxed">
              LEARN FROM DOCTORS, JOIN FREE CLASSES AND ASK
              <br className="hidden sm:inline" />
              {' '}ANYTHING ABOUT RED LIGHT THERAPY.
            </p>

            {/* Action Buttons matching PSD Group 31 CTAs (Rectangle 11) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 2xl:gap-6 w-full sm:w-auto">
              {/* Join Us CTA (PSD CTA 1 width 290px) */}
              <a
                href="#join"
                className="w-full sm:w-auto min-w-[160px] 2xl:min-w-[190px] 4xl:min-w-[220px] px-8 2xl:px-10 4xl:px-12 py-3.5 2xl:py-4.5 4xl:py-5 rounded-[6px] 2xl:rounded-[8px] bg-[#EC2024] hover:bg-[#d6191d] text-white font-semibold text-xs sm:text-sm 2xl:text-[21.3px] 4xl:text-[32px] tracking-[0.05em] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center cursor-pointer"
              >
                Join Us
              </a>

              {/* Ask a question CTA (PSD CTA 2 width 420px) */}
              <a
                href="#contact"
                className="w-full sm:w-auto min-w-[180px] 2xl:min-w-[220px] 4xl:min-w-[260px] px-8 2xl:px-10 4xl:px-12 py-3.5 2xl:py-4.5 4xl:py-5 rounded-[6px] 2xl:rounded-[8px] bg-black/85 hover:bg-black text-white font-semibold text-xs sm:text-sm 2xl:text-[21.3px] 4xl:text-[32px] tracking-[0.05em] transition-all duration-200 border border-white/25 hover:border-white/50 text-center cursor-pointer"
              >
                Ask a question
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
