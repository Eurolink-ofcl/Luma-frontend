import React, { useState } from 'react';

const experts = [
  {
    name: 'DR. ANDREW HUBERMAN',
    role: 'NEUROSCIENTIST AND PODCASTER',
    cardImg: '/assets/experts/expert_huberman_card.jpg',
    videoUrl: 'https://www.youtube.com/embed/UF0nQUc44q0', // Huberman light exposure science
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
      className="relative w-full bg-white text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope']"
    >
      <div className="max-w-[1200px] 2xl:max-w-[1600px] 3xl:max-w-[1850px] 4xl:max-w-[2150px] mx-auto px-6 lg:px-8 2xl:px-12 4xl:px-16">
        {/* Section Header matching PSD Group 32 */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl mx-auto mb-14 md:mb-16 2xl:mb-20">
          <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-[0.24em] font-semibold text-[#131313] mb-3">
            KNOW MORE ABOUT LUMA
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl 4xl:text-7xl font-extrabold tracking-tight uppercase leading-tight text-[#EC2024]">
            WHAT EXPERTS SAY
          </h2>
          <div className="w-16 2xl:w-20 4xl:w-24 h-1 2xl:h-1.5 bg-[#EC2024] mx-auto mt-4" />
        </div>

        {/* Two Expert Video Cards matching PSD Rectangle 61 (989x1198 aspect) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 2xl:gap-16 4xl:gap-20 max-w-[1040px] 2xl:max-w-[1380px] 4xl:max-w-[1680px] mx-auto">
          {experts.map((expert, idx) => (
            <div
              key={idx}
              onClick={() => setActiveVideo(expert)}
              className="group relative rounded-[28px] 2xl:rounded-[38px] 4xl:rounded-[48px] overflow-hidden bg-black shadow-2xl cursor-pointer transition-all duration-300 hover:shadow-[0_12px_40px_rgba(236,32,36,0.2)] hover:-translate-y-1 flex flex-col"
            >
              {/* Card Image with Play Button */}
              <div className="relative w-full aspect-[989/1198] overflow-hidden bg-black">
                <img
                  src={expert.cardImg}
                  alt={expert.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60 pointer-events-none" />

                {/* Expert Information matching PSD Group 32 */}
                <div className="absolute top-8 sm:top-10 2xl:top-12 inset-x-6 sm:inset-x-8 text-center pointer-events-none">
                  <h3 className="text-xl sm:text-2xl 2xl:text-3xl 4xl:text-4xl font-extrabold text-white tracking-wide uppercase drop-shadow-md mb-1.5">
                    {expert.name}
                  </h3>
                  <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg text-white/85 font-medium tracking-wider uppercase drop-shadow-sm">
                    {expert.role}
                  </p>
                </div>

                {/* Glowing Circular Play Button matching PSD Play-Btn */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 4xl:w-28 4xl:h-28 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/80 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 group-hover:scale-115 group-hover:bg-[#EC2024] group-hover:border-[#EC2024] group-hover:shadow-[0_0_30px_rgba(236,32,36,0.8)]">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 2xl:w-9 2xl:h-9 4xl:w-11 4xl:h-11 text-white fill-current translate-x-0.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
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
                <div className="w-16 h-16 rounded-full bg-[#EC2024]/20 border border-[#EC2024] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#EC2024] fill-current translate-x-0.5" viewBox="0 0 24 24">
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
