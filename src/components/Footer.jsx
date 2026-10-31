import React, { useState } from 'react';

export default function Footer({ onOpenCart }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer
      id="footer"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] font-['Manrope'] select-none"
    >
      {/* Row 1: LET'S CONNECT (PSD Group 'Lets Connect', Line 1 at top + Line 2 at bottom) */}
      <div className="w-full border-t border-b border-[#888888]/60">
        <div className="footer-container w-[90%] sm:w-[86%] lg:w-[72.97%] mx-auto py-8 sm:py-10 lg:pt-[calc(103*var(--u))] lg:pb-[calc(92*var(--u))] flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-0">
          {/* Left: LET'S CONNECT & Subtitle */}
          <div className="lg:pt-[calc(58*var(--u))]">
            <h3 className="text-[28px] sm:text-[34px] lg:text-[calc(80*var(--u))] font-extralight text-[#ED2024] tracking-normal uppercase leading-[0.85] mb-3 lg:mb-[calc(52*var(--u))]">
              LET&apos;S CONNECT
            </h3>
            <p className="text-[12px] sm:text-[13px] lg:text-[calc(30*var(--u))] text-[#000000] font-normal tracking-normal leading-snug lg:leading-none">
              Stay updated with upcoming LUMA products and news or simply get in touch.
            </p>
          </div>

          {/* Right: Newsletter Subscription (PSD Group 15, x=2168..3316, w=1148) */}
          <div className="w-full lg:w-[calc(1148*var(--u))] shrink-0">
            <p className="text-[13px] sm:text-[14px] lg:text-[calc(36*var(--u))] text-[#000000] font-normal tracking-normal leading-none mb-2.5 lg:mb-[calc(35*var(--u))]">
              You will get monthly newsletter
            </p>
            <form onSubmit={handleSubscribe} className="w-full">
              <div className="w-full h-[46px] sm:h-[50px] lg:h-[calc(125*var(--u))] flex items-center border border-[#000000] rounded-[8px] lg:rounded-[calc(20*var(--u))] p-[3px] lg:p-[calc(7*var(--u))] bg-[#FFFFFF]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email ID"
                  required
                  className="w-full h-full pl-3.5 lg:pl-[calc(32*var(--u))] pr-2 text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] text-[#000000] placeholder:text-[#000000] placeholder:opacity-100 bg-transparent outline-none font-normal tracking-normal"
                />
                <button
                  type="submit"
                  className="w-[96px] sm:w-[110px] lg:w-[calc(267*var(--u))] h-full bg-[#0A0A0A] hover:bg-[#ED2024] text-[#FFFFFF] text-[13px] sm:text-[14px] lg:text-[calc(38*var(--u))] font-semibold uppercase tracking-normal rounded-[6px] lg:rounded-[calc(15*var(--u))] transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                >
                  {subscribed ? 'SENT ✓' : 'SEND'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Row 2: Location and Contact Info (PSD Group '2', y=20266..20513) */}
      <div className="w-full border-b border-[#888888]/60">
        <div className="footer-container w-[90%] sm:w-[86%] lg:w-[72.97%] mx-auto py-6 sm:py-8 lg:pt-[calc(87*var(--u))] lg:pb-[calc(80*var(--u))] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-0 text-[#000000]">
          {/* Dubai Mall Location (x=520..1215) */}
          <div className="flex items-center gap-3 lg:gap-[calc(33*var(--u))]">
            <img
              src="/assets/footer/pin.png"
              alt="Location Pin"
              className="w-4 h-5 lg:w-[calc(52*var(--u))] lg:h-[calc(66*var(--u))] object-contain shrink-0"
            />
            <p className="text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] text-[#000000] font-normal tracking-[0.02em] leading-[1.406]">
              Office Number M-090A, Fashion Parking,
              <br />
              Dubai Mall, United Arab Emirates.
            </p>
          </div>

          {/* Phones and Email (x=2101..3322) */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-0">
            {/* Phone */}
            <a
              href="tel:+97141234567"
              className="flex items-center gap-2 lg:gap-[calc(15*var(--u))] lg:mr-[calc(87*var(--u))] text-[#000000] hover:text-[#ED2024] transition-colors"
            >
              <img
                src="/assets/footer/phone.png"
                alt="Phone"
                className="w-4 h-4 lg:w-[calc(55*var(--u))] lg:h-[calc(63*var(--u))] object-contain shrink-0"
              />
              <span className="text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] font-normal tracking-[0.02em] leading-none lg:translate-y-[calc(5*var(--u))]">
                +971 4 123 4567
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/971501234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 lg:gap-[calc(18*var(--u))] lg:mr-[calc(76*var(--u))] text-[#000000] hover:text-[#ED2024] transition-colors"
            >
              <img
                src="/assets/footer/mobile.png"
                alt="WhatsApp"
                className="w-4 h-4 lg:w-[calc(60*var(--u))] lg:h-[calc(60*var(--u))] object-contain shrink-0"
              />
              <span className="text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] font-normal tracking-[0.02em] leading-none">
                +971 50 123 4567
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:info@lumaredlight.com"
              className="flex items-center gap-2 lg:gap-[calc(20*var(--u))] text-[#000000] hover:text-[#ED2024] transition-colors"
            >
              <img
                src="/assets/footer/email.png"
                alt="Email"
                className="w-4 h-3.5 lg:w-[calc(54*var(--u))] lg:h-[calc(40*var(--u))] object-contain shrink-0"
              />
              <span className="text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] font-normal tracking-[0.02em] leading-none">
                info@lumaredlight.com
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Row 3: Useful Links & Get Your Panel (PSD Group '3', y=20514..20818) */}
      <div className="w-full border-b border-[#888888]/60">
        <div className="footer-container w-[90%] sm:w-[86%] lg:w-[72.97%] mx-auto py-7 sm:py-9 lg:pt-[calc(97*var(--u))] lg:pb-[calc(98*var(--u))] flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-0">
          <div className="flex flex-col sm:flex-row items-start w-full lg:w-auto gap-6 sm:gap-10 lg:gap-0">
            {/* USEFUL LINKS (top-aligned with first link row, x=521..772, next col at x=968 -> 447px span) */}
            <h4 className="lg:w-[calc(447*var(--u))] text-[13px] sm:text-[14px] lg:text-[calc(38*var(--u))] font-medium text-[#ED2024] uppercase tracking-[0.02em] leading-none shrink-0">
              USEFUL LINKS
            </h4>

            {/* 4-column product links (x=968, 1422, 1906, 2356) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-start gap-6 sm:gap-10 lg:gap-0 text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] text-[#000000] font-normal tracking-[0.02em] leading-none lg:pt-[calc(4*var(--u))]">
              <div className="flex flex-col gap-3.5 lg:gap-[calc(45*var(--u))] lg:w-[calc(454*var(--u))]">
                <a href="#products" className="block hover:text-[#ED2024] transition-colors">LUMA GLOW</a>
                <a href="#products" className="block hover:text-[#ED2024] transition-colors">LUMA GO</a>
              </div>
              <div className="flex flex-col gap-3.5 lg:gap-[calc(45*var(--u))] lg:w-[calc(484*var(--u))]">
                <a href="#products" className="block hover:text-[#ED2024] transition-colors">LUMA NOVA</a>
                <a href="#products" className="block hover:text-[#ED2024] transition-colors">LUMA SURGE</a>
              </div>
              <div className="flex flex-col gap-3.5 lg:gap-[calc(45*var(--u))] lg:w-[calc(450*var(--u))]">
                <a href="#products" className="block hover:text-[#ED2024] transition-colors">LUMA APEX</a>
                <a href="#products" className="block hover:text-[#ED2024] transition-colors">LUMA ULTRA</a>
              </div>
              <div className="flex flex-col gap-3.5 lg:gap-[calc(45*var(--u))]">
                <a href="#products" className="block hover:text-[#ED2024] transition-colors">LUMA MAX</a>
                <a href="#about" className="block hover:text-[#ED2024] transition-colors">ABOUT LUMA</a>
              </div>
            </div>
          </div>

          {/* Get Your Panel CTA Button (PSD Rectangle 9 copy 2, x=2895..3323, w=428, h=107) */}
          <button
            type="button"
            onClick={onOpenCart}
            className="w-full sm:w-auto lg:w-[calc(428*var(--u))] h-[42px] sm:h-[46px] lg:h-[calc(107*var(--u))] px-6 lg:px-0 rounded-[8px] lg:rounded-[calc(20*var(--u))] bg-[#0A0A0A] hover:bg-[#ED2024] text-[#FFFFFF] font-semibold text-[12px] sm:text-[13px] lg:text-[calc(36*var(--u))] uppercase tracking-[0.02em] leading-none transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            GET YOUR PANEL
          </button>
        </div>
      </div>

      {/* Row 4: Hashtag & Socials (PSD Group '4', y=20819..21211) */}
      <div className="w-full border-b border-[#888888]/60">
        <div className="footer-container w-[90%] sm:w-[86%] lg:w-[72.97%] mx-auto py-10 sm:py-12 lg:pt-[calc(98*var(--u))] lg:pb-[calc(98*var(--u))] flex flex-col items-center justify-center text-center">
          {/* #LUMAREDLIGHTS (110px at 3840w, Manrope-SemiBold Italic) */}
          <h2 className="text-[28px] sm:text-[38px] md:text-[46px] lg:text-[calc(110*var(--u))] font-semibold tracking-[0.02em] italic uppercase leading-[0.85] mb-4 lg:mb-[calc(30*var(--u))]">
            <span className="text-[#ED2024]">#</span>
            <span className="text-[#0A0A0B]">LUMAREDLIGHTS</span>
          </h2>

          {/* Follow Us with authentic PSD social icons (Group 33) */}
          <div className="flex items-center justify-center">
            <span className="text-[13px] sm:text-[14px] lg:text-[calc(38*var(--u))] font-medium tracking-[0.02em] uppercase text-[#000000] leading-none mr-4 lg:mr-[calc(32*var(--u))]">
              FOLLOW US
            </span>
            <div className="flex items-center gap-2.5 lg:gap-[calc(16*var(--u))]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 lg:w-[calc(81*var(--u))] lg:h-[calc(81*var(--u))] rounded-full flex items-center justify-center transition-transform hover:scale-105"
              >
                <img
                  src="/assets/footer/social-1.png"
                  alt="Facebook"
                  className="w-full h-full object-contain"
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 lg:w-[calc(81*var(--u))] lg:h-[calc(81*var(--u))] rounded-full flex items-center justify-center transition-transform hover:scale-105"
              >
                <img
                  src="/assets/footer/social-2.png"
                  alt="Instagram"
                  className="w-full h-full object-contain"
                />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 lg:w-[calc(81*var(--u))] lg:h-[calc(81*var(--u))] rounded-full flex items-center justify-center transition-transform hover:scale-105"
              >
                <img
                  src="/assets/footer/social-3.png"
                  alt="YouTube"
                  className="w-full h-full object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Copyright & Legal (PSD Group '5', y=21212..21435) */}
      <div className="w-full">
        <div className="footer-container w-[90%] sm:w-[86%] lg:w-[72.97%] mx-auto py-5 sm:py-6 lg:pt-[calc(98*var(--u))] lg:pb-[calc(92*var(--u))] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] text-[#000000] font-normal tracking-normal leading-none">
          <p>Copyright &copy; 2026 LUMA. All rights reserved</p>
          <div>
            <a href="#terms" className="text-[#000000] hover:text-[#ED2024] transition-colors">
              Terms and Conditions &amp; Privacy policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
