import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import TrustGuarantees from '../components/TrustGuarantees';

export default function CartPage({ onNavigate, onOpenCheckout }) {
  const { cartItems, cartCount, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { customerUser, requireAuth, openAuthModal } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);
  const [promoError, setPromoError] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoMessage(null);
    setPromoError(null);

    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'LUMA10' || clean === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoMessage('10% VIP Clinical discount applied successfully!');
    } else if (clean === 'LUMA15') {
      setDiscountPercent(15);
      setPromoMessage('15% LUMA Member discount applied successfully!');
    } else {
      setPromoError('Invalid promotion code. Try "LUMA10"');
    }
  };

  const discountAmount = discountPercent > 0 ? (cartSubtotal * discountPercent) / 100 : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <div
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full min-h-screen bg-[#FFFFFF] text-[#000000] font-['Manrope'] overflow-x-clip flex flex-col justify-between"
    >
      <div>
        {/* Fixed Navbar clearance spacer (matches brand dark header) */}
        <div className="w-full h-[64px] lg:h-[calc(191*var(--u))] bg-[#0a0a0a]" aria-hidden="true" />

        {/* ==================== BREADCRUMB & PAGE HEADER ==================== */}
        <div className="w-full border-b border-gray-200 bg-[#FAFAFA] py-8 sm:py-10 2xl:py-[calc(80*var(--u))]">
          <div className="max-w-[1440px] 2xl:max-w-none mx-auto px-5 sm:px-8 md:px-12 xl:px-16 2xl:px-[calc(520*var(--u))]">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] sm:text-[12px] 2xl:text-[calc(22*var(--u))] uppercase tracking-[0.1em] text-gray-500 mb-3.5">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('home')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-black font-bold">Shopping Bag</span>
            </nav>

            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[12px] sm:text-[13px] 2xl:text-[calc(26*var(--u))] font-bold uppercase tracking-[0.15em] text-[#ED2024] block mb-1">
                  LUMA CLINICAL WELLNESS
                </span>
                <h1 className="text-[26px] sm:text-[34px] md:text-[40px] 2xl:text-[calc(70*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#000000] leading-tight flex items-center gap-3">
                  Your Shopping Bag
                  <span className="text-[14px] sm:text-[16px] 2xl:text-[calc(28*var(--u))] font-bold px-3 py-1 rounded-full bg-[#ED2024]/10 text-[#ED2024] border border-[#ED2024]/20">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </span>
                </h1>
              </div>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11.5px] sm:text-[12px] 2xl:text-[calc(24*var(--u))] font-semibold text-gray-500 hover:text-rose-600 transition-colors self-start sm:self-auto cursor-pointer underline underline-offset-4"
                >
                  Clear Bag
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ==================== MAIN CART BODY ==================== */}
        <div className="max-w-[1440px] 2xl:max-w-none mx-auto px-5 sm:px-8 md:px-12 xl:px-16 2xl:px-[calc(520*var(--u))] py-10 sm:py-12 md:py-14 2xl:py-[calc(100*var(--u))]">
          {cartItems.length === 0 ? (
            /* EMPTY CART STATE */
            <div className="w-full py-16 sm:py-20 md:py-24 text-center flex flex-col items-center justify-center max-w-lg mx-auto space-y-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 2xl:w-[calc(180*var(--u))] 2xl:h-[calc(180*var(--u))] rounded-full bg-gray-100 flex items-center justify-center text-3xl sm:text-4xl shadow-inner text-gray-400">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                </svg>
              </div>

              <div>
                <h2 className="text-[20px] sm:text-[24px] 2xl:text-[calc(44*var(--u))] font-extrabold uppercase tracking-tight text-gray-900">
                  Your Shopping Bag is Currently Empty
                </h2>
                <p className="mt-2 text-[13px] sm:text-[14px] 2xl:text-[calc(26*var(--u))] text-gray-500 leading-relaxed max-w-md mx-auto">
                  Experience medical-grade photobiomodulation for faster physical recovery, anti-aging collagen renewal, and deep cellular energy.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('products')}
                  className="px-8 py-3.5 rounded-[8px] 2xl:rounded-[calc(14*var(--u))] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[12.5px] sm:text-[13px] 2xl:text-[calc(28*var(--u))] font-bold uppercase tracking-[0.08em] shadow-lg shadow-[#ED2024]/20 transition-all cursor-pointer"
                >
                  Discover Our Products
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE CART GRID: 2 COLUMNS (ITEMS LIST + STICKY ORDER SUMMARY) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
              
              {/* LEFT COLUMN: ITEM LIST (col-span-7 or 8) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                
                {/* Items Container */}
                <div className="border border-gray-200 rounded-[18px] bg-white shadow-xs overflow-hidden divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                    return (
                      <div
                        key={item.id}
                        className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Image & Title Group */}
                        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                          <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] 2xl:w-[calc(180*var(--u))] 2xl:h-[calc(180*var(--u))] rounded-[12px] bg-[#F5F5F5] border border-gray-200 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image || '/assets/products/list-product-1.jpg'}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.src = '/assets/products/luma-nova.png';
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            {item.slug ? (
                              <button
                                type="button"
                                onClick={() => onNavigate && onNavigate(item.slug)}
                                className="text-left text-[15px] sm:text-[16px] 2xl:text-[calc(32*var(--u))] font-bold text-gray-900 uppercase hover:text-[#ED2024] transition-colors leading-snug line-clamp-1 cursor-pointer block"
                              >
                                {item.name}
                              </button>
                            ) : (
                              <h3 className="text-[15px] sm:text-[16px] 2xl:text-[calc(32*var(--u))] font-bold text-gray-900 uppercase leading-snug line-clamp-1">
                                {item.name}
                              </h3>
                            )}

                            {item.variant && (
                              <span className="inline-block mt-1 text-[11px] sm:text-[11.5px] 2xl:text-[calc(22*var(--u))] text-gray-500 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
                                {item.variant}
                              </span>
                            )}

                            <div className="mt-2 text-[13px] sm:text-[14px] 2xl:text-[calc(26*var(--u))] font-semibold text-[#ED2024]">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Stepper & Line Price */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Stepper */}
                          <div className="flex items-center border border-gray-300 rounded-[8px] bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, (Number(item.quantity) || 1) - 1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors font-bold cursor-pointer select-none text-[14px]"
                            >
                              −
                            </button>
                            <span className="w-10 text-center font-bold text-[13px] text-gray-900 select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, (Number(item.quantity) || 1) + 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors font-bold cursor-pointer select-none text-[14px]"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[90px]">
                            <span className="block text-[15px] sm:text-[16px] 2xl:text-[calc(30*var(--u))] font-extrabold text-gray-900">
                              {formatPrice(itemTotal)}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name} from bag`}
                            className="p-1.5 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code & Continue Shopping Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('products')}
                    className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-bold text-gray-800 hover:text-[#ED2024] transition-colors uppercase tracking-[0.05em] cursor-pointer"
                  >
                    <span>&larr;</span>
                    <span>Continue Shopping</span>
                  </button>

                  {/* Promo Voucher Form */}
                  <form onSubmit={handleApplyPromo} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo Code (e.g. LUMA10)"
                      className="bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[12px] text-gray-900 font-mono uppercase tracking-wider outline-none shadow-xs w-52 sm:w-60"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-[11.5px] font-bold uppercase tracking-wider rounded-[8px] transition-colors cursor-pointer shadow-xs shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                </div>

                {/* Promo messages */}
                {promoMessage && (
                  <div className="p-3 rounded-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-medium flex items-center gap-2">
                    <span>✓</span>
                    <span>{promoMessage}</span>
                  </div>
                )}
                {promoError && (
                  <div className="p-3 rounded-[10px] bg-rose-50 border border-rose-200 text-rose-700 text-[12px] font-medium flex items-center gap-2">
                    <span>✕</span>
                    <span>{promoError}</span>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: STICKY ORDER SUMMARY (col-span-5 or 4) */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
                <div className="border border-gray-200 rounded-[20px] bg-[#FBFBFB] p-6 sm:p-7 shadow-sm space-y-6">
                  <h2 className="text-[17px] sm:text-[18px] 2xl:text-[calc(34*var(--u))] font-extrabold uppercase tracking-[0.02em] text-gray-900 pb-3 border-b border-gray-200">
                    Order Summary
                  </h2>

                  {/* Price Calculations */}
                  <div className="space-y-3.5 text-[13px] sm:text-[13.5px] 2xl:text-[calc(26*var(--u))]">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Bag Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                      <span className="font-bold text-gray-900">{formatPrice(cartSubtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Global Express Delivery</span>
                      <span className="font-bold text-emerald-600 uppercase text-[12px]">
                        FREE
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Customs Duties &amp; Taxes</span>
                      <span className="text-[11.5px] text-gray-500">
                        Calculated at checkout
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-[8px] border border-emerald-100">
                        <span>VIP Discount ({discountPercent}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 flex items-baseline justify-between">
                      <div>
                        <span className="text-[15px] sm:text-[16px] font-extrabold text-gray-900 uppercase block">
                          Estimated Total
                        </span>
                        <span className="text-[10.5px] text-gray-400">
                          Including worldwide clinical warranty
                        </span>
                      </div>
                      <span className="text-[20px] sm:text-[22px] 2xl:text-[calc(42*var(--u))] font-black text-[#ED2024]">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Free Delivery Banner */}
                  <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-red-50 border border-red-100 text-[#ED2024] text-[11.5px] font-semibold">
                    <img
                      src="/assets/glow/icon-delivery.png"
                      alt=""
                      className="w-4 h-4 object-contain shrink-0"
                    />
                    <span>Free Global Express Delivery Included</span>
                  </div>

                  {/* Guest Sign In Prompt Banner */}
                  {!customerUser && (
                    <div className="p-3.5 rounded-[10px] bg-red-50 border border-red-200 text-red-950 text-[11.5px] flex items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#ED2024] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                          🔒
                        </span>
                        <span className="font-semibold text-gray-900">Sign in required to checkout</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openAuthModal('Please sign in or create an account to proceed to checkout.')}
                        className="px-2.5 py-1 rounded bg-[#ED2024] text-white font-bold text-[11px] hover:bg-[#d4191d] transition-colors cursor-pointer shrink-0"
                      >
                        Sign In
                      </button>
                    </div>
                  )}

                  {/* Checkout CTA Button */}
                  <button
                    type="button"
                    onClick={() => {
                      requireAuth(() => {
                        if (onOpenCheckout) {
                          onOpenCheckout(cartItems);
                        }
                      }, 'Please sign in or create an account to proceed to checkout.');
                    }}
                    className="w-full py-4 rounded-[10px] 2xl:rounded-[calc(18*var(--u))] bg-[#ED2024] hover:bg-[#d4191d] active:scale-[0.99] text-white text-[13px] sm:text-[14px] 2xl:text-[calc(30*var(--u))] font-extrabold uppercase tracking-[0.08em] shadow-lg shadow-[#ED2024]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="text-base">&rarr;</span>
                  </button>

                  {/* Trust & Guarantee Perks */}
                  <div className="pt-4 border-t border-gray-200 space-y-2.5 text-[11.5px] text-gray-600">
                    <div className="flex items-center gap-2.5">
                      <span className="text-emerald-600 text-sm font-bold">✓</span>
                      <span>30-Day Risk-Free Money Back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-emerald-600 text-sm font-bold">✓</span>
                      <span>3-Year Official Clinical System Warranty</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-emerald-600 text-sm font-bold">✓</span>
                      <span>256-Bit SSL Encrypted Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* 4-Item Trust Strip at Bottom */}
      <TrustGuarantees />
    </div>
  );
}
