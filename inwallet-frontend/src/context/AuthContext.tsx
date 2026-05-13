import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getToken } from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  userId: number | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getToken());
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  // Sayfa yenilendiğinde token'dan kullanıcı bilgilerini çöz
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error("Geçersiz Token");
        
        // JWT payload'ını decode et (UTF-8 destekli)
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        
        setUsername(payload.sub);
        setUserId(Number(payload.userId));
        setIsLoggedIn(true);
        
        // İlk yüklemede ek bilgileri çek
        import('../services/api').then(({ userApi }) => {
          userApi.getMe(Number(payload.userId)).then(data => {
            setFirstName(data.firstName);
            setLastName(data.lastName);
          });
        });
      } catch (err) {
        console.error("Token çözme hatası:", err);
        authApi.logout();
        setIsLoggedIn(false);
      }
    }
  }, []);

  const refreshUser = async () => {
    if (!userId) return;
    const { userApi } = await import('../services/api');
    const data = await userApi.getMe(userId);
    setUsername(data.username);
    setFirstName(data.firstName);
    setLastName(data.lastName);
  };

  const login = async (user: string, password: string) => {
    await authApi.login(user, password);
    const token = getToken();
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        // JWT payload'ını decode et (UTF-8 destekli)
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        
        setUsername(payload.sub);
        setUserId(Number(payload.userId));
        setIsLoggedIn(true);
      }
    }
  };

  const register = async (user: string, email: string, password: string) => {
    await authApi.register(user, email, password);
  };

  const logout = () => {
    authApi.logout();
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
    setFirstName(null);
    setLastName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, username, firstName, lastName, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Kullanım kolaylığı için hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
