import { ConfigContext, ExpoConfig } from 'expo/config';
import { PERMISSIONS } from 'react-native-permissions';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'cidade-ativa',
  name: 'Cidade Ativa',
  scheme: 'cidadeativa',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.mruniverse.cidadeativa',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Este aplicativo utiliza sua localização para mostrar pontos de interesse próximos a você.',
    },
  },
  android: {
    package: 'com.mruniverse.cidadeativa',
    icon: './src/assets/images/icon.png',
    permissions: [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        image: './src/assets/images/icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#0e1e33',
      },
    ],
    [
      'react-native-permissions',
      {
        iosPermissions: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
        androidPermissions: [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
      },
    ],
    [
      'expo-secure-store',
      {
        configureAndroidBackup: true,
        faceIDPermission:
          'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: '9536dab4-a5ca-4ef5-a7ce-d9c965f83c91',
    },
  },
});
