import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import ProjectsSection from '@/components/ProjectsSection';

export default async function LatestUpdatesPage() {
  return (
    <>
      <Nav />
      <ProjectsSection isCurrent={true} />
      <Footer />
    </>
  );
}
