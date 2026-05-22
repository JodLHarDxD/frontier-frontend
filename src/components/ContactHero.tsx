import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight, Cpu, Scan, CheckCircle } from 'lucide-react';

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
  const faceRef = useRef<HTMLImageElement>(null);
  
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [targetSpeech, setTargetSpeech] = useState(
    "Greetings, traveler. I am CHLOE, the liaison entity of this archive. I see you have scrolled exactly 100% of this web space. Shall we initialize a connection?"
  );
  const [speechText, setSpeechText] = useState('');
  
  const mousePos = useRef({ x: -10000, y: -10000, vx: 0, vy: 0, active: false });
  const triggerExplosionRef = useRef<(() => void) | null>(null);
  const currentSpeechIndex = useRef(0);

  // Typewriter effect
  useEffect(() => {
    setSpeechText('');
    currentSpeechIndex.current = 0;
    let intervalId: number;

    const typeCharacter = () => {
      if (currentSpeechIndex.current < targetSpeech.length) {
        setSpeechText((prev) => prev + targetSpeech.charAt(currentSpeechIndex.current));
        currentSpeechIndex.current += 1;
        intervalId = window.setTimeout(typeCharacter, 20);
      }
    };

    typeCharacter();

    return () => {
      window.clearTimeout(intervalId);
    };
  }, [targetSpeech]);

  // Main Canvas & Interaction Loop
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
        const homeX = Math.random() * w;
        const homeY = Math.random() * h;
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
        vx: vx * 0.5,
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

      particles.forEach((p) => {
        const dx = p.x - bx;
        const dy = p.y - by;
        p.explodedTime = 100;
        
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4;
        const speed = 7 + Math.random() * 15;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      });

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

      // Decelerate mouse velocity in background
      mousePos.current.vx *= 0.9;
      mousePos.current.vy *= 0.9;

      // GPU-Accelerated 3D Hologram Face tracking (Direct DOM manipulation to keep 60fps)
      const faceEl = faceRef.current;
      if (faceEl && isMouseActive) {
        const faceRect = faceEl.getBoundingClientRect();
        const fx = faceRect.left - canvasRect.left + faceRect.width / 2;
        const fy = faceRect.top - canvasRect.top + faceRect.height / 2;

        const dx = mx - fx;
        const dy = my - fy;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const pull = Math.min(distance / 500, 1);
        
        const maxRot = 15;
        const rotY = (dx / distance) * maxRot * pull;
        const rotX = -(dy / distance) * maxRot * pull; // Tilts towards cursor

        const transX = (dx / distance) * 6 * pull;
        const transY = (dy / distance) * 6 * pull;

        faceEl.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translate3d(${transX}px, ${transY}px, 0) scale(1.05)`;
      } else if (faceEl) {
        faceEl.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translate3d(0px, 0px, 0) scale(1)`;
      }

      // Update and draw standard particles
      particles.forEach((p) => {
        p.vx *= 0.93;
        p.vy *= 0.93;

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

        if (p.explodedTime > 0) {
          p.explodedTime -= 1;
        } else if (isButtonHovered) {
          p.angle += p.orbitSpeed;
          const targetX = bx + Math.cos(p.angle) * p.orbitRadius;
          const targetY = by + Math.sin(p.angle) * p.orbitRadius;
          
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          
          p.vx += dx * 0.08;
          p.vy += dy * 0.08;
        } else if (isMouseActive) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 320) {
            const force = (320 - dist) / 320;
            p.vx += (dx / dist) * force * 0.38;
            p.vy += (dy / dist) * force * 0.38;
            
            const px = -dy / dist;
            const py = dx / dist;
            p.vx += px * force * 0.65;
            p.vy += py * force * 0.65;
          } else {
            const dxHome = p.homeX - p.x;
            const dyHome = p.homeY - p.y;
            p.vx += dxHome * 0.015;
            p.vy += dyHome * 0.015;
          }
        } else {
          const waveX = Math.sin(time * 0.01 + p.pulsePhase) * 22;
          const waveY = Math.cos(time * 0.01 + p.pulsePhase) * 22;
          
          const targetX = p.homeX + waveX;
          const targetY = p.homeY + waveY;
          
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          
          p.vx += dx * 0.012;
          p.vy += dy * 0.012;
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '1c';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Update and draw sparks
      sparks = sparks.filter((s) => {
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 1;
        s.alpha = Math.max(0, s.life / s.maxLife);

        if (s.life <= 0) return false;

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

  // CHLOE Dialog Action 1: Initialize Direct Email
  const handleInitializeConnection = () => {
    if (triggerExplosionRef.current) {
      triggerExplosionRef.current();
    }
    setTargetSpeech(
      "Direct transmission link established. Preparing direct mail portal to hello@jodl.dev. Initiating hypernova shockwave. I look forward to working together."
    );
    
    // Simulate clicking the actual button to trigger its visual transitions or open client
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }, 1500);
  };

  // CHLOE Dialog Action 2: Trigger Digital Scan Overlay
  const handleSystemScan = () => {
    setIsScanning(true);
    setTargetSpeech(
      "Initializing deep system diagnostics... Swarm nodes online. Holographic grid scan active. Connection core at 100% stability. Security protocols cleared."
    );
    
    if (triggerExplosionRef.current) {
      triggerExplosionRef.current();
    }

    setTimeout(() => {
      setIsScanning(false);
    }, 2500);
  };

  const handleButtonClick = () => {
    if (triggerExplosionRef.current) {
      triggerExplosionRef.current();
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-28 px-6 overflow-hidden bg-bg-primary select-none"
    >
      <style>{`
        @keyframes contact-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes contact-laser-sweep {
          0% { top: 0%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes contact-hologram-pulse {
          0% { opacity: 0.82; filter: hue-rotate(0deg); }
          50% { opacity: 1; filter: hue-rotate(6deg) brightness(1.05); }
          100% { opacity: 0.82; filter: hue-rotate(0deg); }
        }
      `}</style>

      {/* Dynamic Interaction Canvas background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0" 
      />

      {/* Full-screen Holographic Sweep Scan effect overlay */}
      {isScanning && (
        <div className="absolute inset-0 z-20 pointer-events-none bg-mint/[0.01] border-x border-mint/5">
          {/* Sweeping laser line */}
          <div 
            className="absolute left-0 w-full h-[2px] bg-mint shadow-[0_0_20px_#3ee6a6]"
            style={{
              animation: 'contact-laser-sweep 2.5s ease-in-out infinite',
              willChange: 'top, opacity',
            }}
          />
          {/* Laser scanning tech grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(62, 230, 166, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(62, 230, 166, 0.08) 1px, transparent 1px)',
              backgroundSize: '25px 25px',
            }}
          />
        </div>
      )}

      {/* 900px accent spotlight overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-mint/10 dark:bg-mint/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0" />

      {/* Interactive Main Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center px-2">
        
        {/* LEFT COLUMN: Main Connection Info & CTA */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pointer-events-none">
          <p className="font-mono uppercase tracking-widest text-mint mb-8">[ 05 // Initializing connection ]</p>

          <h1 className="text-6xl md:text-[8rem] lg:text-[8.5rem] font-bold font-sans tracking-tighter leading-[0.88] mb-8 select-none text-text-primary">
            <span className="scroll-highlight">LET'S</span> <br />
            <span className="scroll-highlight outline-style">CONNECT</span>
          </h1>

          <p className="text-xl md:text-3xl text-text-secondary max-w-xl mb-14 font-serif italic">
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

        {/* RIGHT COLUMN: CHLOE Cybernetic Holographic Assistant */}
        <div className="lg:col-span-5 flex flex-col items-center select-none z-10">
          
          {/* Concentric Spinning Rings & Glowing Portrait Container */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-10">
            
            {/* Clockwise Ring */}
            <div className="absolute inset-0 rounded-full border border-mint/20 animate-[spin_24s_linear_infinite] pointer-events-none" />
            
            {/* Counter-Clockwise dashed Ring */}
            <div className="absolute -inset-4 rounded-full border border-dashed border-cyan/20 animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />
            
            {/* Outer dotted scan ring */}
            <div className="absolute -inset-8 rounded-full border border-dotted border-pink/15 animate-[spin_40s_linear_infinite] pointer-events-none" />
            
            {/* Hologram projector glow stand */}
            <div className="absolute -bottom-6 w-32 h-1 bg-mint/30 blur-[2px] rounded-full shadow-[0_0_12px_#3ee6a6]" />

            {/* Glowing Android Headshot Mask */}
            <div 
              className="relative w-full h-full rounded-full overflow-hidden border border-mint/30 shadow-[0_0_40px_rgba(62,230,166,0.12)] bg-black/40 backdrop-blur-sm cursor-pointer z-10 flex items-center justify-center group"
              style={{
                perspective: '1000px',
                animation: 'contact-hologram-pulse 5s ease-in-out infinite',
              }}
            >
              {/* Scanlines layer */}
              <div 
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-60"
                style={{
                  background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%)',
                  backgroundSize: '100% 4px',
                }}
              />
              
              {/* Digital hologram blue tint screen overlay */}
              <div className="absolute inset-0 bg-mint/5 mix-blend-color-dodge z-20 pointer-events-none group-hover:bg-cyan/10 transition-colors duration-500" />
              
              {/* Ultra-realistic Android Face Image with 3D tracking */}
              <img 
                ref={faceRef}
                src="/media/images/chloe_android.png" 
                alt="CHLOE Android Liaison" 
                className="w-full h-full object-cover select-none pointer-events-none z-10 opacity-90 transition-transform duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              />
            </div>
          </div>

          {/* Sci-Fi Dialogue Box */}
          <div className="w-full max-w-[420px] bg-text-primary/[0.02] border border-text-primary/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative">
            
            {/* Cyber Corner Decals */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-mint/50" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-mint/50" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-mint/50" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-mint/50" />

            {/* Entity Identification Label */}
            <div className="flex items-center justify-between mb-4 border-b border-text-primary/5 pb-2.5">
              <span className="font-mono text-xs uppercase tracking-widest text-mint flex items-center gap-1.5 font-bold">
                <Cpu size={14} className="animate-pulse" />
                SYSTEM // CHLOE // V-LIAISON
              </span>
              <span className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
                STATUS: OPTIMAL
              </span>
            </div>

            {/* Typewritten Dialogue Text */}
            <p className="font-mono text-sm leading-relaxed text-text-secondary min-h-[90px] select-text">
              {speechText}
              <span className="inline-block w-1.5 h-4 bg-mint ml-1 animate-pulse" />
            </p>

            {/* Holographic Dialog Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              
              {/* Action button 1: Initialize connection */}
              <button 
                onClick={handleInitializeConnection}
                className="group flex items-center justify-center gap-2 border border-mint text-mint bg-mint/5 hover:bg-mint hover:text-bg-primary py-2.5 px-4 rounded font-mono text-xs font-bold uppercase transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <CheckCircle size={14} />
                INITIALIZE
              </button>

              {/* Action button 2: Scan */}
              <button 
                onClick={handleSystemScan}
                className="group flex items-center justify-center gap-2 border border-cyan/40 text-cyan bg-cyan/5 hover:bg-cyan hover:text-bg-primary py-2.5 px-4 rounded font-mono text-xs font-bold uppercase transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <Scan size={14} className={isScanning ? "animate-spin" : ""} />
                SYSTEM DIAGS
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
