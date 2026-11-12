import React, { useState, useEffect } from 'react';
import ImageUploadField from './ImageUploadField';

const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_WAVELENGTHS = [
  {
    id: 480,
    value: '480',
    unit: 'nm',
    label: 'Skin surface',
    primaryTitle: 'Primary',
    primaryDesc: 'Blemish & acne control\nroutines.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Surface purification and\nanti-bacterial support.',
    depth: '1 to 2 mm',
    research: 'Well documented for surface acne.',
    callout: '1-2 mm',
    type: 'blue',
  },
  {
    id: 630,
    value: '630',
    unit: 'nm',
    label: 'Epidermis',
    primaryTitle: 'Primary',
    primaryDesc: 'Cellular glow & tone\nevening.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Fine line smoothing and\nskin brightening.',
    depth: '2 to 3 mm',
    research: 'Extensively studied for tone.',
    callout: '2-3 mm',
    type: 'red',
  },
  {
    id: 650,
    value: '650',
    unit: 'nm',
    label: 'Upper Dermis',
    primaryTitle: 'Primary',
    primaryDesc: 'Fibroblast & elasticity\nsupport.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Collagen matrix enhancement\nand plumpness.',
    depth: '3 to 4 mm',
    research: 'Proven dermal density increase.',
    callout: '3-4 mm',
    type: 'red',
  },
  {
    id: 660,
    value: '660',
    unit: 'nm',
    label: 'Skin surface',
    primaryTitle: 'Primary',
    primaryDesc: 'Skin, collagen support\nand scalp routines.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Skin recovery and\nhealing-support routines.',
    depth: '1 to 5 mm',
    research: 'Well studied for skin.',
    callout: '5 mm',
    type: 'red',
  },
  {
    id: 670,
    value: '670',
    unit: 'nm',
    label: 'Deep Dermis',
    primaryTitle: 'Primary',
    primaryDesc: 'Mitochondrial cytochrome c\nrecharge.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Accelerated cellular energy\nand cellular repair.',
    depth: '4 to 5 mm',
    research: 'Benchmark for photobiomodulation.',
    callout: '5 mm',
    type: 'red',
  },
  {
    id: 810,
    value: '810',
    unit: 'nm',
    label: 'Subcutaneous',
    primaryTitle: 'Primary',
    primaryDesc: 'Deep connective and\nneural tissue repair.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Relief for deep muscle\nstrain and trauma.',
    depth: '10 to 30 mm',
    research: 'Studied for deep tissue repair.',
    callout: '25-30 mm',
    type: 'nir',
  },
  {
    id: 830,
    value: '830',
    unit: 'nm',
    label: 'Connective & Bone',
    primaryTitle: 'Primary',
    primaryDesc: 'Micro-vascularization and\ntendon repair.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Accelerated bone healing\nand joint soothing.',
    depth: '15 to 35 mm',
    research: 'Clinically validated for healing.',
    callout: '30-35 mm',
    type: 'nir',
  },
  {
    id: 850,
    value: '850',
    unit: 'nm',
    label: 'Deep Muscle',
    primaryTitle: 'Primary',
    primaryDesc: 'Athletic muscle recovery\nand lactate clearance.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Relief for deep tendon\ninflammation and stiffness.',
    depth: '20 to 45 mm',
    research: 'Elite athletic benchmark.',
    callout: '45 mm',
    type: 'nir',
  },
  {
    id: 1060,
    value: '1060',
    unit: 'nm',
    label: 'Deepest Systemic',
    primaryTitle: 'Primary',
    primaryDesc: 'Maximum tissue depth\npenetration.',
    secondaryTitle: 'Secondary',
    secondaryDesc: 'Bypasses surface water\nabsorption for vitality.',
    depth: '30 to 50 mm',
    research: 'Cutting-edge clinical wavelength.',
    callout: '50 mm',
    type: 'silver',
  },
];

const DEFAULT_ASSESSMENT_QUIZ = {
  eyebrow: 'THE LUMA 1-MINUTE ASSESSMENT',
  heading: 'FIND THE LIGHT THAT FITS YOU',
  subtitle: 'Five questions. One panel, matched to your body, your space and your ritual.',
  questions: [
    {
      id: 1,
      title: 'Question 1 of 5',
      question: 'What do you want light to do for you?',
      options: [
        { title: 'Recover faster', subtitle: 'After training, soreness, long days' },
        { title: 'Glow', subtitle: 'Skin tone, texture, fine lines' },
        { title: 'Calm & sleep', subtitle: 'A slower evening, deeper rest' },
        { title: 'Ease aches', subtitle: 'Joints, back and tension' },
      ],
    },
    {
      id: 2,
      title: 'Question 2 of 5',
      question: 'Where will it live?',
      options: [
        { title: 'Bedroom or desk', subtitle: 'Compact, easy to tuck away' },
        { title: 'Home gym', subtitle: 'Beside the mat or the rack' },
        { title: 'Dedicated wellness room', subtitle: 'Space to stand and stay' },
        { title: 'A studio or clinic', subtitle: 'Shared, daily, professional' },
      ],
    },
    {
      id: 3,
      title: 'Question 3 of 5',
      question: 'How much of you needs the light?',
      options: [
        { title: 'Face & targeted spots', subtitle: 'Precise, close-up' },
        { title: 'Upper body', subtitle: 'Face, neck, shoulders, chest' },
        { title: 'Head to toe', subtitle: 'Full-body, in one session' },
      ],
    },
    {
      id: 4,
      title: 'Question 4 of 5',
      question: 'What does your ritual look like?',
      options: [
        { title: 'Quick and daily', subtitle: 'Ten minutes, no fuss' },
        { title: 'A proper pause', subtitle: 'Fifteen to twenty unhurried minutes' },
        { title: 'Shared', subtitle: 'Family, clients or guests' },
      ],
    },
    {
      id: 5,
      title: 'Question 5 of 5',
      question: 'How do you invest in wellbeing?',
      options: [
        { title: 'Start simple', subtitle: 'Essential, well made' },
        { title: 'Balanced', subtitle: 'Performance and value' },
        { title: 'No compromise', subtitle: 'The full experience' },
      ],
    },
  ],
  resultMatch: {
    matchTag: 'YOUR MATCH',
    brand: 'LUMA',
    model: 'Surge',
    productSlug: 'luma-surge',
    productImage: '/assets/products/luma-surge.png',
    headline: 'Balanced power for the body in motion.',
    summary: 'You want real performance without the full commitment of space.',
    features: [
      { bold: 'Faster recovery.', rest: 'Broader coverage to support muscles after effort.' },
      { bold: 'Calmer evenings.', rest: 'Wind down with warm, restorative light.' },
      { bold: 'Everyday versatility.', rest: 'Face and upper body in one graceful session.' },
    ],
    ctaText: 'EXPLORE SURGE',
    ctaLink: '#products',
  },
};

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

export default function HomeCmsEditor({ onOpenLivePage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [pageData, setPageData] = useState(null);
  const [activeWavelengthTab, setActiveWavelengthTab] = useState(660);
  const [viewAllWavelengths, setViewAllWavelengths] = useState(false);
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState(0);
  const [activeQuizView, setActiveQuizView] = useState('questions'); // 'questions' | 'result'
  const [activeBeforeAfterTab, setActiveBeforeAfterTab] = useState('ACNE');

  // Fetch live homepage content
  const fetchPageContent = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/pages/home`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setPageData(result.data);
      } else {
        setErrorMessage(result.message || 'Failed to load Homepage content.');
      }
    } catch (err) {
      console.error('Error loading Homepage CMS data:', err);
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
      const response = await fetch(`${API_BASE_URL}/admin/pages/home`, {
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
      console.error('Error saving Homepage CMS data:', err);
      setErrorMessage('Network error while saving changes to backend.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default content
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset Homepage content to default values?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/pages/home/reset`, {
        method: 'POST',
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setPageData(result.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error resetting Homepage:', err);
      setErrorMessage('Error resetting to default values.');
    } finally {
      setSaving(false);
    }
  };

  // Helper mutations for state
  const updateSectionField = (section, field, value) => {
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

  const updateAboutField = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      aboutSection: {
        ...(prev?.aboutSection || {}),
        [field]: value,
      },
    }));
  };

  const updateAboutParagraph = (index, value) => {
    setPageData((prev) => {
      const paras = [...(prev?.aboutSection?.paragraphs || [])];
      paras[index] = value;
      return {
        ...prev,
        aboutSection: {
          ...(prev?.aboutSection || {}),
          paragraphs: paras,
        },
      };
    });
  };

  const updateBenefitCard = (index, key, value) => {
    setPageData((prev) => {
      const cards = [...(prev?.benefitsOverview?.cards || [])];
      cards[index] = { ...cards[index], [key]: value };
      return {
        ...prev,
        benefitsOverview: {
          ...(prev?.benefitsOverview || {}),
          cards,
        },
      };
    });
  };

  const updateExpertTestimonial = (index, key, value) => {
    setPageData((prev) => {
      const experts = [...(prev?.expertTestimonials?.experts || [])];
      experts[index] = { ...experts[index], [key]: value };
      return {
        ...prev,
        expertTestimonials: {
          ...(prev?.expertTestimonials || {}),
          experts,
        },
      };
    });
  };

  const updateGuaranteeCard = (index, key, value) => {
    setPageData((prev) => {
      const cards = [...(prev?.trustGuarantees?.cards || [])];
      cards[index] = { ...cards[index], [key]: value };
      return {
        ...prev,
        trustGuarantees: {
          ...(prev?.trustGuarantees || {}),
          cards,
        },
      };
    });
  };

  const updateFaqItem = (index, key, value) => {
    setPageData((prev) => {
      const items = [...(prev?.faqsSection?.items || [])];
      items[index] = { ...items[index], [key]: value };
      return {
        ...prev,
        faqsSection: {
          ...(prev?.faqsSection || {}),
          items,
        },
      };
    });
  };

  const updateProductRangeField = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      productRange: {
        ...(prev?.productRange || {}),
        [field]: value,
      },
    }));
  };

  const updateProductRangeCard = (index, key, value) => {
    setPageData((prev) => {
      const cards = [...(prev?.productRange?.cards || [])];
      cards[index] = { ...cards[index], [key]: value };
      return {
        ...prev,
        productRange: {
          ...(prev?.productRange || {}),
          cards,
        },
      };
    });
  };

  const updateTrustItem = (index, key, value) => {
    setPageData((prev) => {
      const currentItems = Array.isArray(prev?.trustStrip?.items) && prev.trustStrip.items.length > 0
        ? [...prev.trustStrip.items]
        : [
            { text: 'ONE & ONLY 8-WAVELENGTH PANEL', icon: '/assets/energy_14368783.png' },
            { text: 'CERTIFIED: BSCI - ISO9001 - ISO14001 - ISO45001', icon: '' },
            { text: 'MDSAP CERTIFIED', icon: '/assets/best_13654983.png' },
            { text: 'CE CERTIFIED', icon: '/assets/protect_10831389.png' },
            { text: 'FREE GLOBAL DELIVERY', icon: '/assets/delivery-truck.png' },
          ];
      currentItems[index] = { ...currentItems[index], [key]: value };
      return {
        ...prev,
        trustStrip: {
          ...(prev?.trustStrip || {}),
          items: currentItems,
        },
      };
    });
  };

  const addTrustItem = () => {
    setPageData((prev) => {
      const currentItems = Array.isArray(prev?.trustStrip?.items) && prev.trustStrip.items.length > 0
        ? [...prev.trustStrip.items]
        : [
            { text: 'ONE & ONLY 8-WAVELENGTH PANEL', icon: '/assets/energy_14368783.png' },
            { text: 'CERTIFIED: BSCI - ISO9001 - ISO14001 - ISO45001', icon: '' },
            { text: 'MDSAP CERTIFIED', icon: '/assets/best_13654983.png' },
            { text: 'CE CERTIFIED', icon: '/assets/protect_10831389.png' },
            { text: 'FREE GLOBAL DELIVERY', icon: '/assets/delivery-truck.png' },
          ];
      currentItems.push({
        text: 'NEW TRUST BADGE',
        icon: '',
      });
      return {
        ...prev,
        trustStrip: {
          ...(prev?.trustStrip || {}),
          items: currentItems,
        },
      };
    });
  };

  const removeTrustItem = (index) => {
    setPageData((prev) => {
      const currentItems = Array.isArray(prev?.trustStrip?.items) && prev.trustStrip.items.length > 0
        ? [...prev.trustStrip.items]
        : [
            { text: 'ONE & ONLY 8-WAVELENGTH PANEL', icon: '/assets/energy_14368783.png' },
            { text: 'CERTIFIED: BSCI - ISO9001 - ISO14001 - ISO45001', icon: '' },
            { text: 'MDSAP CERTIFIED', icon: '/assets/best_13654983.png' },
            { text: 'CE CERTIFIED', icon: '/assets/protect_10831389.png' },
            { text: 'FREE GLOBAL DELIVERY', icon: '/assets/delivery-truck.png' },
          ];
      const filtered = currentItems.filter((_, idx) => idx !== index);
      return {
        ...prev,
        trustStrip: {
          ...(prev?.trustStrip || {}),
          items: filtered,
        },
      };
    });
  };

  const moveTrustItem = (index, direction) => {
    setPageData((prev) => {
      const currentItems = Array.isArray(prev?.trustStrip?.items) && prev.trustStrip.items.length > 0
        ? [...prev.trustStrip.items]
        : [
            { text: 'ONE & ONLY 8-WAVELENGTH PANEL', icon: '/assets/energy_14368783.png' },
            { text: 'CERTIFIED: BSCI - ISO9001 - ISO14001 - ISO45001', icon: '' },
            { text: 'MDSAP CERTIFIED', icon: '/assets/best_13654983.png' },
            { text: 'CE CERTIFIED', icon: '/assets/protect_10831389.png' },
            { text: 'FREE GLOBAL DELIVERY', icon: '/assets/delivery-truck.png' },
          ];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= currentItems.length) return prev;
      const temp = currentItems[index];
      currentItems[index] = currentItems[targetIndex];
      currentItems[targetIndex] = temp;
      return {
        ...prev,
        trustStrip: {
          ...(prev?.trustStrip || {}),
          items: currentItems,
        },
      };
    });
  };

  const resetTrustStripToDefault = () => {
    const defaultStrip = [
      { text: 'ONE & ONLY 8-WAVELENGTH PANEL', icon: '/assets/energy_14368783.png' },
      { text: 'CERTIFIED: BSCI - ISO9001 - ISO14001 - ISO45001', icon: '' },
      { text: 'MDSAP CERTIFIED', icon: '/assets/best_13654983.png' },
      { text: 'CE CERTIFIED', icon: '/assets/protect_10831389.png' },
      { text: 'FREE GLOBAL DELIVERY', icon: '/assets/delivery-truck.png' },
    ];
    setPageData((prev) => ({
      ...prev,
      trustStrip: {
        ...(prev?.trustStrip || {}),
        items: defaultStrip,
      },
    }));
  };

  const updateClinicalTechField = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      clinicalTech: {
        ...(prev?.clinicalTech || {}),
        [field]: value,
      },
    }));
  };

  const updateWavelengthItem = (index, key, value) => {
    setPageData((prev) => {
      const currentList = Array.isArray(prev?.clinicalTech?.wavelengths) && prev.clinicalTech.wavelengths.length > 0
        ? [...prev.clinicalTech.wavelengths]
        : [...DEFAULT_WAVELENGTHS];
      currentList[index] = { ...currentList[index], [key]: value };
      return {
        ...prev,
        clinicalTech: {
          ...(prev?.clinicalTech || {}),
          wavelengths: currentList,
        },
      };
    });
  };

  const resetClinicalTechToDefault = () => {
    setPageData((prev) => ({
      ...prev,
      clinicalTech: {
        eyebrow: 'CLINICAL TECHNOLOGY',
        heading: 'HOW FAR DOES EACH LIGHT REACH?',
        highlightText: 'LIGHT REACH',
        subtitleLine1: 'Red stays near the surface. Near-infrared travels deeper.',
        subtitleLine2: 'Hover over a wavelength to see how far it goes.',
        wavelengths: DEFAULT_WAVELENGTHS,
      },
    }));
  };

  const updateAssessmentField = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      assessmentQuiz: {
        ...(prev?.assessmentQuiz || {}),
        [field]: value,
      },
    }));
  };

  const updateAssessmentQuestion = (qIndex, field, value) => {
    setPageData((prev) => {
      const currentList = Array.isArray(prev?.assessmentQuiz?.questions) && prev.assessmentQuiz.questions.length > 0
        ? [...prev.assessmentQuiz.questions]
        : JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_QUIZ.questions));
      currentList[qIndex] = { ...currentList[qIndex], [field]: value };
      return {
        ...prev,
        assessmentQuiz: {
          ...(prev?.assessmentQuiz || {}),
          questions: currentList,
        },
      };
    });
  };

  const updateAssessmentOption = (qIndex, optIndex, field, value) => {
    setPageData((prev) => {
      const currentList = Array.isArray(prev?.assessmentQuiz?.questions) && prev.assessmentQuiz.questions.length > 0
        ? [...prev.assessmentQuiz.questions]
        : JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_QUIZ.questions));
      const currentQuestion = { ...currentList[qIndex] };
      const currentOptions = Array.isArray(currentQuestion.options) ? [...currentQuestion.options] : [];
      currentOptions[optIndex] = { ...currentOptions[optIndex], [field]: value };
      currentQuestion.options = currentOptions;
      currentList[qIndex] = currentQuestion;
      return {
        ...prev,
        assessmentQuiz: {
          ...(prev?.assessmentQuiz || {}),
          questions: currentList,
        },
      };
    });
  };

  const addAssessmentOption = (qIndex) => {
    setPageData((prev) => {
      const currentList = Array.isArray(prev?.assessmentQuiz?.questions) && prev.assessmentQuiz.questions.length > 0
        ? [...prev.assessmentQuiz.questions]
        : JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_QUIZ.questions));
      const currentQuestion = { ...currentList[qIndex] };
      const currentOptions = Array.isArray(currentQuestion.options) ? [...currentQuestion.options] : [];
      currentOptions.push({ title: 'New Option', subtitle: 'Option description' });
      currentQuestion.options = currentOptions;
      currentList[qIndex] = currentQuestion;
      return {
        ...prev,
        assessmentQuiz: {
          ...(prev?.assessmentQuiz || {}),
          questions: currentList,
        },
      };
    });
  };

  const removeAssessmentOption = (qIndex, optIndex) => {
    setPageData((prev) => {
      const currentList = Array.isArray(prev?.assessmentQuiz?.questions) && prev.assessmentQuiz.questions.length > 0
        ? [...prev.assessmentQuiz.questions]
        : JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_QUIZ.questions));
      const currentQuestion = { ...currentList[qIndex] };
      const currentOptions = Array.isArray(currentQuestion.options) ? [...currentQuestion.options] : [];
      if (currentOptions.length <= 1) return prev;
      currentQuestion.options = currentOptions.filter((_, i) => i !== optIndex);
      currentList[qIndex] = currentQuestion;
      return {
        ...prev,
        assessmentQuiz: {
          ...(prev?.assessmentQuiz || {}),
          questions: currentList,
        },
      };
    });
  };

  const addAssessmentQuestion = () => {
    setPageData((prev) => {
      const currentList = Array.isArray(prev?.assessmentQuiz?.questions) && prev.assessmentQuiz.questions.length > 0
        ? [...prev.assessmentQuiz.questions]
        : JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_QUIZ.questions));

      const newTotal = currentList.length + 1;
      const newQuestion = {
        id: Date.now(),
        title: `Question ${newTotal} of ${newTotal}`,
        question: 'What is your primary treatment target?',
        options: [
          { title: 'Full body energy', subtitle: 'Vitality, circulation, and muscle support' },
          { title: 'Targeted recovery', subtitle: 'Specific joint, tendon, or ache relief' },
          { title: 'Youthful radiance', subtitle: 'Anti-aging, elasticity, and blemish care' },
        ],
      };

      const updatedList = currentList.map((q, idx) => {
        if (!q.title || /^Question\s+\d+\s+of\s+\d+$/i.test(q.title.trim())) {
          return { ...q, title: `Question ${idx + 1} of ${newTotal}` };
        }
        return q;
      });

      updatedList.push(newQuestion);
      setActiveQuizQuestionIdx(updatedList.length - 1);

      return {
        ...prev,
        assessmentQuiz: {
          ...(prev?.assessmentQuiz || {}),
          questions: updatedList,
        },
      };
    });
  };

  const removeAssessmentQuestion = (qIndex) => {
    setPageData((prev) => {
      const currentList = Array.isArray(prev?.assessmentQuiz?.questions) && prev.assessmentQuiz.questions.length > 0
        ? [...prev.assessmentQuiz.questions]
        : JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_QUIZ.questions));

      if (currentList.length <= 1) return prev;

      const filtered = currentList.filter((_, idx) => idx !== qIndex);
      const newTotal = filtered.length;

      const updatedList = filtered.map((q, idx) => {
        if (!q.title || /^Question\s+\d+\s+of\s+\d+$/i.test(q.title.trim())) {
          return { ...q, title: `Question ${idx + 1} of ${newTotal}` };
        }
        return q;
      });

      setActiveQuizQuestionIdx((prevIdx) => Math.min(prevIdx, updatedList.length - 1));

      return {
        ...prev,
        assessmentQuiz: {
          ...(prev?.assessmentQuiz || {}),
          questions: updatedList,
        },
      };
    });
  };

  const moveAssessmentQuestion = (qIndex, direction) => {
    setPageData((prev) => {
      const currentList = Array.isArray(prev?.assessmentQuiz?.questions) && prev.assessmentQuiz.questions.length > 0
        ? [...prev.assessmentQuiz.questions]
        : JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_QUIZ.questions));

      const targetIndex = qIndex + direction;
      if (targetIndex < 0 || targetIndex >= currentList.length) return prev;

      const updatedList = [...currentList];
      const temp = updatedList[qIndex];
      updatedList[qIndex] = updatedList[targetIndex];
      updatedList[targetIndex] = temp;

      const newTotal = updatedList.length;
      const renumbered = updatedList.map((q, idx) => {
        if (!q.title || /^Question\s+\d+\s+of\s+\d+$/i.test(q.title.trim())) {
          return { ...q, title: `Question ${idx + 1} of ${newTotal}` };
        }
        return q;
      });

      setActiveQuizQuestionIdx(targetIndex);

      return {
        ...prev,
        assessmentQuiz: {
          ...(prev?.assessmentQuiz || {}),
          questions: renumbered,
        },
      };
    });
  };

  const updateAssessmentResultMatch = (field, value) => {
    setPageData((prev) => ({
      ...prev,
      assessmentQuiz: {
        ...(prev?.assessmentQuiz || {}),
        resultMatch: {
          ...(DEFAULT_ASSESSMENT_QUIZ.resultMatch),
          ...(prev?.assessmentQuiz?.resultMatch || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateAssessmentFeature = (fIndex, field, value) => {
    setPageData((prev) => {
      const currentFeatures = Array.isArray(prev?.assessmentQuiz?.resultMatch?.features)
        ? [...prev.assessmentQuiz.resultMatch.features]
        : [...DEFAULT_ASSESSMENT_QUIZ.resultMatch.features];
      currentFeatures[fIndex] = { ...currentFeatures[fIndex], [field]: value };
      return {
        ...prev,
        assessmentQuiz: {
          ...(prev?.assessmentQuiz || {}),
          resultMatch: {
            ...(DEFAULT_ASSESSMENT_QUIZ.resultMatch),
            ...(prev?.assessmentQuiz?.resultMatch || {}),
            features: currentFeatures,
          },
        },
      };
    });
  };

  const resetAssessmentToDefault = () => {
    setPageData((prev) => ({
      ...prev,
      assessmentQuiz: JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_QUIZ)),
    }));
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

  const sectionsNav = [
    { id: 'all', label: 'All Sections' },
    { id: 'hero', label: '1. Hero & Tagline' },
    { id: 'trustStrip', label: '2. Trust & Certification Strip' },
    { id: 'about', label: '3. About LUMA & Chamber' },
    { id: 'clinicalTech', label: '4. Clinical Tech (Wavelengths)' },
    { id: 'benefits', label: '5. Benefits (8 Cards)' },
    { id: 'productRange', label: '6. Product Range Showcase' },
    { id: 'assessmentQuiz', label: '7. 1-Minute Assessment Quiz' },
    { id: 'beforeAfter', label: '8. Before & After' },
    { id: 'faqs', label: '9. FAQs & Support' },
    { id: 'community', label: '10. Community Banner' },
    { id: 'experts', label: '11. What Experts Say' },
    { id: 'guarantees', label: '12. Guarantees & Trust' },
    { id: 'footer', label: '13. Footer & Connect' },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <svg className="animate-spin h-8 w-8 text-[#ED2024] mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 text-[13px] font-medium">
          Loading Homepage content...
        </p>
      </div>
    );
  }

  const hero = pageData?.hero || {};
  const trustStrip = pageData?.trustStrip || {};
  const trustItems = Array.isArray(trustStrip.items) && trustStrip.items.length > 0
    ? trustStrip.items
    : [
        { text: 'ONE & ONLY 8-WAVELENGTH PANEL', icon: '/assets/energy_14368783.png' },
        { text: 'CERTIFIED: BSCI - ISO9001 - ISO14001 - ISO45001', icon: '' },
        { text: 'MDSAP CERTIFIED', icon: '/assets/best_13654983.png' },
        { text: 'CE CERTIFIED', icon: '/assets/protect_10831389.png' },
        { text: 'FREE GLOBAL DELIVERY', icon: '/assets/delivery-truck.png' },
      ];
  const about = pageData?.aboutSection || {};
  const clinicalTech = pageData?.clinicalTech || {};
  const clinicalWavelengths = Array.isArray(clinicalTech.wavelengths) && clinicalTech.wavelengths.length > 0
    ? clinicalTech.wavelengths
    : DEFAULT_WAVELENGTHS;
  const benefits = pageData?.benefitsOverview || {};
  const benefitCards = benefits.cards || [];
  const productRange = pageData?.productRange || {};
  const productCards = productRange.cards || [];
  const beforeAfter = pageData?.beforeAfter || {};
  const faqs = pageData?.faqsSection || {};
  const faqItems = faqs.items || [];
  const supportBox = faqs.supportBox || {};
  const community = pageData?.communitySection || {};
  const expertTestimonials = pageData?.expertTestimonials || {};
  const expertList = expertTestimonials.experts || [];
  const guarantees = pageData?.trustGuarantees || {};
  const guaranteeCards = guarantees.cards || [];
  const footer = pageData?.footerConnect || {};

  return (
    <div className="w-full text-[#1E293B]">
      
      {/* Top Navigation Pills */}
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
            <span><strong>Success!</strong> Homepage content synchronized live.</span>
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

      {/* Main Form Body */}
      <form onSubmit={handleSave} className="space-y-7">
        
        {/* ================= SECTION 1: HERO BANNER & TAGLINE ================= */}
        {(activeSection === 'all' || activeSection === 'hero') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 1: Hero Banner &amp; Tagline
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">
                HERO BANNER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Hero Eyebrow / Tagline
                </label>
                <input
                  type="text"
                  value={hero.badge || ''}
                  onChange={(e) => updateHeroField('badge', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="The Science of Light. The Power to Heal."
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={hero.title || ''}
                  onChange={(e) => updateHeroField('title', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] font-bold text-[#1E293B] outline-none shadow-xs"
                  placeholder="The World's Most Advanced Red Light Therapy Panel"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={hero.exploreBtnText || ''}
                  onChange={(e) => updateHeroField('exploreBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Explore LUMA"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Secondary CTA Button Text
                </label>
                <input
                  type="text"
                  value={hero.findPanelBtnText || ''}
                  onChange={(e) => updateHeroField('findPanelBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Find your Panel"
                />
              </div>
            </div>

            {/* Hero Background Image Upload */}
            <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-[#E2E8F0]">
              <ImageUploadField
                label="Hero Background Banner"
                value={hero.bgImage || ''}
                onChange={(url) => updateHeroField('bgImage', url)}
                defaultPath="/assets/hero-bg.jpg"
                helpText="Upload background banner image from computer or device"
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 2: TRUST & CERTIFICATION STRIP ================= */}
        {(activeSection === 'all' || activeSection === 'trustStrip') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🛡️</span>
                <div>
                  <h3
                    style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                    className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                  >
                    Section 2: Trust &amp; Certification Strip
                  </h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    Badges displayed across the dark running ticker directly under the hero banner. Words beginning with <code className="text-[#ED2024] font-bold">CERTIFIED:</code> automatically render with a red highlight.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={resetTrustStripToDefault}
                  className="px-3 py-1.5 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-[#475569] text-[12px] font-medium transition cursor-pointer"
                  title="Reset to default PSD badges"
                >
                  ↺ Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={addTrustItem}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d61b1f] text-white text-[12px] font-semibold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <span>+</span> Add Badge
                </button>
              </div>
            </div>

            {/* Live Real-time Strip Preview */}
            <div className="bg-[#050505] border border-[#27272A] rounded-[12px] p-4 text-white overflow-hidden shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Strip Preview (Dark Canvas)
                </span>
                <span className="text-[10px] text-[#71717A]">{trustItems.length} badges configured</span>
              </div>
              <div className="w-full overflow-x-auto py-3 px-4 bg-[#0A0A0A] rounded-[8px] border border-[#18181B] flex items-center justify-between gap-6 no-scrollbar">
                {trustItems.map((item, idx) => {
                  const text = (item.text || '').trim();
                  const isCertifiedPrefix = text.toUpperCase().startsWith('CERTIFIED:');
                  const cleanText = isCertifiedPrefix ? text.slice(10).trim() : text;
                  return (
                    <div key={idx} className="flex items-center gap-2 whitespace-nowrap text-[12px] tracking-wide shrink-0">
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          className="h-4 w-auto object-contain shrink-0 max-h-[16px]"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : null}
                      <span className="font-light text-white uppercase text-[12px]">
                        {isCertifiedPrefix ? (
                          <>
                            <span className="text-[#EC2024] font-medium">CERTIFIED:</span>{' '}
                            <span>{cleanText}</span>
                          </>
                        ) : (
                          text || '(Empty Badge)'
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List of Badges to Edit */}
            <div className="space-y-4">
              {trustItems.map((item, idx) => {
                const currentIcon = item.icon || '';
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 hover:border-gray-300 transition"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#ED2024] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[13px] font-bold text-[#1E293B]">
                          Badge #{idx + 1}: {item.text ? item.text.substring(0, 36) : 'Untitled'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveTrustItem(idx, -1)}
                          disabled={idx === 0}
                          className="w-7 h-7 rounded-[6px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 flex items-center justify-center text-[11px] disabled:opacity-30 disabled:cursor-not-allowed transition"
                          title="Move Left / Earlier"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveTrustItem(idx, 1)}
                          disabled={idx === trustItems.length - 1}
                          className="w-7 h-7 rounded-[6px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 flex items-center justify-center text-[11px] disabled:opacity-30 disabled:cursor-not-allowed transition"
                          title="Move Right / Later"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTrustItem(idx)}
                          className="w-7 h-7 rounded-[6px] bg-white border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center text-[13px] transition cursor-pointer ml-1"
                          title="Delete Badge"
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Badge Text */}
                      <div>
                        <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                          Badge Text
                        </label>
                        <input
                          type="text"
                          value={item.text || ''}
                          onChange={(e) => updateTrustItem(idx, 'text', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] font-medium text-[#1E293B] outline-none shadow-xs uppercase"
                          placeholder="e.g. CERTIFIED: BSCI - ISO9001 or MDSAP CERTIFIED"
                        />
                        <p className="text-[11px] text-[#94A3B8] mt-1">
                          Prefix with <span className="font-semibold text-[#ED2024]">CERTIFIED:</span> for red highlighted label.
                        </p>
                      </div>

                      {/* Icon Selection & Presets */}
                      <div>
                        <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                          Select Icon Preset
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {[
                            { label: '⚡ Energy', val: '/assets/energy_14368783.png' },
                            { label: '🏅 MDSAP', val: '/assets/best_13654983.png' },
                            { label: '🛡️ CE Shield', val: '/assets/protect_10831389.png' },
                            { label: '🚚 Truck', val: '/assets/delivery-truck.png' },
                            { label: '🚫 Text Only', val: '' },
                          ].map((preset) => {
                            const isSelected = currentIcon === preset.val;
                            return (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => updateTrustItem(idx, 'icon', preset.val)}
                                className={`px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#ED2024] text-white shadow-xs'
                                    : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-gray-100'
                                }`}
                              >
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom Icon Upload / Path */}
                        <ImageUploadField
                          label="Custom Icon (Upload or URL)"
                          value={item.icon || ''}
                          onChange={(url) => updateTrustItem(idx, 'icon', url)}
                          defaultPath="/assets/energy_14368783.png"
                          helpText="Upload a PNG/SVG icon or select a preset above (leave empty for text only)"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION 3: ABOUT LUMA & CHAMBER ================= */}
        {(activeSection === 'all' || activeSection === 'about') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 3: About LUMA &amp; Relaxation Chamber
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
                ABOUT STORY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Overline Eyebrow
                </label>
                <input
                  type="text"
                  value={about.eyebrow || ''}
                  onChange={(e) => updateAboutField('eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="ABOUT LUMA"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={about.heading || ''}
                  onChange={(e) => updateAboutField('heading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="THE SCIENCE OF LIGHT. THE ART OF LIVING WELL."
                />
              </div>
            </div>

            {/* Paragraph 1 */}
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Story Paragraph 1 (Clinical Genesis &amp; Dubai Foundation)
              </label>
              <textarea
                rows={3}
                value={about.paragraphs?.[0] || ''}
                onChange={(e) => updateAboutParagraph(0, e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] p-3 text-[13.5px] leading-relaxed text-[#1E293B] outline-none shadow-xs"
              />
            </div>

            {/* Paragraph 2 */}
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Story Paragraph 2 (Vision &amp; Standards)
              </label>
              <textarea
                rows={2}
                value={about.paragraphs?.[1] || ''}
                onChange={(e) => updateAboutParagraph(1, e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] p-3 text-[13.5px] leading-relaxed text-[#1E293B] outline-none shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Red Accent Tagline
                </label>
                <input
                  type="text"
                  value={about.tagline || ''}
                  onChange={(e) => updateAboutField('tagline', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2 text-[13px] font-bold text-[#ED2024] outline-none shadow-xs"
                  placeholder="LUMA Red Light Therapy for a Brighter You."
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Action Button Label
                </label>
                <input
                  type="text"
                  value={about.btnText || ''}
                  onChange={(e) => updateAboutField('btnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="KNOW MORE"
                />
              </div>
            </div>

            {/* Relaxation Chamber Image Upload */}
            <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-[#E2E8F0]">
              <ImageUploadField
                label="Relaxation Chamber Feature Photo"
                value={about.chamberImage || ''}
                onChange={(url) => updateAboutField('chamberImage', url)}
                defaultPath="/assets/about-chamber-perfect.jpg"
                helpText="Upload relaxation chamber image (938 x 619px)"
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 4: CLINICAL TECHNOLOGY & WAVELENGTHS ================= */}
        {(activeSection === 'all' || activeSection === 'clinicalTech') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🔬</span>
                <div>
                  <h3
                    style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                    className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                  >
                    Section 4: Clinical Technology &amp; Wavelength Penetration
                  </h3>
                  <p className="text-[12px] text-[#64748B] mt-0.5">
                    Interactive wavelength penetration chart directly after About LUMA. Controls target tissue layers, clinical benefits, penetration depths, and research references.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetClinicalTechToDefault}
                className="self-start sm:self-auto px-3 py-1.5 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-[#475569] text-[12px] font-medium transition cursor-pointer"
                title="Reset Clinical Technology to original values"
              >
                ↺ Reset Defaults
              </button>
            </div>

            {/* Section Headings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Overline Eyebrow
                </label>
                <input
                  type="text"
                  value={clinicalTech.eyebrow !== undefined ? clinicalTech.eyebrow : 'CLINICAL TECHNOLOGY'}
                  onChange={(e) => updateClinicalTechField('eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] font-semibold text-[#1E293B] outline-none shadow-xs uppercase"
                  placeholder="CLINICAL TECHNOLOGY"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={clinicalTech.heading !== undefined ? clinicalTech.heading : 'HOW FAR DOES EACH LIGHT REACH?'}
                  onChange={(e) => updateClinicalTechField('heading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] font-bold text-[#1E293B] outline-none shadow-xs uppercase"
                  placeholder="HOW FAR DOES EACH LIGHT REACH?"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Red Highlight Text
                </label>
                <input
                  type="text"
                  value={clinicalTech.highlightText !== undefined ? clinicalTech.highlightText : 'LIGHT REACH'}
                  onChange={(e) => updateClinicalTechField('highlightText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] font-bold text-[#ED2024] outline-none shadow-xs uppercase"
                  placeholder="LIGHT REACH"
                />
                <p className="text-[11px] text-[#94A3B8] mt-1">
                  Words in the headline matching this text will render in red.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Subtitle Line 1
                </label>
                <input
                  type="text"
                  value={clinicalTech.subtitleLine1 !== undefined ? clinicalTech.subtitleLine1 : 'Red stays near the surface. Near-infrared travels deeper.'}
                  onChange={(e) => updateClinicalTechField('subtitleLine1', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Red stays near the surface. Near-infrared travels deeper."
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Subtitle Line 2 (Instruction)
                </label>
                <input
                  type="text"
                  value={clinicalTech.subtitleLine2 !== undefined ? clinicalTech.subtitleLine2 : 'Hover over a wavelength to see how far it goes.'}
                  onChange={(e) => updateClinicalTechField('subtitleLine2', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Hover over a wavelength to see how far it goes."
                />
              </div>
            </div>

            {/* Wavelengths Interactive Management Tabs */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#475569]">
                  Edit Individual Wavelengths ({clinicalWavelengths.length} total)
                </span>
                <button
                  type="button"
                  onClick={() => setViewAllWavelengths(!viewAllWavelengths)}
                  className="text-[11.5px] font-semibold text-[#ED2024] hover:underline cursor-pointer self-start sm:self-auto"
                >
                  {viewAllWavelengths ? '← Switch to Single-Wavelength Tab View' : '⊞ View All 9 Wavelengths at Once'}
                </button>
              </div>

              {/* Selector Tabs (480, 630, 650, 660, 670, 810, 830, 850, 1060) */}
              {!viewAllWavelengths && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
                  {clinicalWavelengths.map((w) => {
                    const isTabActive = activeWavelengthTab === w.id;
                    const typeBadge = w.type === 'blue' ? 'Blue' : w.type === 'silver' ? 'Silver' : w.id >= 800 ? 'NIR' : 'Red';
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setActiveWavelengthTab(w.id)}
                        className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          isTabActive
                            ? 'bg-[#ED2024] text-white shadow-xs'
                            : 'bg-white border border-[#CBD5E1] text-[#334155] hover:bg-gray-100'
                        }`}
                      >
                        <span>{w.value} {w.unit}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                          isTabActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#64748B]'
                        }`}>
                          {typeBadge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Edit Card(s) */}
              <div className="space-y-4">
                {clinicalWavelengths.map((w, idx) => {
                  if (!viewAllWavelengths && activeWavelengthTab !== w.id) {
                    return null;
                  }

                  return (
                    <div
                      key={w.id}
                      className="p-5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 hover:border-gray-300 transition"
                    >
                      {/* Card Header & Live Mini Preview */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E2E8F0] gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-[8px] bg-[#0A0A0B] text-white text-[13px] font-bold flex items-center justify-center shrink-0 border border-gray-700">
                            {w.value}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-[14px] font-bold text-[#1E293B]">
                                {w.value} {w.unit} &mdash; {w.label || 'Target Layer'}
                              </h4>
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                                {w.type || 'Light'}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#64748B]">
                              Approximate Depth: <strong className="text-[#0F172A]">{w.depth}</strong> &bull; Chart Callout: <strong className="text-[#0F172A]">{w.callout}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Live mini preview pill */}
                        <div className="px-3 py-1.5 rounded-[8px] bg-[#0A0A0B] text-white border border-[#27272A] text-[11px] flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <span className="text-[#ED2024] font-medium">{w.label}</span>
                          <span className="text-white font-bold">{w.value}{w.unit}</span>
                          <span className="text-[#A1A1AA]">{w.depth}</span>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11.5px] font-semibold text-[#64748B] mb-1">
                            Target Layer / Depth Area (Label)
                          </label>
                          <input
                            type="text"
                            value={w.label || ''}
                            onChange={(e) => updateWavelengthItem(idx, 'label', e.target.value)}
                            className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-semibold text-[#1E293B] outline-none shadow-xs"
                            placeholder="e.g. Skin surface, Epidermis, Deep Muscle"
                          />
                        </div>

                        <div>
                          <label className="block text-[11.5px] font-semibold text-[#64748B] mb-1">
                            Approximate Depth (Displayed text)
                          </label>
                          <input
                            type="text"
                            value={w.depth || ''}
                            onChange={(e) => updateWavelengthItem(idx, 'depth', e.target.value)}
                            className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-bold text-[#1E293B] outline-none shadow-xs"
                            placeholder="e.g. 1 to 5 mm, 20 to 45 mm"
                          />
                        </div>

                        <div>
                          <label className="block text-[11.5px] font-semibold text-[#64748B] mb-1">
                            Chart Pillar Callout Text
                          </label>
                          <input
                            type="text"
                            value={w.callout || ''}
                            onChange={(e) => updateWavelengthItem(idx, 'callout', e.target.value)}
                            className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                            placeholder="e.g. 5 mm, 45 mm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-[10px] border border-[#E2E8F0] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#ED2024] uppercase tracking-wider">
                              Primary Clinical Benefit
                            </span>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">Title</label>
                            <input
                              type="text"
                              value={w.primaryTitle || 'Primary'}
                              onChange={(e) => updateWavelengthItem(idx, 'primaryTitle', e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-2.5 py-1 text-[12px] font-bold text-[#ED2024] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">Description (routines &amp; uses)</label>
                            <textarea
                              rows={2}
                              value={w.primaryDesc || ''}
                              onChange={(e) => updateWavelengthItem(idx, 'primaryDesc', e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] p-2 text-[12px] text-[#1E293B] outline-none leading-relaxed"
                              placeholder="e.g. Skin, collagen support and scalp routines."
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-[10px] border border-[#E2E8F0] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                              Secondary Clinical Benefit
                            </span>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">Title</label>
                            <input
                              type="text"
                              value={w.secondaryTitle || 'Secondary'}
                              onChange={(e) => updateWavelengthItem(idx, 'secondaryTitle', e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-2.5 py-1 text-[12px] font-bold text-[#64748B] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#64748B] mb-0.5">Description</label>
                            <textarea
                              rows={2}
                              value={w.secondaryDesc || ''}
                              onChange={(e) => updateWavelengthItem(idx, 'secondaryDesc', e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] p-2 text-[12px] text-[#1E293B] outline-none leading-relaxed"
                              placeholder="e.g. Skin recovery and healing-support routines."
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11.5px] font-semibold text-[#64748B] mb-1">
                          Research Behind It (Scientific Reference)
                        </label>
                        <input
                          type="text"
                          value={w.research || ''}
                          onChange={(e) => updateWavelengthItem(idx, 'research', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                          placeholder="e.g. Well studied for skin. / Benchmark for photobiomodulation."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 5: BENEFITS OVERVIEW (8 CARDS) ================= */}
        {(activeSection === 'all' || activeSection === 'benefits') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 5: Evidence-Based Benefits Overview
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                8 PROTOCOL CARDS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Overline Eyebrow
                </label>
                <input
                  type="text"
                  value={benefits.eyebrow || ''}
                  onChange={(e) => updateSectionField('benefitsOverview', 'eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="WHY LUMA"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={benefits.heading || ''}
                  onChange={(e) => updateSectionField('benefitsOverview', 'heading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="BENEFITS OVERVIEW"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={benefits.subtitle || ''}
                  onChange={(e) => updateSectionField('benefitsOverview', 'subtitle', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Evidence-based protocols calibrated for specific wellness outcomes."
                />
              </div>
            </div>

            {/* 8 Benefit Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {benefitCards.map((card, idx) => (
                <div key={card.id || idx} className="p-4 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#ED2024] uppercase tracking-wider">
                        Benefit {idx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono font-semibold">
                        {card.duration || '15 Min'}
                      </span>
                    </div>

                    <ImageUploadField
                      label={`Card ${idx + 1} Image`}
                      value={card.image || ''}
                      onChange={(url) => updateBenefitCard(idx, 'image', url)}
                      defaultPath={`/assets/benefits/${['cellular', 'wellness', 'clearskin', 'fatloss', 'recovery', 'scalp', 'scar', 'brain'][idx]}.jpg`}
                      helpText="Upload benefit photo"
                    />

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Title</label>
                      <input
                        type="text"
                        value={card.title || ''}
                        onChange={(e) => updateBenefitCard(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-bold text-[#1E293B] outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Duration</label>
                      <input
                        type="text"
                        value={card.duration || ''}
                        onChange={(e) => updateBenefitCard(idx, 'duration', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12px] text-[#1E293B] outline-none shadow-xs"
                        placeholder="15 Min"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={card.description || ''}
                        onChange={(e) => updateBenefitCard(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] p-2 text-[12px] text-[#475569] outline-none shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION 6: PRODUCT RANGE SHOWCASE ================= */}
        {(activeSection === 'all' || activeSection === 'productRange') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">📦</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 6: Product Range Showcase
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FEF2F2] text-[#B91C1C] border border-[#FEE2E2]">
                {productCards.length} PRODUCT CARDS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Overline Eyebrow
                </label>
                <input
                  type="text"
                  value={productRange.eyebrow || ''}
                  onChange={(e) => updateProductRangeField('eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="PRODUCT RANGE"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Heading (Red Prefix)
                </label>
                <input
                  type="text"
                  value={productRange.headingPrefix || ''}
                  onChange={(e) => updateProductRangeField('headingPrefix', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#ED2024] font-bold outline-none shadow-xs"
                  placeholder="LUMA RED LIGHT "
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Heading (Black Suffix)
                </label>
                <input
                  type="text"
                  value={productRange.headingSuffix || ''}
                  onChange={(e) => updateProductRangeField('headingSuffix', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] font-bold outline-none shadow-xs"
                  placeholder="PANELS"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={productRange.subtitle || ''}
                  onChange={(e) => updateProductRangeField('subtitle', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Featuring exclusive 1060nm - unavailable from any competitor in Global"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  View All Button Text
                </label>
                <input
                  type="text"
                  value={productRange.viewAllBtnText || ''}
                  onChange={(e) => updateProductRangeField('viewAllBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="VIEW ALL"
                />
              </div>
            </div>

            {/* 3 Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {productCards.map((card, idx) => (
                <div key={card.id || idx} className="p-5 rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#ED2024] uppercase tracking-wider">
                        Product {idx + 1}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono font-semibold">
                        {card.category || 'FACE MASK'}
                      </span>
                    </div>

                    <ImageUploadField
                      label={`Card ${idx + 1} Image`}
                      value={card.image || ''}
                      onChange={(url) => updateProductRangeCard(idx, 'image', url)}
                      defaultPath={`/assets/products/psd-card-${['glow', 'go', 'nova', 'surge', 'apex', 'ultra', 'max'][idx] || 'glow'}.jpg`}
                      helpText="Upload 800x800 square product photo"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Brand</label>
                        <input
                          type="text"
                          value={card.brandPrefix || ''}
                          onChange={(e) => updateProductRangeCard(idx, 'brandPrefix', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-bold text-[#1E293B] outline-none shadow-xs"
                          placeholder="LUMA "
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Model Name</label>
                        <input
                          type="text"
                          value={card.modelSuffix || ''}
                          onChange={(e) => updateProductRangeCard(idx, 'modelSuffix', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-bold text-[#ED2024] outline-none shadow-xs"
                          placeholder="GLOW"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Category / Subtitle</label>
                      <input
                        type="text"
                        value={card.category || ''}
                        onChange={(e) => updateProductRangeCard(idx, 'category', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                        placeholder="FACE MASK"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={card.description || ''}
                        onChange={(e) => updateProductRangeCard(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-2 text-[12px] text-[#1E293B] outline-none shadow-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Button Text</label>
                      <input
                        type="text"
                        value={card.buttonText || ''}
                        onChange={(e) => updateProductRangeCard(idx, 'buttonText', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-semibold text-[#1E293B] outline-none shadow-xs"
                        placeholder="BUY NOW"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION 7: 1-MINUTE ASSESSMENT QUIZ ================= */}
        {(activeSection === 'all' || activeSection === 'assessmentQuiz') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">📋</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 7: The LUMA 1-Minute Assessment Quiz
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAssessmentToDefault}
                  className="px-3 py-1 text-[11px] font-semibold text-[#475569] hover:text-[#0F172A] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                >
                  Reset to Default
                </button>
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]">
                  INTERACTIVE QUIZ
                </span>
              </div>
            </div>

            {/* Submissions Info Callout */}
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div className="text-[12px] text-[#475569] leading-relaxed">
                <strong className="text-[#0F172A] font-semibold">Live Submissions Sync: </strong>
                When visitors on the website complete this 5-question quiz, their answers and recommended panels are automatically recorded in the database. You can review submissions and view exact customer choices under <strong className="text-[#ED2024]">Quiz Assessments</strong> in the left sidebar!
              </div>
            </div>

            {/* Global Section Eyebrow, Heading & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Section Eyebrow
                </label>
                <input
                  type="text"
                  value={pageData?.assessmentQuiz?.eyebrow ?? DEFAULT_ASSESSMENT_QUIZ.eyebrow}
                  onChange={(e) => updateAssessmentField('eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="THE LUMA 1-MINUTE ASSESSMENT"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Headline (Keywords 'LIGHT' &amp; 'FITS YOU' are auto-highlighted in red)
                </label>
                <input
                  type="text"
                  value={pageData?.assessmentQuiz?.heading ?? DEFAULT_ASSESSMENT_QUIZ.heading}
                  onChange={(e) => updateAssessmentField('heading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="FIND THE LIGHT THAT FITS YOU"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={pageData?.assessmentQuiz?.subtitle ?? DEFAULT_ASSESSMENT_QUIZ.subtitle}
                  onChange={(e) => updateAssessmentField('subtitle', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-3.5 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Five questions. One panel, matched to your body, your space and your ritual."
                />
              </div>
            </div>

            {/* Sub-view switcher: Questions vs Result Match */}
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
              <button
                type="button"
                onClick={() => setActiveQuizView('questions')}
                className={`px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer ${
                  activeQuizView === 'questions'
                    ? 'bg-[#1E293B] text-white shadow-xs'
                    : 'bg-gray-100 text-[#475569] hover:bg-gray-200'
                }`}
              >
                Questions Flow ({(pageData?.assessmentQuiz?.questions || DEFAULT_ASSESSMENT_QUIZ.questions).length} Questions)
              </button>
              <button
                type="button"
                onClick={() => setActiveQuizView('result')}
                className={`px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer ${
                  activeQuizView === 'result'
                    ? 'bg-[#ED2024] text-white shadow-xs'
                    : 'bg-gray-100 text-[#475569] hover:bg-gray-200'
                }`}
              >
                Recommended Result Screen (Match Card)
              </button>
            </div>

            {activeQuizView === 'questions' ? (
              <div className="space-y-6">
                {/* Dynamic Questions Selector & Add Question Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                      Select Question to Edit:
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {(pageData?.assessmentQuiz?.questions || DEFAULT_ASSESSMENT_QUIZ.questions).map((q, qIdx) => (
                        <button
                          key={q.id || qIdx}
                          type="button"
                          onClick={() => setActiveQuizQuestionIdx(qIdx)}
                          className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all cursor-pointer ${
                            activeQuizQuestionIdx === qIdx
                              ? 'bg-[#ED2024] text-white ring-2 ring-[#ED2024]/30'
                              : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-gray-50'
                          }`}
                        >
                          {q.title || `Question ${qIdx + 1} of ${(pageData?.assessmentQuiz?.questions || DEFAULT_ASSESSMENT_QUIZ.questions).length}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addAssessmentQuestion}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ED2024] hover:bg-[#c9181b] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <span>+ Add New Question</span>
                  </button>
                </div>

                {/* Question Details Editor */}
                {(() => {
                  const currentQuestions =
                    pageData?.assessmentQuiz?.questions && Array.isArray(pageData.assessmentQuiz.questions)
                      ? pageData.assessmentQuiz.questions
                      : DEFAULT_ASSESSMENT_QUIZ.questions;
                  const currentQ = currentQuestions[activeQuizQuestionIdx] || currentQuestions[0];

                  return (
                    <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-5">
                      {/* Question Toolbar: Position & Delete Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#ED2024] text-white text-xs font-bold flex items-center justify-center">
                            {activeQuizQuestionIdx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#0F172A]">
                            Editing Question {activeQuizQuestionIdx + 1} of {currentQuestions.length}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={activeQuizQuestionIdx === 0}
                            onClick={() => moveAssessmentQuestion(activeQuizQuestionIdx, -1)}
                            className="p-1.5 text-xs text-[#475569] hover:text-[#0F172A] bg-white border border-[#E2E8F0] rounded-md disabled:opacity-40 disabled:hover:text-[#475569] cursor-pointer"
                            title="Move Question Earlier"
                          >
                            ← Move Left
                          </button>
                          <button
                            type="button"
                            disabled={activeQuizQuestionIdx === currentQuestions.length - 1}
                            onClick={() => moveAssessmentQuestion(activeQuizQuestionIdx, 1)}
                            className="p-1.5 text-xs text-[#475569] hover:text-[#0F172A] bg-white border border-[#E2E8F0] rounded-md disabled:opacity-40 disabled:hover:text-[#475569] cursor-pointer"
                            title="Move Question Later"
                          >
                            Move Right →
                          </button>
                          <button
                            type="button"
                            disabled={currentQuestions.length <= 1}
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete Question ${activeQuizQuestionIdx + 1}?`)) {
                                removeAssessmentQuestion(activeQuizQuestionIdx);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 bg-red-50 border border-red-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            title="Delete this question"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Question
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                            Step Title
                          </label>
                          <input
                            type="text"
                            value={currentQ.title || ''}
                            onChange={(e) =>
                              updateAssessmentQuestion(activeQuizQuestionIdx, 'title', e.target.value)
                            }
                            className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                            placeholder="Question 1 of 5"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                            Question Prompt
                          </label>
                          <input
                            type="text"
                            value={currentQ.question || ''}
                            onChange={(e) =>
                              updateAssessmentQuestion(activeQuizQuestionIdx, 'question', e.target.value)
                            }
                            className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                            placeholder="What do you want light to do for you?"
                          />
                        </div>
                      </div>

                      {/* Options List */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                            Options ({currentQ.options?.length || 0}):
                          </label>
                          <button
                            type="button"
                            onClick={() => addAssessmentOption(activeQuizQuestionIdx)}
                            className="text-[11px] font-semibold text-[#ED2024] hover:underline cursor-pointer"
                          >
                            + Add Option
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {currentQ.options?.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className="p-3 bg-white border border-[#E2E8F0] rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3"
                            >
                              <span className="w-6 h-6 rounded-full bg-gray-100 text-[#475569] text-xs font-bold flex items-center justify-center shrink-0">
                                {optIdx + 1}
                              </span>

                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                <input
                                  type="text"
                                  value={opt.title || ''}
                                  onChange={(e) =>
                                    updateAssessmentOption(
                                      activeQuizQuestionIdx,
                                      optIdx,
                                      'title',
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-2.5 py-1 text-[12px] font-semibold text-[#1E293B] outline-none"
                                  placeholder="Option Title (e.g. Recover faster)"
                                />

                                <input
                                  type="text"
                                  value={opt.subtitle || ''}
                                  onChange={(e) =>
                                    updateAssessmentOption(
                                      activeQuizQuestionIdx,
                                      optIdx,
                                      'subtitle',
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-2.5 py-1 text-[12px] text-[#64748B] outline-none"
                                  placeholder="Option Subtitle (e.g. After training, soreness)"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeAssessmentOption(activeQuizQuestionIdx, optIdx)}
                                title="Remove Option"
                                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer self-end sm:self-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Result Match Screen Editor */
              <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Match Tag
                    </label>
                    <input
                      type="text"
                      value={pageData?.assessmentQuiz?.resultMatch?.matchTag ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.matchTag}
                      onChange={(e) => updateAssessmentResultMatch('matchTag', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                      placeholder="YOUR MATCH"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={pageData?.assessmentQuiz?.resultMatch?.brand ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.brand}
                      onChange={(e) => updateAssessmentResultMatch('brand', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-semibold text-[#1E293B] outline-none shadow-xs"
                      placeholder="LUMA"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Model Name
                    </label>
                    <input
                      type="text"
                      value={pageData?.assessmentQuiz?.resultMatch?.model ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.model}
                      onChange={(e) => updateAssessmentResultMatch('model', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-semibold text-[#ED2024] outline-none shadow-xs"
                      placeholder="Surge"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Headline Tagline
                    </label>
                    <input
                      type="text"
                      value={pageData?.assessmentQuiz?.resultMatch?.headline ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.headline}
                      onChange={(e) => updateAssessmentResultMatch('headline', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                      placeholder="Balanced power for the body in motion."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Product Slug (for linking)
                    </label>
                    <input
                      type="text"
                      value={pageData?.assessmentQuiz?.resultMatch?.productSlug ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.productSlug}
                      onChange={(e) => updateAssessmentResultMatch('productSlug', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                      placeholder="luma-surge"
                    />
                  </div>
                </div>

                {/* Product Image Upload */}
                <div>
                  <ImageUploadField
                    label="Matched Product Image"
                    value={pageData?.assessmentQuiz?.resultMatch?.productImage ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.productImage}
                    onChange={(url) => updateAssessmentResultMatch('productImage', url)}
                    placeholder="/assets/products/luma-surge.png"
                    helpText="Upload PNG or JPG image of recommended product"
                  />
                </div>

                {/* Summary Sentence */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Summary Conclusion Sentence
                  </label>
                  <input
                    type="text"
                    value={pageData?.assessmentQuiz?.resultMatch?.summary ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.summary}
                    onChange={(e) => updateAssessmentResultMatch('summary', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                    placeholder="You want real performance without the full commitment of space."
                  />
                </div>

                {/* 3 Feature Bullets */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                    Feature Highlights (3 Bullet Points):
                  </label>
                  <div className="space-y-3">
                    {(pageData?.assessmentQuiz?.resultMatch?.features || DEFAULT_ASSESSMENT_QUIZ.resultMatch.features).map((feat, fIdx) => (
                      <div key={fIdx} className="p-3 bg-white border border-[#E2E8F0] rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#64748B] mb-1">Bold Lead-in</label>
                          <input
                            type="text"
                            value={feat.bold || ''}
                            onChange={(e) => updateAssessmentFeature(fIdx, 'bold', e.target.value)}
                            className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-2.5 py-1 text-[12px] font-semibold text-[#1E293B] outline-none"
                            placeholder="Faster recovery."
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-[#64748B] mb-1">Rest of Description</label>
                          <input
                            type="text"
                            value={feat.rest || ''}
                            onChange={(e) => updateAssessmentFeature(fIdx, 'rest', e.target.value)}
                            className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-2.5 py-1 text-[12px] text-[#64748B] outline-none"
                            placeholder="Broader coverage to support muscles after effort."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={pageData?.assessmentQuiz?.resultMatch?.ctaText ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.ctaText}
                      onChange={(e) => updateAssessmentResultMatch('ctaText', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-semibold text-[#1E293B] outline-none shadow-xs"
                      placeholder="EXPLORE SURGE"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      CTA Button Link
                    </label>
                    <input
                      type="text"
                      value={pageData?.assessmentQuiz?.resultMatch?.ctaLink ?? DEFAULT_ASSESSMENT_QUIZ.resultMatch.ctaLink}
                      onChange={(e) => updateAssessmentResultMatch('ctaLink', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                      placeholder="#products"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION 8: REAL SESSIONS BEFORE & AFTER ================= */}
        {(activeSection === 'all' || activeSection === 'beforeAfter') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 8: Real Sessions Before &amp; After
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FAF5FF] text-[#7E22CE] border border-[#F3E8FF]">
                BEFORE &amp; AFTER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Overline Eyebrow
                </label>
                <input
                  type="text"
                  value={beforeAfter.eyebrow || ''}
                  onChange={(e) => updateSectionField('beforeAfter', 'eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="Real Sessions"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={beforeAfter.heading || ''}
                  onChange={(e) => updateSectionField('beforeAfter', 'heading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="BEFORE & AFTER"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Section Subtitle
              </label>
              <textarea
                rows={2}
                value={beforeAfter.subtitle || ''}
                onChange={(e) => updateSectionField('beforeAfter', 'subtitle', e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] p-3 text-[13px] text-[#1E293B] outline-none shadow-xs"
                placeholder="Discover How the Lumnae Mask Transformed Skincare Routines..."
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

        {/* ================= SECTION 9: FAQS & SUPPORT BOX ================= */}
        {(activeSection === 'all' || activeSection === 'faqs') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 9: FAQs &amp; Support Concierge
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">
                7 FAQS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Overline Eyebrow
                </label>
                <input
                  type="text"
                  value={faqs.eyebrow || ''}
                  onChange={(e) => updateSectionField('faqsSection', 'eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="luma red light therapy"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={faqs.heading || ''}
                  onChange={(e) => updateSectionField('faqsSection', 'heading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="FAQs"
                />
              </div>
            </div>

            <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="text-[11px] font-bold text-[#ED2024] uppercase tracking-wider block">
                Support Concierge Card
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Card Title</label>
                  <input
                    type="text"
                    value={supportBox.title || ''}
                    onChange={(e) => {
                      setPageData((prev) => ({
                        ...prev,
                        faqsSection: {
                          ...(prev?.faqsSection || {}),
                          supportBox: { ...(prev?.faqsSection?.supportBox || {}), title: e.target.value },
                        },
                      }));
                    }}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Support Hours</label>
                  <input
                    type="text"
                    value={supportBox.timing || ''}
                    onChange={(e) => {
                      setPageData((prev) => ({
                        ...prev,
                        faqsSection: {
                          ...(prev?.faqsSection || {}),
                          supportBox: { ...(prev?.faqsSection?.supportBox || {}), timing: e.target.value },
                        },
                      }));
                    }}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Average Response</label>
                  <input
                    type="text"
                    value={supportBox.responseTime || ''}
                    onChange={(e) => {
                      setPageData((prev) => ({
                        ...prev,
                        faqsSection: {
                          ...(prev?.faqsSection || {}),
                          supportBox: { ...(prev?.faqsSection?.supportBox || {}), responseTime: e.target.value },
                        },
                      }));
                    }}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] text-[#1E293B] outline-none shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* FAQ Q&As */}
            <div className="space-y-3">
              <label className="block text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                Published Questions &amp; Answers ({faqItems.length})
              </label>
              {faqItems.map((faq, idx) => (
                <div key={faq.id || idx} className="p-3.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <span className="text-[11px] font-bold text-[#ED2024]">Q{idx + 1}</span>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[13px] font-bold text-[#1E293B] outline-none shadow-xs"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer || ''}
                    onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] p-2.5 text-[12.5px] text-[#475569] outline-none shadow-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION 10: COMMUNITY BANNER ================= */}
        {(activeSection === 'all' || activeSection === 'community') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 10: Join the LUMA Community Banner
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
                COMMUNITY BANNER
              </span>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                value={community.heading || ''}
                onChange={(e) => updateSectionField('communitySection', 'heading', e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                placeholder="JOIN THE LUMA COMMUNITY"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                Banner Subtitle
              </label>
              <textarea
                rows={2}
                value={community.subtitle || ''}
                onChange={(e) => updateSectionField('communitySection', 'subtitle', e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] p-3 text-[13px] text-[#1E293B] outline-none shadow-xs"
                placeholder="Learn from doctors, join free classes and ask anything..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={community.joinBtnText || ''}
                  onChange={(e) => updateSectionField('communitySection', 'joinBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Join Us"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={community.askBtnText || ''}
                  onChange={(e) => updateSectionField('communitySection', 'askBtnText', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2 text-[13px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Ask a question"
                />
              </div>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-[#E2E8F0]">
              <ImageUploadField
                label="Community Full-Width Background"
                value={community.bgImage || ''}
                onChange={(url) => updateSectionField('communitySection', 'bgImage', url)}
                defaultPath="/assets/community-bg.jpg"
                helpText="Upload community background image"
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 11: WHAT EXPERTS SAY ================= */}
        {(activeSection === 'all' || activeSection === 'experts') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 11: What Experts Say
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#FAF5FF] text-[#7E22CE] border border-[#F3E8FF]">
                2 EXPERT VIDEOS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Overline Eyebrow
                </label>
                <input
                  type="text"
                  value={expertTestimonials.eyebrow || ''}
                  onChange={(e) => updateSectionField('expertTestimonials', 'eyebrow', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="Know more about LUMA"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={expertTestimonials.heading || ''}
                  onChange={(e) => updateSectionField('expertTestimonials', 'heading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="WHat Experts Says"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {expertList.map((exp, idx) => (
                <div key={exp.id || idx} className="p-4 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <span className="text-[11px] font-bold text-[#ED2024] uppercase tracking-wider block">
                    Expert Video {idx + 1}
                  </span>

                  <ImageUploadField
                    label={`Expert ${idx + 1} Card Image`}
                    value={exp.image || ''}
                    onChange={(url) => updateExpertTestimonial(idx, 'image', url)}
                    defaultPath={`/assets/experts/${idx === 0 ? 'expert_huberman_card.jpg' : 'expert_eagleman_card.jpg'}`}
                    helpText="Upload expert card portrait"
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Expert Name</label>
                    <input
                      type="text"
                      value={exp.name || ''}
                      onChange={(e) => updateExpertTestimonial(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-bold text-[#1E293B] outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Role / Credentials</label>
                    <input
                      type="text"
                      value={exp.role || ''}
                      onChange={(e) => updateExpertTestimonial(idx, 'role', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12px] text-[#475569] outline-none shadow-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION 12: GUARANTEES & TRUST CARDS ================= */}
        {(activeSection === 'all' || activeSection === 'guarantees') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 12: Guarantees &amp; Trust Cards
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                4 GUARANTEES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {guaranteeCards.map((card, idx) => (
                <div key={card.id || idx} className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                  <span className="text-[11px] font-bold text-[#ED2024] uppercase tracking-wider block">
                    Guarantee {idx + 1}
                  </span>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => updateGuaranteeCard(idx, 'title', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[12.5px] font-bold text-[#1E293B] outline-none shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={card.description || ''}
                      onChange={(e) => updateGuaranteeCard(idx, 'description', e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[6px] p-2 text-[12px] text-[#475569] outline-none shadow-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION 13: FOOTER & CONNECT ================= */}
        {(activeSection === 'all' || activeSection === 'footer') && (
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] text-[#ED2024]">🌐</span>
                <h3
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  className="text-[17px] sm:text-[18px] font-semibold text-[#1E293B]"
                >
                  Section 13: Footer &amp; Official Contact
                </h3>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">
                FOOTER INFO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Newsletter Overline
                </label>
                <input
                  type="text"
                  value={footer.newsletterOverline || ''}
                  onChange={(e) => updateSectionField('footerConnect', 'newsletterOverline', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="You will get monthly newsletter"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Newsletter Heading
                </label>
                <input
                  type="text"
                  value={footer.newsletterHeading || ''}
                  onChange={(e) => updateSectionField('footerConnect', 'newsletterHeading', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-bold"
                  placeholder="LET'S CONNECT"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Newsletter Subtitle
                </label>
                <input
                  type="text"
                  value={footer.newsletterSubtitle || ''}
                  onChange={(e) => updateSectionField('footerConnect', 'newsletterSubtitle', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="Stay updated with upcoming LUMA products and news..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Official Office Address (Fashion Parking, Dubai Mall)
                </label>
                <input
                  type="text"
                  value={footer.address || ''}
                  onChange={(e) => updateSectionField('footerConnect', 'address', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={footer.email || ''}
                  onChange={(e) => updateSectionField('footerConnect', 'email', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  WhatsApp Support Phone (Mobile)
                </label>
                <input
                  type="text"
                  value={footer.phone || ''}
                  onChange={(e) => {
                    const newPhone = e.target.value;
                    const clean = newPhone.replace(/[^0-9]/g, '');
                    updateSectionField('footerConnect', 'phone', newPhone);
                    if (clean) {
                      updateSectionField('footerConnect', 'socialWhatsapp', `https://wa.me/${clean}`);
                    }
                  }}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs font-semibold"
                  placeholder="+971 50 123 4567"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  Connected directly to both the Navbar WhatsApp icon and Footer WhatsApp link.
                </p>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Direct WhatsApp Chat Link (wa.me)
                </label>
                <input
                  type="url"
                  value={footer.socialWhatsapp || ''}
                  onChange={(e) => updateSectionField('footerConnect', 'socialWhatsapp', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="https://wa.me/971501234567"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                  Secondary Phone (Landline)
                </label>
                <input
                  type="text"
                  value={footer.phoneSecondary || ''}
                  onChange={(e) => updateSectionField('footerConnect', 'phoneSecondary', e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#ED2024] rounded-[8px] px-4 py-2.5 text-[14px] text-[#1E293B] outline-none shadow-xs"
                  placeholder="+971 4 123 4567"
                />
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

