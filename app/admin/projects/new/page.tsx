import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AddProjectForm from '@/components/admin/AddProjectsForm';

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Lägg till ny produktion</h1>
      <AddProjectForm />
    </div>
  );
}
