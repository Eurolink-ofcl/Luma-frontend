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

export default function AboutBenefitsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = benefitsData[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : benefitsData.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < benefitsData.length - 1 ? prev + 1 : 0));
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
          {/* Eyebrow: "SIX OUTCOMES, ONE HABIT" — 50px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #FFFFFF */}
          <p className="text-[15px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#FFFFFF] leading-none">
            SIX OUTCOMES, ONE HABIT
          </p>

          {/* Main Heading: "BENEFITS" — 104.17px (~104px) at 3840w, Manrope-ExtraBold (800), tracking 20 (0.02em), uppercase, #D61611 */}
          <h2 className="mt-2 sm:mt-3 lg:mt-[calc(29*var(--u))] text-[28px] sm:text-[38px] md:text-[46px] lg:text-[calc(104*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            BENEFITS
          </h2>
        </div>

        {/* 6 Pill Tabs (PSD Group 41: x = 726..3114 (2388w), y = 5699..5779 (80h), 77px below heading, 20px gap) */}
        <div className="mt-6 sm:mt-8 lg:mt-[calc(77*var(--u))] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:gap-[calc(20*var(--u))]">
          {benefitsData.map((tab, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                style={{ '--pill-w': `${tab.pillW}` }}
                className={`h-[36px] sm:h-[42px] lg:h-[calc(80*var(--u))] px-4 sm:px-5 lg:px-0 lg:w-[calc(var(--pill-w)*var(--u))] rounded-full flex items-center justify-center text-[11px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF] transition-colors duration-200 cursor-pointer ${
                  isActive ? 'bg-[#F10916]' : 'bg-[#333333] hover:bg-[#444444]'
                }`}
              >
                {tab.pill}
              </button>
            );
          })}
        </div>

        {/* Main Content Row (PSD y = 5860..6884, 81px below tabs) */}
        <div className="relative mt-8 sm:mt-10 lg:mt-[calc(81*var(--u))] flex flex-col lg:flex-row items-center lg:items-start">
          {/* Left Carousel Arrow (PSD Vector Smart Object copy 2: bbox=(445, 6267, 522, 6408) -> 77x141, opacity 51/255 = 20%) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous benefit"
            className="hidden lg:flex absolute left-[calc(445*var(--u))] top-[calc(407*var(--u))] w-[calc(77*var(--u))] h-[calc(141*var(--u))] items-center justify-center transition-opacity cursor-pointer ${
              activeIndex === 0 ? 'opacity-20 hover:opacity-50' : 'opacity-100 hover:opacity-80'
            }"
            style={{ opacity: activeIndex === 0 ? 0.2 : 1 }}
          >
            <img
              src="/assets/about/benefit-arrow-left.png"
              alt=""
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </button>

          {/* Left Athlete Image (PSD Rectangle 23 + Generative Fill + Layer 24: x = 593..1918 (1325w), y = 5860..6884 (1024h)) */}
          <div className="w-full max-w-[540px] lg:max-w-none lg:w-[calc(1325*var(--u))] lg:ml-[calc(593*var(--u))] shrink-0">
            <img
              src="/assets/about/benefits-athlete.png"
              alt={current.pill}
              className="w-full h-auto block select-none"
            />
          </div>

          {/* Right Benefit Text Block (PSD Group 43: x = 2062..3230 (1168w), y = 6022..6637 -> 144px right of image, 162px below image top) */}
          <div className="w-full lg:w-[calc(1168*var(--u))] mt-8 lg:mt-[calc(162*var(--u))] lg:ml-[calc(144*var(--u))] flex flex-col items-start">
            {/* Eyebrow: "BENEFIT 01" — 50px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #F10916 */}
            <p className="text-[15px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#F10916] leading-none">
              {current.num}
            </p>

            {/* Heading: "CELLULAR / REGENERATION" — 100px at 3840w, Manrope-Bold (700), leading 100px (1.0), tracking 20 (0.02em), uppercase, #FFFFFF */}
            <h3 className="mt-3 sm:mt-4 lg:mt-[calc(48*var(--u))] text-[28px] sm:text-[36px] md:text-[44px] lg:text-[calc(100*var(--u))] font-bold uppercase tracking-[0.02em] text-[#FFFFFF] leading-[1.05] lg:leading-[calc(100*var(--u))]">
              <span className="block">{current.titleLine1}</span>
              <span className="block">{current.titleLine2}</span>
            </h3>

            {/* Description Paragraph: 30px at 3840w, Manrope-Regular (400), leading 40px (1.333), tracking 20 (0.02em), #FFFFFF */}
            <p className="mt-4 sm:mt-5 lg:mt-[calc(46*var(--u))] text-[13px] sm:text-[15px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#FFFFFF] leading-[1.5] lg:leading-[calc(40*var(--u))]">
              {current.description}
            </p>

            {/* 3 Checklist Bullets (PSD y = 6450..6637, 50px below description) */}
            <ul className="mt-5 sm:mt-6 lg:mt-[calc(50*var(--u))] flex flex-col gap-3.5 sm:gap-4 lg:gap-[calc(46*var(--u))]">
              {current.bullets.map((bullet, idx) => (
                <li key={idx} className="flex flex-row items-center gap-3 sm:gap-4 lg:gap-[calc(34*var(--u))]">
                  <img
                    src="/assets/about/benefit-check.png"
                    alt=""
                    className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] lg:w-[calc(32*var(--u))] lg:h-[calc(32*var(--u))] object-contain shrink-0 select-none"
                  />
                  {/* Bullet Text: 30px at 3840w, Manrope-Light (300), tracking 20 (0.02em), uppercase, #FFFFFF */}
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
                aria-label="Previous benefit"
                className="w-10 h-10 rounded-full border border-[#333333] flex items-center justify-center opacity-70 hover:opacity-100"
              >
                <img src="/assets/about/benefit-arrow-left.png" alt="" className="w-3 h-5 object-contain" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next benefit"
                className="w-10 h-10 rounded-full border border-[#333333] flex items-center justify-center opacity-90 hover:opacity-100"
              >
                <img src="/assets/about/benefit-arrow-right.png" alt="" className="w-3 h-5 object-contain" />
              </button>
            </div>
          </div>

          {/* Right Carousel Arrow (PSD Vector Smart Object copy 3: bbox=(3322, 6267, 3399, 6408) -> 77x141, opacity 100%) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next benefit"
            className="hidden lg:flex absolute left-[calc(3322*var(--u))] top-[calc(407*var(--u))] w-[calc(77*var(--u))] h-[calc(141*var(--u))] items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img
              src="/assets/about/benefit-arrow-right.png"
              alt=""
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

