import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GifWord } from './GifWord';

interface HighlightLineProps {
  children: React.ReactNode;
  color?: string; // e.g. '#c8ff2d' or '#3b82f6'
  onHighlightActive?: () => void;
}

export const HighlightLine: React.FC<HighlightLineProps> = ({
  children,
  color = '#c8ff2d',
  onHighlightActive,
}) => {
  const [inView, setInView] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      setIsHighlighted(true);
      onHighlightActive?.();
    }
  }, [inView, onHighlightActive]);

  const renderChildren = (nodes: React.ReactNode): React.ReactNode => {
    let gifWordCount = 0;

    const recurse = (nodeList: React.ReactNode): React.ReactNode => {
      return React.Children.map(nodeList, (child) => {
        if (React.isValidElement(child)) {
          // Identify if it's a GifWord component
          if (child.type === GifWord) {
            const index = gifWordCount;
            gifWordCount++;
            return React.cloneElement(child as React.ReactElement<any>, {
              isActive: isHighlighted,
              delayOffset: index * 250,
              highlightColor: color,
            });
          }

          // Handle standard nested children components recursively
          const props = child.props as any;
          if (props && props.children) {
            return React.cloneElement(child as React.ReactElement<any>, {
              children: recurse(props.children),
            });
          }
        }
        return child;
      });
    };

    return recurse(nodes);
  };

  return (
    <span ref={ref} className="relative inline-block py-1">
      {/* High-fidelity text color fade sweep from muted to full brightness */}
      <motion.span
        animate={{
          color: isHighlighted ? 'var(--text-primary)' : 'var(--text-secondary)',
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ color: 'inherit' }}
      >
        {renderChildren(children)}
      </motion.span>
    </span>
  );
};

