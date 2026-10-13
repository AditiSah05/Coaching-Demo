import { CourseDetail } from '../../../../views/CourseDetail';

export default async function Page({ params }) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}
