import React, { useState, useEffect, useMemo } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api');

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, totalRedemptions: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage', // 'percentage' | 'fixed'
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscount: '',
    expirationDate: '',
    usageLimit: '',
    isActive: true,
    displayToCustomer: true,
  });

  // Delete Confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copy Feedback
  const [copiedCode, setCopiedCode] = useState(null);

  // Fetch all coupons
  const fetchCoupons = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons`);
      const data = await res.json();

      if (res.ok && data.success) {
        setCoupons(data.coupons || []);
        if (data.stats) setStats(data.stats);
      } else {
        setError(data.message || 'Failed to retrieve coupon records.');
      }
    } catch (err) {
      console.error('Error fetching admin coupons:', err);
      setError('Unable to connect to LUMA Backend Server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filter coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      // Status filter
      if (statusFilter === 'active' && !coupon.isActive) return false;
      if (statusFilter === 'inactive' && coupon.isActive) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchCode = coupon.code?.toLowerCase().includes(q);
      const matchTitle = coupon.title?.toLowerCase().includes(q);
      const matchDesc = coupon.description?.toLowerCase().includes(q);
      return matchCode || matchTitle || matchDesc;
    });
  }, [coupons, searchQuery, statusFilter]);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscount: '',
      expirationDate: '',
      usageLimit: '',
      isActive: true,
      displayToCustomer: true,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      title: coupon.title || '',
      description: coupon.description || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || 0,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscount: coupon.maxDiscount || '',
      expirationDate: coupon.expirationDate ? coupon.expirationDate.split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      isActive: Boolean(coupon.isActive),
      displayToCustomer: coupon.displayToCustomer !== undefined ? Boolean(coupon.displayToCustomer) : true,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setModalError(null);

    if (!formData.code.trim()) {
      setModalError('Coupon code is required.');
      return;
    }
    if (formData.discountValue === '' || Number(formData.discountValue) < 0) {
      setModalError('Valid discount value is required.');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        title: (formData.title || '').trim() || (formData.description || '').trim() || formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        isActive: formData.isActive,
        displayToCustomer: formData.displayToCustomer,
      };

      const url = editingCoupon
        ? `${API_BASE_URL}/admin/coupons/${editingCoupon._id}`
        : `${API_BASE_URL}/admin/coupons`;
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        setActionMessage(data.message || (editingCoupon ? 'Coupon updated!' : 'Coupon created!'));
        setTimeout(() => setActionMessage(null), 4000);
        fetchCoupons();
      } else {
        setModalError(data.message || 'Failed to save coupon.');
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
      setModalError('Connection error while saving coupon.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle active status
  const handleToggleStatus = async (coupon) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons/${coupon._id}/toggle`, {
        method: 'PATCH',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, isActive: !c.isActive } : c))
        );
        setActionMessage(data.message || `Coupon ${coupon.code} status updated.`);
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        setError(data.message || 'Failed to toggle status.');
      }
    } catch (err) {
      console.error('Error toggling coupon status:', err);
      setError('Connection error updating coupon status.');
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons/${deleteConfirmId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== deleteConfirmId));
        setDeleteConfirmId(null);
        setActionMessage(data.message || 'Coupon deleted successfully.');
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        setError(data.message || 'Failed to delete coupon.');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
      setError('Connection error deleting coupon.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="font-['Manrope'] pb-12">
      {/* ============================================================ */}
      {/* Header                                                       */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ED2024] text-[11px] font-bold uppercase tracking-[0.14em] mb-1">
            <span>Promotion &amp; Marketing Engine</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Checkout Sync
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Coupons &amp; Promotional Discounts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create discount vouchers that display to customers during payment and automatically subtract from their order total.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchCoupons(true)}
            disabled={refreshing}
            className="px-4 py-2 rounded-[10px] bg-white hover:bg-gray-50 border border-gray-300 text-[12px] font-bold uppercase tracking-wider text-gray-700 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span className={refreshing ? 'animate-spin' : ''}>↻</span>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-[10px] bg-[#ED2024] hover:bg-[#d61b1f] text-white text-[12px] font-bold uppercase tracking-wider transition-all shadow-md shadow-[#ED2024]/20 cursor-pointer flex items-center gap-2"
          >
            <span>+</span>
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Action / Success Banner */}
      {actionMessage && (
        <div className="mt-4 p-3.5 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">✓</span>
            <span>{actionMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-sm font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="mt-4 p-4 rounded-[12px] bg-[#ED2024]/10 border border-[#ED2024]/30 text-[#ED2024] text-[13px] flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-[#ED2024] font-bold hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* KPI Summary Cards                                            */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Total Coupons */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all hover:border-gray-300">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Total Coupons
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            {loading ? '—' : stats.total || coupons.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Configured in system</div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
            🏷️
          </div>
        </div>

        {/* Active Coupons */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all hover:border-gray-300">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Active in Checkout
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {loading ? '—' : coupons.filter((c) => c.isActive).length}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1 font-semibold">Available for customers</div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            ✓
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all hover:border-gray-300">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Total Redemptions
          </div>
          <div className="text-2xl font-black text-[#ED2024] mt-2">
            {loading ? '—' : coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Orders with coupon discount</div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-red-50 text-[#ED2024] flex items-center justify-center font-bold text-sm">
            🎟️
          </div>
        </div>

        {/* Inactive / Expired */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all hover:border-gray-300">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Inactive / Paused
          </div>
          <div className="text-2xl font-black text-gray-400 mt-2">
            {loading ? '—' : coupons.filter((c) => !c.isActive).length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Hidden from customers</div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm">
            ⏸
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Controls: Search & Tabs                                      */}
      {/* ============================================================ */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-[14px] border border-gray-200 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-[10px]">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All Coupons ({coupons.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-bold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Active ({coupons.filter((c) => c.isActive).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-bold transition-all cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-white text-gray-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Inactive ({coupons.filter((c) => !c.isActive).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code, title, discount..."
            className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] focus:bg-white rounded-[10px] pl-9 pr-3 py-2 text-[12.5px] text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Coupons Table                                                */}
      {/* ============================================================ */}
      <div className="mt-4 rounded-[16px] bg-white border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-[#ED2024] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px] font-semibold text-gray-600">Loading coupons database...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3 text-2xl">
              🏷️
            </div>
            <h3 className="text-base font-bold text-gray-900">No coupons found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
              {searchQuery
                ? `No coupon matches the query "${searchQuery}".`
                : 'No coupons have been created yet. Add your first coupon now!'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-[#ED2024] hover:bg-[#d61b1f] text-white text-xs font-bold uppercase tracking-wider rounded-[10px] transition-all shadow-md shadow-[#ED2024]/20 cursor-pointer"
            >
              + Create First Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
                <tr>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Checkout Visibility</th>
                  <th className="py-3.5 px-4 text-center">Discount Value</th>
                  <th className="py-3.5 px-4 text-center">Min Subtotal</th>
                  <th className="py-3.5 px-4 text-center">Validity / Expiry</th>
                  <th className="py-3.5 px-4 text-center">Redemptions</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Code */}
                    <td className="py-4 px-4 font-mono font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-[7px] bg-rose-50 border border-dashed border-[#ED2024]/40 text-[#ED2024] tracking-wider text-[12.5px]">
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(coupon.code)}
                          title="Copy Code"
                          className="text-gray-400 hover:text-gray-700 text-xs p-1 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          {copiedCode === coupon.code ? '✓' : '📋'}
                        </button>
                      </div>
                    </td>

                    {/* Checkout Visibility & Details */}
                    <td className="py-4 px-4 max-w-xs">
                      {coupon.displayToCustomer ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          👁️ Shown in Available Offers Modal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          🔒 Code Only (Hidden in Offers Modal)
                        </span>
                      )}
                      {coupon.description && (
                        <div className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                          {coupon.description}
                        </div>
                      )}
                    </td>

                    {/* Discount Value */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[12px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `AED ${coupon.discountValue} OFF`}
                      </span>
                    </td>

                    {/* Min Subtotal */}
                    <td className="py-4 px-4 text-center text-gray-600 text-xs">
                      {coupon.minOrderAmount > 0 ? (
                        <span className="font-semibold text-gray-800">
                          AED {coupon.minOrderAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">No Minimum</span>
                      )}
                    </td>

                    {/* Expiry */}
                    <td className="py-4 px-4 text-center text-xs text-gray-600">
                      {coupon.expirationDate ? (
                        <div>
                          <div className={new Date() > new Date(coupon.expirationDate) ? 'text-red-600 font-bold' : ''}>
                            {new Date(coupon.expirationDate).toLocaleDateString()}
                          </div>
                          {new Date() > new Date(coupon.expirationDate) && (
                            <span className="text-[10px] text-red-500 font-bold block">Expired</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-medium">Never Expires</span>
                      )}
                    </td>

                    {/* Redemptions */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {coupon.usedCount || 0} {coupon.usedCount === 1 ? 'Use' : 'Uses'}
                      </span>
                    </td>

                    {/* Active Status Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(coupon)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          coupon.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            coupon.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                        />
                        <span>{coupon.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(coupon)}
                          className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-[7px] transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(coupon._id)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-[7px] transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Modal: Create / Edit Coupon                                  */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => !isSaving && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-[20px] shadow-2xl border border-gray-200 overflow-hidden z-10 animate-scaleUp">
            {/* Modal Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ED2024] block">
                  {editingCoupon ? 'Update Promotion' : 'New Promotion'}
                </span>
                <h3 className="text-lg font-black text-gray-900">
                  {editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : 'Create Customer Coupon'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center cursor-pointer text-base"
              >
                &times;
              </button>
            </div>

            {/* Error Message */}
            {modalError && (
              <div className="m-6 mb-0 p-3 rounded-[10px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span>✕</span>
                <span>{modalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveCoupon} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })
                    }
                    placeholder="e.g. LUMA20, GLOW50"
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-gray-50 border border-gray-300 rounded-[8px] focus:bg-white focus:border-[#ED2024] focus:outline-none uppercase"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Codes are automatically uppercased.
                  </span>
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-[8px] focus:bg-white focus:border-[#ED2024] focus:outline-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%) Off</option>
                    <option value="fixed">Fixed Amount (AED) Off</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Discount Value */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Discount Value * ({formData.discountType === 'percentage' ? '%' : 'AED'})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? '15' : '150'}
                    className="w-full px-3 py-2 text-xs font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-[8px] focus:bg-white focus:border-[#ED2024] focus:outline-none"
                  />
                </div>

                {/* Min Subtotal */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Minimum Subtotal (AED)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="0 = No minimum"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-[8px] focus:bg-white focus:border-[#ED2024] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Expiration Date */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-[8px] focus:bg-white focus:border-[#ED2024] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Leave empty for no expiry.</span>
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Unlimited if empty"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-[8px] focus:bg-white focus:border-[#ED2024] focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="p-3.5 rounded-[12px] bg-gray-50 border border-gray-200 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.displayToCustomer}
                    onChange={(e) => setFormData({ ...formData, displayToCustomer: e.target.checked })}
                    className="w-4 h-4 text-[#ED2024] rounded border-gray-300 focus:ring-[#ED2024]"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    Display to customer in checkout available offers list
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#ED2024] rounded border-gray-300 focus:ring-[#ED2024]"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    Activate coupon immediately
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-[10px] text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-[10px] bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#ED2024]/20 cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Delete Confirmation Modal                                    */}
      {/* ============================================================ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => !isDeleting && setDeleteConfirmId(null)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-[20px] shadow-2xl border border-gray-200 p-6 z-10 text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#ED2024] flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              🗑️
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Coupon?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Are you sure you want to delete this coupon? Customers will no longer be able to use it during checkout.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCoupon}
                disabled={isDeleting}
                className="px-5 py-2 rounded-[10px] bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
