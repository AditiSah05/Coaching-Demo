import { Suspense } from 'react';
import { AdmissionForm } from '../../../views/AdmissionForm';

export default function Page() {
  return (
    <Suspense>
      <AdmissionForm />
    </Suspense>
  );
}
