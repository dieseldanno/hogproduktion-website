'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/lib/upload';

export default function AddProjectForm() {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(
    null
  );
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [type, setType] = useState<'IMAGE' | 'TEXT' | 'VIDEO'>('IMAGE');
  const [isCurrent, setIsCurrent] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl: string | null = null;
    let videoUrl: string | null = null;
    let videoThumbnailUrl: string | null = null;
    const galleryUrls: string[] = [];

    try {
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }

      if (videoFile) {
        videoUrl = await uploadFile(videoFile);
      }

      if (videoThumbnailFile) {
        videoThumbnailUrl = await uploadFile(videoThumbnailFile);
      }

      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const url = await uploadFile(file);
          galleryUrls.push(url);
        }
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          preview: preview || null,
          content: content || null,
          image: imageUrl,
          video: videoUrl,
          videoThumbnail: videoThumbnailUrl,
          type,
          isCurrent,
          images: galleryUrls,
        }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const errorText = await res.text();
        alert(`Fel: ${errorText}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Uppladdning misslyckades: ${message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-16 text-center text-5xl font-black uppercase md:text-7xl">
          NYTT INLÄGG
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-12 rounded-3xl border p-12 text-black backdrop-blur-lg"
        >
          {/* TITEL */}
          <input
            placeholder="TITEL"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-8 text-3xl font-black text-slate-900 placeholder-slate-400 focus:border-slate-600 focus:outline-none"
          />

          {/* VÄLJ TYP */}
          <div className="flex flex-col gap-8 md:grid md:grid-cols-3">
            {(['IMAGE', 'TEXT', 'VIDEO'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`cursor-pointer rounded-3xl border-2 border-emerald-700 p-12 text-4xl font-black transition-all ${
                  type === t
                    ? 'bg-emerald-400 shadow-2xl ring-8 ring-emerald-200'
                    : 'bg-white'
                }`}
              >
                {t === 'IMAGE' && 'BILD'}
                {t === 'TEXT' && 'TEXT'}
                {t === 'VIDEO' && 'VIDEO'}
              </button>
            ))}
          </div>

          {/* BILD / VIDEO / TEXT FÄLT */}
          {type === 'IMAGE' && (
            <div>
              <label className="mb-4 block text-3xl font-black">
                POSTERBILD
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required={type === 'IMAGE'}
                className="block w-full cursor-pointer text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
              />
              <div className="mt-8 flex flex-col gap-8">
                <textarea
                  placeholder="KORT TEXT (FÖR PREVIEW)"
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-6 text-lg text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none sm:text-xl"
                />

                <textarea
                  placeholder="FULLSTÄNDIG TEXT"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={10}
                  className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-6 text-lg text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none sm:text-xl"
                />
              </div>
            </div>
          )}

          {type === 'VIDEO' && (
            <div className="space-y-8">
              <div>
                <label className="mb-4 block text-3xl font-black">
                  VIDEO FRÅN DATORN (MP4)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required={type === 'VIDEO'}
                  className="block w-full cursor-pointer text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
                />
              </div>

              <div>
                <label className="mb-4 block text-3xl font-black">
                  THUMBNAIL (valfritt – stillbild att visa innan video spelas)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setVideoThumbnailFile(e.target.files?.[0] || null)
                  }
                  className="block w-full cursor-pointer text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
                />
                <p className="mt-2 text-base opacity-70">
                  Lämna tomt om du vill att en automatisk thumbnail från videon
                  ska användas.
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <textarea
                  placeholder="KORT TEXT (FÖR PREVIEW)"
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-6 text-lg text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none sm:text-xl"
                />

                <textarea
                  placeholder="FULLSTÄNDIG TEXT"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={10}
                  className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-6 text-lg text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none sm:text-xl"
                />
              </div>
            </div>
          )}

          {type === 'TEXT' && (
            <textarea
              placeholder="FULLSTÄNDIG TEXT"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-6 text-lg text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none sm:text-xl"
            />
          )}

          {/* bildgalleri */}
          <div>
            <label className="mb-4 block text-3xl font-black">
              Bildgalleri (valfritt, välj en eller flera bilder)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setGalleryFiles(Array.from(e.target.files || []))
              }
              className="block w-full cursor-pointer text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
            />
          </div>

          {/* AKTUELL? */}
          <div className="flex flex-col items-center gap-12 border-t-4 border-slate-400 py-12">
            <span className="text-4xl font-black">AKTUELLT?</span>
            <button
              type="button"
              onClick={() => setIsCurrent(!isCurrent)}
              className={`relative inline-flex h-20 w-40 rounded-full transition-all ${isCurrent ? 'bg-emerald-400' : 'bg-slate-500'}`}
            >
              <span
                className={`inline-block h-20 w-20 rounded-full bg-white shadow-2xl transition-transform ${isCurrent ? 'translate-x-24' : 'translate-x-4'}`}
              />
            </button>
            <span className="text-4xl font-black">
              {isCurrent ? 'JA' : 'NEJ'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-500 py-8 text-4xl font-black tracking-wider uppercase shadow-2xl transition hover:bg-slate-600 disabled:opacity-50 md:text-5xl"
          >
            {loading ? 'LADDAR UPP...' : 'PUBLICERA'}
          </button>
        </form>
      </div>
    </div>
  );
}
