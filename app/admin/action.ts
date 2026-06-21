'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function deleteProject(slug: string) {
  await requireAuth();
  try {
    await prisma.project.delete({
      where: { slug },
    });

    revalidatePath('/');
    revalidatePath(`/${slug}`);
    revalidatePath('/aktuellt');
    revalidatePath('/arkiv');

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Kunde inte radera projektet.');
  }
}

/**
 * Byter ordning mellan ett projekt och dess granne (upp/ner).
 * Använder samma sortering som listorna: order ASC, createdAt DESC.
 */
export async function moveProject(id: string, direction: 'up' | 'down') {
  await requireAuth();

  const all = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Project not found');

  const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (neighborIdx < 0 || neighborIdx >= all.length) {
    return { success: true }; // redan i kanten
  }

  const a = all[idx];
  const b = all[neighborIdx];

  // Om de råkar ha samma order: tilldela unika order-värden baserat på index
  // för att garantera deterministisk sortering framöver.
  if (a.order === b.order) {
    await prisma.$transaction(
      all.map((p, i) =>
        prisma.project.update({
          where: { id: p.id },
          data: { order: i },
        })
      )
    );
    // Hämta uppdaterade värden
    const refreshedA = await prisma.project.findUnique({ where: { id: a.id } });
    const refreshedB = await prisma.project.findUnique({ where: { id: b.id } });
    if (refreshedA && refreshedB) {
      await prisma.$transaction([
        prisma.project.update({
          where: { id: a.id },
          data: { order: refreshedB.order },
        }),
        prisma.project.update({
          where: { id: b.id },
          data: { order: refreshedA.order },
        }),
      ]);
    }
  } else {
    await prisma.$transaction([
      prisma.project.update({
        where: { id: a.id },
        data: { order: b.order },
      }),
      prisma.project.update({
        where: { id: b.id },
        data: { order: a.order },
      }),
    ]);
  }

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/aktuellt');
  revalidatePath('/arkiv');

  return { success: true };
}

export async function moveCollaborator(id: string, direction: 'up' | 'down') {
  await requireAuth();
  const all = await prisma.collaborator.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Not found');
  const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (neighborIdx < 0 || neighborIdx >= all.length) return { success: true };

  const a = all[idx];
  const b = all[neighborIdx];

  if (a.order === b.order) {
    await prisma.$transaction(
      all.map((c, i) =>
        prisma.collaborator.update({
          where: { id: c.id },
          data: { order: i },
        })
      )
    );
  } else {
    await prisma.$transaction([
      prisma.collaborator.update({
        where: { id: a.id },
        data: { order: b.order },
      }),
      prisma.collaborator.update({
        where: { id: b.id },
        data: { order: a.order },
      }),
    ]);
  }

  revalidatePath('/admin/about');
  revalidatePath('/om-oss');
  return { success: true };
}

export async function moveTeamMember(id: string, direction: 'up' | 'down') {
  await requireAuth();
  const all = await prisma.teamMember.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error('Not found');
  const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (neighborIdx < 0 || neighborIdx >= all.length) return { success: true };

  const a = all[idx];
  const b = all[neighborIdx];

  if (a.order === b.order) {
    await prisma.$transaction(
      all.map((m, i) =>
        prisma.teamMember.update({
          where: { id: m.id },
          data: { order: i },
        })
      )
    );
  } else {
    await prisma.$transaction([
      prisma.teamMember.update({
        where: { id: a.id },
        data: { order: b.order },
      }),
      prisma.teamMember.update({
        where: { id: b.id },
        data: { order: a.order },
      }),
    ]);
  }

  revalidatePath('/admin/about');
  revalidatePath('/om-oss');
  return { success: true };
}
