import React, { useState } from 'react';

const wavelengths = [
  {
    id: 480,
    value: '480',
    unit: 'nm',
    label: 'Skin surface',
    primaryTitle: 'Primary',
    primaryDesc: 'Blemish & acne control routines.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Surface purification and anti-bacterial support.',
    depth: '1 to 2 mm',
    research: 'Well documented for surface acne.',
    type: 'blue',
    topPercent: 48.6,
    heightPercent: 3.0,
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
    primaryDesc: 'Cellular glow & tone evening.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Fine line smoothing and skin brightening.',
    depth: '2 to 3 mm',
    research: 'Extensively studied for tone.',
    type: 'red',
    topPercent: 46.8,
    heightPercent: 5.6,
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
    primaryDesc: 'Fibroblast & elasticity support.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Collagen matrix enhancement and plumpness.',
    depth: '3 to 4 mm',
    research: 'Proven dermal density increase.',
    type: 'red',
    topPercent: 45.7,
    heightPercent: 7.6,
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
    primaryDesc: 'Skin, collagen support and scalp routines.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Skin recovery and healing-support routines.',
    depth: '1 to 5 mm',
    research: 'Well studied for skin.',
    type: 'red',
    topPercent: 45.0,
    heightPercent: 7.6,
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
    primaryDesc: 'Mitochondrial cytochrome c recharge.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Accelerated cellular energy and cellular repair.',
    depth: '4 to 5 mm',
    research: 'Benchmark for photobiomodulation.',
    type: 'red',
    topPercent: 44.5,
    heightPercent: 6.6,
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
    primaryDesc: 'Deep connective and neural tissue repair.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Relief for deep muscle strain and trauma.',
    depth: '10 to 30 mm',
    research: 'Studied for deep tissue repair.',
    type: 'nir',
    topPercent: 20.2,
    heightPercent: 60.1,
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
    primaryDesc: 'Micro-vascularization and tendon repair.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Accelerated bone healing and joint soothing.',
    depth: '15 to 35 mm',
    research: 'Clinically validated for healing.',
    type: 'nir',
    topPercent: 20.2,
    heightPercent: 60.1,
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
    primaryDesc: 'Athletic muscle recovery and lactate clearance.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Relief for deep tendon inflammation and stiffness.',
    depth: '20 to 45 mm',
    research: 'Elite athletic benchmark.',
    type: 'nir',
    topPercent: 9.7,
    heightPercent: 70.6,
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
    primaryDesc: 'Maximum tissue depth penetration.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Bypasses surface water absorption for systemic vitality.',
    depth: '30 to 50 mm',
    research: 'Cutting-edge clinical wavelength.',
    type: 'silver',
    topPercent: 3.4,
    heightPercent: 76.9,
    callout: '50 mm',
    psdGradient: 'linear-gradient(180deg, #313132 0%, #29292A 25%, #1D1D1E 50%, #121213 75%, #0A0A0B 100%)',
    activeGradient: 'linear-gradient(180deg, #6E6E72 0%, #454548 30%, #262628 65%, #0A0A0B 100%)',
    activeShadow: '0 0 28px rgba(160, 160, 165, 0.45)',
  },
];

const depthTicks = [
  { label: '40', top: '20%' },
  { label: '30', top: '40%' },
  { label: '30', top: '60%' },
  { label: '20', top: '80%' },
  { label: '10', top: '90%' },
  { label: '0 mm', top: '100%' },
];

export default function ClinicalTech() {
  const [selectedWavelength, setSelectedWavelength] = useState(660);

  const active = wavelengths.find((w) => w.id === selectedWavelength) || wavelengths[3];

  return (
    <section
      id="clinical-technology"
      className="relative w-full bg-[#0A0A0B] text-white py-14 sm:py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope']"
    >
      <div className="clinical-container relative z-10 max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-4 sm:px-6 lg:px-12 2xl:px-16 4xl:px-20">
        {/* Section Header */}
        <div className="max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl">
          <p className="text-xs sm:text-sm 2xl:text-[15.2px] 4xl:text-[22.8px] uppercase tracking-[0.02em] text-white font-medium mb-2.5 sm:mb-3">
            CLINICAL TECHNOLOGY
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] 2xl:text-[30.4px] 4xl:text-[45.5px] font-extralight tracking-tight uppercase leading-tight text-white">
            HOW FAR DOES EACH <span className="text-[#ED2024]">LIGHT REACH</span>?
          </h2>
          <p className="mt-3 sm:mt-4 text-[#555555] text-xs sm:text-[15px] 2xl:text-[20px] 4xl:text-[30px] leading-relaxed font-normal">
            Red stays near the surface. Near-infrared travels deeper.
            <br className="hidden sm:inline" />
            Hover over a wavelength to see how far it goes.
          </p>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-white/20 my-7 sm:my-10 2xl:my-14 4xl:my-16" />

        {/* Active Information Bar matching PSD Group 3 / 4 / 5 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 sm:gap-6 lg:gap-8 2xl:gap-12 4xl:gap-16 items-start mb-8 sm:mb-14 2xl:mb-20 min-h-[90px] 2xl:min-h-[110px] transition-all duration-300">
          {/* Active Wavelength & Target */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs sm:text-sm 2xl:text-[15px] text-[#ED2024] font-normal tracking-wide mb-1">
              {active.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl lg:text-[54px] 2xl:text-[56.9px] 4xl:text-[85.4px] font-extralight text-white tracking-tight leading-none">
                {active.value}
              </span>
              <span className="text-sm sm:text-base 2xl:text-[22.8px] 4xl:text-[34.2px] text-[#555555] font-extralight">
                {active.unit}
              </span>
            </div>
          </div>

          {/* Primary Use */}
          <div>
            <p className="text-xs 2xl:text-[11.4px] 4xl:text-[17.1px] tracking-wide text-[#ED2024] font-light mb-1">
              {active.primaryTitle}
            </p>
            <p className="text-xs sm:text-[13px] 2xl:text-[16px] 4xl:text-[21.3px] text-white/85 font-normal leading-snug">
              {active.primaryDesc}
            </p>
          </div>

          {/* Secondary Use */}
          <div>
            <p className="text-xs 2xl:text-[11.4px] 4xl:text-[17.1px] tracking-wide text-[#555555] font-light mb-1">
              {active.secondaryTitle}
            </p>
            <p className="text-xs sm:text-[13px] 2xl:text-[16px] 4xl:text-[21.3px] text-white/85 font-normal leading-snug">
              {active.secondaryDesc}
            </p>
          </div>

          {/* Approximate Depth */}
          <div>
            <p className="text-xs 2xl:text-[11.4px] 4xl:text-[17.1px] tracking-wide text-[#555555] font-light mb-1">
              Approximate depth
            </p>
            <p className="text-lg sm:text-2xl 2xl:text-[40px] 4xl:text-[60px] font-normal text-white tracking-tight">
              {active.depth}
            </p>
          </div>

          {/* Research behind it */}
          <div>
            <p className="text-xs 2xl:text-[11.4px] 4xl:text-[17.1px] tracking-wide text-[#555555] font-light mb-1">
              Research behind it
            </p>
            <p className="text-xs sm:text-[13px] 2xl:text-[16px] 4xl:text-[21.3px] text-white/85 font-normal leading-snug">
              {active.research}
            </p>
          </div>
        </div>

        {/* Interactive Wavelength Penetration Depth Chart */}
        <div className="relative w-full pt-12 sm:pt-10 pb-4 sm:pb-6 select-none">
          {/* Left Y-Axis Labels & Grid Lines */}
          <div className="wavelength-chart relative w-full h-[320px] sm:h-[420px] md:h-[500px] 2xl:h-[600px] 4xl:h-[720px]">
            {depthTicks.map((tick, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center"
                style={{ top: tick.top }}
              >
                {/* Y-axis depth label */}
                <span className="w-9 sm:w-12 text-[10px] sm:text-xs text-[#555555] font-normal text-left shrink-0">
                  {tick.label}
                </span>
                {/* Grid line across chart */}
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>
            ))}

            {/* Wavelength Pillars Container */}
            <div className="absolute left-10 sm:left-14 right-0 top-0 bottom-0 grid grid-cols-9 gap-1.5 sm:gap-4 md:gap-6 lg:gap-7 px-0.5 sm:px-6">
              {wavelengths.map((w) => {
                const isSelected = selectedWavelength === w.id;

                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWavelength(w.id)}
                    onMouseEnter={() => setSelectedWavelength(w.id)}
                    className="relative flex flex-col items-center h-full cursor-pointer group"
                  >
                    {/* Floating Callout Tag */}
                    {isSelected && (
                      <div
                        className={`absolute text-[10px] sm:text-[11px] font-normal text-[#555555] whitespace-nowrap transition-all duration-300 z-30 ${
                          w.id === 1060 ? 'right-0 sm:right-auto' : w.id === 480 ? 'left-0 sm:left-auto' : ''
                        }`}
                        style={{ top: `calc(${w.topPercent}% - 42px)` }}
                      >
                        {w.callout}
                      </div>
                    )}

                    {/* Wavelength Number Indicator (always cleanly above the bar) */}
                    <div
                      className={`absolute text-[10px] sm:text-xs md:text-sm font-normal transition-all duration-300 z-20 leading-none ${
                        isSelected
                          ? 'text-white font-semibold'
                          : 'text-[#666666] group-hover:text-white/80'
                      }`}
                      style={{
                        top: `calc(${w.topPercent}% - 20px)`,
                      }}
                    >
                      {w.value}
                    </div>

                    {/* Penetration Depth Pillar with exact PSD gradient */}
                    <div
                      className="absolute w-full rounded-t-[2px] transition-all duration-300"
                      style={{
                        top: `${w.topPercent}%`,
                        height: `${w.heightPercent}%`,
                        background: isSelected ? w.activeGradient : w.psdGradient,
                        boxShadow: isSelected ? w.activeShadow : 'none',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Selection Pills on Mobile / Touch — wrapped grid so no button is cut off */}
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
