import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import CustomTextInput from '../components/TextInputComponent';
import { useAuth } from '../features/auth/authProvider';

type AuthMode = 'login' | 'register';

export default function Perfil() {
  const { user, login, register, logout } = useAuth();
  const theme = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(username, password);
    } catch {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await register(username, email, password, confirmPassword);
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  if (!user || user.username === 'guest') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.formContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text variant="headlineMedium" style={styles.title}>
              {mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </Text>

            <CustomTextInput
              label="Usuário"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
              disabled={isLoading}
            />

            {mode === 'register' && (
              <CustomTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={isLoading}
              />
            )}

            <CustomTextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
              disabled={isLoading}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            {mode === 'register' && (
              <CustomTextInput
                label="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry={!showPassword}
                disabled={isLoading}
              />
            )}

            {error && (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={mode === 'login' ? handleLogin : handleRegister}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              {mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </Button>

            <Button
              mode="text"
              onPress={() =>
                switchMode(mode === 'login' ? 'register' : 'login')
              }
              style={styles.switchButton}
              disabled={isLoading}
            >
              {mode === 'login'
                ? 'Não tem conta? Criar conta'
                : 'Já tem conta? Entrar'}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View
      style={[
        styles.profileContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text variant="headlineMedium" style={styles.welcomeText}>
        Bem-vindo, {user.username}
      </Text>
      <Text variant="bodyLarge" style={styles.emailText}>
        Email: {user.email}
      </Text>
      <Button mode="outlined" onPress={logout} style={styles.logoutButton}>
        Sair
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 34,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 4,
  },
  switchButton: {
    marginTop: 16,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeText: {
    marginBottom: 8,
  },
  emailText: {
    marginBottom: 24,
    opacity: 0.7,
  },
  logoutButton: {
    marginTop: 16,
  },
});
