import React, { useState, useEffect, useMemo } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

const STATUS_OPTIONS = ['New', 'Read', 'Archived'];

const SUBJECT_CATEGORIES = [
  'General Enquiry',
  'Product Support & Question',
  'Order & Delivery Status',
  'Partnership & Media',
  'Warranty & Replacement',
];

export default function EnquiriesManager({ onUnreadCountChange }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Detail Modal & Action States
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch enquiries from backend
  const fetchEnquiries = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/enquiries`);
      const data = await res.json();

      if (res.ok && data.success) {
        setEnquiries(data.enquiries || []);
        if (typeof onUnreadCountChange === 'function' && typeof data.unreadCount === 'number') {
          onUnreadCountChange(data.unreadCount);
        }
        setError(null);
      } else {
        setError(data.message || 'Failed to retrieve enquiries.');
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError('Unable to connect to LUMA Backend Server (http://localhost:5000).');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Update Status
  const handleUpdateStatus = async (enquiryId, newStatus) => {
    setUpdatingStatusId(enquiryId);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setEnquiries((prev) =>
          prev.map((item) =>
            (item._id === enquiryId || item.id === enquiryId) ? data.enquiry : item
          )
        );
        if (selectedEnquiry && (selectedEnquiry._id === enquiryId || selectedEnquiry.id === enquiryId)) {
          setSelectedEnquiry(data.enquiry);
        }
        setActionMessage(`Enquiry status updated to "${newStatus}"`);
        setTimeout(() => setActionMessage(null), 3500);

        // Recalculate unread count
        const newUnread = enquiries
          .map((item) => (item._id === enquiryId || item.id === enquiryId ? data.enquiry : item))
          .filter((item) => item.status === 'New').length;
        if (typeof onUnreadCountChange === 'function') {
          onUnreadCountChange(newUnread);
        }
      } else {
        alert(data.message || 'Failed to update enquiry status.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Network error while updating status.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Save Admin Notes
  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/enquiries/${selectedEnquiry._id || selectedEnquiry.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: adminNotes }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setEnquiries((prev) =>
          prev.map((item) =>
            (item._id === selectedEnquiry._id || item.id === selectedEnquiry.id) ? data.enquiry : item
          )
        );
        setSelectedEnquiry(data.enquiry);
        setActionMessage('Internal admin notes saved.');
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        alert(data.message || 'Failed to save notes.');
      }
    } catch (err) {
      console.error('Error saving notes:', err);
      alert('Network error while saving notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (enquiryId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/enquiries/${enquiryId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setEnquiries((prev) => prev.filter((item) => item._id !== enquiryId && item.id !== enquiryId));
        if (selectedEnquiry && (selectedEnquiry._id === enquiryId || selectedEnquiry.id === enquiryId)) {
          setSelectedEnquiry(null);
        }
        setDeleteConfirmId(null);
        setActionMessage('Enquiry removed permanently.');
        setTimeout(() => setActionMessage(null), 3500);

        // Update unread count
        const remainingUnread = enquiries
          .filter((item) => item._id !== enquiryId && item.id !== enquiryId)
          .filter((item) => item.status === 'New').length;
        if (typeof onUnreadCountChange === 'function') {
          onUnreadCountChange(remainingUnread);
        }
      } else {
        alert(data.message || 'Failed to delete enquiry.');
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      alert('Network error while deleting enquiry.');
    }
  };

  // Open modal and auto-mark 'New' as 'Read'
  const handleOpenDetailModal = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    setAdminNotes(enquiry.notes || '');

    if (enquiry.status === 'New') {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/enquiries/${enquiry._id || enquiry.id}`);
        const data = await res.json();
        if (res.ok && data.success && data.enquiry) {
          setSelectedEnquiry(data.enquiry);
          setEnquiries((prev) =>
            prev.map((item) =>
              (item._id === enquiry._id || item.id === enquiry.id) ? data.enquiry : item
            )
          );
          const newUnread = enquiries
            .map((item) => ((item._id === enquiry._id || item.id === enquiry.id) ? data.enquiry : item))
            .filter((item) => item.status === 'New').length;
          if (typeof onUnreadCountChange === 'function') {
            onUnreadCountChange(newUnread);
          }
        }
      } catch (err) {
        console.error('Error fetching enquiry details:', err);
      }
    }
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'New').length;
    const readCount = enquiries.filter((e) => e.status === 'Read').length;
    const productOrOrdersCount = enquiries.filter((e) =>
      e.subject === 'Product Support & Question' || e.subject === 'Order & Delivery Status'
    ).length;

    return { total, newCount, readCount, productOrOrdersCount };
  }, [enquiries]);

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Subject filter
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (item.fullName || `${item.firstName || ''} ${item.lastName || ''}`).toLowerCase();
        const email = (item.email || '').toLowerCase();
        const phone = (item.phone || '').toLowerCase();
        const subj = (item.subject || '').toLowerCase();
        const msg = (item.message || '').toLowerCase();

        return (
          name.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          subj.includes(q) ||
          msg.includes(q)
        );
      }
      return true;
    });
  }, [enquiries, selectedStatus, selectedSubject, searchQuery]);

  // Helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateStr);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-[#ED2024] border border-red-200 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ED2024] animate-pulse" />
            New
          </span>
        );
      case 'Read':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
            Read
          </span>
        );
      case 'Replied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Replied
          </span>
        );
      case 'Archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Product Support & Question':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Order & Delivery Status':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Warranty & Replacement':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Partnership & Media':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
            Customer Enquiries
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Incoming contact messages, support requests, and product consultations received from the Contact Us page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchEnquiries(true)}
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
        {/* Total Enquiries */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Total Enquiries
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
            {metrics.total}
          </div>
          <div className="mt-1 text-[11.5px] text-gray-500 font-medium">
            Lifetime Submissions
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        </div>

        {/* New / Unread */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            New / Unread
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-[#ED2024] tracking-tight">
            {metrics.newCount}
          </div>
          <div className="mt-1 text-[11.5px] text-[#ED2024] font-semibold flex items-center gap-1">
            {metrics.newCount > 0 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ED2024] animate-ping" />
                Requires Attention
              </>
            ) : (
              'All Caught Up'
            )}
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-[#ED2024]/10 border border-[#ED2024]/20 flex items-center justify-center text-[#ED2024]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        {/* Read / Reviewed */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Read / Reviewed
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
            {metrics.readCount}
          </div>
          <div className="mt-1 text-[11.5px] text-sky-600 font-semibold">
            Inquiries Reviewed
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        {/* Product & Order Support */}
        <div className="p-5 rounded-[16px] bg-white border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
            Support & Orders
          </div>
          <div className="mt-2 text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight">
            {metrics.productOrOrdersCount}
          </div>
          <div className="mt-1 text-[11.5px] text-purple-600 font-semibold">
            Product & Order Queries
          </div>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Controls: Search, Filter Tabs & Subject Filter                           */}
      {/* ========================================================================= */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, subject, or message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-[12px] bg-white border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ED2024] shadow-xs transition-colors"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-[12px]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right: Status Filter Tabs + Subject Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-[10px] bg-gray-100 border border-gray-200">
            {['all', 'New', 'Read', 'Archived'].map((status) => {
              const count = status === 'all'
                ? enquiries.length
                : enquiries.filter((e) => e.status === status).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-[8px] text-[11.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedStatus === status
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="capitalize">{status}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedStatus === status
                        ? status === 'New' && count > 0
                          ? 'bg-red-100 text-[#ED2024] font-extrabold'
                          : 'bg-gray-100 text-gray-700'
                        : 'bg-gray-200/60 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-[10px] bg-white border border-gray-200 text-[12px] font-semibold text-gray-700 focus:outline-none focus:border-[#ED2024] cursor-pointer shadow-xs"
          >
            <option value="all">All Subjects</option>
            {SUBJECT_CATEGORIES.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Table: Enquiries List                                                    */}
      {/* ========================================================================= */}
      <div className="mt-5 rounded-[16px] bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-500 text-[11px] font-bold uppercase tracking-[0.08em]">
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Subject</th>
                <th className="py-3.5 px-5">Message Preview</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Date Received</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#ED2024] border-t-transparent rounded-full animate-spin" />
                      <span>Loading customer enquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700">No enquiries found</span>
                      <span className="text-[12px] text-gray-400">
                        {searchQuery || selectedStatus !== 'all' || selectedSubject !== 'all'
                          ? 'Try adjusting your search query or filters.'
                          : 'Customer messages submitted via the Contact Us form will appear here.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => {
                  const displayName = enquiry.fullName || `${enquiry.firstName || ''} ${enquiry.lastName || ''}`.trim() || 'Anonymous';
                  const initial = (enquiry.firstName || displayName || 'C')[0].toUpperCase();

                  return (
                    <tr
                      key={enquiry._id || enquiry.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        enquiry.status === 'New' ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* Customer Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[12px] text-white shrink-0 ${
                            enquiry.status === 'New' ? 'bg-[#ED2024]' : 'bg-gray-700'
                          }`}>
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate">
                              {displayName}
                            </div>
                            <div className="text-[11.5px] text-gray-500 truncate flex items-center gap-2">
                              <span>{enquiry.email}</span>
                              {enquiry.phone && (
                                <>
                                  <span>•</span>
                                  <span>{enquiry.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getSubjectColor(enquiry.subject)}`}>
                          {enquiry.subject || 'General Enquiry'}
                        </span>
                      </td>

                      {/* Message Preview */}
                      <td className="py-4 px-5 max-w-[280px]">
                        <p className="text-[12.5px] text-gray-600 line-clamp-2 leading-relaxed">
                          {enquiry.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {getStatusBadge(enquiry.status)}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 whitespace-nowrap text-[12px] text-gray-500">
                        {formatDate(enquiry.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full Message */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetailModal(enquiry)}
                            className="px-3 py-1.5 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11.5px] font-semibold transition-colors cursor-pointer"
                          >
                            View Details
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(enquiry._id || enquiry.id)}
                            className="p-1.5 rounded-[8px] text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Enquiry"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="py-3 px-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-[11.5px] text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{filteredEnquiries.length}</strong> of{' '}
            <strong className="text-gray-900">{enquiries.length}</strong> enquiries
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
              {metrics.newCount} New
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              {metrics.readCount} Read
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Modal: Full Enquiry Detail View                                          */}
      {/* ========================================================================= */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-[20px] shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/75">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ED2024] text-white flex items-center justify-center font-bold text-[14px]">
                  {(selectedEnquiry.firstName || 'C')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-gray-900">
                    {selectedEnquiry.fullName || `${selectedEnquiry.firstName || ''} ${selectedEnquiry.lastName || ''}`.trim() || 'Customer Enquiry'}
                  </h3>
                  <div className="text-[12px] text-gray-500 flex items-center gap-2 mt-0.5">
                    <span>Received: {formatDate(selectedEnquiry.createdAt)}</span>
                    <span>•</span>
                    {getStatusBadge(selectedEnquiry.status)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[13px]">
              {/* Contact Information Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-[14px] bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="text-[#ED2024] font-semibold hover:underline flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {selectedEnquiry.email}
                  </a>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Phone Number
                  </span>
                  {selectedEnquiry.phone ? (
                    <a
                      href={`tel:${selectedEnquiry.phone.replace(/\s+/g, '')}`}
                      className="text-gray-900 font-semibold hover:text-[#ED2024] flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {selectedEnquiry.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>

              {/* Subject Tag */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Enquiry Subject
                </span>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[12px] font-bold border ${getSubjectColor(selectedEnquiry.subject)}`}>
                  {selectedEnquiry.subject || 'General Enquiry'}
                </span>
              </div>

              {/* Message Content */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Message Content
                </span>
                <div className="p-4 rounded-[14px] bg-white border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap font-normal text-[13.5px] select-text shadow-xs">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Update Enquiry Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updatingStatusId === (selectedEnquiry._id || selectedEnquiry.id)}
                      onClick={() => handleUpdateStatus(selectedEnquiry._id || selectedEnquiry.id, status)}
                      className={`py-2 px-3 rounded-[10px] text-[12px] font-bold border transition-all cursor-pointer ${
                        selectedEnquiry.status === status
                          ? 'bg-[#ED2024] text-white border-[#ED2024] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Internal Notes (Visible only to Admin)
                </span>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add private notes on follow-up, customer response, or resolution..."
                  className="w-full p-3 rounded-[12px] bg-white border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ED2024] transition-colors resize-none shadow-xs"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-4 py-1.5 rounded-[8px] bg-gray-900 hover:bg-black text-white text-[12px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50/75 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmId(selectedEnquiry._id || selectedEnquiry.id);
                }}
                className="text-rose-600 hover:text-rose-700 text-[12px] font-semibold cursor-pointer"
              >
                Delete Enquiry
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-5 py-2 rounded-[10px] bg-gray-900 hover:bg-black text-white text-[12px] font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Delete Confirmation Dialog                                               */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-[20px] p-6 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-[18px] font-extrabold text-gray-900 text-center mb-2">
              Delete Enquiry?
            </h3>
            <p className="text-[13px] text-gray-500 text-center leading-relaxed mb-6">
              This enquiry will be permanently removed from your records. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12.5px] font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEnquiry(deleteConfirmId)}
                className="py-2.5 rounded-[10px] bg-rose-600 hover:bg-rose-700 text-white text-[12.5px] font-bold transition-colors cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

