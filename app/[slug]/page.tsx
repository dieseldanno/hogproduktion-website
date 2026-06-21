// app/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import GallerySlider from '@/components/GallerySlider';
import { resolveVideoThumbnail } from '@/lib/videoThumbnail';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      title: true,
      preview: true,
      content: true,
      image: true,
      videoThumbnail: true,
    },
  });

  if (!project) return { title: 'Inte hittad' };

  const description =
    project.preview?.slice(0, 160) ||
    project.content?.slice(0, 160) ||
    undefined;

  const ogImage = project.image || project.videoThumbnail || undefined;

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
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

  const videoPoster = resolveVideoThumbnail(
    project.video,
    project.videoThumbnail
  );

  return (
    <>
      <Nav />
      <div className="min-h-screen">
        <main className="mx-auto max-w-6xl px-6 pt-1 pb-8">
          <BackButton />
          <h1 className="mb-6 text-center text-3xl leading-none font-black tracking-tight whitespace-nowrap uppercase sm:text-5xl md:text-7xl">
            {project.title}
          </h1>

          {/* Huvudbild / video */}
          <div className="mb-6 flex w-full justify-center">
            {project.video ? (
              <div className="w-full max-w-6xl overflow-hidden">
                <video
                  src={project.video}
                  poster={videoPoster}
                  controls
                  className="h-auto max-h-[80vh] w-full object-contain"
                />
              </div>
            ) : project.image ? (
              <div className="mb-6 w-full max-w-6xl overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={1600}
                  height={1000}
                  className="h-auto max-h-[80vh] w-full object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : null}
          </div>

          {/* Text */}
          <div className="w-full max-w-6xl">
            <div className="prose prose-invert prose-xl md:px-12">
              <p className="text-xl leading-relaxed font-semibold whitespace-pre-wrap opacity-95 sm:text-2xl">
                {project.content}
              </p>
            </div>
          </div>

          {/* Galleri */}
          {project.images.length > 0 && (
            <div className="mt-24 w-full">
              <GallerySlider images={project.images} title={project.title} />
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
