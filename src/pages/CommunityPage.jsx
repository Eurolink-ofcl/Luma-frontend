import React from 'react';
import CommunityHero from '../components/community/CommunityHero';
import CommunityExpertsSection from '../components/community/CommunityExpertsSection';
import CommunityMeetExpertsSection from '../components/community/CommunityMeetExpertsSection';
import CommunityAskExpertsSection from '../components/community/CommunityAskExpertsSection';
import CommunityQuizCtaSection from '../components/community/CommunityQuizCtaSection';

export default function CommunityPage({ onNavigateHome }) {
  return (
    <div className="w-full bg-[#FFFFFF] text-[#000000] overflow-x-clip">
      {/* 1st Section: Join the LUMA Community / Header Text and Image (PSD y=432..1140) */}
      <CommunityHero />

      {/* 2nd Section: Talk to the Experts / Filter Pills & 6 Video Cards (PSD y=1384..3622) */}
      <CommunityExpertsSection />

      {/* 3rd Section: Meet Our Experts / 3 Expert Profile Cards (PSD y=3720..5244) */}
      <CommunityMeetExpertsSection />

      {/* 4th Section: Ask Our Experts / Form & Recently Answered (PSD y=5506..7498) */}
      <CommunityAskExpertsSection />

      {/* 5th Section: Not Sure Where to Start? / Quiz & WhatsApp CTA (PSD y=7669..7977) */}
      <CommunityQuizCtaSection onStartQuiz={() => onNavigateHome && onNavigateHome('#assessment-quiz')} />
    </div>
  );
}

