import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform, MotionValue } from 'framer-motion';

const TrailDot = ({
  index,
  mouseX,
  mouseY,
  opacity,
}: {
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  opacity: any;
}) => {
  const springX = useSpring(mouseX, { stiffness: 400 - index * 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 400 - index * 40, damping: 25 });

  useEffect(() => {
    const unsubscribeX = mouseX.on('change', (latest: number) => {
      springX.set(latest - 4);
    });
    const unsubscribeY = mouseY.on('change', (latest: number) => {
      springY.set(latest - 4);
    });
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, springX, springY]);

  // Combine standard opacity control with baseline trail transparency (0.3)
  const dotOpacity = useTransform(opacity, (v: number) => Number(v) * 0.3);

  return (
    <motion.div
      className="absolute w-2 h-2 bg-white rounded-full"
      style={{ x: springX, y: springY, scale: 1 - index * 0.1, opacity: dotOpacity }}
    />
  );
};

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDarkSpace, setIsDarkSpace] = useState(false);
  const [label, setLabel] = useState('');
  const [videoReel, setVideoReel] = useState<string | null>(null);
  const [gifCursor, setGifCursor] = useState<string | null>(null);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const cursorX = useSpring(rawMouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(rawMouseY, { stiffness: 500, damping: 28 });

  const ringX = useSpring(rawMouseX, { stiffness: 200, damping: 20 });
  const ringY = useSpring(rawMouseY, { stiffness: 200, damping: 20 });

  const gifX = useSpring(rawMouseX, { stiffness: 450, damping: 25 });
  const gifY = useSpring(rawMouseY, { stiffness: 450, damping: 25 });

  const floatX = useMotionValue(0);
  const floatY = useMotionValue(0);

  // Figure-eight / infinity sign floating animation loop
  useEffect(() => {
    let animId: number;
    let t = 0;
    const tick = () => {
      t += 0.025; // Smooth speed of floating
      const ampX = 14; // Horizontal swing amplitude
      const ampY = 7; // Vertical swing amplitude (half of horizontal)

      // Parametric infinity sign path: x = A * cos(t), y = B * sin(2t)
      floatX.set(ampX * Math.cos(t));
      floatY.set(ampY * Math.sin(2 * t));

      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [floatX, floatY]);

  // Combine springs and floating offsets dynamically
  const combinedGifX = useTransform([gifX, floatX], (latest) => Number(latest[0]) + Number(latest[1]));
  const combinedGifY = useTransform([gifY, floatY], (latest) => Number(latest[0]) + Number(latest[1]));

  // Proximity-sensitive physics
  const avoidRects = useRef<DOMRect[]>([]);
  const opacityValue = useMotionValue(0);
  const opacitySpring = useSpring(opacityValue, { stiffness: 120, damping: 24 });



  // Cross-fade high-precision trails when the statue becomes transparent
  const standardOpacity = useTransform(opacitySpring, [0, 0.22, 1.0], [1, 1, 0]);

  const checkIsDarkBackground = useCallback((el: HTMLElement | null): boolean => {
    if (!el) return false;

    // 1. Check global dark theme — source of truth is the .dark class, not URL
    if (document.documentElement.classList.contains('dark')) return true;

    // 2. Traverse parent elements to check for black backgrounds
    let current: HTMLElement | null = el;
    while (current && current !== document.body) {
      const className = current.className || '';
      if (typeof className === 'string') {
        if (
          className.includes('bg-[#050505]') ||
          className.includes('bg-[#0a0a0a]') ||
          className.includes('bg-[#0A0A0A]') ||
          className.includes('bg-black') ||
          className.includes('bg-neutral-900') ||
          className.includes('bg-zinc-950')
        ) {
          return true;
        }
      }

      const bgStyle = current.style.backgroundColor;
      if (
        bgStyle &&
        (bgStyle.includes('rgb(5') ||
          bgStyle.includes('rgb(10') ||
          bgStyle.includes('rgb(0') ||
          bgStyle.includes('black') ||
          bgStyle.includes('#05') ||
          bgStyle.includes('#0a') ||
          bgStyle.includes('#00'))
      ) {
        return true;
      }
      current = current.parentElement;
    }

    return false;
  }, []);

  const isElementBlankBackground = useCallback((el: HTMLElement | null): boolean => {
    if (!el) return false;

    // Helper to check if tag is a text, media, interactive or list element
    const isTextOrMediaTag = (tagName: string) => {
      const tags = [
        'p',
        'span',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'a',
        'button',
        'img',
        'video',
        'canvas',
        'svg',
        'path',
        'li',
        'ul',
        'ol',
        'code',
        'pre',
        'input',
        'label',
        'textarea',
        'strong',
        'em',
        'i',
        'b',
        'u',
        'figcaption',
        'figure',
        'td',
        'th',
        'tr',
        'table',
        'dt',
        'dd',
        'article',
        'aside',
        'details',
        'summary',
        'header',
        'footer',
        'nav',
        'blockquote',
        'cite',
        'mark',
        'small',
        'sub',
        'sup',
        'time',
        'address',
        'ins',
        'del',
        'iframe',
        'object',
        'embed',
      ];
      return tags.includes(tagName.toLowerCase());
    };

    // Helper to check if string contains components keywords
    const hasComponentKeyword = (str: string) => {
      const keywords = [
        'card',
        'tile',
        'project',
        'button',
        'nav',
        'menu',
        'header',
        'footer',
        'swarm',
        'marquee',
        'terminal',
        'video',
        'image',
        'panel',
        'preloader',
        'grid',
        'showcase',
        'badge',
        'interactive',
        'logo',
        'social',
        'vhs',
        'experience',
        'lamp',
        'glow',
        'pill',
        'tag',
        'link',
      ];
      const lower = str.toLowerCase();
      return keywords.some((kw) => lower.includes(kw));
    };

    // 1. Check tag of target element itself
    const tag = el.tagName.toLowerCase();
    if (isTextOrMediaTag(tag)) {
      return false;
    }

    // 2. Check direct text content of target element
    let hasDirectText = false;
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text && text.length > 0) {
          hasDirectText = true;
        }
      }
    });
    if (hasDirectText) return false;

    // 3. Check target computed styles (cursor type)
    try {
      const style = window.getComputedStyle(el);
      if (
        style.cursor === 'pointer' ||
        style.cursor === 'text' ||
        el.style.cursor === 'pointer' ||
        el.style.cursor === 'text'
      ) {
        return false;
      }
    } catch (e) {}

    // 4. Traverse parent tree up to body to check for wrapper cards/containers
    let current: HTMLElement | null = el;
    let depth = 0;
    while (current && current !== document.body && depth < 8) {
      const parentTag = current.tagName.toLowerCase();
      if (isTextOrMediaTag(parentTag)) {
        return false;
      }

      // Check computed cursor style on ancestors
      try {
        const style = window.getComputedStyle(current);
        if (style.cursor === 'pointer' || style.cursor === 'text') {
          return false;
        }
      } catch (e) {}

      // Check for component-level classes/IDs that represent text panels or media blocks
      const className = typeof current.className === 'string' ? current.className : '';
      const id = current.id || '';
      if (hasComponentKeyword(className) || hasComponentKeyword(id)) {
        return false;
      }

      // 3D floating perspective container detection
      if (current.getAttribute('style')?.includes('perspective') || className.includes('shadow-2xl')) {
        return false;
      }

      current = current.parentElement;
      depth++;
    }

    return true;
  }, []);

  // Update proximity rectangles inside viewport
  useEffect(() => {
    const updateRects = () => {
      // Sensitive ONLY to words, text, media, buttons, inputs, labels, and links
      const selectors = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'a',
        'button',
        'img',
        'video',
        'canvas',
        'svg',
        'li',
        'code',
        'pre',
        'input',
        'label',
        'textarea',
        'strong',
        'em',
        'i',
        'b',
        'u',
        'figcaption',
      ];

      try {
        const elements = document.querySelectorAll(selectors.join(', '));
        const rects: DOMRect[] = [];

        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            if (
              rect.bottom >= 0 &&
              rect.top <= window.innerHeight &&
              rect.right >= 0 &&
              rect.left <= window.innerWidth
            ) {
              rects.push(rect);
            }
          }
        });

        avoidRects.current = rects;
      } catch (e) {}
    };

    updateRects();

    window.addEventListener('scroll', updateRects, { passive: true });
    window.addEventListener('resize', updateRects, { passive: true });

    const interval = setInterval(updateRects, 1000);

    return () => {
      window.removeEventListener('scroll', updateRects);
      window.removeEventListener('resize', updateRects);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      const target = e.target as HTMLElement;

      rawMouseX.set(mx);
      rawMouseY.set(my);

      cursorX.set(mx - 4);
      cursorY.set(my - 4);

      if (isHovering) {
        ringX.set(mx - 40);
        ringY.set(my - 40);
      } else {
        ringX.set(mx - 20);
        ringY.set(my - 20);
      }

      gifX.set(mx);
      gifY.set(my);

      // Check state for blank/dark space dynamically
      const isDark = checkIsDarkBackground(target);
      const isBlank = isElementBlankBackground(target);
      const hoverElement = target?.closest('[data-cursor]');
      const reelElement = target?.closest('[data-cursor-video]');
      const hasSpecialHover = !!(hoverElement || reelElement);

      setIsDarkSpace(isDark);

      const isActive = isDark && !hasSpecialHover;

      const calcProximityOpacity = (minDist: number) => {
        const MIN_OPACITY = 0.22;
        const MAX_OPACITY = 1.0;
        const fadeRadius = 180;
        if (minDist < fadeRadius) {
          const ratio = minDist / fadeRadius;
          return MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * Math.sin((ratio * Math.PI) / 2);
        }
        return MAX_OPACITY;
      };

      const getMinDistance = () => {
        if (!isBlank) return 0;
        let minDistance = 999999;
        const rects = avoidRects.current;
        for (let i = 0; i < rects.length; i++) {
          const rect = rects[i];
          const dx = Math.max(rect.left - mx, 0, mx - rect.right);
          const dy = Math.max(rect.top - my, 0, my - rect.bottom);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance) minDistance = dist;
        }
        return minDistance;
      };

      if (!isActive) {
        opacityValue.set(0);
      } else {
        opacityValue.set(calcProximityOpacity(getMinDistance()));
      }

    };

    const mouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverElement = target.closest('[data-cursor]');
      const reelElement = target.closest('[data-cursor-video]');
      const gifCursorElement = target.closest('[data-cursor-gif]');

      if (hoverElement) {
        setIsHovering(true);
        setLabel(hoverElement.getAttribute('data-cursor') || '');
      } else {
        setIsHovering(false);
        setLabel('');
      }

      if (reelElement) {
        setIsHovering(true);
        setVideoReel(reelElement.getAttribute('data-cursor-video'));
      } else {
        setVideoReel(null);
      }

      if (gifCursorElement) {
        setGifCursor(gifCursorElement.getAttribute('data-cursor-gif'));
      } else {
        setGifCursor(null);
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', mouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', mouseOver);
    };
  }, [
    cursorX,
    cursorY,
    ringX,
    ringY,
    gifX,
    gifY,
    isHovering,
    rawMouseX,
    rawMouseY,
    checkIsDarkBackground,
    isElementBlankBackground,
  ]);

  // The statue cursor is active in dark space and when not in custom hover mode (special reels/labels)
  const showStatue = isDarkSpace && !isHovering && !gifCursor;
  const showLogo = !isDarkSpace && !isHovering && !gifCursor;

  return (
    <>
      {/* Blend layer for high contrast cursor points */}
      <div className="pointer-events-none fixed inset-0 w-full h-full z-[9998] overflow-hidden mix-blend-difference">
        {!isHovering && !gifCursor &&
          Array.from({ length: 8 }).map((_, index) => (
            <TrailDot key={index} index={index} mouseX={rawMouseX} mouseY={rawMouseY} opacity={standardOpacity} />
          ))}

        <motion.div
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{ x: cursorX, y: cursorY, opacity: isHovering || gifCursor ? 0 : standardOpacity }}
        />

        <motion.div
          className="absolute rounded-full border border-white flex items-center justify-center overflow-hidden"
          style={{ x: ringX, y: ringY, opacity: isHovering && !gifCursor ? 1 : (gifCursor ? 0 : standardOpacity) }}
          animate={{
            width: isHovering ? 80 : 40,
            height: isHovering ? 80 : 40,
            backgroundColor: isHovering ? '#ffffff' : 'transparent',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {isHovering && !videoReel && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-mono text-black uppercase z-10 font-bold"
            >
              {label}
            </motion.span>
          )}

          {videoReel && isHovering && (
            <motion.video src={videoReel} autoPlay loop muted className="w-full h-full object-cover absolute inset-0" />
          )}
        </motion.div>
      </div>

      {/* Solid rendering layer for true color statue GIF cursor (dark mode) */}
      <div className="pointer-events-none fixed inset-0 w-full h-full z-[9999] overflow-hidden">
        <motion.img
          src="/media/gifs/statue_artwork.gif"
          alt="Statue Artwork Cursor"
          className="absolute object-cover rounded-2xl shadow-2xl border border-white/10"
          style={{
            width: '110px',
            height: '144px',
            x: combinedGifX,
            y: combinedGifY,
            translateX: '-50%',
            translateY: '-50%',
            opacity: opacitySpring,
          }}
          animate={{ scale: showStatue ? 1 : 0.1 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
        />

        {/* Custom GIF cursor connected to word highlight hover */}
        {gifCursor && (
          <motion.img
            src={gifCursor}
            alt="Word Hover GIF Cursor"
            className="absolute object-cover rounded-xl shadow-2xl border border-white/10"
            style={{
              width: '120px',
              height: '120px',
              x: combinedGifX,
              y: combinedGifY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          />
        )}

        {/* Logo cursor (light mode) */}
        <motion.img
          src="/media/logos/jodl_logo.png"
          alt="Logo Cursor"
          className="absolute object-contain rounded-xl shadow-lg"
          style={{
            width: '72px',
            height: '72px',
            x: combinedGifX,
            y: combinedGifY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{ scale: showLogo ? 1 : 0.1, opacity: showLogo ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
        />
      </div>
    </>
  );
};
