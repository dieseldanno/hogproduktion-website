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

  const {
    title,
    preview,
    content,
    image,
    video,
    type,
    isCurrent,
    addedImages, // array<string> – nya bild-URL:er
    deletedImageIds, // array<string> – ID:n på galleribilder att ta bort
  } = body;

  // För videoThumbnail: skilj på "inte skickat" (undefined → behåll)
  // och "explicit null" (ta bort).
  const videoThumbnailUpdate =
    'videoThumbnail' in body ? body.videoThumbnail : undefined;

  const existingProject = await prisma.project.findUnique({
    where: { slug },
  });

  if (!existingProject) {
    return new Response('Project not found', { status: 404 });
  }

  // Ny slug bara om titeln ändrats
  let newSlug = slug;
  if (title && title !== existingProject.title) {
    newSlug = await generateUniqueSlug(title);
  }

  // Ta bort markerade galleribilder
  if (Array.isArray(deletedImageIds) && deletedImageIds.length > 0) {
    await prisma.projectImage.deleteMany({
      where: {
        id: { in: deletedImageIds },
        projectId: existingProject.id,
      },
    });
  }

  // Lägg till nya galleribilder (om det finns några)
  if (Array.isArray(addedImages) && addedImages.length > 0) {
    // Hämta största nuvarande order för att lägga till efter
    const maxOrder = await prisma.projectImage.aggregate({
      where: { projectId: existingProject.id },
      _max: { order: true },
    });
    const startOrder = (maxOrder._max.order ?? -1) + 1;

    await prisma.projectImage.createMany({
      data: addedImages.map((url: string, i: number) => ({
        url,
        order: startOrder + i,
        projectId: existingProject.id,
      })),
    });
  }

  const updated = await prisma.project.update({
    where: { slug },
    data: {
      title,
      slug: newSlug,
      preview: preview ?? null,
      content: content ?? null,
      image: image ?? undefined,
      video: video ?? undefined,
      videoThumbnail: videoThumbnailUpdate,
      type: type || 'IMAGE',
      isCurrent: isCurrent ?? undefined,
    },
  });

  revalidatePath('/');
  revalidatePath('/aktuellt');
  revalidatePath('/arkiv');
  revalidatePath(`/${slug}`);
  if (newSlug !== slug) revalidatePath(`/${newSlug}`);

  return Response.json(updated);
}
