import '../styles/index.css';
import { Providers } from '../components/Providers';
import { publicContent } from '../server/content';
import { siteUrl, SITE_NAME, jsonLd, organizationLd } from '../lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const seo = (await publicContent()).settings.seo || {};
  const base = await siteUrl();
  const title = seo.title || 'Best IMU CET Coaching in Sikar | Pacific Marine Academy';
  const description = seo.description || '';
  return {
    metadataBase: new URL(base),
    // Pages set a short title; the academy name is added after it.
    title: { default: title, template: `%s | ${SITE_NAME}` },
    description,
    keywords: 'IMU CET coaching Sikar, DNS sponsorship, Merchant Navy coaching, Diploma in Nautical Science, BSC Nautical Science, B.Tech Marine Engineering',
    applicationName: SITE_NAME,
    alternates: { canonical: './' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: { siteName: SITE_NAME, locale: 'en_IN', type: 'website', title, description, images: [{ url: '/images/about-academy-image-01.png', alt: SITE_NAME }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/about-academy-image-01.png'] },
  };
}

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default async function RootLayout({ children }) {
  const data = await publicContent();
  const base = await siteUrl();
  return (
    <html lang="en-IN" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ivory text-ink font-sans antialiased selection:bg-terracotta selection:text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationLd(data.settings, base))} />
        <Providers initialData={data}>{children}</Providers>
      </body>
    </html>
  );
}
