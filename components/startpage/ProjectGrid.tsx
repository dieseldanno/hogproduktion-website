import Image from 'next/image';
import Link from 'next/link';

interface FlatImage {
  id: string;
  url: string;
  title: string;
  slug: string;
}

interface Props {
  projects: FlatImage[];
}

export default function ProjectGrid({ projects }: Props) {
  const sizes = [
    'w-full max-w-2xl', // liten
    'w-full max-w-5xl', // stor
    'w-full max-w-3xl', // medium
  ];

  return (
    <div className="flex flex-col items-end gap-3 py-2">
      {projects.map((p, i) => {
        const layout = sizes[i % sizes.length];

        return (
          <Link key={p.id} href={`/${p.slug}`} className="group relative block">
            <div className={layout}>
              <Image
                src={p.url}
                alt={p.title}
                width={1600}
                height={1000}
                className="h-auto max-h-[80vh] w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 1200px"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 hover:opacity-100">
              <h2 className="text-center text-xl font-bold text-white uppercase md:text-2xl">
                {p.title}
              </h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
