import React from 'react';

const SPEC_ROWS = [
  {
    id: 'wavelengths',
    label: 'WAVELENGTHS',
    lines: ['460NM:665NM:850NM:1064NM'],
  },
  {
    id: 'chips',
    label: 'CHIPS',
    lines: [
      '236 CHIPS: 72 × 460NM (LED), 72 × 665NM,',
      '72 × 850NM, 20 × 1064NM',
    ],
  },
  {
    id: 'output-power',
    label: 'OUTPUT POWER',
    lines: ['5W'],
  },
  {
    id: 'modes',
    label: 'MODES',
    lines: [
      'M1 GLOW BOOST (RED + NEAR-INFRARED) ·',
      'M2 CLEAR SKIN (BLUE + NEAR-INFRARED)',
    ],
  },
  {
    id: 'brightness',
    label: 'BRIGHTNESS',
    lines: ['3 LEVELS (LOW, MEDIUM, HIGH)'],
  },
  {
    id: 'timer',
    label: 'TIMER',
    lines: ['T1: 5-15 MINUTES · T2: 5-10 MINUTES · T3: 10-15 MINUTES'],
  },
  {
    id: 'battery-size',
    label: 'BATTERY SIZE',
    lines: ['1440MAH'],
  },
  {
    id: 'battery-performance',
    label: 'BATTERY PERFORMANCE',
    lines: ['35 MINUTES'],
  },
  {
    id: 'charging',
    label: 'CHARGING',
    lines: ['USB-C, 3 HOURS'],
  },
  {
    id: 'dimensions',
    label: 'DIMENSIONS',
    lines: ['640 X 220 X 5.8 MM'],
  },
  {
    id: 'weight',
    label: 'WEIGHT',
    lines: ['340G'],
  },
  {
    id: 'warranty',
    label: 'WARRANTY',
    lines: ['1 YEAR'],
  },
];

export default function LumaGlowSpecsSection() {
  return (
    <section
      id="luma-glow-specifications"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#000000] text-[#FFFFFF] font-['Manrope'] select-none pt-12 sm:pt-20 md:pt-24 lg:pt-28 2xl:pt-[calc(167*var(--u))] pb-16 sm:pb-28 md:pb-32 lg:pb-36 2xl:pb-[calc(423*var(--u))] overflow-hidden"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-[calc(307*var(--u))]">
        {/* Section Heading: LUMA GLOW SPECIFICATIONS (Centered, Manrope-Regular, 45px at 3840w, #ED2024, tracking 0.02em) */}
        <div className="w-full text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16 2xl:mb-[calc(166*var(--u))]">
          <h2 className="text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[calc(45*var(--u))] font-normal uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            LUMA GLOW &nbsp;SPECIFICATIONS
          </h2>
        </div>

        {/* Main Content Layout: Left 3D Mask Image + Right Specifications Table */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,420px)_1fr] xl:grid-cols-[minmax(340px,460px)_1fr] 2xl:grid-cols-[calc(1104*var(--u))_calc(1762*var(--u))] gap-6 sm:gap-8 lg:gap-8 xl:gap-10 2xl:gap-[calc(60*var(--u))] items-center justify-between">
          
          {/* ==================== LEFT COLUMN: 3D PERSPECTIVE MASK ==================== */}
          <div className="w-full flex items-center justify-center lg:justify-start">
            <div className="relative w-full max-w-[240px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-none 2xl:w-[calc(1217*var(--u))] aspect-[1217/1039]">
              <picture>
                <source srcSet="/assets/glow/spec-glow-mask.webp" type="image/webp" />
                <img
                  src="/assets/glow/spec-glow-mask.png"
                  alt="LUMA GLOW Mask Perspective Specification View"
                  className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                  draggable={false}
                />
              </picture>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: SPECIFICATIONS TABLE ==================== */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[960px] xl:max-w-[1040px] 2xl:max-w-[calc(1762*var(--u))] rounded-[14px] sm:rounded-[20px] 2xl:rounded-[calc(27*var(--u))] border border-[#444444] overflow-hidden bg-[#000000] shadow-2xl">
              <div className="w-full divide-y divide-[#444444]">
                {SPEC_ROWS.map((row) => (
                  <div
                    key={row.id}
                    className={`flex flex-row items-stretch w-full transition-colors hover:bg-white/[0.02] ${
                      row.lines.length > 1
                        ? 'min-h-[50px] sm:min-h-[66px] lg:min-h-[72px] xl:min-h-[78px] 2xl:min-h-[calc(165*var(--u))]'
                        : 'min-h-[38px] sm:min-h-[46px] lg:min-h-[48px] xl:min-h-[52px] 2xl:min-h-[calc(83*var(--u))]'
                    }`}
                  >
                    {/* Left Cell: Specification Label (Self-stretches to full row height so border-r has ZERO gap with horizontal dividers) */}
                    <div className="w-[36%] sm:w-[32%] lg:w-[30%] xl:w-[32%] 2xl:w-[calc(775/1762*100%)] shrink-0 self-stretch pl-3 sm:pl-5 md:pl-6 lg:pl-7 xl:pl-8 2xl:pl-[calc(125*var(--u))] pr-2 sm:pr-3 py-2 sm:py-2.5 2xl:py-[calc(20*var(--u))] border-r border-[#444444] flex items-center">
                      <span className="text-[9.5px] sm:text-[11px] md:text-[11.5px] lg:text-[12px] xl:text-[13px] 2xl:text-[calc(30*var(--u))] font-light uppercase tracking-[0.02em] text-[#FFFFFF] sm:whitespace-nowrap leading-tight">
                        {row.label}
                      </span>
                    </div>

                    {/* Right Cell: Specification Value (Self-stretches to full row height) */}
                    <div className="flex-1 self-stretch pl-3 sm:pl-5 md:pl-6 lg:pl-7 xl:pl-8 2xl:pl-[calc(119*var(--u))] pr-2.5 sm:pr-4 md:pr-6 2xl:pr-[calc(80*var(--u))] py-2 sm:py-2.5 2xl:py-[calc(20*var(--u))] flex items-center">
                      <div className="flex flex-col text-[9.5px] sm:text-[11px] md:text-[11.5px] lg:text-[12px] xl:text-[13px] 2xl:text-[calc(30*var(--u))] font-light uppercase tracking-[0.02em] text-[#FFFFFF] leading-[1.35] sm:leading-[1.38] 2xl:leading-[1.5]">
                        {row.lines.map((line, idx) => (
                          <span
                            key={idx}
                            className="block whitespace-normal sm:whitespace-nowrap"
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
