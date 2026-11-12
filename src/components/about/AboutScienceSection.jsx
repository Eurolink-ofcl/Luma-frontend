import React from 'react';

const defaultWavelengthCards = [
  {
    badgeLine1: '660NM',
    badgeLine2: 'RED',
    title: 'RED LIGHT',
    body: "Visible red light around 660 nanometers is absorbed by the skin's surface layers, where it targets collagen production, circulation and surface-level inflammation the wavelength behind LUMA's skin and recovery benefits.",
  },
  {
    badgeLine1: '850NM',
    badgeLine2: 'NIR',
    title: 'NEAR- INFRARED LIGHT',
    body: 'Invisible near-infrared light around 850 nanometers travels deeper, reaching muscle and joint tissue. This is the wavelength most associated with pain relief, deep recovery and reduced soreness after activity.',
  },
];

const defaultSteps = [
  {
    num: '01',
    title: 'LIGHT REACHES THE SKIN',
    body: 'Low-level red and near-infrared light, with no UV. Gentle warmth is normal.',
  },
  {
    num: '02',
    title: 'CELLS ABSORB ENERGY',
    body: 'Mitochondria, the energy centres of your cells, absorb the light, which may boost ATP production.',
  },
  {
    num: '03',
    title: 'RECOVERY MAY ACCELERATE',
    body: 'With more energy available, cells may repair and regenerate more efficiently.',
  },
  {
    num: '04',
    title: 'RESULTS BUILD OVER TIME',
    body: 'Short, consistent sessions over several weeks are typical. Results vary.',
  },
];

export default function AboutScienceSection({ data }) {
  const eyebrow = data?.eyebrow || 'THE SCIENCE';
  const heading = data?.heading || 'HOW IT WORKS';
  const subheadline =
    data?.subheadline ||
    'TWO WAVELENGTHS, ONE MECHANISM — LIGHT ENERGY CONVERTED INTO CELLULAR FUEL';

  const wavelengthCards =
    data?.wavelengthCards && data.wavelengthCards.length > 0
      ? data.wavelengthCards
      : defaultWavelengthCards;
  const steps = data?.steps && data.steps.length > 0 ? data.steps : defaultSteps;

  return (
    <section
      id="about-science"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-[#FFFFFF] pt-12 sm:pt-16 lg:pt-[calc(177*var(--u))] pb-12 sm:pb-16 lg:pb-[calc(140*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0">
        {/* ========================================================================= */}
        {/* Section Header (PSD Group 42: y = 3987..4218)                             */}
        {/* ========================================================================= */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: "THE SCIENCE" (PSD: 50px at 3840w, Manrope-Regular, tracking 20 / 0.02em, color #FFFFFF) */}
          <p className="text-[13px] sm:text-[16px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
            {eyebrow}
          </p>

          {/* Main Heading: "HOW IT WORKS" (PSD: 100px at 3840w, Manrope-ExtraBold, tracking 20 / 0.02em, color #D61611) */}
          <h2 className="mt-2.5 sm:mt-3.5 lg:mt-[calc(35*var(--u))] text-[26px] sm:text-[38px] md:text-[46px] lg:text-[calc(100*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            {heading}
          </h2>

          {/* Sub-headline: "TWO WAVELENGTHS, ONE MECHANISM — LIGHT ENERGY CONVERTED INTO CELLULAR FUEL" (PSD: 42px, Manrope-Regular, #FFFFFF) */}
          <p className="mt-3.5 sm:mt-5 lg:mt-[calc(44*var(--u))] text-[12px] sm:text-[15px] lg:text-[calc(42*var(--u))] font-normal uppercase tracking-[0.02em] text-[#FFFFFF] leading-relaxed max-w-xl lg:max-w-none">
            {subheadline}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* Dual White Wavelength Cards (PSD Group 38: x = 518..3322, y = 4298..4711) */}
        {/* Width: 1328px, Height: 413px, r = 50px, fill: #FFFFFF                     */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-12 lg:mt-[calc(80*var(--u))] lg:pl-[calc(518*var(--u))] lg:pr-[calc(518*var(--u))] grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-[calc(148*var(--u))]">
          {wavelengthCards.map((card, idx) => (
            <div
              key={idx}
              className="w-full lg:w-[calc(1328*var(--u))] min-h-[160px] lg:h-[calc(413*var(--u))] p-6 sm:p-8 lg:p-0 lg:pl-[calc(60*var(--u))] lg:pr-[calc(60*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] bg-[#FFFFFF] text-[#000000] flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 lg:gap-[calc(55*var(--u))] shadow-xl"
            >
              {/* Red Square Badge (Rectangle 18: 160x160px, r = 25px, fill: #D61611) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[calc(160*var(--u))] lg:h-[calc(160*var(--u))] rounded-[14px] sm:rounded-[18px] lg:rounded-[calc(25*var(--u))] bg-[#D61611] text-[#FFFFFF] shrink-0 flex flex-col items-center justify-center text-center p-1 shadow-md">
                <span className="text-[13px] sm:text-[15px] lg:text-[calc(32*var(--u))] font-bold uppercase tracking-[0.02em] leading-tight">
                  {card.badgeLine1}
                </span>
                <span className="text-[13px] sm:text-[15px] lg:text-[calc(32*var(--u))] font-bold uppercase tracking-[0.02em] leading-tight">
                  {card.badgeLine2}
                </span>
              </div>

              {/* Text: Title + Body */}
              <div className="flex-1">
                {/* Title: 60px at 3840w, Manrope-ExtraBold, #000000 */}
                <h3 className="text-[18px] sm:text-[22px] lg:text-[calc(60*var(--u))] font-extrabold uppercase text-[#000000] tracking-[0.02em] leading-tight">
                  {card.title}
                </h3>

                {/* Body: 30px at 3840w, Manrope-Regular, leading 40px, #000000 */}
                <p className="mt-1.5 sm:mt-2 lg:mt-[calc(20*var(--u))] text-[12px] sm:text-[13.5px] lg:text-[calc(30*var(--u))] font-normal text-[#000000] leading-relaxed lg:leading-[calc(40*var(--u))] tracking-[0.01em]">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 4 Steps Row Container (PSD Group 40: Rectangle 50, x = 520..3323, y = 4858..5295) */}
        {/* Width: 2803px, Height: 437px, r = 50px, border: 1px solid rgba(255,255,255,0.18) */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-12 lg:mt-[calc(147*var(--u))] lg:pl-[calc(520*var(--u))] lg:pr-[calc(517*var(--u))]">
          <div className="w-full lg:w-[calc(2803*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] border border-white/20 bg-black/20 backdrop-blur-xs p-5 sm:p-7 lg:p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 lg:pt-[calc(82*var(--u))] lg:pb-[calc(70*var(--u))] lg:pl-[calc(63*var(--u))] lg:pr-[calc(50*var(--u))] flex flex-col justify-start"
              >
                {/* Step Number: 62px, Manrope-Bold, #F10916 (Bright Red) */}
                <span className="text-[24px] sm:text-[30px] lg:text-[calc(62*var(--u))] font-bold text-[#F10916] leading-none block">
                  {step.num}
                </span>

                {/* Step Title: 40px, Manrope-Bold, #FFFFFF */}
                <h4 className="mt-2.5 sm:mt-3 lg:mt-[calc(42*var(--u))] text-[14px] sm:text-[16px] lg:text-[calc(40*var(--u))] font-bold uppercase text-[#FFFFFF] tracking-[0.02em] leading-tight">
                  {step.title}
                </h4>

                {/* Step Description: 30px, Manrope-Regular, leading 40px, #FFFFFF */}
                <p className="mt-2 sm:mt-2.5 lg:mt-[calc(28*var(--u))] text-[12px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-normal text-[#FFFFFF]/90 leading-relaxed lg:leading-[calc(40*var(--u))]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
