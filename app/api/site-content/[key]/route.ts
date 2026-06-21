import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import { setSiteContent } from '@/lib/siteContent';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { key } = await params;
  const body = await req.json();
  const value = typeof body.value === 'string' ? body.value : '';

  if (value.length > 5000) {
    return new Response('Texten är för lång (max 5000 tecken)', {
      status: 400,
    });
  }

  const updated = await setSiteContent(key, value);

  revalidatePath('/om-oss');
  revalidatePath('/admin/about');

  return Response.json(updated);
}
