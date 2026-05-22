import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const ContactHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const letRef = useRef<HTMLSpanElement>(null);
  const connectRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const sectionLabelRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isInSection, setIsInSection] = useState(false);

  // Calculate distance from cursor to the center of an element
  const getDistanceToElement = useCallback(
    (el: HTMLElement | null) => {
      if (!el || !isInSection) return Infinity;
      const rect = el.getBoundingClientRect();
      // Use closest-edge distance for better UX
      const dx = Math.max(rect.left - mousePos.x, 0, mousePos.x - rect.right);
      const dy = Math.max(rect.top - mousePos.y, 0, mousePos.y - rect.bottom);
      return Math.sqrt(dx * dx + dy * dy);
    },
    [mousePos, isInSection]
  );

  // Proximity factor: 0 (far) to 1 (on top)
  const getProximity = useCallback(
    (el: HTMLElement | null, radius = 300) => {
      const dist = getDistanceToElement(el);
      if (dist >= radius) return 0;
      return 1 - dist / radius;
    },
    [getDistanceToElement]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const inSection =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        setIsInSection(inSection);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const letProx = getProximity(letRef.current, 350);
  const connectProx = getProximity(connectRef.current, 350);
  const subtitleProx = getProximity(subtitleRef.current, 300);
  const labelProx = getProximity(sectionLabelRef.current, 300);
  const btnProx = getProximity(btnRef.current, 250);

  // Gradient text style when near cursor
  const gradientTextStyle = (prox: number): React.CSSProperties => {
    if (prox <= 0) return {};
    return {
      background: `linear-gradient(135deg, #c8ff2d, #a8e600, #e0ff73)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      opacity: 1,
      transition: 'all 0.3s ease',
      filter: `drop-shadow(0 0 ${prox * 20}px rgba(200, 255, 45, ${prox * 0.4}))`,
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center overflow-hidden"
    >
      <style>{`
        @keyframes contact-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes contact-btn-glow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(200, 255, 45, 0.2), 0 0 30px rgba(59, 130, 246, 0.1);
          }
          33% {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.3), 0 0 30px rgba(236, 72, 153, 0.15);
          }
          66% {
            box-shadow: 0 0 15px rgba(236, 72, 153, 0.3), 0 0 30px rgba(200, 255, 45, 0.15);
          }
        }
      `}</style>

      {/* 900px accent spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-mint/10 dark:bg-mint/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Cursor-following gradient glow */}
      {isInSection && (
        <div
          className="absolute pointer-events-none z-0"
          style={{
            left: mousePos.x - (sectionRef.current?.getBoundingClientRect().left ?? 0),
            top: mousePos.y - (sectionRef.current?.getBoundingClientRect().top ?? 0),
            width: '500px',
            height: '500px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(200,255,45,0.06) 0%, rgba(200,255,45,0) 70%)',
            transition: 'left 0.1s ease-out, top 0.1s ease-out',
          }}
        />
      )}

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <p
          ref={sectionLabelRef}
          className="font-mono uppercase tracking-widest mb-8 transition-all duration-300"
          style={
            labelProx > 0
              ? {
                  ...gradientTextStyle(labelProx),
                }
              : { color: 'var(--mint)' }
          }
        >
          [ 05 // Initializing connection ]
        </p>

        <h1 className="text-6xl md:text-[8rem] font-bold font-sans tracking-tighter leading-[0.9] mb-8 select-none">
          <span
            ref={letRef}
            className="scroll-highlight inline-block transition-all duration-300"
            style={
              letProx > 0
                ? {
                    ...gradientTextStyle(letProx),
                    transform: `scale(${1 + letProx * 0.03})`,
                  }
                : {}
            }
          >
            LET'S
          </span>{' '}
          <br />
          <span
            ref={connectRef}
            className="inline-block transition-all duration-300"
            style={
              connectProx > 0
                ? {
                    background: `linear-gradient(135deg, #c8ff2d, #a8e600, #e0ff73)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transform: `scale(${1 + connectProx * 0.03})`,
                    filter: `drop-shadow(0 0 ${connectProx * 30}px rgba(200, 255, 45, ${connectProx * 0.5}))`,
                    transition: 'all 0.3s ease',
                  }
                : {
                    WebkitTextStroke: '1px var(--text-primary)',
                    color: 'transparent',
                    transition: 'all 0.3s ease',
                  }
            }
          >
            CONNECT
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-3xl max-w-2xl mb-16 font-serif italic transition-all duration-300"
          style={
            subtitleProx > 0
              ? {
                  color: 'var(--text-primary)',
                  textShadow: `0 0 ${subtitleProx * 15}px rgba(200, 255, 45, ${subtitleProx * 0.3})`,
                }
              : { color: 'var(--text-secondary)' }
          }
        >
          Got a project that needs an architect? Or just want to say hi?
        </p>

        {/* Say Hello Button with RGB border gradient on proximity */}
        <a
          ref={btnRef}
          href="mailto:hello@jodl.dev"
          className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full text-xl font-medium overflow-visible"
          data-cursor="view"
          style={{
            background: btnProx > 0.3 ? 'transparent' : 'var(--text-primary)',
            color: btnProx > 0.3 ? 'var(--text-primary)' : 'var(--bg-primary)',
            transition: 'all 0.4s ease',
          }}
        >
          {/* Animated RGB border gradient */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500"
            style={{
              opacity: btnProx > 0 ? Math.min(btnProx * 2, 1) : 0,
              padding: '2px',
              background: 'linear-gradient(135deg, #c8ff2d, #3b82f6, #ec4899, #c8ff2d)',
              backgroundSize: '300% 300%',
              animation: btnProx > 0 ? 'contact-gradient-shift 2.5s ease infinite' : 'none',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          {/* Glow effect */}
          {btnProx > 0.2 && (
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                animation: 'contact-btn-glow 3s ease-in-out infinite',
                opacity: btnProx,
              }}
            />
          )}
          <span className="relative z-10">Say Hello</span>
          <ArrowUpRight
            className="relative z-10 group-hover:rotate-45 transition-transform duration-300"
            size={24}
          />
          <div className="absolute inset-0 bg-mint translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
        </a>
      </div>
    </section>
  );
};
