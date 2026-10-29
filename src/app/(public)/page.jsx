import { Home } from '../../views/Home';
import { publicContent } from '../../server/content';
import { jsonLd } from '../../lib/seo';

export default async function Page() {
  const { faqs } = await publicContent();
  const faqLd = faqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  } : null;
  return (
    <>
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqLd)} />}
      <Home />
    </>
  );
}
