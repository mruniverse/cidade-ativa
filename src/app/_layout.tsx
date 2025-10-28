import { settings } from '@/src/settings/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider settings={settings}>
      <Stack />
      <StatusBar />
    </PaperProvider>
  );
}
