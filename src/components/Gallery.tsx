import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  '/media/images/pexels/pexels_1.jpg',
  '/media/images/pexels/pexels_4.jpg',
  '/media/images/pexels/pexels_9.jpg',
  '/media/images/pexels/pexels_12.jpg',
  '/media/images/pexels/pexels_10.jpg',
];

export const Gallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && stripRef.current) {
      gsap.to(stripRef.current, {
        x: () => -(stripRef.current!.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=150%',
        },
      });
    }
  }, []);

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-bg-primary flex items-center"
    >
      <div ref={stripRef} className="flex gap-8 px-12 h-[60vh] md:h-[70vh]">
        <div className="flex-shrink-0 w-[30vw] h-full flex flex-col justify-center mr-12">
          <p className="font-mono text-sm uppercase tracking-widest opacity-50 mb-4">05 // Fragments</p>
          <h2 className="text-4xl md:text-6xl font-serif italic text-text-primary">Visual tension & contrast.</h2>
        </div>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Gallery ${i}`}
            className="h-full w-auto aspect-[3/4] object-cover rounded-sm shadow-2xl"
          />
        ))}
      </div>
    </section>
  );
};
