import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import TextInputComponent from "../components/TextInputComponent";
import { useAuth } from "../features/auth/authProvider";
import { RootStackParamList } from "../navigation/RootNavigator";
import margins from "../settings/margins";
import radius from "../settings/radius";

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation<RootNavigationProp>();

  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(username, senha);
      navigation.navigate("App", { screen: "perfil" });
    } catch (err) {
      console.error("LoginScreen Error:", err);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Login</Text>

          <TextInputComponent
            label="Usuário"
            value={username}
            onChangeText={setUsername}
          />

          <TextInputComponent
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          >
            Entrar
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate("Auth", { screen: "register" })}
          >
            Não tem conta? Registre-se
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: margins.large,
  },
  card: {
    borderRadius: radius,
    padding: margins.medium,
  },
  title: {
    fontSize: 24,
    marginBottom: margins.medium,
    textAlign: "center",
  },
  button: {
    marginTop: margins.medium,
  },
});
