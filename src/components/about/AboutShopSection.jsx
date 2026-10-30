import React from 'react';

const aboutProducts = [
  {
    id: 'luma-glow-mask',
    eyebrow: 'LUMA GLOW FACE MASK',
    titleLine1: 'LUMA FACE LED',
    titleLine2: 'LIGHT THERAPY MASK',
    priceText: '1,299 AED',
    price: 1299,
    image: '/assets/about/product-glow-mask.png',
    imgW: 404,
    imgH: 323,
    imgLeft: 97,
    imgTop: 227,
  },
  {
    id: 'luma-nova',
    eyebrow: 'LUMA NOVA',
    titleLine1: 'LED TARGETED',
    titleLine2: 'RED LIGHT THERAPY PANEL',
    priceText: '2,599 AED',
    price: 2599,
    image: '/assets/about/product-luma-nova.png',
    imgW: 289,
    imgH: 435,
    imgLeft: 119,
    imgTop: 175,
  },
  {
    id: 'luma-apex',
    eyebrow: 'LUMA APEX',
    titleLine1: 'HALF-BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    priceText: '6,599 AED',
    price: 6599,
    image: '/assets/about/product-luma-apex.png',
    imgW: 170,
    imgH: 619,
    imgLeft: 208,
    imgTop: 65,
  },
  {
    id: 'luma-max',
    eyebrow: 'LUMA MAX',
    titleLine1: 'FULL-BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    priceText: '8,599 AED',
    price: 8599,
    image: '/assets/about/product-luma-max.png',
    imgW: 138,
    imgH: 639,
    imgLeft: 227,
    imgTop: 41,
  },
];

export default function AboutShopSection({ onNavigateHome }) {
  return (
    <section
      id="about-shop"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] py-14 sm:py-16 lg:pt-[calc(177*var(--u))] lg:pb-[calc(176*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* Doctor Advisory Banner (PSD Group 48: x = 520..3323 (2803w), y = 9021..9314 (293h), r = 35px, fill #000000) */}
        <div className="lg:pl-[calc(520*var(--u))] lg:pr-[calc(517*var(--u))]">
          <div className="w-full lg:w-[calc(2803*var(--u))] lg:min-h-[calc(293*var(--u))] rounded-[18px] sm:rounded-[24px] lg:rounded-[calc(35*var(--u))] bg-[#000000] text-[#FFFFFF] p-6 sm:p-8 lg:pl-[calc(141*var(--u))] lg:pr-[calc(143*var(--u))] lg:py-[calc(68*var(--u))] flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 lg:gap-[calc(68*var(--u))]">
            {/* Warning Icon (PSD 'warning': 158 x 158 at 3840w) */}
            <img
              src="/assets/about/warning-icon.png"
              alt="Safety Notice"
              className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] lg:w-[calc(158*var(--u))] lg:h-[calc(158*var(--u))] object-contain shrink-0 select-none"
            />

            <div className="flex-1 flex flex-col items-start">
              {/* Heading: "WHO SHOULD CHECK WITH A DOCTOR FIRST" — 40px at 3840w, Manrope-Bold (700), tracking 20 (0.02em), uppercase, #FFFFFF */}
              <h3 className="text-[15px] sm:text-[18px] lg:text-[calc(40*var(--u))] font-bold uppercase tracking-[0.02em] text-[#FFFFFF] leading-snug lg:leading-none">
                WHO SHOULD CHECK WITH A DOCTOR FIRST
              </h3>

              {/* Body: 30px at 3840w, Manrope-Regular (400), leading 40px (1.333), tracking 20 (0.02em), #FFFFFF */}
              <p className="mt-2.5 sm:mt-3 lg:mt-[calc(38*var(--u))] text-[12px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#FFFFFF] leading-[1.45] lg:leading-[calc(40*var(--u))]">
                Red light therapy is well tolerated by most people. If you&apos;re pregnant, have a photosensitivity condition, are on medication that increases light sensitivity, or have a history of skin cancer, speak with a doctor before starting a routine &mdash; always use the eye protection included with your device.
              </p>
            </div>
          </div>
        </div>

        {/* Centered Header: "READY WHEN YOU ARE / FIND YOUR DEVICE" (PSD y = 9490..9833, 176px below Group 48) */}
        <div className="mt-12 sm:mt-16 lg:mt-[calc(176*var(--u))] text-center flex flex-col items-center">
          {/* Eyebrow: "READY WHEN YOU ARE" — 50px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #000000 */}
          <p className="text-[15px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#000000] leading-none">
            READY WHEN YOU ARE
          </p>

          {/* Main Heading: "FIND YOUR DEVICE" — 100px at 3840w, Manrope-ExtraBold (800), tracking 20 (0.02em), uppercase, #D61611 */}
          <h2 className="mt-2 sm:mt-3 lg:mt-[calc(37*var(--u))] text-[28px] sm:text-[38px] md:text-[46px] lg:text-[calc(100*var(--u))] font-extrabold uppercase tracking-[0.02em] text-[#D61611] leading-none">
            FIND YOUR DEVICE
          </h2>

          {/* Subtitle: "FREE SHIPPING ACROSS THE UAE · 60-NIGHT TRIAL · 3-YEAR WARRANTY" — 40px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #000000 */}
          <p className="mt-3 sm:mt-4 lg:mt-[calc(37*var(--u))] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[calc(40*var(--u))] font-normal uppercase tracking-[0.02em] text-[#000000] leading-snug lg:leading-none">
            FREE SHIPPING ACROSS THE UAE &middot; 60-NIGHT TRIAL &middot; 3-YEAR WARRANTY
          </p>

          {/* CTA Button: "SHOP NOW" (PSD 'Shop Now': 290 x 86 at 3840w, r = 10px, fill #ED2024, 38px below subtitle) */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateHome) onNavigateHome('#products');
            }}
            className="mt-5 sm:mt-6 lg:mt-[calc(38*var(--u))] w-[140px] h-[42px] sm:w-[160px] sm:h-[46px] lg:w-[calc(290*var(--u))] lg:h-[calc(86*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#ED2024] hover:bg-[#d4191d] text-[#FFFFFF] text-[12px] sm:text-[14px] lg:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-colors cursor-pointer"
          >
            SHOP NOW
          </button>
        </div>

        {/* 4 Product Cards Row + Arrows (PSD 'SHOP ': y = 9934..11024, 101px below Shop Now button) */}
        <div className="relative mt-10 sm:mt-12 lg:mt-[calc(101*var(--u))]">
          {/* Left Arrow (PSD Vector Smart Object copy: bbox=(379, 10259, 429, 10351) -> 50x92, opacity 51/255 = 20%) */}
          <button
            type="button"
            aria-label="Previous products"
            className="hidden lg:flex absolute left-[calc(379*var(--u))] top-[calc(325*var(--u))] w-[calc(50*var(--u))] h-[calc(92*var(--u))] items-center justify-center opacity-20 hover:opacity-50 transition-opacity cursor-pointer"
          >
            <img
              src="/assets/about/shop-arrow-left.png"
              alt=""
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </button>

          {/* 4 Product Cards Grid (PSD Group 50 / copy / copy 2 / copy 3: x = 521..1100, 1262..1841, 2002..2581, 2743..3322 -> 579w each, gap ~161.67px) */}
          <div className="lg:pl-[calc(521*var(--u))] lg:pr-[calc(518*var(--u))] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-8 lg:gap-[calc(161.67*var(--u))]">
            {aboutProducts.map((product) => (
              <div
                key={product.id}
                className="w-full lg:w-[calc(579*var(--u))] flex flex-col items-center text-center"
              >
                {/* Gray Rounded Product Image Box (PSD Rectangle 23: 579 x 741 at 3840w, r = 53px, fill #F3F3F3) */}
                <div className="relative w-full aspect-[579/741] lg:w-[calc(579*var(--u))] lg:h-[calc(741*var(--u))] rounded-[24px] sm:rounded-[32px] lg:rounded-[calc(53*var(--u))] bg-[#F3F3F3] flex items-center justify-center overflow-hidden p-6 lg:p-0">
                  <img
                    src={product.image}
                    alt={product.eyebrow}
                    style={{
                      '--pw': `${product.imgW}`,
                      '--ph': `${product.imgH}`,
                      '--pl': `${product.imgLeft}`,
                      '--pt': `${product.imgTop}`,
                    }}
                    className="max-h-[82%] w-auto object-contain lg:max-h-none lg:absolute lg:left-[calc(var(--pl)*var(--u))] lg:top-[calc(var(--pt)*var(--u))] lg:w-[calc(var(--pw)*var(--u))] lg:h-[calc(var(--ph)*var(--u))] select-none transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>

                {/* Product Eyebrow: 30px at 3840w, Manrope-Regular (400), tracking 50-60 (0.055em), uppercase, #000000 (39px below card) */}
                <p className="mt-4 sm:mt-5 lg:mt-[calc(39*var(--u))] text-[12px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-normal uppercase tracking-[0.055em] text-[#000000] leading-none">
                  {product.eyebrow}
                </p>

                {/* Product Title: 40px at 3840w, Manrope-Medium (500), leading 50px (1.25), tracking 50-60 (0.055em), uppercase, #000000 (38px below eyebrow) */}
                <h3 className="mt-2 sm:mt-2.5 lg:mt-[calc(38*var(--u))] text-[15px] sm:text-[17px] lg:text-[calc(40*var(--u))] font-medium uppercase tracking-[0.055em] text-[#000000] leading-[1.25] lg:leading-[calc(50*var(--u))]">
                  <span className="block">{product.titleLine1}</span>
                  <span className="block">{product.titleLine2}</span>
                </h3>

                {/* Product Price: 30px at 3840w, Manrope-SemiBold (600), tracking 50 (0.05em), uppercase, #ED2024 (40px below title) */}
                <p className="mt-2.5 sm:mt-3 lg:mt-[calc(40*var(--u))] text-[13px] sm:text-[14px] lg:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.05em] text-[#ED2024] leading-none">
                  {product.priceText}
                </p>

                {/* Add To Bag Button (PSD Group 49 -> Rectangle 24: 261 x 66 at 3840w, r = 10px, fill #010101, 36px below price) */}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateHome) onNavigateHome('#products');
                  }}
                  className="mt-3 sm:mt-4 lg:mt-[calc(36*var(--u))] w-[130px] h-[36px] sm:w-[140px] sm:h-[38px] lg:w-[calc(261*var(--u))] lg:h-[calc(66*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#010101] hover:bg-[#222222] text-[#FFFFFF] text-[11px] sm:text-[12px] lg:text-[calc(30*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-colors cursor-pointer"
                >
                  ADD TO BAG
                </button>
              </div>
            ))}
          </div>

          {/* Right Arrow (PSD Vector Smart Object: bbox=(3415, 10259, 3465, 10351) -> 50x92, opacity 100%) */}
          <button
            type="button"
            aria-label="Next products"
            className="hidden lg:flex absolute left-[calc(3415*var(--u))] top-[calc(325*var(--u))] w-[calc(50*var(--u))] h-[calc(92*var(--u))] items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
          >
            <img
              src="/assets/about/shop-arrow-right.png"
              alt=""
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
