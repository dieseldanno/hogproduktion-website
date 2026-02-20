// src/components/ProjectsSection.tsx
import { prisma } from '@/lib/prisma';
import { Project } from '@prisma/client';
import ProjectCard from '@/components/ProjectCard';

type Props = {
  isCurrent: boolean;
  emptyMessage?: string;
};

export default async function ProjectsSection({
  isCurrent,
  emptyMessage,
}: Props) {
  const projects: Project[] = await prisma.project.findMany({
    where: { isCurrent },
    orderBy: { createdAt: 'desc' }, // nyast först
  });
  const defaultEmpty = isCurrent
    ? 'Inga aktuella produktioner just nu.'
    : 'Inga arkiverade produktioner än';

  if (projects.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-6 py-6 text-center">
          <p className="text-3xl leading-tight font-bold md:text-5xl">
            {emptyMessage || defaultEmpty}
          </p>
        </main>
      </div>
    );
  }

  // current:
  if (isCurrent) {
    return (
      <div className="min-h-screen">
        <main className="px-6 py-6">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-4">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  reverseOnDesktop={index % 2 === 1}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // archive:
  return (
    <div className="flex min-h-screen flex-col">
      <main className="px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                reverseOnDesktop={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
