import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadSettings, saveSettings } from './storage';

interface CurrencyContextType {
  currency: string;
  updateCurrency: (newCurrency: string) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currency, setCurrency] = useState<string>('usd');

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async (): Promise<void> => {
    try {
      const settings = await loadSettings();
      if (settings.currency) {
        setCurrency(settings.currency.toLowerCase());
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    }
  };

  const updateCurrency = async (newCurrency: string): Promise<void> => {
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


