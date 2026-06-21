import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!name) return new Response('Namn saknas', { status: 400 });

  try {
    const updated = await prisma.collaborator.update({
      where: { id },
      data: { name },
    });
    revalidatePath('/om-oss');
    revalidatePath('/admin/about');
    return Response.json(updated);
  } catch {
    return new Response('Hittades inte', { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id } = await params;

  try {
    await prisma.collaborator.delete({ where: { id } });
    revalidatePath('/om-oss');
    revalidatePath('/admin/about');
    return new Response(null, { status: 204 });
  } catch {
    return new Response('Hittades inte', { status: 404 });
  }
}
