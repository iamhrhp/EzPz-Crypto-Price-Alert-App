import { getCryptoPrice, CryptoPrice } from '../api/coinGeckoApi';
import { loadAlerts, saveAlerts, Alert } from '../utils/storage';

export interface TriggeredAlert extends Alert {
  currentPrice: number;
}

// Checks all active alerts to see if any prices hit their targets
// Returns an array of alerts that just got triggered
export const checkAlerts = async (currency: string = 'usd'): Promise<TriggeredAlert[]> => {
  try {
    const alerts = await loadAlerts();
    const activeAlerts = alerts.filter(alert => alert.isActive);
    
    if (activeAlerts.length === 0) {
      return [];
    }

    // Get all unique coin IDs we need to check
    const coinIds = [...new Set(activeAlerts.map(alert => alert.coinId))];
    
    // Fetch prices for all those coins
    const pricePromises = coinIds.map(coinId => 
      getCryptoPrice(coinId, currency).catch(err => {
        console.error(`Error fetching price for ${coinId}:`, err);
        return null;
      })
    );
    
    const priceResults = await Promise.all(pricePromises);
    const triggeredAlerts: TriggeredAlert[] = [];
    
    // Go through each alert and see if the price hit the target
    for (let i = 0; i < activeAlerts.length; i++) {
      const alert = activeAlerts[i];
      const coinIndex = coinIds.indexOf(alert.coinId);
      
      if (coinIndex !== -1 && priceResults[coinIndex] && priceResults[coinIndex][alert.coinId]) {
        const priceData = priceResults[coinIndex][alert.coinId];
        const currentPrice = priceData[currency] || priceData[currency.toLowerCase()];
        
        if (currentPrice !== undefined) {
          // Check if price condition is met
          const conditionMet = alert.condition === 'above' 
            ? currentPrice >= alert.targetPrice 
            : currentPrice <= alert.targetPrice;
          
          if (conditionMet) {
            triggeredAlerts.push({
              ...alert,
              currentPrice,
            });
          }
        }
      }
    }
    
    return triggeredAlerts;
  } catch (error) {
    console.error('Error checking alerts:', error);
    return [];
  }
};

// Resets an alert so it can trigger again
// Useful if you want to reuse an alert after it's been triggered
export const resetAlert = async (alertId: string): Promise<void> => {
  try {
    const alerts = await loadAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isActive = false;
      await saveAlerts(alerts);
    }
  } catch (error) {
    console.error('Error resetting alert:', error);
  }
};


