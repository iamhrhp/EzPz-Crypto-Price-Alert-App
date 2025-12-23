import { getCryptoPrice } from '../api/coinGeckoApi';
import { loadAlerts, saveAlerts } from '../utils/storage';

/**
 * Check if any alerts have been triggered
 * @param {string} currency - Currency code
 * @returns {Promise<Array>} Array of triggered alerts
 */
export const checkAlerts = async (currency = 'usd') => {
  try {
    const alerts = await loadAlerts();
    const activeAlerts = alerts.filter(alert => alert.active);
    
    if (activeAlerts.length === 0) {
      return [];
    }

    // Get unique coin IDs
    const coinIds = [...new Set(activeAlerts.map(alert => alert.coinId))];
    
    // Fetch current prices for all coins
    const pricePromises = coinIds.map(coinId => 
      getCryptoPrice(coinId, currency).catch(err => {
        console.error(`Error fetching price for ${coinId}:`, err);
        return null;
      })
    );
    
    const priceResults = await Promise.all(pricePromises);
    const triggeredAlerts = [];
    
    // Check each alert
    for (let i = 0; i < activeAlerts.length; i++) {
      const alert = activeAlerts[i];
      const coinIndex = coinIds.indexOf(alert.coinId);
      
      if (coinIndex !== -1 && priceResults[coinIndex] && priceResults[coinIndex][alert.coinId]) {
        const currentPrice = priceResults[coinIndex][alert.coinId][currency];
        
        // Check if target price is reached
        // Trigger if current price has reached or exceeded target price
        if (currentPrice >= alert.targetPrice) {
          // Mark alert as triggered if not already
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
    
    // Save updated alerts if any were triggered
    if (triggeredAlerts.length > 0) {
      await saveAlerts(alerts);
    }
    
    return triggeredAlerts;
  } catch (error) {
    console.error('Error checking alerts:', error);
    return [];
  }
};

/**
 * Reset triggered status for an alert
 * @param {string} alertId - Alert ID
 */
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

