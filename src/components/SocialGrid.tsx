import React from 'react';
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

export const SocialGrid: React.FC = () => {
  return (
    <section className="w-full py-24 px-6 md:px-12 border-t border-border bg-bg-primary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-sans tracking-tighter mb-12">Elsewhere</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-6 border border-border rounded-xl hover:border-mint hover:bg-mint/5 transition-all duration-300"
            >
              <span className="text-xl font-medium text-text-secondary group-hover:text-mint transition-colors">
                {social.name}
              </span>
              <ExternalLink
                size={20}
                className="text-text-secondary opacity-50 group-hover:opacity-100 group-hover:text-mint transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
