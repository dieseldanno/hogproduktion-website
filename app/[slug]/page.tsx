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
  // Await params
  const { slug } = await params;

  if (!slug) notFound();

  const project: Project | null = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) notFound();

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-orange-500 text-white">
        {/* Content */}
        <main className="mx-auto max-w-4xl px-6 pb-12">
          <Link
            href="/"
            className="mb-8 inline-block text-pink-300 hover:underline"
          >
            ← Tillbaka
          </Link>

          {project.image && (
            <div className="relative mb-12 h-[520px] w-full overflow-hidden rounded-lg sm:h-[640px] md:h-[780px] lg:h-[920px]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain object-center"
              />
            </div>
          )}

          <h1 className="mb-4 text-4xl font-bold uppercase">{project.title}</h1>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{project.content}</p>
          </div>
        </main>
      </div>
    </>
  );
}
