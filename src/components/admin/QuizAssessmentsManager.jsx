import React, { useState, useEffect } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function QuizAssessmentsManager() {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    reviewedCount: 0,
    contactedCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (productFilter !== 'All') params.append('product', productFilter);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await fetch(`${API_BASE_URL}/admin/quiz-assessments?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setAssessments(data.assessments || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load quiz assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [statusFilter, productFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssessments();
  };

  const handleStatusChange = async (id, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/quiz-assessments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAssessments((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedAssessment?._id === id) {
          setSelectedAssessment((prev) => ({ ...prev, status: newStatus }));
        }
        setActionSuccess(`Status updated to ${newStatus}`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Status change error:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedAssessment) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/quiz-assessments/${selectedAssessment._id}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: adminNotes }),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setAssessments((prev) =>
          prev.map((item) =>
            item._id === selectedAssessment._id ? { ...item, notes: adminNotes } : item
          )
        );
        setSelectedAssessment((prev) => ({ ...prev, notes: adminNotes }));
        setActionSuccess('Admin notes updated successfully.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Save notes error:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment record?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/quiz-assessments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAssessments((prev) => prev.filter((item) => item._id !== id));
        if (selectedAssessment?._id === id) {
          setSelectedAssessment(null);
        }
        setActionSuccess('Record deleted.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Delete assessment error:', err);
    }
  };

  const openDetailModal = (item) => {
    setSelectedAssessment(item);
    setAdminNotes(item.notes || '');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ED2024]/10 text-[#ED2024] border border-[#ED2024]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ED2024] animate-pulse" />
            New
          </span>
        );
      case 'Reviewed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Reviewed
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Contacted
          </span>
        );
      case 'Archived':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const topProduct =
    stats?.productBreakdown && stats.productBreakdown.length > 0
      ? `${stats.productBreakdown[0]._id} (${stats.productBreakdown[0].count})`
      : 'LUMA Surge';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📋</span>
            <h2 className="text-xl font-bold text-[#0F172A]">Quiz Assessments Management</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ED2024]/10 text-[#ED2024]">
              {stats.total} Total
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Responses submitted by users from the homepage 1-Minute Light Assessment quiz.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAssessments}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1E293B] bg-white border border-[#E2E8F0] hover:bg-gray-50 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Live Data
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center justify-between">
          <span>✓ {actionSuccess}</span>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
            Total Submissions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F172A]">{stats.total}</span>
            <span className="text-xs text-[#64748B]">all-time</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
            New / Unreviewed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#ED2024]">{stats.newCount}</span>
            <span className="text-xs text-[#ED2024]/80">need attention</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
            Reviewed / Contacted
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">
              {(stats.reviewedCount || 0) + (stats.contactedCount || 0)}
            </span>
            <span className="text-xs text-gray-500">processed</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
            Top Matched Device
          </span>
          <div className="text-sm font-bold text-[#0F172A] truncate" title={topProduct}>
            {topProduct}
          </div>
          <span className="text-[11px] text-[#64748B]">highest match</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'New', 'Reviewed', 'Contacted', 'Archived'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-gray-100 text-[#475569] hover:bg-gray-200'
              }`}
            >
              {st}
              {st === 'New' && stats.newCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-[#ED2024] text-white text-[10px] rounded-full">
                  {stats.newCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, email, panel..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#ED2024] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#0F172A] outline-none"
            />
            <svg
              className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#ED2024] hover:bg-[#c9181b] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            <svg className="animate-spin h-7 w-7 text-[#ED2024] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading quiz submissions...
          </div>
        ) : assessments.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-2">
            <div className="text-3xl">📭</div>
            <p className="text-sm font-semibold text-gray-700">No quiz submissions found</p>
            <p className="text-xs text-gray-400">
              When users finish the 1-Minute assessment quiz on the website, their responses will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Recommended Device</th>
                  <th className="py-3 px-4">Answers Overview</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-xs">
                {assessments.map((item) => {
                  const createdDate = new Date(item.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* User */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-[#0F172A]">{item.userName}</div>
                        <div className="text-[11px] text-[#64748B]">
                          {item.userEmail || <span className="italic text-gray-400">No email provided</span>}
                        </div>
                        {item.userPhone && (
                          <div className="text-[11px] text-[#64748B]">{item.userPhone}</div>
                        )}
                        <span
                          className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.isGuest
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.isGuest ? 'Guest Visitor' : 'Customer Account'}
                        </span>
                      </td>

                      {/* Recommended Device */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-[#ED2024]">
                          {item.recommendedProduct?.name || 'LUMA Surge'}
                        </div>
                        <div className="text-[11px] text-[#64748B] line-clamp-1 max-w-xs">
                          {item.recommendedProduct?.headline || 'Balanced power'}
                        </div>
                      </td>

                      {/* Answers Preview */}
                      <td className="py-3 px-4 align-top max-w-xs">
                        <div className="space-y-0.5 text-[11px] text-[#334155]">
                          {item.answers?.slice(0, 3).map((a, i) => (
                            <div key={i} className="truncate">
                              <span className="text-[#94A3B8] font-medium">Q{i + 1}:</span>{' '}
                              <span className="font-medium">{a.selectedOptionTitle || '—'}</span>
                            </div>
                          ))}
                          {item.answers?.length > 3 && (
                            <div className="text-[10px] text-[#ED2024] font-medium">
                              +{item.answers.length - 3} more answers...
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 align-top text-[#64748B] whitespace-nowrap">
                        {createdDate}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetailModal(item)}
                            className="px-2.5 py-1 text-xs font-semibold bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-md transition-colors cursor-pointer"
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            title="Delete submission"
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      {/* Detail Modal Drawer */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#0F172A]">Assessment Breakdown</h3>
                  {getStatusBadge(selectedAssessment.status)}
                </div>
                <p className="text-xs text-[#64748B]">
                  Submitted on{' '}
                  {new Date(selectedAssessment.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* User Profile Card */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F172A]">{selectedAssessment.userName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                      {selectedAssessment.isGuest ? 'Guest' : 'Customer'}
                    </span>
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5">
                    {selectedAssessment.userEmail ? (
                      <a
                        href={`mailto:${selectedAssessment.userEmail}?subject=Your LUMA Light Therapy Assessment Recommendations`}
                        className="text-[#ED2024] hover:underline"
                      >
                        {selectedAssessment.userEmail}
                      </a>
                    ) : (
                      <span className="italic text-gray-400">No email registered</span>
                    )}
                    {selectedAssessment.userPhone && (
                      <span className="ml-2">• {selectedAssessment.userPhone}</span>
                    )}
                  </div>
                </div>

                {/* Status Switcher in Modal */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[#64748B]">Status:</label>
                  <select
                    value={selectedAssessment.status}
                    onChange={(e) =>
                      handleStatusChange(selectedAssessment._id, e.target.value)
                    }
                    className="bg-white border border-[#E2E8F0] text-xs font-semibold rounded-md px-2.5 py-1.5 text-[#0F172A] outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Matched Product Banner */}
              <div className="p-4 bg-[#0A0A0B] text-white rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ED2024] block">
                    RECOMMENDED MATCH
                  </span>
                  <div className="text-xl font-bold tracking-tight text-white mt-0.5">
                    {selectedAssessment.recommendedProduct?.name || 'LUMA Surge'}
                  </div>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    {selectedAssessment.recommendedProduct?.headline || 'Balanced power for the body in motion.'}
                  </p>
                </div>

                <a
                  href={`/products/${selectedAssessment.recommendedProduct?.slug || 'luma-surge'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#ED2024] hover:bg-[#c9181b] text-white text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
                >
                  View Product Page
                </a>
              </div>

              {/* Question & Chosen Answers List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  User Responses (All Questions):
                </h4>

                <div className="space-y-3">
                  {selectedAssessment.answers?.map((ans, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#64748B] uppercase">
                          {ans.questionTitle || `Question ${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Answered
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#0F172A]">
                        {ans.questionText || 'Quiz Question'}
                      </div>

                      <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/60 rounded-lg flex items-start gap-2">
                        <span className="text-emerald-600 font-bold text-sm">✓</span>
                        <div>
                          <span className="text-xs font-bold text-[#0F172A]">
                            {ans.selectedOptionTitle}
                          </span>
                          {ans.selectedOptionSubtitle && (
                            <p className="text-[11px] text-[#475569]">
                              {ans.selectedOptionSubtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Admin Follow-up Notes:
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Sent personalized email recommendation for Surge panel; customer interested in facial & muscle recovery."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#ED2024] rounded-lg p-3 text-xs text-[#0F172A] outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {isUpdatingStatus ? 'Saving...' : 'Save Internal Notes'}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
              {selectedAssessment.userEmail ? (
                <a
                  href={`mailto:${selectedAssessment.userEmail}?subject=Your LUMA Light Assessment Match: ${selectedAssessment.recommendedProduct?.name || 'LUMA Surge'}`}
                  className="text-xs font-semibold text-[#ED2024] hover:underline inline-flex items-center gap-1"
                >
                  ✉ Send Follow-up Email
                </a>
              ) : (
                <span className="text-xs text-gray-400">Anonymous visitor</span>
              )}

              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="px-4 py-1.5 bg-white border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] hover:bg-gray-50 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

