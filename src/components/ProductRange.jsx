import React, { useState } from 'react';

const products = [
  {
    id: 'luma-glow',
    brandPrefix: 'LUMA ',
    modelSuffix: 'GLOW',
    category: 'FACE MASK',
    price: 'AED 1,650',
    description:
      'Precision therapy for targeted results in just 10 minutes daily. Like a powerful multivitamin for your cells-clinical-grade power that fits anywhere, addressing.',
    image: '/assets/products/luma-glow.png',
  },
  {
    id: 'luma-go',
    brandPrefix: 'LUMA ',
    modelSuffix: 'GO',
    category: 'RED LIGHT PANEL',
    price: 'AED 2,150',
    description:
      "Ten minutes. That's all it takes. The luma go brings clinical-grade red and near-infrared light therapy into a handheld device compact enough to travel...",
    image: '/assets/products/luma-go.png',
  },
  {
    id: 'luma-nova',
    brandPrefix: 'LUMA ',
    modelSuffix: 'NOVA',
    category: 'RED LIGHT PANEL',
    price: 'AED 3,480',
    description:
      'Precision therapy for targeted results in just 10 minutes daily. Like a powerful multivitamin for your cells-clinical-grade power that fits anywhere addressing.',
    image: '/assets/products/luma-nova.png',
  },
];

export default function ProductRange({ onAddToCart }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % 4);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + 4) % 4);
  };

  return (
    <section
      id="products"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#131313] py-16 lg:pt-[calc(166*var(--u))] lg:pb-[calc(168*var(--u))] overflow-hidden font-['Manrope'] border-t border-[#E5E5E5]"
    >
      <div className="products-container relative w-full max-w-[1400px] lg:max-w-none mx-auto px-6 lg:px-0">
        {/* Centered Section Header (PSD Group 19: y=8831..9071 on 3840w canvas) */}
        <div className="relative text-center mx-auto lg:pl-[calc(523*var(--u))] lg:pr-[calc(517*var(--u))]">
          {/* 'PRODUCT RANGE': Manrope-Medium (500), 40px at 3840w, tracking 20 (0.02em), #131313 */}
          <p className="text-xs sm:text-sm lg:text-[calc(40*var(--u))] uppercase tracking-[0.02em] font-medium text-[#131313] leading-none">
            PRODUCT RANGE
          </p>

          {/* 'LUMA RED LIGHT PANELS': Manrope-ExtraLight (200), 80px at 3840w, tracking 20 (0.02em), #ED2024 + #131313, gap 47px */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[calc(80*var(--u))] font-extralight tracking-[0.02em] uppercase leading-none mt-3 lg:mt-[calc(47*var(--u))]">
            <span className="text-[#ED2024]">LUMA RED LIGHT </span>
            <span className="text-[#131313]">PANELS</span>
          </h2>

          {/* Subtitle & Right-Aligned VIEW ALL > on the same baseline (y=9037..9071, gap 71px) */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center mt-4 lg:mt-[calc(71*var(--u))]">
            <p className="text-[#555555] text-xs sm:text-sm lg:text-[calc(30*var(--u))] leading-none font-normal tracking-[0.02em]">
              Featuring exclusive 1060nm - unavailable from any competitor in Global
            </p>

            {/* VIEW ALL BUTTON (PSD x=3168..3323, y=9037..9063: Manrope-Medium 30px, #555555, red chevron 16x26) */}
            <a
              href="#all-products"
              className="mt-3 sm:mt-0 sm:absolute sm:right-0 text-xs sm:text-sm lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#555555] hover:text-[#ED2024] inline-flex items-center gap-1 lg:gap-[calc(8*var(--u))] leading-none transition-colors group"
            >
              <span>VIEW ALL</span>
              <svg
                viewBox="0 0 16 26"
                fill="none"
                className="w-2.5 h-3.5 lg:w-[calc(16*var(--u))] lg:h-[calc(26*var(--u))] text-[#ED2024] group-hover:translate-x-0.5 transition-transform"
              >
                <path
                  d="M2 2L13 13L2 24"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Cards Row Wrapper with Left & Right PSD Flanking Arrows */}
        <div className="relative mt-10 lg:mt-[calc(159*var(--u))] w-full">
          {/* Left Carousel Arrow (PSD 'Vector Smart Object copy': bbox=(330, 9630, 407, 9759), w=77, h=129, opacity=26/255) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous product"
            className="hidden lg:flex items-center justify-center absolute left-[calc(330*var(--u))] top-[calc(400*var(--u))] -translate-y-1/2 w-[calc(77*var(--u))] h-[calc(129*var(--u))] text-[#000000] opacity-[0.12] hover:opacity-60 transition-opacity cursor-pointer z-20"
          >
            <svg viewBox="0 0 77 129" fill="none" className="w-full h-full">
              <path
                d="M68 6L9 64.5L68 123"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Right Carousel Arrow (PSD 'Vector Smart Object copy 2': bbox=(3339, 9630, 3416, 9759), w=77, h=129, opacity=255/255) */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next product"
            className="hidden lg:flex items-center justify-center absolute left-[calc(3339*var(--u))] top-[calc(400*var(--u))] -translate-y-1/2 w-[calc(77*var(--u))] h-[calc(129*var(--u))] text-[#000000] opacity-100 hover:text-[#ED2024] transition-colors cursor-pointer z-20"
          >
            <svg viewBox="0 0 77 129" fill="none" className="w-full h-full">
              <path
                d="M9 6L68 64.5L9 123"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 3-Column Products Grid (PSD x=523..3223, 3 cards of 800px width, gap 150px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[calc(150*var(--u))] lg:pl-[calc(523*var(--u))] lg:pr-[calc(617*var(--u))]">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col justify-between w-full lg:w-[calc(800*var(--u))] transition-all duration-300 select-none"
              >
                <div>
                  {/* Product Showcase Frame matching PSD Rectangle 52 (800x800 square, #F3F3F3, sharp corners) */}
                  <div className="relative w-full aspect-square lg:w-[calc(800*var(--u))] lg:h-[calc(800*var(--u))] bg-[#F3F3F3] rounded-none flex items-center justify-center p-8 lg:p-[calc(80*var(--u))] overflow-hidden">
                    <img
                      src={product.image}
                      alt={`${product.brandPrefix}${product.modelSuffix}`}
                      className="max-h-[82%] max-w-[82%] object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Typography matching PSD Group 19 */}
                  <div className="mt-5 lg:mt-[calc(40*var(--u))]">
                    {/* Product Title: Manrope-ExtraBold (800), 50px at 3840w, tracking 20 (0.02em), #0A0A0B + #ED2024 */}
                    <h3 className="text-xl sm:text-2xl lg:text-[calc(50*var(--u))] font-extrabold tracking-[0.02em] uppercase leading-none">
                      <span className="text-[#0A0A0B]">{product.brandPrefix}</span>
                      <span className="text-[#ED2024]">{product.modelSuffix}</span>
                    </h3>

                    {/* Category: Manrope-Medium (500) Italic, 30px at 3840w, tracking 20 (0.02em), #0A0A0B, gap 29px */}
                    <p className="text-xs sm:text-sm lg:text-[calc(30*var(--u))] italic uppercase tracking-[0.02em] text-[#0A0A0B] font-medium leading-none mt-2 lg:mt-[calc(29*var(--u))]">
                      {product.category}
                    </p>

                    {/* Description: Manrope-Regular (400), 30px at 3840w, leading 48px (1.6), tracking 20 (0.02em), #000000, gap 44px */}
                    <p className="text-[#000000] text-xs sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal leading-[1.6] tracking-[0.02em] mt-3 lg:mt-[calc(44*var(--u))]">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Action Button (PSD CTA1 / Rectangle 11: w=280, h=86, #0A0A0B background, Manrope-SemiBold 32px, tracking 50 / 0.05em, #FFFFFF, gap 42px) */}
                <div className="mt-5 lg:mt-[calc(42*var(--u))]">
                  <button
                    type="button"
                    onClick={() => onAddToCart && onAddToCart(product)}
                    className="w-full sm:w-auto px-7 py-3 lg:px-0 lg:py-0 lg:w-[calc(280*var(--u))] lg:h-[calc(86*var(--u))] inline-flex items-center justify-center rounded-[5px] lg:rounded-[calc(10*var(--u))] bg-[#0A0A0B] hover:bg-[#ED2024] text-[#FFFFFF] font-semibold text-xs sm:text-sm lg:text-[calc(32*var(--u))] uppercase tracking-[0.05em] leading-none transition-colors duration-300 cursor-pointer"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots matching PSD Group 19 Nav (y=10550..10570, gap 92px below buttons, 4 dots of 20x20px, gap 10px) */}
        <div className="flex items-center justify-center gap-2 lg:gap-[calc(10*var(--u))] mt-10 lg:mt-[calc(92*var(--u))] select-none">
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => setActiveIndex(dot)}
              aria-label={`Product slide ${dot + 1}`}
              className={`w-2.5 h-2.5 lg:w-[calc(20*var(--u))] lg:h-[calc(20*var(--u))] rounded-full transition-all cursor-pointer ${
                activeIndex === dot
                  ? 'bg-[#ED2024]'
                  : 'bg-[#CCCCCC] hover:bg-[#999999]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
