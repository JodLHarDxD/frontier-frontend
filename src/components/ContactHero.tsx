import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const ContactHero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center overflow-hidden">
      <style>{`
        @keyframes contact-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* 900px accent spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-mint/10 dark:bg-mint/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <p className="font-mono uppercase tracking-widest text-mint mb-8">[ 05 // Initializing connection ]</p>

        <h1 className="text-6xl md:text-[8rem] font-bold font-sans tracking-tighter leading-[0.9] mb-8 select-none">
          <span className="scroll-highlight">LET'S</span> <br />
          <span className="scroll-highlight outline-style">CONNECT</span>
        </h1>

        <p className="text-xl md:text-3xl text-text-secondary max-w-2xl mb-16 font-serif italic">
          Got a project that needs an architect? Or just want to say hi?
        </p>

        {/* Say Hello Button with animated RGB border gradient */}
        <a
          href="mailto:hello@jodl.dev"
          className="group relative inline-flex items-center gap-4 bg-text-primary text-bg-primary px-10 py-5 rounded-full text-xl font-medium overflow-visible"
          data-cursor="view"
        >
          {/* Animated RGB border gradient */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              padding: '2px',
              background: 'linear-gradient(135deg, #c8ff2d, #3b82f6, #ec4899, #c8ff2d)',
              backgroundSize: '300% 300%',
              animation: 'contact-gradient-shift 2.5s ease infinite',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          <span className="relative z-10">Say Hello</span>
          <ArrowUpRight className="relative z-10 group-hover:rotate-45 transition-transform duration-300" size={24} />
          <div className="absolute inset-0 bg-mint translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
        </a>
      </div>
    </section>
  );
};
