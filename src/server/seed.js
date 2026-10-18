// Starting content, taken from the site as it was before the admin existed.
// Used once, when the database file is first created, and by "reset to defaults".
import { initialSeedData } from '../data/seedData';
import { blogPosts } from '../data/blogIndex';
import { blogContent } from '../data/blogContent';
import { shortsMeta, featuredShort } from '../data/shortsMeta';
import { examForms } from '../data/examForms';
import { resultPosters } from '../data/resultPosters';
import { youtubeId } from '../shared/schema';

const now = () => new Date().toISOString();
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function buildSeed() {
  const t = now();
  const s = structuredClone(initialSeedData);
  const { youtubeShorts = [], ...settings } = s.settings;

  settings.hours = ['Monday to Saturday, 9:00 AM to 7:00 PM', 'Sunday closed'];
  settings.about = {
    story: 'At Pacific Marine Academy, we help aspiring cadets achieve their dream of joining the Merchant Navy with confidence. As one of the best IMU-CET coaching institutes in India, we offer a structured curriculum, expert faculty guidance, and personal mentorship to prepare you for IMU-CET, DNS sponsorship exams, and Merchant Navy interviews.\n\nWith our result-oriented approach, modern classrooms, and consistent record of high selection and sponsorship success rates, we ensure you are fully prepared to start your maritime career.',
    mission: 'To provide comprehensive and up-to-date training for aspiring Merchant Navy candidates: expert instruction, rigorous practice and holistic development, in a disciplined learning environment with personal attention and career guidance.',
    vision: 'To produce highly skilled and knowledgeable candidates who excel in their careers, and to foster a culture of excellence, innovation and integrity that contributes competent and confident professionals to the nation\'s maritime sector.',
  };
  settings.seo = {
    title: 'Best IMU CET Coaching in Sikar | Pacific Marine Academy',
    description: 'Pacific Marine Academy, Sikar: IMU CET coaching, DNS sponsorship preparation and Merchant Navy interview training for aspiring cadets.',
  };

  const courses = s.courses.map((c, i) => ({ ...c, order: i + 1 }));

  const videos = youtubeShorts.map((url, i) => {
    const yt = youtubeId(url);
    const meta = shortsMeta[yt] || {};
    return { id: `vid-${yt}`, ytId: yt, url: `https://www.youtube.com/shorts/${yt}`, title: meta.title || 'YouTube Short', topic: meta.topic || 'Student life', featured: yt === featuredShort, visible: true, order: i + 1 };
  });

  const blogs = blogPosts.map((p) => ({
    id: `post-${p.slug.slice(0, 10)}-${p.date.replace(/-/g, '')}`,
    slug: p.slug, title: p.title, date: p.date, topic: p.topic, status: 'published',
    cover: p.cover || '', excerpt: p.excerpt, content: blogContent[p.slug] || '', minutes: p.minutes, createdAt: t, updatedAt: t,
  }));

  const forms = examForms.map((f, i) => ({ id: `form-${slug(f.name)}-${i + 1}`, ...f, startDate: f.startDate || '', lastDate: f.lastDate || '', examDate: f.examDate || '', visible: true, order: i + 1 }));

  let n = 0;
  const posters = Object.entries(resultPosters).flatMap(([year, list]) =>
    list.map((p) => ({ id: `res-${year}-${String(++n).padStart(3, '0')}`, year, src: p.src, names: p.names || [], company: p.company || '', detail: p.detail || '', note: p.note || '', visible: true, order: n })));

  const reviews = s.testimonials.map((r, i) => ({
    id: `rev-g${i + 1}`, name: r.name, role: r.role || 'Google Review', text: r.text, rating: r.rating || 5,
    source: 'google', status: 'approved', featured: false, reply: '', createdAt: t,
  }));

  const faculty = [
    { id: 'fac-1', name: 'Capt. Shubkaran Choudhary', role: 'Co-Founder', image: '/images/home-image-11-hd.jpg', bio: 'Co-Founder of Pacific Marine Academy, a seasoned maritime expert with a passion for training young cadets for the Merchant Navy.', qualification: '', visible: true, order: 1 },
    { id: 'fac-2', name: 'Mahipal Singh Jhuriya', role: 'Founder', image: '/images/home-image-12.webp', bio: '2nd Engineer and Founder of Pacific Marine Academy.', qualification: '2nd Engineer', visible: true, order: 2 },
  ];

  const studyMaterials = s.studyMaterials.map((m, i) => ({ ...m, visible: true, order: i + 1 }));
  const gallery = s.gallery.map((g, i) => ({ ...g, visible: true, order: i + 1 }));
  const faqs = s.faqs.map((q, i) => ({ ...q, visible: true, order: i + 1 }));

  return {
    version: 1,
    settings, banners: s.banners,
    courses, blogs, gallery, videos, studyMaterials, forms, resultPosters: posters, faculty, faqs, reviews,
    enquiries: [], admissions: [],
    users: [], notifications: [], activity: [], media: [],
  };
}
