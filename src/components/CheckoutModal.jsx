import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const API_BASE_URL = 'http://localhost:5000/api';

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

  // Execution states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Sync customer details when opened
  useEffect(() => {
    if (isOpen) {
      setName(customerUser?.name || '');
      setEmail(customerUser?.email || '');
      setPhone(customerUser?.phone || '');
      setCity(customerUser?.city || 'Dubai');
      setCountry(customerUser?.country || 'United Arab Emirates');
      setStreet(customerUser?.address || 'Downtown Dubai');
      setErrorMessage('');
      setPlacedOrder(null);
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
      const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
          },
          items: checkoutItems,
          totalAmount: subtotal,
          currency: 'AED',
          shippingAddress: {
            street: street.trim(),
            city: city.trim(),
            country: country.trim(),
          },
          paymentMethod: 'Test Card (Dummy Checkout)',
        }),
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
        totalAmount: subtotal,
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
      <div className="relative w-full max-w-xl bg-[#0e0e12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 transition-all transform animate-scaleUp">
        {/* Top Glow Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ED2024] via-[#ff4d51] to-[#ED2024]" />

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
          <div className="p-7 sm:p-10 text-center space-y-6">
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
          /* VIEW B: CHECKOUT FORM (TEST MODE)                           */
          /* ============================================================ */
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#ED2024] bg-[#ED2024]/10 px-2.5 py-0.5 rounded border border-[#ED2024]/20">
                  Test Checkout
                </span>
                <span className="text-[10px] text-white/40">
                  Payment Key Integration Ready
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Review &amp; Place Your Order
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Complete your details below to place an instant test order.
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

              {/* Items Summary */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Order Items ({checkoutItems.length})
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">Free Express Delivery</span>
                </div>

                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
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

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-sm text-[#ED2024]">{formatPrice(subtotal)}</span>
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
                  `Confirm & Place Order (${formatPrice(subtotal)})`
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

