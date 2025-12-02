import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Constants from 'expo-constants';
import { Tabs } from 'expo-router';
import { useColorScheme, View } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { PaperProvider } from 'react-native-paper';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { AuthProvider } from '../features/auth/authProvider';
import { PostProvider } from '../features/posts/postProvider';
import { darkTheme, lightTheme, settings } from '../settings/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <AuthProvider>
      <PostProvider>
        <PaperProvider theme={theme} settings={settings}>
          <AutocompleteDropdownContextProvider>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: Constants.statusBarHeight,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 100,
              }}
            />
            <Tabs
              tabBar={BottomNavigationBar}
              screenOptions={{
                sceneStyle: { backgroundColor: 'transparent' },
              }}
            >
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
                        focused
                          ? theme.colors.primary
                          : theme.colors.onSecondary
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
                  headerShown: false,
                  tabBarIcon: ({ size, focused }) => (
                    <FontAwesome6
                      style={{ marginTop: -5 }}
                      name="newspaper"
                      color={
                        focused
                          ? theme.colors.primary
                          : theme.colors.onSecondary
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
                        focused
                          ? theme.colors.primary
                          : theme.colors.onSecondary
                      }
                      size={size}
                    />
                  ),
                }}
              />
            </Tabs>
          </AutocompleteDropdownContextProvider>
        </PaperProvider>
      </PostProvider>
    </AuthProvider>
  );
}
