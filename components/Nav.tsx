'use client';

import { usePathname } from 'next/navigation';
import hogLogo from '@/public/hoglogowhite.png';
import Link from 'next/link';
import Image from 'next/image';
import EmailMarquee from './EmailMarquee';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

export default function Nav() {
  const pathname = usePathname();
  const isCurrentPage = pathname === '/aktuellt';
  const isArchivePage = pathname === '/arkiv';
  const isAboutUsPage = pathname === '/om-oss';

  return (
    <>
      {/* upper header */}
      <EmailMarquee />
      <header className="flex flex-col items-center justify-center px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LOGO */}
        <Link href="/">
          <Image
            src={hogLogo}
            alt="HÖG Produktion"
            width={400}
            height={400}
            className="h-28 w-auto sm:h-36"
            priority
          />
        </Link>

        {/* MENY */}
        <nav className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <Link
            href="/aktuellt"
            className={`text-2xl font-bold transition-transform duration-300 hover:scale-105 md:text-4xl ${
              isCurrentPage
                ? 'text-white drop-shadow-md'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            AKTUELLT
          </Link>

          <Link
            href="/arkiv"
            className={`text-2xl font-bold transition-transform duration-300 hover:scale-105 md:text-4xl ${
              isArchivePage
                ? 'text-white drop-shadow-md'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            ARKIV
          </Link>

          <Link
            href="/om-oss"
            className={`text-2xl font-bold transition-transform duration-300 hover:scale-105 md:text-4xl ${
              isAboutUsPage
                ? 'text-white drop-shadow-md'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            OM OSS
          </Link>
        </nav>

        {/* SOCIALS */}
        <div className="mt-4 flex gap-4 sm:mt-0">
          <Link
            href="https://www.instagram.com/hogproduktion/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-custom-pink text-2xl transition-transform duration-300 hover:scale-125 hover:drop-shadow-md"
          >
            <FaInstagram />
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61577251715959"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-custom-pink text-2xl transition-transform duration-300 hover:scale-125 hover:drop-shadow-md"
          >
            <FaFacebookF />
          </Link>
        </div>
      </header>

      {/* lower menu */}
      {/* <div className="p-4">
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
      </div> */}
    </>
  );
}
