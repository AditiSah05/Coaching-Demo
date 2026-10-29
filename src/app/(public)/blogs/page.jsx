import { Blogs } from '../../../views/Blogs';

import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('Blog: IMU CET and Merchant Navy Guides',
  'Guides and stories on IMU CET preparation, DNS sponsorship, Merchant Navy careers and life at Pacific Marine Academy, Sikar.');

export default function Page() {
  return <Blogs />;
}
