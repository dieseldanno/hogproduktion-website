import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateUniqueSlug } from '@/lib/generateSlug';

// OBS: config-objektet är borttaget härifrån eftersom det inte stöds i App Router
// och inte behövs när vi skickar JSON-data.

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

  // Om detta projekt sätts till "Current", arkivera alla andra först
  // if (isCurrent === true) {
  //   await prisma.project.updateMany({
  //     where: { isCurrent: true },
  //     data: { isCurrent: false },
  //   });
  // }

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

  return Response.json(updated);
}
