import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ALERTS: '@ezpz_crypto_alerts',
  SETTINGS: '@ezpz_crypto_settings',
  FAVORITES: '@ezpz_crypto_favorites',
};

/**
 * Save alerts to AsyncStorage
 * @param {Array} alerts - Array of alert objects
 */
export const saveAlerts = async (alerts) => {
  try {
    const jsonValue = JSON.stringify(alerts);
    await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, jsonValue);
  } catch (error) {
    console.error('Error saving alerts:', error);
    throw error;
  }
};

/**
 * Load alerts from AsyncStorage
 * @returns {Promise<Array>} Array of alert objects
 */
export const loadAlerts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ALERTS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading alerts:', error);
    return [];
  }
};

/**
 * Save settings to AsyncStorage
 * @param {Object} settings - Settings object
 */
export const saveSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

/**
 * Load settings from AsyncStorage
 * @returns {Promise<Object>} Settings object
 */
export const loadSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : {
      refreshInterval: 30000, // 30 seconds
      currency: 'usd',
      theme: 'light',
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      refreshInterval: 30000,
      currency: 'usd',
      theme: 'light',
    };
  }
};

/**
 * Save favorite cryptocurrencies
 * @param {Array} favorites - Array of favorite coin IDs
 */
export const saveFavorites = async (favorites) => {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, jsonValue);
  } catch (error) {
    console.error('Error saving favorites:', error);
    throw error;
  }
};

/**
 * Load favorite cryptocurrencies
 * @returns {Promise<Array>} Array of favorite coin IDs
 */
export const loadFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

