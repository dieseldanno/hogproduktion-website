'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteProject(slug: string) {
  try {
    await prisma.project.delete({
      where: { slug },
    });

    // Rensa cachen så att ändringen syns direkt på alla sidor
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/${slug}`);

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Kunde inte radera projektet.');
  }
}
