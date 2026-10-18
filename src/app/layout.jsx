import '../styles/index.css';
import { Providers } from '../components/Providers';
import { publicContent } from '../server/content';
import { read } from '../server/store';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const seo = (await read(['settings'])).settings.seo || {};
  const title = seo.title || 'Pacific Marine Academy';
  const description = seo.description || '';
  return {
    title,
    description,
    keywords: 'IMU CET coaching Sikar, DNS sponsorship, Merchant Navy coaching, Diploma in Nautical Science, BSC Nautical Science, B.Tech Marine Engineering',
    openGraph: { title, description, type: 'website', images: ['/images/about-academy-image-01.png'] },
  };
}

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ivory text-ink font-sans antialiased selection:bg-terracotta selection:text-white">
        <Providers initialData={await publicContent()}>{children}</Providers>
      </body>
    </html>
  );
}
