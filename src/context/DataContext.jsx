"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { initialSeedData } from '../data/seedData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Server and first client render use seed data (no localStorage yet); refreshed after mount.
  const [data, setData] = useState(initialSeedData);

  const refreshData = useCallback(() => setData(api.getAll()), []);

  useEffect(() => {
    refreshData();
    window.addEventListener('pma_data_changed', refreshData);
    return () => window.removeEventListener('pma_data_changed', refreshData);
  }, [refreshData]);

  return (
    <DataContext.Provider value={{ ...data, refreshData, api }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
