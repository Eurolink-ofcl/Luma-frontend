import React, { createContext, useContext, useState, useEffect } from 'react';

export const CURRENCIES = [
  {
    code: 'AED',
    label: 'AED د.إ',
    name: 'AED | د.إ (UAE)',
    symbol: 'AED',
    symbolNative: 'د.إ',
    countryCode: 'AE',
    flag: '/assets/uae-flag.svg',
    isSvg: true,
    rate: 1.0,
    prefix: '',
    suffix: ' AED',
  },
  {
    code: 'USD',
    label: 'USD $',
    name: 'USD $ (United States)',
    symbol: '$',
    symbolNative: '$',
    countryCode: 'US',
    rate: 0.272, // 1 USD ≈ 3.6725 AED
    prefix: '$',
    suffix: '',
  },
  {
    code: 'SAR',
    label: 'SAR ر.س',
    name: 'SAR ر.س (Saudi Arabia)',
    symbol: 'SAR',
    symbolNative: 'ر.س',
    countryCode: 'SA',
    rate: 1.021, // 1 SAR ≈ 0.98 AED
    prefix: '',
    suffix: ' SAR',
  },
  {
    code: 'EUR',
    label: 'EUR €',
    name: 'EUR € (Europe)',
    symbol: '€',
    symbolNative: '€',
    countryCode: 'EU',
    rate: 0.255, // 1 EUR ≈ 3.92 AED
    prefix: '€',
    suffix: '',
  },
  {
    code: 'GBP',
    label: 'GBP £',
    name: 'GBP £ (United Kingdom)',
    symbol: '£',
    symbolNative: '£',
    countryCode: 'GB',
    rate: 0.215, // 1 GBP ≈ 4.65 AED
    prefix: '£',
    suffix: '',
  },
];

export function parseAedAmount(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).trim();
  const cleaned = str.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatCurrencyAmount(baseAed, currency) {
  const numericAed = parseAedAmount(baseAed);
  if (!numericAed) return '';

  const converted = Math.round(numericAed * (currency?.rate || 1.0));
  const formattedNumber = converted.toLocaleString();

  if (currency?.prefix) {
    return `${currency.prefix}${formattedNumber}${currency.suffix || ''}`;
  }
  return `${formattedNumber}${currency?.suffix || ''}`;
}

const CurrencyContext = createContext({
  currency: CURRENCIES[0],
  currencies: CURRENCIES,
  setCurrency: () => {},
  formatPrice: (amount) => String(amount || ''),
  convertPrice: (amount) => Number(amount || 0),
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const savedCode = localStorage.getItem('luma_selected_currency');
      if (savedCode) {
        const found = CURRENCIES.find((c) => c.code === savedCode);
        if (found) return found;
      }
    } catch {
      // ignore localStorage errors
    }
    return CURRENCIES[0];
  });

  const setCurrency = (codeOrObj) => {
    let nextCurr = CURRENCIES[0];
    if (typeof codeOrObj === 'string') {
      nextCurr = CURRENCIES.find((c) => c.code === codeOrObj) || CURRENCIES[0];
    } else if (codeOrObj && codeOrObj.code) {
      nextCurr = CURRENCIES.find((c) => c.code === codeOrObj.code) || codeOrObj;
    }

    setCurrencyState(nextCurr);
    try {
      localStorage.setItem('luma_selected_currency', nextCurr.code);
    } catch {
      // ignore
    }
  };

  const formatPrice = (amountInAed) => {
    if (!amountInAed && amountInAed !== 0) return '';
    return formatCurrencyAmount(amountInAed, currency);
  };

  const convertPrice = (amountInAed) => {
    const numericAed = parseAedAmount(amountInAed);
    return Math.round(numericAed * (currency.rate || 1.0));
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencies: CURRENCIES,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export default CurrencyContext;
