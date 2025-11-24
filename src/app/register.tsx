import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../providers/authProvider";

type Props = {
  navigation: any;
};

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
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
      navigation.replace("login");
    } catch (err) {
      alert("Erro ao registrar. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={senha2}
        onChangeText={setSenha2}
        secureTextEntry
      />

      <Button title={loading ? "Registrando..." : "Registrar"} onPress={handleRegister} />

      <Text style={styles.link} onPress={() => navigation.navigate("login")}>
        Já tem conta? Faça login
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
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "blue",
  },
});
