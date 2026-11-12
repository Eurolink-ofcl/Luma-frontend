import React from 'react';

const defaultSafetyCards = [
  {
    icon: '/assets/about/safety-fda-icon.png',
    title: 'FDA-CLEARED',
    body: 'Every LUMA panel is registered as an FDA-cleared Class II medical device for at-home use',
  },
  {
    icon: '/assets/about/safety-uv-icon.png',
    title: 'NO UV EMISSION',
    body: 'LUMA emits only red and near-infrared wavelengths zero UV, zero burn risk, safe for daily skin exposure',
  },
  {
    icon: '/assets/about/safety-emf-icon.png',
    title: 'EMF-SHIELDED DRIVERS',
    body: 'Internal drivers are shielded to keep electromagnetic emissions well below international safety limits',
  },
];

const defaultSpecRows = [
  {
    label: 'WAVELENGTHS',
    value: '660NM (RED) & 850NM (NEAR-INFRARED), DUAL-CHIP LEDS',
  },
  {
    label: 'IRRADIANCE',
    value: 'UP TO 100 MW/CM² AT 6 INCHES, MEASURED AT FULL POWER',
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

export default function AboutSafetyTechSection({ data }) {
  const eyebrow = data?.eyebrow || 'BUILT TO STANDARD';
  const heading = data?.heading || 'SAFETY & TECH';

  // Guarantee that cards always have valid icons even if dynamic CMS returned records without icons
  const cards = defaultSafetyCards.map((defaultCard, idx) => {
    const custom = data?.cards?.[idx];
    return {
      ...defaultCard,
      title: custom?.title || defaultCard.title,
      body: custom?.body || defaultCard.body,
      icon: custom?.icon || defaultCard.icon,
    };
  });

  // Guarantee that all 7 rows from the PSD specifications are always displayed
  const specRows = defaultSpecRows.map((defaultRow, idx) => {
    const custom = data?.specRows?.[idx];
    return {
      ...defaultRow,
      label: custom?.label || defaultRow.label,
      value: custom?.value || defaultRow.value,
    };
  });

  return (
    <section
      id="about-safety-tech"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-[#FFFFFF] pt-12 sm:pt-16 lg:pt-[calc(140*var(--u))] pb-0 overflow-hidden font-['Manrope']"
    >
      {/* Upper Content: Header & 3 Safety Cards */}
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0">
        {/* ========================================================================= */}
        {/* Section Header (PSD Layer 24 & Layer 25: y = 6962..7113)                  */}
        {/* ========================================================================= */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: "BUILT TO STANDARD" (50px at 3840w, Manrope-Regular, tracking 20, #FFFFFF) */}
          <p className="text-[13px] sm:text-[16px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
            {eyebrow}
          </p>

          {/* Main Heading: "SAFETY & TECH" (100px at 3840w, Manrope-ExtraBold, tracking 20, #D61611) */}
          <h2 className="mt-2.5 sm:mt-3.5 lg:mt-[calc(35*var(--u))] text-[26px] sm:text-[38px] md:text-[46px] lg:text-[calc(100*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            {heading}
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* 3 Safety Cards (PSD Layers 26, 27, 28: y = 7193..7644)                    */}
        {/* Width: 890px, Height: 451px, r = 50px, border: 2px solid #494949          */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-12 lg:mt-[calc(80*var(--u))] lg:pl-[calc(519*var(--u))] lg:pr-[calc(516*var(--u))] grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[calc(66*var(--u))]">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="w-full lg:w-[calc(890*var(--u))] min-h-0 lg:h-[calc(451*var(--u))] p-6 sm:p-7 lg:pt-[calc(51*var(--u))] lg:pb-[calc(45*var(--u))] lg:px-[calc(50*var(--u))] rounded-[20px] sm:rounded-[32px] lg:rounded-[calc(50*var(--u))] border-2 border-[#494949] bg-[#0A0A0B] flex flex-col items-center text-center shadow-xl transition-all duration-200 hover:border-[#D61611]/70"
            >
              {/* Red Badge (Rectangle 25: 158x132px, r = 17px, fill: #D61611) */}
              <div className="w-16 h-14 sm:w-20 sm:h-16 lg:w-[calc(158*var(--u))] lg:h-[calc(132*var(--u))] rounded-[12px] sm:rounded-[15px] lg:rounded-[calc(17*var(--u))] bg-[#D61611] flex items-center justify-center shrink-0 shadow-lg">
                <img
                  src={card.icon}
                  alt={card.title}
                  className="max-h-[62%] max-w-[62%] object-contain select-none pointer-events-none brightness-0 invert"
                  onError={(e) => {
                    // Fallback to default asset path if CMS or URL issue occurs
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultSafetyCards[idx]?.icon;
                  }}
                />
              </div>

              {/* Title: 40px at 3840w, Manrope-Bold, #FFFFFF */}
              <h3 className="mt-4 sm:mt-5 lg:mt-[calc(41*var(--u))] text-[17px] sm:text-[20px] lg:text-[calc(40*var(--u))] font-bold uppercase tracking-[0.02em] text-[#FFFFFF] leading-tight">
                {card.title}
              </h3>

              {/* Body: 30px at 3840w, Manrope-Regular, leading 40px, #FFFFFF */}
              <p className="mt-2.5 sm:mt-3 lg:mt-[calc(26*var(--u))] text-[12.5px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.01em] text-[#FFFFFF] leading-relaxed lg:leading-[calc(40*var(--u))] max-w-[calc(680*var(--u))]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Specifications Table (PSD Group 47: Rectangle 51, y = 7820..8844)         */}
      {/* Background: Horizontal linear gradient from black #0A0A0B to red #D61611   */}
      {/* 7 rows x 141px height with 100% full-width divider lines                   */}
      {/* ========================================================================= */}
      <div className="relative w-full mt-14 sm:mt-20 lg:mt-[calc(176*var(--u))] bg-[linear-gradient(90deg,#0A0A0B_0%,#180809_30%,#540c10_60%,#a81216_85%,#d61611_100%)]">
        {specRows.map((spec, idx) => (
          <div
            key={idx}
            className={`w-full ${idx < specRows.length - 1 ? 'border-b border-white/20' : ''}`}
          >
            <div className="w-full max-w-[960px] lg:max-w-[calc(1850*var(--u))] mx-auto px-6 sm:px-10 lg:px-0 py-4 sm:py-5 lg:py-0 lg:h-[calc(141*var(--u))] flex flex-col sm:flex-row sm:items-center justify-center gap-3 sm:gap-10 lg:gap-[calc(80*var(--u))]">
              {/* Specification Label: 30px at 3840w, Manrope-Medium, uppercase, #FFFFFF */}
              <span className="text-[13px] sm:text-[15px] lg:text-[calc(30*var(--u))] font-medium text-[#FFFFFF] uppercase tracking-[0.02em] sm:w-[240px] md:w-[280px] lg:w-[calc(550*var(--u))] shrink-0 text-center sm:text-left">
                {spec.label}
              </span>

              {/* Specification Value: 30px at 3840w, Manrope-Medium, uppercase, #FFFFFF */}
              <span className="text-[13px] sm:text-[15px] lg:text-[calc(30*var(--u))] font-medium text-[#FFFFFF] uppercase tracking-[0.02em] text-center sm:text-left flex-1 max-w-[620px] lg:max-w-[calc(1220*var(--u))]">
                {spec.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
