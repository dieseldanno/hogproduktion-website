'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TeamMemberForm from './TeamMemberForm';
import { uploadFile } from '@/lib/upload';
import { moveCollaborator, moveTeamMember } from '@/app/admin/action';
import { useRouter } from 'next/navigation';

type Member = {
  id: string;
  name: string;
  bio: string;
  email?: string | null;
  instagram?: string | null;
  image?: string | null;
  role?: string | null;
};

type Collaborator = {
  id: string;
  name: string;
};

export default function TeamMemberClient({
  initialMembers,
  initialCollaborators,
  initialIntro,
}: {
  initialMembers: Member[];
  initialCollaborators: Collaborator[];
  initialIntro: string;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [collaborators, setCollaborators] = useState(initialCollaborators);
  const [intro, setIntro] = useState(initialIntro);
  const [introDraft, setIntroDraft] = useState(initialIntro);
  const [savingIntro, setSavingIntro] = useState(false);
  const [newCollabName, setNewCollabName] = useState('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  /* ============ INTRO ============ */
  const saveIntro = async () => {
    setSavingIntro(true);
    try {
      const res = await fetch('/api/site-content/about_intro', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: introDraft }),
      });
      if (!res.ok) throw new Error(await res.text());
      setIntro(introDraft);
    } catch (err) {
      alert(`Kunde inte spara: ${err instanceof Error ? err.message : err}`);
    } finally {
      setSavingIntro(false);
    }
  };

  /* ============ TEAM ============ */
  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Radera ${name}?`)) return;
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleUpdateMember = async (
    id: string,
    updates: Partial<Member> & { imageFile?: File | null }
  ) => {
    let imageUrl = updates.image ?? undefined;
    if (updates.imageFile) {
      imageUrl = await uploadFile(updates.imageFile);
    }
    const res = await fetch(`/api/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updates.name,
        bio: updates.bio,
        email: updates.email,
        instagram: updates.instagram,
        ...(imageUrl !== undefined ? { image: imageUrl } : {}),
      }),
    });
    if (!res.ok) {
      alert(`Fel: ${await res.text()}`);
      return;
    }
    const updated = await res.json();
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    setEditingMemberId(null);
  };

  const handleMoveMember = (id: string, direction: 'up' | 'down') => {
    // Optimistisk uppdatering – flytta lokalt direkt
    setMembers((prev) => swapAdjacent(prev, id, direction));
    startTransition(async () => {
      try {
        await moveTeamMember(id, direction);
      } catch {
        // Vid fel: rulla tillbaka och hämta serverdata
        router.refresh();
      }
    });
  };

  /* ============ COLLABORATORS ============ */
  const addCollaborator = async () => {
    const name = newCollabName.trim();
    if (!name) return;
    const res = await fetch('/api/collaborators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const created = await res.json();
      setCollaborators((prev) => [...prev, created]);
      setNewCollabName('');
    }
  };

  const updateCollaborator = async (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const res = await fetch(`/api/collaborators/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });
    if (res.ok) {
      setCollaborators((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c))
      );
    }
  };

  const deleteCollaborator = async (id: string, name: string) => {
    if (!confirm(`Ta bort ${name}?`)) return;
    const res = await fetch(`/api/collaborators/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCollaborators((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const moveCollab = (id: string, direction: 'up' | 'down') => {
    // Optimistisk uppdatering
    setCollaborators((prev) => swapAdjacent(prev, id, direction));
    startTransition(async () => {
      try {
        await moveCollaborator(id, direction);
      } catch {
        router.refresh();
      }
      // router.refresh() inte nödvändigt här eftersom optimistisk update redan gjort jobbet
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/admin"
          className="text-custom-pink mb-8 inline-block hover:underline"
        >
          ← Tillbaka
        </Link>

        <h1 className="mb-12 text-center text-6xl font-black tracking-tighter uppercase md:text-8xl">
          REDIGERA OM OSS
        </h1>

        {/* INTRO-TEXT */}
        <section className="mb-20 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-4xl font-black">HUVUDTEXT</h2>
          <p className="mb-4 text-base opacity-80">
            Den här texten visas högst upp på &quot;Om oss&quot;-sidan.
          </p>
          <textarea
            value={introDraft}
            onChange={(e) => setIntroDraft(e.target.value)}
            rows={6}
            className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-6 text-lg text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none"
          />
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={saveIntro}
              disabled={savingIntro || introDraft === intro}
              className="rounded-full bg-pink-600 px-8 py-4 text-xl font-black text-white uppercase shadow transition hover:bg-pink-700 disabled:opacity-50"
            >
              {savingIntro ? 'SPARAR...' : 'SPARA TEXT'}
            </button>
            {introDraft !== intro && (
              <button
                onClick={() => setIntroDraft(intro)}
                className="text-base underline opacity-70 hover:opacity-100"
              >
                Ångra
              </button>
            )}
          </div>
        </section>

        {/* LÄGG TILL MEDLEM */}
        <section className="mb-20 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-8 text-4xl font-black">LÄGG TILL PERSON</h2>
          <TeamMemberForm
            onAdded={(member) => setMembers((prev) => [...prev, member])}
          />
        </section>

        {/* BEFINTLIGA MEDLEMMAR */}
        <section className="mb-20">
          <h2 className="mb-8 text-4xl font-black">BEFINTLIGA MEDLEMMAR</h2>
          {members.length === 0 ? (
            <p className="py-20 text-center text-3xl opacity-50">
              Inga här än... Lägg till din första!
            </p>
          ) : (
            <div className="space-y-6">
              {members.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-black backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-6 flex-1">
                    {/* REORDER */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveMember(member.id, 'up')}
                        disabled={idx === 0}
                        aria-label="Flytta upp"
                        className="rounded bg-slate-200 px-3 py-1 text-xl font-bold transition hover:bg-slate-300 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveMember(member.id, 'down')}
                        disabled={idx === members.length - 1}
                        aria-label="Flytta ner"
                        className="rounded bg-slate-200 px-3 py-1 text-xl font-bold transition hover:bg-slate-300 disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>

                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={120}
                        height={120}
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-orange-500"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-slate-200" />
                    )}
                    <div>
                      <h3 className="text-2xl font-black">{member.name}</h3>
                      {member.instagram && (
                        <p className="text-base opacity-80">
                          @{member.instagram}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingMemberId(member.id)}
                      className="rounded-full bg-slate-700 px-6 py-3 text-base font-bold text-white uppercase transition hover:bg-slate-800"
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id, member.name)}
                      className="rounded-full bg-rose-500 px-6 py-3 text-base font-bold text-white uppercase transition hover:bg-rose-600"
                    >
                      Ta bort
                    </button>
                  </div>

                  {editingMemberId === member.id && (
                    <EditMemberInline
                      member={member}
                      onCancel={() => setEditingMemberId(null)}
                      onSave={(updates) =>
                        handleUpdateMember(member.id, updates)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COLLABORATORS */}
        <section className="mb-20 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-2 text-4xl font-black">ÖVRIGA MEDVERKANDE</h2>
          <p className="mb-6 text-base opacity-80">
            En lista med namn som visas längst ner på &quot;Om oss&quot;-sidan.
          </p>

          <div className="mb-6 flex gap-3">
            <input
              type="text"
              placeholder="Namn"
              value={newCollabName}
              onChange={(e) => setNewCollabName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCollaborator();
                }
              }}
              className="flex-1 rounded-lg border-4 border-black bg-slate-50 p-4 text-lg text-black placeholder-slate-500"
            />
            <button
              onClick={addCollaborator}
              disabled={!newCollabName.trim()}
              className="rounded-full bg-pink-600 px-8 py-4 text-lg font-black text-white uppercase transition hover:bg-pink-700 disabled:opacity-50"
            >
              + Lägg till
            </button>
          </div>

          {collaborators.length === 0 ? (
            <p className="opacity-60">Inga ännu.</p>
          ) : (
            <ul className="space-y-2">
              {collaborators.map((c, idx) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded-lg bg-white/40 p-3 text-black"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveCollab(c.id, 'up')}
                      disabled={idx === 0}
                      aria-label="Flytta upp"
                      className="rounded bg-slate-200 px-2 text-sm font-bold disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveCollab(c.id, 'down')}
                      disabled={idx === collaborators.length - 1}
                      aria-label="Flytta ner"
                      className="rounded bg-slate-200 px-2 text-sm font-bold disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <input
                    defaultValue={c.name}
                    onBlur={(e) => {
                      if (e.target.value !== c.name) {
                        updateCollaborator(c.id, e.target.value);
                      }
                    }}
                    className="flex-1 rounded bg-transparent px-3 py-2 text-lg font-semibold focus:bg-white focus:outline-none"
                  />
                  <button
                    onClick={() => deleteCollaborator(c.id, c.name)}
                    className="rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white uppercase hover:bg-rose-600"
                  >
                    Ta bort
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

/* ============================================================== */
/*                       Hjälpfunktioner                          */
/* ============================================================== */
function swapAdjacent<T extends { id: string }>(
  arr: T[],
  id: string,
  direction: 'up' | 'down'
): T[] {
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return arr;
  const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (neighborIdx < 0 || neighborIdx >= arr.length) return arr;
  const copy = [...arr];
  [copy[idx], copy[neighborIdx]] = [copy[neighborIdx], copy[idx]];
  return copy;
}

/* ============================================================== */
/*                  Inline-edit av teammedlem                     */
/* ============================================================== */
function EditMemberInline({
  member,
  onSave,
  onCancel,
}: {
  member: Member;
  onSave: (
    updates: Partial<Member> & { imageFile?: File | null }
  ) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(member.name);
  const [bio, setBio] = useState(member.bio);
  const [email, setEmail] = useState(member.email || '');
  const [instagram, setInstagram] = useState(member.instagram || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, bio, email, instagram, imageFile });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-xl border-2 border-pink-500 bg-white p-6"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Namn"
        required
        className="w-full rounded border-2 border-slate-300 bg-slate-50 p-3 text-lg font-bold"
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio"
        rows={4}
        required
        className="w-full rounded border-2 border-slate-300 bg-slate-50 p-3 text-base"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-post"
        className="w-full rounded border-2 border-slate-300 bg-slate-50 p-3 text-base"
      />
      <input
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        placeholder="Instagram-användarnamn"
        className="w-full rounded border-2 border-slate-300 bg-slate-50 p-3 text-base"
      />
      <div>
        <label className="block text-sm font-bold">Byt bild (valfritt)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="block w-full text-sm"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-pink-600 px-6 py-3 text-base font-bold text-white uppercase hover:bg-pink-700 disabled:opacity-50"
        >
          {saving ? 'SPARAR...' : 'SPARA'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full bg-slate-300 px-6 py-3 text-base font-bold text-slate-800 uppercase hover:bg-slate-400"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
