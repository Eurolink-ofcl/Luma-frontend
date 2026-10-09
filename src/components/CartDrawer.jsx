import React, { useEffect } from 'react';

export default function CartDrawer({ isOpen, onClose }) {
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 font-['Manrope']">
        <div className="w-screen max-w-[420px] bg-[#121212] border-l border-white/10 shadow-2xl p-7 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg font-bold text-white">Shopping Bag</h2>
                <span className="text-xs text-white/50">(2 items)</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-2xl text-white/70 hover:text-white transition-colors cursor-pointer leading-none p-1"
                aria-label="Close bag"
              >
                &times;
              </button>
            </div>

            {/* Items */}
            <div className="py-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-320px)]">
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-1">
                  LUMA Pro Max 9-Wavelength
                </h3>
                <p className="text-xs text-white/50 mb-3">
                  Standard Stand / Matte Obsidian
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Qty: 1</span>
                  <span className="font-semibold text-white text-sm">
                    AED 4,890 د.إ
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-1">
                  LUMA Protective NIR Eyewear
                </h3>
                <p className="text-xs text-white/50 mb-3">
                  Pro Shielding Optical Lens
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Qty: 1</span>
                  <span className="font-semibold text-white text-sm">
                    AED 240 د.إ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-5 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between text-[15px] font-semibold text-white">
              <span>Subtotal</span>
              <span>AED 5,130 د.إ</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80 bg-[#EC2024]/10 border border-[#EC2024]/20 p-2.5 rounded-lg">
              <img
                src="/assets/truck.png"
                alt="Free Delivery"
                className="w-4 h-auto shrink-0"
              />
              <span>Free Global Express Delivery Included</span>
            </div>
            <a
              href="#checkout"
              className="w-full text-center py-3.5 bg-[#EC2024] hover:bg-[#ff3337] text-white font-semibold text-xs tracking-wider uppercase rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#EC2024]/25"
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
