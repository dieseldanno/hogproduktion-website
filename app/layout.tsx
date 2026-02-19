import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HÖGproduktion',
  description:
    'HÖGproduktion skapar experimentell scenkonst med fokus på queera perspektiv, normbrytande uttryck och marginaliserade erfarenheter.',
  keywords: [
    'experimentell scenkonst',
    'queer konst',
    'HÖGproduktion',
    'normbrytande',
    'scenkonst kollektiv',
    'marginaliserade perspektiv',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
