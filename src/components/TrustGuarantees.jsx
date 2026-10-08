import React from 'react';

const guarantees = [
  {
    icon: '/assets/guarantees/truck.png',
    title: 'FREE SHIPPING',
    description: 'Premium delivery at no extra cost, with fast 1-4 day shipping worldwide.',
  },
  {
    icon: '/assets/guarantees/trial.png',
    title: '90 DAY TRIAL',
    description: 'Experience real results or get 100% of your money back, guaranteed.',
  },
  {
    icon: '/assets/guarantees/warranty.png',
    title: '3 YEAR WARRANTY',
    description: 'Three full years of protection, unbeaten by any competitor.',
  },
  {
    icon: '/assets/guarantees/rating.png',
    title: 'RATED 4.8/5',
    description: "Join thousands of satisfied users with our 'Excellent' Trustpilot rating.",
  },
];

export default function TrustGuarantees() {
  return (
    <section className="relative w-full bg-[#080808] text-white py-16 lg:py-20 2xl:py-28 4xl:py-36 overflow-hidden font-['Manrope'] border-y border-white/10">
      <div className="max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-6 lg:px-12 2xl:px-16 4xl:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 2xl:gap-12 4xl:gap-16 text-center">
          {guarantees.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center group transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Authentic PSD Red Icon */}
              <div className="h-14 2xl:h-20 4xl:h-24 flex items-center justify-center mb-5 2xl:mb-7">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="max-h-12 2xl:max-h-16 4xl:max-h-20 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(236,32,36,0.25)] transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg 2xl:text-xl 4xl:text-2xl font-bold tracking-wider uppercase text-white mb-3 2xl:mb-4">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg text-gray-300 font-normal leading-relaxed max-w-[260px] 2xl:max-w-[320px] 4xl:max-w-[380px] mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
