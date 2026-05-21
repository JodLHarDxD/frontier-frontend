import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TagButtonProps {
  children: React.ReactNode;
}

export const TagButton: React.FC<TagButtonProps> = ({ children }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Motion values for magnetic pull (displacement from center)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Motion values for the glowing liquid spotlight position inside the button bounds
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  // Springs for smooth magnetic return and organic lag feel
  const springConfig = { damping: 15, stiffness: 120, mass: 0.12 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Dynamically track the global dark mode class using MutationObserver
  useEffect(() => {
    // Check initial dark mode state
    setIsDark(document.documentElement.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    
    // Position of the mouse relative to the button bounds
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    glowX.set(mouseX);
    glowY.set(mouseY);

    // Magnetic pull calculation: pull up to 35% of the distance from the center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const pullX = (mouseX - centerX) * 0.35;
    const pullY = (mouseY - centerY) * 0.35;

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  // Dynamic light mode watercolor vs. dark mode electric cyan/lime neon spotlights
  const spotlightGradient = isDark
    ? 'radial-gradient(circle, rgba(200, 255, 45, 0.35) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(236, 72, 153, 0) 100%)'
    : 'radial-gradient(circle, rgba(99, 102, 241, 0.26) 0%, rgba(236, 72, 153, 0.18) 50%, rgba(200, 255, 45, 0) 100%)';

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        animation: isDark 
          ? 'tag-pulse-glow-dark 5s ease-in-out infinite' 
          : 'tag-pulse-glow-light 5s ease-in-out infinite',
      }}
      className={`relative px-6 py-2.5 rounded-full border transition-colors duration-300 select-none overflow-hidden cursor-pointer ${
        isDark 
          ? 'bg-bg-primary text-text-primary border-white/10' 
          : 'bg-white/85 backdrop-blur-sm text-text-primary border-black/10'
      } text-sm font-mono uppercase tracking-wider`}
    >
      <style>{`
        @keyframes tag-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes tag-pulse-glow-dark {
          0%, 100% {
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.05), inset 0 0 8px rgba(59, 130, 246, 0.02);
            border-color: rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 22px rgba(200, 255, 45, 0.18), inset 0 0 12px rgba(200, 255, 45, 0.08);
            border-color: rgba(200, 255, 45, 0.25);
          }
        }
        @keyframes tag-pulse-glow-light {
          0%, 100% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.05), inset 0 0 8px rgba(59, 130, 246, 0.02);
            border-color: rgba(0, 0, 0, 0.08);
          }
          50% {
            box-shadow: 0 0 18px rgba(99, 102, 241, 0.14), inset 0 0 8px rgba(99, 102, 241, 0.04);
            border-color: rgba(99, 102, 241, 0.25);
          }
        }
      `}</style>

      {/* Cybernetic Pulsing Background Gradient Ring (Soft/Rich pulse) */}
      <span className={`absolute inset-0 rounded-full opacity-20 bg-gradient-to-r ${
        isDark 
          ? 'from-blue-500/10 via-lime-500/5 to-pink-500/10' 
          : 'from-indigo-500/8 via-rose-500/5 to-pink-500/8'
      } pointer-events-none`} />

      {/* Rotating and moving border gradient on hover */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          padding: '1.5px',
          background: 'linear-gradient(135deg, #c8ff2d, #3b82f6, #ec4899, #c8ff2d)',
          backgroundSize: '300% 300%',
          animation: hovered ? 'tag-gradient-shift 2.5s ease infinite' : 'none',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Hover Spotlight Glow - moves seamlessly matching the cursor position */}
      <motion.span
        className="absolute w-24 h-24 rounded-full pointer-events-none blur-xl transition-opacity duration-300"
        style={{
          background: spotlightGradient,
          left: useTransform(glowX, (v) => v - 48),
          top: useTransform(glowY, (v) => v - 48),
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Button Text */}
      <span className="relative z-10 flex items-center justify-center gap-1.5 transition-colors duration-300 font-semibold text-xs tracking-widest">
        {children}
      </span>
    </motion.button>
  );
};
