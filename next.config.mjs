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

export default {
  async redirects() {
    return moved.flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `${from}/`, destination: to, permanent: true },
    ]);
  },
};
