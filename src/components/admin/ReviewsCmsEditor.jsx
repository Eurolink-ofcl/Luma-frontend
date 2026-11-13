import React, { useState, useEffect } from 'react';
import ImageUploadField from './ImageUploadField';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

const DEFAULT_BEFORE_AFTER_CATEGORIES = [
  {
    id: 'ACNE',
    label: 'ACNE',
    beforeImage: '/assets/before_after/face-before.jpg',
    afterImage: '/assets/before_after/face-after.jpg',
    subtitle: 'Targeted blue & red light purifying active blemishes and calming inflammation.',
  },
  {
    id: 'WRINKLE',
    label: 'WRINKLE',
    beforeImage: '/assets/before_after/face-before.jpg',
    afterImage: '/assets/before_after/face-after.jpg',
    subtitle: 'Deep collagen and elastin stimulation visibly smoothing fine lines and firming skin.',
  },
  {
    id: 'PIGMENTATION',
    label: 'PIGMENTATION',
    beforeImage: '/assets/before_after/face-before.jpg',
    afterImage: '/assets/before_after/face-after.jpg',
    subtitle: 'Even tone renewal fading dark sun spots, redness, and discoloration.',
  },
];

export default function ReviewsCmsEditor({ onOpenLivePage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [pageData, setPageData] = useState(null);
  const [activeBeforeAfterTab, setActiveBeforeAfterTab] = useState('ACNE');

  // Live user submitted stories state from MongoDB
  const [stories, setStories] = useState([]);
  const [storyCounts, setStoryCounts] = useState({ total: 0, pending: 0, approved: 0, featured: 0 });
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [storyFilter, setStoryFilter] = useState('all');
  const [storySearch, setStorySearch] = useState('');
  const [storyActionAlert, setStoryActionAlert] = useState(null);

  // Fetch live stories from MongoDB
  const fetchStories = async () => {
    setStoriesLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stories`);
      const data = await res.json();
      if (res.ok && data.success) {
        setStories(data.data || []);
        if (data.counts) {
          setStoryCounts(data.counts);
        }
      }
    } catch (err) {
      console.error('Error loading stories in CMS:', err);
    } finally {
      setStoriesLoading(false);
    }
  };

  // Fetch live reviews page content
  const fetchPageContent = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/reviews`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setPageData(result.data);
      } else {
        setErrorMessage(result.message || 'Failed to load Reviews page content.');
      }
    } catch (err) {
      console.error('Error loading Reviews CMS data:', err);
      setErrorMessage('Could not connect to backend server at http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent();
    fetchStories();
  }, []);

  const handleUpdateStoryStatus = async (storyId, newStatus, featured = false) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stories/${storyId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, featured }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoryActionAlert(`✓ Story status updated to "${newStatus}".`);
        await fetchStories();
        setTimeout(() => setStoryActionAlert(null), 4000);
      }
    } catch (err) {
      console.error('Error updating story status:', err);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stories/${storyId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoryActionAlert('✓ Story deleted.');
        await fetchStories();
        setTimeout(() => setStoryActionAlert(null), 4000);
      }
    } catch (err) {
      console.error('Error deleting story:', err);
    }
  };

  const handleUploadStoryImage = async (storyId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const uploadRes = await fetch(`${API_BASE_URL}/stories/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result, filename: file.name }),
        });
        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.success && uploadJson.url) {
          await fetch(`${API_BASE_URL}/admin/stories/${storyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photo: uploadJson.url, thumbnail: uploadJson.url }),
          });
          setStoryActionAlert('✓ Photo / Thumbnail uploaded successfully for this story!');
          await fetchStories();
          setTimeout(() => setStoryActionAlert(null), 4000);
        }
      } catch (err) {
        console.error('Error uploading story image:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredStories = stories.filter((s) => {
    if (storyFilter === 'pending' && s.status !== 'pending') return false;
    if (storyFilter === 'approved' && s.status !== 'approved' && s.status !== 'featured') return false;
    if (storyFilter === 'featured' && s.status !== 'featured' && !s.featured) return false;
    if (storySearch.trim()) {
      const q = storySearch.toLowerCase();
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchProduct = (s.product || '').toLowerCase().includes(q);
      const matchStory = (s.story || '').toLowerCase().includes(q);
      return matchName || matchProduct || matchStory;
    }
    return true;
  });

  // Save changes
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/reviews`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPageData(result.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(result.message || 'Failed to update content.');
      }
    } catch (err) {
      console.error('Error saving Reviews CMS data:', err);
      setErrorMessage('Network error while saving changes to backend.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default content
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all Reviews page content to default values?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/reviews/reset`, {
        method: 'POST',
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setPageData(result.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error resetting Reviews page:', err);
      setErrorMessage('Error resetting to default values.');
    } finally {
      setSaving(false);
    }
  };

  // Mutators for nested state
  const updateField = (section, field, value) => {
    setPageData((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  const updateReview = (index, field, value) => {
    setPageData((prev) => {
      const reviews = [...(prev?.realStories?.reviews || [])];
      reviews[index] = {
        ...reviews[index],
        [field]: value,
      };
      return {
        ...prev,
        realStories: {
          ...prev.realStories,
          reviews,
        },
      };
    });
  };

  const handleAddReview = () => {
    setPageData((prev) => {
      const reviews = [...(prev?.realStories?.reviews || [])];
      reviews.unshift({
        id: Date.now(),
        badgeName: 'NEW REVIEWER',
        badgeProduct: 'GLOW USER',
        badgeWidth: 314,
        quote: '“LUMA has completely transformed my daily wellness and recovery routine.”',
        stars: 5,
      });
      return {
        ...prev,
        realStories: {
          ...prev.realStories,
          reviews,
        },
      };
    });
  };

  const handleDeleteReview = (index) => {
    if (!window.confirm('Remove this review from the carousel?')) return;
    setPageData((prev) => {
      const reviews = [...(prev?.realStories?.reviews || [])];
      reviews.splice(index, 1);
      return {
        ...prev,
        realStories: {
          ...prev.realStories,
          reviews,
        },
      };
    });
  };

  const getBeforeAfterCategories = () => {
    const raw = pageData?.beforeAfter?.categories;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((c, idx) => {
        if (typeof c === 'string') {
          const matchDefault = DEFAULT_BEFORE_AFTER_CATEGORIES.find((d) => d.id === c);
          return {
            id: c,
            label: c,
            beforeImage: matchDefault?.beforeImage || pageData?.beforeAfter?.beforeImage || '/assets/before_after/face-before.jpg',
            afterImage: matchDefault?.afterImage || pageData?.beforeAfter?.afterImage || '/assets/before_after/face-after.jpg',
            subtitle: matchDefault?.subtitle || '',
          };
        }
        const matchDefault = DEFAULT_BEFORE_AFTER_CATEGORIES.find((d) => d.id === c.id);
        return {
          id: c.id || c.label || `cat-${idx}`,
          label: c.label || c.id || `Category ${idx + 1}`,
          beforeImage: c.beforeImage || pageData?.beforeAfter?.beforeImage || matchDefault?.beforeImage || '/assets/before_after/face-before.jpg',
          afterImage: c.afterImage || pageData?.beforeAfter?.afterImage || matchDefault?.afterImage || '/assets/before_after/face-after.jpg',
          subtitle: c.subtitle || '',
        };
      });
    }
    return DEFAULT_BEFORE_AFTER_CATEGORIES;
  };

  const updateBeforeAfterCategoryField = (categoryId, field, value) => {
    setPageData((prev) => {
      const currentList = getBeforeAfterCategories();
      const updatedList = currentList.map((cat) => {
        if (cat.id === categoryId) {
          return { ...cat, [field]: value };
        }
        return cat;
      });

      return {
        ...prev,
        beforeAfter: {
          ...(prev?.beforeAfter || {}),
          categories: updatedList,
        },
      };
    });
  };

  const addBeforeAfterCategory = () => {
    setPageData((prev) => {
      const currentList = getBeforeAfterCategories();
      const newId = `TREATMENT_${currentList.length + 1}`;
      const newCategory = {
        id: newId,
        label: `NEW CONCERN ${currentList.length + 1}`,
        beforeImage: '/assets/before_after/face-before.jpg',
        afterImage: '/assets/before_after/face-after.jpg',
        subtitle: 'Clinical outcome description after treatment protocol.',
      };
      const updatedList = [...currentList, newCategory];
      setActiveBeforeAfterTab(newId);
      return {
        ...prev,
        beforeAfter: {
          ...(prev?.beforeAfter || {}),
          categories: updatedList,
        },
      };
    });
  };

  const removeBeforeAfterCategory = (categoryId) => {
    setPageData((prev) => {
      const currentList = getBeforeAfterCategories();
      if (currentList.length <= 1) return prev;
      const updatedList = currentList.filter((c) => c.id !== categoryId);
      setActiveBeforeAfterTab(updatedList[0].id);
      return {
        ...prev,
        beforeAfter: {
          ...(prev?.beforeAfter || {}),
          categories: updatedList,
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center shadow-xs">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-[#ED2024] rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-semibold text-[#0F172A]">Loading Reviews Page CMS...</h3>
        <p className="text-xs text-[#64748B] mt-1">Connecting to live service</p>
      </div>
    );
  }

  if (errorMessage && !pageData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-[14px] p-8 text-center">
        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
          !
        </div>
        <h3 className="text-base font-bold text-red-800 mb-1">Failed to Load Reviews CMS</h3>
        <p className="text-xs text-red-600 max-w-md mx-auto mb-4">{errorMessage}</p>
        <button
          type="button"
          onClick={fetchPageContent}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
        >
          Try Again
        </button>
      </div>
    );
  }

  const sections = [
    { id: 'all', label: 'All Sections' },
    { id: 'hero', label: '1. Hero Banner' },
    { id: 'realStories', label: `2. Real Stories (${pageData?.realStories?.reviews?.length || 0})` },
    { id: 'gallery', label: '3. 3D Panoramic Gallery' },
    { id: 'beforeAfter', label: '4. Real Sessions Before/After' },
    {
      id: 'shareStory',
      label: `5. Share Story Form & Submissions ${storyCounts.pending > 0 ? `(${storyCounts.pending} New)` : ''}`,
    },
  ];

  return (
    <div className="w-full text-[#1E293B]">
      {/* CMS Sticky Header Bar */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-[14px] p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-[#0F172A]">Reviews Page CMS Editor</h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-100 text-[#ED2024] border border-red-200">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Changes saved here immediately update the live <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">/reviews</code> page.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="px-3.5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={onOpenLivePage || (() => window.open('/reviews', '_blank'))}
            className="px-3.5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <span>Live Reviews</span>
            <span className="text-xs">&rarr;</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </span>
          <span>Reviews Page content successfully saved and published!</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-medium flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            !
          </span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6 bg-white border border-[#E2E8F0] p-1.5 rounded-xl shadow-xs">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSection === sec.id
                ? 'bg-[#ED2024] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO BANNER                                                    */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'hero') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
                  1. Review Page Hero Banner
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Top high-impact header photo, rating headline, and action buttons.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Images Banner
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Main Headline (Line 1)
                </label>
                <input
                  type="text"
                  value={pageData?.hero?.titleLine1 || ''}
                  onChange={(e) => updateField('hero', 'titleLine1', e.target.value)}
                  placeholder="RATED 4.8/5 BY"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Main Headline (Line 2)
                </label>
                <input
                  type="text"
                  value={pageData?.hero?.titleLine2 || ''}
                  onChange={(e) => updateField('hero', 'titleLine2', e.target.value)}
                  placeholder="THOUSANDS OF REAL USERS"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Subtitle (Italic Tagline)
                </label>
                <input
                  type="text"
                  value={pageData?.hero?.subtitle || ''}
                  onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                  placeholder="REAL ROUTINES, REAL STORIES"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Button 1 Label
                  </label>
                  <input
                    type="text"
                    value={pageData?.hero?.shareStoryBtnText || ''}
                    onChange={(e) => updateField('hero', 'shareStoryBtnText', e.target.value)}
                    placeholder="SHARE YOUR STORY"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Button 2 Label
                  </label>
                  <input
                    type="text"
                    value={pageData?.hero?.findPanelBtnText || ''}
                    onChange={(e) => updateField('hero', 'findPanelBtnText', e.target.value)}
                    placeholder="FIND YOUR PANEL"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <ImageUploadField
                label="Hero Background Photo"
                value={pageData?.hero?.bgImage || ''}
                onChange={(url) => updateField('hero', 'bgImage', url)}
                defaultPath="/assets/reviews/review-hero-bg-v2.jpg?v=20261106_4"
                helpText="Recommended dimensions: 3840 x 930 px. Upload directly or paste image URL."
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: REAL STORIES CAROUSEL                                          */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'realStories') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
                  2. Real Stories Carousel ({pageData?.realStories?.reviews?.length || 0} reviews)
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Paginated 6 per slide. Edit quotes, product badges, reviewer names, or add new ones.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddReview}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Add Review</span>
              </button>
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={pageData?.realStories?.title || ''}
                onChange={(e) => updateField('realStories', 'title', e.target.value)}
                placeholder="REAL STORIES"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
              />
            </div>

            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              {(pageData?.realStories?.reviews || []).map((review, idx) => (
                <div
                  key={review.id || idx}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">
                      #{idx + 1} &middot; {review.badgeName} ({review.badgeProduct})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(idx)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1">
                        Reviewer Name
                      </label>
                      <input
                        type="text"
                        value={review.badgeName || ''}
                        onChange={(e) => updateReview(idx, 'badgeName', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#ED2024]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1">
                        Product Badge
                      </label>
                      <input
                        type="text"
                        value={review.badgeProduct || ''}
                        onChange={(e) => updateReview(idx, 'badgeProduct', e.target.value)}
                        placeholder="e.g. SURGE USER"
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#ED2024]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1">
                        Rating (Stars 1-5)
                      </label>
                      <select
                        value={review.stars || 5}
                        onChange={(e) => updateReview(idx, 'stars', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#ED2024]"
                      >
                        <option value={1}>★☆☆☆☆ (1 Star)</option>
                        <option value={2}>★★☆☆☆ (2 Stars)</option>
                        <option value={3}>★★★☆☆ (3 Stars)</option>
                        <option value={4}>★★★★☆ (4 Stars)</option>
                        <option value={5}>★★★★★ (5 Stars)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Customer Quote Text
                    </label>
                    <textarea
                      rows={2}
                      value={review.quote || ''}
                      onChange={(e) => updateReview(idx, 'quote', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#ED2024] leading-relaxed resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: 3D PANORAMIC GALLERY                                           */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'gallery') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
                  3. Real Story Curved 3D Panoramic Gallery
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Curved panoramic gallery banner with authentic customer video cards.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Real Story Gallery
              </span>
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={pageData?.gallery?.title || ''}
                onChange={(e) => updateField('gallery', 'title', e.target.value)}
                placeholder="REAL STORY"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ImageUploadField
                  label="Panoramic Gallery Image (JPG/PNG)"
                  value={pageData?.gallery?.galleryImage || ''}
                  onChange={(url) => updateField('gallery', 'galleryImage', url)}
                  defaultPath="/assets/reviews/real-story-gallery-clean.jpg?v=20261106_2"
                  helpText="Recommended dimensions: 3840 x 1606 px."
                />
              </div>

              <div>
                <ImageUploadField
                  label="Panoramic Gallery Image (WEBP format)"
                  value={pageData?.gallery?.galleryImageWebp || ''}
                  onChange={(url) => updateField('gallery', 'galleryImageWebp', url)}
                  defaultPath="/assets/reviews/real-story-gallery-clean.webp?v=20261106_2"
                  helpText="Optimized modern webp format for faster loads."
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: REAL SESSIONS BEFORE / AFTER                                    */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'beforeAfter') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
                  4. Real Sessions Before &amp; After Comparison
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Interactive split comparison slider showing real clinical facial outcomes.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Real Sessions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={pageData?.beforeAfter?.heading || ''}
                  onChange={(e) => updateField('beforeAfter', 'heading', e.target.value)}
                  placeholder="REAL SESSIONS"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={pageData?.beforeAfter?.eyebrow || ''}
                  onChange={(e) => updateField('beforeAfter', 'eyebrow', e.target.value)}
                  placeholder="REAL SESSIONS"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={pageData?.beforeAfter?.subtitle || ''}
                onChange={(e) => updateField('beforeAfter', 'subtitle', e.target.value)}
                placeholder="Discover How the Lumnae Mask Transformed Skincare Routines..."
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Treatment Concern Categories (ACNE, WRINKLE, PIGMENTATION) */}
            {(() => {
              const currentCats = getBeforeAfterCategories();
              const activeCat = currentCats.find((c) => c.id === activeBeforeAfterTab) || currentCats[0] || {};

              return (
                <div className="pt-2 border-t border-[#E2E8F0] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                        Select Treatment Concern to Edit Photos:
                      </label>
                      <p className="text-[12px] text-[#64748B]">
                        Click on <strong>ACNE</strong>, <strong>WRINKLE</strong>, or <strong>PIGMENTATION</strong> to upload distinct Before &amp; After photos for each tab.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addBeforeAfterCategory}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ED2024] hover:bg-[#c9181b] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      + Add Concern Category
                    </button>
                  </div>

                  {/* Category Switcher Pills */}
                  <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#F1F5F9] rounded-xl">
                    {currentCats.map((cat) => {
                      const isSelected = activeBeforeAfterTab === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveBeforeAfterTab(cat.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#ED2024] text-white shadow-xs ring-2 ring-[#ED2024]/20'
                              : 'bg-white text-[#1E293B] hover:text-[#ED2024]'
                          }`}
                        >
                          {cat.label || cat.id}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Category Editor Card */}
                  <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ED2024]" />
                        <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                          Editing {activeCat.label || activeCat.id} Concern Comparison
                        </span>
                      </div>

                      {currentCats.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove the ${activeCat.label || activeCat.id} concern category?`)) {
                              removeBeforeAfterCategory(activeCat.id);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          ✕ Remove Concern
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                          Category Tab Label
                        </label>
                        <input
                          type="text"
                          value={activeCat.label || activeCat.id || ''}
                          onChange={(e) =>
                            updateBeforeAfterCategoryField(activeCat.id, 'label', e.target.value.toUpperCase())
                          }
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-bold text-[#1E293B] outline-none shadow-xs uppercase"
                          placeholder="WRINKLE"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                          Treatment Subtitle / Protocol Note
                        </label>
                        <input
                          type="text"
                          value={activeCat.subtitle || ''}
                          onChange={(e) =>
                            updateBeforeAfterCategoryField(activeCat.id, 'subtitle', e.target.value)
                          }
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                          placeholder="Deep collagen stimulation smoothing fine lines..."
                        />
                      </div>
                    </div>

                    {/* Before and After Image Uploads for this concern */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                      <div className="bg-white p-4 rounded-[12px] border border-[#E2E8F0]">
                        <ImageUploadField
                          label={`Before Photo (${activeCat.label || activeCat.id})`}
                          value={activeCat.beforeImage || ''}
                          onChange={(url) =>
                            updateBeforeAfterCategoryField(activeCat.id, 'beforeImage', url)
                          }
                          defaultPath="/assets/before_after/face-before.jpg"
                          helpText="Upload before treatment photo for this concern"
                        />
                      </div>

                      <div className="bg-white p-4 rounded-[12px] border border-[#E2E8F0]">
                        <ImageUploadField
                          label={`After Photo (${activeCat.label || activeCat.id})`}
                          value={activeCat.afterImage || ''}
                          onChange={(url) =>
                            updateBeforeAfterCategoryField(activeCat.id, 'afterImage', url)
                          }
                          defaultPath="/assets/before_after/face-after.jpg"
                          helpText="Upload after treatment photo for this concern"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: SHARE YOUR STORY FORM & CUSTOMER SUBMISSIONS                   */}
        {/* ========================================================================= */}
        {(activeSection === 'all' || activeSection === 'shareStory') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs space-y-6">
            <div className="border-b border-[#E2E8F0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
                  5. Share Your Story Form &amp; Customer Submissions
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Customize form titles and review real customer stories submitted from the frontend.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {storyCounts.pending > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                    {storyCounts.pending} NEW STOR{storyCounts.pending > 1 ? 'IES' : 'Y'} PENDING
                  </span>
                )}
                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  LIVE MONGODB STORIES
                </span>
              </div>
            </div>

            {/* Form CMS Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Title Part 1 (White Text)
                </label>
                <input
                  type="text"
                  value={pageData?.shareStory?.titlePart1 || ''}
                  onChange={(e) => updateField('shareStory', 'titlePart1', e.target.value)}
                  placeholder="SHARE YOUR"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Title Part 2 (Red Accent Text)
                </label>
                <input
                  type="text"
                  value={pageData?.shareStory?.titlePart2 || ''}
                  onChange={(e) => updateField('shareStory', 'titlePart2', e.target.value)}
                  placeholder="STORY"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Submission Success Heading
                </label>
                <input
                  type="text"
                  value={pageData?.shareStory?.successTitle || ''}
                  onChange={(e) => updateField('shareStory', 'successTitle', e.target.value)}
                  placeholder="Thank you for sharing your story!"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Submission Success Subtext
                </label>
                <input
                  type="text"
                  value={pageData?.shareStory?.successSubtitle || ''}
                  onChange={(e) => updateField('shareStory', 'successSubtitle', e.target.value)}
                  placeholder="Our team will review and feature it in our Real Stories community."
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:border-[#ED2024] focus:outline-none"
                />
              </div>
            </div>

            {/* Action Alert Banner */}
            {storyActionAlert && (
              <div className="p-3.5 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center justify-between shadow-xs animate-fadeIn">
                <span>{storyActionAlert}</span>
                <button
                  type="button"
                  onClick={() => setStoryActionAlert(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-[12px] font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ================= USER STORIES SUBMISSIONS BOARD ================= */}
            <div className="mt-4 pt-6 border-t border-[#F1F5F9] space-y-5">
              
              {/* Header & Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-[15px] font-bold text-[#1E293B] flex items-center gap-2">
                    <span>Customer Story Submissions</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      {stories.length} Total
                    </span>
                  </h4>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    Submissions from users via the "SHARE YOUR STORY" form on the Reviews page.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchStories}
                    disabled={storiesLoading}
                    className="px-3 py-1.5 rounded-[8px] text-[12px] font-semibold bg-gray-100 hover:bg-gray-200 text-[#475569] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className={`w-3.5 h-3.5 ${storiesLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0]">
                {/* Status Tabs */}
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setStoryFilter('all')}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer ${
                      storyFilter === 'all'
                        ? 'bg-white text-[#1E293B] shadow-xs font-bold'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    All ({storyCounts.total})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStoryFilter('pending')}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      storyFilter === 'pending'
                        ? 'bg-amber-500 text-white shadow-xs font-bold'
                        : 'text-amber-800 hover:bg-amber-100/60'
                    }`}
                  >
                    <span>Pending Review</span>
                    {storyCounts.pending > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${storyFilter === 'pending' ? 'bg-white text-amber-600' : 'bg-amber-200 text-amber-900'}`}>
                        {storyCounts.pending}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStoryFilter('approved')}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer ${
                      storyFilter === 'approved'
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-emerald-800 hover:bg-emerald-100/60'
                    }`}
                  >
                    Approved ({storyCounts.approved})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStoryFilter('featured')}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer ${
                      storyFilter === 'featured'
                        ? 'bg-purple-600 text-white shadow-xs font-bold'
                        : 'text-purple-800 hover:bg-purple-100/60'
                    }`}
                  >
                    Featured ({storyCounts.featured})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[200px]">
                  <input
                    type="text"
                    value={storySearch}
                    onChange={(e) => setStorySearch(e.target.value)}
                    placeholder="Search story, name, product..."
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] pl-8 pr-3 py-1 text-[12px] text-[#1E293B] outline-none"
                  />
                  <svg className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>

              {/* Stories Cards List */}
              {storiesLoading && stories.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-[13px]">
                  Loading stories from database...
                </div>
              ) : filteredStories.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#CBD5E1] rounded-[12px] bg-[#F8FAFC]">
                  <p className="text-[13px] font-semibold text-[#64748B]">No customer stories found matching this filter.</p>
                  <p className="text-[12px] text-[#94A3B8] mt-1">Submit a story from the "SHARE YOUR STORY" section on the Reviews page to test!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStories.map((s) => (
                    <div
                      key={s._id}
                      className={`p-5 rounded-[16px] border transition-all ${
                        s.status === 'pending'
                          ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                          : s.status === 'featured'
                          ? 'bg-purple-50/30 border-purple-200 shadow-xs'
                          : 'bg-white border-[#E2E8F0] shadow-xs'
                      }`}
                    >
                      {/* Top Row: User Meta + Status Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[14px] text-[#1E293B]">
                            {s.name}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[#ED2024] border border-red-200">
                            {s.product || 'Luma Glow'}
                          </span>
                          {s.createdAt && (
                            <span className="text-[11px] text-[#94A3B8]">
                              · {new Date(s.createdAt).toLocaleDateString()}
                            </span>
                          )}
                          {s.agreed && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              ✓ Consent to publish
                            </span>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          {s.status === 'pending' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                              <span>Pending Review</span>
                            </span>
                          ) : s.status === 'featured' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                              <span>★ Featured in Carousel</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <span>✓ Approved</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Story Content */}
                      <div className="mt-3.5 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <span className="text-[12px] font-black text-[#ED2024] uppercase tracking-wider shrink-0 mt-0.5">
                            STORY:
                          </span>
                          <p className="text-[13.5px] sm:text-[14px] text-[#1E293B] leading-relaxed font-normal">
                            "{s.story}"
                          </p>
                        </div>

                        {/* Media Link if provided */}
                        {s.mediaLink && (
                          <div className="mt-2 text-[12px] text-[#64748B] flex items-center gap-1.5">
                            <span className="font-semibold text-gray-700">Photo / Video Link:</span>
                            <a
                              href={s.mediaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {s.mediaLink}
                            </a>
                          </div>
                        )}

                        {/* Uploaded Photo / Thumbnail Preview & Upload Control */}
                        <div className="mt-2.5 pt-2 flex items-center gap-3">
                          {(s.photo || s.thumbnail) ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={s.photo || s.thumbnail}
                                alt="Story thumbnail"
                                className="w-12 h-12 rounded-lg object-cover border border-gray-300 shadow-2xs"
                              />
                              <span className="text-[11px] text-gray-500 font-medium">Uploaded Image</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">No image uploaded</span>
                          )}

                          <label className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[6px] cursor-pointer flex items-center gap-1.5 transition-colors border border-gray-200">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{(s.photo || s.thumbnail) ? 'Change Image' : 'Upload Image / Thumbnail'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUploadStoryImage(s._id, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-gray-500">
                          Badge Preview: <strong className="text-gray-700">{s.badgeName || s.name.toUpperCase()}</strong> · <span className="text-gray-600">{s.badgeProduct || `${s.product.toUpperCase()} USER`}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          {s.status === 'pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateStoryStatus(s._id, 'approved', false)}
                                className="px-3 py-1 rounded-[6px] text-[11.5px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                              >
                                ✓ Approve Story
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStoryStatus(s._id, 'featured', true)}
                                className="px-3 py-1 rounded-[6px] text-[11.5px] font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
                              >
                                ★ Feature
                              </button>
                            </>
                          ) : s.status === 'approved' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateStoryStatus(s._id, 'featured', true)}
                                className="px-3 py-1 rounded-[6px] text-[11.5px] font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
                              >
                                ★ Feature
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStoryStatus(s._id, 'pending', false)}
                                className="px-2.5 py-1 rounded-[6px] text-[11.5px] font-medium text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                              >
                                Move to Pending
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateStoryStatus(s._id, 'approved', false)}
                              className="px-2.5 py-1 rounded-[6px] text-[11.5px] font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              Unfeature
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteStory(s._id)}
                            className="px-2.5 py-1 rounded-[6px] text-[11.5px] font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
        >
          Reset to Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-7 py-2.5 bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all"
        >
          {saving ? 'Saving Changes...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}

