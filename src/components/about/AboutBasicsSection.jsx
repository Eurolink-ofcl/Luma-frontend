import React, { useState, useEffect } from 'react';

const defaultStatCards = [
  { num: '2', unit: '', label: 'WAVE LENGTH USED' },
  { num: '20+', unit: 'YRS', label: 'CLINICAL RESEARCH' },
  { num: '0', unit: '', label: 'UV EXPOSURE' },
];

const DEFAULT_CLINICAL_VIDEO = 'https://www.youtube.com/watch?v=5YV_iKnzDRg';

function getEmbedUrl(url) {
  if (!url) return 'https://www.youtube.com/embed/5YV_iKnzDRg?autoplay=1&rel=0';
  if (url.includes('youtube.com/embed/')) {
    return `${url}${url.includes('?') ? '&' : '?'}autoplay=1&rel=0`;
  }
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([^&]+)/);
    const id = match ? match[1] : '5YV_iKnzDRg';
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0] || '5YV_iKnzDRg';
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1]?.split(/[?&]/)[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  return url;
}

function isIframeEmbed(url) {
  if (!url) return true;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

export default function AboutBasicsSection({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const eyebrow = data?.eyebrow || 'THE BASICS';
  const heading = data?.heading || 'WHAT IS RED LIGHT THERAPY?';
  const videoBannerImage = data?.videoBannerImage || '/assets/about/dubai-rlt-banner.jpg';
  const rawVideoUrl = data?.videoUrl || '';
  const effectiveVideoUrl = rawVideoUrl.trim() || DEFAULT_CLINICAL_VIDEO;

  const explanationP1 =
    data?.explanationP1 ||
    'Red light therapy (RLT) uses specific wavelengths of red and near-infrared light to pass gently through skin and reach the cells beneath it. Unlike UV light, it carries no burning risk \u2014 it simply delivers energy your cells already know how to use.';
  const explanationP2 =
    data?.explanationP2 ||
    'Hospitals and physiotherapy clinics have used the same wavelengths for over two decades. LUMA brings that clinical-grade output into a device built for daily use at home, with no appointments and no downtime.';
  const statCards = data?.statCards && data.statCards.length > 0 ? data.statCards : defaultStatCards;

  // Keyboard Escape listener & document body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <section
      id="about-basics"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pb-14 sm:pb-16 lg:pb-[calc(166*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* Centered Header */}
        <div className="text-center flex flex-col items-center">
          <p className="text-[16px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            {eyebrow}
          </p>

          <h2 className="mt-2.5 sm:mt-3.5 lg:mt-[calc(44*var(--u))] text-[26px] sm:text-[36px] md:text-[44px] lg:text-[calc(100*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#000000] leading-none">
            {heading}
          </h2>
        </div>

        {/* Wide Video Banner with Center Play Button */}
        <div className="mt-7 sm:mt-9 lg:mt-[calc(80*var(--u))] lg:pl-[calc(522*var(--u))] lg:pr-[calc(518*var(--u))]">
          <div
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
            aria-label="Play clinical demonstration video"
            className="group relative w-full lg:w-[calc(2800*var(--u))] aspect-[2800/755] min-h-[220px] sm:min-h-[280px] lg:min-h-0 lg:h-[calc(755*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] overflow-hidden bg-[#010101] select-none cursor-pointer shadow-lg hover:shadow-2xl transition-all"
          >
            <img
              src={videoBannerImage}
              alt="Red light therapy clinical demonstration"
              className="w-full h-full object-cover object-center block group-hover:scale-[1.02] transition-transform duration-500"
              draggable={false}
            />

            {/* Dark Overlay & Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-[50px] h-[50px] sm:w-[65px] sm:h-[65px] lg:w-[calc(110*var(--u))] lg:h-[calc(110*var(--u))] rounded-full bg-[#ED2024] text-white flex items-center justify-center pl-1 shadow-[0_0_35px_rgba(237,32,36,0.6)] group-hover:scale-115 active:scale-95 transition-transform duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[calc(40*var(--u))] lg:h-[calc(40*var(--u))] fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Left Copy + 3 Red Stat Cards */}
        <div className="mt-8 sm:mt-10 lg:mt-[calc(80*var(--u))] lg:pl-[calc(522*var(--u))] lg:pr-[calc(518*var(--u))] flex flex-col lg:flex-row items-start justify-between gap-8 sm:gap-10 lg:gap-0">
          <div className="w-full lg:w-[calc(1510*var(--u))] lg:pt-[calc(18*var(--u))] text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#555555] leading-[1.65] lg:leading-[calc(50*var(--u))]">
            <p className="m-0 mb-3.5 sm:mb-4 lg:mb-[calc(20*var(--u))]">
              {explanationP1}
            </p>
            <p className="m-0">
              {explanationP2}
            </p>
          </div>

          {/* Right Column: 3 Red Stat Cards */}
          <div className="w-full lg:w-auto grid grid-cols-3 gap-3 sm:gap-5 lg:flex lg:flex-row lg:items-center lg:gap-[calc(128*var(--u))] shrink-0 select-none">
            {statCards.map((card, idx) => {
              const hasPlus = String(card.num || '').includes('+');
              const baseNum = String(card.num || '').replace('+', '');
              const words = (card.label || '').split(' ');
              const line1 = words.length > 1 ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : card.label;
              const line2 = words.length > 1 ? words.slice(Math.ceil(words.length / 2)).join(' ') : '';

              return (
                <div
                  key={idx}
                  className="w-full aspect-square lg:w-[calc(308*var(--u))] lg:h-[calc(308*var(--u))] rounded-[12px] sm:rounded-[16px] lg:rounded-[calc(20*var(--u))] bg-[linear-gradient(180deg,#ED2024_0%,#9D0508_100%)] flex flex-col items-center justify-center lg:justify-start lg:pt-[calc(44*var(--u))] text-center text-[#FFFFFF] px-2 lg:px-0"
                >
                  <div className="flex flex-col items-center leading-none">
                    <span className="relative inline-flex items-start text-[30px] sm:text-[40px] lg:text-[calc(100*var(--u))] font-extrabold tracking-normal leading-[0.88]">
                      {baseNum}
                      {hasPlus && (
                        <sup className="text-[16px] sm:text-[22px] lg:text-[calc(56*var(--u))] font-extrabold leading-none -mt-[2px] lg:-mt-[calc(4*var(--u))] ml-[1px]">
                          +
                        </sup>
                      )}
                    </span>
                    {card.unit && (
                      <span className="mt-0.5 lg:mt-[calc(4*var(--u))] text-[16px] sm:text-[22px] lg:text-[calc(58*var(--u))] font-extrabold uppercase tracking-normal leading-[0.9]">
                        {card.unit}
                      </span>
                    )}
                  </div>
                  <span className="mt-1.5 sm:mt-2 lg:mt-[calc(16*var(--u))] text-[9.5px] sm:text-[11.5px] lg:text-[calc(28*var(--u))] font-medium uppercase tracking-[0.02em] leading-[1.3] lg:leading-[calc(38*var(--u))]">
                    {line1}
                    {line2 && (
                      <>
                        <br />
                        {line2}
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE CLINICAL VIDEO MODAL POPUP
          Opens when user clicks the play button or banner on About page
          ========================================================================= */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#141416] text-white rounded-[20px] sm:rounded-[28px] border border-white/15 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#ED2024] text-white">
                  CLINICAL DEMONSTRATION
                </span>
                <span className="hidden sm:inline text-xs sm:text-sm font-light text-white/75 uppercase tracking-wide">
                  What Is Red Light Therapy?
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close video modal"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm sm:text-base font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {isIframeEmbed(effectiveVideoUrl) ? (
                <iframe
                  src={getEmbedUrl(effectiveVideoUrl)}
                  title="Clinical Red Light Therapy Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={effectiveVideoUrl}
                  poster={videoBannerImage}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Modal Footer / Description */}
            <div className="p-4 sm:p-6 bg-[#0E0E10] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-light text-white/80 leading-relaxed">
                <p className="m-0">
                  Clinical-grade 660nm Red and 850nm Near-Infrared wavelengths stimulating cellular ATP production with zero UV radiation.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 shrink-0">
                ✓ Clinical Grade Video
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
