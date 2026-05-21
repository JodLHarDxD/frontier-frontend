import React from 'react';
import { motion } from 'framer-motion';

const letters = ['J', 'O', 'D', 'L', 'X', '.'];

export const Preloader: React.FC = () => {
  return (
    <motion.div
      key="preloader"
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-bg-primary overflow-hidden"
    >
      {/* The Brand Mark — 5-second cartoon anime choreography */}
      <div className="flex items-end select-none relative" style={{ perspective: '800px' }}>
        {letters.map((char, i) => {
          const isDot = char === '.';
          const baseDelay = i * 0.25; // Slow stagger — 250ms between each letter

          return (
            <motion.span
              key={i}
              className="font-heading font-bold uppercase inline-block origin-bottom"
              style={{
                fontSize: isDot ? 'clamp(2.5rem, 8vw, 5rem)' : 'clamp(3.5rem, 12vw, 8rem)',
                lineHeight: 1,
                display: 'inline-block',
                color: 'var(--text-primary)',
              }}
              // =============================================
              // ACT 1: Cartoon bounce-in (0s → 2.5s)
              // Each letter drops from above with elastic
              // overshoot, squash-and-stretch, and wobble
              // =============================================
              initial={{
                opacity: 0,
                y: -200,
                scaleY: 1,
                scaleX: 1,
                rotate: isDot ? 0 : (i % 2 === 0 ? -25 : 25),
              }}
              animate={{
                opacity: [0, 1, 1, 1, 1, 1],
                // Drop → overshoot down → squash → bounce up → settle
                y: [
                  -200,    // start high above
                  15,      // overshoot past baseline (cartoon slam)
                  -30,     // bounce back up
                  8,       // small secondary bounce
                  -5,      // tiny wobble
                  0,       // settle
                ],
                // Squash and stretch
                scaleY: [
                  0.6,     // stretched tall while falling
                  1.35,    // squash flat on impact
                  0.85,    // stretch on bounce-up
                  1.12,    // mild squash on second land
                  0.95,    // tiny stretch
                  1,       // settle
                ],
                scaleX: [
                  1.2,     // wide while falling (stretch)
                  0.7,     // narrow on impact (squash)
                  1.1,     // wide on bounce
                  0.92,    // narrow on second land
                  1.03,    // tiny wide
                  1,       // settle
                ],
                // Tilt correction
                rotate: [
                  isDot ? 0 : (i % 2 === 0 ? -25 : 25),
                  isDot ? 0 : (i % 2 === 0 ? 8 : -8),
                  isDot ? 0 : (i % 2 === 0 ? -4 : 4),
                  isDot ? 0 : 2,
                  isDot ? 0 : -1,
                  0,
                ],
              }}
              transition={{
                duration: 1.2,
                delay: baseDelay,
                ease: [0.22, 1.2, 0.36, 1], // Exaggerated overshoot easing
                times: [0, 0.35, 0.55, 0.72, 0.88, 1],
              }}
            >
              {/* =============================================
                  ACT 2: Mexican Wave Jump (2.5s → 3.5s)
                  After all letters land, they do a playful
                  hop in sequence like a crowd wave
                  ============================================= */}
              <motion.span
                className="inline-block"
                animate={{
                  y: [0, -25, 0, -8, 0],
                  scaleY: [1, 0.9, 1.15, 0.95, 1],
                  scaleX: [1, 1.1, 0.9, 1.05, 1],
                }}
                transition={{
                  duration: 0.6,
                  delay: letters.length * 0.25 + 0.8 + i * 0.1, // Starts after Act 1 + gap
                  ease: [0.34, 1.56, 0.64, 1], // Springy overshoot
                  times: [0, 0.3, 0.55, 0.78, 1],
                }}
                style={{ display: 'inline-block' }}
              >
                {/* =============================================
                    ACT 3: Neon Sheen Sweep (3.8s → 4.8s)
                    Gradient text fill sweeps a lime highlight
                    across each letter as the finale stamp
                    ============================================= */}
                <motion.span
                  className="inline-block"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--text-primary) 0%, var(--text-primary) 38%, #c8ff2d 50%, var(--text-primary) 62%, var(--text-primary) 100%)',
                    backgroundSize: '250% auto',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                  animate={{
                    backgroundPosition: ['250% center', '-250% center'],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: letters.length * 0.25 + 2.0, // After wave
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {char}
                </motion.span>
              </motion.span>
            </motion.span>
          );
        })}
      </div>

      {/* The "." gets a special extra bounce — like a rubber ball */}
      {/* (Already handled in the main loop with isDot checks) */}

      {/* Underline sweeps in after the wave */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.3 }}
        transition={{
          delay: letters.length * 0.25 + 1.6,
          duration: 0.8,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="mt-6 origin-center"
        style={{ width: 'clamp(200px, 50vw, 500px)' }}
      >
        <div
          className="h-[1px] w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--text-primary), transparent)',
          }}
        />
      </motion.div>

      {/* Tagline bounces in with cartoon spring */}
      <motion.p
        className="mt-5 font-mono text-[10px] uppercase tracking-[0.35em] text-text-primary/30"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: letters.length * 0.25 + 2.0,
          duration: 0.5,
          type: 'spring',
          stiffness: 200,
          damping: 12,
        }}
      >
        Cinematic Engineering
      </motion.p>
    </motion.div>
  );
};
