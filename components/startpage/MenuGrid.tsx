import Link from 'next/link';

export default function MenuGrid() {
  return (
    <div className="relative mt-40 flex flex-col p-2 md:mt-24 md:p-8">
      <div className="outline-text-black flex flex-col gap-8 text-2xl leading-none font-bold text-white uppercase sm:text-5xl md:gap-12 md:text-7xl">
        <Link href="/om-oss">OM OSS</Link>
        <Link href="/aktuellt">AKTUELLT</Link>
        <Link href="/arkiv">ARKIV</Link>
      </div>
    </div>
  );
}
