import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
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
          {/* INTRO TEXT */}
          <p className="mb-20 px-8 text-lg leading-relaxed font-semibold md:px-42 md:text-xl">
            HÖGproduktion bildades våren 2024 och verkar för att konstnärer ska
            kunna experimentera fritt med form och uttryck i scenkonstfältet.
            Med särskilt fokus på queera perspektiv, normbrytande sexualitet och
            erfarenheter av marginalisering, arbetar kollektivet i en
            experimentell och tillåtande miljö där gränser tänjs och nya
            sceniska möjligheter får ta plats.
          </p>

          {/* GRID MED ASYMMETRISK LAYOUT */}
          {members.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-4xl font-black opacity-70 md:text-6xl">
                Här var det tomt...
              </p>
            </div>
          ) : (
            <div className="grid auto-rows-min gap-12 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member, i) => (
                <div
                  key={member.id}
                  className={`group relative overflow-hidden bg-white/10 backdrop-blur-lg`}
                  style={{
                    transform: `rotate(${[-2, 0, 2][i % 3]}deg)`,
                  }}
                >
                  {/* BILD */}
                  {member.image ? (
                    <div className="aspect-4/5 overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={375}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-4/5 bg-white/20" />
                  )}

                  {/* TEXT */}
                  <div className="p-8">
                    <h2 className="mb-2 text-4xl font-black">{member.name}</h2>
                    {/* <p className="mb-4 text-2xl font-bold text-orange-500">
                      {member.role}
                    </p> */}
                    <p className="mb-6 text-lg leading-relaxed opacity-90">
                      {member.bio}
                    </p>

                    {/* KONTAKT */}
                    <div className="flex flex-wrap gap-6">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-custom-orange hover:text-custom-pink flex items-center gap-3 transition"
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
                          className="text-custom-orange hover:text-custom-pink flex items-center gap-3 transition"
                        >
                          <FaInstagram size={28} /> {/* här */}
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
