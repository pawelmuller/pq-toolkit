'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FaCog, FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeSwitch(): JSX.Element {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center h-8 w-8 md:w-9 md:h-9 rounded-full cursor-pointer"
        role="button"
      >
        <div className="relative w-7 h-7 md:w-9 md:h-9">
          <FaCog
            aria-label="cog-icon"
            className={`absolute h-7 w-7 md:h-9 md:w-9 transition-opacity duration-500 ease-in-out text-blue-400 dark:text-blue-500 transform ${
              hovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}
          />
        </div>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className="flex items-center justify-center h-8 w-8 md:w-9 md:h-9 rounded-full cursor-pointer"
      role="button"
      onClick={() => {
        setTheme(isDark ? 'light' : 'dark');
      }}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div className="relative w-7 h-7 md:w-9 md:h-9">
        <FaCog
          aria-label="cog-icon"
          className={`absolute h-7 w-7 md:h-9 md:w-9 transition-opacity duration-500 ease-in-out text-blue-400 dark:text-blue-500 transform ${
            hovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
        />
        <FaSun
          aria-label="sun-icon"
          className={`absolute h-7 w-7 md:h-9 md:w-9 transition-all duration-300 ease-in-out text-pink-500 dark:text-pink-600 transform ${
            isDark && hovered
              ? 'opacity-100 scale-100 rotate-0'
              : 'opacity-0 scale-0 -rotate-180'
          }`}
        />
        <FaMoon
          aria-label="moon-icon"
          className={`absolute h-7 w-7 md:h-9 md:w-9 transition-all duration-300 ease-in-out text-pink-500 dark:text-pink-600 transform ${
            !isDark && hovered
              ? 'opacity-100 scale-100 rotate-0'
              : 'opacity-0 scale-0 -rotate-180'
          }`}
        />
      </div>
    </div>
  );
}
