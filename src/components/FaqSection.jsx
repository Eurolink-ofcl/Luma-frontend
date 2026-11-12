import React, { useState } from 'react';

const faqs = [
  {
    q: 'WILL IT GIVE ME A TAN?',
    a: 'Nope. Red light and near-infrared wavelengths don’t stimulate melanin like\nUV rays do. So you’ll get glowing skin — but not a tan.',
  },
  {
    q: 'DO YOU SHIP OVERSEAS?',
    a: 'Yes, LUMA provides Free Global Delivery on all panels and accessories. We ship express worldwide with fully tracked and insured delivery.',
  },
  {
    q: 'IS IT DANGEROUS OR PAINFUL?',
    a: 'Not at all. Red light therapy is completely non-invasive, pain-free, and emits zero UV radiation. Most users find the mild, soothing warmth deeply calming.',
  },
  {
    q: 'HOW MUCH IS SHIPPING AND HOW FAST IS IT?',
    a: 'Shipping is 100% free across all regions. UAE orders are delivered within 1-2 business days. International express orders arrive within 3-5 business days.',
  },
  {
    q: 'DO I NEED EYE PROTECTION, AND IS IT INCLUDED?',
    a: 'Certified medical-grade blackout eye protection is included inside every LUMA product box at no extra charge.',
  },
  {
    q: 'WHAT’S THE DIFFERENCE BETWEEN YOUR PRODUCTS,\nAND HOW DO I CHOOSE?',
    a: 'Our products range from the flexible LUMA GLOW silicone face mask to the compact LUMA Go and our flagship multi-wavelength LUMA NOVA. Use our 1-Minute Assessment above to find the exact setup for your routine.',
  },
  {
    q: 'CAN I WEAR CLOTHES DURING TREATMENT OR DOES THE\nLIGHT NEED TO HIT MY SKIN DIRECTLY?',
    a: 'For maximum absorption and benefit, the light should directly contact clean, bare skin, as fabric can block and scatter therapeutic wavelengths.',
  },
];

export default function FaqSection({ data }) {
  const [openIndex, setOpenIndex] = useState(0);

  const eyebrow = data?.eyebrow || 'LUMA RED LIGHT THERAPY';
  const heading = data?.heading || 'FAQs';
  const supportBox = data?.supportBox || {};
  const supportTitle = supportBox.title || 'OUR CUSTOMER SUPPORT IS AVAILABLE';
  const supportTiming = supportBox.timing || 'MONDAY - SATURDAY\n8AM - 6PM';
  const supportLocations = supportBox.location || 'ABU DHABI, DUBAI,\nAUSTRALIA, UNITED KINGDOME';
  const supportBtnText = supportBox.btnText || 'CONTACT LUMA';
  const supportBtnLink = supportBox.btnLink || '#contact';
  const responseTime = supportBox.responseTime || 'AVERAGE ANSWER TIME: 30MINS';

  const faqList = (Array.isArray(data?.items) && data.items.length > 0)
    ? data.items.map((it) => ({
        q: it.question || it.q || '',
        a: it.answer || it.a || '',
      }))
    : faqs;

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faqs"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] py-16 sm:py-20 lg:pt-[calc(165*var(--u))] lg:pb-[calc(167*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* Centered Header (PSD FAQs: y = 14893..15032) */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: "LUMA RED LIGHT THERAPY" — 40px at 3840w, Manrope-Medium (500), #000000, tracking 20 (0.02em) */}
          <p className="text-[13px] sm:text-[15px] lg:text-[calc(40*var(--u))] font-medium uppercase tracking-[0.02em] text-[#000000] leading-none">
            {eyebrow}
          </p>

          {/* Main Heading: "FAQs" — 80px at 3840w, Manrope-ExtraLight (200), #ED2024, tracking 20 (0.02em) */}
          <h2 className="mt-3 sm:mt-4 lg:mt-[calc(47*var(--u))] text-[34px] sm:text-[44px] lg:text-[calc(80*var(--u))] font-extralight tracking-[0.02em] text-[#ED2024] leading-none">
            {heading}
          </h2>
        </div>

        {/* Two-Column Content Area (PSD x = 520..3323, y = 15111..16418) */}
        <div className="mt-10 sm:mt-12 lg:mt-[calc(79*var(--u))] lg:pl-[calc(520*var(--u))] lg:pr-[calc(517*var(--u))] flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-0">
          {/* Left Column: Customer Support Info (PSD Group 28: x = 509..1231, y = 15132..15868) */}
          <div className="w-full lg:w-auto lg:pt-[calc(21*var(--u))] flex flex-col items-start">
            {/* Heading: "OUR CUSTOMER SUPPORT IS AVAILABLE" — 36px at 3840w, Manrope-Bold (700), #000000 */}
            <h3 className="text-[15px] sm:text-[17px] lg:text-[calc(36*var(--u))] font-bold uppercase tracking-[0.02em] text-[#000000] leading-none">
              {supportTitle}
            </h3>

            {/* Support Avatars (PSD Layer 12: 400 x 126 at 3840w, x = 509, y = 15209) */}
            <div className="mt-5 lg:mt-[calc(49*var(--u))] lg:-ml-[calc(11*var(--u))]">
              <img
                src="/assets/faqs/support-avatars.png"
                alt="LUMA Customer Support Team"
                className="w-[180px] sm:w-[210px] lg:w-[calc(400*var(--u))] h-auto block select-none"
                draggable={false}
              />
            </div>

            {/* Hours Row (PSD y = 15384..15474) */}
            <div className="mt-5 lg:mt-[calc(49*var(--u))] flex items-start gap-3.5 lg:gap-[calc(27*var(--u))]">
              <img
                src="/assets/faqs/clock-icon.png"
                alt=""
                aria-hidden="true"
                className="w-[20px] h-[20px] lg:w-[calc(45*var(--u))] lg:h-[calc(45*var(--u))] object-contain shrink-0 select-none"
                draggable={false}
              />
              <p className="lg:pt-[calc(4*var(--u))] text-[13px] sm:text-[15px] lg:text-[calc(36*var(--u))] font-medium uppercase tracking-[0.025em] text-[#000000] leading-[1.39] whitespace-pre-line">
                {supportTiming}
              </p>
            </div>

            {/* Locations Row (PSD y = 15524..15615) */}
            <div className="mt-4 lg:mt-[calc(50*var(--u))] flex items-start gap-3.5 lg:gap-[calc(29*var(--u))]">
              <img
                src="/assets/faqs/location-icon.png"
                alt=""
                aria-hidden="true"
                className="w-[18px] h-[25px] lg:w-[calc(39*var(--u))] lg:h-[calc(56*var(--u))] object-contain shrink-0 select-none"
                draggable={false}
              />
              <p className="lg:pt-[calc(3*var(--u))] text-[13px] sm:text-[15px] lg:text-[calc(36*var(--u))] font-medium uppercase tracking-[0.025em] text-[#000000] leading-[1.39] whitespace-pre-line">
                {supportLocations}
              </p>
            </div>

            {/* CTA Button (PSD CTA1: 350 x 86 at 3840w, r = 10px, #0A0A0B) */}
            <a
              href={supportBtnLink}
              className="mt-6 lg:mt-[calc(66*var(--u))] inline-flex items-center justify-center w-[170px] h-[44px] lg:w-[calc(350*var(--u))] lg:h-[calc(86*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#0A0A0B] hover:bg-[#ED2024] text-[#FFFFFF] text-[13px] sm:text-[14px] lg:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 cursor-pointer"
            >
              {supportBtnText}
            </a>

            {/* Average Answer Time (PSD y = 15845..15868: 30px at 3840w, Manrope-SemiBold Italic, #000000) */}
            <p className="mt-5 lg:mt-[calc(78*var(--u))] text-[12px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-semibold italic uppercase tracking-[0.02em] text-[#000000] leading-none">
              {responseTime}
            </p>
          </div>

          {/* Right Column: FAQ Accordion Cards (PSD Faq 1..7: x = 1919..3323, width = 1404px, gap = 5px) */}
          <div className="w-full lg:w-[calc(1404*var(--u))] flex flex-col gap-2 lg:gap-[calc(5*var(--u))]">
            {faqList.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="w-full bg-[#F1F0F0] rounded-[12px] lg:rounded-[calc(20*var(--u))] transition-all duration-200 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className={`w-full flex items-start justify-between text-left cursor-pointer px-5 sm:px-7 lg:pl-[calc(76*var(--u))] lg:pr-[calc(63*var(--u))] ${
                      isOpen
                        ? 'pt-5 pb-2 lg:pt-[calc(60*var(--u))] lg:pb-[calc(20*var(--u))]'
                        : 'py-4 sm:py-5 lg:py-[calc(45*var(--u))]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 sm:gap-4 lg:gap-[calc(28*var(--u))] pr-4">
                      {/* Bullet Circle (PSD Ellipse 9: 22 x 22 at 3840w — solid #0A0A0B when open, 4px #000000 stroke when closed) */}
                      <span
                        className={`mt-[5px] sm:mt-[6px] lg:mt-[calc(19*var(--u))] w-[10px] h-[10px] lg:w-[calc(22*var(--u))] lg:h-[calc(22*var(--u))] rounded-full shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-[#0A0A0B]'
                            : 'bg-transparent border-[2px] lg:border-[calc(4*var(--u))] border-[#000000]'
                        }`}
                      />

                      {/* Question Text: 38px at 3840w, Manrope-Medium (500), leading 60px (1.58), tracking 20 (0.02em), #000000 */}
                      <span className="text-[14px] sm:text-[16px] lg:text-[calc(38*var(--u))] font-medium uppercase tracking-[0.02em] text-[#000000] leading-[1.45] lg:leading-[calc(60*var(--u))] lg:whitespace-pre-line">
                        {faq.q}
                      </span>
                    </div>

                    {/* Plus / Minus Icon: 80px at 3840w, Manrope-Regular (400), #0A0A0B */}
                    <span className="mt-[2px] lg:mt-[calc(14*var(--u))] text-[24px] sm:text-[28px] lg:text-[calc(80*var(--u))] font-normal text-[#0A0A0B] leading-[0.6] select-none shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-7 pl-[42px] sm:pl-[52px] lg:pl-[calc(126*var(--u))] lg:pr-[calc(100*var(--u))] pb-5 sm:pb-6 lg:pb-[calc(64*var(--u))] pt-1 lg:pt-[calc(10*var(--u))]">
                      {/* Answer Text: 30px at 3840w, Manrope-Medium (500), leading 48px (1.6), tracking 20 (0.02em), #000000 */}
                      <p className="text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-medium tracking-[0.02em] text-[#000000] leading-[1.6] lg:leading-[calc(48*var(--u))] lg:whitespace-pre-line">
                        {faq.a}
                      </p>
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
