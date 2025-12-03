import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../features/auth/authProvider";
import { AuthStackParamList } from "../navigation/AuthStack";

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function Perfil() {
  const { user } = useAuth();
  const navigation = useNavigation<AuthNavigationProp>();

  if (!user || user.username === "guest") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ marginBottom: 16 }}>
          Você precisa estar autenticado para acessar o perfil
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("login")}
          style={{ marginBottom: 8 }}
        >
          Ir para Login
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("register")}
        >
          Ir para Registro
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo, {user.username}</Text>
      <Text>Email: {user.email}</Text>
    </View>
  );
}
