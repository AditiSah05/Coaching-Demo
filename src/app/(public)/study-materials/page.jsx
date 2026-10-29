import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('Free IMU CET Study Material (PDF)',
  'Download free IMU CET mock tests, past papers, the syllabus and general knowledge notes, plus our IMU-CET preparation book with 6000+ practice questions.');

import { StudyMaterials } from '../../../views/StudyMaterials';

export default function Page() {
  return <StudyMaterials />;
}
