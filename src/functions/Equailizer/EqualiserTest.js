import { NativeModules } from 'react-native';
const { AudioEqualizer } = NativeModules;

// Set bass level: range is in millibels (depends on Android device, usually -1500 to 1500)
export function testBass(level = 1000) {
  console.warn('Setting bass to', level);
  AudioEqualizer.setBass(level);
}

// Reset EQ
export function resetEQ() {
  console.warn('Resetting EQ');
  AudioEqualizer.reset();
}
