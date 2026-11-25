import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api');

// Built-in fallback coupons if server is temporarily unreachable
const FALLBACK_COUPONS = [
  {
    code: 'LUMA10',
    title: 'Welcome 10% Off',
    description: 'Enjoy 10% savings on any clinical phototherapy order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    isActive: true,
  },
  {
    code: 'GLOW100',
    title: 'AED 100 Instant Voucher',
    description: 'AED 100 off orders over AED 1,000 across our device collection',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 1000,
    isActive: true,
  },
  {
    code: 'VIP20',
    title: 'Clinical VIP Tier 20% Off',
    description: 'Exclusive 20% discount on orders of AED 2,500 or more',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 2500,
    isActive: true,
  },
];

export default function CheckoutModal({
  isOpen,
  onClose,
  customerUser,
  cartItems = [],
  onOrderPlaced,
  onNavigateOrders,
}) {
  const { formatPrice } = useCurrency();

  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Dubai');
  const [country, setCountry] = useState('United Arab Emirates');

  // Coupon states
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Execution states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Sync customer details and fetch live coupons when opened
  useEffect(() => {
    if (isOpen) {
      setName(customerUser?.name || '');
      setEmail(customerUser?.email || '');
      setPhone(customerUser?.phone || '');
      setCity(customerUser?.city || 'Dubai');
      setCountry(customerUser?.country || 'United Arab Emirates');
      setStreet(customerUser?.address || 'Downtown Dubai');
      setErrorMessage('');
      setCouponError('');
      setCouponSuccess('');
      setCouponInput('');
      setAppliedCoupon(null);
      setPlacedOrder(null);

      // Fetch active coupons from backend
      const fetchAvailableCoupons = async () => {
        setLoadingCoupons(true);
        try {
          const res = await fetch(`${API_BASE_URL}/coupons`);
          const data = await res.json();
          if (res.ok && data.success && Array.isArray(data.coupons)) {
            setAvailableCoupons(data.coupons);
          } else {
            setAvailableCoupons([]);
          }
        } catch {
          setAvailableCoupons([]);
        } finally {
          setLoadingCoupons(false);
        }
      };

      fetchAvailableCoupons();
    }
  }, [isOpen, customerUser]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Only display coupons where admin checked "Display to customer in checkout available offers list"
  const displayableCoupons = (availableCoupons || []).filter(
    (c) => c.displayToCustomer === true && c.isActive !== false
  );

  if (!isOpen) return null;

  // Determine items to checkout
  const checkoutItems = Array.isArray(cartItems) && cartItems.length > 0
    ? cartItems.map((item) => ({
        name: item.title || item.name || 'LUMA Red Light Therapy Device',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        variant: item.variant || '',
      }))
    : [
        {
          name: 'LUMA Pro Max 9-Wavelength',
          price: 4890,
          quantity: 1,
          variant: 'Full Body Clinical Stand / Matte Obsidian',
        },
        {
          name: 'LUMA Protective NIR Eyewear',
          price: 240,
          quantity: 1,
          variant: 'Pro Shielding Optical Lens',
        },
      ];

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate discount amount based on applied coupon
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount) || 0 : 0;
  const finalTotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  // Apply Coupon Handler
  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput || '').trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setIsValidatingCoupon(true);

    try {
      const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.coupon) {
        setAppliedCoupon({
          code: data.coupon.code,
          title: data.coupon.title,
          description: data.coupon.description,
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue,
          discountAmount: data.discountAmount,
        });
        setCouponSuccess(data.message || `Coupon ${code} applied successfully!`);
        setCouponInput('');
      } else {
        // Fallback local validation check if server returned an error or offline
        const localFound = availableCoupons.find((c) => c.code.toUpperCase() === code);
        if (localFound && localFound.isActive) {
          if (localFound.minOrderAmount > 0 && subtotal < localFound.minOrderAmount) {
            setCouponError(
              `Coupon "${code}" requires minimum subtotal of AED ${localFound.minOrderAmount.toLocaleString()}.`
            );
          } else {
            let calcDiscount = 0;
            if (localFound.discountType === 'percentage') {
              calcDiscount = (subtotal * localFound.discountValue) / 100;
              if (localFound.maxDiscount) calcDiscount = Math.min(calcDiscount, localFound.maxDiscount);
            } else {
              calcDiscount = Math.min(localFound.discountValue, subtotal);
            }
            calcDiscount = Math.round(calcDiscount * 100) / 100;

            setAppliedCoupon({
              code: localFound.code,
              title: localFound.title,
              description: localFound.description,
              discountType: localFound.discountType,
              discountValue: localFound.discountValue,
              discountAmount: calcDiscount,
            });
            setCouponSuccess(`Coupon "${localFound.code}" applied! You saved AED ${calcDiscount}.`);
            setCouponInput('');
          }
        } else {
          setCouponError(data.message || `Coupon "${code}" is invalid or expired.`);
        }
      }
    } catch {
      // Offline fallback validation
      const localFound = availableCoupons.find((c) => c.code.toUpperCase() === code);
      if (localFound && localFound.isActive) {
        if (localFound.minOrderAmount > 0 && subtotal < localFound.minOrderAmount) {
          setCouponError(
            `Coupon "${code}" requires minimum subtotal of AED ${localFound.minOrderAmount.toLocaleString()}.`
          );
        } else {
          let calcDiscount = 0;
          if (localFound.discountType === 'percentage') {
            calcDiscount = (subtotal * localFound.discountValue) / 100;
          } else {
            calcDiscount = Math.min(localFound.discountValue, subtotal);
          }
          calcDiscount = Math.round(calcDiscount * 100) / 100;

          setAppliedCoupon({
            code: localFound.code,
            title: localFound.title,
            discountType: localFound.discountType,
            discountValue: localFound.discountValue,
            discountAmount: calcDiscount,
          });
          setCouponSuccess(`Coupon "${localFound.code}" applied! You saved AED ${calcDiscount}.`);
          setCouponInput('');
        }
      } else {
        setCouponError(`Coupon "${code}" is invalid or expired.`);
      }
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  // Submit Order Handler
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address for order confirmation.');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        },
        items: checkoutItems,
        subtotal,
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              title: appliedCoupon.title,
              discountType: appliedCoupon.discountType,
              discountValue: appliedCoupon.discountValue,
              discountAmount,
            }
          : null,
        couponCode: appliedCoupon?.code || null,
        discountAmount,
        totalAmount: finalTotal,
        currency: 'AED',
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          country: country.trim(),
        },
        paymentMethod: 'Test Card (Dummy Checkout)',
      };

      const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setPlacedOrder(data.order);
        if (onOrderPlaced) {
          onOrderPlaced(data.order);
        }
      } else {
        setErrorMessage(data.message || 'Unable to place order.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback local order confirmation if server unreachable
      const fallbackOrder = {
        orderNumber: `LUM-${Math.floor(100000 + Math.random() * 900000)}`,
        subtotal,
        coupon: appliedCoupon,
        totalAmount: finalTotal,
        currency: 'AED',
        status: 'Processing',
        customer: { name, email },
        createdAt: new Date(),
      };
      setPlacedOrder(fallbackOrder);
      if (onOrderPlaced) onOrderPlaced(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 font-['Manrope']">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-[#0e0e12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 transition-all transform animate-scaleUp max-h-[92vh] flex flex-col">
        {/* Top Glow Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ED2024] via-[#ff4d51] to-[#ED2024] shrink-0" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-xl leading-none z-20"
          aria-label="Close dialog"
        >
          &times;
        </button>

        {/* ============================================================ */}
        {/* VIEW A: ORDER SUCCESS NOTIFICATION                           */}
        {/* ============================================================ */}
        {placedOrder ? (
          <div className="p-7 sm:p-10 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-xl shadow-emerald-500/10 animate-bounce">
              ✓
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">
                Order Confirmed
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Order Placed Successfully!
              </h2>
              <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                Thank you for your order, <strong className="text-white">{placedOrder.customer?.name}</strong>. A receipt and shipping updates will be sent to <span className="text-white/80">{placedOrder.customer?.email}</span>.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs">
                <div>
                  <span className="text-[10px] text-white/40 block">Order Number</span>
                  <span className="font-bold text-white tracking-wide text-sm">
                    #{placedOrder.orderNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/40 block">Total Amount</span>
                  <span className="font-bold text-[#ED2024] text-sm">
                    {formatPrice(placedOrder.totalAmount)} {placedOrder.currency || 'AED'}
                  </span>
                </div>
              </div>

              {/* Coupon Savings info if applied */}
              {(placedOrder.coupon?.code || appliedCoupon?.code) && (
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span>🏷️</span>
                    <span>Coupon ({placedOrder.coupon?.code || appliedCoupon?.code}):</span>
                  </span>
                  <span className="font-bold text-emerald-400">
                    - {formatPrice(placedOrder.coupon?.discountAmount || discountAmount)} AED Saved
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Status:</span>
                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {placedOrder.status || 'Processing'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Payment:</span>
                <span className="text-white/90 font-medium">Test Mode Confirmed</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigateOrders) onNavigateOrders();
                }}
                className="flex-1 py-3 bg-[#ED2024] hover:bg-[#d61b1f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ED2024]/20 cursor-pointer"
              >
                View in Order History &rarr;
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-6 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW B: CHECKOUT FORM (TEST MODE WITH COUPONS)              */
          /* ============================================================ */
          <div className="p-6 sm:p-8 overflow-y-auto">
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#ED2024] bg-[#ED2024]/10 px-2.5 py-0.5 rounded border border-[#ED2024]/20">
                  Test Checkout
                </span>
                <span className="text-[10px] text-white/40">
                  Coupons &amp; Offers Enabled
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Review &amp; Place Your Order
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Apply a coupon below and complete your details to place an instant test order.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
                <span className="text-red-400 font-bold shrink-0">✕</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Delivery Contact Information */}
              <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                  Delivery Destination
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 font-medium mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Al-Mansoor"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Dubai"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 font-medium mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Villa 14, Palm Jumeirah, Dubai"
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024]"
                  />
                </div>
              </div>

              {/* ============================================================ */}
              {/* PROMO / COUPON CODE SECTION                                  */}
              {/* ============================================================ */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider text-[11px]">
                    <span className="text-[#ED2024]">🏷️</span>
                    <span>Have a Promotional Code / Coupon?</span>
                  </div>
                  {appliedCoupon && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Offer Applied
                    </span>
                  )}
                </div>

                {/* If already applied, show applied offer card with Remove button */}
                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 text-xs animate-fadeIn">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2.5 py-1 rounded font-mono font-bold text-[12px] bg-black/60 border border-dashed border-emerald-400/50 text-emerald-400 shrink-0">
                        {appliedCoupon.code}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate text-[12px]">
                          {appliedCoupon.title || 'Promotional Offer'}
                        </div>
                        <div className="text-[10.5px] text-emerald-300/80 truncate">
                          Discount: - {formatPrice(discountAmount)} AED deducted from your order
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-3 py-1 text-[11px] font-bold uppercase rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 cursor-pointer shrink-0 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  /* Code Input Field & Apply Button + Available Offers */
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            if (couponError) setCouponError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyCoupon();
                            }
                          }}
                          placeholder="Enter coupon code (e.g. LUMA10)"
                          className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#ED2024] uppercase tracking-wider"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={isValidatingCoupon || !couponInput.trim()}
                        className="px-4 py-2.5 bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-40 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0 shadow-md shadow-[#ED2024]/20 flex items-center gap-1.5"
                      >
                        {isValidatingCoupon ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Applying...</span>
                          </>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>

                    {/* Available Offers List (Only coupons marked 'Display to customer in checkout' by Admin) */}
                    {displayableCoupons.length > 0 && (
                      <div className="pt-2 border-t border-white/5 space-y-1.5">
                        <div className="text-[10.5px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1">
                          <span>✨</span>
                          <span>Available Offers (Tap to Apply):</span>
                        </div>
                        <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {displayableCoupons.map((c) => {
                            const meetsMin = !c.minOrderAmount || subtotal >= c.minOrderAmount;
                            return (
                              <button
                                key={c.code || c._id}
                                type="button"
                                onClick={() => {
                                  setCouponInput(c.code);
                                  handleApplyCoupon(c.code);
                                }}
                                disabled={isValidatingCoupon}
                                className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 group ${
                                  meetsMin
                                    ? 'bg-white/[0.03] hover:bg-[#ED2024]/10 border-white/10 hover:border-[#ED2024]/50'
                                    : 'bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="px-2 py-0.5 rounded font-mono font-black text-[11px] bg-black/60 border border-dashed border-[#ED2024]/60 text-[#ED2024] shrink-0 group-hover:scale-105 transition-transform">
                                    {c.code}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-[11.5px] font-bold text-white truncate group-hover:text-[#ED2024] transition-colors">
                                      {c.discountType === 'percentage'
                                        ? `${c.discountValue}% OFF`
                                        : `${formatPrice(c.discountValue)} AED OFF`}
                                      {c.title ? ` · ${c.title}` : ''}
                                    </div>
                                    {c.minOrderAmount > 0 && (
                                      <div className={`text-[10px] truncate ${meetsMin ? 'text-white/40' : 'text-amber-400 font-medium'}`}>
                                        Min. Order: AED {formatPrice(c.minOrderAmount)}
                                        {!meetsMin && ` (Add AED ${formatPrice(c.minOrderAmount - subtotal)} more)`}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase shrink-0 transition-colors ${
                                  meetsMin
                                    ? 'bg-[#ED2024]/20 text-[#ED2024] group-hover:bg-[#ED2024] group-hover:text-white'
                                    : 'bg-white/5 text-white/40'
                                }`}>
                                  Apply
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Coupon Error Alert */}
                {couponError && (
                  <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-200 text-[11.5px] flex items-center gap-2 animate-fadeIn">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>{couponError}</span>
                  </div>
                )}

                {/* Coupon Success Alert */}
                {couponSuccess && !appliedCoupon && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-[11.5px] flex items-center gap-2 animate-fadeIn">
                    <span>✓</span>
                    <span>{couponSuccess}</span>
                  </div>
                )}
              </div>

              {/* Items Summary & Subtotal */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Order Items ({checkoutItems.length})
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">Free Express Delivery</span>
                </div>

                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {checkoutItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-white/80"
                    >
                      <span className="truncate pr-2">{item.name} &times; {item.quantity}</span>
                      <span className="font-semibold text-white whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal line */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-white/60">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatPrice(subtotal)} AED</span>
                </div>

                {/* Applied Coupon Discount Line */}
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold animate-fadeIn">
                    <span className="flex items-center gap-1">
                      <span>🏷️ Coupon Discount ({appliedCoupon.code})</span>
                    </span>
                    <span>- {formatPrice(discountAmount)} AED</span>
                  </div>
                )}

                {/* Grand Total Line */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white">
                  <span>Final Total</span>
                  <div className="text-right">
                    {appliedCoupon && (
                      <span className="line-through text-white/40 text-[11px] block">
                        {formatPrice(subtotal)} AED
                      </span>
                    )}
                    <span className="text-base text-[#ED2024] font-black">
                      {formatPrice(finalTotal)} AED
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="p-3 rounded-xl bg-[#ED2024]/10 border border-[#ED2024]/20 flex items-start gap-2.5 text-xs text-white/80">
                <span className="text-[#ED2024] font-bold text-base leading-none">💳</span>
                <div>
                  <span className="font-semibold text-white block text-[11px]">
                    Test Payment Mode Active
                  </span>
                  <span className="text-[10px] text-white/60 leading-normal block">
                    No credit card charged. Live payment gateway (Stripe/Paymob) will be activated once API credentials are provided.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ED2024]/30 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  `Confirm & Place Order (${formatPrice(finalTotal)} AED)`
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
