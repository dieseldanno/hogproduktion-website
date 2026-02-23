import Link from 'next/link';

export default function MenuGrid() {
  return (
    <div className="relative flex flex-col items-start py-2">
      <div className="text-custom-orange flex flex-col gap-4 text-center text-2xl leading-none font-bold uppercase sm:text-3xl md:gap-6">
        <Link
          href="/aktuellt"
          className="hover:text-custom-pink inline-block bg-black px-2 py-1 transition duration-300 hover:drop-shadow-sm"
        >
          AKTUELLT
        </Link>
        <Link
          href="/arkiv"
          className="hover:text-custom-pink inline-block bg-black px-2 py-1 transition duration-300 hover:drop-shadow-sm"
        >
          ARKIV
        </Link>
        <Link
          href="/om-oss"
          className="hover:text-custom-pink inline-block bg-black px-2 py-1 whitespace-nowrap transition duration-300 hover:drop-shadow-sm"
        >
          OM OSS
        </Link>
      </div>
    </div>
  );
}
