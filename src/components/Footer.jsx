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
    <footer id="footer" className="relative w-full bg-[#FFFFFF] text-[#131313] font-['Manrope'] select-none">
      <div className="footer-container max-w-[1400px] 2xl:max-w-[1720px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-6 sm:px-8 lg:px-12 2xl:px-16 4xl:px-20">
        {/* Row 1: LET'S CONNECT (Layer 19) */}
        <div className="py-10 sm:py-14 2xl:py-16 4xl:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-200">
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl 4xl:text-[54px] font-extralight text-[#EC2024] tracking-tight uppercase leading-none mb-2 2xl:mb-3">
              LET'S CONNECT
            </h3>
            <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg text-[#333333] font-normal">
              Stay updated with upcoming LUMA products and news or simply get in touch.
            </p>
          </div>

          {/* Newsletter Subscription */}
          <div className="w-full lg:w-auto lg:min-w-[480px] 2xl:min-w-[560px] 4xl:min-w-[640px]">
            <p className="text-xs 2xl:text-sm 4xl:text-base text-[#222222] font-normal mb-2 2xl:mb-3">
              You will get monthly newsletter
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <div className="flex-1 flex items-center border border-gray-300 rounded-[8px] 2xl:rounded-[10px] overflow-hidden focus-within:border-black transition-colors p-1 bg-white">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email ID"
                  required
                  className="w-full px-4 2xl:px-6 py-2.5 2xl:py-3.5 4xl:py-4 text-xs sm:text-sm 2xl:text-base 4xl:text-lg text-black placeholder:text-gray-400 bg-transparent outline-none font-normal"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-[#EC2024] text-white text-xs sm:text-sm 2xl:text-base font-semibold uppercase tracking-wider px-6 2xl:px-8 py-2.5 2xl:py-3.5 4xl:py-4 rounded-[6px] 2xl:rounded-[8px] transition-colors cursor-pointer shrink-0"
                >
                  {subscribed ? 'SENT ✓' : 'SEND'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Row 2: Location and Contact Info (Layer 24) */}
        <div className="py-8 sm:py-10 2xl:py-12 4xl:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gray-200 text-xs sm:text-sm 2xl:text-base 4xl:text-lg text-[#222222]">
          {/* Dubai Mall Location */}
          <div className="flex items-start gap-3 2xl:gap-4 max-w-md 2xl:max-w-xl">
            <img
              src="/assets/footer/pin.png"
              alt="Location Pin"
              className="w-4 h-5 2xl:w-5 2xl:h-6 4xl:w-6 4xl:h-7 object-contain mt-0.5 shrink-0"
            />
            <p className="leading-relaxed">
              Office Number M-090A, Fashion Parking,
              <br />
              Dubai Mall, United Arab Emirates.
            </p>
          </div>

          {/* Phones and Email */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 2xl:gap-12 4xl:gap-16">
            {/* Phone */}
            <a
              href="tel:+97141234567"
              className="flex items-center gap-2.5 2xl:gap-3.5 hover:text-[#EC2024] transition-colors"
            >
              <img
                src="/assets/footer/phone.png"
                alt="Phone"
                className="w-4 h-4 2xl:w-5 2xl:h-5 4xl:w-6 4xl:h-6 object-contain shrink-0"
              />
              <span className="font-medium">+971 4 123 4567</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/971501234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 2xl:gap-3.5 hover:text-[#EC2024] transition-colors"
            >
              <img
                src="/assets/footer/mobile.png"
                alt="WhatsApp"
                className="w-4 h-4 2xl:w-5 2xl:h-5 4xl:w-6 4xl:h-6 object-contain shrink-0"
              />
              <span className="font-medium">+971 50 123 4567</span>
            </a>

            {/* Email */}
            <a
              href="mailto:info@lumaredlight.com"
              className="flex items-center gap-2.5 2xl:gap-3.5 hover:text-[#EC2024] transition-colors"
            >
              <img
                src="/assets/footer/email.png"
                alt="Email"
                className="w-4 h-4 2xl:w-5 2xl:h-5 4xl:w-6 4xl:h-6 object-contain shrink-0"
              />
              <span className="font-medium">info@lumaredlight.com</span>
            </a>
          </div>
        </div>

        {/* Row 3: Useful Links (Layer 25) */}
        <div className="py-8 sm:py-10 2xl:py-12 4xl:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-8 lg:gap-14 2xl:gap-20 4xl:gap-24 w-full lg:w-auto">
            <h4 className="text-sm 2xl:text-[11.4px] 4xl:text-[17.1px] font-medium text-[#EC2024] uppercase tracking-wider shrink-0">
              USEFUL LINKS
            </h4>

            {/* 4-column product links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 2xl:gap-14 4xl:gap-16 text-xs sm:text-sm 2xl:text-[14px] 4xl:text-[16px] text-[#222222] font-normal">
              <div className="space-y-2 2xl:space-y-3">
                <a href="#products" className="block hover:text-[#EC2024] transition-colors">LUMA GLOW</a>
                <a href="#products" className="block hover:text-[#EC2024] transition-colors">LUMA GO</a>
              </div>
              <div className="space-y-2 2xl:space-y-3">
                <a href="#products" className="block hover:text-[#EC2024] transition-colors">LUMA NOVA</a>
                <a href="#products" className="block hover:text-[#EC2024] transition-colors">LUMA SURGE</a>
              </div>
              <div className="space-y-2 2xl:space-y-3">
                <a href="#products" className="block hover:text-[#EC2024] transition-colors">LUMA APEX</a>
                <a href="#products" className="block hover:text-[#EC2024] transition-colors">LUMA ULTRA</a>
              </div>
              <div className="space-y-2 2xl:space-y-3">
                <a href="#products" className="block hover:text-[#EC2024] transition-colors">LUMA MAX</a>
                <a href="#about" className="block hover:text-[#EC2024] transition-colors">ABOUT LUMA</a>
              </div>
            </div>
          </div>

          {/* Get Your Panel CTA Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="w-full sm:w-auto px-7 py-3 2xl:px-10 2xl:py-4 4xl:px-12 4xl:py-5 rounded-[8px] 2xl:rounded-[10px] bg-black hover:bg-[#EC2024] text-white font-semibold text-xs 2xl:text-[10.8px] 4xl:text-[16.2px] uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            GET YOUR PANEL
          </button>
        </div>

        {/* Row 4: Hashtag & Socials (Layer 26) */}
        <div className="py-12 sm:py-16 2xl:py-20 4xl:py-24 flex flex-col items-center justify-center text-center border-b border-gray-200">
          {/* #LUMAREDLIGHTs */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-[73.3px] 4xl:text-[110px] font-semibold tracking-tight italic uppercase mb-6 2xl:mb-8">
            <span className="text-[#EC2024]">#</span>
            <span className="text-[#131313]">LUMAREDLIGHTS</span>
          </h2>

          {/* Follow Us with authentic PSD social icons */}
          <div className="flex items-center gap-4 2xl:gap-6">
            <span className="text-xs sm:text-sm 2xl:text-[11.4px] 4xl:text-[17.1px] font-medium tracking-wider uppercase text-[#131313]">
              FOLLOW US
            </span>
            <div className="flex items-center gap-3 2xl:gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              >
                <img
                  src="/assets/footer/social-1.png"
                  alt="Facebook"
                  className="w-8 h-8 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 object-contain"
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              >
                <img
                  src="/assets/footer/social-2.png"
                  alt="Instagram"
                  className="w-8 h-8 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 object-contain"
                />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              >
                <img
                  src="/assets/footer/social-3.png"
                  alt="YouTube"
                  className="w-8 h-8 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Row 5: Copyright & Legal (Layer 27) */}
        <div className="py-6 2xl:py-8 4xl:py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs 2xl:text-sm 4xl:text-base text-gray-500 font-normal">
          <p>Copyright © 2026 LUMA. All rights reserved</p>
          <div className="flex items-center gap-6 2xl:gap-8">
            <a href="#terms" className="hover:text-black transition-colors">
              Terms and Conditions &amp; Privacy policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
