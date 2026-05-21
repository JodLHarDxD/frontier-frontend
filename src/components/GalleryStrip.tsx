import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  // Pexels images
  '/media/images/pexels/pexels_1.jpg',
  '/media/images/pexels/pexels_2.jpg',
  '/media/images/pexels/pexels_3.jpg',
  '/media/images/pexels/pexels_4.jpg',
  '/media/images/pexels/pexels_5.jpg',
  '/media/images/pexels/pexels_6.jpg',
  '/media/images/pexels/pexels_7.jpg',
  '/media/images/pexels/pexels_8.jpg',
  '/media/images/pexels/pexels_9.jpg',
  '/media/images/pexels/pexels_10.jpg',
  '/media/images/pexels/pexels_11.jpg',
  '/media/images/pexels/pexels_12.jpg',
  '/media/images/pexels/pexels_13.jpg',
  // WhatsApp images
  '/media/images/whatsapp/whatsapp_1.jpeg',
  '/media/images/whatsapp/whatsapp_2.jpeg',
  '/media/images/whatsapp/whatsapp_3.jpeg',
  '/media/images/whatsapp/whatsapp_4.jpeg',
  '/media/images/whatsapp/whatsapp_5.jpeg',
  '/media/images/whatsapp/whatsapp_6.jpeg',
  '/media/images/whatsapp/whatsapp_7.jpeg',
  '/media/images/whatsapp/whatsapp_8.jpeg',
  '/media/images/whatsapp/whatsapp_9.jpeg',
  '/media/images/whatsapp/whatsapp_10.jpeg',
  '/media/images/whatsapp/whatsapp_11.jpeg',
];

export const GalleryStrip: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && stripRef.current) {
      // Calculate total width to scroll
      const getScrollAmount = () => {
        let stripWidth = stripRef.current!.scrollWidth;
        return -(stripWidth - window.innerWidth);
      };

      const tween = gsap.to(stripRef.current, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getScrollAmount() * -1}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-bg-primary border-t border-text-primary/10 transition-colors duration-400 flex items-center py-24 relative"
    >
      <div className="absolute top-12 left-12 z-10 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-serif italic text-text-primary">
          Fragments & <br /> Memories
        </h2>
      </div>

      <div ref={stripRef} className="flex gap-6 px-12 h-[50vh] md:h-[60vh] items-center">
        {images.map((src, i) => (
          <div key={i} className="flex-shrink-0 h-full">
            <img
              src={src}
              alt={`Gallery image ${i}`}
              className="h-full w-auto aspect-[3/4] md:aspect-auto object-cover rounded-md opacity-80 hover:opacity-100 transition-opacity duration-500 hover:scale-[1.02]"
              onError={(e) => {
                // Hide broken images gracefully if not all 22 exist
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
