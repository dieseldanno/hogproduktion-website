import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Max storlek per fil
const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO = ['video/mp4', 'video/quicktime', 'video/webm'];

export const runtime = 'nodejs';
// Tillåt större request body (Next.js har default 1MB)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return new NextResponse('Cloudinary saknas i .env', { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return new NextResponse('Ingen fil bifogad', { status: 400 });
  }

  const isImage = ALLOWED_IMAGE.includes(file.type);
  const isVideo = ALLOWED_VIDEO.includes(file.type);

  if (!isImage && !isVideo) {
    return new NextResponse(`Otillåten filtyp: ${file.type}`, { status: 400 });
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    return new NextResponse(
      `Filen är för stor (max ${Math.round(maxBytes / 1024 / 1024)} MB)`,
      { status: 413 }
    );
  }

  // Vidarebefordra till Cloudinary
  const cloudForm = new FormData();
  cloudForm.append('file', file);
  cloudForm.append('upload_preset', uploadPreset);

  const resourceType = isVideo ? 'video' : 'image';

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: cloudForm,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || 'Uppladdning misslyckades';
      return new NextResponse(message, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ url: data.secure_url });
  } catch (error) {
    console.error('Cloudinary error:', error);
    return new NextResponse('Uppladdning misslyckades', { status: 500 });
  }
}
