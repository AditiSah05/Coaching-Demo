import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    settings: api.getSettings(),
    banners: api.getBanners(),
    courses: api.getCourses(),
    toppers: api.getToppers(),
    results: api.getResults(),
    faculty: api.getFaculty(),
    studyMaterials: api.getStudyMaterials(),
    availableForms: api.getAvailableForms(),
    gallery: api.getGalleryItems(),
    testimonials: api.getTestimonials(),
    faqs: api.getFaqs(),
    admissions: api.getAdmissions(),
    enquiries: api.getEnquiries(),
    leads: api.getLeads()
  });

  const refreshData = useCallback(() => {
    setData({
      settings: api.getSettings(),
      banners: api.getBanners(),
      courses: api.getCourses(),
      toppers: api.getToppers(),
      results: api.getResults(),
      faculty: api.getFaculty(),
      studyMaterials: api.getStudyMaterials(),
      availableForms: api.getAvailableForms(),
      gallery: api.getGalleryItems(),
      testimonials: api.getTestimonials(),
      faqs: api.getFaqs(),
      admissions: api.getAdmissions(),
      enquiries: api.getEnquiries(),
      leads: api.getLeads()
    });
  }, []);

  useEffect(() => {
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
