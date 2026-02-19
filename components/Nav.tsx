'use client';

import { usePathname } from 'next/navigation';
import hogLogo from '@/public/hoglogoblack.png';
import Link from 'next/link';
import Image from 'next/image';
import EmailMarquee from './EmailMarquee';

export default function Nav() {
  const pathname = usePathname();
  const isCurrentPage = pathname === '/aktuellt';
  const isArchivePage = pathname === '/arkiv';
  const isAboutUsPage = pathname === '/om-oss';

  return (
    <>
      {/* upper header */}
      <EmailMarquee />
      <header className="flex items-center justify-between px-6 py-2">
        <Link href="/" className="block">
          <Image
            src={hogLogo}
            alt="HÖG Produktion"
            width={100}
            height={100}
            className="h-24 w-auto drop-shadow-lg transition hover:opacity-90 md:h-28"
            priority
          />
        </Link>
        <Link
          href="/om-oss"
          className={`text-3xl font-black tracking-tight text-white transition hover:opacity-80 ${
            isAboutUsPage ? 'text-white drop-shadow-md' : 'text-white'
          }`}
        >
          OM OSS
        </Link>
      </header>

      {/* lower menu */}
      <div className="p-4">
        <nav className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 sm:flex-row sm:gap-20">
          <Link
            href="/aktuellt"
            className={`text-3xl font-bold transition-all duration-300 md:text-5xl ${
              isCurrentPage
                ? 'text-white drop-shadow-md'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            AKTUELLT
          </Link>
          <Link
            href="/arkiv"
            className={`text-3xl font-bold transition-all duration-300 md:text-5xl ${
              isArchivePage
                ? 'text-white drop-shadow-md'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            ARKIV
          </Link>
        </nav>
      </div>
    </>
  );
}
