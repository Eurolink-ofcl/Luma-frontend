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
      className="relative w-full bg-[#FFFFFF] text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope'] border-t border-gray-100"
    >
      <div className="max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-6 lg:px-12 2xl:px-16 4xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 2xl:gap-20 4xl:gap-24">
          {/* Left Column: Support Info Card */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-[0.24em] font-semibold mb-3 text-[#EC2024]">
                LUMA RED LIGHT THERAPY
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] 2xl:text-[56px] 4xl:text-[68px] font-bold uppercase tracking-tight text-[#131313] leading-none mb-6">
                FAQs
              </h2>
              <div className="w-14 2xl:w-18 4xl:w-22 h-1 2xl:h-1.5 bg-[#EC2024] mb-8 2xl:mb-10" />

              <div className="bg-[#FAFAFA] rounded-[16px] 2xl:rounded-[22px] 4xl:rounded-[28px] p-7 2xl:p-9 4xl:p-11 border border-gray-100 space-y-4 2xl:space-y-6">
                <h3 className="text-base 2xl:text-lg 4xl:text-xl font-semibold text-[#131313]">
                  Our customer support is available
                </h3>
                <p className="text-xs 2xl:text-sm font-mono text-[#EC2024] font-medium">
                  Average answer time: 30 mins
                </p>
                <div className="text-xs sm:text-sm 2xl:text-base text-[#666666] space-y-1.5 leading-relaxed pt-2 border-t border-gray-200">
                  <p className="font-medium text-[#333333]">Monday – Saturday: 8am – 6pm</p>
                  <p>Abu Dhabi • Dubai • Australia • United Kingdom</p>
                </div>
                <div className="pt-3 2xl:pt-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center w-full py-3 2xl:py-4 px-5 rounded-[6px] 2xl:rounded-[8px] bg-[#131313] hover:bg-[#EC2024] text-white font-semibold text-xs 2xl:text-sm uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Contact LUMA
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Accordion */}
          <div className="lg:col-span-8 divide-y divide-gray-200">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-5 sm:py-6 2xl:py-8 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="text-base sm:text-lg 2xl:text-xl 4xl:text-2xl font-medium text-[#131313] group-hover:text-[#EC2024] transition-colors leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={`w-8 2xl:w-10 h-8 2xl:h-10 rounded-full border border-gray-200 flex items-center justify-center shrink-0 text-base 2xl:text-lg font-light transition-all ${
                        isOpen
                          ? 'bg-[#EC2024] border-[#EC2024] text-white rotate-180'
                          : 'bg-white text-gray-500 group-hover:border-gray-400'
                      }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-4 2xl:mt-6 text-[#555555] text-sm sm:text-[15px] 2xl:text-base 4xl:text-lg leading-relaxed pr-8 animate-fadeIn">
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
