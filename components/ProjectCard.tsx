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

  const getVideoThumbnail = (videoUrl: string): string => {
    return videoUrl
      .replace('/video/upload/', '/video/upload/so_2/')
      .replace('.mp4', '.jpg');
  };

  // --- LAYOUT FÖR VIDEO (Fullbredd, staplad) ---
  if (isVideoProject) {
    return (
      <article className="group my-24 flex w-full flex-col items-start space-y-5 sm:mb-32">
        {/* 1. Titel överst */}
        <Link href={`/${project.slug}`} className="block self-start">
          <h2 className="text-left text-3xl leading-none font-black tracking-tight uppercase sm:text-4xl md:text-5xl">
            {project.title}
          </h2>
        </Link>

        {/* 2. Video i mitten - Full bredd */}
        <div className="w-full overflow-hidden bg-black shadow-2xl">
          {project.video ? (
            <div className="aspect-video w-full">
              <video
                src={project.video}
                poster={getVideoThumbnail(project.video)}
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
        <div className="flex max-w-4xl flex-col items-start space-y-6">
          <div className="prose prose-invert prose-xl max-w-none">
            <p className="text-xl leading-relaxed whitespace-pre-wrap opacity-95 sm:text-2xl">
              {project.preview}
            </p>
          </div>
          <Link href={`/${project.slug}`} className="block self-start">
            <span className="text-custom-pink inline-block font-bold uppercase">
              Se mer
            </span>
          </Link>
        </div>
      </article>
    );
  }

  // --- LAYOUT FÖR BILDER OCH TEXT

  if (!isTextProject && !isVideoProject) {
    return (
      <article
        className={`my-24 flex flex-col gap-12 sm:mb-32 sm:gap-18 ${
          reverseOnDesktop ? 'sm:flex-row-reverse' : 'sm:flex-row'
        }`}
      >
        {/* TEXT-SIDA */}
        <div className="flex w-full flex-col items-start justify-center space-y-5 sm:w-2/5">
          <Link href={`/${project.slug}`} className="block self-start">
            <h2 className="inline-block text-3xl leading-none font-black tracking-tight uppercase sm:text-4xl md:text-5xl">
              {project.title}
            </h2>
          </Link>

          <div className="prose prose-invert prose-xl max-w-none">
            <p className="text-xl leading-relaxed whitespace-pre-wrap opacity-95 sm:text-2xl">
              {project.preview}
            </p>
          </div>

          <Link href={`/${project.slug}`} className="block self-start">
            <span className="text-custom-pink inline-block font-bold uppercase">
              Se mer
            </span>
          </Link>
        </div>

        {/* BILD-SIDA */}
        <div className="flex w-full justify-center sm:w-3/5">
          {project.image && (
            <div className="relative w-full max-w-3xl overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={1500}
                sizes="(max-width: 640px) 100vw, 50vw"
                className="h-auto max-h-[80vh] w-full object-contain"
              />
            </div>
          )}
        </div>
      </article>
    );
  }

  if (isTextProject) {
    return (
      <article className="my-24 flex flex-col space-y-6 sm:mb-32">
        <Link href={`/${project.slug}`} className="block self-start">
          <h2 className="text-3xl leading-none font-black tracking-tight uppercase sm:text-4xl md:text-5xl">
            {project.title}
          </h2>
        </Link>

        <div className="prose prose-invert prose-xl max-w-none">
          <p className="text-xl leading-relaxed whitespace-pre-wrap opacity-95 sm:text-2xl">
            {project.content || project.preview}
          </p>
        </div>
      </article>
    );
  }
}
