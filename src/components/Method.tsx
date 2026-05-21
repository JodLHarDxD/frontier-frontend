import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GifWord } from './GifWord';

gsap.registerPlugin(ScrollTrigger);

const images = [
  '/media/images/pexels/pexels_1.jpg',
  '/media/images/pexels/pexels_2.jpg',
  '/media/images/pexels/pexels_3.jpg',
  '/media/images/pexels/pexels_4.jpg',
  '/media/images/pexels/pexels_5.jpg',
  '/media/images/pexels/pexels_6.jpg',
  '/media/images/pexels/pexels_7.jpg',
  '/media/images/pexels/pexels_8.jpg',
];

interface BurstImage {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
}

export const Method: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const reactRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLSpanElement>(null);
  const [burstImages, setBurstImages] = useState<BurstImage[]>([]);
  const burstCount = useRef(0);
  const reactIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const words = textRef.current.querySelectorAll('.animate-word');
    gsap.fromTo(
      words,
      { opacity: 0.1, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          end: 'bottom 50%',
          scrub: true,
        },
      },
    );
  }, []);

  const spawnSingle = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setBurstImages((prev) => [
      ...prev.slice(-16),
      {
        id: burstCount.current++,
        src: images[Math.floor(Math.random() * images.length)],
        x: cx + (Math.random() * 120 - 60),
        y: cy + (Math.random() * 80 - 40),
        rotation: Math.random() * 40 - 20,
      },
    ]);
  }, []);

  const startBurst = useCallback((el: HTMLElement, intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
    if (intervalRef.current) return;
    spawnSingle(el);
    intervalRef.current = setInterval(() => spawnSingle(el), 400);
  }, [spawnSingle]);

  const stopBurst = useCallback((intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleReactActiveChange = useCallback((active: boolean) => {
    if (!reactRef.current) return;
    if (active) startBurst(reactRef.current, reactIntervalRef);
    else stopBurst(reactIntervalRef);
  }, [startBurst, stopBurst]);

  const handleRevealActiveChange = useCallback((active: boolean) => {
    if (!revealRef.current) return;
    if (active) startBurst(revealRef.current, revealIntervalRef);
    else stopBurst(revealIntervalRef);
  }, [startBurst, stopBurst]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (reactIntervalRef.current) clearInterval(reactIntervalRef.current);
      if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
    };
  }, []);

  return (
    <section
      id="method"
      className="w-full min-h-[80vh] flex flex-col justify-center px-6 md:px-24 py-32 bg-bg-primary text-text-primary border-t border-text-primary/10 relative z-20 transition-colors duration-300"
    >
      {/* Burst Images Layer — fixed position, unaffected by section overflow */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {burstImages.map((img) => (
            <motion.img
              key={img.id}
              src={img.src}
              initial={{ opacity: 0, scale: 0.5, x: img.x - 70, y: img.y - 87, rotate: img.rotation - 15 }}
              animate={{ opacity: 0.7, scale: 0.8, y: img.y - 300, x: img.x - 70 + (Math.random() * 80 - 40), rotate: img.rotation }}
              exit={{ opacity: 0, scale: 0.6, y: img.y - 300, transition: { duration: 0.35 } }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.4] }}
              onAnimationComplete={() => setBurstImages((prev) => prev.filter((p) => p.id !== img.id))}
              className="absolute w-[140px] h-[175px] object-cover rounded-xl shadow-2xl border border-white/20"
              style={{ willChange: 'transform, opacity' }}
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary mb-16 animate-word">
        01 // Method
      </p>

      <div ref={textRef} className="text-4xl md:text-7xl font-serif italic max-w-6xl leading-[1.1] tracking-tight">
        {'Not just pages. A portfolio should '.split(' ').map((word, i) => (
          <span key={`w1-${i}`} className="animate-word inline-block mr-[0.25em]">
            {word}
          </span>
        ))}

        {/* Outer span: position ref only — NO scroll-highlight so ::before never covers GIF */}
        <span ref={reactRef} className="animate-word inline-block mr-[0.25em] font-sans font-bold not-italic relative z-50">
          <GifWord
            word="react,"
            gifUrl="/media/gifs/method_react.gif"
            className="text-[#3EE6A6] scroll-highlight"
            onActiveChange={handleReactActiveChange}
          />
        </span>

        {'fold, stretch, and '.split(' ').map((word, i) => (
          <span key={`w2-${i}`} className="animate-word inline-block mr-[0.25em]">
            {word}
          </span>
        ))}

        <span ref={revealRef} className="animate-word inline-block mr-[0.25em] font-sans font-bold not-italic relative z-50">
          <GifWord
            word="reveal"
            gifUrl="/media/gifs/method_reveal.gif"
            className="text-[#FF3366] scroll-highlight"
            onActiveChange={handleRevealActiveChange}
          />
        </span>

        {' the next thought with a little tension. We build digital worlds that earn the dark.'
          .split(' ')
          .map((word, i) => (
            <span key={`w3-${i}`} className="animate-word inline-block mr-[0.25em]">
              {word}
            </span>
          ))}
      </div>
    </section>
  );
};
