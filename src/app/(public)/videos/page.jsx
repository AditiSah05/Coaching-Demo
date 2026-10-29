import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('Videos and Student Stories',
  'Watch mock interviews, IMU CET tips and student stories from Pacific Marine Academy, Sikar, Rajasthan.');

import { Videos } from '../../../views/Videos';

export default function Page() {
  return <Videos />;
}
