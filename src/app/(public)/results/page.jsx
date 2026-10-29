import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('Results: IMU CET and DNS Sponsorships',
  'Our cadets who won DNS sponsorships from Anglo-Eastern, MSC, Synergy, Fleet Management and other shipping companies. See the posters and names.');

import { Results } from '../../../views/Results';

export default function Page() {
  return <Results />;
}
