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
  const isTextProject = project.type === 'TEXT';
  const isVideoProject = project.type === 'VIDEO';

  // --- LAYOUT FÖR VIDEO (Fullbredd, staplad) ---
  if (isVideoProject) {
    return (
      <Link href={`/${project.slug}`} className="block">
        <article className="group flex w-full flex-col space-y-8">
          {/* 1. Titel överst */}
          <h2 className="text-left text-5xl leading-none font-black tracking-tight uppercase sm:text-6xl md:text-8xl">
            {project.title}
          </h2>

          {/* 2. Video i mitten - Full bredd */}
          <div className="w-full overflow-hidden rounded-xl bg-black shadow-2xl">
            {project.video ? (
              <div className="aspect-video w-full">
                <video
                  src={project.video}
                  controls
                  className="h-full w-full object-cover"
                  // Optional: lägg till poster={project.image} om du har en thumbnail
                />
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center border-2 border-dashed border-pink-600">
                <span className="text-gray-500">Videofil saknas</span>
              </div>
            )}
          </div>

          {/* 3. Text och knapp underst */}
          <div className="flex max-w-4xl flex-col space-y-6">
            <p className="text-lg leading-relaxed opacity-90 sm:text-2xl">
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

  // --- LAYOUT FÖR BILDER OCH TEXT (Original-layouten) ---
  const articleClasses = isTextProject
    ? 'flex flex-col items-stretch gap-8 group'
    : `flex flex-col items-stretch gap-12 sm:gap-20 ${
        reverseOnDesktop ? 'sm:flex-row-reverse' : 'sm:flex-row'
      } group`;

  return (
    <Link href={`/${project.slug}`} className="block">
      <article className={articleClasses}>
        {/* Poster - syns bara för IMAGE/PROJECT */}
        {!isTextProject && (
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
              <div className="flex h-[520px] w-full items-center justify-center rounded-lg border-2 border-dashed border-pink-600 bg-gray-800 sm:h-[640px]">
                <span className="text-xl text-gray-500">Ingen bild</span>
              </div>
            )}
          </div>
        )}

        {/* Textinnehåll för vanliga inlägg */}
        <div
          className={`flex w-full flex-col justify-center space-y-8 px-6 sm:px-0 ${
            isTextProject ? '' : 'sm:w-1/2'
          }`}
        >
          <h2 className="text-left text-5xl leading-none font-black tracking-tight uppercase sm:text-6xl md:text-7xl">
            {project.title}
          </h2>
          <p
            className={`text-lg leading-relaxed opacity-90 sm:text-xl ${
              isTextProject ? 'max-w-none' : 'max-w-lg'
            }`}
          >
            {isTextProject
              ? project.content || project.preview
              : project.preview}
          </p>
          <span className="inline-flex w-fit items-center rounded-full bg-pink-600 px-12 py-5 font-bold tracking-wider text-white uppercase shadow-xl transition-all hover:scale-105 hover:bg-pink-700">
            Läs mer
          </span>
        </div>
      </article>
    </Link>
  );
}
