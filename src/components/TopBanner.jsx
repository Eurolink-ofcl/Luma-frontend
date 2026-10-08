import React, { useState, useEffect } from 'react';

export default function TopBanner() {
  const [activeIdx, setActiveIdx] = useState(0);

  const announcements = [
    {
      id: 'delivery',
      icon: (
        <img
          src="/assets/truck.png"
          alt="Delivery Truck"
          className="w-[22px] h-auto object-contain inline-block"
        />
      ),
      text: 'Free \u00A0Global Delivery',
    },
    {
      id: 'system',
      icon: (
        <svg
          className="w-4 h-4 text-[#EC2024] inline-block shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      text: 'One & Only 9-Wavelength System in UAE at this price',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <aside
      id="top-banner"
      className="bg-black text-white h-[36px] xl:h-[36px] 2xl:h-[40px] 3xl:h-[42px] 4xl:h-[46px] w-full flex items-center justify-center relative z-50 border-b border-white/10 px-4 select-none transition-all"
      aria-label="Announcement"
    >
      <div className="flex items-center justify-center h-full w-full max-w-[1720px] 4xl:max-w-[2400px]">
        {announcements.map((item, idx) => (
          <div
            key={item.id}
            className={`transition-all duration-500 flex items-center justify-center gap-2.5 2xl:gap-3.5 text-[12.5px] sm:text-[13.5px] 2xl:text-[15px] 4xl:text-[17px] font-normal tracking-[0.02em] ${
              idx === activeIdx
                ? 'opacity-100 translate-y-0 inline-flex'
                : 'opacity-0 translate-y-1 hidden'
            }`}
          >
            {item.icon}
            <span className="text-white whitespace-nowrap">{item.text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
