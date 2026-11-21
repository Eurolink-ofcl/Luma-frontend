import React, { useState, useEffect, useMemo } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function NewsletterManager({ onSubscribersCountChange }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Stats
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });

  // Action states
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch subscribers from backend
  const fetchSubscribers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/newsletter/subscribers?limit=200`);
      const data = await res.json();

      if (res.ok && data.success) {
        setSubscribers(data.data || []);
        if (data.stats) {
          setStats(data.stats);
          if (onSubscribersCountChange) {
            onSubscribersCountChange(data.stats.active || data.stats.total || 0);
          }
        }
      } else {
        throw new Error(data.message || 'Failed to fetch subscribers');
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message || 'Could not connect to newsletter service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filtered subscribers list
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchSearch =
        !searchQuery.trim() ||
        sub.email?.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchStatus =
        selectedStatus === 'all' || sub.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [subscribers, searchQuery, selectedStatus]);

  // Toggle status (active <-> unsubscribed)
  const handleToggleStatus = async (sub) => {
    const newStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
    setUpdatingId(sub._id);
    setActionMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/newsletter/subscribers/${sub._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers((prev) =>
          prev.map((item) => (item._id === sub._id ? { ...item, status: newStatus } : item))
        );
        setActionMessage({
          type: 'success',
          text: `Marked ${sub.email} as ${newStatus}`,
        });
        // Update stats
        setStats((prev) => ({
          ...prev,
          active: newStatus === 'active' ? prev.active + 1 : prev.active - 1,
          unsubscribed: newStatus === 'unsubscribed' ? prev.unsubscribed + 1 : prev.unsubscribed - 1,
        }));
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete subscriber
  const handleDelete = async (id, email) => {
    setActionMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/newsletter/subscribers/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers((prev) => prev.filter((item) => item._id !== id));
        setDeleteConfirmId(null);
        setActionMessage({
          type: 'success',
          text: `Removed ${email} from subscriber list`,
        });
      } else {
        throw new Error(data.message || 'Failed to delete subscriber');
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    window.open(`${API_BASE_URL}/admin/newsletter/export`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Newsletter Subscribers
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and export audience emails subscribed from the footer newsletter form
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchSubscribers(true)}
            disabled={refreshing || loading}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={subscribers.length === 0}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#0A0A0A] hover:bg-[#ED2024] rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
            actionMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-xs uppercase tracking-wider font-bold opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Total Audience
          </p>
          <p className="text-2xl font-black text-gray-900 mt-2">
            {stats.total || subscribers.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#16a34a]">
            Active Subscribers
          </p>
          <p className="text-2xl font-black text-[#16a34a] mt-2">
            {stats.active || subscribers.filter((s) => s.status === 'active').length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Unsubscribed
          </p>
          <p className="text-2xl font-black text-gray-600 mt-2">
            {stats.unsubscribed || subscribers.filter((s) => s.status === 'unsubscribed').length}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 focus:border-[#ED2024] rounded-xl outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Status:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer focus:border-[#ED2024]"
          >
            <option value="all">All Subscribers</option>
            <option value="active">Active Only</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            <svg
              className="w-6 h-6 animate-spin mx-auto text-[#ED2024] mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Loading newsletter subscribers...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-500 text-sm">
            {error}
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {searchQuery
              ? `No subscribers matching "${searchQuery}"`
              : 'No subscribers on record yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Subscriber Email</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Source</th>
                  <th className="py-3.5 px-6">Subscribed Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {sub.email}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {sub.status === 'active' ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-500 uppercase font-semibold">
                      {sub.source || 'footer'}
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-500">
                      {sub.subscribedAt
                        ? new Date(sub.subscribedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(sub)}
                          disabled={updatingId === sub._id}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {sub.status === 'active' ? 'Mark Unsubscribed' : 'Reactivate'}
                        </button>

                        {/* Delete button */}
                        {deleteConfirmId === sub._id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDelete(sub._id, sub.email)}
                              className="px-2 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(sub._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete subscriber"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
