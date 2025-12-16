import { NativeModules } from 'react-native';

const { OzLiveness } = NativeModules;

export function startLiveness() {
  return OzLiveness.startLiveness();
}
