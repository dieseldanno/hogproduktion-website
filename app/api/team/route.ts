import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const data = await req.formData();
  const name = data.get('name') as string;
  const role = data.get('role') as string;
  const bio = data.get('bio') as string;
  const email = data.get('email') as string | null;
  const instagram = data.get('instagram') as string | null;
  const file = data.get('image') as File | null;

  let imagePath: string | undefined;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);
    imagePath = `/uploads/${filename}`;
  }

  const member = await prisma.teamMember.create({
    data: {
      name,
      role,
      bio,
      email: email || null,
      instagram: instagram?.replace('@', '') || null,
      image: imagePath,
    },
  });

  return Response.json(member);
}
