import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import IndexScreen from "../app/index";
import PerfilScreen from "../app/perfil";
import PostagensScreen from "../app/postagens";

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={IndexScreen} options={{ headerShown: false }} />
      <Stack.Screen name="perfil" component={PerfilScreen} />
      <Stack.Screen name="postagens" component={PostagensScreen} />
    </Stack.Navigator>
  );
}
