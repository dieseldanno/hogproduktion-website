import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateUniqueSlug } from '@/lib/generateSlug';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { slug } = await params;
  const body = await req.json();

  const { title, preview, content, image, video, type, isCurrent } = body;

  // Hämta projektet för att se om titeln faktiskt har ändrats
  const existingProject = await prisma.project.findUnique({
    where: { slug },
  });

  if (!existingProject) {
    return new Response('Project not found', { status: 404 });
  }

  // Generera ny slug endast om titeln är annorlunda än den befintliga
  let newSlug = slug;
  if (title && title !== existingProject.title) {
    newSlug = await generateUniqueSlug(title);
  }

  const updated = await prisma.project.update({
    where: { slug },
    data: {
      title,
      slug: newSlug,
      preview: preview ?? null,
      content: content ?? null,
      image: image ?? undefined, // Behåller gammal om ingen ny skickas
      video: video ?? undefined, // Behåller gammal om ingen ny skickas
      type: type || 'IMAGE',
      isCurrent: isCurrent ?? undefined,
    },
  });

  revalidatePath('/aktuellt');
  revalidatePath('/arkiv');

  return Response.json(updated);
}
