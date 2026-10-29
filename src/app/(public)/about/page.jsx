import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('About Our Merchant Navy Academy',
  'Learn about Pacific Marine Academy in Sikar: our story, mission, Master Mariner faculty and how we prepare cadets for IMU CET and DNS sponsorship.');

import { AboutUs } from '../../../views/AboutUs';

export default function Page() {
  return <AboutUs />;
}
