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
            <div className="w-16 2xl:w-20 4xl:w-24 h-1 2xl:h-1.5 bg-[#EC2024] mt-4 mb-3" />
            <p className="text-[#555555] text-sm sm:text-[15px] 2xl:text-base 4xl:text-lg leading-relaxed font-normal">
              Featuring exclusive 1060nm — unavailable from any competitor in Global.
            </p>
          </div>

          {/* View All & Carousel Controls */}
          <div className="flex items-center gap-6 shrink-0">
            <a
              href="#all-products"
              className="text-xs sm:text-sm 2xl:text-base font-semibold uppercase tracking-[0.12em] text-[#131313] hover:text-[#EC2024] flex items-center gap-1.5 transition-colors group"
            >
              VIEW ALL
              <span className="text-[#EC2024] group-hover:translate-x-1 transition-transform">
                &rarr;
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

        {/* 3-Column Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 2xl:gap-14 4xl:gap-16">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-[#FAFAFA] rounded-[20px] 2xl:rounded-[26px] 4xl:rounded-[32px] p-6 sm:p-8 2xl:p-10 4xl:p-12 flex flex-col justify-between border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Product Showcase Frame (Rectangle 52) */}
              <div>
                <div className="relative w-full aspect-square bg-[#F0F0F0] rounded-[16px] 2xl:rounded-[22px] flex items-center justify-center p-8 2xl:p-12 overflow-hidden mb-7 2xl:mb-9">
                  {/* Badge */}
                  <span className="absolute top-4 left-4 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#131313] rounded-full shadow-xs">
                    {product.badge}
                  </span>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-md"
                  />
                </div>

                {/* Typography */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-xl sm:text-2xl 2xl:text-3xl 4xl:text-4xl font-bold tracking-tight text-[#131313]">
                      {product.name}
                    </h3>
                    <span className="text-sm 2xl:text-base 4xl:text-lg font-semibold text-[#EC2024]">
                      {product.price}
                    </span>
                  </div>
                  <p className="text-xs 2xl:text-sm 4xl:text-base uppercase tracking-wider text-[#EC2024] font-medium mb-3">
                    {product.category}
                  </p>
                  <p className="text-[#666666] text-xs sm:text-[13.5px] 2xl:text-[15px] 4xl:text-[17px] leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Action Button (Rectangle 11) */}
              <div>
                <button
                  type="button"
                  onClick={() => onAddToCart && onAddToCart(product)}
                  className="w-full inline-flex items-center justify-center py-3.5 2xl:py-4.5 4xl:py-5 px-6 rounded-[6px] 2xl:rounded-[8px] bg-[#EC2024] hover:bg-[#c9181b] text-white font-semibold text-xs sm:text-sm 2xl:text-base 4xl:text-lg uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
