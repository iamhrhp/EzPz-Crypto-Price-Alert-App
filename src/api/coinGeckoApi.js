import axios from 'axios';
import { COINGECKO_API_KEY, COINGECKO_BASE_URL } from '../config/apiConfig';

const BASE_URL = COINGECKO_BASE_URL;

// Gets the current price for a crypto coin
// coinId is like 'bitcoin' or 'ethereum', currency defaults to 'usd'
export const getCryptoPrice = async (coinId = 'bitcoin', currency = 'usd') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24hr_change=true&include_market_cap=true&x_cg_demo_api_key=${COINGECKO_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    throw error;
  }
};

// Gets prices for multiple coins at once
// Pass in an array of coin IDs and it returns prices for all of them
export const getMultipleCryptoPrices = async (coinIds = ['bitcoin', 'ethereum'], currency = 'usd') => {
  try {
    const ids = coinIds.join(',');
    const response = await axios.get(
      `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=${currency}&include_24hr_change=true&include_market_cap=true&x_cg_demo_api_key=${COINGECKO_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple crypto prices:', error);
    throw error;
  }
};

// Fetches the most popular cryptos sorted by market cap
// limit is how many to get (defaults to 10)
export const getPopularCryptos = async (limit = 10, currency = 'usd') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&x_cg_demo_api_key=${COINGECKO_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching popular cryptos:', error);
    throw error;
  }
};

// Search for coins by name or symbol
// Returns matching results from CoinGecko
export const searchCryptos = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&x_cg_demo_api_key=${COINGECKO_API_KEY}`
    );
    return response.data.coins || [];
  } catch (error) {
    console.error('Error searching cryptos:', error);
    throw error;
  }
};

