'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/lib/upload';

type CreatedMember = {
  id: string;
  name: string;
  bio: string;
  email?: string | null;
  instagram?: string | null;
  image?: string | null;
  role?: string | null;
};

interface Props {
  onAdded?: (member: CreatedMember) => void;
}

export default function TeamMemberForm({ onAdded }: Props) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl: string | null = null;
      if (image) {
        imageUrl = await uploadFile(image);
      }

      const res = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          bio,
          email: email || null,
          instagram: instagram || null,
          image: imageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const created: CreatedMember = await res.json();

      // reset
      setName('');
      setBio('');
      setEmail('');
      setInstagram('');
      setImage(null);

      if (onAdded) {
        onAdded(created);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert(`Något gick fel: ${err instanceof Error ? err.message : err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      <input
        placeholder="NAMN"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-lg border-4 border-black bg-slate-50 p-5 text-2xl font-black text-black placeholder-slate-500"
      />
      <textarea
        placeholder='LÅNG TEXT – "VEM ÄR JAG"'
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        required
        className="w-full rounded-lg border-4 border-black bg-slate-50 p-5 text-xl text-black placeholder-slate-500"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="block w-full text-lg file:mr-6 file:rounded-full file:bg-pink-600 file:px-8 file:py-4 file:text-black"
      />
      <input
        placeholder="Instagram-användarnamn"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        className="w-full rounded-lg border-4 border-black bg-transparent p-5 text-xl placeholder-slate-500"
      />
      <input
        placeholder="E-post (valfritt)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border-4 border-black bg-transparent p-5 text-xl placeholder-slate-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-pink-600 py-6 text-3xl font-black text-white uppercase shadow-2xl transition hover:bg-pink-700 disabled:opacity-50"
      >
        {loading ? 'LÄGGER TILL...' : 'LÄGG TILL'}
      </button>
    </form>
  );
}
