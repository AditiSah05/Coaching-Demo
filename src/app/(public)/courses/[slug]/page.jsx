import { redirect } from 'next/navigation';
import { CourseDetail } from '../../../../views/CourseDetail';

// DNS Sponsorship and the Diploma in Nautical Science are one course now; keep the old link working.
export default async function Page({ params }) {
  const { slug } = await params;
  if (slug === 'dns-sponsorship') redirect('/courses/diploma-in-nautical-science');
  return <CourseDetail slug={slug} />;
}
