'use server'; // Keep this line! It makes Node.js APIs (like fs/path) work.

import { put } from '@vercel/blob';
import path from 'path';
import { promises as fs } from 'fs'; // Import is fine on the server now

/**
 * Uploads a file. Attempts Vercel Blob first, then falls back to local disk
 * storage in /public/uploads/ in non-production or on failure.
 * @param file The File object received from a client component form submission.
 * @returns The public URL or path to the uploaded file.
 */
export async function uploadFile(file: File): Promise<string> {
  const isVercelEnvironment = process.env.VERCEL === '1';

  // --- 1. Try Vercel Blob (Preferred/Production Method) ---
  try {
    // Only attempt Vercel Blob if the token is available or if we are on Vercel
    if (process.env.BLOB_READ_WRITE_TOKEN || isVercelEnvironment) {
      console.log(`Attempting Vercel Blob upload for: ${file.name}`);
      const { url } = await put(file.name, file, {
        access: 'public',
        // Optional: you can add a path prefix here like 'projects/'
        // pathname: `projects/${file.name}`
      });
      return url;
    }
    // If not on Vercel and no token, fall through to local fallback
    // We don't throw an error here, just proceed to local storage
  } catch (error) {
    console.error(
      'Vercel Blob upload failed. Falling back to local FS.',
      error
    );
    // Proceed to local fallback logic below
  }

  // --- 2. Fallback to Local Filesystem (Development/Local Method) ---

  // NOTE: This local fallback logic will NOT work in Vercel's production environment,
  // but it's essential for local development if you skip Vercel Blob.
  if (isVercelEnvironment && process.env.NODE_ENV === 'production') {
    throw new Error(
      'Local file system fallback is not available in production on Vercel.'
    );
  }

  try {
    const filename = `dev-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure the uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);

    // Convert File to Buffer for fs.writeFile
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filepath, buffer);
    console.log(`Successfully uploaded to local FS: /uploads/${filename}`);

    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Local FS upload also failed.', error);
    throw new Error(
      'Failed to upload file to both Vercel Blob and local disk.'
    );
  }
}
