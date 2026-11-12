import React from 'react';

const experts = [
  {
    id: 1,
    image: '/assets/community/expert-person-1.jpg',
    name: 'OLLIE RHODA',
    roleLines: ['ONLINE TRANSFORMATION COACH'],
    alt: 'Ollie Rhoda - Online Transformation Coach',
  },
  {
    id: 2,
    image: '/assets/community/expert-person-2.jpg',
    name: 'DAVID EAGLEMAN',
    roleLines: ['NEUROSCIENTIST, AUTHOR & HOST', 'OF INNER COSMOS'],
    alt: 'David Eagleman - Neuroscientist, Author & Host of Inner Cosmos',
  },
  {
    id: 3,
    image: '/assets/community/expert-person-3.jpg',
    name: 'DR. ANDREW HUBERMAN',
    roleLines: ['NEUROSCIENTIST & PODCASTER'],
    alt: 'Dr. Andrew Huberman - Neuroscientist & Podcaster',
  },
];

export default function CommunityMeetExpertsSection({ data }) {
  const title = data?.title || 'MEET OUR EXPERTS';
  const subheading =
    data?.subheading || 'EVERY TALK AND ANSWER COMES FROM A QUALIFIED PROFESSIONAL.';
  const expertList = data?.experts && data.experts.length > 0 ? data.experts : experts;

  return (
    <section
      id="meet-our-experts"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#030303] text-[#FFFFFF] pt-12 sm:pt-16 md:pt-20 lg:pt-[calc(174*var(--u))] pb-16 sm:pb-20 md:pb-24 lg:pb-[calc(151*var(--u))] overflow-hidden font-['Manrope']"
    >
      {/* Container aligned to PSD x=525..3320 (2795px cards span at 3840w canvas) */}
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-0 lg:pl-[calc(525*var(--u))] lg:pr-[calc(520*var(--u))]">
        {/* Section Heading: "MEET OUR EXPERTS" */}
        <h2 className="text-[24px] sm:text-[32px] md:text-[36px] lg:text-[calc(80*var(--u))] font-medium tracking-[0.02em] uppercase text-[#FFFFFF] leading-none lg:-ml-[calc(4*var(--u))]">
          {title}
        </h2>

        {/* Subheading */}
        <p className="mt-3 sm:mt-4 lg:mt-[calc(45*var(--u))] text-[12px] sm:text-[14px] md:text-[15px] lg:text-[calc(40*var(--u))] font-light tracking-[0.02em] uppercase text-[#FFFFFF]/85 leading-normal lg:leading-none">
          {subheading}
        </p>

        {/* 3 Experts Row */}
        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-[calc(194*var(--u))] flex flex-col md:flex-row items-center md:items-start justify-between gap-10 sm:gap-12 md:gap-6 lg:gap-[calc(427*var(--u))] w-full">
          {expertList.map((expert, idx) => {
            const lines = expert.roleLines || (expert.role ? expert.role.split('\n') : []);
            return (
              <div
                key={expert.id || idx}
                className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-none md:flex-1 md:min-w-0 lg:flex-initial lg:w-[calc(647*var(--u))] flex flex-col items-center group cursor-pointer"
              >
                {/* Expert Portrait Image (PSD Rectangle 51: 647x660, r=60px, overflow-hidden) */}
                <div className="relative w-full aspect-[647/660] lg:h-[calc(660*var(--u))] rounded-[24px] sm:rounded-[36px] lg:rounded-[calc(60*var(--u))] overflow-hidden bg-[#111111] transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src={expert.image}
                    alt={expert.alt || expert.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                </div>

                {/* Caption */}
                <div className="mt-4 sm:mt-5 md:mt-4 lg:mt-[calc(57*var(--u))] text-center w-full flex flex-col items-center px-1">
                  <h3 className="text-[14px] sm:text-[15px] md:text-[12.5px] lg:text-[calc(40*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF] leading-snug lg:leading-[calc(60*var(--u))] whitespace-nowrap">
                    {expert.name}
                  </h3>
                  {lines.map((line, lIdx) => (
                    <p
                      key={lIdx}
                      className="text-[11.5px] sm:text-[12.5px] md:text-[10px] lg:text-[calc(40*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF]/90 leading-snug lg:leading-[calc(60*var(--u))] whitespace-nowrap"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

