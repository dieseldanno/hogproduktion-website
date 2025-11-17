import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Project } from '@prisma/client';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const projects: Project[] = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produktioner</h1>
        <Link
          href="/admin/projects/new"
          className="rounded bg-pink-600 px-4 py-2 font-bold text-white"
        >
          Lägg till ny
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded border p-4"
          >
            <div>
              <h3 className="font-medium">{p.title}</h3>
              <p className="text-sm text-gray-500">
                {p.isCurrent ? 'AKTUELL' : 'Arkiv'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
