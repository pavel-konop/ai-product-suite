'use client';

import { Moon } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <button className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all">
        <Moon className="w-5 h-5 text-slate-300" />
      </button>
    );
  }

  return <ThemeToggleInner />;
}

function ThemeToggleInner() {
  const { theme, toggleTheme, isEasternPeak } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-slate-800 eastern-peak:hover:bg-gray-100"
      title={isEasternPeak ? 'Switch to Dark Mode' : 'Switch to Eastern Peak Mode'}
    >
      {isEasternPeak ? (
        // Eastern Peak Logo with Text in Light Mode
        <div className="flex items-center gap-2">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 hover:scale-105"
          >
            {/* Mountain/Peak shape - Eastern Peak green */}
            <path 
              d="M20 4L6 36H15L20 20L25 36H34L20 4Z" 
              fill="#00C853"
            />
            {/* Inner peak detail */}
            <path 
              d="M20 14L13 32H18L20 24L22 32H27L20 14Z" 
              fill="#00B248"
            />
          </svg>
          <span className="font-bold text-sm tracking-tight" style={{ color: '#0A1628' }}>
            <span style={{ color: '#00C853' }}>EASTERN</span>{' '}
            <span style={{ color: '#0A1628' }}>Peak</span>
          </span>
        </div>
      ) : (
        // Moon icon for Dark Mode
        <Moon className="w-5 h-5 text-slate-300" />
      )}
    </button>
  );
}
