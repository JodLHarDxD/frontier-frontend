import React, { useRef, useState, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';

const socials = [
  { name: 'Email', url: 'mailto:hello@jodl.dev' },
  { name: 'GitHub', url: 'https://github.com/JodLHarDxD' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'X', url: 'https://x.com' },
  { name: 'Instagram', url: 'https://instagram.com' },
  { name: 'Discord', url: 'https://discord.com' },
];

interface SocialCardProps {
  social: { name: string; url: string };
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  glowPos: { x: number; y: number };
}

const SocialCard: React.FC<SocialCardProps> = ({
  social,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  glowPos,
}) => {
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-between p-6 rounded-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{
        border: isHovered ? 'none' : '1px solid var(--border)',
        padding: isHovered ? 'calc(1.5rem - 1.5px)' : undefined,
      }}
    >
      {/* Static subtle border — visible when not hovered */}
      {!isHovered && (
        <span
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            border: '1px solid rgba(200, 255, 45, 0.08)',
          }}
        />
      )}

      {/* Animated RGB border gradient — visible on hover */}
      <span
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-400"
        style={{
          opacity: isHovered ? 1 : 0,
          padding: '1.5px',
          background: 'linear-gradient(135deg, #c8ff2d, #3b82f6, #ec4899, #f59e0b, #c8ff2d)',
          backgroundSize: '300% 300%',
          animation: isHovered ? 'social-gradient-shift 2.5s ease infinite' : 'none',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Hover spotlight glow following cursor position */}
      {isHovered && (
        <span
          className="absolute w-32 h-32 rounded-full pointer-events-none blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(200,255,45,0.15) 0%, rgba(59,130,246,0.08) 50%, transparent 100%)',
            left: glowPos.x - 64,
            top: glowPos.y - 64,
            transition: 'left 0.05s ease-out, top 0.05s ease-out',
          }}
        />
      )}

      {/* Outer glow on hover */}
      {isHovered && (
        <span
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: '0 0 25px rgba(200, 255, 45, 0.12), 0 0 50px rgba(59, 130, 246, 0.06)',
          }}
        />
      )}

      {/* Card name — always light green gradient */}
      <span
        className="text-xl font-medium relative z-10 transition-all duration-300"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, #c8ff2d, #e0ff73, #a8e600)'
            : 'linear-gradient(135deg, #c8ff2d, #a8e600)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(200, 255, 45, 0.4))' : 'none',
        }}
      >
        {social.name}
      </span>

      {/* External link icon — green gradient on hover */}
      <span
        className="relative z-10 transition-all duration-300"
        style={{
          transform: isHovered ? 'scale(1.15) translate(2px, -2px)' : 'scale(1)',
        }}
      >
        <ExternalLink
          size={20}
          style={{
            stroke: isHovered ? '#c8ff2d' : 'var(--text-secondary)',
            opacity: isHovered ? 1 : 0.5,
            filter: isHovered ? 'drop-shadow(0 0 6px rgba(200, 255, 45, 0.5))' : 'none',
            transition: 'all 0.3s ease',
          }}
        />
      </span>
    </a>
  );
};

export const SocialGrid: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [glowPositions, setGlowPositions] = useState<Record<number, { x: number; y: number }>>({});
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const handleCardMouseMove = useCallback((index: number, e: React.MouseEvent) => {
    const target = (e.currentTarget as HTMLElement);
    const rect = target.getBoundingClientRect();
    setGlowPositions((prev) => ({
      ...prev,
      [index]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    }));
  }, []);

  return (
    <section className="w-full py-24 px-6 md:px-12 border-t border-border bg-bg-primary">
      <style>{`
        @keyframes social-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Elsewhere heading with green gradient */}
        <h2
          className="text-3xl md:text-5xl font-sans tracking-tighter mb-12"
          style={{
            background: 'linear-gradient(135deg, #c8ff2d, #a8e600, #e0ff73)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Elsewhere
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {socials.map((social, index) => (
            <SocialCard
              key={social.name}
              social={social}
              isHovered={hoveredIndex === index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onMouseMove={(e) => handleCardMouseMove(index, e)}
              glowPos={glowPositions[index] || { x: 0, y: 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
