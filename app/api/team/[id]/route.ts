import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id } = await params;

  try {
    await prisma.teamMember.delete({
      where: { id },
    });

    revalidatePath('/om-oss');
    return new Response(null, { status: 204 }); // 204 = "Deleted successfully"
  } catch (error) {
    console.error('Delete error:', error);
    return new Response('Member not found', { status: 404 });
  }
}
