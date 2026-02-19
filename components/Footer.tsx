'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-custom-pink border-t py-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 text-white">
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
        <div className="mt-4 text-sm text-white/50">
          © {new Date().getFullYear()} HÖGproduktion
        </div>
      </div>
    </footer>
  );
}
