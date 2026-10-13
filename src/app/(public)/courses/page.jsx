import { Suspense } from 'react';
import { OurCourses } from '../../../views/OurCourses';

export default function Page() {
  return (
    <Suspense>
      <OurCourses />
    </Suspense>
  );
}
