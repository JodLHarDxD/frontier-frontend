import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const videos = [
  '/media/videos/vhs/vhs_intro_1.mp4',
  '/media/videos/vhs/vhs_intro_2.mp4',
  '/media/videos/vhs/vhs_intro_3.mp4',
  '/media/videos/vhs/vhs_intro_4.mp4',
  '/media/videos/vhs/vhs_intro_5.mp4',
  '/media/videos/vhs/vhs_intro_6.mp4',
  '/media/videos/vhs/vhs_intro_7.mp4',
  '/media/videos/vhs/vhs_intro_8.mp4',
];

export const VHSShowcase: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = gsap.utils.toArray('.vhs-item');
    items.forEach((item: any, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        },
      );
    });
  }, []);

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-bg-primary text-text-primary transition-colors duration-400 border-t border-text-primary/10">
      <div className="mb-16 text-center">
        <h2
          className="text-4xl md:text-6xl font-black uppercase tracking-widest text-transparent"
          style={{ WebkitTextStroke: '2px var(--text-primary)' }}
        >
          VHS Archive
        </h2>
        <p className="font-mono text-sm mt-4 opacity-50 uppercase tracking-[0.2em]">Raw Motion / Lo-Fi Cuts</p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((src, idx) => (
          <div
            key={idx}
            className="vhs-item relative aspect-[4/3] bg-black/5 dark:bg-white/5 border border-text-primary/10 rounded-lg overflow-hidden group cursor-crosshair"
          >
            <video
              src={src}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-normal dark:mix-blend-screen transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
              onMouseLeave={(e) => {
                const v = e.target as HTMLVideoElement;
                v.pause();
                v.currentTime = 0;
              }}
            />
            {/* VHS Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50" />

            <div className="absolute bottom-4 left-4 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              REC
            </div>
            <div className="absolute top-4 right-4 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              SP {String(idx + 1).padStart(2, '0')}:00:00
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
