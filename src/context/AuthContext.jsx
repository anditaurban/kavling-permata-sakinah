import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api/adapter';
import { getStoredToken, setStoredToken, clearStoredToken } from '../services/api/client';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = [
  {
    role: 'ADMIN',
    name: 'Siti Sarah (Admin)',
    email: 'admin@permatasakinah.test',
    password: 'Password123!',
  },
  {
    role: 'OWNER',
    name: 'H. Ahmad Syarif (Owner)',
    email: 'owner@permatasakinah.test',
    password: 'Password123!',
  },
  {
    role: 'STAFF',
    name: 'Fajar Ramadhan (Staff 1)',
    email: 'staff1@permatasakinah.test',
    password: 'Password123!',
  },
  {
    role: 'CUSTOMER',
    name: 'Budi Santoso (Customer)',
    email: 'budi.portal@example.test',
    password: 'Password123!',
  },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ps_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  // Sync / verify session on app mount
  useEffect(() => {
    async function verifySession() {
      const currentToken = getStoredToken();
      if (!currentToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.data?.user) {
          setCurrentUser(res.data.user);
          localStorage.setItem('ps_user', JSON.stringify(res.data.user));
        } else {
          // Token invalid
          logout();
        }
      } catch {
        // Keep cached user if offline or network error, otherwise clear
      } finally {
        setLoading(false);
      }
    }

    verifySession();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.data) {
      const { user, token: newToken } = res.data;
      setCurrentUser(user);
      setToken(newToken);
      setStoredToken(newToken);
      localStorage.setItem('ps_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: res.error };
  };

  const loginWithPreset = async (targetRole) => {
    const cred = DEMO_CREDENTIALS.find((c) => c.role === targetRole) || DEMO_CREDENTIALS[0];
    return await login(cred.email, cred.password);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      setCurrentUser(null);
      setToken('');
      clearStoredToken();
      localStorage.removeItem('ps_user');
    }
  };

  const role = currentUser?.role || 'GUEST';
  const isAuthenticated = !!token && !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser, // alias
        role,
        token,
        isAuthenticated,
        loading,
        login,
        loginWithPreset,
        logout,
        availableUsers: DEMO_CREDENTIALS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
