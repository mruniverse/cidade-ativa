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

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<RootNavigationProp>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (senha !== senha2) {
      alert("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, senha, senha2);
      alert("Conta criada com sucesso!");
      navigation.navigate("App", { screen: "perfil" });
    } catch (err) {
      alert("Erro ao registrar. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Registro</Text>

          <TextInputComponent
            label="Usuário"
            value={username}
            onChangeText={setUsername}
          />

          <TextInputComponent
            label="Email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInputComponent
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TextInputComponent
            label="Confirmar Senha"
            value={senha2}
            onChangeText={setSenha2}
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          >
            Registrar
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate("Auth", { screen: "login" })}
          >
            Já tem conta? Faça login
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
