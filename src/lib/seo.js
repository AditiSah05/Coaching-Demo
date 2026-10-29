import { headers } from 'next/headers';

export const SITE_NAME = 'Pacific Marine Academy';
const FALLBACK_URL = 'https://pacificmarineacademy.com';

// The address search engines should use. Set SITE_URL to fix it; otherwise it is taken from the request,
// so canonical links always match the domain the page is actually served on.
export async function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    if (host) {
      const proto = h.get('x-forwarded-proto') || (/^(localhost|127\.)/.test(host) ? 'http' : 'https');
      return `${proto}://${host}`;
    }
  } catch { /* no request (build step): use the fallback */ }
  return FALLBACK_URL;
}

// Keeps a description inside the length search results show (about 155 characters), cut at a word.
export const trim = (text = '', max = 155) => {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length)}…`;
};

// Structured data as a script tag. "<" is escaped so content can never close the tag early.
export const jsonLd = (data) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });

export function organizationLd(settings = {}, base) {
  const addr = settings.address || '';
  const pin = (addr.match(/\b\d{6}\b/) || [])[0];
  const social = Object.values(settings.socialLinks || {}).filter((u) => /^https?:\/\//.test(u) && !/wa\.me/.test(u));
  const sameAs = [...new Set([settings.youtubeChannelUrl, settings.googleReviewsUrl, ...social].filter(Boolean))];
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${base}/#organization`,
    name: settings.instituteName || SITE_NAME,
    description: settings.seo?.description || undefined,
    url: base,
    logo: `${base}/logo.png`,
    image: `${base}/images/about-academy-image-01.png`,
    telephone: settings.phonePrimary || undefined,
    email: settings.email || undefined,
    address: addr ? { '@type': 'PostalAddress', streetAddress: addr, addressLocality: 'Sikar', addressRegion: 'Rajasthan', postalCode: pin, addressCountry: 'IN' } : undefined,
    areaServed: ['Sikar', 'Rajasthan', 'Haryana', 'India'],
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export const breadcrumbLd = (base, trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${base}${path}` })),
});

const SHARE_IMAGE = '/images/about-academy-image-01.png';

// Page metadata including the share card (Facebook, WhatsApp, X). A page that sets its own openGraph replaces the
// site-wide one, so everything the card needs is repeated here.
export const pageMeta = (title, description, { images, type = 'website', ...extra } = {}) => {
  const imgs = (images && images.length ? images : [SHARE_IMAGE]).map((url) => ({ url, alt: title }));
  return {
    title,
    description,
    openGraph: { siteName: SITE_NAME, locale: 'en_IN', type, title, description, images: imgs, ...extra },
    twitter: { card: 'summary_large_image', title, description, images: imgs.map((i) => i.url) },
  };
};
