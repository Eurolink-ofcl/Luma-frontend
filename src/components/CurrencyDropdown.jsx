import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

export default function CurrencyDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency, currencies } = useCurrency();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      style={{ '--u': 'calc(100vw / 3840)' }}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 lg:gap-[calc(10*var(--u))] py-1 text-[#FFFFFF] font-medium text-[11px] lg:text-[calc(26*var(--u))] tracking-normal cursor-pointer hover:opacity-90 transition-opacity leading-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select Currency"
      >
        {currency.flag ? (
          <img
            src={currency.flag}
            alt={currency.code}
            className="w-[18px] h-[18px] lg:w-[calc(51*var(--u))] lg:h-[calc(51*var(--u))] rounded-full object-cover shrink-0 border border-white/20"
          />
        ) : (
          <span className="text-[10px] lg:text-[calc(20*var(--u))] font-bold text-white/80 tracking-wider">
            {currency.countryCode}
          </span>
        )}
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          {currency.code === 'AED' ? (
            <>
              AED <span className="font-['Manrope'] lg:text-[calc(30*var(--u))]">د.إ</span>
            </>
          ) : (
            currency.label
          )}
        </span>
        <svg
          className={`w-[8px] h-[5px] lg:w-[calc(24*var(--u))] lg:h-[calc(20*var(--u))] text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 10 6"
          fill="none"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] right-0 min-w-[210px] bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              type="button"
              onClick={() => {
                setCurrency(curr.code);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-[12.5px] rounded-lg text-left transition-colors cursor-pointer ${
                currency.code === curr.code
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {curr.flag ? (
                <img
                  src={curr.flag}
                  alt={curr.code}
                  className="w-[18px] h-[18px] rounded-full object-cover shrink-0 border border-white/10"
                />
              ) : (
                <span className="w-[18px] text-[10px] font-bold text-white/70 tracking-wider text-center shrink-0">
                  {curr.countryCode}
                </span>
              )}
              <span>{curr.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
