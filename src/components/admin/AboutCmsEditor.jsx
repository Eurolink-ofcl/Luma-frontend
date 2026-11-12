import React, { useState, useEffect } from 'react';
import ImageUploadField from './ImageUploadField';
import VideoUploadField from './VideoUploadField';

const API_BASE_URL = 'http://localhost:5000/api';

export default function AboutCmsEditor({ onOpenLivePage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [activeBenefitIndex, setActiveBenefitIndex] = useState(0);
  const [pageData, setPageData] = useState(null);

  // Fetch live page content
  const fetchPageContent = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/about`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setPageData(result.data);
      } else {
        setErrorMessage(result.message || 'Failed to load About page content.');
      }
    } catch (err) {
      console.error('Error loading About CMS data:', err);
      setErrorMessage('Could not connect to backend server at http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent();
  }, []);

  // Save changes
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/about`, {
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
      console.error('Error saving About CMS data:', err);
      setErrorMessage('Network error while saving changes to backend.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default content
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all About page content to default values?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/about/reset`, {
        method: 'POST',
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setPageData(result.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error resetting About page:', err);
      setErrorMessage('Error resetting to default.');
    } finally {
      setSaving(false);
    }
  };

  // Helper mutators for nested state
  const updateField = (section, field, value) => {
    setPageData((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  const updateParagraph = (index, value) => {
    setPageData((prev) => {
      const newParagraphs = [...(prev.intro?.paragraphs || [])];
      newParagraphs[index] = value;
      return {
        ...prev,
        intro: {
          ...prev.intro,
          paragraphs: newParagraphs,
        },
      };
    });
  };

  const addParagraph = () => {
    setPageData((prev) => ({
      ...prev,
      intro: {
        ...prev.intro,
        paragraphs: [...(prev.intro?.paragraphs || []), 'New paragraph text...'],
      },
    }));
  };

  const removeParagraph = (index) => {
    setPageData((prev) => {
      const newParagraphs = prev.intro?.paragraphs?.filter((_, i) => i !== index);
      return {
        ...prev,
        intro: {
          ...prev.intro,
          paragraphs: newParagraphs,
        },
      };
    });
  };

  const updateStatCard = (index, key, value) => {
    setPageData((prev) => {
      const newStats = [...(prev.basics?.statCards || [])];
      const current = newStats[index] || {};
      const updated = { ...current, [key]: value };

      // Ensure both num/val and label/title stay synchronized
      if (key === 'num' || key === 'val') {
        updated.num = value;
        updated.val = value;
      }
      if (key === 'label' || key === 'title') {
        updated.label = value;
        updated.title = value;
      }

      newStats[index] = updated;
      return {
        ...prev,
        basics: {
          ...prev.basics,
          statCards: newStats,
        },
      };
    });
  };

  const updateWavelengthCard = (index, key, value) => {
    setPageData((prev) => {
      const newCards = [...(prev.science?.wavelengthCards || [])];
      newCards[index] = { ...newCards[index], [key]: value };
      return {
        ...prev,
        science: {
          ...prev.science,
          wavelengthCards: newCards,
        },
      };
    });
  };

  const updateStep = (index, key, value) => {
    setPageData((prev) => {
      const newSteps = [...(prev.science?.steps || [])];
      newSteps[index] = { ...newSteps[index], [key]: value };
      return {
        ...prev,
        science: {
          ...prev.science,
          steps: newSteps,
        },
      };
    });
  };

  const updateSafetyCard = (index, key, value) => {
    setPageData((prev) => {
      const newCards = [...(prev.safety?.cards || [])];
      newCards[index] = { ...newCards[index], [key]: value };
      return {
        ...prev,
        safety: {
          ...prev.safety,
          cards: newCards,
        },
      };
    });
  };

  const updateSpecRow = (index, key, value) => {
    setPageData((prev) => {
      const newSpecs = [...(prev.safety?.specRows || [])];
      newSpecs[index] = { ...newSpecs[index], [key]: value };
      return {
        ...prev,
        safety: {
          ...prev.safety,
          specRows: newSpecs,
        },
      };
    });
  };

  const addSpecRow = () => {
    setPageData((prev) => ({
      ...prev,
      safety: {
        ...prev.safety,
        specRows: [
          ...(prev.safety?.specRows || []),
          { label: 'NEW SPEC', value: 'Details...' },
        ],
      },
    }));
  };

  const removeSpecRow = (index) => {
    setPageData((prev) => {
      const newSpecs = prev.safety?.specRows?.filter((_, i) => i !== index);
      return {
        ...prev,
        safety: {
          ...prev.safety,
          specRows: newSpecs,
        },
      };
    });
  };

  const updateBenefitItem = (index, key, value) => {
    setPageData((prev) => {
      const newItems = [...(prev.benefits?.items || [])];
      newItems[index] = { ...newItems[index], [key]: value };
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          items: newItems,
        },
      };
    });
  };

  const updateBenefitBullet = (benefitIdx, bulletIdx, value) => {
    setPageData((prev) => {
      const newItems = [...(prev.benefits?.items || [])];
      const current = newItems[benefitIdx] || {};
      const newBullets = [...(current.bullets || [])];
      newBullets[bulletIdx] = value;
      newItems[benefitIdx] = { ...current, bullets: newBullets };
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          items: newItems,
        },
      };
    });
  };

  const addBenefitBullet = (benefitIdx) => {
    setPageData((prev) => {
      const newItems = [...(prev.benefits?.items || [])];
      const current = newItems[benefitIdx] || {};
      const newBullets = [...(current.bullets || []), 'NEW BENEFIT HIGHLIGHT'];
      newItems[benefitIdx] = { ...current, bullets: newBullets };
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          items: newItems,
        },
      };
    });
  };

  const removeBenefitBullet = (benefitIdx, bulletIdx) => {
    setPageData((prev) => {
      const newItems = [...(prev.benefits?.items || [])];
      const current = newItems[benefitIdx] || {};
      const newBullets = (current.bullets || []).filter((_, i) => i !== bulletIdx);
      newItems[benefitIdx] = { ...current, bullets: newBullets };
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          items: newItems,
        },
      };
    });
  };

  const sectionsNav = [
    { id: 'all', label: 'All Sections' },
    { id: 'hero', label: '1. Hero Banner' },
    { id: 'intro', label: '2. Story & Mission' },
    { id: 'basics', label: '3. Basics & Stat Cards' },
    { id: 'science', label: '4. Science & Steps' },
    { id: 'benefits', label: '5. Outcomes & Benefits' },
    { id: 'safety', label: '6. Safety & Specs' },
    { id: 'shopCta', label: '7. Shop CTA' },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <svg className="animate-spin h-8 w-8 text-[#ED2024] mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 text-[13px] font-medium">
          Loading About page content...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full text-[#1E293B]">
      
      {/* Top Section Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200 no-scrollbar">
        {sectionsNav.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id)}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeSection === sec.id
                ? 'bg-[#ED2024] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-gray-50'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span><strong>Success!</strong> About page content synchronized live.</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Synchronized</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2 font-medium shadow-xs">
          <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Content Form Body */}
      <form onSubmit={handleSave} className="space-y-7">
        
        {/* ================= SECTION 1: HERO ================= */}
        {(activeSection === 'all' || activeSection === 'hero') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 1: Hero Banner &amp; Headline
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
                HERO CURTAIN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  About Us Overline
                </label>
                <input
                  type="text"
                  value={pageData?.hero?.eyebrow || ''}
                  onChange={(e) => updateField('hero', 'eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] focus:ring-1 focus:ring-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs transition-colors"
                  placeholder="ABOUT"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  About Us Main Title
                </label>
                <input
                  type="text"
                  value={pageData?.hero?.title || ''}
                  onChange={(e) => updateField('hero', 'title', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] focus:ring-1 focus:ring-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs transition-colors"
                  placeholder="LUMA"
                />
              </div>
            </div>

            <div className="pt-2">
              <ImageUploadField
                label="Banner Background Image (Top Curtain)"
                value={pageData?.hero?.bannerImage || ''}
                onChange={(val) => updateField('hero', 'bannerImage', val)}
                defaultPath="/assets/about/hero-bg.jpg"
                helpText="Upload an image from your device. Recommended: 3840 x 850px (JPG, PNG, or WEBP)"
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 2: INTRO & MISSION ================= */}
        {(activeSection === 'all' || activeSection === 'intro') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 2: Brand Story &amp; Mission
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
                ABOUT STORY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Heading Line 1
                </label>
                <input
                  type="text"
                  value={pageData?.intro?.headingLine1 || ''}
                  onChange={(e) => updateField('intro', 'headingLine1', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] focus:ring-1 focus:ring-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs transition-colors"
                  placeholder="THE SCIENCE OF LIGHT."
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Heading Line 2
                </label>
                <input
                  type="text"
                  value={pageData?.intro?.headingLine2 || ''}
                  onChange={(e) => updateField('intro', 'headingLine2', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] focus:ring-1 focus:ring-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs transition-colors"
                  placeholder="THE ART OF LIVING WELL."
                />
              </div>
            </div>

            <div className="pt-2">
              <ImageUploadField
                label="Story Panel Image (Left Column)"
                value={pageData?.intro?.storyImage || ''}
                onChange={(val) => updateField('intro', 'storyImage', val)}
                defaultPath="/assets/about/story-panel.jpg"
                helpText="Upload a lifestyle/panel photo from your device. Recommended: 1325 x 1000px"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-[12px] font-semibold text-[#64748B]">
                  About Us Description Paragraphs ({pageData?.intro?.paragraphs?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={addParagraph}
                  className="text-[11.5px] text-[#C29D62] hover:text-[#9A6726] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  + Add Paragraph
                </button>
              </div>

              {(pageData?.intro?.paragraphs || []).map((p, idx) => (
                <div key={idx} className="relative group p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1">
                    <span className="font-semibold">Paragraph {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeParagraph(idx)}
                      className="text-red-500 hover:text-red-700 text-[11px] font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] focus:ring-1 focus:ring-[#C29D62] rounded-[8px] p-3 text-[#1E293B] text-[13.5px] outline-none transition-colors leading-relaxed shadow-xs"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Closing Red Tagline
              </label>
              <input
                type="text"
                value={pageData?.intro?.tagline || ''}
                onChange={(e) => updateField('intro', 'tagline', e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[#ED2024] font-bold text-[14px] outline-none shadow-xs"
                placeholder="LUMA Red Light Therapy for a Brighter You."
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 3: BASICS & STAT CARDS ================= */}
        {(activeSection === 'all' || activeSection === 'basics') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 3: The Basics &amp; 3 Clinical Stat Cards
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                CLINICAL METRICS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Section Overline
                </label>
                <input
                  type="text"
                  value={pageData?.basics?.eyebrow || ''}
                  onChange={(e) => updateField('basics', 'eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={pageData?.basics?.heading || ''}
                  onChange={(e) => updateField('basics', 'heading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <VideoUploadField
                label="Wide Section Video & Poster (Clinical Demo)"
                videoUrl={pageData?.basics?.videoUrl || ''}
                posterUrl={pageData?.basics?.videoBannerImage || '/assets/about/dubai-rlt-banner.jpg'}
                onVideoChange={(val) => updateField('basics', 'videoUrl', val)}
                onPosterChange={(val) => updateField('basics', 'videoBannerImage', val)}
                helpText="Upload a video file (.mp4, .webm, .mov) directly from your device, or paste a video URL."
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Description Paragraph 1
              </label>
              <textarea
                rows={2}
                value={pageData?.basics?.explanationP1 || ''}
                onChange={(e) => updateField('basics', 'explanationP1', e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-4 text-[14px] text-[#1E293B] outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Description Paragraph 2
              </label>
              <textarea
                rows={2}
                value={pageData?.basics?.explanationP2 || ''}
                onChange={(e) => updateField('basics', 'explanationP2', e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-4 text-[14px] text-[#1E293B] outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-3">
                3 Key Stat Cards (Numbers &amp; Units)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(pageData?.basics?.statCards || []).map((card, idx) => (
                  <div key={idx} className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#C29D62] uppercase tracking-wider block">
                        Card {idx + 1}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] font-mono font-medium">
                        {(card.num ?? card.val ?? '') + (card.unit ? ` ${card.unit}` : '')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10.5px] text-[#64748B] font-semibold block mb-1">
                          Value / Number
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2, 20+, 0"
                          value={card.num ?? card.val ?? ''}
                          onChange={(e) => updateStatCard(idx, 'num', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[6px] px-3 py-1.5 text-[#1E293B] font-bold text-[13px] outline-none shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] text-[#64748B] font-semibold block mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. YRS, %"
                          value={card.unit ?? ''}
                          onChange={(e) => updateStatCard(idx, 'unit', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[6px] px-3 py-1.5 text-[#64748B] text-[13px] outline-none shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10.5px] text-[#64748B] font-semibold block mb-1">
                        Card Title / Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. WAVE LENGTH USED"
                        value={card.label ?? card.title ?? ''}
                        onChange={(e) => updateStatCard(idx, 'label', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[6px] px-3 py-1.5 text-[#1E293B] font-semibold text-[12.5px] outline-none shadow-xs"
                      />
                    </div>

                    {/* Live Mini Preview Badge */}
                    <div className="mt-2 p-2.5 rounded-[8px] bg-[linear-gradient(180deg,#ED2024_0%,#9D0508_100%)] text-white text-center flex flex-col items-center justify-center min-h-[58px] shadow-xs">
                      <div className="text-[17px] font-extrabold leading-none">
                        {card.num ?? card.val ?? '-'}
                        {card.unit && <span className="text-[11px] font-bold uppercase ml-1">{card.unit}</span>}
                      </div>
                      <div className="text-[9px] font-medium uppercase tracking-wider mt-1 opacity-95">
                        {card.label ?? card.title ?? 'Stat Label'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: SCIENCE & STEPS ================= */}
        {(activeSection === 'all' || activeSection === 'science') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 4: The Science &amp; 4-Step Healing Protocol
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">
                SCIENCE PROTOCOL
              </span>
            </div>

            <div className="space-y-4">
              <label className="block text-[12px] font-semibold text-[#64748B]">
                Dual Wavelength Cards (660nm Red vs 850nm NIR)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(pageData?.science?.wavelengthCards || []).map((w, idx) => (
                  <div key={idx} className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                    <span className="text-[11px] font-bold text-[#C29D62] uppercase tracking-wider block">
                      {w.badgeLine1} {w.badgeLine2}
                    </span>
                    <div>
                      <label className="text-[11px] text-[#64748B] block mb-1">Card Title</label>
                      <input
                        type="text"
                        value={w.title || ''}
                        onChange={(e) => updateWavelengthCard(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3.5 py-2 text-[#1E293B] font-bold text-[13px] outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#64748B] block mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={w.body || ''}
                        onChange={(e) => updateWavelengthCard(idx, 'body', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-3 text-[#1E293B] text-[13px] outline-none shadow-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-[12px] font-semibold text-[#64748B]">
                4 How It Works Steps
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(pageData?.science?.steps || []).map((step, idx) => (
                  <div key={idx} className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <span className="text-[11px] font-bold text-[#C29D62] uppercase tracking-wider">STEP {step.num}</span>
                    <input
                      type="text"
                      value={step.title || ''}
                      onChange={(e) => updateStep(idx, 'title', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-1.5 text-[#1E293B] font-semibold text-[13px] outline-none shadow-xs"
                    />
                    <textarea
                      rows={2}
                      value={step.body || ''}
                      onChange={(e) => updateStep(idx, 'body', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-2.5 text-[#475569] text-[12.5px] outline-none shadow-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 5: OUTCOMES & BENEFITS ================= */}
        {(activeSection === 'all' || activeSection === 'benefits') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 5: Six Outcomes, One Habit (Benefits Carousel)
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]">
                6 OUTCOMES CAROUSEL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-2">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={pageData?.benefits?.eyebrow || ''}
                  onChange={(e) => updateField('benefits', 'eyebrow', e.target.value)}
                  placeholder="SIX OUTCOMES, ONE HABIT"
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[#1E293B] text-[13.5px] outline-none shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-2">
                  Main Section Heading
                </label>
                <input
                  type="text"
                  value={pageData?.benefits?.heading || ''}
                  onChange={(e) => updateField('benefits', 'heading', e.target.value)}
                  placeholder="BENEFITS"
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[#1E293B] font-bold text-[13.5px] outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Benefit Outcome Tab Selector */}
            <div className="pt-2">
              <label className="block text-[12px] font-semibold text-[#64748B] mb-2.5">
                Select Benefit Outcome to Edit (1 of 6 Tabs)
              </label>
              <div className="flex flex-wrap gap-2">
                {(pageData?.benefits?.items || []).map((item, idx) => {
                  const isSelected = activeBenefitIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveBenefitIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ED2024] text-white shadow-xs'
                          : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      {item.num ? `${item.num}: ` : `${idx + 1}. `}
                      {item.pill || item.titleLine1 || `Outcome ${idx + 1}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Outcome Editor */}
            {(() => {
              const currentItem = pageData?.benefits?.items?.[activeBenefitIndex] || pageData?.benefits?.items?.[0] || {};
              const curIdx = activeBenefitIndex;

              return (
                <div className="p-5 sm:p-6 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-1">
                    <span className="text-[12px] font-bold text-[#C29D62] uppercase tracking-wider">
                      Editing: {currentItem.num || `Benefit 0${curIdx + 1}`} - {currentItem.pill || 'Outcome'}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      Outcome {curIdx + 1} of {(pageData?.benefits?.items || []).length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                        Pill Tab Text (Header Button)
                      </label>
                      <input
                        type="text"
                        value={currentItem.pill || ''}
                        onChange={(e) => updateBenefitItem(curIdx, 'pill', e.target.value)}
                        placeholder="e.g. CELLULAR REGENERATION"
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-1.5 text-[#1E293B] text-[12.5px] font-semibold outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                        Benefit Tag / Number
                      </label>
                      <input
                        type="text"
                        value={currentItem.num || ''}
                        onChange={(e) => updateBenefitItem(curIdx, 'num', e.target.value)}
                        placeholder="e.g. BENEFIT 01"
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-1.5 text-[#1E293B] text-[12.5px] font-bold outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                        Title Line 1
                      </label>
                      <input
                        type="text"
                        value={currentItem.titleLine1 || ''}
                        onChange={(e) => updateBenefitItem(curIdx, 'titleLine1', e.target.value)}
                        placeholder="e.g. CELLULAR"
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-1.5 text-[#1E293B] text-[12.5px] font-bold outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                        Title Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={currentItem.titleLine2 || ''}
                        onChange={(e) => updateBenefitItem(curIdx, 'titleLine2', e.target.value)}
                        placeholder="e.g. REGENERATION"
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-1.5 text-[#1E293B] text-[12.5px] font-bold outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                        Pill Width in Design (px)
                      </label>
                      <input
                        type="number"
                        value={currentItem.pillW || ''}
                        onChange={(e) => updateBenefitItem(curIdx, 'pillW', parseInt(e.target.value) || 350)}
                        placeholder="482"
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-1.5 text-[#1E293B] text-[12.5px] outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                      Outcome Description Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={currentItem.description || ''}
                      onChange={(e) => updateBenefitItem(curIdx, 'description', e.target.value)}
                      placeholder="Light energy boosts mitochondrial output, giving cells the fuel they need..."
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-3 text-[#1E293B] text-[13px] outline-none shadow-xs"
                    />
                  </div>

                  {/* Checklist Bullets */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-semibold text-[#64748B] block">
                        Checklist Bullet Points (With Checkmark Icons)
                      </label>
                      <button
                        type="button"
                        onClick={() => addBenefitBullet(curIdx)}
                        className="text-[11px] font-bold text-[#C29D62] hover:underline cursor-pointer"
                      >
                        + Add Bullet Point
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(currentItem.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <img
                            src="/assets/about/benefit-check-icon.png"
                            alt="Tick"
                            className="w-4 h-4 object-contain select-none shrink-0"
                          />
                          <input
                            type="text"
                            value={bullet || ''}
                            onChange={(e) => updateBenefitBullet(curIdx, bIdx, e.target.value)}
                            placeholder="e.g. INCREASES ATP PRODUCTION"
                            className="flex-1 bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-1.5 text-[#1E293B] text-[12.5px] outline-none shadow-xs"
                          />
                          {(currentItem.bullets || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBenefitBullet(curIdx, bIdx)}
                              className="text-[#94A3B8] hover:text-[#DC2626] text-[15px] px-1.5 cursor-pointer"
                              title="Delete bullet point"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload for Athlete / Model */}
                  <div className="pt-2">
                    <ImageUploadField
                      label={`Photo for ${currentItem.pill || 'Benefit'} (Left Column Image)`}
                      value={currentItem.image || ''}
                      onChange={(val) => updateBenefitItem(curIdx, 'image', val)}
                      defaultPath="/assets/about/benefits-athlete-exact.png"
                    />
                  </div>

                  {/* Live Visual Preview of the Selected Outcome */}
                  <div className="mt-4 p-4 rounded-[12px] bg-[#0A0A0B] text-white space-y-3 border border-[#27272A]">
                    <div className="flex items-center justify-between text-[10px] text-[#71717A] uppercase font-bold tracking-wider">
                      <span>Live Outcome Preview ({currentItem.num || 'BENEFIT 01'})</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#D61611] text-white text-[9px]">
                        {currentItem.pill || 'ACTIVE PILL'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#D61611] text-[11px] font-bold block uppercase tracking-wider">
                        {currentItem.num || 'BENEFIT'}
                      </span>
                      <h4 className="text-[16px] font-extrabold uppercase leading-tight tracking-wide text-white">
                        {currentItem.titleLine1 || 'TITLE 1'} {currentItem.titleLine2 || ''}
                      </h4>
                      <p className="text-[11.5px] text-[#A1A1AA] mt-1.5 leading-relaxed">
                        {currentItem.description || 'Description will appear here...'}
                      </p>
                    </div>
                    <ul className="space-y-1.5 pt-1 border-t border-[#1F1F23]">
                      {(currentItem.bullets || []).map((b, i) => (
                        <li key={i} className="flex items-center gap-2 text-[10.5px] text-[#D4D4D8] uppercase tracking-wide">
                          <img
                            src="/assets/about/benefit-check-icon.png"
                            alt="Tick"
                            className="w-3.5 h-3.5 object-contain select-none shrink-0"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================= SECTION 6: SAFETY & SPECS ================= */}
        {(activeSection === 'all' || activeSection === 'safety') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 6: Safety Guarantees &amp; Clinical Specs Table
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FAF5FF] text-[#7E22CE] border border-[#F3E8FF]">
                SAFETY &amp; SPECS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-2">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={pageData?.safety?.eyebrow || ''}
                  onChange={(e) => updateField('safety', 'eyebrow', e.target.value)}
                  placeholder="BUILT TO STANDARD"
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[#1E293B] text-[13.5px] outline-none shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-2">
                  Main Section Heading
                </label>
                <input
                  type="text"
                  value={pageData?.safety?.heading || ''}
                  onChange={(e) => updateField('safety', 'heading', e.target.value)}
                  placeholder="SAFETY &amp; TECH"
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[#1E293B] font-bold text-[13.5px] outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-3">
                Safety Guarantee Cards
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(pageData?.safety?.cards || []).map((card, idx) => (
                  <div key={idx} className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <label className="text-[11px] text-[#64748B] font-semibold block">Card {idx + 1} Title</label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => updateSafetyCard(idx, 'title', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3.5 py-1.5 text-[#1E293B] font-bold text-[13px] outline-none shadow-xs"
                    />
                    <label className="text-[11px] text-[#64748B] font-semibold block pt-1">Description</label>
                    <textarea
                      rows={3}
                      value={card.body || ''}
                      onChange={(e) => updateSafetyCard(idx, 'body', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-3 text-[#475569] text-[12.5px] outline-none shadow-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <div>
                  <label className="block text-[12px] font-semibold text-[#64748B]">
                    Technical Specification Rows ({pageData?.safety?.specRows?.length || 0})
                  </label>
                  <span className="text-[11.5px] text-[#94A3B8]">
                    Medical clearance details, irradiance, wavelengths, and certifications
                  </span>
                </div>

                <button
                  type="button"
                  onClick={addSpecRow}
                  className="self-start sm:self-auto px-3.5 py-1.5 rounded-[8px] bg-[#C29D62]/10 hover:bg-[#C29D62]/20 border border-[#C29D62]/30 text-[#C29D62] text-[11.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>+ Add Specification Row</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(pageData?.safety?.specRows || []).map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]"
                  >
                    <div className="w-[180px] sm:w-[220px] shrink-0">
                      <input
                        type="text"
                        value={spec.label || ''}
                        onChange={(e) => updateSpecRow(idx, 'label', e.target.value)}
                        placeholder="SPEC LABEL"
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-2 text-[#C29D62] font-bold text-[12px] uppercase outline-none shadow-xs"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={spec.value || ''}
                        onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                        placeholder="Specification details..."
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3 py-2 text-[#1E293B] text-[12.5px] outline-none shadow-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecRow(idx)}
                      title="Delete specification row"
                      className="p-2 rounded-[8px] text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 7: SHOP CTA ================= */}
        {(activeSection === 'all' || activeSection === 'shopCta') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 7: Bottom Shop CTA &amp; Storefront Redirect
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
                CALL TO ACTION
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Heading Line 1
                </label>
                <input
                  type="text"
                  value={pageData?.shopCta?.headingLine1 || ''}
                  onChange={(e) => updateField('shopCta', 'headingLine1', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Heading Line 2
                </label>
                <input
                  type="text"
                  value={pageData?.shopCta?.headingLine2 || ''}
                  onChange={(e) => updateField('shopCta', 'headingLine2', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Subtext
              </label>
              <textarea
                rows={3}
                value={pageData?.shopCta?.subtext || ''}
                onChange={(e) => updateField('shopCta', 'subtext', e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-4 text-[14px] text-[#1E293B] outline-none shadow-xs"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="sticky bottom-4 z-20 p-4 rounded-[14px] bg-white/95 border border-[#E2E8F0] backdrop-blur-md shadow-lg flex items-center justify-between gap-4">
          <div className="text-[12px] text-[#64748B] hidden sm:block">
            <span>Status: </span>
            <span className="text-[#1E293B] font-semibold">Live Synchronized</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2 rounded-[8px] bg-white hover:bg-gray-50 border border-[#CBD5E1] text-[#475569] text-[12.5px] font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Reset to Default
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-[8px] bg-[#ED2024] hover:bg-[#c9181b] text-white text-[12.5px] font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
