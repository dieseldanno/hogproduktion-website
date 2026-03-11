import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'HÖGproduktion',
    template: '%s | HÖGproduktion',
  },
  description:
    'HÖGproduktion skapar utrymme för konstnärer att utforska nya former och uttryck inom scenkonsten.',
  keywords: [
    'experimentell scenkonst',
    'queer konst',
    'HÖGproduktion',
    'normbrytande',
    'scenkonst kollektiv',
    'marginaliserade perspektiv',
    'scenkonst Stockholm',
    'queer teater',
    'performancekonst',
  ],

  metadataBase: new URL('https://hogproduktion.se'),
  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'HÖGproduktion',
    description:
      'HÖGproduktion skapar utrymme för konstnärer att utforska nya former och uttryck inom scenkonsten.',
    url: 'https://hogproduktion.se',
    siteName: 'HÖGproduktion',
    locale: 'sv_SE',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">{children}</body>
    </html>
  );
}
