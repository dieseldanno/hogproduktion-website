import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Mail, Heart } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default async function OmOssPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Nav />
      <div className="min-h-screen">
        <main className="mx-auto max-w-7xl px-6 py-20">
          {/* fixa detta!  */}
          <p className="px-8 leading-relaxed md:px-16">
            HÖGproduktion bildades våren 2024 och verkar för att konstnärer ska
            kunna experimentera fritt med form och uttryck i scenkonstfältet.
            Med särskilt fokus på queera perspektiv, normbrytande sexualitet och
            erfarenheter av marginalisering, arbetar kollektivet i en
            experimentell och tillåtande miljö där gränser tänjs och nya
            sceniska möjligheter får ta plats.
          </p>

          {/* grid */}
          {members.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-4xl font-black opacity-70 md:text-6xl">
                Här var det tomt...
              </p>
            </div>
          ) : (
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="group overflow-hidden rounded-3xl bg-white/10 backdrop-blur-lg transition-all hover:scale-105 hover:bg-white/20"
                >
                  {/* BILD */}
                  {member.image ? (
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-white/20" />
                  )}

                  {/* TEXT */}
                  <div className="p-8">
                    <h2 className="mb-2 text-4xl font-black">{member.name}</h2>
                    <p className="mb-4 text-2xl font-bold text-pink-300">
                      {member.role}
                    </p>
                    <p className="text-lg leading-relaxed opacity-90">
                      {member.bio}
                    </p>

                    {/* KONTAKT */}
                    <div className="mt-8 flex gap-6">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-3 text-white/70 transition hover:text-white"
                        >
                          <Mail size={28} />
                          <span className="text-sm underline">Mail</span>
                        </a>
                      )}
                      {member.instagram && (
                        <a
                          href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-white/70 transition hover:text-white"
                        >
                          <Heart size={28} />
                          <span className="text-sm underline">
                            @{member.instagram.replace('@', '')}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
