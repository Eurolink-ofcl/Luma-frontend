import React, { useState, useEffect } from 'react';
import ContentManagement from '../components/admin/ContentManagement';
import AboutCmsEditor from '../components/admin/AboutCmsEditor';
import CommunityCmsEditor from '../components/admin/CommunityCmsEditor';
import ProductsManager from '../components/admin/ProductsManager';
import CustomersManager from '../components/admin/CustomersManager';
import OrdersManager from '../components/admin/OrdersManager';
import EnquiriesManager from '../components/admin/EnquiriesManager';
import QuizAssessmentsManager from '../components/admin/QuizAssessmentsManager';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function AdminDashboardPage({ onNavigateHome, onNavigatePage, onLogout, adminUser }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerCount, setCustomerCount] = useState(null);
  const [enquiryCount, setEnquiryCount] = useState(null);
  const [quizCount, setQuizCount] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashRes, custRes, enqRes, quizRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/dashboard`),
        fetch(`${API_BASE_URL}/admin/customers`).catch(() => null),
        fetch(`${API_BASE_URL}/admin/enquiries`).catch(() => null),
        fetch(`${API_BASE_URL}/admin/quiz-assessments`).catch(() => null),
      ]);

      const data = await dashRes.json();
      if (custRes && custRes.ok) {
        const custData = await custRes.json();
        if (custData && typeof custData.count === 'number') {
          setCustomerCount(custData.count);
        }
      }
      if (enqRes && enqRes.ok) {
        const enqData = await enqRes.json();
        if (enqData && typeof enqData.unreadCount === 'number') {
          setEnquiryCount(enqData.unreadCount);
        }
      }
      if (quizRes && quizRes.ok) {
        const quizData = await quizRes.json();
        if (quizData && quizData.stats) {
          setQuizCount(quizData.stats.newCount > 0 ? quizData.stats.newCount : quizData.stats.total);
        }
      }

      if (dashRes.ok && data.success) {
        setDashboardData(data);
        setError(null);
      } else {
        setDashboardData(data);
        if (!data.database?.connected) {
          setError(
            data.message ||
              'Service connection pending. Please verify backend/.env settings.'
          );
        } else {
          setError(data.message || 'Failed to retrieve dashboard records.');
        }
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      setError(
        'Unable to connect to LUMA Backend Server (http://localhost:5000). Ensure the backend is running.'
      );
      setDashboardData(null);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const isDbConnected = Boolean(dashboardData?.database?.connected);
  const stats = dashboardData?.stats;
  const recentOrders = dashboardData?.recentOrders || [];

  // Main analytics & management items
  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      badge: 'Live',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: 'Products',
      badge: isDbConnected ? stats?.totalProducts : null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      badge: isDbConnected ? stats?.totalOrders : null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: 'customers',
      label: 'Customers',
      badge: isDbConnected && customerCount !== null ? customerCount : null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'enquiries',
      label: 'Enquiry',
      badge:
        isDbConnected && enquiryCount !== null
          ? enquiryCount > 0
            ? enquiryCount
            : null
          : stats?.unreadEnquiries
          ? stats.unreadEnquiries
          : null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'quiz-assessments',
      label: 'Quiz Assessments',
      badge:
        isDbConnected && quizCount !== null
          ? quizCount > 0
            ? `${quizCount} New`
            : null
          : stats?.newQuizAssessments > 0
          ? `${stats.newQuizAssessments} New`
          : null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  // CMS Page Content items
  const cmsNavItems = [
    {
      id: 'content-management',
      label: 'Content Management',
      badge: 'CMS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'cms-about',
      label: 'About Page',
      badge: 'CMS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'cms-community',
      label: 'Community Page',
      badge: isDbConnected && stats?.pendingQuestions > 0 ? `${stats.pendingQuestions} New` : 'CMS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'cms-reviews',
      label: 'Reviews Page',
      badge: isDbConnected && stats?.pendingStories > 0 ? `${stats.pendingStories} New` : 'CMS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  const handleOpenLiveAbout = () => {
    if (onNavigatePage) {
      onNavigatePage('about');
    } else {
      window.open('/about', '_blank');
    }
  };

  const handleOpenLiveCommunity = () => {
    if (onNavigatePage) {
      onNavigatePage('community');
    } else {
      window.open('/community', '_blank');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#111827] font-['Manrope'] select-none relative flex overflow-x-hidden">
      
      {/* Background Subtle Ambient Tint */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAFAFA]">
        <div className="absolute top-[8%] left-[60%] -translate-x-1/2 w-[650px] h-[300px] bg-[#ED2024]/[0.03] blur-[160px] rounded-full" />
      </div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ==================== LEFT SIDEBAR (SLEEK LUMA BLACK) ==================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[270px] bg-[#0D0D0D] border-r border-[#1F1F1F] shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand & Admin Console Header */}
        <div className="overflow-y-auto no-scrollbar">
          <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex flex-col items-start cursor-pointer group focus:outline-none text-left"
              title="Return to Public Store"
            >
              <img
                src="/assets/luma-logo.png"
                alt="LUMA"
                className="h-7 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
              <span className="text-[9.5px] font-bold tracking-[0.2em] text-[#ED2024] uppercase mt-1 pl-0.5">
                Admin Console
              </span>
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Live Connectivity Status Pill */}
          <div className="px-5 pt-4 pb-2">
            <div className="p-3 rounded-[12px] bg-[#161616] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isDbConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8E8E8E]">
                    Live Status
                  </span>
                  <span className="text-[11.5px] font-bold text-white truncate max-w-[140px]">
                    {isDbConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchDashboardData}
                disabled={loading}
                title="Refresh connection status"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <svg
                  className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar Section 1: Main Navigation */}
          <div className="px-4 py-3">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#7E7E7E] px-3 mb-2">
              Management
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all cursor-pointer group text-left ${
                      isActive
                        ? 'bg-[#ED2024] text-white shadow-[0_4px_16px_rgba(237,32,36,0.3)]'
                        : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-white/50 group-hover:text-white transition-colors'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white text-[#ED2024]'
                            : 'bg-[#ED2024] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Section 2: Content Management (Matches Reference Image) */}
          <div className="px-4 py-3 border-t border-white/[0.08]">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#7E7E7E] px-3 mb-2">
              Site Content
            </div>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('content-management');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all cursor-pointer group text-left ${
                  activeTab === 'content-management' || activeTab === 'cms-about' || activeTab === 'cms-community' || activeTab === 'cms-reviews'
                    ? 'bg-[#ED2024] text-white shadow-[0_4px_16px_rgba(237,32,36,0.3)]'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className={activeTab === 'content-management' || activeTab === 'cms-about' || activeTab === 'cms-community' || activeTab === 'cms-reviews' ? 'text-white shrink-0' : 'text-white/50 group-hover:text-white transition-colors shrink-0'}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <span className="whitespace-nowrap">Content Management</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom: User Info & Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0A0A0A] space-y-3">
          {/* Admin User Card */}
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-[#ED2024] text-white flex items-center justify-center font-black text-[12px] shrink-0 shadow-md">
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-bold text-white truncate">
                LUMA Admin
              </span>
              <span className="text-[11px] text-[#7E7E7E] truncate">
                {adminUser?.email || 'admin@luma.com'}
              </span>
            </div>
          </div>

          {/* Quick Actions: Return to Store & Sign Out */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11.5px]">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-[8px] bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white transition-colors cursor-pointer font-bold"
            >
              <span>← Store</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-[8px] bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors cursor-pointer font-bold"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT WRAPPER ==================== */}
      <div className="flex-1 lg:pl-[270px] flex flex-col min-h-screen w-full relative z-10">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md px-5 sm:px-8 py-3.5 flex items-center justify-between text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 hover:text-black focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Current Section Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-[0.1em] hidden sm:inline">
                Console
              </span>
              <span className="text-gray-300 hidden sm:inline">/</span>
              <span
                style={
                  activeTab === 'content-management' || activeTab === 'cms-about' || activeTab === 'cms-community' || activeTab === 'cms-reviews'
                    ? { fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }
                    : undefined
                }
                className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 uppercase tracking-[0.06em] flex items-center gap-2"
              >
                <span
                  className="w-2 h-2 rounded-full bg-[#ED2024]"
                />
                {activeTab === 'content-management' || activeTab === 'cms-about' || activeTab === 'cms-community' || activeTab === 'cms-reviews'
                  ? 'CONTENT MANAGEMENT'
                  : [...mainNavItems, ...cmsNavItems].find((n) => n.id === activeTab)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 text-[12px]">
            {/* Public Website Button (Exactly matching reference screenshot) */}
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-md border border-[#D1D5DB] text-[#475569] hover:text-[#1E293B] hover:bg-gray-50 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              PUBLIC WEBSITE
            </button>

            {/* Notification Bell Icon with Red Dot (Exactly matching reference screenshot) */}
            <div className="relative p-1.5 text-gray-600 hover:text-black cursor-pointer transition-colors" title="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ED2024]" />
            </div>

            {/* Refresh Live DB Button */}
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 shadow-sm transition-all cursor-pointer disabled:opacity-50 font-semibold"
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 px-5 sm:px-8 lg:px-10 py-7 max-w-[1440px] w-full">
          
          {/* ==================== ACTIVE VIEW: UNIFIED CONTENT MANAGEMENT ==================== */}
          {(activeTab === 'content-management' || activeTab === 'cms-about' || activeTab === 'cms-community' || activeTab === 'cms-reviews') && (
            <ContentManagement
              onNavigatePage={onNavigatePage}
              initialTab={activeTab === 'cms-about' ? 'about-cms' : activeTab === 'cms-community' ? 'community-cms' : activeTab === 'cms-reviews' ? 'reviews-cms' : 'homepage-text'}
            />
          )}

          {/* ==================== ACTIVE VIEW: PRODUCTS CRUD MANAGEMENT ==================== */}
          {activeTab === 'products' && (
            <ProductsManager
              onNavigateStorefront={onNavigateHome}
              onNavigateToProduct={(slug) => {
                if (onNavigatePage) {
                  onNavigatePage(slug || 'products');
                } else {
                  window.open(`/products/${slug}`, '_blank');
                }
              }}
            />
          )}

          {/* ==================== ACTIVE VIEW: CUSTOMERS MANAGEMENT ==================== */}
          {activeTab === 'customers' && (
            <CustomersManager />
          )}

          {/* ==================== ACTIVE VIEW: ORDERS MANAGEMENT ==================== */}
          {activeTab === 'orders' && (
            <OrdersManager />
          )}

          {/* ==================== ACTIVE VIEW: ENQUIRIES MANAGEMENT ==================== */}
          {activeTab === 'enquiries' && (
            <EnquiriesManager onUnreadCountChange={setEnquiryCount} />
          )}

          {/* ==================== ACTIVE VIEW: QUIZ ASSESSMENTS MANAGEMENT ==================== */}
          {activeTab === 'quiz-assessments' && (
            <QuizAssessmentsManager />
          )}

          {/* ==================== ACTIVE VIEW: DASHBOARD ==================== */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Page Title & Last Sync */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-gray-200 gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[#ED2024] text-[11px] font-bold uppercase tracking-[0.14em] mb-1">
                    <span>LUMA Enterprise Management</span>
                    <span>•</span>
                    <span>Live Telemetry</span>
                  </div>
                  <h1 className="text-[24px] sm:text-[30px] font-extrabold uppercase tracking-[0.02em] text-gray-900">
                    Admin Dashboard
                  </h1>
                </div>

                {lastRefreshed && (
                  <div className="text-[11px] sm:text-[12px] text-gray-500">
                    Last synced: <span className="text-gray-900 font-semibold">{lastRefreshed.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>

              {/* Disconnected Alert Notice */}
              {!isDbConnected && (
                <div className="mt-6 p-4 sm:p-5 rounded-[16px] bg-[#ED2024]/5 border border-[#ED2024]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#ED2024]/10 text-[#ED2024] shrink-0 mt-0.5 sm:mt-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-[0.02em]">
                        Connection Pending
                      </h3>
                      <p className="mt-0.5 text-[12.5px] text-gray-600 leading-relaxed">
                        {error || 'Live connection pending. Once connected, real-time products, orders, and total cash will populate directly.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={fetchDashboardData}
                    className="px-4 py-2 rounded-[10px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[12px] font-semibold uppercase tracking-[0.05em] shrink-0 transition-colors cursor-pointer"
                  >
                    Check Connection
                  </button>
                </div>
              )}

              {/* ==================== 4 STATS CARDS ==================== */}
              <section className="mt-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  
                  {/* Card 1: All Products */}
                  <div
                    onClick={() => setActiveTab('products')}
                    className="rounded-[16px] bg-white border border-gray-200 p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-gray-500 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] group-hover:text-gray-900 transition-colors">
                        All Products
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#ED2024]/10 border border-[#ED2024]/20 flex items-center justify-center text-[#ED2024] group-hover:bg-[#ED2024] group-hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>

                    <div className="text-[28px] sm:text-[34px] font-extrabold text-gray-900 tracking-tight">
                      {loading ? (
                        <span className="text-gray-300 animate-pulse text-[24px]">Loading...</span>
                      ) : isDbConnected ? (
                        stats?.totalProducts ?? 0
                      ) : (
                        <span className="text-gray-300 text-[22px]">--</span>
                      )}
                    </div>

                    <p className="mt-2 text-[11.5px] text-gray-400">
                      {isDbConnected ? 'Active catalog models' : 'Awaiting connection'}
                    </p>
                  </div>

                  {/* Card 2: Today's Orders */}
                  <div
                    onClick={() => setActiveTab('orders')}
                    className="rounded-[16px] bg-white border border-gray-200 p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-gray-500 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] group-hover:text-gray-900 transition-colors">
                        Today's Orders
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#ED2024]/10 border border-[#ED2024]/20 flex items-center justify-center text-[#ED2024] group-hover:bg-[#ED2024] group-hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="text-[28px] sm:text-[34px] font-extrabold text-gray-900 tracking-tight">
                      {loading ? (
                        <span className="text-gray-300 animate-pulse text-[24px]">Loading...</span>
                      ) : isDbConnected ? (
                        stats?.todaysOrders ?? 0
                      ) : (
                        <span className="text-gray-300 text-[22px]">--</span>
                      )}
                    </div>

                    <p className="mt-2 text-[11.5px] text-gray-400">
                      {isDbConnected ? 'Orders placed in the last 24 hours' : 'Awaiting connection'}
                    </p>
                  </div>

                  {/* Card 3: Total Cash */}
                  <div className="rounded-[16px] bg-white border border-gray-200 p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
                    <div className="flex items-center justify-between text-gray-500 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                        Total Cash
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#ED2024]/10 border border-[#ED2024]/20 flex items-center justify-center text-[#ED2024]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="text-[28px] sm:text-[34px] font-extrabold text-[#ED2024] tracking-tight">
                      {loading ? (
                        <span className="text-gray-300 animate-pulse text-[24px]">Loading...</span>
                      ) : isDbConnected ? (
                        `${(stats?.totalCash ?? 0).toLocaleString()} AED`
                      ) : (
                        <span className="text-gray-300 text-[22px]">-- AED</span>
                      )}
                    </div>

                    <p className="mt-2 text-[11.5px] text-gray-400">
                      {isDbConnected ? 'Gross cash volume' : 'Awaiting connection'}
                    </p>
                  </div>

                  {/* Card 4: Total Orders */}
                  <div className="rounded-[16px] bg-white border border-gray-200 p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300">
                    <div className="flex items-center justify-between text-gray-500 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                        Total Orders
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#ED2024]/10 border border-[#ED2024]/20 flex items-center justify-center text-[#ED2024]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>

                    <div className="text-[28px] sm:text-[34px] font-extrabold text-gray-900 tracking-tight">
                      {loading ? (
                        <span className="text-gray-300 animate-pulse text-[24px]">Loading...</span>
                      ) : isDbConnected ? (
                        stats?.totalOrders ?? 0
                      ) : (
                        <span className="text-gray-300 text-[22px]">--</span>
                      )}
                    </div>

                    <p className="mt-2 text-[11.5px] text-gray-400">
                      {isDbConnected ? 'Lifetime orders' : 'Awaiting connection'}
                    </p>
                  </div>

                </div>
              </section>

              {/* ==================== RECENT ORDERS TABLE ==================== */}
              <section className="mt-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <div>
                    <h2 className="text-[18px] sm:text-[20px] font-extrabold uppercase tracking-[0.02em] text-gray-900">
                      Recent Orders (Latest 5)
                    </h2>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      Direct live order records
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-gray-500 hidden sm:inline">
                      Showing {recentOrders.length} of 5 max
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="px-3 py-1.5 rounded-lg bg-[#ED2024]/10 hover:bg-[#ED2024] text-[#ED2024] hover:text-white border border-[#ED2024]/30 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Manage Orders →
                    </button>
                  </div>
                </div>

                {/* Table Container */}
                <div className="rounded-[16px] bg-white border border-gray-200 overflow-hidden shadow-sm">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
                          <th className="py-3.5 px-5">Order ID</th>
                          <th className="py-3.5 px-5">Customer</th>
                          <th className="py-3.5 px-5">Items</th>
                          <th className="py-3.5 px-5">Total Cash</th>
                          <th className="py-3.5 px-5">Order Status</th>
                          <th className="py-3.5 px-5">Payment</th>
                          <th className="py-3.5 px-5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[12.5px]">
                        {loading ? (
                          <tr>
                            <td colSpan="7" className="py-12 text-center text-gray-400">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-[#ED2024]" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Querying live records...</span>
                              </div>
                            </td>
                          </tr>
                        ) : !isDbConnected ? (
                          <tr>
                            <td colSpan="7" className="py-12 text-center text-gray-500">
                              <div className="max-w-[420px] mx-auto flex flex-col items-center gap-2">
                                <svg className="w-8 h-8 text-[#ED2024]/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                                <span className="font-semibold text-gray-800">Connection Offline</span>
                                <span className="text-[12px] text-gray-500">
                                  Please ensure the backend service is running. No mock data is displayed.
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : recentOrders.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="py-12 text-center text-gray-500">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-semibold text-gray-700">No Orders Recorded Yet</span>
                                <span className="text-[12px] text-gray-400">
                                  0 orders found. Live orders will appear here in real time.
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          recentOrders.map((order) => {
                            const itemCount = order.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
                            const formattedDate = order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '--';

                            return (
                              <tr
                                key={order._id || order.orderNumber}
                                className="hover:bg-gray-50/70 transition-colors"
                              >
                                <td className="py-3.5 px-5 font-mono font-medium text-gray-800">
                                  {order.orderNumber || order._id}
                                </td>
                                <td className="py-3.5 px-5">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">{order.customer?.name || 'Guest'}</span>
                                    <span className="text-[11px] text-gray-500">{order.customer?.email || '--'}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-5 text-gray-600">
                                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                </td>
                                <td className="py-3.5 px-5 font-bold text-[#ED2024]">
                                  {(order.totalAmount || 0).toLocaleString()} {order.currency || 'AED'}
                                </td>
                                <td className="py-3.5 px-5">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                                      order.status === 'Returned' || order.returnStatus === 'Approved'
                                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                        : order.status === 'Delivered'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : order.status === 'Processing' || order.status === 'Shipped'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : order.status === 'Cancelled'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}
                                  >
                                    {order.status === 'Returned' || order.returnStatus === 'Approved'
                                      ? 'Returned & Refunded'
                                      : order.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-5">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-semibold uppercase tracking-wider ${
                                      order.paymentStatus === 'Paid'
                                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                        : order.paymentStatus === 'Refunded'
                                        ? 'text-purple-700 bg-purple-50 border border-purple-200'
                                        : 'text-amber-700 bg-amber-50 border border-amber-200'
                                    }`}
                                  >
                                    ● {order.paymentStatus || 'Pending'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-5 text-[11.5px] text-gray-500">
                                  {formattedDate}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ==================== ACTIVE VIEW: OTHER TABS ==================== */}
          {activeTab !== 'dashboard' &&
            activeTab !== 'cms-about' &&
            activeTab !== 'cms-community' &&
            activeTab !== 'cms-reviews' &&
            activeTab !== 'products' &&
            activeTab !== 'customers' &&
            activeTab !== 'orders' &&
            activeTab !== 'enquiries' && (
            <div className="py-8">
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.06] mb-8">
                <div>
                  <div className="text-[#ED2024] text-[11px] font-bold uppercase tracking-[0.14em] mb-1">
                    Management Section
                  </div>
                  <h1 className="text-[26px] font-extrabold uppercase tracking-[0.02em] text-[#FFFFFF]">
                    {[...mainNavItems, ...cmsNavItems].find((n) => n.id === activeTab)?.label}
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 rounded-[10px] bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[12px] text-white/90 font-medium transition-colors cursor-pointer"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="p-10 rounded-[18px] bg-[#121212]/90 border border-white/[0.08] text-center max-w-[650px] mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#ED2024]/10 border border-[#ED2024]/20 text-[#ED2024] mx-auto flex items-center justify-center mb-4">
                  {[...mainNavItems, ...cmsNavItems].find((n) => n.id === activeTab)?.icon}
                </div>
                <h3 className="text-[18px] font-bold text-white uppercase tracking-[0.02em] mb-2">
                  {[...mainNavItems, ...cmsNavItems].find((n) => n.id === activeTab)?.label} Management
                </h3>
                <p className="text-[13px] text-[#8E8E8E] leading-relaxed mb-6">
                  {isDbConnected
                    ? `Live collection. Records and controls are synchronized in real time.`
                    : `This section is linked directly to your backend. Records will populate without any mock or fallback data.`}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 rounded-[10px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[12px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer shadow-[0_0_20px_rgba(237,32,36,0.25)]"
                >
                  View Main Dashboard
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/[0.06] bg-[#0A0A0A]/40 py-4 px-6 text-center text-[11px] text-[#666666] mt-auto">
          <p>
            &copy; {new Date().getFullYear()} LUMA Phototherapy & Health Technologies Inc. &middot; Admin Console & CMS
          </p>
        </footer>

      </div>

    </div>
  );
}
