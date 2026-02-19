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
      <div className="flex min-h-screen flex-col bg-[#ff9125] text-white">
        <main className="flex-1 px-6 py-32 text-center">
          <p className="text-3xl leading-tight font-black md:text-5xl">
            {emptyMessage || defaultEmpty}
          </p>
        </main>
      </div>
    );
  }

  // current:
  if (isCurrent) {
    return (
      <div className="min-h-screen bg-[#ff9125] text-white">
        <main className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-16 md:space-y-20">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`animate-in slide-in-from-bottom duration-700 ${
                    index > 0 ? 'delay-300' : ''
                  }`}
                >
                  <ProjectCard
                    project={project}
                    reverseOnDesktop={index % 2 === 1}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // archive:
  return (
    <div className="flex min-h-screen flex-col bg-[#ff9125] text-white">
      <main className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-24">
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
