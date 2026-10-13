import '../styles/index.css';
import { Providers } from '../components/Providers';

export const metadata = {
  title: 'Pacific Marine Academy | #1 Merchant Navy Entrance Coaching Institute',
  description: "Pacific Marine Academy is India's leading Merchant Navy entrance coaching institute for IMU-CET, Deck Cadet, Engine Cadet, and Pre-Sea training preparation. 100% Guidance & High Selection Rate.",
  keywords: 'Merchant Navy Coaching, IMU CET Prep, Deck Officer Course, GP Rating Entrance, Maritime Academy',
  openGraph: {
    title: 'Pacific Marine Academy - Merchant Navy Entrance Coaching',
    description: "Join India's premier maritime academy. Expert captains, simulator training, and proven 98.4% selection rate.",
    type: 'website',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'],
  },
};

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }) {
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
