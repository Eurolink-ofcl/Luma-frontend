import React from 'react';

const trustItems = [
  {
    icon: '/assets/energy_14368783.png',
    iconAlt: 'Energy icon',
    iconSize: 'h-4 2xl:h-5 4xl:h-6 w-auto',
    content: (
      <span className="text-white font-light tracking-normal text-[12px] lg:text-[13px] xl:text-[14.3px] 2xl:text-[19.1px] 4xl:text-[28.7px] uppercase">
        ONE &amp; ONLY 8-WAVELENGTH PANEL
      </span>
    ),
  },
  {
    icon: null,
    content: (
      <div className="flex items-center gap-1.5 text-[12px] lg:text-[13px] xl:text-[14.3px] 2xl:text-[19.1px] 4xl:text-[28.7px] uppercase tracking-normal">
        <span className="text-[#EC2024] font-medium">CERTIFIED:</span>
        <span className="text-white/95 font-light">BSCI - ISO9001 - ISO14001 - ISO45001</span>
      </div>
    ),
  },
  {
    icon: '/assets/best_13654983.png',
    iconAlt: 'MDSAP Badge',
    iconSize: 'h-3.5 2xl:h-4.5 4xl:h-5.5 w-auto',
    content: (
      <span className="text-white font-light tracking-normal text-[12px] lg:text-[13px] xl:text-[14.3px] 2xl:text-[19.1px] 4xl:text-[28.7px] uppercase">
        MDSAP CERTIFIED
      </span>
    ),
  },
  {
    icon: '/assets/protect_10831389.png',
    iconAlt: 'CE Shield',
    iconSize: 'h-3.5 2xl:h-4.5 4xl:h-5.5 w-auto',
    content: (
      <span className="text-white font-light tracking-normal text-[12px] lg:text-[13px] xl:text-[14.3px] 2xl:text-[19.1px] 4xl:text-[28.7px] uppercase">
        CE CERTIFIED
      </span>
    ),
  },
  {
    icon: '/assets/delivery-truck.png',
    iconAlt: 'Delivery Truck',
    iconSize: 'h-3 2xl:h-4 4xl:h-5 w-auto',
    content: (
      <span className="text-white font-light tracking-normal text-[12px] lg:text-[13px] xl:text-[14.3px] 2xl:text-[19.1px] 4xl:text-[28.7px] uppercase">
        FREE GLOBAL DELIVERY
      </span>
    ),
  },
];

export default function TrustStrip() {
  return (
    <section id="trust-strip" className="relative w-full bg-black border-y border-white/10 overflow-hidden py-3.5 2xl:py-5 4xl:py-6 z-20">
      {/* Desktop static layout (centered and evenly distributed) */}
      <div className="trust-container hidden xl:flex items-center justify-between max-w-[1720px] 4xl:max-w-[2400px] mx-auto px-8 2xl:px-14 4xl:px-20 font-['Manrope']">
        {trustItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 2xl:gap-3.5 whitespace-nowrap">
            {item.icon && (
              <img
                src={item.icon}
                alt={item.iconAlt || ''}
                className={`${item.iconSize} object-contain`}
              />
            )}
            {item.content}
          </div>
        ))}
      </div>

      {/* Responsive continuous marquee ticker for medium and small screens */}
      <div className="xl:hidden flex items-center overflow-hidden font-['Manrope'] select-none">
        <div className="flex shrink-0 items-center gap-8 animate-[marquee_28s_linear_infinite] pr-8">
          {trustItems.map((item, idx) => (
            <div key={`m1-${idx}`} className="flex items-center gap-2 whitespace-nowrap">
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.iconAlt || ''}
                  className={`${item.iconSize} object-contain`}
                />
              )}
              {item.content}
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-8 animate-[marquee_28s_linear_infinite] pr-8" aria-hidden="true">
          {trustItems.map((item, idx) => (
            <div key={`m2-${idx}`} className="flex items-center gap-2 whitespace-nowrap">
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.iconAlt || ''}
                  className={`${item.iconSize} object-contain`}
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
