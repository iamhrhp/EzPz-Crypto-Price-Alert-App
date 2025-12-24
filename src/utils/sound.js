import { Vibration } from 'react-native';

let soundObject = null;

// Vibrates the phone when an alert triggers
// Uses a pattern to make it feel like a ringtone
export const playAlertSound = async () => {
  try {
    // vibrate for 200ms, pause 100ms, repeat a few times
    Vibration.vibrate([200, 100, 200, 100, 200]);
  } catch (error) {
    console.error('Error playing alert sound:', error);
  }
};

// Stops any ongoing vibration (not really used but here just in case)
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

