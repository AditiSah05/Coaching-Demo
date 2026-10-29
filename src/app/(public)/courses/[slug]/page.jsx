import { notFound, redirect } from 'next/navigation';
import { CourseDetail } from '../../../../views/CourseDetail';
import { read } from '../../../../server/store';
import { siteUrl, trim, jsonLd, breadcrumbLd, pageMeta, SITE_NAME } from '../../../../lib/seo';

export const dynamic = 'force-dynamic';

const findCourse = async (slug) => (await read(['courses'])).courses.find((c) => c.slug === slug || c.id === slug) || null;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await findCourse(slug);
  if (!course) return {};
  const title = `${course.title}: Coaching in Sikar`;
  const description = trim(course.description);
  return pageMeta(title, description, { images: course.image ? [course.image] : undefined });
}

export default async function Page({ params }) {
  const { slug } = await params;
  // DNS Sponsorship and the Diploma in Nautical Science are one course now; keep the old link working.
  if (slug === 'dns-sponsorship') redirect('/courses/diploma-in-nautical-science');
  const course = await findCourse(slug);
  if (!course) notFound();
  const base = await siteUrl();
  const url = `${base}/courses/${course.slug || course.id}`;
  const courseLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url,
    provider: { '@type': 'EducationalOrganization', name: SITE_NAME, url: base },
    educationalCredentialAwarded: course.targetExam || undefined,
    courseMode: course.mode || undefined,
    timeRequired: course.duration || undefined,
    image: course.image ? `${base}${course.image}` : undefined,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(courseLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbLd(base, [['Home', '/'], ['Courses', '/courses'], [course.title, `/courses/${course.slug || course.id}`]]))} />
      <CourseDetail slug={slug} />
    </>
  );
}
