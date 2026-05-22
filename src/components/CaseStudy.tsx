import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { codeToHtml } from 'shiki';
import { Terminal as TerminalIcon, Cpu, Play } from 'lucide-react';

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
  const panel2Ref = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  const [highlightedCode, setHighlightedCode] = useState('');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [terminalText, setTerminalText] = useState('');
  const [activeMenu, setActiveMenu] = useState<'welcome' | 'runtime'>('welcome');
  const [isScanning, setIsScanning] = useState(false);

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

  // 3D Parallax Mouse Tracking relative to Panel 2
  useEffect(() => {
    const panel = panel2Ref.current;
    if (!panel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const dx = (mouseX - centerX) / centerX;
      const dy = (mouseY - centerY) / centerY;
      
      const maxRotation = 12;
      const rotX = -dy * maxRotation;
      const rotY = dx * maxRotation;
      
      if (faceRef.current) {
        faceRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.05, 1.05, 1.05)`;
      }
      if (ringsRef.current) {
        ringsRef.current.style.transform = `perspective(1000px) rotateX(${-rotX * 0.4}deg) rotateY(${-rotY * 0.4}deg) translateZ(15px)`;
      }
    };

    const handleMouseLeave = () => {
      if (faceRef.current) {
        faceRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
      if (ringsRef.current) {
        ringsRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      }
    };

    panel.addEventListener('mousemove', handleMouseMove);
    panel.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      panel.removeEventListener('mousemove', handleMouseMove);
      panel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Typewriter dialogue text effect
  useEffect(() => {
    const welcomeScript = [
      "CHLOE v4.81 // ARCHITECTURAL SYNAPSE",
      "Initializing neural core interface...",
      "Telemetry established. Connecting to JODLX matrix.",
      "\"Welcome. I am CHLOE. I coordinate the spatial heuristics and visual performance of this node. Let us analyze the structural grid.\""
    ];

    const runtimeScript = [
      "// SYSTEM DIAGNOSTICS -- ACTIVE RUNTIME",
      "ENGINE: GSAP ScrollTrigger [PINNED STATE]",
      "FPS: 60.00 [SYNCHRONIZED DIRECT-DOM DRAW]",
      "CORE RENDERING: Vite + React + TS",
      "GRID CALIBRATION: Swiss Brutalist Dynamic Grid",
      "LIGHTHOUSE METRICS: 100/100 Core Web Vitals"
    ];

    const currentScript = activeMenu === 'welcome' ? welcomeScript : runtimeScript;
    let lineIdx = 0;
    let charIdx = 0;
    let typedText = '';
    let intervalId: any;

    setTerminalText('');

    const typeChar = () => {
      if (lineIdx < currentScript.length) {
        const currentLine = currentScript[lineIdx];
        if (charIdx < currentLine.length) {
          typedText += currentLine[charIdx];
          setTerminalText(typedText + '_');
          charIdx++;
          intervalId = setTimeout(typeChar, 15);
        } else {
          typedText += '\n';
          setTerminalText(typedText);
          charIdx = 0;
          lineIdx++;
          intervalId = setTimeout(typeChar, 150);
        }
      } else {
        setTerminalText(typedText);
      }
    };

    intervalId = setTimeout(typeChar, 100);

    return () => clearTimeout(intervalId);
  }, [activeMenu]);

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2500);
  };

  return (
    <section
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-bg-primary text-text-primary flex items-center"
    >
      {/* Styles for scanline sweep and technical rings rotation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes chloe-laser-sweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes chloe-spin-cw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes chloe-spin-ccw {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
      `}} />

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
        <div 
          ref={panel2Ref}
          className="cs-panel w-screen h-full flex flex-col md:flex-row items-center justify-center bg-black/5 dark:bg-white/5 relative overflow-hidden px-8 md:px-16 lg:px-24 py-16 gap-8 md:gap-16"
        >
          {/* Sweeping Scanning Laser */}
          {isScanning && (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(200,255,45,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,255,45,0.03)_1px,transparent_1px)] bg-[size:30px_30px] z-20 pointer-events-none" />
              <div 
                className="absolute left-0 w-full h-[2px] bg-[#c8ff2d] shadow-[0_0_15px_#c8ff2d] z-30 pointer-events-none"
                style={{ animation: 'chloe-laser-sweep 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
              />
            </>
          )}

          {/* Left Column: Holographic Projection Pad */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative select-none">
            <div 
              ref={ringsRef}
              className="relative w-[260px] h-[260px] md:w-[380px] md:h-[380px] flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Concentric spinning rings */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#c8ff2d]/25 dark:text-[#c8ff2d]/35">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="0.6"
                  fill="none"
                  strokeDasharray="8 6 18 6"
                  style={{ transformOrigin: 'center', animation: 'chloe-spin-cw 25s linear infinite' }}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  fill="none"
                  strokeDasharray="2 4"
                  style={{ transformOrigin: 'center', animation: 'chloe-spin-ccw 15s linear infinite' }}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="0.4"
                  fill="none"
                  strokeDasharray="40 10"
                  style={{ transformOrigin: 'center', animation: 'chloe-spin-cw 30s linear infinite' }}
                />
                <path
                  d="M 50 2 L 50 10 M 50 90 L 50 98 M 2 50 L 10 50 M 90 50 L 98 50"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>

              {/* CHLOE Android Centerpiece */}
              <div 
                ref={faceRef}
                className="relative w-[160px] h-[160px] md:w-[240px] md:h-[240px] rounded-full overflow-hidden border-2 border-[#c8ff2d]/40 shadow-[0_0_35px_rgba(200,255,45,0.25)] bg-black transition-transform duration-300 ease-out"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                <img 
                  src="/media/images/chloe_android.png" 
                  alt="CHLOE Cybernetic Assistant" 
                  className="w-full h-full object-cover grayscale brightness-95 hover:grayscale-0 transition-all duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(200,255,45,0.06)_50%,transparent_50%)] bg-[size:100%_4px] pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#c8ff2d]/10 via-transparent to-cyan-500/10 pointer-events-none mix-blend-color-dodge" />
                <div className="absolute top-4 right-4 flex items-center justify-center">
                  <span className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75 shadow-[0_0_10px_#22c55e]" />
                  <span className="relative w-2 h-2 bg-green-500 rounded-full border border-black shadow-[0_0_5px_#22c55e]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cybernetic Dialogue terminal */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center relative z-10">
            <div className="backdrop-blur-md bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-[#c8ff2d]/30">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 mb-4 font-mono">
                <div className="flex items-center gap-2">
                  <TerminalIcon size={16} className="text-[#c8ff2d] animate-pulse" />
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-text-primary">Event-Driven Motion</h3>
                </div>
                <div className="text-[10px] bg-[#c8ff2d]/15 text-[#c8ff2d] border border-[#c8ff2d]/30 px-2 py-0.5 rounded tracking-widest uppercase">
                  ACTIVE
                </div>
              </div>

              <div className="h-[140px] md:h-[160px] overflow-y-auto mb-6 p-4 rounded-lg bg-black/40 border border-black/10 dark:border-white/5 text-xs md:text-sm font-mono text-[#c8ff2d] whitespace-pre-wrap leading-relaxed shadow-inner scrollbar-thin">
                {terminalText}
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[10px] md:text-xs">
                <button
                  onClick={() => setActiveMenu(activeMenu === 'welcome' ? 'runtime' : 'welcome')}
                  className={`flex items-center justify-center gap-2 py-3 px-2 md:px-4 rounded-lg border font-semibold cursor-pointer transition-all duration-300 ${
                    activeMenu === 'runtime'
                      ? 'bg-[#c8ff2d] text-black border-[#c8ff2d] shadow-[0_0_15px_rgba(200,255,45,0.25)]'
                      : 'bg-transparent text-text-primary border-black/10 dark:border-white/10 hover:border-[#c8ff2d] hover:text-[#c8ff2d]'
                  }`}
                >
                  <Cpu size={14} />
                  <span>[ {activeMenu === 'welcome' ? 'DIAGNOSTICS' : 'TELEMETRY'} ]</span>
                </button>
                
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className={`flex items-center justify-center gap-2 py-3 px-2 md:px-4 rounded-lg border font-semibold cursor-pointer transition-all duration-300 ${
                    isScanning
                      ? 'bg-green-500/10 text-green-500 border-green-500/30 cursor-not-allowed animate-pulse'
                      : 'bg-transparent text-[#c8ff2d] border-[#c8ff2d]/30 hover:border-[#c8ff2d] hover:bg-[#c8ff2d]/5 hover:shadow-[0_0_15px_rgba(200,255,45,0.15)]'
                  }`}
                >
                  <Play size={14} className={isScanning ? 'animate-spin' : ''} />
                  <span>[ {isScanning ? 'SCANNING...' : 'SYSTEM SCAN'} ]</span>
                </button>
              </div>
            </div>
          </div>
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

