import { siteUrl } from '../lib/seo';

export const revalidate = 3600;

export default async function robots() {
  const base = await siteUrl();
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
