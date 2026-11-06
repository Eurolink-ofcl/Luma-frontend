import React, { useState } from 'react';

const PRODUCT_OPTIONS = [
  'Luma Glow',
  'Luma Go',
  'Luma Surge',
  'Luma Nova',
  'Luma Ultra',
  'Luma Apex',
  'Luma Max',
];

export default function ShareStorySection() {
  const [formData, setFormData] = useState({
    name: '',
    product: 'Luma Glow',
    mediaLink: '',
    story: '',
    agreed: true, // PSD has checkbox pre-checked
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('Please agree to share your story.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <section
      id="write-review"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-white overflow-hidden font-['Manrope'] select-none pt-12 sm:pt-16 md:pt-20 lg:pt-[calc(166*var(--u))] pb-12 sm:pb-16 md:pb-20 lg:pb-[calc(163*var(--u))]"
    >
      {/* Container aligned to PSD canvas width (content centered at x=1920) */}
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-[calc(912*var(--u))]">
        {/* Section Header: Title + Red Pill Bar (PSD canvas y=6588..6716) */}
        <div className="w-full flex flex-col items-center justify-center text-center">
          {/* Title: SHARE YOUR STORY (PSD: Manrope-ExtraLight 80px at 3840w, tracking 20 / 0.02em, "SHARE YOUR " #FFFFFF, "STORY" #ED2124) */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] leading-none text-[#FFFFFF]">
            SHARE YOUR <span className="text-[#ED2124]">STORY</span>
          </h2>

          {/* Red Pill Bar (Rectangle 15 copy 2: 150x20px, rounded-full, fill #ED2124, 47px below title) */}
          <div
            className="mt-3 sm:mt-4 lg:mt-[calc(47*var(--u))] w-[60px] sm:w-[85px] lg:w-[calc(150*var(--u))] h-[8px] sm:h-[12px] lg:h-[calc(20*var(--u))] rounded-full bg-[#ED2124]"
            aria-hidden="true"
          />
        </div>

        {/* Success Feedback state */}
        {isSubmitted ? (
          <div className="mt-8 sm:mt-12 lg:mt-[calc(168*var(--u))] w-full bg-[#141416] border border-[#ED2124]/40 rounded-[20px] lg:rounded-full p-8 lg:py-[calc(50*var(--u))] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 lg:w-[calc(60*var(--u))] lg:h-[calc(60*var(--u))] rounded-full bg-[#ED2124] flex items-center justify-center mb-3">
              <svg className="w-6 h-6 lg:w-[calc(30*var(--u))] lg:h-[calc(30*var(--u))] text-white stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-[calc(36*var(--u))] font-light text-white">
              Thank you for sharing your story!
            </h3>
            <p className="text-xs sm:text-sm lg:text-[calc(24*var(--u))] font-light text-white/60 mt-2">
              Our team will review and feature it in our Real Stories community.
            </p>
            <button
              type="button"
              onClick={() => {
                setFormData({ name: '', product: 'Luma Glow', mediaLink: '', story: '', agreed: true });
                setIsSubmitted(false);
              }}
              className="mt-5 text-xs sm:text-sm lg:text-[calc(22*var(--u))] font-medium text-[#ED2124] hover:underline cursor-pointer"
            >
              Submit another review
            </button>
          </div>
        ) : (
          /* Form Container (PSD y=6884..7266) */
          <form
            onSubmit={handleSubmit}
            className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-[calc(168*var(--u))] flex flex-col items-center"
          >
            {/* Row 1: Name (759px) + Product Dropdown (493px) + Media Link (587px), gap: 88px */}
            <div className="w-full flex flex-col lg:flex-row items-center gap-4 sm:gap-5 lg:gap-[calc(88*var(--u))]">
              {/* Field 1: Your Name (Rectangle 44: 759x74px, rounded-full, border #474748) */}
              <div className="w-full lg:w-[calc(759*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(74*var(--u))] rounded-full border border-[#474748] bg-[#0A0A0B] px-6 sm:px-8 lg:px-[calc(41*var(--u))] flex items-center transition-colors focus-within:border-[#ED2124]">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent text-white placeholder-white/25 text-sm sm:text-base lg:text-[calc(30*var(--u))] font-extralight tracking-[0.02em] outline-none"
                />
              </div>

              {/* Field 2: Product Dropdown (Rectangle 44 copy: 493x74px, rounded-full, border #474748, red chevron) */}
              <div className="relative w-full lg:w-[calc(493*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(74*var(--u))]">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-full rounded-full border border-[#474748] bg-[#0A0A0B] px-6 sm:px-8 lg:px-[calc(41*var(--u))] flex items-center justify-between transition-colors hover:border-white/50 focus:border-[#ED2124] cursor-pointer"
                >
                  <span className="text-white text-sm sm:text-base lg:text-[calc(30*var(--u))] font-extralight tracking-[0.02em] whitespace-nowrap">
                    {formData.product}
                  </span>
                  {/* Chevron down arrow matching PSD Vector Smart Object copy 3 (21x13px, fill #ED2124) */}
                  <svg
                    className={`w-3.5 h-2.5 lg:w-[calc(21*var(--u))] lg:h-[calc(13*var(--u))] text-[#ED2124] transition-transform duration-200 shrink-0 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 21 13"
                    fill="currentColor"
                  >
                    <path d="M10.5 13L0 2.5 2.5 0l8 8 8-8L21 2.5z" />
                  </svg>
                </button>

                {/* Dropdown Menu Options */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#141416] border border-[#474748] rounded-[20px] shadow-2xl overflow-hidden z-30 py-2">
                    {PRODUCT_OPTIONS.map((prod) => (
                      <button
                        key={prod}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, product: prod });
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-6 py-2.5 text-xs sm:text-sm lg:text-[calc(24*var(--u))] font-light transition-colors cursor-pointer ${
                          formData.product === prod
                            ? 'bg-[#ED2124]/20 text-[#ED2124]'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {prod}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 3: Photo or Video Link (optional) (Rectangle 44 copy 2: 587x74px, rounded-full, border #474748) */}
              <div className="w-full lg:w-[calc(587*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(74*var(--u))] rounded-full border border-[#474748] bg-[#0A0A0B] px-6 sm:px-8 lg:px-[calc(40*var(--u))] flex items-center transition-colors focus-within:border-[#ED2124]">
                <input
                  type="url"
                  placeholder="Photo or Video Link (optional)"
                  value={formData.mediaLink}
                  onChange={(e) => setFormData({ ...formData, mediaLink: e.target.value })}
                  className="w-full bg-transparent text-white placeholder-white/25 text-sm sm:text-base lg:text-[calc(30*var(--u))] font-extralight tracking-[0.02em] outline-none"
                />
              </div>
            </div>

            {/* Row 2: Write Your Story (1433px) + Send MY Story Button (495px), gap: 86px, mt: 86px */}
            <div className="w-full mt-4 sm:mt-5 lg:mt-[calc(86*var(--u))] flex flex-col lg:flex-row items-center gap-4 sm:gap-5 lg:gap-[calc(86*var(--u))]">
              {/* Field 4: Write Your Story (Rectangle 44 copy 3: 1433x74px, rounded-full, border #474748) */}
              <div className="w-full lg:w-[calc(1433*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(74*var(--u))] rounded-full border border-[#474748] bg-[#0A0A0B] px-6 sm:px-8 lg:px-[calc(42*var(--u))] flex items-center transition-colors focus-within:border-[#ED2124]">
                <input
                  type="text"
                  required
                  placeholder="Write Your Story"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className="w-full bg-transparent text-white placeholder-white/25 text-sm sm:text-base lg:text-[calc(30*var(--u))] font-extralight tracking-[0.02em] outline-none"
                />
              </div>

              {/* Submit Button: Send MY Story (Rectangle 44 copy 4: 495x73px, rounded-full, fill #ED2124, text #FFFFFF) */}
              <button
                type="submit"
                className="w-full lg:w-[calc(495*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(73*var(--u))] rounded-full bg-[#ED2124] hover:bg-[#d01c1f] active:scale-[0.98] text-white text-sm sm:text-base lg:text-[calc(30*var(--u))] font-extralight tracking-[0.02em] uppercase inline-flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 shadow-lg"
              >
                Send MY Story
              </button>
            </div>

            {/* Row 3: Agreement Checkbox + Label (PSD canvas y=7236..7266, 118px below Row 2) */}
            <div className="w-full flex items-center justify-center gap-3 lg:gap-[calc(15*var(--u))] mt-7 sm:mt-9 md:mt-11 lg:mt-[calc(118*var(--u))]">
              {/* Custom Red Checkbox (Rectangle 68: 26x27px, rounded-sm, fill #ED2124 with check(1) 17x13px) */}
              <button
                type="button"
                role="checkbox"
                aria-checked={formData.agreed}
                onClick={() => setFormData({ ...formData, agreed: !formData.agreed })}
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[calc(26*var(--u))] lg:h-[calc(27*var(--u))] rounded-[4px] bg-[#ED2124] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 shrink-0"
              >
                {formData.agreed && (
                  <svg
                    className="w-3.5 h-3 lg:w-[calc(17*var(--u))] lg:h-[calc(13*var(--u))] text-white stroke-current stroke-[2.5] fill-none"
                    viewBox="0 0 17 13"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 6.5l4.5 4.5 9.5-9.5" />
                  </svg>
                )}
              </button>

              {/* Checkbox Label (PSD: Manrope-ExtraLight 26.64px at 3840w, color #FFFFFF at 25% opacity) */}
              <label
                onClick={() => setFormData({ ...formData, agreed: !formData.agreed })}
                className="text-xs sm:text-sm lg:text-[calc(26.64*var(--u))] font-extralight tracking-[0.02em] text-white/40 hover:text-white/60 transition-colors cursor-pointer select-none"
              >
                I agree LUMA may share my story and photos on its website
              </label>
            </div>
          </form>
        )}
      </div>

      {/* 1px Bottom Divider matching PSD Line layer (bbox: 0, 7417, 3840, 7418) */}
      <div
        style={{ '--u': 'calc(100vw / 3840)' }}
        className="w-full h-px bg-[#2A2A2A] mt-12 sm:mt-16 md:mt-20 lg:mt-[calc(151*var(--u))]"
        aria-hidden="true"
      />
    </section>
  );
}

