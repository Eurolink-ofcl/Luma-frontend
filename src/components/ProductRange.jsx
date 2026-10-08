import React, { useState } from 'react';

const products = [
  {
    id: 'luma-glow',
    name: 'LUMA GLOW',
    category: 'Face mask',
    price: 'AED 1,650',
    description:
      'Precision therapy for targeted results in just 10 minutes daily. Like a powerful multivitamin for your cells—clinical-grade power that fits anywhere, addressing fine lines and clarity.',
    image: '/assets/products/luma-glow.png',
    badge: 'Best Seller',
    specs: ['7 Wavelengths', 'Medical Grade Silicone', 'Wireless Remote'],
  },
  {
    id: 'luma-go',
    name: 'LUMA Go',
    category: 'Red light panel',
    price: 'AED 2,150',
    description:
      "Ten minutes. That's all it takes. The LUMA Go brings clinical-grade red and near-infrared light therapy into a handheld device compact enough to travel anywhere.",
    image: '/assets/products/luma-go.png',
    badge: 'Portable Power',
    specs: ['8 Wavelengths', 'Targeted Treatment', 'Built-in Stand'],
  },
  {
    id: 'luma-nova',
    name: 'LUMA NOVA',
    category: 'Red light panel',
    price: 'AED 3,480',
    description:
      'Precision therapy for targeted results in just 10 minutes daily. Like a powerful multivitamin for your cells—clinical-grade power that fits anywhere addressing deep full-body recovery.',
    image: '/assets/products/luma-nova.png',
    badge: 'Flagship 1060nm',
    specs: ['9 Wavelengths (Incl. 1060nm)', 'Full Body Coverage', 'Touchscreen Timer'],
  },
];

export default function ProductRange({ onAddToCart }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section
      id="products"
      className="relative w-full bg-[#FFFFFF] text-[#131313] py-20 lg:py-28 2xl:py-36 4xl:py-44 overflow-hidden font-['Manrope'] border-t border-gray-100"
    >
      <div className="products-container max-w-[1400px] 2xl:max-w-[1750px] 3xl:max-w-[1950px] 4xl:max-w-[2300px] mx-auto px-6 lg:px-12 2xl:px-16 4xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 2xl:mb-20">
          <div>
            <p className="text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-[0.24em] font-semibold mb-3">
              <span className="text-[#131313]">PRODUCT </span>
              <span className="text-[#EC2024]">RANGE</span>
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] 2xl:text-[54px] 4xl:text-[64px] font-bold tracking-tight uppercase leading-tight text-[#131313]">
              LUMA RED LIGHT PANELS
            </h2>
            <p className="text-[#555555] text-sm sm:text-[15px] 2xl:text-base 4xl:text-lg leading-relaxed font-normal mt-3">
              Featuring exclusive 1060nm — unavailable from any competitor in Global.
            </p>
          </div>

          {/* View All & Carousel Controls */}
          <div className="flex items-center gap-6 shrink-0">
            <a
              href="#all-products"
              className="text-xs sm:text-sm 2xl:text-base font-bold uppercase tracking-[0.14em] text-[#131313] hover:text-[#EC2024] flex items-center gap-1.5 transition-colors group"
            >
              VIEW ALL
              <span className="text-[#EC2024] group-hover:translate-x-1 transition-transform">
                &gt;
              </span>
            </a>

            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous product"
                className="w-10 2xl:w-12 h-10 2xl:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#EC2024] hover:text-[#EC2024] hover:bg-red-50/50 transition-all cursor-pointer text-sm 2xl:text-base"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next product"
                className="w-10 2xl:w-12 h-10 2xl:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#EC2024] hover:text-[#EC2024] hover:bg-red-50/50 transition-all cursor-pointer text-sm 2xl:text-base"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Products Grid - Unboxed cards matching PSD Group 19 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 2xl:gap-14 4xl:gap-16">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between transition-all duration-300 select-none"
            >
              <div>
                {/* Product Showcase Frame matching PSD Rectangle 52 (800x800 square, #F3F3F3) */}
                <div className="relative w-full aspect-square bg-[#F3F3F3] rounded-[18px] 2xl:rounded-[24px] 4xl:rounded-[30px] flex items-center justify-center p-8 2xl:p-12 overflow-hidden mb-6 2xl:mb-8 shadow-xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-md"
                  />
                </div>

                {/* Typography matching PSD Group 19 */}
                <div className="mb-5 2xl:mb-6">
                  <h3 className="text-xl sm:text-2xl 2xl:text-3xl 4xl:text-4xl font-extrabold tracking-tight uppercase text-[#131313] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm 2xl:text-base italic uppercase tracking-wider text-[#777777] font-medium mb-3">
                    {product.category}
                  </p>
                  <p className="text-[#555555] text-xs sm:text-[14px] 2xl:text-[15.5px] 4xl:text-[17px] leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Action Button (PSD Rectangle 11: left-aligned pill button width ~280px) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onAddToCart && onAddToCart(product)}
                  className="w-full sm:w-auto min-w-[150px] 2xl:min-w-[180px] 4xl:min-w-[210px] inline-flex items-center justify-center py-3.5 2xl:py-4.5 4xl:py-5 px-8 2xl:px-10 rounded-[6px] 2xl:rounded-[8px] bg-[#EC2024] hover:bg-[#c9181b] text-white font-bold text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots matching PSD Group 19 Nav (Ellipse 6) */}
        <div className="flex items-center justify-center gap-2.5 2xl:gap-3.5 mt-10 2xl:mt-14 select-none">
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => setActiveIndex(dot % products.length)}
              aria-label={`Product slide ${dot + 1}`}
              className={`w-2.5 h-2.5 2xl:w-3 2xl:h-3 rounded-full transition-all cursor-pointer ${
                activeIndex === dot % products.length
                  ? 'bg-[#EC2024] scale-110 shadow-[0_0_8px_rgba(236,32,36,0.6)]'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
