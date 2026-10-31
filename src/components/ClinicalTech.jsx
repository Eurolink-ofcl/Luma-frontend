import React, { useState } from 'react';

const wavelengths = [
  {
    id: 480,
    value: '480',
    unit: 'nm',
    label: 'Skin surface',
    primaryTitle: 'Primary',
    primaryDesc: 'Blemish & acne control\nroutines.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Surface purification and\nanti-bacterial support.',
    depth: '1 to 2 mm',
    research: 'Well documented for surface acne.',
    type: 'blue',
    topPercent: 40.27,
    heightPercent: 2.67,
    labelTopPercent: 35.47,
    calloutTopPercent: 11.02,
    callout: '1-2 mm',
    psdGradient: 'linear-gradient(180deg, #243972 0%, #203262 25%, #182240 50%, #101522 75%, #0B0C0F 100%)',
    activeGradient: 'linear-gradient(180deg, #3556AC 0%, #243972 35%, #182240 70%, #0B0C0F 100%)',
    activeShadow: '0 0 28px rgba(53, 86, 172, 0.65)',
  },
  {
    id: 630,
    value: '630',
    unit: 'nm',
    label: 'Epidermis',
    primaryTitle: 'Primary',
    primaryDesc: 'Cellular glow & tone\nevening.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Fine line smoothing and\nskin brightening.',
    depth: '2 to 3 mm',
    research: 'Extensively studied for tone.',
    type: 'red',
    topPercent: 38.67,
    heightPercent: 4.98,
    labelTopPercent: 33.07,
    calloutTopPercent: 11.02,
    callout: '2-3 mm',
    psdGradient: 'linear-gradient(180deg, #4E2419 0%, #421F16 25%, #2D1712 50%, #180F0E 75%, #0B0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #EA1F23 0%, #BF1B1F 25%, #7B1517 50%, #380E10 75%, #0D0A0B 100%)',
    activeShadow: '0 0 32px rgba(234, 31, 35, 0.6)',
  },
  {
    id: 650,
    value: '650',
    unit: 'nm',
    label: 'Upper Dermis',
    primaryTitle: 'Primary',
    primaryDesc: 'Fibroblast & elasticity\nsupport.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Collagen matrix enhancement\nand plumpness.',
    depth: '3 to 4 mm',
    research: 'Proven dermal density increase.',
    type: 'red',
    topPercent: 37.69,
    heightPercent: 6.76,
    labelTopPercent: 31.91,
    calloutTopPercent: 11.02,
    callout: '3-4 mm',
    psdGradient: 'linear-gradient(180deg, #531C16 0%, #451814 25%, #2F1310 50%, #190D0D 75%, #0B0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #EA1F23 0%, #BF1B1F 25%, #7B1517 50%, #380E10 75%, #0D0A0B 100%)',
    activeShadow: '0 0 32px rgba(234, 31, 35, 0.6)',
  },
  {
    id: 660,
    value: '660',
    unit: 'nm',
    label: 'Skin surface',
    primaryTitle: 'Primary',
    primaryDesc: 'Skin, collagen support\nand scalp routines.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Skin recovery and\nhealing-support routines.',
    depth: '1 to 5 mm',
    research: 'Well studied for skin.',
    type: 'red',
    topPercent: 37.07,
    heightPercent: 6.76,
    labelTopPercent: 31.02,
    calloutTopPercent: 11.02,
    callout: '5 mm',
    psdGradient: 'linear-gradient(180deg, #531C16 0%, #451814 25%, #2F1310 50%, #190D0D 75%, #0B0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #EA1F23 0%, #BF1B1F 25%, #7B1517 50%, #380E10 75%, #0D0A0B 100%)',
    activeShadow: '0 0 32px rgba(234, 31, 35, 0.6)',
  },
  {
    id: 670,
    value: '670',
    unit: 'nm',
    label: 'Deep Dermis',
    primaryTitle: 'Primary',
    primaryDesc: 'Mitochondrial cytochrome c\nrecharge.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Accelerated cellular energy\nand cellular repair.',
    depth: '4 to 5 mm',
    research: 'Benchmark for photobiomodulation.',
    type: 'red',
    topPercent: 36.62,
    heightPercent: 5.87,
    labelTopPercent: 30.67,
    calloutTopPercent: 11.02,
    callout: '5 mm',
    psdGradient: 'linear-gradient(180deg, #4D1012 0%, #410F11 25%, #2C0D0E 50%, #180B0C 75%, #0B0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #EA1F23 0%, #BF1B1F 25%, #7B1517 50%, #380E10 75%, #0D0A0B 100%)',
    activeShadow: '0 0 32px rgba(234, 31, 35, 0.6)',
  },
  {
    id: 810,
    value: '810',
    unit: 'nm',
    label: 'Subcutaneous',
    primaryTitle: 'Primary',
    primaryDesc: 'Deep connective and\nneural tissue repair.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Relief for deep muscle\nstrain and trauma.',
    depth: '10 to 30 mm',
    research: 'Studied for deep tissue repair.',
    type: 'nir',
    topPercent: 14.93,
    heightPercent: 53.51,
    labelTopPercent: 9.07,
    calloutTopPercent: 3.5,
    callout: '25-30 mm',
    psdGradient: 'linear-gradient(180deg, #370E10 0%, #2E0D0F 25%, #200C0D 50%, #130A0C 75%, #0A0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #EA1F23 0%, #9E181B 25%, #4E1113 55%, #1D0B0C 80%, #0A0A0B 100%)',
    activeShadow: '0 0 32px rgba(234, 31, 35, 0.55)',
  },
  {
    id: 830,
    value: '830',
    unit: 'nm',
    label: 'Connective & Bone',
    primaryTitle: 'Primary',
    primaryDesc: 'Micro-vascularization and\ntendon repair.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Accelerated bone healing\nand joint soothing.',
    depth: '15 to 35 mm',
    research: 'Clinically validated for healing.',
    type: 'nir',
    topPercent: 14.93,
    heightPercent: 53.51,
    labelTopPercent: 9.07,
    calloutTopPercent: 3.5,
    callout: '30-35 mm',
    psdGradient: 'linear-gradient(180deg, #370E10 0%, #2E0D0F 25%, #200C0D 50%, #130A0C 75%, #0A0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #EA1F23 0%, #9E181B 25%, #4E1113 55%, #1D0B0C 80%, #0A0A0B 100%)',
    activeShadow: '0 0 32px rgba(234, 31, 35, 0.55)',
  },
  {
    id: 850,
    value: '850',
    unit: 'nm',
    label: 'Deep Muscle',
    primaryTitle: 'Primary',
    primaryDesc: 'Athletic muscle recovery\nand lactate clearance.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Relief for deep tendon\ninflammation and stiffness.',
    depth: '20 to 45 mm',
    research: 'Elite athletic benchmark.',
    type: 'nir',
    topPercent: 5.6,
    heightPercent: 62.84,
    labelTopPercent: 0.0,
    calloutTopPercent: -4.2,
    callout: '45 mm',
    psdGradient: 'linear-gradient(180deg, #370E10 0%, #2E0D0F 25%, #200C0D 50%, #130A0C 75%, #0A0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #EA1F23 0%, #9E181B 25%, #4E1113 55%, #1D0B0C 80%, #0A0A0B 100%)',
    activeShadow: '0 0 32px rgba(234, 31, 35, 0.55)',
  },
  {
    id: 1060,
    value: '1060',
    unit: 'nm',
    label: 'Deepest Systemic',
    primaryTitle: 'Primary',
    primaryDesc: 'Maximum tissue depth\npenetration.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Bypasses surface water\nabsorption for vitality.',
    depth: '30 to 50 mm',
    research: 'Cutting-edge clinical wavelength.',
    type: 'silver',
    topPercent: 0.0,
    heightPercent: 68.44,
    labelTopPercent: 9.78,
    calloutTopPercent: -4.2,
    callout: '50 mm',
    psdGradient: 'linear-gradient(180deg, #313132 0%, #29292A 25%, #1D1D1E 50%, #121213 75%, #0A0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #6E6E72 0%, #454548 30%, #262628 65%, #0A0A0B 100%)',
    activeShadow: '0 0 28px rgba(160, 160, 165, 0.45)',
  },
];

const depthTicks = [
  { label: '40', top: '14.84%', padded: true },
  { label: '30', top: '32.71%', padded: true },
  { label: '30', top: '50.40%', padded: true },
  { label: '20', top: '68.27%', padded: true },
  { label: '10', top: '85.96%', padded: true },
  { label: '0 mm', top: '100%', padded: false },
];

export default function ClinicalTech() {
  const [selectedWavelength, setSelectedWavelength] = useState(660);

  const active = wavelengths.find((w) => w.id === selectedWavelength) || wavelengths[3];

  return (
    <section
      id="clinical-technology"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-white py-14 sm:py-20 lg:py-0 lg:pt-[calc(166*var(--u))] lg:pb-[calc(164*var(--u))] overflow-hidden font-['Manrope']"
    >
      {/* Container aligned to PSD x=520..3323 (2803px width, 520px left / 517px right margins) */}
      <div className="clinical-container relative z-10 w-full px-5 sm:px-8 lg:px-0 lg:pl-[calc(520*var(--u))] lg:pr-[calc(517*var(--u))]">
        {/* Section Header */}
        <div>
          <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] uppercase tracking-[0.02em] text-white font-medium leading-none mb-2.5 sm:mb-3 lg:mb-[calc(47*var(--u))]">
            CLINICAL TECHNOLOGY
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight tracking-[0.02em] uppercase leading-tight lg:leading-none text-white">
            HOW FAR DOES EACH <span className="text-[#ED2024] font-medium">LIGHT REACH</span>?
          </h2>

          {/* Subtitle & PSD Line 1 */}
          <div className="mt-3 sm:mt-4 lg:mt-[calc(68*var(--u))] text-[#555555] text-xs sm:text-[15px] lg:text-[calc(41*var(--u))] leading-relaxed lg:leading-[calc(60*var(--u))] tracking-[0.02em] font-normal">
            <p>Red stays near the surface. Near-infrared travels deeper.</p>
            <div className="w-full h-px lg:h-[calc(2*var(--u))] bg-white/25 my-3 sm:my-4 lg:my-[calc(6*var(--u))]" />
            <p>Hover over a wavelength to see how far it goes.</p>
          </div>
        </div>

        {/* Active Information Bar matching PSD Group 3 / 4 / 4 copy / 5 / 5 copy (y=3935..4127) */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-[calc(525*var(--u))_calc(654*var(--u))_calc(707*var(--u))_calc(581*var(--u))_calc(336*var(--u))] gap-5 sm:gap-6 lg:gap-0 items-start mt-8 sm:mt-12 lg:mt-[calc(191*var(--u))] mb-8 sm:mb-12 lg:mb-[calc(109*var(--u))] transition-all duration-300">
          {/* Group 3: Active Wavelength & Target (x=519..867) */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] text-[#ED2024] font-normal tracking-[0.02em] leading-none mb-2 lg:mb-[calc(38*var(--u))]">
              {active.label}
            </p>
            <div className="flex items-baseline gap-1 lg:gap-[calc(11*var(--u))]">
              <span className="text-4xl sm:text-5xl lg:text-[calc(150*var(--u))] font-extralight text-white tracking-[0.02em] leading-[0.8]">
                {active.value}
              </span>
              <span className="text-sm sm:text-base lg:text-[calc(60*var(--u))] text-[#555555] font-extralight tracking-[0.02em] leading-none">
                {active.unit}
              </span>
            </div>
          </div>

          {/* Group 4: Primary Use (x=1045..1382) */}
          <div className="lg:pt-[calc(12*var(--u))]">
            <p className="text-xs lg:text-[calc(30*var(--u))] tracking-[0.02em] text-[#ED2024] font-extralight leading-none mb-1.5 lg:mb-[calc(39*var(--u))]">
              {active.primaryTitle}
            </p>
            <p className="text-xs sm:text-[13px] lg:text-[calc(32*var(--u))] text-white font-normal leading-snug lg:leading-[calc(52*var(--u))] tracking-[0.02em] whitespace-pre-line">
              {active.primaryDesc}
            </p>
          </div>

          {/* Group 4 copy: Secondary Use (x=1699..2089) */}
          <div className="lg:pt-[calc(12*var(--u))]">
            <p className="text-xs lg:text-[calc(30*var(--u))] tracking-[0.02em] text-[#555555] font-extralight leading-none mb-1.5 lg:mb-[calc(39*var(--u))]">
              {active.secondaryTitle}
            </p>
            <p className="text-xs sm:text-[13px] lg:text-[calc(32*var(--u))] text-white font-normal leading-snug lg:leading-[calc(52*var(--u))] tracking-[0.02em] whitespace-pre-line">
              {active.secondaryDesc}
            </p>
          </div>

          {/* Group 5: Approximate Depth (x=2406..2670) */}
          <div className="lg:pt-[calc(12*var(--u))]">
            <p className="text-xs lg:text-[calc(30*var(--u))] tracking-[0.02em] text-[#555555] font-extralight leading-none mb-1.5 lg:mb-[calc(38*var(--u))]">
              Approximate depth
            </p>
            <p className="text-lg sm:text-2xl lg:text-[calc(60*var(--u))] font-normal text-white tracking-[0.02em] leading-none lg:leading-[calc(52*var(--u))]">
              {active.depth}
            </p>
          </div>

          {/* Group 5 copy: Research behind it (x=2987..3300) */}
          <div className="lg:pt-[calc(12*var(--u))]">
            <p className="text-xs lg:text-[calc(30*var(--u))] tracking-[0.02em] text-[#555555] font-extralight leading-none mb-1.5 lg:mb-[calc(39*var(--u))]">
              Research behind it
            </p>
            <p className="text-xs sm:text-[13px] lg:text-[calc(32*var(--u))] text-white font-normal leading-snug lg:leading-[calc(52*var(--u))] tracking-[0.02em]">
              {active.research}
            </p>
          </div>
        </div>

        {/* Interactive Wavelength Penetration Depth Chart (y=4236..5361, height=1125px) */}
        <div className="relative w-full pt-8 sm:pt-10 lg:pt-0 pb-4 sm:pb-6 lg:pb-0 select-none">
          <div className="wavelength-chart relative w-full h-[300px] sm:h-[400px] md:h-[460px] lg:h-[calc(1125*var(--u))]">
            {/* Left Y-Axis Labels & Grid Lines (labels at x=567 / 522, lines at x=626..3323) */}
            {depthTicks.map((tick, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center -translate-y-1/2"
                style={{ top: tick.top }}
              >
                <span
                  className={`w-10 sm:w-12 lg:w-[calc(106*var(--u))] text-[10px] sm:text-xs lg:text-[calc(30*var(--u))] text-[#555555] font-normal tracking-[0.02em] text-left shrink-0 leading-none ${
                    tick.padded ? 'lg:pl-[calc(47*var(--u))]' : 'lg:pl-[calc(2*var(--u))]'
                  }`}
                >
                  {tick.label}
                </span>
                <div className="flex-1 h-px bg-white/[0.12]" />
              </div>
            ))}

            {/* Wavelength Pillars Container (x=655..3325 -> left=135px, 9 pillars x 270px with 30px gap) */}
            <div className="absolute left-10 sm:left-14 lg:left-[calc(135*var(--u))] right-0 top-0 bottom-0 grid grid-cols-9 gap-1.5 sm:gap-3 md:gap-4 lg:gap-[calc(30*var(--u))] px-0.5 sm:px-2 lg:px-0">
              {wavelengths.map((w) => {
                const isSelected = selectedWavelength === w.id;

                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWavelength(w.id)}
                    onMouseEnter={() => setSelectedWavelength(w.id)}
                    className="relative flex flex-col items-center h-full cursor-pointer group"
                  >
                    {/* Penetration Depth Pillar with exact PSD gradient */}
                    <div
                      className="absolute w-full rounded-t-[2px] transition-all duration-300 z-10"
                      style={{
                        top: `${w.topPercent}%`,
                        height: `${w.heightPercent}%`,
                        background: isSelected ? w.activeGradient : w.psdGradient,
                        boxShadow: isSelected ? w.activeShadow : 'none',
                      }}
                    />

                    {/* Depth Callout ("5 mm" at y=4360 over 670 in PSD, or active callout) */}
                    {(w.id === 670 || isSelected) && (
                      <div
                        className="absolute text-[9px] sm:text-[11px] lg:text-[calc(30*var(--u))] font-normal text-[#555555] tracking-[0.02em] whitespace-nowrap transition-all duration-300 z-30 leading-none"
                        style={{ top: `${w.calloutTopPercent}%` }}
                      >
                        {w.callout}
                      </div>
                    )}

                    {/* Wavelength Number Indicator (45px Manrope-Regular in PSD) */}
                    <div
                      className={`absolute text-[10px] sm:text-xs md:text-sm lg:text-[calc(45*var(--u))] font-normal tracking-[0.02em] transition-all duration-300 z-20 leading-none ${
                        isSelected
                          ? 'text-white'
                          : 'text-[#555555] group-hover:text-white/80'
                      }`}
                      style={{
                        top: `${w.labelTopPercent}%`,
                      }}
                    >
                      {w.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Selection Pills on Mobile / Touch */}
          <div className="mt-7 sm:mt-8 grid grid-cols-5 sm:grid-cols-9 md:hidden gap-1.5 sm:gap-2">
            {wavelengths.map((w) => (
              <button
                key={`btn-${w.id}`}
                type="button"
                onClick={() => setSelectedWavelength(w.id)}
                className={`py-2 px-1 rounded-[6px] text-[11px] font-medium text-center transition-all cursor-pointer ${
                  selectedWavelength === w.id
                    ? 'bg-[#ED2024] text-white font-semibold shadow-sm'
                    : 'bg-white/[0.06] text-white/70 hover:bg-white/10'
                }`}
              >
                {w.value} nm
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
