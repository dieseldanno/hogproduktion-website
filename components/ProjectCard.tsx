import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@prisma/client';

interface ProjectCardProps {
  project: Project;
  reverseOnDesktop?: boolean;
}

export default function ProjectCard({
  project,
  reverseOnDesktop = false,
}: ProjectCardProps) {
  return (
    <Link href={`/${project.slug}`} className="block">
      <article
        className={`flex flex-col items-stretch gap-12 sm:gap-20 ${
          reverseOnDesktop ? 'sm:flex-row-reverse' : 'sm:flex-row'
        } group`}
      >
        {/* Poster */}
        <div className="w-full sm:w-1/2">
          {project.image ? (
            <div className="relative h-[520px] w-full overflow-hidden rounded-lg sm:h-[640px] md:h-[780px] lg:h-[920px]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain object-center"
                priority
              />
            </div>
          ) : (
            <div className="flex h-[520px] w-full items-center justify-center rounded-lg border-2 border-dashed border-pink-600 bg-gray-800 sm:h-[640px] md:h-[780px] lg:h-[920px]">
              <span className="text-xl text-gray-500">Ingen bild</span>
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="flex w-full flex-col justify-center space-y-8 px-6 sm:w-1/2 sm:px-0">
          <h2 className="text-left text-5xl leading-none font-black tracking-tight uppercase sm:text-6xl md:text-7xl">
            {project.title}
          </h2>

          <p className="max-w-lg text-lg leading-relaxed opacity-90 sm:text-xl">
            {project.preview}
          </p>

          <span className="inline-flex w-fit items-center rounded-full bg-pink-600 px-12 py-5 font-bold tracking-wider text-white uppercase shadow-xl transition-all hover:scale-105 hover:bg-pink-700">
            Läs mer
          </span>
        </div>
      </article>
    </Link>
  );
}
