import { ContactHero } from '../components/ContactHero';
import { SocialGrid } from '../components/SocialGrid';
import { Footer } from '../components/Footer';

export const Contact = () => {
  return (
    <main className="w-full min-h-screen bg-bg-primary text-text-primary">
      <ContactHero />
      <SocialGrid />
      <Footer />
    </main>
  );
};
