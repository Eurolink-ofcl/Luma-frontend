import React from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutIntroSection from '../components/about/AboutIntroSection';
import AboutBasicsSection from '../components/about/AboutBasicsSection';
import AboutScienceSection from '../components/about/AboutScienceSection';
import AboutBenefitsSection from '../components/about/AboutBenefitsSection';
import AboutSafetyTechSection from '../components/about/AboutSafetyTechSection';
import AboutShopSection from '../components/about/AboutShopSection';

export default function AboutPage({ onNavigateHome }) {
  return (
    <div className="w-full bg-[#FFFFFF] text-[#000000]">
      {/* 1st Section: About LUMA Banner (PSD 'Images Banner', y=0..850) */}
      <AboutHero />

      {/* 2nd Section: Breadcrumb & Story Intro (PSD y=955..2097) */}
      <AboutIntroSection onNavigateHome={onNavigateHome} />

      {/* 3rd Section: The Basics / What Is Red Light Therapy? (PSD y=2263..3644) */}
      <AboutBasicsSection />

      {/* Continuous Dark Block in PSD (y=3810..8844 on #0A0A0B) — prevents sub-pixel white seam on scaled/tablet viewports */}
      <div className="w-full bg-[#0A0A0B]">
        {/* 4th Section: The Science / How It Works (PSD y=3810..5296) */}
        <AboutScienceSection />

        {/* 5th Section: Six Outcomes, One Habit / Benefits (PSD Group 44, y=5471..6884) */}
        <AboutBenefitsSection />

        {/* 6th Section: Built To Standard / Safety & Tech + Spec Table (PSD y=6962..8844) */}
        <AboutSafetyTechSection />
      </div>

      {/* 7th Section: Doctor Advisory + Ready When You Are / Find Your Device (PSD y=9021..11024) */}
      <AboutShopSection onNavigateHome={onNavigateHome} />
    </div>
  );
}
