import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GifWord } from './GifWord';
import { HighlightLine } from './HighlightLine';

const services = [
  {
    title: 'AI Architecture',
    description: 'Designing intelligent systems that learn and adapt.',
    image: '/media/images/pexels/pexels_1.jpg',
    hasGif: true,
  },
  {
    title: 'Full-Stack',
    description: 'End-to-end development from database to DOM.',
    image: '/media/images/pexels/pexels_3.jpg',
    hasGif: false,
  },
  {
    title: 'UI/UX',
    description: 'Crafting interfaces that feel kinetic and alive.',
    image: '/media/images/pexels/pexels_4.jpg',
    hasGif: false,
  },
  {
    title: 'Systems',
    description: 'Scalable infrastructure for the modern web.',
    image: '/media/images/pexels/pexels_5.jpg',
    hasGif: false,
  },
];

export const Services: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollActiveIndex, setScrollActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
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

  const activeIndex = hoveredIndex !== null ? hoveredIndex : scrollActiveIndex;

  const renderStyledTitle = (title: string, isActive: boolean) => {
    if (!isActive) {
      return (
        <h3
          className="text-4xl md:text-6xl font-bold tracking-tight transition-all duration-500"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px #3b82f6',
          }}
        >
          {title}
        </h3>
      );
    }

    let part1 = '';
    let part2 = '';

    if (title === 'AI Architecture') {
      part1 = 'AI';
      part2 = 'Architecture';
    } else if (title === 'Full-Stack') {
      part1 = 'Full-';
      part2 = 'Stack';
    } else if (title === 'UI/UX') {
      part1 = 'UI/';
      part2 = 'UX';
    } else if (title === 'Systems') {
      part1 = 'Sys-';
      part2 = 'tems';
    } else {
      const words = title.split(' ');
      part1 = words[0] || '';
      part2 = words.slice(1).join(' ') || '';
    }

    return (
      <h3 className="text-4xl md:text-6xl font-bold tracking-tight flex items-center gap-3 select-none">
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
          className="relative px-3 py-1 inline-block"
          style={{
            color: '#0a0a0a',
            zIndex: 1,
          }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18, delay: 0.1 }}
            className="absolute inset-0 rounded-sm origin-left"
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

  const renderServiceRow = (service: (typeof services)[0], index: number) => (
    <div
      key={index}
      ref={(el) => {
        rowRefs.current[index] = el;
      }}
      className="group relative flex items-center justify-center py-16 border-b border-text-primary/10 transition-colors duration-500"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Ghost BG Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: activeIndex === index ? 0.05 : 0, y: activeIndex === index ? 0 : 20 }}
          className="text-[12vw] font-bold text-text-primary whitespace-nowrap leading-none tracking-tighter"
        >
          {service.title.toUpperCase()}
        </motion.h2>
      </div>

      {/* Main Content - Centered initially, shifts left on hover */}
      <motion.div
        animate={{
          x: activeIndex === index && !isMobile ? '-28vw' : '0px',
          y: activeIndex === index ? '0px' : (isMobile ? '0px' : '-1.5rem'),
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        className="relative z-10 flex items-center gap-6"
      >
        <span
          className="font-mono text-sm tracking-widest text-text-secondary group-hover:text-[var(--accent)]"
        >
          0{index + 1}
        </span>
        {renderStyledTitle(service.title, activeIndex === index)}
      </motion.div>

      {/* Description - Centered below initially, slides right and aligns vertically on hover */}
      <motion.div
        initial={{ opacity: 0.8, x: '0px', y: '3.5rem' }}
        animate={{
          opacity: 1,
          x: activeIndex === index && !isMobile ? '28vw' : '0px',
          y: activeIndex === index && !isMobile ? '0px' : '3.5rem',
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        className="absolute z-10 text-center w-[250px] lg:w-[320px] hidden md:block pointer-events-none"
      >
        <p
          className="text-xl md:text-2xl font-serif italic text-text-secondary group-hover:text-text-primary transition-colors duration-500"
        >
          {service.hasGif ? (
            <HighlightLine color="#3b82f6">
              Designing{' '}
              <GifWord
                word="intelligence"
                gifUrl="/media/gifs/services_intelligence.gif"
              />{' '}
              that learns.
            </HighlightLine>
          ) : (
            service.description
          )}
        </p>
      </motion.div>

      {/* Accent blue dot */}
      <div
        className="w-3 h-3 rounded-full bg-[var(--accent)] transition-opacity duration-300 absolute right-0 top-1/2 -translate-y-1/2"
        style={{ opacity: activeIndex === index && !isMobile ? 1 : 0 }}
      />

      {/* Hover Image Reveal */}
      <motion.img
        src={service.image}
        alt={service.title}
        initial={{ opacity: 0, scale: 0.8, x: 50, rotate: -5 }}
        animate={{
          opacity: activeIndex === index && !isMobile ? 1 : 0,
          scale: activeIndex === index && !isMobile ? 1 : 0.8,
          x: activeIndex === index && !isMobile ? 0 : 50,
          rotate: activeIndex === index && !isMobile ? 0 : -5,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="absolute z-20 w-[300px] h-[200px] object-cover rounded-xl pointer-events-none hidden md:block"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: '-150px',
          marginTop: '-100px',
        }}
      />
    </div>
  );

  return (
    <section
      className="relative w-full min-h-screen py-32 px-6 md:px-24 bg-bg-primary text-text-primary border-t border-text-primary/10 transition-colors duration-400 cursor-default"
    >
      <div className="relative z-10 flex flex-col">
        <div className="mb-20">
          <p className="font-mono text-sm uppercase tracking-widest text-text-secondary mb-4">Capabilities</p>
          <h2 className="text-5xl font-bold text-text-primary tracking-tighter">Systems & Design</h2>
        </div>

        <div className="flex flex-col">{services.map((service, idx) => renderServiceRow(service, idx))}</div>
      </div>
    </section>
  );
};
