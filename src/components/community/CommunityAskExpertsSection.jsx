import React, { useState } from 'react';

const topics = ['Skin', 'Sleep', 'Recovery', 'Beginners', 'General'];

const qaItems = [
  {
    id: 1,
    question: 'How often should a beginner use red light?',
    answer:
      'Many people start with a few short sessions a week and build up gradually. Consistency matters more than long sessions. Follow the device guidance.',
    meta: 'Ollie Rhoda · Sleep and routine · 12 people found this helpful',
  },
  {
    id: 2,
    question: 'How often should a beginner use red light?',
    answer:
      'Many people start with a few short sessions a week and build up gradually. Consistency matters more than long sessions. Follow the device guidance.',
    meta: 'Ollie Rhoda · Sleep and routine · 12 people found this helpful',
  },
  {
    id: 3,
    question: 'How often should a beginner use red light?',
    answer:
      'Many people start with a few short sessions a week and build up gradually. Consistency matters more than long sessions. Follow the device guidance.',
    meta: 'Ollie Rhoda · Sleep and routine · 12 people found this helpful',
  },
  {
    id: 4,
    question: 'How often should a beginner use red light?',
    answer:
      'Many people start with a few short sessions a week and build up gradually. Consistency matters more than long sessions. Follow the device guidance.',
    meta: 'Ollie Rhoda · Sleep and routine · 12 people found this helpful',
  },
];

export default function CommunityAskExpertsSection() {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('Skin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setQuestion('');
      setName('');
      setEmail('');
      setAgree(false);
    }
  };

  return (
    <section
      id="ask-our-experts"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pt-16 sm:pt-20 md:pt-24 lg:pt-[calc(170*var(--u))] pb-16 sm:pb-20 md:pb-24 lg:pb-[calc(170*var(--u))] overflow-hidden font-['Manrope']"
    >
      {/* Container aligned to PSD x=523..3320 (2797px span at 3840w canvas) */}
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0 lg:pl-[calc(523*var(--u))] lg:pr-[calc(520*var(--u))]">
        {/* Section Heading & Subheading (PSD y=5506..5696) */}
        <div className="flex flex-col items-start w-full">
          {/* Main Title: "ASK OUR EXPERTS" (PSD x=517..1191, y=5506..5567, 80px font at 3840w, Manrope-Medium, #000000, tracking 20 / 0.02em, uppercase) */}
          <h2 className="text-[24px] sm:text-[30px] md:text-[36px] lg:text-[calc(80*var(--u))] font-medium tracking-[0.02em] uppercase text-[#000000] leading-none lg:-ml-[calc(6*var(--u))]">
            ASK OUR EXPERTS
          </h2>

          {/* Subheading: "Send your question. A qualified professional reviews and answers it before it appears here." (PSD y=5608..5696, 40px at 3840w, Manrope-Light, #333333, tracking 20 / 0.02em) */}
          <p className="mt-3 sm:mt-4 lg:mt-[calc(41*var(--u))] text-[12px] sm:text-[14px] md:text-[15px] lg:text-[calc(40*var(--u))] font-light tracking-[0.02em] text-[#333333] leading-snug lg:leading-[1.25] max-w-[95%] lg:max-w-[calc(1400*var(--u))]">
            Send your question. A qualified professional
            <br className="hidden sm:inline" />
            reviews and answers it before it appears here.
          </p>
        </div>

        {/* Two-Column Grid: Left Dark Form Card (1357px) + Right Recently Answered List (PSD y=5760..7498) */}
        <div className="mt-10 sm:mt-14 md:mt-16 lg:mt-[calc(64*var(--u))] flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-[calc(203*var(--u))] w-full">
          {/* Left Column: Dark Form Card (PSD Rectangle 52: 1357x1738px, r=60px, fill #121212) */}
          <div className="w-full lg:w-[calc(1357*var(--u))] rounded-[24px] sm:rounded-[36px] lg:rounded-[calc(60*var(--u))] bg-[#121212] text-[#FFFFFF] p-6 sm:p-10 md:p-12 lg:p-[calc(107*var(--u))] flex flex-col justify-start shadow-xl shrink-0">
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 sm:gap-7 lg:gap-[calc(48*var(--u))]">
              {/* Field 1: Your question */}
              <div className="flex flex-col gap-2.5 sm:gap-3 lg:gap-[calc(20*var(--u))] w-full">
                <label className="text-[13px] sm:text-[15px] lg:text-[calc(36*var(--u))] font-light tracking-[0.02em] text-[#FFFFFF]">
                  Your question
                </label>
                <textarea
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="For example: how often i use red light?"
                  required
                  className="w-full h-[120px] sm:h-[150px] lg:h-[calc(250*var(--u))] rounded-[16px] sm:rounded-[20px] lg:rounded-[calc(30*var(--u))] bg-[#F4F4F4] text-[#000000] p-4 sm:p-5 lg:p-[calc(32*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(36*var(--u))] font-light tracking-[0.02em] placeholder:text-[#888888] outline-none resize-none transition-shadow focus:ring-2 focus:ring-[#ED2024]"
                />
              </div>

              {/* Field 2: Topic */}
              <div className="flex flex-col gap-2.5 sm:gap-3 lg:gap-[calc(20*var(--u))] w-full">
                <label className="text-[13px] sm:text-[15px] lg:text-[calc(36*var(--u))] font-light tracking-[0.02em] text-[#FFFFFF]">
                  Topic
                </label>
                <div className="relative w-full">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-[48px] sm:h-[56px] lg:h-[calc(106*var(--u))] rounded-[16px] sm:rounded-[20px] lg:rounded-[calc(30*var(--u))] bg-[#F4F4F4] text-[#000000] px-4 sm:px-5 lg:px-[calc(32*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(36*var(--u))] font-light tracking-[0.02em] outline-none cursor-pointer appearance-none transition-shadow focus:ring-2 focus:ring-[#ED2024]"
                  >
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {/* Dropdown Chevron Icon matching Vector Smart Object copy 3 */}
                  <div className="absolute right-4 sm:right-5 lg:right-[calc(32*var(--u))] top-1/2 -translate-y-1/2 pointer-events-none text-[#666666]">
                    <svg
                      className="w-3.5 h-2 lg:w-[calc(26*var(--u))] lg:h-[calc(16*var(--u))]"
                      viewBox="0 0 26 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2L13 13L24 2"
                        stroke="#666666"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 3: Name (optional) */}
              <div className="flex flex-col gap-2.5 sm:gap-3 lg:gap-[calc(20*var(--u))] w-full">
                <label className="text-[13px] sm:text-[15px] lg:text-[calc(36*var(--u))] font-light tracking-[0.02em] text-[#FFFFFF]">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="eg: John"
                  className="w-full h-[48px] sm:h-[56px] lg:h-[calc(106*var(--u))] rounded-[16px] sm:rounded-[20px] lg:rounded-[calc(30*var(--u))] bg-[#F4F4F4] text-[#000000] px-4 sm:px-5 lg:px-[calc(32*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(36*var(--u))] font-light tracking-[0.02em] placeholder:text-[#888888] outline-none transition-shadow focus:ring-2 focus:ring-[#ED2024]"
                />
              </div>

              {/* Field 4: Email for the answer */}
              <div className="flex flex-col gap-2.5 sm:gap-3 lg:gap-[calc(20*var(--u))] w-full">
                <label className="text-[13px] sm:text-[15px] lg:text-[calc(36*var(--u))] font-light tracking-[0.02em] text-[#FFFFFF]">
                  Email for the answer
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full h-[48px] sm:h-[56px] lg:h-[calc(106*var(--u))] rounded-[16px] sm:rounded-[20px] lg:rounded-[calc(30*var(--u))] bg-[#F4F4F4] text-[#000000] px-4 sm:px-5 lg:px-[calc(32*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(36*var(--u))] font-light tracking-[0.02em] placeholder:text-[#888888] outline-none transition-shadow focus:ring-2 focus:ring-[#ED2024]"
                />
              </div>

              {/* Field 5: Consent Checkbox (Rectangle 54) */}
              <div className="flex items-start gap-3.5 sm:gap-4 lg:gap-[calc(26*var(--u))] pt-2 lg:pt-[calc(12*var(--u))]">
                <button
                  type="button"
                  onClick={() => setAgree(!agree)}
                  className={`w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[calc(51*var(--u))] lg:h-[calc(54*var(--u))] rounded-[5px] lg:rounded-[calc(12*var(--u))] flex items-center justify-center shrink-0 transition-colors border ${
                    agree
                      ? 'bg-[#ED2024] border-[#ED2024]'
                      : 'bg-[#333333] border-[#555555] hover:border-[#777777]'
                  }`}
                >
                  {agree && (
                    <svg
                      className="w-3 h-3 lg:w-[calc(26*var(--u))] lg:h-[calc(26*var(--u))] text-[#FFFFFF]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span
                  onClick={() => setAgree(!agree)}
                  className="text-[11px] sm:text-[13px] lg:text-[calc(32*var(--u))] font-light tracking-[0.02em] text-[#FFFFFF]/90 leading-snug lg:leading-[1.3] cursor-pointer select-none"
                >
                  I agree to share my question for a public answer without personal details.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 lg:pt-[calc(16*var(--u))]">
                <button
                  type="submit"
                  className="w-full h-[48px] sm:h-[54px] lg:h-[calc(80*var(--u))] lg:min-h-[52px] rounded-full bg-[#ED2024] hover:bg-[#c9181b] text-[#FFFFFF] text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] inline-flex items-center justify-center text-center leading-none transition-colors duration-200 cursor-pointer"
                >
                  {submitted ? 'QUESTION SUBMITTED ✓' : 'SEND QUESTION'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: RECENTLY ANSWERED (PSD x=2083..3320) */}
          <div className="w-full flex flex-col items-start">
            {/* Header: "RECENTLY ANSWERED" (PSD x=2110..2543, y=5785..5816, 40px at 3840w, Manrope-Bold, uppercase) */}
            <h3 className="text-[18px] sm:text-[22px] md:text-[26px] lg:text-[calc(40*var(--u))] font-bold tracking-[0.02em] uppercase text-[#000000] leading-none mb-6 sm:mb-8 lg:mb-[calc(40*var(--u))]">
              RECENTLY ANSWERED
            </h3>

            {/* 4 Recently Answered Cards List */}
            <div className="w-full flex flex-col gap-5 sm:gap-6 lg:gap-[calc(32*var(--u))]">
              {qaItems.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex items-stretch gap-3 sm:gap-4 lg:gap-[calc(23*var(--u))] group"
                >
                  {/* Left Red Accent Line (PSD Rectangle 55: w=6px, fill #ED2024, rounded-full) */}
                  <div className="w-[4px] lg:w-[calc(6*var(--u))] rounded-full bg-[#ED2024] shrink-0" />

                  {/* Gray Card Bubble (PSD Rectangle 56: fill #F4F2F3, rounded-2xl to 40px at 3840w) */}
                  <div className="flex-1 bg-[#F4F2F3] hover:bg-[#eeeeee] rounded-[18px] sm:rounded-[22px] lg:rounded-[calc(40*var(--u))] p-5 sm:p-6 lg:px-[calc(48*var(--u))] lg:py-[calc(38*var(--u))] flex flex-col justify-between transition-colors">
                    {/* Question */}
                    <h4 className="text-[13px] sm:text-[15px] md:text-[17px] lg:text-[calc(40*var(--u))] font-medium text-[#000000] tracking-[0.01em] leading-snug lg:leading-[1.25]">
                      {item.question}
                    </h4>

                    {/* Answer */}
                    <p className="mt-2.5 sm:mt-3 lg:mt-[calc(18*var(--u))] text-[11px] sm:text-[13px] md:text-[14px] lg:text-[calc(30*var(--u))] font-light text-[#333333] tracking-[0.01em] leading-relaxed lg:leading-[calc(42*var(--u))]">
                      {item.answer}
                    </p>

                    {/* Meta */}
                    <p className="mt-3 sm:mt-3.5 lg:mt-[calc(22*var(--u))] text-[10px] sm:text-[12px] lg:text-[calc(30*var(--u))] font-medium text-[#666666] tracking-[0.01em] leading-none">
                      {item.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

