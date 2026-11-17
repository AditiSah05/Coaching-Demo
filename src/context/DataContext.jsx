"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const DataContext = createContext();

// The server sends the site content with the page. Pages are cached and rebuilt when the admin saves, so there is
// nothing to fetch again on every page change (that used to cost a database read each time).
// `refreshData` is still there for a screen that wants to reload the content by hand.
export const DataProvider = ({ initialData, children }) => {
  const [data, setData] = useState(initialData);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (res.ok) setData(await res.json());
    } catch { /* offline: keep what is already shown */ }
  }, []);

  return <DataContext.Provider value={{ ...data, refreshData, api }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
