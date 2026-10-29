import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('Maritime Company Sponsorship Forms',
  'Application forms for DNS, B.Sc Nautical Science and B.Tech from IMUCET, Tolani, Synergy, Anglo-Eastern, Great Eastern and more, with fees and last dates.');

import { AvailableForms } from '../../../views/AvailableForms';

export default function Page() {
  return <AvailableForms />;
}
