import EmailMarquee from '@/components/EmailMarquee';
import ProjectGrid from '@/components/startpage/ProjectGrid';
import ProjectTitleGrid from '@/components/startpage/MenuGrid';
import { prisma } from '@/lib/prisma';
// import Image from 'next/image';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type FlatImage = {
  id: string;
  url: string;
  title: string;
  slug: string;
};

export default async function Home() {
  const projects = await prisma.project.findMany({
    where: { OR: [{ image: { not: null } }, { images: { some: {} } }] },
    include: { images: true },
  });

  // Flatten main image + gallery images into one array
  const flatImages: FlatImage[] = [];

  for (const project of projects) {
    // add main image if exists
    if (project.image) {
      flatImages.push({
        id: `main-${project.id}`,
        url: project.image,
        title: project.title,
        slug: project.slug,
      });
    }

    // add gallery images
    for (const img of project.images) {
      // only add if different from main image
      if (img.url !== project.image) {
        flatImages.push({
          id: img.id,
          url: img.url,
          title: project.title,
          slug: project.slug,
        });
      }
    }
  }

  const uniqueImages = Array.from(
    new Map(
      flatImages.map((img) => [img.url.trim().toLowerCase(), img])
    ).values()
  );

  const shuffledImages = shuffleArray(uniqueImages);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <EmailMarquee />

      <main className="relative flex-1 overflow-hidden">
        {/* BAKGRUNDSBILD */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/rosarok.webp')",
          }}
        />
        {/* GRID LAYOUT */}
        <div className="relative grid h-full grid-cols-2">
          {/* VÄNSTER egen scroll */}
          <div className="hide-scrollbar z-30 overflow-y-auto py-2">
            <ProjectTitleGrid />
          </div>

          {/* HÖGER egen scroll */}
          <div className="hide-scrollbar z-30 overflow-y-auto py-2">
            <ProjectGrid projects={shuffledImages} />
          </div>
        </div>
      </main>
    </div>
  );
}

{
  /* MASSIV GHOST TEXT BAKGRUND */
}
// <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
//   <div
//     className="text-custom-orange leading-[0.8] font-black uppercase opacity-80"
//     style={{
//       /* clamp(Minsta storlek, Föredragen storlek, Maxstorlek) */
//       fontSize: 'clamp(160px, 12vw, 180px)',
//       lineHeight: '0.75',
//       transform: 'rotate(-12deg) scale(1.2)', // Rotera och skala upp för att fylla ut
//       // filter: 'blur(1px)', // Valfritt: lite blur gör det ännu mer "bakgrunds-aktigt"
//       width: '150%', // Bredare än skärmen
//       textAlign: 'center',
//     }}
//   >
//     HÖGproduktion bildades våren 2024 och verkar för att konstnärer ska
//     kunna experimentera fritt med form och uttryck i scenkonstfältet.
//     Med särskilt fokus på queera perspektiv, normbrytande sexualitet och
//     erfarenheter av marginalisering, arbetar kollektivet i en
//     experimentell och tillåtande miljö där gränser tänjs och nya
//     sceniska möjligheter får ta plats.
//   </div>
// </div>

{
  /* STICKY CENTER LOGO */
}
{
  /* <div className="pointer-events-none absolute z-20 flex items-center justify-center sm:fixed md:inset-0">
          <Image
            src="/hoglogowhite.png"
            alt="Högproduktion logo"
            width={1200}
            height={1200}
            className="h-auto w-full object-cover"
            priority
          />
        </div> */
}
