import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { useAuth } from '../features/auth/authProvider';
import { darkTheme, lightTheme, settings } from '../settings/theme';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function RootNavigator() {
  const { user } = useAuth();

  const isDarkMode = false;

  return (
    <PaperProvider
      theme={isDarkMode ? darkTheme : lightTheme}
      settings={settings}
    >
      <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}
