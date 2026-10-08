import React, { useState } from 'react';

const faqs = [
  {
    q: 'Will it give me a tan?',
    a: 'Nope. Red light and near-infrared wavelengths don’t stimulate melanin production. Unlike ultraviolet (UV) light, which causes tanning and sunburn, red light therapy operates in the safe, non-ionizing optical spectrum.',
  },
  {
    q: 'Do you ship overseas?',
    a: 'Yes, LUMA provides Free Global Delivery on all panels and accessories. We ship express worldwide with fully tracked and insured delivery.',
  },
  {
    q: 'Is it dangerous or painful?',
    a: 'Not at all. Red light therapy is completely non-invasive, pain-free, and emits zero UV radiation. Most users find the mild, soothing warmth deeply calming.',
  },
  {
    q: 'How much is shipping and how fast is it?',
    a: 'Shipping is 100% free across all regions. UAE orders are delivered within 1-2 business days. International express orders arrive within 3-5 business days.',
  },
  {
    q: 'Do I need eye protection, and is it included?',
    a: 'Certified medical-grade blackout eye protection is included inside every LUMA product box at no extra charge.',
  },
  {
    q: 'What’s the difference between your products, and how do I choose?',
    a: 'Our products range from the flexible LUMA GLOW silicone face mask to the compact LUMA Go and our flagship multi-wavelength LUMA NOVA. Use our 1-Minute Assessment above to find the exact setup for your routine.',
  },
  {
    q: 'Can I wear clothes during treatment or does the light need to hit bare skin?',
    a: 'For maximum absorption and benefit, the light should directly contact clean, bare skin, as fabric can block and scatter therapeutic wavelengths.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faqs"
      className="relative w-full bg-white text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope']"
    >
      <div className="max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-6 lg:px-12 2xl:px-16 4xl:px-20">
        {/* Centered Section Header matching PSD FAQs */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl mx-auto mb-14 md:mb-18 2xl:mb-20">
          <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-[0.24em] font-semibold text-[#EC2024] mb-3">
            LUMA RED LIGHT THERAPY
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] 2xl:text-[56px] 4xl:text-[68px] font-bold uppercase tracking-tight text-[#131313] leading-none">
            FAQs
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 2xl:gap-20 4xl:gap-24 items-start">
          {/* Left Column: Support Info Card matching PSD Group 28 */}
          <div className="lg:col-span-4">
            <div className="bg-[#F6F6F6] rounded-[18px] 2xl:rounded-[24px] 4xl:rounded-[30px] p-7 2xl:p-9 4xl:p-11 border border-gray-200/80 space-y-4 2xl:space-y-6">
              <h3 className="text-base 2xl:text-lg 4xl:text-xl font-bold text-[#131313]">
                Our customer support is available
              </h3>
              <p className="text-xs 2xl:text-sm font-semibold text-[#EC2024]">
                Average answer time: 30 mins
              </p>
              <div className="text-xs sm:text-sm 2xl:text-base text-[#666666] space-y-1.5 leading-relaxed pt-2 border-t border-gray-200">
                <p className="font-semibold text-[#333333]">Monday – Saturday: 8am – 6pm</p>
                <p>Abu Dhabi • Dubai • Australia • United Kingdom</p>
              </div>
              <div className="pt-3 2xl:pt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center w-full py-3.5 2xl:py-4 px-6 rounded-[6px] 2xl:rounded-[8px] bg-[#EC2024] hover:bg-[#c9181b] text-white font-bold text-xs sm:text-sm 2xl:text-base uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Contact LUMA
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Accordion as individual boxed cards (PSD Rectangle 58: #F1F0F0) */}
          <div className="lg:col-span-8 space-y-3.5 2xl:space-y-4.5 4xl:space-y-6">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-[16px] 2xl:rounded-[20px] 4xl:rounded-[24px] border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#F1F0F0] border-[#EC2024]/40 shadow-md ring-1 ring-[#EC2024]/10'
                      : 'bg-[#F1F0F0] border-gray-200 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 p-5 sm:p-6 2xl:p-7 4xl:p-8 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 2xl:gap-4.5">
                      {/* Subtle red bullet matching PSD Ellipse 9 */}
                      <span
                        className={`w-2 h-2 2xl:w-2.5 2xl:h-2.5 rounded-full shrink-0 transition-colors ${
                          isOpen ? 'bg-[#EC2024]' : 'bg-gray-300 group-hover:bg-[#EC2024]'
                        }`}
                      />
                      <span className="text-base sm:text-lg 2xl:text-xl 4xl:text-2xl font-semibold text-[#131313] group-hover:text-[#EC2024] transition-colors leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <span
                      className={`w-8 2xl:w-10 h-8 2xl:h-10 rounded-full border flex items-center justify-center shrink-0 text-base 2xl:text-lg font-light transition-all ${
                        isOpen
                          ? 'bg-[#EC2024] border-[#EC2024] text-white rotate-180 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-500 group-hover:border-gray-400'
                      }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 2xl:px-7 4xl:px-8 pb-5 sm:pb-6 2xl:pb-7 4xl:pb-8 pt-1 text-[#555555] text-sm sm:text-[15px] 2xl:text-base 4xl:text-lg leading-relaxed border-t border-gray-100 animate-fadeIn">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
