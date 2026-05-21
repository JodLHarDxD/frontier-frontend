import { TechSwarm } from '../components/TechSwarm';
import { TechMarquee } from '../components/TechMarquee';
import { TerminalScene } from '../components/TerminalScene';
import { Experience } from '../components/Experience';

export const Lab = () => {
  return (
    <main className="w-full min-h-screen bg-bg-primary text-text-primary">
      <TechSwarm />
      <TechMarquee />
      <TerminalScene />
      <Experience />
    </main>
  );
};
