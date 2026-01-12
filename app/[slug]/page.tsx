// src/app/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Project } from '@prisma/client';
import Nav from '@/components/Nav';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const project: Project | null = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) notFound();

  const isVideoProject = project.type === 'VIDEO';

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-orange-500 text-white">
        <main className="mx-auto max-w-6xl px-6 pt-12 pb-24">
          <Link
            href="/"
            className="mb-12 inline-flex items-center text-white/80 transition-colors hover:text-white"
          >
            <span className="mr-2">←</span> TILLBAKA
          </Link>

          {/* TITEL - Placerad högst upp för video-projekt enligt önskemål */}
          <h1 className="mb-8 text-5xl leading-none font-black tracking-tight uppercase sm:text-7xl md:text-8xl">
            {project.title}
          </h1>

          {/* MEDIA SEKTION */}
          <div className="mb-12 w-full">
            {isVideoProject && project.video ? (
              /* Om det är en video */
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
                <video
                  src={project.video}
                  controls
                  className="h-full w-full object-contain"
                  autoPlay
                  muted={false}
                />
              </div>
            ) : project.image ? (
              /* Om det är en bild (och inte en video) */
              <div className="relative h-[520px] w-full overflow-hidden rounded-lg sm:h-[640px] md:h-[780px] lg:h-[920px]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="100vw"
                  className="object-contain object-center"
                  priority
                />
              </div>
            ) : null}
          </div>

          {/* TEXTINNEHÅLL */}
          <div className="max-w-4xl">
            <div className="prose prose-invert prose-xl max-w-none">
              <p className="text-xl leading-relaxed whitespace-pre-wrap opacity-95 sm:text-2xl">
                {project.content || project.preview}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
