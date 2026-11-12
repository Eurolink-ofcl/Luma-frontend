import React from 'react';

export default function CommunityHero({ data }) {
  const titleLine1 = data?.titleLine1 || 'JOIN THE';
  const titleHighlight = data?.titleLine2 || data?.titleHighlight || 'LUMA';
  const titleLine2 = data?.titleLine3 || data?.titleLine2 || 'COMMUNITY';
  const demoButtonText = data?.demoClassBtnText || data?.demoButtonText || 'DEMO CLASS';
  const askButtonText = data?.askQuestionBtnText || data?.askButtonText || 'ASK QUESTION';

  const eventCard = data?.eventCard || {};
  const eventEyebrow = eventCard.eyebrow || 'Next Event';
  const eventTitle = eventCard.title || 'Red Light Therapy Talk';
  const eventDescription =
    eventCard.description ||
    'Join us live to learn how red light therapy works,\nmeet our doctors and get your questions answered.';
  const eventDate = eventCard.dateText || eventCard.date || 'Thu, 5 Dec  7:00 PM';
  const eventLocation = eventCard.locationText || eventCard.location || 'Online';
  const eventButtonText = eventCard.joinLinkText || eventCard.buttonText || 'Get the join link';
  const eventBgImage =
    eventCard.bgImage || eventCard.backgroundImage || '/assets/community/event-card-bg.jpg';

  // Live Meeting Join URL (Google Meet, Zoom, Teams, etc.)
  const rawMeetUrl =
    eventCard.joinLinkUrl ||
    eventCard.meetLink ||
    eventCard.meetingUrl ||
    eventCard.joinUrl ||
    eventCard.buttonLink ||
    '';

  const getCleanMeetUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed || trimmed === '#join-event' || trimmed.startsWith('#')) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    // Auto-prefix https:// for links entered without scheme (e.g. meet.google.com/xyz)
    return `https://${trimmed}`;
  };

  const cleanMeetUrl = getCleanMeetUrl(rawMeetUrl);
  const hasLiveMeetingLink = Boolean(cleanMeetUrl);

  const handleJoinClick = (e) => {
    if (!hasLiveMeetingLink) {
      e.preventDefault();
      alert(
        'The live meeting link for this event will be published shortly before the session begins. Please check back soon or join our WhatsApp community for instant reminders!'
      );
    }
  };

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
              <span className="block">{titleLine1}</span>
              <span className="block text-[#ED2024]">{titleHighlight}</span>
              <span className="block">{titleLine2}</span>
            </h1>

            {/* Two Action Buttons (PSD y=1016..1096, 374x80px each, gap 47px, 139px below title) */}
            <div className="mt-8 sm:mt-10 lg:mt-[calc(139*var(--u))] flex flex-wrap items-center gap-3.5 sm:gap-4 lg:gap-[calc(47*var(--u))] w-full">
              {/* Button 1: DEMO CLASS */}
              <a
                href="#talk-to-experts"
                className="w-full sm:w-auto sm:min-w-[150px] md:w-[172px] lg:w-[clamp(150px,calc(374*var(--u)),175px)] h-[38px] sm:h-[40px] md:h-[42px] lg:h-[clamp(38px,calc(80*var(--u)),42px)] rounded-full bg-[#ED2024] hover:bg-[#c9181b] text-[#FFFFFF] text-[11px] sm:text-[12px] md:text-[12px] lg:text-[clamp(11px,calc(30*var(--u)),13px)] font-medium uppercase tracking-[0.02em] inline-flex items-center justify-center text-center leading-none transition-colors duration-200 cursor-pointer"
              >
                {demoButtonText}
              </a>

              {/* Button 2: ASK QUESTION */}
              <a
                href="#ask-our-experts"
                className="w-full sm:w-auto sm:min-w-[150px] md:w-[172px] lg:w-[clamp(150px,calc(374*var(--u)),175px)] h-[38px] sm:h-[40px] md:h-[42px] lg:h-[clamp(38px,calc(80*var(--u)),42px)] rounded-full bg-[#000000] hover:bg-[#222222] text-[#FFFFFF] text-[11px] sm:text-[12px] md:text-[12px] lg:text-[clamp(11px,calc(30*var(--u)),13px)] font-medium uppercase tracking-[0.02em] inline-flex items-center justify-center text-center leading-none transition-colors duration-200 cursor-pointer"
              >
                {askButtonText}
              </a>
            </div>
          </div>

          {/* Right Column: Event Card (PSD Rectangle 48: bbox 1979..3314 -> 1335x708px, r=60px) */}
          <div className="relative w-full lg:w-[calc(1335*var(--u))] lg:h-[calc(708*var(--u))] lg:aspect-[1335/708] rounded-[24px] sm:rounded-[36px] lg:rounded-[calc(60*var(--u))] overflow-hidden shadow-xl lg:shadow-2xl bg-[#1a0a0c] flex flex-col justify-start p-6 sm:p-9 lg:p-0 lg:pl-[calc(82*var(--u))] lg:pr-[calc(109*var(--u))] lg:pt-[calc(91*var(--u))]">
            {/* Background Image extracted directly from PSD Smart Object */}
            <img
              src={eventBgImage}
              alt="Red Light Therapy Event Background"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* Card Content (Relative z-10 over background) */}
            <div className="relative z-10 flex flex-col items-start w-full lg:pl-[calc(19*var(--u))]">
              {/* Eyebrow: 'Next Event' (PSD: 40px at 3840w, Manrope-ExtraLight, #FFFFFF) */}
              <p className="text-[13px] sm:text-[16px] lg:text-[calc(40*var(--u))] font-extralight tracking-normal text-[#FFFFFF] leading-none">
                {eventEyebrow}
              </p>

              {/* Event Title: 'Red Light Therapy Talk' (PSD: 87.4px at 3840w, Manrope-ExtraLight, #FFFFFF) */}
              <h2 className="mt-3 sm:mt-4 lg:mt-[calc(49*var(--u))] text-[24px] sm:text-[34px] md:text-[42px] lg:text-[calc(87.4*var(--u))] font-extralight tracking-normal text-[#FFFFFF] leading-[1.05] lg:leading-none">
                {eventTitle}
              </h2>

              {/* Description: (PSD: 40px at 3840w, Manrope-ExtraLight, #FFFFFF) */}
              <p className="mt-2.5 sm:mt-3.5 lg:mt-[calc(10*var(--u))] text-[12px] sm:text-[15px] lg:text-[calc(40*var(--u))] font-extralight tracking-normal text-[#FFFFFF] leading-[1.3] lg:leading-[calc(46*var(--u))] max-w-[95%] whitespace-pre-line">
                {eventDescription}
              </p>
            </div>

            {/* Action Pills Row (PSD y=887..968, 81px height at 3840w, 98px below description, 172px space to bottom) */}
            <div className="relative z-10 mt-6 sm:mt-8 lg:mt-[calc(98*var(--u))] flex flex-wrap lg:flex-nowrap items-center gap-2.5 sm:gap-3.5 lg:gap-[calc(37*var(--u))] w-full">
              {/* Pill 1: Date & Time */}
              <div className="h-[36px] sm:h-[44px] lg:h-[calc(81*var(--u))] px-4 sm:px-6 lg:px-0 lg:w-[calc(426*var(--u))] rounded-full bg-[#FFFFFF] text-[#000000] text-[11px] sm:text-[13px] lg:text-[calc(36.8*var(--u))] font-extralight flex items-center justify-center shrink-0 shadow-sm leading-none whitespace-nowrap">
                {eventDate}
              </div>

              {/* Pill 2: Location */}
              <div className="h-[36px] sm:h-[44px] lg:h-[calc(81*var(--u))] px-4 sm:px-6 lg:px-0 lg:w-[calc(231*var(--u))] rounded-full bg-[#FFFFFF] text-[#000000] text-[11px] sm:text-[13px] lg:text-[calc(36.8*var(--u))] font-extralight flex items-center justify-center shrink-0 shadow-sm leading-none whitespace-nowrap">
                {eventLocation}
              </div>

              {/* Pill 3: CTA Button (Join Live Meeting) */}
              <a
                href={hasLiveMeetingLink ? cleanMeetUrl : '#join-event'}
                target={hasLiveMeetingLink ? '_blank' : undefined}
                rel={hasLiveMeetingLink ? 'noopener noreferrer' : undefined}
                onClick={!hasLiveMeetingLink ? handleJoinClick : undefined}
                title={hasLiveMeetingLink ? `Join Live Meeting: ${cleanMeetUrl}` : 'Get the join link'}
                className="h-[36px] sm:h-[44px] lg:h-[calc(81*var(--u))] px-5 sm:px-7 lg:px-0 lg:w-[calc(413*var(--u))] rounded-full bg-[#ED2024] hover:bg-[#c9181b] text-[#FFFFFF] text-[11px] sm:text-[13px] lg:text-[calc(36.8*var(--u))] font-extralight flex items-center justify-center shrink-0 shadow-sm leading-none transition-colors duration-200 cursor-pointer whitespace-nowrap gap-1.5"
              >
                <span>{eventButtonText}</span>
                {hasLiveMeetingLink && (
                  <svg
                    className="w-3 h-3 lg:w-[calc(26*var(--u))] lg:h-[calc(26*var(--u))] opacity-85 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

