
import { lightTheme, settings } from '@/settings/theme';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const theme = lightTheme;
  // const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  function shouldShowHeader(){
    const excludePaths = ['index'];
    return !!excludePaths.includes(pathname);
  }

  return (
    <PaperProvider theme={theme} settings={settings}>
      <Stack screenOptions={{ headerShown: shouldShowHeader() }} />
      <StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
    </PaperProvider>
  );
}
