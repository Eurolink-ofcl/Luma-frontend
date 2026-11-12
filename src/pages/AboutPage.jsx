import React, { useState, useEffect } from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutIntroSection from '../components/about/AboutIntroSection';
import AboutBasicsSection from '../components/about/AboutBasicsSection';
import AboutScienceSection from '../components/about/AboutScienceSection';
import AboutBenefitsSection from '../components/about/AboutBenefitsSection';
import AboutSafetyTechSection from '../components/about/AboutSafetyTechSection';
import AboutShopSection from '../components/about/AboutShopSection';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default function AboutPage({ onNavigateHome }) {
  const [pageContent, setPageContent] = useState(null);

  // Fetch dynamic CMS content from MongoDB
  useEffect(() => {
    fetch(`${API_BASE_URL}/pages/about`)
      .then((res) => {
        if (!res.ok) throw new Error('CMS API response not ok');
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
    <div className="w-full bg-[#FFFFFF] text-[#000000]">
      {/* 1st Section: About LUMA Banner */}
      <AboutHero data={pageContent?.hero} />

      {/* 2nd Section: Breadcrumb & Story Intro */}
      <AboutIntroSection onNavigateHome={onNavigateHome} data={pageContent?.intro} />

      {/* 3rd Section: The Basics / What Is Red Light Therapy? */}
      <AboutBasicsSection data={pageContent?.basics} />

      {/* Continuous Dark Block in PSD (y=3810..8844 on #0A0A0B) */}
      <div className="w-full bg-[#0A0A0B]">
        {/* 4th Section: The Science / How It Works */}
        <AboutScienceSection data={pageContent?.science} />

        {/* 5th Section: Six Outcomes, One Habit / Benefits */}
        <AboutBenefitsSection data={pageContent?.benefits} />

        {/* 6th Section: Built To Standard / Safety & Tech + Spec Table */}
        <AboutSafetyTechSection data={pageContent?.safety} />
      </div>

      {/* 7th Section: Doctor Advisory + Ready When You Are / Find Your Device */}
      <AboutShopSection onNavigateHome={onNavigateHome} data={pageContent?.shopCta} />
    </div>
  );
}
