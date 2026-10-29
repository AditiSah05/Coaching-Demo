import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('Photo Gallery: Life at the Academy',
  'Photos from Pacific Marine Academy, Sikar: felicitation of IMU CET toppers, classrooms, mock interviews and student events.');

import { Gallery } from '../../../views/Gallery';

export default function Page() {
  return <Gallery />;
}
