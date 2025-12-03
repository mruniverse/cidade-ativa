import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { useAuth } from "../features/auth/authProvider";
import { darkTheme, lightTheme, settings } from "../settings/theme";
import AppStack, { AppStackParamList } from "./AppStack";
import AuthStack, { AuthStackParamList } from "./AuthStack";

export type RootStackParamList = {
  App: NavigatorScreenParams<AppStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export default function RootNavigator() {
  const { user } = useAuth();

  const isDarkMode = false;

  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme} settings={settings}>
      <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}
