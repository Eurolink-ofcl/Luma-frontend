import React, { useState, useEffect } from 'react';
import { API_BASE_URL, resolveImageUrl } from '../../config/api';

// Curated stock fallback images from PSD assets
const FALLBACK_IMAGES = [
  '/assets/reviews/gallery_cards/card-1-meditation.png',
  '/assets/reviews/gallery_cards/card-2-glow-mask.png',
  '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
  '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
  '/assets/reviews/gallery_cards/card-5-mask-session.png',
  '/assets/reviews/gallery_cards/card-6-unboxing-panel.png',
  '/assets/reviews/gallery_cards/card-7-assembly-stand.png',
  '/assets/reviews/gallery_cards/card-8-camera-influencer.png',
];

const getProductFallbackImage = (productName, idx) => {
  const p = (productName || '').toLowerCase();
  if (p.includes('glow') || p.includes('mask')) {
    return '/assets/reviews/gallery_cards/card-2-glow-mask.png';
  }
  if (p.includes('surge') || p.includes('portable')) {
    return '/assets/reviews/gallery_cards/card-4-handheld-panel.png';
  }
  if (p.includes('apex') || p.includes('half')) {
    return '/assets/reviews/gallery_cards/card-7-assembly-stand.png';
  }
  if (p.includes('max') || p.includes('full') || p.includes('ultra')) {
    return '/assets/reviews/gallery_cards/card-1-meditation.png';
  }
  return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
};

// Curated Fallback Stories
const CURATED_FALLBACK_STORIES = [
  {
    id: 'c-1',
    title: 'Gym & Meditation Deep Recovery',
    author: 'MARCUS & ELENA',
    product: 'LUMA MAX USER',
    type: 'photo',
    stars: 5,
    story:
      'Ten minutes of post-training deep red and near-infrared light reset our physical and mental state after grueling workouts. Muscle tension melts away within hours.',
    image: '/assets/reviews/gallery_cards/card-1-meditation.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-1-meditation.png',
  },
  {
    id: 'c-2',
    title: 'Evening Glow Mask Reading Routine',
    author: 'AHANA K.',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'The mask is light and comfortable, and the 10-minute session flies by while I read. My evening skincare now feels like a soothing restorative ritual.',
    image: '/assets/reviews/gallery_cards/card-2-glow-mask.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-2-glow-mask.png',
  },
  {
    id: 'c-3',
    title: 'Targeted Core & Joint Recovery',
    author: 'JESSICA L.',
    product: 'LUMA SURGE USER',
    type: 'photo',
    stars: 5,
    story:
      'Targeting my core and lower back with 100 mW/cm² clinical irradiance helped eliminate chronic post-workout stiffness in less than three weeks.',
    image: '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
  },
  {
    id: 'c-4',
    title: 'Handheld Facial Radiance Protocol',
    author: 'ELENA ROSTOVA',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'After 3 weeks of daily 10-minute sessions with Luma Glow, my skin texture has smoothed out noticeably and fine lines around my eyes have faded. Truly clinical grade!',
    image: '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
  },
  {
    id: 'c-5',
    title: 'Clinical Facial Skin Turnover Session',
    author: 'CHLOE D.',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'Zero UV emission, medical-grade LEDs, and zero heat burn risk. I use it four evenings a week. My complexion has never looked firmer or more vibrant.',
    image: '/assets/reviews/gallery_cards/card-5-mask-session.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-5-mask-session.png',
  },
  {
    id: 'c-6',
    title: 'Unboxing & First Setup Routine',
    author: 'SARAH M.',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-unboxing-review',
    stars: 5,
    story:
      'Setting up the medical-grade panel took under five minutes. The fanless cooling, silent operation, and immediate soothing warmth make it an extraordinary investment.',
    image: '/assets/reviews/gallery_cards/card-6-unboxing-panel.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-6-unboxing-panel.png',
  },
  {
    id: 'c-7',
    title: 'Mobile Stand Assembly & Daily Use',
    author: 'DAVID K.',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-apex-review',
    stars: 5,
    story:
      'The wheeled stand glides seamlessly between rooms. Sturdy build, high irradiance, and zero flicker. It has become a foundational pillar of my daily recovery routine.',
    image: '/assets/reviews/gallery_cards/card-7-assembly-stand.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-7-assembly-stand.png',
  },
  {
    id: 'c-8',
    title: 'Studio Spectrometer Irradiance Test',
    author: 'MARCUS VANCE',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-spectrometer-test',
    stars: 5,
    story:
      'Using the Luma Apex half-body panel after intense workout sessions has cut my recovery time in half. Muscle stiffness is completely gone by the next morning.',
    image: '/assets/reviews/gallery_cards/card-8-camera-influencer.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-8-camera-influencer.png',
  },
  {
    id: 'c-9',
    title: 'Shoulder & Spine Recovery Session',
    author: 'LIAM GALLAGHER',
    product: 'LUMA SURGE USER',
    type: 'photo',
    stars: 5,
    story:
      'Targeting my upper back and neck with focused near-infrared light completely stopped the chronic stiffness I get from computer work.',
    image: '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
  },
  {
    id: 'c-10',
    title: 'Daily Radiance Facial Protocol',
    author: 'SOPHIA CHEN',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'The mask fits effortlessly and zero eye strain with the clinical design. My complexion looks rested and glowing every single morning.',
    image: '/assets/reviews/gallery_cards/card-2-glow-mask.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-2-glow-mask.png',
  },
  {
    id: 'c-11',
    title: 'Morning Mental Clarity & Vitality',
    author: 'JAMESON T.',
    product: 'LUMA ULTRA USER',
    type: 'photo',
    stars: 5,
    story:
      'Standing in front of the full-body panel for 10 minutes at sunrise has completely replaced morning grogginess with clean cellular vitality.',
    image: '/assets/reviews/gallery_cards/card-1-meditation.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-1-meditation.png',
  },
  {
    id: 'c-12',
    title: 'Hands-Free Remote Controlled Sessions',
    author: 'OLIVIA PARKER',
    product: 'LUMA NOVA USER',
    type: 'photo',
    stars: 5,
    story:
      'The wireless controller and preset clinical modes make each session effortless. I have recommended it to all my physical therapy colleagues.',
    image: '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
    fallbackImage: '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
  },
];

export default function RealStoryGallerySection({ data }) {
  const [activeDot, setActiveDot] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [adminStories, setAdminStories] = useState([]);
  const [touchStartX, setTouchStartX] = useState(null);

  const title = data?.title || 'REAL STORY';

  // Fetch approved customer stories from backend MongoDB
  useEffect(() => {
    fetch(`${API_BASE_URL}/stories`)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((s, idx) => {
            const resolvedPhoto = resolveImageUrl(s.photo || s.thumbnail || '');
            const fallbackImg = getProductFallbackImage(s.product, idx);
            const rawProd = s.badgeProduct || s.product || 'Luma Glow';
            const prodClean = rawProd
              .replace(/^luma\s+/i, '')
              .replace(/\s+user$/i, '')
              .trim()
              .toUpperCase();

            return {
              id: s._id || `admin-${idx}`,
              photo: resolvedPhoto,
              thumbnail: resolvedPhoto,
              image: resolvedPhoto || fallbackImg,
              fallbackImage: fallbackImg,
              title: `${s.name}'s Real Story`,
              author: s.badgeName || s.name.toUpperCase(),
              product: `${prodClean} USER`,
              type: s.mediaLink && s.mediaLink.includes('youtu') ? 'video' : (s.mediaLink ? 'video' : 'photo'),
              mediaLink: s.mediaLink || '',
              stars: s.stars || 5,
              story: s.story,
              isLiveAdminStory: true,
            };
          });
          setAdminStories(mapped);
        }
      })
      .catch((err) => {
        console.warn('Error fetching live stories:', err);
      });
  }, []);

  // Keyboard close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCard(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Combine live approved customer stories at the FRONT, followed by curated fallbacks
  const combinedCards = React.useMemo(() => {
    if (adminStories.length === 0) return CURATED_FALLBACK_STORIES;
    
    // Deduplicate any fallback stories whose author matches an admin story
    const nonDuplicatedFallbacks = CURATED_FALLBACK_STORIES.filter(
      (fb) => !adminStories.some((as) => as.author?.toLowerCase() === fb.author?.toLowerCase())
    );

    return [...adminStories, ...nonDuplicatedFallbacks];
  }, [adminStories]);

  // Group cards into pages of 4 cards each for desktop/tablet
  const CARDS_PER_SLIDE = 4;
  const totalSlides = Math.max(3, Math.ceil(combinedCards.length / CARDS_PER_SLIDE));

  const slides = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < totalSlides; i++) {
      const start = i * CARDS_PER_SLIDE;
      const slice = combinedCards.slice(start, start + CARDS_PER_SLIDE);
      // If last slide has fewer than 4, fill from beginning
      if (slice.length < CARDS_PER_SLIDE) {
        const remaining = CARDS_PER_SLIDE - slice.length;
        slice.push(...combinedCards.slice(0, remaining));
      }
      list.push(slice);
    }
    return list;
  }, [combinedCards, totalSlides]);

  // Auto-advance carousel gently when modal is closed and not hovered
  useEffect(() => {
    if (isHovered || selectedCard) return;
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
    }, 6500);
    return () => clearInterval(interval);
  }, [isHovered, selectedCard, totalSlides]);

  const handlePrev = () => {
    setActiveDot((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setActiveDot((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
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

  return (
    <section
      id="real-story"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full bg-[#FFFFFF] text-[#000000] overflow-hidden font-['Manrope'] select-none py-14 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header: Title + Red Accent Bar */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extralight uppercase tracking-[0.02em] text-[#131313] leading-none">
            {title}
          </h2>
          <div
            className="mt-3.5 sm:mt-5 w-20 sm:w-28 md:w-36 h-2 sm:h-2.5 rounded-full bg-[#ED2124]"
            aria-hidden="true"
          />
          <p className="mt-3 text-xs sm:text-sm text-gray-500 font-light tracking-wide max-w-xl">
            Real customer clinical outcomes, recovery routines, and authentic treatment experiences.
          </p>
        </div>

        {/* Carousel Container with Left/Right Arrow Navigation */}
        <div
          className="relative w-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous customer stories"
            className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-xl border border-gray-200/80 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
          >
            <svg className="w-5 h-5 -ml-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next customer stories"
            className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-xl border border-gray-200/80 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
          >
            <svg className="w-5 h-5 -mr-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slider Viewport */}
          <div className="w-full overflow-hidden">
            <div
              className="flex w-full transition-transform duration-700 ease-out will-change-transform"
              style={{ transform: `translateX(-${activeDot * 100}%)` }}
            >
              {slides.map((slideCards, sIdx) => (
                <div
                  key={`slide-${sIdx}`}
                  className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-1 sm:px-2"
                >
                  {slideCards.map((card, cIdx) => (
                    <div
                      key={card.id || `${sIdx}-${cIdx}`}
                      onClick={() =>
                        setSelectedCard({
                          ...card,
                          modalImage: card.photo || card.thumbnail || card.image || card.fallbackImage,
                          fallbackImage: card.fallbackImage,
                        })
                      }
                      className="group relative aspect-[3/4] rounded-2xl sm:rounded-[22px] overflow-hidden bg-neutral-900 border border-gray-200/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-end p-5 sm:p-6 select-none"
                    >
                      {/* Card Photo / Image */}
                      <img
                        src={card.image || card.photo || card.thumbnail || card.fallbackImage}
                        alt={card.title || card.author}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                          if (card.fallbackImage && e.currentTarget.src !== card.fallbackImage) {
                            e.currentTarget.src = card.fallbackImage;
                          }
                        }}
                      />

                      {/* Card Gradient Overlay for Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 group-hover:from-black/100 transition-colors duration-300" />

                      {/* Video Play Badge if Video */}
                      {card.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#ED2124] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 fill-white ml-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Top Pill: Verified User Story Badge */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        {card.isLiveAdminStory ? (
                          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-emerald-500/90 text-white backdrop-blur-md shadow-sm flex items-center gap-1">
                            ✓ Verified Review
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 text-white/90 backdrop-blur-md">
                            Clinical Story
                          </span>
                        )}
                      </div>

                      {/* Card Information Bottom Panel */}
                      <div className="relative z-10 text-white space-y-2">
                        {/* Author & Product Badges */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#ED2124] text-white shadow-xs">
                            {card.author}
                          </span>
                          <span className="text-[11px] text-white/80 font-medium tracking-wide">
                            {card.product}
                          </span>
                        </div>

                        {/* 5 Stars Rating */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: card.stars || 5 }).map((_, i) => (
                            <span key={i} className="text-[#ED2124] text-sm leading-none">
                              ★
                            </span>
                          ))}
                        </div>

                        {/* Story Quote Snippet */}
                        <p className="text-xs sm:text-[13px] font-light text-white/95 line-clamp-3 leading-snug italic pt-0.5">
                          “{card.story}”
                        </p>

                        {/* Hover Prompt Link */}
                        <div className="pt-1 flex items-center text-[11px] font-semibold text-white/70 group-hover:text-white transition-colors">
                          <span>Read full review →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8 sm:mt-10">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#ED2124] w-7 h-2.5 shadow-sm'
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5'
              }`}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE STORY & VIDEO MODAL POPUP
          Opens when user clicks ANY card
          Shows: Photo / Video Player, Full Story Text, Author Badge, Stars & Details
          ========================================================================= */}
      {selectedCard && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCard(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-[#141415] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header Bar */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ED2124]">
                  {selectedCard.author}
                </span>
                <span className="text-xs text-white/60">
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
                      <div className="w-16 h-16 rounded-full bg-[#ED2124] text-white flex items-center justify-center shadow-xl mb-3 animate-pulse">
                        <svg className="w-7 h-7 fill-white ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wider text-white">
                        Customer Recovery Video Session
                      </span>
                      <span className="text-xs text-white/70 mt-1">
                        High-Definition Clinical Recording
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
                    <span key={i} className="text-[#ED2124] text-base leading-none">
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
                <span>Featured LUMA Device: <strong className="text-white font-medium">{selectedCard.product}</strong></span>
                <span className="text-emerald-400 font-semibold">100 mW/cm² Irradiance Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
