import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta('Apply for Admission 2026-27',
  'Apply online for IMU CET, DNS and Merchant Navy coaching at Pacific Marine Academy, Sikar. Fill the admission form in about five minutes.');

import { Suspense } from 'react';
import { AdmissionForm } from '../../../views/AdmissionForm';

export default function Page() {
  return (
    <Suspense>
      <AdmissionForm />
    </Suspense>
  );
}
