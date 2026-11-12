import React, { useRef, useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';

const SERIES_PRODUCTS = [
  {
    id: 'luma-go',
    name: 'LUMA GO',
    price: 'AED',
    priceAmount: 1890,
    bestFor: 'SPOT\nTREATMENT',
    coverage: 'TARGETED',
    fitsBestIn: 'HOME, OFFICE,\nTRAVEL',
    ledConfig: '12 LEDS',
    panelSize: '14 × 7 × 2.9 CM',
    warranty: '3 YEARS',
  },
  {
    id: 'luma-nova',
    name: 'LUMA NOVA',
    price: 'AED',
    priceAmount: 2100,
    bestFor: 'FACE, JOINTS\n& SCALP',
    coverage: 'TARGETED',
    fitsBestIn: 'HOME, OFFICE',
    ledConfig: '60 LEDS',
    panelSize: '26.9 × 23 × 5.4 CM',
    warranty: '3 YEARS',
  },
  {
    id: 'luma-surge',
    name: 'LUMA SURGE',
    price: 'AED',
    priceAmount: 2890,
    bestFor: 'BACK, SHOULDERS\n& TARGETED MUSCLE',
    coverage: 'TARGETED',
    fitsBestIn: 'HOME, HOME GYM',
    ledConfig: '150 LEDS',
    panelSize: '47.3 × 30 × 5.4 CM',
    warranty: '3 YEARS',
  },
  {
    id: 'luma-apex',
    name: 'LUMA APEX',
    price: 'AED',
    priceAmount: 3800,
    bestFor: 'UPPER OR LOWER\nBODY RECOVERY',
    coverage: 'HALF BODY',
    fitsBestIn: 'HOME GYM,\nRECOVERY ROOM',
    ledConfig: '300 LEDS',
    panelSize: '91 × 30 × 5.4 CM',
    warranty: '3 YEARS',
  },
  {
    id: 'luma-ultra',
    name: 'LUMA ULTRA',
    price: 'AED',
    priceAmount: 4890,
    bestFor: 'DAILY FULL\nBODY RECOVERY',
    coverage: 'FULL BODY',
    fitsBestIn: 'HOME WELLNESS\nSPACE, STUDIOS, GYM',
    ledConfig: '600 LEDS',
    panelSize: '150 × 42 × 5.4 CM',
    warranty: '3 YEARS',
  },
  {
    id: 'luma-max',
    name: 'LUMA MAX',
    price: 'AED',
    priceAmount: 5890,
    bestFor: 'MULTI-USER,\nHIGH-DEMAND',
    coverage: 'COVERAGE AREA',
    fitsBestIn: 'HOME, CLINICS, GYMS,\nWELLNESS CENTRES',
    ledConfig: '1,200 LEDS',
    panelSize: '180 × 60 × 5.4 CM',
    warranty: '3 YEARS',
  },
];

const PARAMETERS = [
  { id: 'products', label: 'PRODUCTS', key: 'name', isHeader: true },
  { id: 'price', label: 'PRICE', key: 'price', isPrice: true },
  { id: 'best-for', label: 'BEST FOR', key: 'bestFor' },
  { id: 'coverage', label: 'COVERAGE AREA', key: 'coverage' },
  { id: 'fits-in', label: 'FITS BEST IN', key: 'fitsBestIn' },
  { id: 'leds', label: 'LED CONFIGURATION', key: 'ledConfig' },
  { id: 'panel-size', label: 'PANEL SIZE', key: 'panelSize' },
  { id: 'warranty', label: 'WARRANTY', key: 'warranty' },
];

export default function LumaSeriesCompareSection({ currentProductId = 'luma-go' }) {
  const { formatPrice } = useCurrency();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
    }
    window.addEventListener('resize', checkScroll);
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = 145;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <section
      id="luma-series-specs"
      style={{ '--u': 'calc(100vw / 3840)' }}
      className="w-full bg-[#FFFFFF] text-[#000000] font-['Manrope'] select-none pt-10 sm:pt-16 md:pt-20 lg:pt-24 2xl:pt-[calc(140*var(--u))] pb-16 sm:pb-20 md:pb-24 lg:pb-28 2xl:pb-[calc(180*var(--u))] overflow-hidden"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 2xl:px-[calc(376*var(--u))]">
        {/* Section Heading: LUMA Series Specifications */}
        <div className="w-full text-center mb-5 sm:mb-8 md:mb-10 lg:mb-14 2xl:mb-[calc(90*var(--u))]">
          <h2 className="text-[17px] sm:text-[22px] md:text-[26px] lg:text-[30px] xl:text-[34px] 2xl:text-[calc(45*var(--u))] font-normal uppercase tracking-[0.02em] text-[#ED2024] leading-none">
            LUMA Series Specifications
          </h2>
        </div>

        {/* Mobile Swipe & Arrow Bar (Visible only on < xl screens) */}
        <div className="flex xl:hidden items-center justify-between w-full mb-3 px-1">
          <span className="text-[10.5px] sm:text-xs font-medium uppercase tracking-[0.04em] text-[#777777] flex items-center gap-1.5">
            <span>Swipe to compare 6 models</span>
            <span className="text-black/30">→</span>
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous product column"
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/15 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'opacity-100 hover:border-black cursor-pointer active:scale-95 bg-white shadow-sm'
                  : 'opacity-20 cursor-not-allowed pointer-events-none bg-transparent'
              }`}
            >
              <img
                src="/assets/about/shop-arrow-left.png"
                alt=""
                className="h-2.5 sm:h-3 w-auto object-contain select-none pointer-events-none"
              />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next product column"
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/15 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'opacity-100 hover:border-black cursor-pointer active:scale-95 bg-white shadow-sm'
                  : 'opacity-20 cursor-not-allowed pointer-events-none bg-transparent'
              }`}
            >
              <img
                src="/assets/about/shop-arrow-right.png"
                alt=""
                className="h-2.5 sm:h-3 w-auto object-contain select-none pointer-events-none"
              />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table with Sticky Parameter Column & Smooth Horizontal Scroll for Mobile */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto scroll-smooth scrollbar-none rounded-[16px] sm:rounded-[22px] 2xl:rounded-[calc(35*var(--u))] border border-[#E5E5E5] shadow-sm bg-[#FFFFFF]"
        >
          <table className="w-max xl:w-full border-collapse table-auto xl:table-fixed text-center">
            <thead>
              {/* Row 1: Products */}
              <tr className="border-b border-[#E5E5E5] h-[52px] sm:h-[62px] 2xl:h-[calc(118*var(--u))]">
                {/* Sticky Left Column: PRODUCTS */}
                <th className="sticky left-0 bg-[#FFFFFF] z-30 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)] xl:shadow-none border-r border-[#E5E5E5] xl:border-r-0 w-[115px] sm:w-[135px] xl:w-[18%] 2xl:w-[calc(600/3020*100%)] min-w-[115px] sm:min-w-[135px] xl:min-w-0 text-left pl-3.5 sm:pl-6 2xl:pl-[calc(50*var(--u))] pr-2 text-[10.5px] sm:text-[13px] 2xl:text-[calc(30*var(--u))] font-light uppercase tracking-[0.02em] text-[#000000]">
                  PRODUCTS
                </th>

                {/* 6 Product Columns */}
                {SERIES_PRODUCTS.map((prod) => {
                  const isCurrent = prod.id === currentProductId;
                  return (
                    <th
                      key={prod.id}
                      className={`w-[135px] sm:w-[150px] xl:w-[13.6%] min-w-[135px] sm:min-w-[150px] xl:min-w-0 text-center px-2.5 sm:px-3 text-[11px] sm:text-[13px] 2xl:text-[calc(34*var(--u))] font-bold uppercase tracking-[0.02em] transition-colors whitespace-nowrap ${
                        isCurrent
                          ? 'bg-[#ED2024] text-[#FFFFFF]'
                          : 'text-[#000000]'
                      }`}
                    >
                      {prod.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {PARAMETERS.slice(1).map((param) => (
                <tr
                  key={param.id}
                  className="min-h-[46px] sm:min-h-[56px] 2xl:min-h-[calc(105*var(--u))]"
                >
                  {/* Sticky Left Column: Parameter Label */}
                  <td className="sticky left-0 bg-[#FFFFFF] z-20 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)] xl:shadow-none border-r border-[#E5E5E5] xl:border-r-0 w-[115px] sm:w-[135px] xl:w-[18%] 2xl:w-[calc(600/3020*100%)] min-w-[115px] sm:min-w-[135px] xl:min-w-0 text-left pl-3.5 sm:pl-6 2xl:pl-[calc(50*var(--u))] pr-2 py-3 sm:py-3.5 2xl:py-[calc(28*var(--u))] text-[10px] sm:text-[12px] 2xl:text-[calc(28*var(--u))] font-light uppercase tracking-[0.02em] text-[#000000] leading-snug">
                    {param.label}
                  </td>

                  {/* 6 Product Values */}
                  {SERIES_PRODUCTS.map((prod) => {
                    const isCurrent = prod.id === currentProductId;
                    return (
                      <td
                        key={prod.id}
                        className={`w-[135px] sm:w-[150px] xl:w-[13.6%] min-w-[135px] sm:min-w-[150px] xl:min-w-0 py-3 sm:py-3.5 2xl:py-[calc(28*var(--u))] px-2.5 sm:px-3 text-[10.5px] sm:text-[12px] 2xl:text-[calc(28*var(--u))] tracking-[0.02em] leading-snug uppercase ${
                          isCurrent
                            ? 'bg-[#ED2024] text-[#FFFFFF] font-bold'
                            : 'text-[#222222] font-normal'
                        }`}
                      >
                        {param.isPrice ? (
                          <span className="block whitespace-nowrap font-medium">
                            {formatPrice(prod.priceAmount || 1890)}
                          </span>
                        ) : (
                          prod[param.key].split('\n').map((line, idx) => (
                            <span key={idx} className="block whitespace-nowrap">
                              {line}
                            </span>
                          ))
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
