import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PAGE_ORDER = [
  { path: '/', name: 'Home', label: 'Intro', teaser: 'Where it all begins' },
  { path: '/work', name: 'Work', label: 'Selected Works', teaser: 'See what I built' },
  { path: '/lab', name: 'Lab', label: 'Experiments', teaser: 'Chaos meets code' },
  { path: '/motion', name: 'Motion', label: 'Animation', teaser: 'Things that move' },
  { path: '/contact', name: 'Contact', label: 'Get In Touch', teaser: 'Let\'s make it happen' },
];

const BridgeButton: React.FC<{
  page: typeof PAGE_ORDER[0];
  direction: 'prev' | 'next';
  onNavigate: (path: string) => void;
}> = ({ page, direction, onNavigate }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [mouseX, setMouseX] = useState(0.5);

  const isPrev = direction === 'prev';

  // Scroll-triggered entrance animation
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMouseX((e.clientX - rect.left) / rect.width);
  };

  return (
    <button
      ref={btnRef}
      onClick={() => onNavigate(page.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouseX(0.5); }}
      onMouseMove={handleMouseMove}
      className={`flex-1 group relative py-20 md:py-28 px-6 md:px-12 flex flex-col ${
        isPrev ? 'items-start text-left' : 'items-end text-right'
      } justify-center cursor-pointer w-full overflow-hidden transition-all duration-500`}
    >
      {/* Animated gradient background sweep on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          background: isPrev
            ? `radial-gradient(ellipse at ${mouseX * 100}% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)`
            : `radial-gradient(ellipse at ${mouseX * 100}% 50%, rgba(200, 255, 45, 0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Massive ghost watermark text - slides in from the side */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 text-[18vw] font-black uppercase whitespace-nowrap select-none font-heading pointer-events-none transition-all duration-1000 ease-out ${
          inView
            ? 'opacity-[0.03] translate-x-0'
            : isPrev
              ? 'opacity-0 -translate-x-full'
              : 'opacity-0 translate-x-full'
        }`}
        style={{
          [isPrev ? 'left' : 'right']: '-5%',
          WebkitTextStroke: '1px currentColor',
          color: 'transparent',
        }}
      >
        {page.name}
      </div>

      {/* Animated pulsing line - beckoning indicator */}
      <div
        className={`absolute ${isPrev ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-1 transition-all duration-700`}
        style={{
          height: hovered ? '70%' : '0%',
          background: isPrev
            ? 'linear-gradient(180deg, transparent, #3b82f6, transparent)'
            : 'linear-gradient(180deg, transparent, #c8ff2d, transparent)',
          boxShadow: isPrev
            ? '0 0 12px rgba(59, 130, 246, 0.5)'
            : '0 0 12px rgba(200, 255, 45, 0.5)',
        }}
      />

      {/* Direction label with animated arrow */}
      <span
        className={`font-mono text-xs uppercase tracking-[0.25em] opacity-40 mb-6 flex items-center gap-3 transition-all duration-500 ${
          inView ? 'translate-y-0 opacity-40' : 'translate-y-4 opacity-0'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        {isPrev && (
          <svg width="16" height="16" viewBox="0 0 16 16" className={`transition-transform duration-500 ${hovered ? '-translate-x-3' : ''}`}>
            <path d="M10 2L4 8L10 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {isPrev ? 'Go Back' : 'Continue Journey'}
        {!isPrev && (
          <svg width="16" height="16" viewBox="0 0 16 16" className={`transition-transform duration-500 ${hovered ? 'translate-x-3' : ''}`}>
            <path d="M6 2L12 8L6 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>

      {/* Page name - the hero text */}
      <h4
        className={`font-heading text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-normal leading-none transition-all duration-700 ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        } ${hovered ? (isPrev ? 'text-blue-500' : 'text-[#c8ff2d]') : 'text-text-primary'}`}
        style={{ transitionDelay: '350ms' }}
      >
        {page.name}
      </h4>

      {/* Teaser text - the intrigue hook */}
      <p
        className={`font-serif italic text-sm md:text-base mt-4 transition-all duration-700 ${
          hovered ? 'opacity-80 translate-y-0 max-h-12' : 'opacity-0 translate-y-2 max-h-0'
        }`}
        style={{ overflow: 'hidden' }}
      >
        {page.teaser}
      </p>

      {/* Label pill */}
      <span
        className={`font-mono text-[10px] tracking-[0.2em] uppercase mt-3 px-3 py-1 rounded-full border transition-all duration-700 ${
          inView ? 'translate-y-0 opacity-35' : 'translate-y-4 opacity-0'
        } ${hovered ? 'border-text-primary/20 opacity-60' : 'border-text-primary/5'}`}
        style={{ transitionDelay: '500ms' }}
      >
        {page.label}
      </span>

      {/* Bottom edge shimmer line on hover */}
      <div
        className={`absolute bottom-0 ${isPrev ? 'left-0' : 'right-0'} h-px transition-all duration-700 ease-out`}
        style={{
          width: hovered ? '100%' : '0%',
          background: isPrev
            ? 'linear-gradient(90deg, #3b82f6, transparent)'
            : 'linear-gradient(270deg, #c8ff2d, transparent)',
        }}
      />
    </button>
  );
};

export const NextPageBridge: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTransitioning = React.useRef(false);

  // Hide page bridge on contact page (final footer is the end of the journey)
  if (location.pathname === '/contact') return null;

  const currentIndex = PAGE_ORDER.findIndex((page) => page.path === location.pathname);

  if (currentIndex === -1) return null;

  const prevPage = currentIndex > 0 ? PAGE_ORDER[currentIndex - 1] : null;
  const nextPage = currentIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[currentIndex + 1] : null;

  if (!prevPage && !nextPage) return null;

  const triggerTransition = (targetPath: string) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    // Fire custom page transition event
    window.dispatchEvent(
      new CustomEvent('pageFlipTransition', {
        detail: { targetPath },
      }),
    );

    setTimeout(() => {
      navigate(targetPath);
      window.scrollTo(0, 0);
      isTransitioning.current = false;
    }, 1200); // wipe hold duration
  };

  return (
    <div className="w-full border-t border-text-primary/10 bg-bg-primary text-text-primary overflow-hidden relative z-20">
      <div className="flex flex-col md:flex-row w-full divide-y md:divide-y-0 md:divide-x divide-text-primary/10">
        {/* Previous Page */}
        {prevPage ? (
          <BridgeButton page={prevPage} direction="prev" onNavigate={triggerTransition} />
        ) : (
          <div className="flex-1 hidden md:block" />
        )}

        {/* Next Page */}
        {nextPage ? (
          <BridgeButton page={nextPage} direction="next" onNavigate={triggerTransition} />
        ) : (
          <div className="flex-1 hidden md:block" />
        )}
      </div>
    </div>
  );
};
