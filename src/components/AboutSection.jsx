import React from 'react';

export default function AboutSection({ onNavigate, data }) {
  const eyebrow = data?.eyebrow || 'ABOUT LUMA';
  const heading = data?.heading || 'THE SCIENCE OF LIGHT. THE ART OF LIVING WELL.';
  const paragraphs = Array.isArray(data?.paragraphs) && data.paragraphs.length > 0
    ? data.paragraphs
    : [
        'Founded in 2023 in Dubai, UAE, LUMA was created to bring the benefits of red light therapy — once reserved for dermatology offices and recovery clinics — into homes and daily routines everywhere. We design devices that combine advanced light technology with simple, intuitive experiences, so that skin care, recovery, and relaxation fit naturally into your day. Backed by research in photobiomodulation and driven by a passion for accessible wellness, our team works to make science-backed care simple, beautiful, and part of everyday life.',
        "We're not just building devices — we're building a new standard for everyday wellness, one rooted in light, science, and simplicity.",
      ];
  const tagline = data?.tagline || 'LUMA Red Light Therapy for a Brighter You.';
  const btnText = data?.btnText || 'KNOW MORE';
  const btnLink = data?.btnLink || '/about';
  const chamberImage = data?.chamberImage || '/assets/about-chamber-perfect.jpg';

  const isLumaInEyebrow = /LUMA/i.test(eyebrow);
  const eyebrowPrefix = isLumaInEyebrow ? eyebrow.replace(/LUMA/i, '').trim() : eyebrow;

  return (
    <section
      id="about"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-white text-[#131313] py-16 lg:pt-[calc(165*var(--u))] lg:pb-[calc(165*var(--u))] font-['Manrope']"
    >
      {/* Section Header (PSD Group 1: x=1019..2814, y=2196..2403 on 3840px canvas) */}
      <div className="text-center mx-auto px-6 lg:px-0">
        {/* 'About LUMA': Manrope-Medium (500), 40px at 3840w, tracking 20 (0.02em), #131313 & #ED2024 */}
        <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] uppercase tracking-[0.02em] font-medium leading-none">
          <span className="text-[#131313]">{eyebrowPrefix} </span>
          {isLumaInEyebrow && <span className="text-[#ED2024]">LUMA</span>}
        </p>

        {/* Heading: Manrope-ExtraLight (200), 80px at 3840w, tracking 20 (0.02em), #131313, gap 47px */}
        <h2 className="text-[#131313] font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] tracking-[0.02em] uppercase leading-none mt-3 lg:mt-[calc(47*var(--u))] lg:whitespace-nowrap">
          {heading}
        </h2>

        {/* Centered red accent bar (PSD Rectangle 15: w=150, h=20, y=2383..2403, gap 48px) */}
        <div className="w-16 sm:w-20 lg:w-[calc(150*var(--u))] h-2 lg:h-[calc(20*var(--u))] bg-[#ED2024] mx-auto mt-4 lg:mt-[calc(48*var(--u))]" />
      </div>

      {/* Two-Column Content (PSD Group 2: x=953..2951, w=1998, y=2484..3103, gap from red bar = 81px) */}
      <div className="about-container max-w-[1360px] lg:max-w-none mx-auto px-6 lg:px-0 lg:pl-[calc(953*var(--u))] lg:pr-[calc(889*var(--u))] mt-10 lg:mt-[calc(81*var(--u))] flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-8 lg:gap-[calc(69*var(--u))]">
        {/* Left Column: PSD Rectangle 49 (x=953..1891, y=2484..3103 -> w=938, h=619) */}
        <div className="w-full lg:w-[calc(938*var(--u))] lg:h-[calc(619*var(--u))] shrink-0 overflow-hidden rounded-[16px] lg:rounded-[calc(24*var(--u))]">
          <img
            src={chamberImage}
            alt="LUMA Red light therapy relaxation chamber"
            className="w-full h-full object-cover block"
          />
        </div>

        {/* Right Column: Editorial Narrative (x=1961..2951, y=2484..2994 -> w=990) & CTA (y=3016..3102) */}
        <div className="about-text w-full lg:w-[calc(990*var(--u))] flex flex-col justify-between text-[#555555] text-[14px] sm:text-[15px] lg:text-[calc(30*var(--u))] font-normal leading-[1.6] tracking-[0.02em]">
          <div>
            {paragraphs.map((p, idx) => (
              <p key={idx} className="m-0 mb-3">
                {p}
              </p>
            ))}
            {tagline && (
              <p className="m-0 text-[#ED2024] font-normal">
                {tagline}
              </p>
            )}
          </div>

          {/* CTA Button matching PSD Rectangle 11 (w=280, h=86, gap 22px, font 32px Manrope-SemiBold, #F2F1ED, tracking 0.05em) */}
          <div className="mt-5 lg:mt-[calc(22*var(--u))]">
            <a
              href={btnLink}
              onClick={(e) => {
                if (onNavigate && (btnLink === '/about' || btnLink === 'about')) {
                  e.preventDefault();
                  onNavigate('about');
                }
              }}
              className="inline-flex items-center justify-center px-7 py-3 lg:px-0 lg:py-0 lg:w-[calc(280*var(--u))] lg:h-[calc(86*var(--u))] bg-[#ED2024] hover:bg-[#c9181b] text-[#F2F1ED] font-semibold text-[13px] sm:text-[14px] lg:text-[calc(32*var(--u))] uppercase tracking-[0.05em] rounded-[5px] lg:rounded-[calc(10*var(--u))] transition-all duration-300 cursor-pointer leading-none"
            >
              {btnText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
