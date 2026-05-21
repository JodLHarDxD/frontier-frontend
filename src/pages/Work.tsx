import { ProjectsGrid } from '../components/ProjectsGrid';
import { ProjectTiles } from '../components/ProjectTiles';
import { CaseStudy } from '../components/CaseStudy';
import { VHSShowcase } from '../components/VHSShowcase';
import { PageTransition } from '../components/PageTransition';

export function Work() {
  return (
    <div className="min-h-screen bg-bg-primary pt-32">
      <PageTransition />
      <main>
        <div className="px-6 md:px-12 mb-16">
          <h1 className="text-7xl md:text-9xl font-serif italic mb-4">The Work</h1>
          <p className="font-mono text-text-secondary opacity-60">Selected projects, experiments, and case studies.</p>
        </div>

        <ProjectsGrid />
        <ProjectTiles />
        <CaseStudy />
        <VHSShowcase />
      </main>
    </div>
  );
}
