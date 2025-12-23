/**
 * Get locale based on currency
 * @param {string} currency - Currency code
 * @returns {string} Locale string
 */
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

/**
 * Format currency value
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
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

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
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

/**
 * Format percentage change
 * @param {number} change - Percentage change value
 * @returns {string} Formatted percentage string with sign
 */
export const formatPercentage = (change) => {
  if (change === null || change === undefined || isNaN(change)) {
    return '0.00%';
  }
  
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

/**
 * Format large numbers (market cap, volume, etc.)
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted string (e.g., 1.5B, 500M)
 */
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

/**
 * Get color based on percentage change (Binance style)
 * @param {number} change - Percentage change value
 * @returns {string} Color string (green for positive, red for negative)
 */
export const getChangeColor = (change) => {
  if (change === null || change === undefined || isNaN(change)) {
    return '#848E9C';
  }
  return change >= 0 ? '#0ECB81' : '#F6465D';
};

