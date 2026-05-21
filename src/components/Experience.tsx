import React from 'react';
import { motion } from 'framer-motion';

const milestones = [
  {
    year: '2026',
    title: 'Architecting JodLxverse',
    description: 'Building the ultimate multi-page portfolio blending motion, webGL, and cinematic experiences.',
    active: true,
  },
  {
    year: '2025',
    title: 'create-studio & AI Systems',
    description: 'Pioneered acoustic AI models (Jen-OGdl) and full-stack development tools.',
    active: true,
  },
  {
    year: '2024',
    title: 'Advanced Web Experiences',
    description: 'Developed Site 2 (Kinetic) and Site 3 (Dark), pushing the limits of React and GSAP.',
    active: false,
  },
  {
    year: '2023',
    title: 'Computer Vision & Automation',
    description: 'Built PhoneCam and auto-slash, mastering C++, Python, and JS automation.',
    active: false,
  },
  {
    year: '2022',
    title: 'Foundations & Tooling',
    description: 'Created MediaStrip and KariotLab. Focused on utility and research platforms.',
    active: false,
  },
  {
    year: '2021',
    title: 'The Beginning',
    description: 'Started the journey into code, design, and continuous shipping.',
    active: false,
  },
];

export const Experience: React.FC = () => {
  return (
    <section className="w-full py-32 px-6 md:px-12 bg-bg-primary text-text-primary overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-5xl md:text-8xl font-sans tracking-tighter uppercase mb-6">
            Every commit, <br />
            <span className="text-mint font-serif italic lowercase tracking-normal">
              a{' '}
              <span data-cursor="gif" className="relative z-10 hover:text-accent transition-colors cursor-pointer">
                proof
              </span>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-3 md:left-[24.5%] top-0 bottom-0 w-px bg-border hidden md:block"></div>

          {milestones.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start group"
            >
              {/* Year */}
              <div className="md:col-span-3 flex md:justify-end items-center gap-4">
                <span className="font-mono text-xl md:text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                  {item.year}
                </span>
                {/* Node */}
                <div className="relative flex items-center justify-center w-6 h-6 z-10 md:-mr-3 bg-bg-primary rounded-full">
                  <div
                    className={`w-3 h-3 rounded-full ${item.active ? 'bg-mint' : 'bg-border'} transition-colors duration-500`}
                  ></div>
                  {item.active && <div className="absolute inset-0 rounded-full bg-mint opacity-40 animate-ping"></div>}
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-8 md:col-start-5 pl-8 md:pl-0 border-l border-border md:border-l-0 pb-8 md:pb-0">
                <h3 className="text-2xl md:text-4xl font-bold mb-3">{item.title}</h3>
                <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
