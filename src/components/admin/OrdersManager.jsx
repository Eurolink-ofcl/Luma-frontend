import React, { useState, useEffect, useMemo } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusConfirm, setStatusConfirm] = useState(null); // { order, newStatus }
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Customer requested cancellation');
  const [actionMessage, setActionMessage] = useState(null);

  // Fetch orders
  const fetchOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders`);
      const data = await res.json();

      if (res.ok && data.success) {
        setOrders(data.orders || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to retrieve orders.');
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setError('Unable to connect to LUMA Backend Server (http://localhost:5000).');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by search and status tab
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by status tab
    if (statusFilter !== 'all') {
      result = result.filter((ord) => {
        const s = ord.status || 'Confirmed';
        if (statusFilter === 'Confirmed') {
          return s === 'Confirmed' || s === 'Processing' || s === 'Pending';
        }
        return s.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ord) =>
          (ord.orderNumber && ord.orderNumber.toLowerCase().includes(q)) ||
          (ord.customer?.name && ord.customer.name.toLowerCase().includes(q)) ||
          (ord.customer?.email && ord.customer.email.toLowerCase().includes(q)) ||
          (ord.customer?.phone && ord.customer.phone.toLowerCase().includes(q)) ||
          (ord.shippingAddress?.city && ord.shippingAddress.city.toLowerCase().includes(q)) ||
          (ord.shippingAddress?.street && ord.shippingAddress.street.toLowerCase().includes(q)) ||
          (ord.items && ord.items.some((it) => it.name && it.name.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [orders, searchQuery, statusFilter]);

  // Telemetry metrics
  const metrics = useMemo(() => {
    const total = orders.length;
    const confirmed = orders.filter(
      (o) => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Pending'
    ).length;
    const shipped = orders.filter((o) => o.status === 'Shipped').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    const cancelled = orders.filter((o) => o.status === 'Cancelled').length;
    const totalRevenue = orders.reduce((sum, o) => {
      if (o.status !== 'Cancelled') {
        return sum + (Number(o.totalAmount) || 0);
      }
      return sum;
    }, 0);

    return { total, confirmed, shipped, delivered, cancelled, totalRevenue };
  }, [orders]);

  // Execute progressive status update
  const handleUpdateStatus = async () => {
    if (!statusConfirm) return;
    const { order, newStatus } = statusConfirm;

    setStatusUpdating(true);
    setError(null);

    try {
      const payload = {
        status: newStatus,
        ...(newStatus === 'Cancelled' ? { reason: cancellationReason } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/admin/orders/${order._id || order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update local state with updated order
        setOrders((prev) =>
          prev.map((o) => ((o._id || o.id) === (order._id || order.id) ? data.order : o))
        );

        if (selectedOrder && (selectedOrder._id || selectedOrder.id) === (order._id || order.id)) {
          setSelectedOrder(data.order);
        }

        setStatusConfirm(null);
        if (newStatus === 'Cancelled') {
          setActionMessage(
            `Order #${order.orderNumber} cancelled. Automated refund of ${formatPrice(data.order?.refundAmount || order.totalAmount)} ${order.currency || 'AED'} initiated to customer card (${data.order?.refundId || 'Refunded'}). ETA: 3 to 7 business days.`
          );
        } else {
          setActionMessage(
            `Order #${order.orderNumber} status successfully updated to "${newStatus}". It cannot be reverted.`
          );
        }
        setTimeout(() => setActionMessage(null), 6000);
      } else {
        alert(data.message || 'Failed to update order status.');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Network error while updating order status.');
    } finally {
      setStatusUpdating(false);
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

  // Helper to get allowed forward transitions according to the strict one-way rule
  const getAllowedForwardTransitions = (currentStatus) => {
    const norm =
      currentStatus === 'Processing' || currentStatus === 'Pending' ? 'Confirmed' : currentStatus;

    if (norm === 'Confirmed') {
      return [
        { label: 'Mark as Shipped', status: 'Shipped', color: 'bg-blue-600 hover:bg-blue-700' },
        { label: 'Cancel Order', status: 'Cancelled', color: 'bg-red-600 hover:bg-red-700' },
      ];
    }

    if (norm === 'Shipped') {
      return [
        { label: 'Mark as Delivered', status: 'Delivered', color: 'bg-emerald-600 hover:bg-emerald-700' },
        { label: 'Cancel Order', status: 'Cancelled', color: 'bg-red-600 hover:bg-red-700' },
      ];
    }

    // Delivered and Cancelled are terminal states (no forward transitions)
    return [];
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
            Orders Management
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Live order progression workflow: Confirmed → Shipped → Delivered.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchOrders(true)}
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
        {/* Total Orders */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Total Orders
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
            {metrics.total}
          </div>
          <div className="mt-1 text-[11.5px] text-emerald-600 font-semibold">
            {formatPrice(metrics.totalRevenue)} AED Total Value
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        {/* Confirmed Orders */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Confirmed & Ready
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-amber-600 tracking-tight">
            {metrics.confirmed}
          </div>
          <div className="mt-1 text-[11.5px] text-gray-500 font-medium">
            Ready to be Shipped
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Shipped Orders */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Shipped in Transit
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-blue-600 tracking-tight">
            {metrics.shipped}
          </div>
          <div className="mt-1 text-[11.5px] text-gray-500 font-medium">
            Out for Delivery
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Delivered (Completed)
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-emerald-600 tracking-tight">
            {metrics.delivered}
          </div>
          <div className="mt-1 text-[11.5px] text-gray-500 font-medium">
            Finalized Deliveries
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Status Filter Tabs & Search Bar                                          */}
      {/* ========================================================================= */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-x-auto">
          {[
            { id: 'all', label: 'All Orders', count: metrics.total },
            { id: 'Confirmed', label: 'Confirmed', count: metrics.confirmed },
            { id: 'Shipped', label: 'Shipped', count: metrics.shipped },
            { id: 'Delivered', label: 'Delivered', count: metrics.delivered },
            { id: 'Cancelled', label: 'Cancelled', count: metrics.cancelled },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-[9px] text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#ED2024] text-white shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px] sm:min-w-[340px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, item, city..."
            className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] pl-10 pr-8 py-2 text-[13px] text-gray-900 placeholder-gray-400 outline-none shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Live Orders Data Table                                                   */}
      {/* ========================================================================= */}
      <div className="mt-4 rounded-[16px] bg-white border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-[#ED2024] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px]">Retrieving live orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-1">No orders found</h3>
            <p className="text-[13px] text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? `No orders matching your search or "${statusFilter}" filter.`
                : 'There are currently no orders registered.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-[12px] font-semibold text-gray-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
                <tr>
                  <th className="py-3.5 px-4">Order Details</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4">One-Way Status Action</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((ord) => {
                  const currentStatus =
                    ord.status === 'Processing' || ord.status === 'Pending'
                      ? 'Confirmed'
                      : ord.status || 'Confirmed';

                  const allowedTransitions = getAllowedForwardTransitions(currentStatus);

                  return (
                    <tr
                      key={ord._id || ord.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Order # and Date */}
                      <td className="py-3.5 px-4">
                        <div
                          className="font-mono font-bold text-[14px] text-gray-900 hover:text-[#ED2024] transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(ord)}
                        >
                          #{ord.orderNumber}
                        </div>
                        <div className="text-[11.5px] text-gray-500 mt-0.5">
                          {formatDateTime(ord.createdAt)}
                        </div>
                        <div className="mt-1 flex flex-col gap-0.5">
                          {ord.paymentStatus === 'Refunded' ? (
                            <>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                ● Refunded
                              </span>
                              {ord.refundId && (
                                <span className="font-mono text-[9.5px] text-purple-600 truncate max-w-[130px]" title={ord.refundId}>
                                  {ord.refundId}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ● {ord.paymentStatus || 'Paid'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">
                          {ord.customer?.name || 'Customer'}
                        </div>
                        <div className="text-[11.5px] text-gray-500 select-all">
                          {ord.customer?.email}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {ord.customer?.phone || ord.shippingAddress?.city || '—'}
                        </div>
                      </td>

                      {/* Items Purchased */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        {ord.items && ord.items.length > 0 ? (
                          <div>
                            <div className="text-gray-800 font-medium truncate">
                              {ord.items[0].name}
                              {ord.items[0].quantity > 1 ? ` (×${ord.items[0].quantity})` : ''}
                            </div>
                            {ord.items.length > 1 && (
                              <div className="text-[11px] text-[#ED2024] font-semibold mt-0.5">
                                + {ord.items.length - 1} more item{ord.items.length - 1 > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-[15px] text-gray-900">
                          {formatPrice(ord.totalAmount)} {ord.currency || 'AED'}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {ord.paymentMethod || 'Credit Card'}
                        </div>
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.04em] ${
                              currentStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : currentStatus === 'Shipped'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : currentStatus === 'Cancelled'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                currentStatus === 'Delivered'
                                  ? 'bg-emerald-500'
                                  : currentStatus === 'Shipped'
                                  ? 'bg-blue-500 animate-pulse'
                                  : currentStatus === 'Cancelled'
                                  ? 'bg-red-500'
                                  : 'bg-amber-500 animate-pulse'
                              }`}
                            />
                            {currentStatus}
                          </span>

                          {/* Progress Stepper Mini */}
                          <div className="flex items-center gap-1 text-[9px] font-mono text-gray-400 mt-0.5">
                            <span className={currentStatus !== 'Cancelled' ? 'text-amber-600 font-bold' : 'line-through'}>
                              1.Confirmed
                            </span>
                            <span>→</span>
                            <span
                              className={
                                currentStatus === 'Shipped' || currentStatus === 'Delivered'
                                  ? 'text-blue-600 font-bold'
                                  : 'text-gray-400'
                              }
                            >
                              2.Shipped
                            </span>
                            <span>→</span>
                            <span
                              className={
                                currentStatus === 'Delivered'
                                  ? 'text-emerald-600 font-bold'
                                  : 'text-gray-400'
                              }
                            >
                              3.Delivered
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* STRICT ONE-WAY STATUS ACTION */}
                      <td className="py-3.5 px-4">
                        {allowedTransitions.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {allowedTransitions.map((act) => (
                              <button
                                key={act.status}
                                type="button"
                                onClick={() =>
                                  setStatusConfirm({
                                    order: ord,
                                    currentStatus,
                                    newStatus: act.status,
                                    actionLabel: act.label,
                                  })
                                }
                                className={`px-2.5 py-1 rounded-[7px] text-[11px] font-bold text-white transition-all cursor-pointer shadow-xs ${act.color}`}
                              >
                                {act.label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400 text-[11px] font-semibold">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Locked (Final State)</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-[12px] font-semibold text-gray-700 transition-colors cursor-pointer"
                        >
                          View Order
                        </button>
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
      {/* ONE-WAY STATUS CHANGE CONFIRMATION MODAL                                 */}
      {/* ========================================================================= */}
      {statusConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-[22px] max-w-md w-full p-6 text-center shadow-2xl animate-scaleUp text-gray-900">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                statusConfirm.newStatus === 'Delivered'
                  ? 'bg-emerald-50 text-emerald-600'
                  : statusConfirm.newStatus === 'Shipped'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-[19px] font-bold text-gray-900">
              {statusConfirm.newStatus === 'Cancelled'
                ? 'Cancel Order & Process Automatic Refund'
                : `Confirm Status Update: ${statusConfirm.newStatus}`}
            </h3>

            {statusConfirm.newStatus === 'Cancelled' ? (
              <div className="my-4 space-y-3 text-left">
                {/* Order Meta Info */}
                <div className="p-3.5 rounded-[12px] bg-gray-50 border border-gray-200 text-[12.5px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Number:</span>
                    <span className="font-mono font-bold text-gray-900">#{statusConfirm.order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer:</span>
                    <span className="font-semibold text-gray-900">{statusConfirm.order.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Total:</span>
                    <span className="font-black text-gray-900">
                      {formatPrice(statusConfirm.order.totalAmount)} {statusConfirm.order.currency || 'AED'}
                    </span>
                  </div>
                </div>

                {/* Automatic Payment Gateway Refund Callout */}
                <div className="p-3.5 rounded-[12px] bg-purple-50 border border-purple-200 text-[12px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 flex items-center gap-1.5 text-[12.5px]">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Automatic Gateway Refund
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      Auto-Triggered
                    </span>
                  </div>
                  <div className="space-y-1 text-purple-950/80">
                    <div className="flex justify-between">
                      <span className="text-purple-700/80">Refund Amount:</span>
                      <span className="font-extrabold text-purple-900">
                        {formatPrice(statusConfirm.order.totalAmount)} {statusConfirm.order.currency || 'AED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700/80">Destination:</span>
                      <span className="font-medium text-purple-900">
                        {statusConfirm.order.paymentMethod || 'Original Card / Apple Pay'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700/80">Payment Intent:</span>
                      <span className="font-mono text-[11px] text-purple-800">
                        {statusConfirm.order.paymentIntentId || 'pi_luma_live'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700/80">Bank Reversal Timeline:</span>
                      <span className="font-bold text-emerald-700">3 to 7 business days</span>
                    </div>
                  </div>
                </div>

                {/* Reason Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-gray-700 uppercase tracking-wide block">
                    Cancellation & Refund Reason
                  </label>
                  <select
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-[12.5px] text-gray-900 outline-none focus:border-red-500 shadow-2xs"
                  >
                    <option value="Customer requested cancellation">Customer requested cancellation</option>
                    <option value="Item out of stock / Fulfillment delay">Item out of stock / Fulfillment delay</option>
                    <option value="Customer changed mind / Duplicate order">Customer changed mind / Duplicate order</option>
                    <option value="Incorrect shipping address or phone">Incorrect shipping address or phone</option>
                    <option value="Fraud prevention / Risk check failed">Fraud prevention / Risk check failed</option>
                  </select>
                </div>

                <div className="p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-800 text-[11.5px] flex items-start gap-2">
                  <span className="text-[13px]">⚠️</span>
                  <span>
                    <strong>Permanent Action:</strong> The payment gateway will automatically initiate the refund to the customer's card. This order cannot be restored.
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="my-4 p-3.5 rounded-[12px] bg-gray-50 border border-gray-200 text-left text-[12.5px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Number:</span>
                    <span className="font-mono font-bold text-gray-900">#{statusConfirm.order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer:</span>
                    <span className="font-semibold text-gray-900">{statusConfirm.order.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Status:</span>
                    <span className="font-bold text-amber-600">{statusConfirm.currentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">New Status:</span>
                    <span
                      className={`font-black ${
                        statusConfirm.newStatus === 'Delivered'
                          ? 'text-emerald-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {statusConfirm.newStatus}
                    </span>
                  </div>
                </div>

                {/* Permanent Warning */}
                <div className="p-3 rounded-[10px] bg-amber-50 border border-amber-200 text-amber-800 text-[12px] text-left flex items-start gap-2 mb-6">
                  <span className="text-[14px]">⚠️</span>
                  <span>
                    <strong>Important:</strong> Once updated to <strong>{statusConfirm.newStatus}</strong>, it cannot be changed back to{' '}
                    <strong>{statusConfirm.currentStatus}</strong>. Status changes only move forward.
                  </span>
                </div>
              </>
            )}

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStatusConfirm(null)}
                disabled={statusUpdating}
                className="px-5 py-2.5 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-[13px] font-bold text-gray-700 transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={statusUpdating}
                className={`px-5 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-colors cursor-pointer shadow-md flex items-center gap-2 ${
                  statusConfirm.newStatus === 'Delivered'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : statusConfirm.newStatus === 'Shipped'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                    : 'bg-[#ED2024] hover:bg-[#d4191d] shadow-[#ED2024]/20'
                }`}
              >
                {statusUpdating && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>
                  {statusConfirm.newStatus === 'Cancelled'
                    ? 'Confirm Cancellation & Issue Refund'
                    : 'Confirm & Update Status'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Full Order Details Modal                                                  */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp text-gray-900">
            {/* Modal Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[22px] font-mono font-black text-gray-900">
                    #{selectedOrder.orderNumber}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      selectedOrder.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : selectedOrder.status === 'Shipped'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : selectedOrder.status === 'Cancelled'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {selectedOrder.status || 'Confirmed'}
                  </span>
                </div>
                <div className="text-[12px] text-gray-500 mt-1">
                  Placed on {formatDateTime(selectedOrder.createdAt)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[500px] overflow-y-auto space-y-5">
              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-[14px] bg-gray-50 border border-gray-200">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Customer Information
                  </div>
                  <div className="text-[14px] font-bold text-gray-900 mt-1.5">
                    {selectedOrder.customer?.name}
                  </div>
                  <div className="text-[12.5px] text-gray-700 select-all">
                    {selectedOrder.customer?.email}
                  </div>
                  <div className="text-[12px] text-gray-500 mt-1">
                    Phone: {selectedOrder.customer?.phone || '—'}
                  </div>
                </div>

                <div className="p-4 rounded-[14px] bg-gray-50 border border-gray-200">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Delivery / Shipping Destination
                  </div>
                  <div className="text-[13px] text-gray-900 font-medium mt-1.5">
                    {selectedOrder.shippingAddress?.street || '—'}
                  </div>
                  <div className="text-[12.5px] text-gray-700">
                    {selectedOrder.shippingAddress?.city ? `${selectedOrder.shippingAddress.city}, ` : ''}
                    {selectedOrder.shippingAddress?.country || 'United Arab Emirates'}
                  </div>
                  <div className="text-[11.5px] text-gray-500 mt-1">
                    Method: Standard Tracked Delivery
                  </div>
                </div>
              </div>

              {/* Purchased Items List */}
              <div>
                <div className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-3">
                  Ordered Products ({selectedOrder.items?.length || 0})
                </div>
                <div className="rounded-[14px] bg-white border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-[#ED2024] text-[12px] shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-[13.5px] font-bold text-gray-900">{item.name}</div>
                            <div className="text-[12px] text-gray-500">
                              {formatPrice(item.price)} AED × {item.quantity || 1}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-[14px] text-gray-900 text-right shrink-0">
                          {formatPrice((item.price || 0) * (item.quantity || 1))} AED
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-[12px]">No item details found</div>
                  )}

                  {/* Receipt Subtotal */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between text-[14px] font-black border-t border-gray-200">
                    <span className="text-gray-600">Grand Total:</span>
                    <span className="text-[18px] text-[#ED2024]">
                      {formatPrice(selectedOrder.totalAmount)} {selectedOrder.currency || 'AED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment & Gateway Refund Telemetry Section */}
              <div className="p-4 rounded-[14px] bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em]">
                    Payment & Gateway Transaction
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      selectedOrder.paymentStatus === 'Refunded'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    ● {selectedOrder.paymentStatus || 'Paid'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Payment Method:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.paymentMethod || 'Credit / Debit Card (Apple Pay)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Payment Intent ID:</span>
                    <span className="font-mono text-[11.5px] text-gray-800 select-all">
                      {selectedOrder.paymentIntentId || 'pi_luma_live'}
                    </span>
                  </div>

                  {selectedOrder.paymentStatus === 'Refunded' && (
                    <>
                      <div>
                        <span className="text-gray-500 block text-[11px]">Gateway Refund ID:</span>
                        <span className="font-mono font-bold text-[11.5px] text-purple-700 select-all">
                          {selectedOrder.refundId || 'ref_luma_processed'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[11px]">Refund Processed At:</span>
                        <span className="font-medium text-gray-900">
                          {formatDateTime(selectedOrder.refundedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[11px]">Refunded Amount:</span>
                        <span className="font-extrabold text-purple-700">
                          {formatPrice(selectedOrder.refundAmount || selectedOrder.totalAmount)} {selectedOrder.currency || 'AED'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[11px]">Bank Reversal Timeline:</span>
                        <span className="font-bold text-emerald-700">
                          {selectedOrder.refundTimeline || '3 to 7 business days'}
                        </span>
                      </div>
                      <div className="sm:col-span-2 p-3 rounded-[10px] bg-purple-50/80 border border-purple-200 text-[12px] text-purple-900">
                        <div className="font-bold mb-0.5">
                          Cancellation Reason: <span className="font-normal">{selectedOrder.refundReason || 'Customer requested cancellation'}</span>
                        </div>
                        <div className="text-[11px] text-purple-700">
                          Funds automatically reversed via payment gateway to the customer's card.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Progressive One-Way Status Section inside Modal */}
              <div className="p-4 rounded-[14px] bg-gray-50 border border-gray-200">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-2">
                  Update Order Pipeline (One-Way Strict Rule)
                </div>

                {getAllowedForwardTransitions(selectedOrder.status).length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {getAllowedForwardTransitions(selectedOrder.status).map((act) => (
                      <button
                        key={act.status}
                        type="button"
                        onClick={() =>
                          setStatusConfirm({
                            order: selectedOrder,
                            currentStatus: selectedOrder.status,
                            newStatus: act.status,
                            actionLabel: act.label,
                          })
                        }
                        className={`px-4 py-2 rounded-[9px] text-[12px] font-bold text-white transition-all cursor-pointer shadow-sm ${act.color}`}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      Order is in its final state ({selectedOrder.status}). As per policy, this status cannot be reverted or changed.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 text-[13px] font-bold text-gray-700 transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
