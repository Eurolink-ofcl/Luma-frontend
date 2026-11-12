import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

const filterCategories = [
  { id: 'all', label: 'ALL DEVICES' },
  { id: 'face-mask', label: 'FACE MASK' },
  { id: 'portable', label: 'PORTABLE' },
  { id: 'half-body', label: 'HALF BODY' },
  { id: 'full-body', label: 'FULL BODY' },
  { id: 'accessories', label: 'ACCESSORIES' },
];

const catalogProducts = [
  {
    id: 'product-1',
    category: 'face-mask',
    image: '/assets/products/list-product-1.jpg',
    eyebrow: 'LUMA GLOW',
    titleLine1: 'LUMA FACE LED',
    titleLine2: 'LIGHT THERAPY MASK',
    description:
      'A lightweight, wearable face mask designed for effortless daily treatments \u2014 simply wear it, relax, and let the light rejuvenate your skin.',
    descMaxW: 982,
    price: '1,200 AED',
    oldPrice: '2,200.00 AED',
  },
  {
    id: 'product-2',
    category: 'portable',
    image: '/assets/products/list-product-2.jpg',
    eyebrow: 'LUMA GO',
    titleLine1: 'LUMA TARGETED RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    description:
      'Built for the areas that need the most attention \u2014 back, shoulders, legs. Surge covers a wider treatment zone for pain relief and faster post-workout recovery.',
    descMaxW: 946,
    price: '1,890 AED',
    oldPrice: '2,890.00 AED',
  },
  {
    id: 'product-3',
    category: 'half-body',
    image: '/assets/products/list-product-3.jpg',
    eyebrow: 'LUMA NOVA',
    titleLine1: 'HALF BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    description:
      'Designed to treat larger areas in a single session, the Half Body Panel delivers powerful red and near-infrared light therapy to support muscle recovery, joint comfort, skin rejuvenation, and everyday wellness',
    descMaxW: 1012,
    price: '2,100 AED',
    oldPrice: '3,100.00 AED',
  },
  {
    id: 'product-4',
    category: 'half-body',
    image: '/assets/products/list-product-4.jpg',
    eyebrow: 'LUMA SURGE',
    titleLine1: 'HALF BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    description:
      'Our largest and most powerful panel. Full-body coverage in a single session \u2014 built for athletes and serious daily users who want maximum output.',
    descMaxW: 954,
    price: '2,890 AED',
    oldPrice: '3,890.00 AED',
  },
  {
    id: 'product-5',
    category: 'half-body',
    image: '/assets/products/list-product-5.jpg',
    eyebrow: 'LUMA APEX',
    titleLine1: 'HALF BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    description:
      'Designed to treat larger areas in a single session, the Half Body Panel delivers powerful red and near-infrared light therapy to support muscle recovery, joint comfort, skin rejuvenation, and everyday wellness',
    descMaxW: 1012,
    price: '3,800 AED',
    oldPrice: '4,800.00 AED',
  },
  {
    id: 'product-6',
    category: 'full-body',
    image: '/assets/products/list-product-6.jpg',
    eyebrow: 'LUMA SURGE',
    titleLine1: 'HALF BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    description:
      'Our largest and most powerful panel. Full-body coverage in a single session \u2014 built for athletes and serious daily users who want maximum output.',
    descMaxW: 954,
    price: '4,890 AED',
    oldPrice: '5,890.00 AED',
  },
  {
    id: 'product-7',
    category: 'full-body',
    image: '/assets/products/list-product-7.jpg',
    eyebrow: 'LUMA MAX',
    titleLine1: 'FULL BODY RED',
    titleLine2: 'LIGHT THERAPY PANEL',
    description:
      'Designed to treat larger areas in a single session, the Half Body Panel delivers powerful red and near-infrared light therapy to support muscle recovery, joint comfort, skin rejuvenation, and everyday wellness.',
    descMaxW: 1012,
    price: '5,890 AED',
    oldPrice: '6,800.00 AED',
  },
];

export default function ProductsCatalogSection({
  onNavigateHome,
  onOpenCart,
  onNavigate,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [liveProducts, setLiveProducts] = useState(null);
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  // Fetch live products from MongoDB Atlas
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.map((p, idx) => {
            const order = p.displayOrder !== undefined ? p.displayOrder : idx + 1;

            let t1 = p.titleLine1;
            let t2 = p.titleLine2;
            if (!t1 && !t2) {
              const fullTitle = p.subtitle || p.name || '';
              if (fullTitle.includes('\n') || fullTitle.includes('\r')) {
                const parts = fullTitle.split(/[\r\n]+/);
                t1 = parts[0]?.trim() || '';
                t2 = parts.slice(1).join(' ').trim() || '';
              } else {
                t1 = fullTitle;
              }
            }

            return {
              id: p._id || p.slug || `prod-${idx}`,
              slug: p.slug,
              displayOrder: order,
              category: p.category || 'half-body',
              image: p.image || p.thumbnail || `/assets/products/list-product-${(idx % 7) + 1}.jpg`,
              eyebrow: p.eyebrow || p.name,
              titleLine1: t1 || p.name,
              titleLine2: t2 || '',
              description: p.description || p.details || '',
              descMaxW: 1000,
              price: p.price,
              oldPrice: p.originalPrice || null,
            };
          });
          setLiveProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Notice: Loading default catalog products:', err.message);
      });
  }, []);

  const productList = liveProducts || catalogProducts;

  const filteredProducts =
    activeCategory === 'all'
      ? productList
      : productList.filter((p) => p.category === activeCategory);

  const displayList = filteredProducts.length > 0 ? filteredProducts : productList;

  return (
    <section
      id="products-catalog"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="relative w-full bg-[#FFFFFF] text-[#000000] pt-8 sm:pt-12 lg:pt-[calc(105*var(--u))] pb-14 sm:pb-16 lg:pb-[calc(176*var(--u))] overflow-hidden font-['Manrope']"
    >
      <div className="w-full max-w-[1440px] lg:max-w-none mx-auto px-6 sm:px-10 lg:px-0">
        {/* 1. Breadcrumb Row (PSD 'Link': x = 521..850, y = 955..1001) */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center lg:pl-[calc(521*var(--u))]"
        >
          <a
            href="/"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            aria-label="Home"
            className="inline-flex items-center justify-center hover:opacity-75 transition-opacity shrink-0"
          >
            <img
              src="/assets/about/home-icon.png"
              alt="Home"
              className="w-[18px] h-[19px] sm:w-[20px] sm:h-[21px] lg:w-[calc(40*var(--u))] lg:h-[calc(43*var(--u))] object-contain block"
            />
          </a>

          {/* Slash '/' — 60px at 3840w, Manrope-ExtraLight (200), #000000 */}
          <span className="ml-3 sm:ml-4 lg:ml-[calc(29*var(--u))] text-[24px] sm:text-[28px] lg:text-[calc(60*var(--u))] font-extralight text-[#000000] leading-none select-none">
            /
          </span>

          {/* "LUMA Products" — 30px at 3840w, Manrope-Medium (500), "LUMA " #010102 + "Products" #ED2024 */}
          <span className="ml-3 sm:ml-4 lg:ml-[calc(30*var(--u))] text-[13px] sm:text-[15px] lg:text-[calc(30*var(--u))] font-medium tracking-normal leading-none lg:mt-[calc(8*var(--u))]">
            <span className="text-[#010102]">LUMA </span>
            <span className="text-[#ED2024]">Products</span>
          </span>
        </nav>

        {/* 2. Centered Header: "ALL LUMA / RED LIGHT THERAPY DEVICES" (PSD y = 1098..1255, 97px below breadcrumb) */}
        <div className="mt-8 sm:mt-10 lg:mt-[calc(97*var(--u))] text-center flex flex-col items-center">
          {/* Eyebrow: "ALL LUMA" — 50px at 3840w, Manrope-Regular (400), tracking 20 (0.02em), uppercase, #ED2024 */}
          <p className="text-[15px] sm:text-[18px] lg:text-[calc(50*var(--u))] font-normal uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            ALL LUMA
          </p>

          {/* Main Heading: "RED LIGHT THERAPY DEVICES" — 100px at 3840w, Manrope-ExtraLight (200), tracking 20 (0.02em), uppercase, #000000 */}
          <h2 className="mt-2 sm:mt-3 lg:mt-[calc(44*var(--u))] text-[26px] sm:text-[36px] md:text-[46px] lg:text-[calc(100*var(--u))] font-extralight uppercase tracking-[0.02em] text-[#000000] leading-none">
            RED LIGHT THERAPY DEVICES
          </h2>
        </div>

        {/* 3. 6 Category Filter Pills (PSD Group 36: x = 1057..2783 (1726w), y = 1332..1412 (80h), 77px below heading, each pill 271x80, 20px gap) */}
        <div className="mt-6 sm:mt-8 lg:mt-[calc(77*var(--u))] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:gap-[calc(20*var(--u))]">
          {filterCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`h-[36px] sm:h-[40px] lg:h-[calc(80*var(--u))] px-4 sm:px-5 lg:px-0 lg:w-[calc(271*var(--u))] rounded-full flex items-center justify-center text-[11px] sm:text-[13px] lg:text-[calc(30*var(--u))] font-medium uppercase tracking-[0.02em] text-[#FFFFFF] transition-colors duration-200 cursor-pointer ${
                  isActive ? 'bg-[#F10916]' : 'bg-[#333333] hover:bg-[#444444]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 4. Alternating Product Rows (PSD Product 1..7: y = 1590..8954, 178px below filter pills, 148px vertical gap between rows) */}
        <div className="mt-10 sm:mt-14 lg:mt-[calc(178*var(--u))] lg:pl-[calc(578*var(--u))] lg:pr-[calc(516*var(--u))] flex flex-col gap-12 sm:gap-16 lg:gap-[calc(148*var(--u))]">
          {displayList.map((product, index) => {
            const isImageLeft = index % 2 === 0;
            return (
              <div
                key={product.id}
                className={`w-full flex flex-col ${
                  isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-start justify-between gap-7 sm:gap-9 lg:gap-[calc(148*var(--u))]`}
              >
                {/* Product Lifestyle Image (PSD Rectangle 23: 1325 x 925 at 3840w, r = 50px) */}
                <div className="w-full lg:w-[calc(1325*var(--u))] aspect-[1325/925] lg:h-[calc(925*var(--u))] rounded-[20px] sm:rounded-[28px] lg:rounded-[calc(50*var(--u))] overflow-hidden bg-[#494949] shrink-0">
                  <img
                    src={product.image}
                    alt={`${product.eyebrow} - ${product.titleLine1} ${product.titleLine2}`}
                    className="w-full h-full object-cover object-center block select-none"
                  />
                </div>

                {/* Product Details Column (PSD: width ~1090px, top offset ~132px below image top) */}
                <div className="w-full lg:flex-1 lg:pt-[calc(132*var(--u))] flex flex-col items-start">
                  {/* Eyebrow (PSD Eyebrow: 60px at 3840w, uppercase, #F10916) */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <p className="text-[18px] sm:text-[22px] lg:text-[calc(60*var(--u))] font-normal uppercase tracking-[0.02em] text-[#F10916] leading-none">
                      {product.eyebrow}
                    </p>
                  </div>

                  {/* Product Title: 100px at 3840w, Manrope-SemiBold (600), leading 100px (1.0), tracking 20 (0.02em), uppercase, #000000 (47px below eyebrow) */}
                  <h3 className="mt-2.5 sm:mt-3 lg:mt-[calc(47*var(--u))] text-[26px] sm:text-[34px] md:text-[40px] lg:text-[calc(100*var(--u))] font-semibold uppercase tracking-[0.02em] text-[#000000] leading-[1.05] lg:leading-[calc(100*var(--u))]">
                    {product.titleLine2 ? (
                      <>
                        <span className="block">{product.titleLine1}</span>
                        <span className="block">{product.titleLine2}</span>
                      </>
                    ) : (
                      <span>{product.titleLine1}</span>
                    )}
                  </h3>

                  {/* Description: 30px at 3840w, Manrope-Regular (400), leading 40px (1.333), tracking 20 (0.02em), #000000 (46px below title) */}
                  <p
                    style={{ '--dmw': `${product.descMaxW}` }}
                    className="mt-3.5 sm:mt-4 lg:mt-[calc(46*var(--u))] lg:max-w-[calc(var(--dmw)*var(--u))] text-[13px] sm:text-[15px] lg:text-[calc(30*var(--u))] font-normal tracking-[0.02em] text-[#000000] leading-[1.5] lg:leading-[calc(40*var(--u))]"
                  >
                    {product.description}
                  </p>

                  {/* Price Row (PSD Group 'Price': 52px below description) */}
                  <div className="mt-4 sm:mt-5 lg:mt-[calc(52*var(--u))] flex flex-row items-baseline gap-3 sm:gap-4 lg:gap-[calc(30*var(--u))]">
                    {/* Current Price: 50px at 3840w, Manrope-Medium (500), tracking 20 (0.02em), uppercase, #000000 */}
                    <span className="text-[20px] sm:text-[24px] lg:text-[calc(50*var(--u))] font-medium uppercase tracking-[0.02em] text-[#000000] leading-none">
                      {formatPrice(product.price)}
                    </span>

                    {/* Old Price with Strikethrough Line: 34px at 3840w, Manrope-Medium (500), tracking 20 (0.02em), uppercase, #797979 */}
                    {product.oldPrice && (
                      <span className="relative inline-flex items-center text-[13px] sm:text-[15px] lg:text-[calc(34*var(--u))] font-medium uppercase tracking-[0.02em] text-[#797979] leading-none px-0.5">
                        {formatPrice(product.oldPrice)}
                        <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] lg:h-[calc(3*var(--u))] bg-[#797979] pointer-events-none" />
                      </span>
                    )}
                  </div>

                  {/* CTA Buttons Row (PSD 'Shop Now' & 'Know More': 327 x 86 each, r = 10px, 10px gap, 55px below price) */}
                  <div className="mt-5 sm:mt-6 lg:mt-[calc(55*var(--u))] flex flex-row items-center gap-3 lg:gap-[calc(10*var(--u))]">
                    {/* ADD TO CART (#ED2024) */}
                    <button
                      type="button"
                      onClick={() => {
                        const item = {
                          id: product.id || product._id,
                          slug: product.slug || 'luma-product',
                          name: `${product.titleLine1 || ''} ${product.titleLine2 || ''}`.trim() || product.name || 'LUMA Red Light Panel',
                          price: Number(product.price) || 1200,
                          image: product.image,
                          variant: 'Standard Clinical Edition',
                        };
                        const added = addToCart(item, 1);
                        if (added && onOpenCart) onOpenCart();
                      }}
                      className="w-[140px] h-[40px] sm:w-[155px] sm:h-[44px] lg:w-[calc(327*var(--u))] lg:h-[calc(86*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#ED2024] hover:bg-[#d4191d] text-[#FFFFFF] text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ADD TO CART
                    </button>

                    {/* KNOW MORE (#333333) */}
                    <button
                      type="button"
                      onClick={() => {
                        const targetSlug = product.slug || product.id;
                        if (onNavigate) {
                          onNavigate(targetSlug);
                        } else if (onOpenCart) {
                          onOpenCart();
                        }
                      }}
                      className="w-[140px] h-[40px] sm:w-[155px] sm:h-[44px] lg:w-[calc(327*var(--u))] lg:h-[calc(86*var(--u))] rounded-[6px] lg:rounded-[calc(10*var(--u))] bg-[#333333] hover:bg-[#444444] text-[#FFFFFF] text-[12px] sm:text-[13px] lg:text-[calc(32*var(--u))] font-semibold uppercase tracking-[0.05em] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      KNOW MORE
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

