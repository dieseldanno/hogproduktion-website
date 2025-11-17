import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@prisma/client';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/${project.slug}`}>
      <article className="group cursor-pointer space-y-4">
        {/* Image */}
        <div className="overflow-hidden rounded-lg">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              width={600}
              height={400}
              className="h-64 w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-800">
              <span className="text-gray-500">Ingen bild</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase">{project.title}</h2>
          <p className="line-clamp-3 text-sm opacity-90">{project.preview}</p>
        </div>

        {/* Read More */}
        <p className="font-bold text-pink-600 group-hover:underline">
          LÄS MER →
        </p>
      </article>
    </Link>
  );
}
