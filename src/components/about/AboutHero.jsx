import React from 'react';

export default function AboutHero() {
  return (
    <section
      id="about-hero"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full h-[280px] sm:h-[340px] lg:h-[calc(781*var(--u))] bg-[#000000] overflow-hidden font-['Manrope'] select-none"
    >
      {/* Background Image sliced from Luma-About-Design.psd ('Images Banner' -> 'Fading Crimson Light Curtains', 3840 x 850) */}
      <div className="absolute inset-0 lg:inset-x-0 lg:top-[calc(-69*var(--u))] lg:h-[calc(850*var(--u))] w-full z-0 pointer-events-none">
        <img
          src="/assets/about/hero-bg.jpg"
          alt="About LUMA Red Light Therapy"
          className="w-full h-full object-cover object-right lg:object-center block"
          draggable={false}
        />
      </div>

      {/* Text Content (PSD 'Images Banner': x = 520, 'ABOUT ' y = 611..649, 'LUMA' y = 674..763) */}
      <div className="relative z-10 w-full h-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0 lg:pl-[calc(520*var(--u))] flex flex-col justify-end pb-9 sm:pb-12 lg:justify-start lg:pb-0 lg:pt-[calc(536*var(--u))]">
        {/* Eyebrow: "ABOUT" — 50px at 3840w, Manrope-Light (300), tracking 0, uppercase, #FFFFFF */}
        <p className="text-[16px] sm:text-[20px] lg:text-[calc(50*var(--u))] font-light uppercase tracking-normal text-[#FFFFFF] leading-none">
          ABOUT
        </p>

        {/* Main Title: "LUMA" — 120px at 3840w, Manrope-ExtraLight (200), tracking 0, uppercase, #ED2024 */}
        <h1 className="mt-1.5 sm:mt-2 lg:mt-[calc(18*var(--u))] lg:ml-[calc(2*var(--u))] text-[38px] sm:text-[48px] lg:text-[calc(120*var(--u))] font-extralight uppercase tracking-normal text-[#ED2024] leading-[0.85]">
          LUMA
        </h1>
      </div>
    </section>
  );
}

