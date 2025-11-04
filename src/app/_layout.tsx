import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { PaperProvider } from 'react-native-paper';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { AuthProvider } from '../providers/authProvider';
import { darkTheme, lightTheme, settings } from '../settings/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <AuthProvider>
      <PaperProvider theme={theme} settings={settings}>
        <AutocompleteDropdownContextProvider>
          <StatusBar style="auto" backgroundColor="rgba(0, 0, 0, 0.2)" />
          <Tabs tabBar={BottomNavigationBar}>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Mapa',
                headerShown: false,
                tabBarIcon: ({ size, focused }) => (
                  <FontAwesome6
                    name="map"
                    style={{ marginTop: -5 }}
                    color={
                      focused ? theme.colors.primary : theme.colors.onSecondary
                    }
                    size={size}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="postagens"
              options={{
                title: 'Postagens',
                tabBarIcon: ({ size, focused }) => (
                  <FontAwesome6
                    style={{ marginTop: -5 }}
                    name="newspaper"
                    color={
                      focused ? theme.colors.primary : theme.colors.onSecondary
                    }
                    size={size}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="perfil"
              options={{
                title: 'Perfil',
                tabBarIcon: ({ size, focused }) => (
                  <FontAwesome6
                    style={{ marginTop: -5 }}
                    name="user"
                    color={
                      focused ? theme.colors.primary : theme.colors.onSecondary
                    }
                    size={size}
                  />
                ),
              }}
            />
          </Tabs>
        </AutocompleteDropdownContextProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
