import React, { useState, useRef, useEffect } from 'react';

const ENQUIRY_SUBJECTS = [
  'General Enquiry',
  'Product Support & Question',
  'Order & Delivery Status',
  'Partnership & Media',
  'Warranty & Replacement',
];

const API_BASE_URL = 'http://localhost:5000/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError('');
  };

  const handleSelectSubject = (item) => {
    setFormData((prev) => ({ ...prev, subject: item }));
    setIsDropdownOpen(false);
  };

  const handleReset = (e) => {
    if (e) e.preventDefault();
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'General Enquiry',
      message: '',
    });
    setSubmitted(false);
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validation
    if (!formData.firstName.trim()) {
      setSubmitError('Please enter your first name.');
      return;
    }
    if (!formData.email.trim()) {
      setSubmitError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setSubmitError('Please enter your message or enquiry details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          countryCode: '+971',
          phone: formData.phone.trim() ? `+971 ${formData.phone.trim()}` : '',
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit enquiry. Please try again.');
      }

      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'General Enquiry',
        message: '',
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
      setSubmitError(err.message || 'Could not send message. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact-form-section"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#FFFFFF] text-[#000000] font-['Manrope'] select-none pt-12 sm:pt-16 md:pt-20 lg:pt-[calc(167*var(--u))] pb-14 sm:pb-20 md:pb-24 lg:pb-[calc(168*var(--u))]"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0 lg:w-[calc(2804*var(--u))]">
        {/* Title: CONTACT */}
        {/* PSD: Manrope-ExtraBold, 59.3px at 3840w, tracking 20 (0.02em), color #D61611, centered, mb=127px */}
        <h2 className="text-[26px] sm:text-[34px] md:text-[42px] lg:text-[calc(59.3*var(--u))] font-extrabold text-[#D61611] tracking-[0.02em] uppercase text-center mb-8 sm:mb-12 md:mb-16 lg:mb-[calc(127*var(--u))] leading-none">
          CONTACT
        </h2>

        {submitted && (
          <div className="mb-6 sm:mb-8 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-center text-sm sm:text-base font-medium flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Thank you! Your enquiry has been received. Our team will contact you shortly.
          </div>
        )}

        {submitError && (
          <div className="mb-6 sm:mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center text-sm sm:text-base font-medium flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Row 1: FIRST NAME & LAST NAME */}
          {/* PSD: Labels: Manrope-Medium, 46.3px, color #000000, uppercase, mb=49px. Inputs: w=1366, h=169, border 4px #CECECE, r=20 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-[calc(72*var(--u))] mb-5 sm:mb-7 md:mb-8 lg:mb-[calc(107*var(--u))]">
            {/* FIRST NAME */}
            <div className="flex flex-col">
              <label
                htmlFor="firstName"
                className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(46.3*var(--u))] font-medium text-[#000000] uppercase tracking-normal mb-2 sm:mb-3 lg:mb-[calc(49*var(--u))] leading-none"
              >
                FIRST NAME
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder=""
                autoComplete="given-name"
                className="w-full h-[48px] sm:h-[54px] md:h-[60px] lg:h-[calc(169*var(--u))] px-4 sm:px-6 lg:px-[calc(52*var(--u))] rounded-[10px] lg:rounded-[calc(20*var(--u))] border border-[#CECECE] lg:border-[calc(4*var(--u))] bg-[#FFFFFF] text-[#000000] text-[14px] sm:text-[16px] lg:text-[calc(46*var(--u))] font-normal focus:outline-none focus:border-[#D61611] transition-colors"
              />
            </div>

            {/* LAST NAME */}
            <div className="flex flex-col">
              <label
                htmlFor="lastName"
                className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(46.3*var(--u))] font-medium text-[#000000] uppercase tracking-normal mb-2 sm:mb-3 lg:mb-[calc(49*var(--u))] leading-none"
              >
                LAST NAME
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder=""
                autoComplete="family-name"
                className="w-full h-[48px] sm:h-[54px] md:h-[60px] lg:h-[calc(169*var(--u))] px-4 sm:px-6 lg:px-[calc(52*var(--u))] rounded-[10px] lg:rounded-[calc(20*var(--u))] border border-[#CECECE] lg:border-[calc(4*var(--u))] bg-[#FFFFFF] text-[#000000] text-[14px] sm:text-[16px] lg:text-[calc(46*var(--u))] font-normal focus:outline-none focus:border-[#D61611] transition-colors"
              />
            </div>
          </div>

          {/* Row 2: EMAIL ID & PHONE NUMBER */}
          {/* PSD: mb=106px */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-[calc(72*var(--u))] mb-5 sm:mb-7 md:mb-8 lg:mb-[calc(106*var(--u))]">
            {/* EMAIL ID */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(46.3*var(--u))] font-medium text-[#000000] uppercase tracking-normal mb-2 sm:mb-3 lg:mb-[calc(49*var(--u))] leading-none"
              >
                EMAIL ID
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                autoComplete="email"
                className="w-full h-[48px] sm:h-[54px] md:h-[60px] lg:h-[calc(169*var(--u))] px-4 sm:px-6 lg:px-[calc(52*var(--u))] rounded-[10px] lg:rounded-[calc(20*var(--u))] border border-[#CECECE] lg:border-[calc(4*var(--u))] bg-[#FFFFFF] text-[#000000] text-[14px] sm:text-[16px] lg:text-[calc(46*var(--u))] font-normal focus:outline-none focus:border-[#D61611] transition-colors"
              />
            </div>

            {/* PHONE NUMBER */}
            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(46.3*var(--u))] font-medium text-[#000000] uppercase tracking-normal mb-2 sm:mb-3 lg:mb-[calc(49*var(--u))] leading-none"
              >
                PHONE NUMBER
              </label>
              {/* Phone container: +971 (w=326px), vertical line #CECECE (w=4px), and input field */}
              <div className="w-full h-[48px] sm:h-[54px] md:h-[60px] lg:h-[calc(169*var(--u))] rounded-[10px] lg:rounded-[calc(20*var(--u))] border border-[#CECECE] lg:border-[calc(4*var(--u))] bg-[#FFFFFF] flex items-center overflow-hidden focus-within:border-[#D61611] transition-colors">
                {/* Country Code: Inter-Medium 55.55px, color #A39D9D */}
                <div className="w-[80px] sm:w-[95px] lg:w-[calc(326*var(--u))] h-full shrink-0 flex items-center justify-center font-['Inter',_'Manrope',_sans-serif] font-medium text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(55.55*var(--u))] text-[#A39D9D] select-none">
                  +971
                </div>

                {/* Vertical Divider: Rectangle 32, w=4px, color #CECECE */}
                <div className="w-[1px] lg:w-[calc(4*var(--u))] h-full bg-[#CECECE] shrink-0" />

                {/* Phone number input */}
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="tel"
                  className="flex-1 h-full px-3 sm:px-5 lg:px-[calc(52*var(--u))] bg-transparent text-[#000000] text-[14px] sm:text-[16px] lg:text-[calc(46*var(--u))] font-normal focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 3: ENQUIRY SUBJECT */}
          {/* PSD: w=2804, h=169, border 4px #CECECE, r=20. Text: Manrope-Medium 50px, color #000000, chevron arrow on right */}
          <div className="w-full mb-5 sm:mb-7 md:mb-8 lg:mb-[calc(104*var(--u))]">
            <label
              id="enquiry-subject-label"
              className="block text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(46.3*var(--u))] font-medium text-[#000000] uppercase tracking-normal mb-2 sm:mb-3 lg:mb-[calc(49*var(--u))] leading-none"
            >
              ENQUIRY SUBJECT
            </label>

            <div ref={dropdownRef} className="relative w-full">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-labelledby="enquiry-subject-label"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full h-[48px] sm:h-[54px] md:h-[60px] lg:h-[calc(169*var(--u))] px-4 sm:px-6 lg:px-[calc(52*var(--u))] rounded-[10px] lg:rounded-[calc(20*var(--u))] border border-[#CECECE] lg:border-[calc(4*var(--u))] bg-[#FFFFFF] flex items-center justify-between text-left focus:outline-none focus:border-[#D61611] transition-colors cursor-pointer"
              >
                <span className="font-['Manrope'] font-medium text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(50*var(--u))] text-[#000000] uppercase tracking-normal">
                  {formData.subject}
                </span>

                {/* Dropdown Chevron Arrow: PSD Vector Smart Object w=59, h=36, color #CECECE */}
                <img
                  src="/assets/contact/dropdown-arrow.png"
                  alt=""
                  className={`w-3.5 sm:w-4 lg:w-[calc(59*var(--u))] h-auto transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Options Menu */}
              {isDropdownOpen && (
                <ul
                  role="listbox"
                  className="absolute top-[calc(100%+6px)] sm:top-[calc(100%+8px)] left-0 w-full bg-[#FFFFFF] border border-[#CECECE] lg:border-[calc(4*var(--u))] rounded-[10px] lg:rounded-[calc(20*var(--u))] shadow-xl py-2 z-30 overflow-hidden"
                >
                  {ENQUIRY_SUBJECTS.map((item) => (
                    <li
                      key={item}
                      role="option"
                      aria-selected={formData.subject === item}
                      onClick={() => handleSelectSubject(item)}
                      className={`px-4 sm:px-6 lg:px-[calc(52*var(--u))] py-2.5 sm:py-3 lg:py-[calc(24*var(--u))] text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(44*var(--u))] font-['Manrope'] font-medium uppercase tracking-normal transition-colors cursor-pointer ${
                        formData.subject === item
                          ? 'bg-[#D61611]/10 text-[#D61611] font-semibold'
                          : 'text-[#000000] hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Row 4: YOUR MESSAGE */}
          {/* PSD: w=2804, h=360, border 4px #CECECE, r=20, mb=89px */}
          <div className="w-full mb-6 sm:mb-8 md:mb-10 lg:mb-[calc(89*var(--u))]">
            <label
              htmlFor="message"
              className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[calc(46.3*var(--u))] font-medium text-[#000000] uppercase tracking-normal mb-2 sm:mb-3 lg:mb-[calc(49*var(--u))] leading-none block"
            >
              YOUR MESSAGE
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder=""
              className="w-full h-[120px] sm:h-[150px] md:h-[180px] lg:h-[calc(360*var(--u))] p-4 sm:p-6 lg:p-[calc(52*var(--u))] rounded-[10px] lg:rounded-[calc(20*var(--u))] border border-[#CECECE] lg:border-[calc(4*var(--u))] bg-[#FFFFFF] text-[#000000] text-[14px] sm:text-[16px] lg:text-[calc(46*var(--u))] font-normal focus:outline-none focus:border-[#D61611] transition-colors resize-none"
            />
          </div>

          {/* Row 5: Action Buttons (Reset & Submit) */}
          {/* PSD: Right-aligned. Reset: w=438, h=169, r=84.5 (pill), fill #ABABAB, text Inter-SemiBold 55.55px #FFFFFF */}
          {/* PSD: Submit: w=438, h=169, r=84.5 (pill), fill #D61611, text Inter-SemiBold 55.55px #FFFFFF. Gap=19px */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 lg:gap-[calc(19*var(--u))]">
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="w-[110px] sm:w-[130px] md:w-[150px] lg:w-[calc(438*var(--u))] h-[46px] sm:h-[52px] md:h-[58px] lg:h-[calc(169*var(--u))] rounded-full bg-[#ABABAB] hover:bg-[#969696] active:scale-[0.98] transition-all text-[#FFFFFF] font-['Inter',_'Manrope',_sans-serif] font-semibold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[calc(55.55*var(--u))] flex items-center justify-center cursor-pointer select-none leading-none shadow-sm"
            >
              Reset
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-[110px] sm:w-[130px] md:w-[150px] lg:w-[calc(438*var(--u))] h-[46px] sm:h-[52px] md:h-[58px] lg:h-[calc(169*var(--u))] rounded-full bg-[#D61611] hover:bg-[#b8120e] active:scale-[0.98] transition-all text-[#FFFFFF] font-['Inter',_'Manrope',_sans-serif] font-semibold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[calc(55.55*var(--u))] flex items-center justify-center cursor-pointer select-none leading-none shadow-md ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

