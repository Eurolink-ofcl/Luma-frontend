import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const API_BASE_URL = 'http://localhost:5000/api';

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
      <div className="w-full min-h-[70vh] bg-[#0a0a0b] text-white flex items-center justify-center px-4 py-20 font-['Manrope']">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#121214] border border-white/10 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-[#ED2024]/10 border border-[#ED2024]/30 text-[#ED2024] flex items-center justify-center mx-auto text-2xl font-bold">
            ✦
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Customer Account Required</h1>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
              Please sign in with your LUMA account to access your profile settings, shopping bag, and live order status.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="w-full py-3 bg-[#ED2024] hover:bg-[#d61b1f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ED2024]/20 cursor-pointer"
          >
            Sign In / Register
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="text-xs text-white/40 hover:text-white transition-colors block mx-auto cursor-pointer"
          >
            &larr; Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0B] text-white font-['Manrope'] pb-24">
      {/* Top Breadcrumb & Page Banner */}
      <section className="relative w-full pt-32 sm:pt-40 pb-12 border-b border-white/10 bg-gradient-to-b from-[#121216] via-[#0A0A0B] to-[#0A0A0B] overflow-hidden">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-[#ED2024]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <nav className="flex items-center gap-2 text-[11px] text-white/50 uppercase tracking-widest mb-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('home');
              }}
              className="hover:text-white transition-colors"
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
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Welcome back, {name || customerUser.name || 'Member'}
              </h1>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
                Manage your personal profile, review items saved in your shopping bag, and track live order status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ED2024] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-[#ED2024]/30">
                  {(name || customerUser.name || customerUser.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{name || customerUser.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active Member" />
                  </div>
                  <span className="text-[11px] text-white/50">{customerUser.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
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
            <div className="bg-[#121214] border border-white/10 rounded-2xl p-3 space-y-1 sticky top-28">
              <button
                type="button"
                onClick={() => handleTabSwitch('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'profile'
                    ? 'bg-[#ED2024] text-white shadow-lg shadow-[#ED2024]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
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
                    ? 'bg-[#ED2024] text-white shadow-lg shadow-[#ED2024]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🛒</span>
                  <span>Add to Cart Products</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 font-bold">
                  {cartItems.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('orders')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'orders'
                    ? 'bg-[#ED2024] text-white shadow-lg shadow-[#ED2024]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📦</span>
                  <span>Ordered Products &amp; Status</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 font-bold">
                  {orders.length}
                </span>
              </button>

              <div className="h-[1px] bg-white/10 my-2" />

              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-2.5"
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
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 animate-fadeIn">
                <span className="text-emerald-400 font-bold text-sm shrink-0">✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3 animate-fadeIn">
                <span className="text-red-400 font-bold text-sm shrink-0">✕</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {loading ? (
              <div className="p-16 rounded-2xl bg-[#121214] border border-white/10 text-center space-y-3">
                <div className="w-6 h-6 border-2 border-white/20 border-t-[#ED2024] rounded-full animate-spin mx-auto" />
                <p className="text-xs text-white/50">Loading your account information...</p>
              </div>
            ) : (
              <>
                {/* ========================================================= */}
                {/* TAB 1: UPDATE PROFILE DETAILS                             */}
                {/* ========================================================= */}
                {activeTab === 'profile' && (
                  <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-lg font-bold text-white">Profile &amp; Delivery Information</h2>
                        <p className="text-xs text-white/50 mt-0.5">
                          Update your name, contact phone, and shipping destination.
                        </p>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                        Verified Account
                      </span>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">
                            Email Address (Account ID)
                          </label>
                          <input
                            type="email"
                            disabled
                            value={customerUser.email}
                            className="w-full px-4 py-3 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white/40 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+971 50 123 4567"
                            className="w-full px-4 py-3 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Dubai"
                            className="w-full px-4 py-3 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">
                            Country
                          </label>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="United Arab Emirates"
                            className="w-full px-4 py-3 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">
                          Delivery Street Address
                        </label>
                        <textarea
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. Villa 14, Palm Jumeirah, Street 3, Dubai"
                          className="w-full px-4 py-3 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors resize-none leading-relaxed"
                        />
                      </div>

                      <div className="pt-3 flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-8 py-3.5 bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ED2024]/30 cursor-pointer flex items-center gap-2"
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
                  <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-lg font-bold text-white">Your Shopping Bag ({cartItems.length})</h2>
                        <p className="text-xs text-white/50 mt-0.5">
                          Products saved in your customer shopping bag.
                        </p>
                      </div>
                      <span className="text-[11px] text-white/40">
                        Active Cart
                      </span>
                    </div>

                    {cartItems.length > 0 ? (
                      <div className="space-y-4">
                        {cartItems.map((item, idx) => (
                          <div
                            key={item._id || idx}
                            className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-16 h-16 object-contain rounded-xl bg-black/40 p-1.5 border border-white/5 shrink-0"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-lg shrink-0">
                                  ✦
                                </div>
                              )}
                              <div>
                                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                                {item.variant && (
                                  <p className="text-xs text-white/50 mt-0.5">{item.variant}</p>
                                )}
                                <p className="text-xs text-[#ED2024] font-semibold mt-1">
                                  {formatPrice(item.price)} &times; {item.quantity || 1}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-5">
                              <span className="text-sm font-bold text-white">
                                {formatPrice((item.price || 0) * (item.quantity || 1))}
                              </span>
                              {item._id && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCartItem(item._id)}
                                  className="text-white/40 hover:text-red-400 p-1.5 transition-colors cursor-pointer text-sm"
                                  title="Remove item"
                                >
                                  &times; Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <span className="text-xs text-white/50 block">Bag Subtotal</span>
                            <span className="text-xl font-bold text-white">{formatPrice(cartSubtotal)}</span>
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
                              className="px-6 py-3.5 bg-[#ED2024] hover:bg-[#d61b1f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ED2024]/20 cursor-pointer"
                            >
                              Proceed to Checkout
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-16 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10 px-4 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/40 text-xl">
                          🛒
                        </div>
                        <h3 className="text-sm font-bold text-white">Your Shopping Bag is Empty</h3>
                        <p className="text-xs text-white/40 max-w-sm mx-auto">
                          No items currently in your cart. Add products to save them directly to your account.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('products')}
                          className="mt-2 px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
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
                  <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-lg font-bold text-white">Order History &amp; Tracking ({orders.length})</h2>
                        <p className="text-xs text-white/50 mt-0.5">
                          View your placed orders and delivery status.
                        </p>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        Live Tracking
                      </span>
                    </div>

                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const statusColors = {
                            Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                            Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                            Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                            Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                            Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
                          };
                          const badgeClass = statusColors[order.status] || 'bg-white/10 text-white border-white/20';

                          return (
                            <div
                              key={order._id || order.orderNumber}
                              className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                                    Order Number
                                  </span>
                                  <span className="text-sm font-bold text-white">
                                    #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                  </span>
                                  <span className="text-[11px] text-white/40 block mt-0.5">
                                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                  </span>
                                </div>

                                <div className="sm:text-right">
                                  <span
                                    className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded border ${badgeClass}`}
                                  >
                                    Status: {order.status || 'Processing'}
                                  </span>
                                  <span className="text-sm font-bold text-white block mt-1.5">
                                    Total: {formatPrice(order.totalAmount)} {order.currency || 'AED'}
                                  </span>
                                </div>
                              </div>

                              {/* Automated Payment Gateway Refund Banner */}
                              {(order.paymentStatus === 'Refunded' || order.status === 'Cancelled') && (
                                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-1.5">
                                  <div className="flex items-center justify-between text-purple-400 font-bold">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                      Automated Refund Initiated
                                    </span>
                                    <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                                      {order.refundId || 'REFUND PROCESSED'}
                                    </span>
                                  </div>
                                  <p className="text-white/80 text-[11.5px] leading-relaxed">
                                    A full refund of <strong className="text-white">{formatPrice(order.refundAmount || order.totalAmount)} {order.currency || 'AED'}</strong> was automatically requested through the payment gateway back to your original payment method.
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-white/50">
                                    <span>
                                      ⏱ Reversal Timeline: <strong className="text-emerald-400">{order.refundTimeline || '3 to 7 business days'}</strong>
                                    </span>
                                    {order.refundReason && (
                                      <span>
                                        • Reason: <em className="text-white/70">{order.refundReason}</em>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Products List */}
                              {Array.isArray(order.items) && order.items.length > 0 && (
                                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                  <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                                    Purchased Products
                                  </span>
                                  {order.items.map((item, iIdx) => (
                                    <div
                                      key={iIdx}
                                      className="flex items-center justify-between text-xs text-white/90"
                                    >
                                      <span className="font-medium truncate pr-4">
                                        {item.name} &times; {item.quantity || 1}
                                      </span>
                                      <span className="font-semibold text-white shrink-0">
                                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {order.shippingAddress && (
                                <div className="text-xs text-white/60">
                                  <span className="text-white/40">Shipping Address: </span>
                                  <span>
                                    {order.shippingAddress.street || ''} {order.shippingAddress.city || ''},{' '}
                                    {order.shippingAddress.country || 'UAE'}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-16 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10 px-4 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/40 text-xl">
                          📦
                        </div>
                        <h3 className="text-sm font-bold text-white">No Orders Placed Yet</h3>
                        <p className="text-xs text-white/40 max-w-sm mx-auto">
                          There are currently no orders registered under <span className="text-white/70">{customerUser.email}</span>.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('products')}
                          className="mt-2 px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
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
    </div>
  );
}

