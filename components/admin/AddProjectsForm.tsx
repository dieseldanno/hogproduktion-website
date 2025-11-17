// src/components/admin/AddProjectForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProjectForm() {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('preview', preview);
    formData.append('content', content);
    if (image) formData.append('image', image);

    const res = await fetch('/api/projects', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      alert('Något gick fel');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="mb-2 block font-medium">Titel</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border p-3 text-black"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Kort text (preview)</label>
        <textarea
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          className="h-24 w-full rounded border p-3 text-black"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Fullständig text</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-40 w-full rounded border p-3 text-black"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Bild</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-pink-600 px-6 py-3 font-bold text-white hover:bg-pink-700 disabled:opacity-50"
      >
        {loading ? 'Sparar...' : 'Lägg till & sätt som aktuell'}
      </button>
    </form>
  );
}
