import React, { useState } from 'react';

export default function RealStoryGallerySection() {
  const [activeDot, setActiveDot] = useState(0);

  return (
    <section
      id="real-story"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] overflow-hidden font-['Manrope'] select-none pt-10 sm:pt-14 md:pt-18 lg:pt-0 pb-10 sm:pb-14 md:pb-18 lg:pb-0"
    >
      {/* =========================================================================
          DESKTOP HERO COMPOSITION (Exact PSD 'Layer 1: REAL STORY' y=3091..4697)
          Aspect ratio: 3840w x 1606h (aspect-[3840/1606])
          ========================================================================= */}
      <div className="relative w-full hidden lg:block aspect-[3840/1606] h-[calc(1606*var(--u))]">
        {/* Sliced Background Gallery Image (8 3D Perspective Curved Cards with original play buttons) */}
        <picture>
          <source srcSet="/assets/reviews/real-story-gallery-clean.webp?v=20261106_2" type="image/webp" />
          <img
            src="/assets/reviews/real-story-gallery-clean.jpg?v=20261106_2"
            alt="LUMA Real Story Community Gallery"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            draggable={false}
          />
        </picture>

        {/* Section Header: Title + Red Pill Bar (PSD canvas y=3198..3326 -> relative y=107..235) */}
        <div
          style={{ top: 'calc(107 * var(--u))' }}
          className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center text-center pointer-events-auto"
        >
          {/* Title: REAL STORY (PSD: Manrope-ExtraLight 80px at 3840w, tracking 20 / 0.02em, color #131313) */}
          <h2 className="text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#131313] leading-none whitespace-nowrap">
            REAL STORY
          </h2>

          {/* Red Pill Bar (Rectangle 15: 150x20px, rounded-full, fill #ED2124, 47px below title) */}
          <div
            style={{
              marginTop: 'calc(47 * var(--u))',
              width: 'calc(150 * var(--u))',
              height: 'calc(20 * var(--u))',
            }}
            className="rounded-full bg-[#ED2124]"
            aria-hidden="true"
          />
        </div>

        {/* Pagination Dots (PSD: 4 dots at y=4403, 20x20px each, gap 10px, dot 1 active #ED2124, rest #C0C0C0) */}
        <div
          style={{
            top: 'calc(1312 * var(--u))',
            gap: 'calc(10 * var(--u))',
          }}
          className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
        >
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: 'calc(20 * var(--u))',
                height: 'calc(20 * var(--u))',
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#ED2124] scale-110 shadow-sm'
                  : 'bg-[#C0C0C0] hover:bg-[#a0a0a0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          MOBILE & TABLET RESPONSIVE LAYOUT (< lg screens)
          Allows smooth horizontal swiping across the panoramic gallery with dots
          ========================================================================= */}
      <div className="w-full lg:hidden flex flex-col items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-[26px] sm:text-[34px] md:text-[44px] font-extralight uppercase tracking-[0.02em] text-[#131313] leading-none">
            REAL STORY
          </h2>
          <div
            className="mt-3 sm:mt-4 w-[60px] sm:w-[80px] h-[8px] sm:h-[11px] rounded-full bg-[#ED2124]"
            aria-hidden="true"
          />
        </div>

        {/* Horizontally Scrollable Curved Gallery Strip */}
        <div className="relative w-full mt-6 sm:mt-8 overflow-x-auto scrollbar-none pb-4 px-4 sm:px-6">
          <div className="relative min-w-[900px] sm:min-w-[1200px] md:min-w-[1500px] aspect-[3840/1606]">
            <picture>
              <source srcSet="/assets/reviews/real-story-gallery-clean.webp?v=20261106_2" type="image/webp" />
              <img
                src="/assets/reviews/real-story-gallery-clean.jpg?v=20261106_2"
                alt="LUMA Real Story Community Gallery"
                className="w-full h-full object-cover object-center pointer-events-none select-none rounded-lg"
                draggable={false}
              />
            </picture>
          </div>
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-6">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-[8px] sm:w-[10px] h-[8px] sm:h-[10px] rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#ED2124] scale-110 shadow-sm'
                  : 'bg-[#C0C0C0] hover:bg-[#a0a0a0]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
