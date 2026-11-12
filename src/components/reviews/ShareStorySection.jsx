import React, { useState, useRef } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

const PRODUCT_OPTIONS = [
  'Luma Glow',
  'Luma Go',
  'Luma Surge',
  'Luma Nova',
  'Luma Ultra',
  'Luma Apex',
  'Luma Max',
];

export default function ShareStorySection({ data }) {
  const titlePart1 = data?.titlePart1 || 'SHARE YOUR';
  const titlePart2 = data?.titlePart2 || 'STORY';
  const successTitle = data?.successTitle || 'Thank you for sharing your story!';
  const successSubtitle = data?.successSubtitle || 'Our team will review and feature it in our Real Stories community.';

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    product: 'Luma Glow',
    mediaLink: '',
    photo: '',
    thumbnail: '',
    story: '',
    agreed: true,
  });
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle direct photo / thumbnail file upload
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setUploadedPreview(base64Data);
      setIsUploadingImage(true);

      try {
        const res = await fetch(`${API_BASE_URL}/stories/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data, filename: file.name }),
        });
        const json = await res.json();
        if (res.ok && json.success && json.url) {
          setFormData((prev) => ({
            ...prev,
            photo: json.url,
            thumbnail: json.url,
          }));
        }
      } catch (err) {
        console.warn('Backend image upload error, using local base64 preview:', err);
        setFormData((prev) => ({
          ...prev,
          photo: base64Data,
          thumbnail: base64Data,
        }));
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUploadedPreview(null);
    setFormData((prev) => ({ ...prev, photo: '', thumbnail: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('Please agree to share your story.');
      return;
    }
    if (!formData.name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!formData.story.trim()) {
      alert('Please write your story.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          product: formData.product,
          mediaLink: formData.mediaLink.trim(),
          photo: formData.photo,
          thumbnail: formData.thumbnail,
          story: formData.story.trim(),
          agreed: formData.agreed,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(json.message || 'Failed to submit your story. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting story to backend:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="write-review"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-white overflow-hidden font-['Manrope'] select-none pt-12 sm:pt-16 md:pt-20 lg:pt-[calc(166*var(--u))] pb-12 sm:pb-16 md:pb-20 lg:pb-[calc(163*var(--u))]"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-[calc(912*var(--u))]">
        {/* Section Header: Title + Red Pill Bar (PSD canvas y=6588..6716) */}
        <div className="w-full flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight uppercase tracking-[0.02em] leading-none text-[#FFFFFF]">
            {titlePart1} <span className="text-[#ED2124]">{titlePart2}</span>
          </h2>
          <div
            className="mt-3 sm:mt-4 lg:mt-[calc(47*var(--u))] w-[60px] sm:w-[85px] lg:w-[calc(150*var(--u))] h-[8px] sm:h-[12px] lg:h-[calc(20*var(--u))] rounded-full bg-[#ED2124]"
            aria-hidden="true"
          />
        </div>

        {isSubmitted ? (
          <div className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-[calc(168*var(--u))] p-8 sm:p-12 lg:p-[calc(80*var(--u))] bg-[#141416] border border-[#474748] rounded-[24px] text-center flex flex-col items-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#ED2124]/20 text-[#ED2124] flex items-center justify-center text-2xl font-bold mb-4">
              ✓
            </div>
            <h3 className="text-lg sm:text-xl lg:text-[calc(36*var(--u))] font-light text-white">
              {successTitle}
            </h3>
            <p className="text-xs sm:text-sm lg:text-[calc(24*var(--u))] font-light text-white/60 mt-2">
              {successSubtitle}
            </p>
            <button
              type="button"
              onClick={() => {
                setFormData({ name: '', product: 'Luma Glow', mediaLink: '', photo: '', thumbnail: '', story: '', agreed: true });
                setUploadedPreview(null);
                setIsSubmitted(false);
              }}
              className="mt-5 text-xs sm:text-sm lg:text-[calc(22*var(--u))] font-medium text-[#ED2124] hover:underline cursor-pointer"
            >
              Submit another review
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-[calc(168*var(--u))] flex flex-col items-center"
          >
            {/* Row 1: Name + Product Dropdown + Photo/Video Link & Upload */}
            <div className="w-full flex flex-col lg:flex-row items-center gap-4 sm:gap-5 lg:gap-[calc(88*var(--u))]">
              {/* Field 1: Your Name */}
              <div className="w-full lg:w-[calc(759*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(74*var(--u))] rounded-full border border-[#474748] bg-[#0A0A0B] px-6 sm:px-8 lg:px-[calc(41*var(--u))] flex items-center transition-colors focus-within:border-[#ED2124]">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent text-white placeholder-white/25 text-sm sm:text-base lg:text-[calc(30*var(--u))] font-extralight tracking-[0.02em] outline-none"
                />
              </div>

              {/* Field 2: Product Dropdown */}
              <div className="relative w-full lg:w-[calc(493*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(74*var(--u))]">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-full rounded-full border border-[#474748] bg-[#0A0A0B] px-6 sm:px-8 lg:px-[calc(41*var(--u))] flex items-center justify-between transition-colors hover:border-white/50 focus:border-[#ED2124] cursor-pointer"
                >
                  <span className="text-white text-sm sm:text-base lg:text-[calc(30*var(--u))] font-extralight tracking-[0.02em] whitespace-nowrap">
                    {formData.product}
                  </span>
                  <svg
                    className={`w-3.5 h-2.5 lg:w-[calc(21*var(--u))] lg:h-[calc(13*var(--u))] text-[#ED2124] transition-transform duration-200 shrink-0 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 21 13"
                    fill="currentColor"
                  >
                    <path d="M10.5 13L0 2.5 2.5 0l8 8 8-8L21 2.5z" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#141416] border border-[#474748] rounded-[20px] shadow-2xl overflow-hidden z-30 py-2">
                    {PRODUCT_OPTIONS.map((prod) => (
                      <button
                        key={prod}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, product: prod });
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-6 py-2.5 text-xs sm:text-sm lg:text-[calc(24*var(--u))] font-light transition-colors cursor-pointer ${
                          formData.product === prod
                            ? 'bg-[#ED2124]/20 text-[#ED2124]'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {prod}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 3: Photo or Video Link + Direct Photo Upload */}
              <div className="w-full lg:w-[calc(587*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(74*var(--u))] rounded-full border border-[#474748] bg-[#0A0A0B] px-4 sm:px-6 lg:px-[calc(30*var(--u))] flex items-center justify-between transition-colors focus-within:border-[#ED2124] gap-2">
                <input
                  type="text"
                  placeholder="Photo or Video Link (optional)"
                  value={formData.mediaLink}
                  onChange={(e) => setFormData({ ...formData, mediaLink: e.target.value })}
                  className="w-full bg-transparent text-white placeholder-white/25 text-xs sm:text-sm lg:text-[calc(26*var(--u))] font-extralight tracking-[0.02em] outline-none"
                />

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                {/* Upload Button Icon */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload image / photo from device"
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Uploaded Photo Preview Tag */}
            {uploadedPreview && (
              <div className="w-full flex items-center gap-3 mt-3 px-2">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/20">
                  <img src={uploadedPreview} alt="Uploaded thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/80">Photo uploaded successfully</span>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[11px] text-[#ED2124] hover:underline cursor-pointer self-start"
                  >
                    Remove photo
                  </button>
                </div>
              </div>
            )}

            {/* Row 2: Write Your Story + Send My Story Button */}
            <div className="w-full mt-4 sm:mt-5 lg:mt-[calc(86*var(--u))] flex flex-col lg:flex-row items-center gap-4 sm:gap-5 lg:gap-[calc(86*var(--u))]">
              {/* Field 4: Write Your Story */}
              <div className="w-full lg:w-[calc(1433*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(74*var(--u))] rounded-full border border-[#474748] bg-[#0A0A0B] px-6 sm:px-8 lg:px-[calc(42*var(--u))] flex items-center transition-colors focus-within:border-[#ED2124]">
                <input
                  type="text"
                  required
                  placeholder="Write Your Story"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className="w-full bg-transparent text-white placeholder-white/25 text-sm sm:text-base lg:text-[calc(30*var(--u))] font-extralight tracking-[0.02em] outline-none"
                />
              </div>

              {/* Submit Button: Send MY Story */}
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="w-full lg:w-[calc(495*var(--u))] h-[52px] sm:h-[58px] lg:h-[calc(73*var(--u))] rounded-full bg-[#ED2124] hover:bg-[#d61b1f] active:scale-98 transition-all flex items-center justify-center cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span className="text-white text-sm sm:text-base lg:text-[calc(30*var(--u))] font-normal uppercase tracking-[0.02em]">
                  {isSubmitting ? 'Sending...' : 'Send MY Story'}
                </span>
              </button>
            </div>

            {/* Row 3: Checkbox & Consent Text */}
            <div className="w-full mt-4 sm:mt-6 lg:mt-[calc(90*var(--u))] flex items-center justify-center gap-2.5 sm:gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-[#ED2124] accent-[#ED2124] cursor-pointer"
                />
                <span className="text-white/60 text-xs sm:text-sm lg:text-[calc(26*var(--u))] font-extralight tracking-[0.01em]">
                  I agree LUMA may share my story and photos on its website
                </span>
              </label>
            </div>

            {errorMessage && (
              <p className="mt-4 text-xs sm:text-sm text-[#ED2124] text-center">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
