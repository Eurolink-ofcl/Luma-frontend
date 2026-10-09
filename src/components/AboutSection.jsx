import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full bg-white text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 font-['Manrope']">
      <div className="about-container max-w-[1360px] 2xl:max-w-[1680px] 3xl:max-w-[1850px] 4xl:max-w-[2150px] mx-auto px-6 lg:px-12 2xl:px-16 4xl:px-20">
        {/* Section Header */}
        <div className="text-center max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto mb-14 md:mb-18 2xl:mb-24">
          <p className="text-xs sm:text-sm md:text-[15px] 2xl:text-[15.2px] 4xl:text-[22.8px] uppercase tracking-[0.2em] font-medium mb-3">
            <span className="text-[#131313]">ABOUT </span>
            <span className="text-[#EC2024]">LUMA</span>
          </p>
          <h2 className="text-[#131313] font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-[34px] 2xl:text-[30.4px] 4xl:text-[45.5px] tracking-tight uppercase leading-tight mt-2 whitespace-normal xl:whitespace-nowrap">
            THE SCIENCE OF LIGHT. THE ART OF LIVING WELL.
          </h2>
          {/* Centered red accent bar matching PSD Rectangle 15 */}
          <div className="w-20 md:w-24 2xl:w-32 4xl:w-40 h-2.5 2xl:h-3 bg-[#EC2024] mx-auto mt-5 2xl:mt-7 rounded-xs" />
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 2xl:gap-24 4xl:gap-32 items-center">
          {/* Left Column: Authentic PSD Chamber Photo with Rounded Corners */}
          <div className="w-full overflow-hidden rounded-[20px] 2xl:rounded-[28px] 4xl:rounded-[36px] shadow-sm">
            <img
              src="/assets/about-chamber-perfect.jpg"
              alt="LUMA Red light therapy relaxation chamber"
              className="w-full h-auto object-cover block"
            />
          </div>

          {/* Right Column: Editorial Narrative & CTA */}
          <div className="about-text flex flex-col justify-center space-y-6 2xl:space-y-8 text-[#333333] text-[15px] sm:text-[16px] 2xl:text-[20px] 4xl:text-[30px] font-normal leading-[1.6] 2xl:leading-[1.6]">
            <p>
              Founded in 2023 in Dubai, UAE, LUMA was created to bring the benefits of red light therapy — once reserved for dermatology offices and recovery clinics — into homes and daily routines everywhere. We design devices that combine advanced light technology with simple, intuitive experiences, so that skin care, recovery, and relaxation fit naturally into your day. Backed by research in photobiomodulation and driven by a passion for accessible wellness, our team works to make science-backed care simple, beautiful, and part of everyday life.
            </p>
            <p>
              We're not just building devices — we're building a new standard for everyday wellness, one rooted in light, science, and simplicity.
            </p>
            <p className="text-[#EC2024] font-medium text-base sm:text-lg 2xl:text-xl 4xl:text-2xl tracking-normal">
              LUMA Red Light Therapy for a Brighter You.
            </p>

            {/* CTA Button matching PSD Rectangle 11 */}
            <div className="pt-2 2xl:pt-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-10 2xl:px-12 4xl:px-14 py-3.5 2xl:py-4.5 4xl:py-5 bg-[#EC2024] hover:bg-[#c9181b] text-white font-semibold text-[13px] sm:text-[14px] xl:text-[16px] 2xl:text-[21.3px] 4xl:text-[32px] uppercase tracking-[0.05em] rounded-[4px] 2xl:rounded-[6px] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                KNOW MORE
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
