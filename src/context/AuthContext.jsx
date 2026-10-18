"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { request } from '../services/api';

const AuthContext = createContext();

// The signed-in admin, as the server sees it (a session cookie; nothing secret is kept in the browser).
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try { setUser((await request('/api/admin/me')).user); } catch { setUser(null); }
    setReady(true);
  }, []);

  // Only the admin area needs to know; public pages never wait for this.
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) refresh(); else setReady(true);
  }, [refresh]);

  const login = async (email, password) => {
    try {
      const { user: u } = await request('/api/admin/login', { method: 'POST', body: { email, password } });
      setUser(u);
      return { success: true, user: u };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const logout = async () => {
    try { await request('/api/admin/logout', { method: 'POST' }); } catch { /* already signed out */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session: user && { user }, ready, isAuthenticated: !!user, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
