import Nav from '@/components/Nav';
import ProjectsSection from '@/components/ProjectsSection';

export default async function HomePage() {
  return (
    <>
      <Nav />
      <ProjectsSection isCurrent={true} />
    </>
  );
}
