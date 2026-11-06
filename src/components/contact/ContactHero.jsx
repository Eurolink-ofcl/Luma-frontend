import React from 'react';

export default function ContactHero() {
  return (
    <section
      id="contact-hero"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full aspect-[3840/1121] h-[calc(1121*var(--u))] min-h-[380px] sm:min-h-[440px] md:min-h-[500px] lg:min-h-0 bg-[#0a0002] overflow-hidden font-['Manrope'] select-none flex flex-col justify-start"
    >
      <style>{`
        #contact-hero-bg {
          object-position: 35% 0%;
        }
        @media (min-width: 1024px) {
          #contact-hero-bg {
            object-position: 50% 0%;
          }
        }
      `}</style>

      {/* Sliced Clean Background Photo from PSD: Canvas y=69..1190 (3840x1121) */}
      {/* Extends behind the transparent navbar and includes subtle header shade */}
      <picture>
        <source srcSet="/assets/contact/contact-hero-bg.webp?v=20261106_2" type="image/webp" />
        <img
          id="contact-hero-bg"
          src="/assets/contact/contact-hero-bg.jpg?v=20261106_2"
          alt="LUMA Red Light Therapy Experience"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />
      </picture>

      {/* Atmospheric Contrast Gradient on mobile to ensure pristine legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent lg:hidden pointer-events-none" />

      {/* Content Container aligned with PSD grid margin x=531px (13.82vw), pt=487px from top banner (canvas y=556 - 69) */}
      <div className="relative z-10 w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0 lg:pl-[calc(531*var(--u))] pt-[100px] sm:pt-[130px] md:pt-[160px] lg:pt-[calc(487*var(--u))] pb-8 sm:pb-12 lg:pb-0 flex flex-col items-start justify-center">
        {/* Main Title: "LET’S FIND YOUR LIGHT" */}
        {/* PSD: Manrope-Bold, 150px at 3840w, leading 140px, tracking 0, color #FFFFFF, uppercase */}
        <h1 className="text-[28px] sm:text-[38px] md:text-[50px] lg:text-[calc(150*var(--u))] font-bold uppercase tracking-normal leading-[1.05] lg:leading-[calc(140*var(--u))] text-[#FFFFFF] max-w-none select-none">
          LET’S FIND YOUR LIGHT
        </h1>

        {/* Subtitle: "EXPERT GUIDANCE. PERSONAL CARE." */}
        {/* PSD: Manrope-Regular italic, 33px at 3840w, leading 58px, tracking 200 (0.2em), color #FFFFFF, canvas y=768 (98px below title) */}
        <p className="mt-3 sm:mt-4 lg:mt-[calc(98*var(--u))] text-[11px] sm:text-[14px] md:text-[16px] lg:text-[calc(33*var(--u))] font-normal italic uppercase tracking-[0.2em] text-[#FFFFFF]/90 leading-none">
          EXPERT GUIDANCE. PERSONAL CARE.
        </p>
      </div>
    </section>
  );
}

