import React from 'react';

const safetyCards = [
  {
    icon: '/assets/about/safety-shield.png',
    iconW: 88,
    iconH: 98,
    title: 'FDA-CLEARED',
    body: 'Every LUMA panel is registered as an FDA-cleared Class II medical device for at-home use',
    bodyMaxW: 519,
  },
  {
    icon: '/assets/about/safety-uv.png',
    iconW: 103,
    iconH: 103,
    title: 'NO UV EMISSION',
    body: 'LUMA emits only red and near-infrared wavelengths zero UV, zero burn risk, safe for daily skin exposure',
    bodyMaxW: 545,
  },
  {
    icon: '/assets/about/safety-emf.png',
    iconW: 91,
    iconH: 95,
    title: 'EMF-SHIELDED DRIVERS',
    body: 'Internal drivers are shielded to keep electromagnetic emissions well below international safety limits',
    bodyMaxW: 543,
  },
];

const specRows = [
  {
    label: 'WAVELENGTHS',
    value: '660NM (RED) & 850NM (NEAR-INFRARED), DUAL-CHIP LEDS',
  },
  {
    label: 'IRRADIANCE',
    value: 'UP TO 100 MW/CM\u00B2 AT 6 INCHES, MEASURED AT FULL POWER',
  },
  {
    label: 'CERTIFICATION',
    value: 'FDA-CLEARED, CE MARKED, ROHS COMPLIANT',
  },
  {
    label: 'SESSION TIMER',
    value: 'BUILT-IN TOUCH PANEL, 10 / 15 / 20-MINUTE PRESETS',
  },
  {
    label: 'COOLING',
    value: 'SILENT FANLESS HEAT-SINK DESIGN, SAFE FOR CONTINUOUS DAILY USE',
  },
  {
    label: 'POWER',
    value: 'STANDARD WALL OUTLET, NO SPECIAL WIRING REQUIRED',
  },
  {
    label: 'WARRANTY',
    value: '3-YEAR MANUFACTURER WARRANTY ON ALL DEVICES',
  },
];

export default function AboutSafetyTechSection() {
  return (
    <section
      id="about-safety-tech"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-[#FFFFFF] overflow-hidden font-['Manrope']"
    >
      {/* Part 1: Built To Standard / Safety & Tech + 3 Cards (PSD y = 6962..7820 on #0A0A0B) */}
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0 pt-6 sm:pt-10 lg:pt-0 pb-14 sm:pb-16 lg:pb-[calc(176*var(--u))]">
        {/* Centered Header */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: "BUILT TO STANDARD" — 50px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #FFFFFF */}
          <p className="text-[15px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
            BUILT TO STANDARD
          </p>

          {/* Main Heading: "SAFETY & TECH" — 100px at 3840w, Manrope-ExtraBold (800), tracking 20 (0.02em), uppercase, #D61611 */}
          <h2 className="mt-2 sm:mt-3 lg:mt-[calc(37*var(--u))] text-[28px] sm:text-[38px] md:text-[46px] lg:text-[calc(100*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            SAFETY &amp; TECH
          </h2>
        </div>

        {/* 3 Safety Cards (PSD Group 46 / copy / copy 2: x = 519..1409, 1475..2365, 2434..3324 -> 890 x 451 each, r = 50px, 80px below heading) */}
        <div className="mt-8 sm:mt-10 lg:mt-[calc(80*var(--u))] lg:pl-[calc(519*var(--u))] lg:pr-[calc(516*var(--u))] grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-[calc(67.5*var(--u))]">
          {safetyCards.map((card, idx) => (
            <div
              key={idx}
              className="w-full lg:w-[calc(890*var(--u))] lg:min-h-[calc(451*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] bg-[#000000] border border-[#494949] lg:border-[calc(2*var(--u))] px-6 py-8 sm:p-8 lg:pt-[calc(51*var(--u))] lg:pb-[calc(48*var(--u))] lg:px-[calc(60*var(--u))] flex flex-col items-center text-center"
            >
              {/* Red Icon Box (PSD Group 45 -> Rectangle 25: 158 x 132 at 3840w, r = 17px, fill #D61611) */}
              <div className="w-[64px] h-[54px] sm:w-[72px] sm:h-[60px] lg:w-[calc(158*var(--u))] lg:h-[calc(132*var(--u))] rounded-[8px] sm:rounded-[10px] lg:rounded-[calc(17*var(--u))] bg-[#D61611] flex items-center justify-center shrink-0">
                <img
                  src={card.icon}
                  alt={card.title}
                  style={{
                    '--iw': `${card.iconW}`,
                    '--ih': `${card.iconH}`,
                  }}
                  className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] lg:w-[calc(var(--iw)*var(--u))] lg:h-[calc(var(--ih)*var(--u))] object-contain select-none"
                />
              </div>

              {/* Card Title: 40px at 3840w, Manrope-Bold (700), tracking 20 (0.02em), uppercase, #FFFFFF (41px below icon box) */}
              <h3 className="mt-5 sm:mt-6 lg:mt-[calc(41*var(--u))] text-[16px] sm:text-[18px] lg:text-[calc(40*var(--u))] font-bold uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
                {card.title}
              </h3>

              {/* Card Body: 30px at 3840w, Manrope-Regular (400), leading 40px (1.333), tracking 20 (0.02em), #FFFFFF (42px below title) */}
              <p
                style={{ '--mw': `${card.bodyMaxW}` }}
                className="mt-3 sm:mt-4 lg:mt-[calc(42*var(--u))] max-w-[340px] lg:max-w-[calc(var(--mw)*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#FFFFFF] leading-[1.45] lg:leading-[calc(40*var(--u))]"
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Full-Width Technical Specs Table (PSD Group 47: y = 7820..8844 -> 3840 x 1024px) */}
      <div
        className="w-full"
        style={{
          background:
            'linear-gradient(114deg, #131313 0%, #141213 18%, #2B1313 34%, #581415 52%, #891518 70%, #B81619 86%, #E4171B 100%)',
        }}
      >
        <div className="w-full divide-y divide-[#494949]">
          {specRows.map((row, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === specRows.length - 1;
            return (
              <div
                key={row.label}
                className={`w-full px-6 sm:px-10 lg:px-0 lg:pl-[calc(1120*var(--u))] lg:pr-[calc(520*var(--u))] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 lg:gap-0 ${
                  isFirst
                    ? 'py-4 sm:py-5 lg:h-[calc(162*var(--u))] lg:pt-[calc(18*var(--u))]'
                    : isLast
                    ? 'py-4 sm:py-5 lg:h-[calc(157*var(--u))] lg:pb-[calc(14*var(--u))]'
                    : 'py-4 sm:py-5 lg:h-[calc(141*var(--u))]'
                }`}
              >
                {/* Column 1 (Label): starts at x=1120, width 577px (to x=1697), 30px Manrope-Medium (500), uppercase, tracking 20 (0.02em), #FFFFFF */}
                <div className="sm:w-[180px] md:w-[220px] lg:w-[calc(577*var(--u))] shrink-0 text-[12px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF]/80 sm:text-[#FFFFFF] leading-snug lg:leading-none">
                  {row.label}
                </div>

                {/* Column 2 (Value): starts at x=1697, 30px Manrope-Medium (500), uppercase, tracking 20 (0.02em), #FFFFFF */}
                <div className="flex-1 text-[12px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF] leading-snug lg:leading-none">
                  {row.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

