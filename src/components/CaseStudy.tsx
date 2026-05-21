import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { codeToHtml } from 'shiki';

gsap.registerPlugin(ScrollTrigger);

const sampleCode = `// System Architecture
function initializeMatrix() {
  const nodes = getActiveNodes();
  
  return nodes.map(node => {
    node.pulse();
    return stabilize(node);
  });
}`;

export const CaseStudy: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Generate Shiki HTML dynamically based on current theme
    codeToHtml(sampleCode, {
      lang: 'typescript',
      theme: isDark ? 'dracula' : 'github-light',
    }).then(setHighlightedCode);
  }, [isDark]);

  useEffect(() => {
    const panels = gsap.utils.toArray('.cs-panel');

    if (containerRef.current && panels.length > 0) {
      const pin = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => '+=' + (containerRef.current?.offsetWidth || window.innerWidth),
          invalidateOnRefresh: true,
        },
      });

      return () => {
        pin.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }
  }, []);

  // Force ScrollTrigger to refresh coordinates when dynamic syntax highlighted code loads to avoid layout shifts breaking pinning
  useEffect(() => {
    if (highlightedCode) {
      ScrollTrigger.refresh();
    }
  }, [highlightedCode]);

  return (
    <section
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-bg-primary text-text-primary flex items-center"
    >
      <div ref={panelRef} className="flex w-[400vw] h-full">
        {/* Panel 1: Problem */}
        <div className="cs-panel w-screen h-full flex flex-col justify-center px-12 md:px-24">
          <p className="font-mono text-sm mb-4 opacity-50 uppercase tracking-widest">Case Study 01</p>
          <h2 className="text-5xl md:text-7xl font-serif italic mb-6">The Void</h2>
          <p className="text-xl max-w-2xl text-text-secondary leading-relaxed">
            Traditional portfolios are static catalogs. The challenge was to build a reactive system that feels alive,
            shifting from pure editorial clarity to a cinematic dark mode seamlessly.
          </p>
        </div>

        {/* Panel 2: Architecture */}
        <div className="cs-panel w-screen h-full flex items-center justify-center bg-black/5 dark:bg-white/5 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg viewBox="0 0 100 100" className="w-[50vw] h-[50vw] animate-pulse">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="4 4"
              />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
          <h3 className="text-3xl font-mono relative z-10 text-text-primary">Event-Driven Motion</h3>
        </div>

        {/* Panel 3: Code */}
        <div className="cs-panel w-screen h-full flex flex-col justify-center items-center bg-bg-primary text-text-primary transition-colors duration-400">
          <div className="w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden border border-text-primary/10 bg-black/5 dark:bg-black/40 backdrop-blur-md transition-all duration-400">
            <div className="flex items-center px-4 py-3 border-b border-text-primary/10 bg-black/10 dark:bg-black/60">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="ml-4 font-mono text-xs opacity-50 text-text-primary">matrix.ts</div>
            </div>
            <div
              className="p-6 overflow-x-auto text-sm md:text-base font-mono bg-white/50 dark:bg-[#282a36]/50"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </div>
        </div>

        {/* Panel 4: Outcome */}
        <div className="cs-panel w-screen h-full flex flex-col justify-center items-end text-right px-12 md:px-24">
          <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Execution</h2>
          <p className="text-xl max-w-xl text-text-secondary leading-relaxed mb-12">
            60fps across all viewports. Zero layout shifts. A fluid experience bridging Swiss design with brutalist web
            motion.
          </p>
          <div className="flex gap-8 font-mono text-sm uppercase">
            <div>
              <span className="block opacity-50 mb-1">Lighthouse</span>
              <span className="text-mint font-bold text-2xl">100/100</span>
            </div>
            <div>
              <span className="block opacity-50 mb-1">FPS</span>
              <span className="text-mint font-bold text-2xl">60</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
