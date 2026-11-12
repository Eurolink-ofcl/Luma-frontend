import React, { useState, useEffect, useRef } from 'react';
import CurrencyDropdown from './CurrencyDropdown';
import { useCart } from '../context/CartContext';

export default function Navbar({
  onOpenCart,
  onOpenMobile,
  currentPage = 'home',
  onNavigate,
  enableProductsPage = false,
  customerUser = null,
  onOpenCustomerModal,
  onOpenCustomerAccount,
  onCustomerLogout,
  whatsappLink = 'https://wa.me/971501234567',
}) {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const productsTimerRef = useRef(null);
  const productsMenuRef = useRef(null);

  const handleProductsEnter = () => {
    if (productsTimerRef.current) clearTimeout(productsTimerRef.current);
    setIsProductsDropdownOpen(true);
  };

  const handleProductsLeave = () => {
    productsTimerRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 220);
  };

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productsMenuRef.current && !productsMenuRef.current.contains(e.target)) {
        setIsProductsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProductsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectProduct = (e, pageOrSlug, hash = '') => {
    e.preventDefault();
    e.stopPropagation();
    if (productsTimerRef.current) clearTimeout(productsTimerRef.current);
    setIsProductsDropdownOpen(false);
    if (onNavigate) {
      onNavigate(pageOrSlug, hash);
    }
  };

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
          : currentPage !== 'home'
          ? 'top-[32px] lg:top-[calc(69*var(--u))] bg-[#0a0a0a] border-t border-t-[rgba(170,146,146,0.46)]'
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

            <li
              ref={productsMenuRef}
              className="relative"
              onMouseEnter={handleProductsEnter}
              onMouseLeave={handleProductsLeave}
            >
              <div className="flex items-center">
                <a
                  href={enableProductsPage ? '/products' : '/#products'}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsProductsDropdownOpen((prev) => !prev);
                  }}
                  className={`relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentPage === 'products' ||
                    currentPage === 'product-detail' ||
                    currentPage === 'luma-glow' ||
                    currentPage === 'luma-go' ||
                    currentPage === 'luma-nova' ||
                    currentPage === 'luma-surge' ||
                    currentPage === 'luma-apex' ||
                    currentPage === 'luma-max'
                      ? 'text-[#ED2024]'
                      : 'text-[#FFFFFF] hover:text-white'
                  }`}
                >
                  <span>OUR &nbsp;PRODUCTS</span>
                  {/* Subtle chevron */}
                  <svg
                    viewBox="0 0 10 6"
                    fill="none"
                    className={`w-2.5 h-2 transition-transform duration-200 ${
                      isProductsDropdownOpen ? 'rotate-180 text-[#ED2024]' : 'text-white/60'
                    }`}
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#EC2024] transition-all duration-300 rounded ${
                      currentPage === 'products' ||
                      currentPage === 'product-detail' ||
                      currentPage === 'luma-glow' ||
                      currentPage === 'luma-go' ||
                      currentPage === 'luma-nova'
                        ? 'w-full'
                        : isProductsDropdownOpen
                        ? 'w-full'
                        : 'w-0'
                    }`}
                  />
                </a>
              </div>

              {/* Seamless Zero-Gap Dropdown Container (starts right at top-full with padding) */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 ${
                  isProductsDropdownOpen
                    ? 'opacity-100 visible pointer-events-auto transform translate-y-0'
                    : 'opacity-0 invisible pointer-events-none transform translate-y-1'
                }`}
              >
                {/* Invisible hover bridge to eliminate any boundary disconnect */}
                <div className="absolute -top-3 left-0 w-full h-4 bg-transparent pointer-events-auto" />

                {/* Dropdown Menu Card */}
                <div className="min-w-[320px] max-w-[340px] bg-[#121212]/98 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-1">
                  {[
                    {
                      slug: 'luma-glow',
                      name: 'LUMA GLOW Face Mask',
                      desc: 'Targeted 4-wavelength facial rejuvenation',
                      badge: 'MASK',
                    },
                    {
                      slug: 'luma-go',
                      name: 'LUMA GO Targeted Panel',
                      desc: 'Portable 660nm red light wellness & recovery',
                      badge: 'PORTABLE',
                    },
                    {
                      slug: 'luma-nova',
                      name: 'LUMA NOVA Targeted Panel',
                      desc: '8-wavelength compact panel with kickstand',
                      badge: 'POPULAR',
                    },
                    {
                      slug: 'luma-surge',
                      name: 'LUMA SURGE Dual-Chip Panel',
                      desc: 'Dual-chip high irradiance targeted therapy',
                      badge: 'POWER',
                    },
                    {
                      slug: 'luma-apex',
                      name: 'LUMA APEX Half-Body Panel',
                      desc: 'Upper & lower body clinical recovery panel',
                      badge: 'HALF BODY',
                    },
                    {
                      slug: 'luma-max',
                      name: 'LUMA MAX Full-Body Panel',
                      desc: 'Full-body clinical red & NIR therapy',
                      badge: 'CLINICAL',
                    },
                  ].map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={(e) => handleSelectProduct(e, item.slug)}
                      className="group/item flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all cursor-pointer text-left w-full border border-transparent hover:border-white/5"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white group-hover/item:text-[#ED2024] transition-colors mb-0.5">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-white/50 leading-tight">
                          {item.desc}
                        </span>
                      </div>
                      <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-white/40 group-hover/item:bg-[#ED2024]/15 group-hover/item:text-[#ED2024] transition-colors shrink-0 ml-2">
                        {item.badge}
                      </span>
                    </button>
                  ))}

                  {/* Divider */}
                  <div className="h-[1px] bg-white/10 my-1 mx-1.5" />

                  {/* All Products & Accessories Link */}
                  <button
                    type="button"
                    onClick={(e) =>
                      handleSelectProduct(
                        e,
                        enableProductsPage ? 'products' : 'home',
                        enableProductsPage ? '' : '#products'
                      )
                    }
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#ED2024] text-white hover:text-white transition-all cursor-pointer text-left w-full group/all"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        View All Products & Mounts
                      </span>
                      <span className="text-[10.5px] text-white/60 group-hover/all:text-white/90">
                        Explore complete clinical panel range
                      </span>
                    </div>
                    <span className="text-xs font-bold group-hover/all:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </li>

            <li>
              <a
                href="/reviews"
                onClick={(e) => handlePageNav(e, 'reviews')}
                className={`relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase transition-colors group whitespace-nowrap ${
                  currentPage === 'reviews' ? 'text-[#ED2024]' : 'text-[#FFFFFF] hover:text-white'
                }`}
              >
                REVIEWS
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#EC2024] transition-all duration-300 rounded ${
                    currentPage === 'reviews' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            </li>

            <li>
              <a
                href="/community"
                onClick={(e) => handlePageNav(e, 'community')}
                className={`relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase transition-colors group whitespace-nowrap ${
                  currentPage === 'community' ? 'text-[#ED2024]' : 'text-[#FFFFFF] hover:text-white'
                }`}
              >
                COMMUNITY
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#EC2024] transition-all duration-300 rounded ${
                    currentPage === 'community' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            </li>

            <li>
              <a
                href="/contact"
                onClick={(e) => handlePageNav(e, 'contact')}
                className={`relative py-2 lg:text-[calc(26*var(--u))] font-medium tracking-[0.05em] uppercase transition-colors group whitespace-nowrap ${
                  currentPage === 'contact' ? 'text-[#ED2024]' : 'text-[#FFFFFF] hover:text-white'
                }`}
              >
                CONTACT US
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#EC2024] transition-all duration-300 rounded ${
                    currentPage === 'contact' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
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

          {/* Customer Account / Sign In Widget */}
          {customerUser ? (
            <div className="relative group hidden sm:inline-flex items-center">
              <button
                type="button"
                onClick={() => onOpenCustomerAccount && onOpenCustomerAccount('profile')}
                className="flex items-center gap-2 py-1 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all cursor-pointer hover:border-[#ED2024]/50"
                aria-label="Customer Account Profile & Orders"
                title={`Signed in as ${customerUser.name} - Click to manage profile & orders`}
              >
                <div className="w-5 h-5 lg:w-[calc(30*var(--u))] lg:h-[calc(30*var(--u))] rounded-full bg-[#ED2024] text-white text-[10px] lg:text-[calc(18*var(--u))] font-bold flex items-center justify-center shrink-0">
                  {customerUser.name ? customerUser.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <span className="text-xs lg:text-[calc(22*var(--u))] font-semibold tracking-wide max-w-[90px] lg:max-w-[140px] truncate">
                  {customerUser.name?.split(' ')[0] || 'Member'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>

              {/* Hover / Click Dropdown Menu */}
              <div className="absolute top-[calc(100%+10px)] right-0 min-w-[220px] bg-[#121214]/98 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 shadow-2xl opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                  <p className="text-xs font-bold text-white truncate">{customerUser.name}</p>
                  <p className="text-[11px] text-white/50 truncate mt-0.5">{customerUser.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCustomerAccount && onOpenCustomerAccount('profile')}
                  className="w-full text-left px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Update Profile</span>
                  <span className="text-[10px] text-white/40">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCustomerAccount && onOpenCustomerAccount('cart')}
                  className="w-full text-left px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Add to Cart Products</span>
                  <span className="text-[10px] text-white/40">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCustomerAccount && onOpenCustomerAccount('orders')}
                  className="w-full text-left px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Ordered Products &amp; Status</span>
                  <span className="text-[10px] text-white/40">&rarr;</span>
                </button>

                <div className="h-[1px] bg-white/10 my-1.5" />

                <button
                  type="button"
                  onClick={onCustomerLogout}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:text-white hover:bg-[#ED2024] rounded-lg transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Sign Out</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenCustomerModal}
              className="hidden sm:inline-flex items-center gap-1.5 text-white hover:text-[#ED2024] transition-all cursor-pointer py-1 px-1.5 group"
              aria-label="Customer Sign In"
              title="Customer Sign In / Register"
            >
              <img
                src="/assets/user-icon.png"
                alt="Customer Account"
                className="w-4 lg:w-[calc(32*var(--u))] h-auto object-contain transition-transform group-hover:scale-110"
              />
              <span className="hidden xl:inline text-xs lg:text-[calc(22*var(--u))] font-medium tracking-[0.05em] uppercase text-white/90 group-hover:text-[#ED2024]">
                Sign In
              </span>
            </button>
          )}

          {/* WhatsApp Support Icon (w=40, h=40 at 3840w) */}
          <a
            href={whatsappLink || 'https://wa.me/971501234567'}
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

          {/* Shopping Cart Bag with Badge */}
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('cart') : onOpenCart && onOpenCart())}
            className={`inline-flex items-center justify-center text-white hover:opacity-80 transition-all cursor-pointer relative ${
              currentPage === 'cart' ? 'opacity-100 ring-2 ring-[#ED2024]/60 rounded-lg p-1' : ''
            }`}
            aria-label={`Shopping Cart with ${cartCount} items`}
            title="View Shopping Bag"
          >
            <div className="relative inline-flex items-center justify-center">
              <img
                src="/assets/bag-icon.png"
                alt="Shopping Bag"
                className="w-[18px] lg:w-[calc(37*var(--u))] h-auto object-contain"
              />
              <span className="absolute -top-1.5 -right-2 lg:-top-[calc(12*var(--u))] lg:-right-[calc(13*var(--u))] w-[14px] h-[14px] lg:w-[calc(27*var(--u))] lg:h-[calc(27*var(--u))] rounded-full bg-[#FFFFFF] text-[#000000] font-['Inter'] text-[9px] lg:text-[calc(22*var(--u))] font-bold tracking-[-0.1em] flex items-center justify-center leading-none">
                {cartCount}
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
