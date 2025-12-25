import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: number;
}

export interface Settings {
  refreshInterval: number;
  currency: string;
  theme: string;
  alertSound: string;
  alertVibration: string;
  notifications?: boolean;
}

const STORAGE_KEYS = {
  ALERTS: '@ezpz_crypto_alerts',
  SETTINGS: '@ezpz_crypto_settings',
  FAVORITES: '@ezpz_crypto_favorites',
} as const;

// Saves all alerts to local storage
export const saveAlerts = async (alerts: Alert[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(alerts);
    await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, jsonValue);
  } catch (error) {
    console.error('Error saving alerts:', error);
    throw error;
  }
};

// Loads all saved alerts from storage
// Returns empty array if nothing is saved
export const loadAlerts = async (): Promise<Alert[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ALERTS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading alerts:', error);
    return [];
  }
};

// Saves app settings like currency preference
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

// Loads saved settings, returns defaults if nothing saved yet
export const loadSettings = async (): Promise<Settings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : {
      refreshInterval: 30000, // check prices every 30 seconds
      currency: 'usd',
      theme: 'light',
      alertSound: 'none', // default: no sound
      alertVibration: 'vibration', // default vibration pattern
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      refreshInterval: 30000,
      currency: 'usd',
      theme: 'light',
      alertSound: 'none',
      alertVibration: 'vibration',
    };
  }
};

// Saves the list of favorite coins
export const saveFavorites = async (favorites: string[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, jsonValue);
  } catch (error) {
    console.error('Error saving favorites:', error);
    throw error;
  }
};

// Gets the list of favorite coins
// Returns empty array if no favorites saved
export const loadFavorites = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};


