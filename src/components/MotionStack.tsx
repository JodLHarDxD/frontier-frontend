import React from 'react';

const services = [
  { name: 'Cursor reveals', secret: 'preview cards, masked text, moving media' },
  { name: 'Page changes', secret: 'slanted wipes, staggered links, scroll landings' },
  { name: 'Project motion', secret: 'rotating entries, hover video, soft parallax' },
  { name: 'Text rhythm', secret: 'line masks, delayed words, editorial pacing' },
];

export const MotionStack: React.FC = () => {
  return (
    <section id="motion" className="w-full px-6 md:px-24 py-24 bg-bg-primary text-text-primary">
      <div className="flex justify-between items-end mb-12 border-b border-border pb-6">
        <p className="font-mono text-sm uppercase tracking-widest opacity-50">02 // Motion Stack</p>
        <span className="font-mono text-xs opacity-50">Hover the rows</span>
      </div>

      <div className="flex flex-col">
        {services.map((service, i) => (
          <div
            key={i}
            className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-none px-4 -mx-4"
            data-cursor="view"
          >
            <h3 className="text-3xl md:text-5xl font-serif italic group-hover:text-mint transition-colors duration-300">
              {service.name}
            </h3>
            <span className="font-mono text-sm text-text-secondary mt-4 md:mt-0 opacity-0 md:-translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              {service.secret}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
