import React, { useState } from 'react';

const benefitsData = [
  {
    id: 'cellular-regeneration',
    pill: 'CELLULAR REGENERATION',
    pillW: 482,
    num: 'BENEFIT 01',
    titleLine1: 'CELLULAR',
    titleLine2: 'REGENERATION',
    description:
      'Light energy boosts mitochondrial output, giving cells the fuel they need to repair themselves faster \u2014 the foundation every other LUMA benefit builds on.',
    bullets: [
      'INCREASES ATP (CELLULAR ENERGY) PRODUCTION',
      'SPEEDS UP TISSUE REPAIR AFTER STRAIN OR INJURY',
      'SUPPORTS HEALTHY CELL TURNOVER',
    ],
  },
  {
    id: 'pain-relief',
    pill: 'PAIN RELIEF',
    pillW: 271,
    num: 'BENEFIT 02',
    titleLine1: 'PAIN',
    titleLine2: 'RELIEF',
    description:
      'Deep-penetrating 850nm near-infrared wavelengths reach muscles, joints, and connective tissue to soothe soreness and calm localized inflammation.',
    bullets: [
      'TARGETS DEEP MUSCLE AND JOINT DISCOMFORT',
      'HELPS REDUCE POST-EXERCISE SORENESS',
      'SUPPORTS NATURAL ANTI-INFLAMMATORY RESPONSE',
    ],
  },
  {
    id: 'stress-reduction',
    pill: 'STRESS REDUCTION',
    pillW: 392,
    num: 'BENEFIT 03',
    titleLine1: 'STRESS',
    titleLine2: 'REDUCTION',
    description:
      'Gentle, non-invasive light sessions create a calming daily ritual that helps down-regulate tension and restore nervous system balance.',
    bullets: [
      'PROMOTES PARASYMPATHETIC RELAXATION',
      'EASES PHYSICAL TENSION ACCUMULATED DAILY',
      'CREATES A RESTORATIVE MINDFULNESS HABIT',
    ],
  },
  {
    id: 'circulation',
    pill: 'CIRCULATION',
    pillW: 301,
    num: 'BENEFIT 04',
    titleLine1: 'ENHANCED',
    titleLine2: 'CIRCULATION',
    description:
      'Red and near-infrared light stimulate nitric oxide release, helping blood vessels dilate so oxygen and vital nutrients reach tissues more efficiently.',
    bullets: [
      'SUPPORTS HEALTHY VASODILATION AND BLOOD FLOW',
      'IMPROVES OXYGEN DELIVERY TO WORKING TISSUES',
      'ACCELERATES METABOLIC WASTE CLEARANCE',
    ],
  },
  {
    id: 'collagen-boosting',
    pill: 'COLLAGEN BOOSTING',
    pillW: 417,
    num: 'BENEFIT 05',
    titleLine1: 'COLLAGEN',
    titleLine2: 'BOOSTING',
    description:
      'Surface-level 660nm red light energizes dermal fibroblasts to support natural collagen and elastin synthesis for firmer, smoother-looking skin.',
    bullets: [
      'STIMULATES NATURAL COLLAGEN & ELASTIN PRODUCTION',
      'IMPROVES SKIN TONE, TEXTURE, AND ELASTICITY',
      'REDUCES APPEARANCE OF FINE LINES AND BLEMISHES',
    ],
  },
  {
    id: 'sleep-enhancement',
    pill: 'SLEEP ENHANCEMENT',
    pillW: 425,
    num: 'BENEFIT 06',
    titleLine1: 'SLEEP',
    titleLine2: 'ENHANCEMENT',
    description:
      'Unlike harsh blue light from screens, evening red light exposure supports your natural circadian rhythm and prepares the body for deeper rest.',
    bullets: [
      'SUPPORTS HEALTHY CIRCADIAN RHYTHM ALIGNMENT',
      'ENCOURAGES NATURAL MELATONIN PRODUCTION',
      'IMPROVES OVERNIGHT RECOVERY QUALITY',
    ],
  },
];

export default function AboutBenefitsSection({ data }) {
  const eyebrow = data?.eyebrow || 'SIX OUTCOMES, ONE HABIT';
  const heading = data?.heading || 'BENEFITS';
  const items = data?.items && data.items.length > 0 ? data.items : benefitsData;
  const [activeIndex, setActiveIndex] = useState(0);
  const current = items[activeIndex] || items[0] || {};

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < items.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  return (
    <section
      id="about-benefits"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-[#FFFFFF] pt-4 pb-14 sm:pb-16 lg:pt-0 lg:pb-[calc(78*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* Centered Header (PSD Group 44: y = 5471..5622) */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: "SIX OUTCOMES, ONE HABIT" */}
          <p className="text-[15px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
            {eyebrow}
          </p>

          {/* Main Heading: "BENEFITS" */}
          <h2 className="mt-2 sm:mt-3 lg:mt-[calc(29*var(--u))] text-[28px] sm:text-[38px] md:text-[46px] lg:text-[calc(104*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            {heading}
          </h2>
        </div>

        {/* 6 Pill Tabs */}
        <div className="mt-6 sm:mt-8 lg:mt-[calc(77*var(--u))] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:gap-[calc(20*var(--u))]">
          {items.map((tab, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={tab.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                style={{ '--pill-w': `${tab.pillW || 350}` }}
                className={`h-[36px] sm:h-[42px] lg:h-[calc(80*var(--u))] px-4 sm:px-5 lg:px-0 lg:w-[calc(var(--pill-w)*var(--u))] rounded-full flex items-center justify-center text-[11px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#D61611] border border-[#D61611]'
                    : 'border border-[#474748] bg-transparent hover:bg-white/5'
                }`}
              >
                {tab.pill}
              </button>
            );
          })}
        </div>

        {/* Main Content Row */}
        <div className="relative mt-8 sm:mt-10 lg:mt-[calc(81*var(--u))] flex flex-col lg:flex-row items-center lg:items-start">
          {/* Left Carousel Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous benefit"
            className={`hidden lg:flex absolute left-[calc(445*var(--u))] top-[calc(407*var(--u))] w-[calc(77*var(--u))] h-[calc(141*var(--u))] items-center justify-center transition-opacity duration-200 ${
              activeIndex === 0
                ? 'opacity-20 cursor-not-allowed pointer-events-none'
                : 'opacity-100 hover:opacity-80 cursor-pointer'
            }`}
          >
            <img
              src="/assets/about/benefit-arrow-left.png"
              alt="Previous benefit"
              className="w-full h-full object-contain select-none pointer-events-none brightness-0 invert"
            />
          </button>

          {/* Left Athlete Image */}
          <div className="w-full max-w-[540px] lg:max-w-none lg:w-[calc(1325*var(--u))] lg:h-[calc(925*var(--u))] lg:ml-[calc(593*var(--u))] rounded-[20px] sm:rounded-[32px] lg:rounded-[calc(50*var(--u))] overflow-hidden shrink-0 shadow-2xl">
            <img
              src={current.image || '/assets/about/benefits-athlete-exact.png'}
              alt={current.pill}
              className="w-full h-full object-cover block select-none"
            />
          </div>

          {/* Right Benefit Text Block */}
          <div className="w-full lg:w-[calc(1168*var(--u))] mt-8 lg:mt-[calc(162*var(--u))] lg:ml-[calc(144*var(--u))] flex flex-col items-start">
            {/* Eyebrow: "BENEFIT 01" */}
            <p className="text-[14px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#D61611] leading-none">
              {current.num}
            </p>

            {/* Heading: "CELLULAR / REGENERATION" */}
            <h3 className="mt-3 sm:mt-4 lg:mt-[calc(48*var(--u))] text-[28px] sm:text-[36px] md:text-[44px] lg:text-[calc(100*var(--u))] font-bold uppercase tracking-[0.02em] text-[#FFFFFF] leading-[1.05] lg:leading-[calc(100*var(--u))]">
              <span className="block">{current.titleLine1}</span>
              {current.titleLine2 && <span className="block">{current.titleLine2}</span>}
            </h3>

            {/* Description Paragraph */}
            <p className="mt-4 sm:mt-5 lg:mt-[calc(46*var(--u))] text-[13px] sm:text-[15px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#FFFFFF] leading-[1.5] lg:leading-[calc(40*var(--u))]">
              {current.description}
            </p>

            {/* Checklist Bullets */}
            <ul className="mt-5 sm:mt-6 lg:mt-[calc(50*var(--u))] flex flex-col gap-3.5 sm:gap-4 lg:gap-[calc(46*var(--u))]">
              {(current.bullets || []).map((bullet, idx) => (
                <li key={idx} className="flex flex-row items-center gap-3 sm:gap-4 lg:gap-[calc(34*var(--u))]">
                  <img
                    src="/assets/about/benefit-check-icon.png"
                    alt="Checked"
                    className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] lg:w-[calc(36*var(--u))] lg:h-[calc(36*var(--u))] object-contain shrink-0 select-none"
                  />
                  <span className="text-[12px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-light uppercase tracking-[0.02em] text-[#FFFFFF] leading-snug lg:leading-none">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            {/* Mobile/Tablet Prev/Next Controls */}
            <div className="mt-6 flex lg:hidden items-center gap-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIndex === 0}
                aria-label="Previous benefit"
                className={`w-10 h-10 rounded-full border border-[#474748] flex items-center justify-center transition-all ${
                  activeIndex === 0
                    ? 'opacity-20 cursor-not-allowed pointer-events-none'
                    : 'opacity-100 hover:opacity-80 cursor-pointer active:scale-95'
                }`}
              >
                <img src="/assets/about/benefit-arrow-left.png" alt="" className="w-3 h-5 object-contain brightness-0 invert" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeIndex === items.length - 1}
                aria-label="Next benefit"
                className={`w-10 h-10 rounded-full border border-[#474748] flex items-center justify-center transition-all ${
                  activeIndex === items.length - 1
                    ? 'opacity-20 cursor-not-allowed pointer-events-none'
                    : 'opacity-100 hover:opacity-80 cursor-pointer active:scale-95'
                }`}
              >
                <img src="/assets/about/benefit-arrow-right.png" alt="" className="w-3 h-5 object-contain brightness-0 invert" />
              </button>
            </div>
          </div>

          {/* Right Carousel Arrow (PSD Vector Smart Object copy 3: bbox=(3322, 6267, 3399, 6408) -> 77x141) */}
          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex === items.length - 1}
            aria-label="Next benefit"
            className={`hidden lg:flex absolute left-[calc(3322*var(--u))] top-[calc(407*var(--u))] w-[calc(77*var(--u))] h-[calc(141*var(--u))] items-center justify-center transition-opacity duration-200 ${
              activeIndex === items.length - 1
                ? 'opacity-20 cursor-not-allowed pointer-events-none'
                : 'opacity-100 hover:opacity-80 cursor-pointer'
            }`}
          >
            <img
              src="/assets/about/benefit-arrow-right.png"
              alt="Next benefit"
              className="w-full h-full object-contain select-none pointer-events-none brightness-0 invert"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

