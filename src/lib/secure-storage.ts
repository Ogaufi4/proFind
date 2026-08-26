import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const webStorage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;

export const secureStorage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') return webStorage?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') { webStorage?.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') { webStorage?.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  },
};
