import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import crypto from 'crypto';

/**
 * Returnerar en signatur som klienten använder för att ladda upp
 * direkt till Cloudinary. Det gör att stora filer (video) inte
 * går genom Vercel, som har 4.5 MB request body-gräns.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return new NextResponse(
      'Cloudinary konfiguration saknas (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET)',
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary-signaturen: SHA-1 av "timestamp=X" + API_SECRET.
  // Om du vill signera fler parametrar (t.ex. folder), inkludera dem
  // i sorterad ordning innan API_SECRET.
  const paramsToSign = `timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex');

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
  });
}
