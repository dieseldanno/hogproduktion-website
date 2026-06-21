import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSiteContent, SITE_CONTENT_KEYS } from '@/lib/siteContent';

export default async function OmOssPage() {
  const [members, collaborators, intro] = await Promise.all([
    prisma.teamMember.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.collaborator.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    }),
    getSiteContent(SITE_CONTENT_KEYS.ABOUT_INTRO),
  ]);

  return (
    <>
      <Nav />
      <div className="min-h-screen">
        <main className="mx-auto max-w-7xl px-6 py-20">
          {/* INTRO TEXT */}
          <p className="mb-20 whitespace-pre-wrap px-4 text-lg leading-relaxed font-semibold md:px-42 md:text-xl">
            {intro}
          </p>

          {/* TEAM-GRID – mindre kort, 2-3 per rad */}
          {members.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-4xl font-black opacity-70 md:text-6xl">
                Här var det tomt...
              </p>
            </div>
          ) : (
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 md:gap-8">
              {members.map((member, i) => (
                <div
                  key={member.id}
                  className="group relative overflow-hidden rounded-md bg-white/10 backdrop-blur-lg"
                  style={{
                    transform: `rotate(${[-1, 1][i % 2]}deg)`,
                  }}
                >
                  {/* BILD */}
                  {member.image ? (
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        priority={i < 2}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-white/20" />
                  )}

                  {/* TEXT */}
                  <div className="p-4 md:p-5">
                    <h2 className="mb-2 text-2xl font-black md:text-3xl">
                      {member.name}
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed opacity-90 md:text-base">
                      {member.bio}
                    </p>

                    {/* KONTAKT */}
                    <div className="flex flex-wrap gap-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-custom-orange hover:text-custom-pink flex items-center gap-2 transition"
                        >
                          <Mail size={20} />
                          <span className="text-xs underline">Mail</span>
                        </a>
                      )}
                      {member.instagram && (
                        <a
                          href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-custom-orange hover:text-custom-pink flex items-center gap-2 transition"
                        >
                          <FaInstagram size={20} />
                          <span className="text-xs underline">
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

          {/* ÖVRIGA MEDVERKANDE */}
          {collaborators.length > 0 && (
            <section className="mt-24">
              <h2 className="mb-8 text-3xl font-black uppercase md:text-5xl">
                Övriga medverkande
              </h2>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-lg md:text-xl">
                {collaborators.map((c) => (
                  <li key={c.id} className="font-semibold">
                    {c.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
