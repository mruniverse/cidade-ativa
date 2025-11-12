import React, {
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
import ApiService from '../api/api.service';
import SecureStoreService from '../storage/secureStore.service';
import { User } from '../types/user';

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
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

  useEffect(() => {
    if (user) return;
    fetchGuestUser();
  }, [user]);

  async function fetchGuestUser() {
    const apiService = new ApiService({ shouldAuthenticate: false });
    const response = await apiService
      .post('accounts/login', { username: 'guest', senha: 'guest' })
      .then(async response => {
        console.log('Login response status:', response.status);
        return response.json() as Promise<LoginResponse>;
      })
      .catch(error => {
        console.error('Error fetching guest user:', error);
        return null;
      });
    if (!response) return;

    console.log('Guest user logged in:', response.usuario);
    const secureStorageService = new SecureStoreService();
    secureStorageService.setItem('authorization', response.access);
    setUser(response.usuario);
  }

  const AuthContextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider {...props} value={AuthContextValue} />;
};

export { AuthProvider, useAuth };
