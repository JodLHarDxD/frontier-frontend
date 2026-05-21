import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const tiles = [
  {
    id: 1,
    title: 'NeoLeaf System',
    category: 'E-commerce Architecture',
    video: '/media/videos/projects/project_neoleaf.mp4',
  },
  {
    id: 2,
    title: 'Holocene Platform',
    category: 'Interactive Web',
    video: '/media/videos/projects/project_holocene.mp4',
  },
  {
    id: 3,
    title: 'Kinetic Identity',
    category: 'Motion Design',
    video: '/media/videos/projects/project_kinetic_identity.mp4',
  },
  {
    id: 4,
    title: 'Dark Portal',
    category: 'WebGL Experience',
    video: '/media/videos/projects/project_dark_portal.mp4',
  },
];

export const ProjectTiles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.project-tile');

    cards.forEach((card) => {
      // Reveal animation
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        },
      );

      // 3D Tilt effect
      const onMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'power2.out',
        });
      };

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);

      return () => {
        card.removeEventListener('mousemove', onMouseMove);
        card.removeEventListener('mouseleave', onMouseLeave);
      };
    });
  }, []);

  return (
    <section ref={containerRef} className="w-full py-24 px-6 md:px-12 bg-bg-primary text-text-primary">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-serif italic mb-4">Featured Environments</h2>
        <p className="text-text-secondary max-w-lg">
          Immersive digital spaces combining cinematic motion with brutalist architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="project-tile relative aspect-video overflow-hidden rounded-xl cursor-none group bg-black/10"
            data-cursor="reel"
          >
            <video
              src={tile.video}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
              onMouseLeave={(e) => {
                const v = e.target as HTMLVideoElement;
                v.pause();
                v.currentTime = 0;
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col md:flex-row justify-between items-start md:items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div>
                <p className="font-mono text-xs opacity-60 mb-2">
                  0{tile.id} // {tile.category}
                </p>
                <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">{tile.title}</h3>
              </div>
              <div className="mt-4 md:mt-0 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                EXPLORE
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
