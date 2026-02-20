import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();

  const member = await prisma.teamMember.create({
    data: {
      name: body.name,
      role: body.role,
      bio: body.bio,
      email: body.email || null,
      instagram: body.instagram?.replace('@', '') || null,
      image: body.image || null,
    },
  });

  return Response.json(member);
}
