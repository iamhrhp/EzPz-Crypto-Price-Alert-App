import axios, { AxiosResponse } from 'axios';
import { COINGECKO_API_KEY, COINGECKO_BASE_URL } from '../config/apiConfig';

const BASE_URL = COINGECKO_BASE_URL;

export interface CryptoPrice {
  [coinId: string]: {
    [currency: string]: number;
    usd_24h_change?: number;
    usd_market_cap?: number;
  };
}

export interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number;
  total_volume: number;
  high_24h?: number;
  low_24h?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply: number;
  total_supply?: number;
  max_supply?: number;
  ath?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl?: number;
  atl_change_percentage?: number;
  atl_date?: string;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank?: number;
  thumb?: string;
  large?: string;
}

export interface SearchResponse {
  coins: SearchResult[];
}

// Gets the current price for a crypto coin
// coinId is like 'bitcoin' or 'ethereum', currency defaults to 'usd'
export const getCryptoPrice = async (coinId: string = 'bitcoin', currency: string = 'usd'): Promise<CryptoPrice> => {
  try {
    const response: AxiosResponse<CryptoPrice> = await axios.get(
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
export const getMultipleCryptoPrices = async (coinIds: string[] = ['bitcoin', 'ethereum'], currency: string = 'usd'): Promise<CryptoPrice> => {
  try {
    const ids = coinIds.join(',');
    const response: AxiosResponse<CryptoPrice> = await axios.get(
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
export const getPopularCryptos = async (limit: number = 10, currency: string = 'usd'): Promise<CryptoMarketData[]> => {
  try {
    const response: AxiosResponse<CryptoMarketData[]> = await axios.get(
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
export const searchCryptos = async (query: string): Promise<SearchResult[]> => {
  try {
    const response: AxiosResponse<SearchResponse> = await axios.get(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&x_cg_demo_api_key=${COINGECKO_API_KEY}`
    );
    return response.data.coins || [];
  } catch (error) {
    console.error('Error searching cryptos:', error);
    throw error;
  }
};


