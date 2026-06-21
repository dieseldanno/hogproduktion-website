export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import TeamMemberClient from '@/components/admin/TeamMemberClient';
import { getSiteContent, SITE_CONTENT_KEYS } from '@/lib/siteContent';

export default async function AdminAboutUsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const [members, collaborators, intro] = await Promise.all([
    prisma.teamMember.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.collaborator.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    }),
    getSiteContent(SITE_CONTENT_KEYS.ABOUT_INTRO),
  ]);

  return (
    <TeamMemberClient
      initialMembers={members}
      initialCollaborators={collaborators}
      initialIntro={intro}
    />
  );
}
