import { prisma } from '@/lib/prisma';

export async function generateUniqueSlug(title: string): Promise<string> {
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
