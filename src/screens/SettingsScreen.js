import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadSettings, saveSettings } from '../utils/storage';
import { useCurrency } from '../utils/currencyContext';
import { getCurrencySymbol } from '../utils/formatters';
import { colors } from '../utils/colors';
import { getAvailableSounds, playAlertSound } from '../utils/sound';

const CURRENCIES = [
  { code: 'usd', name: 'US Dollar', symbol: '$' },
  { code: 'inr', name: 'Indian Rupee', symbol: '₹' },
  { code: 'eur', name: 'Euro', symbol: '€' },
  { code: 'gbp', name: 'British Pound', symbol: '£' },
  { code: 'jpy', name: 'Japanese Yen', symbol: '¥' },
  { code: 'cny', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'aud', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'cad', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'chf', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'sgd', name: 'Singapore Dollar', symbol: 'S$' },
];

export default function SettingsScreen({ navigation }) {
  const { currency, updateCurrency } = useCurrency();
  const [settings, setSettings] = useState({
    refreshInterval: 30000,
    theme: 'light',
    notifications: true,
    alertSound: 'vibration',
  });
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    const savedSettings = await loadSettings();
    setSettings({ ...settings, ...savedSettings });
  };

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleCurrencySelect = async (selectedCurrency) => {
    await updateCurrency(selectedCurrency);
    setShowCurrencyModal(false);
  };

  const handleSoundSelect = async (selectedSound) => {
    await updateSetting('alertSound', selectedSound);
    setShowSoundModal(false);
    // Test the sound when user selects it
    await playAlertSound(selectedSound);
  };

  const testSound = async (soundId) => {
    await playAlertSound(soundId);
  };

  const availableSounds = useMemo(() => getAvailableSounds(), []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive alerts when price targets are reached
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting('notifications', value)}
              trackColor={{ false: colors.border, true: colors.binanceYellow }}
              thumbColor={settings.notifications ? colors.background : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Currency</Text>
              <Text style={styles.settingDescription}>
                Display prices in {currency.toUpperCase()} ({getCurrencySymbol(currency)})
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => setShowCurrencyModal(true)}
            >
              <Text style={styles.settingButtonText}>
                {currency.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Data Provider</Text>
            <Text style={styles.aboutValue}>CoinGecko API</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ezpz Crypto Price Alert - Stay informed about cryptocurrency prices
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity
                onPress={() => setShowCurrencyModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyItem,
                    currency === item.code && styles.currencyItemSelected,
                  ]}
                  onPress={() => handleCurrencySelect(item.code)}
                >
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyName}>{item.name}</Text>
                    <Text style={styles.currencyCode}>
                      {item.code.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.currencyRight}>
                    <Text style={styles.currencySymbol}>{item.symbol}</Text>
                    {currency === item.code && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSoundModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSoundModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Alert Sound</Text>
              <TouchableOpacity
                onPress={() => setShowSoundModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableSounds}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyItem,
                    settings.alertSound === item.id && styles.currencyItemSelected,
                  ]}
                  onPress={() => handleSoundSelect(item.id)}
                >
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyName}>
                      {item.name} {item.type === 'vibration' ? '📳' : '🔊'}
                    </Text>
                    <Text style={styles.currencyCode}>
                      {item.type === 'vibration' ? 'Vibration Pattern' : 'Sound File'}
                    </Text>
                  </View>
                  <View style={styles.currencyRight}>
                    <TouchableOpacity
                      style={styles.testButton}
                      onPress={() => testSound(item.id)}
                    >
                      <Text style={styles.testButtonText}>Test</Text>
                    </TouchableOpacity>
                    {settings.alertSound === item.id && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  settingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.binanceYellow,
    borderRadius: 6,
  },
  settingButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 13,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aboutLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  aboutValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currencyItemSelected: {
    backgroundColor: colors.backgroundTertiary,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  currencyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.binanceYellow,
  },
  checkmark: {
    fontSize: 18,
    color: colors.binanceYellow,
    fontWeight: 'bold',
  },
  testButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.binanceYellow,
    borderRadius: 6,
    marginRight: 8,
  },
  testButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
});

