'use client';

import { usePathname } from 'next/navigation';
import hogLogo from '@/public/hog-logo.svg';
import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
  const pathname = usePathname();
  const isCurrentPage = pathname === '/';
  const isArchivePage = pathname === '/arkiv';
  const isAboutUsPage = pathname === '/om-oss';

  return (
    <>
      {/* upper header */}
      <header className="flex items-center justify-between bg-pink-600 px-6 py-4">
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
          className={`text-5xl font-black tracking-tight text-white transition hover:opacity-80 ${
            isAboutUsPage
              ? 'text-white underline decoration-4 underline-offset-8 drop-shadow-md'
              : 'text-white'
          }`}
        >
          OM OSS
        </Link>
      </header>

      {/* lower menu */}
      <div className="bg-orange-500 p-6">
        <nav className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 sm:flex-row sm:gap-20">
          <Link
            href="/"
            className={`text-5xl font-black transition-all duration-300 md:text-6xl ${
              isCurrentPage
                ? 'text-white underline decoration-8 underline-offset-8 drop-shadow-md'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            AKTUELLT
          </Link>
          <Link
            href="/arkiv"
            className={`text-5xl font-black transition-all duration-300 md:text-6xl ${
              isArchivePage
                ? 'text-white underline decoration-8 underline-offset-8 drop-shadow-md'
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
