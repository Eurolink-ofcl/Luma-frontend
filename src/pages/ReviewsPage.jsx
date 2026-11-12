import React, { useState, useEffect } from 'react';
import ReviewHero from '../components/reviews/ReviewHero';
import RealStoriesSection from '../components/reviews/RealStoriesSection';
import RealStoryGallerySection from '../components/reviews/RealStoryGallerySection';
import BeforeAfter from '../components/BeforeAfter';
import ShareStorySection from '../components/reviews/ShareStorySection';
import AssessmentQuiz from '../components/AssessmentQuiz';
import TrustGuarantees from '../components/TrustGuarantees';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ReviewsPage({ onNavigateHome }) {
  const [pageContent, setPageContent] = useState(null);

  // Fetch dynamic CMS reviews content from backend MongoDB
  useEffect(() => {
    fetch(`${API_BASE_URL}/pages/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error('CMS Reviews API response not ok');
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data) {
          setPageContent(data.data);
        }
      })
      .catch((err) => {
        console.warn('Notice: Loading default content (backend CMS endpoint not reached yet):', err.message);
      });
  }, []);

  return (
    <div className="w-full bg-[#FFFFFF] text-[#000000] overflow-x-clip">
      {/* Fixed Navbar clearance spacer (mobile: 64px, desktop: 191*var(--u)) */}
      <div
        style={{ '--u': 'calc(100vw / 3840)' }}
        className="w-full h-[64px] lg:h-[calc(191*var(--u))] bg-[#0a0a0a]"
        aria-hidden="true"
      />

      {/* 1st Section: Review Page Hero Banner (PSD 'Images Banner', y=260..1190) */}
      <ReviewHero
        data={pageContent?.hero}
        onShareStory={() => {
          const el = document.getElementById('write-review');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onFindPanel={() => {
          if (onNavigateHome) {
            onNavigateHome('#products');
          }
        }}
      />

      {/* 2nd Section: Real Stories Carousel (PSD 'Layer 1: REAL STORIES', y=1359..2980) */}
      <RealStoriesSection data={pageContent?.realStories} />

      {/* 3rd Section: Real Story Curved 3D Panoramic Gallery (PSD 'Layer 1: REAL STORY', y=3091..4697) */}
      <RealStoryGallerySection data={pageContent?.gallery} />

      {/* 4th Section: Real Sessions Before & After Comparison (PSD 'Layer 1: REAL SESSIONS', y=4593..6250) */}
      <BeforeAfter variant="review" data={pageContent?.beforeAfter} />

      {/* 5th Section: Share Your Story Review Form (PSD 'Layer 1: Write Review', y=6422..7429) */}
      <ShareStorySection data={pageContent?.shareStory} />

      {/* 6th Section: 1-Minute Assessment Quiz (PSD 'Layer 1: One Min Assessment', y=7422..9517) */}
      <AssessmentQuiz />

      {/* 7th Section: 4-Icon Trust & Guarantees Strip (PSD 'Layer 1: 4 icon Sec', y=9514..10130) with top divider line */}
      <TrustGuarantees hasTopLine />
    </div>
  );
}

