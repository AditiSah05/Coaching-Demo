"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminSession, loginAdmin as apiLogin, logoutAdmin as apiLogout } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getAdminSession());
    setReady(true);
    const handleAuthChange = () => {
      setSession(getAdminSession());
    };
    window.addEventListener('pma_auth_changed', handleAuthChange);
    return () => window.removeEventListener('pma_auth_changed', handleAuthChange);
  }, []);

  const login = (email, password) => {
    const res = apiLogin(email, password);
    if (res.success) {
      setSession(res.session);
    }
    return res;
  };

  const logout = () => {
    apiLogout();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, ready, isAuthenticated: !!session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
