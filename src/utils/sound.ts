import { Vibration } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import { loadSettings } from './storage';

type SoundObject = Audio.Sound | null;

let soundObject: SoundObject = null;

// Different vibration patterns users can choose from
const VIBRATION_PATTERNS: Record<string, number[]> = {
  'vibration': [200, 100, 200, 100, 200], // default: short bursts
  'vibration-strong': [300, 150, 300, 150, 300], // longer, stronger
  'vibration-double': [200, 50, 200, 50, 200, 50, 200], // double pattern
  'vibration-single': [500], // one long vibration
  'vibration-quick': [100, 50, 100, 50, 100], // quick bursts
};

// Default sound files bundled with the app
// 
// HOW TO ADD DEFAULT TONES:
// 1. Place your sound files in the assets/ folder (e.g., assets/alert.mp3)
// 2. Add them to SOUND_FILES below using require()
// 3. Add a friendly name to SOUND_NAMES (optional but recommended)
// 4. Supported formats: .mp3, .wav, .m4a, .aac
//
// Example:
//   1. Add file: assets/my-alert.mp3
//   2. Add to SOUND_FILES: 'my-alert': require('../assets/my-alert.mp3'),
//   3. Add to SOUND_NAMES: 'my-alert': 'My Alert Tone',
//
const SOUND_FILES: Record<string, number> = {
  'alert-1': require('../../assets/Alert1.mp3'),
  'alert-2': require('../../assets/Alert2.mp3'),
  'alert-3': require('../../assets/Alert3.mp3'),
  'alert-4': require('../../assets/Alert4.mp3'),
  'alert-5': require('../../assets/Alert5.mp3'),
  'alert-6': require('../../assets/Alert6.mp3'),
};

// Friendly display names for default sounds
// If a sound isn't listed here, it will use a formatted version of the key name
const SOUND_NAMES: Record<string, string> = {
  'alert-1': 'Alert 1',
  'alert-2': 'Alert 2',
  'alert-3': 'Alert 3',
  'alert-4': 'Alert 4',
  'alert-5': 'Alert 5',
  'alert-6': 'Alert 6',
};

export interface SoundOption {
  id: string;
  name: string;
  type: 'vibration' | 'sound' | 'custom';
}

export interface VibrationOption {
  id: string;
  name: string;
  type: 'vibration';
}

// Plays the alert sound and vibration based on user's preference
export const playAlertSound = async (soundType: string | null = null, vibrationType: string | null = null): Promise<void> => {
  try {
    const settings = await loadSettings();
    
    // Get vibration pattern (always play vibration)
    const selectedVibration = vibrationType || settings.alertVibration || 'vibration';
    if (VIBRATION_PATTERNS[selectedVibration]) {
      Vibration.vibrate(VIBRATION_PATTERNS[selectedVibration]);
    }
    
    // Get sound file (optional - can be 'none')
    const selectedSound = soundType || settings.alertSound || 'none';
    
    // If no sound selected, just return (vibration already played)
    if (!selectedSound || selectedSound === 'none') {
      return;
    }

    // Check if it's a custom file URI (starts with file:// or content://)
    if (selectedSound.startsWith('file://') || selectedSound.startsWith('content://')) {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        if (soundObject) {
          await soundObject.unloadAsync();
        }
        
        const { sound } = await Audio.Sound.createAsync(
          { uri: selectedSound },
          { shouldPlay: true, volume: 1.0 }
        );
        
        soundObject = sound;
        // Vibration already played above, no need to vibrate again
      } catch (soundError) {
        console.error('Error playing custom sound file:', soundError);
        // Vibration already played, just log error
      }
      return;
    }

    // Check if it's a bundled sound file
    if (SOUND_FILES[selectedSound]) {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        if (soundObject) {
          await soundObject.unloadAsync();
        }
        
        // Use Asset.fromModule to properly resolve the audio file
        const assetModule = SOUND_FILES[selectedSound];
        const asset = Asset.fromModule(assetModule);
        await asset.downloadAsync();
        
        const { sound } = await Audio.Sound.createAsync(
          { uri: asset.localUri || asset.uri },
          { shouldPlay: true, volume: 1.0 }
        );
        
        soundObject = sound;
        // Vibration already played above, no need to vibrate again
      } catch (soundError) {
        console.error('Error playing sound file:', soundError);
        // Vibration already played, just log error
      }
    }
  } catch (error) {
    console.error('Error playing alert sound:', error);
    Vibration.vibrate(200);
  }
};

// Get list of available vibration patterns
export const getAvailableVibrations = (): VibrationOption[] => {
  try {
    return Object.keys(VIBRATION_PATTERNS || {}).map(key => ({
      id: key,
      name: key.replace('vibration-', '').replace('vibration', 'Default Vibration'),
      type: 'vibration' as const,
    }));
  } catch (error) {
    console.error('Error getting available vibrations:', error);
    return [{
      id: 'vibration',
      name: 'Default Vibration',
      type: 'vibration' as const,
    }];
  }
};

// Get list of available sound files
export const getAvailableSounds = (): SoundOption[] => {
  try {
    const soundOptions = Object.keys(SOUND_FILES || {}).map(key => ({
      id: key,
      name: SOUND_NAMES[key] || key.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      type: 'sound' as const,
    }));

    return soundOptions;
  } catch (error) {
    console.error('Error getting available sounds:', error);
    return [];
  }
};

// Stops any ongoing sound or vibration
export const stopAlertSound = async (): Promise<void> => {
  try {
    if (soundObject) {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
      soundObject = null;
    }
    Vibration.cancel();
  } catch (error) {
    console.error('Error stopping alert sound:', error);
  }
};


