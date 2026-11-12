import React from 'react';

const NOVA_SPEC_ROWS = [
  {
    id: 'wavelengths',
    label: 'WAVELENGTHS',
    lines: ['590NM:630NM:660NM:670NM', '810NM:830NM:850NM:1060NM'],
  },
  {
    id: 'amps-120v',
    label: 'AMPS @120V',
    lines: ['0.89A'],
  },
  {
    id: 'amps-220v',
    label: 'AMPS @220V',
    lines: ['0.5A'],
  },
  {
    id: 'dimensions',
    label: 'DIMENSIONS',
    lines: ['26.9 X 23 X 5.4 CM'],
  },
  {
    id: 'power-consumption',
    label: 'POWER CONSUMPTION',
    lines: ['104W'],
  },
  {
    id: 'leds',
    label: 'LEDS',
    lines: ['60 X 5 W LEDS'],
  },
  {
    id: 'beam-angle',
    label: 'BEAM ANGLE',
    lines: ['30 DEGREES FOR NIR, 60 DEGREES FOR RED'],
  },
  {
    id: 'timer',
    label: 'TIMER',
    lines: ['1-30 MINUTES ADJUSTABLE'],
  },
  {
    id: 'pulse',
    label: 'PULSE',
    lines: ['0-9,999 HERTZ ADJUSTABLE (ONLY FOR NIR LEDS)'],
  },
  {
    id: 'dimmable',
    label: 'DIMMABLE',
    lines: ['0%-100%'],
  },
  {
    id: 'weight',
    label: 'WEIGHT',
    lines: ['2.8 KG / 6.17 LB'],
  },
  {
    id: 'led-lifespan',
    label: 'LED LIFESPAN',
    lines: ['50,000HRS'],
  },
  {
    id: 'emf-emission',
    label: 'EMF EMISSION',
    lines: ['-NEGLIGIBLE'],
  },
  {
    id: 'warranty',
    label: 'WARRANTY',
    lines: ['3 YEARS'],
  },
  {
    id: 'best-for',
    label: 'BEST FOR',
    lines: ['TARGETED'],
  },
  {
    id: 'max-area',
    label: 'MAX AREA',
    lines: ['71 X 55 CM'],
  },
];

export default function LumaNovaSpecsSection() {
  return (
    <section
      id="luma-nova-specifications"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#000000] text-[#FFFFFF] font-['Manrope'] select-none pt-12 sm:pt-20 md:pt-24 lg:pt-28 2xl:pt-[calc(167*var(--u))] pb-16 sm:pb-28 md:pb-32 lg:pb-36 2xl:pb-[calc(423*var(--u))] overflow-hidden"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-[calc(307*var(--u))]">
        {/* Section Heading: LUMA NOVA SPECIFICATIONS */}
        <div className="w-full text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16 2xl:mb-[calc(166*var(--u))]">
          <h2 className="text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[calc(45*var(--u))] font-normal uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            LUMA NOVA &nbsp;SPECIFICATIONS
          </h2>
        </div>

        {/* Main Content Layout: Left 3D Device Cutout + Right Specifications Table */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,440px)_1fr] xl:grid-cols-[minmax(360px,480px)_1fr] 2xl:grid-cols-[calc(1104*var(--u))_calc(1762*var(--u))] gap-6 sm:gap-8 lg:gap-8 xl:gap-10 2xl:gap-[calc(60*var(--u))] items-center justify-between">
          
          {/* ==================== LEFT COLUMN: 3D DEVICE VIEW ==================== */}
          <div className="w-full flex items-center justify-center lg:justify-start">
            <div className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-none 2xl:w-[calc(531*var(--u))] aspect-[531/798]">
              <picture>
                <source srcSet="/assets/nova/spec-nova-device.webp" type="image/webp" />
                <img
                  src="/assets/nova/spec-nova-device.png"
                  alt="LUMA NOVA Device Specification Perspective View"
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
                {NOVA_SPEC_ROWS.map((row) => (
                  <div
                    key={row.id}
                    className={`flex flex-row items-stretch w-full transition-colors hover:bg-white/[0.02] ${
                      row.lines.length > 1
                        ? 'min-h-[50px] sm:min-h-[66px] lg:min-h-[72px] xl:min-h-[78px] 2xl:min-h-[calc(115*var(--u))]'
                        : 'min-h-[38px] sm:min-h-[46px] lg:min-h-[48px] xl:min-h-[52px] 2xl:min-h-[calc(80*var(--u))]'
                    }`}
                  >
                    {/* Left Cell: Specification Label (Full-height stretch with seamless border-r) */}
                    <div className="w-[36%] sm:w-[32%] lg:w-[30%] xl:w-[32%] 2xl:w-[calc(775/1762*100%)] shrink-0 self-stretch pl-3 sm:pl-5 md:pl-6 lg:pl-7 xl:pl-8 2xl:pl-[calc(125*var(--u))] pr-2 sm:pr-3 py-2 sm:py-2.5 2xl:py-[calc(18*var(--u))] border-r border-[#444444] flex items-center">
                      <span className="text-[9.5px] sm:text-[11px] md:text-[11.5px] lg:text-[12px] xl:text-[13px] 2xl:text-[calc(30*var(--u))] font-light uppercase tracking-[0.02em] text-[#FFFFFF] sm:whitespace-nowrap leading-tight">
                        {row.label}
                      </span>
                    </div>

                    {/* Right Cell: Specification Value */}
                    <div className="flex-1 self-stretch pl-3 sm:pl-5 md:pl-6 lg:pl-7 xl:pl-8 2xl:pl-[calc(119*var(--u))] pr-2.5 sm:pr-4 md:pr-6 2xl:pr-[calc(80*var(--u))] py-2 sm:py-2.5 2xl:py-[calc(18*var(--u))] flex items-center">
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

