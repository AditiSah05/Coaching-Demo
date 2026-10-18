"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '../services/api';

const DataContext = createContext();

// The server sends the site content with the page, so there is no flash of old content.
// After that it is fetched again on every page change and when the tab regains focus,
// so something the admin just saved shows up without a manual reload.
export const DataProvider = ({ initialData, children }) => {
  const [data, setData] = useState(initialData);
  const pathname = usePathname();
  const first = useRef(true);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (res.ok) setData(await res.json());
    } catch { /* offline: keep what is already shown */ }
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    refreshData();
  }, [pathname, refreshData]);

  useEffect(() => {
    const onFocus = () => refreshData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshData]);

  return <DataContext.Provider value={{ ...data, refreshData, api }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
