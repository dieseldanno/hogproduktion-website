// lib/upload.ts
// Klienten hämtar en signatur från vår server och laddar sedan upp
// direkt till Cloudinary. Vercels 4.5 MB body-gräns undviks helt.

const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function uploadFile(file: File): Promise<string> {
  const isVideo = file.type.startsWith('video/');
  const isImage = ALLOWED_IMAGE.includes(file.type);

  if (!isImage && !isVideo) {
    throw new Error(`Otillåten filtyp: ${file.type}`);
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    throw new Error(
      `Filen är för stor (${Math.round(file.size / 1024 / 1024)} MB). Max: ${Math.round(maxBytes / 1024 / 1024)} MB.`
    );
  }

  // 1) Hämta signatur (kräver admin-auth)
  const sigRes = await fetch('/api/upload', { method: 'POST' });
  if (!sigRes.ok) {
    throw new Error(
      (await sigRes.text()) || 'Kunde inte hämta uppladdningssignatur'
    );
  }
  const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

  // 2) Ladda upp direkt till Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);

  const resourceType = isVideo ? 'video' : 'image';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    const errData = await uploadRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Cloudinary-uppladdning misslyckades');
  }

  const data = await uploadRes.json();
  return data.secure_url as string;
}
