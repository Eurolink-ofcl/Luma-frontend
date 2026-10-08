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
    topPercent: 20.1,
    heightPercent: 60.2,
    callout: '50 mm',
  },
];

const depthTicks = [
  { label: '0 mm', top: '0%' },
  { label: '10', top: '20%' },
  { label: '20', top: '40%' },
  { label: '30', top: '60%' },
  { label: '40', top: '80%' },
  { label: '50', top: '100%' },
];

export default function ClinicalTech() {
  const [selectedWavelength, setSelectedWavelength] = useState(660);

  const active = wavelengths.find((w) => w.id === selectedWavelength) || wavelengths[3];

  return (
    <section
      id="clinical-technology"
      className="relative w-full bg-[#0a0a0a] text-white py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope'] border-t border-white/10"
    >
      {/* Full-bleed unboxed ambient red glow behind chart matching PSD Group 17 */}
      <div className="absolute inset-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_75%_50%_at_50%_35%,rgba(236,32,36,0.12),transparent_75%)] z-0" />

      <div className="clinical-container relative z-10 max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-6 lg:px-12 2xl:px-16 4xl:px-20">
        {/* Section Header */}
        <div className="max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl">
          <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-[0.24em] text-[#EC2024] font-semibold mb-3">
            CLINICAL TECHNOLOGY
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] 2xl:text-[56px] 4xl:text-[68px] font-bold tracking-tight uppercase leading-tight text-white">
            HOW FAR DOES EACH <span className="text-[#EC2024]">LIGHT</span> REACH?
          </h2>
          <p className="mt-4 text-white/70 text-sm sm:text-[15px] 2xl:text-base 4xl:text-lg leading-relaxed font-normal">
            Red stays near the surface. Near-infrared travels deeper.
            <br className="hidden sm:inline" />
            Hover over a wavelength to see how far it goes.
          </p>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-white/15 my-10 2xl:my-14 4xl:my-16" />

        {/* Active Information Bar matching PSD Group 3 / 4 / 5 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 2xl:gap-12 4xl:gap-16 items-start mb-14 2xl:mb-20 min-h-[90px] 2xl:min-h-[110px] transition-all duration-300">
          {/* Active Wavelength & Target */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs sm:text-sm 2xl:text-base text-[#EC2024] font-semibold tracking-wide mb-1">
              {active.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl lg:text-[54px] 2xl:text-[68px] 4xl:text-[80px] font-semibold text-white tracking-tight leading-none">
                {active.value}
              </span>
              <span className="text-sm sm:text-base 2xl:text-xl 4xl:text-2xl text-white/60 font-medium">
                {active.unit}
              </span>
            </div>
          </div>

          {/* Primary Use */}
          <div>
            <p className="text-xs 2xl:text-sm 4xl:text-base uppercase tracking-wider text-[#EC2024] font-medium mb-1.5">
              {active.primaryTitle}
            </p>
            <p className="text-xs sm:text-[13px] 2xl:text-[15px] 4xl:text-[17px] text-white/75 leading-snug">
              {active.primaryDesc}
            </p>
          </div>

          {/* Secondary Use */}
          <div>
            <p className="text-xs 2xl:text-sm 4xl:text-base uppercase tracking-wider text-white/45 font-medium mb-1.5">
              {active.secondaryTitle}
            </p>
            <p className="text-xs sm:text-[13px] 2xl:text-[15px] 4xl:text-[17px] text-white/75 leading-snug">
              {active.secondaryDesc}
            </p>
          </div>

          {/* Approximate Depth */}
          <div>
            <p className="text-xs 2xl:text-sm 4xl:text-base uppercase tracking-wider text-white/45 font-medium mb-1.5">
              Approximate depth
            </p>
            <p className="text-lg sm:text-2xl 2xl:text-3xl 4xl:text-4xl font-light text-white tracking-tight">
              {active.depth}
            </p>
          </div>

          {/* Research behind it */}
          <div>
            <p className="text-xs 2xl:text-sm 4xl:text-base uppercase tracking-wider text-white/45 font-medium mb-1.5">
              Research behind it
            </p>
            <p className="text-xs sm:text-[13px] 2xl:text-[15px] 4xl:text-[17px] text-white/75 leading-snug">
              {active.research}
            </p>
          </div>
        </div>

        {/* Interactive Wavelength Penetration Depth Chart */}
        <div className="relative w-full pt-10 pb-6 select-none">
          {/* Left Y-Axis Labels & Grid Lines */}
          <div className="wavelength-chart relative w-full h-[460px] md:h-[500px] 2xl:h-[600px] 4xl:h-[720px]">
            {depthTicks.map((tick, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center"
                style={{ top: tick.top }}
              >
                {/* Y-axis depth label */}
                <span className="w-12 text-xs text-white/40 font-mono text-left shrink-0">
                  {tick.label}
                </span>
                {/* Grid line across chart */}
                <div className="flex-1 h-px bg-white/10" />
              </div>
            ))}

            {/* Wavelength Pillars Container */}
            <div className="absolute left-14 right-0 top-0 bottom-0 grid grid-cols-9 gap-2 sm:gap-4 md:gap-6 lg:gap-7 px-2 sm:px-6">
              {wavelengths.map((w) => {
                const isSelected = selectedWavelength === w.id;

                // Color styling per wavelength type matching PSD samples
                let barStyle = '';
                if (w.type === 'blue') {
                  barStyle = isSelected
                    ? 'bg-gradient-to-b from-[#2b4fa2] to-[#162752] shadow-[0_0_24px_rgba(43,79,162,0.8)]'
                    : 'bg-[#182444] hover:bg-[#203460]';
                } else if (w.type === 'red') {
                  barStyle = isSelected
                    ? 'bg-gradient-to-b from-[#EC2024] to-[#771417] shadow-[0_0_28px_rgba(236,32,36,0.7)]'
                    : 'bg-[#2f1315] hover:bg-[#481c1f]';
                } else if (w.type === 'nir') {
                  barStyle = isSelected
                    ? 'bg-gradient-to-b from-[#c0262b] via-[#5c191b] to-[#150607] shadow-[0_0_28px_rgba(192,38,43,0.6)]'
                    : 'bg-gradient-to-b from-[#431a1b] via-[#2d1213] to-[#120708] hover:from-[#582224] hover:to-[#1a0a0b]';
                } else if (w.type === 'silver') {
                  barStyle = isSelected
                    ? 'bg-gradient-to-b from-[#d1d5db] via-[#6b7280] to-[#1f2937] shadow-[0_0_24px_rgba(209,213,219,0.5)]'
                    : 'bg-gradient-to-b from-[#3d3d3e] via-[#29292a] to-[#121213] hover:from-[#505052]';
                }

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
                        className="absolute text-[11px] font-mono text-white/90 bg-black/90 px-2 py-0.5 rounded border border-white/20 whitespace-nowrap transition-all duration-300 z-30 shadow-md"
                        style={{ top: `calc(${w.topPercent}% - 48px)` }}
                      >
                        {w.callout}
                      </div>
                    )}

                    {/* Wavelength Number Indicator */}
                    <div
                      className={`absolute text-xs sm:text-sm font-medium transition-all duration-300 z-20 ${
                        isSelected
                          ? 'text-white font-bold scale-110'
                          : 'text-white/45 group-hover:text-white/80'
                      }`}
                      style={{ top: `calc(${w.topPercent}% - 24px)` }}
                    >
                      {w.value}
                    </div>

                    {/* Penetration Depth Pillar */}
                    <div
                      className={`absolute w-full rounded-t-[2px] transition-all duration-300 ${barStyle}`}
                      style={{
                        top: `${w.topPercent}%`,
                        height: `${w.heightPercent}%`,
                      }}
                    >
                      {/* Subtle Top Specular Highlight */}
                      {isSelected && (
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-white/60 rounded-t-[2px] pointer-events-none" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Selection Pills on Mobile / Touch */}
          <div className="mt-8 flex md:hidden items-center justify-start gap-2 overflow-x-auto pb-2 scrollbar-none">
            {wavelengths.map((w) => (
              <button
                key={`btn-${w.id}`}
                onClick={() => setSelectedWavelength(w.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono shrink-0 transition-all ${
                  selectedWavelength === w.id
                    ? 'bg-[#EC2024] text-white font-bold shadow'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
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
