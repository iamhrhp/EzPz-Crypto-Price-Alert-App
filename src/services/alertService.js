import { getCryptoPrice } from '../api/coinGeckoApi';
import { loadAlerts, saveAlerts } from '../utils/storage';

// Checks all active alerts to see if any prices hit their targets
// Returns an array of alerts that just got triggered
export const checkAlerts = async (currency = 'usd') => {
  try {
    const alerts = await loadAlerts();
    const activeAlerts = alerts.filter(alert => alert.active);
    
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
    const triggeredAlerts = [];
    
    // Go through each alert and see if the price hit the target
    for (let i = 0; i < activeAlerts.length; i++) {
      const alert = activeAlerts[i];
      const coinIndex = coinIds.indexOf(alert.coinId);
      
      if (coinIndex !== -1 && priceResults[coinIndex] && priceResults[coinIndex][alert.coinId]) {
        const currentPrice = priceResults[coinIndex][alert.coinId][currency];
        
        // If current price is at or above the target, trigger the alert
        if (currentPrice >= alert.targetPrice) {
          // Only trigger if it hasn't been triggered already
          if (!alert.triggered) {
            alert.triggered = true;
            alert.triggeredAt = new Date().toISOString();
            triggeredAlerts.push({
              ...alert,
              currentPrice,
            });
          }
        }
      }
    }
    
    // Save the updated alerts back to storage
    if (triggeredAlerts.length > 0) {
      await saveAlerts(alerts);
    }
    
    return triggeredAlerts;
  } catch (error) {
    console.error('Error checking alerts:', error);
    return [];
  }
};

// Resets an alert so it can trigger again
// Useful if you want to reuse an alert after it's been triggered
export const resetAlert = async (alertId) => {
  try {
    const alerts = await loadAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.triggered = false;
      alert.triggeredAt = null;
      await saveAlerts(alerts);
    }
  } catch (error) {
    console.error('Error resetting alert:', error);
  }
};

