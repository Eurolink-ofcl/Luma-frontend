import React from 'react';

export default function CommunityHero() {
  return (
    <section
      id="community-hero"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pt-28 sm:pt-32 lg:pt-[calc(432*var(--u))] pb-16 sm:pb-20 lg:pb-[calc(244*var(--u))] overflow-hidden font-['Manrope']"
    >
      {/* Container matching PSD x=509..3314 (2805px width at 3840px canvas) */}
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-5 sm:px-8 lg:px-0 lg:pl-[calc(509*var(--u))] lg:pr-[calc(526*var(--u))]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 sm:gap-12 lg:gap-[calc(66*var(--u))]">
          {/* Left Column: Heading & CTA Buttons (PSD x=509..1552, w=1043px) */}
          <div className="w-full lg:w-[calc(1043*var(--u))] flex flex-col items-start shrink-0">
            {/* Title: 'JOIN THE\nLUMA\nCOMMUNITY' (Manrope-Bold, 169.2px at 3840w, leading ~158px, #000000 and #ED2024) */}
            <h1 className="text-[34px] sm:text-[52px] md:text-[68px] lg:text-[calc(169.2*var(--u))] font-bold uppercase tracking-normal leading-[1.0] lg:leading-[calc(158*var(--u))] text-[#000000]">
              <span className="block">JOIN THE</span>
              <span className="block text-[#ED2024]">LUMA</span>
              <span className="block">COMMUNITY</span>
            </h1>

            {/* Two Action Buttons (PSD y=1016..1096, 374x80px each, gap 47px, 139px below title) */}
            <div className="mt-8 sm:mt-10 lg:mt-[calc(139*var(--u))] flex flex-wrap items-center gap-3.5 sm:gap-4 lg:gap-[calc(47*var(--u))] w-full">
              {/* Button 1: DEMO CLASS (Rectangle 21 copy 4: 374x80, r=40px, fill #ED2024, text Manrope-Medium 30px tracking 20 #FFFFFF) */}
              <button
                type="button"
                className="w-full sm:w-auto sm:min-w-[150px] md:w-[172px] lg:w-[clamp(150px,calc(374*var(--u)),175px)] h-[38px] sm:h-[40px] md:h-[42px] lg:h-[clamp(38px,calc(80*var(--u)),42px)] rounded-full bg-[#ED2024] hover:bg-[#c9181b] text-[#FFFFFF] text-[11px] sm:text-[12px] md:text-[12px] lg:text-[clamp(11px,calc(30*var(--u)),13px)] font-medium uppercase tracking-[0.02em] inline-flex items-center justify-center text-center leading-none transition-colors duration-200 cursor-pointer"
              >
                DEMO CLASS
              </button>

              {/* Button 2: ASK QUESTION (Rectangle 21 copy 5: 374x80, r=40px, fill #000000, text Manrope-Medium 30px tracking 20 #FFFFFF) */}
              <button
                type="button"
                className="w-full sm:w-auto sm:min-w-[150px] md:w-[172px] lg:w-[clamp(150px,calc(374*var(--u)),175px)] h-[38px] sm:h-[40px] md:h-[42px] lg:h-[clamp(38px,calc(80*var(--u)),42px)] rounded-full bg-[#000000] hover:bg-[#222222] text-[#FFFFFF] text-[11px] sm:text-[12px] md:text-[12px] lg:text-[clamp(11px,calc(30*var(--u)),13px)] font-medium uppercase tracking-[0.02em] inline-flex items-center justify-center text-center leading-none transition-colors duration-200 cursor-pointer"
              >
                ASK QUESTION
              </button>
            </div>
          </div>

          {/* Right Column: Event Card (PSD Rectangle 48: bbox 1979..3314 -> 1335x708px, r=60px) */}
          <div className="relative w-full lg:w-[calc(1335*var(--u))] lg:h-[calc(708*var(--u))] lg:aspect-[1335/708] rounded-[24px] sm:rounded-[36px] lg:rounded-[calc(60*var(--u))] overflow-hidden shadow-xl lg:shadow-2xl bg-[#1a0a0c] flex flex-col justify-start p-6 sm:p-9 lg:p-0 lg:pl-[calc(82*var(--u))] lg:pr-[calc(109*var(--u))] lg:pt-[calc(91*var(--u))]">
            {/* Background Image extracted directly from PSD Smart Object */}
            <img
              src="/assets/community/event-card-bg.jpg"
              alt="Red Light Therapy Event Background"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* Card Content (Relative z-10 over background) */}
            <div className="relative z-10 flex flex-col items-start w-full lg:pl-[calc(19*var(--u))]">
              {/* Eyebrow: 'Next Event' (PSD: 40px at 3840w, Manrope-ExtraLight, #FFFFFF) */}
              <p className="text-[13px] sm:text-[16px] lg:text-[calc(40*var(--u))] font-extralight tracking-normal text-[#FFFFFF] leading-none">
                Next Event
              </p>

              {/* Event Title: 'Red Light Therapy Talk' (PSD: 87.4px at 3840w, Manrope-ExtraLight, #FFFFFF) */}
              <h2 className="mt-3 sm:mt-4 lg:mt-[calc(49*var(--u))] text-[24px] sm:text-[34px] md:text-[42px] lg:text-[calc(87.4*var(--u))] font-extralight tracking-normal text-[#FFFFFF] leading-[1.05] lg:leading-none">
                Red Light Therapy Talk
              </h2>

              {/* Description: (PSD: 40px at 3840w, Manrope-ExtraLight, #FFFFFF) */}
              <p className="mt-2.5 sm:mt-3.5 lg:mt-[calc(10*var(--u))] text-[12px] sm:text-[15px] lg:text-[calc(40*var(--u))] font-extralight tracking-normal text-[#FFFFFF] leading-[1.3] lg:leading-[calc(46*var(--u))] max-w-[95%]">
                Join us live to learn how red light therapy works,
                <br className="hidden sm:inline" />
                meet our doctors and get your questions answered.
              </p>
            </div>

            {/* Action Pills Row (PSD y=887..968, 81px height at 3840w, 98px below description, 172px space to bottom) */}
            <div className="relative z-10 mt-6 sm:mt-8 lg:mt-[calc(98*var(--u))] flex flex-wrap lg:flex-nowrap items-center gap-2.5 sm:gap-3.5 lg:gap-[calc(37*var(--u))] w-full">
              {/* Pill 1: Date & Time (Rectangle 57: 426x81px, bg #FFFFFF, text Manrope-ExtraLight 36.8px #000000) */}
              <div className="h-[36px] sm:h-[44px] lg:h-[calc(81*var(--u))] px-4 sm:px-6 lg:px-0 lg:w-[calc(426*var(--u))] rounded-full bg-[#FFFFFF] text-[#000000] text-[11px] sm:text-[13px] lg:text-[calc(36.8*var(--u))] font-extralight flex items-center justify-center shrink-0 shadow-sm leading-none whitespace-nowrap">
                Thu, 5 Dec &nbsp;7:00 PM
              </div>

              {/* Pill 2: Location (Rectangle 57 copy: 231x81px, bg #FFFFFF, text Manrope-ExtraLight 36.8px #000000) */}
              <div className="h-[36px] sm:h-[44px] lg:h-[calc(81*var(--u))] px-4 sm:px-6 lg:px-0 lg:w-[calc(231*var(--u))] rounded-full bg-[#FFFFFF] text-[#000000] text-[11px] sm:text-[13px] lg:text-[calc(36.8*var(--u))] font-extralight flex items-center justify-center shrink-0 shadow-sm leading-none whitespace-nowrap">
                Online
              </div>

              {/* Pill 3: CTA Button (Rectangle 57 copy 2: 413x81px, bg #ED2024, text Manrope-ExtraLight 36.8px #FFFFFF) */}
              <a
                href="#join-event"
                className="h-[36px] sm:h-[44px] lg:h-[calc(81*var(--u))] px-5 sm:px-7 lg:px-0 lg:w-[calc(413*var(--u))] rounded-full bg-[#ED2024] hover:bg-[#c9181b] text-[#FFFFFF] text-[11px] sm:text-[13px] lg:text-[calc(36.8*var(--u))] font-extralight flex items-center justify-center shrink-0 shadow-sm leading-none transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                Get the join link
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

