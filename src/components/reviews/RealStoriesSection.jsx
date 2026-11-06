import React, { useState } from 'react';

const REVIEWS_DATA = [
  // Page 1 (matches PSD Layer 1: REAL STORIES)
  [
    {
      id: 1,
      badgeName: 'OMAR H.',
      badgeProduct: 'SURGE USER',
      badgeWidth: 314,
      quote:
        '“Ten minutes after training has become my reset. My shoulders feel looser the next morning and my warm-ups go faster.”',
      stars: 5,
    },
    {
      id: 2,
      badgeName: 'ALWIN,',
      badgeProduct: 'NOVA USER',
      badgeWidth: 314,
      quote:
        '“Setup took minutes, and the handle makes it easy to move between rooms. It sits in my office and I use it every afternoon.”',
      stars: 5,
    },
    {
      id: 3,
      badgeName: 'AHANA,',
      badgeProduct: 'GLOW USER',
      badgeWidth: 314,
      quote:
        '“The mask is light and comfortable, and the session flies by. My evening skincare now feels like a small ritual.”',
      stars: 5,
    },
    {
      id: 4,
      badgeName: 'OMAR H.',
      badgeProduct: 'SURGE USER',
      badgeWidth: 314,
      quote:
        '“Ten minutes after training has become my reset. My shoulders feel looser the next morning and my warm-ups go faster.”',
      stars: 5,
    },
    {
      id: 5,
      badgeName: 'ALWIN,',
      badgeProduct: 'NOVA USER',
      badgeWidth: 314,
      quote:
        '“Setup took minutes, and the handle makes it easy to move between rooms. It sits in my office and I use it every afternoon.”',
      stars: 5,
    },
    {
      id: 6,
      badgeName: 'AHANA,',
      badgeProduct: 'GLOW USER',
      badgeWidth: 314,
      quote:
        '“The mask is light and comfortable, and the session flies by. My evening skincare now feels like a small ritual.”',
      stars: 5,
    },
  ],
  // Page 2
  [
    {
      id: 7,
      badgeName: 'SARAH M.',
      badgeProduct: 'ULTRA USER',
      badgeWidth: 314,
      quote:
        '“I use it for my post-workout soreness and sleep preparation. Within two weeks, my deep sleep scores improved significantly.”',
      stars: 5,
    },
    {
      id: 8,
      badgeName: 'DAVID K.',
      badgeProduct: 'APEX USER',
      badgeWidth: 314,
      quote:
        '“The build quality is exceptional. High irradiance with zero flicker. It has become a foundational pillar of my daily recovery routine.”',
      stars: 5,
    },
    {
      id: 9,
      badgeName: 'ELENA R.',
      badgeProduct: 'GLOW USER',
      badgeWidth: 314,
      quote:
        '“Fine lines around my eyes started softening after 4 weeks of consistent use. My skin tone looks much more even and luminous.”',
      stars: 5,
    },
    {
      id: 10,
      badgeName: 'MARCUS T.',
      badgeProduct: 'MAX USER',
      badgeWidth: 314,
      quote:
        '“Full-body coverage is a complete game changer. Ten minutes in front of this panel feels like an entire body recharge.”',
      stars: 5,
    },
    {
      id: 11,
      badgeName: 'CHLOE P.',
      badgeProduct: 'GO USER',
      badgeWidth: 314,
      quote:
        '“Compact enough to travel with everywhere. Kept my jetlag at bay and gave me instant energy during business trips.”',
      stars: 5,
    },
    {
      id: 12,
      badgeName: 'JAMES W.',
      badgeProduct: 'SURGE USER',
      badgeWidth: 314,
      quote:
        '“My lower back tightness noticeably reduced after just 7 sessions. I can push harder during deadlifts and squat sessions without dread.”',
      stars: 5,
    },
  ],
  // Page 3
  [
    {
      id: 13,
      badgeName: 'LUCAS B.',
      badgeProduct: 'NOVA USER',
      badgeWidth: 314,
      quote:
        '“Remarkable craftsmanship and intuitive controls. It replaced my old red light device completely and delivers twice the power.”',
      stars: 5,
    },
    {
      id: 14,
      badgeName: 'PRIYA N.',
      badgeProduct: 'GLOW USER',
      badgeWidth: 314,
      quote:
        '“My dermatologist was impressed with how healthy my skin barrier looked. LUMA has earned a permanent place in my vanity.”',
      stars: 5,
    },
    {
      id: 15,
      badgeName: 'THOMAS E.',
      badgeProduct: 'SURGE USER',
      badgeWidth: 314,
      quote:
        '“Recovery time between marathon training runs cut nearly in half. Less calf fatigue and morning stiffness across the board.”',
      stars: 5,
    },
    {
      id: 16,
      badgeName: 'NINA S.',
      badgeProduct: 'APEX USER',
      badgeWidth: 314,
      quote:
        '“Clean aesthetic, quiet operation, and incredibly soothing light. It sets the perfect circadian rhythm tone every evening.”',
      stars: 5,
    },
    {
      id: 17,
      badgeName: 'DANIEL H.',
      badgeProduct: 'MAX USER',
      badgeWidth: 314,
      quote:
        '“The investment is 100% worth it. Entire family uses it daily for different benefits ranging from skin clarity to joint relief.”',
      stars: 5,
    },
    {
      id: 18,
      badgeName: 'RACHEL F.',
      badgeProduct: 'GO USER',
      badgeWidth: 314,
      quote:
        '“Perfect targeted panel for my desk. Whenever my neck feels tight from typing, 5 minutes under LUMA relieves the tension.”',
      stars: 5,
    },
  ],
  // Page 4
  [
    {
      id: 19,
      badgeName: 'CARLOS G.',
      badgeProduct: 'SURGE USER',
      badgeWidth: 314,
      quote:
        '“Ten minutes after training has become my reset. My shoulders feel looser the next morning and my warm-ups go faster.”',
      stars: 5,
    },
    {
      id: 20,
      badgeName: 'AMANDA L.',
      badgeProduct: 'NOVA USER',
      badgeWidth: 314,
      quote:
        '“Setup took minutes, and the handle makes it easy to move between rooms. It sits in my office and I use it every afternoon.”',
      stars: 5,
    },
    {
      id: 21,
      badgeName: 'KAVITA D.',
      badgeProduct: 'GLOW USER',
      badgeWidth: 314,
      quote:
        '“The mask is light and comfortable, and the session flies by. My evening skincare now feels like a small ritual.”',
      stars: 5,
    },
    {
      id: 22,
      badgeName: 'BENJAMIN J.',
      badgeProduct: 'APEX USER',
      badgeWidth: 314,
      quote:
        '“Solid build, medical-grade diodes, and very noticeable post-workout recovery. Best wellness upgrade I made this year.”',
      stars: 5,
    },
    {
      id: 23,
      badgeName: 'EMILY K.',
      badgeProduct: 'ULTRA USER',
      badgeWidth: 314,
      quote:
        '“My energy levels in the morning are consistent now. The 660nm and 850nm wavelength combo is potent and soothing.”',
      stars: 5,
    },
    {
      id: 24,
      badgeName: 'MICHAEL R.',
      badgeProduct: 'SURGE USER',
      badgeWidth: 314,
      quote:
        '“Setup took minutes, and the handle makes it easy to move between rooms. It sits in my office and I use it every afternoon.”',
      stars: 5,
    },
  ],
];

export default function RealStoriesSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const totalPages = REVIEWS_DATA.length; // 4 pages matching 4 PSD dots

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null;
    if (touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  const currentReviews = REVIEWS_DATA[currentPage];

  return (
    <section
      id="real-stories"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] overflow-hidden font-['Manrope'] select-none pt-12 sm:pt-16 md:pt-20 lg:pt-[calc(169*var(--u))] pb-12 sm:pb-16 md:pb-20 lg:pb-[calc(111*var(--u))]"
    >
      {/* Section Header: Title + Red Pill Bar (PSD y=1359..1487) */}
      <div className="w-full flex flex-col items-center justify-center text-center px-4">
        {/* Title: REAL STORIES (PSD: Manrope-ExtraLight 80px at 3840w, tracking 20 / 0.02em, color #131313) */}
        <h2 className="text-[26px] sm:text-[36px] md:text-[46px] lg:text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#131313] leading-none">
          REAL STORIES
        </h2>

        {/* Red Pill Bar (Rectangle 15: 150x20px, r=10px, fill #ED2124, 47px below title) */}
        <div
          className="mt-3 sm:mt-4 lg:mt-[calc(47*var(--u))] w-[60px] sm:w-[85px] lg:w-[calc(150*var(--u))] h-[8px] sm:h-[12px] lg:h-[calc(20*var(--u))] rounded-full bg-[#ED2124]"
          aria-hidden="true"
        />
      </div>

      {/* Reviews Cards Container with Left/Right Navigation Arrows (PSD x=377..3529, y=1652..2778) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-[3840px] mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-[calc(165*var(--u))] px-4 sm:px-8 lg:px-[calc(377*var(--u))]"
      >
        {/* Carousel Left Navigation Arrow - Desktop only (PSD Vector Smart Object copy: x=377..454, w=77, h=129) */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 0}
          aria-label="Previous reviews slide"
          className={`hidden lg:flex items-center justify-center absolute lg:left-[calc(377*var(--u))] top-1/2 -translate-y-1/2 z-20 lg:w-[calc(77*var(--u))] lg:h-[calc(129*var(--u))] transition-all duration-300 cursor-pointer ${
            currentPage === 0
              ? 'opacity-20 cursor-not-allowed pointer-events-none'
              : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95'
          }`}
        >
          <img
            src="/assets/reviews/arrow-left.png"
            alt="Previous"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        </button>

        {/* Carousel Right Navigation Arrow - Desktop only (PSD Vector Smart Object copy 2: x=3386..3463, w=77, h=129) */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          aria-label="Next reviews slide"
          className={`hidden lg:flex items-center justify-center absolute lg:right-[calc(377*var(--u))] top-1/2 -translate-y-1/2 z-20 lg:w-[calc(77*var(--u))] lg:h-[calc(129*var(--u))] transition-all duration-300 cursor-pointer ${
            currentPage === totalPages - 1
              ? 'opacity-20 cursor-not-allowed pointer-events-none'
              : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95'
          }`}
        >
          <img
            src="/assets/reviews/arrow-right.png"
            alt="Next"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        </button>

        {/* Reviews Cards Grid (PSD: 3 columns x 2 rows = 6 cards, card 817x484px, col-gap 175px, row-gap 158px) */}
        <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-2 sm:px-6 lg:px-[calc(142*var(--u))]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-x-[calc(175*var(--u))] lg:gap-y-[calc(158*var(--u))] justify-items-center">
            {currentReviews.map((review) => (
              <article
                key={review.id}
                className="w-full max-w-[420px] md:max-w-none lg:w-[calc(817*var(--u))] min-h-[210px] sm:min-h-[240px] lg:h-[calc(484*var(--u))] bg-[#F3F3F3] rounded-[20px] sm:rounded-[26px] lg:rounded-[calc(45*var(--u))] p-6 sm:p-7 lg:px-[calc(79*var(--u))] lg:pt-[calc(69*var(--u))] lg:pb-[calc(68*var(--u))] flex flex-col justify-between items-start transition-transform duration-300 hover:shadow-lg"
              >
                {/* User Product Badge (Rectangle 44: 314x75px, border 2px black, rounded 10px) */}
                <div className="w-auto min-w-[110px] sm:min-w-[130px] lg:w-[calc(314*var(--u))] h-[28px] sm:h-[34px] lg:h-[calc(75*var(--u))] px-2.5 sm:px-3.5 lg:px-0 rounded-[6px] sm:rounded-[7px] lg:rounded-[calc(10*var(--u))] border border-black sm:border-[1.5px] lg:border-2 border-[#000000] bg-transparent flex items-center justify-center text-center shrink-0">
                  <span className="text-[9.5px] sm:text-[11px] lg:text-[calc(22.6*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#000000] whitespace-nowrap">
                    {review.badgeName} <span className="font-normal">{review.badgeProduct}</span>
                  </span>
                </div>

                {/* Testimonial Quote (PSD: Manrope-Light 30px at 3840w, leading 50px, color #000000, 91px from card left) */}
                <p className="mt-3.5 sm:mt-5 lg:mt-[calc(70*var(--u))] lg:pl-[calc(12*var(--u))] text-[12px] sm:text-[13.5px] md:text-[14.5px] lg:text-[calc(30*var(--u))] font-light text-[#000000] leading-snug sm:leading-relaxed lg:leading-[calc(50*var(--u))] tracking-[0.02em] line-clamp-4 lg:line-clamp-none">
                  {review.quote}
                </p>

                {/* 5 Red Stars Rating (PSD: star(2) 42x40px each, gap 3px, fill #ED2124, 91px from card left) */}
                <div className="mt-3.5 sm:mt-5 lg:mt-[calc(31*var(--u))] lg:pl-[calc(12*var(--u))] flex items-center gap-1 sm:gap-1.5 lg:gap-[calc(3*var(--u))] shrink-0">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <img
                      key={i}
                      src="/assets/reviews/star-red.png"
                      alt="Star rating"
                      className="w-[13px] sm:w-[16px] lg:w-[calc(42*var(--u))] h-[12px] sm:h-[15px] lg:h-[calc(40*var(--u))] object-contain pointer-events-none select-none"
                      draggable={false}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Controls (PSD: 4 dots at y=2960, 20x20px each, gap 10px, dot 1 active #ED2124, rest #C0C0C0) */}
      <div className="w-full flex items-center justify-center gap-3 sm:gap-4 lg:gap-[calc(10*var(--u))] mt-8 sm:mt-12 md:mt-14 lg:mt-[calc(182*var(--u))]">
        {/* Mobile-only Prev Button beside dots */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 0}
          aria-label="Previous reviews slide"
          className={`lg:hidden w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
            currentPage === 0
              ? 'opacity-20 cursor-not-allowed pointer-events-none'
              : 'opacity-80 hover:opacity-100 active:scale-90'
          }`}
        >
          <img
            src="/assets/reviews/arrow-left.png"
            alt="Previous"
            className="w-3 h-5 object-contain pointer-events-none"
            draggable={false}
          />
        </button>

        {/* 4 Pagination Dots */}
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-[calc(10*var(--u))]">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentPage(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-[8px] sm:w-[10px] lg:w-[calc(20*var(--u))] h-[8px] sm:h-[10px] lg:h-[calc(20*var(--u))] rounded-full transition-all duration-300 cursor-pointer ${
                currentPage === idx
                  ? 'bg-[#ED2124] scale-110'
                  : 'bg-[#C0C0C0] hover:bg-[#a0a0a0]'
              }`}
            />
          ))}
        </div>

        {/* Mobile-only Next Button beside dots */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          aria-label="Next reviews slide"
          className={`lg:hidden w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
            currentPage === totalPages - 1
              ? 'opacity-20 cursor-not-allowed pointer-events-none'
              : 'opacity-80 hover:opacity-100 active:scale-90'
          }`}
        >
          <img
            src="/assets/reviews/arrow-right.png"
            alt="Next"
            className="w-3 h-5 object-contain pointer-events-none"
            draggable={false}
          />
        </button>
      </div>
    </section>
  );
}
