// app/admin/om-oss/page.tsx
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import TeamMemberClient from '@/components/admin/TeamMemberClient';

export default async function AdminAboutUsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const members = await prisma.teamMember.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <TeamMemberClient initialMembers={members} />
    </>
  );
}
