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
    <div className="relative w-full">
      {/* 1. EMAIL MARQUEE */}
      <EmailMarquee />

      {/* 2. LOGO */}
      <div className="relative z-50 mt-2 flex justify-center sm:absolute sm:top-0 sm:left-6 sm:justify-start">
        <Link href="/">
          <Image
            src={hogLogo}
            alt="HÖG Produktion"
            width={100}
            height={100}
            className="h-24 w-auto sm:h-26"
            priority
          />
        </Link>
      </div>

      {/* 3. HEADER */}
      <header className="mt-4 flex w-full flex-col items-center px-6 py-1 sm:mt-0 sm:flex-row sm:items-start sm:justify-between">
        {/* LOGO SPACER FÖR CENTRERING */}
        <div className="hidden sm:block sm:w-1/3"></div>

        {/* MENY */}
        <nav className="flex flex-col items-center justify-center gap-2 sm:w-1/3 sm:flex-row sm:gap-8">
          <Link
            href="/aktuellt"
            className={`text-xl font-bold transition-transform duration-300 hover:scale-105 md:text-2xl ${
              isCurrentPage
                ? 'text-custom-orange drop-shadow-md'
                : 'text-custom-orange-40 hover:text-custom-orange-70'
            }`}
          >
            AKTUELLT
          </Link>
          <Link
            href="/arkiv"
            className={`text-xl font-bold transition-transform duration-300 hover:scale-105 md:text-2xl ${
              isArchivePage
                ? 'text-custom-orange drop-shadow-md'
                : 'text-custom-orange-40 hover:text-custom-orange-70'
            }`}
          >
            ARKIV
          </Link>
          <Link
            href="/om-oss"
            className={`text-xl font-bold transition-transform duration-300 hover:scale-105 md:text-2xl ${
              isAboutUsPage
                ? 'text-custom-orange drop-shadow-md'
                : 'text-custom-orange-40 hover:text-custom-orange-70'
            }`}
          >
            OM OSS
          </Link>
        </nav>

        {/* SOCIALS */}
        <div className="mt-4 flex justify-end gap-4 sm:mt-0 sm:w-1/3">
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
    </div>
  );
}
