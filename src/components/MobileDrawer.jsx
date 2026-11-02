import React, { useEffect } from 'react';

export default function MobileDrawer({ isOpen, onClose, onNavigate, enableProductsPage = false }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (e, page, hash = '') => {
    onClose();
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page, hash);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex font-['Manrope']">
        <div className="w-[320px] max-w-[85vw] bg-[#0e0e0e]/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-7 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <a
                href="/"
                onClick={(e) => handleItemClick(e, 'home')}
                className="inline-flex items-center"
              >
                <img
                  src="/assets/luma-logo.png"
                  alt="LUMA"
                  className="h-8 w-auto object-contain"
                />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="text-2xl text-white/70 hover:text-white transition-colors cursor-pointer leading-none p-1"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>

            {/* Nav list */}
            <ul className="flex flex-col gap-5 mt-8">
              {[
                { label: 'ABOUT LUMA', href: '/about', page: 'about', hash: '' },
                {
                  label: 'OUR PRODUCTS',
                  href: enableProductsPage ? '/products' : '/#products',
                  page: enableProductsPage ? 'products' : 'home',
                  hash: enableProductsPage ? '' : '#products',
                },
                { label: 'REVIEWS', href: '/#reviews', page: 'home', hash: '#reviews' },
                { label: 'COMMUNITY', href: '/#community', page: 'home', hash: '#community' },
                { label: 'CONTACT US', href: '/#contact', page: 'home', hash: '#contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item.page, item.hash)}
                    className="text-sm font-medium tracking-[0.05em] text-white hover:text-[#EC2024] transition-colors block uppercase"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <a
              href="/#get-panel"
              onClick={(e) => handleItemClick(e, 'home', '#get-panel')}
              className="w-full text-center py-2.5 px-5 border border-white/90 rounded text-xs font-medium tracking-[0.05em] uppercase text-white hover:bg-white hover:text-black transition-all"
            >
              GET YOUR PANEL
            </a>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  alert(
                    'Welcome to LUMA. Sign in or register your warranty.'
                  );
                }}
                className="flex items-center gap-3 text-xs text-white/70 hover:text-white transition-colors text-left"
              >
                <img
                  src="/assets/user-icon.png"
                  alt="Account"
                  className="w-4 h-auto"
                />
                <span>My Account</span>
              </button>
              <a
                href="https://wa.me/971500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-white/70 hover:text-white transition-colors"
              >
                <img
                  src="/assets/whatsapp-icon.png"
                  alt="WhatsApp"
                  className="w-4 h-auto"
                />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
