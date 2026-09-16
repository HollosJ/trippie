import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          localStorage.removeItem('auth-token');
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      localStorage.removeItem('auth-token');
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const register = async (email: string, password: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('auth-token', data.token);
    } else {
      throw new Error(data.error || 'Authentication failed');
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('auth-token', data.token);
    } else {
      throw new Error(data.error || 'Authentication failed');
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth-token');
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
