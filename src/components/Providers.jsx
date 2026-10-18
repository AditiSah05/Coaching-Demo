"use client";

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';

export const Providers = ({ initialData, children }) => (
  <DataProvider initialData={initialData}>
    <AuthProvider>{children}</AuthProvider>
  </DataProvider>
);
