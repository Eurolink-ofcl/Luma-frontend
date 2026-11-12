import React, { useState, useEffect } from 'react';
import ImageUploadField from './ImageUploadField';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function CommunityCmsEditor({ onOpenLivePage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [pageData, setPageData] = useState(null);

  // Live user questions state from MongoDB Atlas
  const [questions, setQuestions] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({ total: 0, pending: 0, answered: 0, rejected: 0 });
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionFilter, setQuestionFilter] = useState('all');
  const [questionSearch, setQuestionSearch] = useState('');
  const [answeringId, setAnsweringId] = useState(null);
  const [answerForm, setAnswerForm] = useState({
    answer: '',
    answeredBy: 'LUMA Clinical Team',
    topic: 'General',
    helpfulCount: 12,
    sharePublicly: true,
  });
  const [actionAlert, setActionAlert] = useState(null);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newQuestionForm, setNewQuestionForm] = useState({
    question: '',
    answer: '',
    answeredBy: 'LUMA Clinical Team',
    topic: 'Skin',
    name: 'Community Member',
    email: 'team@lumaredlight.com',
    helpfulCount: 15,
  });

  // Fetch live community questions from MongoDB
  const fetchQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/community/questions`);
      const data = await res.json();
      if (res.ok && data.success) {
        setQuestions(data.data || []);
        if (data.counts) {
          setQuestionCounts(data.counts);
        }
      }
    } catch (err) {
      console.error('Error loading community questions in CMS:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Fetch live community page content
  const fetchPageContent = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/community`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setPageData(result.data);
      } else {
        setErrorMessage(result.message || 'Failed to load Community page content.');
      }
    } catch (err) {
      console.error('Error loading Community CMS data:', err);
      setErrorMessage('Could not connect to backend server at http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent();
    fetchQuestions();
  }, []);

  // Save changes
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/community`, {
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
      console.error('Error saving Community CMS data:', err);
      setErrorMessage('Network error while saving changes to backend.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default content
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset Community page content to default values?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/community/reset`, {
        method: 'POST',
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setPageData(result.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error resetting Community page:', err);
      setErrorMessage('Error resetting to default values.');
    } finally {
      setSaving(false);
    }
  };

  // Helpers for nested mutations
  const updateField = (section, field, value) => {
    setPageData((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  const updateHeroField = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      hero: {
        ...(prev?.hero || {}),
        [field]: value,
      },
    }));
  };

  const updateEventCard = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      hero: {
        ...(prev?.hero || {}),
        eventCard: {
          ...(prev?.hero?.eventCard || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateExpertsSectionField = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      expertsSection: {
        ...(prev?.expertsSection || {}),
        [field]: value,
      },
    }));
  };

  const updateExpertCard = (index, key, value) => {
    setPageData((prev) => {
      const currentCards = [...(prev?.expertsSection?.cards || [])];
      currentCards[index] = {
        ...currentCards[index],
        [key]: value,
      };
      return {
        ...prev,
        expertsSection: {
          ...(prev?.expertsSection || {}),
          cards: currentCards,
        },
      };
    });
  };

  const updateMeetExpertsField = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      meetExperts: {
        ...(prev?.meetExperts || {}),
        [field]: value,
      },
    }));
  };

  const updateExpertProfile = (index, key, value) => {
    setPageData((prev) => {
      const currentExperts = [...(prev?.meetExperts?.experts || [])];
      const updated = {
        ...currentExperts[index],
        [key]: value,
      };
      if (key === 'role') {
        updated.roleLines = value ? value.split('\n') : [];
      }
      currentExperts[index] = updated;
      return {
        ...prev,
        meetExperts: {
          ...(prev?.meetExperts || {}),
          experts: currentExperts,
        },
      };
    });
  };

  const updateQaItem = (index, key, value) => {
    setPageData((prev) => {
      const currentQa = [...(prev?.askExperts?.qaList || [])];
      currentQa[index] = {
        ...currentQa[index],
        [key]: value,
      };
      return {
        ...prev,
        askExperts: {
          ...(prev?.askExperts || {}),
          qaList: currentQa,
        },
      };
    });
  };

  const addQaItem = () => {
    setPageData((prev) => ({
      ...prev,
      askExperts: {
        ...(prev?.askExperts || {}),
        qaList: [
          ...(prev?.askExperts?.qaList || []),
          {
            id: Date.now(),
            question: 'New question title...',
            answer: 'Expert response from a verified professional...',
            meta: 'Medical Team · Clinical advice · 1 person found this helpful',
          },
        ],
      },
    }));
  };

  const removeQaItem = (index) => {
    setPageData((prev) => {
      const currentQa = (prev?.askExperts?.qaList || []).filter((_, i) => i !== index);
      return {
        ...prev,
        askExperts: {
          ...(prev?.askExperts || {}),
          qaList: currentQa,
        },
      };
    });
  };

  // Live Community Questions Handlers
  const handleStartAnswer = (q) => {
    setAnsweringId(q._id);
    setAnswerForm({
      answer: q.answer || '',
      answeredBy: q.answeredBy || 'Dr. Andrew Huberman',
      topic: q.topic || 'General',
      helpfulCount: typeof q.helpfulCount === 'number' ? q.helpfulCount : 12,
      sharePublicly: q.sharePublicly !== false,
    });
  };

  const handleSaveAnswer = async (qId) => {
    if (!answerForm.answer.trim()) {
      alert('Please write an answer before publishing.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/admin/community/questions/${qId}/answer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answerForm,
          status: 'answered',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionAlert('✓ Answer published successfully! It is now live on the Community page.');
        setAnsweringId(null);
        await fetchQuestions();
        setTimeout(() => setActionAlert(null), 4000);
      } else {
        alert(data.message || 'Failed to save answer');
      }
    } catch (err) {
      console.error('Error saving answer:', err);
      alert('Error communicating with server.');
    }
  };

  const handleToggleStatus = async (qId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/community/questions/${qId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionAlert(`✓ Question status changed to "${newStatus}".`);
        await fetchQuestions();
        setTimeout(() => setActionAlert(null), 4000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/community/questions/${qId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionAlert('✓ Question removed.');
        await fetchQuestions();
        setTimeout(() => setActionAlert(null), 4000);
      }
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  const handleCreateDirectQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionForm.question.trim() || !newQuestionForm.answer.trim()) {
      alert('Both question and answer are required.');
      return;
    }
    try {
      // 1. Submit question
      const createRes = await fetch(`${API_BASE_URL}/community/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestionForm.question.trim(),
          topic: newQuestionForm.topic,
          name: newQuestionForm.name,
          email: newQuestionForm.email,
          sharePublicly: true,
        }),
      });
      const createData = await createRes.json();
      if (createRes.ok && createData.data?._id) {
        // 2. Answer it immediately
        await fetch(`${API_BASE_URL}/admin/community/questions/${createData.data._id}/answer`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answer: newQuestionForm.answer.trim(),
            answeredBy: newQuestionForm.answeredBy,
            topic: newQuestionForm.topic,
            helpfulCount: newQuestionForm.helpfulCount,
            sharePublicly: true,
            status: 'answered',
          }),
        });
        setShowNewQuestionModal(false);
        setNewQuestionForm({
          question: '',
          answer: '',
          answeredBy: 'LUMA Clinical Team',
          topic: 'Skin',
          name: 'Community Member',
          email: 'team@lumaredlight.com',
          helpfulCount: 15,
        });
        setActionAlert('✓ New question and answer published live!');
        await fetchQuestions();
        setTimeout(() => setActionAlert(null), 4000);
      }
    } catch (err) {
      console.error('Error creating question:', err);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (questionFilter === 'pending' && q.status !== 'pending') return false;
    if (questionFilter === 'answered' && q.status !== 'answered') return false;
    if (questionSearch.trim()) {
      const s = questionSearch.toLowerCase();
      const matchQ = (q.question || '').toLowerCase().includes(s);
      const matchA = (q.answer || '').toLowerCase().includes(s);
      const matchName = (q.name || '').toLowerCase().includes(s);
      const matchEmail = (q.email || '').toLowerCase().includes(s);
      return matchQ || matchA || matchName || matchEmail;
    }
    return true;
  });

  const sectionsNav = [
    { id: 'all', label: 'All Sections' },
    { id: 'hero', label: '1. Hero & Live Event' },
    { id: 'experts', label: '2. Talk to Experts (6 Cards)' },
    { id: 'meet', label: '3. Meet Our Experts (3 Profiles)' },
    {
      id: 'qa',
      label: `4. Ask Experts & Q&A ${questionCounts.pending > 0 ? `(${questionCounts.pending} New)` : ''}`,
    },
    { id: 'quiz', label: '5. Quiz & WhatsApp CTA' },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <svg className="animate-spin h-8 w-8 text-[#ED2024] mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 text-[13px] font-medium">
          Loading Community page content...
        </p>
      </div>
    );
  }

  const heroData = pageData?.hero || {};
  const eventCard = heroData.eventCard || {};
  const expertsSectionData = pageData?.expertsSection || {};
  const cards = expertsSectionData.cards || [];
  const meetData = pageData?.meetExperts || {};
  const expertProfiles = meetData.experts || [];
  const askData = pageData?.askExperts || {};
  const qaList = askData.qaList || [];
  const quizData = pageData?.quizCta || {};

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
            <span><strong>Success!</strong> Community content synchronized live.</span>
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

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-7">
        
        {/* ================= SECTION 1: HERO & LIVE EVENT ================= */}
        {(activeSection === 'all' || activeSection === 'hero') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 1: Community Hero Header &amp; Live Webinar Event
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">
                LIVE EVENT &amp; HERO
              </span>
            </div>

            {/* Header Title 3 Lines */}
            <div>
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Hero Title (3 Stacked Lines)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Title Line 1
                  </label>
                  <input
                    type="text"
                    value={heroData.titleLine1 || ''}
                    onChange={(e) => updateHeroField('titleLine1', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                    placeholder="JOIN THE"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Title Line 2 (Red Highlight)
                  </label>
                  <input
                    type="text"
                    value={heroData.titleLine2 || ''}
                    onChange={(e) => updateHeroField('titleLine2', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[#ED2024] font-bold text-[14px] outline-none shadow-xs"
                    placeholder="LUMA"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Title Line 3
                  </label>
                  <input
                    type="text"
                    value={heroData.titleLine3 || ''}
                    onChange={(e) => updateHeroField('titleLine3', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                    placeholder="COMMUNITY"
                  />
                </div>
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  Red Action Button Text (Primary)
                </label>
                <input
                  type="text"
                  value={heroData.demoClassBtnText || ''}
                  onChange={(e) => updateHeroField('demoClassBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="DEMO CLASS"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  Dark Action Button Text (Secondary)
                </label>
                <input
                  type="text"
                  value={heroData.askQuestionBtnText || ''}
                  onChange={(e) => updateHeroField('askQuestionBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="ASK QUESTION"
                />
              </div>
            </div>

            {/* Event Card Section */}
            <div className="p-5 sm:p-6 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-[12.5px] font-bold uppercase tracking-wider text-[#C29D62]">
                  Next Live Community Event Card
                </h4>
                <span className="text-[11px] text-gray-500 font-medium">1335x708px banner</span>
              </div>

              {/* Event Card Background Image Upload Field */}
              <div className="bg-white p-4 rounded-[10px] border border-[#E2E8F0]">
                <ImageUploadField
                  label="Live Event Card Background Image (Sliced Red Abstract / Neon Light)"
                  value={eventCard.bgImage || ''}
                  onChange={(url) => updateEventCard('bgImage', url)}
                  defaultPath="/assets/community/event-card-bg.jpg"
                  helpText="Upload a banner image from device. Dimensions: 1335 x 708px"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Card Eyebrow</label>
                  <input
                    type="text"
                    value={eventCard.eyebrow || ''}
                    onChange={(e) => updateEventCard('eyebrow', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                    placeholder="Next Event"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Event Title</label>
                  <input
                    type="text"
                    value={eventCard.title || ''}
                    onChange={(e) => updateEventCard('title', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] font-bold outline-none shadow-xs"
                    placeholder="Red Light Therapy Talk"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Event Description</label>
                <textarea
                  rows={2}
                  value={eventCard.description || ''}
                  onChange={(e) => updateEventCard('description', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-3 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Join us live to learn how red light therapy works..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Date &amp; Time Text</label>
                  <input
                    type="text"
                    value={eventCard.dateText || ''}
                    onChange={(e) => updateEventCard('dateText', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                    placeholder="Thu, 5 Dec  7:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Location / Format</label>
                  <input
                    type="text"
                    value={eventCard.locationText || ''}
                    onChange={(e) => updateEventCard('locationText', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                    placeholder="Online"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Join Button Label</label>
                  <input
                    type="text"
                    value={eventCard.joinLinkText || ''}
                    onChange={(e) => updateEventCard('joinLinkText', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                    placeholder="Get the join link"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Live Meeting URL (Google Meet / Zoom)</label>
                  <input
                    type="text"
                    value={eventCard.joinLinkUrl || eventCard.meetLink || ''}
                    onChange={(e) => {
                      updateEventCard('joinLinkUrl', e.target.value);
                      updateEventCard('meetLink', e.target.value);
                    }}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs font-mono"
                    placeholder="https://meet.google.com/abc-defg-hij"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: TALK TO THE EXPERTS (6 CARDS) ================= */}
        {(activeSection === 'all' || activeSection === 'experts') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 2: Talk to the Experts Directory
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                6 INTERACTIVE CARDS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={expertsSectionData.title || ''}
                  onChange={(e) => updateExpertsSectionField('title', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="TALK TO THE EXPERTS"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Filter Category Tabs (Comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(expertsSectionData.categories) ? expertsSectionData.categories.join(', ') : ''}
                  onChange={(e) => {
                    const parsed = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    updateExpertsSectionField('categories', parsed);
                  }}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="ALL, SKIN, RECOVERY, SLEEP, BEGINNERS"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  6 Video &amp; Consultation Cards
                </label>
                <span className="text-[11px] text-gray-500 font-medium">Card size: 848 x 720px</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cards.map((card, idx) => (
                  <div key={card.id || idx} className="p-4 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#C29D62] uppercase tracking-wider">
                          Card {idx + 1}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono">
                          ID: {card.id || idx + 1}
                        </span>
                      </div>

                      {/* Card Image Upload Field with preview */}
                      <ImageUploadField
                        label={`Card ${idx + 1} Sliced Image`}
                        value={card.image || ''}
                        onChange={(url) => updateExpertCard(idx, 'image', url)}
                        defaultPath={`/assets/community/expert-card-${idx + 1}.jpg`}
                        helpText="Upload from computer or set image URL"
                      />

                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Card Title (Uppercase)</label>
                        <textarea
                          rows={2}
                          value={card.title || ''}
                          onChange={(e) => updateExpertCard(idx, 'title', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[6px] p-2.5 text-[12.5px] font-bold text-[#1E293B] outline-none shadow-xs"
                          placeholder="RED LIGHT THERAPY..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Categories (Comma separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(card.categories) ? card.categories.join(', ') : (card.category ? (Array.isArray(card.category) ? card.category.join(', ') : card.category) : '')}
                          onChange={(e) => {
                            const parsed = e.target.value.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
                            updateExpertCard(idx, 'categories', parsed);
                          }}
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[6px] px-3 py-1.5 text-[12px] text-[#475569] outline-none shadow-xs"
                          placeholder="ALL, BEGINNERS"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 3: MEET OUR EXPERTS ================= */}
        {(activeSection === 'all' || activeSection === 'meet') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 3: Meet Our Experts
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FAF5FF] text-[#7E22CE] border border-[#F3E8FF]">
                3 EXPERT PROFILES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={meetData.title || ''}
                  onChange={(e) => updateMeetExpertsField('title', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="MEET OUR EXPERTS"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Subheading
                </label>
                <input
                  type="text"
                  value={meetData.subheading || ''}
                  onChange={(e) => updateMeetExpertsField('subheading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="EVERY TALK AND ANSWER COMES FROM A QUALIFIED PROFESSIONAL."
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                  3 Expert Portraits &amp; Credential Profiles
                </label>
                <span className="text-[11px] text-gray-500 font-medium">Portrait size: 647 x 660px</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {expertProfiles.map((expert, idx) => (
                  <div key={expert.id || idx} className="p-4 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                    <span className="text-[11px] font-bold text-[#C29D62] uppercase tracking-wider block">
                      Expert {idx + 1} Profile
                    </span>

                    {/* Expert Portrait Image Upload */}
                    <ImageUploadField
                      label={`Expert ${idx + 1} Portrait`}
                      value={expert.image || ''}
                      onChange={(url) => updateExpertProfile(idx, 'image', url)}
                      defaultPath={`/assets/community/expert-person-${idx + 1}.jpg`}
                      helpText="Upload portrait photo or set image URL"
                    />

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={expert.name || ''}
                        onChange={(e) => updateExpertProfile(idx, 'name', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[6px] px-3 py-1.5 text-[13px] font-bold text-[#1E293B] outline-none shadow-xs"
                        placeholder="Expert Name"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Role / Specialty (Enter newline for multiline stack)
                      </label>
                      <textarea
                        rows={2}
                        value={expert.role || (expert.roleLines ? expert.roleLines.join('\n') : '')}
                        onChange={(e) => updateExpertProfile(idx, 'role', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[6px] p-2 text-[12px] font-semibold text-[#475569] outline-none shadow-xs"
                        placeholder="ONLINE TRANSFORMATION COACH"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: ASK EXPERTS & Q&A ================= */}
        {(activeSection === 'all' || activeSection === 'qa') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-7">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 4: Ask Experts &amp; Community Q&amp;A
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {questionCounts.pending > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                    {questionCounts.pending} NEW QUESTION{questionCounts.pending > 1 ? 'S' : ''} PENDING
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
                  LIVE MONGODB Q&amp;A
                </span>
              </div>
            </div>

            {/* Section CMS Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={askData.title || ''}
                  onChange={(e) => updateField('askExperts', 'title', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] font-bold outline-none shadow-xs"
                  placeholder="ASK OUR EXPERTS"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Section Subheading
                </label>
                <input
                  type="text"
                  value={askData.subheading || ''}
                  onChange={(e) => updateField('askExperts', 'subheading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Send your question..."
                />
              </div>
            </div>

            {/* Action Alert Banner */}
            {actionAlert && (
              <div className="p-3.5 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center justify-between shadow-xs animate-fadeIn">
                <span>{actionAlert}</span>
                <button
                  type="button"
                  onClick={() => setActionAlert(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-[12px] font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ================= USER QUESTIONS & CLINICAL ANSWERS MANAGER ================= */}
            <div className="mt-4 pt-6 border-t border-[#F1F5F9] space-y-5">
              
              {/* Header & Controls Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-[15px] font-bold text-[#1E293B] flex items-center gap-2">
                    <span>User Questions &amp; Published Answers</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      {questions.length} Total
                    </span>
                  </h4>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    Questions submitted by visitors appear here. Answer them to publish them directly to the Community page.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={fetchQuestions}
                    disabled={questionsLoading}
                    className="px-3 py-1.5 rounded-[8px] text-[12px] font-semibold bg-gray-100 hover:bg-gray-200 text-[#475569] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className={`w-3.5 h-3.5 ${questionsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>

                  {/* Add New Doctor Q&A Button */}
                  <button
                    type="button"
                    onClick={() => setShowNewQuestionModal(true)}
                    className="px-3.5 py-1.5 rounded-[8px] text-[12px] font-bold bg-[#ED2024] hover:bg-[#c9181b] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>+ Add New Q&amp;A</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0]">
                {/* Status Tabs */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuestionFilter('all')}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer ${
                      questionFilter === 'all'
                        ? 'bg-white text-[#1E293B] shadow-xs font-bold'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    All ({questionCounts.total})
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuestionFilter('pending')}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      questionFilter === 'pending'
                        ? 'bg-amber-500 text-white shadow-xs font-bold'
                        : 'text-amber-800 hover:bg-amber-100/60'
                    }`}
                  >
                    <span>Pending Review</span>
                    {questionCounts.pending > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${questionFilter === 'pending' ? 'bg-white text-amber-600' : 'bg-amber-200 text-amber-900'}`}>
                        {questionCounts.pending}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuestionFilter('answered')}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer ${
                      questionFilter === 'answered'
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-emerald-800 hover:bg-emerald-100/60'
                    }`}
                  >
                    Answered &amp; Live ({questionCounts.answered})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[200px]">
                  <input
                    type="text"
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    placeholder="Search question, name, topic..."
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] pl-8 pr-3 py-1 text-[12px] text-[#1E293B] outline-none"
                  />
                  <svg className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>

              {/* Questions Cards List */}
              {questionsLoading && questions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-[13px]">
                  Loading questions from database...
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#CBD5E1] rounded-[12px] bg-[#F8FAFC]">
                  <p className="text-[13px] font-semibold text-[#64748B]">No questions found matching filter.</p>
                  <p className="text-[12px] text-[#94A3B8] mt-1">Submit a test question on the frontend to test the flow.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((q) => {
                    const isEditing = answeringId === q._id;
                    const isAnswered = q.status === 'answered' && Boolean(q.answer);

                    return (
                      <div
                        key={q._id}
                        className={`p-5 rounded-[16px] border transition-all ${
                          q.status === 'pending'
                            ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                            : 'bg-white border-[#E2E8F0] shadow-xs'
                        }`}
                      >
                        {/* Top Meta Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[13px] text-[#1E293B]">
                              {q.name || 'Community Member'}
                            </span>
                            <span className="text-[11px] text-[#64748B]">
                              ({q.email})
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              Topic: {q.topic || 'General'}
                            </span>
                            {q.createdAt && (
                              <span className="text-[11px] text-[#94A3B8]">
                                · {new Date(q.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {q.status === 'pending' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                <span>Pending Answer</span>
                              </span>
                            ) : q.status === 'answered' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <span>✓ Published Live</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-gray-100 text-gray-700 border border-gray-300">
                                {q.status}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="mt-3.5">
                          <div className="flex items-start gap-2.5">
                            <span className="text-[12px] font-black text-[#ED2024] uppercase tracking-wider shrink-0 mt-0.5">
                              QUESTION:
                            </span>
                            <p className="text-[14px] sm:text-[15px] font-semibold text-[#0F172A] leading-snug">
                              "{q.question}"
                            </p>
                          </div>
                        </div>

                        {/* Answering / Editing Box */}
                        {isEditing ? (
                          <div className="mt-4 p-4 rounded-[12px] bg-[#F8FAFC] border-2 border-[#ED2024]/30 space-y-3.5 animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] font-bold text-[#ED2024] uppercase tracking-wider">
                                Type Doctor / Clinical Answer:
                              </span>
                              <span className="text-[11px] text-gray-500">
                                This answer will display under the question on the frontend
                              </span>
                            </div>

                            {/* Answer Textarea */}
                            <textarea
                              rows={3}
                              value={answerForm.answer}
                              onChange={(e) => setAnswerForm({ ...answerForm, answer: e.target.value })}
                              placeholder="Type expert medical or clinical answer here..."
                              className="w-full bg-white border border-[#CBD5E1] focus:border-[#ED2024] rounded-[8px] p-3 text-[13px] text-[#1E293B] outline-none shadow-xs"
                              autoFocus
                            />

                            {/* Row with Author & Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                                  Answered By (Doctor / Title)
                                </label>
                                <input
                                  type="text"
                                  value={answerForm.answeredBy}
                                  onChange={(e) => setAnswerForm({ ...answerForm, answeredBy: e.target.value })}
                                  placeholder="e.g. Dr. Andrew Huberman"
                                  className="w-full bg-white border border-[#CBD5E1] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12px] text-[#1E293B] font-medium outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                                  Topic Tag
                                </label>
                                <select
                                  value={answerForm.topic}
                                  onChange={(e) => setAnswerForm({ ...answerForm, topic: e.target.value })}
                                  className="w-full bg-white border border-[#CBD5E1] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12px] text-[#1E293B] font-medium outline-none"
                                >
                                  {['Skin', 'Sleep', 'Recovery', 'Beginners', 'General'].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                                  Helpful Count
                                </label>
                                <input
                                  type="number"
                                  value={answerForm.helpfulCount}
                                  onChange={(e) => setAnswerForm({ ...answerForm, helpfulCount: Number(e.target.value) })}
                                  className="w-full bg-white border border-[#CBD5E1] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12px] text-[#1E293B] font-medium outline-none"
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-200">
                              <button
                                type="button"
                                onClick={() => setAnsweringId(null)}
                                className="px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveAnswer(q._id)}
                                className="px-4 py-1.5 rounded-[8px] text-[12px] font-bold bg-[#16A34A] hover:bg-[#15803d] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>✓ Publish Answer to Website</span>
                              </button>
                            </div>
                          </div>
                        ) : isAnswered ? (
                          /* Already Answered View */
                          <div className="mt-3.5 p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider shrink-0 mt-0.5">
                                ANSWER:
                              </span>
                              <p className="text-[13px] text-[#334155] leading-relaxed font-normal">
                                {q.answer}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-gray-200/80 gap-2 text-[11px] text-[#64748B]">
                              <span>
                                {q.meta || `${q.answeredBy || 'LUMA Clinical Team'} · ${q.topic || 'General'} · ${q.helpfulCount || 12} people found this helpful`}
                              </span>

                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => handleStartAnswer(q)}
                                  className="text-[11px] font-bold text-[#C29D62] hover:text-[#9A6726] transition-colors cursor-pointer"
                                >
                                  Edit Answer
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(q._id, 'pending')}
                                  className="text-[11px] font-medium text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
                                >
                                  Unpublish
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuestion(q._id)}
                                  className="text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Pending View - Action Button */
                          <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[11px] text-amber-700 font-medium">
                              This question is awaiting a reply from LUMA clinicians.
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(q._id, 'rejected')}
                                className="px-3 py-1 rounded-[6px] text-[11px] font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartAnswer(q)}
                                className="px-3.5 py-1.5 rounded-[8px] text-[12px] font-bold bg-[#ED2024] hover:bg-[#c9181b] text-white shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>Answer Question</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal: Add New Question & Answer Directly from Admin */}
            {showNewQuestionModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-[20px] max-w-[620px] w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h4 className="text-[16px] font-bold text-[#1E293B]">
                      Create &amp; Publish New Question &amp; Answer
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowNewQuestionModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-[18px] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateDirectQuestion} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Question Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={newQuestionForm.question}
                        onChange={(e) => setNewQuestionForm({ ...newQuestionForm, question: e.target.value })}
                        placeholder="e.g. How often should a beginner use red light therapy?"
                        className="w-full bg-white border border-[#CBD5E1] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] font-bold text-[#1E293B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Doctor / Expert Answer *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newQuestionForm.answer}
                        onChange={(e) => setNewQuestionForm({ ...newQuestionForm, answer: e.target.value })}
                        placeholder="Write clear, comprehensive doctor answer..."
                        className="w-full bg-white border border-[#CBD5E1] focus:border-[#ED2024] rounded-[8px] p-3 text-[13px] text-[#1E293B] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                          Answered By (Doctor / Specialist)
                        </label>
                        <input
                          type="text"
                          value={newQuestionForm.answeredBy}
                          onChange={(e) => setNewQuestionForm({ ...newQuestionForm, answeredBy: e.target.value })}
                          placeholder="Dr. Andrew Huberman"
                          className="w-full bg-white border border-[#CBD5E1] focus:border-[#ED2024] rounded-[8px] px-3 py-1.5 text-[12px] text-[#1E293B] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                          Topic
                        </label>
                        <select
                          value={newQuestionForm.topic}
                          onChange={(e) => setNewQuestionForm({ ...newQuestionForm, topic: e.target.value })}
                          className="w-full bg-white border border-[#CBD5E1] focus:border-[#ED2024] rounded-[8px] px-3 py-1.5 text-[12px] text-[#1E293B] outline-none"
                        >
                          {['Skin', 'Sleep', 'Recovery', 'Beginners', 'General'].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setShowNewQuestionModal(false)}
                        className="px-4 py-2 rounded-[8px] text-[12px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-[8px] text-[12px] font-bold bg-[#ED2024] hover:bg-[#c9181b] text-white shadow-xs transition-colors cursor-pointer"
                      >
                        Publish to Community
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= SECTION 5: QUIZ & WHATSAPP CTA ================= */}
        {(activeSection === 'all' || activeSection === 'quiz') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#C29D62]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 5: Clinical Quiz &amp; WhatsApp Community CTA
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
                CONSULTATION CTA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={quizData.title || ''}
                  onChange={(e) => updateField('quizCta', 'title', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] font-bold outline-none shadow-xs"
                  placeholder="NOT SURE WHERE TO START?"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Quiz Button Label
                </label>
                <input
                  type="text"
                  value={quizData.findLumaBtnText || ''}
                  onChange={(e) => updateField('quizCta', 'findLumaBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="FIND MY LUMA"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Consultation Body Description
              </label>
              <textarea
                rows={2}
                value={quizData.subtitle || quizData.description || ''}
                onChange={(e) => {
                  updateField('quizCta', 'subtitle', e.target.value);
                  updateField('quizCta', 'description', e.target.value);
                }}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] p-3 text-[13px] text-[#1E293B] outline-none shadow-xs"
                placeholder="Take the one-minute quiz to find the LUMA made for your routine..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  WhatsApp Button Label
                </label>
                <input
                  type="text"
                  value={quizData.whatsappBtnText || ''}
                  onChange={(e) => updateField('quizCta', 'whatsappBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="JOIN ON WHATSAPP"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  WhatsApp Contact / Chat Link
                </label>
                <input
                  type="text"
                  value={quizData.whatsappUrl || ''}
                  onChange={(e) => updateField('quizCta', 'whatsappUrl', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#C29D62] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] font-mono outline-none shadow-xs"
                  placeholder="https://wa.me/971501234567"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  Connects visitors directly to the WhatsApp support number (+971 50 123 4567).
                </p>
              </div>
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
              Reset to Defaults
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
