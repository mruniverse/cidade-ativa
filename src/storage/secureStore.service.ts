import * as SecureStore from 'expo-secure-store';

export default class SecureStoreService {
  setItem(key: string, value: string) {
    SecureStore.setItemAsync(key, value);
  }

  getItem(key: string) {
    return SecureStore.getItemAsync(key);
  }

  deleteItem(key: string) {
    SecureStore.deleteItemAsync(key);
  }
}
