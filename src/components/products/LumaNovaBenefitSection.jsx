import React from 'react';

const NOVA_BENEFIT_CARDS = [
  {
    id: 'benefit-1',
    eyebrow: '8 WAVELENGTHS',
    titleLine1: 'TARGETED RED & NEAR-INFRARED',
    titleLine2: 'THERAPY, AT HOME',
    description:
      'LUMA NOVA delivers eight wavelengths from 590nm to 1060nm through 60 high-power LEDs, with a 30° beam for near-infrared and 60° for red. Built for targeted sessions at home, in the studio or at the gym.',
    image: '/assets/nova/benefit-1.jpg',
    webp: '/assets/nova/benefit-1.webp',
  },
  {
    id: 'benefit-2',
    eyebrow: '2.8 KG · BUILT-IN HANDLE',
    titleLine1: 'COMPACT POWER,',
    titleLine2: 'EASY TO MOVE',
    description:
      'At just 2.8 kg and 26.9 × 23 × 5.4 cm, NOVA moves from room to room with its carry handle. The fold-out kickstand lets you angle it at your face or body. It covers an area up to 71 × 55 cm, and its LEDs are rated for 50,000 hours.',
    image: '/assets/nova/benefit-2.jpg',
    webp: '/assets/nova/benefit-2.webp',
  },
  {
    id: 'benefit-3',
    eyebrow: 'FULL CONTROL',
    titleLine1: 'YOUR SESSION,',
    titleLine2: 'YOUR SETTINGS',
    description:
      'Use the touchscreen to choose your wavelengths, dim brightness from 0 to 100% and set a timer from 1 to 30 minutes. Near-infrared LEDs also offer adjustable pulse up to 9,999 Hz. Backed by a 3-year warranty.',
    image: '/assets/nova/benefit-3.jpg',
    webp: '/assets/nova/benefit-3.webp',
  },
];

export default function LumaNovaBenefitSection() {
  return (
    <section
      id="luma-nova-benefits"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#FFFFFF] text-[#000000] font-['Manrope'] select-none pt-12 sm:pt-16 md:pt-20 lg:pt-24 2xl:pt-[calc(136*var(--u))] pb-16 sm:pb-20 md:pb-24 lg:pb-28 2xl:pb-[calc(161*var(--u))]"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-[calc(522*var(--u))]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-[calc(282*var(--u))] items-start">
          {NOVA_BENEFIT_CARDS.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center md:items-start text-center md:text-left w-full"
            >
              {/* Eyebrow Label: Manrope-Medium (500), 30px at 3840w, #000000 */}
              <span className="text-[12px] sm:text-[13px] md:text-[11.5px] lg:text-[13px] xl:text-[14px] 2xl:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#000000] leading-none mb-3 sm:mb-4 lg:mb-5 2xl:mb-[calc(28*var(--u))] self-center">
                {card.eyebrow}
              </span>

              {/* Sliced Photo Card (Rectangle 71: 744x395 at 3840w, radius 50px) */}
              <div className="relative w-full aspect-[744/395] rounded-[20px] sm:rounded-[26px] md:rounded-[22px] lg:rounded-[28px] 2xl:rounded-[calc(50*var(--u))] overflow-hidden bg-[#F5F5F5] shadow-md border border-black/5">
                <picture>
                  <source srcSet={card.webp} type="image/webp" />
                  <img
                    src={card.image}
                    alt={card.eyebrow}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    draggable={false}
                  />
                </picture>
              </div>

              {/* Card Title: Manrope-ExtraBold (800), 50px at 3840w, #0A0A0B */}
              <h3 className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 2xl:mt-[calc(42*var(--u))] text-[16px] sm:text-[18px] md:text-[15.5px] lg:text-[18.5px] xl:text-[21.5px] 2xl:text-[calc(50*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#0A0A0B] leading-[1.18]">
                <span className="block whitespace-nowrap">{card.titleLine1}</span>
                <span className="block whitespace-nowrap">{card.titleLine2}</span>
              </h3>

              {/* Card Description: Manrope-Regular (400), 30px at 3840w, leading 48px, #7A7A7A */}
              <p className="mt-3 sm:mt-4 md:mt-4.5 lg:mt-5 2xl:mt-[calc(38*var(--u))] text-[13px] sm:text-[14px] md:text-[12px] lg:text-[13px] xl:text-[14.5px] 2xl:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#7A7A7A] leading-[1.6] max-w-[420px] md:max-w-none">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

