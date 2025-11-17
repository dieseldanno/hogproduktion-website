import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest } from 'next/server';

async function generateUniqueSlug(title: string): Promise<string> {
  let baseSlug = title
    // Step 1: Normalize to NFD to decompose accented characters (e.g., å → a + ring)
    .normalize('NFD')
    // Step 2: Remove diacritics (combining marks)
    .replace(/[\u0300-\u036f]/g, '')
    // Step 3: Replace specific Swedish/Nordic letters
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/Å/g, 'A')
    .replace(/Ä/g, 'A')
    .replace(/Ö/g, 'O')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/Æ/g, 'AE')
    .replace(/Ø/g, 'O')
    // Step 4: Lowercase and replace non-alphanumeric with hyphens
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
    .replace(/-+/g, '-'); // Collapse multiple hyphens

  if (!baseSlug) baseSlug = 'projekt';

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const exists = await prisma.project.findUnique({ where: { slug } });
    if (!exists) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const data = await req.formData();
  const title = data.get('title') as string;
  const preview = data.get('preview') as string;
  const content = data.get('content') as string;
  const file = data.get('image') as File | null;

  // Generate unique slug
  const slug = await generateUniqueSlug(title);

  let imagePath: string | null = null;

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);
    imagePath = `/uploads/${filename}`;
  }

  // Archive old current project
  await prisma.project.updateMany({
    where: { isCurrent: true },
    data: { isCurrent: false },
  });

  // Create new project with unique slug
  await prisma.project.create({
    data: {
      title,
      slug,
      preview,
      content,
      image: imagePath,
      isCurrent: true,
    },
  });

  return new Response('OK', { status: 200 });
}
