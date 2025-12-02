import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ApiService } from '../../api/api.service';
import SecureStoreService from '../../storage/secureStore.service';
import { User } from './user.types';

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (username: string, senha: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    senha: string,
    senha2: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

type LoginResponse = {
  access: string;
  usuario: User;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const AuthProvider = (props: { children: ReactNode }): ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const secureStorageService = new SecureStoreService();
  const authService = new AuthService();

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const token = await secureStorageService.getItem('authorization');
    if (!token) return;
    const apiService = new ApiService();
    try {
      const response = await apiService.get('accounts/dashboard');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      if (
        err instanceof TokenExpiredError ||
        err instanceof TokenInvalidError
      ) {
        console.log('Token invalid or expired, clearing session');
        logout();
      } else {
        console.error('Erro ao restaurar sessão:', err);
      }
    }
  }

  async function login(username: string, senha: string) {
    const response = await authService.login(username, senha);
    setUser(response.usuario);
  }

  async function register(
    username: string,
    email: string,
    senha: string,
    senha2: string
  ) {
    const apiService = new ApiService({ shouldAuthenticate: false });
    const response = await apiService.register(username, email, senha, senha2);
    setUser(response);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  const AuthContextValue = useMemo(
    () => ({ user, setUser, login, register, logout }),
    [user, setUser]
  );

  return <AuthContext.Provider {...props} value={AuthContextValue} />;
};

export { AuthProvider, useAuth };
