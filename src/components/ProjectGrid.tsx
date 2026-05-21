import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const projects = [
  {
    id: 1,
    title: 'Studio Namma',
    category: 'Brand & Webflow',
    videoSrc: '/media/videos/reel/reel_namma_1.mp4',
  },
  {
    id: 2,
    title: 'Global Digital Agency',
    category: 'Motion Identity',
    videoSrc: '/media/videos/hero/hero_digital_agency.mp4',
  },
  {
    id: 3,
    title: 'NeoLeaf',
    category: 'E-commerce System',
    videoSrc: '/media/videos/projects/project_neoleaf.mp4',
  },
];

export const ProjectGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal animation on scroll
    const cards = gsap.utils.toArray('.project-card');

    cards.forEach((card: any) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        },
      );
    });
  }, []);

  return (
    <section className="w-full px-6 md:px-12 py-24 bg-bg-primary text-text-primary">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <div>
          <h2 className="text-sm font-mono tracking-widest uppercase mb-4 opacity-50">02 // Selected Works</h2>
          <h3 className="text-4xl md:text-5xl font-serif italic">Signature Studies</h3>
        </div>
        <p className="text-text-secondary max-w-sm mt-6 md:mt-0">
          A collection of digital worlds engineered with motion and tension.
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card group relative aspect-[4/5] overflow-hidden bg-black/5 dark:bg-white/5 rounded-sm cursor-none"
            data-cursor="view"
          >
            {/* Video Background (scrubs on hover implicitly via CSS or play on hover) */}
            <video
              src={project.videoSrc}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 clip-reveal group-hover:clip-unveil"
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
              onMouseLeave={(e) => {
                const v = e.target as HTMLVideoElement;
                v.pause();
                v.currentTime = 0; // Reset scrub
              }}
            />

            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="text-white">
                <p className="font-mono text-xs mb-2 opacity-80">{String(project.id).padStart(2, '0')}</p>
                <h4 className="text-2xl font-medium tracking-tight">{project.title}</h4>
                <p className="text-sm font-serif italic text-white/80">{project.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
