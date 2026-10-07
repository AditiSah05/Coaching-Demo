import React, { Suspense, lazy } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { OurCourses } from './pages/OurCourses';
import { AdmissionForm } from './pages/AdmissionForm';
import { Results } from './pages/Results';
import { StudyMaterials } from './pages/StudyMaterials';
import { AvailableForms } from './pages/AvailableForms';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminAdmissions } from './pages/admin/AdminAdmissions';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminResults } from './pages/admin/AdminResults';
import { AdminStudyMaterials } from './pages/admin/AdminStudyMaterials';
import { AdminForms } from './pages/admin/AdminForms';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminFaculty } from './pages/admin/AdminFaculty';
import { AdminFaqs } from './pages/admin/AdminFaqs';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminProfile } from './pages/admin/AdminProfile';

const LoadingFallback = () => (
  <div className="min-h-screen bg-navy-deep text-gold font-serif flex items-center justify-center text-lg animate-pulse">
    ⚓ Pacific Marine Academy Loading...
  </div>
);

export function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <HashRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              
              {/* Public Website Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="courses" element={<OurCourses />} />
                <Route path="admission" element={<AdmissionForm />} />
                <Route path="results" element={<Results />} />
                <Route path="study-materials" element={<StudyMaterials />} />
                <Route path="forms" element={<AvailableForms />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Panel Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="admissions" element={<AdminAdmissions />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="results" element={<AdminResults />} />
                <Route path="study-materials" element={<AdminStudyMaterials />} />
                <Route path="forms" element={<AdminForms />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="faculty" element={<AdminFaculty />} />
                <Route path="faqs" element={<AdminFaqs />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>

            </Routes>
          </Suspense>
        </HashRouter>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
