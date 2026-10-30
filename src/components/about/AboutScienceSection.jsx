import React from 'react';

const wavelengthCards = [
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

const steps = [
  {
    num: '01',
    title: 'LIGHT REACHES THE SKIN',
    body: 'Low-level red and near-infrared light, with no UV. Gentle warmth is normal.',
    colW: 661,
    padL: 63,
    padR: 60,
  },
  {
    num: '02',
    title: 'CELLS ABSORB ENERGY',
    body: 'Mitochondria, the energy centres of your cells, absorb the light, which may boost ATP production.',
    colW: 722,
    padL: 93,
    padR: 60,
  },
  {
    num: '03',
    title: 'RECOVERY MAY ACCELERATE',
    body: 'With more energy available, cells may repair and regenerate more efficiently.',
    colW: 745,
    padL: 92,
    padR: 60,
  },
  {
    num: '04',
    title: 'RESULTS BUILD OVER TIME',
    body: 'Short, consistent sessions over several weeks are typical. Results vary.',
    colW: 675,
    padL: 87,
    padR: 50,
  },
];

export default function AboutScienceSection() {
  return (
    <section
      id="about-science"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-[#FFFFFF] py-14 sm:py-16 lg:pt-[calc(177*var(--u))] lg:pb-[calc(175*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* Centered Header (PSD Group 42: y = 3987..4218) */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: "THE SCIENCE" — 50px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #FFFFFF */}
          <p className="text-[16px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
            THE SCIENCE
          </p>

          {/* Main Heading: "HOW IT WORKS" — 100px at 3840w, Manrope-ExtraBold (800), tracking 20 (0.02em), uppercase, #D61611 */}
          <h2 className="mt-2 sm:mt-3 lg:mt-[calc(37*var(--u))] text-[28px] sm:text-[38px] md:text-[46px] lg:text-[calc(100*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            HOW IT WORKS
          </h2>

          {/* Subtitle: "TWO WAVELENGTHS, ONE MECHANISM — LIGHT ENERGY CONVERTED INTO CELLULAR FUEL"
              PSD: 42px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #FFFFFF */}
          <p className="mt-3 sm:mt-4 lg:mt-[calc(44*var(--u))] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[calc(42*var(--u))] font-normal uppercase tracking-[0.02em] text-[#FFFFFF] leading-snug lg:leading-none max-w-[92vw]">
            TWO WAVELENGTHS, ONE MECHANISM &mdash; LIGHT ENERGY CONVERTED INTO CELLULAR FUEL
          </p>
        </div>

        {/* Two White Wavelength Cards (PSD Group 38: x = 518..1846 & 1994..3322, y = 4298..4711 -> 1328 x 413 each, gap = 148px, r = 50px) */}
        <div className="mt-8 sm:mt-10 lg:mt-[calc(80*var(--u))] lg:pl-[calc(518*var(--u))] lg:pr-[calc(518*var(--u))] flex flex-col lg:flex-row items-stretch justify-between gap-6 sm:gap-8 lg:gap-[calc(148*var(--u))]">
          {wavelengthCards.map((card, idx) => (
            <div
              key={idx}
              className="w-full lg:w-[calc(1328*var(--u))] lg:min-h-[calc(413*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] bg-[#FFFFFF] text-[#000000] p-6 sm:p-8 lg:pl-[calc(60*var(--u))] lg:pr-[calc(70*var(--u))] lg:pt-[calc(60*var(--u))] lg:pb-[calc(55*var(--u))] flex flex-row items-start gap-4 sm:gap-6 lg:gap-[calc(55*var(--u))]"
            >
              {/* Red Square Badge (PSD Rectangle 18: 160 x 160 at 3840w, r = 25px, fill #D61611) */}
              <div className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] lg:w-[calc(160*var(--u))] lg:h-[calc(160*var(--u))] rounded-[12px] sm:rounded-[14px] lg:rounded-[calc(25*var(--u))] bg-[#D61611] text-[#FFFFFF] flex flex-col items-center justify-center text-center shrink-0 select-none">
                <span className="text-[12px] sm:text-[14px] lg:text-[calc(32*var(--u))] font-bold uppercase tracking-[0.02em] leading-[1.1] lg:leading-[calc(35.42*var(--u))]">
                  {card.badgeLine1}
                </span>
                <span className="text-[12px] sm:text-[14px] lg:text-[calc(32*var(--u))] font-bold uppercase tracking-[0.02em] leading-[1.1] lg:leading-[calc(35.42*var(--u))]">
                  {card.badgeLine2}
                </span>
              </div>

              {/* Card Text Block (top offset 40px below badge top at 3840w) */}
              <div className="flex-1 lg:pt-[calc(34*var(--u))] flex flex-col items-start">
                {/* Card Title: 60px at 3840w, Manrope-ExtraBold (800), tracking 20 (0.02em), uppercase, #000000 */}
                <h3 className="text-[18px] sm:text-[22px] lg:text-[calc(60*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#000000] leading-none">
                  {card.title}
                </h3>

                {/* Card Body: 30px at 3840w, Manrope-Regular (400), leading 40px (1.333), tracking 20 (0.02em), #000000 */}
                <p className="mt-2.5 sm:mt-3 lg:mt-[calc(28*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#000000] leading-[1.45] lg:leading-[calc(40*var(--u))]">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Step Mechanism Box (PSD Group 40: x = 520..3323 (2803px), y = 4858..5295 (437px), r = 50px, 2px stroke #494949, 147px below cards) */}
        <div className="mt-8 sm:mt-10 lg:mt-[calc(147*var(--u))] lg:pl-[calc(520*var(--u))] lg:pr-[calc(517*var(--u))]">
          <div className="w-full lg:w-[calc(2803*var(--u))] lg:min-h-[calc(437*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] bg-[#0A0A0B] border border-[#494949] lg:border-[calc(2*var(--u))] grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-stretch divide-y sm:divide-y-0 sm:divide-x divide-[#2B2B2B] overflow-hidden">
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  '--step-w': `${step.colW}`,
                  '--step-pl': `${step.padL}`,
                  '--step-pr': `${step.padR}`,
                }}
                className="w-full lg:w-[calc(var(--step-w)*var(--u))] p-6 sm:p-7 lg:pt-[calc(82*var(--u))] lg:pb-[calc(70*var(--u))] lg:pl-[calc(var(--step-pl)*var(--u))] lg:pr-[calc(var(--step-pr)*var(--u))] flex flex-col items-start shrink-0"
              >
                {/* Step Number: 62px at 3840w, Manrope-Bold (700), tracking 20 (0.02em), #F10916 */}
                <span className="text-[24px] sm:text-[28px] lg:text-[calc(62*var(--u))] font-bold uppercase tracking-[0.02em] text-[#F10916] leading-none">
                  {step.num}
                </span>

                {/* Step Title: 40px at 3840w, Manrope-Bold (700), tracking 20 (0.02em), uppercase, #FFFFFF */}
                <h4 className="mt-4 sm:mt-5 lg:mt-[calc(59*var(--u))] text-[15px] sm:text-[17px] lg:text-[calc(40*var(--u))] font-bold uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
                  {step.title}
                </h4>

                {/* Step Description: 30px at 3840w, Manrope-Regular (400), leading 40px (1.333), tracking 20 (0.02em), #FFFFFF */}
                <p className="mt-2.5 sm:mt-3 lg:mt-[calc(30*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#FFFFFF] leading-[1.45] lg:leading-[calc(40*var(--u))]">
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

