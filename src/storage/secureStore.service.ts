import * as SecureStore from 'expo-secure-store';

export default class SecureStoreService {
  setItem(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  }

  getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  deleteItem(key: string): Promise<void> {
    return SecureStore.deleteItemAsync(key);
  }
}
