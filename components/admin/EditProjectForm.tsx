'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Project, ProjectImage } from '@prisma/client';
import { uploadFile } from '@/lib/upload';

type ProjectType = 'IMAGE' | 'TEXT' | 'VIDEO';

interface EditProjectFormProps {
  project: Project & { images?: ProjectImage[] };
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const [title, setTitle] = useState(project.title);
  const [preview, setPreview] = useState(project.preview || '');
  const [content, setContent] = useState(project.content || '');
  const [type, setType] = useState<ProjectType>(project.type as ProjectType);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isCurrent, setIsCurrent] = useState(project.isCurrent);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let image: string | null = project.image || null;
    let video: string | null = project.video || null;
    const galleryUrls: string[] = [];

    try {
      if (imageFile) image = await uploadFile(imageFile);
      if (videoFile) video = await uploadFile(videoFile);

      // Ladda upp nya galleri-bilder
      for (const file of galleryFiles) {
        const url = await uploadFile(file);
        galleryUrls.push(url);
      }

      const res = await fetch(`/api/projects/${project.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          preview: preview || null,
          content: content || null,
          image,
          video,
          type,
          isCurrent,
          images: galleryUrls.length > 0 ? galleryUrls : undefined,
        }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const errorText = await res.text();
        alert(`Fel vid sparning: ${errorText}`);
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
          REDIGERA INLÄGG
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

          {type === 'IMAGE' && (
            <div>
              <label className="mb-4 block text-3xl font-black">
                NY BILD (ändra inget för att behålla gammal)
              </label>
              {project.image && !imageFile && (
                <div className="mb-6">
                  <Image
                    src={project.image}
                    alt="Nuvarande"
                    width={1280}
                    height={720}
                    unoptimized
                    className="max-h-96 rounded-2xl shadow-2xl"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
              />
            </div>
          )}

          {type === 'VIDEO' && (
            <div>
              <label className="mb-4 block text-3xl font-black">
                NY VIDEO (ändra inget för att behålla gammal)
              </label>
              {project.video && !videoFile && (
                <div className="mb-6">
                  <p className="mb-4 text-xl opacity-80">Nuvarande video:</p>
                  <video
                    controls
                    className="max-h-96 w-full rounded-2xl shadow-2xl"
                  >
                    <source src={project.video} />
                  </video>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="block w-full text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
              />
            </div>
          )}

          {/* PREVIEW & CONTENT */}
          <div className="mt-8 flex flex-col gap-8">
            {type !== 'TEXT' && (
              <input
                placeholder="KORT PREVIEW – VISAS I LISTAN"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-6 text-lg text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none sm:text-xl"
              />
            )}

            <textarea
              placeholder="FULLSTÄNDIG TEXT"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-6 text-lg text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none sm:text-xl"
            />
          </div>

          {/* GALLERI */}
          <div>
            <label className="mb-4 block text-3xl font-black">
              BILDGALLERI (VALFRITT) - VÄLJ FLERA BILDER
            </label>

            {/* Visa befintliga bilder */}
            {project.images &&
              project.images.length > 0 &&
              !galleryFiles.length && (
                <div className="mb-4 flex flex-wrap gap-4">
                  {project.images.map((img) => (
                    <Image
                      key={img.id}
                      src={img.url}
                      alt="Nuvarande galleri"
                      width={300}
                      height={300}
                      className="rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setGalleryFiles(Array.from(e.target.files || []))
              }
              className="block w-full text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
            />
          </div>

          {/* AKTUELL? */}
          <div className="flex flex-col items-center gap-12 border-t-4 border-slate-400 py-16">
            <span className="text-center text-4xl font-black">
              AKTUELLT INLÄGG?
            </span>
            <button
              type="button"
              onClick={() => setIsCurrent(!isCurrent)}
              className={`relative inline-flex h-24 w-48 rounded-full transition-all ${
                isCurrent ? 'bg-emerald-400' : 'bg-slate-500'
              }`}
            >
              <span
                className={`inline-block h-20 w-20 rounded-full bg-white shadow-2xl transition-transform ${
                  isCurrent ? 'translate-x-28' : 'translate-x-4'
                }`}
              />
            </button>
            <span className="text-4xl font-black">
              {isCurrent ? 'JA' : 'NEJ'}
            </span>
          </div>

          {/* SPARA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-500 py-14 text-4xl font-black tracking-wider uppercase shadow-2xl transition hover:bg-slate-600 disabled:opacity-50 md:text-5xl"
          >
            {loading ? 'SPARAR...' : 'SPARA ÄNDRINGAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
