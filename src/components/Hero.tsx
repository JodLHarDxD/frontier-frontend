import React, { useRef, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { GifWord } from './GifWord';
import { HighlightLine } from './HighlightLine';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const petalsCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Floating Video Card Parallax Physics
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });

      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Blue Flower Petals & Elegant Smoke Flow Animation
  useEffect(() => {
    const smokeCanvas = smokeCanvasRef.current;
    const petalsCanvas = petalsCanvasRef.current;
    if (!smokeCanvas || !petalsCanvas || !containerRef.current) return;

    const smokeCtx = smokeCanvas.getContext('2d');
    const petalsCtx = petalsCanvas.getContext('2d');
    if (!smokeCtx || !petalsCtx) return;

    let animationFrameId: number;
    let petals: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      colorSecondary: string;
      vx: number;
      vy: number;
      angle: number;
      spin: number;
      wobble: number;
      wobbleSpeed: number;
    }> = [];

    let smokeClouds: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      maxLife: number;
      life: number;
      growth: number;
      wobble: number;
      wobbleSpeed: number;
      h: number;
      s: number;
      l: number;
    }> = [];

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      if (smokeCanvas) {
        smokeCanvas.width = width;
        smokeCanvas.height = height;
      }
      if (petalsCanvas) {
        petalsCanvas.width = width;
        petalsCanvas.height = height;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const spawnPetal = () => {
      const isDark = document.documentElement.classList.contains('dark');

      // Adaptive Petal HSL: Light glowing blue/cyan in dark mode, rich royal blue in light mode for stark contrast
      const hue = isDark ? (195 + Math.random() * 25) : (212 + Math.random() * 18);
      const sat = isDark ? (90 + Math.random() * 10) : (92 + Math.random() * 8);
      const light = isDark ? (68 + Math.random() * 14) : (44 + Math.random() * 8);

      petals.push({
        x: -20, // Spawn just off left edge of screen
        y: Math.random() * petalsCanvas.height, // Spawn across the entire height of the hero
        size: 7 + Math.random() * 8,
        color: `hsl(${hue}, ${sat}%, ${light}%)`,
        colorSecondary: `hsl(${hue - 15}, ${sat}%, ${light - 10}%)`,
        vx: 0.8 + Math.random() * 1.3, // Slower wind draft as requested
        vy: -0.2 + Math.random() * 0.45, // Elegant slow vertical flutter
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.008 + Math.random() * 0.015,
      });
    };

    const spawnSmoke = () => {
      const isDark = document.documentElement.classList.contains('dark');

      // Dynamic smoke: Electric glowing blue in dark mode, deep sapphire watercolor smoke in light mode
      const h = isDark ? (200 + Math.random() * 20) : (212 + Math.random() * 15);
      const s = isDark ? (80 + Math.random() * 15) : (85 + Math.random() * 10);
      const l = isDark ? (58 + Math.random() * 10) : (42 + Math.random() * 8);

      const radius = 95 + Math.random() * 85; // Larger clouds for luxurious density
      const maxLife = 280 + Math.random() * 220;

      // Dramatically boost smoke visibility:
      // Dark mode: moderate glowing opacity (0.08 - 0.16)
      // Light mode: high-contrast rich ink wash opacity (0.16 - 0.26) for immediate visibility
      const baseAlpha = isDark 
        ? (0.08 + Math.random() * 0.08) 
        : (0.16 + Math.random() * 0.10);

      smokeClouds.push({
        x: -radius - 15, // Spawn completely off left edge
        y: Math.random() * smokeCanvas.height,
        vx: 0.35 + Math.random() * 0.55, // Extra slow smoke drift
        vy: -0.08 + Math.random() * 0.18, // Whispering vertical wave
        radius,
        baseAlpha,
        maxLife,
        life: 0,
        growth: 0.08 + Math.random() * 0.12, // Gradual diffusion
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.003 + Math.random() * 0.006,
        h,
        s,
        l,
      });
    };

    const drawPetal = (p: typeof petals[0]) => {
      petalsCtx.save();
      petalsCtx.translate(p.x, p.y);
      petalsCtx.rotate(p.angle);
      
      // Simulate 3D flutter by scaling horizontally
      const scaleX = Math.sin(p.wobble * 2.2);
      petalsCtx.scale(scaleX, 1);

      petalsCtx.beginPath();
      // Premium cleft notched cherry blossom shape
      petalsCtx.moveTo(0, 0);
      // Left curve to left lobe
      petalsCtx.bezierCurveTo(-p.size * 0.5, p.size * 0.1, -p.size * 0.6, p.size * 0.6, -p.size * 0.35, p.size);
      // Center notched cleft
      petalsCtx.bezierCurveTo(-p.size * 0.15, p.size * 0.9, 0, p.size * 0.82, 0, p.size * 0.86);
      petalsCtx.bezierCurveTo(0, p.size * 0.82, p.size * 0.15, p.size * 0.9, p.size * 0.35, p.size);
      // Right curve back to base
      petalsCtx.bezierCurveTo(p.size * 0.6, p.size * 0.6, p.size * 0.5, p.size * 0.1, 0, 0);

      const grad = petalsCtx.createLinearGradient(0, 0, 0, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, p.colorSecondary);
      petalsCtx.fillStyle = grad;
      petalsCtx.fill();
      petalsCtx.restore();
    };

    const drawSmoke = (s: typeof smokeClouds[0]) => {
      smokeCtx.save();
      
      const ratio = s.life / s.maxLife;
      const currentAlpha = ratio < 0.2
        ? (ratio / 0.2) * s.baseAlpha
        : (1 - ratio) * s.baseAlpha;

      const grad = smokeCtx.createRadialGradient(s.x, s.y, s.radius * 0.1, s.x, s.y, s.radius);
      grad.addColorStop(0, `hsla(${s.h}, ${s.s}%, ${s.l}%, ${currentAlpha})`);
      grad.addColorStop(0.5, `hsla(${s.h}, ${s.s}%, ${s.l}%, ${currentAlpha * 0.35})`);
      grad.addColorStop(1, `hsla(${s.h}, ${s.s}%, ${s.l}%, 0)`);

      smokeCtx.beginPath();
      smokeCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      smokeCtx.fillStyle = grad;
      smokeCtx.fill();
      smokeCtx.restore();
    };

    const update = () => {
      smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
      petalsCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

      const isDark = document.documentElement.classList.contains('dark');
      // Set blend mode dynamically: screen for glowing effect in dark mode, normal for high-contrast colors in light mode
      smokeCanvas.style.mixBlendMode = isDark ? 'screen' : 'normal';
      petalsCanvas.style.mixBlendMode = isDark ? 'screen' : 'normal';

      // Spawn petals (increased cap to 75 for slightly denser flow)
      if (petals.length < 75 && Math.random() < 0.15) {
        spawnPetal();
      }

      // Spawn smoke clouds (cap at 24 active for rich dense smoke density)
      if (smokeClouds.length < 24 && Math.random() < 0.05) {
        spawnSmoke();
      }

      // Draw smoke first
      smokeClouds = smokeClouds.filter((s) => {
        s.life++;
        s.x += s.vx + Math.sin(s.wobble) * 0.1;
        s.y += s.vy + Math.cos(s.wobble) * 0.08;
        s.radius += s.growth;
        s.wobble += s.wobbleSpeed;

        const alive = s.life < s.maxLife && s.x < smokeCanvas.width + s.radius;
        if (alive) {
          drawSmoke(s);
        }
        return alive;
      });

      // Draw petals on top
      petals = petals.filter((p) => {
        p.x += p.vx;
        p.y += p.vy + Math.sin(p.wobble) * 0.2;
        p.wobble += p.wobbleSpeed;
        p.angle += p.spin;

        const isInside = p.x < petalsCanvas.width + 50 && p.y > -50 && p.y < petalsCanvas.height + 50;
        if (isInside) {
          drawPetal(p);
        }
        return isInside;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const rotateX = useTransform(mouseY, [-1, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [-1, 1], [-10, 10]);
  const translateX = useTransform(mouseX, [-1, 1], [-50, 50]);
  const translateY = useTransform(mouseY, [-1, 1], [-50, 50]);

  // Parallax layers: heading moves less than card, tagline less than heading
  const headingX = useTransform(mouseX, [-1, 1], [-30, 30]);
  const headingY = useTransform(mouseY, [-1, 1], [-30, 30]);
  const taglineX = useTransform(mouseX, [-1, 1], [-15, 15]);
  const taglineY = useTransform(mouseY, [-1, 1], [-15, 15]);

  // Determine highlights based on cursor coordinates
  let highlightJO = false;
  let highlightDL = false;
  let highlightHAR = false;
  let highlightDDY = false;

  if (!mousePos) {
    // Initially highlight JODL
    highlightJO = true;
    highlightDL = true;
  } else {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    if (mousePos.x >= centerX) {
      // Positive X-axis (right side)
      if (mousePos.y < centerY) {
        // Higher than middle
        highlightJO = true;
        highlightDL = true;
      } else {
        // Lower than middle
        highlightHAR = true;
        highlightDDY = true;
      }
    } else {
      // Negative X-axis (left side)
      highlightJO = true;
      highlightHAR = true;
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-primary transition-colors duration-300"
    >
      {/* Smoke Canvas - placed behind the main z-10 content container */}
      <canvas
        ref={smokeCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
        style={{ zIndex: 5 }}
      />

      {/* Wireframe Globe placeholder - using a simple CSS circular grid */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-text-primary/20 rounded-full flex items-center justify-center relative">
          <div className="absolute w-[60%] h-[60%] border border-text-primary/20 rounded-full" />
          <div className="absolute w-[40%] h-[40%] border border-text-primary/20 rounded-full" />
          <div className="absolute w-full h-[1px] bg-text-primary/20" />
          <div className="absolute h-full w-[1px] bg-text-primary/20" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full h-full text-center">
        {/* Status Pill */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-text-primary/10 bg-text-primary/5 backdrop-blur-md flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-text-primary/70 tracking-widest uppercase">
            <GifWord
              word="Available for work"
              gifUrl="/media/gifs/hero_status.gif"
              className="text-text-primary font-mono"
            />
          </span>
        </div>

        {/* Floating Video Card (Site 2 style) */}
        <motion.div
          className="absolute w-[300px] h-[400px] md:w-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-text-primary/10 pointer-events-none"
          style={{
            rotateX,
            rotateY,
            x: translateX,
            y: translateY,
            transformPerspective: 1000,
            zIndex: 10,
          }}
        >
          <video
            src="/media/videos/hero/hero_digital_agency.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>

        {/* Petals Canvas - placed on top of Video Card (zIndex: 10) but behind Main Text (zIndex: 20) */}
        <canvas
          ref={petalsCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
          style={{ zIndex: 15 }}
        />

        {/* Main Text */}
        <div className="relative z-20 pointer-events-auto">
          <motion.h1
            style={{ x: headingX, y: headingY }}
            className="font-heading font-normal tracking-normal uppercase mb-6 select-none flex flex-col items-center"
          >
            <span className="text-[12vw] md:text-[9rem] leading-[0.9]">
              <span className={`cursor-highlight ${highlightJO ? 'active-highlight' : ''}`}>JO</span><span className={`cursor-highlight ${highlightDL ? 'active-highlight' : ''}`}>DL</span>
            </span>
            <span className="text-white text-[12vw] md:text-[9rem] leading-[0.9]">
              <span className={`cursor-highlight ${highlightHAR ? 'active-highlight' : ''}`}>HAR</span><span className={`cursor-highlight ${highlightDDY ? 'active-highlight' : ''}`}>DDY.</span>
            </span>
          </motion.h1>
          <motion.div
            style={{ x: taglineX, y: taglineY }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 text-xl md:text-2xl text-text-secondary font-serif italic"
          >
            <span>
              <HighlightLine color="#c8ff2d">
                <GifWord word="Nice to meet you" gifUrl="/media/gifs/hero_meet.gif" gifPosition="left" />.
              </HighlightLine>
            </span>
            <span>
              <HighlightLine color="#c8ff2d">
                Automating engineering,{' '}
                <GifWord word="cinematically" gifUrl="/media/gifs/hero_cinematic.gif" />.
              </HighlightLine>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
