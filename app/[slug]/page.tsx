// src/app/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Project } from '@prisma/client';

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
    <div className="min-h-screen bg-orange-500 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Link href="/" className="text-4xl font-bold text-pink-600">
          HÖG
        </Link>
        <nav className="space-x-8 text-xl">
          <Link href="/" className="opacity-70 hover:opacity-100">
            AKTUELLT
          </Link>
          <Link href="/arkiv" className="opacity-70 hover:opacity-100">
            ARKIV
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 pb-12">
        <Link
          href="/"
          className="mb-8 inline-block text-pink-300 hover:underline"
        >
          ← Tillbaka
        </Link>

        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={500}
            className="mb-8 h-96 w-full rounded-lg object-cover"
          />
        )}

        <h1 className="mb-4 text-4xl font-bold uppercase">{project.title}</h1>
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{project.content}</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-pink-600 p-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} HÖG Produktion
          <span className="ml-4">Instagram</span>
        </p>
      </footer>
    </div>
  );
}
