import React from 'react';
import { motion } from 'framer-motion';
const Github: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const repos = [
  {
    id: '01',
    repo: 'create-studio',
    type: 'TypeScript',
    tag: 'CURRENTLY BUILDING',
    status: 'Live Build 🟢',
    link: 'https://github.com/JodLHarDxD/create-studio',
    img: '/media/images/projects/create_studio.png',
    desc: 'A modern browser-based creative environment for crafting dynamic UI components, animations, and high-fidelity prototypes.',
  },
  {
    id: '02',
    repo: 'Jen-OGdl',
    type: 'Python/AI',
    tag: 'AI/ACOUSTIC',
    status: 'Shipped',
    link: 'https://github.com/JodLHarDxD/Jen-OGdl',
    img: '/media/images/projects/jen_ogdl.png',
    desc: 'An AI-powered acoustic model for synthetic audio generation, voice conversion, and high-fidelity vocal synthesis.',
  },
  {
    id: '03',
    repo: 'MediaStrip',
    type: 'Python',
    tag: 'UTILITY',
    status: 'Shipped',
    link: 'https://github.com/JodLHarDxD/MediaStrip',
    img: '/media/images/pexels/pexels_1.jpg',
    desc: 'A powerful CLI utility for batch processing, cropping, and optimizing video frames and image sequence metadata.',
  },
  {
    id: '04',
    repo: 'KariotLab',
    type: 'Python',
    tag: 'RESEARCH',
    status: 'Shipped',
    link: 'https://github.com/JodLHarDxD/KariotLab',
    img: '/media/images/pexels/pexels_2.jpg',
    desc: 'Scientific research tools and machine learning models for analyzing chromosomal anomalies and karyotype images.',
  },
  {
    id: '05',
    repo: 'JodLHarDxD-Portfolio',
    type: 'Web',
    tag: 'WEB DESIGN',
    status: 'Shipped',
    link: 'https://github.com/JodLHarDxD/JodLHarDxD-Portfolio',
    img: '/media/images/pexels/pexels_3.jpg',
    desc: 'The award-winning, high-performance portfolio website showcasing premium creative design and front-end interactions.',
  },
  {
    id: '06',
    repo: 'PhoneCam',
    type: 'C++/Python',
    tag: 'VISION',
    status: 'Shipped',
    link: 'https://github.com/JodLHarDxD/PhoneCam',
    img: '/media/images/pexels/pexels_4.jpg',
    desc: 'Low-latency real-time video streaming pipeline converting mobile devices into high-grade computer vision cameras.',
  },
  {
    id: '07',
    repo: 'auto-slash',
    type: 'JavaScript',
    tag: 'AUTOMATION',
    status: 'Shipped',
    link: 'https://github.com/JodLHarDxD/auto-slash',
    img: '/media/images/pexels/pexels_5.jpg',
    desc: 'An automated bot framework designed to automate Discord slash command inputs and interaction responses.',
  },
  {
    id: '08',
    repo: 'Atlas',
    type: 'HTML',
    tag: 'WEB DESIGN',
    status: 'Shipped',
    link: 'https://github.com/JodLHarDxD/Atlas',
    img: '/media/images/pexels/pexels_6.jpg',
    desc: 'A custom web design boilerplate focused on extreme loading speeds, typography systems, and flawless SEO semantics.',
  },
  {
    id: '09',
    repo: 'VOID',
    type: '—',
    tag: 'EXPERIMENTAL',
    status: 'Shipped',
    link: 'https://github.com/JodLHarDxD/VOID',
    img: '/media/images/pexels/pexels_7.jpg',
    desc: 'An experimental sandbox exploring abstract geometry, GLSL shaders, canvas noise, and interactive digital art.',
  },
  {
    id: '10',
    repo: 'JodLxverse',
    type: 'TypeScript',
    tag: 'THIS SITE',
    status: 'Live Build 🟢',
    link: 'https://github.com/JodLHarDxD/JodLxverse',
    img: '/media/images/pexels/pexels_8.jpg',
    desc: 'The official monorepo of the JodLxverse digital ecosystem, built with React, Vite, Framer Motion, and Tailwind.',
  },
  {
    id: '11',
    repo: 'JodLHarDxD',
    type: 'Markdown',
    tag: 'PROFILE',
    status: '—',
    link: 'https://github.com/JodLHarDxD/JodLHarDxD',
    img: '/media/images/pexels/pexels_9.jpg',
    desc: 'A clean, beautifully designed Markdown profile hub outlining open-source contributions and technical expertise.',
  },
];

export const ProjectsGrid: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [scrollActiveIndex, setScrollActiveIndex] = React.useState<number | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const rowRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const centerY = window.innerHeight / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      rowRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const rowCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenterY - centerY);

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (minDistance !== Infinity) {
        setScrollActiveIndex(closestIndex);
      }
    };

    // Run synchronously on mount to initialize the active item immediately
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    const interval = setInterval(handleScroll, 150);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const renderStyledRepoTitle = (repo: string, isActive: boolean) => {
    if (!isActive) {
      return (
        <h3
          className="font-heading text-6xl sm:text-8xl md:text-9xl font-bold tracking-normal leading-[0.9] transition-all duration-500 uppercase"
          style={{
            color: '#ffffff',
            WebkitTextStroke: '0px',
          }}
        >
          {repo}
        </h3>
      );
    }

    let part1 = '';
    let part2 = '';

    if (repo === 'create-studio') {
      part1 = 'create-';
      part2 = 'studio';
    } else if (repo === 'Jen-OGdl') {
      part1 = 'Jen-';
      part2 = 'OGdl';
    } else if (repo === 'MediaStrip') {
      part1 = 'Media';
      part2 = 'Strip';
    } else if (repo === 'KariotLab') {
      part1 = 'Kariot';
      part2 = 'Lab';
    } else if (repo === 'JodLHarDxD-Portfolio') {
      part1 = 'JodLHarDxD-';
      part2 = 'Portfolio';
    } else if (repo === 'PhoneCam') {
      part1 = 'Phone';
      part2 = 'Cam';
    } else if (repo === 'auto-slash') {
      part1 = 'auto-';
      part2 = 'slash';
    } else if (repo === 'Atlas') {
      part1 = 'At-';
      part2 = 'las';
    } else if (repo === 'VOID') {
      part1 = 'VO';
      part2 = 'ID';
    } else if (repo === 'JodLxverse') {
      part1 = 'JodL';
      part2 = 'xverse';
    } else if (repo === 'JodLHarDxD') {
      part1 = 'JodL';
      part2 = 'HarDxD';
    } else {
      const half = Math.ceil(repo.length / 2);
      part1 = repo.substring(0, half);
      part2 = repo.substring(half);
    }

    return (
      <h3 className="font-heading text-6xl sm:text-8xl md:text-9xl font-bold tracking-normal leading-[0.9] flex items-center justify-center gap-3 select-none uppercase">
        {/* Blue Bordered Font */}
        <span
          className="transition-all duration-500"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px #3b82f6',
          }}
        >
          {part1}
        </span>
        
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative px-4 py-1 inline-block text-[0.95em]"
          style={{
            color: '#0a0a0a',
            zIndex: 1,
          }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18, delay: 0.1 }}
            className="absolute inset-0 rounded-md origin-left"
            style={{
              backgroundColor: '#c8ff2d',
              zIndex: -1,
            }}
          />
          {part2}
        </motion.span>
      </h3>
    );
  };

  const activeIndex = hoveredIndex !== null ? hoveredIndex : scrollActiveIndex;

  return (
    <section className="w-full py-24 bg-bg-primary text-text-primary overflow-hidden">
      <div className="px-6 md:px-12 mb-24">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Archive</h2>
        <p className="font-mono mt-4 opacity-60">11 Repositories // Open Source</p>
      </div>

      <div className="flex flex-col border-t border-text-primary/10">
        {repos.map((repo, index) => {
          const isOdd = index % 2 === 1;
          const isActive = activeIndex === index;

          return (
            <motion.a
              key={repo.id}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              href={repo.link}
              target="_blank"
              rel="noopener noreferrer"
              initial="initial"
              whileHover="hover"
              whileInView="inView"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                initial: { opacity: 0, y: 50 },
                inView: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] } },
                hover: { opacity: 1, y: 0 },
              }}
              className="flex items-center justify-center min-h-[85vh] py-12 cursor-crosshair w-full relative group border-b border-text-primary/10 first:border-t border-text-primary/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-500"
            >
              {/* Ghost Background Text */}
              <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-700 select-none ${isActive ? 'opacity-[0.03]' : 'opacity-0'}`}>
                <span className="font-heading text-[12rem] md:text-[20rem] font-bold whitespace-nowrap">
                  {repo.repo}
                </span>
              </div>

              {/* Layout Wrapper with horizontal/vertical centering initially */}
              <div className={`relative flex items-center justify-center z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 ${isOdd ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Sliding Accordion Image Reveal Container */}
                <div
                  className={`overflow-hidden h-[150px] sm:h-[220px] md:h-[300px] lg:h-[400px] shrink-0 rounded-2xl hidden sm:block relative z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive 
                      ? `w-[220px] sm:w-[320px] md:w-[450px] lg:w-[600px] opacity-100 ${isOdd ? 'ml-12' : 'mr-12'}` 
                      : 'w-0 opacity-0 ml-0 mr-0'
                  }`}
                >
                  <img
                    src={repo.img}
                    alt={repo.repo}
                    className={`w-[220px] sm:w-[320px] md:w-[450px] lg:w-[600px] h-full object-cover transition-all duration-700 ${
                      isActive ? 'grayscale-0' : 'grayscale'
                    }`}
                  />
                </div>

                {/* Shifting Info Container - Centered initially, slides sideways on hover */}
                <motion.div
                  animate={{ x: isActive && !isMobile ? (isOdd ? -40 : 40) : 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center justify-center w-full max-w-[50rem] relative z-10"
                >
                  {/* FIG & Tag */}
                  <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-text-primary/60 dark:text-text-primary/60 uppercase mb-4 block">
                    FIG.{repo.id} — {repo.tag}
                  </span>

                  {/* High-Impact Bebas Neue Typography */}
                  {renderStyledRepoTitle(repo.repo, isActive)}

                  {/* Project Description to fill space */}
                  <p className={`mt-4 font-sans text-sm md:text-base max-w-md transition-colors duration-500 ${
                    isActive
                      ? 'text-text-primary dark:text-white'
                      : 'text-text-primary/60 dark:text-text-primary/50'
                  }`}>
                    {repo.desc}
                  </p>

                  {/* GitHub link indicator */}
                  <div className={`flex items-center gap-2 mt-6 text-xs font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? 'text-[var(--accent)]' : 'text-text-primary/40'
                  }`}>
                    <Github size={14} className={`transition-all duration-300 ${isActive ? 'scale-110 rotate-12' : ''}`} />
                    <span>Check it out on GitHub</span>
                  </div>

                  {/* Horizontal tag row */}
                  <div className="flex flex-wrap gap-3 mt-6 justify-center font-mono text-xs uppercase">
                    <span className={`px-4 py-2 text-[10px] md:text-xs tracking-[0.15em] border rounded-full transition-colors duration-500 ${
                      isActive
                        ? 'border-[var(--accent)] bg-text-primary/10 text-text-primary'
                        : 'border-text-primary/20 bg-text-primary/5 text-text-primary/70'
                    }`}>
                      {repo.type}
                    </span>
                    <div className="flex items-center gap-2 px-4 py-2 border border-text-primary/10 rounded-full bg-text-primary/5">
                      {repo.status.includes('Live Build') && (
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      )}
                      <span className="opacity-70 text-[10px] md:text-xs tracking-[0.15em]">{repo.status.replace(' 🟢', '')}</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
};
