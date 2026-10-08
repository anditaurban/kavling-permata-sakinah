import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS } from '../services/api/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Guest by default unless logged in
  const [currentUser, setCurrentUser] = useState(() => {
    const savedRole = localStorage.getItem('ps_mock_role');
    if (savedRole && savedRole !== 'GUEST') {
      const match = MOCK_USERS.find((u) => u.role === savedRole);
      if (match) return match;
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedRole = localStorage.getItem('ps_mock_role');
    return !!savedRole && savedRole !== 'GUEST';
  });

  // Switch role helper
  const switchRole = (role) => {
    if (!role || role === 'GUEST') {
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('ps_mock_role');
      return;
    }

    const user = MOCK_USERS.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('ps_mock_role', role);
    }
  };

  const login = (role = 'CUSTOMER') => {
    switchRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('ps_mock_role');
  };

  const role = currentUser?.role || 'GUEST';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser && isAuthenticated,
        switchRole,
        login,
        logout,
        availableUsers: MOCK_USERS,
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
