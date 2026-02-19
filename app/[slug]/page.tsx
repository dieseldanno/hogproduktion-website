// src/app/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
    },
  });

  if (!project) notFound();

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#ff9125] text-white">
        <main className="mx-auto max-w-6xl px-6 pt-12 pb-24">
          <BackButton />
          <h1 className="mb-8 text-5xl leading-none font-black tracking-tight uppercase sm:text-7xl md:text-8xl">
            {project.title}
          </h1>

          {/* Huvudbild / video */}
          <div className="mb-12 w-full">
            {project.video ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
                <video
                  src={project.video}
                  controls
                  className="h-full w-full object-contain"
                />
              </div>
            ) : project.image ? (
              <div className="relative h-[520px] w-full overflow-hidden rounded-lg sm:h-[640px] md:h-[780px] lg:h-[920px]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            ) : null}
          </div>

          {/* Text */}
          <div className="max-w-4xl">
            <div className="prose prose-invert prose-xl max-w-none">
              <p className="text-xl leading-relaxed whitespace-pre-wrap opacity-95 sm:text-2xl">
                {project.content}
              </p>
            </div>
          </div>

          {/* Galleri */}
          {project.images.length > 0 && (
            <div className="mt-24 w-full space-y-12">
              {project.images.map((img) => (
                <div
                  key={img.id}
                  className="relative h-[520px] w-full overflow-hidden sm:h-[640px] md:h-[780px] lg:h-[920px]"
                >
                  <Image
                    src={img.url}
                    alt={`Bild från ${project.title}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
