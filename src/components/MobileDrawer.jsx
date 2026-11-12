import React, { useEffect } from 'react';

export default function MobileDrawer({
  isOpen,
  onClose,
  onNavigate,
  enableProductsPage = false,
  customerUser = null,
  onOpenCustomerModal,
  onOpenCustomerAccount,
  onCustomerLogout,
  whatsappLink = 'https://wa.me/971501234567',
}) {
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
                { label: 'REVIEWS', href: '/reviews', page: 'reviews', hash: '' },
                { label: 'COMMUNITY', href: '/community', page: 'community', hash: '' },
                { label: 'CONTACT US', href: '/contact', page: 'contact', hash: '' },
                { label: 'SHOPPING BAG', href: '/cart', page: 'cart', hash: '' },
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
              {customerUser ? (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenCustomerAccount) onOpenCustomerAccount('profile');
                    }}
                    className="flex items-center justify-between w-full text-left cursor-pointer hover:opacity-90"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#ED2024] text-white font-bold flex items-center justify-center text-xs">
                        {customerUser.name ? customerUser.name.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{customerUser.name}</div>
                        <div className="text-[10px] text-white/50">{customerUser.email}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Manage &rarr;</span>
                  </button>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenCustomerAccount) onOpenCustomerAccount('cart');
                      }}
                      className="flex-1 py-1 px-2 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-center cursor-pointer"
                    >
                      My Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenCustomerAccount) onOpenCustomerAccount('orders');
                      }}
                      className="flex-1 py-1 px-2 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-center cursor-pointer"
                    >
                      Orders
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onCustomerLogout) onCustomerLogout();
                      }}
                      className="py-1 px-2.5 rounded text-red-400 hover:text-white hover:bg-[#ED2024] text-center cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCustomerModal) onOpenCustomerModal();
                  }}
                  className="flex items-center gap-3 text-xs text-white/80 hover:text-[#ED2024] transition-colors text-left cursor-pointer"
                >
                  <img
                    src="/assets/user-icon.png"
                    alt="Account"
                    className="w-4 h-auto"
                  />
                  <span>Customer Sign In / Register</span>
                </button>
              )}
              <a
                href={whatsappLink || 'https://wa.me/971501234567'}
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
