import React, { useState, useEffect } from 'react';

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    title: 'Question 1 of 5',
    question: 'What do you want light to do for you?',
    options: [
      {
        title: 'Recover faster',
        subtitle: 'After training, soreness, long days',
      },
      {
        title: 'Glow',
        subtitle: 'Skin tone, texture, fine lines',
      },
      {
        title: 'Calm & sleep',
        subtitle: 'A slower evening, deeper rest',
      },
      {
        title: 'Ease aches',
        subtitle: 'Joints, back and tension',
      },
    ],
  },
  {
    id: 2,
    title: 'Question 2 of 5',
    question: 'Where will it live?',
    options: [
      {
        title: 'Bedroom or desk',
        subtitle: 'Compact, easy to tuck away',
      },
      {
        title: 'Home gym',
        subtitle: 'Beside the mat or the rack',
      },
      {
        title: 'Dedicated wellness room',
        subtitle: 'Space to stand and stay',
      },
      {
        title: 'A studio or clinic',
        subtitle: 'Shared, daily, professional',
      },
    ],
  },
  {
    id: 3,
    title: 'Question 3 of 5',
    question: 'How much of you needs the light?',
    options: [
      {
        title: 'Face & targeted spots',
        subtitle: 'Precise, close-up',
      },
      {
        title: 'Upper body',
        subtitle: 'Face, neck, shoulders, chest',
      },
      {
        title: 'Head to toe',
        subtitle: 'Full-body, in one session',
      },
    ],
  },
  {
    id: 4,
    title: 'Question 4 of 5',
    question: 'What does your ritual look like?',
    options: [
      {
        title: 'Quick and daily',
        subtitle: 'Ten minutes, no fuss',
      },
      {
        title: 'A proper pause',
        subtitle: 'Fifteen to twenty unhurried minutes',
      },
      {
        title: 'Shared',
        subtitle: 'Family, clients or guests',
      },
    ],
  },
  {
    id: 5,
    title: 'Question 5 of 5',
    question: 'How do you invest in wellbeing?',
    options: [
      {
        title: 'Start simple',
        subtitle: 'Essential, well made',
      },
      {
        title: 'Balanced',
        subtitle: 'Performance and value',
      },
      {
        title: 'No compromise',
        subtitle: 'The full experience',
      },
    ],
  },
];

const DEFAULT_RESULT = {
  matchTag: 'YOUR MATCH',
  brand: 'LUMA',
  model: 'Surge',
  productSlug: 'luma-surge',
  productImage: '/assets/products/luma-surge.png',
  headline: 'Balanced power for the body in motion.',
  summary: 'You want real performance without the full commitment of space.',
  features: [
    {
      bold: 'Faster recovery.',
      rest: ' Broader coverage to support muscles after effort.',
    },
    {
      bold: 'Calmer evenings.',
      rest: ' Wind down with warm, restorative light.',
    },
    {
      bold: 'Everyday versatility.',
      rest: ' Face and upper body in one graceful session.',
    },
  ],
  ctaText: 'EXPLORE SURGE',
  ctaLink: '#products',
};

const renderHeading = (text) => {
  if (!text) {
    return (
      <>
        <span className="text-[#FFFFFF]">FIND THE </span>
        <span className="text-[#ED2024]">LIGHT</span>
        <span className="text-[#FFFFFF]"> THAT </span>
        <span className="text-[#ED2024]">FITS YOU</span>
      </>
    );
  }
  if (text.includes('<')) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }
  const parts = text.split(/(LIGHT|FITS YOU)/gi);
  return (
    <>
      {parts.map((part, i) => {
        const isRed = /^(LIGHT|FITS YOU)$/i.test(part);
        return (
          <span key={i} className={isRed ? 'text-[#ED2024]' : 'text-[#FFFFFF]'}>
            {part}
          </span>
        );
      })}
    </>
  );
};

export default function AssessmentQuiz({ data }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4 = questions, 5 = results
  const [answers, setAnswers] = useState({ 0: 0 });
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmailSaved, setGuestEmailSaved] = useState(false);
  const [submittingGuest, setSubmittingGuest] = useState(false);

  const activeQuestions =
    data?.questions && Array.isArray(data.questions) && data.questions.length > 0
      ? data.questions
      : DEFAULT_QUESTIONS;

  const matchData = {
    ...DEFAULT_RESULT,
    ...(data?.resultMatch || {}),
  };

  const handleSelectOption = (index) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: index }));
  };

  // Auto-submit answers to backend when reaching step 5 (results)
  const submitToBackend = async (finalAnswers, customEmail = null, customName = null) => {
    try {
      let loggedUser = null;
      try {
        const storedCustomer = localStorage.getItem('customer_user');
        if (storedCustomer) loggedUser = JSON.parse(storedCustomer);
        else {
          const lumaUser = localStorage.getItem('luma_user');
          if (lumaUser) loggedUser = JSON.parse(lumaUser);
        }
      } catch (e) {
        // ignore JSON parse issue
      }

      const formattedAnswers = activeQuestions.map((q, idx) => {
        const selectedIdx = finalAnswers[idx] !== undefined ? finalAnswers[idx] : 0;
        const opt = q.options && q.options[selectedIdx] ? q.options[selectedIdx] : {};
        return {
          questionId: q.id || idx + 1,
          questionTitle: q.title || `Question ${idx + 1} of ${activeQuestions.length}`,
          questionText: q.question || '',
          selectedOptionTitle: opt.title || '',
          selectedOptionSubtitle: opt.subtitle || '',
          selectedOptionIndex: selectedIdx,
        };
      });

      const matchedProd = {
        name: `${matchData.brand || 'LUMA'} ${matchData.model || 'Surge'}`.trim(),
        slug: matchData.productSlug || 'luma-surge',
        headline: matchData.headline || 'Balanced power for the body in motion.',
      };

      const finalUserName =
        (customName || '').trim() ||
        (loggedUser?.name
          ? loggedUser.name
          : loggedUser?.firstName
          ? `${loggedUser.firstName} ${loggedUser.lastName || ''}`.trim()
          : 'Guest User');

      const finalUserEmail = (customEmail || loggedUser?.email || '').trim().toLowerCase();
      const finalUserPhone = (loggedUser?.phone || '').trim();

      const payload = {
        userId: loggedUser?._id || loggedUser?.id || null,
        userName: finalUserName,
        userEmail: finalUserEmail,
        userPhone: finalUserPhone,
        isGuest: !loggedUser && !finalUserEmail,
        answers: formattedAnswers,
        recommendedProduct: matchedProd,
      };

      await fetch('http://localhost:5000/api/quiz-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setHasSubmitted(true);
    } catch (err) {
      console.warn('Unable to record quiz assessment:', err);
    }
  };

  const handleNext = () => {
    setHoveredIdx(null);
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(activeQuestions.length); // Show result screen (Step N)
      if (!hasSubmitted) {
        submitToBackend(answers);
      }
    }
  };

  const handlePrev = () => {
    setHoveredIdx(null);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setHoveredIdx(null);
    setAnswers({ 0: 0 });
    setCurrentStep(0);
    setHasSubmitted(false);
    setGuestEmailSaved(false);
  };

  const handleSaveGuestContact = async (e) => {
    e.preventDefault();
    if (!guestEmail.trim()) return;
    setSubmittingGuest(true);
    await submitToBackend(answers, guestEmail, guestName);
    setSubmittingGuest(false);
    setGuestEmailSaved(true);
  };

  const currentQ = activeQuestions[currentStep] || activeQuestions[0];
  const activeOptionIdx =
    hoveredIdx !== null ? hoveredIdx : answers[currentStep];

  return (
    <section
      id="assessment-quiz"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#0A0A0B] text-white py-16 lg:pt-[calc(167*var(--u))] lg:pb-[calc(147*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="relative z-10 w-full max-w-[1400px] lg:max-w-none mx-auto px-6 lg:px-0">
        {/* Section Header (PSD Group 26: y=10905..11145 on 3840w canvas) */}
        <div className="text-center mx-auto">
          {/* 'THE LUMA 1-MINUTE ASSESSMENT': Manrope-Medium (500), 40px at 3840w, tracking 20 (0.02em), #FFFFFF */}
          <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] uppercase tracking-[0.02em] font-medium text-[#FFFFFF] leading-none">
            {data?.eyebrow || 'THE LUMA 1-MINUTE ASSESSMENT'}
          </p>

          {/* 'FIND THE LIGHT THAT FITS YOU': Manrope-ExtraLight (200), 80px at 3840w, tracking 20 (0.02em), #FFFFFF & #ED2024, gap 47px */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight tracking-[0.02em] uppercase leading-none mt-3 lg:mt-[calc(47*var(--u))]">
            {renderHeading(data?.heading)}
          </h2>

          {/* Subtitle: Manrope-Regular (400), 30px at 3840w, tracking 20 (0.02em), #555555, gap 71px */}
          <p className="text-[#555555] text-xs sm:text-sm lg:text-[calc(30*var(--u))] leading-relaxed lg:leading-none font-normal tracking-[0.02em] mt-4 lg:mt-[calc(71*var(--u))]">
            {data?.subtitle || `${activeQuestions.length} questions. One panel, matched to your body, your space and your ritual.`}
          </p>
        </div>

        {/* Step Content matching PSD Group 26 Rectangle 53 copy (x=1171..2670, w=1500, y=11256..12662, gap 111px) */}
        {currentStep < activeQuestions.length ? (
          <div className="max-w-2xl lg:max-w-none lg:w-[calc(1500*var(--u))] mx-auto mt-10 lg:mt-[calc(111*var(--u))] bg-[#000000] border lg:border-[calc(2*var(--u))] border-[#555555] rounded-[24px] lg:rounded-[calc(60*var(--u))] px-6 sm:px-10 lg:px-[calc(50*var(--u))] pt-8 sm:pt-10 lg:pt-[calc(80*var(--u))] pb-8 sm:pb-10 lg:pb-[calc(79*var(--u))]">
            {/* Discrete 5-Bar Progress Indicator matching PSD Group 26 Nav (Rectangle 54, x=1221..2621, y=11336..11341, h=5px) */}
            <div
              className="grid gap-2.5 sm:gap-3.5 lg:gap-[calc(18.4*var(--u))]"
              style={{
                gridTemplateColumns: `repeat(${activeQuestions.length}, minmax(0, 1fr))`,
              }}
            >
              {activeQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 lg:h-[calc(5*var(--u))] rounded-full transition-colors duration-300 ${
                    i <= currentStep ? 'bg-[#ED2024]' : 'bg-[#555555]'
                  }`}
                />
              ))}
            </div>

            {/* Question Header Centered matching PSD (y=11432..11565) */}
            <div className="text-center mt-7 lg:mt-[calc(91*var(--u))]">
              {/* 'QUESTION 1 OF 5': Manrope-Regular (400), 30px at 3840w, tracking 100 (0.1em), #555555 */}
              <span className="text-xs sm:text-sm lg:text-[calc(30*var(--u))] uppercase tracking-[0.1em] font-normal text-[#555555] block leading-none lg:whitespace-pre">
                {currentQ.title || `QUESTION  ${currentStep + 1}  OF  ${activeQuestions.length}`}
              </span>

              {/* Question Title: Manrope-ExtraLight (200), 60px at 3840w, tracking 20 (0.02em), #FFFFFF, gap 50px */}
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[calc(60*var(--u))] font-extralight text-[#FFFFFF] tracking-[0.02em] leading-snug lg:leading-none mt-3 lg:mt-[calc(50*var(--u))]">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List matching PSD Subgroup 1..5 (x=1221..2621, w=1400, h=189 each, gap 33px, top offset 89px) */}
            <div
              className="flex flex-col gap-3.5 lg:gap-[calc(33*var(--u))] mt-7 lg:mt-[calc(89*var(--u))]"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {currentQ.options?.map((option, idx) => {
                const isHighlighted = activeOptionIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left px-5 sm:px-6 lg:px-[calc(57*var(--u))] py-4 sm:py-5 lg:py-0 lg:h-[calc(189*var(--u))] rounded-[12px] lg:rounded-[calc(20*var(--u))] bg-[#000000] border lg:border-[calc(2*var(--u))] transition-all duration-200 cursor-pointer flex flex-col justify-center ${
                      isHighlighted
                        ? 'border-[#8A1517] shadow-[0_0_20px_2px_rgba(237,32,36,0.32)] lg:shadow-[0_0_calc(40*var(--u))_calc(4*var(--u))_rgba(237,32,36,0.32),0_0_calc(16*var(--u))_rgba(237,32,36,0.22)]'
                        : 'border-[#555555] shadow-none'
                    }`}
                  >
                    {/* Option Title: Manrope-SemiBold (600), 42px at 3840w, tracking 20 (0.02em), #FFFFFF */}
                    <span className="text-base sm:text-lg lg:text-[calc(42*var(--u))] font-semibold text-[#FFFFFF] tracking-[0.02em] leading-none">
                      {option.title}
                    </span>
                    {/* Option Subtitle: Manrope-Regular (400), 30px at 3840w, tracking 20 (0.02em), #555555 */}
                    <span className="text-xs sm:text-sm lg:text-[calc(30*var(--u))] font-normal text-[#555555] tracking-[0.02em] leading-none mt-2 lg:mt-[calc(24*var(--u))]">
                      {option.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation matching PSD Back-Btn & Next-Btn (y=12557..12583, gap 47px, no top border) */}
            <div className="flex items-center justify-between mt-6 lg:mt-[calc(47*var(--u))] lg:px-[calc(9*var(--u))]">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="text-xs sm:text-sm lg:text-[calc(30*var(--u))] text-[#555555] hover:text-[#FFFFFF] inline-flex items-center gap-1.5 lg:gap-[calc(12*var(--u))] tracking-[0.02em] font-medium leading-none transition-colors cursor-pointer group"
                >
                  <svg
                    viewBox="0 0 16 26"
                    fill="none"
                    className="w-2.5 h-3.5 lg:w-[calc(16*var(--u))] lg:h-[calc(26*var(--u))] text-[#ED2024] group-hover:-translate-x-0.5 transition-transform"
                  >
                    <path
                      d="M14 2L3 13L14 24"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {answers[currentStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-xs sm:text-sm lg:text-[calc(30*var(--u))] text-[#555555] hover:text-[#FFFFFF] inline-flex items-center gap-1.5 lg:gap-[calc(11*var(--u))] tracking-[0.02em] font-medium leading-none transition-colors cursor-pointer group"
                >
                  <span>Next</span>
                  <svg
                    viewBox="0 0 16 26"
                    fill="none"
                    className="w-2.5 h-3.5 lg:w-[calc(16*var(--u))] lg:h-[calc(26*var(--u))] text-[#ED2024] group-hover:translate-x-0.5 transition-transform"
                  >
                    <path
                      d="M2 2L13 13L2 24"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Recommendation Result Screen matching PSD Subgroup 6 (x=1171..2670, y=11256..12645) */
          <div className="max-w-2xl lg:max-w-none lg:w-[calc(1500*var(--u))] mx-auto mt-10 lg:mt-[calc(111*var(--u))] bg-[#000000] border lg:border-[calc(2*var(--u))] border-[#555555] rounded-[24px] lg:rounded-[calc(60*var(--u))] px-6 sm:px-10 lg:px-[calc(50*var(--u))] pt-8 sm:pt-10 lg:pt-[calc(71*var(--u))] pb-8 sm:pb-10 lg:pb-[calc(89*var(--u))]">
            {/* Top Product Visual & Match Title (PSD Layer 10 + Your Match + LUMA Surge) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-[calc(36*var(--u))]">
              <div className="flex justify-center shrink-0">
                <img
                  src={matchData.productImage || '/assets/products/luma-surge.png'}
                  alt={`${matchData.brand || 'LUMA'} ${matchData.model || 'Surge'}`}
                  className="h-48 sm:h-60 lg:w-[calc(363*var(--u))] lg:h-[calc(528*var(--u))] object-contain block"
                />
              </div>

              <div className="text-center sm:text-left">
                {/* 'YOUR MATCH': Manrope-Regular (400), 30px at 3840w, tracking 100 (0.1em), #ED2024 */}
                <span className="block text-xs sm:text-sm lg:text-[calc(30*var(--u))] font-normal uppercase tracking-[0.1em] text-[#ED2024] leading-none">
                  {matchData.matchTag || 'YOUR MATCH'}
                </span>

                {/* 'LUMA Surge': Manrope-Regular (400), 150px at 3840w, leading 130px (0.87), tracking 20 (0.02em) */}
                <h3 className="text-4xl sm:text-5xl lg:text-[calc(150*var(--u))] font-normal tracking-[0.02em] leading-[0.9] lg:leading-[0.87] mt-3 lg:mt-[calc(40*var(--u))]">
                  <span className="block text-[#FFFFFF]">{matchData.brand || 'LUMA'}</span>
                  <span className="block text-[#ED2024]">{matchData.model || 'Surge'}</span>
                </h3>

                {/* 'Balanced power for the body in motion.': Manrope-Regular (400), 30px at 3840w, #555555 */}
                <p className="text-xs sm:text-sm lg:text-[calc(30*var(--u))] text-[#555555] font-normal tracking-[0.02em] leading-none mt-4 lg:mt-[calc(36*var(--u))]">
                  {matchData.headline || 'Balanced power for the body in motion.'}
                </p>
              </div>
            </div>

            {/* Feature Rows matching PSD Group 25 (y=11908..12212, 101px each, 18px red dot, 36px font) */}
            <div className="mt-8 lg:mt-[calc(53*var(--u))] border-t border-[#333333]">
              {(matchData.features || DEFAULT_RESULT.features).map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 lg:gap-[calc(38*var(--u))] py-3.5 lg:py-0 lg:h-[calc(101*var(--u))] border-b border-[#333333] lg:pl-[calc(10*var(--u))]"
                >
                  <span className="w-2.5 h-2.5 lg:w-[calc(18*var(--u))] lg:h-[calc(18*var(--u))] rounded-full bg-[#ED2024] shrink-0" />
                  <p className="text-xs sm:text-sm lg:text-[calc(36*var(--u))] tracking-[0.02em] leading-snug lg:leading-none">
                    <span className="font-semibold text-[#FFFFFF]">{row.bold}</span>
                    <span className="font-normal text-[#555555]">{row.rest}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Summary sentence: Manrope-Regular (400), 30px at 3840w, #555555 */}
            <p className="text-center text-xs sm:text-sm lg:text-[calc(30*var(--u))] text-[#555555] font-normal tracking-[0.02em] leading-none mt-6 lg:mt-[calc(73*var(--u))]">
              {matchData.summary || 'You want real performance without the full commitment of space.'}
            </p>

            {/* Optional Email Save Box for Guest */}
            {!guestEmailSaved ? (
              <form
                onSubmit={handleSaveGuestContact}
                className="mt-6 p-4 rounded-lg bg-[#111113] border border-[#262629] text-left"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Send me my assessment results & custom protocol
                  </span>
                  <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                    Optional
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your Name (e.g. Sarah K.)"
                    className="w-full bg-[#000000] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED2024]"
                  />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-[#000000] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#ED2024]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingGuest || !guestEmail.trim()}
                  className="w-full py-2 bg-[#222226] hover:bg-[#ED2024] text-white font-medium text-xs rounded transition-colors disabled:opacity-40 disabled:hover:bg-[#222226] cursor-pointer"
                >
                  {submittingGuest ? 'Saving...' : 'Save My Result & Advice'}
                </button>
              </form>
            ) : (
              <div className="mt-6 p-3 rounded-lg bg-[#142618] border border-[#1b4322] text-center text-xs text-[#4ade80]">
                ✓ Your assessment has been saved! A LUMA specialist can review your recommended panel.
              </div>
            )}

            {/* Full-width CTA Button (PSD Rectangle 11: w=1404, h=86, #ED2024, 32px SemiBold, #F2F1ED) */}
            <div className="mt-6 lg:mt-[calc(71*var(--u))]">
              <a
                href={matchData.ctaLink || '#products'}
                className="w-full h-11 lg:h-[calc(86*var(--u))] inline-flex items-center justify-center bg-[#ED2024] hover:bg-[#c9181b] text-[#F2F1ED] font-semibold text-xs sm:text-sm lg:text-[calc(32*var(--u))] uppercase tracking-[0.05em] rounded-[6px] lg:rounded-[calc(10*var(--u))] transition-colors cursor-pointer leading-none"
              >
                {matchData.ctaText || 'EXPLORE SURGE'}
              </a>
            </div>

            {/* Centered '< Retake' Button matching PSD Back-Btn (y=12530..12556, gap 59px) */}
            <div className="mt-5 lg:mt-[calc(59*var(--u))] flex justify-center">
              <button
                type="button"
                onClick={handleRetake}
                className="text-xs sm:text-sm lg:text-[calc(30*var(--u))] text-[#555555] hover:text-[#FFFFFF] font-medium tracking-[0.02em] inline-flex items-center gap-1.5 lg:gap-[calc(12*var(--u))] leading-none transition-colors cursor-pointer group"
              >
                <svg
                  viewBox="0 0 16 26"
                  fill="none"
                  className="w-2.5 h-3.5 lg:w-[calc(16*var(--u))] lg:h-[calc(26*var(--u))] text-[#ED2024] group-hover:-translate-x-0.5 transition-transform"
                >
                  <path
                    d="M14 2L3 13L14 24"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Retake</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
