import React from 'react';

const GO_SPEC_ROWS = [
  {
    id: 'wavelengths',
    label: 'WAVELENGTHS',
    lines: ['660NM'],
  },
  {
    id: 'battery-size',
    label: 'BATTERY SIZE',
    lines: ['7.4V 2500MAH'],
  },
  {
    id: 'battery-performance',
    label: 'BATTERY PERFORMANCE',
    lines: ['2 HOURS'],
  },
  {
    id: 'dimensions',
    label: 'DIMENSIONS',
    lines: ['140 X 70 X 29 MM'],
  },
  {
    id: 'power-consumption',
    label: 'POWER CONSUMPTION',
    lines: ['7.2W'],
  },
  {
    id: 'beam-angle',
    label: 'BEAM ANGLE',
    lines: ['30 DEGREE'],
  },
  {
    id: 'timer',
    label: 'TIMER',
    lines: ['30-0 MINUTES ADJUSTABLE'],
  },
  {
    id: 'pulse',
    label: 'PULSE',
    lines: ['40-0 HERTZ ADJUSTABLE (ONLY FOR NIR LEDS)'],
  },
  {
    id: 'charging-time',
    label: 'CHARGING TIME',
    lines: ['1.5H (TYPE-C)'],
  },
  {
    id: 'weight',
    label: 'WEIGHT',
    lines: ['244G'],
  },
  {
    id: 'led-lifespan',
    label: 'LED LIFESPAN',
    lines: ['50,000HRS'],
  },
];

export default function LumaGoSpecsSection() {
  return (
    <section
      id="luma-go-specifications"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#000000] text-[#FFFFFF] font-['Manrope'] select-none pt-12 sm:pt-20 md:pt-24 lg:pt-28 2xl:pt-[calc(167*var(--u))] pb-16 sm:pb-28 md:pb-32 lg:pb-36 2xl:pb-[calc(423*var(--u))] overflow-hidden"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-[calc(307*var(--u))]">
        {/* Section Heading: LUMA GO SPECIFICATIONS */}
        <div className="w-full text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16 2xl:mb-[calc(166*var(--u))]">
          <h2 className="text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[calc(45*var(--u))] font-normal uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            LUMA GO &nbsp;SPECIFICATIONS
          </h2>
        </div>

        {/* Main Content Layout: Left 3D Device Cutout + Right Specifications Table */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,420px)_1fr] xl:grid-cols-[minmax(340px,460px)_1fr] 2xl:grid-cols-[calc(1104*var(--u))_calc(1762*var(--u))] gap-6 sm:gap-8 lg:gap-8 xl:gap-10 2xl:gap-[calc(60*var(--u))] items-center justify-between">
          
          {/* ==================== LEFT COLUMN: 3D DEVICE VIEW ==================== */}
          <div className="w-full flex items-center justify-center lg:justify-start">
            <div className="relative w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-none 2xl:w-[calc(618*var(--u))] aspect-[618/817]">
              <picture>
                <source srcSet="/assets/go/spec-go-device.webp" type="image/webp" />
                <img
                  src="/assets/go/spec-go-device.png"
                  alt="LUMA GO Device Specification Perspective View"
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
                {GO_SPEC_ROWS.map((row) => (
                  <div
                    key={row.id}
                    className={`flex flex-row items-stretch w-full transition-colors hover:bg-white/[0.02] ${
                      row.lines.length > 1
                        ? 'min-h-[50px] sm:min-h-[66px] lg:min-h-[72px] xl:min-h-[78px] 2xl:min-h-[calc(165*var(--u))]'
                        : 'min-h-[38px] sm:min-h-[46px] lg:min-h-[48px] xl:min-h-[52px] 2xl:min-h-[calc(83*var(--u))]'
                    }`}
                  >
                    {/* Left Cell: Specification Label (Full-height stretch with seamless border-r) */}
                    <div className="w-[36%] sm:w-[32%] lg:w-[30%] xl:w-[32%] 2xl:w-[calc(775/1762*100%)] shrink-0 self-stretch pl-3 sm:pl-5 md:pl-6 lg:pl-7 xl:pl-8 2xl:pl-[calc(125*var(--u))] pr-2 sm:pr-3 py-2 sm:py-2.5 2xl:py-[calc(20*var(--u))] border-r border-[#444444] flex items-center">
                      <span className="text-[9.5px] sm:text-[11px] md:text-[11.5px] lg:text-[12px] xl:text-[13px] 2xl:text-[calc(30*var(--u))] font-light uppercase tracking-[0.02em] text-[#FFFFFF] sm:whitespace-nowrap leading-tight">
                        {row.label}
                      </span>
                    </div>

                    {/* Right Cell: Specification Value */}
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

