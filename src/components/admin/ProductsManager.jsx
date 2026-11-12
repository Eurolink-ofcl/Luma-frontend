import React, { useState, useEffect, useMemo } from 'react';
import ImageUploadField from './ImageUploadField';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'face-mask', label: 'Face Mask' },
  { id: 'portable', label: 'Portable Panels' },
  { id: 'half-body', label: 'Half Body Panels' },
  { id: 'full-body', label: 'Full Body Systems' },
  { id: 'accessories', label: 'Accessories' },
];

const EMPTY_PRODUCT_FORM = {
  displayOrder: 1,
  name: '',
  eyebrow: '',
  titleLine1: '',
  titleLine2: '',
  slug: '',
  sku: '',
  subtitle: '',
  category: 'half-body',
  price: '',
  originalPrice: '',
  currency: 'AED',
  stock: 20,
  inStock: true,
  isActive: true,
  image: '/assets/products/list-product-1.jpg',
  thumbnail: '/assets/products/luma-glow.png',
  images: ['/assets/products/list-product-1.jpg'],
  description: '',
  details: '',
  features: [
    'Dual clinical wavelengths: 660nm Red & 850nm Near-Infrared',
    'Whisper-quiet fanless cooling with zero downtime',
  ],
  specifications: {
    Wavelengths: '660nm & 850nm',
    Irradiance: '120 mW/cmÂ² at 6 inches',
    'Session Time': '10-15 Minutes',
    Warranty: '2-Year Official Warranty',
  },
  specHighlights: [
    { label: 'Leds', value: '12' },
    { label: 'Coverage', value: 'Targeted Treatment' },
    { label: 'Dimensions', value: '140 x 70 x 29 mm' },
    { label: 'Lifespan', value: '50,000hrs' },
    { label: 'Battery Size', value: '7.4V 2500mAh' },
    { label: 'Battery Performance', value: '2 hours' },
    { label: 'Charging time', value: '1.5h (type-c)' },
    { label: 'Wavelength', value: '660nm' },
  ],
  healthBenefits: [
    'Targeted cellular energy (ATP) stimulation for deep tissue recovery.',
    'Helps relieve localized muscular fatigue, joint tension, and soreness.',
    'Stimulates dermal collagen synthesis for improved skin firmness and glow.',
    'Portable, pocket-sized design enables convenient daily healing sessions anywhere.',
  ],
  the8WavelengthsTitle: 'THE 8 WAVELENGTHS',
  wavelengthsDesc: 'Engineered with clinical 660nm deep red and targeted spectrums for cellular energy enhancement and tissue rejuvenation.',
  howToUse: [
    'Hold or position the device 1-6 inches from target area.',
    'Run a 10-15 minute session per targeted muscle group or skin zone.',
    'Use 1-2 times daily for optimal restorative results.',
  ],
  inTheBox: [
    '1Ã— LUMA Device',
    '1Ã— Protective Travel Pouch',
    '1Ã— USB Type-C Fast Charging Cable',
    '1Ã— Protective Travel Eye Goggles',
    '1Ã— Comprehensive User Manual & Quick Start Guide',
  ],
  benefitCards: [],
  specRows: [],
  specDeviceImage: '',
  specHighlights: [
    { label: 'Leds', value: '12' },
    { label: 'Coverage', value: 'Targeted Treatment' },
    { label: 'Dimensions', value: '140 x 70 x 29 mm' },
    { label: 'Lifespan', value: '50,000hrs' },
    { label: 'Battery Size', value: '7.4V 2500mAh' },
    { label: 'Battery Performance', value: '2 hours' },
    { label: 'Charging time', value: '1.5h (type-c)' },
    { label: 'Wavelength', value: '660nm' },
  ],
  healthBenefits: [
    'Targeted cellular energy (ATP) stimulation for deep tissue recovery.',
    'Helps relieve localized muscular fatigue, joint tension, and soreness.',
    'Stimulates dermal collagen synthesis for improved skin firmness and glow.',
    'Portable, pocket-sized design enables convenient daily healing sessions anywhere.',
  ],
  the8WavelengthsTitle: 'THE 8 WAVELENGTHS',
  wavelengthsDesc: 'Engineered with clinical 660nm deep red and targeted spectrums for cellular energy enhancement and tissue rejuvenation.',
  howToUse: [
    'Hold or position the device 1-6 inches from target area.',
    'Run a 10-15 minute session per targeted muscle group or skin zone.',
    'Use 1-2 times daily for optimal restorative results.',
  ],
  inTheBox: [
    '1× LUMA Device',
    '1× Protective Travel Pouch',
    '1× USB Type-C Fast Charging Cable',
    '1× Protective Travel Eye Goggles',
    '1× Comprehensive User Manual & Quick Start Guide',
  ],
  benefitCards: [],
  specRows: [],
  specDeviceImage: '',
  rating: 4.9,
  reviewsCount: 15,
};

export default function ProductsManager({ onNavigateToProduct, onNavigateStorefront }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in-stock', 'out-of-stock'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'name', 'stock'
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PRODUCT_FORM);
  const [modalTab, setModalTab] = useState('general'); // 'general', 'pricing', 'media', 'features', 'specs'
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Seeding State
  const [seeding, setSeeding] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`);
      const data = await response.json();

      if (response.ok && data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch products.');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to reach backend API at http://localhost:5000. Ensure server is running.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setFormData(EMPTY_PRODUCT_FORM);
    setModalTab('general');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal with selected product data
  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setCurrentEditId(product._id || product.slug);

    // Convert specifications Map/Object if needed
    let specsObj = {};
    if (product.specifications) {
      if (typeof product.specifications === 'object') {
        specsObj = { ...product.specifications };
      }
    }

    setFormData({
      displayOrder: product.displayOrder ?? 1,
      name: product.name || '',
      eyebrow: product.eyebrow || product.name || '',
      titleLine1: product.titleLine1 || product.name || '',
      titleLine2: product.titleLine2 || product.subtitle || '',
      slug: product.slug || '',
      sku: product.sku || '',
      subtitle: product.subtitle || '',
      category: product.category || 'half-body',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      currency: product.currency || 'AED',
      stock: product.stock ?? 20,
      inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
      isActive: product.isActive !== undefined ? Boolean(product.isActive) : true,
      image: product.image || product.thumbnail || '/assets/products/list-product-1.jpg',
      thumbnail: product.thumbnail || product.image || '/assets/products/luma-glow.png',
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image || '/assets/products/list-product-1.jpg'],
      description: product.description || '',
      details: product.details || '',
      features: Array.isArray(product.features) ? product.features : [],
      specifications: specsObj,
      specHighlights: Array.isArray(product.specHighlights) && product.specHighlights.length > 0 ? product.specHighlights : [],
      healthBenefits: Array.isArray(product.healthBenefits) && product.healthBenefits.length > 0 ? product.healthBenefits : [],
      the8WavelengthsTitle: product.the8WavelengthsTitle || 'THE 8 WAVELENGTHS',
      wavelengthsDesc: product.wavelengthsDesc || '',
      howToUse: Array.isArray(product.howToUse) && product.howToUse.length > 0 ? product.howToUse : [],
      inTheBox: Array.isArray(product.inTheBox) && product.inTheBox.length > 0 ? product.inTheBox : [],
      benefitCards: product.benefitCards || [],
      specRows: product.specRows || [],
      specDeviceImage: product.specDeviceImage || '',
      rating: product.rating ?? 4.9,
      reviewsCount: product.reviewsCount ?? 0,
    });

    setModalTab('general');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Quick In-Stock Toggle
  const handleToggleStock = async (product, e) => {
    e.stopPropagation();
    const newStatus = !product.inStock;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${product._id || product.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStatus }),
      });

      const res = await response.json();
      if (response.ok && res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            (p._id === product._id || p.slug === product.slug) ? { ...p, inStock: newStatus } : p
          )
        );
        showToast(`Stock status for "${product.name}" updated.`);
      } else {
        alert(res.message || 'Failed to update stock status');
      }
    } catch (err) {
      console.error('Error toggling stock:', err);
      alert('Network error updating stock.');
    }
  };

  // Save (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Product Name is required.');
      setModalTab('general');
      return;
    }

    if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setFormError('Please enter a valid price (greater than or equal to 0).');
      setModalTab('pricing');
      return;
    }

    setSaving(true);

    try {
      const url = isEditing
        ? `${API_BASE_URL}/admin/products/${currentEditId}`
        : `${API_BASE_URL}/admin/products`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsModalOpen(false);
        showToast(
          isEditing
            ? `Product "${formData.name}" updated successfully.`
            : `Product "${formData.name}" created successfully.`
        );
        fetchProducts();
      } else {
        setFormError(result.message || 'Failed to save product.');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setFormError('Network error while saving product.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/products/${productToDelete._id || productToDelete.slug}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        setProductToDelete(null);
        showToast(`Product "${productToDelete.name}" deleted successfully.`);
        fetchProducts();
      } else {
        alert(result.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Network error while deleting product.');
    } finally {
      setDeleting(false);
    }
  };

  // Seed Default LUMA Catalog
  const handleSeedDefaults = async () => {
    if (
      !window.confirm(
        'Populate / Restore all 7 official LUMA catalog products (LUMA GLOW, GO, NOVA, SURGE, APEX, SURGE PRO, MAX)?'
      )
    ) {
      return;
    }

    setSeeding(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/seed`, {
        method: 'POST',
      });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast(result.message || 'Official LUMA catalog seeded successfully!');
        fetchProducts();
      } else {
        alert(result.message || 'Failed to seed catalog.');
      }
    } catch (err) {
      console.error('Error seeding products:', err);
      alert('Network error while seeding catalog.');
    } finally {
      setSeeding(false);
    }
  };

  // Helper form field updater
  const updateFormField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Feature item helpers
  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const handleUpdateFeature = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[index] = value;
      return { ...prev, features: updated };
    });
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Specification row helpers
  const handleAddSpecRow = () => {
    const key = `Spec_${Object.keys(formData.specifications || {}).length + 1}`;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [key]: '',
      },
    }));
  };

  const handleUpdateSpecKey = (oldKey, newKey) => {
    if (!newKey.trim() || oldKey === newKey) return;
    setFormData((prev) => {
      const specs = { ...(prev.specifications || {}) };
      const val = specs[oldKey];
      delete specs[oldKey];
      specs[newKey] = val;
      return { ...prev, specifications: specs };
    });
  };

  const handleUpdateSpecValue = (key, val) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [key]: val,
      },
    }));
  };

  const handleRemoveSpec = (key) => {
    setFormData((prev) => {
      const specs = { ...(prev.specifications || {}) };
      delete specs[key];
      return { ...prev, specifications: specs };
    });
  };

  // Clinical Specification Matrix (specRows) helpers
  const handleAddClinicalSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specRows: [
        ...(Array.isArray(prev.specRows) ? prev.specRows : []),
        { id: `spec-${Date.now()}`, label: 'NEW SPECIFICATION', lines: [''] },
      ],
    }));
  };

  const handleUpdateClinicalSpecLabel = (idx, label) => {
    setFormData((prev) => {
      const rows = [...(Array.isArray(prev.specRows) ? prev.specRows : [])];
      if (rows[idx]) {
        rows[idx] = { ...rows[idx], label: label.toUpperCase() };
      }
      return { ...prev, specRows: rows };
    });
  };

  const handleUpdateClinicalSpecLines = (idx, value) => {
    setFormData((prev) => {
      const rows = [...(Array.isArray(prev.specRows) ? prev.specRows : [])];
      if (rows[idx]) {
        const lines = value.includes('\n')
          ? value.split('\n').map((l) => l.trim()).filter(Boolean)
          : [value];
        rows[idx] = { ...rows[idx], lines: lines.length > 0 ? lines : [''] };
      }
      return { ...prev, specRows: rows };
    });
  };

  const handleRemoveClinicalSpecRow = (idx) => {
    setFormData((prev) => ({
      ...prev,
      specRows: (Array.isArray(prev.specRows) ? prev.specRows : []).filter((_, i) => i !== idx),
    }));
  };

  const handleLoadDefaultClinicalSpecs = () => {
    const DEFAULT_SPECS = [
      { id: 'wavelengths', label: 'WAVELENGTHS', lines: ['660NM (DEEP RED)', '850NM (NEAR-INFRARED)'] },
      { id: 'amps-120v', label: 'AMPS @120V', lines: ['0.25A'] },
      { id: 'amps-220v', label: 'AMPS @220V', lines: ['0.15A'] },
      { id: 'dimensions', label: 'DIMENSIONS', lines: ['29.5 X 21.2 X 1.2 CM'] },
      { id: 'power-consumption', label: 'POWER CONSUMPTION', lines: ['15W'] },
      { id: 'leds', label: 'LEDS', lines: ['120 MEDICAL DUAL-CHIP LEDS'] },
      { id: 'beam-angle', label: 'BEAM ANGLE', lines: ['120 DEGREES UNIFORM DIFFUSION'] },
      { id: 'timer', label: 'TIMER', lines: ['10 MINUTES PRESET AUTO SHUT-OFF'] },
      { id: 'pulse', label: 'PULSE', lines: ['CONTINUOUS WAVE BIO-STIMULATION'] },
      { id: 'dimmable', label: 'DIMMABLE', lines: ['3 INTENSITY LEVELS'] },
      { id: 'weight', label: 'WEIGHT', lines: ['320 G / 0.70 LB'] },
      { id: 'led-lifespan', label: 'LED LIFESPAN', lines: ['50,000HRS'] },
      { id: 'emf-emission', label: 'EMF EMISSION', lines: ['ZERO / 0.00 UT AT SURFACE'] },
      { id: 'warranty', label: 'WARRANTY', lines: ['3 YEARS'] },
      { id: 'best-for', label: 'BEST FOR', lines: ['FACIAL REJUVENATION & ANTI-AGING'] },
      { id: 'max-area', label: 'MAX AREA', lines: ['FULL FACE & FOREHEAD'] },
    ];
    setFormData((prev) => ({
      ...prev,
      specRows: DEFAULT_SPECS,
    }));
  };

  // Benefit Cards (3-Card Section) helpers
  const handleAddBenefitCard = () => {
    setFormData((prev) => ({
      ...prev,
      benefitCards: [
        ...(Array.isArray(prev.benefitCards) ? prev.benefitCards : []),
        {
          id: `benefit-${Date.now()}`,
          eyebrow: 'NEW CLINICAL BENEFIT',
          titleLine1: 'BENEFIT HEADING',
          titleLine2: '',
          description: 'Detailed explanation of biological and clinical wellness results...',
          image: '/assets/nova/benefit-1.jpg',
        },
      ],
    }));
  };

  const handleUpdateBenefitCard = (idx, field, value) => {
    setFormData((prev) => {
      const cards = [...(Array.isArray(prev.benefitCards) ? prev.benefitCards : [])];
      if (cards[idx]) {
        cards[idx] = { ...cards[idx], [field]: value };
      }
      return { ...prev, benefitCards: cards };
    });
  };

  const handleRemoveBenefitCard = (idx) => {
    setFormData((prev) => ({
      ...prev,
      benefitCards: (Array.isArray(prev.benefitCards) ? prev.benefitCards : []).filter((_, i) => i !== idx),
    }));
  };

  const handleLoadDefaultBenefitCards = () => {
    const DEFAULT_BENEFITS = [
      {
        id: 'benefit-1',
        eyebrow: 'DUAL CLINICAL WAVELENGTHS',
        titleLine1: 'EPIDERMAL & DEEP DERMAL',
        titleLine2: 'CELLULAR REJUVENATION',
        description:
          '660nm deep red activates fibroblasts to trigger collagen remodeling, while 850nm near-infrared calms deep tissue, accelerating cellular turnover without heat or UV rays.',
        image: '/assets/nova/benefit-1.jpg',
      },
      {
        id: 'benefit-2',
        eyebrow: 'FEATHERLIGHT SILICONE',
        titleLine1: 'CONTOURED COMFORT,',
        titleLine2: 'HANDS-FREE WEAR',
        description:
          'Engineered from ultra-pliable medical-grade silicone that molds naturally to your facial contours, delivering even optical density across forehead, cheeks, and jawline.',
        image: '/assets/nova/benefit-2.jpg',
      },
      {
        id: 'benefit-3',
        eyebrow: 'ONE-TOUCH ROUTINE',
        titleLine1: 'EFFORTLESS 10-MINUTE',
        titleLine2: 'DAILY GLOW PROTOCOL',
        description:
          'Pre-programmed for optimal clinical energy dosing in just 10 minutes. Built-in smart timer shuts off automatically so you can unwind with zero guesswork.',
        image: '/assets/nova/benefit-3.jpg',
      },
    ];
    setFormData((prev) => ({
      ...prev,
      benefitCards: DEFAULT_BENEFITS,
    }));
  };

  // What's in the Box helpers
  const handleAddInTheBox = () => {
    setFormData((prev) => ({
      ...prev,
      inTheBox: [...(Array.isArray(prev.inTheBox) ? prev.inTheBox : []), ''],
    }));
  };

  const handleUpdateInTheBox = (idx, val) => {
    setFormData((prev) => {
      const items = [...(Array.isArray(prev.inTheBox) ? prev.inTheBox : [])];
      items[idx] = val;
      return { ...prev, inTheBox: items };
    });
  };

  const handleRemoveInTheBox = (idx) => {
    setFormData((prev) => ({
      ...prev,
      inTheBox: (Array.isArray(prev.inTheBox) ? prev.inTheBox : []).filter((_, i) => i !== idx),
    }));
  };

  const handleLoadDefaultInTheBox = () => {
    setFormData((prev) => ({
      ...prev,
      inTheBox: [
        `1× ${prev.name || 'LUMA Device'}`,
        '1× Protective Hard Carrying Pouch',
        '1× USB Type-C Fast Charging Cable',
        '1× Protective Travel Eye Goggles',
        '1× Comprehensive User Manual & Quick Start Guide',
      ],
    }));
  };

  // 1. Product Specification Highlights helpers
  const handleAddSpecHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      specHighlights: [
        ...(Array.isArray(prev.specHighlights) ? prev.specHighlights : []),
        { label: '', value: '' },
      ],
    }));
  };

  const handleUpdateSpecHighlight = (idx, field, val) => {
    setFormData((prev) => {
      const list = [...(Array.isArray(prev.specHighlights) ? prev.specHighlights : [])];
      if (list[idx]) {
        list[idx] = { ...list[idx], [field]: val };
      }
      return { ...prev, specHighlights: list };
    });
  };

  const handleRemoveSpecHighlight = (idx) => {
    setFormData((prev) => ({
      ...prev,
      specHighlights: (Array.isArray(prev.specHighlights) ? prev.specHighlights : []).filter((_, i) => i !== idx),
    }));
  };

  const handleLoadDefaultSpecHighlights = () => {
    setFormData((prev) => ({
      ...prev,
      specHighlights: [
        { label: 'Leds', value: '12' },
        { label: 'Coverage', value: 'Targeted Treatment' },
        { label: 'Dimensions', value: '140 x 70 x 29 mm' },
        { label: 'Lifespan', value: '50,000hrs' },
        { label: 'Battery Size', value: '7.4V 2500mAh' },
        { label: 'Battery Performance', value: '2 hours' },
        { label: 'Charging time', value: '1.5h (type-c)' },
        { label: 'Wavelength', value: '660nm' },
      ],
    }));
  };

  // 2. Health Benefits helpers
  const handleAddHealthBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      healthBenefits: [...(Array.isArray(prev.healthBenefits) ? prev.healthBenefits : []), ''],
    }));
  };

  const handleUpdateHealthBenefit = (idx, val) => {
    setFormData((prev) => {
      const list = [...(Array.isArray(prev.healthBenefits) ? prev.healthBenefits : [])];
      list[idx] = val;
      return { ...prev, healthBenefits: list };
    });
  };

  const handleRemoveHealthBenefit = (idx) => {
    setFormData((prev) => ({
      ...prev,
      healthBenefits: (Array.isArray(prev.healthBenefits) ? prev.healthBenefits : []).filter((_, i) => i !== idx),
    }));
  };

  const handleLoadDefaultHealthBenefits = () => {
    setFormData((prev) => ({
      ...prev,
      healthBenefits: [
        'Targeted cellular energy (ATP) stimulation for deep tissue recovery.',
        'Helps relieve localized muscular fatigue, joint tension, and soreness.',
        'Stimulates dermal collagen synthesis for improved skin firmness and glow.',
        'Portable, pocket-sized design enables convenient daily healing sessions anywhere.',
      ],
    }));
  };

  // 4. How To Use helpers
  const handleAddHowToUse = () => {
    setFormData((prev) => ({
      ...prev,
      howToUse: [...(Array.isArray(prev.howToUse) ? prev.howToUse : []), ''],
    }));
  };

  const handleUpdateHowToUse = (idx, val) => {
    setFormData((prev) => {
      const list = [...(Array.isArray(prev.howToUse) ? prev.howToUse : [])];
      list[idx] = val;
      return { ...prev, howToUse: list };
    });
  };

  const handleRemoveHowToUse = (idx) => {
    setFormData((prev) => ({
      ...prev,
      howToUse: (Array.isArray(prev.howToUse) ? prev.howToUse : []).filter((_, i) => i !== idx),
    }));
  };

  const handleLoadDefaultHowToUse = () => {
    setFormData((prev) => ({
      ...prev,
      howToUse: [
        'Hold or position the device 1-6 inches from target area.',
        'Run a 10-15 minute session per targeted muscle group or skin zone.',
        'Use 1-2 times daily for optimal restorative results.',
      ],
    }));
  };

  // Gallery image helpers
  const handleAddGalleryImage = (url) => {
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            p.name?.toLowerCase().includes(q) ||
            p.slug?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q) ||
            p.subtitle?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Stock
        if (stockFilter === 'in-stock' && !p.inStock) return false;
        if (stockFilter === 'out-of-stock' && p.inStock) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'stock') return (a.stock || 0) - (b.stock || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  // Aggregate stats
  const totalStockCount = useMemo(() => {
    return products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  }, [products]);

  const inStockCount = useMemo(() => {
    return products.filter((p) => p.inStock).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => !p.inStock || p.stock <= 0).length;
  }, [products]);

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-[12px] shadow-2xl backdrop-blur-md flex items-center gap-3 border transition-all animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-[#ED2024]/15 border-[#ED2024]/30 text-rose-300'
          }`}
        >
          <span className="text-[14px]">
            {notification.type === 'success' ? 'âœ“' : 'âš ï¸'}
          </span>
          <span className="text-[13px] font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header / Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ED2024] text-[11px] font-bold uppercase tracking-[0.14em] mb-1">
            <span>Management</span>
            <span>â€¢</span>
            <span>Catalog Collection</span>
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-extrabold uppercase tracking-[0.02em] text-gray-900">
            Products Management
          </h1>
          <p className="text-[12px] text-gray-500 mt-0.5">
            Create, update, delete, and control pricing, inventory, and clinical specs for all LUMA devices.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="px-3.5 py-2 rounded-[9px] bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 shadow-sm text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title="Refresh Products"
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

          <button
            type="button"
            onClick={handleSeedDefaults}
            disabled={seeding || loading}
            className="px-3.5 py-2 rounded-[9px] bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 shadow-sm text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title="Seed / Reset 7 official LUMA catalog products"
          >
            <svg className="w-3.5 h-3.5 text-[#ED2024]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{seeding ? 'Seeding...' : 'Seed LUMA Catalog'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-[9px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[12px] font-bold uppercase tracking-[0.06em] shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Quick Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-4 rounded-[14px] bg-white border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-500 block">
              Total Catalog
            </span>
            <span className="text-[22px] font-extrabold text-gray-900">
              {loading ? '--' : products.length}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#ED2024]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <div className="p-4 rounded-[14px] bg-white border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-emerald-600 block">
              In Stock
            </span>
            <span className="text-[22px] font-extrabold text-emerald-600">
              {loading ? '--' : inStockCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="text-[13px] font-bold">âœ“</span>
          </div>
        </div>

        <div className="p-4 rounded-[14px] bg-white border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-rose-600 block">
              Out of Stock
            </span>
            <span className="text-[22px] font-extrabold text-rose-600">
              {loading ? '--' : outOfStockCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <span className="text-[13px] font-bold">âœ•</span>
          </div>
        </div>

        <div className="p-4 rounded-[14px] bg-white border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-500 block">
              Total Units
            </span>
            <span className="text-[22px] font-extrabold text-gray-900">
              {loading ? '--' : totalStockCount}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div className="p-4 rounded-[14px] bg-white border border-gray-200 shadow-sm space-y-3 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, or slug..."
              className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] pl-10 pr-4 py-2.5 text-gray-900 text-[12.5px] outline-none transition-colors placeholder:text-gray-400 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
              >
                âœ•
              </button>
            )}
          </div>

          {/* Controls: Stock Filter, Sort, View Toggle */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-gray-800 text-[12px] outline-none cursor-pointer shadow-xs focus:border-[#ED2024]"
            >
              <option value="all">All Stock Status</option>
              <option value="in-stock">In Stock Only</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-gray-800 text-[12px] outline-none cursor-pointer shadow-xs focus:border-[#ED2024]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="stock">Stock: Low to High</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-[8px] bg-gray-100 border border-gray-300 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-[6px] transition-colors ${
                  viewMode === 'table' ? 'bg-[#ED2024] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Table view"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[6px] transition-colors ${
                  viewMode === 'grid' ? 'bg-[#ED2024] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Grid view"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ED2024] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <svg className="animate-spin h-8 w-8 text-[#ED2024] mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500 text-[13px] font-medium">Loading products...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-[16px] bg-red-50 border border-red-200 text-center">
          <p className="text-gray-900 text-[14px] font-semibold mb-2">Error Loading Products</p>
          <p className="text-gray-600 text-[12.5px] max-w-md mx-auto mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchProducts}
            className="px-4 py-2 rounded-[8px] bg-[#ED2024] text-white text-[12px] font-bold shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 rounded-[18px] bg-white border border-gray-200 shadow-sm text-center max-w-md mx-auto my-6">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#ED2024] mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-gray-900 font-bold text-[16px] uppercase tracking-wider mb-1">
            No Products Found
          </h3>
          <p className="text-gray-500 text-[12.5px] mb-5">
            {searchQuery || selectedCategory !== 'all' || stockFilter !== 'all'
              ? 'No products matched your search or filter criteria.'
              : 'Your products collection is currently empty.'}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleSeedDefaults}
              className="px-4 py-2 rounded-[8px] bg-[#ED2024] text-white text-[12px] font-bold uppercase tracking-wider shadow-sm"
            >
              Seed Official LUMA Products
            </button>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-gray-800 text-[12px] font-semibold"
            >
              + Create Blank
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* ==================== TABLE VIEW ==================== */
        <div className="rounded-[16px] bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-[10.5px] uppercase tracking-[0.1em] font-bold">
                  <th className="py-3.5 px-3 w-10 text-center">#</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category / SKU</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const productImg = p.image || p.thumbnail || '/assets/products/luma-nova.png';
                  const isOutOfStock = !p.inStock || p.stock <= 0;

                  return (
                    <tr
                      key={p._id || p.slug}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Storefront Display Order */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 text-gray-700 font-mono font-bold text-[11px] inline-flex items-center justify-center">
                          {p.displayOrder ?? '-'}
                        </span>
                      </td>
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-[10px] bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1 relative shadow-xs">
                            <img
                              src={productImg}
                              alt={p.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.src = '/assets/products/luma-nova.png';
                              }}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-900 uppercase tracking-wide truncate max-w-[220px]">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-gray-500 truncate max-w-[220px]">
                              {p.subtitle || p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-medium capitalize">
                            {(p.category || 'half-body').replace('-', ' ')}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {p.sku || p.slug}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#ED2024] text-[13.5px]">
                            {Number(p.price).toLocaleString()} {p.currency || 'AED'}
                          </span>
                          {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {Number(p.originalPrice).toLocaleString()} {p.currency || 'AED'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Units */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold ${
                              isOutOfStock ? 'text-rose-600' : p.stock < 10 ? 'text-amber-600' : 'text-gray-900'
                            }`}
                          >
                            {p.stock ?? 0}
                          </span>
                          <span className="text-[10px] text-gray-400">units</span>
                        </div>
                      </td>

                      {/* In Stock Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={(e) => handleToggleStock(p, e)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            p.inStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500 text-[12px]">â˜…</span>
                          <span className="font-semibold text-gray-800">{p.rating ?? 4.9}</span>
                          <span className="text-[10.5px] text-gray-400">({p.reviewsCount ?? 0})</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Storefront Link */}
                          <a
                            href={
                              p.slug === 'luma-glow'
                                ? '/luma-glow'
                                : p.slug === 'luma-go'
                                ? '/luma-go'
                                : p.slug === 'luma-nova'
                                ? '/luma-nova'
                                : `/products/${p.slug}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200 transition-colors"
                            title="View on Storefront"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="px-2.5 py-1 rounded-[7px] bg-gray-100 hover:bg-red-50 hover:border-red-300 border border-gray-200 text-gray-700 hover:text-[#ED2024] text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        </div>
      ) : (
        /* ==================== GRID VIEW ==================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const productImg = p.image || p.thumbnail || '/assets/products/luma-nova.png';

            return (
              <div
                key={p._id || p.slug}
                className="rounded-[16px] bg-white border border-gray-200 shadow-sm p-4 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all group"
              >
                <div>
                  {/* Top Image Box */}
                  <div className="relative w-full aspect-[4/3] rounded-[12px] bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center p-3 mb-3">
                    <img
                      src={productImg}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/assets/products/luma-nova.png';
                      }}
                    />
                    <span
                      className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        p.inStock
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#ED2024]">
                      {(p.category || 'half-body').replace('-', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {p.sku || p.slug}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-tight leading-snug">
                    {p.name}
                  </h3>
                  <p className="text-[11.5px] text-gray-500 line-clamp-2 mt-1 mb-3">
                    {p.description || p.subtitle || 'Clinical red light therapy unit.'}
                  </p>
                </div>

                <div>
                  {/* Price & Stock */}
                  <div className="flex items-baseline justify-between pt-3 border-t border-gray-100 mb-3">
                    <div>
                      <span className="text-[16px] font-black text-gray-900">
                        {Number(p.price).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-[#ED2024] ml-1 font-bold">
                        {p.currency || 'AED'}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {p.stock ?? 0} in stock
                    </span>
                  </div>

                  {/* Card Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(p)}
                      className="py-1.5 px-3 rounded-[8px] bg-gray-100 hover:bg-red-50 hover:border-red-300 border border-gray-200 text-gray-800 hover:text-[#ED2024] text-[11.5px] font-semibold transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Edit Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductToDelete(p)}
                      className="py-1.5 px-3 rounded-[8px] bg-gray-100 hover:bg-rose-50 hover:border-rose-200 border border-gray-200 text-gray-500 hover:text-rose-600 text-[11.5px] font-medium transition-colors cursor-pointer text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== CREATE / EDIT PRODUCT MODAL ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-[20px] shadow-2xl overflow-hidden my-auto text-gray-900">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <span className="text-[10px] font-bold text-[#ED2024] uppercase tracking-wider block">
                  {isEditing ? 'Edit Product' : 'Create New Product'}
                </span>
                <h2 className="text-[18px] font-extrabold uppercase text-gray-900 tracking-wide">
                  {isEditing ? formData.name || 'Edit Product' : 'Add New Product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                âœ•
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-[10px] bg-red-50 border border-red-200 text-[#ED2024] text-[12px] flex items-center justify-between font-medium">
                <span>{formError}</span>
                <button type="button" onClick={() => setFormError(null)} className="text-gray-500 hover:text-gray-800">
                  âœ•
                </button>
              </div>
            )}

            {/* Modal Tabs Navigation */}
            <div className="px-6 pt-3 border-b border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar bg-white">
              {[
                { id: 'general', label: '1. General Info' },
                { id: 'pricing', label: '2. Pricing & Stock' },
                { id: 'media', label: '3. Image & Media' },
                { id: 'features', label: '4. Features & Details' },
                { id: 'specs', label: '5. Technical Specs' },
                { id: 'accordions', label: '6. Accordion Sections' },
              ].map((tab) => {
                const isActive = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id)}
                    className={`pb-2.5 px-3 text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-[#ED2024] text-[#ED2024]'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar space-y-5 bg-white">
              {/* TAB 1: GENERAL INFO */}
              {modalTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormField('name', e.target.value)}
                        placeholder="e.g. LUMA NOVA"
                        required
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none font-bold shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        URL Slug (leave blank to auto-generate)
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => updateFormField('slug', e.target.value)}
                        placeholder="e.g. luma-nova"
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none font-mono shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => updateFormField('category', e.target.value)}
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none cursor-pointer shadow-xs"
                      >
                        <option value="face-mask">Face Mask</option>
                        <option value="portable">Portable Panels</option>
                        <option value="half-body">Half Body Panels</option>
                        <option value="full-body">Full Body Systems</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        SKU Code
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => updateFormField('sku', e.target.value)}
                        placeholder="e.g. LUM-NOV-03"
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none font-mono shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Storefront Layout & Hierarchy */}
                  <div className="p-3.5 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3.5">
                    <span className="text-[10px] font-bold text-[#ED2024] uppercase tracking-wider block">
                      Storefront Structure Settings
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Display Order (1..7) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={formData.displayOrder}
                          onChange={(e) => updateFormField('displayOrder', Number(e.target.value))}
                          placeholder="1"
                          required
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none font-bold font-mono shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Red Eyebrow (e.g. LUMA GLOW)
                        </label>
                        <input
                          type="text"
                          value={formData.eyebrow}
                          onChange={(e) => updateFormField('eyebrow', e.target.value)}
                          placeholder="e.g. LUMA GLOW"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-[#ED2024] text-[13px] outline-none font-bold shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Title Line 1
                        </label>
                        <input
                          type="text"
                          value={formData.titleLine1}
                          onChange={(e) => updateFormField('titleLine1', e.target.value)}
                          placeholder="e.g. LUMA FACE LED"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none font-bold uppercase shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Title Line 2
                        </label>
                        <input
                          type="text"
                          value={formData.titleLine2}
                          onChange={(e) => updateFormField('titleLine2', e.target.value)}
                          placeholder="e.g. LIGHT THERAPY MASK"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none font-bold uppercase shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                      Subtitle / Fallback Header
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => updateFormField('subtitle', e.target.value)}
                      placeholder="e.g. HALF BODY RED LIGHT THERAPY PANEL"
                      className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                      Short Overview Summary
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => updateFormField('description', e.target.value)}
                      placeholder="Brief 1-2 sentence marketing description for product cards..."
                      className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] p-3 text-gray-900 text-[13px] outline-none leading-relaxed shadow-xs"
                    />
                  </div>
                </div>
              )}



              {/* TAB 6: ACCORDION SECTIONS (PRODUCT SPECIFICATION, HEALTH BENEFITS, THE WAVELENGTHS, HOW TO USE, WHAT'S IN THE BOX) */}
              {modalTab === 'accordions' && (
                <div className="space-y-6">
                  {/* Informational Banner */}
                  <div className="p-4 rounded-[12px] bg-red-50/60 border border-red-200/80 flex items-start gap-3">
                    <span className="text-[18px] leading-none text-[#ED2024] shrink-0">ℹ️</span>
                    <div className="text-[12px] text-gray-700 leading-relaxed">
                      <strong className="text-gray-900 font-bold block mb-0.5">
                        Product Page Accordion Drawers
                      </strong>
                      These 5 accordions appear directly below the product hero on product detail pages (e.g. LUMA GO, LUMA GLOW, LUMA NOVA, etc.). You can customize the specification highlights, benefits, clinical wavelengths description, usage protocols, and packaged items for this product.
                    </div>
                  </div>

                  {/* 1. PRODUCT SPECIFICATION HIGHLIGHTS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          1. Product Specification Highlights
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          2-column key-value metrics displayed when the Product Specification accordion drawer is expanded (e.g. Leds, Coverage, Dimensions, Lifespan, Battery Size, Wavelength).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSpecHighlight}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Highlight
                        </button>
                      </div>
                    </div>

                    {(!formData.specHighlights || formData.specHighlights.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No specification highlights added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default highlights
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <span className="col-span-5">Label (e.g. Dimensions)</span>
                          <span className="col-span-6">Value (e.g. 140 x 70 x 29 mm)</span>
                          <span className="col-span-1 text-right">Action</span>
                        </div>
                        {formData.specHighlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 gap-2 items-center p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-colors"
                          >
                            <div className="col-span-5">
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'label', e.target.value)}
                                placeholder="e.g. Leds / Battery Size"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-900 font-bold text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                value={item.value || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'value', e.target.value)}
                                placeholder="e.g. 12 / 7.4V 2500mAh"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-800 font-medium text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecHighlight(idx)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Remove highlight"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. HEALTH BENEFITS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          2. Health Benefits
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of clinical health benefits and biological improvements displayed inside the Health Benefits accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHealthBenefit}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>

                    {(!formData.healthBenefits || formData.healthBenefits.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No health benefits added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default benefits
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.healthBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[#ED2024] font-black text-[14px] select-none pl-1">•</span>
                            <input
                              type="text"
                              value={benefit || ''}
                              onChange={(e) => handleUpdateHealthBenefit(idx, e.target.value)}
                              placeholder="e.g. Targeted cellular energy (ATP) stimulation for deep tissue recovery."
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHealthBenefit(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete benefit"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. THE 8 WAVELENGTHS (ACCORDION TITLE & CLINICAL DESCRIPTION) */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                        3. The Wavelengths (Title &amp; Clinical Description)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Customize the accordion header text (e.g. &ldquo;THE 8 WAVELENGTHS&rdquo;, &ldquo;THE WAVELENGTHS&rdquo;, &ldquo;THE 4 WAVELENGTHS&rdquo;) and the detailed spectral absorption description.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Accordion Header Title *
                        </label>
                        <input
                          type="text"
                          value={formData.the8WavelengthsTitle || 'THE 8 WAVELENGTHS'}
                          onChange={(e) => updateFormField('the8WavelengthsTitle', e.target.value.toUpperCase())}
                          placeholder="e.g. THE 8 WAVELENGTHS"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] px-3 py-2 text-gray-900 text-[12.5px] font-bold uppercase outline-none shadow-xs"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Shown on the clickable accordion toggle bar.
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Wavelengths Explanation Text *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.wavelengthsDesc || ''}
                          onChange={(e) => updateFormField('wavelengthsDesc', e.target.value)}
                          placeholder="e.g. LUMA GO concentrates high-intensity 660nm red light with a focused 30° optical beam angle, maximizing photon absorption in the skin and superficial tissue layers for peak biological rejuvenation."
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] p-2.5 text-gray-900 text-[12.5px] outline-none leading-relaxed shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. HOW TO USE */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          4. How To Use (Protocol Steps)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Numbered step-by-step treatment protocols displayed inside the How To Use accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHowToUse}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>

                    {(!formData.howToUse || formData.howToUse.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No usage steps added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default steps
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.howToUse.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-[#ED2024] font-bold text-[11px] flex items-center justify-center shrink-0 select-none">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={step || ''}
                              onChange={(e) => handleUpdateHowToUse(idx, e.target.value)}
                              placeholder={`Step ${idx + 1} instructions...`}
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHowToUse(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete step"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. WHAT'S IN THE BOX */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          5. What&apos;s In The Box (Package Contents)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of hardware and accessories included inside the product package.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddInTheBox}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Box Item
                        </button>
                      </div>
                    </div>

                    {(!formData.inTheBox || formData.inTheBox.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No package items added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default package contents
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.inTheBox.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[14px] shrink-0 select-none">📦</span>
                            <input
                              type="text"
                              value={item || ''}
                              onChange={(e) => handleUpdateInTheBox(idx, e.target.value)}
                              placeholder="e.g. 1× LUMA Device"
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveInTheBox(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete package item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & INVENTORY */}
              {modalTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        Selling Price (AED) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.price}
                        onChange={(e) => updateFormField('price', e.target.value)}
                        placeholder="e.g. 2150"
                        required
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-[#ED2024] text-[14px] font-black outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        Compare-at / Original Price (AED)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.originalPrice}
                        onChange={(e) => updateFormField('originalPrice', e.target.value)}
                        placeholder="e.g. 2890 (optional)"
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-500 text-[13px] outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        Stock Quantity (Units)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.stock}
                        onChange={(e) => updateFormField('stock', e.target.value)}
                        placeholder="20"
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none font-semibold shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-900 block">
                      Inventory &amp; Visibility Status
                    </span>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => updateFormField('inStock', e.target.checked)}
                          className="w-4 h-4 accent-[#ED2024] rounded"
                        />
                        <span className="text-[13px] text-gray-900 font-medium">
                          In Stock (Available for Purchase)
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => updateFormField('isActive', e.target.checked)}
                          className="w-4 h-4 accent-[#ED2024] rounded"
                        />
                        <span className="text-[13px] text-gray-900 font-medium">
                          Active &amp; Published in Store Catalog
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        Average Rating (Stars 1.0 - 5.0)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => updateFormField('rating', e.target.value)}
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                        Customer Reviews Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.reviewsCount}
                        onChange={(e) => updateFormField('reviewsCount', e.target.value)}
                        className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] px-3.5 py-2.5 text-gray-900 text-[13px] outline-none shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              )}



              {/* TAB 6: ACCORDION SECTIONS (PRODUCT SPECIFICATION, HEALTH BENEFITS, THE WAVELENGTHS, HOW TO USE, WHAT'S IN THE BOX) */}
              {modalTab === 'accordions' && (
                <div className="space-y-6">
                  {/* Informational Banner */}
                  <div className="p-4 rounded-[12px] bg-red-50/60 border border-red-200/80 flex items-start gap-3">
                    <span className="text-[18px] leading-none text-[#ED2024] shrink-0">ℹ️</span>
                    <div className="text-[12px] text-gray-700 leading-relaxed">
                      <strong className="text-gray-900 font-bold block mb-0.5">
                        Product Page Accordion Drawers
                      </strong>
                      These 5 accordions appear directly below the product hero on product detail pages (e.g. LUMA GO, LUMA GLOW, LUMA NOVA, etc.). You can customize the specification highlights, benefits, clinical wavelengths description, usage protocols, and packaged items for this product.
                    </div>
                  </div>

                  {/* 1. PRODUCT SPECIFICATION HIGHLIGHTS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          1. Product Specification Highlights
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          2-column key-value metrics displayed when the Product Specification accordion drawer is expanded (e.g. Leds, Coverage, Dimensions, Lifespan, Battery Size, Wavelength).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSpecHighlight}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Highlight
                        </button>
                      </div>
                    </div>

                    {(!formData.specHighlights || formData.specHighlights.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No specification highlights added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default highlights
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <span className="col-span-5">Label (e.g. Dimensions)</span>
                          <span className="col-span-6">Value (e.g. 140 x 70 x 29 mm)</span>
                          <span className="col-span-1 text-right">Action</span>
                        </div>
                        {formData.specHighlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 gap-2 items-center p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-colors"
                          >
                            <div className="col-span-5">
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'label', e.target.value)}
                                placeholder="e.g. Leds / Battery Size"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-900 font-bold text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                value={item.value || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'value', e.target.value)}
                                placeholder="e.g. 12 / 7.4V 2500mAh"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-800 font-medium text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecHighlight(idx)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Remove highlight"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. HEALTH BENEFITS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          2. Health Benefits
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of clinical health benefits and biological improvements displayed inside the Health Benefits accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHealthBenefit}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>

                    {(!formData.healthBenefits || formData.healthBenefits.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No health benefits added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default benefits
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.healthBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[#ED2024] font-black text-[14px] select-none pl-1">•</span>
                            <input
                              type="text"
                              value={benefit || ''}
                              onChange={(e) => handleUpdateHealthBenefit(idx, e.target.value)}
                              placeholder="e.g. Targeted cellular energy (ATP) stimulation for deep tissue recovery."
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHealthBenefit(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete benefit"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. THE 8 WAVELENGTHS (ACCORDION TITLE & CLINICAL DESCRIPTION) */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                        3. The Wavelengths (Title &amp; Clinical Description)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Customize the accordion header text (e.g. &ldquo;THE 8 WAVELENGTHS&rdquo;, &ldquo;THE WAVELENGTHS&rdquo;, &ldquo;THE 4 WAVELENGTHS&rdquo;) and the detailed spectral absorption description.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Accordion Header Title *
                        </label>
                        <input
                          type="text"
                          value={formData.the8WavelengthsTitle || 'THE 8 WAVELENGTHS'}
                          onChange={(e) => updateFormField('the8WavelengthsTitle', e.target.value.toUpperCase())}
                          placeholder="e.g. THE 8 WAVELENGTHS"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] px-3 py-2 text-gray-900 text-[12.5px] font-bold uppercase outline-none shadow-xs"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Shown on the clickable accordion toggle bar.
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Wavelengths Explanation Text *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.wavelengthsDesc || ''}
                          onChange={(e) => updateFormField('wavelengthsDesc', e.target.value)}
                          placeholder="e.g. LUMA GO concentrates high-intensity 660nm red light with a focused 30° optical beam angle, maximizing photon absorption in the skin and superficial tissue layers for peak biological rejuvenation."
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] p-2.5 text-gray-900 text-[12.5px] outline-none leading-relaxed shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. HOW TO USE */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          4. How To Use (Protocol Steps)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Numbered step-by-step treatment protocols displayed inside the How To Use accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHowToUse}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>

                    {(!formData.howToUse || formData.howToUse.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No usage steps added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default steps
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.howToUse.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-[#ED2024] font-bold text-[11px] flex items-center justify-center shrink-0 select-none">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={step || ''}
                              onChange={(e) => handleUpdateHowToUse(idx, e.target.value)}
                              placeholder={`Step ${idx + 1} instructions...`}
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHowToUse(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete step"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. WHAT'S IN THE BOX */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          5. What&apos;s In The Box (Package Contents)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of hardware and accessories included inside the product package.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddInTheBox}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Box Item
                        </button>
                      </div>
                    </div>

                    {(!formData.inTheBox || formData.inTheBox.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No package items added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default package contents
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.inTheBox.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[14px] shrink-0 select-none">📦</span>
                            <input
                              type="text"
                              value={item || ''}
                              onChange={(e) => handleUpdateInTheBox(idx, e.target.value)}
                              placeholder="e.g. 1× LUMA Device"
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveInTheBox(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete package item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & IMAGES */}
              {modalTab === 'media' && (
                <div className="space-y-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-900 block mb-2">
                      Primary Product Image
                    </span>
                    <ImageUploadField
                      label="Upload Main Product Image from Computer"
                      value={formData.image || formData.thumbnail || ''}
                      onChange={(url) => {
                        updateFormField('image', url);
                        updateFormField('thumbnail', url);
                      }}
                      defaultPath="/assets/products/luma-nova.png"
                      helpText="Upload a high-res PNG with transparent background or high quality JPG."
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-900 block mb-2">
                      Additional Gallery Images ({formData.images?.length || 0})
                    </span>

                    <div className="space-y-3">
                      {formData.images?.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-[10px] bg-gray-50 border border-gray-200 shadow-xs"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-contain" />
                          </div>
                          <input
                            type="text"
                            value={imgUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => {
                                const copy = [...prev.images];
                                copy[idx] = val;
                                return { ...prev, images: copy };
                              });
                            }}
                            className="flex-1 bg-white border border-gray-300 rounded-[8px] px-3 py-1.5 text-gray-900 text-[12px] outline-none font-mono focus:border-[#ED2024]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove image"
                          >
                            âœ•
                          </button>
                        </div>
                      ))}

                      <div className="pt-2">
                        <ImageUploadField
                          label="+ Add New Gallery Photo from Device"
                          value=""
                          onChange={(url) => handleAddGalleryImage(url)}
                          defaultPath="/assets/products/luma-nova.png"
                          helpText="Upload gallery slide photos for this product."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}



              {/* TAB 6: ACCORDION SECTIONS (PRODUCT SPECIFICATION, HEALTH BENEFITS, THE WAVELENGTHS, HOW TO USE, WHAT'S IN THE BOX) */}
              {modalTab === 'accordions' && (
                <div className="space-y-6">
                  {/* Informational Banner */}
                  <div className="p-4 rounded-[12px] bg-red-50/60 border border-red-200/80 flex items-start gap-3">
                    <span className="text-[18px] leading-none text-[#ED2024] shrink-0">ℹ️</span>
                    <div className="text-[12px] text-gray-700 leading-relaxed">
                      <strong className="text-gray-900 font-bold block mb-0.5">
                        Product Page Accordion Drawers
                      </strong>
                      These 5 accordions appear directly below the product hero on product detail pages (e.g. LUMA GO, LUMA GLOW, LUMA NOVA, etc.). You can customize the specification highlights, benefits, clinical wavelengths description, usage protocols, and packaged items for this product.
                    </div>
                  </div>

                  {/* 1. PRODUCT SPECIFICATION HIGHLIGHTS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          1. Product Specification Highlights
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          2-column key-value metrics displayed when the Product Specification accordion drawer is expanded (e.g. Leds, Coverage, Dimensions, Lifespan, Battery Size, Wavelength).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSpecHighlight}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Highlight
                        </button>
                      </div>
                    </div>

                    {(!formData.specHighlights || formData.specHighlights.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No specification highlights added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default highlights
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <span className="col-span-5">Label (e.g. Dimensions)</span>
                          <span className="col-span-6">Value (e.g. 140 x 70 x 29 mm)</span>
                          <span className="col-span-1 text-right">Action</span>
                        </div>
                        {formData.specHighlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 gap-2 items-center p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-colors"
                          >
                            <div className="col-span-5">
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'label', e.target.value)}
                                placeholder="e.g. Leds / Battery Size"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-900 font-bold text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                value={item.value || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'value', e.target.value)}
                                placeholder="e.g. 12 / 7.4V 2500mAh"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-800 font-medium text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecHighlight(idx)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Remove highlight"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. HEALTH BENEFITS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          2. Health Benefits
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of clinical health benefits and biological improvements displayed inside the Health Benefits accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHealthBenefit}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>

                    {(!formData.healthBenefits || formData.healthBenefits.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No health benefits added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default benefits
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.healthBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[#ED2024] font-black text-[14px] select-none pl-1">•</span>
                            <input
                              type="text"
                              value={benefit || ''}
                              onChange={(e) => handleUpdateHealthBenefit(idx, e.target.value)}
                              placeholder="e.g. Targeted cellular energy (ATP) stimulation for deep tissue recovery."
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHealthBenefit(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete benefit"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. THE 8 WAVELENGTHS (ACCORDION TITLE & CLINICAL DESCRIPTION) */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                        3. The Wavelengths (Title &amp; Clinical Description)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Customize the accordion header text (e.g. &ldquo;THE 8 WAVELENGTHS&rdquo;, &ldquo;THE WAVELENGTHS&rdquo;, &ldquo;THE 4 WAVELENGTHS&rdquo;) and the detailed spectral absorption description.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Accordion Header Title *
                        </label>
                        <input
                          type="text"
                          value={formData.the8WavelengthsTitle || 'THE 8 WAVELENGTHS'}
                          onChange={(e) => updateFormField('the8WavelengthsTitle', e.target.value.toUpperCase())}
                          placeholder="e.g. THE 8 WAVELENGTHS"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] px-3 py-2 text-gray-900 text-[12.5px] font-bold uppercase outline-none shadow-xs"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Shown on the clickable accordion toggle bar.
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Wavelengths Explanation Text *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.wavelengthsDesc || ''}
                          onChange={(e) => updateFormField('wavelengthsDesc', e.target.value)}
                          placeholder="e.g. LUMA GO concentrates high-intensity 660nm red light with a focused 30° optical beam angle, maximizing photon absorption in the skin and superficial tissue layers for peak biological rejuvenation."
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] p-2.5 text-gray-900 text-[12.5px] outline-none leading-relaxed shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. HOW TO USE */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          4. How To Use (Protocol Steps)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Numbered step-by-step treatment protocols displayed inside the How To Use accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHowToUse}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>

                    {(!formData.howToUse || formData.howToUse.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No usage steps added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default steps
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.howToUse.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-[#ED2024] font-bold text-[11px] flex items-center justify-center shrink-0 select-none">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={step || ''}
                              onChange={(e) => handleUpdateHowToUse(idx, e.target.value)}
                              placeholder={`Step ${idx + 1} instructions...`}
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHowToUse(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete step"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. WHAT'S IN THE BOX */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          5. What&apos;s In The Box (Package Contents)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of hardware and accessories included inside the product package.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddInTheBox}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Box Item
                        </button>
                      </div>
                    </div>

                    {(!formData.inTheBox || formData.inTheBox.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No package items added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default package contents
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.inTheBox.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[14px] shrink-0 select-none">📦</span>
                            <input
                              type="text"
                              value={item || ''}
                              onChange={(e) => handleUpdateInTheBox(idx, e.target.value)}
                              placeholder="e.g. 1× LUMA Device"
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveInTheBox(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete package item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: FEATURES & DETAILS */}
              {modalTab === 'features' && (
                <div className="space-y-6">
                  {/* Section 1: Clinical Benefit Cards (The 3 Image Cards with details underneath) */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          1. Clinical Benefit Cards
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Edit the 3 visual cards shown directly under the Hero section on the product inside page (Photo, Eyebrow, Title & Details).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(!formData.benefitCards || formData.benefitCards.length === 0) && (
                          <button
                            type="button"
                            onClick={handleLoadDefaultBenefitCards}
                            className="px-3 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            + Load 3 Standard Benefit Cards
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddBenefitCard}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d61a1e] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Benefit Card
                        </button>
                      </div>
                    </div>

                    {(!formData.benefitCards || formData.benefitCards.length === 0) ? (
                      <div className="text-center py-6 px-4 border border-dashed border-gray-300 rounded-[10px] bg-white">
                        <p className="text-[12px] text-gray-500 mb-3">No benefit cards configured yet for this product.</p>
                        <button
                          type="button"
                          onClick={handleLoadDefaultBenefitCards}
                          className="px-4 py-2 rounded-[8px] bg-[#ED2024] text-white text-[12px] font-bold cursor-pointer shadow-xs"
                        >
                          Pre-fill 3 Clinical Benefit Cards Template
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.benefitCards.map((card, idx) => (
                          <div
                            key={card.id || idx}
                            className="p-4 rounded-[10px] bg-white border border-gray-200 shadow-sm space-y-3"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                              <span className="text-[12px] font-bold uppercase tracking-wider text-[#ED2024]">
                                Benefit Card {idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBenefitCard(idx)}
                                className="text-gray-400 hover:text-rose-600 text-[12px] px-2 py-0.5 rounded hover:bg-rose-50 transition-colors cursor-pointer font-semibold"
                              >
                                âœ• Delete Card
                              </button>
                            </div>

                            {/* Card Image */}
                            <ImageUploadField
                              label={`Card ${idx + 1} Image / Photo`}
                              value={card.image || card.webp || ''}
                              onChange={(url) => {
                                handleUpdateBenefitCard(idx, 'image', url);
                                handleUpdateBenefitCard(idx, 'webp', url);
                              }}
                              placeholder="/assets/nova/benefit-1.jpg or upload"
                            />

                            {/* Eyebrow */}
                            <div>
                              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                                Red Eyebrow Label (Above Image)
                              </label>
                              <input
                                type="text"
                                value={card.eyebrow || ''}
                                onChange={(e) => handleUpdateBenefitCard(idx, 'eyebrow', e.target.value.toUpperCase())}
                                placeholder="e.g. DUAL CLINICAL WAVELENGTHS"
                                className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-[#ED2024] text-[12px] font-bold uppercase outline-none shadow-xs"
                              />
                            </div>

                            {/* Heading Lines (Under Image) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                                  Heading Line 1 (Under Photo)
                                </label>
                                <input
                                  type="text"
                                  value={card.titleLine1 || ''}
                                  onChange={(e) => handleUpdateBenefitCard(idx, 'titleLine1', e.target.value.toUpperCase())}
                                  placeholder="e.g. EPIDERMAL & DEEP DERMAL"
                                  className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] font-bold uppercase outline-none shadow-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                                  Heading Line 2
                                </label>
                                <input
                                  type="text"
                                  value={card.titleLine2 || ''}
                                  onChange={(e) => handleUpdateBenefitCard(idx, 'titleLine2', e.target.value.toUpperCase())}
                                  placeholder="e.g. CELLULAR REJUVENATION"
                                  className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] font-bold uppercase outline-none shadow-xs"
                                />
                              </div>
                            </div>

                            {/* Details / Description Under Image */}
                            <div>
                              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                                Details Text (Under Photo &amp; Heading) *
                              </label>
                              <textarea
                                rows={2}
                                value={card.description || ''}
                                onChange={(e) => handleUpdateBenefitCard(idx, 'description', e.target.value)}
                                placeholder="e.g. 660nm deep red activates fibroblasts to trigger collagen remodeling, while 850nm near-infrared calms deep tissue..."
                                className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[6px] p-2.5 text-gray-900 text-[12px] outline-none leading-relaxed shadow-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 2: What's In The Box Accordion */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          2. &quot;What&apos;s In The Box&quot; Items
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of package contents shown inside the top accordion drawer.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddInTheBox}
                        className="px-3 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        + Add Box Item
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.inTheBox?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[#ED2024] font-bold text-[11px]">ðŸ“¦</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleUpdateInTheBox(idx, e.target.value)}
                            placeholder="e.g. LUMA Protective Eyewear (NIR Shielding)"
                            className="flex-1 bg-white border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveInTheBox(idx)}
                            className="p-1.5 text-gray-400 hover:text-rose-600"
                          >
                            âœ•
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Detailed Clinical Description */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-2">
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-900">
                      3. Long / Detailed Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.details}
                      onChange={(e) => updateFormField('details', e.target.value)}
                      placeholder="Comprehensive clinical background and product architecture..."
                      className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[10px] p-3 text-gray-900 text-[13px] outline-none leading-relaxed shadow-xs"
                    />
                  </div>

                  {/* Section 4: Key Features & Bullet Points */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-bold uppercase tracking-wider text-gray-900">
                        4. Key Features &amp; Bullet Points
                      </label>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="text-[11px] text-[#ED2024] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        + Add Bullet Point
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.features?.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[#ED2024] font-bold">â€¢</span>
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                            placeholder="e.g. Dual clinical wavelengths: 660nm Red & 850nm Near-Infrared"
                            className="flex-1 bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] px-3 py-2 text-gray-900 text-[12.5px] outline-none shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="p-1.5 text-gray-400 hover:text-rose-600"
                          >
                            âœ•
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}



              {/* TAB 6: ACCORDION SECTIONS (PRODUCT SPECIFICATION, HEALTH BENEFITS, THE WAVELENGTHS, HOW TO USE, WHAT'S IN THE BOX) */}
              {modalTab === 'accordions' && (
                <div className="space-y-6">
                  {/* Informational Banner */}
                  <div className="p-4 rounded-[12px] bg-red-50/60 border border-red-200/80 flex items-start gap-3">
                    <span className="text-[18px] leading-none text-[#ED2024] shrink-0">ℹ️</span>
                    <div className="text-[12px] text-gray-700 leading-relaxed">
                      <strong className="text-gray-900 font-bold block mb-0.5">
                        Product Page Accordion Drawers
                      </strong>
                      These 5 accordions appear directly below the product hero on product detail pages (e.g. LUMA GO, LUMA GLOW, LUMA NOVA, etc.). You can customize the specification highlights, benefits, clinical wavelengths description, usage protocols, and packaged items for this product.
                    </div>
                  </div>

                  {/* 1. PRODUCT SPECIFICATION HIGHLIGHTS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          1. Product Specification Highlights
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          2-column key-value metrics displayed when the Product Specification accordion drawer is expanded (e.g. Leds, Coverage, Dimensions, Lifespan, Battery Size, Wavelength).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSpecHighlight}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Highlight
                        </button>
                      </div>
                    </div>

                    {(!formData.specHighlights || formData.specHighlights.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No specification highlights added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default highlights
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <span className="col-span-5">Label (e.g. Dimensions)</span>
                          <span className="col-span-6">Value (e.g. 140 x 70 x 29 mm)</span>
                          <span className="col-span-1 text-right">Action</span>
                        </div>
                        {formData.specHighlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 gap-2 items-center p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-colors"
                          >
                            <div className="col-span-5">
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'label', e.target.value)}
                                placeholder="e.g. Leds / Battery Size"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-900 font-bold text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                value={item.value || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'value', e.target.value)}
                                placeholder="e.g. 12 / 7.4V 2500mAh"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-800 font-medium text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecHighlight(idx)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Remove highlight"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. HEALTH BENEFITS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          2. Health Benefits
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of clinical health benefits and biological improvements displayed inside the Health Benefits accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHealthBenefit}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>

                    {(!formData.healthBenefits || formData.healthBenefits.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No health benefits added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default benefits
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.healthBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[#ED2024] font-black text-[14px] select-none pl-1">•</span>
                            <input
                              type="text"
                              value={benefit || ''}
                              onChange={(e) => handleUpdateHealthBenefit(idx, e.target.value)}
                              placeholder="e.g. Targeted cellular energy (ATP) stimulation for deep tissue recovery."
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHealthBenefit(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete benefit"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. THE 8 WAVELENGTHS (ACCORDION TITLE & CLINICAL DESCRIPTION) */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                        3. The Wavelengths (Title &amp; Clinical Description)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Customize the accordion header text (e.g. &ldquo;THE 8 WAVELENGTHS&rdquo;, &ldquo;THE WAVELENGTHS&rdquo;, &ldquo;THE 4 WAVELENGTHS&rdquo;) and the detailed spectral absorption description.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Accordion Header Title *
                        </label>
                        <input
                          type="text"
                          value={formData.the8WavelengthsTitle || 'THE 8 WAVELENGTHS'}
                          onChange={(e) => updateFormField('the8WavelengthsTitle', e.target.value.toUpperCase())}
                          placeholder="e.g. THE 8 WAVELENGTHS"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] px-3 py-2 text-gray-900 text-[12.5px] font-bold uppercase outline-none shadow-xs"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Shown on the clickable accordion toggle bar.
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Wavelengths Explanation Text *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.wavelengthsDesc || ''}
                          onChange={(e) => updateFormField('wavelengthsDesc', e.target.value)}
                          placeholder="e.g. LUMA GO concentrates high-intensity 660nm red light with a focused 30° optical beam angle, maximizing photon absorption in the skin and superficial tissue layers for peak biological rejuvenation."
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] p-2.5 text-gray-900 text-[12.5px] outline-none leading-relaxed shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. HOW TO USE */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          4. How To Use (Protocol Steps)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Numbered step-by-step treatment protocols displayed inside the How To Use accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHowToUse}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>

                    {(!formData.howToUse || formData.howToUse.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No usage steps added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default steps
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.howToUse.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-[#ED2024] font-bold text-[11px] flex items-center justify-center shrink-0 select-none">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={step || ''}
                              onChange={(e) => handleUpdateHowToUse(idx, e.target.value)}
                              placeholder={`Step ${idx + 1} instructions...`}
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHowToUse(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete step"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. WHAT'S IN THE BOX */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          5. What&apos;s In The Box (Package Contents)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of hardware and accessories included inside the product package.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddInTheBox}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Box Item
                        </button>
                      </div>
                    </div>

                    {(!formData.inTheBox || formData.inTheBox.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No package items added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default package contents
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.inTheBox.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[14px] shrink-0 select-none">📦</span>
                            <input
                              type="text"
                              value={item || ''}
                              onChange={(e) => handleUpdateInTheBox(idx, e.target.value)}
                              placeholder="e.g. 1× LUMA Device"
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveInTheBox(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete package item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: TECHNICAL SPECIFICATIONS */}
              {modalTab === 'specs' && (
                <div className="space-y-6">
                  {/* Section A: Specification Device Showcase Image */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                        1. Specification Device Showcase Image
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        The isolated product photo displayed alongside the specifications table on the product page.
                      </p>
                    </div>

                    <ImageUploadField
                      label="Device Photo for Specs Table"
                      value={formData.specDeviceImage || ''}
                      onChange={(url) => updateFormField('specDeviceImage', url)}
                      placeholder="/assets/nova/spec-nova-device.png or /assets/products/luma-glow.png"
                    />
                  </div>

                  {/* Section B: Clinical Specification Matrix (specRows) */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          2. Clinical Specifications Table
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          The official 2-column specifications table displayed on each product inside page.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(!formData.specRows || formData.specRows.length === 0) && (
                          <button
                            type="button"
                            onClick={handleLoadDefaultClinicalSpecs}
                            className="px-3 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            + Load Standard Template (16 Rows)
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddClinicalSpecRow}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d61a1e] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Specification Row
                        </button>
                      </div>
                    </div>

                    {(!formData.specRows || formData.specRows.length === 0) ? (
                      <div className="text-center py-6 px-4 border border-dashed border-gray-300 rounded-[10px] bg-white">
                        <p className="text-[12px] text-gray-500 mb-3">No specification rows configured yet for this product.</p>
                        <button
                          type="button"
                          onClick={handleLoadDefaultClinicalSpecs}
                          className="px-4 py-2 rounded-[8px] bg-[#ED2024] text-white text-[12px] font-bold cursor-pointer shadow-xs"
                        >
                          Populate Standard 16-Row Clinical Template
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-1">
                          <span className="col-span-4">Specification Parameter</span>
                          <span className="col-span-7">Value / Details (e.g. Dimensions, LEDs, Amps)</span>
                          <span className="col-span-1 text-right">Delete</span>
                        </div>
                        {formData.specRows.map((row, idx) => {
                          const linesStr = Array.isArray(row.lines) ? row.lines.join('\n') : (row.lines || '');
                          return (
                            <div
                              key={row.id || idx}
                              className="grid grid-cols-12 gap-2 items-center p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-colors"
                            >
                              <div className="col-span-4">
                                <input
                                  type="text"
                                  value={row.label || ''}
                                  onChange={(e) => handleUpdateClinicalSpecLabel(idx, e.target.value)}
                                  placeholder="e.g. DIMENSIONS"
                                  className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-[#ED2024] font-bold text-[11.5px] uppercase outline-none"
                                />
                              </div>
                              <div className="col-span-7">
                                <input
                                  type="text"
                                  value={linesStr}
                                  onChange={(e) => handleUpdateClinicalSpecLines(idx, e.target.value)}
                                  placeholder="e.g. 29.5 X 21.2 X 1.2 CM"
                                  className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-900 font-medium text-[11.5px] outline-none"
                                />
                              </div>
                              <div className="col-span-1 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveClinicalSpecRow(idx)}
                                  className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Delete Row"
                                >
                                  âœ•
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Section C: Key-Value Quick Specs */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-900">
                          3. Secondary Technical Key-Values
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          Supplementary metadata dictionary stored on product record.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSpecRow}
                        className="px-3 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-[11px] font-bold cursor-pointer shadow-xs"
                      >
                        + Add Key-Value
                      </button>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(formData.specifications || {}).map(([key, val], idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs"
                        >
                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              defaultValue={key}
                              onBlur={(e) => handleUpdateSpecKey(key, e.target.value)}
                              placeholder="Label (e.g. Wavelengths)"
                              className="w-full bg-gray-50 border border-gray-300 rounded-[6px] px-2.5 py-1.5 text-gray-900 font-medium text-[11.5px] outline-none"
                            />
                          </div>
                          <div className="sm:col-span-7">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => handleUpdateSpecValue(key, e.target.value)}
                              placeholder="Value (e.g. 660nm & 850nm)"
                              className="w-full bg-gray-50 border border-gray-300 rounded-[6px] px-2.5 py-1.5 text-gray-700 text-[11.5px] outline-none"
                            />
                          </div>
                          <div className="sm:col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveSpec(key)}
                              className="p-1.5 text-gray-400 hover:text-rose-600"
                              title="Delete row"
                            >
                              âœ•
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ACCORDION SECTIONS (PRODUCT SPECIFICATION, HEALTH BENEFITS, THE WAVELENGTHS, HOW TO USE, WHAT'S IN THE BOX) */}
              {modalTab === 'accordions' && (
                <div className="space-y-6">
                  {/* Informational Banner */}
                  <div className="p-4 rounded-[12px] bg-red-50/60 border border-red-200/80 flex items-start gap-3">
                    <span className="text-[18px] leading-none text-[#ED2024] shrink-0">â„¹ï¸</span>
                    <div className="text-[12px] text-gray-700 leading-relaxed">
                      <strong className="text-gray-900 font-bold block mb-0.5">
                        Product Page Accordion Drawers
                      </strong>
                      These 5 accordions appear directly below the product hero on product detail pages (e.g. LUMA GO, LUMA GLOW, LUMA NOVA, etc.). You can customize the specification highlights, benefits, clinical wavelengths description, usage protocols, and packaged items for this product.
                    </div>
                  </div>

                  {/* 1. PRODUCT SPECIFICATION HIGHLIGHTS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          1. Product Specification Highlights
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          2-column key-value metrics displayed when the Product Specification accordion drawer is expanded (e.g. Leds, Coverage, Dimensions, Lifespan, Battery Size, Wavelength).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSpecHighlight}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Highlight
                        </button>
                      </div>
                    </div>

                    {(!formData.specHighlights || formData.specHighlights.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No specification highlights added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default highlights
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <span className="col-span-5">Label (e.g. Dimensions)</span>
                          <span className="col-span-6">Value (e.g. 140 x 70 x 29 mm)</span>
                          <span className="col-span-1 text-right">Action</span>
                        </div>
                        {formData.specHighlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 gap-2 items-center p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-colors"
                          >
                            <div className="col-span-5">
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'label', e.target.value)}
                                placeholder="e.g. Leds / Battery Size"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-900 font-bold text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                value={item.value || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'value', e.target.value)}
                                placeholder="e.g. 12 / 7.4V 2500mAh"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-800 font-medium text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecHighlight(idx)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Remove highlight"
                              >
                                âœ•
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. HEALTH BENEFITS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          2. Health Benefits
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of clinical health benefits and biological improvements displayed inside the Health Benefits accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHealthBenefit}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>

                    {(!formData.healthBenefits || formData.healthBenefits.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No health benefits added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default benefits
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.healthBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[#ED2024] font-black text-[14px] select-none pl-1">â€¢</span>
                            <input
                              type="text"
                              value={benefit || ''}
                              onChange={(e) => handleUpdateHealthBenefit(idx, e.target.value)}
                              placeholder="e.g. Targeted cellular energy (ATP) stimulation for deep tissue recovery."
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHealthBenefit(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete benefit"
                            >
                              âœ•
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. THE 8 WAVELENGTHS (ACCORDION TITLE & CLINICAL DESCRIPTION) */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                        3. The Wavelengths (Title &amp; Clinical Description)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Customize the accordion header text (e.g. &ldquo;THE 8 WAVELENGTHS&rdquo;, &ldquo;THE WAVELENGTHS&rdquo;, &ldquo;THE 4 WAVELENGTHS&rdquo;) and the detailed spectral absorption description.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Accordion Header Title *
                        </label>
                        <input
                          type="text"
                          value={formData.the8WavelengthsTitle || 'THE 8 WAVELENGTHS'}
                          onChange={(e) => updateFormField('the8WavelengthsTitle', e.target.value.toUpperCase())}
                          placeholder="e.g. THE 8 WAVELENGTHS"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] px-3 py-2 text-gray-900 text-[12.5px] font-bold uppercase outline-none shadow-xs"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Shown on the clickable accordion toggle bar.
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Wavelengths Explanation Text *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.wavelengthsDesc || ''}
                          onChange={(e) => updateFormField('wavelengthsDesc', e.target.value)}
                          placeholder="e.g. LUMA GO concentrates high-intensity 660nm red light with a focused 30Â° optical beam angle, maximizing photon absorption in the skin and superficial tissue layers for peak biological rejuvenation."
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] p-2.5 text-gray-900 text-[12.5px] outline-none leading-relaxed shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. HOW TO USE */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          4. How To Use (Protocol Steps)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Numbered step-by-step treatment protocols displayed inside the How To Use accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHowToUse}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>

                    {(!formData.howToUse || formData.howToUse.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No usage steps added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default steps
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.howToUse.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-[#ED2024] font-bold text-[11px] flex items-center justify-center shrink-0 select-none">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={step || ''}
                              onChange={(e) => handleUpdateHowToUse(idx, e.target.value)}
                              placeholder={`Step ${idx + 1} instructions...`}
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHowToUse(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete step"
                            >
                              âœ•
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. WHAT'S IN THE BOX */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          5. What&apos;s In The Box (Package Contents)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of hardware and accessories included inside the product package.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddInTheBox}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Box Item
                        </button>
                      </div>
                    </div>

                    {(!formData.inTheBox || formData.inTheBox.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No package items added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default package contents
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.inTheBox.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[14px] shrink-0 select-none">ðŸ“¦</span>
                            <input
                              type="text"
                              value={item || ''}
                              onChange={(e) => handleUpdateInTheBox(idx, e.target.value)}
                              placeholder="e.g. 1Ã— LUMA Device"
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveInTheBox(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete package item"
                            >
                              âœ•
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: ACCORDION SECTIONS (PRODUCT SPECIFICATION, HEALTH BENEFITS, THE WAVELENGTHS, HOW TO USE, WHAT'S IN THE BOX) */}
              {modalTab === 'accordions' && (
                <div className="space-y-6">
                  {/* Informational Banner */}
                  <div className="p-4 rounded-[12px] bg-red-50/60 border border-red-200/80 flex items-start gap-3">
                    <span className="text-[18px] leading-none text-[#ED2024] shrink-0">ℹ️</span>
                    <div className="text-[12px] text-gray-700 leading-relaxed">
                      <strong className="text-gray-900 font-bold block mb-0.5">
                        Product Page Accordion Drawers
                      </strong>
                      These 5 accordions appear directly below the product hero on product detail pages (e.g. LUMA GO, LUMA GLOW, LUMA NOVA, etc.). You can customize the specification highlights, benefits, clinical wavelengths description, usage protocols, and packaged items for this product.
                    </div>
                  </div>

                  {/* 1. PRODUCT SPECIFICATION HIGHLIGHTS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          1. Product Specification Highlights
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          2-column key-value metrics displayed when the Product Specification accordion drawer is expanded (e.g. Leds, Coverage, Dimensions, Lifespan, Battery Size, Wavelength).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSpecHighlight}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Highlight
                        </button>
                      </div>
                    </div>

                    {(!formData.specHighlights || formData.specHighlights.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No specification highlights added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultSpecHighlights}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default highlights
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <span className="col-span-5">Label (e.g. Dimensions)</span>
                          <span className="col-span-6">Value (e.g. 140 x 70 x 29 mm)</span>
                          <span className="col-span-1 text-right">Action</span>
                        </div>
                        {formData.specHighlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 gap-2 items-center p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-colors"
                          >
                            <div className="col-span-5">
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'label', e.target.value)}
                                placeholder="e.g. Leds / Battery Size"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-900 font-bold text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                value={item.value || ''}
                                onChange={(e) => handleUpdateSpecHighlight(idx, 'value', e.target.value)}
                                placeholder="e.g. 12 / 7.4V 2500mAh"
                                className="w-full bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-2.5 py-1.5 text-gray-800 font-medium text-[12px] outline-none"
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecHighlight(idx)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Remove highlight"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. HEALTH BENEFITS */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          2. Health Benefits
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of clinical health benefits and biological improvements displayed inside the Health Benefits accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHealthBenefit}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>

                    {(!formData.healthBenefits || formData.healthBenefits.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No health benefits added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHealthBenefits}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default benefits
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.healthBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[#ED2024] font-black text-[14px] select-none pl-1">•</span>
                            <input
                              type="text"
                              value={benefit || ''}
                              onChange={(e) => handleUpdateHealthBenefit(idx, e.target.value)}
                              placeholder="e.g. Targeted cellular energy (ATP) stimulation for deep tissue recovery."
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHealthBenefit(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete benefit"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. THE 8 WAVELENGTHS (ACCORDION TITLE & CLINICAL DESCRIPTION) */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                        3. The Wavelengths (Title &amp; Clinical Description)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Customize the accordion header text (e.g. &ldquo;THE 8 WAVELENGTHS&rdquo;, &ldquo;THE WAVELENGTHS&rdquo;, &ldquo;THE 4 WAVELENGTHS&rdquo;) and the detailed spectral absorption description.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Accordion Header Title *
                        </label>
                        <input
                          type="text"
                          value={formData.the8WavelengthsTitle || 'THE 8 WAVELENGTHS'}
                          onChange={(e) => updateFormField('the8WavelengthsTitle', e.target.value.toUpperCase())}
                          placeholder="e.g. THE 8 WAVELENGTHS"
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] px-3 py-2 text-gray-900 text-[12.5px] font-bold uppercase outline-none shadow-xs"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Shown on the clickable accordion toggle bar.
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-700 mb-1.5">
                          Wavelengths Explanation Text *
                        </label>
                        <textarea
                          rows={3}
                          value={formData.wavelengthsDesc || ''}
                          onChange={(e) => updateFormField('wavelengthsDesc', e.target.value)}
                          placeholder="e.g. LUMA GO concentrates high-intensity 660nm red light with a focused 30° optical beam angle, maximizing photon absorption in the skin and superficial tissue layers for peak biological rejuvenation."
                          className="w-full bg-white border border-gray-300 focus:border-[#ED2024] rounded-[8px] p-2.5 text-gray-900 text-[12.5px] outline-none leading-relaxed shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. HOW TO USE */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          4. How To Use (Protocol Steps)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Numbered step-by-step treatment protocols displayed inside the How To Use accordion drawer.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddHowToUse}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>

                    {(!formData.howToUse || formData.howToUse.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No usage steps added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultHowToUse}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default steps
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.howToUse.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-[#ED2024] font-bold text-[11px] flex items-center justify-center shrink-0 select-none">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={step || ''}
                              onChange={(e) => handleUpdateHowToUse(idx, e.target.value)}
                              placeholder={`Step ${idx + 1} instructions...`}
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHowToUse(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete step"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. WHAT'S IN THE BOX */}
                  <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ED2024]" />
                          5. What&apos;s In The Box (Package Contents)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          List of hardware and accessories included inside the product package.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="px-2.5 py-1.5 rounded-[8px] bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleAddInTheBox}
                          className="px-3 py-1.5 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          + Add Box Item
                        </button>
                      </div>
                    </div>

                    {(!formData.inTheBox || formData.inTheBox.length === 0) ? (
                      <div className="p-4 text-center rounded-[8px] bg-white border border-dashed border-gray-300 text-gray-500 text-[12px]">
                        No package items added yet.{' '}
                        <button
                          type="button"
                          onClick={handleLoadDefaultInTheBox}
                          className="text-[#ED2024] font-bold hover:underline cursor-pointer"
                        >
                          Click here to populate default package contents
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.inTheBox.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-[8px] bg-white border border-gray-200 shadow-xs">
                            <span className="text-[14px] shrink-0 select-none">📦</span>
                            <input
                              type="text"
                              value={item || ''}
                              onChange={(e) => handleUpdateInTheBox(idx, e.target.value)}
                              placeholder="e.g. 1× LUMA Device"
                              className="flex-1 bg-gray-50 border border-gray-300 focus:border-[#ED2024] rounded-[6px] px-3 py-1.5 text-gray-900 text-[12px] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveInTheBox(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete package item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-3 bg-white">
                <span className="text-[11px] text-gray-500">
                  Changes save directly in real time.
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={saving}
                    className="px-4 py-2 rounded-[8px] bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-[12px] font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-[8px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[12px] font-bold uppercase tracking-[0.06em] shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION DIALOG ==================== */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-[18px] p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div className="text-center">
              <h3 className="text-gray-900 font-extrabold text-[18px] uppercase tracking-wide">
                Delete Product?
              </h3>
              <p className="text-gray-600 text-[13px] mt-1.5">
                Are you sure you want to permanently delete{' '}
                <span className="text-gray-900 font-bold">&ldquo;{productToDelete.name}&rdquo;</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
                className="py-2.5 px-4 rounded-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="py-2.5 px-4 rounded-[10px] bg-[#ED2024] hover:bg-[#d4191d] text-white text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

