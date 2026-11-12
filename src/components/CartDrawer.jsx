import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer({ isOpen, onClose, onOpenCheckout, onNavigate }) {
  const { cartItems, cartCount, cartSubtotal, removeFromCart } = useCart();
  const { formatPrice } = useCurrency();
  const { customerUser, requireAuth } = useAuth();

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

  const handleGoToCartPage = () => {
    onClose();
    if (onNavigate) {
      onNavigate('cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Manrope']">
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
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Shopping Bag</h2>
                <span className="text-xs text-white/50">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
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

            {/* Items List */}
            <div className="py-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-360px)]">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-white/50 space-y-3">
                  <p className="text-sm">Your shopping bag is empty.</p>
                  <button
                    type="button"
                    onClick={handleGoToCartPage}
                    className="text-xs text-[#ED2024] hover:underline font-semibold"
                  >
                    Explore all products &rarr;
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex items-start gap-3">
                    {item.image && (
                      <div className="w-14 h-14 rounded-lg bg-black/40 border border-white/10 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = '/assets/products/luma-nova.png';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-white uppercase truncate">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-rose-400 text-xs cursor-pointer p-0.5"
                          title="Remove item"
                        >
                          &times;
                        </button>
                      </div>
                      {item.variant && (
                        <p className="text-[11px] text-white/50 mt-0.5 truncate">
                          {item.variant}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/5">
                        <span className="text-white/60">Qty: {item.quantity}</span>
                        <span className="font-bold text-white">
                          {formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-5 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[15px] font-semibold text-white">
              <span>Subtotal</span>
              <span className="text-[#ED2024] font-bold">{formatPrice(cartSubtotal)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-white/80 bg-[#EC2024]/10 border border-[#EC2024]/20 p-2.5 rounded-lg">
              <img
                src="/assets/truck.png"
                alt="Free Delivery"
                className="w-4 h-auto shrink-0"
              />
              <span>Free Global Express Delivery Included</span>
            </div>

            {/* View Full Bag Page Button */}
            <button
              type="button"
              onClick={handleGoToCartPage}
              className="w-full text-center py-2.5 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer hover:bg-white/5"
            >
              View Full Bag Page &rarr;
            </button>

            {/* Checkout CTA */}
            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => {
                requireAuth(() => {
                  if (onOpenCheckout && cartItems.length > 0) {
                    onClose();
                    onOpenCheckout(cartItems);
                  }
                }, 'Please sign in or create an account to proceed to checkout.');
              }}
              className="w-full text-center py-3.5 bg-[#ED2024] hover:bg-[#d4191d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wider uppercase rounded-lg transition-all shadow-lg shadow-[#ED2024]/25 cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
