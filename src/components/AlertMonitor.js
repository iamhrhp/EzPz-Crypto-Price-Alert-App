import React, { useEffect, useRef, useCallback } from 'react';
import { AppState, Alert } from 'react-native';
import { useCurrency } from '../utils/currencyContext';
import { checkAlerts } from '../services/alertService';
import { playAlertSound } from '../utils/sound';
import { formatCurrency } from '../utils/formatters';

/**
 * Global Alert Monitor Component
 * Monitors all saved alerts continuously and plays sound when triggered
 */
export default function AlertMonitor() {
  const { currency } = useCurrency();
  const alertCheckInterval = useRef(null);
  const appState = useRef(AppState.currentState);
  const lastTriggeredAlerts = useRef(new Set());

  const checkAlertsAndPlaySound = useCallback(async () => {
    try {
      const triggeredAlerts = await checkAlerts(currency);
      
      if (triggeredAlerts.length > 0) {
        // Filter out alerts that were already triggered in this session
        const newAlerts = triggeredAlerts.filter(alert => 
          !lastTriggeredAlerts.current.has(alert.id)
        );
        
        // Play sound and show notification for each new triggered alert
        for (const alert of newAlerts) {
          // Mark as processed
          lastTriggeredAlerts.current.add(alert.id);
          
          // Play sound
          await playAlertSound();
          
          // Show alert notification
          Alert.alert(
            '🎯 Price Alert Triggered!',
            `${alert.coinId.toUpperCase()} has reached your target price!\n\n` +
            `Target: ${formatCurrency(alert.targetPrice, currency)}\n` +
            `Current: ${formatCurrency(alert.currentPrice, currency)}`,
            [
              {
                text: 'OK',
                style: 'default',
              },
            ],
            { cancelable: true }
          );
        }
      }
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  }, [currency]);

  useEffect(() => {
    // Check alerts every 5 seconds for more frequent monitoring
    alertCheckInterval.current = setInterval(() => {
      checkAlertsAndPlaySound();
    }, 5000); // Check every 5 seconds
    
    // Also check immediately
    checkAlertsAndPlaySound();

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground, check alerts immediately
        checkAlertsAndPlaySound();
      }
      appState.current = nextAppState;
    });

    return () => {
      if (alertCheckInterval.current) {
        clearInterval(alertCheckInterval.current);
        alertCheckInterval.current = null;
      }
      subscription?.remove();
    };
  }, [checkAlertsAndPlaySound]);

  // This component doesn't render anything
  return null;
}


