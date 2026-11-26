import React, { useState, useEffect } from 'react';
import { resolveImageUrl } from '../config/api';

export default function Hero({ data }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const headingText = data?.badge || 'THE SCIENCE OF LIGHT.\nTHE POWER TO HEAL.';
  const headingLines = headingText.includes('\n')
    ? headingText.split('\n')
    : headingText.includes('.')
      ? headingText.split('.').map((s) => s.trim()).filter(Boolean).map((s) => s + '.')
      : [headingText];

  const subtitle = data?.title || "THE WORLD'S MOST ADVANCED RED LIGHT THERAPY PANEL";
  const exploreBtnText = data?.exploreBtnText || 'EXPLORE LUMA';
  const exploreBtnLink = data?.exploreBtnLink || '#about';
  const findPanelBtnText = data?.findPanelBtnText || 'FIND YOUR PANEL';
  const findPanelBtnLink = data?.findPanelBtnLink || '#assessment-quiz';

  // Build the 4 carousel slides (using custom slides from CMS if provided, or default 4 gallery images)
  const defaultImages = [
    resolveImageUrl(data?.bgImage) || data?.bgImage || '/assets/hero-bg.jpg',
    '/assets/about/story-panel.jpg',
    '/assets/community-bg.jpg',
    '/assets/about-chamber-perfect.jpg',
  ];

  const rawSlides = Array.isArray(data?.slides) && data.slides.length > 0
    ? data.slides
    : (Array.isArray(data?.images) && data.images.length > 0 ? data.images : null);

  const slides = rawSlides
    ? rawSlides.slice(0, 4).map((s, idx) => ({
        id: s?.id || idx + 1,
        image: resolveImageUrl(s?.image || s) || s?.image || s || defaultImages[idx % defaultImages.length],
        alt: s?.alt || `LUMA Hero Slide ${idx + 1}`,
      }))
    : defaultImages.map((img, idx) => ({
        id: idx + 1,
        image: img,
        alt: `LUMA Hero Slide ${idx + 1}`,
      }));

  // Auto-advance carousel slide every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlideIdx = activeSlide < slides.length ? activeSlide : 0;

  return (
    <main
      id="hero"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full h-[580px] sm:h-[680px] lg:h-[calc(1845*var(--u))] flex flex-col items-center justify-center lg:justify-start text-center px-4 sm:px-6 lg:px-0 pt-[56px] sm:pt-[76px] lg:pt-[calc(547*var(--u))] pb-16 sm:pb-20 lg:pb-0 overflow-hidden font-['Manrope']"
    >
      {/* Background with Authenticity & Depth (Interactive Carousel with Smooth Crossfade) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {slides.map((slide, idx) => (
          <img
            key={slide.id || idx}
            src={slide.image}
            alt={slide.alt || 'LUMA Red Light Therapy Panels in Modern Wellness Gym'}
            className={`absolute inset-0 w-full h-full object-cover object-[66%_center] sm:object-[60%_center] lg:object-center transition-opacity duration-1000 ease-in-out ${
              currentSlideIdx === idx ? 'opacity-100 z-1 scale-100' : 'opacity-0 z-0 pointer-events-none'
            }`}
          />
        ))}
        {/* Subtle mobile readability vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/70 lg:hidden pointer-events-none z-2" />
      </div>

      {/* Content (PSD Group 'Text & Button', y=616..1106 on 3840w canvas) */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Main Heading: Manrope-Bold (700), 150px at 3840w, leading 140px (0.9333), tracking 0, #FFFFFF */}
        <h1 className="font-['Manrope'] text-[27px] sm:text-[42px] md:text-[52px] lg:text-[calc(150*var(--u))] font-bold leading-[1.02] lg:leading-[0.9333] tracking-normal uppercase text-[#FFFFFF] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] lg:drop-shadow-none">
          {headingLines.map((line, idx) => (
            <span key={idx} className="block">{line}</span>
          ))}
        </h1>

        {/* Subtitle: Manrope-Regular (400), Italic, 33px at 3840w, tracking 200 (0.2em), #FFFFFF */}
        <p className="font-['Manrope'] text-[9px] sm:text-[12px] lg:text-[calc(33*var(--u))] font-normal italic tracking-[0.11em] sm:tracking-[0.2em] uppercase text-[#FFFFFF]/95 lg:text-[#FFFFFF] leading-snug lg:leading-none mt-3.5 sm:mt-5 lg:mt-[calc(60*var(--u))] max-w-[94vw] whitespace-nowrap">
          {subtitle}
        </p>

        {/* Action Buttons: Manrope-SemiBold (600), 30px at 3840w, tracking 100 (0.1em), #FFFFFF */}
        <div className="luma-hero-buttons flex flex-row items-center justify-center gap-2.5 sm:gap-4 lg:gap-[calc(26*var(--u))] mt-6 sm:mt-8 lg:mt-[calc(61*var(--u))] w-full max-w-[335px] sm:max-w-none">
          <a
            href={exploreBtnLink}
            className="flex-1 sm:flex-initial sm:w-[165px] lg:w-[calc(374*var(--u))] h-[38px] sm:h-[42px] lg:h-[calc(90*var(--u))] inline-flex items-center justify-center rounded-[5px] lg:rounded-[calc(10*var(--u))] text-[10px] sm:text-[12px] lg:text-[calc(30*var(--u))] font-semibold tracking-[0.08em] sm:tracking-[0.1em] uppercase border border-white/85 bg-black/35 backdrop-blur-[2px] lg:backdrop-blur-none lg:bg-black/25 text-[#FFFFFF] hover:bg-white hover:text-black hover:border-white transition-all leading-none whitespace-nowrap"
          >
            {exploreBtnText}
          </a>
          <a
            href={findPanelBtnLink}
            className="flex-1 sm:flex-initial sm:w-[180px] lg:w-[calc(411*var(--u))] h-[38px] sm:h-[42px] lg:h-[calc(90*var(--u))] inline-flex items-center justify-center rounded-[5px] lg:rounded-[calc(10*var(--u))] text-[10px] sm:text-[12px] lg:text-[calc(30*var(--u))] font-semibold tracking-[0.08em] sm:tracking-[0.1em] uppercase border border-white/85 bg-black/35 backdrop-blur-[2px] lg:backdrop-blur-none lg:bg-black/25 text-[#FFFFFF] hover:bg-[#EC2024] hover:border-[#EC2024] hover:text-white transition-all leading-none whitespace-nowrap"
          >
            {findPanelBtnText}
          </a>
        </div>
      </div>

      {/* Carousel Pagination Dots (PSD Group 36, y=1724..1743) & Mouse Scroll Indicator (y=1801..1905) */}
      <div className="absolute bottom-4 sm:bottom-5 lg:bottom-[calc(9*var(--u))] left-1/2 -translate-x-1/2 flex flex-col items-center z-20 select-none">
        {/* 4 Pagination Dots: 19x19px at 3840w, gap 10px at 3840w */}
        <div
          className="flex items-center gap-2 lg:gap-[calc(10*var(--u))] mb-2.5 sm:mb-3 lg:mb-[calc(58*var(--u))]"
          aria-label="Slide navigation"
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] lg:w-[calc(19*var(--u))] lg:h-[calc(19*var(--u))] rounded-full transition-all cursor-pointer ${
                currentSlideIdx === idx
                  ? 'bg-[#EC2024] scale-110 shadow-sm shadow-[#EC2024]/50'
                  : 'bg-[#4A4A4A] hover:bg-[#777777]'
              }`}
            />
          ))}
        </div>

        {/* Authentic Mouse Scroll Indicator (43x104px at 3840w) */}
        <a
          href="#about"
          className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:translate-y-1"
          aria-label="Scroll down to About LUMA"
          title="Scroll down"
        >
          <img
            src="/assets/mouse-scroll.png"
            alt="Mouse scroll down"
            className="w-[14px] sm:w-[16px] lg:w-[calc(43*var(--u))] h-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity animate-mouse-bounce"
          />
        </a>
      </div>
    </main>
  );
}
