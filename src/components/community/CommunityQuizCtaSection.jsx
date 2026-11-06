import React from 'react';

export default function CommunityQuizCtaSection({ onStartQuiz }) {
  return (
    <section
      id="community-quiz-cta"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pt-12 sm:pt-16 md:pt-20 lg:pt-[calc(60*var(--u))] pb-20 sm:pb-24 md:pb-28 lg:pb-[calc(169*var(--u))] overflow-hidden font-['Manrope'] select-none"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0 flex flex-col items-center text-center">
        {/* Title: "NOT SURE WHERE TO START?" (PSD y=7669..7730, 80px font at 3840w, Manrope-Medium, uppercase) */}
        <h2 className="text-[24px] sm:text-[32px] md:text-[38px] lg:text-[clamp(34px,calc(80*var(--u)),44px)] font-medium tracking-[0.02em] uppercase text-[#000000] leading-none">
          NOT SURE WHERE TO START?
        </h2>

        {/* Subtitle (PSD y=7764..7853, 40px at 3840w, Manrope-Light, #333333, 45px below title) */}
        <p className="mt-3.5 sm:mt-4 lg:mt-[clamp(14px,calc(45*var(--u)),20px)] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[clamp(14px,calc(40*var(--u)),17px)] font-light tracking-[0.02em] text-[#333333] leading-snug lg:leading-[1.4] max-w-[90%] sm:max-w-[560px] lg:max-w-[clamp(520px,calc(1600*var(--u)),720px)]">
          Take the one-minute quiz to find the LUMA made for your routine,
          <br className="hidden sm:inline" />
          then get class reminders on WhatsApp.
        </p>

        {/* Two Action Buttons (PSD y=7896..7977, 374x80px each, gap 60px, 44px below subtitle) */}
        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-[clamp(24px,calc(44*var(--u)),32px)] flex flex-row items-center justify-center gap-3.5 sm:gap-4 md:gap-5 lg:gap-[clamp(16px,calc(60*var(--u)),24px)] w-full">
          {/* Button 1: FIND MY LUMA (Rectangle 21 copy 4: 374x80px, bg #ED2024, text Manrope-Medium 30px #FFFFFF) */}
          <a
            href="#assessment-quiz"
            onClick={onStartQuiz}
            className="w-[136px] sm:w-[150px] md:w-[162px] lg:w-[clamp(150px,calc(374*var(--u)),172px)] h-[34px] sm:h-[36px] md:h-[38px] lg:h-[clamp(36px,calc(80*var(--u)),40px)] rounded-full bg-[#ED2024] hover:bg-[#c9181b] text-[#FFFFFF] text-[10.5px] sm:text-[11px] md:text-[11.5px] lg:text-[clamp(11px,calc(30*var(--u)),12px)] font-medium uppercase tracking-[0.02em] inline-flex items-center justify-center text-center leading-none transition-colors duration-200 cursor-pointer shrink-0"
          >
            FIND MY LUMA
          </a>

          {/* Button 2: JOIN ON WHATSAPP (Rectangle 21 copy 6: 374x80px, bg #000000, text Manrope-Medium 30px #FFFFFF) */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[136px] sm:w-[150px] md:w-[162px] lg:w-[clamp(150px,calc(374*var(--u)),172px)] h-[34px] sm:h-[36px] md:h-[38px] lg:h-[clamp(36px,calc(80*var(--u)),40px)] rounded-full bg-[#000000] hover:bg-[#222222] text-[#FFFFFF] text-[10.5px] sm:text-[11px] md:text-[11.5px] lg:text-[clamp(11px,calc(30*var(--u)),12px)] font-medium uppercase tracking-[0.02em] inline-flex items-center justify-center text-center leading-none transition-colors duration-200 cursor-pointer shrink-0"
          >
            JOIN ON WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}

