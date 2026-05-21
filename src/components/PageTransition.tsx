import React, { useEffect, useState, useRef } from 'react';

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/work': 'Work',
  '/lab': 'Lab',
  '/motion': 'Motion',
  '/contact': 'Contact',
};

const PAGE_NUMBERS: Record<string, string> = {
  '/': '01',
  '/work': '02',
  '/lab': '03',
  '/motion': '04',
  '/contact': '05',
};

type Phase = 'idle' | 'wipe-in' | 'hold' | 'wipe-out';

export const PageTransition: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('');
  const [pageNum, setPageNum] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const addTimeout = (fn: () => void, ms: number) => {
    timeoutRef.current.push(setTimeout(fn, ms));
  };

  useEffect(() => {
    const handleFlip = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetPath = customEvent.detail?.targetPath || '/';
      setLabel(PAGE_LABELS[targetPath] || 'Next');
      setPageNum(PAGE_NUMBERS[targetPath] || '');

      clearAllTimeouts();

      // Phase 1: Wipe in (slanted polygon covers screen)
      setPhase('wipe-in');

      // Phase 2: Hold — let people read the branding
      addTimeout(() => setPhase('hold'), 1000);

      // Phase 3: Wipe out (polygon sweeps away)
      addTimeout(() => setPhase('wipe-out'), 2200);

      // Phase 4: Back to idle
      addTimeout(() => setPhase('idle'), 3200);
    };

    // Legacy vertical transition (for nav clicks etc.)
    const handleLegacy = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetId = customEvent.detail?.target;

      setLabel(targetId || '');
      setPageNum('');
      clearAllTimeouts();

      setPhase('wipe-in');
      addTimeout(() => {
        setPhase('hold');
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) target.scrollIntoView();
      }, 800);
      addTimeout(() => setPhase('wipe-out'), 1400);
      addTimeout(() => setPhase('idle'), 2200);
    };

    window.addEventListener('pageFlipTransition', handleFlip);
    window.addEventListener('triggerTransition', handleLegacy);
    return () => {
      window.removeEventListener('pageFlipTransition', handleFlip);
      window.removeEventListener('triggerTransition', handleLegacy);
      clearAllTimeouts();
    };
  }, []);

  if (phase === 'idle') return null;

  return (
    <div className={`page-transition-wipe ${phase}`} aria-hidden="true">
      {/* Branding content centered */}
      <div className="page-transition-wipe__content">
        {/* Page number */}
        {pageNum && <span className="page-transition-wipe__num">{pageNum}</span>}

        {/* Large page name */}
        <h2 className="page-transition-wipe__label">{label}</h2>

        {/* Brand mark */}
        <div className="page-transition-wipe__brand">
          <span className="page-transition-wipe__brand-line" />
          <span className="page-transition-wipe__brand-name">JODLX</span>
          <span className="page-transition-wipe__brand-line" />
        </div>

        {/* Loading indicator */}
        <div className="page-transition-wipe__dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};
