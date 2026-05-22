import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  color: string;
  size: number;
  alpha: number;
  angle: number;
  orbitSpeed: number;
  orbitRadius: number;
  pulsePhase: number;
  explodedTime: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export const ContactHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const mousePos = useRef({ x: -10000, y: -10000, vx: 0, vy: 0, active: false });
  const triggerExplosionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!container || !canvas || !button) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const COLORS = ['#c8ff2d', '#3b82f6', '#ec4899'];
    const particles: Particle[] = [];
    let sparks: Spark[] = [];
    const particleCount = 180;

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        // Distribute home locations nicely across the canvas
        const homeX = Math.random() * w;
        const homeY = Math.random() * h;
        
        // Random orbit radius around button (between 75px and 225px)
        const orbitRadius = 75 + Math.random() * 150;
        
        particles.push({
          x: homeX,
          y: homeY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          homeX,
          homeY,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1.2 + Math.random() * 2.2,
          alpha: 0.3 + Math.random() * 0.7,
          angle: Math.random() * Math.PI * 2,
          orbitSpeed: (0.015 + Math.random() * 0.02) * (Math.random() > 0.5 ? 1 : -1),
          orbitRadius,
          pulsePhase: Math.random() * Math.PI * 2,
          explodedTime: 0,
        });
      }
    };

    const resizeCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles(width, height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse coordinates and velocity tracker
    let lastX = 0;
    let lastY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      const vx = currentX - lastX;
      const vy = currentY - lastY;
      
      mousePos.current = {
        x: currentX,
        y: currentY,
        vx: vx * 0.5, // Dampen velocity transfer slightly
        vy: vy * 0.5,
        active: true,
      };
      
      lastX = currentX;
      lastY = currentY;
    };

    const handleMouseLeave = () => {
      mousePos.current = {
        x: -10000,
        y: -10000,
        vx: 0,
        vy: 0,
        active: false,
      };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Explosion shockwave function definition
    triggerExplosionRef.current = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const bx = buttonRect.left - canvasRect.left + buttonRect.width / 2;
      const by = buttonRect.top - canvasRect.top + buttonRect.height / 2;

      // 1. Blast standard particles away
      particles.forEach((p) => {
        const dx = p.x - bx;
        const dy = p.y - by;
        
        p.explodedTime = 100; // Exploded for 100 frames
        
        // High outward velocity with slight swirling dispersion
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4;
        const speed = 7 + Math.random() * 15;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      });

      // 2. Spawn brilliant spark particles
      const newSparks: Spark[] = [];
      const sparkCount = 130;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 16;
        const maxLife = 35 + Math.random() * 50;
        
        newSparks.push({
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1.0 + Math.random() * 2.8,
          alpha: 1,
          life: maxLife,
          maxLife,
        });
      }
      sparks = [...sparks, ...newSparks];
    };

    let time = 0;

    const update = () => {
      time += 1;

      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? 'rgba(10, 10, 10, 0.16)' : 'rgba(245, 245, 245, 0.16)';
      ctx.fillRect(0, 0, width, height);

      const canvasRect = canvas.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const bx = buttonRect.left - canvasRect.left + buttonRect.width / 2;
      const by = buttonRect.top - canvasRect.top + buttonRect.height / 2;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const isMouseActive = mousePos.current.active;
      const mvx = mousePos.current.vx;
      const mvy = mousePos.current.vy;

      // Decelerate mouse velocity slightly in background
      mousePos.current.vx *= 0.9;
      mousePos.current.vy *= 0.9;

      // Update and draw standard particles
      particles.forEach((p) => {
        // Apply friction
        p.vx *= 0.93;
        p.vy *= 0.93;

        // Apply mouse velocity "splash" to nearby particles
        if (isMouseActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 0) {
            const factor = (130 - dist) / 130;
            p.vx += mvx * factor * 0.22;
            p.vy += mvy * factor * 0.22;
          }
        }

        // Particle movement behaviors based on state
        if (p.explodedTime > 0) {
          p.explodedTime -= 1;
          // Friction is already applied, let it fly out
        } else if (isButtonHovered) {
          // Vortex state: orbit around the button
          p.angle += p.orbitSpeed;
          const targetX = bx + Math.cos(p.angle) * p.orbitRadius;
          const targetY = by + Math.sin(p.angle) * p.orbitRadius;
          
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          
          p.vx += dx * 0.08;
          p.vy += dy * 0.08;
        } else if (isMouseActive) {
          // Attracted to cursor with a swirling effect
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 320) {
            const force = (320 - dist) / 320;
            // Pull force towards mouse
            p.vx += (dx / dist) * force * 0.38;
            p.vy += (dy / dist) * force * 0.38;
            
            // Add swirl force perpendicular to distance vector
            const px = -dy / dist;
            const py = dx / dist;
            p.vx += px * force * 0.65;
            p.vy += py * force * 0.65;
          } else {
            // Return to home position gently
            const dxHome = p.homeX - p.x;
            const dyHome = p.homeY - p.y;
            p.vx += dxHome * 0.015;
            p.vy += dyHome * 0.015;
          }
        } else {
          // Idle floating state: float in organic wave around home position
          const waveX = Math.sin(time * 0.01 + p.pulsePhase) * 22;
          const waveY = Math.cos(time * 0.01 + p.pulsePhase) * 22;
          
          const targetX = p.homeX + waveX;
          const targetY = p.homeY + waveY;
          
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          
          p.vx += dx * 0.012;
          p.vy += dy * 0.012;
        }

        // Apply coordinates
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle with glow (fast dual-circle rendering)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '1c'; // Transparent outer glow
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; // Sharp inner core
        ctx.fill();
      });

      // Update and draw sparks (from click explosion)
      sparks = sparks.filter((s) => {
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 1;
        s.alpha = Math.max(0, s.life / s.maxLife);

        if (s.life <= 0) return false;

        // Draw spark with long, fine glow trails
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2);
        const alphaHex = Math.floor(s.alpha * 30).toString(16).padStart(2, '0');
        ctx.fillStyle = s.color + alphaHex;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        const solidAlphaHex = Math.floor(s.alpha * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = s.color + solidAlphaHex;
        ctx.fill();

        return true;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isButtonHovered]);

  const handleButtonClick = () => {
    if (triggerExplosionRef.current) {
      triggerExplosionRef.current();
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center overflow-hidden bg-bg-primary select-none"
    >
      <style>{`
        @keyframes contact-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Dynamic Interaction Canvas background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0" 
      />

      {/* 900px accent spotlight overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-mint/10 dark:bg-mint/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center pointer-events-none">
        <p className="font-mono uppercase tracking-widest text-mint mb-8">[ 05 // Initializing connection ]</p>

        <h1 className="text-6xl md:text-[8rem] font-bold font-sans tracking-tighter leading-[0.9] mb-8 select-none text-text-primary">
          <span className="scroll-highlight">LET'S</span> <br />
          <span className="scroll-highlight outline-style">CONNECT</span>
        </h1>

        <p className="text-xl md:text-3xl text-text-secondary max-w-2xl mb-16 font-serif italic">
          Got a project that needs an architect? Or just want to say hi?
        </p>

        {/* Say Hello Button with animated RGB border gradient */}
        <a
          ref={buttonRef}
          href="mailto:hello@jodl.dev"
          className="group relative inline-flex items-center gap-4 bg-text-primary text-bg-primary px-10 py-5 rounded-full text-xl font-medium overflow-visible pointer-events-auto cursor-pointer"
          data-cursor="view"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onClick={handleButtonClick}
        >
          {/* Animated RGB border gradient */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              padding: '2px',
              background: 'linear-gradient(135deg, #c8ff2d, #3b82f6, #ec4899, #c8ff2d)',
              backgroundSize: '300% 300%',
              animation: 'contact-gradient-shift 2.5s ease infinite',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          <span className="relative z-10">Say Hello</span>
          <ArrowUpRight className="relative z-10 group-hover:rotate-45 transition-transform duration-300" size={24} />
          <div className="absolute inset-0 bg-mint translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
        </a>
      </div>
    </section>
  );
};
