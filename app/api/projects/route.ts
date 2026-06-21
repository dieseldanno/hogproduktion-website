import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { generateUniqueSlug } from '@/lib/generateSlug';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const current = searchParams.get('current');

  const where = current === null ? {} : { isCurrent: current === 'true' };

  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { images: true },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();

  const {
    title,
    preview,
    content,
    image,
    video,
    videoThumbnail,
    type,
    isCurrent,
    images,
  } = body;

  if (!title) {
    return new Response('Missing project title', { status: 400 });
  }

  const slug = await generateUniqueSlug(title);

  // Nya projekt läggs sist i ordningen
  const maxOrder = await prisma.project.aggregate({
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  try {
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        preview: preview || null,
        content: content || null,
        image: image || null,
        video: video || null,
        videoThumbnail: videoThumbnail || null,
        type: type,
        isCurrent: isCurrent,
        order: nextOrder,
        images: {
          create: images?.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
      },
    });

    revalidatePath('/');
    revalidatePath('/aktuellt');
    revalidatePath('/arkiv');

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return new Response('Could not create project', { status: 500 });
  }
}
