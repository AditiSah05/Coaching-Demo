// One description of every editable thing on the site.
// The server uses it to validate and clean what it saves; the admin uses it to build the forms and tables.
//
// Field types: text, textarea, number, bool, date, url, image, html, select, lines (one item per line).

export const ROLES = {
  superadmin: { label: 'Super admin', areas: '*' },
  editor: {
    label: 'Editor',
    areas: ['dashboard', 'courses', 'blogs', 'gallery', 'videos', 'studyMaterials', 'forms', 'resultPosters', 'faculty', 'faqs', 'banners', 'media', 'reviews'],
  },
  counsellor: { label: 'Counsellor', areas: ['dashboard', 'enquiries', 'admissions', 'reviews'] },
};

export const can = (role, area) => {
  const a = ROLES[role]?.areas;
  return a === '*' || (Array.isArray(a) && a.includes(area));
};

const f = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra });
const order = f('order', 'Display order', 'number', { help: 'Lower numbers show first.', min: 0, max: 9999 });
const visible = f('visible', 'Show on website', 'bool', { default: true });

export const COLLECTIONS = {
  courses: {
    label: 'Courses', singular: 'course', area: 'courses', prefix: 'course', titleField: 'title', page: '/courses',
    fields: [
      f('title', 'Course name', 'text', { required: true, max: 120 }),
      f('slug', 'Web address (slug)', 'text', { max: 80, help: 'Letters, numbers and dashes. Leave empty to create it from the name.', slug: true, unique: true }),
      f('category', 'Category', 'text', { max: 60, placeholder: 'Entrance Exam, Deck Cadets, Engine Cadets', list: true }),
      f('badge', 'Badge', 'text', { max: 40, placeholder: 'Core Course' }),
      f('duration', 'Duration', 'text', { max: 80 }),
      f('mode', 'Mode of classes', 'text', { max: 60, placeholder: 'Offline' }),
      f('fee', 'Fee text', 'text', { max: 120, placeholder: 'Contact the academy for fees' }),
      f('image', 'Photo', 'image'),
      f('description', 'Description', 'textarea', { max: 3000, rows: 5 }),
      f('eligibility', 'Who can join', 'textarea', { max: 800, rows: 3 }),
      f('targetExam', 'Prepares you for', 'text', { max: 200 }),
      f('syllabus', 'What you study', 'lines', { max: 40, help: 'One item per line.' }),
      f('highlights', 'What you get', 'lines', { max: 40, help: 'One item per line.' }),
      f('featured', 'Featured', 'bool'),
      order,
    ],
    columns: ['title', 'category', 'duration'],
    sort: { key: 'order', then: 'title' },
  },

  blogs: {
    label: 'Blog posts', singular: 'post', area: 'blogs', prefix: 'post', titleField: 'title', page: '/blogs',
    fields: [
      f('title', 'Title', 'text', { required: true, max: 200 }),
      f('slug', 'Web address (slug)', 'text', { max: 100, slug: true, unique: true, help: 'Created from the title if left empty.' }),
      f('status', 'Status', 'select', { options: ['published', 'draft'], default: 'published', required: true }),
      f('date', 'Publish date', 'date', { required: true }),
      f('topic', 'Topic', 'text', { max: 60, list: true, placeholder: 'IMU CET & exams', required: true }),
      f('cover', 'Cover image', 'image'),
      f('excerpt', 'Short summary', 'textarea', { max: 300, rows: 3, help: 'Shown on the blog list and in search results.' }),
      f('content', 'Article', 'html', { required: true, max: 200000 }),
    ],
    columns: ['title', 'topic', 'status', 'date'],
    sort: { key: 'date', desc: true },
  },

  gallery: {
    label: 'Photo gallery', singular: 'photo', area: 'gallery', prefix: 'gal', titleField: 'title', page: '/gallery',
    fields: [
      f('title', 'Title', 'text', { required: true, max: 120 }),
      f('image', 'Photo', 'image', { required: true }),
      f('category', 'Category', 'text', { max: 60, list: true, required: true, placeholder: 'Felicitation, Classrooms' }),
      f('caption', 'Caption', 'textarea', { max: 300, rows: 2 }),
      f('featured', 'Lead photo', 'bool', { help: 'The featured photo is shown first.' }),
      order, visible,
    ],
    columns: ['image', 'title', 'category'],
    sort: { key: 'order', then: 'title' },
  },

  videos: {
    label: 'Video gallery', singular: 'video', area: 'videos', prefix: 'vid', titleField: 'title', page: '/videos',
    fields: [
      f('url', 'YouTube link', 'url', { required: true, max: 300, help: 'A Shorts, watch or youtu.be link.', youtube: true }),
      f('title', 'Title', 'text', { required: true, max: 200 }),
      f('topic', 'Topic', 'text', { max: 60, list: true, required: true, placeholder: 'Interview preparation' }),
      f('featured', 'Featured on the video page', 'bool'),
      order, visible,
    ],
    columns: ['thumb', 'title', 'topic'],
    sort: { key: 'order', then: 'title' },
  },

  studyMaterials: {
    label: 'Study materials', singular: 'material', area: 'studyMaterials', prefix: 'sm', titleField: 'title', page: '/study-materials',
    fields: [
      f('title', 'Title', 'text', { required: true, max: 160 }),
      f('category', 'Group', 'text', { max: 60, list: true, required: true, placeholder: 'IMU CET' }),
      f('downloadUrl', 'Google Drive link', 'url', { max: 400, help: 'Make the file "Anyone with the link can view".' }),
      f('type', 'Kind', 'text', { max: 60, placeholder: 'Mock test, Past paper, Notes' }),
      f('size', 'File size (optional)', 'text', { max: 30 }),
      f('previewText', 'Short description', 'textarea', { max: 300, rows: 2 }),
      order, visible,
    ],
    columns: ['title', 'category', 'downloadUrl'],
    sort: { key: 'order', then: 'title' },
  },

  forms: {
    label: 'Exam and institute forms', singular: 'form', area: 'forms', prefix: 'form', titleField: 'name', page: '/forms',
    fields: [
      f('name', 'Institute / exam', 'text', { required: true, max: 120 }),
      f('logo', 'Logo', 'image'),
      f('batch', 'Batch', 'text', { max: 60, placeholder: 'August 2026' }),
      f('course', 'Courses covered', 'text', { max: 120, placeholder: 'DNS / B.Sc / B.Tech' }),
      f('fee', 'Form fee', 'text', { max: 160, help: 'Separate several fees with " / ".' }),
      f('startDate', 'Start date', 'date'),
      f('lastDate', 'Last date to apply', 'date'),
      f('examDate', 'Exam date', 'date'),
      f('applyUrl', 'Apply link', 'url', { max: 400 }),
      order, visible,
    ],
    columns: ['logo', 'name', 'lastDate'],
    sort: { key: 'order', then: 'name' },
  },

  resultPosters: {
    label: 'Result posters', singular: 'poster', area: 'resultPosters', prefix: 'res', titleField: 'company', page: '/results',
    fields: [
      f('src', 'Poster image', 'image', { required: true }),
      f('year', 'Year', 'text', { required: true, max: 4, list: true, placeholder: '2025' }),
      f('names', 'Cadet names', 'lines', { help: 'One name per line, exactly as printed.', max: 20 }),
      f('company', 'Shipping company', 'text', { required: true, max: 120 }),
      f('detail', 'Extra line on the poster', 'text', { max: 160 }),
      f('note', 'Replace the description (optional)', 'text', { max: 300 }),
      order, visible,
    ],
    columns: ['src', 'company', 'year'],
    sort: { key: 'year', desc: true, then: 'order' },
  },

  faculty: {
    label: 'Team and faculty', singular: 'person', area: 'faculty', prefix: 'fac', titleField: 'name', page: '/about',
    fields: [
      f('name', 'Name', 'text', { required: true, max: 120 }),
      f('role', 'Role', 'text', { required: true, max: 120, placeholder: 'Co-Founder' }),
      f('image', 'Photo', 'image'),
      f('bio', 'About', 'textarea', { max: 1500, rows: 4 }),
      f('qualification', 'Qualification', 'text', { max: 200 }),
      order, visible,
    ],
    columns: ['image', 'name', 'role'],
    sort: { key: 'order', then: 'name' },
  },

  faqs: {
    label: 'FAQs', singular: 'question', area: 'faqs', prefix: 'faq', titleField: 'question', page: '/',
    fields: [
      f('question', 'Question', 'text', { required: true, max: 240 }),
      f('answer', 'Answer', 'textarea', { required: true, max: 2000, rows: 5 }),
      order, visible,
    ],
    columns: ['question'],
    sort: { key: 'order', then: 'question' },
  },

  // Written by visitors or imported from Google; the admin approves what appears on the site.
  reviews: {
    label: 'Reviews', singular: 'review', area: 'reviews', prefix: 'rev', titleField: 'name', page: '/',
    fields: [
      f('name', 'Reviewer name', 'text', { required: true, max: 80 }),
      f('role', 'Who they are', 'text', { max: 80, placeholder: 'Student, Parent' }),
      f('rating', 'Rating (1 to 5)', 'number', { required: true, min: 1, max: 5, default: 5 }),
      f('text', 'Review', 'textarea', { required: true, max: 1200, rows: 5 }),
      f('source', 'Source', 'select', { options: ['website', 'google'], default: 'website' }),
      f('status', 'Status', 'select', { options: ['pending', 'approved', 'rejected'], default: 'pending', required: true }),
      f('featured', 'Feature first', 'bool'),
      f('reply', 'Academy reply (optional)', 'textarea', { max: 500, rows: 2 }),
    ],
    columns: ['name', 'rating', 'status'],
    sort: { key: 'createdAt', desc: true },
  },

  // Created by visitors through the site forms; the admin only updates the follow-up fields.
  enquiries: {
    label: 'Enquiries', singular: 'enquiry', area: 'enquiries', prefix: 'enq', titleField: 'name', page: '/contact', inbound: true,
    fields: [
      f('name', 'Name', 'text', { required: true, max: 100 }),
      f('phone', 'Mobile', 'text', { required: true, max: 20 }),
      f('email', 'Email', 'text', { max: 120 }),
      f('course', 'Course', 'text', { max: 120 }),
      f('message', 'Message', 'textarea', { max: 1500 }),
      f('status', 'Status', 'select', { options: ['New', 'Contacted', 'Resolved'], default: 'New' }),
      f('notes', 'Internal notes', 'textarea', { max: 2000, rows: 3 }),
    ],
    publicFields: ['name', 'phone', 'email', 'course', 'message'],
    columns: ['name', 'phone', 'course', 'status'],
    sort: { key: 'createdAt', desc: true },
  },

  admissions: {
    label: 'Admissions', singular: 'application', area: 'admissions', prefix: 'ADM', titleField: 'fullName', page: '/admission', inbound: true,
    fields: [
      f('fullName', 'Full name', 'text', { required: true, max: 120 }),
      f('email', 'Email', 'text', { max: 120 }),
      f('phone', 'Mobile', 'text', { required: true, max: 20 }),
      f('dob', 'Date of birth', 'text', { max: 20 }),
      f('gender', 'Gender', 'text', { max: 20 }),
      f('fatherName', "Father's name", 'text', { max: 120 }),
      f('city', 'City', 'text', { max: 80 }),
      f('state', 'State', 'text', { max: 80 }),
      f('qualification', 'Qualification', 'text', { max: 80 }),
      f('pcmPercentage', 'PCM %', 'text', { max: 10 }),
      f('englishPercentage', 'English %', 'text', { max: 10 }),
      f('courseName', 'Course', 'text', { max: 160 }),
      f('batchPreference', 'Batch preference', 'text', { max: 80 }),
      f('hostelRequired', 'Hostel required', 'text', { max: 10 }),
      f('status', 'Status', 'select', { options: ['Pending', 'Contacted', 'Shortlisted', 'Enrolled', 'Rejected'], default: 'Pending' }),
      f('notes', 'Internal notes', 'textarea', { max: 2000, rows: 3 }),
    ],
    publicFields: ['fullName', 'email', 'phone', 'dob', 'gender', 'fatherName', 'city', 'state', 'qualification', 'pcmPercentage', 'englishPercentage', 'courseName', 'batchPreference', 'hostelRequired'],
    columns: ['fullName', 'courseName', 'phone', 'status'],
    sort: { key: 'createdAt', desc: true },
  },
};

// Single documents (not lists).
export const SINGLETONS = {
  banners: {
    label: 'Announcement bar', area: 'banners',
    fields: [
      f('admissionOpen', 'Show the announcement bar', 'bool'),
      f('bannerText', 'Announcement text', 'text', { max: 200 }),
    ],
  },
  settings: {
    label: 'Site settings', area: 'settings',
    groups: [
      { title: 'Institute', fields: [
        f('instituteName', 'Institute name', 'text', { required: true, max: 100 }),
        f('tagline', 'Tagline', 'text', { max: 200 }),
      ] },
      { title: 'Contact', fields: [
        f('phonePrimary', 'Main phone', 'text', { max: 30 }),
        f('phoneSecondary', 'Second phone (optional)', 'text', { max: 30 }),
        f('whatsapp', 'WhatsApp number', 'text', { max: 30 }),
        f('email', 'Email', 'text', { max: 120 }),
        f('address', 'Address', 'textarea', { max: 300, rows: 2 }),
        f('hours', 'Opening hours', 'lines', { max: 8, help: 'One line each, e.g. "Monday to Saturday, 9:00 AM to 7:00 PM".' }),
      ] },
      { title: 'Map', fields: [
        f('mapEmbedUrl', 'Google Maps embed link', 'url', { max: 800, help: 'From Google Maps: Share, Embed a map, copy the src link.' }),
        f('mapDirectionsUrl', 'Directions link', 'url', { max: 500 }),
        f('googleMapsPlaceUrl', 'Google Maps place link', 'url', { max: 500 }),
      ] },
      { title: 'Google reviews', fields: [
        f('googleReviewsUrl', 'Link to all your Google reviews', 'url', { max: 500 }),
        f('googleWriteReviewUrl', 'Link to write a Google review', 'url', { max: 500 }),
      ] },
      { title: 'Social links', fields: [
        f('socialLinks.facebook', 'Facebook', 'url', { max: 300 }),
        f('socialLinks.instagram', 'Instagram', 'url', { max: 300 }),
        f('socialLinks.youtube', 'YouTube (footer icon)', 'url', { max: 300 }),
        f('socialLinks.whatsapp', 'WhatsApp link', 'url', { max: 300 }),
        f('youtubeChannelUrl', 'YouTube channel link', 'url', { max: 300 }),
      ] },
      { title: 'Home page', fields: [
        f('heroHeading', 'Main heading', 'text', { max: 120 }),
        f('heroSubheading', 'Intro text', 'textarea', { max: 500, rows: 3 }),
      ] },
      { title: 'About page', fields: [
        f('about.story', 'Our story', 'textarea', { max: 3000, rows: 6 }),
        f('about.mission', 'Mission', 'textarea', { max: 1500, rows: 4 }),
        f('about.vision', 'Vision', 'textarea', { max: 1500, rows: 4 }),
      ] },
      { title: 'Search engines (SEO)', fields: [
        f('seo.title', 'Default page title', 'text', { max: 70, help: 'About 50 to 60 characters works best.' }),
        f('seo.description', 'Default description', 'textarea', { max: 170, rows: 2, help: 'About 150 characters works best.' }),
      ] },
    ],
  },
};

export const allSettingFields = () => SINGLETONS.settings.groups.flatMap((g) => g.fields);

export const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
export const setPath = (obj, path, value) => {
  const keys = path.split('.');
  let o = obj;
  keys.slice(0, -1).forEach((k) => { if (typeof o[k] !== 'object' || o[k] === null) o[k] = {}; o = o[k]; });
  o[keys[keys.length - 1]] = value;
  return obj;
};

export const slugify = (t = '') =>
  String(t).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);

// Accepts a Shorts / watch / youtu.be link or a bare 11-character id.
export const youtubeId = (value = '') => {
  const v = String(value).trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  const m = v.match(/(?:youtube\.com\/(?:shorts\/|embed\/|watch\?(?:.*&)?v=)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
};
