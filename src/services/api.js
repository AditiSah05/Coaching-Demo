import { initialSeedData } from '../data/seedData';

const STORAGE_KEY = 'pma_data_v18';
const AUTH_KEY = 'pma_auth_session';

// Helper to initialize and retrieve DB
const getDB = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeedData));
      return initialSeedData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return initialSeedData;
  }
};

// Helper to save DB and notify listeners
const saveDB = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new Event('pma_data_changed'));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

// --- AUTH SERVICES ---
export const loginAdmin = (email, password) => {
  if (email === 'admin@pacificmarine.demo' && password === 'Admin@123') {
    const session = {
      user: { email, name: 'Captain Administrator', role: 'Super Admin' },
      token: 'demo-token-' + Date.now(),
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true, session };
  }
  return { success: false, message: 'Invalid email or password. Use demo credentials.' };
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('pma_auth_changed'));
};

export const getAdminSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getAll = () => getDB();

// --- SITE SETTINGS & BANNERS ---
export const getSettings = () => getDB().settings;
export const updateSettings = (newSettings) => {
  const db = getDB();
  db.settings = { ...db.settings, ...newSettings };
  saveDB(db);
  return db.settings;
};

export const getBanners = () => getDB().banners;
export const updateBanners = (newBanners) => {
  const db = getDB();
  db.banners = { ...db.banners, ...newBanners };
  saveDB(db);
  return db.banners;
};

// --- COURSES ---
export const getCourses = () => getDB().courses;
export const saveCourse = (course) => {
  const db = getDB();
  if (course.id) {
    db.courses = db.courses.map(c => c.id === course.id ? course : c);
  } else {
    course.id = 'course-' + Date.now();
    db.courses.unshift(course);
  }
  saveDB(db);
  return course;
};
export const deleteCourse = (id) => {
  const db = getDB();
  db.courses = db.courses.filter(c => c.id !== id);
  saveDB(db);
  return true;
};

// --- TOPPERS & RESULTS ---
export const getToppers = () => getDB().toppers;
export const saveTopper = (topper) => {
  const db = getDB();
  if (topper.id) {
    db.toppers = db.toppers.map(t => t.id === topper.id ? topper : t);
  } else {
    topper.id = 'top-' + Date.now();
    db.toppers.unshift(topper);
  }
  saveDB(db);
  return topper;
};
export const deleteTopper = (id) => {
  const db = getDB();
  db.toppers = db.toppers.filter(t => t.id !== id);
  saveDB(db);
  return true;
};

export const getResults = () => getDB().results;
export const saveResult = (result) => {
  const db = getDB();
  if (result.id) {
    db.results = db.results.map(r => r.id === result.id ? result : r);
  } else {
    result.id = 'res-' + Date.now();
    db.results.unshift(result);
  }
  saveDB(db);
  return result;
};
export const deleteResult = (id) => {
  const db = getDB();
  db.results = db.results.filter(r => r.id !== id);
  saveDB(db);
  return true;
};

// --- ADMISSIONS ---
export const getAdmissions = () => getDB().admissions;
export const submitAdmission = (admissionData) => {
  const db = getDB();
  const id = 'ADM-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const newAdmission = {
    ...admissionData,
    id,
    status: 'Pending',
    submittedAt: new Date().toISOString()
  };
  db.admissions.unshift(newAdmission);
  saveDB(db);
  return newAdmission;
};
export const updateAdmissionStatus = (id, status) => {
  const db = getDB();
  db.admissions = db.admissions.map(a => a.id === id ? { ...a, status } : a);
  saveDB(db);
  return true;
};
export const deleteAdmission = (id) => {
  const db = getDB();
  db.admissions = db.admissions.filter(a => a.id !== id);
  saveDB(db);
  return true;
};

// --- ENQUIRIES & LEADS ---
export const getEnquiries = () => getDB().enquiries;
export const submitEnquiry = (enquiry) => {
  const db = getDB();
  const newEnquiry = {
    ...enquiry,
    id: 'enq-' + Date.now(),
    status: 'Unread',
    date: new Date().toISOString().split('T')[0]
  };
  db.enquiries.unshift(newEnquiry);
  saveDB(db);
  return newEnquiry;
};
export const updateEnquiryStatus = (id, status) => {
  const db = getDB();
  db.enquiries = db.enquiries.map(e => e.id === id ? { ...e, status } : e);
  saveDB(db);
  return true;
};
export const deleteEnquiry = (id) => {
  const db = getDB();
  db.enquiries = db.enquiries.filter(e => e.id !== id);
  saveDB(db);
  return true;
};

export const getLeads = () => getDB().leads;
export const submitLead = (lead) => {
  const db = getDB();
  const newLead = {
    ...lead,
    id: 'lead-' + Date.now(),
    downloadedAt: new Date().toISOString()
  };
  db.leads.unshift(newLead);
  saveDB(db);
  return newLead;
};

// --- STUDY MATERIALS ---
export const getStudyMaterials = () => getDB().studyMaterials;
export const saveStudyMaterial = (item) => {
  const db = getDB();
  if (item.id) {
    db.studyMaterials = db.studyMaterials.map(m => m.id === item.id ? item : m);
  } else {
    item.id = 'sm-' + Date.now();
    item.downloadsCount = 0;
    db.studyMaterials.unshift(item);
  }
  saveDB(db);
  return item;
};
export const deleteStudyMaterial = (id) => {
  const db = getDB();
  db.studyMaterials = db.studyMaterials.filter(m => m.id !== id);
  saveDB(db);
  return true;
};

// --- AVAILABLE FORMS ---
export const getAvailableForms = () => getDB().availableForms;
export const saveAvailableForm = (form) => {
  const db = getDB();
  if (form.id) {
    db.availableForms = db.availableForms.map(f => f.id === form.id ? form : f);
  } else {
    form.id = 'form-' + Date.now();
    form.updateDate = 'Feb 2026';
    db.availableForms.unshift(form);
  }
  saveDB(db);
  return form;
};
export const deleteAvailableForm = (id) => {
  const db = getDB();
  db.availableForms = db.availableForms.filter(f => f.id !== id);
  saveDB(db);
  return true;
};

// --- GALLERY ---
export const getGalleryItems = () => getDB().gallery;
export const saveGalleryItem = (item) => {
  const db = getDB();
  if (item.id) {
    db.gallery = db.gallery.map(g => g.id === item.id ? item : g);
  } else {
    item.id = 'gal-' + Date.now();
    db.gallery.unshift(item);
  }
  saveDB(db);
  return item;
};
export const deleteGalleryItem = (id) => {
  const db = getDB();
  db.gallery = db.gallery.filter(g => g.id !== id);
  saveDB(db);
  return true;
};

// --- FACULTY ---
export const getFaculty = () => getDB().faculty;
export const saveFaculty = (member) => {
  const db = getDB();
  if (member.id) {
    db.faculty = db.faculty.map(f => f.id === member.id ? member : f);
  } else {
    member.id = 'fac-' + Date.now();
    db.faculty.unshift(member);
  }
  saveDB(db);
  return member;
};
export const deleteFaculty = (id) => {
  const db = getDB();
  db.faculty = db.faculty.filter(f => f.id !== id);
  saveDB(db);
  return true;
};

// --- TESTIMONIALS ---
export const getTestimonials = () => getDB().testimonials;
export const saveTestimonial = (item) => {
  const db = getDB();
  if (item.id) {
    db.testimonials = db.testimonials.map(t => t.id === item.id ? item : t);
  } else {
    item.id = 'test-' + Date.now();
    db.testimonials.unshift(item);
  }
  saveDB(db);
  return item;
};
export const deleteTestimonial = (id) => {
  const db = getDB();
  db.testimonials = db.testimonials.filter(t => t.id !== id);
  saveDB(db);
  return true;
};

// --- FAQS ---
export const getFaqs = () => getDB().faqs;
export const saveFaq = (faq) => {
  const db = getDB();
  if (faq.id) {
    db.faqs = db.faqs.map(f => f.id === faq.id ? faq : f);
  } else {
    faq.id = 'faq-' + Date.now();
    db.faqs.unshift(faq);
  }
  saveDB(db);
  return faq;
};
export const deleteFaq = (id) => {
  const db = getDB();
  db.faqs = db.faqs.filter(f => f.id !== id);
  saveDB(db);
  return true;
};

// Reset to Seed
export const resetToSeedData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeedData));
  window.dispatchEvent(new Event('pma_data_changed'));
  return initialSeedData;
};
