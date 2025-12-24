import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import * as DocumentPicker from 'expo-document-picker';
import { loadSettings, saveSettings } from '../utils/storage';
import { useCurrency } from '../utils/currencyContext';
import { getCurrencySymbol } from '../utils/formatters';
import { colors } from '../utils/colors';
import { getAvailableSounds, getAvailableVibrations, playAlertSound } from '../utils/sound';

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
    alertSound: 'none',
    alertVibration: 'vibration',
  });
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const soundBottomSheetRef = useRef(null);
  const vibrationBottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['75%', '90%'], []);

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
    soundBottomSheetRef.current?.close();
    // Test the sound when user selects it
    await playAlertSound(selectedSound, settings.alertVibration);
  };

  const handleVibrationSelect = async (selectedVibration) => {
    await updateSetting('alertVibration', selectedVibration);
    vibrationBottomSheetRef.current?.close();
    // Test the vibration when user selects it
    await playAlertSound(settings.alertSound === 'none' ? null : settings.alertSound, selectedVibration);
  };

  const testSound = async (soundId) => {
    await playAlertSound(soundId, settings.alertVibration);
  };

  const testVibration = async (vibrationId) => {
    await playAlertSound(settings.alertSound === 'none' ? null : settings.alertSound, vibrationId);
  };

  const pickSoundFromDevice = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        const fileUri = selectedFile.uri;
        const fileName = selectedFile.name || 'Custom Sound';

        // Save the file URI as the alert sound
        await updateSetting('alertSound', fileUri);
        await updateSetting('alertSoundName', fileName);
        
        soundBottomSheetRef.current?.close();
        
        // Test the selected sound
        await playAlertSound(fileUri);
        
        Alert.alert('Success', `"${fileName}" selected as alert sound`);
      }
    } catch (error) {
      console.error('Error picking sound file:', error);
      Alert.alert('Error', 'Failed to pick sound file. Please try again.');
    }
  };

  const availableVibrations = useMemo(() => {
    return getAvailableVibrations();
  }, []);

  const availableSounds = useMemo(() => {
    const sounds = getAvailableSounds();
    const customSounds = [];
    
    // Add custom sound if one is selected
    if (settings.alertSound && (settings.alertSound.startsWith('file://') || settings.alertSound.startsWith('content://'))) {
      const customSoundName = settings.alertSoundName || 'Custom Sound';
      customSounds.push({
        id: settings.alertSound,
        name: customSoundName,
        type: 'custom',
      });
    }
    
    // Create organized list for sounds only
    const organizedList = [];
    
    // Add "None" option for no sound
    organizedList.push({ id: 'none', name: 'None', type: 'sound' });
    
    // Add default tones section
    if (sounds.length > 0) {
      organizedList.push({ id: 'header-tones', type: 'header', name: 'Sound Files' });
      organizedList.push(...sounds);
    }
    
    // Add custom sounds section
    if (customSounds.length > 0) {
      if (sounds.length > 0) {
        organizedList.push({ id: 'separator-1', type: 'separator' });
      }
      organizedList.push({ id: 'header-custom', type: 'header', name: 'Custom Sounds' });
      organizedList.push(...customSounds);
    }
    
    return organizedList;
  }, [settings.alertSound, settings.alertSoundName]);

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
              <Text style={styles.settingLabel}>Alert Vibration</Text>
              <Text style={styles.settingDescription}>
                Choose vibration pattern for alerts
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => vibrationBottomSheetRef.current?.snapToIndex(0)}
            >
              <Text style={styles.settingButtonText}>
                {availableVibrations.find(v => v.id === settings.alertVibration)?.name || 'Default Vibration'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Alert Sound</Text>
              <Text style={styles.settingDescription}>
                Choose alert sound file (optional)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => soundBottomSheetRef.current?.snapToIndex(0)}
            >
              <Text style={styles.settingButtonText}>
                {availableSounds.find(s => s.id === settings.alertSound)?.name || 'None'}
              </Text>
            </TouchableOpacity>
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

      <BottomSheet
        ref={soundBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Select Alert Sound</Text>
          </View>
          <TouchableOpacity
            style={styles.pickSoundButton}
            onPress={pickSoundFromDevice}
          >
            <Text style={styles.pickSoundButtonText}>📁 Pick Sound from Device</Text>
          </TouchableOpacity>
          <BottomSheetFlatList
            data={availableSounds}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.bottomSheetListContent}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>{item.name}</Text>
                  </View>
                );
              }
              
              if (item.type === 'separator') {
                return <View style={styles.sectionSeparator} />;
              }
              
              return (
                <TouchableOpacity
                  style={[
                    styles.currencyItem,
                    settings.alertSound === item.id && styles.currencyItemSelected,
                  ]}
                  onPress={() => handleSoundSelect(item.id)}
                >
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyName}>
                      {item.name} {item.type === 'vibration' ? '📳' : item.type === 'custom' ? '📁' : '🔊'}
                    </Text>
                    <Text style={styles.currencyCode}>
                      {item.type === 'vibration' ? 'Vibration Pattern' : item.type === 'custom' ? 'Custom Sound File' : 'Default Tone'}
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
              );
            }}
          />
        </View>
      </BottomSheet>

      <BottomSheet
        ref={vibrationBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Select Vibration Pattern</Text>
          </View>
          <BottomSheetFlatList
            data={availableVibrations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.bottomSheetListContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.currencyItem,
                  settings.alertVibration === item.id && styles.currencyItemSelected,
                ]}
                onPress={() => handleVibrationSelect(item.id)}
              >
                <View style={styles.currencyInfo}>
                  <Text style={styles.currencyName}>
                    {item.name} 📳
                  </Text>
                  <Text style={styles.currencyCode}>
                    Vibration Pattern
                  </Text>
                </View>
                <View style={styles.currencyRight}>
                  <TouchableOpacity
                    style={styles.testButton}
                    onPress={() => testVibration(item.id)}
                  >
                    <Text style={styles.testButtonText}>Test</Text>
                  </TouchableOpacity>
                  {settings.alertVibration === item.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </BottomSheet>
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
  pickSoundButton: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.binanceYellow,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickSoundButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '600',
  },
  soundListContainer: {
    flex: 1,
    minHeight: 200,
  },
  sectionHeader: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSeparator: {
    height: 16,
    backgroundColor: colors.backgroundTertiary,
  },
  bottomSheetBackground: {
    backgroundColor: colors.backgroundSecondary,
  },
  bottomSheetIndicator: {
    backgroundColor: colors.textSecondary,
    width: 40,
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bottomSheetListContent: {
    paddingBottom: 20,
  },
});

