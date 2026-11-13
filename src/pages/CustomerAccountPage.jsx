import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function CustomerAccountPage({
  customerUser,
  onUpdateCustomer,
  onLogout,
  onNavigate,
  onOpenLoginModal,
  onOpenCheckout,
}) {
  const { formatPrice } = useCurrency();

  // Determine active tab based on hash or default to 'profile'
  const getInitialTab = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('cart') || hash.includes('bag')) return 'cart';
    if (hash.includes('order')) return 'orders';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Editable profile fields
  const [name, setName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [city, setCity] = useState(customerUser?.city || '');
  const [country, setCountry] = useState(customerUser?.country || 'United Arab Emirates');
  const [address, setAddress] = useState(customerUser?.address || '');

  // Live database data
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cancellation modal state (Rule 1: cancel before shipment with refund)
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind / No longer needed');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Return request modal state (Rule 2: return within 1 week with reason)
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('Device is defective / malfunctioning');
  const [returnComments, setReturnComments] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState('');

  // Product review modal state (delivered orders review submission)
  const [reviewModalOrder, setReviewModalOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewProductName, setReviewProductName] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Update active tab if window hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch real data on mount or user change
  useEffect(() => {
    if (customerUser?.email) {
      fetchCustomerRealData(customerUser.email);
    }
  }, [customerUser?.email]);

  // Re-fetch when switching to orders or cart tab so new orders appear immediately
  useEffect(() => {
    if (customerUser?.email && (activeTab === 'orders' || activeTab === 'cart')) {
      fetchCustomerRealData(customerUser.email);
    }
  }, [activeTab]);

  const fetchCustomerRealData = async (email) => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/customer/profile?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.success && data.customer) {
        const c = data.customer;
        setName(c.name || '');
        setPhone(c.phone || '');
        setCity(c.city || '');
        setCountry(c.country || 'United Arab Emirates');
        setAddress(c.address || '');
        setCartItems(Array.isArray(c.cart) ? c.cart : []);
        setOrders(Array.isArray(c.orders) ? c.orders : []);
        if (onUpdateCustomer && c.name !== customerUser?.name) {
          onUpdateCustomer(c);
        }
      }
    } catch (err) {
      console.error('Error fetching real customer records from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save profile updates to MongoDB Atlas
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!customerUser?.email) return;

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/customer/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerUser.email,
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          country: country.trim(),
          address: address.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.customer) {
        setSuccessMessage('Profile details successfully updated!');
        if (onUpdateCustomer) {
          onUpdateCustomer(data.customer);
        }
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setErrorMessage('Unable to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Remove cart item directly from MongoDB Atlas
  const handleRemoveCartItem = async (itemId) => {
    if (!customerUser?.email || !itemId) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/customer/cart/${itemId}?email=${encodeURIComponent(customerUser.email)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (res.ok && data.success && data.cart) {
        setCartItems(data.cart);
      }
    } catch (err) {
      console.error('Error removing item from database cart:', err);
    }
  };

  // Rule 1: Customer cancel order before shipment with automatic refund
  const openCancelModal = (order) => {
    setCancelModalOrder(order);
    setCancelReason('Changed my mind / No longer needed');
    setCancelError('');
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrder || !customerUser?.email) return;
    setCancelLoading(true);
    setCancelError('');
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${cancelModalOrder._id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerUser.email,
          reason: cancelReason,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to cancel order.');
      }
      setSuccessMessage(data.message || 'Order cancelled and refund processed.');
      setCancelModalOrder(null);
      await fetchCustomerRealData(customerUser.email);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  // Rule 2: Customer return product within 1 week with a reason
  const openReturnModal = (order) => {
    setReturnModalOrder(order);
    setReturnReason('Device is defective / malfunctioning');
    setReturnComments('');
    setReturnError('');
  };

  const handleReturnRequest = async () => {
    if (!returnModalOrder || !customerUser?.email) return;
    if (!returnReason.trim()) {
      setReturnError('Please select a reason for the return.');
      return;
    }
    setReturnLoading(true);
    setReturnError('');
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${returnModalOrder._id}/return-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerUser.email,
          reason: returnReason.trim(),
          comments: returnComments.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit return request.');
      }
      setSuccessMessage(data.message || 'Return request submitted successfully.');
      setReturnModalOrder(null);
      await fetchCustomerRealData(customerUser.email);
    } catch (err) {
      setReturnError(err.message);
    } finally {
      setReturnLoading(false);
    }
  };

  const openReviewModal = (order) => {
    setReviewModalOrder(order);
    setReviewRating(5);
    setReviewMessage('');
    setReviewProductName(order.items?.[0]?.name || 'LUMA Device');
    setReviewError('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewMessage.trim()) {
      setReviewError('Please write your review feedback or experience.');
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${reviewModalOrder._id || reviewModalOrder.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || customerUser.name || 'Member',
          stars: reviewRating,
          productName: reviewProductName,
          message: reviewMessage.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit review.');
      }
      setSuccessMessage(data.message || 'Review submitted successfully! Thank you for sharing your experience.');
      setReviewModalOrder(null);
      await fetchCustomerRealData(customerUser.email);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    setSuccessMessage('');
    setErrorMessage('');
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  // If user is not logged in, show access prompt
  if (!customerUser) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FBFBFB] text-[#0A0A0B] flex items-center justify-center px-4 py-20 font-['Manrope']">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-gray-200 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-[#ED2024]/10 border border-[#ED2024]/30 text-[#ED2024] flex items-center justify-center mx-auto text-2xl font-bold">
            ✦
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Customer Account Required</h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Please sign in with your LUMA account to access your profile settings, shopping bag, and live order status.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="w-full py-3 bg-[#ED2024] hover:bg-[#d61b1f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#ED2024]/20 cursor-pointer"
          >
            Sign In / Register
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="text-xs text-gray-400 hover:text-gray-900 transition-colors block mx-auto cursor-pointer"
          >
            &larr; Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FBFBFB] text-[#0A0A0B] font-['Manrope'] pb-24">
      {/* Top Breadcrumb & Page Banner */}
      <section className="relative w-full pt-32 sm:pt-40 pb-12 border-b border-gray-200 bg-[#FAFAFA] overflow-hidden">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-[#ED2024]/5 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <nav className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest mb-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('home');
              }}
              className="hover:text-black transition-colors"
            >
              Home
            </a>
            <span>/</span>
            <span className="text-[#ED2024] font-semibold">Customer Account</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#ED2024] bg-[#ED2024]/10 px-3 py-1 rounded-full border border-[#ED2024]/20 inline-block mb-3">
                LUMA Member Portal
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Welcome back, {name || customerUser.name || 'Member'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                Manage your personal profile, review items saved in your shopping bag, and track live order status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ED2024] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-[#ED2024]/20">
                  {(name || customerUser.name || customerUser.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">{name || customerUser.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Member" />
                  </div>
                  <span className="text-[11px] text-gray-500">{customerUser.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-3 rounded-xl border border-red-200 bg-white text-red-600 hover:text-white hover:bg-[#ED2024] text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white border border-gray-200/90 rounded-2xl p-3 space-y-1.5 sticky top-28 shadow-sm">
              <button
                type="button"
                onClick={() => handleTabSwitch('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'profile'
                    ? 'bg-[#ED2024] text-white shadow-md shadow-[#ED2024]/20'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">👤</span>
                  <span>Update Profile</span>
                </div>
                <span className="text-[11px] opacity-75">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('cart')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'cart'
                    ? 'bg-[#ED2024] text-white shadow-md shadow-[#ED2024]/20'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🛒</span>
                  <span>Add to Cart Products</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'cart'
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {cartItems.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('orders')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'orders'
                    ? 'bg-[#ED2024] text-white shadow-md shadow-[#ED2024]/20'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📦</span>
                  <span>Ordered Products &amp; Status</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'orders'
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {orders.length}
                </span>
              </button>

              <div className="h-[1px] bg-gray-200 my-2" />

              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer flex items-center gap-2.5"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Main Panel */}
          <div className="lg:col-span-3">
            {/* Feedback Notifications */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-3 animate-fadeIn">
                <span className="text-emerald-600 font-bold text-sm shrink-0">✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-3 animate-fadeIn">
                <span className="text-red-600 font-bold text-sm shrink-0">✕</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {loading ? (
              <div className="p-16 rounded-2xl bg-white border border-gray-200 shadow-sm text-center space-y-3">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-[#ED2024] rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-500">Loading your account information...</p>
              </div>
            ) : (
              <>
                {/* ========================================================= */}
                {/* TAB 1: UPDATE PROFILE DETAILS                             */}
                {/* ========================================================= */}
                {activeTab === 'profile' && (
                  <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Profile &amp; Delivery Information</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Update your name, contact phone, and shipping destination.
                        </p>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Verified Account
                      </span>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-semibold mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 text-xs bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ED2024] shadow-2xs transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-semibold mb-1.5">
                            Email Address (Account ID)
                          </label>
                          <input
                            type="email"
                            disabled
                            value={customerUser.email}
                            className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-semibold mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+971 50 123 4567"
                            className="w-full px-4 py-3 text-xs bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ED2024] shadow-2xs transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-semibold mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Dubai"
                            className="w-full px-4 py-3 text-xs bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ED2024] shadow-2xs transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-semibold mb-1.5">
                            Country
                          </label>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="United Arab Emirates"
                            className="w-full px-4 py-3 text-xs bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ED2024] shadow-2xs transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-semibold mb-1.5">
                          Delivery Street Address
                        </label>
                        <textarea
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. Villa 14, Palm Jumeirah, Street 3, Dubai"
                          className="w-full px-4 py-3 text-xs bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ED2024] shadow-2xs transition-colors resize-none leading-relaxed"
                        />
                      </div>

                      <div className="pt-3 flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-8 py-3.5 bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#ED2024]/20 cursor-pointer flex items-center gap-2"
                        >
                          {saving ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Saving Changes...</span>
                            </>
                          ) : (
                            'Save Profile Changes'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: ADD TO CART PRODUCTS                               */}
                {/* ========================================================= */}
                {activeTab === 'cart' && (
                  <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Your Shopping Bag ({cartItems.length})</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Products saved in your customer shopping bag.
                        </p>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                        Active Cart
                      </span>
                    </div>

                    {cartItems.length > 0 ? (
                      <>
                        <div className="space-y-4">
                        {cartItems.map((item, idx) => (
                          <div
                            key={item._id || idx}
                            className="p-4 rounded-xl bg-gray-50/80 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-16 h-16 object-contain rounded-xl bg-white p-1.5 border border-gray-200 shrink-0"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-lg shrink-0">
                                  ✦
                                </div>
                              )}
                              <div>
                                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                                {item.variant && (
                                  <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                                )}
                                <p className="text-xs text-[#ED2024] font-semibold mt-1">
                                  {formatPrice(item.price)} &times; {item.quantity || 1}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-5">
                              <span className="text-sm font-bold text-gray-900">
                                {formatPrice((item.price || 0) * (item.quantity || 1))}
                              </span>
                              {item._id && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCartItem(item._id)}
                                  className="text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer text-sm"
                                  title="Remove item"
                                >
                                  &times; Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <span className="text-xs text-gray-500 block">Bag Subtotal</span>
                            <span className="text-xl font-bold text-gray-900">{formatPrice(cartSubtotal)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (onOpenCheckout) {
                                  onOpenCheckout(cartItems);
                                } else {
                                  const cartBtn = document.querySelector('button[aria-label*="Shopping Cart"]');
                                  if (cartBtn) cartBtn.click();
                                }
                              }}
                              className="px-6 py-3.5 bg-[#ED2024] hover:bg-[#d61b1f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#ED2024]/20 cursor-pointer"
                            >
                              Proceed to Checkout
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-16 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300 px-4 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-gray-400 text-xl">
                          🛒
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Your Shopping Bag is Empty</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                          No items currently in your cart. Add products to save them directly to your account.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('products')}
                          className="mt-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                          Explore Clinical Products
                        </button>
                      </div>
                    )}
                  </div>
                )}


                {/* ========================================================= */}
                {/* TAB 3: ORDERED PRODUCTS & REAL STATUS                     */}
                {/* ========================================================= */}
                {activeTab === 'orders' && (
                  <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Order History &amp; Tracking ({orders.length})</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          View your placed orders and delivery status.
                        </p>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Live Tracking
                      </span>
                    </div>

                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const isReturned =
                            order.status === 'Returned' || order.returnStatus === 'Approved';
                          const displayStatus = isReturned
                            ? 'Returned & Refunded'
                            : order.status || 'Processing';

                          const statusColors = {
                            Pending: 'bg-amber-50 text-amber-700 border-amber-200',
                            Processing: 'bg-blue-50 text-blue-700 border-blue-200',
                            Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
                            Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            Returned: 'bg-purple-100 text-purple-800 border-purple-300',
                            Cancelled: 'bg-red-50 text-red-600 border-red-200',
                          };
                          const badgeClass = isReturned
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : statusColors[order.status] || 'bg-gray-100 text-gray-700 border-gray-200';

                          return (
                            <div
                              key={order._id || order.orderNumber}
                              className="p-5 rounded-xl bg-gray-50/80 border border-gray-200 space-y-4 shadow-2xs"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/70">
                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                                    Order Number
                                  </span>
                                  <span className="text-sm font-bold text-gray-900">
                                    #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                  </span>
                                  <span className="text-[11px] text-gray-500 block mt-0.5">
                                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                  </span>
                                </div>

                                <div className="sm:text-right">
                                  <span
                                    className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded border ${badgeClass}`}
                                  >
                                    Status: {displayStatus}
                                  </span>
                                  <span className="text-sm font-bold text-gray-900 block mt-1.5">
                                    Total: {formatPrice(order.totalAmount)} {order.currency || 'AED'}
                                  </span>
                                </div>
                              </div>

                              {/* Automated Payment Gateway Refund Banner */}
                              {(order.paymentStatus === 'Refunded' || order.status === 'Cancelled') && (
                                <div className="p-3.5 rounded-xl bg-purple-50/90 border border-purple-200 text-xs space-y-1.5">
                                  <div className="flex items-center justify-between text-purple-700 font-bold">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                                      Automated Refund Initiated
                                    </span>
                                    <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-purple-100 border border-purple-200 text-purple-800 font-semibold">
                                      {order.refundId || 'REFUND PROCESSED'}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-[11.5px] leading-relaxed">
                                    A full refund of <strong className="text-gray-900">{formatPrice(order.refundAmount || order.totalAmount)} {order.currency || 'AED'}</strong> was automatically requested through the payment gateway back to your original payment method.
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-gray-500">
                                    <span>
                                      ⏱ Reversal Timeline: <strong className="text-emerald-700 font-semibold">{order.refundTimeline || '3 to 7 business days'}</strong>
                                    </span>
                                    {order.refundReason && (
                                      <span>
                                        • Reason: <em className="text-gray-700 not-italic font-medium">{order.refundReason}</em>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Purchased Products List */}
                              {Array.isArray(order.items) && order.items.length > 0 && (
                                <div className="p-3.5 rounded-xl bg-white border border-gray-200 space-y-2 shadow-2xs">
                                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">
                                    Purchased Products
                                  </span>
                                  {order.items.map((item, iIdx) => (
                                    <div
                                      key={iIdx}
                                      className="flex items-center justify-between text-xs text-gray-800"
                                    >
                                      <span className="font-medium truncate pr-4 text-gray-800">
                                        {item.name} &times; {item.quantity || 1}
                                      </span>
                                      <span className="font-bold text-gray-900 shrink-0">
                                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Shipping Destination */}
                              {order.shippingAddress && (
                                <div className="text-xs text-gray-600">
                                  <span className="text-gray-500 font-semibold">Shipping Address: </span>
                                  <span className="text-gray-700">
                                    {order.shippingAddress.street || ''} {order.shippingAddress.city || ''},{' '}
                                    {order.shippingAddress.country || 'UAE'}
                                  </span>
                                </div>
                              )}

                              {/* ================================================================= */}
                              {/* RULE 1: CANCELLATION BEFORE SHIPPED WITH AUTOMATIC REFUND          */}
                              {/* ================================================================= */}
                              {(order.status === 'Confirmed' || order.status === 'Pending' || order.status === 'Processing') && (
                                <div className="pt-3 border-t border-gray-200/70 flex flex-wrap items-center justify-between gap-3">
                                  <span className="text-[11.5px] text-gray-500">
                                    ● Order in preparation. Eligible for immediate cancellation and 100% automated refund before shipment.
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => openCancelModal(order)}
                                    className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                                  >
                                    <span>✕</span>
                                    <span>Cancel Order &amp; Refund</span>
                                  </button>
                                </div>
                              )}

                              {/* Rule 1 Lockout: Shipped orders CANNOT be cancelled */}
                              {order.status === 'Shipped' && (
                                <div className="pt-3 border-t border-gray-200/70 flex items-center gap-2 text-[11.5px] text-blue-800 bg-blue-50/70 border border-blue-200/80 px-3.5 py-2 rounded-xl">
                                  <span className="text-sm">🚚</span>
                                  <span>
                                    <strong>Shipped &amp; In Transit:</strong> Per store policy, this order has already been dispatched and cannot be cancelled. Once delivered, you can request a return within 7 days.
                                  </span>
                                </div>
                              )}

                              {/* ================================================================= */}
                              {/* RULE 2: RETURN WITHIN 1 WEEK WITH REASON & ADMIN REFUND           */}
                              {/* ================================================================= */}
                              {(order.status === 'Delivered' || isReturned) && (
                                <div className="pt-3 border-t border-gray-200/70 space-y-2">
                                  {order.returnStatus === 'Requested' ? (
                                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-1.5">
                                      <div className="flex items-center justify-between text-amber-900 font-bold">
                                        <span className="flex items-center gap-1.5">
                                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                          Return Request Under Store Review
                                        </span>
                                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-amber-100 border border-amber-200 text-amber-800">
                                          Pending Admin Approval
                                        </span>
                                      </div>
                                      <p className="text-gray-800 text-[11.5px]">
                                        <strong>Return Reason:</strong> {order.returnRequest?.reason}
                                      </p>
                                      {order.returnRequest?.comments && (
                                        <p className="text-gray-600 text-[11px]">
                                          <strong>Your Comments:</strong> {order.returnRequest?.comments}
                                        </p>
                                      )}
                                      <p className="text-[11px] text-gray-500 pt-0.5">
                                        Submitted on {new Date(order.returnRequest?.requestedAt || order.updatedAt).toLocaleDateString()}. Store administration is reviewing your return reason. If approved, an automated refund of <strong>{formatPrice(order.totalAmount)} {order.currency || 'AED'}</strong> will be credited to your payment method.
                                      </p>
                                    </div>
                                  ) : order.returnStatus === 'Approved' ? (
                                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs space-y-1">
                                      <div className="flex items-center justify-between text-emerald-900 font-bold">
                                        <span className="flex items-center gap-1.5">
                                          <span>✓</span> Return Approved &amp; Refund Issued
                                        </span>
                                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200 text-emerald-800">
                                          Approved by Admin
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-[11.5px]">
                                        Your return reason was accepted by store administration. Full refund of <strong>{formatPrice(order.refundAmount || order.totalAmount)} {order.currency || 'AED'}</strong> was processed (Refund ID: {order.refundId}). Funds will reverse within 3 to 7 business days.
                                      </p>
                                    </div>
                                  ) : order.returnStatus === 'Rejected' ? (
                                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs space-y-1">
                                      <div className="flex items-center justify-between text-red-900 font-bold">
                                        <span className="flex items-center gap-1.5">
                                          <span>✕</span> Return Request Declined
                                        </span>
                                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-800">
                                          Declined
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-[11.5px]">
                                        <strong>Admin Reason:</strong> {order.returnRequest?.adminNotes || 'Return request did not meet return policy criteria.'}
                                      </p>
                                    </div>
                                  ) : (
                                    (() => {
                                      const deliveryDate = order.deliveredAt || order.updatedAt || order.createdAt;
                                      const daysPassed = Math.floor((Date.now() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24));
                                      const isWithin1Week = daysPassed <= 7;
                                      const daysRemaining = Math.max(0, 7 - daysPassed);

                                      return isWithin1Week ? (
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                          <div>
                                            <span className="text-xs font-bold text-gray-900 block">
                                              Delivered on {new Date(deliveryDate).toLocaleDateString()}
                                            </span>
                                            <span className="text-[11px] text-emerald-700 font-medium">
                                              ● Return window active: <strong>{daysRemaining} day{daysRemaining === 1 ? '' : 's'} remaining</strong> (1-week return policy)
                                            </span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => openReturnModal(order)}
                                            className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                                          >
                                            <span>📦</span>
                                            <span>Request Return &amp; Refund</span>
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="text-[11px] text-gray-400 italic pt-1">
                                          Delivered on {new Date(deliveryDate).toLocaleDateString()} • 1-week return window has passed.
                                        </div>
                                      );
                                    })()
                                  )}
                                </div>
                              )}

                              {/* ONLY ONE DELIVERED ORDER REVIEW SECTION */}
                              {order.status === 'Delivered' && !isReturned && (
                                <div className="pt-3 border-t border-gray-200/70">
                                  {order.reviewSubmitted || order.review?.message ? (
                                    <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900 flex items-center gap-1.5">
                                          <span className="text-[#ED2024]">★</span>
                                          <span>Your Review for {order.review?.productName || order.items?.[0]?.name || 'Device'}</span>
                                        </span>
                                        {order.review?.status === 'approved' ? (
                                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            ✓ Live on Real Stories
                                          </span>
                                        ) : (
                                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            ✓ Review Submitted
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 text-[#ED2024] text-sm">
                                        {'★'.repeat(order.review?.stars || 5)}
                                        <span className="text-gray-500 text-[11px] font-semibold ml-1">
                                          ({order.review?.stars || 5}/5)
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-xs italic bg-white/70 p-2.5 rounded-lg border border-rose-100">
                                        "{order.review?.message}"
                                      </p>
                                      {order.review?.status === 'approved' ? (
                                        <p className="text-[11px] text-emerald-700 font-medium">
                                          Your review is featured on our public <a href="/reviews" className="underline font-bold text-[#ED2024] hover:underline">Real Stories Reviews Page</a>!
                                        </p>
                                      ) : (
                                        <p className="text-[11px] text-gray-500">
                                          Thank you for sharing your feedback and experience with LUMA!
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-50/70 to-rose-50/70 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                      <div>
                                        <span className="font-bold text-gray-900 block text-[12.5px] flex items-center gap-1.5">
                                          <span className="text-[#ED2024] text-sm">★</span>
                                          <span>How was your experience with this device?</span>
                                        </span>
                                        <span className="text-gray-600 text-[11.5px] mt-0.5 block">
                                          Leave a star rating &amp; customer review to share your experience with the community.
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => openReviewModal(order)}
                                        className="px-4 py-2 rounded-xl bg-[#ED2024] hover:bg-[#d61b1f] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                                      >
                                        <span>★</span>
                                        <span>Write a Review</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-16 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300 px-4 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-gray-400 text-xl">
                          📦
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">No Orders Placed Yet</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                          There are currently no orders registered under <span className="text-gray-800 font-semibold">{customerUser.email}</span>.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('products')}
                          className="mt-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                          Start Shopping
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* RULE 1 MODAL: CUSTOMER ORDER CANCELLATION & AUTOMATED REFUND             */}
      {/* ========================================================================= */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-[22px] max-w-md w-full p-6 text-left shadow-2xl animate-scaleUp text-gray-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                  ✕
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Cancel Order &amp; Automated Refund</h3>
                  <p className="text-[11px] text-gray-500 font-mono">
                    #{cancelModalOrder.orderNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {cancelError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {cancelError}
              </div>
            )}

            {/* Policy Clarification */}
            <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-1.5 text-purple-950">
              <div className="font-bold flex items-center gap-1.5 text-purple-900">
                <span>💳</span> 100% Automated Gateway Refund
              </div>
              <p className="text-[11.5px] text-gray-700 leading-relaxed">
                As this order is in preparation and has not yet been shipped, it is eligible for an instant automated refund of{' '}
                <strong className="text-purple-900 font-bold">
                  {formatPrice(cancelModalOrder.totalAmount)} {cancelModalOrder.currency || 'AED'}
                </strong>.
              </p>
              <div className="text-[11px] text-gray-500 pt-1">
                ⏱ Bank Reversal Timeline: <strong className="text-emerald-700">3 to 7 business days</strong>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block">
                Please select cancellation reason:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-xl px-3 py-2 text-xs text-gray-800 outline-none cursor-pointer shadow-2xs"
              >
                <option value="Changed my mind / No longer needed">Changed my mind / No longer needed</option>
                <option value="Ordered wrong item or quantity">Ordered wrong item or quantity</option>
                <option value="Delivery timeline will not work for me">Delivery timeline will not work for me</option>
                <option value="Need to update shipping destination / address">Need to update shipping destination / address</option>
                <option value="Found better alternative or price">Found better alternative or price</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                disabled={cancelLoading}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="px-5 py-2.5 rounded-xl bg-[#ED2024] hover:bg-[#d61b1f] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#ED2024]/20 cursor-pointer flex items-center gap-2"
              >
                {cancelLoading && (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Confirm Cancellation &amp; Refund</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RULE 2 MODAL: CUSTOMER RETURN REQUEST (WITHIN 1 WEEK WITH REASON)         */}
      {/* ========================================================================= */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-[22px] max-w-lg w-full p-6 text-left shadow-2xl animate-scaleUp text-gray-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base">
                  📦
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Request Return &amp; Refund</h3>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Order #{returnModalOrder.orderNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {returnError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {returnError}
              </div>
            )}

            {/* 1-Week Policy Banner */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
              <span className="font-bold text-gray-800 flex items-center gap-1.5">
                <span>⏱</span> 1-Week (7-Day) Return Policy
              </span>
              <p className="text-[11.5px] text-gray-600 leading-relaxed">
                LUMA allows product returns within 7 days of delivery. Please provide a clear, valid reason so our store administrator can review and issue your refund.
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold pt-0.5">
                Refund Amount upon Admin Approval: {formatPrice(returnModalOrder.totalAmount)} {returnModalOrder.currency || 'AED'}
              </div>
            </div>

            {/* Reason Selection (Required) */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block">
                Reason for Return *
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer shadow-2xs"
              >
                <option value="Device is defective / malfunctioning">Device is defective / malfunctioning</option>
                <option value="Product arrived damaged or packaging broken">Product arrived damaged or packaging broken</option>
                <option value="Received incorrect product or missing accessories">Received incorrect product or missing accessories</option>
                <option value="Skin sensitivity or medical advice">Skin sensitivity or medical advice</option>
                <option value="Results did not match expectations">Results did not match expectations</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            {/* Additional details */}
            <div className="space-y-1.5">
              <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block">
                Additional Comments / Details
              </label>
              <textarea
                rows={3}
                value={returnComments}
                onChange={(e) => setReturnComments(e.target.value)}
                placeholder="Explain the reason or issue for the store admin..."
                className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-xl px-3.5 py-2 text-xs text-gray-900 outline-none shadow-2xs resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                disabled={returnLoading}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleReturnRequest}
                disabled={returnLoading}
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                {returnLoading && (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Submit Return Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMER REVIEW SUBMISSION MODAL (STAR RATING & MESSAGE)                   */}
      {/* ========================================================================= */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-gray-200 rounded-[22px] max-w-lg w-full p-6 text-left shadow-2xl animate-scaleUp text-gray-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#ED2024] flex items-center justify-center font-bold text-base">
                  ★
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Add Product Review &amp; Story</h3>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Order #{reviewModalOrder.orderNumber} • Delivered
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOrder(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {reviewError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Product selector if multiple items */}
              {Array.isArray(reviewModalOrder.items) && reviewModalOrder.items.length > 1 ? (
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block">
                    Select Product to Review *
                  </label>
                  <select
                    value={reviewProductName}
                    onChange={(e) => setReviewProductName(e.target.value)}
                    className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer shadow-2xs"
                  >
                    {reviewModalOrder.items.map((item, idx) => (
                      <option key={idx} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Reviewing Device:</span>
                  <span className="font-bold text-gray-900">{reviewProductName || reviewModalOrder.items?.[0]?.name || 'LUMA Device'}</span>
                </div>
              )}

              {/* Star Rating Picker (1 to 5 stars) */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block">
                  Your Rating ({reviewRating} / 5 Stars) *
                </label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setReviewRating(starVal)}
                      className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                        starVal <= reviewRating ? 'text-[#ED2024]' : 'text-gray-300 hover:text-gray-400'
                      }`}
                      title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-600 ml-2">
                    {reviewRating === 5
                      ? '5 Stars - Exceptional'
                      : reviewRating === 4
                      ? '4 Stars - Very Good'
                      : reviewRating === 3
                      ? '3 Stars - Good'
                      : reviewRating === 2
                      ? '2 Stars - Fair'
                      : '1 Star - Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Review Message Textarea */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block">
                  Your Review / Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="Share how the device worked for you, your daily routine, or results you noticed..."
                  className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none shadow-2xs resize-none leading-relaxed"
                />
                <span className="text-[11px] text-gray-500 block">
                  Your review and story will be featured in the <strong>Real Stories</strong> section on the public reviews page.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  disabled={reviewLoading}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading || !reviewMessage.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#ED2024]/20 cursor-pointer flex items-center gap-2"
                >
                  {reviewLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

