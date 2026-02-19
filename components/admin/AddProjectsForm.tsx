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
    const galleryUrls: string[] = [];

    try {
      // Ladda bara upp det som är relevant för vald typ
      // if (type === 'IMAGE' && imageFile) {
      //   imageUrl = await uploadFile(imageFile);
      // } else if (type === 'VIDEO' && videoFile) {
      //   videoUrl = await uploadFile(videoFile);
      // }
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }

      if (videoFile) {
        videoUrl = await uploadFile(videoFile);
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
    <div className="min-h-screen bg-[#ff9125] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="mb-16 text-center text-7xl font-black uppercase md:text-9xl">
          NYTT INLÄGG
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-12 rounded-3xl bg-white/10 p-12 backdrop-blur-lg"
        >
          {/* TITEL */}
          <input
            placeholder="TITEL"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-2xl border-4 border-white/30 bg-transparent p-8 text-5xl font-black placeholder-white/50"
          />

          {/* VÄLJ TYP */}
          <div className="flex flex-col gap-8 md:grid md:grid-cols-3">
            {(['IMAGE', 'TEXT', 'VIDEO'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-3xl p-12 text-4xl font-black transition-all ${
                  type === t
                    ? 'bg-pink-600 shadow-2xl ring-8 ring-pink-400'
                    : 'bg-white/20'
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
                className="block w-full text-xl file:mr-8 file:rounded-full file:bg-pink-600 file:px-12 file:py-6 file:text-2xl file:font-black"
              />
              <div className="mt-8 flex flex-col gap-8">
                <textarea
                  placeholder="KORT TEXT (FÖR PREVIEW)"
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-2xl border-4 border-white/30 bg-transparent p-6 text-lg placeholder-white/50 sm:text-xl"
                />

                <textarea
                  placeholder="FULLSTÄNDIG TEXT"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={10}
                  className="w-full rounded-2xl border-4 border-white/30 bg-transparent p-6 text-lg placeholder-white/50 sm:text-xl"
                />
              </div>
            </div>
          )}

          {type === 'VIDEO' && (
            <div>
              <label className="mb-4 block text-3xl font-black">
                VIDEO FRÅN DATORN (MP4)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                required={type === 'VIDEO'}
                className="block w-full text-xl file:mr-8 file:rounded-full file:bg-pink-600 file:px-12 file:py-6 file:text-2xl file:font-black"
              />
              <div className="mt-8 flex flex-col gap-8">
                <textarea
                  placeholder="KORT TEXT (FÖR PREVIEW)"
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-2xl border-4 border-white/30 bg-transparent p-6 text-xl placeholder-white/50 sm:text-2xl"
                />

                <textarea
                  placeholder="FULLSTÄNDIG TEXT"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={10}
                  className="w-full rounded-2xl border-4 border-white/30 bg-transparent p-6 text-lg placeholder-white/50 sm:text-xl"
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
              className="w-full rounded-2xl border-4 border-white/30 bg-transparent p-10 text-2xl placeholder-white/50"
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
              className="block w-full text-xl file:mr-8 file:rounded-full file:bg-pink-600 file:px-12 file:py-6 file:text-2xl file:font-black"
            />
          </div>

          {/* AKTUELL? */}
          <div className="flex flex-col items-center gap-12 border-t-4 border-pink-600 py-12">
            <span className="text-4xl font-black">AKTUELLT?</span>
            <button
              type="button"
              onClick={() => setIsCurrent(!isCurrent)}
              className={`relative inline-flex h-20 w-40 rounded-full transition-all ${isCurrent ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <span
                className={`inline-block h-20 w-20 rounded-full bg-white shadow-2xl transition-transform ${isCurrent ? 'translate-x-24' : 'translate-x-4'}`}
              />
            </button>
            <span className="text-6xl font-black">
              {isCurrent ? 'JA' : 'NEJ'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-pink-600 py-14 text-6xl font-black tracking-wider uppercase shadow-2xl transition hover:bg-pink-700 disabled:opacity-50 md:text-7xl"
          >
            {loading ? 'LADDAR UPP...' : 'PUBLICERA'}
          </button>
        </form>
      </div>
    </div>
  );
}
