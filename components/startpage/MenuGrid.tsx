import Link from 'next/link';

export default function MenuGrid() {
  return (
    <div className="relative mt-40 flex flex-col p-2 md:mt-24 md:p-8">
      <div className="outline-text-black flex flex-col gap-8 text-2xl leading-none font-bold text-white uppercase sm:text-5xl md:gap-12 md:text-7xl">
        <Link
          href="/om-oss"
          className="transition duration-300 hover:text-gray-800 hover:drop-shadow-sm"
        >
          OM OSS
        </Link>
        <Link
          href="/aktuellt"
          className="inline-block transition duration-300 hover:text-gray-800 hover:drop-shadow-sm"
        >
          AKTUELLT
        </Link>
        <Link
          href="/arkiv"
          className="hover:text-custom-pink transition duration-300 hover:drop-shadow-sm"
        >
          ARKIV
        </Link>
      </div>
    </div>
  );
}
