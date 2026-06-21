/**
 * Returnerar en URL för en video-thumbnail.
 * Om `customThumbnail` finns används den, annars genereras en från Cloudinary-URL.
 * Returnerar undefined om inget av alternativen funkar.
 */
export function resolveVideoThumbnail(
  videoUrl: string | null | undefined,
  customThumbnail: string | null | undefined
): string | undefined {
  if (customThumbnail) return customThumbnail;
  if (!videoUrl) return undefined;

  // Cloudinary-URL-trick: ta frame vid sekund 2
  if (videoUrl.includes('/video/upload/')) {
    return videoUrl
      .replace('/video/upload/', '/video/upload/so_2/')
      .replace(/\.(mp4|mov|webm)$/i, '.jpg');
  }

  return undefined;
}
