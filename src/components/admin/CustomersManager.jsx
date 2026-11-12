import React, { useState, useEffect, useMemo } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailTab, setDetailTab] = useState('profile');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Fetch customers
  const fetchCustomers = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/customers`);
      const data = await res.json();

      if (res.ok && data.success) {
        setCustomers(data.customers || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to retrieve customers.');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Unable to connect to LUMA Backend Server (http://localhost:5000).');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.country && c.country.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const total = customers.length;
    const withCart = customers.filter((c) => (c.cartCount || 0) > 0).length;
    const withOrders = customers.filter((c) => (c.ordersCount || 0) > 0).length;
    const totalDevices = customers.reduce((acc, c) => acc + (c.devicesCount || 0), 0);
    const totalRevenue = customers.reduce((acc, c) => acc + (c.totalSpend || 0), 0);

    return { total, withCart, withOrders, totalDevices, totalRevenue };
  }, [customers]);

  // Delete customer
  const handleDeleteCustomer = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomers((prev) => prev.filter((c) => c.id !== id && c._id !== id));
        if (selectedCustomer && (selectedCustomer.id === id || selectedCustomer._id === id)) {
          setSelectedCustomer(null);
        }
        setDeleteConfirmId(null);
        setActionMessage('Customer removed successfully.');
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        alert(data.message || 'Failed to delete customer.');
      }
    } catch (err) {
      alert('Network error while deleting customer.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('en-US');
  };

  return (
    <div className="py-6 font-['Manrope'] text-gray-900">
      {/* ========================================================================= */}
      {/* Header Banner & Live Status                                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ED2024] text-[11px] font-bold uppercase tracking-[0.14em] mb-1">
            <span>Management Section</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[32px] font-extrabold uppercase tracking-[0.02em] text-gray-900">
            Registered Customers
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Live collection of member profiles, real-time shopping bags, and order telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchCustomers(true)}
            disabled={refreshing}
            className="px-4 py-2 rounded-[10px] bg-white hover:bg-gray-50 border border-gray-300 text-[12px] font-bold uppercase tracking-[0.06em] text-gray-700 shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh Live'}</span>
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="mt-4 p-3.5 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{actionMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mt-4 p-4 rounded-[12px] bg-[#ED2024]/10 border border-[#ED2024]/30 text-[#ED2024] text-[13px]">
          {error}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Metrics Row (4 Cards)                                                    */}
      {/* ========================================================================= */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Total Customers
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
            {metrics.total}
          </div>
          <div className="mt-1 text-[11.5px] text-emerald-600 font-semibold">
            Active Accounts
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Active Shopping Bags */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Active Shopping Bags
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-[#ED2024] tracking-tight">
            {metrics.withCart}
          </div>
          <div className="mt-1 text-[11.5px] text-gray-500 font-medium">
            Items saved in Cart
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-[#ED2024]/10 border border-[#ED2024]/20 flex items-center justify-center text-[#ED2024]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        {/* Customers with Orders */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Ordering Customers
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
            {metrics.withOrders}
          </div>
          <div className="mt-1 text-[11.5px] text-emerald-600 font-semibold">
            {metrics.totalRevenue > 0 ? `${formatPrice(metrics.totalRevenue)} AED Lifetime` : '0 AED Lifetime'}
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Warranty Devices */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Warranty Devices
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
            {metrics.totalDevices}
          </div>
          <div className="mt-1 text-[11.5px] text-gray-500 font-medium">
            Clinical Device Registrations
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Search Bar & Table Controls                                              */}
      {/* ========================================================================= */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-[16px] border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, phone, city, address..."
            className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] focus:bg-white rounded-[10px] pl-10 pr-4 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="text-[12px] text-gray-500 px-2 shrink-0">
          Showing <span className="font-bold text-gray-900">{filteredCustomers.length}</span> of {customers.length} registered
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Live Customers Data Table                                                */}
      {/* ========================================================================= */}
      <div className="mt-4 rounded-[16px] bg-white border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-[#ED2024] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px]">Retrieving customer records...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-1">No customer records found</h3>
            <p className="text-[13px] text-gray-500 mb-4">
              {searchQuery
                ? `No customers matched your search query "${searchQuery}".`
                : 'There are currently no customer accounts registered.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-[12px] font-semibold text-gray-700 transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
                <tr>
                  <th className="py-3.5 px-4">Customer Account</th>
                  <th className="py-3.5 px-4">Contact & Location</th>
                  <th className="py-3.5 px-4 text-center">Shopping Bag</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4 text-center">Warranty</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((cust) => {
                  const initial = cust.name ? cust.name.charAt(0).toUpperCase() : 'U';
                  return (
                    <tr
                      key={cust.id || cust._id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Customer Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ED2024] to-[#800A0C] flex items-center justify-center font-bold text-white text-[13px] shadow-sm shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 hover:text-[#ED2024] transition-colors cursor-pointer" onClick={() => setSelectedCustomer(cust)}>
                              {cust.name}
                            </div>
                            <div className="text-[12px] text-gray-500 select-all">
                              {cust.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Location */}
                      <td className="py-3.5 px-4">
                        <div className="text-gray-900 font-medium">
                          {cust.phone || '—'}
                        </div>
                        <div className="text-[11.5px] text-gray-500">
                          {cust.city && cust.city !== '—' ? `${cust.city}, ` : ''}{cust.country || 'United Arab Emirates'}
                        </div>
                      </td>

                      {/* Shopping Cart */}
                      <td className="py-3.5 px-4 text-center">
                        {cust.cartCount > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#ED2024] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ED2024] animate-pulse" />
                            {cust.cartCount} items ({formatPrice(cust.cartTotal)} AED)
                          </span>
                        ) : (
                          <span className="text-gray-300 text-[12px]">—</span>
                        )}
                      </td>

                      {/* Orders */}
                      <td className="py-3.5 px-4 text-center">
                        {cust.ordersCount > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                            {cust.ordersCount} {cust.ordersCount === 1 ? 'Order' : 'Orders'} ({formatPrice(cust.totalSpend)} AED)
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[12px]">0 Orders</span>
                        )}
                      </td>

                      {/* Warranty Devices */}
                      <td className="py-3.5 px-4 text-center">
                        {cust.devicesCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold">
                            {cust.devicesCount} Device
                          </span>
                        ) : (
                          <span className="text-gray-300 text-[12px]">None</span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="font-medium">{formatDate(cust.createdAt)}</div>
                        <div className="text-[11px] text-gray-400">{formatDateTime(cust.createdAt).split(',')[1]}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setDetailTab('profile');
                            }}
                            className="px-3 py-1.5 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-[12px] font-semibold text-gray-700 transition-colors cursor-pointer shadow-xs"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(cust.id || cust._id)}
                            className="p-1.5 rounded-[8px] text-gray-400 hover:text-[#ED2024] hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove customer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Customer Details Modal                                                    */}
      {/* ========================================================================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
            {/* Modal Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ED2024] to-[#800A0C] flex items-center justify-center font-black text-white text-[20px] shadow-md shrink-0">
                  {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-extrabold text-gray-900">{selectedCustomer.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">
                      Verified Member
                    </span>
                  </div>
                  <div className="text-[13px] text-gray-500 select-all">{selectedCustomer.email}</div>
                  <div className="text-[11.5px] text-gray-400 mt-0.5">
                    Member since {formatDate(selectedCustomer.createdAt)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-4 border-b border-gray-200 flex gap-4 text-[13px] font-bold bg-white">
              <button
                type="button"
                onClick={() => setDetailTab('profile')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  detailTab === 'profile'
                    ? 'border-[#ED2024] text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Profile & Address
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('cart')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  detailTab === 'cart'
                    ? 'border-[#ED2024] text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                <span>Shopping Cart</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#ED2024]/10 text-[#ED2024] text-[10px]">
                  {selectedCustomer.cartCount || 0}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('orders')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  detailTab === 'orders'
                    ? 'border-[#ED2024] text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                <span>Orders History</span>
                <span className="px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600 text-[10px]">
                  {selectedCustomer.ordersCount || 0}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('devices')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  detailTab === 'devices'
                    ? 'border-[#ED2024] text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                <span>Warranty</span>
                <span className="px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600 text-[10px]">
                  {selectedCustomer.devicesCount || 0}
                </span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[460px] overflow-y-auto bg-white">
              {/* Tab 1: Profile & Address */}
              {detailTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Full Name
                      </div>
                      <div className="text-[14px] font-bold text-gray-900 mt-1">
                        {selectedCustomer.name}
                      </div>
                    </div>
                    <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Email Address
                      </div>
                      <div className="text-[14px] font-bold text-gray-900 mt-1 select-all">
                        {selectedCustomer.email}
                      </div>
                    </div>
                    <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Contact Phone
                      </div>
                      <div className="text-[14px] font-bold text-gray-900 mt-1">
                        {selectedCustomer.phone || '—'}
                      </div>
                    </div>
                    <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Location
                      </div>
                      <div className="text-[14px] font-bold text-gray-900 mt-1">
                        {selectedCustomer.city && selectedCustomer.city !== '—' ? `${selectedCustomer.city}, ` : ''}{selectedCustomer.country}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Delivery / Shipping Address
                    </div>
                    <div className="text-[14px] text-gray-800 mt-1 font-medium">
                      {selectedCustomer.address && selectedCustomer.address !== '—'
                        ? selectedCustomer.address
                        : 'No physical street address provided yet.'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-[12px] bg-gray-50 border border-gray-200">
                      <div className="text-[10.5px] text-gray-500 uppercase font-semibold">Account Created</div>
                      <div className="text-[12.5px] text-gray-900 font-medium mt-0.5">{formatDateTime(selectedCustomer.createdAt)}</div>
                    </div>
                    <div className="p-3.5 rounded-[12px] bg-gray-50 border border-gray-200">
                      <div className="text-[10.5px] text-gray-500 uppercase font-semibold">Account ID</div>
                      <div className="text-[11.5px] text-gray-600 font-mono mt-0.5 select-all">{selectedCustomer.id || selectedCustomer._id}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Shopping Bag */}
              {detailTab === 'cart' && (
                <div>
                  {selectedCustomer.cart && selectedCustomer.cart.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[12px] text-gray-500 pb-2 border-b border-gray-200">
                        <span>Items currently saved in customer's live cart:</span>
                        <span className="font-bold text-[#ED2024]">{formatPrice(selectedCustomer.cartTotal)} AED Total</span>
                      </div>
                      {selectedCustomer.cart.map((item, idx) => (
                        <div
                          key={item._id || idx}
                          className="p-3.5 rounded-[12px] bg-gray-50 border border-gray-200 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-[10px] bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                              ) : (
                                <span className="text-[11px] text-gray-400 font-bold">LUMA</span>
                              )}
                            </div>
                            <div>
                              <div className="text-[14px] font-bold text-gray-900">{item.title}</div>
                              {item.variant && <div className="text-[11.5px] text-gray-500">{item.variant}</div>}
                              <div className="text-[12px] text-[#ED2024] font-bold mt-0.5">
                                {formatPrice(item.price)} AED × {item.quantity || 1}
                              </div>
                            </div>
                          </div>
                          <div className="text-[14px] font-bold text-gray-900 text-right shrink-0">
                            {formatPrice((item.price || 0) * (item.quantity || 1))} AED
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-[13px]">Customer's shopping bag is currently empty.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Orders History */}
              {detailTab === 'orders' && (
                <div>
                  {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.orders.map((ord) => (
                        <div
                          key={ord._id}
                          className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 flex items-start justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[13px] font-bold text-gray-900">
                                #{ord.orderNumber || ord._id.slice(-6).toUpperCase()}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : ord.status === 'Processing'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : ord.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {ord.status || 'Confirmed'}
                              </span>
                            </div>
                            <div className="text-[12px] text-gray-500 mt-1">
                              Placed on {formatDateTime(ord.createdAt)}
                            </div>
                            {ord.items && ord.items.length > 0 && (
                              <div className="text-[12px] text-gray-700 mt-2">
                                {ord.items.map((it) => `${it.title} (×${it.quantity})`).join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[15px] font-extrabold text-gray-900">
                              {formatPrice(ord.totalAmount)} AED
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {ord.paymentMethod || 'Credit Card'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-[13px]">No orders have been placed by this customer yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Warranty Devices */}
              {detailTab === 'devices' && (
                <div>
                  {selectedCustomer.registeredDevices && selectedCustomer.registeredDevices.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.registeredDevices.map((dev, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-[13px] font-bold text-gray-900">
                              Serial: <span className="font-mono text-[#ED2024]">{dev.serialNumber}</span>
                            </div>
                            <div className="text-[12px] text-gray-600 mt-0.5">
                              Model: {dev.deviceModel || 'LUMA Red Light Therapy Panel'}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1">
                              Registered on {formatDate(dev.registeredAt)}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                            Active 3-Yr Warranty
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-[13px]">No clinical devices registered for warranty by this customer yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 text-[13px] font-bold text-gray-800 transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Delete Confirmation Modal                                                */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-[20px] max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#ED2024] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-gray-900">Confirm Customer Removal</h3>
            <p className="text-[13px] text-gray-600 mt-2 mb-6">
              Are you sure you want to permanently delete this customer? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 text-[12px] font-bold text-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCustomer(deleteConfirmId)}
                className="px-4 py-2 rounded-[10px] bg-[#ED2024] hover:bg-[#d4191d] text-[12px] font-bold text-white transition-colors cursor-pointer shadow-md"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

