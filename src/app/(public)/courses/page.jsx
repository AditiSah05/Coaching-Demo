import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('IMU CET and DNS Courses in Sikar',
  'IMU CET preparation, Diploma in Nautical Science (DNS), B.Sc Nautical Science and B.Tech Marine Engineering coaching in Sikar. See eligibility, duration and syllabus.');

import { Suspense } from 'react';
import { OurCourses } from '../../../views/OurCourses';

export default function Page() {
  return (
    <Suspense>
      <OurCourses />
    </Suspense>
  );
}
