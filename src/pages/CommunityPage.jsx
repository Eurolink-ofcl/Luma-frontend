import React, { useState, useEffect } from 'react';
import CommunityHero from '../components/community/CommunityHero';
import CommunityExpertsSection from '../components/community/CommunityExpertsSection';
import CommunityMeetExpertsSection from '../components/community/CommunityMeetExpertsSection';
import CommunityAskExpertsSection from '../components/community/CommunityAskExpertsSection';
import CommunityQuizCtaSection from '../components/community/CommunityQuizCtaSection';

const API_BASE_URL = 'http://localhost:5000/api';

export default function CommunityPage({ onNavigateHome }) {
  const [pageContent, setPageContent] = useState(null);

  // Fetch dynamic CMS content from MongoDB
  useEffect(() => {
    fetch(`${API_BASE_URL}/pages/community`)
      .then((res) => {
        if (!res.ok) throw new Error('CMS Community API response not ok');
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data) {
          setPageContent(data.data);
        }
      })
      .catch((err) => {
        // Falls back seamlessly to the hardcoded default props inside components
        console.warn('Notice: Loading default content (backend CMS endpoint not reached yet):', err.message);
      });
  }, []);

  return (
    <div className="w-full bg-[#FFFFFF] text-[#000000] overflow-x-clip">
      {/* 1st Section: Join the LUMA Community / Header Text and Image (PSD y=432..1140) */}
      <CommunityHero data={pageContent?.hero} />

      {/* 2nd Section: Talk to the Experts / Filter Pills & 6 Video Cards (PSD y=1384..3622) */}
      <CommunityExpertsSection data={pageContent?.expertsSection} />

      {/* 3rd Section: Meet Our Experts / 3 Expert Profile Cards (PSD y=3720..5244) */}
      <CommunityMeetExpertsSection data={pageContent?.meetExperts} />

      {/* 4th Section: Ask Our Experts / Form & Recently Answered (PSD y=5506..7498) */}
      <CommunityAskExpertsSection data={pageContent?.askExperts} />

      {/* 5th Section: Not Sure Where to Start? / Quiz & WhatsApp CTA (PSD y=7669..7977) */}
      <CommunityQuizCtaSection
        data={pageContent?.quizCta}
        onStartQuiz={() => onNavigateHome && onNavigateHome('#assessment-quiz')}
      />
    </div>
  );
}

