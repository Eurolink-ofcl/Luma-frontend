import React, { useState } from 'react';

const questions = [
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

export default function AssessmentQuiz() {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4 = questions, 5 = results
  const [answers, setAnswers] = useState({});

  const handleSelectOption = (index) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: index }));
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(5); // Show result
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  const currentQ = questions[currentStep];

  return (
    <section
      id="assessment"
      className="relative w-full bg-[#0a0a0a] text-white py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope']"
    >
      {/* Full-bleed unboxed subtle ambient glow matching PSD Group 26 */}
      <div className="absolute inset-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_70%_45%_at_50%_45%,rgba(236,32,36,0.08),transparent_70%)] z-0" />

      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1600px] 3xl:max-w-[1850px] 4xl:max-w-[2150px] mx-auto px-6 lg:px-8 2xl:px-12 4xl:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl 4xl:max-w-5xl mx-auto mb-14 md:mb-18 2xl:mb-24">
          <p className="text-xs sm:text-sm 2xl:text-[15.2px] 4xl:text-[22.8px] uppercase tracking-[0.2em] font-medium text-[#EC2024] mb-3">
            The LUMA 1-Minute Assessment
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] 2xl:text-[30.4px] 4xl:text-[45.5px] font-extralight tracking-tight uppercase leading-tight text-white">
            Find the light that fits you
          </h2>
          <p className="text-white/70 text-sm sm:text-base 2xl:text-[20px] 4xl:text-[30px] leading-relaxed font-normal mt-3">
            Five questions. One panel, matched to your body, your space and your ritual.
          </p>
        </div>

        {/* Step Content matching PSD Group 26 Rectangle 53 copy */}
        {currentStep < 5 ? (
          <div className="max-w-2xl 2xl:max-w-3xl 4xl:max-w-4xl mx-auto bg-[#0E0E10] border border-white/15 rounded-[24px] 2xl:rounded-[36px] 4xl:rounded-[44px] p-6 sm:p-10 2xl:p-14 4xl:p-18 shadow-2xl">
            {/* Discrete 5-Bar Progress Indicator matching PSD Group 26 Nav (Rectangle 54) */}
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 2xl:gap-4 mb-8 2xl:mb-10">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 2xl:h-2 rounded-full transition-all duration-300 ${
                    i <= currentStep ? 'bg-[#EC2024]' : 'bg-[#333333]'
                  }`}
                />
              ))}
            </div>

            {/* Question Header Centered matching PSD */}
            <div className="text-center mb-8 2xl:mb-10">
              <span className="text-xs sm:text-sm 2xl:text-[20px] 4xl:text-[30px] uppercase tracking-[0.1em] font-normal text-gray-400 block mb-2">
                Question {currentStep + 1} of 5
              </span>
              <h3 className="text-2xl sm:text-3xl 2xl:text-[25.6px] 4xl:text-[38.3px] font-extralight text-white tracking-tight leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List matching PSD Rectangle 53 copy */}
            <div className="space-y-3.5 2xl:space-y-4.5 mb-10 2xl:mb-12">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentStep] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-5 sm:p-6 2xl:p-7 rounded-[14px] 2xl:rounded-[18px] border transition-all duration-200 cursor-pointer flex flex-col justify-center ${
                      isSelected
                        ? 'border-[#EC2024] bg-[#EC2024]/15 shadow-[0_0_20px_rgba(236,32,36,0.25)] ring-1 ring-[#EC2024]'
                        : 'border-white/10 bg-[#161618] hover:border-white/30 hover:bg-[#1D1D20]'
                    }`}
                  >
                    <span className="text-base sm:text-lg 2xl:text-[17.9px] 4xl:text-[26.8px] font-semibold text-white mb-1">
                      {option.title}
                    </span>
                    <span className="text-xs sm:text-sm 2xl:text-[20px] 4xl:text-[30px] font-normal text-gray-400">
                      {option.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation matching PSD Back-Btn & Next-Btn */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="text-xs sm:text-sm 2xl:text-[20px] 4xl:text-[30px] text-gray-400 hover:text-white flex items-center gap-2 uppercase tracking-wider font-medium transition-colors cursor-pointer"
                >
                  &larr; Back
                </button>
              ) : (
                <div />
              )}

              {answers[currentStep] !== undefined && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-xs sm:text-sm 2xl:text-[20px] 4xl:text-[30px] text-[#EC2024] hover:text-[#ff3b3e] flex items-center gap-2 uppercase tracking-wider font-medium transition-colors cursor-pointer"
                >
                  Next &rarr;
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Recommendation Result Screen (Matching PSD) */
          <div className="max-w-4xl mx-auto bg-white/3 border border-white/10 rounded-[24px] p-8 sm:p-14 shadow-2xl backdrop-blur-md">
            <div className="text-center mb-8">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs 2xl:text-[20px] 4xl:text-[30px] font-normal uppercase tracking-[0.1em] bg-red-500/20 text-[#EC2024] border border-red-500/30 mb-3">
                Your Match
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Product Visual */}
              <div className="flex justify-center p-6 bg-white/2 rounded-[16px] border border-white/5">
                <img
                  src="/assets/products/luma-surge.png"
                  alt="LUMA Surge Panel"
                  className="max-h-[380px] w-auto object-contain drop-shadow-[0_10px_30px_rgba(236,32,36,0.3)]"
                />
              </div>

              {/* Product Match Details */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-3xl sm:text-4xl 2xl:text-[63.9px] 4xl:text-[95.8px] font-normal text-white uppercase tracking-tight">
                    LUMA <span className="font-semibold text-[#EC2024]">Surge</span>
                  </h3>
                  <p className="text-sm sm:text-base 2xl:text-[20px] 4xl:text-[30px] text-white/70 font-normal mt-1">
                    Balanced power for the body in motion.
                  </p>
                </div>

                <div className="space-y-3 py-2 text-xs sm:text-sm 2xl:text-[13.7px] 4xl:text-[20.5px] text-white/80 leading-relaxed border-y border-white/10">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#EC2024] font-bold mt-0.5">•</span>
                    <span className="font-semibold">Faster recovery. Broader coverage to support muscles after effort.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#EC2024] font-bold mt-0.5">•</span>
                    <span className="font-semibold">Calmer evenings. Wind down with warm, restorative light.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#EC2024] font-bold mt-0.5">•</span>
                    <span className="font-semibold">Everyday versatility. Face and upper body in one graceful session.</span>
                  </div>
                </div>

                <p className="text-xs 2xl:text-[20px] 4xl:text-[30px] text-white/60 font-normal">
                  You want real performance without the full commitment of space.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="#products"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#EC2024] hover:bg-[#c9181b] text-white font-semibold text-xs sm:text-sm 2xl:text-[21.3px] 4xl:text-[32px] uppercase tracking-[0.05em] rounded-[6px] transition-all shadow-lg hover:shadow-red-500/20 cursor-pointer"
                  >
                    Explore SURGE
                  </a>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="text-xs sm:text-sm 2xl:text-[20px] 4xl:text-[30px] text-white/60 hover:text-white font-medium transition-colors cursor-pointer underline underline-offset-4"
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
