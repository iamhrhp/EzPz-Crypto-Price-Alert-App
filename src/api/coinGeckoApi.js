import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch current price of a cryptocurrency
 * @param {string} coinId - CoinGecko coin ID (e.g., 'bitcoin', 'ethereum')
 * @param {string} currency - Currency code (default: 'usd')
 * @returns {Promise<Object>} Price data
 */
export const getCryptoPrice = async (coinId = 'bitcoin', currency = 'usd') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24hr_change=true&include_market_cap=true`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    throw error;
  }
};

/**
 * Fetch prices for multiple cryptocurrencies
 * @param {Array<string>} coinIds - Array of CoinGecko coin IDs
 * @param {string} currency - Currency code (default: 'usd')
 * @returns {Promise<Object>} Prices data for all requested coins
 */
export const getMultipleCryptoPrices = async (coinIds = ['bitcoin', 'ethereum'], currency = 'usd') => {
  try {
    const ids = coinIds.join(',');
    const response = await axios.get(
      `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=${currency}&include_24hr_change=true&include_market_cap=true`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple crypto prices:', error);
    throw error;
  }
};

/**
 * Get list of popular cryptocurrencies
 * @param {number} limit - Number of coins to fetch (default: 10)
 * @param {string} currency - Currency code (default: 'usd')
 * @returns {Promise<Array>} List of popular cryptocurrencies
 */
export const getPopularCryptos = async (limit = 10, currency = 'usd') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching popular cryptos:', error);
    throw error;
  }
};

/**
 * Search for cryptocurrencies by name or symbol
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchCryptos = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}`
    );
    return response.data.coins || [];
  } catch (error) {
    console.error('Error searching cryptos:', error);
    throw error;
  }
};

