import { prisma } from '@/lib/prisma';

export const SITE_CONTENT_KEYS = {
  ABOUT_INTRO: 'about_intro',
} as const;

export const DEFAULT_SITE_CONTENT: Record<string, string> = {
  [SITE_CONTENT_KEYS.ABOUT_INTRO]:
    'HÖGproduktion bildades våren 2024 och verkar för att konstnärer ska kunna experimentera fritt med form och uttryck i scenkonstfältet. Med särskilt fokus på queera perspektiv, normbrytande sexualitet och erfarenheter av marginalisering, arbetar kollektivet i en experimentell och tillåtande miljö där gränser tänjs och nya sceniska möjligheter får ta plats.',
};

export async function getSiteContent(key: string): Promise<string> {
  const row = await prisma.siteContent.findUnique({ where: { key } });
  return row?.value ?? DEFAULT_SITE_CONTENT[key] ?? '';
}

export async function setSiteContent(key: string, value: string) {
  return prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
