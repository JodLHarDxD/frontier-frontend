import React, { useRef, useEffect } from 'react';

const BADGE_CONFIGS: { name: string; hex: string; logo?: string; logoColor?: string }[] = [
  // Existing 45 Technologies
  { name: 'React', hex: '61DAFB', logo: 'react', logoColor: 'black' },
  { name: 'TypeScript', hex: '3178C6', logo: 'typescript' },
  { name: 'Node.js', hex: '339933', logo: 'nodedotjs' },
  { name: 'Python', hex: '3776AB', logo: 'python' },
  { name: 'Vite', hex: '646CFF', logo: 'vite' },
  { name: 'Tailwind CSS', hex: '06B6D4', logo: 'tailwindcss' },
  { name: 'GSAP', hex: '88CE02', logo: 'greensock', logoColor: 'black' },
  { name: 'Framer Motion', hex: 'F024B6', logo: 'framer' },
  { name: 'Three.js', hex: '000000', logo: 'threedotjs' },
  { name: 'WebGL', hex: '990000', logo: 'webgl' },
  { name: 'Next.js', hex: '000000', logo: 'nextdotjs' },
  { name: 'Vercel', hex: '000000', logo: 'vercel' },
  { name: 'AWS', hex: 'FF9900', logo: 'amazonwebservices', logoColor: 'black' },
  { name: 'Docker', hex: '2496ED', logo: 'docker' },
  { name: 'Linux', hex: 'FCC624', logo: 'linux', logoColor: 'black' },
  { name: 'Git', hex: 'F05032', logo: 'git' },
  { name: 'C++', hex: '00599C', logo: 'cplusplus' },
  { name: 'HTML5', hex: 'E34F26', logo: 'html5' },
  { name: 'CSS3', hex: '1572B6', logo: 'css3' },
  { name: 'JavaScript', hex: 'F7DF1E', logo: 'javascript', logoColor: 'black' },
  { name: 'PostgreSQL', hex: '4169E1', logo: 'postgresql' },
  { name: 'MongoDB', hex: '47A248', logo: 'mongodb' },
  { name: 'Redis', hex: 'DC382D', logo: 'redis' },
  { name: 'Firebase', hex: 'FFCA28', logo: 'firebase', logoColor: 'black' },
  { name: 'GraphQL', hex: 'E10098', logo: 'graphql' },
  { name: 'REST API', hex: '009688', logo: 'postman' },
  { name: 'Jest', hex: 'C21325', logo: 'jest' },
  { name: 'Cypress', hex: '17202C', logo: 'cypress' },
  { name: 'OpenAI', hex: '00A389', logo: 'openai' },
  { name: 'TensorFlow', hex: 'FF6F00', logo: 'tensorflow' },
  { name: 'PyTorch', hex: 'EE4C2C', logo: 'pytorch' },
  { name: 'Rust', hex: 'E05D44', logo: 'rust' },
  { name: 'Go', hex: '00ADD8', logo: 'go' },
  { name: 'WebRTC', hex: '8C0000', logo: 'webrtc' },
  { name: 'Socket.io', hex: '010101', logo: 'socketdotio' },
  { name: 'Redux', hex: '764ABC', logo: 'redux' },
  { name: 'Zustand', hex: '5A4E40' },
  { name: 'Figma', hex: 'F24E1E', logo: 'figma' },
  { name: 'Photoshop', hex: '31A8FF', logo: 'adobephotoshop' },
  { name: 'Premiere Pro', hex: '9999FF', logo: 'adobepremierepro', logoColor: 'black' },
  { name: 'After Effects', hex: 'CF96FD', logo: 'adobeaftereffects', logoColor: 'black' },
  { name: 'Blender', hex: 'F5792A', logo: 'blender' },
  { name: 'Unity', hex: '000000', logo: 'unity' },
  { name: 'Unreal Engine', hex: '000000', logo: 'unrealengine' },
  { name: 'Android', hex: '3DDC84', logo: 'android', logoColor: 'black' },

  // 45 New Technologies (AI/ML, DevOps/Cloud, Cybersec, Web/Systems)
  { name: 'Svelte', hex: 'FF3E00', logo: 'svelte' },
  { name: 'Vue.js', hex: '4FC08D', logo: 'vuedotjs' },
  { name: 'Angular', hex: 'DD0031', logo: 'angular' },
  { name: 'FastAPI', hex: '009688', logo: 'fastapi' },
  { name: 'Django', hex: '092E20', logo: 'django' },
  { name: 'Flask', hex: '000000', logo: 'flask' },
  { name: 'Kubernetes', hex: '326CE5', logo: 'kubernetes' },
  { name: 'Google Cloud', hex: '4285F4', logo: 'googlecloud' },
  { name: 'Azure', hex: '0078D4', logo: 'microsoftazure' },
  { name: 'Terraform', hex: '844FBA', logo: 'terraform' },
  { name: 'Ansible', hex: 'EE0000', logo: 'ansible' },
  { name: 'Supabase', hex: '3ECF8E', logo: 'supabase' },
  { name: 'Prisma', hex: '2D3748', logo: 'prisma' },
  { name: 'SQLite', hex: '003B57', logo: 'sqlite' },
  { name: 'MySQL', hex: '4479A1', logo: 'mysql' },
  { name: 'Hugging Face', hex: 'FFD21E', logo: 'huggingface', logoColor: 'black' },
  { name: 'Keras', hex: 'D00000', logo: 'keras' },
  { name: 'Scikit-Learn', hex: 'F7931E', logo: 'scikitlearn' },
  { name: 'Pandas', hex: '150458', logo: 'pandas' },
  { name: 'NumPy', hex: '013243', logo: 'numpy' },
  { name: 'Jupyter', hex: 'F37626', logo: 'jupyter' },
  { name: 'Apache Spark', hex: 'E25A1C', logo: 'apachespark' },
  { name: 'Apache Kafka', hex: '231F20', logo: 'apachekafka' },
  { name: 'LangChain', hex: '1C3C3C', logo: 'langchain' },
  { name: 'CUDA', hex: '76B900', logo: 'nvidia' },
  { name: 'Kali Linux', hex: '557C94', logo: 'kalilinux' },
  { name: 'Wireshark', hex: '1679A7', logo: 'wireshark' },
  { name: 'Snyk', hex: '4C1E87', logo: 'snyk' },
  { name: 'SonarQube', hex: '4E9BCD', logo: 'sonarqube' },
  { name: 'Auth0', hex: 'EB5424', logo: 'auth0' },
  { name: 'JWT', hex: '000000', logo: 'jsonwebtokens' },
  { name: 'Vault', hex: '000000', logo: 'hashicorpvault' },
  { name: 'Kotlin', hex: '7F52FF', logo: 'kotlin' },
  { name: 'Swift', hex: 'F05138', logo: 'swift' },
  { name: 'Flutter', hex: '02569B', logo: 'flutter' },
  { name: 'Dart', hex: '0175C2', logo: 'dart' },
  { name: 'WebAssembly', hex: '654FF0', logo: 'webassembly' },
  { name: 'Solidity', hex: '363636', logo: 'solidity' },
  { name: 'Ethereum', hex: '3C3C3D', logo: 'ethereum' },
  { name: 'GitHub Actions', hex: '2088FF', logo: 'githubactions' },
  { name: 'Grafana', hex: 'F46800', logo: 'grafana' },
  { name: 'Prometheus', hex: 'E6522C', logo: 'prometheus' },
  { name: 'Databricks', hex: 'FF3621', logo: 'databricks' },
  { name: 'Snowflake', hex: '29B5E8', logo: 'snowflake' },
  { name: 'Java', hex: 'EA2D2E', logo: 'openjdk' },
];

const badges = BADGE_CONFIGS.map((cfg) => {
  const label = encodeURIComponent(cfg.name).replace(/-/g, '--');
  const hex = cfg.hex;
  const logo = cfg.logo ? `&logo=${cfg.logo}` : '';
  const logoColor = cfg.logoColor ? `&logoColor=${cfg.logoColor}` : '&logoColor=white';
  return {
    name: cfg.name,
    src: `https://img.shields.io/badge/-${label}-${hex}?style=for-the-badge${logo}${logoColor}`,
  };
});

interface Node {
  name: string;
  src: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  u: number;
  v: number;
  id: number;
}

export const TechSwarm: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos = useRef({ x: -10000, y: -10000, active: false });
  const nodes = useRef<Node[]>([]);

  // 1. Initialize nodes with golden spiral (Fermat's spiral) distribution for an organic constellation look
  useEffect(() => {
    const N = badges.length;
    const initialNodes: Node[] = [];

    for (let i = 0; i < N; i++) {
      // Golden angle in radians (137.5 degrees)
      const angle = i * 2.39996 + Math.random() * 0.15;
      // Fermat's spiral radius distribution (scale outwards to cover wide area)
      const r = (0.44 * Math.sqrt(i + 1)) / Math.sqrt(N);

      initialNodes.push({
        name: badges[i].name,
        src: badges[i].src,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        u: 0.5 + Math.cos(angle) * r,
        v: 0.5 + Math.sin(angle) * r,
        id: i,
      });
    }

    nodes.current = initialNodes;
  }, []);

  // 2. Core Physics and Canvas Animation Loop
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Responsive canvas resizing
    const resizeCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;

      // Immediately place nodes at their target coordinate on load
      nodes.current.forEach((node) => {
        if (node.x === 0 && node.y === 0) {
          node.x = node.u * width;
          node.y = node.v * height;
        }
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse coordinates tracker relative to container boundary
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = {
        x: -10000,
        y: -10000,
        active: false,
      };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const update = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const isMouseActive = mousePos.current.active;

      // Node repulsion threshold boundary
      const repelDist = 260;

      nodes.current.forEach((node, i) => {
        const baseTargetX = node.u * width;
        const baseTargetY = node.v * height;

        // Gentle organic wave float so network floats naturally like a constellation
        const floatX = Math.sin(time * 0.015 + node.id) * 15;
        const floatY = Math.cos(time * 0.015 + node.id) * 15;

        let repelX = 0;
        let repelY = 0;

        if (isMouseActive) {
          const dx = node.x - mx;
          const dy = node.y - my;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < repelDist && distance > 0) {
            // Exponential easing for fluid push away from mouse
            const force = Math.pow((repelDist - distance) / repelDist, 1.8);
            const repelStrength = 180;
            repelX = (dx / distance) * force * repelStrength;
            repelY = (dy / distance) * force * repelStrength;
          }
        }

        const finalTargetX = baseTargetX + floatX + repelX;
        const finalTargetY = baseTargetY + floatY + repelY;

        // Spring physics parameters (smooth ease back)
        const stiffness = 0.08;
        const damping = 0.82;

        const ax = (finalTargetX - node.x) * stiffness;
        const ay = (finalTargetY - node.y) * stiffness;

        node.vx = (node.vx + ax) * damping;
        node.vy = (node.vy + ay) * damping;

        node.x += node.vx;
        node.y += node.vy;

        // Directly push styles to DOM with translate3d for GPU hardware acceleration
        const el = badgeRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(calc(${node.x}px - 50%), calc(${node.y}px - 50%), 0)`;
        }
      });

      // Draw network grid connection lines
      ctx.lineWidth = 1;
      const connectionThreshold = 160; // 160px is the sweet-spot for beautiful 90-node density

      for (let i = 0; i < nodes.current.length; i++) {
        const nodeA = nodes.current[i];
        for (let j = i + 1; j < nodes.current.length; j++) {
          const nodeB = nodes.current[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionThreshold) {
            // Opacity fades gracefully as nodes pull further apart
            const alpha = ((connectionThreshold - dist) / connectionThreshold) * 0.16;
            ctx.strokeStyle = `rgba(120, 130, 140, ${alpha})`;

            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes]);

  return (
    <section className="w-full min-h-screen py-24 px-6 relative overflow-hidden bg-bg-primary flex flex-col items-center justify-center cursor-crosshair select-none">
      {/* Dynamic Header */}
      <div className="absolute top-12 left-12 z-10 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-sans font-bold tracking-tighter">TECH SWARM</h2>
        <p className="text-text-secondary mt-2 max-w-sm">
          Interactive constellation network of 90+ technologies. Move your cursor to repel the connections.
        </p>
      </div>

      {/* Massive Constellation Workspace Boundary */}
      <div
        ref={containerRef}
        className="w-full max-w-[1400px] h-[75vh] min-h-[550px] relative mt-24 border border-text-primary/5 rounded-2xl bg-text-primary/[0.01] overflow-hidden"
      >
        {/* Node Connection Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        {/* DOM Badge Nodes Layer */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {badges.map((cfg, i) => (
            <div
              key={i}
              ref={(el) => {
                badgeRefs.current[i] = el;
              }}
              className="absolute pointer-events-auto cursor-pointer select-none transition-opacity duration-300 opacity-80 hover:opacity-100 active:scale-95"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)',
                willChange: 'transform',
              }}
            >
              <img
                src={cfg.src}
                alt={cfg.name}
                className="h-7 md:h-[34px] pointer-events-none select-none rounded shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
