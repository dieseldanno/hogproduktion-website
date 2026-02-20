import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProjectsList from '@/components/admin/ProjectsList';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  // Redirect till login om ingen session
  if (!session) {
    redirect('/admin/login');
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex justify-end">
          {/* logga ut-knapp */}
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="rounded-full bg-red-600 px-6 py-3 text-lg font-bold text-white shadow transition hover:bg-red-700"
          >
            Logga ut
          </button>
        </div>
        <h1 className="mb-12 text-center text-6xl font-black tracking-tighter uppercase drop-shadow-2xl md:text-7xl lg:text-9xl">
          ADMIN PANEL
        </h1>

        <section className="mb-16 md:mb-20">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-5xl font-black md:text-6xl lg:text-7xl">
              HÖG PRODUKTION
            </h2>
            <Link
              href="/admin/about"
              className="bg-custom-pink rounded-full px-8 py-5 text-center text-2xl font-black shadow-2xl transition hover:bg-pink-700 md:text-3xl"
            >
              REDIGERA OM OSS
            </Link>
          </div>
        </section>

        {/* PRODUKTIONER */}
        <section>
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-5xl font-black md:text-6xl lg:text-7xl">
              PRODUKTIONER
            </h2>
            <Link
              href="/admin/projects/new"
              className="bg-custom-pink rounded-full px-8 py-5 text-center text-2xl font-black shadow-2xl transition hover:bg-pink-700 md:text-3xl"
            >
              + NY PRODUKTION
            </Link>
          </div>
        </section>
      </div>
      <ProjectsList projects={projects} />
    </div>
  );
}
