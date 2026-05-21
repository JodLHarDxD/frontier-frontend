import React, { useState, useEffect, useRef } from 'react';
import { CustomCursor } from './CustomCursor';
import { SmoothScroll } from './SmoothScroll';
import { PageTransition } from './PageTransition';
import { ScrollNavigator } from './ScrollNavigator';
import { NextPageBridge } from './NextPageBridge';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Tone from 'tone';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const synthRef = React.useRef<Tone.PolySynth | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const transitioning = useRef(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Initialize synthesizers
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    synthRef.current.volume.value = -20;

    // Initialize background music
    const audio = new Audio('/media/audio/music_git_city.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Comfortable moderate background volume
    audioRef.current = audio;

    return () => {
      synthRef.current?.dispose();
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Global Scroll Proximity Highlight Controller
  useEffect(() => {
    const handleScrollHighlight = () => {
      const centerY = window.innerHeight / 2;
      const elements = document.querySelectorAll('.scroll-highlight');

      let closestEl: Element | null = null;
      let minDistance = Infinity;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenterY = rect.top + rect.height / 2;
        const dist = Math.abs(elCenterY - centerY);

        // Check if element is in viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (dist < minDistance) {
            minDistance = dist;
            closestEl = el;
          }
        }
      });

      elements.forEach((el) => {
        // Highly visible highlighting when within 160px from vertical center of viewport
        if (el === closestEl && minDistance < 160) {
          el.classList.add('active-highlight');
        } else {
          el.classList.remove('active-highlight');
        }
      });
    };

    handleScrollHighlight();

    window.addEventListener('scroll', handleScrollHighlight, { passive: true });
    window.addEventListener('resize', handleScrollHighlight, { passive: true });

    // Set a recurring check to catch any dynamic content shifts or initial layout loads
    const interval = setInterval(handleScrollHighlight, 400);

    return () => {
      window.removeEventListener('scroll', handleScrollHighlight);
      window.removeEventListener('resize', handleScrollHighlight);
      clearInterval(interval);
    };
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (path === location.pathname || transitioning.current) return;
    transitioning.current = true;
    window.dispatchEvent(new CustomEvent('pageFlipTransition', { detail: { targetPath: path } }));
    setTimeout(() => navigate(path), 900);
    setTimeout(() => { transitioning.current = false; }, 3300);
  };

  const toggleTheme = () => setIsDark(!isDark);

  const toggleMute = async () => {
    if (isMuted) {
      await Tone.start();
      synthRef.current?.triggerAttackRelease(['C4', 'E4', 'G4'], '8n');
      audioRef.current?.play().catch((e) => console.warn('Background audio playback postponed:', e));
    } else {
      audioRef.current?.pause();
    }
    setIsMuted(!isMuted);
  };

  const playClick = () => {
    if (!isMuted && synthRef.current) {
      synthRef.current.triggerAttackRelease('C5', '32n', '+0', 0.1);
    }
  };

  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Lab', path: '/lab' },
    { name: 'Motion', path: '/motion' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <SmoothScroll>
      <div className="noise-overlay" />
      <CustomCursor />
      <PageTransition />
      <ScrollNavigator />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
        <Link
          to="/"
          className="flex items-center gap-2"
          onMouseEnter={playClick}
          data-cursor="home"
          onClick={(e) => handleNavClick(e, '/')}
        >
          <span className="font-serif italic text-xl tracking-tight">JODLX.</span>
          <img src="/media/logos/jodl_logo.png" alt="JODL" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm uppercase tracking-widest hover:text-mint transition-colors ${location.pathname === link.path ? 'text-mint' : ''}`}
              onMouseEnter={playClick}
              data-cursor={link.name.toLowerCase()}
              onClick={(e) => handleNavClick(e, link.path)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <Link
            to="/contact"
            className="text-sm uppercase tracking-widest hidden md:block hover:text-mint transition-colors"
            data-cursor="talk"
            onMouseEnter={playClick}
            onClick={(e) => handleNavClick(e, '/contact')}
          >
            Let's Talk
          </Link>
          <button
            onClick={toggleMute}
            onMouseEnter={playClick}
            className="hover:text-mint transition-colors"
            data-cursor="audio"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button
            onClick={toggleTheme}
            onMouseEnter={playClick}
            className="hover:text-mint transition-colors"
            data-cursor="theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white font-mono text-xs uppercase tracking-widest pointer-events-none">
        <span>Design / Motion / Web</span>
        <span>IST {time}</span>
      </nav>

      {/* Main Content */}
      <main className="w-full min-h-screen relative z-10 text-text-primary bg-bg-primary">
        {children}
        <NextPageBridge />
      </main>
    </SmoothScroll>
  );
};
