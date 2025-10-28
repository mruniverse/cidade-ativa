import { ConfigContext, ExpoConfig } from 'expo/config';

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
  },
  android: {
    package: 'com.mruniverse.cidadeativa',
    icon: './src/assets/images/icon.png',
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './src/assets/images/icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#0e1e33',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: '9536dab4-a5ca-4ef5-a7ce-d9c965f83c91',
    },
  },
});
