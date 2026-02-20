'use client';

import { useState } from 'react';
import Image from 'next/image';
import TeamMemberForm from './TeamMemberForm';
import Link from 'next/link';

type Member = {
  id: string;
  name: string;
  role: string;
  image?: string | null;
  instagram?: string | null;
};

export default function TeamMemberClient({
  initialMembers,
}: {
  initialMembers: Member[];
}) {
  const [members, setMembers] = useState(initialMembers);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Radera ${name}?`)) return;

    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen">
      <Link
        href="/admin"
        className="mb-8 inline-block text-pink-300 hover:underline"
      >
        ← Tillbaka
      </Link>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-12 text-center text-6xl font-black tracking-tighter text-slate-800 uppercase md:text-8xl">
          REDIGERA OM OSS
        </h1>

        <div className="mb-20 rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-8 text-4xl font-black">LÄGG TILL PERSON</h2>
          <TeamMemberForm />
        </div>

        <div>
          <h2 className="mb-8 text-4xl font-black">BEFINTLIGA MEDLEMMAR</h2>

          {members.length === 0 ? (
            <p className="py-20 text-center text-3xl opacity-50">
              Inga här än... Lägg till din första!
            </p>
          ) : (
            <div className="space-y-8">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-8">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={120}
                        height={120}
                        className="h-30 w-30 rounded-full object-cover ring-4 ring-orange-500"
                      />
                    ) : (
                      <div className="h-30 w-30 rounded-full bg-slate-200" />
                    )}
                    <div>
                      <h3 className="text-3xl font-black">{member.name}</h3>
                      <p className="text-2xl text-orange-500">{member.role}</p>
                      {member.instagram && (
                        <p className="text-lg opacity-80">
                          @{member.instagram}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="rounded-full bg-rose-500 px-8 py-4 text-xl font-bold uppercase transition hover:bg-rose-600"
                  >
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
