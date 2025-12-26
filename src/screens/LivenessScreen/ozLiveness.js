import { NativeModules } from 'react-native';

const { OzLiveness } = NativeModules;

export async function startLiveness() {
  return await OzLiveness.startLiveness();
}