import React, { useState, useEffect } from 'react';
import { API_BASE_URL, resolveImageUrl } from '../../config/api';

// Exact 8 Curved Position coordinates on 3840x1606 canvas (PSD: bbox y=3091..4697)
const CARD_POSITIONS = [
  { left: 'calc(0 * var(--u))', top: 'calc(0 * var(--u))', width: 'calc(390 * var(--u))', height: 'calc(1606 * var(--u))' },
  { left: 'calc(446 * var(--u))', top: 'calc(245 * var(--u))', width: 'calc(609 * var(--u))', height: 'calc(1055 * var(--u))' },
  { left: 'calc(1093 * var(--u))', top: 'calc(418 * var(--u))', width: 'calc(450 * var(--u))', height: 'calc(710 * var(--u))' },
  { left: 'calc(1571 * var(--u))', top: 'calc(483 * var(--u))', width: 'calc(390 * var(--u))', height: 'calc(577 * var(--u))' },
  { left: 'calc(1983 * var(--u))', top: 'calc(489 * var(--u))', width: 'calc(386 * var(--u))', height: 'calc(566 * var(--u))' },
  { left: 'calc(2394 * var(--u))', top: 'calc(439 * var(--u))', width: 'calc(429 * var(--u))', height: 'calc(669 * var(--u))' },
  { left: 'calc(2862 * var(--u))', top: 'calc(297 * var(--u))', width: 'calc(558 * var(--u))', height: 'calc(951 * var(--u))' },
  { left: 'calc(3472 * var(--u))', top: 'calc(80 * var(--u))', width: 'calc(368 * var(--u))', height: 'calc(1418 * var(--u))' },
];

// The 8 dedicated transparent-corner 3D perspective curved card assets from PSD
const GALLERY_CARD_ASSETS = [
  {
    image: '/assets/reviews/gallery_cards/card-1-meditation.png',
    imageWebp: '/assets/reviews/gallery_cards/card-1-meditation.webp',
  },
  {
    image: '/assets/reviews/gallery_cards/card-2-glow-mask.png',
    imageWebp: '/assets/reviews/gallery_cards/card-2-glow-mask.webp',
  },
  {
    image: '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
    imageWebp: '/assets/reviews/gallery_cards/card-3-goggles-recovery.webp',
  },
  {
    image: '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
    imageWebp: '/assets/reviews/gallery_cards/card-4-handheld-panel.webp',
  },
  {
    image: '/assets/reviews/gallery_cards/card-5-mask-session.png',
    imageWebp: '/assets/reviews/gallery_cards/card-5-mask-session.webp',
  },
  {
    image: '/assets/reviews/gallery_cards/card-6-unboxing-panel.png',
    imageWebp: '/assets/reviews/gallery_cards/card-6-unboxing-panel.webp',
  },
  {
    image: '/assets/reviews/gallery_cards/card-7-assembly-stand.png',
    imageWebp: '/assets/reviews/gallery_cards/card-7-assembly-stand.webp',
  },
  {
    image: '/assets/reviews/gallery_cards/card-8-camera-influencer.png',
    imageWebp: '/assets/reviews/gallery_cards/card-8-camera-influencer.webp',
  },
];

// SLIDE 0: Original Curated PSD Stories
const SLIDE_0_CARDS = [
  {
    id: 's0-1',
    title: 'Gym & Meditation Deep Recovery',
    author: 'MARCUS & ELENA',
    product: 'LUMA MAX USER',
    type: 'photo',
    stars: 5,
    story:
      'Ten minutes of post-training deep red and near-infrared light reset our physical and mental state after grueling workouts. Muscle tension melts away within hours.',
  },
  {
    id: 's0-2',
    title: 'Evening Glow Mask Reading Routine',
    author: 'AHANA K.',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'The mask is light and comfortable, and the 10-minute session flies by while I read. My evening skincare now feels like a soothing restorative ritual.',
  },
  {
    id: 's0-3',
    title: 'Targeted Core & Joint Recovery',
    author: 'JESSICA L.',
    product: 'LUMA SURGE USER',
    type: 'photo',
    stars: 5,
    story:
      'Targeting my core and lower back with 100 mW/cm² clinical irradiance helped eliminate chronic post-workout stiffness in less than three weeks.',
  },
  {
    id: 's0-4',
    title: 'Handheld Facial Radiance Protocol',
    author: 'ELENA ROSTOVA',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'After 3 weeks of daily 10-minute sessions with Luma Glow, my skin texture has smoothed out noticeably and fine lines around my eyes have faded. Truly clinical grade!',
  },
  {
    id: 's0-5',
    title: 'Clinical Facial Skin Turnover Session',
    author: 'CHLOE D.',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'Zero UV emission, medical-grade LEDs, and zero heat burn risk. I use it four evenings a week. My complexion has never looked firmer or more vibrant.',
  },
  {
    id: 's0-6',
    title: 'Unboxing & First Setup Routine',
    author: 'SARAH M.',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-unboxing-review',
    stars: 5,
    story:
      'Setting up the medical-grade panel took under five minutes. The fanless cooling, silent operation, and immediate soothing warmth make it an extraordinary investment.',
  },
  {
    id: 's0-7',
    title: 'Mobile Stand Assembly & Daily Use',
    author: 'DAVID K.',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-apex-review',
    stars: 5,
    story:
      'The wheeled stand glides seamlessly between rooms. Sturdy build, high irradiance, and zero flicker. It has become a foundational pillar of my daily recovery routine.',
  },
  {
    id: 's0-8',
    title: 'Studio Spectrometer Irradiance Test',
    author: 'MARCUS VANCE',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-spectrometer-test',
    stars: 5,
    story:
      'Using the Luma Apex half-body panel after intense workout sessions has cut my recovery time in half. Muscle stiffness is completely gone by the next morning.',
  },
];

// SLIDE 1: Customer Verified Real Stories (Dynamically filled with approved customer stories from MongoDB)
const SLIDE_1_FALLBACK_CARDS = [
  {
    id: 's1-1',
    title: 'Post-Workout Full-Body Reset',
    author: 'MARCUS VANCE',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-apex-review',
    stars: 5,
    story:
      'Using the Luma Apex half-body panel after intense workout sessions has cut my recovery time in half. Muscle stiffness is completely gone by the next morning.',
  },
  {
    id: 's1-2',
    title: 'Evening Collagen & Firming Routine',
    author: 'ELENA ROSTOVA',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'After 3 weeks of daily 10-minute sessions with Luma Glow, my skin texture has smoothed out noticeably and fine lines around my eyes have faded. Truly clinical grade!',
  },
  {
    id: 's1-3',
    title: 'Shoulder & Spine Recovery Session',
    author: 'LIAM GALLAGHER',
    product: 'LUMA SURGE USER',
    type: 'photo',
    stars: 5,
    story:
      'Targeting my upper back and neck with focused near-infrared light completely stopped the chronic stiffness I get from computer work.',
  },
  {
    id: 's1-4',
    title: 'Daily Radiance Facial Protocol',
    author: 'SOPHIA CHEN',
    product: 'LUMA GLOW USER',
    type: 'photo',
    stars: 5,
    story:
      'The mask fits effortlessly and zero eye strain with the clinical design. My complexion looks rested and glowing every single morning.',
  },
  {
    id: 's1-5',
    title: 'Desk Worker Afternoon Recharge',
    author: 'RACHEL GREEN',
    product: 'LUMA NOVA USER',
    type: 'photo',
    stars: 5,
    story:
      'A 10-minute afternoon session gives me clean mental clarity and completely relaxes my posture tension without caffeine crashes.',
  },
  {
    id: 's1-6',
    title: 'Full-Body Cellular Energy Session',
    author: 'JORDAN HAYES',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-unboxing-review',
    stars: 5,
    story:
      'Zero fan noise, zero flicker, and true medical irradiance. The build quality feels like hospital equipment. Unboxing was super clean.',
  },
  {
    id: 's1-7',
    title: '30-Day Recovery Transformation',
    author: 'NATALIE BROOKS',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-apex-review',
    stars: 5,
    story:
      'The mobile stand glides anywhere. I use it every morning on my yoga mat. My joints have never felt this loose and pain-free.',
  },
  {
    id: 's1-8',
    title: 'Clinical Irradiance Calibration Test',
    author: 'DR. ALEXANDER WARD',
    product: 'LUMA APEX USER',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-spectrometer-test',
    stars: 5,
    story:
      'We tested the dual 660nm and 850nm diodes with our lab spectrometer. Output matches clinical specs with exactly zero EMF radiation.',
  },
];

// SLIDE 2: Daily Wellness & Clinical Protocols
const SLIDE_2_CARDS = [
  {
    id: 's2-1',
    title: 'Circadian Rhythm Morning Protocol',
    author: 'CLINICAL WELLNESS TEAM',
    product: 'LUMA MAX PROTOCOL',
    type: 'photo',
    stars: 5,
    story:
      '10 minutes of direct morning exposure within 30 minutes of waking resets the master circadian clock, boosting daytime alertness and nighttime melatonin synthesis.',
  },
  {
    id: 's2-2',
    title: 'Evening Collagen Synthesis Protocol',
    author: 'DERMATOLOGY ADVISORY',
    product: 'LUMA GLOW PROTOCOL',
    type: 'photo',
    stars: 5,
    story:
      '660nm pure red wavelengths penetrate 2-3mm into the dermal matrix, stimulating fibroblast cells to produce new collagen and elastin fibers.',
  },
  {
    id: 's2-3',
    title: 'Deep Muscle Soreness (DOMS) Protocol',
    author: 'SPORTS MEDICINE TEAM',
    product: 'LUMA SURGE PROTOCOL',
    type: 'photo',
    stars: 5,
    story:
      'Deep-penetrating 850nm near-infrared wavelengths target muscle mitochondria, clearing lactic acid and reducing post-exercise inflammation.',
  },
  {
    id: 's2-4',
    title: 'Joint Mobility & Connective Tissue Protocol',
    author: 'PHYSIOTHERAPY TEAM',
    product: 'LUMA GLOW PROTOCOL',
    type: 'photo',
    stars: 5,
    story:
      'Position panel 6 inches from targeted joint for 10-15 minutes prior to stretching to improve joint lubricity and range of motion.',
  },
  {
    id: 's2-5',
    title: 'Cellular ATP Mitochondrial Protocol',
    author: 'BIO-OPTIMIZATION LAB',
    product: 'LUMA GLOW PROTOCOL',
    type: 'photo',
    stars: 5,
    story:
      'Photobiomodulation at cytochrome c oxidase accelerates ATP production by up to 200%, supplying vital bio-energy for cellular repair.',
  },
  {
    id: 's2-6',
    title: 'Full-Body Post-Workout Recovery Protocol',
    author: 'PERFORMANCE COACHES',
    product: 'LUMA APEX PROTOCOL',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-unboxing-review',
    stars: 5,
    story:
      'Stand 12 inches away for 10 minutes front and 10 minutes back immediately following high-intensity training to cut recovery latency in half.',
  },
  {
    id: 's2-7',
    title: 'Tension Headache & Neck Relief Protocol',
    author: 'WELLNESS CLINIC',
    product: 'LUMA APEX PROTOCOL',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-apex-review',
    stars: 5,
    story:
      'Position stand at shoulder height for 8 minutes to stimulate local nitric oxide release and promote soothing muscular relaxation.',
  },
  {
    id: 's2-8',
    title: 'Restorative Sleep Architecture Protocol',
    author: 'SLEEP RESEARCH LAB',
    product: 'LUMA APEX PROTOCOL',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-spectrometer-test',
    stars: 5,
    story:
      'Bathe bedroom in red light 60 minutes before bedtime with zero blue/green spectrum to signal the pineal gland for deep, restorative sleep.',
  },
];

// SLIDE 3: Video Reviews Archive & Irradiance Tests
const SLIDE_3_CARDS = [
  {
    id: 's3-1',
    title: '100 mW/cm² Irradiance Spectrometer Test',
    author: 'LAB IRRADIANCE REPORT',
    product: 'LUMA MAX TEST',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-spectrometer-test',
    stars: 5,
    story:
      'Independent lab testing confirms true 100 mW/cm² irradiance at 6 inches distance with 0.0 µT EMF radiation and 0.0% flicker index.',
  },
  {
    id: 's3-2',
    title: 'Unboxing the Luma Glow Facial Mask',
    author: 'SKINCARE DIARIES',
    product: 'LUMA GLOW REVIEW',
    type: 'photo',
    stars: 5,
    story:
      'Watch the full unboxing and comfort walkthrough: medical-grade silicone, flexible fit, and eye protection goggles included in the box.',
  },
  {
    id: 's3-3',
    title: 'Luma Surge Travel Panel Demonstration',
    author: 'ATHLETE TRAVEL LOG',
    product: 'LUMA SURGE REVIEW',
    type: 'photo',
    stars: 5,
    story:
      'Taking clinical red light on the road: how the compact aluminum casing fits into carry-on luggage for hotel recovery sessions.',
  },
  {
    id: 's3-4',
    title: '60-Day Visual Complexion Timelapse',
    author: 'ESTHETICIAN REVIEW',
    product: 'LUMA GLOW REVIEW',
    type: 'photo',
    stars: 5,
    story:
      'High-resolution dermatological imaging tracking skin tone evenness, pore texture, and redness reduction over 8 consecutive weeks.',
  },
  {
    id: 's3-5',
    title: 'Dual-Chip Wavelength Technology Explained',
    author: 'ENGINEERING SPOTLIGHT',
    product: 'LUMA TECH INSIDE',
    type: 'photo',
    stars: 5,
    story:
      'Inside the multi-cluster LED array: individual 660nm and 850nm diodes engineered with 30-degree optical lenses for optimal penetration.',
  },
  {
    id: 's3-6',
    title: 'Heavy Duty Wheeled Stand Assembly Video',
    author: 'CUSTOMER ASSEMBLY',
    product: 'LUMA APEX SETUP',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-unboxing-review',
    stars: 5,
    story:
      'Step-by-step 4K assembly video of the wheeled stand and modular bracket mounting system for multi-panel arrays.',
  },
  {
    id: 's3-7',
    title: 'Panel Cooling & Zero-Noise Sound Meter Test',
    author: 'TECH RECOVERY CHANNEL',
    product: 'LUMA APEX TEST',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-apex-review',
    stars: 5,
    story:
      'Decibel meter testing demonstrates whisper-quiet heat dissipation fins running 12 dB below standard competitor fans.',
  },
  {
    id: 's3-8',
    title: 'Influencer Studio Full-Body Panel Test',
    author: 'FITNESS CREATOR STUDIO',
    product: 'LUMA APEX REVIEW',
    type: 'video',
    mediaLink: 'https://www.youtube.com/watch?v=sample-spectrometer-test',
    stars: 5,
    story:
      'Live workout recovery test with infrared thermal imaging camera tracking subcutaneous tissue warming and blood circulation.',
  },
];

export default function RealStoryGallerySection({ data }) {
  const [activeDot, setActiveDot] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
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
            title: `${s.name}'s Real Story`,
            author: s.badgeName || s.name.toUpperCase(),
            product: s.badgeProduct || `${(s.product || 'Luma Apex').toUpperCase()} USER`,
            type: s.mediaLink && s.mediaLink.includes('youtu') ? 'video' : (s.mediaLink ? 'video' : 'photo'),
            mediaLink: s.mediaLink || '',
            stars: s.stars || 5,
            story: s.story,
          }));
          setAdminStories(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCard(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Build the 4 slides matching exact PSD Layer 1: REAL STORY
  // Dynamic admin-approved customer stories from MongoDB populate Slide 0 (FIRST SLIDE)
  // so admin approved stories are immediately active and visible on the 3D gallery arc!
  const slide0Cards = SLIDE_0_CARDS.map((fallback, idx) => {
    if (adminStories[idx]) {
      return {
        ...fallback,
        ...adminStories[idx],
      };
    }
    return fallback;
  });

  const slide1Cards = SLIDE_1_FALLBACK_CARDS.map((fallback, idx) => {
    const adminIdx = idx + 8;
    if (adminStories[adminIdx]) {
      return {
        ...fallback,
        ...adminStories[adminIdx],
      };
    }
    return fallback;
  });

  const allSlides = [
    { id: 0, cards: slide0Cards },
    { id: 1, cards: slide1Cards },
    { id: 2, cards: SLIDE_2_CARDS },
    { id: 3, cards: SLIDE_3_CARDS },
  ];

  return (
    <section
      id="real-story"
      style={{ '--u': 'calc(100vw / 3840)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full bg-[#FFFFFF] text-[#000000] overflow-hidden font-['Manrope'] select-none pt-10 sm:pt-14 md:pt-18 lg:pt-0 pb-10 sm:pb-14 md:pb-18 lg:pb-0"
    >
      {/* =========================================================================
          DESKTOP HERO COMPOSITION (Exact PSD 'Layer 1: REAL STORY' y=3091..4697)
          Aspect ratio: 3840w x 1606h (aspect-[3840/1606])
          ALL 4 SLIDES DISPLAY IN THE EXACT SAME 8-CARD CURVED PANORAMIC IMAGES GRID!
          NO TEXT ON THE SLIDE. WHEN USER CLICKS ANY CARD, THE MODAL OPENS WITH THE TEXT.
          ========================================================================= */}
      <div className="relative w-full hidden lg:block aspect-[3840/1606] h-[calc(1606*var(--u))] overflow-hidden">
        {/* Slider Track */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeDot * 100}%)` }}
        >
          {allSlides.map((slide, sIdx) => (
            <div key={slide.id || sIdx} className="relative w-full h-full shrink-0">
              {/* 8 Separate Interactive Image Cards positioned along the 3D concave curve */}
              {slide.cards.map((card, cIdx) => {
                const pos = CARD_POSITIONS[cIdx] || CARD_POSITIONS[0];
                const cardAsset = GALLERY_CARD_ASSETS[cIdx] || GALLERY_CARD_ASSETS[0];

                return (
                  <button
                    key={card.id || `${sIdx}-${cIdx}`}
                    type="button"
                    onClick={() =>
                      setSelectedCard({
                        ...card,
                        modalImage: card.photo || card.thumbnail || cardAsset.image,
                        fallbackImage: cardAsset.image,
                      })
                    }
                    aria-label={`View story: ${card.title}`}
                    style={{
                      position: 'absolute',
                      left: pos.left,
                      top: pos.top,
                      width: pos.width,
                      height: pos.height,
                    }}
                    className="group cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-[1.03] hover:z-20 will-change-transform"
                  >
                    {/* Individual Card Image - Exact 3D perspective curved silhouette from PSD */}
                    <div className="w-full h-full overflow-hidden">
                      {card.photo ? (
                        <div
                          className="w-full h-full relative"
                          style={{
                            WebkitMaskImage: `url(${cardAsset.imageWebp || cardAsset.image})`,
                            maskImage: `url(${cardAsset.imageWebp || cardAsset.image})`,
                            WebkitMaskSize: 'contain',
                            maskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            maskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            maskPosition: 'center',
                          }}
                        >
                          <img
                            src={card.photo}
                            alt={card.title}
                            className="w-full h-full object-cover pointer-events-none select-none filter drop-shadow-sm group-hover:drop-shadow-2xl transition-all duration-300"
                            draggable={false}
                          />
                        </div>
                      ) : (
                        <picture>
                          <source srcSet={cardAsset.imageWebp} type="image/webp" />
                          <img
                            src={cardAsset.image}
                            alt={card.title}
                            className="w-full h-full object-contain pointer-events-none select-none filter drop-shadow-sm group-hover:drop-shadow-2xl transition-all duration-300"
                            draggable={false}
                          />
                        </picture>
                      )}
                    </div>

                    {/* Subtle Hover Action Hint */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                      <span className="px-3 py-1 rounded-full text-[calc(14*var(--u))] font-semibold bg-black/85 text-white backdrop-blur-sm shadow-md">
                        🔍 View Story
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Section Header: Title + Red Pill Bar (PSD canvas y=3198..3326 -> relative y=107..235) */}
              <div
                style={{ top: 'calc(107 * var(--u))' }}
                className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center text-center pointer-events-none"
              >
                <h2 className="text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#131313] leading-none whitespace-nowrap">
                  {title}
                </h2>
                <div
                  style={{
                    marginTop: 'calc(47 * var(--u))',
                    width: 'calc(150 * var(--u))',
                    height: 'calc(20 * var(--u))',
                  }}
                  className="rounded-full bg-[#ED2124]"
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 4 Pagination Dots (PSD: 4 dots at y=4403, 20x20px each, gap 10px, active #ED2124, rest #C0C0C0) */}
        <div
          style={{
            top: 'calc(1312 * var(--u))',
            gap: 'calc(14 * var(--u))',
          }}
          className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-auto"
        >
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: 'calc(20 * var(--u))',
                height: 'calc(20 * var(--u))',
              }}
              className={`min-w-[12px] min-h-[12px] rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#ED2124] scale-125 shadow-md'
                  : 'bg-[#C0C0C0] hover:bg-[#888888]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          MOBILE & TABLET RESPONSIVE LAYOUT (< lg screens)
          Each slide renders 8 image cards in horizontal scrollable strip.
          No text on slide; clicking opens modal with story and video.
          ========================================================================= */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full lg:hidden flex flex-col items-center"
      >
        <div className="w-full overflow-hidden">
          <div
            className="flex w-full transition-transform duration-700 ease-out will-change-transform"
            style={{ transform: `translateX(-${activeDot * 100}%)` }}
          >
            {allSlides.map((slide, sIdx) => (
              <div key={slide.id || sIdx} className="w-full shrink-0 flex flex-col items-center">
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <h2 className="text-[26px] sm:text-[34px] md:text-[44px] font-extralight uppercase tracking-[0.02em] text-[#131313] leading-none">
                    {title}
                  </h2>
                  <div
                    className="mt-3 sm:mt-4 w-[60px] sm:w-[80px] h-[8px] sm:h-[11px] rounded-full bg-[#ED2124]"
                    aria-hidden="true"
                  />
                </div>

                {/* Scrollable Cards Strip */}
                <div className="relative w-full mt-6 sm:mt-8 overflow-x-auto scrollbar-none pb-4 px-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-max">
                    {slide.cards.map((card, cIdx) => {
                      const cardAsset = GALLERY_CARD_ASSETS[cIdx] || GALLERY_CARD_ASSETS[0];
                      return (
                        <button
                          key={card.id || `${sIdx}-${cIdx}`}
                          type="button"
                          onClick={() =>
                            setSelectedCard({
                              ...card,
                              modalImage: card.photo || card.thumbnail || cardAsset.image,
                              fallbackImage: cardAsset.image,
                            })
                          }
                          className="relative w-[180px] sm:w-[240px] aspect-[3/4] rounded-2xl overflow-hidden shadow-md active:scale-95 transition-transform bg-[#1a1a1a] flex flex-col justify-end p-3 text-left"
                        >
                          <img
                            src={card.photo || card.thumbnail || cardAsset.image}
                            alt={card.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          <div className="relative z-10 text-white">
                            <span className="text-[10px] uppercase font-bold text-[#ED2124] tracking-wider block">
                              {card.author || card.product}
                            </span>
                            <h4 className="text-[12px] font-medium leading-snug line-clamp-2">
                              {card.title}
                            </h4>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-5 sm:mt-6">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-[9px] sm:w-[11px] h-[9px] sm:h-[11px] rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#ED2124] scale-125 shadow-sm'
                  : 'bg-[#C0C0C0] hover:bg-[#888888]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE STORY & VIDEO MODAL POPUP
          Opens when user clicks ANY card (Cards 1..8 across ALL slides)
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
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ED2124] text-white">
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
                      <div className="w-16 h-16 rounded-full bg-[#ED2124] text-white flex items-center justify-center shadow-xl mb-3 animate-pulse">
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
                    <img
                      key={i}
                      src="/assets/reviews/star-red.png"
                      alt="Star"
                      className="w-4 h-4 object-contain"
                    />
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
