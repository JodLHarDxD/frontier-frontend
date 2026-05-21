import { Hero } from '../components/Hero';
import { Method } from '../components/Method';
import { About } from '../components/About';
import { Services } from '../components/Services';

export function Home() {
  return (
    <div className="w-full bg-bg-primary text-text-primary overflow-hidden transition-colors duration-300">
      <Hero />
      <Method />
      <About />
      <Services />
    </div>
  );
}
