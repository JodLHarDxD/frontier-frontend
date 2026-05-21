import React, { useState, useEffect } from 'react';
import { Terminal, GitBranch, Server } from 'lucide-react';

export const TerminalScene: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullCommand = 'curl -X GET https://api.jodl.dev/v1/status';

  useEffect(() => {
    // Typewriter effect
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullCommand.length) {
        setTypedText(fullCommand.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-bg-primary text-text-primary border-t border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Terminal Window */}
        <div className="rounded-xl border border-text-primary/10 bg-[#F3F3F1] dark:bg-[#0A0A0A] text-text-secondary dark:text-[#A9B4B0] font-mono text-sm overflow-hidden shadow-2xl transition-colors duration-400">
          <div className="flex items-center px-4 py-2 border-b border-text-primary/10 bg-[#EAEAEA] dark:bg-[#111] transition-colors duration-400">
            <Terminal size={16} className="mr-2 opacity-50 text-text-primary" />
            <span className="opacity-50 text-xs uppercase tracking-widest text-text-primary">Live Terminal</span>
          </div>
          <div className="p-6">
            <div className="flex mb-4">
              <span className="text-mint mr-2">➜</span>
              <span className="text-blue-600 dark:text-blue-400 mr-2">~</span>
              <span className="text-text-primary dark:text-white">{typedText}</span>
              <span className="w-2 h-4 bg-text-primary/50 dark:bg-white/50 animate-pulse ml-1 inline-block" />
            </div>

            {typedText === fullCommand && (
              <div className="animate-fade-in text-xs leading-relaxed space-y-2 text-text-secondary dark:text-[#888]">
                <p>HTTP/2 200 OK</p>
                <p>content-type: application/json</p>
                <p className="text-text-primary dark:text-[#A9B4B0] mt-4">
                  {`{`}
                  <br />
                  &nbsp;&nbsp;"status": "online",
                  <br />
                  &nbsp;&nbsp;"uptime": "99.99%",
                  <br />
                  &nbsp;&nbsp;"latest_deploy": "a1b2c3d",
                  <br />
                  &nbsp;&nbsp;"location": "Earth"
                  <br />
                  {`}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Proof Feed */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h3 className="text-3xl font-serif italic mb-4">Live Proof.</h3>
            <p className="text-text-secondary">
              Real data from the production environment. We don't just design, we ship continuously.
            </p>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 border border-border rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors"
              data-cursor="view"
            >
              <div className="flex items-center gap-4">
                <GitBranch size={20} className="text-text-secondary" />
                <div>
                  <p className="font-medium">feat: implement WebGL cursor</p>
                  <p className="text-xs font-mono text-text-secondary mt-1">commit a1b2c3d • 2 hours ago</p>
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-between p-4 border border-border rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors"
              data-cursor="view"
            >
              <div className="flex items-center gap-4">
                <Server size={20} className="text-text-secondary" />
                <div>
                  <p className="font-medium">Production Cluster</p>
                  <p className="text-xs font-mono text-text-secondary mt-1">Uptime: 99.99% • Latency: 12ms</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
