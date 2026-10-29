import { read } from '../server/store';
import { siteUrl } from '../lib/seo';

export const dynamic = 'force-dynamic';

const pages = [
  ['/', 1, 'weekly'], ['/courses', 0.9, 'monthly'], ['/admission', 0.9, 'monthly'], ['/results', 0.8, 'monthly'],
  ['/study-materials', 0.8, 'monthly'], ['/forms', 0.7, 'weekly'], ['/about', 0.6, 'yearly'], ['/gallery', 0.5, 'monthly'],
  ['/videos', 0.5, 'monthly'], ['/blogs', 0.7, 'weekly'], ['/contact', 0.7, 'yearly'],
];

export default async function sitemap() {
  const base = await siteUrl();
  const db = await read(['courses', 'blogs']);
  const now = new Date();
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${base}${path === '/' ? '' : path}` || base, lastModified: now, changeFrequency, priority })),
    ...db.courses.filter((c) => c.slug).map((c) => ({ url: `${base}/courses/${c.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 })),
    ...db.blogs.filter((b) => b.status === 'published').map((b) => ({ url: `${base}/blogs/${b.slug}`, lastModified: b.date ? new Date(b.date) : now, changeFrequency: 'yearly', priority: 0.6 })),
  ];
}
