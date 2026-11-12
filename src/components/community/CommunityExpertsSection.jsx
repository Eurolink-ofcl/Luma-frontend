import React, { useState } from 'react';

const filterCategories = [
  { id: 'all', label: 'ALL', pillW: 151 },
  { id: 'skin', label: 'SKIN', pillW: 191 },
  { id: 'recovery', label: 'RECOVERY', pillW: 242 },
  { id: 'sleep', label: 'SLEEP', pillW: 242 },
  { id: 'beginners', label: 'BEGINNERS', pillW: 242 },
];

const expertCards = [
  {
    id: 1,
    image: '/assets/community/expert-card-1.jpg',
    title: "RED LIGHT THERAPY: WHAT IT IS\n& WHAT IT ISN'T",
    category: ['all', 'beginners'],
  },
  {
    id: 2,
    image: '/assets/community/expert-card-2.jpg',
    title: 'RED LIGHT AND YOUR SKINCARE ROUTINE',
    category: ['all', 'skin'],
  },
  {
    id: 3,
    image: '/assets/community/expert-card-3.jpg',
    title: 'USING RED LIGHT AROUND TRAINING\n& RECOVERY',
    category: ['all', 'recovery'],
  },
  {
    id: 4,
    image: '/assets/community/expert-card-4.jpg',
    title: "RED LIGHT THERAPY: WHAT IT IS\n& WHAT IT ISN'T",
    category: ['all', 'beginners'],
  },
  {
    id: 5,
    image: '/assets/community/expert-card-5.jpg',
    title: 'RED LIGHT AND YOUR SKINCARE ROUTINE',
    category: ['all', 'skin'],
  },
  {
    id: 6,
    image: '/assets/community/expert-card-6.jpg',
    title: 'USING RED LIGHT AROUND TRAINING\n& RECOVERY',
    category: ['all', 'recovery', 'sleep'],
  },
];

export default function CommunityExpertsSection({ data }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const title = data?.title || 'TALK TO THE EXPERTS';

  // Normalize categories whether array of strings or array of objects
  const rawCategories =
    data?.categories ||
    (data?.filterCategories && data.filterCategories.length > 0 ? data.filterCategories : null) ||
    ['ALL', 'SKIN', 'RECOVERY', 'SLEEP', 'BEGINNERS'];

  const normalizedCategories = rawCategories.map((c) => {
    if (typeof c === 'string') {
      const label = c.toUpperCase();
      const id = c.toLowerCase();
      const pillW = id === 'all' ? 151 : id === 'skin' ? 191 : 242;
      return { id, label, pillW };
    }
    return {
      id: c.id || c.label?.toLowerCase(),
      label: c.label || c.id?.toUpperCase(),
      pillW: c.pillW || 200,
    };
  });

  const cards = data?.cards && data.cards.length > 0 ? data.cards : expertCards;

  const filteredCards = cards.filter((card) => {
    if (activeCategory === 'all') return true;
    const cardCats = (card.categories || card.category || []).map((c) =>
      typeof c === 'string' ? c.toLowerCase() : String(c)
    );
    return cardCats.includes(activeCategory.toLowerCase());
  });

  return (
    <section
      id="talk-to-experts"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pt-6 sm:pt-10 lg:pt-0 pb-16 sm:pb-20 lg:pb-[calc(98*var(--u))] overflow-hidden font-['Manrope']"
    >
      {/* Container aligned to PSD x=523..3321 (2798px cards span at 3840w canvas) */}
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0 lg:pl-[calc(523*var(--u))] lg:pr-[calc(519*var(--u))]">
        {/* Section Header Row: Title & Filter Pills (PSD y=1384..1464, h=80px) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 lg:gap-0">
          {/* Main Title: "TALK TO THE EXPERTS" */}
          <h2 className="text-[24px] sm:text-[30px] md:text-[36px] lg:text-[calc(80*var(--u))] font-medium tracking-[0.02em] uppercase text-[#131313] leading-none shrink-0 lg:-ml-[calc(8*var(--u))]">
            {title}
          </h2>

          {/* Filter Pills (PSD x=2052..3317, 80px height at 3840w, gap ~48px) */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-[calc(48*var(--u))] overflow-x-auto no-scrollbar py-1 max-w-full">
            {normalizedCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ '--pw': `${cat.pillW}` }}
                  className={`h-[36px] sm:h-[44px] lg:h-[calc(80*var(--u))] px-4 sm:px-6 lg:px-0 lg:w-[calc(var(--pw)*var(--u))] rounded-full flex items-center justify-center text-[11px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF] transition-colors duration-200 cursor-pointer shrink-0 leading-none ${
                    isActive
                      ? 'bg-[#ED2024]'
                      : 'bg-[#333333] hover:bg-[#444444]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Expert Video/Article Cards Grid (PSD Row 1: y=1636..2566, Row 2: y=2692..3622) */}
        <div className="mt-8 sm:mt-12 lg:mt-[calc(172*var(--u))] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-x-[calc(127*var(--u))] lg:gap-y-[calc(126*var(--u))]">
          {filteredCards.map((card) => (
            <article
              key={card.id}
              className="w-full lg:w-[calc(848*var(--u))] h-auto lg:h-[calc(930*var(--u))] rounded-[20px] sm:rounded-[32px] lg:rounded-[calc(60*var(--u))] overflow-hidden bg-[#D4D4D4] flex flex-col group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Card Image (PSD: 848x720 at 3840w) */}
              <div className="relative w-full aspect-[848/720] lg:aspect-auto lg:h-[calc(720*var(--u))] overflow-hidden bg-[#111111] shrink-0">
                <img
                  src={card.image}
                  alt={card.title.replace('\n', ' ')}
                  className="w-full h-full object-cover select-none group-hover:scale-[1.03] transition-transform duration-500"
                  draggable={false}
                />
              </div>

              {/* Bottom Gray Title Bar (PSD: 848x210 at 3840w, fill #D4D4D4, text Manrope-Medium 30px tracking 20 #000000) */}
              <div className="w-full h-[80px] sm:h-[96px] lg:h-[calc(210*var(--u))] bg-[#D4D4D4] flex items-center justify-center text-center px-4 sm:px-6 lg:px-[calc(40*var(--u))]">
                <h3 className="text-[12px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#000000] leading-snug lg:leading-[1.3] whitespace-pre-line">
                  {card.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
