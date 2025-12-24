// Maps currency codes to locale strings for proper number formatting
const getLocaleForCurrency = (currency) => {
  const currencyMap = {
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'INR': 'en-IN',
    'JPY': 'ja-JP',
    'CNY': 'zh-CN',
    'AUD': 'en-AU',
    'CAD': 'en-CA',
    'CHF': 'de-CH',
    'SGD': 'en-SG',
  };
  return currencyMap[currency.toUpperCase()] || 'en-US';
};

// Formats a number as currency (e.g., $1,234.56 or €1.234,56)
// Handles different locales automatically based on currency
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}0.00`;
  }
  
  const locale = getLocaleForCurrency(currency);
  const currencyUpper = currency.toUpperCase();
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyUpper,
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
};

// Returns the symbol for a currency ($, €, £, etc.)
export const getCurrencySymbol = (currency) => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥',
    'CNY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'CHF',
    'SGD': 'S$',
  };
  return symbols[currency.toUpperCase()] || '$';
};

// Formats percentage with + or - sign (e.g., +5.23% or -2.10%)
export const formatPercentage = (change) => {
  if (change === null || change === undefined || isNaN(change)) {
    return '0.00%';
  }
  
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

// Shortens big numbers (1.5B instead of 1,500,000,000)
// Useful for market cap and volume displays
export const formatLargeNumber = (value, currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  const symbol = getCurrencySymbol(currency);
  
  if (value >= 1e12) {
    return `${symbol}${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `${symbol}${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${symbol}${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${symbol}${(value / 1e3).toFixed(2)}K`;
  }
  
  return `${symbol}${value.toFixed(2)}`;
};

// Returns green for positive changes, red for negative
// Matches Binance's color scheme
export const getChangeColor = (change) => {
  if (change === null || change === undefined || isNaN(change)) {
    return '#848E9C';
  }
  return change >= 0 ? '#0ECB81' : '#F6465D';
};

