import { cache } from 'react';
import { read, sortRecords, PUBLIC_KEYS } from './store';
import { COLLECTIONS } from '../shared/schema';
import { buildSeed } from './seed';

// While the site is being built there may be no database to ask (or it may be over quota), so the starting content is
// used. At runtime the error is passed on instead: Next.js then keeps serving the last good cached page rather than
// replacing it with the starting content. `/api/content` asks for the fallback explicitly.
const readOrSeed = (keys, { fallback = process.env.NEXT_PHASE === 'phase-production-build' } = {}) => read(keys).catch((e) => {
  if (!fallback) throw e;
  console.error('Database unavailable, showing the starting content:', e?.message);
  const seed = buildSeed();
  return Object.fromEntries(keys.map((k) => [k, seed[k]]));
});

const vis = (list) => list.filter((x) => x.visible !== false);
const sorted = (name, list) => sortRecords(list, COLLECTIONS[name].sort);
const uniqueTopics = (list, key = 'topic') => {
  const count = new Map();
  list.forEach((x) => x[key] && count.set(x[key], (count.get(x[key]) || 0) + 1));
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k]) => k);
};

// Everything the public website needs, and nothing private: no drafts, no pending reviews, no enquiries.
// `cache` makes the layout, the page title and the page itself share one database read per visit instead of three.
export const publicContent = cache(async function publicContent(options) {
  const db = await readOrSeed(PUBLIC_KEYS, options);
  const blogs = sorted('blogs', db.blogs.filter((b) => b.status === 'published'))
    .map(({ content, ...b }) => ({ slug: b.slug, title: b.title, date: b.date, topic: b.topic, excerpt: b.excerpt, cover: b.cover, minutes: b.minutes }));

  const videos = sorted('videos', vis(db.videos)).map((v) => ({ id: v.ytId, title: v.title, topic: v.topic, featured: !!v.featured }));

  const posters = {};
  sorted('resultPosters', vis(db.resultPosters)).forEach((p) => {
    (posters[p.year] ||= []).push({ src: p.src, names: p.names, company: p.company, detail: p.detail, note: p.note });
  });

  const reviews = [...db.reviews.filter((r) => r.status === 'approved')]
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || String(b.createdAt).localeCompare(String(a.createdAt)))
    .map((r) => ({ id: r.id, name: r.name, role: r.role, text: r.text, rating: r.rating, source: r.source, reply: r.reply || '' }));

  return {
    settings: db.settings,
    banners: db.banners,
    courses: sorted('courses', db.courses),
    gallery: sorted('gallery', vis(db.gallery)),
    videos,
    videoTopics: uniqueTopics(videos),
    blogs,
    blogTopics: uniqueTopics(blogs),
    studyMaterials: sorted('studyMaterials', vis(db.studyMaterials)),
    examForms: sorted('forms', vis(db.forms)),
    resultPosters: posters,
    faculty: sorted('faculty', vis(db.faculty)),
    faqs: sorted('faqs', vis(db.faqs)),
    testimonials: reviews,
  };
});

export const publishedPost = async (slug) => (await readOrSeed(['blogs'])).blogs.find((b) => b.slug === slug && b.status === 'published') || null;
