import { prisma } from '@/lib/prisma';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { Project } from '@prisma/client';

export default async function ArchivePage() {
  const projects: Project[] = await prisma.project.findMany({
    where: { isCurrent: false },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-orange-500 text-white">
      <header className="flex items-center justify-between p-6">
        <h1 className="text-4xl font-bold text-pink-600">HÖG</h1>
        <nav className="space-x-8 text-xl">
          <Link href="/" className="opacity-70 hover:opacity-100">
            AKTUELLT
          </Link>
          <Link href="/arkiv" className="font-bold underline">
            ARKIV
          </Link>
        </nav>
      </header>

      <main className="space-y-12 px-6 pb-12">
        {projects.length > 0 ? (
          projects.map((p) => <ProjectCard key={p.id} project={p} />)
        ) : (
          <p className="text-center text-xl">Inga arkiverade produktioner.</p>
        )}
      </main>

      <footer className="border-t-2 border-pink-600 p-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} HÖG Produktion
          <span className="ml-4">Instagram</span>
        </p>
      </footer>
    </div>
  );
}
