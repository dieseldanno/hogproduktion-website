'use client';

import { useState } from 'react';
import { ToggleCurrent } from '@/components/admin/ToggleCurrent';
import Link from 'next/link';
import { Project } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/app/admin/action';

type Props = {
  projects: Project[];
};

export default function ProjectsList({ projects }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleDelete(slug: string) {
    setIsPending(true);
    try {
      await deleteProject(slug);
      setDeletingId(null);
      router.refresh(); // Uppdaterar listan
    } catch {
      alert('Något gick fel vid radering.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-8">
      {projects.length === 0 ? (
        <p className="py-20 text-center text-4xl font-black opacity-50">
          Inga produktioner än.
        </p>
      ) : (
        projects.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col gap-6 rounded-3xl bg-white/10 p-6 transition-all hover:bg-white/20 sm:flex-row sm:items-center sm:justify-between md:p-8"
          >
            <div className="flex-1">
              <h3 className="mb-2 text-3xl font-black md:text-4xl lg:text-5xl">
                {p.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-lg md:text-2xl">
                <span className="text-base opacity-70 md:text-lg">
                  {new Date(p.createdAt).toLocaleDateString('sv-SE')}
                </span>
                <span className="rounded bg-white/10 px-2 py-1 text-xs tracking-widest uppercase opacity-50">
                  {p.type}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ToggleCurrent slug={p.slug} isCurrent={p.isCurrent} />

              <Link
                href={`/admin/projects/${p.slug}/edit`}
                className="rounded-full bg-white/10 px-8 py-5 text-center text-xl font-black transition hover:bg-white/20 md:text-2xl"
              >
                REDIGERA
              </Link>

              {/* RADERA-LOGIK */}
              {deletingId === p.id ? (
                <div className="flex items-center gap-2 rounded-full bg-red-600 p-2 shadow-2xl">
                  <span className="px-4 text-sm font-black uppercase">
                    Säker?
                  </span>
                  <button
                    onClick={() => handleDelete(p.slug)}
                    disabled={isPending}
                    className="rounded-full bg-white px-6 py-3 font-black text-red-600 uppercase transition hover:bg-gray-200"
                  >
                    JA
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="rounded-full bg-black/20 px-6 py-3 font-black text-white uppercase transition hover:bg-black/40"
                  >
                    NEJ
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeletingId(p.id)}
                  className="rounded-full bg-red-600/20 px-8 py-5 text-xl font-black text-red-500 transition hover:bg-red-600 hover:text-white md:text-2xl"
                >
                  RADERA
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
