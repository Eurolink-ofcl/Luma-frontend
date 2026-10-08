import React, { useState, useEffect } from 'react';
import CurrencyDropdown from './CurrencyDropdown';

export default function Navbar({ onOpenCart, onOpenMobile }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="navbar"
      className={`luma-navbar-header fixed left-0 w-full h-[72px] lg:h-[84px] 2xl:h-[96px] 4xl:h-[128px] z-40 transition-all duration-300 ${
        scrolled
          ? 'top-0 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl border-b border-white/10'
          : 'top-[36px] xl:top-[36px] 2xl:top-[40px] 3xl:top-[42px] 4xl:top-[46px] bg-gradient-to-b from-black/85 via-black/45 to-transparent border-b border-white/15'
      }`}
    >
      <div className="luma-navbar-container relative max-w-[1760px] 4xl:max-w-[2600px] w-full h-full mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 4xl:px-24 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <a
          href="#"
          className="flex items-center shrink-0 py-1 hover:scale-[1.02] transition-transform"
          aria-label="LUMA Homepage"
        >
          <img
            src="/assets/luma-logo.png"
            alt="LUMA"
            className="luma-logo-img h-7 sm:h-9 xl:h-10 2xl:h-11 4xl:h-14 w-auto object-contain"
          />
        </a>

        {/* Center: Main Navigation Menu (Desktop) - Centered precisely on viewport like PSD */}
        <nav
          className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-auto"
          aria-label="Primary Navigation"
        >
          <ul className="luma-navbar-links flex items-center gap-5 xl:gap-7 2xl:gap-10 3xl:gap-12 4xl:gap-[76px]">
            <li>
              <a
                href="#about"
                className="relative py-2 text-[12.5px] xl:text-[13px] 2xl:text-[14px] 3xl:text-[15px] 4xl:text-[17px] font-medium tracking-[0.05em] uppercase text-white hover:text-white transition-colors group whitespace-nowrap"
              >
                ABOUT LUMA
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EC2024] transition-all duration-300 group-hover:w-full rounded" />
              </a>
            </li>

            <li className="relative group">
              <a
                href="#products"
                className="relative py-2 text-[12.5px] xl:text-[13px] 2xl:text-[14px] 3xl:text-[15px] 4xl:text-[17px] font-medium tracking-[0.05em] uppercase text-white hover:text-white transition-colors flex items-center gap-1 group whitespace-nowrap"
              >
                OUR PRODUCTS
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EC2024] transition-all duration-300 group-hover:w-full rounded" />
              </a>

              {/* Mega Dropdown Preview */}
              <div className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 min-w-[300px] bg-[#121212]/95 backdrop-blur-2xl border border-white/10 rounded-xl p-3 shadow-2xl opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 flex flex-col gap-1 z-50">
                <a
                  href="#pro-panel"
                  className="flex flex-col p-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-semibold text-white mb-0.5">
                    LUMA Pro Max (9-Wavelength)
                  </span>
                  <span className="text-[11px] text-white/50">
                    Full-body clinical red & NIR therapy
                  </span>
                </a>
                <a
                  href="#compact-panel"
                  className="flex flex-col p-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-semibold text-white mb-0.5">
                    LUMA Studio Pulse
                  </span>
                  <span className="text-[11px] text-white/50">
                    Targeted recovery for face & joints
                  </span>
                </a>
                <a
                  href="#accessories"
                  className="flex flex-col p-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-semibold text-white mb-0.5">
                    Mounts & Accessories
                  </span>
                  <span className="text-[11px] text-white/50">
                    Vertical motorized stands and door mounts
                  </span>
                </a>
              </div>
            </li>

            <li>
              <a
                href="#reviews"
                className="relative py-2 text-[12.5px] xl:text-[13px] 2xl:text-[14px] 3xl:text-[15px] 4xl:text-[17px] font-medium tracking-[0.05em] uppercase text-white hover:text-white transition-colors group whitespace-nowrap"
              >
                REVIEWS
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EC2024] transition-all duration-300 group-hover:w-full rounded" />
              </a>
            </li>

            <li>
              <a
                href="#community"
                className="relative py-2 text-[12.5px] xl:text-[13px] 2xl:text-[14px] 3xl:text-[15px] 4xl:text-[17px] font-medium tracking-[0.05em] uppercase text-white hover:text-white transition-colors group whitespace-nowrap"
              >
                COMMUNITY
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EC2024] transition-all duration-300 group-hover:w-full rounded" />
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="relative py-2 text-[12.5px] xl:text-[13px] 2xl:text-[14px] 3xl:text-[15px] 4xl:text-[17px] font-medium tracking-[0.05em] uppercase text-white hover:text-white transition-colors group whitespace-nowrap"
              >
                CONTACT US
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EC2024] transition-all duration-300 group-hover:w-full rounded" />
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className="luma-navbar-actions flex items-center gap-3 sm:gap-4 xl:gap-5 2xl:gap-6 4xl:gap-8 shrink-0 ml-auto">
          {/* CTA Button: GET YOUR PANEL */}
          <a
            href="#get-panel"
            className="hidden sm:inline-flex items-center justify-center px-4 xl:px-5 2xl:px-7 4xl:px-8 h-[32px] 2xl:h-[38px] 4xl:h-[44px] border border-white/90 rounded-[5px] 2xl:rounded-[7px] text-[12px] 2xl:text-[14px] 4xl:text-[15px] font-medium tracking-[0.04em] uppercase text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all whitespace-nowrap"
          >
            GET YOUR PANEL
          </a>

          {/* Account Icon */}
          <button
            type="button"
            onClick={() =>
              alert(
                'Welcome to LUMA. Sign in or register your warranty.'
              )
            }
            className="hidden md:inline-flex items-center justify-center p-1.5 rounded-full text-white hover:-translate-y-0.5 hover:opacity-90 transition-all cursor-pointer"
            aria-label="My Account"
            title="My Account"
          >
            <img
              src="/assets/user-icon.png"
              alt="Account"
              className="w-4 h-auto"
            />
          </button>

          {/* WhatsApp Support Icon */}
          <a
            href="https://wa.me/971500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center justify-center p-1.5 rounded-full text-white hover:scale-110 transition-transform cursor-pointer"
            aria-label="WhatsApp Support"
            title="WhatsApp Support"
          >
            <img
              src="/assets/whatsapp-icon.png"
              alt="WhatsApp"
              className="w-5 h-5"
            />
          </a>

          {/* Currency Selector */}
          <div className="hidden sm:block">
            <CurrencyDropdown />
          </div>

          {/* Shopping Cart Bag with Badge */}
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center justify-center p-1.5 rounded-full text-white hover:-translate-y-0.5 hover:opacity-90 transition-all cursor-pointer relative"
            aria-label="Shopping Cart with 2 items"
            title="View Shopping Bag"
          >
            <div className="relative inline-flex items-center justify-center">
              <img
                src="/assets/bag-icon.png"
                alt="Shopping Bag"
                className="w-[19px] h-auto"
              />
              <span className="absolute -top-1.5 -right-2.5 w-[15px] h-[15px] rounded-full bg-white text-black font-['Inter'] text-[9.5px] font-bold flex items-center justify-center shadow-md">
                2
              </span>
            </div>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={onOpenMobile}
            className="lg:hidden flex flex-col justify-between w-6 h-[17px] p-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <span className="w-full h-[2px] bg-white rounded" />
            <span className="w-full h-[2px] bg-white rounded" />
            <span className="w-full h-[2px] bg-white rounded" />
          </button>
        </div>
      </div>
    </header>
  );
}
