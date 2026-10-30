import React from 'react';

export default function TopBanner() {
  return (
    <aside
      id="top-banner"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="bg-[#000000] text-[#FFFFFF] h-[32px] lg:h-[calc(69*var(--u))] w-full flex items-center justify-center relative z-50 px-4 select-none font-['Manrope']"
      aria-label="Announcement"
    >
      <div className="flex items-center justify-center gap-2 lg:gap-[calc(14*var(--u))] text-[11px] sm:text-[12px] lg:text-[calc(31.25*var(--u))] font-normal tracking-normal leading-none">
        <img
          src="/assets/truck.png"
          alt="Delivery Truck"
          className="w-[18px] lg:w-[calc(47*var(--u))] h-auto object-contain inline-block shrink-0"
        />
        <span className="text-[#FFFFFF] whitespace-nowrap">
          Free &nbsp;Global Delivery
        </span>
      </div>
    </aside>
  );
}
