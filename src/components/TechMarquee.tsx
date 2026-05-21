import React from 'react';

const techTop = ['REACT', 'THREE.JS', 'TAILWIND', 'GSAP', 'VITE', 'TYPESCRIPT', 'FRAMER'];
const techBottom = ['NODE.JS', 'WEBGL', 'SHIKI', 'LENIS', 'FIGMA', 'NEXT.JS', 'VERCEL'];

export const TechMarquee: React.FC = () => {
  return (
    <section id="tech" className="w-full py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col gap-6 md:gap-8 transform rotate-2 scale-110 origin-center">
        {/* Top Row - Moving Right to Left */}
        <div className="flex w-fit whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 md:gap-6 pr-4 md:pr-6 items-center">
              {techTop.map((tech, j) => (
                <span
                  key={j}
                  className="text-5xl md:text-8xl font-black font-sans tracking-tighter text-[#10100E] px-6 py-2 md:px-12 md:py-5 select-none transition-colors duration-300"
                  style={{ backgroundColor: 'var(--marquee-bg)' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Row - Moving Left to Right */}
        <div className="flex w-fit whitespace-nowrap animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 md:gap-6 pr-4 md:pr-6 items-center">
              {techBottom.map((tech, j) => (
                <span
                  key={j}
                  className="text-5xl md:text-8xl font-black font-sans tracking-tighter text-[#10100E] px-6 py-2 md:px-12 md:py-5 select-none transition-colors duration-300"
                  style={{ backgroundColor: 'var(--marquee-bg)' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
