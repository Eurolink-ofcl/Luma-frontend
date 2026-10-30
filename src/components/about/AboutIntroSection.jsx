import React from 'react';

export default function AboutIntroSection({ onNavigateHome }) {
  const handleHomeClick = (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  return (
    <section
      id="about-intro"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pt-8 sm:pt-10 lg:pt-[calc(105*var(--u))] pb-14 sm:pb-16 lg:pb-[calc(166*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* Breadcrumb Row (PSD y = 955..1001, x = 521..808) */}
        <nav
          aria-label="Breadcrumb"
          className="lg:pl-[calc(521*var(--u))] flex items-end gap-3 sm:gap-3.5 lg:gap-0 select-none"
        >
          {/* Home Icon (PSD Layer 21: x = 521..561, y = 955..998 -> 40 x 43px at 3840w) */}
          <a
            href="/"
            onClick={handleHomeClick}
            aria-label="Home"
            className="inline-flex items-end hover:opacity-75 transition-opacity shrink-0"
          >
            <img
              src="/assets/about/home-icon.png"
              alt="Home"
              className="w-[16px] h-[17px] sm:w-[18px] sm:h-[19px] lg:w-[calc(40*var(--u))] lg:h-[calc(43*var(--u))] object-contain block"
              draggable={false}
            />
          </a>

          {/* Slash '/' (PSD x = 590..605, y = 957..1001 -> 60px at 3840w, Manrope-ExtraLight, #000000) */}
          <span className="lg:ml-[calc(29*var(--u))] text-[22px] sm:text-[26px] lg:text-[calc(60*var(--u))] font-extralight text-[#000000] leading-[0.78]">
            /
          </span>

          {/* 'About LUMA' (PSD x = 633..808, y = 975..998 -> 30px at 3840w, Manrope-Medium, #010102 & #ED2024) */}
          <span className="lg:ml-[calc(28*var(--u))] text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-medium tracking-normal leading-none pb-[1px] lg:pb-[calc(2*var(--u))]">
            <span className="text-[#010102]">About </span>
            <span className="text-[#ED2024]">LUMA</span>
          </span>
        </nav>

        {/* Two-Column Story Block (PSD Group 36: x = 522..3440, y = 1097..2097, 99px below breadcrumb) */}
        <div className="mt-7 sm:mt-9 lg:mt-[calc(99*var(--u))] lg:pl-[calc(522*var(--u))] lg:pr-[calc(380*var(--u))] flex flex-col lg:flex-row items-start gap-8 sm:gap-10 lg:gap-[calc(147*var(--u))]">
          {/* Left Column: Rounded Image (PSD Rectangle 48: 1325 x 1000 at 3840w, r = 50px) */}
          <div className="w-full lg:w-[calc(1325*var(--u))] aspect-[1325/1000] lg:h-[calc(1000*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] overflow-hidden bg-[#010101] shrink-0 select-none">
            <img
              src="/assets/about/story-panel.jpg"
              alt="LUMA Red Light Therapy Panel in Living Room"
              className="w-full h-full object-cover block"
              draggable={false}
            />
          </div>

          {/* Right Column: Story Copy (expanded width on right so Paragraph 1 stays 4 lines and bottom aligns inside image height) */}
          <div className="w-full lg:flex-1 flex flex-col items-start">
            {/* Eyebrow: "LUMA" — 50px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #ED2024 */}
            <p className="text-[16px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#ED2024] leading-none">
              LUMA
            </p>

            {/* Heading: "THE SCIENCE OF LIGHT." / "THE ART OF LIVING WELL."
                PSD: 100px at 3840w, Manrope-ExtraLight (200), tracking 20 (0.02em), uppercase, #000000 */}
            <div className="mt-2 sm:mt-3 lg:mt-[calc(22*var(--u))] text-[26px] sm:text-[34px] md:text-[42px] lg:text-[calc(100*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#000000] leading-[1.08] lg:leading-none">
              <h2 className="m-0">THE SCIENCE OF LIGHT.</h2>
              <h2 className="mt-1 lg:mt-[calc(26*var(--u))]">THE ART OF LIVING WELL.</h2>
            </div>

            {/* Body Paragraphs: 30px at 3840w, Manrope-Regular (400), leading 50px (1.667), tracking 20 (0.02em), #555555 */}
            <div className="mt-5 sm:mt-6 lg:mt-[calc(48*var(--u))] text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#555555] leading-[1.65] lg:leading-[calc(50*var(--u))]">
              <p className="mb-3.5 sm:mb-4 lg:mb-[calc(30*var(--u))]">
                Founded in 2023 in Dubai, UAE, LUMA was created to bring the benefits of red light therapy &mdash;
                once reserved for dermatology offices and recovery clinics &mdash; into homes and daily routines
                everywhere. We design devices that combine advanced light technology with simple,
                intuitive experiences, so that skin care, recovery, and relaxation fit naturally into your day.
              </p>

              <p className="mb-3.5 sm:mb-4 lg:mb-[calc(30*var(--u))]">
                From the Luma Glow face mask to the portable Luma Go, every product we build is guided by
                one principle: powerful technology should feel effortless to use.
              </p>

              <p className="mb-3.5 sm:mb-4 lg:mb-[calc(30*var(--u))]">
                Backed by research in photobiomodulation and driven by a passion for accessible wellness,
                our team works to make science-backed care simple, beautiful, and part of everyday life.
              </p>

              <p className="mb-3.5 sm:mb-4 lg:mb-[calc(30*var(--u))]">
                We&apos;re not just building devices &mdash; we&apos;re building a new standard for everyday wellness, one
                rooted in light, science, and simplicity.
              </p>

              {/* Closing Tagline: 30px at 3840w, Manrope-Medium (500), tracking 20 (0.02em), #ED2024 */}
              <p className="font-medium text-[#ED2024]">
                LUMA Red Light Therapy for a Brighter You.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
