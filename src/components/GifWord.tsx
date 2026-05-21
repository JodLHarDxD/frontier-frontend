import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GifWordProps {
  word: string;
  gifUrl?: string;
  className?: string;
  onHighlight?: () => void;
  onActiveChange?: (active: boolean) => void;
  isActive?: boolean;
  highlightColor?: string;
  delayOffset?: number;
  gifPosition?: 'left' | 'right';
}

export const GifWord: React.FC<GifWordProps> = ({
  word,
  gifUrl,
  className,
  onHighlight,
  onActiveChange,
  isActive,
  highlightColor,
  delayOffset,
  gifPosition = 'right',
}) => {
  const [showImage, setShowImage] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const shown = useRef(false);
  const onHighlightRef = useRef(onHighlight);
  onHighlightRef.current = onHighlight;
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setHighlighted(true);
      }, delayOffset || 0);
      return () => clearTimeout(timer);
    }
  }, [isActive, delayOffset]);

  useEffect(() => {
    if (highlighted && !shown.current) {
      shown.current = true;
      if (gifUrl) {
        setShowImage(true);
      }
      onHighlightRef.current?.();
    }
  }, [highlighted, gifUrl]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      const active = el.classList.contains('active-highlight');
      if (active) setHighlighted(true);
      onActiveChangeRef.current?.(active);
    });

    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const renderGif = () => {
    if (!gifUrl || !showImage) return null;
    const isLeft = gifPosition === 'left';
    return (
      <motion.span
        initial={{ width: 0, opacity: 0, marginLeft: 0, marginRight: 0 }}
        animate={{
          width: 80,
          opacity: 1,
          marginLeft: isLeft ? 0 : 6,
          marginRight: isLeft ? 6 : 0,
        }}
        transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.45 }}
        className="inline-block overflow-hidden align-middle"
      >
        <img
          src={gifUrl}
          alt="reaction"
          className="h-[80px] w-[80px] object-cover rounded-md pointer-events-none shadow-xl"
        />
      </motion.span>
    );
  };

  return (
    <span className="inline-block" {...(gifUrl ? { 'data-cursor-gif': gifUrl } : {})}>
      {gifPosition === 'left' && renderGif()}
      {/* scroll-highlight ::before only covers this word span */}
      <span
        ref={spanRef}
        className={`inline-block font-semibold ${highlighted ? 'active-highlight' : ''} ${className || ''}`}
        style={{ '--highlight-color': highlightColor } as React.CSSProperties}
      >
        {word}
      </span>
      {gifPosition === 'right' && renderGif()}
    </span>
  );
};
