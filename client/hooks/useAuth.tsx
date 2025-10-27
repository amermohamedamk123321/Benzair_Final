import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.isAuthenticated && authData.username) {
          setUser(authData);
        }
      } catch (error) {
        localStorage.removeItem('admin-auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Try server-side auth first
    try {
      const res = await fetch('/api/admins/auth', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ username, password }) });
      if (res && res.ok) {
        const u = await res.json();
        const userData = { username: u.username, isAuthenticated: true };
        setUser(userData);
        localStorage.setItem('admin-auth', JSON.stringify(userData));
        return true;
      }
    } catch (e) {
      // continue to fallback
    }

    // Fallback to local admin-users stored in localStorage
    try {
      let admins: { username: string; password: string }[] = [];
      try {
        const saved = localStorage.getItem('admin-users');
        if (saved) admins = JSON.parse(saved);
      } catch {}
      if (admins.length === 0) {
        admins = [{ username: 'amermohamed', password: 'amk123321' }, { username: 'Amirkzd', password: 'amiradmin' }];
        localStorage.setItem('admin-users', JSON.stringify(admins));
      }
      const match = admins.find(a => a.username === username && a.password === password);
      if (match) {
        const userData = { username: match.username, isAuthenticated: true };
        setUser(userData);
        localStorage.setItem('admin-auth', JSON.stringify(userData));
        return true;
      }
    } catch (e) {
      // ignore
    }

    return false;
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('admin-auth');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
