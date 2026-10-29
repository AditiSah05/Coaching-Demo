// Addresses from the old WordPress site, sent permanently to their new pages so existing search rankings and links keep working.
const moved = [
  ['/free-study-materials', '/study-materials'],
  ['/available-forms', '/forms'],
  ['/avaiable-forms', '/forms'],
  ['/result', '/results'],
  ['/sponsored', '/results'],
  ['/about-us', '/about'],
  ['/about-institute', '/about'],
  ['/contact-us', '/contact'],
  ['/admission-form', '/admission'],
  ['/our-course', '/courses'],
  ['/photo-gallery', '/gallery'],
  ['/video-gallery', '/videos'],
  ['/blog', '/blogs'],
];

// The admin's secret entry address, e.g. ADMIN_ENTRY=my-secret-word puts the admin sign-in page at https://site/my-secret-word.
const entry = (process.env.ADMIN_ENTRY || '').replace(/^\/+|\/+$/g, '');

export default {
  async rewrites() {
    return entry ? [{ source: `/${entry}`, destination: '/admin/login' }] : [];
  },
  async redirects() {
    return moved.flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `${from}/`, destination: to, permanent: true },
    ]);
  },
};
