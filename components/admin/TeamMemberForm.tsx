'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamMemberForm() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('bio', bio);
    if (email) formData.append('email', email);
    if (instagram) formData.append('instagram', instagram);
    if (image) formData.append('image', image);

    const res = await fetch('/api/team', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setName('');
      setRole('');
      setBio('');
      setEmail('');
      setInstagram('');
      setImage(null);
      router.refresh();
    } else {
      alert('Något gick fel');
    }
    setLoading(false);
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        placeholder="NAMN"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-lg border-4 border-white/30 bg-transparent p-5 text-2xl font-black placeholder-white/50"
      />
      <input
        placeholder="ROLL"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
        className="w-full rounded-lg border-4 border-white/30 bg-transparent p-5 text-2xl font-black placeholder-white/50"
      />
      <textarea
        placeholder='LÅNG TEXT – "VEM ÄR JAG"'
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        required
        className="w-full rounded-lg border-4 border-white/30 bg-transparent p-5 text-xl placeholder-white/50"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="block w-full text-lg file:mr-6 file:rounded-full file:bg-pink-600 file:px-8 file:py-4 file:text-white"
      />
      <input
        placeholder="INSTAGRAM"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        className="w-full rounded-lg border-4 border-white/30 bg-transparent p-5 text-xl placeholder-white/50"
      />
      <input
        placeholder="MAIL"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border-4 border-white/30 bg-transparent p-5 text-xl placeholder-white/50"
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
