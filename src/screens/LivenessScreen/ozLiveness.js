import { NativeModules } from 'react-native';

const { OzLiveness } = NativeModules;

export function initAndLogin({ serverUrl, username, password }) {
  return OzLiveness.initAndLogin(serverUrl, username, password);
}

export function startLiveness() {
  return OzLiveness.startLiveness();
}
