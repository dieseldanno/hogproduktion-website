// lib/upload.ts
// Klientwrapper som anropar /api/upload (server-side, autentiserat)

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Uppladdning misslyckades');
  }

  const data = await response.json();
  return data.url as string;
}
