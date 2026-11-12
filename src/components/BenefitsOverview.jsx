import React from 'react';

const benefits = [
  {
    id: 'cellular',
    titleLines: ['CELLULAR', 'REGENERATION'],
    duration: '15',
    descriptionLines: [
      'Red & near-infrared light to support cellular',
      'energy & natural renewal from within.',
    ],
    image: '/assets/benefits/cellular.jpg',
  },
  {
    id: 'wellness',
    titleLines: ['GENERAL', 'WELLNESS'],
    duration: '15',
    descriptionLines: [
      'A calming full-body session to help you',
      'unwind, restore balance, and feel recharged.',
    ],
    image: '/assets/benefits/wellness.jpg',
  },
  {
    id: 'clearskin',
    titleLines: ['CLEAR', 'SKIN'],
    duration: '10',
    descriptionLines: [
      'Targeted light to support a clearer, smoother,',
      'more even-looking complexion.',
    ],
    image: '/assets/benefits/clearskin.jpg',
  },
  {
    id: 'fatloss',
    titleLines: ['FAT', 'LOSS'],
    duration: '15',
    descriptionLines: [
      'Designed to complement your training',
      '&nutrition as you work toward your body goals.',
    ],
    image: '/assets/benefits/fatloss.jpg',
  },
  {
    id: 'recovery',
    titleLines: ['MUSCLE', 'RECOVERY'],
    duration: '15',
    descriptionLines: [
      'Eases post-workout soreness',
      '& supports faster recovery.',
    ],
    image: '/assets/benefits/recovery.jpg',
  },
  {
    id: 'scalp',
    titleLines: ['SCALP', 'HEALTH'],
    duration: '10',
    descriptionLines: [
      'Gentle light to nurture the scalp and support',
      'healthier-looking, fuller hair.',
    ],
    image: '/assets/benefits/scalp.jpg',
  },
  {
    id: 'scar',
    titleLines: ['SCAR', 'HEALING'],
    duration: '15',
    descriptionLines: [
      'Supports skin repair for smoother',
      'more even-looking scars.',
    ],
    image: '/assets/benefits/scar.jpg',
  },
  {
    id: 'brain',
    titleLines: ['BRAIN', 'HEALTH'],
    duration: '15',
    descriptionLines: [
      'Supports mental clarity, focus, & everyday',
      'cognitive wellness.',
    ],
    image: '/assets/benefits/brain.jpg',
  },
];

function BenefitCard({ item }) {
  const titleLines = item.titleLines || (
    item.title?.includes('\n')
      ? item.title.split('\n')
      : item.title?.includes(' ')
        ? [item.title.split(' ')[0], item.title.split(' ').slice(1).join(' ')]
        : [item.title || '', '']
  );
  const durationText = String(item.duration || '15').replace(/[^0-9]/g, '') || '15';
  const desc = item.description || (Array.isArray(item.descriptionLines) ? item.descriptionLines.join(' ') : '');
  const image = item.image || '/assets/benefits/cellular.jpg';

  return (
    <div className="group flex flex-col w-full lg:w-[calc(800*var(--u))] transition-all duration-300 select-none">
      {/* Image Container matching PSD Rectangle 51 (800x500, sharp corners in PSD) */}
      <div className="w-full aspect-[8/5] lg:h-[calc(500*var(--u))] overflow-hidden rounded-none bg-[#EAEAEA] relative">
        <img
          src={image}
          alt={titleLines.join(' ')}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
        />
      </div>

      {/* Card Meta Content matching PSD Group 1..8 (y_offset = 49px below image) */}
      <div className="pt-4 lg:pt-[calc(49*var(--u))] flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[16px] sm:text-[18px] lg:text-[calc(36*var(--u))] font-semibold text-[#131313] uppercase leading-[1.15] tracking-[0.02em]">
            <span className="block">{titleLines[0]}</span>
            {titleLines[1] && <span className="block">{titleLines[1]}</span>}
          </h3>

          {/* Duration Circular Badge matching PSD Ellipse 5 (83x83px at 3840w, Red outline, stacked text) */}
          <div className="w-10 h-10 lg:w-[calc(83*var(--u))] lg:h-[calc(83*var(--u))] rounded-full border lg:border-[calc(3*var(--u))] border-[#ED2024] bg-white flex flex-col items-center justify-center shrink-0 select-none">
            <span className="text-xs lg:text-[calc(24*var(--u))] font-medium text-[#131313] leading-[1.05]">
              {durationText}
            </span>
            <span className="text-[10px] lg:text-[calc(22*var(--u))] font-medium text-[#131313] leading-[1.05]">
              Min
            </span>
          </div>
        </div>

        {/* Description (y=6700..6778, gap 30px below title/badge, 30px font at 3840w, #555555) */}
        <p className="mt-2.5 lg:mt-[calc(30*var(--u))] text-[#555555] text-xs sm:text-[13px] lg:text-[calc(30*var(--u))] font-normal leading-[1.55] tracking-[0.01em]">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function BenefitsOverview({ data }) {
  const eyebrow = data?.eyebrow || 'WHY LUMA';
  const heading = data?.heading || 'BENEFITS OVERVIEW';
  const subtitle = data?.subtitle || 'Evidence-based protocols calibrated for specific wellness outcomes.';
  const cards = (Array.isArray(data?.cards) && data.cards.length > 0) ? data.cards : benefits;

  const isLumaInEyebrow = /LUMA/i.test(eyebrow);
  const eyebrowPrefix = isLumaInEyebrow ? eyebrow.replace(/LUMA/i, '').trim() : eyebrow;

  return (
    <section
      id="benefits"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-white text-[#131313] py-16 lg:pt-[calc(167*var(--u))] lg:pb-[calc(167*var(--u))] overflow-hidden font-['Manrope']"
    >
      {/* Container aligned to PSD Group 18 (x=519..3322 -> left=519px, right=518px, width=2803px on 3840w) */}
      <div className="benefits-container max-w-[1400px] lg:max-w-none mx-auto px-6 lg:px-0 lg:pl-[calc(519*var(--u))] lg:pr-[calc(518*var(--u))]">
        {/* Section Header (y=5700..5940) */}
        <div className="text-center mx-auto mb-12 lg:mb-[calc(98*var(--u))]">
          <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] uppercase tracking-[0.02em] font-medium leading-none">
            <span className="text-[#131313]">{eyebrowPrefix} </span>
            {isLumaInEyebrow && <span className="text-[#ED2024]">LUMA</span>}
          </p>
          <h2 className="text-[#131313] font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] tracking-[0.02em] uppercase leading-none mt-3 lg:mt-[calc(47*var(--u))]">
            {heading}
          </h2>
          <p className="text-[#555555] text-sm sm:text-base lg:text-[calc(30*var(--u))] leading-none mt-4 lg:mt-[calc(72*var(--u))] font-normal tracking-[0.01em]">
            {subtitle}
          </p>
        </div>

        {/* Rows 1 & 2 (3 columns: 800px each, horizontal gap 201px, vertical gap 124px on 3840w) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-x-[calc(201*var(--u))] lg:gap-y-[calc(124*var(--u))]">
          {cards.slice(0, 6).map((item) => (
            <BenefitCard key={item.id} item={item} />
          ))}
        </div>

        {/* Row 3 (Bottom 2 Centered Cards: x=1019..2820, width=1801px, gap 201px, top margin 124px on 3840w) */}
        {cards.length > 6 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-[calc(201*var(--u))] lg:w-[calc(1801*var(--u))] mx-auto mt-8 lg:mt-[calc(124*var(--u))]">
            {cards.slice(6, 8).map((item) => (
              <BenefitCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
