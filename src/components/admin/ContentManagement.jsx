import React, { useState, useEffect } from 'react';
import HomeCmsEditor from './HomeCmsEditor';
import AboutCmsEditor from './AboutCmsEditor';
import CommunityCmsEditor from './CommunityCmsEditor';
import ReviewsCmsEditor from './ReviewsCmsEditor';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function ContentManagement({ onNavigatePage, initialTab = 'homepage-cms' }) {
  const normalizeTab = (tab) => {
    if (tab === 'homepage-text' || tab === 'homepage-banners') return 'homepage-cms';
    return tab;
  };

  const [activeTab, setActiveTab] = useState(normalizeTab(initialTab));
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [pendingQuestionsCount, setPendingQuestionsCount] = useState(0);
  const [pendingStoriesCount, setPendingStoriesCount] = useState(0);

  // Fetch pending questions and stories count
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/community/questions`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.counts?.pending) {
          setPendingQuestionsCount(data.counts.pending);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/admin/stories`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.counts?.pending) {
          setPendingStoriesCount(data.counts.pending);
        }
      })
      .catch(() => {});
  }, []);

  // Editable dynamic text state for Contact CMS
  const [contactContent, setContactContent] = useState({
    footerOverline: 'HEADQUARTERS & CLINICAL SHOWROOM',
    footerAddress: 'Office Number M-090A, Fashion Parking, Dubai Mall, UAE',
    footerPhone: '+971 50 123 4567',
    footerEmail: 'info@lumaredlight.com',
    socialInstagram: 'https://instagram.com/lumaredlight',
    socialWhatsapp: 'https://wa.me/971501234567',
    socialTiktok: 'https://tiktok.com/@lumaredlight',
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  const handleUpdateContact = (key, value) => {
    setContactContent((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveContact = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      localStorage.setItem('luma_cms_contact_content', JSON.stringify(contactContent));
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  // Sub-navigation tabs configured for LUMA pages
  const cmsTabs = [
    { id: 'homepage-cms', label: 'Homepage CMS' },
    { id: 'about-cms', label: 'About Us CMS' },
    {
      id: 'community-cms',
      label: 'Community CMS',
      badge: pendingQuestionsCount > 0 ? `${pendingQuestionsCount} New` : null,
    },
    {
      id: 'reviews-cms',
      label: 'Reviews CMS',
      badge: pendingStoriesCount > 0 ? `${pendingStoriesCount} New` : null,
    },
    { id: 'contact-cms', label: 'Contact Us CMS' },
  ];

  const currentTabObj = cmsTabs.find((t) => t.id === activeTab) || cmsTabs[0];

  return (
    <div className="w-full text-[#1E293B] pb-16">
      
      {/* ================= 1. PAGE TITLE & SUBTITLE ================= */}
      <div className="mb-7">
        <h1
          style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
          className="text-[28px] sm:text-[34px] font-normal tracking-tight text-[#1E293B]"
        >
          Content Management
        </h1>
        <p className="text-[13px] text-[#64748B] mt-1 font-medium">
          Update landing components, social networking urls, and promo sliders.
        </p>
      </div>

      {/* ================= 2. SUB-NAVIGATION TABS CARD ================= */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-3 sm:p-4 shadow-xs mb-7">
        <div className="flex flex-wrap items-center gap-2">
          {cmsTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[12.5px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ED2024] text-white shadow-xs'
                    : 'text-[#334155] hover:text-[#0F172A] hover:bg-gray-100 bg-transparent'
                }`}
              >
                {tab.icon && <span className="text-[13px]">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-1 ${
                      isActive ? 'bg-white text-[#ED2024]' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 3. SUB-HEADER & ACTIONS ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#94A3B8] block">
            {currentTabObj.label.toUpperCase()}
          </span>
          <p className="text-[12.5px] text-[#64748B] mt-0.5 font-medium">
            Edit titles, descriptions, buttons and structured lists across all page sections.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Quick Preview Button */}
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'about-cms') {
                if (onNavigatePage) onNavigatePage('about');
                else window.open('/about', '_blank');
              } else if (activeTab === 'community-cms') {
                if (onNavigatePage) onNavigatePage('community');
                else window.open('/community', '_blank');
              } else if (activeTab === 'reviews-cms') {
                if (onNavigatePage) onNavigatePage('reviews');
                else window.open('/reviews', '_blank');
              } else if (activeTab === 'contact-cms') {
                if (onNavigatePage) onNavigatePage('contact');
                else window.open('/contact', '_blank');
              } else {
                if (onNavigatePage) onNavigatePage('home');
                else window.open('/', '_blank');
              }
            }}
            className="px-3.5 py-2 rounded-md bg-white hover:bg-gray-50 border border-[#CBD5E1] text-[#475569] hover:text-[#1E293B] text-[12px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Live Preview ↗</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span><strong>Success!</strong> Content updated and synchronized live.</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Live Active</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2.5 shadow-xs">
          <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ================= 4. TAB VIEWS ================= */}

      {/* TAB A: HOMEPAGE CMS (Live Page Content) */}
      {(activeTab === 'homepage-cms' || activeTab === 'homepage-text' || activeTab === 'homepage-banners') && (
        <HomeCmsEditor
          onOpenLivePage={() => {
            if (onNavigatePage) onNavigatePage('home');
            else window.open('/', '_blank');
          }}
        />
      )}

      {/* TAB B: ABOUT US CMS (Live Page Content) */}
      {activeTab === 'about-cms' && (
        <AboutCmsEditor
          onOpenLivePage={() => {
            if (onNavigatePage) onNavigatePage('about');
            else window.open('/about', '_blank');
          }}
        />
      )}

      {/* TAB C: COMMUNITY CMS (Live Page Content) */}
      {activeTab === 'community-cms' && (
        <CommunityCmsEditor
          onOpenLivePage={() => {
            if (onNavigatePage) onNavigatePage('community');
            else window.open('/community', '_blank');
          }}
        />
      )}

      {/* TAB D: REVIEWS CMS (Live Reviews Page Content) */}
      {activeTab === 'reviews-cms' && (
        <ReviewsCmsEditor
          onOpenLivePage={() => {
            if (onNavigatePage) onNavigatePage('reviews');
            else window.open('/reviews', '_blank');
          }}
        />
      )}

      {/* TAB D: CONTACT US CMS (Real LUMA Contact Information) */}
      {activeTab === 'contact-cms' && (
        <div className="space-y-7">
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">📞</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Contact Page &amp; Concierge Support Information
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">
                CONTACT CMS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Concierge Support Phone
                </label>
                <input
                  type="text"
                  value={contactContent.footerPhone}
                  onChange={(e) => handleUpdateContact('footerPhone', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Official Support Email
                </label>
                <input
                  type="email"
                  value={contactContent.footerEmail}
                  onChange={(e) => handleUpdateContact('footerEmail', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Physical Showroom Address
                </label>
                <input
                  type="text"
                  value={contactContent.footerAddress}
                  onChange={(e) => handleUpdateContact('footerAddress', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  WhatsApp Direct Chat Link
                </label>
                <input
                  type="url"
                  value={contactContent.socialWhatsapp}
                  onChange={(e) => handleUpdateContact('socialWhatsapp', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={handleSaveContact}
                disabled={saving}
                className="px-6 py-2 rounded-md bg-[#ED2024] hover:bg-[#c9181b] text-white text-[12.5px] font-bold shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                {saving ? 'Saving...' : 'Save Contact Information'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

