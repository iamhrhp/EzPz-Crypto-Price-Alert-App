import { Vibration } from 'react-native';
import { loadSettings } from './storage';

let soundObject = null;

// Different vibration patterns users can choose from
const VIBRATION_PATTERNS = {
  'vibration': [200, 100, 200, 100, 200], // default: short bursts
  'vibration-strong': [300, 150, 300, 150, 300], // longer, stronger
  'vibration-double': [200, 50, 200, 50, 200, 50, 200], // double pattern
  'vibration-single': [500], // one long vibration
  'vibration-quick': [100, 50, 100, 50, 100], // quick bursts
};

// Sound file mappings (users can add their own files to assets/)
const SOUND_FILES = {
  // Add your sound files here, e.g.:
  // 'beep': require('../assets/beep.mp3'),
  // 'alert': require('../assets/alert.mp3'),
};

// Plays the alert sound based on user's preference
export const playAlertSound = async (soundType = null) => {
  try {
    // Get user's sound preference from settings
    let selectedSound = soundType;
    if (!selectedSound) {
      const settings = await loadSettings();
      selectedSound = settings.alertSound || 'vibration';
    }

    // Check if it's a vibration pattern
    if (VIBRATION_PATTERNS[selectedSound]) {
      Vibration.vibrate(VIBRATION_PATTERNS[selectedSound]);
      return;
    }

    // Check if it's a sound file
    if (SOUND_FILES[selectedSound]) {
      try {
        // Dynamically import Audio only when needed
        const { Audio } = await import('expo-av');
        
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        if (soundObject) {
          await soundObject.unloadAsync();
        }
        
        const { sound } = await Audio.Sound.createAsync(SOUND_FILES[selectedSound], {
          shouldPlay: true,
          volume: 1.0,
        });
        
        soundObject = sound;
        Vibration.vibrate([200, 100, 200]); // light vibration with sound
      } catch (soundError) {
        console.error('Error playing sound file:', soundError);
        // Fallback to default vibration
        Vibration.vibrate(VIBRATION_PATTERNS['vibration']);
      }
    } else {
      // Default fallback
      Vibration.vibrate(VIBRATION_PATTERNS['vibration']);
    }
  } catch (error) {
    console.error('Error playing alert sound:', error);
    Vibration.vibrate(200);
  }
};

// Get list of available sound options for the settings screen
export const getAvailableSounds = () => {
  try {
    const vibrationOptions = Object.keys(VIBRATION_PATTERNS || {}).map(key => ({
      id: key,
      name: key.replace('vibration-', '').replace('vibration', 'Default Vibration'),
      type: 'vibration',
    }));

    const soundOptions = Object.keys(SOUND_FILES || {}).map(key => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      type: 'sound',
    }));

    return [...vibrationOptions, ...soundOptions];
  } catch (error) {
    console.error('Error getting available sounds:', error);
    // Return at least the default vibration option
    return [{
      id: 'vibration',
      name: 'Default Vibration',
      type: 'vibration',
    }];
  }
};

// Stops any ongoing sound or vibration
export const stopAlertSound = async () => {
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

