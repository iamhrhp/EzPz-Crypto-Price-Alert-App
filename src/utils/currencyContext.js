import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadSettings, saveSettings } from './storage';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('usd');

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const settings = await loadSettings();
      if (settings.currency) {
        setCurrency(settings.currency.toLowerCase());
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    }
  };

  const updateCurrency = async (newCurrency) => {
    try {
      const settings = await loadSettings();
      const updatedSettings = { ...settings, currency: newCurrency.toLowerCase() };
      await saveSettings(updatedSettings);
      setCurrency(newCurrency.toLowerCase());
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};



