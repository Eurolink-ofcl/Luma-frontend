import React from 'react';

const trustItems = [
  {
    icon: '/assets/energy_14368783.png',
    iconAlt: 'Energy icon',
    iconSize: 'h-4 w-4 lg:w-[calc(39*var(--u))] lg:h-[calc(39*var(--u))]',
    gapClass: 'gap-2 lg:gap-[calc(12*var(--u))]',
    content: (
      <span className="text-[#FFFFFF] font-light tracking-[0em] text-[12px] lg:text-[calc(25*var(--u))] leading-none uppercase">
        ONE &amp; ONLY 8-WAVELENGTH PANEL
      </span>
    ),
  },
  {
    icon: null,
    gapClass: 'gap-0',
    content: (
      <span className="text-[12px] lg:text-[calc(25*var(--u))] leading-none uppercase tracking-[0em]">
        <span className="text-[#EC2024] font-normal">CERTIFIED:</span>{' '}
        <span className="text-[#FFFFFF] font-light">BSCI - ISO9001 - ISO14001 - ISO45001</span>
      </span>
    ),
  },
  {
    icon: '/assets/best_13654983.png',
    iconAlt: 'MDSAP Badge',
    iconSize: 'h-3.5 w-auto lg:w-[calc(26*var(--u))] lg:h-[calc(24*var(--u))]',
    gapClass: 'gap-1.5 lg:gap-[calc(7*var(--u))]',
    content: (
      <span className="text-[#FFFFFF] font-light tracking-[0em] text-[12px] lg:text-[calc(25*var(--u))] leading-none uppercase">
        MDSAP CERTIFIED
      </span>
    ),
  },
  {
    icon: '/assets/protect_10831389.png',
    iconAlt: 'CE Shield',
    iconSize: 'h-3.5 w-auto lg:w-[calc(23*var(--u))] lg:h-[calc(29*var(--u))]',
    gapClass: 'gap-1.5 lg:gap-[calc(9*var(--u))]',
    content: (
      <span className="text-[#FFFFFF] font-light tracking-[0em] text-[12px] lg:text-[calc(25*var(--u))] leading-none uppercase">
        CE CERTIFIED
      </span>
    ),
  },
  {
    icon: '/assets/delivery-truck.png',
    iconAlt: 'Delivery Truck',
    iconSize: 'h-3.5 w-auto lg:w-[calc(47*var(--u))] lg:h-[calc(26*var(--u))]',
    gapClass: 'gap-2 lg:gap-[calc(13*var(--u))]',
    content: (
      <span className="text-[#FFFFFF] font-light tracking-[0em] text-[12px] lg:text-[calc(25*var(--u))] leading-none uppercase">
        FREE GLOBAL DELIVERY
      </span>
    ),
  },
];

export default function TrustStrip() {
  return (
    <section
      id="trust-strip"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#000000] overflow-hidden py-3.5 lg:py-0 lg:h-[calc(102*var(--u))] flex items-center z-20"
    >
      {/* Desktop static layout matched to PSD (3840px canvas: x=502..3459, h=102) */}
      <div className="trust-container hidden lg:flex items-center justify-between w-full lg:pl-[calc(502*var(--u))] lg:pr-[calc(381*var(--u))] font-['Manrope']">
        {trustItems.map((item, idx) => (
          <div key={idx} className={`flex items-center ${item.gapClass} whitespace-nowrap`}>
            {item.icon && (
              <img
                src={item.icon}
                alt={item.iconAlt || ''}
                className={`${item.iconSize} object-contain shrink-0`}
              />
            )}
            {item.content}
          </div>
        ))}
      </div>

      {/* Responsive continuous marquee ticker for medium and small screens */}
      <div className="lg:hidden flex w-full items-center overflow-hidden font-['Manrope'] select-none">
        <div className="flex shrink-0 items-center gap-8 animate-marquee pl-4 pr-4">
          {trustItems.map((item, idx) => (
            <div key={`m1-${idx}`} className={`flex items-center ${item.gapClass} whitespace-nowrap`}>
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.iconAlt || ''}
                  className={`${item.iconSize} object-contain shrink-0`}
                />
              )}
              {item.content}
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-8 animate-marquee pl-4 pr-4" aria-hidden="true">
          {trustItems.map((item, idx) => (
            <div key={`m2-${idx}`} className={`flex items-center ${item.gapClass} whitespace-nowrap`}>
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.iconAlt || ''}
                  className={`${item.iconSize} object-contain shrink-0`}
                />
              )}
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
