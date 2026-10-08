import React, { useState } from 'react';

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <main
      className="relative w-full h-[900px] xl:h-[965px] 2xl:h-[1050px] 4xl:h-[1180px] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-[calc(36px+84px+20px)] 2xl:pt-[calc(42px+96px+30px)] 4xl:pt-[calc(48px+110px+40px)] pb-14 2xl:pb-20 overflow-hidden"
      id="hero"
    >
      {/* Background with Authenticity & Depth */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <img
          src="/assets/hero-bg.jpg"
          alt="LUMA Red Light Therapy Panels in Modern Wellness Gym"
          className="w-full h-full object-cover object-top brightness-[0.92]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.75)_90%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-[#0a0a0a] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1300px] 2xl:max-w-[1600px] 4xl:max-w-[2000px] w-full mx-auto flex flex-col items-center pt-5">
        <h1 className="font-manrope text-[clamp(28px,3.8vw,66px)] 2xl:text-[76px] 4xl:text-[96px] font-extrabold leading-[1.12] 2xl:leading-[1.08] tracking-[-0.015em] uppercase text-white mb-5 2xl:mb-7 drop-shadow-[0_4px_28px_rgba(0,0,0,0.7)] break-words">
          <span className="block">THE SCIENCE OF LIGHT.</span>
          <span className="block">THE POWER TO HEAL.</span>
        </h1>

        <p className="font-manrope text-[11.5px] sm:text-[13px] 2xl:text-[16px] 4xl:text-[19px] font-medium tracking-[0.2em] sm:tracking-[0.24em] 2xl:tracking-[0.28em] uppercase text-white/95 mb-9 sm:mb-10 2xl:mb-12 4xl:mb-14 max-w-[90vw]">
          THE WORLD'S MOST ADVANCED RED LIGHT THERAPY PANEL
        </p>

        {/* Action Buttons */}
        <div className="luma-hero-buttons flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 2xl:gap-6 mb-12 sm:mb-14 2xl:mb-18 w-full max-w-[280px] sm:max-w-none">
          <a
            href="#about"
            className="w-full sm:w-auto inline-flex items-center justify-center py-3 2xl:py-4 4xl:py-5 px-7 2xl:px-9 4xl:px-11 rounded-[5px] 2xl:rounded-[8px] text-[12.5px] 2xl:text-[14.5px] 4xl:text-[17px] font-semibold tracking-[0.08em] uppercase border border-white/90 bg-black/40 text-white backdrop-blur-md hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_24px_rgba(255,255,255,0.35)] transition-all min-w-[175px] 2xl:min-w-[210px] 4xl:min-w-[250px]"
          >
            EXPLORE LUMA
          </a>
          <a
            href="#get-panel"
            className="w-full sm:w-auto inline-flex items-center justify-center py-3 2xl:py-4 4xl:py-5 px-7 2xl:px-9 4xl:px-11 rounded-[5px] 2xl:rounded-[8px] text-[12.5px] 2xl:text-[14.5px] 4xl:text-[17px] font-semibold tracking-[0.08em] uppercase border border-white/90 bg-black/40 text-white backdrop-blur-md hover:bg-[#EC2024] hover:border-[#EC2024] hover:text-white hover:shadow-[0_0_24px_rgba(236,32,36,0.45)] transition-all min-w-[175px] 2xl:min-w-[210px] 4xl:min-w-[250px]"
          >
            FIND YOUR PANEL
          </a>
        </div>
      </div>

      {/* Carousel Pagination Dots & Authentic PSD Mouse Down Indicator (Anchored near bottom above Trust Strip) */}
      <div className="absolute bottom-3 sm:bottom-3.5 xl:bottom-4 4xl:bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 select-none">
        {/* 4 Pagination Dots: Active is Red (#EC2024) matching PSD Group 36 */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 4xl:gap-3 mb-4 xl:mb-6 2xl:mb-7 4xl:mb-9"
          aria-label="Slide navigation"
        >
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-[8px] h-[8px] xl:w-[9px] xl:h-[9px] 2xl:w-[10px] 2xl:h-[10px] 4xl:w-[13px] 4xl:h-[13px] rounded-full transition-all cursor-pointer ${
                activeSlide === idx
                  ? 'bg-[#EC2024] shadow-[0_0_8px_rgba(236,32,36,0.85)] scale-110'
                  : 'bg-[#4A4A4A] hover:bg-[#777777]'
              }`}
            />
          ))}
        </div>

        {/* Authentic Mouse Scroll Indicator with Down Arrow */}
        <a
          href="#about"
          className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:translate-y-1"
          aria-label="Scroll down to About LUMA"
          title="Scroll down"
        >
          <img
            src="/assets/mouse-scroll.png"
            alt="Mouse scroll down"
            className="w-[18px] sm:w-[20px] xl:w-[22px] 2xl:w-[24px] 4xl:w-[29px] h-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity animate-mouse-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          />
        </a>
      </div>
    </main>
  );
}
