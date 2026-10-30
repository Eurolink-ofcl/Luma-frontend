import React, { useState, useEffect } from 'react';
import CurrencyDropdown from './CurrencyDropdown';

export default function Navbar({ onOpenCart, onOpenMobile, currentPage = 'home', onNavigate }) {
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

  const handlePageNav = (e, page, hash = '') => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page, hash);
    }
  };

  return (
    <header
      id="navbar"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className={`luma-navbar-header fixed left-0 w-full h-[64px] lg:h-[calc(191*var(--u))] z-40 transition-all duration-300 font-['Manrope'] border-b border-[rgba(170,146,146,0.20)] ${
        scrolled
          ? 'top-0 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl border-t-0'
          : 'top-[32px] lg:top-[calc(69*var(--u))] bg-transparent border-t border-t-[rgba(170,146,146,0.46)]'
      }`}
    >
      <div className="luma-navbar-container relative w-full h-full mx-auto px-4 sm:px-8 lg:pl-[calc(520*var(--u))] lg:pr-[calc(210*var(--u))] flex items-center justify-between gap-4">
        {/* Left: Brand Logo (PSD bbox x=520..799, w=279, h=83) */}
        <a
          href="/"
          onClick={(e) => handlePageNav(e, 'home')}
          className="flex items-center shrink-0 py-1 hover:scale-[1.02] transition-transform"
          aria-label="LUMA Homepage"
        >
          <img
            src="/assets/luma-logo.png"
            alt="LUMA"
            className="luma-logo-img h-7 sm:h-8 lg:h-[calc(83*var(--u))] w-auto object-contain"
          />
        </a>

        {/* Center: Main Navigation Menu (Desktop) - PSD x=1267..2574 */}
        <nav
          className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-auto"
          aria-label="Primary Navigation"
        >
          <ul className="luma-navbar-links flex items-center lg:gap-[calc(114*var(--u))]">
            <li>
              <a
                href="/about"
                onClick={(e) => handlePageNav(e, 'about')}
                className={`relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase transition-colors group whitespace-nowrap ${
                  currentPage === 'about' ? 'text-[#ED2024]' : 'text-[#FFFFFF] hover:text-white'
                }`}
              >
                ABOUT &nbsp;LUMA
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#EC2024] transition-all duration-300 rounded ${
                    currentPage === 'about' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            </li>

            <li className="relative group">
              <a
                href="/products"
                onClick={(e) => handlePageNav(e, 'products')}
                className={`relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase transition-colors flex items-center gap-1 group whitespace-nowrap ${
                  currentPage === 'products' ? 'text-[#ED2024]' : 'text-[#FFFFFF] hover:text-white'
                }`}
              >
                OUR &nbsp;PRODUCTS
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#EC2024] transition-all duration-300 rounded ${
                    currentPage === 'products' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>

              {/* Mega Dropdown Preview */}
              <div className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 min-w-[300px] bg-[#121212]/95 backdrop-blur-2xl border border-white/10 rounded-xl p-3 shadow-2xl opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 flex flex-col gap-1 z-50">
                <a
                  href="/products"
                  onClick={(e) => handlePageNav(e, 'products')}
                  className="flex flex-col p-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-semibold text-white mb-0.5">
                    LUMA Pro Max (9-Wavelength)
                  </span>
                  <span className="text-[11px] text-white/50">
                    Full-body clinical red &amp; NIR therapy
                  </span>
                </a>
                <a
                  href="/products"
                  onClick={(e) => handlePageNav(e, 'products')}
                  className="flex flex-col p-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-semibold text-white mb-0.5">
                    LUMA Studio Pulse
                  </span>
                  <span className="text-[11px] text-white/50">
                    Targeted recovery for face &amp; joints
                  </span>
                </a>
                <a
                  href="/products"
                  onClick={(e) => handlePageNav(e, 'products')}
                  className="flex flex-col p-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-semibold text-white mb-0.5">
                    Mounts &amp; Accessories
                  </span>
                  <span className="text-[11px] text-white/50">
                    Vertical motorized stands and door mounts
                  </span>
                </a>
              </div>
            </li>

            <li>
              <a
                href="/#reviews"
                onClick={(e) => handlePageNav(e, 'home', '#reviews')}
                className="relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase text-[#FFFFFF] hover:text-white transition-colors group whitespace-nowrap"
              >
                REVIEWS
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EC2024] transition-all duration-300 group-hover:w-full rounded" />
              </a>
            </li>

            <li>
              <a
                href="/#community"
                onClick={(e) => handlePageNav(e, 'home', '#community')}
                className="relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase text-[#FFFFFF] hover:text-white transition-colors group whitespace-nowrap"
              >
                COMMUNITY
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EC2024] transition-all duration-300 group-hover:w-full rounded" />
              </a>
            </li>

            <li>
              <a
                href="/#contact"
                onClick={(e) => handlePageNav(e, 'home', '#contact')}
                className="relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase text-[#FFFFFF] hover:text-white transition-colors group whitespace-nowrap"
              >
                CONTACT US
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EC2024] transition-all duration-300 group-hover:w-full rounded" />
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Actions (PSD x=2861..3630) */}
        <div className="luma-navbar-actions flex items-center gap-3 sm:gap-4 lg:gap-[calc(48*var(--u))] shrink-0 ml-auto">
          {/* CTA Button: GET YOUR PANEL (PSD Rectangle 44: w=266, h=63, font 26px Manrope-Medium, tracking 0) */}
          <a
            href="/#get-panel"
            onClick={(e) => handlePageNav(e, 'home', '#get-panel')}
            className="hidden sm:inline-flex items-center justify-center px-3 lg:px-0 lg:w-[calc(266*var(--u))] h-[30px] lg:h-[calc(63*var(--u))] border border-white/90 rounded-[5px] lg:rounded-[calc(8*var(--u))] text-[11px] lg:text-[calc(26*var(--u))] font-medium tracking-normal uppercase text-[#FFFFFF] hover:bg-white hover:text-black transition-all whitespace-nowrap leading-none"
          >
            GET YOUR PANEL
          </a>

          {/* Account Icon (w=32, h=42 at 3840w) */}
          <button
            type="button"
            onClick={() =>
              alert(
                'Welcome to LUMA. Sign in or register your warranty.'
              )
            }
            className="hidden md:inline-flex items-center justify-center text-white hover:opacity-80 transition-all cursor-pointer"
            aria-label="My Account"
            title="My Account"
          >
            <img
              src="/assets/user-icon.png"
              alt="Account"
              className="w-4 lg:w-[calc(32*var(--u))] h-auto object-contain"
            />
          </button>

          {/* WhatsApp Support Icon (w=40, h=40 at 3840w) */}
          <a
            href="https://wa.me/971500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer"
            aria-label="WhatsApp Support"
            title="WhatsApp Support"
          >
            <img
              src="/assets/whatsapp-icon.png"
              alt="WhatsApp"
              className="w-5 h-5 lg:w-[calc(40*var(--u))] lg:h-[calc(40*var(--u))] object-contain"
            />
          </a>

          {/* Currency Selector */}
          <div className="hidden sm:block">
            <CurrencyDropdown />
          </div>

          {/* Shopping Cart Bag with Badge (w=37, h=45 at 3840w; badge w=27, h=27, font Inter-Bold 22px) */}
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center justify-center text-white hover:opacity-80 transition-all cursor-pointer relative"
            aria-label="Shopping Cart with 2 items"
            title="View Shopping Bag"
          >
            <div className="relative inline-flex items-center justify-center">
              <img
                src="/assets/bag-icon.png"
                alt="Shopping Bag"
                className="w-[18px] lg:w-[calc(37*var(--u))] h-auto object-contain"
              />
              <span className="absolute -top-1.5 -right-2 lg:-top-[calc(12*var(--u))] lg:-right-[calc(13*var(--u))] w-[14px] h-[14px] lg:w-[calc(27*var(--u))] lg:h-[calc(27*var(--u))] rounded-full bg-[#FFFFFF] text-[#000000] font-['Inter'] text-[9px] lg:text-[calc(22*var(--u))] font-bold tracking-[-0.1em] flex items-center justify-center leading-none">
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
