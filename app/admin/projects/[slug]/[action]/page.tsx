// app/admin/projects/[slug]/[action]/page.tsx
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect, notFound } from 'next/navigation';
import EditProjectForm from '@/components/admin/EditProjectForm';
import Link from 'next/link';

export default async function ProjectActionPage({
  params,
}: {
  params: Promise<{ slug: string; action: string | string[] }>;
}) {
  // STEG 1: AWAITA PARAMS – detta är magin
  const { slug, action } = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  // STEG 2: Hantera både string och array (catch-all säkerhet)
  const normalizedAction = Array.isArray(action) ? action[0] : action;

  if (normalizedAction !== 'edit') {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#ff9125] p-8 text-white">
      <Link
        href="/admin"
        className="mb-8 inline-block text-pink-300 hover:underline"
      >
        ← Tillbaka
      </Link>
      <h1 className="mb-8 text-3xl font-bold">Redigera: {project.title}</h1>
      <EditProjectForm project={project} />
    </div>
  );
}
