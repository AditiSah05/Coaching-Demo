"use client";

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';

export const Providers = ({ children }) => (
  <DataProvider>
    <AuthProvider>{children}</AuthProvider>
  </DataProvider>
);
