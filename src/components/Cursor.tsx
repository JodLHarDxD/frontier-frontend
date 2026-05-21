import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial GSAP props
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.2;

    const xSetDot = gsap.quickSetter(dot, 'x', 'px');
    const ySetDot = gsap.quickSetter(dot, 'y', 'px');
    const xSetRing = gsap.quickSetter(ring, 'x', 'px');
    const ySetRing = gsap.quickSetter(ring, 'y', 'px');

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      xSetDot(mouse.x);
      ySetDot(mouse.y);
      if (labelRef.current) {
        gsap.set(labelRef.current, { x: mouse.x, y: mouse.y, xPercent: -50, yPercent: -50 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSetRing(pos.x);
      ySetRing(pos.y);
    });

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverTarget = target.closest('[data-cursor]');

      if (hoverTarget) {
        const cursorType = hoverTarget.getAttribute('data-cursor');

        if (cursorType) {
          setLabel(cursorType);
          gsap.to(ring, { width: 80, height: 80, backgroundColor: 'var(--accent-bg)', duration: 0.3 });
          gsap.to(dot, { opacity: 0, duration: 0.2 });
          if (labelRef.current) gsap.to(labelRef.current, { opacity: 1, duration: 0.3 });
        }
      } else {
        setLabel('');
        gsap.to(ring, { width: 40, height: 40, backgroundColor: 'transparent', duration: 0.3 });
        gsap.to(dot, { opacity: 1, duration: 0.2 });
        if (labelRef.current) gsap.to(labelRef.current, { opacity: 0, duration: 0.3 });
      }
    };

    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleHover);
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring pointer-events-none" />
      <div ref={dotRef} className="cursor-dot pointer-events-none" />
      <div ref={labelRef} className="cursor-label pointer-events-none absolute z-[10000]">
        {label}
      </div>
    </>
  );
};
