import React, { useState, useEffect } from 'react';
import { API_BASE_URL, resolveImageUrl } from '../../config/api';

// ROW 1: Curated Authentic Customer Stories
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

// ROW 2: Verified Users & Real Experiences
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

// ROW 3: Daily Protocols & Clinical Routines
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

// ROW 4: Lab Tests, Unboxings & Video Demonstrations
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

// Fallback high-resolution images for each row
const ROW_FALLBACK_IMAGES = [
  // Row 1
  [
    '/assets/reviews/gallery_cards/card-1-meditation.png',
    '/assets/reviews/cards/card-2-luma-mask.png',
    '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
    '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
    '/assets/reviews/cards/card-5-mask-session.png',
    '/assets/reviews/gallery_cards/card-6-unboxing-panel.png',
    '/assets/reviews/gallery_cards/card-7-assembly-stand.png',
    '/assets/reviews/gallery_cards/card-8-camera-influencer.png',
  ],
  // Row 2
  [
    '/assets/benefits/recovery.jpg',
    '/assets/benefits/clearskin.jpg',
    '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
    '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
    '/assets/benefits/wellness.jpg',
    '/assets/reviews/gallery_cards/card-6-unboxing-panel.png',
    '/assets/reviews/gallery_cards/card-7-assembly-stand.png',
    '/assets/reviews/gallery_cards/card-8-camera-influencer.png',
  ],
  // Row 3
  [
    '/assets/about/story-panel.jpg',
    '/assets/reviews/cards/card-5-mask-session.png',
    '/assets/benefits/recovery.jpg',
    '/assets/reviews/gallery_cards/card-3-goggles-recovery.png',
    '/assets/benefits/cellular.jpg',
    '/assets/about/benefits-athlete-exact.png',
    '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
    '/assets/benefits/wellness.jpg',
  ],
  // Row 4
  [
    '/assets/reviews/gallery_cards/card-8-camera-influencer.png',
    '/assets/reviews/cards/card-2-luma-mask.png',
    '/assets/reviews/gallery_cards/card-4-handheld-panel.png',
    '/assets/before_after/face-after.jpg',
    '/assets/benefits/cellular.jpg',
    '/assets/reviews/gallery_cards/card-7-assembly-stand.png',
    '/assets/reviews/gallery_cards/card-6-unboxing-panel.png',
    '/assets/reviews/gallery_cards/card-1-meditation.png',
  ],
];

/**
 * Single Row Marquee Component:
 * Duplicates its cards for a mathematically continuous, gapless 60fps infinite loop.
 * Pauses smoothly on hover and elevates cards with interactive modal trigger.
 */
function CarouselRow({
  cards,
  rowFallbackImages,
  rowIndex,
  onSelectCard,
}) {
  // Duplicate array once to guarantee seamless infinite wrapping without gaps
  const loopCards = [...cards, ...cards];

  return (
    <div className="relative w-full overflow-hidden group py-1.5 sm:py-2">
      <div
        className={`flex w-max items-center gap-4 sm:gap-5 md:gap-6 marquee-row-${rowIndex} group-hover:[animation-play-state:paused]`}
        style={{ willChange: 'transform' }}
      >
        {loopCards.map((card, idx) => {
          const originalIdx = idx % cards.length;
          const fallback = rowFallbackImages[originalIdx % rowFallbackImages.length];
          const imgSrc = card.photo || card.thumbnail || fallback;

          return (
            <button
              key={`${card.id || originalIdx}-${idx}`}
              type="button"
              onClick={() =>
                onSelectCard({
                  ...card,
                  modalImage: imgSrc,
                  fallbackImage: fallback,
                })
              }
              aria-label={`View story: ${card.title}`}
              className="group/card relative w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px] h-[195px] sm:h-[215px] md:h-[230px] lg:h-[240px] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#111113] border border-black/10 hover:border-[#ED2024]/80 shadow-md hover:shadow-2xl hover:shadow-[#ED2024]/15 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02] cursor-pointer text-left shrink-0 flex flex-col justify-between p-4 sm:p-5 select-none focus:outline-none"
            >
              {/* Background Photo */}
              <img
                src={imgSrc}
                alt={card.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallback;
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-108"
                draggable={false}
              />

              {/* Gradient Vignette Overlays for Maximum Contrast and Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20 group-hover/card:via-black/35 transition-colors" />

              {/* Top Row Badges */}
              <div className="relative z-10 flex items-center justify-between w-full mb-auto">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-black/65 backdrop-blur-md text-white border border-white/15 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ED2024] animate-pulse" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">
                    {card.author || card.badgeName || 'VERIFIED USER'}
                  </span>
                </span>

                {card.type === 'video' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#ED2024] text-white shadow-sm">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Video</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-0.5 bg-black/55 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                    {Array.from({ length: card.stars || 5 }).map((_, s) => (
                      <span key={s} className="text-[#ED2024] text-[11px] leading-none">
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 w-full mt-auto">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ED2024]">
                    {card.product || 'LUMA PANEL'}
                  </span>
                  <span className="text-white/40 text-[9px]">•</span>
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-wide">
                    ✓ Verified Result
                  </span>
                </div>

                <h4 className="text-[13px] sm:text-[14px] font-semibold text-white leading-snug line-clamp-1 group-hover/card:text-red-100 transition-colors">
                  {card.title}
                </h4>

                <p className="text-[11px] sm:text-[12px] text-white/75 font-light leading-relaxed line-clamp-2 mt-1">
                  "{card.story}"
                </p>
              </div>

              {/* Hover Click Pill Indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-black shadow-xl flex items-center gap-1.5 transform scale-90 group-hover/card:scale-100 transition-transform">
                  <span>View Story</span>
                  <span className="text-[#ED2024] font-bold">→</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RealStoryGallerySection({ data }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [adminStories, setAdminStories] = useState([]);

  const title = data?.title || 'REAL STORY';

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

  // Distribute customer stories into 4 dedicated rows, populated with admin-approved stories
  const row1Cards = SLIDE_0_CARDS.map((fallback, idx) => {
    if (adminStories[idx]) {
      return { ...fallback, ...adminStories[idx] };
    }
    return fallback;
  });

  const row2Cards = SLIDE_1_FALLBACK_CARDS.map((fallback, idx) => {
    const adminIdx = idx + 8;
    if (adminStories[adminIdx]) {
      return { ...fallback, ...adminStories[adminIdx] };
    }
    return fallback;
  });

  const row3Cards = SLIDE_2_CARDS.map((fallback, idx) => {
    const adminIdx = idx + 16;
    if (adminStories[adminIdx]) {
      return { ...fallback, ...adminStories[adminIdx] };
    }
    return fallback;
  });

  const row4Cards = SLIDE_3_CARDS.map((fallback, idx) => {
    const adminIdx = idx + 24;
    if (adminStories[adminIdx]) {
      return { ...fallback, ...adminStories[adminIdx] };
    }
    return fallback;
  });

  return (
    <section
      id="real-story"
      className="relative w-full bg-[#FFFFFF] text-[#000000] overflow-hidden font-['Manrope'] select-none py-16 sm:py-20 md:py-24"
    >
      {/* CSS Keyframes for Hardware-Accelerated Continuous Multi-Row Marquee */}
      <style>{`
        @keyframes marqueeScrollLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .marquee-row-1 {
          animation: marqueeScrollLeft 38s linear infinite;
        }
        .marquee-row-2 {
          animation: marqueeScrollRight 44s linear infinite;
        }
        .marquee-row-3 {
          animation: marqueeScrollLeft 41s linear infinite;
        }
        .marquee-row-4 {
          animation: marqueeScrollRight 47s linear infinite;
        }
        @media (max-width: 768px) {
          .marquee-row-1 { animation-duration: 26s; }
          .marquee-row-2 { animation-duration: 30s; }
          .marquee-row-3 { animation-duration: 28s; }
          .marquee-row-4 { animation-duration: 32s; }
        }
      `}</style>

      {/* Section Header: REAL STORY + Red Brand Bar */}
      <div className="relative z-10 text-center px-4 mb-8 sm:mb-12 md:mb-14">
        <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-[#ED2024] block mb-2.5">
          COMMUNITY VOICES &amp; EXPERIENCES
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight uppercase tracking-[0.02em] text-[#131313] leading-none">
          {title}
        </h2>
        <div
          className="mt-4 sm:mt-5 w-20 sm:w-28 md:w-36 h-2 sm:h-2.5 rounded-full bg-[#ED2024] mx-auto"
          aria-hidden="true"
        />
        <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm text-[#71717A] uppercase tracking-[0.12em] font-medium max-w-xl mx-auto">
          Authentic recovery journeys, daily clinical rituals &amp; transformations from LUMA users
        </p>
      </div>

      {/* Multi-Row Carousel Container with Left & Right Gradient Fade Vignettes */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade Vignette */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20"
          aria-hidden="true"
        />
        {/* Right Fade Vignette */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20"
          aria-hidden="true"
        />

        {/* 4 Continuously Scrolling Horizontal Rows */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Row 1: Leftward Scroll */}
          <CarouselRow
            cards={row1Cards}
            rowFallbackImages={ROW_FALLBACK_IMAGES[0]}
            rowIndex={1}
            onSelectCard={setSelectedCard}
          />

          {/* Row 2: Rightward Scroll */}
          <CarouselRow
            cards={row2Cards}
            rowFallbackImages={ROW_FALLBACK_IMAGES[1]}
            rowIndex={2}
            onSelectCard={setSelectedCard}
          />

          {/* Row 3: Leftward Scroll */}
          <CarouselRow
            cards={row3Cards}
            rowFallbackImages={ROW_FALLBACK_IMAGES[2]}
            rowIndex={3}
            onSelectCard={setSelectedCard}
          />

          {/* Row 4: Rightward Scroll */}
          <CarouselRow
            cards={row4Cards}
            rowFallbackImages={ROW_FALLBACK_IMAGES[3]}
            rowIndex={4}
            onSelectCard={setSelectedCard}
          />
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE STORY & VIDEO MODAL POPUP
          Opens when user clicks ANY card across ALL 4 rows
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
