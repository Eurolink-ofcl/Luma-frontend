import React, { useState, useEffect } from 'react';
import { API_BASE_URL, resolveImageUrl } from '../../config/api';

// SLIDE 1 (Dot 1): Curated Authentic Customer Stories
const SLIDE_1_CARDS = [
  {
    id: 's1-1',
    title: 'Gym & Meditation Deep Recovery',
    author: 'MARCUS & ELENA',
    product: 'LUMA MAX USER',
    type: 'photo',
    stars: 5,
    story:
      'Ten minutes of post-training deep red and near-infrared light reset our physical and mental state after grueling workouts. Muscle tension melts away within hours.',
    fallbackImage: '/assets/reviews/gallery_cards/card-1-meditation.png',
  },
  {
    id: 's1-2',
    title: 'Evening Glow Mask Reading Routine',
    author: 'AHANA K.',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'The mask is light and comfortable, and the 10-minute session flies by while I read. My evening skincare now feels like a soothing restorative ritual.',
    fallbackImage: '/assets/reviews/cards/card-2-luma-mask.png',
  },
  {
    id: 's1-3',
    title: 'Targeted Core & Joint Recovery',
    author: 'JESSICA L.',
    product: 'LUMA SURGE USER',
    type: 'photo',
    stars: 5,
    story:
      'Targeting my core and lower back with 100 mW/cm² clinical irradiance helped eliminate chronic post-workout stiffness in less than three weeks.',
    fallbackImage: '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
  },
  {
    id: 's1-4',
    title: 'Handheld Facial Radiance Protocol',
    author: 'ELENA ROSTOVA',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'After 3 weeks of daily 10-minute sessions with Luma Glow, my skin texture has smoothed out noticeably and fine lines around my eyes have faded. Truly clinical grade!',
    fallbackImage: '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
  },
];

// SLIDE 2 (Dot 2): Verified Users & Skincare Experiences
const SLIDE_2_CARDS = [
  {
    id: 's2-1',
    title: 'Post-Workout Full-Body Reset',
    author: 'MARCUS VANCE',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-apex-review',
    stars: 5,
    story:
      'Using the Luma Apex half-body panel after intense workout sessions has cut my recovery time in half. Muscle stiffness is completely gone by the next morning.',
    fallbackImage: '/assets/benefits/recovery.jpg',
  },
  {
    id: 's2-2',
    title: 'Evening Collagen & Firming Routine',
    author: 'CHLOE D.',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'Zero UV emission, medical-grade LEDs, and zero heat burn risk. I use it four evenings a week. My complexion has never looked firmer or more vibrant.',
    fallbackImage: '/assets/reviews/cards/card-5-mask-session.png',
  },
  {
    id: 's2-3',
    title: 'Shoulder & Spine Recovery Session',
    author: 'LIAM GALLAGHER',
    product: 'LUMA SURGE USER',
    type: 'photo',
    stars: 5,
    story:
      'Targeting my upper back and neck with focused near-infrared light completely stopped the chronic stiffness I get from computer work.',
    fallbackImage: '/assets/reviews/gallery_cards/card-6-unboxing-panel.png',
  },
  {
    id: 's2-4',
    title: 'Daily Radiance Facial Protocol',
    author: 'SOPHIA CHEN',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'The mask fits effortlessly and zero eye strain with the clinical design. My complexion looks rested and glowing every single morning.',
    fallbackImage: '/assets/benefits/clearskin.jpg',
  },
];

// SLIDE 3 (Dot 3): Daily Protocols & Clinical Routines
const SLIDE_3_CARDS = [
  {
    id: 's3-1',
    title: 'Circadian Rhythm Morning Protocol',
    author: 'CLINICAL WELLNESS TEAM',
    product: 'LUMA MAX PROTOCOL',
    type: 'photo',
    stars: 5,
    story:
      '10 minutes of direct morning exposure within 30 minutes of waking resets the master circadian clock, boosting daytime alertness and nighttime melatonin synthesis.',
    fallbackImage: '/assets/about/story-panel.jpg',
  },
  {
    id: 's3-2',
    title: 'Evening Collagen Synthesis Protocol',
    author: 'DERMATOLOGY ADVISORY',
    product: 'LUMA GLOW PROTOCOL',
    type: 'photo',
    stars: 5,
    story:
      '660nm pure red wavelengths penetrate 2-3mm into the dermal matrix, stimulating fibroblast cells to produce new collagen and elastin fibers.',
    fallbackImage: '/assets/benefits/cellular.jpg',
  },
  {
    id: 's3-3',
    title: 'Deep Muscle Soreness (DOMS) Protocol',
    author: 'SPORTS MEDICINE TEAM',
    product: 'LUMA SURGE PROTOCOL',
    type: 'photo',
    stars: 5,
    story:
      'Deep-penetrating 850nm near-infrared wavelengths target muscle mitochondria, clearing lactic acid and reducing post-exercise inflammation.',
    fallbackImage: '/assets/about/benefits-athlete-exact.png',
  },
  {
    id: 's3-4',
    title: 'Full-Body Post-Workout Recovery Protocol',
    author: 'PERFORMANCE COACHES',
    product: 'LUMA APEX PROTOCOL',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-unboxing-review',
    stars: 5,
    story:
      'Stand 12 inches away for 10 minutes front and 10 minutes back immediately following high-intensity training to cut recovery latency in half.',
    fallbackImage: '/assets/benefits/wellness.jpg',
  },
];

// SLIDE 4 (Dot 4): Lab Tests, Unboxings & Video Demonstrations
const SLIDE_4_CARDS = [
  {
    id: 's4-1',
    title: '100 mW/cm² Irradiance Spectrometer Test',
    author: 'LAB IRRADIANCE REPORT',
    product: 'LUMA MAX TEST',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-spectrometer-test',
    stars: 5,
    story:
      'Independent lab testing confirms true 100 mW/cm² irradiance at 6 inches distance with 0.0 µT EMF radiation and 0.0% flicker index.',
    fallbackImage: '/assets/reviews/gallery_cards/card-8-camera-influencer.png',
  },
  {
    id: 's4-2',
    title: 'Unboxing the Luma Glow Facial Mask',
    author: 'SKINCARE DIARIES',
    product: 'LUMA GLOW REVIEW',
    type: 'photo',
    stars: 5,
    story:
      'Watch the full unboxing and comfort walkthrough: medical-grade silicone, flexible fit, and eye protection goggles included in the box.',
    fallbackImage: '/assets/reviews/cards/card-2-luma-mask.png',
  },
  {
    id: 's4-3',
    title: 'Mobile Stand Assembly & Daily Use',
    author: 'DAVID K.',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-apex-review',
    stars: 5,
    story:
      'The wheeled stand glides seamlessly between rooms. Sturdy build, high irradiance, and zero flicker. It has become a foundational pillar of my daily recovery routine.',
    fallbackImage: '/assets/reviews/gallery_cards/card-7-assembly-stand.png',
  },
  {
    id: 's4-4',
    title: '60-Day Visual Complexion Timelapse',
    author: 'ESTHETICIAN REVIEW',
    product: 'LUMA GLOW REVIEW',
    type: 'photo',
    stars: 5,
    story:
      'High-resolution dermatological imaging tracking skin tone evenness, pore texture, and redness reduction over 8 consecutive weeks.',
    fallbackImage: '/assets/before_after/face-after.jpg',
  },
];

export default function RealStoryGallerySection({ data }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [adminStories, setAdminStories] = useState([]);
  const [touchStartX, setTouchStartX] = useState(null);

  const title = data?.title || 'REAL STORY';
  const totalSlides = 4;

  // Fetch approved customer stories from backend MongoDB
  useEffect(() => {
    fetch(`${API_BASE_URL}/stories`)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((s, idx) => ({
            id: s._id || `admin-${idx}`,
            photo: resolveImageUrl(s.photo || s.thumbnail || ''),
            thumbnail: resolveImageUrl(s.thumbnail || s.photo || ''),
            title: s.name ? `${s.name}'s Real Story` : 'Customer Real Story',
            author: s.badgeName || s.name?.toUpperCase() || 'VERIFIED USER',
            product: s.badgeProduct || `${(s.product || 'Luma Apex').toUpperCase()} USER`,
            type: s.mediaLink && s.mediaLink.includes('youtu') ? 'video' : (s.mediaLink ? 'video' : 'photo'),
            mediaLink: s.mediaLink || '',
            stars: s.stars || 5,
            story: s.story || '',
            fallbackImage: '/assets/reviews/cards/card-2-luma-mask.png',
          }));
          setAdminStories(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard navigation and modal Escape close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCard(null);
      if (!selectedCard) {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCard, activeSlide]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : totalSlides - 1));
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

  // Populate Slide 1 & Slide 2 with admin-approved stories if available
  const slide1Cards = SLIDE_1_CARDS.map((fallback, idx) => {
    if (adminStories[idx]) {
      return { ...fallback, ...adminStories[idx] };
    }
    return fallback;
  });

  const slide2Cards = SLIDE_2_CARDS.map((fallback, idx) => {
    const adminIdx = idx + 4;
    if (adminStories[adminIdx]) {
      return { ...fallback, ...adminStories[adminIdx] };
    }
    return fallback;
  });

  const slides = [
    { id: 0, label: 'Customer Stories & Recovery', cards: slide1Cards },
    { id: 1, label: 'Verified Skincare Experiences', cards: slide2Cards },
    { id: 2, label: 'Clinical Protocols & Routines', cards: SLIDE_3_CARDS },
    { id: 3, label: 'Lab Tests & Demonstrations', cards: SLIDE_4_CARDS },
  ];

  const isAtStart = activeSlide === 0;
  const isAtEnd = activeSlide === totalSlides - 1;

  return (
    <section
      id="real-story"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] overflow-hidden font-['Manrope'] select-none pt-12 sm:pt-16 md:pt-20 lg:pt-[calc(169*var(--u))] pb-12 sm:pb-16 md:pb-20 lg:pb-[calc(111*var(--u))]"
    >
      {/* Section Header: Title + Red Pill Bar (matches exact RealStoriesSection layout) */}
      <div className="w-full flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-[26px] sm:text-[36px] md:text-[46px] lg:text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#131313] leading-none">
          {title}
        </h2>
        <div
          className="mt-3 sm:mt-4 lg:mt-[calc(47*var(--u))] w-[60px] sm:w-[85px] lg:w-[calc(150*var(--u))] h-[8px] sm:h-[12px] lg:h-[calc(20*var(--u))] rounded-full bg-[#ED2124]"
          aria-hidden="true"
        />
      </div>

      {/* Cards Container with Left/Right Navigation Arrows (matches exact RealStoriesSection spacing & width) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-[3840px] mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-[calc(165*var(--u))] px-4 sm:px-8 lg:px-[calc(377*var(--u))]"
      >
        {/* Carousel Left Navigation Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isAtStart}
          aria-label="Previous slide"
          style={{ left: 'calc(377 * var(--u))' }}
          className={`flex items-center justify-center absolute left-2 sm:left-4 lg:left-[calc(377*var(--u))] top-1/2 -translate-y-1/2 z-20 w-6 h-10 sm:w-8 sm:h-14 lg:w-[calc(77*var(--u))] lg:h-[calc(129*var(--u))] transition-all duration-300 focus:outline-none select-none ${
            isAtStart
              ? 'opacity-20 cursor-not-allowed pointer-events-none'
              : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer'
          }`}
        >
          <img
            src="/assets/reviews/arrow-left.png"
            alt="Previous"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        </button>

        {/* Carousel Right Navigation Arrow */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isAtEnd}
          aria-label="Next slide"
          style={{ right: 'calc(377 * var(--u))' }}
          className={`flex items-center justify-center absolute right-2 sm:right-4 lg:right-[calc(377*var(--u))] top-1/2 -translate-y-1/2 z-20 w-6 h-10 sm:w-8 sm:h-14 lg:w-[calc(77*var(--u))] lg:h-[calc(129*var(--u))] transition-all duration-300 focus:outline-none select-none ${
            isAtEnd
              ? 'opacity-20 cursor-not-allowed pointer-events-none'
              : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer'
          }`}
        >
          <img
            src="/assets/reviews/arrow-right.png"
            alt="Next"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        </button>

        {/* Reviews Cards Sliding Track (matches exact RealStoriesSection max-w-[1440px] lg:max-w-[calc(2801*var(--u))]) */}
        <div className="w-full max-w-[1440px] lg:max-w-[calc(2801*var(--u))] mx-auto px-0 overflow-hidden">
          <div
            className="flex w-full transition-transform duration-700 ease-out will-change-transform"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide, sIdx) => (
              <div key={slide.id || sIdx} className="w-full min-w-full shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-x-[calc(50*var(--u))] justify-items-center">
                  {slide.cards.map((card, cIdx) => {
                    const imgSrc = card.photo || card.thumbnail || card.fallbackImage;

                    return (
                      <button
                        key={card.id || `${sIdx}-${cIdx}`}
                        type="button"
                        onClick={() =>
                          setSelectedCard({
                            ...card,
                            modalImage: imgSrc,
                          })
                        }
                        aria-label={`View story: ${card.title}`}
                        className="group/card relative w-full h-[360px] sm:h-[400px] md:h-[440px] lg:h-[calc(880*var(--u))] rounded-[20px] sm:rounded-[26px] lg:rounded-[calc(40*var(--u))] overflow-hidden bg-[#121215] border border-gray-200/70 hover:border-[#ED2024] shadow-md hover:shadow-2xl hover:shadow-[#ED2024]/20 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer text-left select-none focus:outline-none"
                      >
                        {/* High-Resolution Background Photo */}
                        <img
                          src={imgSrc}
                          alt={card.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = card.fallbackImage || '/assets/reviews/cards/card-2-luma-mask.png';
                          }}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-106"
                          draggable={false}
                        />

                        {/* Subtle Bottom Vignette for the Read More button */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover/card:from-black/70 transition-colors" />

                        {/* Play Button Indicator for Video Cards */}
                        {card.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[calc(90*var(--u))] lg:h-[calc(90*var(--u))] rounded-full bg-black/60 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center shadow-xl group-hover/card:scale-110 group-hover/card:bg-[#ED2024] group-hover/card:border-[#ED2024] transition-all duration-300">
                              <svg className="w-5 h-5 lg:w-[calc(30*var(--u))] lg:h-[calc(30*var(--u))] fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* Clean "Read More" Button at Bottom */}
                        <div className="absolute bottom-4 sm:bottom-5 lg:bottom-[calc(40*var(--u))] left-1/2 -translate-x-1/2 z-20">
                          <span className="px-4 py-2 sm:px-5 sm:py-2.5 lg:px-[calc(35*var(--u))] lg:py-[calc(18*var(--u))] rounded-full text-[11px] sm:text-[12px] lg:text-[calc(22*var(--u))] font-semibold bg-white text-black shadow-lg flex items-center gap-1.5 whitespace-nowrap group-hover/card:bg-[#ED2024] group-hover/card:text-white group-hover/card:scale-105 transition-all duration-200">
                            <span>Read More</span>
                            <span className="font-bold text-[#ED2024] group-hover/card:text-white transition-colors">→</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Controls - matches exact RealStoriesSection styling */}
      <div className="w-full flex items-center justify-center gap-3 sm:gap-4 lg:gap-[calc(10*var(--u))] mt-8 sm:mt-12 md:mt-14 lg:mt-[calc(182*var(--u))]">
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-[calc(10*var(--u))]">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-[8px] sm:w-[10px] lg:w-[calc(20*var(--u))] h-[8px] sm:h-[10px] lg:h-[calc(20*var(--u))] rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx
                  ? 'bg-[#ED2124] scale-125 shadow-sm'
                  : 'bg-[#C0C0C0] hover:bg-[#888888]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE STORY & VIDEO MODAL POPUP
          Opens when user clicks ANY card across the slides
          Shows: Photo / Video Player, Full Story Text, Author Badge, Stars & Details
          ========================================================================= */}
      {selectedCard && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCard(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#141416] text-white rounded-[26px] border border-white/15 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header Bar */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ED2024] text-white">
                  {selectedCard.author || selectedCard.name}
                </span>
                <span className="text-xs font-semibold text-white/70 uppercase">
                  {selectedCard.product}
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  ✓ Verified Story
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                aria-label="Close story modal"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Media Display: Video Player or Photo */}
            <div className="relative w-full bg-black flex items-center justify-center overflow-hidden max-h-[380px]">
              {selectedCard.type === 'video' ? (
                selectedCard.mediaLink && selectedCard.mediaLink.includes('youtu') ? (
                  <div className="relative w-full aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${
                        selectedCard.mediaLink.includes('watch?v=')
                          ? selectedCard.mediaLink.split('watch?v=')[1]?.split('&')[0]
                          : 'dQw4w9WgXcQ'
                      }?autoplay=1&rel=0`}
                      title={selectedCard.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-video bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
                    <img
                      src={selectedCard.modalImage || selectedCard.fallbackImage}
                      alt={selectedCard.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#ED2024] text-white flex items-center justify-center shadow-xl mb-3 animate-pulse">
                        <svg className="w-7 h-7 fill-white ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wider text-white">
                        Customer Recovery Video Session
                      </span>
                      <span className="text-xs text-white/70 mt-1">
                        High-Definition 4K Clinical Recording
                      </span>
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full max-h-[360px] flex items-center justify-center bg-black/60 p-2">
                  <img
                    src={selectedCard.modalImage || selectedCard.fallbackImage}
                    alt={selectedCard.title}
                    className="max-h-[340px] w-auto object-contain rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* Modal Story Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">
                  {selectedCard.title}
                </h3>
                {/* 5 Red Stars */}
                <div className="flex items-center gap-1 shrink-0">
                  {Array.from({ length: selectedCard.stars || 5 }).map((_, i) => (
                    <span key={i} className="text-[#ED2024] text-base">
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Story Quote Text */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                <p className="text-sm sm:text-base font-light text-white/90 leading-relaxed italic">
                  “{selectedCard.story}”
                </p>
              </div>

              {/* Verified Product Recommendation Tag */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-white/60">
                <span>
                  Featured LUMA Device: <strong className="text-white font-medium">{selectedCard.product}</strong>
                </span>
                <span className="text-emerald-400 font-semibold">100 mW/cm² Irradiance Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
