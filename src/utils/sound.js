import { Vibration } from 'react-native';

let soundObject = null;

/**
 * Play alert sound
 * Uses vibration to alert the user
 */
export const playAlertSound = async () => {
  try {
    // Play vibration pattern: vibrate, pause, vibrate, pause, vibrate
    // This creates a "ringing" effect
    Vibration.vibrate([200, 100, 200, 100, 200]);
  } catch (error) {
    console.error('Error playing alert sound:', error);
  }
};

/**
 * Stop alert sound
 */
export const stopAlertSound = async () => {
  try {
    if (soundObject) {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
      soundObject = null;
    }
  } catch (error) {
    console.error('Error stopping alert sound:', error);
  }
};

