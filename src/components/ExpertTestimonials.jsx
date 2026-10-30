import React, { useState } from 'react';

const experts = [
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

export default function ExpertTestimonials() {
  const [activeVideo, setActiveVideo] = useState(null);

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
            KNOW MORE ABOUT LUMA
          </p>

          {/* Main Heading: "WHAT EXPERTS SAYS" — 80px at 3840w, Manrope-ExtraLight (200), tracking 20 (0.02em), uppercase, #ED2024 */}
          <h2 className="mt-3 sm:mt-4 lg:mt-[calc(47*var(--u))] text-[32px] sm:text-[42px] lg:text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            WHAT EXPERTS SAYS
          </h2>
        </div>

        {/* Two Expert Cards (PSD Expert 1: x=881..1870, Expert 2: x=1966..2955, y=17902..19100 -> 989x1198 each, gap=96px, r=60px) */}
        <div className="mt-10 sm:mt-12 lg:mt-[calc(73*var(--u))] w-full max-w-[920px] lg:max-w-none flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-[calc(96*var(--u))]">
          {experts.map((expert, idx) => (
            <div
              key={idx}
              onClick={() => setActiveVideo(expert)}
              className="relative w-full sm:w-1/2 lg:w-[calc(989*var(--u))] aspect-[989/1198] lg:h-[calc(1198*var(--u))] rounded-[24px] sm:rounded-[32px] lg:rounded-[calc(60*var(--u))] overflow-hidden cursor-pointer select-none shrink-0"
            >
              <img
                src={expert.cardImg}
                alt={expert.name}
                className="w-full h-full object-cover block select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">{activeVideo.name}</h4>
                <p className="text-xs text-white/60">{activeVideo.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-[#ED2024]/20 border border-[#ED2024] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#ED2024] fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{activeVideo.name} on Photobiomodulation</h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                  "Red light and near-infrared wavelengths stimulate mitochondrial cytochrome c oxidase, boosting ATP energy production and accelerating cellular repair."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
