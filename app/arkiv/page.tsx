export const dynamic = 'force-dynamic';

import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import ProjectsSection from '@/components/ProjectsSection';

export default function ArchivePage() {
  return (
    <>
      <Nav />
      <ProjectsSection isCurrent={false} />
      <Footer />
    </>
  );
}
