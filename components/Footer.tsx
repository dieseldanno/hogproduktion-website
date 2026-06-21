'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-custom-pink border-t py-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4">
        {/* Social icons */}
        <div className="flex gap-6">
          <Link
            href="https://www.instagram.com/hogproduktion/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-custom-pink text-2xl transition duration-300 hover:scale-110 hover:drop-shadow-sm"
          >
            <FaInstagram />
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61577251715959"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-custom-pink text-2xl transition duration-300 hover:scale-110 hover:drop-shadow-sm"
          >
            <FaFacebookF />
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <a
            href="mailto:hogproduktion@gmail.com"
            className="text-custom-orange-70 hover:text-custom-orange transition"
          >
            hogproduktion@gmail.com
          </a>
        </div>
        <div className="text-custom-orange hover:text-custom-orange text-xs uppercase italic">
          Web and design by{' '}
          <Link
            href="https://github.com/dieseldanno"
            target="_blank"
            className="hover:text-custom-pink font-bold uppercase transition"
          >
            Danno Tharmarajah
          </Link>
        </div>
      </div>
    </footer>
  );
}
