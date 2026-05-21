import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GifWord } from './GifWord';
import { HighlightLine } from './HighlightLine';
import { TagButton } from './TagButton';

gsap.registerPlugin(ScrollTrigger);

const tags = [
  'Interaction Design',
  'Creative Coding',
  'System Architecture',
  'WebGL',
  'Motion Physics',
  'AI Integration',
];

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (lampRef.current && containerRef.current) {
      gsap.fromTo(
        lampRef.current,
        { width: '0%', opacity: 0 },
        {
          width: '100%',
          opacity: 1,
          duration: 1.5,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          },
        },
      );
    }
  }, []);

  // Flower Petal Flow Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current || !tagsContainerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // Cache emission bounds relative to the parent container to avoid layout thrashing
    let emitXStart = 0;
    let emitXWidth = 0;
    let emitYStart = 0;
    let emitYHeight = 0;

    const calculateBounds = () => {
      if (!containerRef.current || !tagsContainerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const tagsRect = tagsContainerRef.current.getBoundingClientRect();

      emitXStart = tagsRect.left - containerRect.left;
      emitXWidth = tagsRect.width;
      emitYStart = tagsRect.top - containerRect.top;
      emitYHeight = tagsRect.height;
    };

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      calculateBounds();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Run additional layout sync timeouts to ensure positions stabilize after component mount
    const t1 = setTimeout(calculateBounds, 100);
    const t2 = setTimeout(calculateBounds, 500);
    const t3 = setTimeout(calculateBounds, 1500);
    const t4 = setTimeout(calculateBounds, 3000);

    const spawnPetal = () => {
      if (emitXWidth === 0) calculateBounds();

      // Premium Pink HSL Palette: HSL 330 (rose-pink) to 350 (cherry-pink)
      const hue = 330 + Math.random() * 20;
      const sat = 90 + Math.random() * 10;
      const light = 78 + Math.random() * 10;

      petals.push({
        x: emitXStart + Math.random() * emitXWidth,
        y: emitYStart + Math.random() * emitYHeight,
        size: 7 + Math.random() * 9,
        color: `hsl(${hue}, ${sat}%, ${light}%)`,
        colorSecondary: `hsl(${hue - 12}, ${sat}%, ${light - 8}%)`,
        vx: 1.8 + Math.random() * 3.6, // Wind draft moving horizontally
        vy: -0.4 + Math.random() * 0.8, // Delicate vertical flutter
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.03,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.012 + Math.random() * 0.022,
      });
    };

    const drawPetal = (p: typeof petals[0]) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      
      // Simulate 3D flutter by scaling horizontally
      const scaleX = Math.sin(p.wobble * 2.2);
      ctx.scale(scaleX, 1);

      ctx.beginPath();
      // Premium notched cherry-blossom petal shape
      ctx.moveTo(0, 0);
      // Left curve to left lobe
      ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.1, -p.size * 0.6, p.size * 0.6, -p.size * 0.35, p.size);
      // Center notched cleft
      ctx.bezierCurveTo(-p.size * 0.15, p.size * 0.9, 0, p.size * 0.82, 0, p.size * 0.86);
      ctx.bezierCurveTo(0, p.size * 0.82, p.size * 0.15, p.size * 0.9, p.size * 0.35, p.size);
      // Right curve back to base
      ctx.bezierCurveTo(p.size * 0.6, p.size * 0.6, p.size * 0.5, p.size * 0.1, 0, 0);

      const grad = ctx.createLinearGradient(0, 0, 0, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, p.colorSecondary);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn petals steadily
      if (petals.length < 120 && Math.random() < 0.25) {
        spawnPetal();
      }

      petals = petals.filter((p) => {
        p.x += p.vx;
        p.y += p.vy + Math.sin(p.wobble) * 0.35;
        p.wobble += p.wobbleSpeed;
        p.angle += p.spin;

        // Check if petal has flown out of container screen
        const isInside = p.x < canvas.width + 50 && p.y > -50 && p.y < canvas.height + 50;
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
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full min-h-screen py-32 px-6 md:px-24 bg-bg-primary text-text-primary relative flex flex-col items-center transition-colors duration-300 overflow-hidden"
    >
      {/* Petal Canvas (Overlay behind text contents but in front of Section BG) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-75"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Lamp Heading (Animated Gradient Line) */}
      <div className="w-full max-w-5xl mb-24 relative flex justify-center z-10">
        <div ref={lampRef} className="h-[2px] bg-gradient-to-r from-transparent via-text-primary to-transparent" />
        <div className="absolute top-0 w-full h-[100px] bg-gradient-to-b from-text-primary/10 to-transparent blur-2xl opacity-50" />
      </div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-16 md:gap-24 relative z-10">
        {/* Left Col: Massive Bio */}
        <div className="flex-1 space-y-12">
          <p className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
            <HighlightLine color="#c8ff2d">
              I am a <GifWord word="digital" className="scroll-highlight outline-style" />{' '}
              <GifWord
                word="architect"
                gifUrl="/media/gifs/about_architect.gif"
                className="scroll-highlight outline-style"
              />{' '}
              bridging the gap between{' '}
              <GifWord
                word="high-end engineering"
                gifUrl="/media/gifs/high_elon.gif"
                className="scroll-highlight outline-style"
              /> and{' '}
              <GifWord word="cinematic aesthetics" className="scroll-highlight outline-style" />.
            </HighlightLine>
          </p>
          <p className="text-xl md:text-2xl text-text-primary/60 leading-relaxed font-serif">
            With a background spanning <span className="text-text-primary font-semibold">full-stack development</span>,{' '}
            <span className="text-text-primary font-semibold">creative coding</span>, and{' '}
            <span className="text-text-primary font-semibold">AI research</span>, I don't just write code. I build
            kinetic experiences that feel alive, combining logic with motion to create systems that breathe.
          </p>

          {/* Obsessed with pill tags */}
          <div className="pt-8">
            <p className="font-mono text-sm uppercase tracking-widest text-text-primary/40 mb-6">Obsessed with</p>
            <div ref={tagsContainerRef} className="flex flex-wrap gap-3">
              {tags.map((tag, i) => (
                <TagButton key={i}>{tag}</TagButton>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Philosophy Quote */}
        <div className="md:w-1/3 flex flex-col justify-center">
          <div className="relative">
            <span className="absolute -top-16 -left-10 text-9xl text-text-primary/10 font-serif leading-none">"</span>
            <p className="text-2xl font-serif italic text-text-primary/80 relative z-10">
              Perfection is not when there is no more to add, but when there is no more to take away. The code must be
              ruthless, the design must be romantic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
