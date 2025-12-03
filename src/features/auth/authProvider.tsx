import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TokenExpiredError, TokenInvalidError } from '../../api/api.errors';
import { ApiService } from '../../api/api.service';
import { AuthService } from '../../api/auth.service';
import SecureStoreService from '../../storage/secureStore.service';
import { User } from './user.types';

const GUEST_CREDENTIALS = {
  username: 'guest',
  password: 'guest',
};

const GUEST_USER: User = {
  id: 'guest',
  username: 'guest',
  email: 'guest@cidadeativa.app',
  criado_em: new Date().toISOString(),
  is_staff: false,
  isGuest: true,
};

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isGuest: boolean;
  isLoading: boolean;
  login: (username: string, senha: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    senha: string,
    senha2: string
  ) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const secureStorageService = useMemo(() => new SecureStoreService(), []);
  const authService = useMemo(() => new AuthService(), []);

  const isGuest = useMemo(() => user?.isGuest === true, [user]);

  const loginAsGuest = useCallback(async () => {
    try {
      const response = await authService.login(
        GUEST_CREDENTIALS.username,
        GUEST_CREDENTIALS.password
      );
      const guestUser: User = {
        ...response.usuario,
        isGuest: true,
      };
      await secureStorageService.setItem('isGuest', 'true');
      setUser(guestUser);
    } catch (err) {
      console.error('Failed to login as guest:', err);
      // Fallback: set guest user without backend authentication
      await secureStorageService.setItem('isGuest', 'true');
      setUser(GUEST_USER);
    }
  }, [authService, secureStorageService]);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await secureStorageService.getItem('authorization');
      const isGuestStored = await secureStorageService.getItem('isGuest');

      if (!token) {
        // No token found, login as guest
        await loginAsGuest();
        return;
      }

      const apiService = new ApiService();
      try {
        const response = await apiService.get('accounts/dashboard');
        if (response.ok) {
          const data = await response.json();
          const restoredUser: User = {
            ...data.user,
            isGuest: isGuestStored === 'true',
          };
          setUser(restoredUser);
        } else {
          // Token invalid, login as guest
          await loginAsGuest();
        }
      } catch (err) {
        if (
          err instanceof TokenExpiredError ||
          err instanceof TokenInvalidError
        ) {
          console.log('Token invalid or expired, logging in as guest');
          await secureStorageService.deleteItem('authorization');
          await loginAsGuest();
        } else {
          console.error('Error restoring session:', err);
          await loginAsGuest();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [secureStorageService, loginAsGuest]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(
    async (username: string, senha: string) => {
      const response = await authService.login(username, senha);
      await secureStorageService.deleteItem('isGuest');
      setUser({ ...response.usuario, isGuest: false });
    },
    [authService, secureStorageService]
  );

  const register = useCallback(
    async (username: string, email: string, senha: string, senha2: string) => {
      const response = await authService.register(
        username,
        email,
        senha,
        senha2
      );
      await secureStorageService.deleteItem('isGuest');
      setUser({ ...response, isGuest: false });
    },
    [authService, secureStorageService]
  );

  const logout = useCallback(async () => {
    authService.logout();
    await secureStorageService.deleteItem('isGuest');
    setUser(null);
    // After logout, login as guest again
    await loginAsGuest();
  }, [authService, secureStorageService, loginAsGuest]);

  const AuthContextValue = useMemo(
    () => ({
      user,
      setUser,
      isGuest,
      isLoading,
      login,
      register,
      logout,
      loginAsGuest,
    }),
    [user, isGuest, isLoading, login, register, logout, loginAsGuest]
  );

  return <AuthContext.Provider {...props} value={AuthContextValue} />;
};

export { AuthProvider, useAuth };
