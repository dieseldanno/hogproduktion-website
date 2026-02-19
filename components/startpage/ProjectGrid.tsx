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
  const layouts = [
    'w-[90%] md:w-[60%] ml-auto aspect-[3/4]', // liten, höger
    'w-[95%] md:w-[80%] ml-auto aspect-square', // stor, höger
    'w-[90%] md:w-[70%] ml-auto aspect-[3/4]', // medium ,höger
  ];

  return (
    <div className="flex flex-col gap-4 py-4 sm:mt-1">
      {projects.map((p, i) => {
        const layout = layouts[i % layouts.length];

        return (
          <Link
            key={p.id}
            href={`/${p.slug}`}
            className={`group relative overflow-hidden ${layout}`}
          >
            <Image
              src={p.url}
              alt={p.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="flex h-full w-full items-center justify-center bg-black text-white">
              <span className="text-3xl font-bold uppercase">{p.title}</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center md:bg-black/20 md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100">
              <h2 className="text-center text-xl font-bold text-white uppercase md:text-3xl">
                {p.title}
              </h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
