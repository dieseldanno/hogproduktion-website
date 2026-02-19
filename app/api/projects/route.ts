import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { generateUniqueSlug } from '@/lib/generateSlug';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  // FIX: Read JSON body instead of FormData
  const body = await req.json();

  const {
    title,
    preview,
    content,
    image, // This is the URL from AddProjectsForm.tsx
    video, // This is the URL from AddProjectsForm.tsx
    type,
    isCurrent,
    images, // This is the array of URLs from AddProjectsForm.tsx
  } = body;

  if (!title) {
    return new Response('Missing project title', { status: 400 });
  }

  // Generate unique slug
  const slug = await generateUniqueSlug(title);

  // Archive old current project if new one is set to current
  // if (isCurrent === true) {
  //   await prisma.project.updateMany({
  //     where: { isCurrent: true },
  //     data: { isCurrent: false },
  //   });
  // }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        preview: preview || null,
        content: content || null,
        image: image || null,
        video: video || null,
        type: type,
        isCurrent: isCurrent,
        images: {
          create: images?.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return new Response('Could not create project', { status: 500 });
  }
}
