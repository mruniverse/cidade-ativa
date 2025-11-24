import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LoginScreen from "../app/login";
import RegisterScreen from "../app/register";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
