import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AddProjectForm from '@/components/admin/AddProjectsForm';
import Link from 'next/link';

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div className="min-h-screen p-8">
      <Link href="/admin" className="text-custom-pink mb-8 inline-block">
        ← Tillbaka
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Lägg till ny produktion</h1>
      <AddProjectForm />
    </div>
  );
}
