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
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(
    null
  );
  const [removeVideoThumbnail, setRemoveVideoThumbnail] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [keptImageIds, setKeptImageIds] = useState<string[]>(
    project.images?.map((i) => i.id) || []
  );
  const [isCurrent, setIsCurrent] = useState(project.isCurrent);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const existingImages = project.images || [];

  const toggleKeepImage = (id: string) => {
    setKeptImageIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let image: string | null = project.image || null;
    let video: string | null = project.video || null;
    let videoThumbnail: string | null = project.videoThumbnail || null;
    const addedImages: string[] = [];

    try {
      if (imageFile) image = await uploadFile(imageFile);
      if (videoFile) video = await uploadFile(videoFile);

      // Tar bort thumbnail om markerat, annars laddar upp ny om filen valts
      if (removeVideoThumbnail && !videoThumbnailFile) {
        videoThumbnail = null;
      } else if (videoThumbnailFile) {
        videoThumbnail = await uploadFile(videoThumbnailFile);
      }

      for (const file of galleryFiles) {
        const url = await uploadFile(file);
        addedImages.push(url);
      }

      // Bilder som tagits bort = de som inte längre finns i keptImageIds
      const deletedImageIds = existingImages
        .filter((img) => !keptImageIds.includes(img.id))
        .map((img) => img.id);

      const res = await fetch(`/api/projects/${project.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          preview: preview || null,
          content: content || null,
          image,
          video,
          videoThumbnail,
          type,
          isCurrent,
          addedImages: addedImages.length > 0 ? addedImages : undefined,
          deletedImageIds:
            deletedImageIds.length > 0 ? deletedImageIds : undefined,
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
            <>
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

              {/* CUSTOM VIDEO THUMBNAIL */}
              <div>
                <label className="mb-4 block text-3xl font-black">
                  VIDEO-THUMBNAIL (bild som visas innan video spelas)
                </label>

                {project.videoThumbnail &&
                  !videoThumbnailFile &&
                  !removeVideoThumbnail && (
                    <div className="mb-6">
                      <Image
                        src={project.videoThumbnail}
                        alt="Nuvarande thumbnail"
                        width={640}
                        height={360}
                        className="max-h-60 rounded-2xl shadow-2xl"
                      />
                      <button
                        type="button"
                        onClick={() => setRemoveVideoThumbnail(true)}
                        className="mt-4 rounded-full bg-rose-500 px-6 py-3 text-base font-bold text-white uppercase shadow transition hover:bg-rose-600"
                      >
                        Ta bort thumbnail
                      </button>
                    </div>
                  )}

                {removeVideoThumbnail && !videoThumbnailFile && (
                  <div className="mb-6 rounded-2xl border-2 border-dashed border-rose-400 bg-rose-50 p-6">
                    <p className="mb-3 text-lg font-bold text-rose-700">
                      Thumbnail kommer tas bort när du sparar.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRemoveVideoThumbnail(false)}
                      className="rounded-full bg-slate-300 px-6 py-3 text-base font-bold text-slate-800 uppercase transition hover:bg-slate-400"
                    >
                      Ångra
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setVideoThumbnailFile(e.target.files?.[0] || null);
                    // Om man väljer en ny fil ska "ta bort"-flaggan rensas
                    if (e.target.files?.[0]) setRemoveVideoThumbnail(false);
                  }}
                  className="block w-full text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
                />
                <p className="mt-2 text-base opacity-70">
                  Ladda upp en stillbild om du inte vill att en automatisk
                  thumbnail från videon ska användas. Om du tar bort den
                  anpassade thumbnailen används automatisk frame från videon
                  igen.
                </p>
              </div>
            </>
          )}

          {/* PREVIEW & CONTENT */}
          <div className="mt-8 flex flex-col gap-8">
            {type !== 'TEXT' && (
              <textarea
                placeholder="KORT PREVIEW – VISAS I LISTAN"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                rows={5}
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

          {/* BEFINTLIGT GALLERI */}
          {existingImages.length > 0 && (
            <div>
              <label className="mb-4 block text-3xl font-black">
                BEFINTLIGA GALLERIBILDER
              </label>
              <p className="mb-4 text-base opacity-70">
                Klicka på X för att markera en bild för borttagning.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {existingImages.map((img) => {
                  const isKept = keptImageIds.includes(img.id);
                  return (
                    <div key={img.id} className="relative">
                      <Image
                        src={img.url}
                        alt="Galleri"
                        width={300}
                        height={300}
                        className={`aspect-square w-full rounded-lg object-cover shadow-md transition ${
                          isKept ? '' : 'opacity-30 grayscale'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeepImage(img.id)}
                        className={`absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full text-xl font-black text-white shadow-lg transition ${
                          isKept
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                        aria-label={isKept ? 'Ta bort bild' : 'Återställ bild'}
                      >
                        {isKept ? '×' : '↺'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LÄGG TILL NYA GALLERI-BILDER */}
          <div>
            <label className="mb-4 block text-3xl font-black">
              LÄGG TILL NYA BILDER I GALLERIET (valfritt)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setGalleryFiles(Array.from(e.target.files || []))
              }
              className="block w-full text-xl file:mr-8 file:rounded-full file:bg-slate-300 file:px-12 file:py-6 file:text-2xl file:font-black"
            />
            {galleryFiles.length > 0 && (
              <p className="mt-2 text-base opacity-70">
                {galleryFiles.length} ny(a) bild(er) markerade för uppladdning.
              </p>
            )}
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
