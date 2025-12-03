import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../features/auth/authProvider";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const { login, loginWithGoogle } = useAuth();
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(username, senha);
      router.navigate("/");
    } catch (err) {
      console.error("LoginScreen Error:", err);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Erro ao fazer login com Google.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button
        mode="contained"
        loading={loading}
        onPress={handleLogin}
        style={styles.button}
      >
        Entrar
      </Button>

      <Button
        mode="outlined"
        icon="google"
        loading={googleLoading}
        onPress={handleGoogleLogin}
        style={styles.button}
      >
        Login com Google
      </Button>

      <Text style={styles.link} onPress={() => navigation.navigate("register")}>
        Não tem conta? Registre-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "blue",
  },
});