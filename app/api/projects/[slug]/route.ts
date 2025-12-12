// app/api/projects/[slug]/route.ts
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateUniqueSlug } from '@/lib/generateSlug';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { slug } = await params;
  const body = await req.json();

  const {
    title,
    preview,
    content,
    image, // ← nu är det en URL från Vercel Blob (eller null)
    video, // ← ny! video-URL från Vercel Blob (eller null)
    type, // ← IMAGE | TEXT | VIDEO
    isCurrent,
  } = body;

  // Generera ny slug om titeln ändrats
  const newSlug = title ? await generateUniqueSlug(title) : slug;

  const updated = await prisma.project.update({
    where: { slug },
    data: {
      title,
      slug: newSlug,
      preview: preview || null,
      content: content || null,
      image: image || undefined, // behåller gammal om ingen ny
      video: video || undefined, // behåller gammal video om ingen ny
      type: type || 'IMAGE',
      isCurrent: isCurrent ?? undefined,
    },
  });

  return Response.json(updated);
}
