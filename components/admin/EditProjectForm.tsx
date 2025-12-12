'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@prisma/client';
import { uploadFile } from '@/lib/upload';

type ProjectType = 'IMAGE' | 'TEXT' | 'VIDEO';

export default function EditProjectForm({ project }: { project: Project }) {
  const [title, setTitle] = useState(project.title);
  const [preview, setPreview] = useState(project.preview || '');
  const [content, setContent] = useState(project.content || '');
  const [type, setType] = useState<ProjectType>(project.type as ProjectType);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isCurrent, setIsCurrent] = useState(project.isCurrent);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let image: string | null = project.image || null;
    let video: string | null = project.video || null;

    try {
      if (imageFile) image = await uploadFile(imageFile);
      if (videoFile) video = await uploadFile(videoFile);

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
        }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert('Fan... något gick fel vid sparning');
      }
    } catch (err) {
      alert('Uppladdning misslyckades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-500 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="mb-16 text-center text-6xl font-black uppercase md:text-8xl lg:text-9xl">
          REDIGERA INLÄGG
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

          {/* VÄLJ TYP – BILD / TEXT / VIDEO */}
          <div className="grid grid-cols-3 gap-8">
            {(['IMAGE', 'TEXT', 'VIDEO'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`transform rounded-3xl p-12 text-4xl font-black transition-all ${
                  type === t
                    ? 'scale-110 bg-pink-600 shadow-2xl ring-8 ring-pink-400'
                    : 'bg-white/20 hover:scale-105 hover:bg-white/30'
                }`}
              >
                {t === 'IMAGE' && 'BILD'}
                {t === 'TEXT' && 'TEXT'}
                {t === 'VIDEO' && 'VIDEO'}
              </button>
            ))}
          </div>

          {/* NU VISAR VI RÄTT FÄLT BASERAT PÅ TYP */}
          {type === 'IMAGE' && (
            <>
              <input
                placeholder="KORT PREVIEW – VISAS I LISTAN"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                className="w-full rounded-2xl border-4 border-white/30 bg-transparent p-8 text-2xl placeholder-white/50"
              />
              <div>
                <label className="mb-4 block text-3xl font-black">
                  NY BILD (lämna tomt för att behålla gammal)
                </label>
                {project.image && !imageFile && (
                  <div className="mb-6">
                    <p className="mb-4 text-xl opacity-80">Nuvarande bild:</p>
                    <img
                      src={project.image}
                      alt="Nuvarande"
                      className="max-h-96 rounded-2xl shadow-2xl"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-xl file:mr-8 file:rounded-full file:bg-pink-600 file:px-12 file:py-6 file:text-2xl file:font-black"
                />
              </div>
            </>
          )}

          {type === 'VIDEO' && (
            <div>
              <label className="mb-4 block text-3xl font-black">
                NY VIDEO (lämna tomt för att behålla gammal)
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
                className="block w-full text-xl file:mr-8 file:rounded-full file:bg-pink-600 file:px-12 file:py-6 file:text-2xl file:font-black"
              />
            </div>
          )}

          {type !== 'IMAGE' && (
            <textarea
              placeholder={
                type === 'TEXT'
                  ? 'HEL TEXT – BARA REN KRAFT'
                  : 'BESKRIVNING UNDER VIDEON'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full rounded-2xl border-4 border-white/30 bg-transparent p-10 text-2xl placeholder-white/50"
            />
          )}

          {/* AKTUELL? */}
          <div className="flex flex-col items-center gap-12 border-t-4 border-pink-600 py-16">
            <span className="text-center text-5xl font-black">
              AKTUELLT INLÄGG?
            </span>
            <button
              type="button"
              onClick={() => setIsCurrent(!isCurrent)}
              className={`relative inline-flex h-24 w-48 rounded-full transition-all ${isCurrent ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <span
                className={`inline-block h-20 w-20 rounded-full bg-white shadow-2xl transition-transform ${isCurrent ? 'translate-x-28' : 'translate-x-4'}`}
              />
            </button>
            <span className="text-7xl font-black">
              {isCurrent ? 'JA' : 'NEJ'}
            </span>
          </div>

          {/* SPARA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-pink-600 py-14 text-6xl font-black tracking-wider uppercase shadow-2xl transition hover:bg-pink-700 disabled:opacity-50 md:text-7xl"
          >
            {loading ? 'SPARAR...' : 'SPARA ÄNDRINGAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
