import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  AppState,
  AppStateStatus,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getCryptoPrice } from '../api/coinGeckoApi';
import { loadAlerts, saveAlerts, Alert as AlertType } from '../utils/storage';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../utils/currencyContext';
import { colors } from '../utils/colors';
import { checkAlerts } from '../services/alertService';
import { playAlertSound } from '../utils/sound';

type RootStackParamList = {
  Alerts: { coinId?: string };
};

type AlertScreenRouteProp = RouteProp<RootStackParamList, 'Alerts'>;

export default function AlertScreen() {
  const route = useRoute<AlertScreenRouteProp>();
  const { currency } = useCurrency();
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [coinId, setCoinId] = useState<string>(route?.params?.coinId || 'bitcoin');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const alertCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const lastTriggeredAlerts = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadUserAlerts();
    fetchCurrentPrice();
    startAlertChecking();

    // Check alerts when user comes back to the app
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkAlertsAndPlaySound();
      }
      appState.current = nextAppState;
    });

    return () => {
      stopAlertChecking();
      subscription?.remove();
    };
  }, [currency, coinId]);

  // Auto-fill target price with current price whenever it's fetched
  // User can then edit it to set their target
  useEffect(() => {
    if (currentPrice !== null) {
      setTargetPrice(currentPrice.toString());
    }
  }, [currentPrice]);

  const checkAlertsAndPlaySound = useCallback(async () => {
    try {
      const triggeredAlerts = await checkAlerts(currency);
      
      if (triggeredAlerts.length > 0) {
        const newAlerts = triggeredAlerts.filter(alert => 
          !lastTriggeredAlerts.current.has(alert.id)
        );
        
        for (const alert of newAlerts) {
          lastTriggeredAlerts.current.add(alert.id);
          await playAlertSound();
          
          Alert.alert(
            '🎯 Price Alert Triggered!',
            `${alert.coinId.toUpperCase()} has reached your target price!\n\n` +
            `Target: ${formatCurrency(alert.targetPrice, currency)}\n` +
            `Current: ${formatCurrency(alert.currentPrice, currency)}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  loadUserAlerts();
                },
              },
            ],
            { cancelable: true }
          );
        }
        
        loadUserAlerts();
      }
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  }, [currency]);

  const startAlertChecking = (): void => {
    alertCheckInterval.current = setInterval(() => {
      checkAlertsAndPlaySound();
    }, 5000);
    
    checkAlertsAndPlaySound();
  };

  const stopAlertChecking = (): void => {
    if (alertCheckInterval.current) {
      clearInterval(alertCheckInterval.current);
      alertCheckInterval.current = null;
    }
  };

  // Keep the alert list fresh by reloading every 5 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      loadUserAlerts();
    }, 5000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const loadUserAlerts = async (): Promise<void> => {
    const savedAlerts = await loadAlerts();
    setAlerts(savedAlerts);
  };

  const fetchCurrentPrice = async (): Promise<void> => {
    try {
      const data = await getCryptoPrice(coinId, currency);
      if (data[coinId]) {
        const priceData = data[coinId];
        const price = priceData[currency] || priceData[currency.toLowerCase()];
        if (price !== undefined) {
          setCurrentPrice(price);
        }
      }
    } catch (error) {
      console.error('Failed to fetch current price:', error);
    }
  };

  const addAlert = async (): Promise<void> => {
    if (!targetPrice || isNaN(parseFloat(targetPrice))) {
      Alert.alert('Invalid Input', 'Please enter a valid target price');
      return;
    }

    const newAlert: AlertType = {
      id: Date.now().toString(),
      coinId: coinId,
      coinName: coinId,
      coinSymbol: coinId.toUpperCase(),
      targetPrice: parseFloat(targetPrice),
      condition: 'above',
      isActive: true,
      createdAt: Date.now(),
    };

    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    await saveAlerts(updatedAlerts);
    setTargetPrice('');
    Alert.alert('Success', 'Price alert created successfully!');
  };

  const removeAlert = async (alertId: string): Promise<void> => {
    Alert.alert(
      'Remove Alert',
      'Are you sure you want to remove this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updatedAlerts = alerts.filter((alert) => alert.id !== alertId);
            setAlerts(updatedAlerts);
            await saveAlerts(updatedAlerts);
          },
        },
      ]
    );
  };

  // Figures out how much to increment/decrement based on the price
  // If it's 0.11, step by 0.01. If it's 88001, step by 1.
  const getStepSize = (price: number | null): number => {
    if (!price) return 1;
    const priceStr = price.toString();
    if (priceStr.includes('.')) {
      const decimalPart = priceStr.split('.')[1];
      const decimalPlaces = decimalPart.length;
      return Math.pow(10, -decimalPlaces);
    }
    return 1; // whole numbers, step by 1
  };

  const incrementPrice = (): void => {
    const current = parseFloat(targetPrice) || currentPrice || 0;
    const stepSize = getStepSize(parseFloat(targetPrice) || currentPrice);
    const newPrice = current + stepSize;
    // keep the same number of decimal places
    const decimalPlaces = stepSize.toString().split('.')[1]?.length || 0;
    setTargetPrice(newPrice.toFixed(decimalPlaces));
  };

  const decrementPrice = (): void => {
    const current = parseFloat(targetPrice) || currentPrice || 0;
    const stepSize = getStepSize(parseFloat(targetPrice) || currentPrice);
    const newPrice = Math.max(0, current - stepSize);
    // keep the same number of decimal places
    const decimalPlaces = stepSize.toString().split('.')[1]?.length || 0;
    setTargetPrice(newPrice.toFixed(decimalPlaces));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create New Alert</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cryptocurrency</Text>
          <TextInput
            style={styles.input}
            value={coinId}
            onChangeText={setCoinId}
            placeholder="e.g., bitcoin, ethereum"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Target Price ({currency.toUpperCase()})</Text>
          <View style={styles.priceInputContainer}>
            <TouchableOpacity
              style={[
                styles.incrementButton,
                !currentPrice && styles.incrementButtonDisabled,
              ]}
              onPress={decrementPrice}
              disabled={!currentPrice}
            >
              <Text style={styles.incrementButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.inputWithCurrentPrice}>
              {currentPrice && (
                <Text style={styles.currentPriceText}>
                  Current: {formatCurrency(currentPrice, currency)}
                </Text>
              )}
              <TextInput
                style={styles.priceInput}
                value={targetPrice}
                onChangeText={setTargetPrice}
                placeholder={currentPrice ? currentPrice.toString() : "Enter target price"}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.incrementButton,
                !currentPrice && styles.incrementButtonDisabled,
              ]}
              onPress={incrementPrice}
              disabled={!currentPrice}
            >
              <Text style={styles.incrementButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addAlert}>
          <Text style={styles.addButtonText}>Create Alert</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Alerts ({alerts.length})</Text>
        {alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alerts yet</Text>
            <Text style={styles.emptySubtext}>
              Create an alert to get notified when prices reach your target
            </Text>
          </View>
        ) : (
          alerts.map((alert) => (
            <View 
              key={alert.id} 
              style={styles.alertCard}
            >
              <View style={styles.alertInfo}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertCoin}>
                    {alert.coinId.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.alertPrice}>
                  Target: {formatCurrency(alert.targetPrice, currency)}
                </Text>
                <Text style={styles.alertDate}>
                  Created: {new Date(alert.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAlert(alert.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.backgroundSecondary,
    marginTop: 12,
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    backgroundColor: colors.backgroundTertiary,
    color: colors.textPrimary,
  },
  currentPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWithCurrentPrice: {
    flex: 1,
  },
  currentPriceText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    backgroundColor: colors.backgroundTertiary,
    color: colors.textPrimary,
  },
  incrementButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.binanceYellow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  incrementButtonDisabled: {
    opacity: 0.5,
  },
  incrementButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.background,
  },
  addButton: {
    backgroundColor: colors.binanceYellow,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  alertCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: colors.backgroundTertiary,
  },
  alertCardTriggered: {
    borderColor: colors.binanceYellow,
    borderWidth: 2,
    backgroundColor: colors.backgroundSecondary,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  triggeredBadge: {
    backgroundColor: colors.binanceYellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  triggeredBadgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '700',
  },
  triggeredDate: {
    fontSize: 12,
    color: colors.binanceYellow,
    marginTop: 4,
    fontWeight: '600',
  },
  alertInfo: {
    flex: 1,
  },
  alertCoin: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  alertPrice: {
    fontSize: 15,
    color: colors.binanceYellow,
    marginBottom: 4,
    fontWeight: '500',
  },
  alertDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  removeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.error,
    borderRadius: 6,
  },
  removeButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
});

