import React, { useState, useRef, useEffect } from 'react';

export const Footer: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Continuously track whether the footer bottom is in view — toggles on/off
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setAtBottom(entry.isIntersecting);
      },
      {
        threshold: 0.85,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Active when hovered OR scrolled to bottom — deactivates when neither
  const isActive = isHovered || atBottom;

  return (
    <footer
      ref={footerRef}
      className="w-full min-h-[80vh] flex flex-col justify-end bg-bg-primary text-text-primary px-6 md:px-12 pb-12 overflow-hidden border-t border-border relative"
    >
      {/* Rainbow keyframes for the "Talk now." text */}
      <style>{`
        @keyframes rainbow-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .rainbow-text {
          background: linear-gradient(
            90deg,
            #ff0000,
            #ff8a00,
            #ffe600,
            #4de000,
            #00c8ff,
            #0051ff,
            #b300ff,
            #ff00aa,
            #ff0000
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow-shift 3s ease-in-out infinite;
        }
      `}</style>

      {/* Massive Typography Background */}
      <div className="absolute top-1/4 left-0 w-full overflow-hidden pointer-events-none select-none flex justify-center opacity-[0.06]">
        <h1 className="text-[12rem] md:text-[20rem] font-bold font-sans tracking-tighter leading-none whitespace-nowrap text-text-primary">
          BUILD WITH ME
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end w-full mb-12 relative z-10">
        {/* GIF Gesture Integration */}
        <div
          className="relative group mb-12 md:mb-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated GIF that slides in on hover OR at-bottom, vanishes on scroll-up */}
          <div
            className={`absolute bottom-full left-0 mb-8 transition-all duration-500 ease-out z-10 pointer-events-none w-64 md:w-96 rounded-lg overflow-hidden shadow-2xl ${
              isActive ? 'opacity-100 translate-y-0 rotate-3' : 'opacity-0 translate-y-12 rotate-0'
            }`}
          >
            <img src="/media/gifs/footer_thanks.gif" alt="Thank you gesture" className="w-full h-auto object-cover" />
          </div>

          <a
            href="mailto:hello@jodlxverse.com"
            className="flex items-center text-4xl md:text-7xl font-serif italic transition-colors relative z-20 overflow-hidden"
            data-cursor="email"
          >
            <span
              className={`inline-block transition-all duration-500 ${isActive ? 'translate-x-4 rainbow-text' : 'translate-x-0'}`}
            >
              Talk now.
            </span>
            {/* Realistic Metallic Silver Arrow */}
            <svg
              viewBox="0 0 64 64"
              className={`ml-4 w-10 h-10 md:w-16 md:h-16 transition-all duration-500 ${
                isActive ? 'translate-x-4 -translate-y-4' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Chrome / Brushed Silver base gradient */}
                <linearGradient id="silver-base" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8e8e8" />
                  <stop offset="18%" stopColor="#f8f8f8" />
                  <stop offset="35%" stopColor="#c0c0c0" />
                  <stop offset="50%" stopColor="#fafafa" />
                  <stop offset="65%" stopColor="#a8a8a8" />
                  <stop offset="82%" stopColor="#d8d8d8" />
                  <stop offset="100%" stopColor="#b0b0b0" />
                </linearGradient>

                {/* Highlight sheen — the bright hot-spot */}
                <linearGradient id="silver-sheen" x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="0.0" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>

                {/* Edge dark bevel */}
                <linearGradient id="silver-edge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8a8a8a" />
                  <stop offset="50%" stopColor="#6a6a6a" />
                  <stop offset="100%" stopColor="#9a9a9a" />
                </linearGradient>

                {/* Specular lighting filter for metallic realism */}
                <filter id="metal-light" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                  <feSpecularLighting
                    in="blur"
                    surfaceScale="6"
                    specularConstant="1.2"
                    specularExponent="35"
                    result="spec"
                  >
                    <fePointLight x="28" y="8" z="50" />
                  </feSpecularLighting>
                  <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
                  <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" />
                </filter>

                {/* Ambient silver glow */}
                <filter id="silver-glow">
                  <feGaussianBlur stdDeviation="2.5" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Shadow / depth layer */}
              <g transform="translate(2, 2)" opacity="0.15">
                <line x1="16" y1="48" x2="48" y2="16" stroke="#000" strokeWidth="5" strokeLinecap="round" />
                <polyline points="28,16 48,16 48,36" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>

              {/* Dark bevel edge (slightly offset for 3D depth) */}
              <g filter="url(#silver-glow)">
                <line x1="16" y1="48" x2="48" y2="16" stroke="url(#silver-edge)" strokeWidth="5.5" strokeLinecap="round" />
                <polyline points="28,16 48,16 48,36" stroke="url(#silver-edge)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>

              {/* Main metallic body */}
              <g filter="url(#metal-light)">
                <line x1="16" y1="48" x2="48" y2="16" stroke="url(#silver-base)" strokeWidth="4" strokeLinecap="round" />
                <polyline points="28,16 48,16 48,36" stroke="url(#silver-base)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>

              {/* Specular highlight sheen overlay */}
              <g opacity="0.55">
                <line x1="16" y1="48" x2="48" y2="16" stroke="url(#silver-sheen)" strokeWidth="2.5" strokeLinecap="round" />
                <polyline points="28,16 48,16 48,36" stroke="url(#silver-sheen)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            </svg>
          </a>
        </div>

        <div className="text-right">
          <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-2">Location</p>
          <p className="font-medium">Mumbai, India (IST)</p>
          <p className="font-mono text-sm opacity-50 uppercase tracking-widest mt-6 mb-2">Socials</p>
          <div className="flex gap-4 justify-end">
            <a href="#" className="hover:text-mint transition-colors">
              X/Twitter
            </a>
            <a href="#" className="hover:text-mint transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-mint transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-border mb-8 relative z-10" />

      <div className="flex flex-col md:flex-row justify-between items-center text-sm font-mono opacity-50 relative z-10">
        <p>&copy; {new Date().getFullYear()} JODL HARDDY. All rights reserved.</p>
        <p>Built with React, Vite, GSAP & Three.js</p>
      </div>
    </footer>
  );
};
