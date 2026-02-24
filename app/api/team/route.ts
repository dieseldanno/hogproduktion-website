import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const members = await prisma.teamMember.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(members);
}

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

  revalidatePath('/om-oss');
  return Response.json(member);
}
