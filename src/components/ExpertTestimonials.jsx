import React, { useState } from 'react';
import { resolveImageUrl } from '../config/api';

const defaultExperts = [
  {
    name: 'DR. ANDREW HUBERMAN',
    role: 'NEUROSCIENTIST AND PODCASTER',
    cardImg: '/assets/experts/expert_huberman_card.jpg',
    videoUrl: 'https://www.youtube.com/embed/UF0nQUc44q0',
  },
  {
    name: 'DAVID EAGLEMAN',
    role: 'NEUROSCIENTIST, AUTHOR & HOST OF INNER COSMOS',
    cardImg: '/assets/experts/expert_eagleman_card.jpg',
    videoUrl: 'https://www.youtube.com/embed/UF0nQUc44q0',
  },
];

const getEmbedVideoUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim();

  // YouTube match
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo match
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return url;
};

const isExternalEmbed = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
};

export default function ExpertTestimonials({ data }) {
  const [activeVideo, setActiveVideo] = useState(null);

  const eyebrow = data?.eyebrow || 'KNOW MORE ABOUT LUMA';
  const heading = data?.heading || 'WHAT EXPERTS SAYS';
  const expertList = (Array.isArray(data?.experts) && data.experts.length > 0)
    ? data.experts
    : defaultExperts;

  return (
    <section
      id="experts"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] py-16 sm:py-20 lg:pt-[calc(170*var(--u))] lg:pb-[calc(166*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0 flex flex-col items-center">
        {/* Section Header (PSD Group 32: y = 17690..17829) */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: "KNOW MORE ABOUT LUMA" — 40px at 3840w, Manrope-Medium (500), tracking 20 (0.02em), uppercase, #000000 */}
          <p className="text-[13px] sm:text-[15px] lg:text-[calc(40*var(--u))] font-medium uppercase tracking-[0.02em] text-[#000000] leading-none">
            {eyebrow}
          </p>

          {/* Main Heading: "WHAT EXPERTS SAYS" — 80px at 3840w, Manrope-ExtraLight (200), tracking 20 (0.02em), uppercase, #ED2024 */}
          <h2 className="mt-3 sm:mt-4 lg:mt-[calc(47*var(--u))] text-[32px] sm:text-[42px] lg:text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            {heading}
          </h2>
        </div>

        {/* Two Expert Cards (PSD Expert 1: x=881..1870, Expert 2: x=1966..2955, y=17902..19100 -> 989x1198 each, gap=96px, r=60px) */}
        <div className="mt-10 sm:mt-12 lg:mt-[calc(73*var(--u))] w-full max-w-[920px] lg:max-w-none flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-[calc(96*var(--u))]">
          {expertList.map((expert, idx) => (
            <div
              key={idx}
              onClick={() => setActiveVideo(expert)}
              className="group relative w-full sm:w-1/2 lg:w-[calc(989*var(--u))] aspect-[989/1198] lg:h-[calc(1198*var(--u))] rounded-[24px] sm:rounded-[32px] lg:rounded-[calc(60*var(--u))] overflow-hidden cursor-pointer select-none shrink-0 transition-transform duration-300 hover:scale-[1.015] shadow-lg"
              title={`Click to play video interview with ${expert.name}`}
            >
              <img
                src={resolveImageUrl(expert.image || expert.cardImg) || expert.image || expert.cardImg || '/assets/experts/expert_huberman_card.jpg'}
                alt={expert.name}
                className="w-full h-full object-cover block select-none group-hover:scale-105 transition-transform duration-500"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e12]">
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">{activeVideo.name}</h4>
                <p className="text-xs text-white/60">{activeVideo.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors cursor-pointer"
                aria-label="Close video dialog"
              >
                &times;
              </button>
            </div>

            <div className="aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {activeVideo.videoUrl && isExternalEmbed(activeVideo.videoUrl) ? (
                <iframe
                  src={getEmbedVideoUrl(activeVideo.videoUrl)}
                  title={`${activeVideo.name} Video Interview`}
                  className="w-full h-full aspect-video border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeVideo.videoUrl ? (
                <video
                  src={resolveImageUrl(activeVideo.videoUrl)}
                  poster={resolveImageUrl(activeVideo.image || activeVideo.cardImg)}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain aspect-video bg-black"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-[#ED2024]/20 border border-[#ED2024] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#ED2024] fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{activeVideo.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                    Video for this expert has not been uploaded yet. You can upload a video file or link in the admin CMS.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
