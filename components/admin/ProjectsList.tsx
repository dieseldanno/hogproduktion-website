'use client';

import { ToggleCurrent } from '@/components/admin/ToggleCurrent';
import Link from 'next/link';
import { Project } from '@prisma/client';

type Props = {
  projects: Project[];
};

export default function ProjectsList({ projects }: Props) {
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
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ToggleCurrent slug={p.slug} isCurrent={p.isCurrent} />
              <Link
                href={`/admin/projects/${p.slug}/edit`}
                className="rounded-full bg-pink-600 px-8 py-5 text-center text-xl font-black shadow-xl transition hover:bg-pink-700 md:text-2xl"
              >
                REDIGERA
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
